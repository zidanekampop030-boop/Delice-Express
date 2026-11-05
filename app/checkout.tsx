import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BOTTOM_BAR_HEIGHT, BottomBar, Container, Screen } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Field } from '@/components/ui/Field';
import { Icon } from '@/components/ui/Icon';
import { OptionGroup } from '@/components/ui/OptionGroup';
import { useToast } from '@/components/ui/Toast';
import { useCart } from '@/features/cart/CartProvider';
import { FULFILLMENT_OPTIONS, OrderErrors, OrderForm, PAYMENT_OPTIONS, buildOrderMessage, deliveryFeeFor, validateOrder } from '@/features/checkout/order';
import { formatMoney } from '@/lib/format';
import { readJSON, writeJSON } from '@/lib/storage';
import { openWhatsApp } from '@/lib/whatsapp';
import { color, font, radius, space, type } from '@/design/tokens';

const CONTACT_KEY = 'delice.contact.v1';
const FIELD_LABELS = { name: 'Nom', phone: 'Téléphone', address: 'Adresse' } as const;

export default function CheckoutScreen() {
  const router = useRouter();
  const { lines, subtotal } = useCart();
  const toast = useToast();

  const [form, setForm] = useState<OrderForm>({ name: '', phone: '', fulfillment: 'pickup', address: '', payment: PAYMENT_OPTIONS[0].value });
  const [touched, setTouched] = useState<Partial<Record<keyof OrderErrors, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);

  const nameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);

  // Préremplissage : un client qui recommande ne retape pas ses informations.
  useEffect(() => {
    readJSON<Partial<OrderForm>>(CONTACT_KEY, {}).then((saved) => setForm((f) => ({ ...f, ...saved, address: saved.address ?? f.address })));
  }, []);

  const set = <K extends keyof OrderForm>(key: K, value: OrderForm[K]) => setForm((f) => ({ ...f, [key]: value }));
  const errors = validateOrder(form);
  const visible = (k: keyof OrderErrors) => (submitted || touched[k] ? errors[k] : undefined);
  const touch = (k: keyof OrderErrors) => () => setTouched((t) => ({ ...t, [k]: true }));

  const fee = deliveryFeeFor(form.fulfillment);
  const total = subtotal + fee;
  const errorKeys = (Object.keys(errors) as (keyof OrderErrors)[]);

  if (lines.length === 0) {
    return (
      <Screen>
        <EmptyState icon="bag-handle-outline" title="Votre panier est vide" message="Ajoutez des articles avant de finaliser votre commande." actionLabel="Voir le menu" onAction={() => router.replace('/menu')} />
      </Screen>
    );
  }

  const submit = () => {
    setSubmitted(true);
    if (errorKeys.length) {
      // Focus sur le premier champ invalide.
      if (errors.name) nameRef.current?.focus();
      else if (errors.phone) phoneRef.current?.focus();
      else addressRef.current?.focus();
      return;
    }
    writeJSON(CONTACT_KEY, { name: form.name.trim(), phone: form.phone.trim(), fulfillment: form.fulfillment, payment: form.payment, address: form.address.trim() });
    openWhatsApp(buildOrderMessage(lines, subtotal, form));
    toast.show('Message prêt dans WhatsApp. Envoyez-le pour valider la commande.');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen bottomSpace={BOTTOM_BAR_HEIGHT}>
        <Container style={{ gap: space.lg, paddingTop: space.sm }}>
          {submitted && errorKeys.length > 1 ? (
            <View style={styles.summary} accessibilityRole="alert">
              <Icon name="alert-circle" size={22} tint={color.error} />
              <Text style={styles.summaryText}>
                {errorKeys.length} champs à corriger : {errorKeys.map((k) => FIELD_LABELS[k]).join(', ')}.
              </Text>
            </View>
          ) : null}

          <Text style={styles.section} accessibilityRole="header">Vos informations</Text>
          <Field ref={nameRef} label="Nom complet" value={form.name} onChangeText={(v) => set('name', v)} onBlur={touch('name')} error={visible('name')} autoComplete="name" textContentType="name" returnKeyType="next" onSubmitEditing={() => phoneRef.current?.focus()} blurOnSubmit={false} />
          <Field ref={phoneRef} label="Téléphone / WhatsApp" value={form.phone} onChangeText={(v) => set('phone', v)} onBlur={touch('phone')} error={visible('phone')} hint="Nous vous répondrons sur ce numéro." keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" returnKeyType="done" />

          <OptionGroup legend="Mode de réception" value={form.fulfillment} onChange={(v) => set('fulfillment', v)} options={FULFILLMENT_OPTIONS.map((o) => ({ value: o.value, label: o.label, hint: o.hint }))} />
          {form.fulfillment === 'delivery' ? (
            <Field ref={addressRef} label="Adresse de livraison" value={form.address} onChangeText={(v) => set('address', v)} onBlur={touch('address')} error={visible('address')} hint="Quartier, repère, étage ou point de rencontre." multiline numberOfLines={3} autoComplete="street-address" />
          ) : null}

          <OptionGroup legend="Paiement souhaité" value={form.payment} onChange={(v) => set('payment', v)} options={PAYMENT_OPTIONS.map((o) => ({ value: o.value, label: o.label, hint: o.hint }))} />

          <Text style={styles.section} accessibilityRole="header">Récapitulatif</Text>
          <View style={styles.recap}>
            {lines.map((l) => (
              <View key={l.id} style={styles.recapRow}>
                <Text style={styles.recapName}>{l.name} × {l.qty}</Text>
                <Text style={styles.recapValue}>{formatMoney(l.unitPrice * l.qty)}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.recapRow}><Text style={styles.recapName}>Sous-total</Text><Text style={styles.recapValue}>{formatMoney(subtotal)}</Text></View>
            <View style={styles.recapRow}><Text style={styles.recapName}>Livraison</Text><Text style={styles.recapValue}>{formatMoney(fee)}</Text></View>
            <View style={styles.recapRow}><Text style={styles.total}>Total</Text><Text style={styles.total}>{formatMoney(total)}</Text></View>
          </View>
          <Text style={styles.note}>
            Après l'envoi, Délice Express confirme le montant exact, la disponibilité et les instructions de paiement sur WhatsApp. Les frais de livraison peuvent varier selon la distance.
          </Text>
        </Container>
      </Screen>
      <BottomBar>
        <Button label={`Envoyer sur WhatsApp · ${formatMoney(total)}`} icon="logo-whatsapp" variant="whatsapp" fullWidth onPress={submit} />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  section: { ...type.title, color: color.text, marginTop: space.sm },
  summary: { flexDirection: 'row', alignItems: 'center', gap: space.sm + 2, padding: space.md, borderRadius: radius.md, borderWidth: 1.5, borderColor: color.error, backgroundColor: color.surface },
  summaryText: { ...type.bodyStrong, fontFamily: font.sansSemi, color: color.error, flex: 1 },
  recap: { backgroundColor: color.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: color.border, padding: space.md, gap: space.sm + 2 },
  recapRow: { flexDirection: 'row', justifyContent: 'space-between', gap: space.md },
  recapName: { ...type.body, color: color.text, flex: 1 },
  recapValue: { ...type.bodyStrong, color: color.text },
  divider: { height: 1, backgroundColor: color.border },
  total: { fontFamily: font.sansXBold, fontSize: 18, lineHeight: 24, color: color.text },
  note: { ...type.bodySm, color: color.textMuted },
});
