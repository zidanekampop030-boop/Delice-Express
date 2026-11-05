import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BOTTOM_BAR_HEIGHT, BottomBar, Container, Screen } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Stepper } from '@/components/ui/Stepper';
import { useCart } from '@/features/cart/CartProvider';
import { formatMoney } from '@/lib/format';
import { color, radius, space, type } from '@/design/tokens';

export default function CartScreen() {
  const router = useRouter();
  const { lines, subtotal, setQty, count } = useCart();

  if (lines.length === 0) {
    return (
      <Screen>
        <EmptyState
          icon="bag-handle-outline"
          title="Votre panier est vide"
          message="Ajoutez un shawarma, du popcorn ou une glace pour commencer votre commande."
          actionLabel="Découvrir le menu"
          onAction={() => router.push('/menu')}
        />
      </Screen>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Screen bottomSpace={BOTTOM_BAR_HEIGHT}>
        <Container style={{ gap: space.md, paddingTop: space.sm }}>
          {lines.map((l) => (
            <View key={l.id} style={styles.line}>
              <View style={styles.lineTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{l.name}</Text>
                  <Text style={styles.unit}>{formatMoney(l.unitPrice)} l'unité</Text>
                </View>
                <Text style={styles.lineTotal}>{formatMoney(l.unitPrice * l.qty)}</Text>
              </View>
              <View style={styles.lineBottom}>
                <Stepper name={l.name} value={l.qty} removable onChange={(q) => setQty(l.id, q)} />
              </View>
            </View>
          ))}

          <View style={styles.summary}>
            <View style={styles.sumRow}>
              <Text style={styles.sumLabel}>Sous-total ({count} article{count > 1 ? 's' : ''})</Text>
              <Text style={styles.sumValue}>{formatMoney(subtotal)}</Text>
            </View>
            <Text style={styles.sumNote}>La livraison éventuelle est ajoutée à l'étape suivante.</Text>
          </View>
        </Container>
      </Screen>
      {/* Déjà au-dessus de la tab bar : pas de marge de sécurité basse supplémentaire. */}
      <BottomBar safeBottom={false}>
        <Button label={`Commander · ${formatMoney(subtotal)}`} iconRight="arrow-forward" fullWidth onPress={() => router.push('/checkout')} />
      </BottomBar>
    </View>
  );
}

const styles = StyleSheet.create({
  line: { backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.border, padding: space.md, gap: space.md - 4 },
  lineTop: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  lineBottom: { flexDirection: 'row', justifyContent: 'flex-start' },
  name: { ...type.bodyStrong, color: color.text },
  unit: { ...type.bodySm, color: color.textMuted },
  lineTotal: { ...type.bodyStrong, color: color.text },
  summary: { backgroundColor: color.surfaceAlt, borderRadius: radius.lg, padding: space.md, gap: space.xs },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sumLabel: { ...type.body, color: color.text },
  sumValue: { fontFamily: 'DMSans_800ExtraBold', fontSize: 18, color: color.text },
  sumNote: { ...type.bodySm, color: color.textMuted },
});
