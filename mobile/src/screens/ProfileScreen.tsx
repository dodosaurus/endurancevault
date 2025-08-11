import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';

export function ProfileScreen() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.border }]}>
            {user?.profilePictureUrl ? (
              <Image
                source={{ uri: user.profilePictureUrl }}
                style={styles.avatarImage}
                defaultSource={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' }}
              />
            ) : (
              <Ionicons name="person" size={48} color={theme.colors.textSecondary} />
            )}
          </View>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Strava Athlete</Text>
        </View>

        <View style={styles.stats}>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>{user?.currency || 0}</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Currency</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>0</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Cards Owned</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>0</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Total Score</Text>
          </View>
        </View>

        <View style={[styles.menu, { backgroundColor: theme.colors.surface }]}>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
            <Ionicons name="sync" size={24} color={theme.colors.text} />
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Sync Activities</Text>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.disabled} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
            <Ionicons name="receipt" size={24} color={theme.colors.text} />
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Transaction History</Text>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.disabled} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
            <Ionicons name="moon" size={24} color={theme.colors.text} />
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Theme</Text>
            <ThemeToggle size="small" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}>
            <Ionicons name="settings" size={24} color={theme.colors.text} />
            <Text style={[styles.menuText, { color: theme.colors.text }]}>Settings</Text>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.disabled} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: 'transparent' }]} onPress={handleSignOut}>
            <Ionicons name="log-out" size={24} color={theme.colors.primary} />
            <Text style={[styles.menuText, { color: theme.colors.primary }]}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  menu: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
});