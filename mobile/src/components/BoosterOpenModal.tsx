import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Animated,
  Dimensions,
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CardItem, Card } from './CardItem';
import { BoosterPackContents } from '../services/api';

interface BoosterOpenModalProps {
  visible: boolean;
  pack: BoosterPackContents | null;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const RARITY_COLORS = {
  COMMON: '#6B7280',
  UNCOMMON: '#10B981',
  RARE: '#3B82F6',
  EPIC: '#8B5CF6',
  LEGENDARY: '#FFA500',
};

export function BoosterOpenModal({ visible, pack, onClose }: BoosterOpenModalProps) {
  const [animationStep, setAnimationStep] = useState<'opening' | 'revealing' | 'complete'>('opening');
  const [revealedCards, setRevealedCards] = useState<number>(0);
  const [packAnimation] = useState(new Animated.Value(0));
  const [cardAnimations] = useState(() => 
    Array.from({ length: 4 }, () => new Animated.Value(0))
  );

  useEffect(() => {
    if (visible && pack) {
      // Reset animations
      setAnimationStep('opening');
      setRevealedCards(0);
      packAnimation.setValue(0);
      cardAnimations.forEach(anim => anim.setValue(0));

      // Start pack opening animation
      Animated.sequence([
        Animated.timing(packAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.delay(500),
      ]).start(() => {
        setAnimationStep('revealing');
        revealCardsSequentially();
      });
    }
  }, [visible, pack]);

  const revealCardsSequentially = () => {
    if (!pack) return;

    const revealCard = (index: number) => {
      if (index >= pack.cards.length) {
        setAnimationStep('complete');
        return;
      }

      Animated.spring(cardAnimations[index], {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start(() => {
        setRevealedCards(prev => prev + 1);
        setTimeout(() => revealCard(index + 1), 300);
      });
    };

    revealCard(0);
  };

  const handleClose = () => {
    setAnimationStep('opening');
    setRevealedCards(0);
    packAnimation.setValue(0);
    cardAnimations.forEach(anim => anim.setValue(0));
    onClose();
  };

  const getRarityGradient = (rarity: string) => {
    return RARITY_COLORS[rarity as keyof typeof RARITY_COLORS] || RARITY_COLORS.COMMON;
  };

  if (!visible || !pack) return null;

  const packRotation = packAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const packScale = packAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 0],
  });

  const highestRarity = pack.cards.reduce((highest, card) => {
    const rarityOrder = { 'COMMON': 1, 'UNCOMMON': 2, 'RARE': 3, 'EPIC': 4, 'LEGENDARY': 5 };
    const currentValue = rarityOrder[card.rarity as keyof typeof rarityOrder];
    const highestValue = rarityOrder[highest as keyof typeof rarityOrder];
    return currentValue > highestValue ? card.rarity : highest;
  }, 'COMMON');

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="overFullScreen"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.backgroundGradient, { backgroundColor: `${getRarityGradient(highestRarity)}20` }]} />
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Booster Pack Opened!</Text>
              {animationStep === 'complete' && (
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Ionicons name="close" size={24} color="#333" />
                </TouchableOpacity>
              )}
            </View>

            {/* Pack Opening Animation */}
            {animationStep === 'opening' && (
              <View style={styles.packContainer}>
                <Animated.View
                  style={[
                    styles.boosterPack,
                    {
                      transform: [
                        { rotate: packRotation },
                        { scale: packScale }
                      ]
                    }
                  ]}
                >
                  <Ionicons name="gift" size={80} color="#FF6B35" />
                </Animated.View>
              </View>
            )}

            {/* Card Reveal Animation */}
            {(animationStep === 'revealing' || animationStep === 'complete') && (
              <ScrollView 
                style={styles.cardsContainer} 
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.cardsGrid}>
                  {pack.cards.map((card, index) => (
                    <Animated.View
                      key={`${card.id}-${index}`}
                      style={[
                        styles.cardWrapper,
                        {
                          opacity: cardAnimations[index],
                          transform: [
                            {
                              scale: cardAnimations[index].interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.3, 1],
                              })
                            },
                            {
                              rotateY: cardAnimations[index].interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: ['180deg', '90deg', '0deg'],
                              })
                            }
                          ]
                        }
                      ]}
                    >
                      <CardItem
                        card={card}
                        onPress={() => {}}
                        style={styles.revealCard}
                      />
                      {card.isNew && index < revealedCards && (
                        <View style={styles.newBadge}>
                          <Ionicons name="star" size={12} color="#8B4513" />
                          <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                      )}
                    </Animated.View>
                  ))}
                </View>


                {/* Pack Summary */}
                {animationStep === 'complete' && (
                  <View style={styles.summary}>
                    <View style={styles.summaryHeader}>
                      <Text style={styles.summaryTitle}>Pack Summary</Text>
                      <Text style={styles.summaryValue}>Total Value: {pack.totalValue} pts</Text>
                    </View>
                    
                    <View style={styles.rarityBreakdown}>
                      {Object.entries(pack.rarityBreakdown).map(([rarity, count]) => (
                        <View key={rarity} style={styles.rarityItem}>
                          <View style={[styles.rarityDot, { backgroundColor: getRarityGradient(rarity) }]} />
                          <Text style={styles.rarityText}>
                            {rarity}: {count}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.newCardsInfo}>
                      <Text style={styles.newCardsText}>
                        New cards: {pack.cards.filter(card => card.isNew).length}/{pack.cards.length}
                      </Text>
                    </View>
                  </View>
                )}
              </ScrollView>
            )}

            {/* Continue Button */}
            {animationStep === 'complete' && (
              <View style={styles.footer}>
                <TouchableOpacity style={styles.continueButton} onPress={handleClose}>
                  <Text style={styles.continueButtonText}>Continue Collecting</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  closeButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
  },
  packContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boosterPack: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardsContainer: {
    flex: 1,
    marginTop: 20,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 16, // Space for NEW badges on top row
  },
  cardWrapper: {
    width: (width - 32 - 12) / 2, // Account for padding and gap
    position: 'relative',
  },
  revealCard: {
    width: '100%',
  },
  newBadge: {
    position: 'absolute',
    top: -8,
    left: '50%',
    marginLeft: -25, // Half of minWidth to center it
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 50,
    justifyContent: 'center',
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#8B4513',
    textAlign: 'center',
  },
  summary: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryValue: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  rarityBreakdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  rarityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rarityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  rarityText: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
  newCardsInfo: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  newCardsText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 20,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});