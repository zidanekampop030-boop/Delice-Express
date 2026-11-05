import React, { useRef } from 'react';
import { Animated, Linking, StyleSheet, Text, View } from 'react-native';
import { Container, Screen } from '@/components/ui/Layout';
import { Button } from '@/components/ui/Button';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Icon } from '@/components/ui/Icon';
import { StoryPhotos } from '@/components/about/StoryPhotos';
import { BUSINESS } from '@/features/menu/data';
import { openWhatsApp } from '@/lib/whatsapp';
import { useLayout } from '@/hooks/useLayout';
import { clamp, color, font, radius, space, type } from '@/design/tokens';

const PERKS = ['Des envies variées', 'Commande simple', 'Service chaleureux'];

export default function AboutScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { width, compact } = useLayout();
  const h2 = clamp(30, width * 0.04, 52);

  return (
    <Screen scrollY={scrollY}>
      {/* Ce conteneur est le premier enfant du scroll (y = 0) : requis par StoryPhotos pour la parallaxe. */}
      <Container style={{ gap: space.lg, paddingTop: space.sm }}>
        <View style={compact ? { gap: space.lg } : { flexDirection: 'row', alignItems: 'center', gap: space.xxl }}>
          <View style={compact ? undefined : { flex: 1 }}>
            <StoryPhotos scrollY={scrollY} />
          </View>
          <View style={[compact ? undefined : { flex: 1 }, { gap: space.md }]}>
            <Eyebrow text="Bienvenue chez nous" />
            <Text accessibilityRole="header" style={[styles.h2, { fontSize: h2, lineHeight: h2 * 1.1 }]}>
              Les petits plaisirs font les grands souvenirs.
            </Text>
            <Text style={styles.p}>
              Délice Express réunit vos envies préférées au même endroit : du salé généreux, du popcorn à grignoter et des douceurs glacées. Notre objectif : vous faire plaisir, simplement.
            </Text>
            <View style={{ gap: space.sm + 2, marginTop: space.xs }}>
              {PERKS.map((perk) => (
                <View key={perk} style={styles.perk}>
                  <Icon name="checkmark-circle" size={24} tint={color.secondary} />
                  <Text style={styles.perkText}>{perk}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.contact}>
          <Text style={styles.contactTitle} accessibilityRole="header">Nous contacter</Text>
          <View style={styles.contactRow}>
            <Icon name="location-outline" size={22} tint={color.textOnDarkMuted} />
            <Text style={styles.contactText}>{BUSINESS.city}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="call-outline" size={22} tint={color.textOnDarkMuted} />
            <Text style={styles.contactText}>{BUSINESS.phoneDisplay}</Text>
          </View>
          <View style={styles.contactActions}>
            <Button label="Écrire sur WhatsApp" icon="logo-whatsapp" variant="whatsapp" onPress={() => openWhatsApp(`Bonjour ${BUSINESS.name} !`)} />
            <Button label="Appeler" icon="call" variant="accent" onPress={() => Linking.openURL(`tel:+${BUSINESS.whatsapp}`).catch(() => {})} />
          </View>
        </View>
        <Text style={styles.copy}>© {new Date().getFullYear()} {BUSINESS.name}</Text>
      </Container>
    </Screen>
  );
}

const styles = StyleSheet.create({
  h2: { fontFamily: font.serif, color: color.text },
  p: { ...type.body, color: color.textMuted },
  perk: { flexDirection: 'row', alignItems: 'center', gap: space.sm + 2, minHeight: 32 },
  perkText: { ...type.bodyStrong, color: color.text },
  contact: { backgroundColor: color.surfaceDark, borderRadius: radius.xl, padding: space.lg, gap: space.md - 4, marginTop: space.md },
  contactTitle: { ...type.title, color: color.textOnDark },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm + 2 },
  contactText: { ...type.body, color: color.textOnDarkMuted },
  contactActions: { flexDirection: 'row', flexWrap: 'wrap', gap: space.md - 4, marginTop: space.sm },
  copy: { ...type.caption, color: color.textMuted, textAlign: 'center' },
});
