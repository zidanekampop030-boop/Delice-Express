import React from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CONTENT_MAX, USE_NATIVE_DRIVER, color, space } from '@/design/tokens';
import { useLayout } from '@/hooks/useLayout';

/** Contenu centré, borné (largeur de lecture) et avec gouttières adaptatives. */
export function Container({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const { gutter } = useLayout();
  return <View style={[{ width: '100%', maxWidth: CONTENT_MAX, alignSelf: 'center', paddingHorizontal: gutter }, style]}>{children}</View>;
}

type ScreenProps = {
  children: React.ReactNode;
  /** Hauteur d'une barre d'action fixe en bas : réserve la place pour que le contenu ne passe jamais dessous. */
  bottomSpace?: number;
  /** Position de scroll partagée (parallaxe). */
  scrollY?: Animated.Value;
  contentStyle?: StyleProp<ViewStyle>;
};

export function Screen({ children, bottomSpace = 0, scrollY, contentStyle }: ScreenProps) {
  return (
    <Animated.ScrollView
      style={styles.flex}
      contentContainerStyle={[{ paddingBottom: space.xl + bottomSpace, flexGrow: 1 }, contentStyle]}
      onScroll={scrollY ? Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: USE_NATIVE_DRIVER }) : undefined}
      scrollEventThrottle={16}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </Animated.ScrollView>
  );
}

export const BOTTOM_BAR_HEIGHT = 84;

/** Barre d'action fixe (CTA principal). Respecte la zone de sécurité basse quand elle n'est pas déjà sous une tab bar. */
export function BottomBar({ children, safeBottom = true }: { children: React.ReactNode; safeBottom?: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: (safeBottom ? insets.bottom : 0) + space.sm + 4 }]}>
      <Container>{children}</Container>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: color.bg },
  bar: { backgroundColor: color.surface, borderTopWidth: 1, borderTopColor: color.border, paddingTop: space.sm + 4 },
});
