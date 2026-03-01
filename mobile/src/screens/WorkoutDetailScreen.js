import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const { width, height } = Dimensions.get('window');

export default function WorkoutDetailScreen({ route, navigation }) {
  const { workout } = route.params;

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(workout.videoUrl);

  return (
    <View style={styles.container}>
      {/* Header with Glassmorphism */}
      <BlurView intensity={95} tint="dark" style={styles.header}>
        <LinearGradient
          colors={['rgba(0, 230, 118, 0.15)', 'transparent']}
          style={StyleSheet.absoluteFillObject}
        />
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <View style={styles.glassButton}>
            <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
          </View>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {workout.name}
        </Text>
      </BlurView>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* YouTube Video Player */}
        {videoId ? (
          <View style={styles.videoContainer}>
            <View style={styles.videoWrapper}>
              <WebView
                style={styles.video}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{
                  uri: `https://www.youtube.com/embed/${videoId}?modestbranding=1&playsinline=1&rel=0`,
                }}
                allowsFullscreenVideo={true}
              />
            </View>
            <View style={styles.videoOverlay} pointerEvents="none">
              <LinearGradient
                colors={['transparent', 'rgba(3, 3, 3, 0.8)']}
                style={styles.videoGradient}
              />
            </View>
          </View>
        ) : (
          <View style={styles.noVideoContainer}>
            <Ionicons name="videocam-off-outline" size={48} color={colors.textDimmed} />
            <Text style={styles.noVideoText}>No video available</Text>
          </View>
        )}

        {/* Glass Card - Details */}
        <BlurView intensity={80} tint="dark" style={styles.glassCard}>
          <LinearGradient
            colors={[colors.greenGlow, 'transparent']}
            style={styles.cardGradient}
          />
          <View style={styles.cardContent}>
            <View style={styles.categoryBadge}>
              <Ionicons 
                name={getCategoryIcon(workout.category || workout.muscleGroup)} 
                size={16} 
                color={colors.green} 
              />
              <Text style={styles.categoryText}>
                {workout.category || workout.muscleGroup || 'General'}
              </Text>
            </View>
            
            <Text style={styles.workoutTitle}>{workout.name}</Text>
            
            {workout.description && (
              <Text style={styles.description}>{workout.description}</Text>
            )}

            {/* Stats Row */}
            <View style={styles.statsRow}>
              {workout.duration && (
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={18} color={colors.blue} />
                  <Text style={styles.statText}>{workout.duration}</Text>
                </View>
              )}
              {workout.difficulty && (
                <View style={styles.statItem}>
                  <Ionicons name="barbell-outline" size={18} color={colors.cyan} />
                  <Text style={styles.statText}>{workout.difficulty}</Text>
                </View>
              )}
              {workout.calories && (
                <View style={styles.statItem}>
                  <Ionicons name="flame-outline" size={18} color={colors.warning} />
                  <Text style={styles.statText}>{workout.calories} cal</Text>
                </View>
              )}
            </View>
          </View>
        </BlurView>

        {/* Glass Card - Instructions */}
        {workout.instructions && workout.instructions.length > 0 && (
          <BlurView intensity={80} tint="dark" style={styles.glassCard}>
            <View style={styles.cardContent}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              {workout.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </BlurView>
        )}

        {/* Start Workout Button */}
        <TouchableOpacity 
          style={styles.startButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={[colors.green, colors.greenDim]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <Ionicons name="play" size={24} color={colors.bgBase} />
            <Text style={styles.buttonText}>Start Workout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function getCategoryIcon(category) {
  const icons = {
    upper: 'barbell',
    lower: 'walk',
    core: 'body',
    cardio: 'heart',
    flexibility: 'hand-right',
  };
  return icons[category?.toLowerCase()] || 'fitness';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    overflow: 'hidden',
  },
  backButton: {
    marginRight: 12,
  },
  glassButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: colors.borderBright,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
    position: 'relative',
  },
  videoWrapper: {
    flex: 1,
  },
  video: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  videoGradient: {
    flex: 1,
  },
  noVideoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.bgLayer2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noVideoText: {
    color: colors.textDimmed,
    fontSize: 16,
    marginTop: 12,
  },
  glassCard: {
    margin: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderBright,
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  cardContent: {
    padding: 20,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.greenSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    marginBottom: 16,
  },
  categoryText: {
    color: colors.green,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
    textTransform: 'capitalize',
  },
  workoutTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSoft,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statText: {
    color: colors.textMain,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.greenSoft,
    borderWidth: 1,
    borderColor: colors.greenBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: colors.green,
    fontSize: 14,
    fontWeight: '700',
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMain,
  },
  startButton: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: colors.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.bgBase,
  },
});
