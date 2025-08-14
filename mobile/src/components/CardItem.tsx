import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Card {
  id: number;
  name: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  description?: string;
  nationality?: string;
  birthYear?: number;
  baseScore: number;
  owned?: {
    quantity: number;
    obtainedAt: string;
  } | null;
}

interface CardItemProps {
  card: Card;
  onPress: () => void;
  style?: any;
}

const RARITY_COLORS = {
  COMMON: '#6B7280',     // Gray
  UNCOMMON: '#10B981',   // Green
  RARE: '#3B82F6',       // Blue
  EPIC: '#8B5CF6',       // Purple
  LEGENDARY: '#FFA500',  // Orange
};

const RARITY_GRADIENTS = {
  COMMON: ['#6B7280', '#4B5563'],
  UNCOMMON: ['#10B981', '#059669'],
  RARE: ['#3B82F6', '#2563EB'],
  EPIC: ['#8B5CF6', '#7C3AED'],
  LEGENDARY: ['#FFA500', '#FF8C00'],
};

export const CardItem = React.memo(({ card, onPress, style }: CardItemProps) => {
  const rarityColor = RARITY_COLORS[card.rarity];
  const isOwned = card.owned && card.owned.quantity > 0;

  // For unowned cards, show minimal placeholder
  if (!isOwned) {
    return (
      <TouchableOpacity 
        style={[styles.container, styles.unownedContainer, { borderColor: rarityColor }, style]} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        {/* Rarity indicator */}
        <View style={[styles.rarityIndicator, { backgroundColor: rarityColor }]}>
          <Text style={styles.rarityText}>{card.rarity[0]}</Text>
        </View>

        {/* Mystery card placeholder */}
        <View style={styles.imageContainer}>
          <View style={[styles.mysteryCard, { backgroundColor: `${rarityColor}15` }]}>
            <View style={[styles.mysteryIcon, { borderColor: rarityColor }]}>
              <Ionicons name="person" size={32} color={rarityColor} />
            </View>
          </View>
        </View>

        {/* Minimal info */}
        <View style={styles.info}>
          <View style={styles.mysteryDetails}>
            <Text style={[styles.rarity, { color: rarityColor }]}>
              {card.rarity}
            </Text>
            <Text style={styles.score}>{card.baseScore}pt</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // For owned cards, show full details
  return (
    <TouchableOpacity 
      style={[styles.container, { borderColor: rarityColor }, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Rarity indicator */}
      <View style={[styles.rarityIndicator, { backgroundColor: rarityColor }]}>
        <Text style={styles.rarityText}>{card.rarity[0]}</Text>
      </View>

      {/* Card placeholder */}
      <View style={styles.imageContainer}>
        <View style={[styles.placeholderImage, { backgroundColor: `${rarityColor}20` }]}>
          <Ionicons name="person" size={40} color={rarityColor} />
        </View>
        
        {/* Owned indicator */}
        <View style={styles.ownedBadge}>
          <Text style={styles.ownedText}>x{card.owned!.quantity}</Text>
        </View>
      </View>

      {/* Card info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{card.name}</Text>
        <View style={styles.details}>
          {card.nationality && (
            <Text style={styles.nationality}>{card.nationality}</Text>
          )}
        </View>
        <View style={styles.footer}>
          <Text style={[styles.rarity, { color: rarityColor }]}>
            {card.rarity}
          </Text>
          <Text style={styles.score}>{card.baseScore}pt</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.card.id === nextProps.card.id &&
    prevProps.card.owned?.quantity === nextProps.card.owned?.quantity
  );
});

CardItem.displayName = 'CardItem';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
  },
  unownedContainer: {
    backgroundColor: '#f8f9fa',
    opacity: 0.8,
  },
  rarityIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  rarityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 3/4,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownedBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  ownedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notOwnedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nationality: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rarity: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  score: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  // Mystery card styles
  mysteryCard: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mysteryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  mysteryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
});