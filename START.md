# 🚀 Démarrage Rapide

## ⚡ En 3 étapes

### 1️⃣ Configurer la clé API OpenAI

Éditer le fichier `.env.local` et remplacer :
```
OPENAI_API_KEY=your_openai_api_key_here
```

**Obtenir une clé API :**
1. Aller sur https://platform.openai.com/api-keys
2. Se connecter ou créer un compte
3. Cliquer sur "Create new secret key"
4. Copier la clé (sk-...)
5. La coller dans `.env.local`

### 2️⃣ Lancer l'application

```bash
cd /Users/francoisgtu/.config/goose/mcp-hermit/devis-artisan-mvp
npm run dev
```

### 3️⃣ Ouvrir dans le navigateur

```
http://localhost:3000
```

## ✅ C'est prêt !

Vous pouvez maintenant :
- Décrire une intervention
- Remplir vos informations
- Générer un devis
- Télécharger le PDF

## 💰 Coût estimé

- OpenAI API : ~0,05€ par devis généré
- Pour 300 devis/mois : ~15€

## 🎯 Prochaines étapes

1. Tester avec des vraies interventions
2. Ajuster les prix si nécessaire
3. Ajouter un système de paiement (Stripe)
4. Déployer sur Vercel
5. Commencer à acquérir vos premiers clients !

## 🐛 En cas de problème

**Erreur "OPENAI_API_KEY not found"** :
- Vérifier que `.env.local` existe
- Vérifier que la clé est correcte
- Redémarrer le serveur (`Ctrl+C` puis `npm run dev`)

**Erreur lors de la génération** :
- Vérifier le crédit OpenAI sur https://platform.openai.com/usage
- Vérifier la connexion internet

**Port 3000 déjà utilisé** :
```bash
npm run dev -- -p 3001
```
Puis ouvrir http://localhost:3001
