import { BUSINESS } from '@/features/menu/data';
import type { CartLine } from '@/features/cart/CartProvider';
import { formatMoney } from '@/lib/format';

export type Fulfillment = 'pickup' | 'delivery';

export const FULFILLMENT_OPTIONS: { value: Fulfillment; label: string; hint: string }[] = [
  { value: 'pickup', label: 'Retrait au point de vente', hint: 'Gratuit' },
  { value: 'delivery', label: 'Livraison', hint: `Estimée à ${formatMoney(BUSINESS.deliveryFee)}` },
];

export const PAYMENT_OPTIONS = [
  { value: 'MTN Mobile Money', label: 'MTN Mobile Money', hint: 'Instructions envoyées sur WhatsApp' },
  { value: 'Orange Money', label: 'Orange Money', hint: 'Instructions envoyées sur WhatsApp' },
  { value: 'Paiement à la réception', label: 'Paiement à la réception', hint: 'Espèces' },
];

export type OrderForm = {
  name: string;
  phone: string;
  fulfillment: Fulfillment;
  address: string;
  payment: string;
};
export type OrderErrors = Partial<Record<'name' | 'phone' | 'address', string>>;

// Mobiles et fixes camerounais : 9 chiffres commençant par 6 ou 2, indicatif +237 optionnel.
const PHONE_RE = /^(\+?237)?[26]\d{8}$/;

export function validateOrder(form: OrderForm): OrderErrors {
  const errors: OrderErrors = {};
  if (!form.name.trim()) errors.name = 'Indiquez votre nom pour la commande.';
  if (!form.phone.trim()) errors.phone = 'Indiquez votre numéro WhatsApp.';
  else if (!PHONE_RE.test(form.phone.replace(/[\s.-]/g, ''))) errors.phone = 'Numéro invalide. Exemple : 6 81 54 61 78.';
  if (form.fulfillment === 'delivery' && !form.address.trim()) errors.address = "Indiquez l'adresse de livraison.";
  return errors;
}

export const deliveryFeeFor = (f: Fulfillment) => (f === 'delivery' ? BUSINESS.deliveryFee : 0);

export function buildOrderMessage(lines: CartLine[], subtotal: number, form: OrderForm): string {
  const fee = deliveryFeeFor(form.fulfillment);
  const items = lines.map((l) => `- ${l.name} x${l.qty} : ${formatMoney(l.unitPrice * l.qty)}`).join('\n');
  const reception = form.fulfillment === 'delivery' ? `Livraison - ${form.address.trim()}` : 'Retrait au point de vente';
  return [
    `Bonjour ${BUSINESS.name} ! Voici ma commande :`,
    items,
    `Sous-total : ${formatMoney(subtotal)}`,
    `Livraison : ${formatMoney(fee)}`,
    `TOTAL : ${formatMoney(subtotal + fee)}`,
    `Nom : ${form.name.trim()}`,
    `Téléphone : ${form.phone.trim()}`,
    `Réception : ${reception}`,
    `Paiement souhaité : ${form.payment}`,
    'Merci de confirmer la disponibilité, les frais exacts et les instructions de paiement.',
  ].join('\n');
}
