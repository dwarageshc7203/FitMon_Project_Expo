import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const { width } = Dimensions.get('window');

// Mock workout data with YouTube videos
const MOCK_WORKOUTS = [
  {
    id: 1,
    name: 'Dynamic Warm-Up Routine',
    category: 'flexibility',
    description: 'Full body warm-up to prepare your muscles and joints for exercise',
    videoUrl: 'https://www.youtube.com/watch?v=dj2NvQya_QA',
    duration: '10 min',
    difficulty: 'Beginner',
    calories: 50,
    instructions: [
      'Start with light cardio for 2-3 minutes',
      'Perform arm circles and shoulder rolls',
      'Do leg swings and hip circles',
      'Finish with dynamic stretches',
    ],
  },
  {
    id: 2,
    name: 'Core Stability Training',
    category: 'core',
    description: 'Strengthen your core with planks, bridges, and rotation exercises',
    videoUrl: 'https://www.youtube.com/watch?v=cbKkB3POqaY',
    duration: '15 min',
    difficulty: 'Intermediate',
    calories: 120,
    instructions: [
      'Start with breathing exercises',
      'Hold planks for 30-60 seconds',
      'Do 3 sets of dead bugs',
      'Finish with bird dogs',
    ],
  },
  {
    id: 3,
    name: 'Resistance Band Workout',
    category: 'upper',
    description: 'Build strength with versatile resistance band exercises',
    videoUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
    duration: '20 min',
    difficulty: 'Intermediate',
    calories: 180,
    instructions: [
      'Warm up with band pulls',
      'Do 12 reps of each exercise',
      'Focus on controlled movements',
      'Rest 30-45 seconds between sets',
    ],
  },
  {
    id: 4,
    name: 'Bodyweight HIIT',
    category: 'cardio',
    description: 'High-intensity interval training using only your bodyweight',
    videoUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
    duration: '20 min',
    difficulty: 'Advanced',
    calories: 250,
    instructions: [
      'Work for 40 seconds, rest 20',
      'Include burpees, mountain climbers',
      'Keep your core engaged',
      'Maintain proper form throughout',
    ],
  },
  {
    id: 5,
    name: 'Leg Day Power Workout',
    category: 'lower',
    description: 'Build powerful legs with squats, lunges, and plyometrics',
    videoUrl: 'https://www.youtube.com/watch?v=5JEmm1dYLN4',
    duration: '30 min',
    difficulty: 'Advanced',
    calories: 300,
    instructions: [
      'Start with bodyweight squats',
      'Progress to weighted movements',
      'Include jump squats for power',
      'Cool down with stretches',
    ],
  },
  {
    id: 6,
    name: 'Yoga Flow for Athletes',
    category: 'flexibility',
    description: 'Increase flexibility and mobility with flowing yoga poses',
    videoUrl: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    duration: '25 min',
    difficulty: 'Beginner',
    calories: 100,
    instructions: [
      'Focus on breath awareness',
      'Flow through sun salutations',
      'Hold each pose for 5 breaths',
      'End with relaxation pose',
    ],
  },
];

export default function WorkoutsScreen({ navigation }) {
  const [workouts, setWorkouts] = useState(MOCK_WORKOUTS);
  const [filteredWorkouts, setFilteredWorkouts] = useState(MOCK_WORKOUTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'upper', 'lower', 'core', 'cardio', 'flexibility'];

  useEffect(() => {
    filterWorkouts();
  }, [searchQuery, selectedCategory]);

  const filterWorkouts = () => {
    let filtered = workouts;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(w => w.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w =>
        w.name.toLowerCase().includes(query) ||
        w.description.toLowerCase().includes(query)
      );
    }

    setFilteredWorkouts(filtered);
  };

  const handleWorkoutPress = (workout) => {
    navigation.navigate('WorkoutDetail', { workout });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      upper: 'barbell',
      lower: 'walk',
      core: 'body',
      cardio: 'heart',
      flexibility: 'hand-right',
      all: 'grid',
    };
    return icons[category] || 'fitness';
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      upper: colors.green,
      lower: colors.blue,
      core: colors.purple,
      cardio: colors.danger,
      flexibility: colors.cyan,
      all: colors.textSoft,
    };
    return colorMap[category] || colors.green;
  };

  const getDifficultyColor = (difficulty) => {
    const colorMap = {
      'Beginner': colors.green,
      'Intermediate': colors.warning,
      'Advanced': colors.danger,
    };
    return colorMap[difficulty] || colors.textSoft;
  };

  return (
    <View style={styles.container}>
      {/* Glass Header */}
      <BlurView intensity={95} tint="dark" style={styles.header}>
        <LinearGradient
          colors={['rgba(0, 230, 118, 0.1)', 'transparent']}
          style={StyleSheet.absoluteFillObject}
        />
        <Text style={styles.headerTitle}>Workout Library</Text>
        <Text style={styles.headerSubtitle}>{filteredWorkouts.length} workouts available</Text>
      </BlurView>

      {/* Search Bar with Glass Effect */}
      <View style={styles.searchWrapper}>
        <BlurView intensity={60} tint="dark" style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={colors.textSoft} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts..."
            placeholderTextColor={colors.textDimmed}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSoft} />
            </TouchableOpacity>
          )}
        </BlurView>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(category => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              activeOpacity={0.7}
            >
              <BlurView
                intensity={isSelected ? 90 : 60}
                tint="dark"
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipActive,
                ]}
              >
                {isSelected && (
                  <LinearGradient
                    colors={[colors.greenGlow, 'transparent']}
                    style={StyleSheet.absoluteFillObject}
                  />
                )}
                <Ionicons
                  name={getCategoryIcon(category)}
                  size={16}
                  color={isSelected ? colors.green : colors.textSoft}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Text>
              </BlurView>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Workouts List */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredWorkouts.map((workout) => (
          <TouchableOpacity
            key={workout.id}
            onPress={() => handleWorkoutPress(workout)}
            activeOpacity={0.9}
          >
            <BlurView intensity={70} tint="dark" style={styles.workoutCard}>
              <LinearGradient
                colors={[getCategoryColor(workout.category) + '15', 'transparent']}
                style={styles.cardGradient}
              />
              
              {/* Video Thumbnail Area */}
              <View style={styles.thumbnailContainer}>
                <View style={styles.thumbnailOverlay}>
                  <Ionicons name="play-circle" size={56} color={colors.green} />
                </View>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationText}>{workout.duration}</Text>
                </View>
              </View>

              {/* Workout Info */}
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <View style={styles.categoryBadge}>
                    <Ionicons
                      name={getCategoryIcon(workout.category)}
                      size={12}
                      color={getCategoryColor(workout.category)}
                    />
                    <Text
                      style={[
                        styles.categoryLabel,
                        { color: getCategoryColor(workout.category) },
                      ]}
                    >
                      {workout.category}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.difficultyBadge,
                      { borderColor: getDifficultyColor(workout.difficulty) + '40' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        { color: getDifficultyColor(workout.difficulty) },
                      ]}
                    >
                      {workout.difficulty}
                    </Text>
                  </View>
                </View>

                <Text style={styles.workoutName}>{workout.name}</Text>
                <Text style={styles.workoutDesc} numberOfLines={2}>
                  {workout.description}
                </Text>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Ionicons name="flame-outline" size={14} color={colors.warning} />
                    <Text style={styles.statText}>{workout.calories} cal</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="barbell-outline" size={14} color={colors.blue} />
                    <Text style={styles.statText}>
                      {workout.instructions?.length || 0} steps
                    </Text>
                  </View>
                </View>
              </View>

              {/* Arrow Indicator */}
              <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={20} color={colors.textDimmed} />
              </View>
            </BlurView>
          </TouchableOpacity>
        ))}

        {filteredWorkouts.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={colors.textDimmed} />
            <Text style={styles.emptyText}>No workouts found</Text>
            <Text style={styles.emptySubtext}>Try a different search or category</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 50,
    paddingBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    overflow: 'hidden',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSoft,
    fontWeight: '500',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderBright,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  categoryScroll: {
    maxHeight: 60,
    marginBottom: 8,
  },
  categoryContent: {
    paddingHorizontal: 16,
    gap: 10,
    paddingVertical: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
    overflow: 'hidden',
  },
  categoryChipActive: {
    borderColor: colors.greenBorder,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSoft,
  },
  categoryTextActive: {
    color: colors.green,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Extra space for bottom navbar
    gap: 16,
  },
  workoutCard: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.borderBright,
    marginBottom: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  thumbnailContainer: {
    height: 160,
    backgroundColor: colors.bgLayer2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  durationText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '700',
  },
  workoutName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  workoutDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSoft,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 13,
    color: colors.textSoft,
    fontWeight: '600',
  },
  arrowContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textMain,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.textSoft,
    marginTop: 8,
  },
});
