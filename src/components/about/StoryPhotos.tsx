import React, { useMemo, useState } from 'react';
import { Animated, LayoutChangeEvent, StyleSheet } from 'react-native';
import { images } from '@/assets/images';
import { radius } from '@/design/tokens';
import { useLayout } from '@/hooks/useLayout';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { InteractiveImage } from '@/components/motion/InteractiveImage';

/**
 * Deux photos en parallaxe inversée, pilotées par le scroll, qui apparaissent progressivement.
 * Prérequis : le bloc doit avoir pour ancêtre un conteneur placé à y = 0 dans le ScrollView.
 */
export function StoryPhotos({ scrollY }: { scrollY: Animated.Value }) {
  const { height, compact } = useLayout();
  const reduce = useReduceMotion();
  const [box, setBox] = useState({ y: 0, h: 0 });

  const { mainY, smallY, reveal } = useMemo(() => {
    if (reduce) return { mainY: 0, smallY: 0, reveal: 1 };
    const t = scrollY.interpolate({ inputRange: [box.y - height, box.y + box.h + 1], outputRange: [0, 1], extrapolate: 'clamp' });
    return {
      mainY: t.interpolate({ inputRange: [0, 1], outputRange: [36, -36] }),
      smallY: t.interpolate({ inputRange: [0, 1], outputRange: [-28, 44] }),
      reveal: scrollY.interpolate({ inputRange: [box.y - height * 0.95, box.y - height * 0.55], outputRange: [0, 1], extrapolate: 'clamp' }),
    };
  }, [scrollY, reduce, box, height]);

  const onLayout = (e: LayoutChangeEvent) => setBox({ y: e.nativeEvent.layout.y, h: e.nativeEvent.layout.height });

  return (
    <Animated.View onLayout={onLayout} style={{ height: compact ? 390 : 460, opacity: reveal }}>
      <Animated.View style={[styles.main, { height: compact ? 320 : 380, transform: [{ translateY: mainY }] }]}>
        <InteractiveImage source={images.storyMain} label="Sélection de gourmandises Délice Express" style={StyleSheet.absoluteFill} radii={{ borderRadius: radius.xl - 1 }} borderWidth={8} withShadow zoom={1.08} lift={6} hoverRotate={-1.5} />
      </Animated.View>
      <Animated.View style={[styles.small, { height: compact ? 185 : 220, transform: [{ translateY: smallY }] }]}>
        <InteractiveImage source={images.storySmall} label="Dessert glacé gourmand" style={StyleSheet.absoluteFill} radii={{ borderRadius: 22 }} borderWidth={8} withShadow zoom={1.1} lift={8} hoverRotate={2} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  main: { position: 'absolute', left: 0, top: 0, width: '72%' },
  small: { position: 'absolute', right: 0, bottom: 0, width: '48%' },
});
