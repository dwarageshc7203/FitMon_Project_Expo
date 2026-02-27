import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';
import apiService from '../services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    weeklyProgress: 0,
    streak: 0,
    bmi: 0,
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await apiService.getCurrentUser();
      setUser(currentUser);
      
      // Calculate BMI if height and weight available
      if (currentUser?.height && currentUser?.weight) {
        const heightInM = currentUser.height / 100;
        const bmi = currentUser.weight / (heightInM * heightInM);
        setStats(prev => ({ ...prev, bmi: bmi.toFixed(1) }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.green} />
      }
    >
      {/* Header */}
      <LinearGradient
        colors={['rgba(0, 230, 118, 0.1)', 'transparent']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.userName}>{user?.username || 'User'}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <LinearGradient
            colors={[colors.greenSoft, 'transparent']}
            style={styles.statGradient}
          />
          <Ionicons name="fitness" size={32} color={colors.green} />
          <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
          <Text style={styles.statLabel}>Total Workouts</Text>
        </View>

        <View style={styles.statCard}>
          <LinearGradient
            colors={[colors.blueSoft, 'transparent']}
            style={styles.statGradient}
          />
          <Ionicons name="flame" size={32} color={colors.blue} />
          <Text style={styles.statValue}>{stats.streak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>

        <View style={styles.statCard}>
          <LinearGradient
            colors={[colors.purpleSoft, 'transparent']}
            style={styles.statGradient}
          />
          <Ionicons name="analytics" size={32} color={colors.purple} />
          <Text style={styles.statValue}>{stats.bmi || '--'}</Text>
          <Text style={styles.statLabel}>BMI</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Workouts')}
        >
          <LinearGradient
            colors={[colors.greenSoft, 'transparent']}
            style={styles.actionGradient}
          />
          <View style={[styles.actionIcon, { backgroundColor: colors.greenSoft }]}>
            <Ionicons name="play" size={28} color={colors.green} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Browse Workouts</Text>
            <Text style={styles.actionDesc}>Explore exercise library and videos</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textDimmed} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Profile')}
        >
          <LinearGradient
            colors={[colors.blueSoft, 'transparent']}
            style={styles.actionGradient}
          />
          <View style={[styles.actionIcon, { backgroundColor: colors.blueSoft }]}>
            <Ionicons name="person" size={28} color={colors.blue} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Update Profile</Text>
            <Text style={styles.actionDesc}>Manage your account and preferences</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={colors.textDimmed} />
        </TouchableOpacity>
      </View>

      {/* Activity Feed / Recent */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color={colors.textDimmed} />
          <Text style={styles.emptyText}>No recent activities</Text>
          <Text style={styles.emptySubtext}>Start a workout to track your progress</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    color: colors.textSoft,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
    overflow: 'hidden',
  },
  statGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSoft,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 14,
    color: colors.textSoft,
  },
  emptyState: {
    backgroundColor: colors.bgGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMain,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSoft,
    marginTop: 4,
    textAlign: 'center',
  },
});
