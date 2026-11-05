import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, space, type } from '@/design/tokens';

export function Eyebrow({ text, tone = 'light', center = false }: { text: string; tone?: 'light' | 'dark'; center?: boolean }) {
  const tint = tone === 'dark' ? color.accent : color.primary;
  return (
    <View style={[styles.row, center && { justifyContent: 'center' }]} accessible={false}>
      <View style={[styles.line, { backgroundColor: tint }]} />
      <Text style={[type.eyebrow, { color: tint }]}>{text.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm + 1 },
  line: { width: 28, height: 2 },
});
