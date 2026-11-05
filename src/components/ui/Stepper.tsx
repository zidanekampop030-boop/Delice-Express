import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, font, space } from '@/design/tokens';
import { IconButton } from './IconButton';

type Props = {
  value: number;
  onChange: (next: number) => void;
  /** Nom de l'article, utilisé pour les libellés d'accessibilité. */
  name: string;
  /** Si vrai, descendre sous 1 retire l'article (icône corbeille). */
  removable?: boolean;
  max?: number;
};

export function Stepper({ value, onChange, name, removable = false, max = 99 }: Props) {
  const atMin = value <= 1;
  return (
    <View style={styles.row}>
      <IconButton
        tone="plain"
        icon={removable && atMin ? 'trash-outline' : 'remove'}
        label={removable && atMin ? `Retirer ${name} du panier` : `Retirer un ${name}`}
        disabled={!removable && atMin}
        onPress={() => onChange(value - 1)}
      />
      <Text style={styles.value} accessibilityLiveRegion="polite" accessibilityLabel={`Quantité : ${value}`}>
        {value}
      </Text>
      <IconButton tone="plain" icon="add" label={`Ajouter un ${name}`} disabled={value >= max} onPress={() => onChange(value + 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: space.xs, backgroundColor: color.surface, borderRadius: 999, borderWidth: 1, borderColor: color.border },
  value: { minWidth: 28, textAlign: 'center', fontFamily: font.sansBold, fontSize: 17, color: color.text },
});
