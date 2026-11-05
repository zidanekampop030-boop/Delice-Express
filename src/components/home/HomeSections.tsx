import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { clamp, color, font, radius, space, type } from '@/design/tokens';
import { PRODUCTS, Product, fromPrice } from '@/features/menu/data';
import { formatMoney } from '@/lib/format';
import { useInteraction } from '@/hooks/useMotion';
import { useLayout } from '@/hooks/useLayout';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Layout';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Icon, IconName } from '@/components/ui/Icon';
import { InteractiveImage } from '@/components/motion/InteractiveImage';

function CategoryTile({ product, width, onPress }: { product: Product; width?: number; onPress: () => void }) {
  const { progress, handlers } = useInteraction();
  return (
    <Pressable {...handlers} onPress={onPress} accessibilityRole="link" accessibilityLabel={`${product.title}, dès ${formatMoney(fromPrice(product))}`} style={width ? { width } : { width: '100%' }}>
      <InteractiveImage progress={progress} source={product.image} label={product.alt} style={{ width: '100%', height: 210 }} radii={{ borderRadius: radius.xl }} zoom={1.12} lift={6} />
      <View style={styles.tileText}>
        <View style={{ flex: 1 }}>
          <Text style={styles.tileTitle}>{product.title}</Text>
          <Text style={styles.tilePrice}>Dès {formatMoney(fromPrice(product))}</Text>
        </View>
        <Icon name="arrow-forward-circle" size={30} tint={color.primary} />
      </View>
    </Pressable>
  );
}

export function Categories({ onOpen }: { onOpen: (id: string) => void }) {
  const { width, compact, gutter } = useLayout();
  const tileW = clamp(240, width * 0.72, 320);
  return (
    <View style={styles.section}>
      <Container>
        <Eyebrow text="Nos incontournables" />
        <Text style={styles.h2} accessibilityRole="header">Choisissez votre bonheur</Text>
      </Container>
      {compact ? (
        // Carrousel à accroche : un peu de la carte suivante dépasse pour signaler qu'on peut faire défiler.
        <ScrollView horizontal showsHorizontalScrollIndicator={false} decelerationRate="fast" snapToInterval={tileW + space.md} snapToAlignment="start" contentContainerStyle={{ paddingHorizontal: gutter, gap: space.md, paddingTop: space.lg, paddingBottom: space.sm }}>
          {PRODUCTS.map((p) => <CategoryTile key={p.id} product={p} width={tileW} onPress={() => onOpen(p.id)} />)}
        </ScrollView>
      ) : (
        <Container style={{ flexDirection: 'row', gap: space.lg, paddingTop: space.lg }}>
          {PRODUCTS.map((p) => (
            <View key={p.id} style={{ flex: 1 }}>
              <CategoryTile product={p} onPress={() => onOpen(p.id)} />
            </View>
          ))}
        </Container>
      )}
    </View>
  );
}

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'restaurant-outline', title: 'Choisissez', text: 'Parcourez le menu et ajoutez vos envies au panier.' },
  { icon: 'create-outline', title: 'Finalisez', text: 'Indiquez votre nom, le retrait ou la livraison, et le paiement souhaité.' },
  { icon: 'logo-whatsapp', title: 'Envoyez sur WhatsApp', text: 'Votre commande arrive prête à envoyer. Nous confirmons le montant et la disponibilité.' },
];

export function HowItWorks() {
  const { compact } = useLayout();
  return (
    <View style={[styles.section, { backgroundColor: color.surface }]}>
      <Container>
        <Eyebrow text="Simple et rapide" />
        <Text style={styles.h2} accessibilityRole="header">Commander en 3 étapes</Text>
        <View style={[{ marginTop: space.lg, gap: space.md }, !compact && { flexDirection: 'row' }]}>
          {STEPS.map((s, i) => (
            <View key={s.title} style={[styles.step, !compact && { flex: 1 }]} accessible accessibilityLabel={`Étape ${i + 1}. ${s.title}. ${s.text}`}>
              <View style={styles.stepIcon}>
                <Icon name={s.icon} size={24} tint={color.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.stepTitle}>{i + 1}. {s.title}</Text>
                <Text style={styles.stepText}>{s.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </Container>
    </View>
  );
}

export function CtaBand({ onMenu }: { onMenu: () => void }) {
  return (
    <View style={styles.cta}>
      <Container style={{ alignItems: 'center', gap: space.md }}>
        <Text style={styles.ctaTitle} accessibilityRole="header">Une petite faim ?</Text>
        <Text style={styles.ctaText}>Shawarmas, popcorn, glaces : votre pause gourmande est à quelques touchers.</Text>
        <Button label="Commander maintenant" variant="accent" iconRight="arrow-forward" onPress={onMenu} />
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingVertical: space.xxl },
  h2: { ...type.h2, color: color.text, marginTop: space.sm + 2 },
  tileText: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingTop: space.md - 4, paddingHorizontal: 2 },
  tileTitle: { ...type.title, fontSize: 22, color: color.text },
  tilePrice: { ...type.bodySm, color: color.textMuted },
  step: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start', padding: space.md, borderRadius: radius.lg, backgroundColor: color.bg, borderWidth: 1, borderColor: color.border },
  stepIcon: { width: 48, height: 48, borderRadius: radius.pill, backgroundColor: color.primaryTint, alignItems: 'center', justifyContent: 'center' },
  stepTitle: { fontFamily: font.sansBold, fontSize: 17, lineHeight: 24, color: color.text },
  stepText: { ...type.bodySm, color: color.textMuted, marginTop: 2 },
  cta: { backgroundColor: color.secondary, paddingVertical: space.xxl },
  ctaTitle: { ...type.h2, color: color.textOnDark, textAlign: 'center' },
  ctaText: { ...type.body, color: color.textOnDarkMuted, textAlign: 'center', maxWidth: 460 },
});
