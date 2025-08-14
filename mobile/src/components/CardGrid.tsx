import React, { useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { CardItem, Card } from './CardItem';

interface CardGridProps {
  cards: Card[];
  onCardPress: (card: Card) => void;
  numColumns?: number;
  style?: any;
}

const { width } = Dimensions.get('window');
const PADDING = 16;
const CARD_SPACING = 12;

export const CardGrid = React.memo(({ 
  cards, 
  onCardPress, 
  numColumns = 2,
  style 
}: CardGridProps) => {
  const cardWidth = useMemo(() => 
    (width - PADDING * 2 - CARD_SPACING * (numColumns - 1)) / numColumns,
    [numColumns]
  );

  const itemHeight = useMemo(() => 
    cardWidth * (4/3) + 80, // image aspect ratio + info section
    [cardWidth]
  );

  const renderCard = useCallback(({ item, index }: { item: Card; index: number }) => {
    const isLastInRow = (index + 1) % numColumns === 0;
    const cardStyle = {
      width: cardWidth,
      marginRight: isLastInRow ? 0 : CARD_SPACING,
      marginBottom: CARD_SPACING,
    };

    return (
      <CardItem
        card={item}
        onPress={onCardPress}
        style={cardStyle}
      />
    );
  }, [cardWidth, numColumns, onCardPress]);

  const keyExtractor = useCallback((item: Card) => `card-${item.id}`, []);

  const getItemLayout = useCallback((data: Card[] | null | undefined, index: number) => {
    const rowIndex = Math.floor(index / numColumns);
    const offset = rowIndex * (itemHeight + CARD_SPACING) + 16; // 16 is top padding
    
    return {
      length: itemHeight,
      offset,
      index,
    };
  }, [itemHeight, numColumns]);

  return (
    <FlatList
      data={cards}
      renderItem={renderCard}
      numColumns={numColumns}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true}
      maxToRenderPerBatch={8}
      updateCellsBatchingPeriod={100}
      initialNumToRender={8}
      windowSize={5}
      legacyImplementation={false}
      disableVirtualization={false}
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  return (
    prevProps.cards.length === nextProps.cards.length &&
    prevProps.numColumns === nextProps.numColumns &&
    prevProps.cards.every((card, index) => 
      card.id === nextProps.cards[index]?.id &&
      card.owned?.quantity === nextProps.cards[index]?.owned?.quantity
    )
  );
});

CardGrid.displayName = 'CardGrid';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: PADDING,
    paddingTop: 16,
    paddingBottom: 32,
  },
});