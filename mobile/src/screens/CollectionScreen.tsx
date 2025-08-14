import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

import { CardGrid } from '../components/CardGrid';
import { CardModal } from '../components/CardModal';
import { Card, cardApi, CollectionStats } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

// Optimize constants
const RARITY_ORDER = { 'LEGENDARY': 5, 'EPIC': 4, 'RARE': 3, 'UNCOMMON': 2, 'COMMON': 1 };
const RARITY_COLORS = {
  COMMON: '#6B7280',
  UNCOMMON: '#10B981',
  RARE: '#3B82F6',
  EPIC: '#8B5CF6',
  LEGENDARY: '#FFA500',
};

type FilterType = 'all' | 'owned' | 'unowned';
type SortType = 'rarity' | 'name';

export function CollectionScreen() {
  const { theme } = useTheme();
  const [collection, setCollection] = useState<Card[]>([]);
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('rarity');
  const [isFiltering, setIsFiltering] = useState(false);

  const loadCollection = async (refresh: boolean = false) => {
    try {
      if (refresh) setRefreshing(true);
      
      const response = await cardApi.getUserCollection({});
      
      setCollection(response.collection);
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

  const handleCardPress = useCallback((card: Card) => {
    setSelectedCard(card);
  }, []);

  // Optimized filter change with loading state
  const handleFilterChange = useCallback((newFilter: FilterType) => {
    setIsFiltering(true);
    setFilter(newFilter);
    // Reset filtering state after a short delay
    setTimeout(() => setIsFiltering(false), 200);
  }, []);

  const handleSortChange = useCallback((newSort: SortType) => {
    setIsFiltering(true);
    setSortBy(newSort);
    // Reset filtering state after a short delay
    setTimeout(() => setIsFiltering(false), 200);
  }, []);

  // Memoize the filtered and sorted collection to avoid expensive re-computations
  const processedCollection = useMemo(() => {
    if (!collection.length) return collection;

    let filtered = [...collection];
    
    // Apply filter
    if (filter === 'owned') {
      filtered = filtered.filter(card => card.owned && card.owned.quantity > 0);
    } else if (filter === 'unowned') {
      filtered = filtered.filter(card => !card.owned || card.owned.quantity === 0);
    }

    // Apply sorting - optimized with pre-calculated constants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rarity':
          return RARITY_ORDER[b.rarity] - RARITY_ORDER[a.rarity];
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [collection, filter, sortBy]);

  // Calculate collection progress
  const collectionProgress = useMemo(() => {
    if (!collection.length || !stats) return null;

    const owned = collection.filter(card => card.owned && card.owned.quantity > 0);
    const byRarity = collection.reduce((acc, card) => {
      const isOwned = card.owned && card.owned.quantity > 0;
      if (!acc[card.rarity]) {
        acc[card.rarity] = { owned: 0, total: 0 };
      }
      acc[card.rarity].total++;
      if (isOwned) acc[card.rarity].owned++;
      return acc;
    }, {} as Record<string, { owned: number; total: number }>);

    return {
      totalOwned: owned.length,
      totalCards: collection.length,
      percentage: Math.round((owned.length / collection.length) * 100),
      byRarity
    };
  }, [collection, stats]);

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
            Open your first booster pack to start collecting World Tour cyclists
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
        
        {collectionProgress && (
          <View style={styles.progressContainer}>
            {/* Main progress */}
            <View style={styles.mainProgress}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${collectionProgress.percentage}%` }
                  ]} 
                />
              </View>
              <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
                {collectionProgress.totalOwned}/{collectionProgress.totalCards} cards ({collectionProgress.percentage}%)
              </Text>
            </View>

            {/* Rarity breakdown */}
            <View style={styles.rarityProgress}>
              {Object.entries(collectionProgress.byRarity)
                .sort(([a], [b]) => RARITY_ORDER[b] - RARITY_ORDER[a])
                .map(([rarity, data]) => (
                  <View key={rarity} style={styles.rarityItem}>
                    <View 
                      style={[
                        styles.rarityDot, 
                        { backgroundColor: RARITY_COLORS[rarity] }
                      ]} 
                    />
                    <Text style={[styles.rarityText, { color: theme.colors.textSecondary }]}>
                      {rarity[0]}: {data.owned}/{data.total}
                    </Text>
                  </View>
                ))}
            </View>
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
            onPress={() => handleFilterChange('all')}
          >
            <Text style={getFilterTextStyle('all')}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={getFilterButtonStyle('owned')} 
            onPress={() => handleFilterChange('owned')}
          >
            <Text style={getFilterTextStyle('owned')}>Owned</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={getFilterButtonStyle('unowned')} 
            onPress={() => handleFilterChange('unowned')}
          >
            <Text style={getFilterTextStyle('unowned')}>Missing</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === 'rarity' && styles.sortButtonActive]} 
            onPress={() => handleSortChange('rarity')}
          >
            <Ionicons name="star" size={16} color={sortBy === 'rarity' ? 'white' : '#666'} />
            <Text style={[styles.sortText, sortBy === 'rarity' && styles.sortTextActive]}>Rarity</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]} 
            onPress={() => handleSortChange('name')}
          >
            <Ionicons name="text" size={16} color={sortBy === 'name' ? 'white' : '#666'} />
            <Text style={[styles.sortText, sortBy === 'name' && styles.sortTextActive]}>Name</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Collection Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass" size={48} color="#ccc" />
          <Text style={styles.loadingText}>Loading collection...</Text>
        </View>
      ) : processedCollection.length > 0 ? (
        <View style={styles.gridContainer}>
          <CardGrid 
            cards={processedCollection}
            onCardPress={handleCardPress}
            style={styles.cardGrid}
          />
          {/* Filtering overlay */}
          {isFiltering && (
            <View style={styles.filteringOverlay}>
              <View style={styles.filteringIndicator}>
                <Ionicons name="funnel" size={20} color="#FF6B35" />
                <Text style={styles.filteringText}>Updating...</Text>
              </View>
            </View>
          )}
        </View>
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
    marginBottom: 12,
  },
  progressContainer: {
    gap: 12,
  },
  mainProgress: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rarityProgress: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  rarityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: '500',
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
  gridContainer: {
    flex: 1,
    position: 'relative',
  },
  cardGrid: {
    flex: 1,
  },
  filteringOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  filteringIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  filteringText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FF6B35',
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