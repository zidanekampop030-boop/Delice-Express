import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { BOTTOM_BAR_HEIGHT, BottomBar, Container, Screen } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { OptionGroup } from '@/components/ui/OptionGroup';
import { Stepper } from '@/components/ui/Stepper';
import { useToast } from '@/components/ui/Toast';
import { InteractiveImage } from '@/components/motion/InteractiveImage';
import { useCart } from '@/features/cart/CartProvider';
import { getProduct } from '@/features/menu/data';
import { formatMoney } from '@/lib/format';
import { useLayout } from '@/hooks/useLayout';
import { color, radius, space, type } from '@/design/tokens';

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = getProduct(id);
  const router = useRouter();
  const cart = useCart();
  const toast = useToast();
  const { compact } = useLayout();
  const [optionId, setOptionId] = useState(product?.options[0].id ?? '');
  const [qty, setQty] = useState(1);

  const goBackOrMenu = () => (router.canGoBack() ? router.back() : router.replace('/menu'));

  if (!product) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Produit introuvable' }} />
        <EmptyState icon="search-outline" title="Produit introuvable" message="Ce produit n'existe plus ou le lien est incorrect." actionLabel="Voir le menu" onAction={() => router.replace('/menu')} />
      </Screen>
    );
  }

  const option = product.options.find((o) => o.id === optionId) ?? product.options[0];
  const total = option.price * qty;

  const add = () => {
    cart.add({ id: `${product.id}:${option.id}`, name: option.name, unitPrice: option.price }, qty);
    toast.show(`${qty} × ${option.name} ajouté${qty > 1 ? 's' : ''}`, { label: 'Voir', onPress: () => router.push('/cart') });
    goBackOrMenu();
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ title: product.title }} />
      <Screen bottomSpace={BOTTOM_BAR_HEIGHT}>
        <Container style={{ gap: space.lg, paddingTop: space.sm }}>
          <InteractiveImage source={product.image} label={product.alt} style={{ width: '100%', height: compact ? 280 : 380 }} radii={{ borderRadius: radius.xl }} withShadow zoom={1.08} lift={6} />
          <View style={{ gap: space.sm }}>
            <Eyebrow text={product.label} />
            <Text style={styles.title} accessibilityRole="header">{product.title}</Text>
            <Text style={styles.desc}>{product.description}</Text>
          </View>

          <OptionGroup
            legend="Choisissez votre format"
            value={optionId || option.id}
            onChange={setOptionId}
            options={product.options.map((o) => ({ value: o.id, label: o.short, trailing: formatMoney(o.price) }))}
          />

          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Quantité</Text>
            <Stepper name={option.name} value={qty} onChange={setQty} />
          </View>
        </Container>
      </Screen>
      <BottomBar>
        <Button label={`Ajouter · ${formatMoney(total)}`} icon="bag-add-outline" fullWidth onPress={add} />
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...type.h2, color: color.text },
  desc: { ...type.body, color: color.textMuted },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  qtyLabel: { ...type.label, color: color.text },
});
