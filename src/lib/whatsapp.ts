import { Linking, Platform } from 'react-native';
import { BUSINESS } from '@/features/menu/data';

export function openWhatsApp(text?: string) {
  const url = `https://wa.me/${BUSINESS.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
  if (Platform.OS === 'web') {
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  Linking.openURL(url).catch(() => {});
}
