# 🎭 Application Web RP avec IA Gemini

Une application web immersive de jeu de rôle utilisant l'IA Gemini, déployable sur Vercel avec système de médias contextuels et interface moderne.

## ✨ Fonctionnalités

- 🤖 **IA Gemini intégrée** - Réponses narratives intelligentes et contextuelles
- 🎮 **Système RP complet** - Personnages, statistiques, inventaire, lieux
- 🌐 **Interface web moderne** - Design responsif avec Tailwind CSS
- 🎨 **Médias immersifs** - Images contextuelles automatiques via Unsplash
- ✨ **Design esthétique** - Caractères spéciaux et formatage élégant
- � **Déployable sur Vercel** - Serverless functions et hosting statique
- 📱 **Responsive** - Compatible desktop, tablette et mobile

## 📋 Prérequis

- Compte [Vercel](https://vercel.com) gratuit
- Compte Google pour l'API Gemini
- Node.js 16+ (pour développement local)

## 🚀 Déploiement Rapide sur Vercel

### Option 1 : Deploy Button (Le plus rapide)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/votre-repo/whatsapp-rp-bot)

1. **Cliquer le bouton** ci-dessus
2. **Connecter votre compte** GitHub/GitLab
3. **Ajouter la variable d'environnement :**
   - `GEMINI_API_KEY` = votre-clé-api-gemini
4. **Cliquer "Deploy"**

### Option 2 : Via GitHub

1. **Fork ce repository**
2. **Aller sur [vercel.com](https://vercel.com)**
3. **New Project** → Importer votre fork
4. **Ajouter la variable :** `GEMINI_API_KEY`
5. **Deploy automatique !**

### Option 3 : Développement Local

```bash
# Cloner le projet
git clone <repo-url>
cd whatsapp-rp-bot

# Installer les dépendances
npm install

# Installer Vercel CLI
npm install -g vercel

# Démarrer en mode dev
vercel dev
```

### 4. Obtenir une clé API Gemini
1. Aller sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créer une nouvelle clé API
3. L'ajouter comme variable d'environnement dans Vercel

## 🎮 Utilisation

### Interface Web
Une fois déployé, accédez à votre URL Vercel pour utiliser l'interface web moderne :

1. **Sélection de personnage** - Cliquez sur un personnage dans le panneau de gauche
2. **Chat immersif** - Tapez vos actions dans la zone de chat
3. **Actions rapides** - Utilisez les boutons pour des actions communes
4. **Médias automatiques** - Images contextuelles selon vos actions

### Personnages Disponibles
- 🗡️ **Aventurier Novice** - Guerrier équilibré pour débuter
- 🧙‍♂️ **Mystique Érudit** - Mage puissant en magie
- 🗡️ **Ombre Furtive** - Voleur agile et discret

### Gameplay
1. **Choisir un personnage** en cliquant sur sa carte
2. **Décrire vos actions** en langage naturel dans le chat
3. **L'IA Gemini répond** avec des narrations immersives
4. **Images automatiques** selon le contexte (lieu, action)

### Exemples d'interactions
```
👤 Vous: "Je regarde autour de moi dans la taverne"
🎭 GM: [Narration immersive avec bordures esthétiques + image de taverne]

👤 Vous: "J'attaque le gobelin avec mon épée"
🎭 GM: [Scène de combat épique + image d'action]

👤 Vous: "Je lance un sort de feu"
🎭 GM: [Narration magique + effets visuels]
```

## 🎨 Personnalisation

### Ajouter des personnages
Éditer `data/characters.json`:
```json
{
  "nouveau_personnage": {
    "name": "Nom du Personnage",
    "class": "Classe",
    "level": 1,
    "hp": 100,
    "mp": 50,
    "stats": {
      "force": 15,
      "agilité": 12,
      "intelligence": 10,
      "charisme": 8
    },
    "inventory": ["Objet 1", "Objet 2"],
    "background": "Histoire du personnage",
    "location": "lieu_de_départ"
  }
}
```

### Ajouter des médias
1. **Structure des dossiers:**
```
media/
├── images/
│   ├── locations/    # Images de lieux
│   ├── actions/      # Images d'actions
│   ├── characters/   # Images de personnages
│   ├── items/        # Images d'objets
│   └── weather/      # Images météo
├── audio/
│   ├── ambiance/     # Sons d'ambiance
│   └── effects/      # Effets sonores
└── videos/
    └── cutscenes/    # Vidéos narratives
```

2. **Modifier** `media/media-database.json` pour référencer vos fichiers

### Personnaliser l'esthétique
Éditer `config/config.js` section `aesthetics`:
```javascript
aesthetics: {
  borders: {
    top: '═══════════════════════════',
    side: '║',
    bottom: '═══════════════════════════'
  },
  symbols: {
    star: '✦',
    diamond: '◆',
    arrow: '➤'
    // ...
  }
}
```

## 🖥️ Interface de monitoring

Accéder à `http://localhost:3000` pour:
- `/status` - Statistiques complètes
- `/health` - État de santé du bot
- `/` - Informations générales

## 📁 Structure du projet

```
├── api/                           # Fonctions serverless Vercel
│   ├── health.js                 # Endpoint de santé
│   ├── characters.js             # API des personnages
│   ├── select-character.js       # Sélection de personnage
│   ├── chat.js                   # Chat RP avec IA Gemini
│   └── location-description.js   # Descriptions de lieux
├── public/
│   └── index.html                # Interface web principale
├── vercel.json                   # Configuration Vercel
├── package.json                  # Dépendances (allégées)
├── README.md                     # Documentation
├── DEPLOY_VERCEL.md             # Guide déploiement Vercel
└── QUICK_START.md               # Guide démarrage rapide
```

## 🔧 Développement

### Mode développement
```bash
npm run dev
```

### Ajout de fonctionnalités
1. **Nouveaux types de contexte** dans `rpSystem.js`
2. **Nouvelles commandes** dans `handleSystemCommand()`
3. **Nouveaux médias** via `mediaManager.js`
4. **Prompts IA personnalisés** dans `geminiAI.js`

## 🐛 Dépannage

### Le QR Code ne s'affiche pas
- Vérifiez que le terminal supporte les caractères Unicode
- Essayez d'agrandir la fenêtre du terminal

### Erreur API Gemini
- Vérifiez que votre clé API est correcte
- Assurez-vous d'avoir activé l'API Gemini
- Vérifiez vos quotas API

### Médias non envoyés
- Vérifiez que les fichiers existent dans `media/`
- Contrôlez les permissions de lecture
- Consultez les logs pour plus de détails

### WhatsApp se déconnecte
- La session est sauvegardée automatiquement
- Redémarrez le bot si nécessaire
- En cas de problème persistant, supprimez le dossier `session/`

## 📝 Logs et debugging

Les logs sont colorés et détaillés:
- 🔵 Informations générales
- 🟢 Succès et confirmations  
- 🟡 Avertissements
- 🔴 Erreurs
- 🟣 Statistiques

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit des changements (`git commit -am 'Ajout nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Créer une Pull Request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.

## 🆘 Support

Pour toute question ou problème:
1. Consultez la section dépannage
2. Vérifiez les logs du bot
3. Ouvrez une issue sur GitHub

---

**🎭 Amusez-vous bien avec votre bot RP WhatsApp ! ✨**