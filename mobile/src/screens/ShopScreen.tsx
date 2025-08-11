import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { boosterApi, BoosterPackContents } from '../services/api';
import { BoosterOpenModal } from '../components/BoosterOpenModal';

export function ShopScreen() {
  const { user, refreshUser } = useAuth();
  const [isOpening, setIsOpening] = useState(false);
  const [showBoosterResult, setShowBoosterResult] = useState(false);
  const [lastOpenedPack, setLastOpenedPack] = useState<BoosterPackContents | null>(null);

  const handleOpenBooster = async () => {
    if (!user || user.currency < 100) {
      Alert.alert('Insufficient Currency', 'You need at least 100 coins to open a booster pack!');
      return;
    }

    setIsOpening(true);
    
    try {
      const result = await boosterApi.openBoosterPack();
      
      // Update user currency immediately
      await refreshUser();
      
      // Show the booster opening animation
      setLastOpenedPack(result.contents);
      setShowBoosterResult(true);
      
    } catch (error) {
      console.error('Failed to open booster pack:', error);
      
      let errorMessage = 'Failed to open booster pack. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('Insufficient currency')) {
          errorMessage = 'Not enough currency to open a booster pack!';
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsOpening(false);
    }
  };

  const handleBoosterResultClose = () => {
    setShowBoosterResult(false);
    setLastOpenedPack(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop</Text>
        <View style={styles.currencyContainer}>
          <Ionicons name="cash" size={20} color="#FFD700" />
          <Text style={styles.currency}>{user?.currency || 0}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.boosterCard}>
          <View style={styles.boosterIcon}>
            <Ionicons name="gift" size={48} color="#FF6B35" />
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
              <Ionicons name="cash" size={16} color="#FFD700" />
              <Text style={styles.price}>100</Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.buyButton,
                ((user?.currency || 0) < 100 || isOpening) && styles.buyButtonDisabled
              ]}
              onPress={handleOpenBooster}
              disabled={(user?.currency || 0) < 100 || isOpening}
            >
              {isOpening ? (
                <View style={styles.buttonLoadingContainer}>
                  <Ionicons name="hourglass" size={16} color="white" />
                  <Text style={styles.buyButtonText}>Opening...</Text>
                </View>
              ) : (
                <Text style={[
                  styles.buyButtonText,
                  (user?.currency || 0) < 100 && styles.buyButtonTextDisabled
                ]}>
                  Open Pack
                </Text>
              )}
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
      
      {/* Booster Opening Modal */}
      <BoosterOpenModal 
        visible={showBoosterResult}
        pack={lastOpenedPack}
        onClose={handleBoosterResultClose}
      />
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
  buttonLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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