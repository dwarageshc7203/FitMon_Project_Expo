import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../styles/globalStyles';
import { colors } from '../styles/colors';
import apiService from '../services/api';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    height: '',
    weight: '',
  });
  const [bmi, setBmi] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    calculateBMI();
  }, [formData.height, formData.weight]);

  const loadUserData = async () => {
    try {
      const currentUser = await apiService.getCurrentUser();
      setUser(currentUser);
      setFormData({
        username: currentUser?.username || '',
        email: currentUser?.email || '',
        age: currentUser?.age?.toString() || '',
        height: currentUser?.height?.toString() || '',
        weight: currentUser?.weight?.toString() || '',
      });
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const calculateBMI = () => {
    const height = parseFloat(formData.height);
    const weight = parseFloat(formData.weight);
    
    if (height && weight && height > 0) {
      const heightInM = height / 100;
      const bmiValue = weight / (heightInM * heightInM);
      setBmi(bmiValue.toFixed(1));
    } else {
      setBmi(null);
    }
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return { text: '--', color: colors.textSoft };
    const value = parseFloat(bmi);
    if (value < 18.5) return { text: 'Underweight', color: colors.cyan };
    if (value < 25) return { text: 'Normal', color: colors.green };
    if (value < 30) return { text: 'Overweight', color: colors.warning };
    return { text: 'Obese', color: colors.danger };
  };

  const handleSave = () => {
    // In a real app, you would send this to the API
    Alert.alert('Success', 'Profile updated successfully!');
    setIsEditing(false);
    // Update local storage
    const updatedUser = { ...user, ...formData };
    setUser(updatedUser);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await apiService.logout();
            // App.js will detect the auth change and navigate to Landing
          },
        },
      ]
    );
  };

  const bmiCategory = getBMICategory(bmi);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarLarge}>
          <Text style={styles.avatarText}>
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.username}>{user?.username || 'User'}</Text>
        <Text style={styles.role}>
          {user?.role === 'doctor' ? 'Coach / Doctor' : 'Athlete / Patient'}
        </Text>
      </View>

      {/* BMI Card */}
      {bmi && (
        <View style={styles.bmiCard}>
          <View style={styles.bmiHeader}>
            <Text style={styles.bmiTitle}>Body Mass Index (BMI)</Text>
            <View style={[styles.bmiCategoryBadge, { backgroundColor: `${bmiCategory.color}20` }]}>
              <Text style={[styles.bmiCategoryText, { color: bmiCategory.color }]}>
                {bmiCategory.text}
              </Text>
            </View>
          </View>
          <Text style={styles.bmiValue}>{bmi}</Text>
          <Text style={styles.bmiFormula}>
            Based on {formData.height}cm height and {formData.weight}kg weight
          </Text>
        </View>
      )}

      {/* Profile Information */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Profile Information</Text>
          {!isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Ionicons name="create-outline" size={24} color={colors.green} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={20} color={colors.textSoft} />
            <Text style={styles.infoLabel}>Username</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
                editable={false}
              />
            ) : (
              <Text style={styles.infoValue}>{formData.username}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="mail-outline" size={20} color={colors.textSoft} />
            <Text style={styles.infoLabel}>Email</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.infoValue}>{formData.email || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.textSoft} />
            <Text style={styles.infoLabel}>Age</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={formData.age}
                onChangeText={(text) => setFormData({ ...formData, age: text })}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{formData.age || '--'} years</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="resize-outline" size={20} color={colors.textSoft} />
            <Text style={styles.infoLabel}>Height</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={formData.height}
                onChangeText={(text) => setFormData({ ...formData, height: text })}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{formData.height || '--'} cm</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="barbell-outline" size={20} color={colors.textSoft} />
            <Text style={styles.infoLabel}>Weight</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={formData.weight}
                onChangeText={(text) => setFormData({ ...formData, weight: text })}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{formData.weight || '--'} kg</Text>
            )}
          </View>
        </View>
      </View>

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="notifications-outline" size={24} color={colors.textSoft} />
            <Text style={styles.settingText}>Notifications</Text>
          </View>
          <Switch
            value={false}
            onValueChange={() => {}}
            trackColor={{ false: colors.bgLayer2, true: colors.greenSoft }}
            thumbColor={colors.green}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="moon-outline" size={24} color={colors.textSoft} />
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={true}
            onValueChange={() => {}}
            trackColor={{ false: colors.bgLayer2, true: colors.greenSoft }}
            thumbColor={colors.green}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="help-circle-outline" size={24} color={colors.textSoft} />
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textDimmed} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <Ionicons name="information-circle-outline" size={24} color={colors.textSoft} />
            <Text style={styles.settingText}>About FitMon</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.textDimmed} />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity
          style={[globalStyles.button, styles.logoutButton]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>FitMon v1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgBase,
  },
  scrollContent: {
    paddingBottom: 100, // Extra space for bottom navbar
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#000',
  },
  username: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: colors.textSoft,
    textTransform: 'capitalize',
  },
  bmiCard: {
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: colors.bgGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 20,
  },
  bmiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bmiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMain,
  },
  bmiCategoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bmiCategoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  bmiFormula: {
    fontSize: 14,
    color: colors.textSoft,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.green,
  },
  infoCard: {
    backgroundColor: colors.bgGlass,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.textSoft,
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  infoInput: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 100,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgGlass,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: colors.textMain,
  },
  logoutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    flexDirection: 'row',
    gap: 8,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: colors.textDimmed,
  },
});
