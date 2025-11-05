# 🌍 Mock Data - English Version

## ✅ Modification effectuée

Le mock a été converti **entièrement en anglais** pour générer des devis en anglais.

---

## 📋 Mock Items (EN)

### Avant (FR)
```typescript
{
  description: "Chauffe-eau électrique 200L blindé vertical",
  quantity: 1,
  unit: "unité",
  unitPrice: 450.00,
  total: 450.00
}
```

### Après (EN)
```typescript
{
  description: "200L electric water heater - vertical installation",
  quantity: 1,
  unit: "unit",
  unitPrice: 450.00,
  total: 450.00
}
```

---

## 🛠️ Liste complète des items (EN)

1. **200L electric water heater - vertical installation**
   - 1 unit @ $450.00 = $450.00

2. **Safety kit (pressure relief valve + drain + reducer)**
   - 1 unit @ $55.00 = $55.00

3. **Thermostatic bathroom mixer tap**
   - 1 unit @ $120.00 = $120.00

4. **Stainless steel connection hoses**
   - 2 units @ $15.00 = $30.00

5. **Labor - installation and connection work**
   - 3 hours @ $55.00 = $165.00

6. **Travel and commissioning**
   - 1 flat rate @ $50.00 = $50.00

7. **Disposal of old equipment**
   - 1 flat rate @ $30.00 = $30.00

**Subtotal**: $900.00  
**VAT (20%)**: $180.00  
**Total**: $1,080.00

---

## 📅 Format des dates

### Avant (FR)
```typescript
date: today.toLocaleDateString('fr-FR')
// Exemple: 05/11/2024 (DD/MM/YYYY)
```

### Après (EN-US)
```typescript
date: today.toLocaleDateString('en-US')
// Exemple: 11/5/2024 (MM/DD/YYYY)
```

---

## 📝 Valeurs par défaut (EN)

### Artisan
```typescript
{
  name: 'Your Name',           // (was: Votre Nom)
  company: 'Your Company',      // (was: Votre Entreprise)
  address: 'Your Address',      // (was: Votre Adresse)
  phone: '+1 XXX XXX XXXX',    // (was: 06 XX XX XX XX)
  email: 'your@email.com',     // (was: votre@email.com)
}
```

### Client
```typescript
{
  name: 'Client Name',          // (was: Nom du Client)
  address: 'Client Address',    // (was: Adresse du Client)
}
```

### Notes
```typescript
notes: 'Quote generated automatically. Thank you for your trust.'
// (was: Devis généré automatiquement. Merci de votre confiance.)
```

---

## 📄 Exemple de devis généré (EN)

```
QUOTE

No. QUO-2024-1234
Date: 11/5/2024
Valid until: 12/5/2024

CONTRACTOR
Your Company
Your Address
+1 XXX XXX XXXX
your@email.com

CLIENT
Client Name
Client Address

SERVICES
200L electric water heater - vertical installation (1 unit) ......... $450.00
Safety kit (pressure relief valve + drain + reducer) (1 unit) ...... $55.00
Thermostatic bathroom mixer tap (1 unit) ........................... $120.00
Stainless steel connection hoses (2 units) ......................... $30.00
Labor - installation and connection work (3 hours) ................. $165.00
Travel and commissioning (1 flat rate) ............................. $50.00
Disposal of old equipment (1 flat rate) ............................ $30.00

Subtotal (excl. VAT): $900.00
VAT (20%): $180.00
TOTAL (incl. VAT): $1,080.00

Notes: Quote generated automatically. Thank you for your trust.
```

---

## 🔧 Fichiers modifiés

### `src/lib/mock-data.ts`
```typescript
export const MOCK_QUOTE_ITEMS: QuoteItem[] = [
  {
    description: "200L electric water heater - vertical installation",
    quantity: 1,
    unit: "unit",
    unitPrice: 450.00,
    total: 450.00
  },
  // ... 6 other items
];
```

### `src/app/api/generate-quote/route.ts`
```typescript
const quote: Quote = {
  artisan: {
    name: artisanInfo?.name || 'Your Name',
    company: artisanInfo?.company || 'Your Company',
    // ...
  },
  date: today.toLocaleDateString('en-US'),
  validUntil: validUntil.toLocaleDateString('en-US'),
  notes: 'Quote generated automatically. Thank you for your trust.',
};
```

---

## ✅ Tests

### Build
```bash
npm run build
# ✅ Compiled successfully
```

### Génération
1. Go to http://localhost:3000/quote
2. Fill form (or leave empty for defaults)
3. Click "Generate quote"
4. ✅ Preview shows English text
5. Click "Download PDF"
6. ✅ PDF contains English content

### Exemple de résultat
- ✅ Descriptions: English
- ✅ Units: "unit", "hour", "flat rate"
- ✅ Dates: MM/DD/YYYY format
- ✅ Labels: "CONTRACTOR", "CLIENT", "SERVICES"
- ✅ Notes: English text

---

## 🌍 Localisation future (optionnel)

Pour supporter plusieurs langues :

1. Créer `src/lib/locales/`:
   - `en.ts` - English (actuel)
   - `fr.ts` - Français
   - `es.ts` - Español

2. Context provider pour la langue

3. Switch dans le Header

---

## 📊 Avant / Après

| Élément | Avant (FR) | Après (EN) |
|---------|-----------|-----------|
| Descriptions | Français | **English** |
| Units | unité, heure, forfait | **unit, hour, flat rate** |
| Dates | DD/MM/YYYY | **MM/DD/YYYY** |
| Defaults | Votre Nom, etc. | **Your Name, etc.** |
| Notes | Français | **English** |
| Currency | € (symbol) | **$ (symbol)** |

---

**Mock maintenant 100% en anglais ! 🇺🇸**
