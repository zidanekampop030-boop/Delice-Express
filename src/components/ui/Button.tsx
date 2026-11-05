import React from 'react';
import { Animated, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { color, elevation, font, radius, space } from '@/design/tokens';
import { useInteraction } from '@/hooks/useMotion';
import { Icon, IconName } from './Icon';

export type PressState = { pressed: boolean; hovered?: boolean };
type Variant = 'primary' | 'secondary' | 'accent' | 'whatsapp' | 'ghost';

const VARIANTS: Record<Variant, { bg: string; fg: string; raised?: boolean; border?: string }> = {
  primary: { bg: color.primary, fg: color.onPrimary, raised: true },
  secondary: { bg: color.secondary, fg: color.onSecondary },
  accent: { bg: color.accent, fg: color.onAccent },
  whatsapp: { bg: color.whatsapp, fg: color.onWhatsapp },
  ghost: { bg: 'transparent', fg: color.text, border: color.borderStrong },
};

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  icon?: IconName;
  iconRight?: IconName;
  fullWidth?: boolean;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Bouton : se soulève au survol (web), s'enfonce à l'appui. Les transformations ne déplacent jamais la mise en page. */
export function Button({ label, onPress, variant = 'primary', icon, iconRight, fullWidth, disabled, accessibilityLabel, style }: Props) {
  const { progress, handlers } = useInteraction({ press: false });
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -3] });
  const v = VARIANTS[variant];

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled }}
      style={fullWidth ? styles.stretch : undefined}
    >
      {({ pressed }: PressState) => (
        <Animated.View
          style={[
            styles.base,
            { backgroundColor: v.bg, opacity: disabled ? 0.45 : pressed ? 0.92 : 1, transform: [{ translateY }, { scale: pressed ? 0.97 : 1 }] },
            v.raised && !disabled && elevation.button,
            v.border ? { borderWidth: 1.5, borderColor: v.border } : null,
            style,
          ]}
        >
          {icon ? <Icon name={icon} size={20} tint={v.fg} /> : null}
          <Text style={[styles.text, { color: v.fg }]}>{label}</Text>
          {iconRight ? <Icon name={iconRight} size={20} tint={v.fg} /> : null}
        </Animated.View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  stretch: { alignSelf: 'stretch' },
  base: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
    paddingVertical: 12,
    borderRadius: radius.pill,
  },
  text: { fontFamily: font.sansBold, fontSize: 16, lineHeight: 22 },
});
