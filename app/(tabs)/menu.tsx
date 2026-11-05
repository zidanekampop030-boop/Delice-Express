import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Container, Screen } from '@/components/ui/Layout';
import { ProductCard } from '@/components/menu/ProductCard';
import { useToast } from '@/components/ui/Toast';
import { useCart } from '@/features/cart/CartProvider';
import { PRODUCTS } from '@/features/menu/data';
import { useLayout } from '@/hooks/useLayout';
import { color, space, type } from '@/design/tokens';

export default function MenuScreen() {
  const router = useRouter();
  const cart = useCart();
  const toast = useToast();
  const { compact, expanded, contentWidth } = useLayout();

  const cols = compact ? 1 : expanded ? 3 : 2;
  const gap = space.lg;
  const cardW = (contentWidth - gap * (cols - 1)) / cols;
  const imageHeight = compact ? 230 : 210;

  return (
    <Screen>
      <Container style={{ paddingTop: space.sm }}>
        <Text style={styles.intro}>Une petite faim ou une grande envie ? Touchez une carte pour choisir le format, ou ajoutez le favori d'un geste.</Text>
        <View style={styles.grid}>
          {PRODUCTS.map((p) => (
            <View key={p.id} style={{ width: cardW }}>
              <ProductCard
                product={p}
                imageHeight={imageHeight}
                onOpen={() => router.push(`/product/${p.id}`)}
                onQuickAdd={() => {
                  const o = p.options[0];
                  cart.add({ id: `${p.id}:${o.id}`, name: o.name, unitPrice: o.price });
                  toast.show(`${o.name} ajouté au panier`, { label: 'Voir', onPress: () => router.push('/cart') });
                }}
              />
            </View>
          ))}
        </View>
        <Text style={styles.note}>Tarifs indicatifs, confirmés par le commerce au moment de la commande.</Text>
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { ...type.body, color: color.textMuted, marginBottom: space.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.lg, alignItems: 'flex-start' },
  note: { ...type.caption, color: color.textMuted, marginTop: space.lg, textAlign: 'center' },
});
