import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { userApi } from '../services/api';

interface Activity {
  id: number;
  name: string;
  activityType: string;
  distance: number;
  duration: number;
  startDate: string;
  currencyEarned: number;
  mapThumbnailUrl?: string;
}

export function HomeScreen() {
  const { user, refreshUser } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  const loadRecentActivities = async () => {
    try {
      setIsLoadingActivities(true);
      const recentActivities = await userApi.getRecentActivities(5);
      setActivities(recentActivities);
    } catch (error: any) {
      console.error('Failed to load activities:', error.message);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const handleSyncActivities = async () => {
    if (isSyncing) return;
    
    try {
      setIsSyncing(true);
      const result = await userApi.syncActivities();
      await refreshUser(); // Refresh user data to get updated currency
      await loadRecentActivities(); // Refresh activities list
      
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

  const getActivityIcon = (activityType: string): keyof typeof Ionicons.glyphMap => {
    switch (activityType.toLowerCase()) {
      case 'run':
        return 'man-outline';
      case 'ride':
        return 'bicycle-outline';
      case 'walk':
        return 'walk-outline';
      case 'hike':
        return 'trail-sign-outline';
      default:
        return 'fitness-outline';
    }
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatActivityDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  useEffect(() => {
    if (user) {
      loadRecentActivities();
    }
  }, [user]);

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
          {isLoadingActivities ? (
            <View style={styles.emptyState}>
              <Ionicons name="hourglass" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Loading activities...</Text>
            </View>
          ) : activities.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="fitness" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No recent activities</Text>
              <Text style={styles.emptySubtext}>Sync your Strava activities to earn currency</Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {activities.map((activity) => (
                <View key={activity.id} style={styles.activityCard}>
                  <View style={styles.activityContent}>
                    {activity.mapThumbnailUrl ? (
                      <Image 
                        source={{ uri: activity.mapThumbnailUrl }}
                        style={styles.mapThumbnail}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.mapThumbnail, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f0f0' }]}>
                        <Ionicons name="location-outline" size={20} color="#ccc" />
                        <Text style={{ fontSize: 8, color: '#999' }}>Indoor</Text>
                      </View>
                    )}
                    <View style={styles.activityInfo}>
                      <View style={styles.activityHeader}>
                        <Ionicons 
                          name={getActivityIcon(activity.activityType)} 
                          size={20} 
                          color="#FF6B35" 
                        />
                        <Text style={styles.activityName} numberOfLines={1}>
                          {activity.name}
                        </Text>
                      </View>
                      <View style={styles.activityStats}>
                        <Text style={styles.activityDistance}>
                          {(activity.distance / 1000).toFixed(1)} km
                        </Text>
                        <Text style={styles.activityDuration}>
                          {formatDuration(activity.duration)}
                        </Text>
                        <View style={styles.activityCurrency}>
                          <Ionicons name="cash" size={14} color="#FFD700" />
                          <Text style={styles.currencyEarned}>+{activity.currencyEarned}</Text>
                        </View>
                      </View>
                      <Text style={styles.activityDate}>
                        {formatActivityDate(activity.startDate)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  activityList: {
    gap: 12,
  },
  activityCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  activityContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityInfo: {
    flex: 1,
    gap: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  activityDistance: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activityDuration: {
    fontSize: 14,
    color: '#666',
  },
  activityCurrency: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
  },
  currencyEarned: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFD700',
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },
  mapThumbnail: {
    width: 120,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
});