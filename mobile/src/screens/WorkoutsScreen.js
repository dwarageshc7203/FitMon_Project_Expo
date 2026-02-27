import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';
import apiService from '../services/api';

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['all', 'upper', 'lower', 'core', 'cardio', 'flexibility'];

  useEffect(() => {
    loadWorkouts();
  }, []);

  useEffect(() => {
    filterWorkouts();
  }, [searchQuery, selectedCategory, workouts]);

  const loadWorkouts = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getWorkouts();
      setWorkouts(data || []);
    } catch (error) {
      console.error('Error loading workouts:', error);
      Alert.alert('Error', 'Could not load workouts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadWorkouts();
    setRefreshing(false);
  };

  const filterWorkouts = () => {
    let filtered = workouts;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(w => 
        w.category?.toLowerCase() === selectedCategory ||
        w.muscleGroup?.toLowerCase() === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w =>
        w.name?.toLowerCase().includes(query) ||
        w.description?.toLowerCase().includes(query) ||
        w.muscleGroup?.toLowerCase().includes(query)
      );
    }

    setFilteredWorkouts(filtered);
  };

  const handleWorkoutPress = (workout) => {
    if (workout.videoUrl) {
      Linking.openURL(workout.videoUrl).catch(err =>
        Alert.alert('Error', 'Could not open video')
      );
    } else {
      Alert.alert('Info', `Workout: ${workout.name}\n\n${workout.description || 'No description available'}`);
    }
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
      cardio: colors.cyan,
      flexibility: colors.warning,
      all: colors.textSoft,
    };
    return colorMap[category] || colors.green;
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
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
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Ionicons
              name={getCategoryIcon(category)}
              size={18}
              color={selectedCategory === category ? '#000' : getCategoryColor(category)}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Workouts List */}
      <ScrollView
        style={styles.workoutsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />
        }
      >
        {isLoading ? (
          <View style={styles.centered}>
            <Text style={styles.loadingText}>Loading workouts...</Text>
          </View>
        ) : filteredWorkouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={64} color={colors.textDimmed} />
            <Text style={styles.emptyText}>No workouts found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try a different search' : 'No workouts available'}
            </Text>
          </View>
        ) : (
          <View style={styles.workoutsGrid}>
            {filteredWorkouts.map((workout, index) => (
              <TouchableOpacity
                key={workout.id || index}
                style={styles.workoutCard}
                onPress={() => handleWorkoutPress(workout)}
              >
                <View style={styles.workoutThumbnail}>
                  {workout.videoUrl ? (
                    <View style={styles.videoOverlay}>
                      <Ionicons name="play-circle" size={48} color={colors.green} />
                    </View>
                  ) : (
                    <Ionicons name="fitness-outline" size={48} color={colors.textDimmed} />
                  )}
                </View>
                <View style={styles.workoutInfo}>
                  <View style={styles.workoutHeader}>
                    <Text style={styles.workoutName} numberOfLines={2}>
                      {workout.name || 'Unnamed Workout'}
                    </Text>
                    {workout.muscleGroup && (
                      <View style={[styles.badge, { backgroundColor: colors.greenSoft }]}>
                        <Text style={[styles.badgeText, { color: colors.green }]}>
                          {workout.muscleGroup}
                        </Text>
                      </View>
                    )}
                  </View>
                  {workout.description && (
                    <Text style={styles.workoutDesc} numberOfLines={2}>
                      {workout.description}
                    </Text>
                  )}
                  {workout.duration && (
                    <View style={styles.workoutMeta}>
                      <Ionicons name="time-outline" size={14} color={colors.textSoft} />
                      <Text style={styles.metaText}>{workout.duration} min</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
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
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgLayer2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
  },
  categoryContainer: {
    paddingLeft: 24,
    marginBottom: 16,
  },
  categoryContent: {
    paddingRight: 24,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgLayer2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  categoryChipActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMain,
  },
  categoryTextActive: {
    color: '#000',
  },
  workoutsList: {
    flex: 1,
  },
  workoutsGrid: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  workoutCard: {
    backgroundColor: colors.bgGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  workoutThumbnail: {
    height: 180,
    backgroundColor: colors.bgLayer2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoOverlay: {
    position: 'absolute',
  },
  workoutInfo: {
    padding: 16,
  },
  workoutHeader: {
    marginBottom: 8,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  workoutDesc: {
    fontSize: 14,
    color: colors.textSoft,
    lineHeight: 20,
    marginBottom: 8,
  },
  workoutMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSoft,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSoft,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textMain,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSoft,
    marginTop: 8,
    textAlign: 'center',
  },
});
