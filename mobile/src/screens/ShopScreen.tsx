import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

export function ShopScreen() {
  const { user } = useAuth();

  const handleOpenBooster = () => {
    // TODO: Implement booster opening
    console.log('Opening booster pack...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop</Text>
        <View style={styles.currencyContainer}>
          <Ionicons name="diamond" size={20} color="#FFD700" />
          <Text style={styles.currency}>{user?.currency || 0}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.boosterCard}>
          <View style={styles.boosterIcon}>
            <Ionicons name="bag" size={48} color="#FF6B35" />
          </View>
          
          <View style={styles.boosterInfo}>
            <Text style={styles.boosterTitle}>Athlete Booster Pack</Text>
            <Text style={styles.boosterDescription}>
              Contains 4 cards with a chance for rare athletes
            </Text>
            
            <View style={styles.boosterContents}>
              <Text style={styles.contentText}>• 3 Common cards guaranteed</Text>
              <Text style={styles.contentText}>• 1 card with rarity bonus chance</Text>
              <Text style={styles.contentText}>• 0.5% chance for Legendary card!</Text>
            </View>
          </View>

          <View style={styles.boosterFooter}>
            <View style={styles.priceContainer}>
              <Ionicons name="diamond" size={16} color="#FFD700" />
              <Text style={styles.price}>100</Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.buyButton,
                (user?.currency || 0) < 100 && styles.buyButtonDisabled
              ]}
              onPress={handleOpenBooster}
              disabled={(user?.currency || 0) < 100}
            >
              <Text style={[
                styles.buyButtonText,
                (user?.currency || 0) < 100 && styles.buyButtonTextDisabled
              ]}>
                Open Pack
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {(user?.currency || 0) < 100 && (
          <View style={styles.insufficientFunds}>
            <Ionicons name="warning" size={24} color="#FF6B35" />
            <Text style={styles.insufficientText}>
              Not enough currency. Complete activities to earn more!
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  boosterCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  boosterIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  boosterInfo: {
    marginBottom: 20,
  },
  boosterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  boosterDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  boosterContents: {
    gap: 4,
  },
  contentText: {
    fontSize: 12,
    color: '#888',
  },
  boosterFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  buyButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  buyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  buyButtonTextDisabled: {
    color: '#999',
  },
  insufficientFunds: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  insufficientText: {
    flex: 1,
    fontSize: 14,
    color: '#E65100',
  },
});