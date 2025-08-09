import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export function LoginScreen() {
  const { signInWithStrava } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B35', '#F7931E']}
        style={styles.background}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Endurance Vault</Text>
            <Text style={styles.subtitle}>
              Collect legendary athletes with every workout
            </Text>
          </View>

          <View style={styles.features}>
            <View style={styles.feature}>
              <Ionicons name="trophy" size={32} color="white" />
              <Text style={styles.featureText}>Earn rewards from activities</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="grid" size={32} color="white" />
              <Text style={styles.featureText}>Collect legendary athlete cards</Text>
            </View>
            <View style={styles.feature}>
              <Ionicons name="people" size={32} color="white" />
              <Text style={styles.featureText}>Compete with friends</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={signInWithStrava}
          >
            <Text style={styles.loginButtonText}>Connect with Strava</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    opacity: 0.9,
  },
  features: {
    gap: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureText: {
    fontSize: 16,
    color: 'white',
    flex: 1,
  },
  loginButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6B35',
  },
});