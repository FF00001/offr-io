# 🧪 Mode Mock - Éviter les appels OpenAI pendant le développement

## Configuration actuelle

**Mode Mock activé** ✅  
Les appels OpenAI sont désactivés pour éviter les coûts pendant le développement.

## Comment ça marche ?

### Mode Mock (activé par défaut)
Le fichier `src/lib/mock-data.ts` contient :
```typescript
export const USE_MOCK = true;
```

Quand le mock est activé, **chaque clic sur "Générer le devis" retourne toujours le même devis exemple** :
- Chauffe-eau électrique 200L
- Kit de sécurité
- Mitigeur thermostatique
- Flexibles
- Main d'œuvre
- Déplacement
- Évacuation

**Coût : 0€** - Aucun appel à l'API OpenAI

### Mode Production (OpenAI)
Pour utiliser la vraie API OpenAI :

1. **Éditer** `src/lib/mock-data.ts`
2. **Changer** :
```typescript
export const USE_MOCK = false;  // ← false au lieu de true
```
3. **Redémarrer** le serveur
4. **Configurer** votre clé API dans `.env.local`

**Coût : ~0.05€ par devis** - Appels réels à GPT-4o-mini

## Avantages du Mock

✅ **Développement rapide** : Tester l'UI sans attendre l'API  
✅ **Économies** : Pas de frais OpenAI pendant les tests  
✅ **Fiabilité** : Résultats prévisibles pour le debug  
✅ **Offline** : Fonctionne sans connexion internet  

## Quand passer en mode Production ?

- ✅ Design finalisé
- ✅ Tous les bugs corrigés
- ✅ Prêt à tester avec de vraies interventions
- ✅ Déploiement final

## Personnaliser le Mock

Vous pouvez modifier les données du mock dans `src/lib/mock-data.ts` :

```typescript
export const MOCK_QUOTE_ITEMS: QuoteItem[] = [
  {
    description: "Votre description",
    quantity: 1,
    unit: "unité",
    unitPrice: 100.00,
    total: 100.00
  },
  // Ajouter plus de lignes...
];
```
