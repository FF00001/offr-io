# 🔄 Changements appliqués - Migration Postgres

## ❌ Problème

```
Error: EROFS: read-only file system, open '/var/task/data/users.json'
```

Vercel utilise un système de fichiers **en lecture seule**. Impossible d'écrire dans `data/*.json` en production.

---

## ✅ Solution

Migration vers **Vercel Postgres** (base de données relationnelle).

---

## 📝 Fichiers modifiés

### 1. **`package.json`**
- ✅ Ajout de `@vercel/postgres@^0.10.0`
- ✅ Ajout de `tsx@^4.19.2` (dev dependency)
- ✅ Ajout du script `db:init`

### 2. **`src/lib/db.ts`** (remplacé)
- ❌ Ancien : Lecture/écriture de fichiers JSON
- ✅ Nouveau : Requêtes SQL avec `@vercel/postgres`
- ✅ Fonctions identiques (API compatible)
- ✅ Backup de l'ancien : `db-json.ts.backup`

### 3. **Nouveaux fichiers**

#### `src/app/api/db-init/route.ts`
- Route pour initialiser la DB manuellement
- Accessible via `GET /api/db-init`

#### `scripts/init-db.ts`
- Script pour initialiser la DB en local
- Exécutable via `npm run db:init`

#### `DEPLOY_VERCEL.md`
- Guide complet de déploiement
- Instructions étape par étape

#### `POSTGRES_MIGRATION.md`
- Documentation de migration
- Configuration Vercel Postgres

---

## 🗄️ Structure de la base de données

### Tables créées :

1. **`users`**
   - `id` (TEXT, PRIMARY KEY)
   - `email` (TEXT, UNIQUE)
   - `password` (TEXT)
   - `name` (TEXT)
   - `account_type` (TEXT) → 'agent' | 'enterprise'
   - `enterprise_id` (TEXT, nullable)
   - `created_at` (TIMESTAMP)

2. **`quotes`**
   - `id` (TEXT, PRIMARY KEY)
   - `user_id` (TEXT, FOREIGN KEY → users)
   - `quote_number` (TEXT)
   - `client_name` (TEXT)
   - `date` (TIMESTAMP)
   - `total` (NUMERIC)
   - `quote_data` (JSONB)
   - `created_at` (TIMESTAMP)

3. **`catalogs`**
   - `id` (TEXT, PRIMARY KEY)
   - `user_id` (TEXT, FOREIGN KEY → users)
   - `name` (TEXT)
   - `data` (JSONB)
   - `uploaded_at` (TIMESTAMP)

4. **`invitations`**
   - `id` (TEXT, PRIMARY KEY)
   - `enterprise_id` (TEXT, FOREIGN KEY → users)
   - `email` (TEXT)
   - `token` (TEXT, UNIQUE)
   - `used` (BOOLEAN)
   - `created_at` (TIMESTAMP)

5. **`templates`**
   - `id` (TEXT, PRIMARY KEY)
   - `user_id` (TEXT, FOREIGN KEY → users)
   - `name` (TEXT)
   - `file_name` (TEXT)
   - `file_data` (TEXT)
   - `file_size` (INTEGER)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

---

## 🚀 Prochaines étapes

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Créer la DB sur Vercel**
   - Dashboard > Storage > Create Database > Postgres

3. **Copier les variables d'env**
   - Créer `.env.local` avec les credentials

4. **Déployer**
   ```bash
   vercel --prod
   ```

5. **La DB s'initialise automatiquement au premier signup !**

---

## ✨ Bénéfices

- ✅ **Fonctionne en production** (plus d'erreur EROFS)
- ✅ **Scalable** (jusqu'à des millions de rows)
- ✅ **Backups automatiques** par Vercel
- ✅ **Requêtes SQL** pour analytics
- ✅ **Foreign keys** pour intégrité des données
- ✅ **JSONB** pour données flexibles (quote_data, catalog items)

---

## 📊 Compatibilité

### Code existant :
✅ **Aucune modification nécessaire dans les API routes**

Toutes les fonctions ont la même signature :
- `getUsers()` → retourne `Promise<User[]>`
- `getUserByEmail(email)` → retourne `Promise<User | undefined>`
- `createUser(user)` → retourne `Promise<void>`
- etc.

Votre code continue de fonctionner tel quel ! 🎉
