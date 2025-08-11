import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from './CardItem';

interface CardModalProps {
  card: Card | null;
  visible: boolean;
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

const RARITY_BACKGROUNDS = {
  COMMON: 'linear-gradient(135deg, #6B7280 0%, #4B5563 100%)',
  UNCOMMON: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
  RARE: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
  EPIC: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  LEGENDARY: 'linear-gradient(135deg, #FFA500 0%, #FF8C00 100%)',
};

export function CardModal({ card, visible, onClose }: CardModalProps) {
  if (!card) return null;

  const rarityColor = RARITY_COLORS[card.rarity];
  const isOwned = card.owned && card.owned.quantity > 0;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="overFullScreen"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Card Image */}
              <View style={[styles.cardContainer, { borderColor: rarityColor }]}>
                {card.imageUrl ? (
                  <Image 
                    source={{ uri: card.imageUrl }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.placeholderImage, { backgroundColor: `${rarityColor}20` }]}>
                    <Ionicons name="person" size={80} color={rarityColor} />
                  </View>
                )}
                
                {/* Rarity Badge */}
                <View style={[styles.rarityBadge, { backgroundColor: rarityColor }]}>
                  <Text style={styles.rarityBadgeText}>{card.rarity}</Text>
                </View>

                {/* Owned Status */}
                {isOwned ? (
                  <View style={styles.ownedStatusOwned}>
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                    <Text style={styles.ownedStatusTextOwned}>x{card.owned!.quantity}</Text>
                  </View>
                ) : (
                  <View style={styles.ownedStatusNotOwned}>
                    <Ionicons name="lock-closed" size={20} color="#EF4444" />
                    <Text style={styles.ownedStatusTextNotOwned}>Not Owned</Text>
                  </View>
                )}
              </View>

              {/* Card Details */}
              <View style={styles.details}>
                <Text style={styles.cardName}>{card.name}</Text>
                
                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Sport</Text>
                    <Text style={styles.detailValue}>{card.sport}</Text>
                  </View>
                  {card.nationality && (
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Country</Text>
                      <Text style={styles.detailValue}>{card.nationality}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.detailRow}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Rarity</Text>
                    <Text style={[styles.detailValue, { color: rarityColor }]}>
                      {card.rarity}
                    </Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Score</Text>
                    <Text style={styles.detailValue}>{card.baseScore} pts</Text>
                  </View>
                </View>

                {card.birthYear && (
                  <View style={styles.detailRow}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Born</Text>
                      <Text style={styles.detailValue}>{card.birthYear}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Age</Text>
                      <Text style={styles.detailValue}>
                        {new Date().getFullYear() - card.birthYear}
                      </Text>
                    </View>
                  </View>
                )}

                {card.description && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionLabel}>Achievements</Text>
                    <Text style={styles.description}>{card.description}</Text>
                  </View>
                )}

                {isOwned && card.owned && (
                  <View style={styles.ownedInfo}>
                    <Text style={styles.ownedInfoLabel}>First Obtained</Text>
                    <Text style={styles.ownedInfoValue}>
                      {new Date(card.owned.obtainedAt).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  cardContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 3,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    aspectRatio: 3/4,
  },
  placeholderImage: {
    width: '100%',
    aspectRatio: 3/4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rarityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rarityBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  ownedStatusOwned: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ownedStatusNotOwned: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ownedStatusTextOwned: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#10B981',
  },
  ownedStatusTextNotOwned: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  details: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 20,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  descriptionLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  ownedInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  ownedInfoLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  ownedInfoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
});