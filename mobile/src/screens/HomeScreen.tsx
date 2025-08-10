import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../services/api';

export function HomeScreen() {
  const { user, refreshUser } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncActivities = async () => {
    if (isSyncing) return;
    
    try {
      setIsSyncing(true);
      const result = await userApi.syncActivities();
      await refreshUser(); // Refresh user data to get updated currency
      
      Alert.alert(
        'Activities Synced!',
        `Processed ${result.activitiesProcessed} activities and earned ${result.currencyEarned} coins!`,
        [{ text: 'Great!', style: 'default' }]
      );
    } catch (error: any) {
      Alert.alert(
        'Sync Failed',
        error.message || 'Failed to sync activities. Please try again.',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back, {user?.firstName}!</Text>
          <View style={styles.currencyContainer}>
            <Ionicons name="cash" size={20} color="#FFD700" />
            <Text style={styles.currency}>{user?.currency || 0}</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionCard, isSyncing && styles.actionCardDisabled]}
            onPress={handleSyncActivities}
            disabled={isSyncing}
          >
            <Ionicons 
              name={isSyncing ? "hourglass" : "sync"} 
              size={32} 
              color={isSyncing ? "#ccc" : "#FF6B35"} 
            />
            <Text style={[styles.actionTitle, isSyncing && styles.actionTitleDisabled]}>
              {isSyncing ? 'Syncing...' : 'Sync Activities'}
            </Text>
            <Text style={styles.actionSubtitle}>Get currency from recent workouts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="gift" size={32} color="#FF6B35" />
            <Text style={styles.actionTitle}>Open Booster</Text>
            <Text style={styles.actionSubtitle}>100 coins per pack</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.emptyState}>
            <Ionicons name="fitness" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No recent activities</Text>
            <Text style={styles.emptySubtext}>Sync your Strava activities to earn currency</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionTitleDisabled: {
    color: '#ccc',
  },
  actionCardDisabled: {
    opacity: 0.6,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});