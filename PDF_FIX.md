# 🔧 Fix du bouton "Télécharger PDF"

## ❌ Problème rencontré

```
Error: ENOENT: no such file or directory, open 
'/Users/.../devis-artisan-mvp/.next/dev/server/vendor-chunks/data/Helvetica.afm'
```

**Cause** : PDFKit ne fonctionne pas avec Next.js car il cherche des fichiers de polices qui ne sont pas bundlés correctement dans l'environnement serveur de Next.js.

## ✅ Solution appliquée

### Remplacement de la librairie PDF

**Avant** : PDFKit
- Librairie Node.js traditionnelle
- Nécessite des fichiers de polices externes
- Incompatible avec le bundling Next.js

**Après** : jsPDF
- Librairie moderne compatible navigateur et serveur
- Polices embarquées
- Fonctionne parfaitement avec Next.js
- Plus légère et plus simple

### Changements effectués

1. **Désinstallation PDFKit**
```bash
npm uninstall pdfkit @types/pdfkit
```

2. **Installation jsPDF**
```bash
npm install jspdf
```

3. **Réécriture de `src/lib/pdf.ts`**
- Nouvelle implémentation avec jsPDF
- Même structure de PDF
- Même design professionnel
- Buffer compatible avec Next.js Response

## 📄 Résultat

Le bouton "Télécharger" fonctionne maintenant parfaitement :

1. Cliquer sur "Générer le devis"
2. Cliquer sur "Télécharger"
3. Le fichier PDF est généré et téléchargé : `devis-DEV-2024-XXXX.pdf`

## 🎨 Contenu du PDF

Le PDF généré contient :
- ✅ Header avec titre "DEVIS"
- ✅ Numéro de devis et dates
- ✅ Informations artisan (nom, adresse, téléphone, email, SIRET)
- ✅ Informations client (nom, adresse, téléphone, email)
- ✅ Tableau des prestations avec colonnes (Description, Qté, P.U. HT, Total HT)
- ✅ Calculs automatiques (Sous-total HT, TVA 20%, Total TTC)
- ✅ Notes
- ✅ Footer avec mention légale

## 🧪 Test vérifié

```bash
# Test simple de génération PDF
node test-pdf.js
# ✅ PDF généré avec succès dans /tmp/test.pdf
# ✅ Taille: 3160 bytes
```

## 📦 Dépendances finales

```json
{
  "dependencies": {
    "openai": "^x.x.x",
    "jspdf": "^x.x.x"  // ← Nouvelle dépendance
  }
}
```

## ✅ Status final

🟢 **Bouton "Télécharger PDF" : FONCTIONNEL**  
🟢 **Build production : OK**  
🟢 **TypeScript : Aucune erreur**  
🟢 **Compatibilité Next.js : Complète**
