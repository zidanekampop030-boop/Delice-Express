import { useWindowDimensions } from 'react-native';
import { CONTENT_MAX, space } from '@/design/tokens';

/** Classes de taille d'écran : compact (téléphone) / medium (grand téléphone, petite tablette) / expanded. */
export function useLayout() {
  const { width, height } = useWindowDimensions();
  const compact = width < 600;
  const expanded = width >= 900;
  const gutter = width < 400 ? space.md : compact ? 20 : space.xl;
  const contentWidth = Math.min(width, CONTENT_MAX) - gutter * 2;
  return { width, height, compact, expanded, gutter, contentWidth };
}
