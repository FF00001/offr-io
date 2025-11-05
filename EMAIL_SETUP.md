# 📧 Configuration Email - Resend

## ✅ Fonctionnalité

Tous les feedbacks soumis via `/feedback` sont automatiquement envoyés par email à :
**lucasdelaab@gmail.com**

---

## 🚀 Setup Resend (Gratuit)

### Étape 1 : Créer un compte Resend

1. Aller sur **https://resend.com**
2. Cliquer sur "Sign Up" (gratuit)
3. Créer un compte avec votre email

### Étape 2 : Obtenir la clé API

1. Une fois connecté, aller sur **API Keys**
2. Cliquer sur "Create API Key"
3. Nom : "Offr.io Feedback"
4. Permissions : "Sending access"
5. Copier la clé qui commence par `re_...`

### Étape 3 : Configurer la clé

Éditer le fichier `.env.local` :
```bash
RESEND_API_KEY=re_...votre_cle_ici...
```

### Étape 4 : Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
npm run dev
```

---

## 📧 Format de l'email

### Destinataire
**À** : lucasdelaab@gmail.com

### Sujet
**Subject** : "New Feedback from Offr.io"

### Corps de l'email (HTML)
```
╔══════════════════════════════════╗
║  New Feedback Received           ║
║                                  ║
║  A user has submitted feedback   ║
║  on Offr.io                      ║
║                                  ║
║  ┌────────────────────────────┐  ║
║  │ [Le feedback de l'user]    │  ║
║  └────────────────────────────┘  ║
║                                  ║
║  Sent from Offr.io Feedback Form ║
╚══════════════════════════════════╝
```

### Exemple d'email reçu
```
Subject: New Feedback from Offr.io
From: Offr.io Feedback <onboarding@resend.dev>
To: lucasdelaab@gmail.com

New Feedback Received

A user has submitted feedback on Offr.io

┌─────────────────────────────────────┐
│ The form is great but I would love  │
│ to see more templates for different │
│ types of work!                      │
└─────────────────────────────────────┘

Sent from Offr.io Feedback Form
```

---

## 🔧 Fonctionnement technique

### User flow
```
1. User va sur /feedback
   ↓
2. Remplit le formulaire
   ↓
3. Click "Send"
   ↓
4. API POST /api/feedback
   ↓
5. Resend envoie l'email
   ↓
6. User voit message de confirmation
   ↓
7. Email arrive à lucasdelaab@gmail.com
```

### Code API
```typescript
// src/app/api/feedback/route.ts
await resend.emails.send({
  from: 'Offr.io Feedback <onboarding@resend.dev>',
  to: ['lucasdelaab@gmail.com'],
  subject: 'New Feedback from Offr.io',
  html: `...formatted feedback...`,
});
```

---

## 💰 Pricing Resend

### Free Tier
- ✅ **3,000 emails/mois** gratuits
- ✅ Parfait pour un MVP
- ✅ Pas de carte de crédit requise

### Au-delà
- $20/mois pour 50,000 emails
- (Largement suffisant même avec succès)

---

## 🧪 Test

### Sans clé API (mode développement)
```bash
# L'email ne sera pas envoyé
# Mais le formulaire fonctionnera
# Message d'erreur en console
```

### Avec clé API (production)
1. Configurer `RESEND_API_KEY` dans `.env.local`
2. Redémarrer le serveur
3. Aller sur http://localhost:3000/feedback
4. Soumettre un feedback
5. ✅ Email reçu à lucasdelaab@gmail.com

---

## 📋 Template email (modifiable)

Pour personnaliser l'email, éditer `src/app/api/feedback/route.ts` :

```typescript
html: `
  <div style="font-family: Arial, sans-serif;">
    <h2 style="color: #2563eb;">New Feedback</h2>
    <div style="background: #f9fafb; padding: 20px;">
      ${feedback}
    </div>
  </div>
`,
```

Vous pouvez :
- Changer les couleurs
- Ajouter un logo
- Modifier le layout
- Ajouter des métadonnées (date, user IP, etc.)

---

## 🔐 Sécurité

### Rate limiting (à implémenter - optionnel)
Pour éviter le spam :

```typescript
// Limiter à 5 feedbacks par IP par heure
// Utiliser un package comme `upstash/ratelimit`
```

### Validation
- ✅ Feedback required (front + back)
- ✅ Trim des espaces
- ✅ Longueur max (optionnel à ajouter)

---

## 📊 Monitoring

### Console logs
```typescript
console.log('Feedback submitted:', feedback);
console.error('Error sending email:', error);
```

### Future improvements
- [ ] Save feedback to database
- [ ] Dashboard admin pour voir feedbacks
- [ ] Auto-response email to user
- [ ] Sentiment analysis
- [ ] Categories/tags

---

## ✅ Checklist

### Configuration
- [ ] Compte Resend créé
- [ ] API Key obtenue
- [ ] `.env.local` configuré
- [ ] Serveur redémarré

### Test
- [ ] Aller sur /feedback
- [ ] Remplir formulaire
- [ ] Cliquer "Send"
- [ ] Vérifier email reçu à lucasdelaab@gmail.com

### Production
- [ ] Ajouter `RESEND_API_KEY` dans Vercel
- [ ] Tester en production
- [ ] Vérifier réception emails

---

## 🎯 Résultat

**Chaque feedback** :
- ✅ Est envoyé automatiquement
- ✅ Arrive à lucasdelaab@gmail.com
- ✅ Format HTML propre et lisible
- ✅ Gratuit (jusqu'à 3000/mois)
- ✅ Instant

---

**Configuration requise** :
1. Créer compte sur https://resend.com
2. Obtenir API Key
3. Ajouter dans `.env.local`
4. Redémarrer serveur

**C'est tout ! Les emails seront automatiquement envoyés.** 📧
