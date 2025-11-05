# 🎨 Simple Design System - Fixly.io

## Inspiration

Design inspiré du **design system clean** fourni - structure Contact Us page.

### Principes clés
- **Simplicité** : Pas d'animation complexe
- **Clarté** : Structure Input Field standard
- **Professionnalisme** : Design épuré blanc/gris/bleu
- **Lisibilité** : Espacement généreux

---

## 🎨 Palette de couleurs

### Couleurs principales
| Élément | Couleur | Usage |
|---------|---------|-------|
| Background | `#FFFFFF` | Fond général |
| Background Alt | `#F9FAFB` (gray-50) | Sections alternées |
| Text | `#111827` (gray-900) | Texte principal |
| Text Secondary | `#6B7280` (gray-500) | Labels, descriptions |
| Border | `#D1D5DB` (gray-300) | Borders inputs |
| Border Light | `#E5E7EB` (gray-200) | Séparateurs |

### Couleurs d'action
| Élément | Couleur | Usage |
|---------|---------|-------|
| Primary | `#2563EB` (blue-600) | Bouton principal, focus ring |
| Primary Hover | `#1D4ED8` (blue-700) | Hover bouton principal |
| Secondary | `#FFFFFF` | Bouton secondaire |
| Secondary Border | `#D1D5DB` (gray-300) | Border bouton secondaire |

---

## 📝 Typographie

### Hiérarchie
```
h1 (Hero):     text-4xl sm:text-5xl (36px/48px) font-bold
h2 (Section):  text-2xl (24px) font-bold
h3 (Subsection): text-lg (18px) font-semibold
Label:         text-sm (14px) font-medium
Body:          text-base (16px) regular
Description:   text-sm (14px) text-gray-500
```

### Font Stack
Système par défaut (sans custom font):
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
```

---

## 📐 Espacements

### Padding
```
Card principale:    p-6 sm:p-8 (24px/32px)
Sections:          py-16 (64px vertical)
Form groups:       space-y-6 (24px entre éléments)
Input fields:      space-y-2 (8px label → input)
```

### Margins
```
Hero to Form:     (géré par py-16 des sections)
Entre sections:   pt-6 border-t (séparateur visuel)
```

### Gaps
```
Button group:      gap-3 (12px)
Grid (inputs):     gap-6 (24px)
```

---

## 🧩 Composants

### Header
```tsx
- Height: h-16 (64px)
- Border: border-b border-gray-200
- Logo: 32x32px
- Font: text-xl font-semibold
```

### Hero
```tsx
- Background: bg-white
- Padding: py-16 sm:py-24
- Max-width: max-w-3xl
- Alignment: text-center
```

### Input Field Structure
```
┌─────────────────────────────────┐
│ Label (text-sm font-medium)     │  ← Label
│ Description (text-sm gray-500)  │  ← Description optionnelle
│ ┌───────────────────────────┐   │
│ │ Input (border gray-300)   │   │  ← Input avec focus:ring-2 blue-500
│ └───────────────────────────┘   │
│ Error (text-sm red-600)         │  ← Message d'erreur si nécessaire
└─────────────────────────────────┘
```

**Code type**:
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-900">
    Label text
  </label>
  <p className="text-sm text-gray-500">
    Description text
  </p>
  <input
    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
               focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
               text-gray-900 placeholder-gray-400"
    placeholder="Placeholder..."
  />
</div>
```

### Textarea Field
Même structure que Input Field, mais avec:
```tsx
<textarea
  rows={4}
  className="..." // mêmes classes que input
/>
```

### Button Group
```tsx
<div className="flex flex-col sm:flex-row gap-3">
  {/* Primary Button */}
  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white 
                     font-medium py-3 px-6 rounded-md shadow-sm">
    Primary Action
  </button>
  
  {/* Secondary Button */}
  <button className="flex-1 bg-white hover:bg-gray-50 text-gray-900 
                     font-medium py-3 px-6 rounded-md border border-gray-300">
    Secondary Action
  </button>
</div>
```

### Card/Container
```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
  {/* Content */}
</div>
```

### Section Separator
```tsx
<div className="pt-6 border-t border-gray-200">
  {/* New section */}
</div>
```

---

## 📱 Responsive

### Breakpoints
- **Mobile**: < 640px (base)
- **Tablet**: ≥ 640px (sm:)
- **Desktop**: ≥ 1024px (lg:)

### Adaptations
```
Layout:        flex-col → sm:flex-row
Grid:          grid-cols-1 → sm:grid-cols-2
Padding:       p-6 → sm:p-8
Text:          text-4xl → sm:text-5xl
```

---

## 🎯 États

### Input States
```css
/* Default */
border: border-gray-300
text: text-gray-900

/* Focus */
ring: ring-2 ring-blue-500
border: border-blue-500

/* Error */
border: border-red-300
ring: ring-2 ring-red-500
```

### Button States
```css
/* Primary Default */
bg: bg-blue-600
text: text-white

/* Primary Hover */
bg: bg-blue-700

/* Primary Disabled */
bg: bg-gray-400
cursor: cursor-not-allowed

/* Secondary Default */
bg: bg-white
border: border-gray-300
text: text-gray-900

/* Secondary Hover */
bg: bg-gray-50
```

---

## ✨ Effets

### Shadows
```
Card: shadow-sm
Button: shadow-sm
```

### Transitions
```
All interactive: transition-colors
```

### Border Radius
```
Inputs/Buttons: rounded-md (6px)
Cards: rounded-lg (8px)
```

---

## 📦 Structure de page

```
┌──────────────────────────────────┐
│         Header (blanc)           │ h-16, border-b
├──────────────────────────────────┤
│                                  │
│      Hero (blanc, centré)        │ py-16/24
│   Titre + Sous-titre             │
│                                  │
├──────────────────────────────────┤
│                                  │
│    Formulaire (gris-50)          │ py-16
│  ┌────────────────────────────┐  │
│  │   Card blanche             │  │ max-w-2xl
│  │   - Input Fields           │  │
│  │   - Sections séparées      │  │
│  │   - Button Group           │  │
│  └────────────────────────────┘  │
│                                  │
│  ┌────────────────────────────┐  │
│  │   Preview Card (si quote)  │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

---

## 🎯 Principes de design

1. **Clarté avant tout** : Hiérarchie visuelle évidente
2. **Espacement généreux** : Breathing room pour lisibilité
3. **Cohérence** : Mêmes patterns partout
4. **Simplicité** : Pas d'effets inutiles
5. **Accessibilité** : Focus states clairs, contrastes suffisants
6. **Responsive** : Mobile-first, progressive enhancement
7. **Performance** : CSS minimal, pas d'animations lourdes

---

## 🔧 Technologies

- **Framework**: Next.js 16
- **Styling**: TailwindCSS 4
- **No custom fonts**: Système par défaut
- **No animations**: Pure CSS transitions
- **No icons**: Texte seulement pour MVP

---

**Version**: 3.0 - Simple Design System  
**Status**: ✅ Production Ready  
**Philosophy**: Less is more
