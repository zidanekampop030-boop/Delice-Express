import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space, type } from '@/design/tokens';
import { Button } from './Button';
import { Icon, IconName } from './Icon';

type Props = { icon: IconName; title: string; message: string; actionLabel: string; onAction: () => void };

/** État vide actionnable : explique la situation et propose la prochaine étape. */
export function EmptyState({ icon, title, message, actionLabel, onAction }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <Icon name={icon} size={36} tint={color.primary} />
      </View>
      <Text style={styles.title} accessibilityRole="header">{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <Button label={actionLabel} onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: space.md, paddingVertical: space.xxl, paddingHorizontal: space.lg, maxWidth: 420, alignSelf: 'center' },
  badge: { width: 80, height: 80, borderRadius: radius.pill, backgroundColor: color.primaryTint, alignItems: 'center', justifyContent: 'center' },
  title: { ...type.title, color: color.text, textAlign: 'center' },
  message: { ...type.body, color: color.textMuted, textAlign: 'center', marginBottom: space.sm },
});
