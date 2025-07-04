# 🚀 Déploiement sur Vercel - WhatsApp RP Bot

Guide complet pour déployer votre application de jeu de rôle avec IA Gemini sur Vercel.

## 📋 Prérequis

- Compte [Vercel](https://vercel.com) gratuit
- Compte GitHub/GitLab (recommandé)
- Clé API [Google Gemini](https://makersuite.google.com/app/apikey)

## 🎯 Méthode 1 : Déploiement via GitHub (Recommandé)

### 1. Préparation du Repository

```bash
# Cloner ou créer votre repo
git clone <votre-repo-url>
cd whatsapp-rp-bot

# Vérifier la structure
ls -la
# Vous devriez voir: api/ public/ vercel.json package.json
```

### 2. Connecter à Vercel

1. **Aller sur [vercel.com](https://vercel.com)**
2. **Se connecter avec GitHub**
3. **Cliquer "New Project"**
4. **Importer votre repository**

### 3. Configuration du Projet

Dans l'interface Vercel :

```
Framework Preset: Other
Build Command: npm run build
Output Directory: (laissez vide)
Install Command: npm install
Root Directory: ./
```

### 4. Variables d'Environnement

Dans l'onglet "Environment Variables" :

```
GEMINI_API_KEY = votre-clé-api-gemini-ici
```

### 5. Déployer

Cliquez **"Deploy"** - Vercel va :
- Installer les dépendances
- Builder l'application  
- Déployer automatiquement

## 🛠️ Méthode 2 : Déploiement CLI

### 1. Installation Vercel CLI

```bash
npm install -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Configuration Locale

```bash
# Dans le dossier du projet
vercel

# Suivre les instructions :
# ? Set up and deploy "~/whatsapp-rp-bot"? [Y/n] y
# ? Which scope do you want to deploy to? [votre-compte]
# ? Link to existing project? [y/N] n
# ? What's your project's name? whatsapp-rp-bot
# ? In which directory is your code located? ./
```

### 4. Ajouter les Variables d'Environnement

```bash
vercel env add GEMINI_API_KEY
# Entrer votre clé API Gemini
```

### 5. Déploiement

```bash
# Déploiement de test
vercel

# Déploiement en production
vercel --prod
```

## 🌐 Structure Finale

Après déploiement, votre app sera accessible via :

```
https://whatsapp-rp-bot-[hash].vercel.app
```

### Endpoints Disponibles

- **`/`** - Interface web principale
- **`/api/health`** - Santé de l'API
- **`/api/characters`** - Liste des personnages
- **`/api/select-character`** - Sélection personnage
- **`/api/chat`** - Chat RP avec IA
- **`/api/location-description`** - Descriptions de lieux

## ⚙️ Configuration Avancée

### Custom Domain

1. **Dans Vercel Dashboard**
2. **Aller dans "Settings" > "Domains"**
3. **Ajouter votre domaine**

### Variables d'Environnement

```bash
# Ajouter une variable
vercel env add VARIABLE_NAME

# Lister les variables
vercel env ls

# Supprimer une variable
vercel env rm VARIABLE_NAME
```

### Logs et Monitoring

```bash
# Voir les logs
vercel logs

# Voir les fonctions
vercel functions ls
```

## 🔧 Optimisations Vercel

### 1. Performance

Le fichier `vercel.json` configure :
- **Fonctions serverless** pour les API
- **Static hosting** pour l'interface
- **Cache automatique** des ressources

### 2. Limites à Connaître

- **Timeout fonctions :** 30 secondes max
- **Taille payload :** 4.5MB max
- **Bande passante :** 100GB/mois (plan gratuit)
- **Fonctions :** 125,000 invocations/mois

### 3. Monitoring

Vercel fournit automatiquement :
- **Analytics** de performance
- **Logs** en temps réel
- **Métriques** d'utilisation

## 🐛 Dépannage

### Erreur de Build

```bash
# Vérifier les logs
vercel logs --follow

# Tester localement
vercel dev
```

### Erreur API Gemini

1. **Vérifier la clé API** dans les variables d'environnement
2. **Tester l'endpoint** : `curl https://votre-app.vercel.app/api/health`
3. **Vérifier les quotas** Gemini

### Problème de CORS

Ajouter dans vos endpoints API :

```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

## 📊 Monitoring Post-Déploiement

### 1. Vérifications

```bash
# Tester l'API
curl https://votre-app.vercel.app/api/health

# Tester les personnages
curl https://votre-app.vercel.app/api/characters
```

### 2. Analytics

Dans Vercel Dashboard :
- **Overview** - Vue d'ensemble
- **Functions** - Performance des API
- **Analytics** - Métriques utilisateurs

## 🚀 Workflow de Développement

### 1. Développement Local

```bash
# Démarrer en mode dev
vercel dev

# L'app sera sur http://localhost:3000
```

### 2. Preview Deployments

Chaque push sur une branche crée automatiquement :
- **URL de preview** unique
- **Tests automatiques**
- **Review via GitHub/GitLab**

### 3. Production

```bash
# Merge vers main/master = déploiement auto
git push origin main

# Ou déploiement manuel
vercel --prod
```

## 💡 Conseils d'Optimisation

### 1. Performance

- **Images** : Utilisez Unsplash ou optimisez vos médias
- **Caching** : Vercel cache automatiquement les ressources statiques
- **Edge Network** : Distribution mondiale automatique

### 2. Sécurité

```javascript
// Dans vos API, ajoutez toujours
if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
}
```

### 3. Monitoring

- **Utilisez** `console.log()` pour débugger (visible dans les logs)
- **Implémentez** une gestion d'erreurs robuste
- **Surveillez** les quotas Gemini API

## 🎉 Félicitations !

Votre bot RP est maintenant déployé sur Vercel ! 

### Prochaines Étapes

1. **Partager l'URL** avec vos joueurs
2. **Personnaliser** les personnages et médias
3. **Monitorer** l'utilisation et les performances
4. **Itérer** selon les retours utilisateurs

---

**🎭 Votre aventure RP est maintenant accessible dans le monde entier ! ✨**

### Support

- 📖 [Documentation Vercel](https://vercel.com/docs)
- 🐛 [Issues GitHub](https://github.com/votre-repo/issues)
- 💬 [Discord de la communauté](https://discord.gg/vercel)