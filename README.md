# Délice Express — app mobile (Expo Router · TypeScript)

Application de commande iOS / Android / web. Structure revue avec les règles du skill UI/UX Pro Max.

## Lancer
```bash
npm install
npx expo install --fix     # aligne les versions sur ton SDK
npx expo start             # a (Android) · i (iOS) · w (web)
npm run typecheck          # tsc --noEmit
```

## Architecture

```
app/                          Routes (expo-router : un fichier = un écran = une URL)
├─ _layout.tsx                Racine : polices, CartProvider, ToastProvider, Stack
├─ (tabs)/                    Navigation par onglets (4, badge panier)
│  ├─ index.tsx               Accueil   → /
│  ├─ menu.tsx                Menu      → /menu
│  ├─ cart.tsx                Panier    → /cart
│  └─ about.tsx               Infos     → /about
├─ product/[id].tsx           Détail produit (format + quantité)  → /product/shawarma
├─ checkout.tsx               Commande (formulaire validé)        → /checkout
└─ +not-found.tsx             404

src/
├─ design/tokens.ts           Couleurs sémantiques, espacements 4/8, rayons, typo, mouvement, ombres
├─ features/                  Logique métier, sans UI
│  ├─ cart/CartProvider.tsx   Reducer + Context, persistance AsyncStorage
│  ├─ menu/data.ts            Produits typés (options/formats), infos du commerce
│  └─ checkout/order.ts       Validation, frais, message WhatsApp
├─ components/
│  ├─ ui/                     Briques génériques : Button, IconButton, Stepper, Field, OptionGroup, Toast…
│  ├─ motion/InteractiveImage Image animée (survol web / appui mobile)
│  ├─ home/ menu/ about/      Composants propres à un écran
├─ hooks/                     useInteraction, useLoop, useEntrance, useReduceMotion, useLayout
└─ lib/                       format, storage, whatsapp
```

**Règles de dépendance** : `app/` → `components/` → `design/` ; `features/` ne dépend d'aucun composant ;
aucun composant n'écrit de couleur, d'espacement ou de durée en dur (tout vient de `tokens.ts`).
Les liens profonds viennent gratuitement du routage par fichiers : `delice://product/glace` ou `/product/glace` sur le web.

## Ce qui a changé par rapport à la v1 (audit UI/UX Pro Max)

| Problème de la v1 | Correction |
|---|---|
| Page unique + menu hamburger (un site porté en app), pas de retour, pas de liens profonds | 4 onglets + pile d'écrans, retour natif, URLs/deep links |
| Panier invisible tant qu'on n'ouvrait pas la section commande | Onglet Panier avec badge, état vide actionnable, toast d'ajout |
| Texte blanc sur orange `#F47735` : **2,8:1** (minimum 4,5:1) ; placeholder à 2,4:1 | Orange d'action `#C2410C` (5,2:1), placeholder `#6F6258` (5,7:1) ; l'orange de marque reste en décor |
| Emojis et glyphes comme icônes (✦ ☰ ＋ ✓) | Icônes vectorielles Ionicons, décoratives masquées aux lecteurs d'écran |
| Cibles tactiles de 30 à 42 px | 44 px minimum, boutons 48 px |
| Erreur de formulaire unique en bas | Erreur sous chaque champ, focus sur le premier invalide, résumé si plusieurs, préremplissage |
| Couleurs et tailles en dur partout | Tokens sémantiques |
| `SafeAreaView` déprécié, barre fixe pouvant masquer le contenu | `react-native-safe-area-context`, espace réservé sous les barres d'action |
| Polices DM Sans 600/800 **introuvables** dans la version installée (repli silencieux) | Paquet mis à jour (0.4.x) |

## Animations
- **Héros** : entrée orchestrée, flottement, pastilles en ressort.
- **Cartes / tuiles / photos** : survol (web) ou appui (mobile) → zoom interne, élévation, voile, pastille de prix.
- **Notre univers** : parallaxe inversée liée au scroll.
- Le survol n'est qu'un renfort : chaque action reste faisable au toucher. « Réduire les animations » est respecté.

## Limites connues
- Thème clair uniquement (`userInterfaceStyle: light`). Les tokens sont prêts pour un thème sombre, à mapper par thème.
- Rendu non vérifié visuellement dans cet environnement (compilation web et TypeScript validées) : teste sur appareil.
- Sur grand écran web, la barre d'onglets reste en bas ; le contenu est borné à 960 px.
