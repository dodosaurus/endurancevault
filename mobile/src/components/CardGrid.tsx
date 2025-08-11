import React from 'react';
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

export function CardGrid({ 
  cards, 
  onCardPress, 
  numColumns = 2,
  style 
}: CardGridProps) {
  const cardWidth = (width - PADDING * 2 - CARD_SPACING * (numColumns - 1)) / numColumns;

  const renderCard = ({ item, index }: { item: Card; index: number }) => {
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
  };

  return (
    <FlatList
      data={cards}
      renderItem={renderCard}
      numColumns={numColumns}
      keyExtractor={(item) => item.id.toString()}
      style={[styles.container, style]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

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