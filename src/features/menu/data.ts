import type { ImageSourcePropType } from 'react-native';
import { images } from '@/assets/images';

export const BUSINESS = {
  name: 'Délice Express',
  tagline: 'Le goût du bonheur',
  city: 'Yaoundé, Cameroun',
  whatsapp: '237681546178',
  phoneDisplay: '+237 681 546 178',
  deliveryFee: 1000,
} as const;

export type ProductOption = { id: string; name: string; short: string; price: number };
export type Product = {
  id: string;
  title: string;
  label: string;
  description: string;
  alt: string;
  image: ImageSourcePropType;
  /** La première option est l'option par défaut (ajout rapide). */
  options: ProductOption[];
};

export const PRODUCTS: Product[] = [
  {
    id: 'shawarma',
    title: 'Shawarmas',
    label: 'Le salé qui régale',
    description: 'Des wraps savoureux, généreusement garnis pour une pause pleine de goût.',
    alt: 'Shawarma généreux',
    image: images.shawarma,
    options: [
      { id: 'poulet', name: 'Shawarma poulet', short: 'Poulet', price: 1500 },
      { id: 'viande', name: 'Shawarma viande', short: 'Viande', price: 2000 },
      { id: 'mixte', name: 'Shawarma mixte', short: 'Mixte', price: 2500 },
    ],
  },
  {
    id: 'popcorn',
    title: 'Popcorn',
    label: 'Le plaisir à partager',
    description: 'Léger, croustillant et gourmand : le compagnon parfait de vos bons moments.',
    alt: 'Popcorn croustillant',
    image: images.popcorn,
    options: [
      { id: 'petit', name: 'Popcorn petit format', short: 'Petit', price: 500 },
      { id: 'moyen', name: 'Popcorn moyen format', short: 'Moyen', price: 1000 },
      { id: 'grand', name: 'Popcorn grand format', short: 'Grand', price: 1500 },
    ],
  },
  {
    id: 'glace',
    title: 'Crèmes glacées',
    label: 'La touche fraîcheur',
    description: 'Une douceur onctueuse et rafraîchissante pour finir sur une note sucrée.',
    alt: 'Glaces gourmandes',
    image: images.glace,
    options: [
      { id: 'boule', name: 'Glace 1 boule', short: '1 boule', price: 500 },
      { id: 'deux', name: 'Glace 2 boules', short: '2 boules', price: 1000 },
      { id: 'sundae', name: 'Sundae', short: 'Sundae', price: 2000 },
    ],
  },
];

export const getProduct = (id?: string) => PRODUCTS.find((p) => p.id === id);
export const fromPrice = (p: Product) => Math.min(...p.options.map((o) => o.price));
