# Migration vers Vercel Postgres

## 1. Installer les dépendances

```bash
npm install @vercel/postgres
```

## 2. Créer une base de données Vercel Postgres

1. Allez sur votre dashboard Vercel : https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur "Storage" dans le menu
4. Cliquez sur "Create Database"
5. Sélectionnez "Postgres"
6. Choisissez un nom (ex: `offr-db`)
7. Sélectionnez une région proche de vos utilisateurs
8. Cliquez sur "Create"

## 3. Configurer les variables d'environnement

Vercel va automatiquement ajouter ces variables à votre projet :
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

Pour le développement local, créez un fichier `.env.local` :

```bash
# Copiez les valeurs depuis Vercel Dashboard > Storage > votre DB > .env.local
POSTGRES_URL="..."
POSTGRES_PRISMA_URL="..."
POSTGRES_URL_NON_POOLING="..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

## 4. Initialiser les tables

Une fois déployé, les tables seront créées automatiquement au premier appel API.

OU vous pouvez exécuter manuellement :

```bash
# En local
npm run db:init

# Ou via Vercel CLI
vercel env pull .env.local
npm run db:init
```

## 5. Migrer les données existantes (optionnel)

Si vous avez des données dans `data/*.json`, vous pouvez les migrer :

```bash
npm run db:migrate-data
```

## 6. Déployer sur Vercel

```bash
vercel --prod
```

## Notes importantes

- ✅ Les fichiers `data/*.json` ne sont plus utilisés en production
- ✅ La base de données Postgres est automatiquement sauvegardée par Vercel
- ✅ Le plan gratuit Vercel Postgres offre 256 MB de stockage
- ✅ Pour plus de stockage, passez au plan Pro

## Vérification

Une fois déployé, testez :
1. Signup d'un nouvel utilisateur
2. Login
3. Création d'un devis
4. Upload d'un catalogue

Tous les appels doivent maintenant fonctionner en production ! 🎉
