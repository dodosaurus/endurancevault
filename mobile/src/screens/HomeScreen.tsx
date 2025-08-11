import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { userApi } from '../services/api';
import { renderActivityIcon } from '../utils/activityIcons';

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
  const navigation = useNavigation<any>();
  const { user, refreshUser } = useAuth();
  const { theme } = useTheme();
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

  const dynamicStyles = createDynamicStyles(theme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>Welcome back, {user?.firstName}!</Text>
          <View style={[styles.currencyContainer, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="cash" size={20} color="#FFD700" />
            <Text style={[styles.currency, { color: theme.colors.text }]}>{user?.currency || 0}</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.colors.surface }, isSyncing && styles.actionCardDisabled]}
            onPress={handleSyncActivities}
            disabled={isSyncing}
          >
            <Ionicons 
              name={isSyncing ? "hourglass" : "sync"} 
              size={32} 
              color={isSyncing ? theme.colors.disabled : theme.colors.primary} 
            />
            <Text style={[styles.actionTitle, { color: theme.colors.text }, isSyncing && { color: theme.colors.disabled }]}>
              {isSyncing ? 'Syncing...' : 'Sync Activities'}
            </Text>
            <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>Get currency from recent workouts</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionCard, { backgroundColor: theme.colors.surface }]}
            onPress={() => navigation.navigate('Shop')}
          >
            <Ionicons name="gift" size={32} color={theme.colors.primary} />
            <Text style={[styles.actionTitle, { color: theme.colors.text }]}>Open Booster</Text>
            <Text style={[styles.actionSubtitle, { color: theme.colors.textSecondary }]}>100 coins per pack</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Activity</Text>
          {isLoadingActivities ? (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="hourglass" size={48} color={theme.colors.disabled} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>Loading activities...</Text>
            </View>
          ) : activities.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="fitness" size={48} color={theme.colors.disabled} />
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No recent activities</Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>Sync your Strava activities to earn currency</Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {activities.map((activity) => (
                <View key={activity.id} style={[styles.activityCard, { backgroundColor: theme.colors.surface }]}>
                  <View style={styles.activityContent}>
                    {activity.mapThumbnailUrl ? (
                      <Image 
                        source={{ uri: activity.mapThumbnailUrl }}
                        style={dynamicStyles.mapThumbnail}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[dynamicStyles.mapThumbnail, { justifyContent: 'center', alignItems: 'center' }]}>
                        <Ionicons name="location-outline" size={20} color={theme.colors.disabled} />
                        <Text style={{ fontSize: 8, color: theme.colors.textSecondary }}>Indoor</Text>
                      </View>
                    )}
                    <View style={styles.activityInfo}>
                      <View style={styles.activityHeader}>
                        {renderActivityIcon(activity.activityType, 20, theme.colors.primary)}
                        <Text style={[styles.activityName, { color: theme.colors.text }]} numberOfLines={1}>
                          {activity.name}
                        </Text>
                      </View>
                      <View style={styles.activityStats}>
                        <Text style={[styles.activityDistance, { color: theme.colors.textSecondary }]}>
                          {(activity.distance / 1000).toFixed(1)} km
                        </Text>
                        <Text style={[styles.activityDuration, { color: theme.colors.textSecondary }]}>
                          {formatDuration(activity.duration)}
                        </Text>
                        <View style={styles.activityCurrency}>
                          <Ionicons name="cash" size={14} color="#FFD700" />
                          <Text style={[styles.currencyEarned, { color: theme.colors.secondary }]}>+{activity.currencyEarned}</Text>
                        </View>
                      </View>
                      <Text style={[styles.activityDate, { color: theme.colors.textSecondary }]}>
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

const createDynamicStyles = (theme: any) => StyleSheet.create({
  mapThumbnail: {
    width: 120,
    height: 90,
    borderRadius: 8,
    backgroundColor: theme.colors.border,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  currency: {
    fontSize: 16,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionCardDisabled: {
    opacity: 0.6,
  },
  actionSubtitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  activityList: {
    gap: 12,
  },
  activityCard: {
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
  },
  activityStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  activityDistance: {
    fontSize: 14,
    fontWeight: '500',
  },
  activityDuration: {
    fontSize: 14,
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
  },
  activityDate: {
    fontSize: 12,
  },
});