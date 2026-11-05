import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/features/cart/CartProvider';
import { color, font } from '@/design/tokens';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
const tabIcon = (active: IconName, inactive: IconName) =>
  function TabIcon({ color: tint, focused }: { color: string; focused: boolean }) {
    return <Ionicons name={focused ? active : inactive} size={24} color={tint} />;
  };

export default function TabsLayout() {
  const { count } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: color.bg },
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: font.serif, fontSize: 20, color: color.text },
        tabBarActiveTintColor: color.primary,
        tabBarInactiveTintColor: color.textMuted,
        tabBarStyle: { backgroundColor: color.surface, borderTopColor: color.border },
        tabBarLabelStyle: { fontFamily: font.sansSemi, fontSize: 12 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Accueil', headerShown: false, tabBarIcon: tabIcon('home', 'home-outline') }} />
      <Tabs.Screen name="menu" options={{ title: 'Menu', headerTitle: 'Notre menu', tabBarIcon: tabIcon('restaurant', 'restaurant-outline') }} />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Panier',
          headerTitle: 'Votre panier',
          tabBarIcon: tabIcon('bag-handle', 'bag-handle-outline'),
          tabBarBadge: count > 0 ? (count > 99 ? '99+' : count) : undefined,
          tabBarBadgeStyle: { backgroundColor: color.primary, color: color.onPrimary, fontFamily: font.sansBold },
          tabBarAccessibilityLabel: count > 0 ? `Panier, ${count} article${count > 1 ? 's' : ''}` : 'Panier, vide',
        }}
      />
      <Tabs.Screen name="about" options={{ title: 'Infos', headerTitle: 'Notre univers', tabBarIcon: tabIcon('information-circle', 'information-circle-outline') }} />
    </Tabs>
  );
}
