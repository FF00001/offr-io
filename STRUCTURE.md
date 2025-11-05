# 📁 Structure de l'application - Fixly.io

## 🗺️ Structure des pages

```
https://fixly.io/
├── / (Page d'accueil)
│   ├── Header
│   ├── Hero + CTA "Try it now"
│   └── Features (3 cards)
│
└── /quote (Formulaire)
    ├── Header
    ├── Formulaire complet
    ├── Actions (Generate + Download)
    └── Preview (si devis généré)
```

---

## 📄 Pages détaillées

### `/` - Page d'accueil (Landing)

**Objectif** : Convaincre et rediriger vers /quote

**Contenu** :
1. **Header** : Logo + Nom
2. **Badge** : "Smart quoting platform" avec dot animé
3. **Titre** : "Create professional quotes **in minutes**"
4. **Sous-titre** : Description plateforme
5. **CTA** : Bouton "Try it now →" (bleu)
6. **Features** : 3 cartes (Lightning fast, Professional, Save money)

**Design** :
- Background : Gradient bleu/blanc/violet (subtil)
- Couleurs : Bleu 600/700, Violet 600
- Responsive : 1 colonne mobile → 3 colonnes desktop

**Fichier** : `src/app/page.tsx`

---

### `/quote` - Page formulaire

**Objectif** : Générer et télécharger des devis

**Contenu** :
1. **Header** : Logo + Nom
2. **Titre** : "Generate a quote"
3. **Formulaire** :
   - Description intervention (textarea)
   - Vos informations (6 champs)
   - Informations client (4 champs)
4. **Actions** :
   - Bouton "Generate quote" (bleu)
   - Bouton "Download PDF" (blanc)
5. **Preview** : Aperçu du devis (si généré)

**Design** :
- Background : Blanc + Gris-50 (section formulaire)
- Card blanche : shadow-sm, rounded-lg
- Structure Input Field standard

**Fichier** : `src/app/quote/page.tsx`

---

## 🧩 Composants réutilisables

### `Header.tsx`
```tsx
- Logo 32x32
- "Fixly.io" (text-xl)
- Border bottom gris
- Présent sur toutes les pages
```
**Fichier** : `src/components/Header.tsx`

### `QuoteForm.tsx`
```tsx
- Formulaire complet
- Gestion state (description, artisan, client)
- API calls (generate-quote, generate-pdf)
- Preview du devis
- Messages d'erreur
```
**Fichier** : `src/components/QuoteForm.tsx`

---

## 🎨 Couleurs par page

### Page `/` (Landing)
| Élément | Couleur |
|---------|---------|
| Background | Gradient blue-50 → white → purple-50 |
| Badge | bg-blue-100, text-blue-700 |
| Dot | bg-blue-500 (pulse) |
| Titre gradient | blue-600 → purple-600 |
| CTA | bg-blue-600, hover:blue-700 |
| Icons bg | blue-100, purple-100 |

### Page `/quote` (Formulaire)
| Élément | Couleur |
|---------|---------|
| Background | white (header), gray-50 (section) |
| Card | white |
| Borders | gray-200, gray-300 |
| Focus | ring-blue-500 |
| CTA primaire | bg-blue-600 |
| CTA secondaire | bg-white, border-gray-300 |

---

## 📱 Navigation

### User flow
```
1. Arrivée sur /
   ↓
2. Lecture Hero + Features
   ↓
3. Click "Try it now"
   ↓
4. Redirection vers /quote
   ↓
5. Remplissage formulaire
   ↓
6. Click "Generate quote"
   ↓
7. Preview du devis
   ↓
8. Click "Download PDF"
   ↓
9. Téléchargement fichier
```

### Liens
- **Bouton "Try it now"** : `<Link href="/quote">`
- **Logo** (futur) : `<Link href="/">`

---

## 🎯 Responsive

### Breakpoints
- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px

### Adaptations par page

#### `/` Landing
| Élément | Mobile | Desktop |
|---------|--------|---------|
| Titre | text-5xl | text-7xl |
| Features grid | 1 col | 3 cols |
| Padding | px-4 | px-8 |
| Spacing | py-24 | py-32 |

#### `/quote` Formulaire
| Élément | Mobile | Desktop |
|---------|--------|---------|
| Card width | 100% | max-w-2xl |
| Buttons | stacked | row |
| Inputs grid | 1 col | 2 cols |
| Padding | p-6 | p-8 |

---

## 🔄 API Routes

### `/api/generate-quote`
**Method** : POST  
**Input** : 
```json
{
  "description": "string",
  "artisanInfo": { ... },
  "clientInfo": { ... }
}
```
**Output** : Quote object (JSON)  
**Mock** : Activé (USE_MOCK = true)

### `/api/generate-pdf`
**Method** : POST  
**Input** : Quote object  
**Output** : PDF file (binary)  
**Library** : jsPDF

---

## 📊 Structure fichiers

```
devis-artisan-mvp/
├── src/
│   ├── app/
│   │   ├── page.tsx                    ← Landing /
│   │   ├── quote/
│   │   │   └── page.tsx                ← Formulaire /quote
│   │   ├── api/
│   │   │   ├── generate-quote/
│   │   │   │   └── route.ts            ← API génération
│   │   │   └── generate-pdf/
│   │   │       └── route.ts            ← API PDF
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Header.tsx                  ← Réutilisable
│   │   └── QuoteForm.tsx               ← Réutilisable
│   ├── lib/
│   │   ├── openai.ts                   ← IA (si mock OFF)
│   │   ├── pdf.ts                      ← Génération PDF
│   │   └── mock-data.ts                ← Données mock
│   └── types/
│       └── quote.ts                    ← Types TypeScript
├── public/
│   └── logo.svg                        ← Logo
└── Documentation...
```

---

## 🎨 Design System Summary

### Couleurs primaires
- **Bleu** : Primary (CTA, focus, accents)
- **Violet** : Secondary (accents, gradient)
- **Gris** : Neutral (texte, borders, backgrounds)

### Typographie
- **Sans-serif** : Système (pas de custom font)
- **Tailles** : 14px → 72px (responsive)
- **Weights** : regular, medium, semibold, bold

### Composants
- **Border radius** : 6-8px (md/lg)
- **Shadows** : sm (subtiles)
- **Spacing** : Généreux (gap-6, space-y-6)
- **Transitions** : Colors (subtiles)

---

## ✅ État actuel

### ✅ Fonctionnel
- Page d'accueil avec CTA
- Page formulaire complète
- Navigation entre pages
- Génération devis (mock)
- Téléchargement PDF
- Responsive complet

### 🎨 Design
- Couleurs subtiles ajoutées
- Gradient background (landing)
- Icons colorés
- Animations légères (pulse, hover)

### 📱 Responsive
- Mobile : 100% fonctionnel
- Desktop : 100% fonctionnel
- Transitions fluides

---

**Structure claire, design cohérent, navigation fonctionnelle ! 🎉**
