import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { color, HIT, radius } from '@/design/tokens';
import { useInteraction } from '@/hooks/useMotion';
import { Icon, IconName } from './Icon';
import type { PressState } from './Button';

type Props = {
  icon: IconName;
  /** Obligatoire : un bouton-icône sans nom accessible est inutilisable au lecteur d'écran. */
  label: string;
  onPress: () => void;
  tone?: 'solid' | 'plain';
  disabled?: boolean;
};

export function IconButton({ icon, label, onPress, tone = 'solid', disabled }: Props) {
  const { progress, handlers } = useInteraction({ press: false });
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '12deg'] });
  const solid = tone === 'solid';

  return (
    <Pressable {...handlers} onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ disabled: !!disabled }}>
      {({ pressed, hovered }: PressState) => (
        <Animated.View
          style={[
            styles.base,
            solid && { backgroundColor: hovered ? color.primary : color.secondary },
            !solid && { backgroundColor: pressed || hovered ? color.surfaceAlt : 'transparent' },
            { opacity: disabled ? 0.4 : 1, transform: [{ rotate }, { scale: pressed ? 0.92 : 1 }] },
          ]}
        >
          <Icon name={icon} size={22} tint={solid ? color.onSecondary : color.text} />
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { width: HIT, height: HIT, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
});
