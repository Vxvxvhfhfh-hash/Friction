# 🚀 Démarrage Rapide - WhatsApp RP Bot

> Guide express pour démarrer votre bot RP en 5 minutes !

## ⚡ Installation Express

```bash
# 1. Cloner et installer
git clone <repo-url> whatsapp-rp-bot
cd whatsapp-rp-bot
npm install

# 2. Configuration automatique
npm run setup

# 3. Configurer l'API Gemini
# Éditer le fichier .env et remplacer:
# GEMINI_API_KEY=votre-clé-api-ici

# 4. Démarrer le bot
npm start
```

## 📱 Configuration WhatsApp

1. **Scanner le QR Code** qui s'affiche dans le terminal
2. **Première connexion** : Le bot se connecte à votre WhatsApp
3. **Test** : Envoyez `/aide` au bot pour vérifier

## 🎮 Premiers Pas

### Commandes Essentielles
```
/personnage     → Choisir un personnage
/choisir mage   → Sélectionner le mage
/statut         → Voir les stats
/aide           → Guide complet
```

### Exemple de Session
```
👤 Vous: /personnage
🤖 Bot: [Liste des personnages disponibles]

👤 Vous: /choisir aventurier
🤖 Bot: [Confirmation + stats de l'aventurier]

👤 Vous: Je regarde autour de moi
🤖 Bot: [Narration immersive + image de taverne]

👤 Vous: J'attaque le gobelin !
🤖 Bot: [Scène de combat + effets sonores]
```

## 🎨 Ajouter vos Médias (Optionnel)

```bash
# Structure des médias
media/
├── images/locations/   # taverne.jpg, foret.jpg, etc.
├── images/actions/     # combat.jpg, magie.jpg, etc.
├── audio/ambiance/     # taverne.mp3, foret.mp3, etc.
└── audio/effects/      # epee.mp3, sort.mp3, etc.
```

## 🔧 Résolution Rapide

| Problème | Solution |
|----------|----------|
| QR Code illisible | Agrandir le terminal |
| Erreur API Gemini | Vérifier la clé dans `.env` |
| Bot ne répond pas | Vérifier la connexion WhatsApp |
| Médias non envoyés | Vérifier les fichiers dans `media/` |

## 🌐 Interface Web

Une fois démarré, accédez à :
- **http://localhost:3000** - Informations générales
- **http://localhost:3000/status** - Statistiques détaillées
- **http://localhost:3000/health** - État de santé

## 📞 Support Express

- 📖 Guide complet : `README.md`
- 🐛 Problème ? Créez une issue GitHub
- 💬 Question ? Discussions GitHub

---

**✨ Votre bot RP est prêt ! Amusez-vous bien ! 🎭**