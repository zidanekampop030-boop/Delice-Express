import React from 'react';
import { Animated, ImageSourcePropType, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, elevation, font } from '@/design/tokens';
import { useInteraction } from '@/hooks/useMotion';

type Radii = Pick<ViewStyle, 'borderRadius' | 'borderTopLeftRadius' | 'borderTopRightRadius' | 'borderBottomLeftRadius' | 'borderBottomRightRadius'>;

type Props = {
  source: ImageSourcePropType;
  /** Description de l'image pour les lecteurs d'écran. */
  label: string;
  style?: StyleProp<ViewStyle>;
  radii?: Radii;
  borderWidth?: number;
  borderColor?: string;
  withShadow?: boolean;
  zoom?: number;
  lift?: number;
  restRotate?: number;
  hoverRotate?: number;
  caption?: string;
  /** Progression fournie par un parent (carte entière) : survoler la carte anime l'image. */
  progress?: Animated.Value;
  onPress?: () => void;
};

/**
 * Image interactive : zoom interne (le cadre reste en place), élévation + rotation du cadre,
 * voile dégradé et pastille qui glisse. Survol sur le web, appui sur mobile.
 */
export function InteractiveImage({
  source,
  label,
  style,
  radii,
  borderWidth = 0,
  borderColor = color.surface,
  withShadow = false,
  zoom = 1.1,
  lift = 0,
  restRotate = 0,
  hoverRotate = 0,
  caption,
  progress: external,
  onPress,
}: Props) {
  const own = useInteraction();
  const progress = external ?? own.progress;
  const handlers = external ? undefined : own.handlers;

  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, zoom] });
  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -lift] });
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: [`${restRotate}deg`, `${hoverRotate}deg`] });
  const veil = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: 'clamp' });
  const chipY = progress.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  return (
    <Pressable
      {...handlers}
      onPress={onPress}
      accessible={!!onPress}
      accessibilityRole={onPress ? 'imagebutton' : undefined}
      accessibilityLabel={label}
      style={style}
    >
      {/* Calque 1 : ombre + transformations (sans overflow:hidden, sinon l'ombre iOS est coupée) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          radii,
          withShadow ? [{ backgroundColor: borderColor }, elevation.card] : null,
          { transform: [{ translateY }, { rotate }] },
        ]}
      >
        {/* Calque 2 : cadre arrondi qui découpe l'image */}
        <View style={[StyleSheet.absoluteFill, radii, { overflow: 'hidden', borderWidth, borderColor }]}>
          <Animated.Image
            source={source}
            accessible={!onPress}
            accessibilityLabel={label}
            resizeMode="cover"
            style={[StyleSheet.absoluteFill, { width: '100%', height: '100%', transform: [{ scale }] }]}
          />
          <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { opacity: veil }]}>
            <LinearGradient colors={['rgba(36,27,22,0)', 'rgba(36,27,22,0.5)']} style={StyleSheet.absoluteFill} />
          </Animated.View>
          {caption ? (
            <Animated.View pointerEvents="none" style={[styles.chip, { opacity: veil, transform: [{ translateY: chipY }] }]}>
              <Text style={styles.chipText}>{caption}</Text>
            </Animated.View>
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { position: 'absolute', left: 14, bottom: 14, backgroundColor: color.accent, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
  chipText: { fontFamily: font.sansBold, fontSize: 13, color: color.onAccent },
});
