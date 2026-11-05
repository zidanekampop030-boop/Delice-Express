/**
 * Design tokens — source unique de vérité visuelle.
 * Règle : aucun composant n'écrit de couleur, d'espacement ou de durée « en dur ».
 * Contrastes vérifiés (WCAG) : texte ≥ 4.5:1, bordures de champ ≥ 3:1.
 */
import { Platform, TextStyle, ViewStyle } from 'react-native';

export const color = {
  // Surfaces
  bg: '#FFF9F1',
  surface: '#FFFFFF',
  surfaceAlt: '#F8EDDF',
  surfaceDark: '#1E3025',
  // Texte
  text: '#241B16',
  textMuted: '#5F5047', // 7.4:1 sur bg
  textOnDark: '#FFFFFF',
  textOnDarkMuted: '#D8E2D9',
  placeholder: '#6F6258',
  // Actions
  primary: '#C2410C', // orange d'action : 5.2:1 avec du blanc (l'ancien #F47735 n'atteignait que 2.8:1)
  onPrimary: '#FFFFFF',
  primaryTint: '#FFF1E6',
  secondary: '#294B37',
  onSecondary: '#FFFFFF',
  accent: '#FFC65C',
  onAccent: '#241B16',
  whatsapp: '#0F7B3F',
  onWhatsapp: '#FFFFFF',
  // Marque : décor uniquement (halo, logo), jamais porteur de texte clair
  brand: '#F47735',
  // Structure
  border: '#E6D7C8', // séparateurs décoratifs
  borderStrong: '#9A846F', // bordure de contrôle de formulaire : 3.5:1
  // Feedback
  error: '#B42318',
  scrim: 'rgba(36,27,22,0.5)',
} as const;

// Rythme 4/8
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48, xxxl: 64 } as const;
export const radius = { sm: 8, md: 12, lg: 18, xl: 25, pill: 999 } as const;

/** Taille minimale d'une cible tactile (iOS 44pt ; Android 48dp couvert par minHeight des boutons). */
export const HIT = 44;
export const CONTENT_MAX = 960;

export const font = {
  sans: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansSemi: 'DMSans_600SemiBold',
  sansBold: 'DMSans_700Bold',
  sansXBold: 'DMSans_800ExtraBold',
  serif: 'PlayfairDisplay_700Bold',
} as const;

// Échelle typographique : corps 16/24 minimum, jamais sous 13 pour du texte porteur d'information.
export const type = {
  caption: { fontFamily: font.sansMedium, fontSize: 13, lineHeight: 18 },
  eyebrow: { fontFamily: font.sansXBold, fontSize: 13, lineHeight: 18, letterSpacing: 1.8 },
  bodySm: { fontFamily: font.sans, fontSize: 14.5, lineHeight: 22 },
  body: { fontFamily: font.sans, fontSize: 16, lineHeight: 25 },
  bodyStrong: { fontFamily: font.sansBold, fontSize: 16, lineHeight: 24 },
  label: { fontFamily: font.sansBold, fontSize: 14, lineHeight: 20 },
  title: { fontFamily: font.serif, fontSize: 24, lineHeight: 30 },
  h2: { fontFamily: font.serif, fontSize: 30, lineHeight: 36 },
} satisfies Record<string, TextStyle>;

/** Mouvement : durées et ressorts partagés (pas une durée différente par composant). */
export const motion = {
  fast: 120,
  base: 220,
  slow: 420,
  spring: { friction: 7, tension: 90 },
} as const;
export const USE_NATIVE_DRIVER = Platform.OS !== 'web';

export const elevation = {
  card: {
    shadowColor: '#3E2311',
    shadowOpacity: 0.13,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  button: {
    shadowColor: '#7C2D0A',
    shadowOpacity: 0.28,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
} satisfies Record<string, ViewStyle>;

export const clamp = (min: number, value: number, max: number) => Math.min(max, Math.max(min, value));
