import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CONTENT_MAX, clamp, color, elevation, radius, space, type } from '@/design/tokens';
import { images } from '@/assets/images';
import { BUSINESS } from '@/features/menu/data';
import { useLayout } from '@/hooks/useLayout';
import { useEntrance, useLoop } from '@/hooks/useMotion';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Icon, IconName } from '@/components/ui/Icon';
import { InteractiveImage } from '@/components/motion/InteractiveImage';

function FloatingTag({ title, sub, icons, style, rotate, float, enter, range = 8 }: {
  title: string; sub: string; icons: IconName[]; style: object; rotate: string; float: Animated.Value; enter: Animated.Value; range?: number;
}) {
  const translateY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -range] });
  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  const opacity = enter.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: 'clamp' });
  return (
    // Décor : ignoré par les lecteurs d'écran, ne capte aucun toucher.
    <Animated.View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.tag, style, { opacity, transform: [{ rotate }, { translateY }, { scale }] }]}>
      <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
        {icons.map((n) => <Icon key={n} name={n} size={18} tint={color.primary} />)}
        <Text style={styles.tagTitle}>{title}</Text>
      </View>
      <Text style={styles.tagSub}>{sub}</Text>
    </Animated.View>
  );
}

export function Hero({ onMenu, onWhatsApp }: { onMenu: () => void; onWhatsApp: () => void }) {
  const insets = useSafeAreaInsets();
  const { width, compact, gutter, contentWidth } = useLayout();
  const row = !compact;

  const visualW = row ? (contentWidth - space.xl) / 2 : contentWidth;
  const photoW = Math.min(520, row ? visualW : visualW * 0.9);
  const photoH = compact ? 330 : 440;
  const top = photoW * 0.46;
  const h1 = compact ? clamp(46, width * 0.12, 64) : clamp(54, width * 0.058, 92);

  // Un seul moment orchestré à l'ouverture : texte, puis photo, puis pastilles.
  const copyIn = useEntrance({ delay: 80, duration: 800 });
  const photoIn = useEntrance({ delay: 220, duration: 1100 });
  const tagsIn = useEntrance({ delay: 900, spring: true });
  const floatPhoto = useLoop({ duration: 3600 });
  const floatA = useLoop({ duration: 3000, delay: 400 });
  const floatB = useLoop({ duration: 3800, delay: 900 });
  const spin = useLoop({ duration: 5000 });

  const copyY = copyIn.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });
  const photoY = photoIn.interpolate({ inputRange: [0, 1], outputRange: [36, 0] });
  const photoScale = photoIn.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });
  const photoRot = photoIn.interpolate({ inputRange: [0, 1], outputRange: ['-6deg', '0deg'] });
  const floatY = floatPhoto.interpolate({ inputRange: [0, 1], outputRange: [0, -10] });
  const sparkRot = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] });

  return (
    <View style={styles.hero}>
      <LinearGradient colors={[color.bg, '#FFF1DF']} start={{ x: 0.2, y: 0 }} end={{ x: 1, y: 0.3 }} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={StyleSheet.absoluteFill} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        <View style={[styles.glow, { width: 560, height: 560, borderRadius: 280 }]} />
        <View style={styles.ring} />
      </View>

      <View style={[styles.inner, { paddingHorizontal: gutter, paddingTop: insets.top + space.md, paddingBottom: compact ? space.xxl : 72 }]}>
        {/* Marque (remplace l'en-tête sur l'accueil) */}
        <View style={styles.brand} accessible accessibilityRole="header" accessibilityLabel={`${BUSINESS.name}, ${BUSINESS.tagline}`}>
          <View style={styles.logoMark}>
            <Icon name="restaurant" size={22} tint={color.text} />
          </View>
          <View>
            <Text style={styles.logoName}>{BUSINESS.name}</Text>
            <Text style={styles.logoTag}>{BUSINESS.tagline.toUpperCase()}</Text>
          </View>
        </View>

        <View style={[styles.cols, row ? { flexDirection: 'row', alignItems: 'center', gap: space.xl } : { gap: space.lg }]}>
          <Animated.View style={[row ? { flex: 1 } : null, { opacity: copyIn, transform: [{ translateY: copyY }] }]}>
            <Eyebrow text="Du plaisir, sans attendre" />
            <Text accessibilityRole="header" style={[styles.h1, { fontSize: h1, lineHeight: h1 * 1.04, letterSpacing: -h1 * 0.05 }]}>
              {'Une envie.\nUn '}
              <Text style={{ color: color.primary }}>délice.</Text>
              {'\nUn sourire.'}
            </Text>
            <Text style={styles.lead}>
              Craquez pour nos shawarmas généreux, notre popcorn croustillant et nos glaces irrésistibles. Chez Délice Express, chaque pause devient un bon moment.
            </Text>
            <View style={styles.actions}>
              <Button label="Voir le menu" iconRight="arrow-forward" onPress={onMenu} />
              <Button label="Commander sur WhatsApp" icon="logo-whatsapp" variant="ghost" onPress={onWhatsApp} />
            </View>
          </Animated.View>

          <View style={[styles.visual, row ? { flex: 1 } : null, { minHeight: compact ? photoH + 40 : photoH + 60 }]}>
            <Animated.View pointerEvents="none" style={[styles.spark, { right: '4%', top: '2%', transform: [{ rotate: sparkRot }] }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
              <Icon name="sparkles" size={36} tint={color.accent} />
            </Animated.View>
            <Animated.View style={{ opacity: photoIn, transform: [{ translateY: photoY }, { translateY: floatY }, { scale: photoScale }, { rotate: photoRot }] }}>
              <InteractiveImage
                source={images.hero}
                label="Assortiment gourmand de Délice Express : shawarma, popcorn et glaces"
                style={{ width: photoW, height: photoH }}
                radii={{ borderTopLeftRadius: top, borderTopRightRadius: top, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}
                borderWidth={9}
                borderColor="rgba(255,255,255,0.85)"
                withShadow
                zoom={1.08}
                lift={8}
                restRotate={2}
                hoverRotate={-1}
              />
            </Animated.View>
            <FloatingTag title="Fait pour se régaler" sub="Des saveurs qui donnent envie" icons={['heart']} style={{ left: compact ? 0 : -8, top: compact ? 40 : 70 }} rotate="-5deg" float={floatA} enter={tagsIn} />
            <FloatingTag title="Trois plaisirs" sub="Une seule adresse" icons={['fast-food', 'ice-cream', 'restaurant']} style={{ right: compact ? 0 : -4, bottom: compact ? 16 : 40 }} rotate="4deg" float={floatB} enter={tagsIn} range={10} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', overflow: 'hidden' },
  inner: { width: '100%', maxWidth: CONTENT_MAX, alignSelf: 'center', gap: space.lg },
  glow: { position: 'absolute', right: -140, top: 80, backgroundColor: 'rgba(255,205,150,0.2)' },
  ring: { position: 'absolute', right: '8%', top: '16%', width: 420, height: 420, borderRadius: 210, borderWidth: 1, borderColor: 'rgba(244,119,53,0.2)' },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  logoMark: { width: 44, height: 44, borderRadius: 14, backgroundColor: color.brand, alignItems: 'center', justifyContent: 'center', ...elevation.button },
  logoName: { fontFamily: 'DMSans_800ExtraBold', fontSize: 20, letterSpacing: -0.8, color: color.text },
  logoTag: { ...type.caption, fontSize: 11, letterSpacing: 1.6, color: color.textMuted },
  cols: { marginTop: space.md },
  h1: { fontFamily: 'PlayfairDisplay_700Bold', color: color.text, marginTop: space.md },
  lead: { ...type.body, fontSize: 17, lineHeight: 28, color: color.textMuted, maxWidth: 500, marginTop: space.lg - 4, marginBottom: space.lg },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md - 4, alignItems: 'center' },
  visual: { alignItems: 'center', justifyContent: 'center' },
  spark: { position: 'absolute' },
  tag: { position: 'absolute', backgroundColor: color.surface, paddingVertical: 12, paddingHorizontal: 16, borderRadius: radius.lg, ...elevation.card },
  tagTitle: { fontFamily: 'DMSans_800ExtraBold', fontSize: 15, color: color.text },
  tagSub: { ...type.caption, color: color.textMuted, marginTop: 2 },
});
