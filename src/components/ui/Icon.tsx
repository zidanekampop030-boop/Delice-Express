import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { color } from '@/design/tokens';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];

type Props = { name: IconName; size?: number; tint?: string; label?: string };

/** Icône vectorielle. Décorative (masquée aux lecteurs d'écran) sauf si `label` est fourni. */
export function Icon({ name, size = 22, tint = color.text, label }: Props) {
  const decorative = !label;
  return (
    <Ionicons
      name={name}
      size={size}
      color={tint}
      accessible={!decorative}
      accessibilityLabel={label}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'yes'}
    />
  );
}
