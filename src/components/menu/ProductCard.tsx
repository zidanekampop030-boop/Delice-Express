import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { color, elevation, radius, space, type } from '@/design/tokens';
import { useInteraction } from '@/hooks/useMotion';
import { formatMoney } from '@/lib/format';
import { Product, fromPrice } from '@/features/menu/data';
import { InteractiveImage } from '@/components/motion/InteractiveImage';
import { IconButton } from '@/components/ui/IconButton';

type Props = { product: Product; imageHeight: number; onOpen: () => void; onQuickAdd: () => void };

export function ProductCard({ product, imageHeight, onOpen, onQuickAdd }: Props) {
  // Une seule progression pour toute la carte : élévation, ombre ET zoom de l'image.
  const { progress, handlers } = useInteraction();
  const lift = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });
  const shadow = progress.interpolate({ inputRange: [0, 1], outputRange: [0, 1], extrapolate: 'clamp' });
  const price = `Dès ${formatMoney(fromPrice(product))}`;
  const defaultOption = product.options[0];

  return (
    // Ce Pressable ne sert qu'au survol (web) : il n'est pas exposé comme contrôle.
    <Pressable accessible={false} onHoverIn={handlers.onHoverIn} onHoverOut={handlers.onHoverOut}>
      <Animated.View style={[styles.card, { transform: [{ translateY: lift }] }]}>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.cardShadow, { opacity: shadow }]} />
        <View style={styles.clip}>
          <Pressable
            onPress={onOpen}
            onPressIn={handlers.onPressIn}
            onPressOut={handlers.onPressOut}
            accessibilityRole="link"
            accessibilityLabel={`${product.title}. ${product.description} ${price}. Voir les formats.`}
          >
            <InteractiveImage progress={progress} source={product.image} label={product.alt} style={{ width: '100%', height: imageHeight }} zoom={1.12} caption={price} />
            <View style={styles.body}>
              <Text style={styles.label}>{product.label.toUpperCase()}</Text>
              <Text style={styles.title}>{product.title}</Text>
              <Text style={styles.desc}>{product.description}</Text>
            </View>
          </Pressable>
          <View style={styles.footer}>
            <View>
              <Text style={styles.priceLabel}>À partir de</Text>
              <Text style={styles.price}>{formatMoney(fromPrice(product))}</Text>
            </View>
            <IconButton icon="add" label={`Ajouter ${defaultOption.name} au panier`} onPress={onQuickAdd} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.xl },
  cardShadow: { borderRadius: radius.xl, backgroundColor: color.surface, ...elevation.card },
  clip: { borderRadius: radius.xl, overflow: 'hidden', backgroundColor: color.surface, borderWidth: 1, borderColor: color.border },
  body: { paddingHorizontal: space.lg - 1, paddingTop: space.lg - 4, gap: space.xs + 2 },
  label: { ...type.eyebrow, color: color.primary },
  title: { ...type.title, color: color.text },
  desc: { ...type.bodySm, color: color.textMuted },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: space.lg - 1, paddingVertical: space.md },
  priceLabel: { ...type.caption, color: color.textMuted },
  price: { ...type.bodyStrong, color: color.secondary },
});
