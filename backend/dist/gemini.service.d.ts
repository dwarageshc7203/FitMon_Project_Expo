export interface PatientInput {
    height: number;
    weight: number;
    bmi: number;
    fitness_experience: 'beginner' | 'intermediate' | 'advanced';
    therapy_cause: string;
    goal: string;
    accuracy_rate: number;
    activation_rate: number;
    pulse_rate: number;
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
export declare class GeminiService {
    private readonly logger;
    private genAI;
    constructor();
    generateSessionReport(input: PatientInput): Promise<SessionReport>;
    private fixAndEnhanceReport;
    private buildAdvancedPrompt;
    private getBMICategory;
    private validateAdvancedReport;
}
