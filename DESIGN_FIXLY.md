# 🎨 Design System - Fixly.io

## 🎯 Concept
Design épuré et moderne pour une plateforme de devis professionnelle destinée aux artisans et entrepreneurs.

## 🎨 Palette de couleurs

### Couleurs principales
- **Background**: `#f5f4f1` (beige clair chaleureux)
- **Texte principal**: `#000000` (noir)
- **Texte secondaire**: `#374151` (gris foncé)
- **Bordures**: `#1F2937` (gris très foncé - gray-800)
- **Surfaces**: `#FFFFFF` (blanc)

### Couleurs d'accentuation
- **CTA primaire**: Noir sur fond blanc
- **CTA secondaire**: Blanc avec border noir
- **Focus**: Ring noir avec opacité

## 📝 Typographie

### Police principale
**GT America Standard**, sans-serif
- Fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial

### Hiérarchie
- **Logo**: 40px (responsive: 24px mobile)
- **Hero titre**: 22px (responsive à 3xl/4xl)
- **Hero body**: 18px
- **Section titres**: 18px font-medium
- **Body text**: 14-16px
- **Labels**: 12px

## 📐 Espacements

### Padding
- Sections: `py-12` (mobile) → `py-20` (desktop)
- Containers: `px-[5%]` (mobile) → `px-[10%]` (desktop)
- Cards: `p-6` → `p-8` → `p-12`

### Gaps
- Entre sections: `gap-8` → `gap-16`
- Entre éléments: `gap-4`
- Entre inputs: `space-y-4`

### Marges
- Retrait gauche formulaire: `10%`
- Largeur champs: `40%` (responsive: 100% mobile)

## 🎭 Composants

### Header
- **Hauteur**: `3vh` (min: 50px)
- **Border bottom**: `1px solid gray-800`
- **Contenu**: Logo (40x40) + "Fixly.io"
- **Padding horizontal**: `10%`

### Logo
- SVG 40x40px
- Carré noir avec marteau blanc
- Border radius: 6px

### Hero Section
**Layout**: 2 colonnes (1 sur mobile)

**Gauche (Texte)**:
- Background: `bg-white/50 backdrop-blur-sm`
- Border: `1px solid gray-200`
- Radius: `30px`
- Padding: `p-8` → `p-12`

**Droite (Animation)**:
- Background: `bg-white`
- 8 étapes animées (loop 1.5s)
- Indicateurs de progression (dots)
- Highlight du champ actif

### Formulaire

**Structure**: 3 sections séparées par `border-top gray-800`

**Champs**:
- Width: `40%` (responsive: 100% mobile)
- Padding: `px-6 py-4`
- Border: `1px solid gray-800`
- Radius: `30px`
- Focus: `ring-2 ring-black`
- Transition: `transition-all`

**Textarea** (Description):
- Height: `200px` (8 lignes environ)
- Resize: `none`

**Inputs groupés**:
- Grid 2 colonnes sur desktop
- 1 colonne sur mobile

### Boutons

**Primaire** (Générer le devis):
- Background: `bg-black`
- Text: `text-white`
- Hover: `bg-gray-800`
- Padding: `py-4 px-8`
- Radius: `30px`
- Shadow: `shadow-lg hover:shadow-xl`

**Secondaire** (Télécharger):
- Background: `bg-white`
- Border: `2px solid black`
- Text: `text-black`
- Hover: `bg-gray-50`
- Même radius et padding

**Disabled**:
- Background: `bg-gray-400`
- Cursor: `not-allowed`

### Preview (Aperçu du devis)

**Container**:
- Background: `bg-white`
- Border: `1px solid gray-800`
- Radius: `30px`
- Padding: `p-8`
- Shadow: `shadow-lg`

**Structure**:
- Sections séparées par `border-b gray-200`
- Grid 2 colonnes pour Artisan/Client
- Liste items avec prix alignés à droite
- Totaux en bold avec border-top

## 📱 Responsive

### Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md - lg)
- **Desktop**: > 1024px (lg+)

### Adaptations
- Header logo: 32px mobile → 40px desktop
- Hero: 1 colonne mobile → 2 colonnes desktop
- Formulaire: 100% width mobile → 40% desktop
- Inputs groupés: 1 col mobile → 2 cols desktop
- Padding: 5% mobile → 10% desktop
- Text sizes: responsive avec classes md: et lg:

## ✨ Animations

### Hero Animation
- **Duration**: 1.5s par étape
- **Steps**: 8 étapes (loop infini)
- **Effects**:
  - Fade in des valeurs
  - Border highlight du champ actif
  - Scale du bouton à la fin
  - Dots de progression

### Transitions
- **All elements**: `transition-all`
- **Hover states**: scale légère, shadow augmentée
- **Focus states**: ring noir avec opacité

## 🎯 Principes de design

1. **Clarté**: Hiérarchie visuelle claire
2. **Espacement**: Breathing room généreux
3. **Cohérence**: Radius 30px partout
4. **Contraste**: Noir/blanc/beige
5. **Simplicité**: Pas de gradients complexes
6. **Accessibilité**: Focus states clairs
7. **Responsive**: Mobile-first approach
8. **Performance**: Animations légères

## 📦 Assets

- **Logo**: `/public/logo.svg` (SVG inline)
- **Fonts**: GT America Standard (CDN)

## 🔧 Technologies

- **Framework**: Next.js 15 + React 19
- **Styling**: TailwindCSS 4
- **Animations**: CSS transitions + React state
- **Icons**: SVG inline

---

**Version**: 2.0 - Fixly.io Design System  
**Last updated**: 2024  
**Status**: ✅ Production Ready
