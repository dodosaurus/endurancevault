import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function ThemeToggle({ showLabel = false, size = 'medium' }: ThemeToggleProps) {
  const { theme, isDark, toggleTheme } = useTheme();

  const iconSizes = {
    small: 20,
    medium: 24,
    large: 32,
  };

  const containerSizes = {
    small: 32,
    medium: 40,
    large: 48,
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            width: containerSizes[size],
            height: containerSizes[size],
          },
        ]}
        onPress={toggleTheme}
        accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        accessibilityRole="button"
      >
        <Ionicons
          name={isDark ? 'sunny' : 'moon'}
          size={iconSizes[size]}
          color={theme.colors.accent}
        />
      </TouchableOpacity>
      
      {showLabel && (
        <Text style={[styles.label, { color: theme.colors.text }]}>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 4,
  },
  toggleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});