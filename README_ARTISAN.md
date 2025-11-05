# 🔧 Devis Artisan Pro - MVP

## Générateur de devis instantané pour artisans avec IA

### 🎯 Concept
Application web qui permet aux artisans (plombiers principalement) de générer des devis professionnels en 30 secondes simplement en décrivant leur intervention en langage naturel.

### ✨ Fonctionnalités

- **Génération IA** : Décrivez votre intervention et l'IA génère automatiquement les lignes du devis
- **Calculs automatiques** : Prix, quantités, TVA, totaux calculés automatiquement
- **PDF professionnel** : Document prêt à envoyer avec design soigné
- **Spécialisé plombier** : Prix réalistes et vocabulaire adapté au métier
- **Interface simple** : Pas de logiciel compliqué, juste un formulaire web

### 🚀 Installation

1. **Cloner et installer les dépendances**
```bash
cd /Users/francoisgtu/.config/goose/mcp-hermit/devis-artisan-mvp
npm install
```

2. **Configurer la clé API OpenAI**
Éditer le fichier `.env.local` et remplacer :
```
OPENAI_API_KEY=your_openai_api_key_here
```
Par votre vraie clé API OpenAI (obtenue sur https://platform.openai.com/api-keys)

3. **Lancer l'application**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur**
```
http://localhost:3000
```

### 📝 Utilisation

1. **Décrivez votre intervention** dans le champ texte
   - Exemple : "Remplacer un chauffe-eau de 200L et installer un nouveau mitigeur dans la salle de bain"

2. **Remplissez vos informations** (artisan et client)

3. **Cliquez sur "Générer le devis"**
   - L'IA analyse votre description
   - Génère automatiquement les lignes avec prix

4. **Téléchargez le PDF**
   - Document professionnel prêt à envoyer

### 💰 Modèle économique prévu

- **Freemium** : 3 devis gratuits/mois
- **Paiement à l'usage** : 0,99€ par devis PDF
- **Abonnement** : 5€/mois (illimité)

### 🛠️ Stack technique

- **Frontend** : Next.js 15 + TypeScript + TailwindCSS
- **IA** : OpenAI GPT-4o-mini
- **PDF** : jsPDF (compatible Next.js)
- **Déploiement** : Vercel (prévu)

### 📦 Structure du projet

```
devis-artisan-mvp/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── generate-quote/   # API génération devis IA
│   │   │   └── generate-pdf/      # API génération PDF
│   │   ├── page.tsx               # Page d'accueil
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── QuoteForm.tsx          # Formulaire principal
│   ├── lib/
│   │   ├── openai.ts              # Intégration OpenAI
│   │   └── pdf.ts                 # Génération PDF
│   └── types/
│       └── quote.ts               # Types TypeScript
├── .env.local                     # Variables d'environnement
└── package.json
```

### 🎨 Différenciation

**vs Billdu / Coover / FactureDevis** :
- ✅ **Hyper-spécialisé** : Focus plombier avec tarifs adaptés
- ✅ **IA intelligente** : Génération en langage naturel (pas de formulaire complexe)
- ✅ **Ultra-rapide** : 30 secondes vs 5-10 minutes
- ✅ **Prix accessible** : Paiement à l'usage vs abonnement mensuel
- ✅ **Simple** : Une page vs logiciel complet

### 🚀 Prochaines étapes

1. ✅ MVP fonctionnel
2. ⏳ Ajouter authentification (Clerk/Auth0)
3. ⏳ Système de crédits / paiement Stripe
4. ⏳ Base de données pour sauvegarder les devis
5. ⏳ Templates pour autres métiers (électricien, peintre)
6. ⏳ Export supplémentaires (Excel, email direct)
7. ⏳ Landing page marketing
8. ⏳ SEO local ("devis plombier Lyon", etc.)

### 💡 Exemples de descriptions

**Plomberie** :
- "Remplacer un chauffe-eau de 200L et poser un mitigeur"
- "Déboucher une canalisation et remplacer le siphon"
- "Installer une nouvelle salle de bain complète"

**Électricité** (future version) :
- "Refaire le tableau électrique et ajouter 3 prises"
- "Installer un détecteur de fumée et remplacer les interrupteurs"

### 📊 Investissement

- **Développement MVP** : 0€ (fait maison)
- **Domaine** : 10€/an
- **Vercel hosting** : 0€ (plan gratuit)
- **OpenAI API** : ~15€/mois (estimation 300 devis)
- **Total mensuel** : ~15-20€

### 🎯 Objectif 1er euro

- **Jour 1-2** : MVP fonctionnel ✅
- **Jour 3-4** : Landing page + SEO local
- **Jour 5-6** : Intégration Stripe
- **Jour 7** : Lancement sur réseaux sociaux + groupes Facebook artisans
- **Jour 8-10** : Premiers tests utilisateurs
- **Objectif** : Premier paiement sous 7-10 jours

### 📞 Support

Pour toute question : [votre email]

---

**Version** : 1.0 MVP  
**Date** : Novembre 2024  
**Status** : ✅ Fonctionnel
