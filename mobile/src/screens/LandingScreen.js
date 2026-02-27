import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';

const { width } = Dimensions.get('window');

export default function LandingScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#030303', 'rgba(0, 230, 118, 0.05)', '#030303']}
        style={styles.hero}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon} />
          <Text style={styles.logoText}>FITMON</Text>
        </View>
        
        <Text style={styles.heroTitle}>
          Your AI-Powered{'\n'}Fitness Companion
        </Text>
        
        <Text style={styles.heroSubtitle}>
          Real-time pose analysis, personalized workouts, and expert coaching
        </Text>
        
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={[globalStyles.button, styles.ctaPrimary]}
            onPress={() => navigation.navigate('Signup')}
          >
            <Text style={globalStyles.buttonText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={20} color="#000" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[globalStyles.button, globalStyles.buttonSecondary, styles.ctaSecondary]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={[globalStyles.buttonSecondaryText]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose FitMon?</Text>
        
        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: colors.greenSoft }]}>
            <Ionicons name="body" size={32} color={colors.green} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>AI Pose Analysis</Text>
            <Text style={styles.featureDesc}>
              Real-time computer vision tracks your form with medical-grade precision
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: colors.blueSoft }]}>
            <Ionicons name="fitness" size={32} color={colors.blue} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Smart Workouts</Text>
            <Text style={styles.featureDesc}>
              Personalized exercise library with video guides and progress tracking
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: colors.purpleSoft }]}>
            <Ionicons name="stats-chart" size={32} color={colors.purple} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>Track Progress</Text>
            <Text style={styles.featureDesc}>
              Detailed analytics and insights to monitor your improvement
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.featureIcon, { backgroundColor: colors.cyanSoft }]}>
            <Ionicons name="heart" size={32} color={colors.cyan} />
          </View>
          <View style={styles.featureContent}>
            <Text style={styles.featureTitle}>IoT Integration</Text>
            <Text style={styles.featureDesc}>
              Connect wearables for heart rate and muscle activation data
            </Text>
          </View>
        </View>
      </View>

      {/* CTA Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Ready to transform your fitness journey?</Text>
        <TouchableOpacity
          style={[globalStyles.button, styles.footerButton]}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={globalStyles.buttonText}>Start Free Today</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  hero: {
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.green,
    marginRight: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 50,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSoft,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  ctaContainer: {
    width: '100%',
    gap: 12,
  },
  ctaPrimary: {
    flexDirection: 'row',
    gap: 8,
  },
  ctaSecondary: {
    marginTop: 8,
  },
  featuresSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 24,
    textAlign: 'center',
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: colors.bgGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
    marginBottom: 16,
  },
  featureIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: colors.textSoft,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textMain,
    marginBottom: 20,
    textAlign: 'center',
  },
  footerButton: {
    width: '100%',
  },
});
