# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Ajouté
- 🎭 **Système RP complet** avec personnages, statistiques et inventaire
- 🤖 **Intégration IA Gemini** pour des réponses narratives intelligentes
- 📱 **Bot WhatsApp** avec WhatsApp Web.js
- 🎨 **Gestionnaire de médias** pour l'immersion contextuelle
- ✨ **Design esthétique** avec caractères spéciaux et bordures
- 🌐 **Interface web** de monitoring et statistiques
- ⏰ **Tâches programmées** pour le nettoyage automatique
- 🔧 **Script de configuration** automatique
- 📚 **Documentation complète** avec README détaillé

### Fonctionnalités principales
- **Personnages prédéfinis** : Aventurier, Mage, Voleur
- **Commandes système** : `/personnage`, `/statut`, `/inventaire`, `/aide`
- **Détection contextuelle** : Combat, magie, exploration, dialogue
- **Médias automatiques** : Images, audio, vidéos selon l'action
- **Cooldowns** : Protection contre le spam
- **Sessions persistantes** : Sauvegarde de l'état du jeu
- **Historique conversationnel** : Continuité narrative
- **Gestion d'erreurs** : Messages d'erreur formatés
- **Monitoring** : Routes `/status`, `/health`

### Structure du projet
```
├── config/           # Configuration
├── utils/            # Modules utilitaires
├── data/             # Données des personnages
├── media/            # Médias contextuels
├── scripts/          # Scripts utilitaires
├── index.js          # Point d'entrée principal
└── README.md         # Documentation
```

### Dépendances principales
- `whatsapp-web.js` - Intégration WhatsApp
- `@google/generative-ai` - IA Gemini
- `express` - Serveur web
- `fs-extra` - Gestion de fichiers
- `chalk` - Colorisation console
- `figlet` - ASCII Art
- `node-cron` - Tâches programmées

### Configuration requise
- Node.js 16+
- Clé API Gemini
- WhatsApp sur smartphone

---

## Feuille de route

### [1.1.0] - Prévu
- 🏆 **Système de quêtes** avec objectifs et récompenses
- 🎯 **Combat amélioré** avec statistiques détaillées
- 👥 **Support multi-joueurs** dans les groupes
- 💾 **Base de données** persistante (SQLite/MongoDB)
- 🌍 **Système de monde** avec cartes et voyages

### [1.2.0] - Prévu
- 🎨 **Générateur d'images IA** pour les scènes
- 🗣️ **Synthèse vocale** pour les narrations
- 📊 **Tableau de bord web** avancé
- 🔌 **API REST** pour intégrations externes
- 🌐 **Multi-langues** (anglais, espagnol)

### [2.0.0] - Vision
- 🎮 **Mode campagne** avec scénarios complets
- 🏰 **Création de personnages** personnalisés
- 🛠️ **Éditeur de monde** graphique
- 📱 **Application mobile** compagnon
- ☁️ **Déploiement cloud** simplifié

---

## Comment contribuer

1. **Signaler des bugs** via les issues GitHub
2. **Proposer des fonctionnalités** dans les discussions
3. **Soumettre des PR** avec des améliorations
4. **Partager des médias** pour enrichir l'expérience
5. **Améliorer la documentation**

## Support

- 📖 **Documentation** : README.md
- 🐛 **Bugs** : GitHub Issues
- 💬 **Discussions** : GitHub Discussions
- 📧 **Contact direct** : [Votre email]

---

**🎭 Merci d'utiliser WhatsApp RP Bot ! ✨**