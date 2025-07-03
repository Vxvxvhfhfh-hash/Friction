# 🎭 WhatsApp RP Bot avec IA Gemini

Un bot WhatsApp immersif pour jeu de rôle utilisant l'IA Gemini, avec système de médias contextuels et caractères spéciaux esthétiques.

## ✨ Fonctionnalités

- 🤖 **IA Gemini intégrée** - Réponses narratives intelligentes et contextuelles
- 🎮 **Système RP complet** - Personnages, statistiques, inventaire, lieux
- 📱 **WhatsApp Web.js** - Intégration native WhatsApp
- 🎨 **Médias immersifs** - Images, audio et vidéos contextuels automatiques
- ✨ **Design esthétique** - Caractères spéciaux et formatage élégant
- 📊 **Interface de monitoring** - Serveur web avec statistiques
- ⏰ **Tâches automatisées** - Nettoyage et maintenance automatiques

## 📋 Prérequis

- Node.js 16+ 
- Compte Google pour l'API Gemini
- WhatsApp sur smartphone pour la connexion

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone <repo-url>
cd whatsapp-rp-bot
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration
Créer un fichier `.env` basé sur `.env.example`:
```bash
cp .env.example .env
```

Éditer le fichier `.env`:
```env
GEMINI_API_KEY=your-gemini-api-key-here
PORT=3000
```

### 4. Obtenir une clé API Gemini
1. Aller sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créer une nouvelle clé API
3. Copier la clé dans votre fichier `.env`

### 5. Démarrer le bot
```bash
npm start
```

### 6. Scanner le QR Code
1. Le bot affichera un QR Code dans le terminal
2. Scanner avec WhatsApp sur votre smartphone
3. Attendre la connexion

## 🎮 Utilisation

### Commandes de base
- `/personnage` - Voir et choisir un personnage
- `/choisir [nom]` - Sélectionner un personnage (aventurier, mage, voleur)
- `/statut` - Afficher le statut du personnage
- `/inventaire` - Voir l'inventaire
- `/aide` - Afficher l'aide complète

### Gameplay
1. **Choisir un personnage** avec `/personnage`
2. **Décrire vos actions** en langage naturel
3. **Le bot répond** avec des narrations immersives
4. **Médias automatiques** selon le contexte (lieu, action, météo)

### Exemples d'interactions
```
Joueur: "Je regarde autour de moi dans la taverne"
Bot: [Narration avec bordures esthétiques + image de taverne]

Joueur: "J'attaque le gobelin avec mon épée"
Bot: [Narration de combat + image/son de combat]

Joueur: "Je lance un sort de feu"
Bot: [Narration magique + effets visuels/sonores]
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
├── config/
│   └── config.js          # Configuration générale
├── utils/
│   ├── geminiAI.js       # Intégration IA Gemini
│   ├── mediaManager.js   # Gestionnaire de médias
│   └── rpSystem.js       # Système de jeu de rôle
├── data/
│   └── characters.json   # Base de données des personnages
├── media/                # Dossier des médias
├── session/              # Sessions WhatsApp (auto-généré)
├── index.js             # Fichier principal
├── package.json         # Dépendances
└── README.md           # Documentation
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