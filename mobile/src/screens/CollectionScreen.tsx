import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { CardGrid } from '../components/CardGrid';
import { CardModal } from '../components/CardModal';
import { Card, cardApi, CollectionStats } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

type FilterType = 'all' | 'owned' | 'unowned';
type SortType = 'rarity' | 'name' | 'sport' | 'score';

export function CollectionScreen() {
  const { theme } = useTheme();
  const [collection, setCollection] = useState<Card[]>([]);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('rarity');

  const loadCollection = async (refresh: boolean = false) => {
    try {
      if (refresh) setRefreshing(true);
      
      const filters = filter === 'owned' ? { owned: true } : {};
      const response = await cardApi.getUserCollection(filters);
      
      let sortedCollection = [...response.collection];
      
      // Apply sorting
      sortedCollection.sort((a, b) => {
        switch (sortBy) {
          case 'rarity':
            const rarityOrder = { 'LEGENDARY': 5, 'EPIC': 4, 'RARE': 3, 'UNCOMMON': 2, 'COMMON': 1 };
            return rarityOrder[b.rarity] - rarityOrder[a.rarity];
          case 'name':
            return a.name.localeCompare(b.name);
          case 'sport':
            return a.sport.localeCompare(b.sport);
          case 'score':
            return b.baseScore - a.baseScore;
          default:
            return 0;
        }
      });

      // Apply filter
      if (filter === 'owned') {
        sortedCollection = sortedCollection.filter(card => card.owned && card.owned.quantity > 0);
      } else if (filter === 'unowned') {
        sortedCollection = sortedCollection.filter(card => !card.owned || card.owned.quantity === 0);
      }

      setCollection(sortedCollection);
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to load collection:', error);
      Alert.alert('Error', 'Failed to load your collection. Please try again.');
    } finally {
      setLoading(false);
      if (refresh) setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCollection();
    }, [filter, sortBy])
  );

  const handleRefresh = () => {
    loadCollection(true);
  };

  const handleCardPress = (card: Card) => {
    setSelectedCard(card);
  };

  const getFilterButtonStyle = (filterType: FilterType) => [
    styles.filterButton,
    filter === filterType && styles.filterButtonActive
  ];

  const getFilterTextStyle = (filterType: FilterType) => [
    styles.filterButtonText,
    filter === filterType && styles.filterButtonTextActive
  ];

  const renderEmptyState = () => {
    if (filter === 'owned') {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="grid-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No cards owned yet!</Text>
          <Text style={styles.emptySubtitle}>
            Open your first booster pack to start collecting legendary athletes
          </Text>
        </View>
      );
    } else if (filter === 'unowned') {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-circle-outline" size={64} color="#10B981" />
          <Text style={styles.emptyTitle}>Collection Complete!</Text>
          <Text style={styles.emptySubtitle}>
            You've collected all available cards. Amazing!
          </Text>
        </View>
      );
    } else {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="hourglass" size={48} color="#ccc" />
          <Text style={styles.emptyTitle}>Loading collection...</Text>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>My Collection</Text>
        {stats && (
          <View style={styles.stats}>
            <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
              {stats.uniqueCards}/{stats.rarityBreakdown.COMMON.total + 
                stats.rarityBreakdown.UNCOMMON.total + 
                stats.rarityBreakdown.RARE.total + 
                stats.rarityBreakdown.EPIC.total + 
                stats.rarityBreakdown.LEGENDARY.total} cards
            </Text>
            <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>Score: {stats.collectionScore}</Text>
          </View>
        )}
      </View>

      {/* Filters */}
      <View style={[styles.filterContainer, { backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border }]}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filterRow}
        >
          <TouchableOpacity 
            style={getFilterButtonStyle('all')} 
            onPress={() => setFilter('all')}
          >
            <Text style={getFilterTextStyle('all')}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={getFilterButtonStyle('owned')} 
            onPress={() => setFilter('owned')}
          >
            <Text style={getFilterTextStyle('owned')}>Owned</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={getFilterButtonStyle('unowned')} 
            onPress={() => setFilter('unowned')}
          >
            <Text style={getFilterTextStyle('unowned')}>Missing</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === 'rarity' && styles.sortButtonActive]} 
            onPress={() => setSortBy('rarity')}
          >
            <Ionicons name="star" size={16} color={sortBy === 'rarity' ? 'white' : '#666'} />
            <Text style={[styles.sortText, sortBy === 'rarity' && styles.sortTextActive]}>Rarity</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]} 
            onPress={() => setSortBy('name')}
          >
            <Ionicons name="text" size={16} color={sortBy === 'name' ? 'white' : '#666'} />
            <Text style={[styles.sortText, sortBy === 'name' && styles.sortTextActive]}>Name</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === 'sport' && styles.sortButtonActive]} 
            onPress={() => setSortBy('sport')}
          >
            <Ionicons name="fitness" size={16} color={sortBy === 'sport' ? 'white' : '#666'} />
            <Text style={[styles.sortText, sortBy === 'sport' && styles.sortTextActive]}>Sport</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Collection Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass" size={48} color="#ccc" />
          <Text style={styles.loadingText}>Loading collection...</Text>
        </View>
      ) : collection.length > 0 ? (
        <CardGrid 
          cards={collection}
          onCardPress={handleCardPress}
          style={styles.cardGrid}
        />
      ) : (
        <ScrollView 
          style={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {renderEmptyState()}
        </ScrollView>
      )}

      {/* Card Modal */}
      <CardModal 
        card={selectedCard}
        visible={!!selectedCard}
        onClose={() => setSelectedCard(null)}
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
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  filterContainer: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    maxHeight: 60, // Limit the height
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 8,
    minHeight: 48, // Ensure minimum touch target size
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    gap: 4,
  },
  sortButtonActive: {
    backgroundColor: '#FF6B35',
  },
  sortText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  sortTextActive: {
    color: 'white',
  },
  cardGrid: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    gap: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});