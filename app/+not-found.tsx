import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { Screen } from '@/components/ui/Layout';
import { EmptyState } from '@/components/ui/EmptyState';

export default function NotFound() {
  const router = useRouter();
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Page introuvable' }} />
      <EmptyState icon="compass-outline" title="Page introuvable" message="Ce lien ne mène à aucune page de l'application." actionLabel="Retour à l'accueil" onAction={() => router.replace('/')} />
    </Screen>
  );
}
