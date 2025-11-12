# 🚀 Déploiement Vercel avec Postgres

## ✅ Correctif appliqué

Le bug **EROFS: read-only file system** a été corrigé ! L'application utilise maintenant **Vercel Postgres** au lieu de fichiers JSON locaux.

---

## 📋 Étapes de déploiement

### 1. Installer les dépendances

```bash
npm install
```

Cela installera :
- `@vercel/postgres` - Client Postgres pour Vercel
- `tsx` - Pour exécuter les scripts TypeScript

### 2. Configurer Vercel Postgres

#### Sur Vercel Dashboard :

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet **offr.io** (ou créez-le)
3. Cliquez sur **"Storage"** dans le menu de navigation
4. Cliquez sur **"Create Database"**
5. Sélectionnez **"Postgres"**
6. Donnez un nom : `offr-db`
7. Sélectionnez une région proche de vos utilisateurs (ex: Frankfurt pour l'Europe)
8. Cliquez sur **"Create"**

#### Récupérer les variables d'environnement :

1. Une fois la DB créée, cliquez sur l'onglet **".env.local"**
2. Copiez tout le contenu
3. Créez un fichier `.env.local` à la racine du projet
4. Collez le contenu

Votre `.env.local` devrait ressembler à :

```bash
POSTGRES_URL="postgres://default:..."
POSTGRES_PRISMA_URL="postgres://default:..."
POSTGRES_URL_NON_POOLING="postgres://default:..."
POSTGRES_USER="default"
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="verceldb"
```

### 3. Déployer sur Vercel

```bash
# Installation de Vercel CLI (si pas déjà fait)
npm i -g vercel

# Login
vercel login

# Déployer
vercel --prod
```

### 4. Initialiser la base de données

Une fois déployé, la base de données sera automatiquement initialisée au **premier appel API** (signup, login, etc.).

OU vous pouvez l'initialiser manuellement :

**Option A - Via l'API** :
```bash
curl https://votre-app.vercel.app/api/db-init
```

**Option B - En local** (si vous voulez tester) :
```bash
npm run db:init
```

---

## 🧪 Tester

### En local :

```bash
npm run dev
```

Puis testez :
1. **Signup** : http://localhost:3000/signup
2. **Login** : http://localhost:3000/login
3. **Créer un devis** : Dashboard > Generate Quote
4. **Upload catalogue** : Dashboard > Catalog

### En production :

Visitez votre app sur Vercel :
- https://votre-app.vercel.app/signup

Testez les mêmes fonctionnalités qu'en local.

---

## 📊 Vérifier les données

### Via Vercel Dashboard :

1. Allez sur **Storage** > Votre DB
2. Cliquez sur **"Data"**
3. Vous verrez toutes les tables :
   - `users`
   - `quotes`
   - `catalogs`
   - `invitations`
   - `templates`

4. Cliquez sur une table pour voir les données

### Via SQL Query :

Dans l'onglet **"Query"**, vous pouvez exécuter :

```sql
-- Voir tous les utilisateurs
SELECT * FROM users;

-- Compter les devis
SELECT COUNT(*) FROM quotes;

-- Voir les catalogues
SELECT id, name, uploaded_at FROM catalogs;
```

---

## 🔧 Commandes utiles

```bash
# Développement local
npm run dev

# Build de production
npm run build

# Déployer sur Vercel
vercel --prod

# Initialiser la DB (local)
npm run db:init

# Récupérer les variables d'env de Vercel
vercel env pull .env.local
```

---

## 📦 Limites Vercel Postgres (Plan Gratuit)

- **Stockage** : 256 MB
- **Rows** : ~10 000 utilisateurs
- **Bandwidth** : Illimité

Pour plus, passez au **plan Pro** ($20/mois).

---

## ❗ Important

### Fichiers supprimés :
- ❌ `data/users.json` (n'est plus utilisé)
- ❌ `data/quotes.json` (n'est plus utilisé)
- ❌ `data/catalogs.json` (n'est plus utilisé)
- ❌ `data/invitations.json` (n'est plus utilisé)
- ❌ `data/templates.json` (n'est plus utilisé)

### Backup :
- ✅ L'ancien système est sauvegardé dans `src/lib/db-json.ts.backup`
- ✅ Vercel Postgres fait des backups automatiques
- ✅ Vous pouvez exporter vos données depuis le Dashboard

---

## 🐛 Troubleshooting

### Erreur : "Failed to initialize database"

**Solution** :
1. Vérifiez que les variables d'environnement sont bien configurées dans Vercel
2. Allez sur Vercel Dashboard > Settings > Environment Variables
3. Assurez-vous que toutes les variables `POSTGRES_*` sont présentes

### Erreur : "Connection refused"

**Solution** :
1. Vérifiez que votre IP est autorisée (Vercel le fait automatiquement)
2. Redémarrez votre app sur Vercel

### Les données ne persistent pas

**Solution** :
1. Vérifiez que vous utilisez bien la DB Postgres (pas les fichiers JSON)
2. Vérifiez les logs Vercel : Dashboard > Deployments > Your Deployment > Logs

---

## 🎉 Résultat

✅ **Signup fonctionne en production**  
✅ **Login fonctionne en production**  
✅ **Création de devis fonctionne**  
✅ **Upload de catalogues fonctionne**  
✅ **Tout est persisté dans Postgres**  
✅ **Plus d'erreur EROFS !**

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Consultez les logs Vercel
2. Vérifiez la section Data de votre DB
3. Testez l'endpoint `/api/db-init` pour réinitialiser les tables

Bonne chance ! 🚀
