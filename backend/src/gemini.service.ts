import { Injectable, Logger } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface PatientInput {
  height: number;
  weight: number;
  bmi: number;
  fitness_experience: 'beginner' | 'intermediate' | 'advanced';
  therapy_cause: string;
  goal: string;
  accuracy_rate: number;
  activation_rate: number;
}

export interface SessionReport {
  summary: string;
  goal_status: 'achieved' | 'progress' | 'not achieved';
  performance_grade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';
  metrics_analysis: {
    accuracy_rate: number;
    activation_rate: number;
    consistency_score: number;
    effort_index: number;
    insight: string;
    detailed_breakdown: {
      accuracy_interpretation: string;
      activation_interpretation: string;
      coordination_assessment: string;
      fatigue_indicators: string;
    };
  };
  patient_factors: {
    height: number;
    weight: number;
    bmi: number;
    bmi_category: string;
    fitness_experience: string;
    cause: string;
    risk_factors: string[];
    recovery_potential: string;
  };
  adaptive_plan: {
    type: 'strong' | 'lazy' | 'normal';
    intensity_level: 'high' | 'moderate' | 'low';
    action: string;
    progression_timeline: string;
    exercise_modifications: string[];
    precautions: string[];
  };
  clinical_insights: {
    movement_quality: string;
    compensation_patterns: string;
    pain_probability: string;
    functional_capacity: string;
  };
  psychological_factors: {
    motivation_level: string;
    compliance_prediction: string;
    mental_barriers: string[];
    encouragement_strategy: string;
  };
  recommendations: {
    immediate_actions: string[];
    short_term_goals: string[];
    long_term_goals: string[];
    lifestyle_modifications: string[];
  };
  next_session_focus: string[];
  red_flags: string[];
  progress_indicators: {
    positive_signs: string[];
    areas_of_concern: string[];
    expected_improvements: string[];
  };
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI | null;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.warn('⚠️  GEMINI_API_KEY not found in environment variables');
      this.logger.warn('   Session report generation will be disabled until API key is set');
      this.logger.warn('   Please set GEMINI_API_KEY in your .env file');
      this.genAI = null;
    } else {
      if (apiKey.length < 20) {
        this.logger.warn('⚠️  GEMINI_API_KEY appears to be invalid (too short)');
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.logger.log('✅ GeminiService initialized with API key');
      this.logger.log(`   API Key preview: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}`);
      this.logger.warn('⚠️  Note: If you get 404 errors, your API key may need model access enabled');
      this.logger.warn('   Visit: https://aistudio.google.com/app/apikey to regenerate or check permissions');
    }
  }

  async generateSessionReport(input: PatientInput): Promise<SessionReport> {
    if (!this.genAI) {
      throw new Error('GEMINI_API_KEY is not configured. Please set it in your .env file and restart the server.');
    }

    const prompt = this.buildAdvancedPrompt(input);

    try {
      // Try models in order of preference
      const modelsToTry = [
          'gemini-2.5-flash',           // ✅ This is what your API key has!
          'gemini-2.0-flash-exp',       
          'gemini-1.5-flash',           // Fallbacks
          'gemini-1.5-pro',
          'gemini-pro'
        ];

      let result;
      let lastError: any = null;
      const triedModels: string[] = [];
      
      for (const modelName of modelsToTry) {
        try {
          this.logger.log(`🔍 Attempting to use model: ${modelName}`);
          triedModels.push(modelName);
          const model = this.genAI.getGenerativeModel({ model: modelName });
          result = await model.generateContent(prompt);
          this.logger.log(`✅ Successfully used model: ${modelName}`);
          break;
        } catch (modelError: any) {
          lastError = modelError;
          const errorMsg = modelError?.message || String(modelError);
          const shortMsg = errorMsg.substring(0, 200);
          this.logger.warn(`❌ Model ${modelName} failed: ${shortMsg}`);
        }
      }
      
      if (!result) {
        const apiKey = process.env.GEMINI_API_KEY;
        const apiKeyPreview = apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'not set';
        
        const is404 = lastError?.message?.includes('404') || lastError?.message?.includes('not found');
        const is403 = lastError?.message?.includes('403') || lastError?.message?.includes('unauthorized');
        const is400 = lastError?.message?.includes('400') || lastError?.message?.includes('invalid');
        
        let helpMessage = '\n\n🔧 TROUBLESHOOTING STEPS:\n\n';
        
        if (is404) {
          helpMessage += '   ⚠️  Your API key cannot access any Gemini models (404 errors).\n\n';
          helpMessage += '   This is the MOST COMMON issue with new API keys.\n\n';
          helpMessage += '   SOLUTION:\n';
          helpMessage += '   1. Go to: https://aistudio.google.com/app/apikey\n';
          helpMessage += '   2. DELETE your current API key\n';
          helpMessage += '   3. Click "Create API key" to generate a NEW one\n';
          helpMessage += '   4. Copy the new key to backend/.env as GEMINI_API_KEY=<your_key>\n';
          helpMessage += '   5. Make sure there are NO quotes around the key\n';
          helpMessage += '   6. Restart your server completely (Ctrl+C then restart)\n\n';
          helpMessage += '   Note: Brand new keys from AI Studio get automatic model access.\n';
        } else if (is403) {
          helpMessage += '   ⚠️  Authentication failed (403 error).\n\n';
          helpMessage += '   1. Check that your API key is correctly set in .env\n';
          helpMessage += '   2. Make sure there are no extra spaces or quotes\n';
          helpMessage += '   3. Regenerate at: https://aistudio.google.com/app/apikey\n';
        } else if (is400) {
          helpMessage += '   ⚠️  Bad request (400 error).\n\n';
          helpMessage += '   This might be a regional restriction or API limitation.\n';
          helpMessage += '   1. Check if Gemini API is available in your region\n';
          helpMessage += '   2. Try creating a new API key at: https://aistudio.google.com/app/apikey\n';
        }
        
        helpMessage += `\n📋 Models tried: ${triedModels.join(', ')}\n`;
        helpMessage += `🔑 API Key preview: ${apiKeyPreview}\n`;
        helpMessage += `\n❌ Last error: ${lastError?.message?.substring(0, 300) || 'Unknown error'}\n`;
        
        throw new Error(
          `❌ All Gemini models failed to generate content.${helpMessage}`
        );
      }

      const response = result.response;
      const text = response.text();

      this.logger.debug('Raw AI response:', text.substring(0, 500));

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      let report: SessionReport = JSON.parse(jsonMatch[0]);

      // Auto-fix critical missing fields
      report = this.fixAndEnhanceReport(report, input);

      // Validate response structure
      this.validateAdvancedReport(report);

      this.logger.log('✅ Successfully generated advanced session report');
      return report;
    } catch (error) {
      const errorMsg = error?.message || String(error);
      this.logger.error('❌ Error generating session report:', errorMsg);
      
      throw new Error(`Failed to generate session report: ${errorMsg}`);
    }
  }

  private fixAndEnhanceReport(report: SessionReport, input: PatientInput): SessionReport {
    const isAchieved = input.accuracy_rate > 75 && input.activation_rate > 70;
    const isAdvanced = input.fitness_experience === 'advanced';

    // Fix adaptive_plan if missing
    if (!report.adaptive_plan || !report.adaptive_plan.type) {
      let type: 'strong' | 'lazy' | 'normal';
      let intensityLevel: 'high' | 'moderate' | 'low';
      let action: string;

      if (isAchieved) {
        type = 'normal';
        intensityLevel = 'moderate';
        action = 'Maintain current routine with progressive overload. Gradually increase difficulty by 5-10% weekly.';
      } else if (isAdvanced) {
        type = 'strong';
        intensityLevel = 'high';
        action = 'Intensify training with advanced variations. Focus on challenging compound movements and increased volume.';
      } else {
        type = 'lazy';
        intensityLevel = 'low';
        action = 'Implement graduated approach. Break goal into micro-milestones with achievable daily targets.';
      }

      if (!report.adaptive_plan) {
        report.adaptive_plan = {
          type,
          intensity_level: intensityLevel,
          action,
          progression_timeline: '4-6 weeks for measurable improvement',
          exercise_modifications: ['Adjust based on pain levels', 'Monitor fatigue'],
          precautions: ['Avoid overexertion', 'Rest adequately between sessions']
        };
      } else {
        report.adaptive_plan.type = type;
        report.adaptive_plan.intensity_level = intensityLevel || 'moderate';
        if (!report.adaptive_plan.action) report.adaptive_plan.action = action;
      }
    }

    // Fix performance_grade if missing
    if (!report.performance_grade) {
      const avgScore = (input.accuracy_rate + input.activation_rate) / 2;
      if (avgScore >= 90) report.performance_grade = 'A+';
      else if (avgScore >= 85) report.performance_grade = 'A';
      else if (avgScore >= 75) report.performance_grade = 'B+';
      else if (avgScore >= 65) report.performance_grade = 'B';
      else if (avgScore >= 55) report.performance_grade = 'C';
      else if (avgScore >= 45) report.performance_grade = 'D';
      else report.performance_grade = 'F';
    }

    return report;
  }

  private buildAdvancedPrompt(input: PatientInput): string {
    const bmiCategory = this.getBMICategory(input.bmi);
    
    return `You are an expert physiotherapy AI assistant with deep knowledge in rehabilitation medicine, biomechanics, and sports science. Generate a comprehensive, clinically-informed JSON session report.

PATIENT PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Physical Metrics:
  • Height: ${input.height} cm
  • Weight: ${input.weight} kg
  • BMI: ${input.bmi} (${bmiCategory})
  • Fitness Level: ${input.fitness_experience}

Clinical Context:
  • Therapy Indication: ${input.therapy_cause}
  • Treatment Goal: ${input.goal}

Session Performance:
  • Movement Accuracy: ${input.accuracy_rate}%
  • Muscle Activation: ${input.activation_rate}%

ANALYSIS REQUIREMENTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You must provide ADVANCED CLINICAL ANALYSIS including:

1. BIOMECHANICAL ASSESSMENT
   - Analyze movement quality and neuromuscular control
   - Identify compensation patterns or asymmetries
   - Evaluate proprioceptive awareness and motor control

2. PERFORMANCE METRICS INTERPRETATION
   - Calculate consistency score (variability in performance)
   - Determine effort index (relationship between accuracy and activation)
   - Assess fatigue indicators and endurance capacity

3. CLINICAL REASONING
   - Evaluate functional movement patterns
   - Predict pain probability based on metrics
   - Assess recovery trajectory and healing phase
   - Identify risk factors for re-injury

4. PSYCHOLOGICAL ASSESSMENT
   - Gauge motivation and compliance likelihood
   - Identify mental barriers to recovery
   - Suggest personalized encouragement strategies

5. EVIDENCE-BASED RECOMMENDATIONS
   - Immediate corrective actions
   - Short-term achievable goals (1-2 weeks)
   - Long-term rehabilitation objectives (4-12 weeks)
   - Lifestyle and ergonomic modifications

6. ADAPTIVE PROGRAMMING
   - Customize intensity based on patient factors
   - Provide specific exercise progressions/regressions
   - Include safety precautions and contraindications
   - Define realistic progression timeline

CRITICAL JSON FORMAT (STRICT COMPLIANCE REQUIRED):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

{
  "summary": "Comprehensive 100-150 word clinical summary synthesizing all findings",
  
  "goal_status": "achieved" OR "progress" OR "not achieved",
  
  "performance_grade": "A+" OR "A" OR "B+" OR "B" OR "C" OR "D" OR "F",
  
  "metrics_analysis": {
    "accuracy_rate": ${input.accuracy_rate},
    "activation_rate": ${input.activation_rate},
    "consistency_score": <calculated 0-100>,
    "effort_index": <calculated 0-100>,
    "insight": "Deep clinical interpretation of the metrics relationship",
    "detailed_breakdown": {
      "accuracy_interpretation": "What accuracy rate reveals about motor control and learning",
      "activation_interpretation": "What activation reveals about muscle engagement and fatigue",
      "coordination_assessment": "Quality of neuromuscular coordination",
      "fatigue_indicators": "Signs of fatigue or overexertion"
    }
  },
  
  "patient_factors": {
    "height": ${input.height},
    "weight": ${input.weight},
    "bmi": ${input.bmi},
    "bmi_category": "${bmiCategory}",
    "fitness_experience": "${input.fitness_experience}",
    "cause": "${input.therapy_cause}",
    "risk_factors": ["List specific risks based on BMI, cause, and metrics"],
    "recovery_potential": "High/Moderate/Low with justification"
  },
  
  "adaptive_plan": {
    "type": "MANDATORY: strong OR lazy OR normal",
    "intensity_level": "high OR moderate OR low",
    "action": "Detailed, specific action plan with clear instructions",
    "progression_timeline": "Realistic timeframe for next progression",
    "exercise_modifications": ["Specific modifications for this patient"],
    "precautions": ["Safety warnings and contraindications"]
  },
  
  "clinical_insights": {
    "movement_quality": "Assessment of movement patterns and efficiency",
    "compensation_patterns": "Identify any compensatory movements",
    "pain_probability": "Low/Moderate/High risk of pain with reasoning",
    "functional_capacity": "Current functional status and limitations"
  },
  
  "psychological_factors": {
    "motivation_level": "High/Moderate/Low based on performance",
    "compliance_prediction": "Likelihood of following program",
    "mental_barriers": ["Psychological obstacles to recovery"],
    "encouragement_strategy": "Personalized motivational approach"
  },
  
  "recommendations": {
    "immediate_actions": ["2-3 actions for TODAY"],
    "short_term_goals": ["3-4 goals for next 1-2 weeks"],
    "long_term_goals": ["3-4 goals for next 1-3 months"],
    "lifestyle_modifications": ["Daily habits to support recovery"]
  },
  
  "next_session_focus": [
    "Primary focus area 1",
    "Primary focus area 2",
    "Primary focus area 3"
  ],
  
  "red_flags": ["Warning signs requiring medical attention or modification"],
  
  "progress_indicators": {
    "positive_signs": ["What's going well"],
    "areas_of_concern": ["What needs attention"],
    "expected_improvements": ["What to expect in coming weeks"]
  }
}

DECISION RULES (MANDATORY):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Goal Status:
  • "achieved": accuracy > 75% AND activation > 70%
  • "progress": accuracy > 60% OR activation > 60%
  • "not achieved": otherwise

Performance Grade:
  • A+: average ≥ 90%
  • A: average ≥ 85%
  • B+: average ≥ 75%
  • B: average ≥ 65%
  • C: average ≥ 55%
  • D: average ≥ 45%
  • F: average < 45%

Adaptive Plan Type:
  • "normal": Goal achieved (maintain and progress)
  • "strong": Advanced patient, goal not achieved (intensify)
  • "lazy": Non-advanced patient, goal not achieved (simplify)

Consistency Score Calculation:
  • High consistency (80-100): Both metrics within 10% of each other
  • Moderate (50-79): Metrics vary by 10-25%
  • Low (0-49): Metrics differ by >25%

Effort Index:
  • Activation/Accuracy ratio * 100
  • >100: High effort, may indicate fatigue
  • 80-100: Optimal effort
  • <80: Suboptimal muscle engagement

CLINICAL CONTEXT GUIDELINES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BMI Considerations:
  • Underweight (<18.5): Focus on strength building, nutrition
  • Normal (18.5-24.9): Standard progression protocols
  • Overweight (25-29.9): Joint protection, weight-bearing caution
  • Obese (≥30): Modified exercises, emphasize low-impact

Fitness Experience:
  • Beginner: Emphasize education, form, gradual progression
  • Intermediate: Balance challenge with safety, variety
  • Advanced: Push boundaries, complex movements, performance

Common Therapy Causes - Tailor accordingly:
  • Post-surgical: Respect healing phases, ROM before strength
  • Sports injury: Sport-specific training, return-to-play criteria
  • Chronic pain: Pain education, gradual exposure, desensitization
  • Neurological: Motor learning, repetition, task-specific training
  • Aging/mobility: Fall prevention, functional independence

IMPORTANT INSTRUCTIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Return ONLY valid JSON (no text before/after)
2. Be specific and actionable (avoid generic advice)
3. Use clinical terminology appropriately
4. Base recommendations on evidence and patient data
5. Consider holistic recovery (physical + psychological)
6. Prioritize patient safety in all recommendations
7. ALL fields are mandatory - do not omit any section`;
  }

  private getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  private validateAdvancedReport(report: any): void {
    const requiredFields = [
      'summary',
      'goal_status',
      'performance_grade',
      'metrics_analysis',
      'patient_factors',
      'adaptive_plan',
      'clinical_insights',
      'psychological_factors',
      'recommendations',
      'next_session_focus',
      'red_flags',
      'progress_indicators'
    ];

    for (const field of requiredFields) {
      if (!report[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate enums
    if (!['achieved', 'progress', 'not achieved'].includes(report.goal_status)) {
      throw new Error(`Invalid goal_status: ${report.goal_status}`);
    }

    if (!['A+', 'A', 'B+', 'B', 'C', 'D', 'F'].includes(report.performance_grade)) {
      throw new Error(`Invalid performance_grade: ${report.performance_grade}`);
    }

    if (!['lazy', 'strong', 'normal'].includes(report.adaptive_plan.type)) {
      throw new Error(`Invalid adaptive_plan.type: ${report.adaptive_plan.type}`);
    }

    // Validate nested structures
    const requiredMetrics = ['accuracy_rate', 'activation_rate', 'consistency_score', 'effort_index', 'insight', 'detailed_breakdown'];
    for (const field of requiredMetrics) {
      if (report.metrics_analysis[field] === undefined) {
        throw new Error(`Missing metrics_analysis.${field}`);
      }
    }

    // Validate arrays
    if (!Array.isArray(report.recommendations.immediate_actions)) {
      throw new Error('recommendations.immediate_actions must be an array');
    }
    if (!Array.isArray(report.next_session_focus) || report.next_session_focus.length === 0) {
      throw new Error('next_session_focus must be a non-empty array');
    }
  }
}