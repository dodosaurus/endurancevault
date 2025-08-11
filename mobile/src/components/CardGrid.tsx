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
        onPress={() => onCardPress(item)}
        style={cardStyle}
      />
    );
  }, [cardWidth, numColumns, onCardPress]);

  const keyExtractor = useCallback((item: Card) => item.id.toString(), []);

  const getItemLayout = useCallback((data: Card[] | null | undefined, index: number) => {
    const itemHeight = cardWidth * (4/3) + 80; // image aspect ratio + info section
    const rowIndex = Math.floor(index / numColumns);
    const offset = rowIndex * (itemHeight + CARD_SPACING) + 16; // 16 is top padding
    
    return {
      length: itemHeight,
      offset,
      index,
    };
  }, [cardWidth, numColumns]);

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
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={6}
      windowSize={10}
      legacyImplementation={false}
    />
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