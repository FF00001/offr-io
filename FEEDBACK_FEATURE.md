# 📝 Feature - Feedback Page

## ✅ Nouvelle fonctionnalité

Page dédiée pour recueillir les feedbacks des utilisateurs.

---

## 🎯 Objectif

Permettre aux utilisateurs de :
- Partager leur avis sur Offr.io
- Suggérer des améliorations
- Signaler des problèmes
- Communiquer avec l'équipe

---

## 🗺️ Navigation

### Accès
```
Header (toutes les pages)
  ↓ Click "Share your feedback"
/feedback
```

### Bouton dans Header
**Position** : Top right  
**Texte** : "Share your feedback"  
**Style** : Texte gris simple, hover plus foncé  

---

## 📄 Page `/feedback`

### Structure
```
┌─────────────────────────────────────┐
│ Header (avec bouton feedback)       │
├─────────────────────────────────────┤
│                                     │
│  Share your feedback                │
│  We'd love to hear your thoughts... │
│                                     │
│  Your feedback                      │
│  Tell us what you think...          │
│  ┌───────────────────────────────┐  │
│  │                               │  │
│  │  Textarea (h-40)              │  │
│  │                               │  │
│  └───────────────────────────────┘  │
│                                     │
│     [Send]                          │
│                                     │
└─────────────────────────────────────┘
```

### Après soumission
```
┌─────────────────────────────────────┐
│                                     │
│          ✓ (icône verte)            │
│                                     │
│   Thank you for your feedback!      │
│                                     │
│   Your input is valuable and helps  │
│   us make the solution better.      │
│                                     │
│   [Submit another feedback]         │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎨 Design

### Formulaire

**Card** :
```css
bg-white
rounded-lg
shadow-sm
border border-gray-200
p-6 sm:p-8
```

**Titre** :
```css
text-2xl font-bold text-gray-900
```

**Sous-titre** :
```css
text-gray-600
```

**Textarea** :
```css
w-full h-40
px-4 py-3
border border-gray-300
rounded-md shadow-sm
focus:ring-2 focus:ring-blue-500
resize-none
```

**Bouton Send** :
```css
w-full
bg-blue-600 hover:bg-blue-700
text-white font-medium
py-3 px-6
rounded-md shadow-sm
```

### Message de confirmation

**Icône** :
```css
w-16 h-16
bg-green-100
rounded-full
(checkmark vert)
```

**Texte principal** :
```css
text-lg text-gray-900 font-medium
```

**Texte secondaire** :
```css
text-gray-600
```

**Lien** :
```css
text-blue-600 hover:text-blue-700
```

---

## 🔧 Fonctionnalités

### Validation
- ✅ Textarea `required`
- ✅ Empêche soumission si vide
- ✅ Affiche message si valide

### États
1. **Initial** : Formulaire vide
2. **Filled** : Utilisateur tape
3. **Submitted** : Message de confirmation
4. **Reset** : Click "Submit another feedback"

### Gestion du state
```tsx
const [feedback, setFeedback] = useState('');
const [submitted, setSubmitted] = useState(false);
```

---

## 💻 Code

### Page complète
```tsx
'use client';

import { useState } from 'react';
import Header from '@/components/Header';

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      console.log('Feedback submitted:', feedback);
      setSubmitted(true);
      setFeedback('');
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <section className="w-full bg-gray-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
            {/* Formulaire ou message */}
          </div>
        </div>
      </section>
    </main>
  );
}
```

### Header avec bouton
```tsx
<header className="w-full border-b border-gray-200 bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
    <Link href="/">
      <h1 className="...gradient...">Offr.io</h1>
    </Link>
    
    <Link href="/feedback" className="text-sm font-medium text-gray-600 hover:text-gray-900">
      Share your feedback
    </Link>
  </div>
</header>
```

---

## 📱 Responsive

### Mobile (< 640px)
✅ Card full width  
✅ Padding réduit (p-6)  
✅ Texte adapté  

### Desktop (≥ 640px)
✅ Max-width 672px (2xl)  
✅ Padding généreux (p-8)  
✅ Centered  

---

## 🧪 Tests

### Navigation
1. ✅ Cliquer "Share your feedback" dans Header
2. ✅ Arrive sur /feedback
3. ✅ Formulaire s'affiche

### Soumission
1. ✅ Remplir textarea
2. ✅ Cliquer "Send"
3. ✅ Message de confirmation s'affiche
4. ✅ Console log affiche le feedback

### Validation
1. ✅ Laisser vide → validation navigateur
2. ✅ Remplir → soumission OK

### Reset
1. ✅ Cliquer "Submit another feedback"
2. ✅ Formulaire réapparaît vide

---

## 🔄 Intégration backend (Future)

### Actuel
```typescript
console.log('Feedback submitted:', feedback);
```

### À implémenter
```typescript
// API route
await fetch('/api/feedback', {
  method: 'POST',
  body: JSON.stringify({ feedback }),
});

// Sauvegarder en base de données
// Envoyer email notification
// Intégrer avec outil de feedback (TypeForm, etc.)
```

---

## 📊 User Flow

```
1. Utilisateur sur n'importe quelle page
   ↓
2. Voit "Share your feedback" (Header)
   ↓
3. Click → /feedback
   ↓
4. Lit instructions
   ↓
5. Tape feedback dans textarea
   ↓
6. Click "Send"
   ↓
7. Voit message de confirmation
   ↓
8. Options:
   - Submit another feedback
   - Retour via Header
```

---

## ✅ Checklist

### Fonctionnalités
- [x] Page /feedback créée
- [x] Bouton dans Header
- [x] Formulaire avec validation
- [x] Message de confirmation
- [x] Reset state possible

### Design
- [x] Styles cohérents (Input Field)
- [x] Icône verte checkmark
- [x] Responsive
- [x] Hover states

### Navigation
- [x] Link depuis Header
- [x] Logo clickable (retour /)
- [x] Accessible de partout

---

## 🎯 Résultat

**Feature "Share your feedback" complète** :
- ✅ Accessible depuis toutes les pages
- ✅ Formulaire simple et clair
- ✅ Message de confirmation engageant
- ✅ Design cohérent avec le site
- ✅ Prêt pour intégration backend

---

**URLs** :
- Feedback : http://localhost:3000/feedback

**Fichiers** :
- `src/app/feedback/page.tsx` - Page feedback
- `src/components/Header.tsx` - Bouton ajouté
