import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { boosterApi, BoosterPackContents } from '../services/api';
import { BoosterOpenModal } from '../components/BoosterOpenModal';

export function ShopScreen() {
  const { user, refreshUser } = useAuth();
  const { theme } = useTheme();
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Shop</Text>
        <View style={[styles.currencyContainer, { backgroundColor: theme.colors.background }]}>
          <Ionicons name="cash" size={20} color="#FFD700" />
          <Text style={[styles.currency, { color: theme.colors.text }]}>{user?.currency || 0}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={[styles.boosterCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.boosterIcon}>
            <Ionicons name="gift" size={48} color={theme.colors.primary} />
          </View>
          
          <View style={styles.boosterInfo}>
            <Text style={[styles.boosterTitle, { color: theme.colors.text }]}>Athlete Booster Pack</Text>
            <Text style={[styles.boosterDescription, { color: theme.colors.textSecondary }]}>
              Contains 4 cards with a chance for rare athletes
            </Text>
            
            <View style={styles.boosterContents}>
              <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>• 3 Common cards guaranteed</Text>
              <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>• 1 card with rarity bonus chance</Text>
              <Text style={[styles.contentText, { color: theme.colors.textSecondary }]}>• 0.5% chance for Legendary card!</Text>
            </View>
          </View>

          <View style={styles.boosterFooter}>
            <View style={styles.priceContainer}>
              <Ionicons name="cash" size={16} color="#FFD700" />
              <Text style={[styles.price, { color: theme.colors.text }]}>100</Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.buyButton,
                { backgroundColor: theme.colors.primary },
                ((user?.currency || 0) < 100 || isOpening) && { backgroundColor: theme.colors.disabled }
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
          <View style={[styles.insufficientFunds, { backgroundColor: theme.isDark ? theme.colors.surface : '#FFF3E0' }]}>
            <Ionicons name="warning" size={24} color={theme.colors.primary} />
            <Text style={[styles.insufficientText, { color: theme.isDark ? theme.colors.text : '#E65100' }]}>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  boosterCard: {
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
    textAlign: 'center',
    marginBottom: 8,
  },
  boosterDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  boosterContents: {
    gap: 4,
  },
  contentText: {
    fontSize: 12,
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
  },
  buyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insufficientFunds: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  insufficientText: {
    flex: 1,
    fontSize: 14,
  },
});