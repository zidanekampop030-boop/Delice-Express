import React from 'react';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Layout';
import { Hero } from '@/components/home/Hero';
import { Categories, CtaBand, HowItWorks } from '@/components/home/HomeSections';
import { BUSINESS } from '@/features/menu/data';
import { openWhatsApp } from '@/lib/whatsapp';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <Screen contentStyle={{ paddingBottom: 0 }}>
      <Hero onMenu={() => router.push('/menu')} onWhatsApp={() => openWhatsApp(`Bonjour ${BUSINESS.name} !`)} />
      <Categories onOpen={(id) => router.push(`/product/${id}`)} />
      <HowItWorks />
      <CtaBand onMenu={() => router.push('/menu')} />
    </Screen>
  );
}
