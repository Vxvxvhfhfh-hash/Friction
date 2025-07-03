const fs = require('fs-extra');
const path = require('path');
const config = require('../config/config');
const { v4: uuidv4 } = require('uuid');

class RPSystem {
    constructor() {
        this.sessions = new Map(); // Sessions actives
        this.characters = new Map(); // Base de données des personnages
        this.cooldowns = new Map(); // Cooldowns des utilisateurs
        this.initializeSystem();
    }

    /**
     * Initialise le système RP
     */
    async initializeSystem() {
        await this.loadCharactersDatabase();
        console.log('🎭 Système RP initialisé');
    }

    /**
     * Charge la base de données des personnages
     */
    async loadCharactersDatabase() {
        try {
            const charactersPath = config.rp.charactersDataPath;
            
            if (await fs.pathExists(charactersPath)) {
                const data = await fs.readJson(charactersPath);
                this.characters = new Map(Object.entries(data));
            } else {
                await this.createDefaultCharacters();
            }
        } catch (error) {
            console.error('Erreur chargement personnages:', error);
            await this.createDefaultCharacters();
        }
    }

    /**
     * Crée des personnages par défaut
     */
    async createDefaultCharacters() {
        const defaultCharacters = {
            'aventurier': {
                name: 'Aventurier Novice',
                class: 'Guerrier',
                level: 1,
                hp: 100,
                mp: 50,
                stats: {
                    force: 15,
                    agilité: 12,
                    intelligence: 10,
                    charisme: 8
                },
                inventory: ['Épée rouillée', 'Potion de soin', 'Pain rassis'],
                background: 'Un aventurier débutant en quête de gloire et de richesses.',
                location: 'taverne',
                status: 'actif'
            },
            'mage': {
                name: 'Mystique Érudit',
                class: 'Mage',
                level: 1,
                hp: 70,
                mp: 120,
                stats: {
                    force: 8,
                    agilité: 10,
                    intelligence: 18,
                    charisme: 12
                },
                inventory: ['Bâton de novice', 'Livre de sorts', 'Potion de mana'],
                background: 'Un mage étudiant les arts arcaniques dans les bibliothèques anciennes.',
                location: 'bibliothèque',
                status: 'actif'
            },
            'voleur': {
                name: 'Ombre Furtive',
                class: 'Voleur',
                level: 1,
                hp: 85,
                mp: 75,
                stats: {
                    force: 12,
                    agilité: 18,
                    intelligence: 13,
                    charisme: 15
                },
                inventory: ['Dagues jumelles', 'Outils de crochetage', 'Cape sombre'],
                background: 'Un voleur habile qui navigue dans les ruelles obscures de la ville.',
                location: 'ruelles',
                status: 'actif'
            }
        };

        this.characters = new Map(Object.entries(defaultCharacters));
        await this.saveCharactersDatabase();
    }

    /**
     * Sauvegarde la base de données des personnages
     */
    async saveCharactersDatabase() {
        try {
            await fs.ensureDir(path.dirname(config.rp.charactersDataPath));
            const data = Object.fromEntries(this.characters);
            await fs.writeJson(config.rp.charactersDataPath, data, { spaces: 2 });
        } catch (error) {
            console.error('Erreur sauvegarde personnages:', error);
        }
    }

    /**
     * Crée ou récupère une session RP pour un chat
     */
    getOrCreateSession(chatId, userId) {
        const sessionKey = `${chatId}_${userId}`;
        
        if (!this.sessions.has(sessionKey)) {
            const session = {
                id: uuidv4(),
                chatId,
                userId,
                character: null,
                currentLocation: 'taverne',
                scenario: 'Aventure fantasy médiévale',
                mood: 'mystérieuse',
                gameState: {
                    chapter: 1,
                    questsCompleted: 0,
                    itemsFound: [],
                    npcsMetr: [],
                    flags: {}
                },
                history: [],
                lastAction: null,
                createdAt: new Date(),
                lastActivity: new Date()
            };
            
            this.sessions.set(sessionKey, session);
        }
        
        // Mettre à jour l'activité
        this.sessions.get(sessionKey).lastActivity = new Date();
        return this.sessions.get(sessionKey);
    }

    /**
     * Assigne un personnage à une session
     */
    assignCharacter(sessionKey, characterKey) {
        const session = this.sessions.get(sessionKey);
        const character = this.characters.get(characterKey);
        
        if (session && character) {
            session.character = { ...character, key: characterKey };
            session.currentLocation = character.location;
            return true;
        }
        
        return false;
    }

    /**
     * Analyse un message pour extraire le contexte RP
     */
    analyzeMessage(message, session) {
        const context = {
            type: 'dialogue',
            action: null,
            location: session.currentLocation,
            character: session.character?.name || 'Aventurier',
            scenario: session.scenario,
            mood: session.mood,
            weather: null,
            item: null
        };

        const messageLC = message.toLowerCase();

        // Détection d'actions de combat
        if (messageLC.match(/attaque|combat|frappe|épée|guerre|bataille/)) {
            context.type = 'combat';
            context.action = 'combat';
        }
        
        // Détection de magie
        else if (messageLC.match(/magie|sort|enchantement|sortilège|magie|incantation/)) {
            context.type = 'magic';
            context.action = 'magie';
        }
        
        // Détection d'exploration
        else if (messageLC.match(/explore|cherche|regarde|examine|fouille|découvre/)) {
            context.type = 'exploration';
            context.action = 'exploration';
        }
        
        // Détection de lieux
        const locations = ['taverne', 'forêt', 'château', 'donjon', 'ville', 'montagne'];
        for (const location of locations) {
            if (messageLC.includes(location)) {
                context.location = location;
                session.currentLocation = location;
                break;
            }
        }
        
        // Détection d'objets
        const items = ['épée', 'potion', 'livre', 'bouclier', 'armure', 'or', 'gemme'];
        for (const item of items) {
            if (messageLC.includes(item)) {
                context.item = item;
                break;
            }
        }
        
        // Détection de météo
        if (messageLC.match(/pluie|orage|soleil|neige|brouillard/)) {
            const weatherMatches = messageLC.match(/(pluie|orage|soleil|neige|brouillard)/);
            if (weatherMatches) {
                context.weather = weatherMatches[1];
            }
        }

        return context;
    }

    /**
     * Traite une commande RP
     */
    async processRPCommand(message, chatId, userId) {
        const session = this.getOrCreateSession(chatId, userId);
        const command = message.toLowerCase().trim();

        // Commandes système
        if (command.startsWith('/')) {
            return await this.handleSystemCommand(command, session);
        }

        // Vérifier cooldown
        if (this.isOnCooldown(userId)) {
            return this.getCooldownMessage();
        }

        // Analyser le message et extraire le contexte
        const context = this.analyzeMessage(message, session);
        
        // Enregistrer l'action
        session.lastAction = {
            message,
            context,
            timestamp: new Date()
        };
        
        // Ajouter à l'historique
        session.history.push({
            type: 'user_action',
            content: message,
            context,
            timestamp: new Date()
        });
        
        // Limiter l'historique
        if (session.history.length > 20) {
            session.history = session.history.slice(-20);
        }
        
        // Appliquer cooldown
        this.setCooldown(userId);
        
        return { context, session };
    }

    /**
     * Gère les commandes système
     */
    async handleSystemCommand(command, session) {
        const [cmd, ...args] = command.split(' ');
        
        switch (cmd) {
            case '/personnage':
            case '/character':
                return this.getCharacterSelectionMessage();
                
            case '/choisir':
            case '/select':
                if (args.length > 0) {
                    const characterKey = args[0];
                    return this.selectCharacter(session, characterKey);
                }
                return this.getCharacterSelectionMessage();
                
            case '/statut':
            case '/status':
                return this.getStatusMessage(session);
                
            case '/lieu':
            case '/location':
                if (args.length > 0) {
                    const newLocation = args.join(' ');
                    return this.changeLocation(session, newLocation);
                }
                return this.getLocationMessage(session);
                
            case '/inventaire':
            case '/inventory':
                return this.getInventoryMessage(session);
                
            case '/aide':
            case '/help':
                return this.getHelpMessage();
                
            case '/reset':
                return this.resetSession(session);
                
            default:
                return this.getUnknownCommandMessage();
        }
    }

    /**
     * Message de sélection de personnage
     */
    getCharacterSelectionMessage() {
        const { borders, symbols, emojis } = config.aesthetics;
        let message = `${borders.top}\n${emojis.character} **SÉLECTION DE PERSONNAGE** ${emojis.character}\n${borders.side}\n`;
        
        for (const [key, char] of this.characters.entries()) {
            message += `${symbols.arrow} **${char.name}** (${char.class})\n`;
            message += `   ${char.background}\n`;
            message += `   Utilise: \`/choisir ${key}\`\n\n`;
        }
        
        message += `${borders.side}\n${symbols.star} Tape \`/choisir [nom]\` pour sélectionner\n${borders.bottom}`;
        return { text: message, context: { type: 'character' } };
    }

    /**
     * Sélectionne un personnage
     */
    selectCharacter(session, characterKey) {
        const { borders, symbols, emojis } = config.aesthetics;
        
        if (this.characters.has(characterKey)) {
            const character = this.characters.get(characterKey);
            session.character = { ...character, key: characterKey };
            session.currentLocation = character.location;
            
            const message = `${borders.top}
${emojis.character} **PERSONNAGE SÉLECTIONNÉ** ${emojis.character}
${borders.side}
${symbols.crown} **${character.name}**
${symbols.arrow} Classe: ${character.class}
${symbols.arrow} Niveau: ${character.level}
${symbols.arrow} Lieu: ${character.location}
${borders.side}
${character.background}
${borders.side}
${symbols.sparkle} *Votre aventure commence maintenant !*
${borders.bottom}`;
            
            return { text: message, context: { type: 'character', location: character.location } };
        } else {
            return { text: `${symbols.diamond} Personnage "${characterKey}" introuvable. Utilise \`/personnage\` pour voir la liste.`, context: { type: 'error' } };
        }
    }

    /**
     * Message de statut
     */
    getStatusMessage(session) {
        const { borders, symbols, emojis } = config.aesthetics;
        
        if (!session.character) {
            return { text: `${symbols.diamond} Aucun personnage sélectionné. Utilise \`/personnage\` pour en choisir un.`, context: { type: 'error' } };
        }
        
        const char = session.character;
        const message = `${borders.top}
${emojis.character} **STATUT DE ${char.name.toUpperCase()}** ${emojis.character}
${borders.side}
${symbols.arrow} **Niveau:** ${char.level} | **PV:** ${char.hp} | **PM:** ${char.mp}
${symbols.arrow} **Force:** ${char.stats.force} | **Agilité:** ${char.stats.agilité}
${symbols.arrow} **Intelligence:** ${char.stats.intelligence} | **Charisme:** ${char.stats.charisme}
${borders.side}
${emojis.location} **Lieu actuel:** ${session.currentLocation}
${emojis.story} **Chapitre:** ${session.gameState.chapter}
${symbols.diamond} **Quêtes complétées:** ${session.gameState.questsCompleted}
${borders.bottom}`;
        
        return { text: message, context: { type: 'character' } };
    }

    /**
     * Message d'inventaire
     */
    getInventoryMessage(session) {
        const { borders, symbols, emojis } = config.aesthetics;
        
        if (!session.character) {
            return { text: `${symbols.diamond} Aucun personnage sélectionné.`, context: { type: 'error' } };
        }
        
        const inventory = session.character.inventory || [];
        let message = `${borders.top}\n${emojis.item} **INVENTAIRE** ${emojis.item}\n${borders.side}\n`;
        
        if (inventory.length === 0) {
            message += `${symbols.dot} *Inventaire vide*\n`;
        } else {
            inventory.forEach((item, index) => {
                message += `${symbols.dot} ${item}\n`;
            });
        }
        
        message += `${borders.bottom}`;
        return { text: message, context: { type: 'item' } };
    }

    /**
     * Message d'aide
     */
    getHelpMessage() {
        const { borders, symbols, emojis } = config.aesthetics;
        
        const message = `${borders.top}
${emojis.scroll} **GUIDE DU JOUEUR** ${emojis.scroll}
${borders.side}
**COMMANDES:**
${symbols.arrow} \`/personnage\` - Voir les personnages
${symbols.arrow} \`/choisir [nom]\` - Sélectionner un personnage
${symbols.arrow} \`/statut\` - Voir le statut actuel
${symbols.arrow} \`/inventaire\` - Voir l'inventaire
${symbols.arrow} \`/lieu [nom]\` - Changer de lieu
${symbols.arrow} \`/reset\` - Recommencer l'aventure
${borders.side}
**GAMEPLAY:**
${symbols.star} Décris tes actions en langage naturel
${symbols.star} Le MJ répondra et fera évoluer l'histoire
${symbols.star} Des médias seront envoyés pour l'immersion
${borders.bottom}`;
        
        return { text: message, context: { type: 'help' } };
    }

    /**
     * Gestion des cooldowns
     */
    isOnCooldown(userId) {
        const cooldown = this.cooldowns.get(userId);
        if (!cooldown) return false;
        
        return Date.now() - cooldown < config.rp.cooldownTime;
    }

    setCooldown(userId) {
        this.cooldowns.set(userId, Date.now());
    }

    getCooldownMessage() {
        const { symbols } = config.aesthetics;
        return { text: `${symbols.diamond} Tu dois attendre un peu avant ta prochaine action...`, context: { type: 'cooldown' } };
    }

    /**
     * Nettoie les sessions inactives
     */
    cleanupInactiveSessions() {
        const now = new Date();
        const maxAge = 2 * 60 * 60 * 1000; // 2 heures
        
        for (const [key, session] of this.sessions.entries()) {
            if (now - session.lastActivity > maxAge) {
                this.sessions.delete(key);
            }
        }
    }

    /**
     * Obtient les statistiques du système
     */
    getSystemStats() {
        return {
            activeSessions: this.sessions.size,
            totalCharacters: this.characters.size,
            activeCooldowns: this.cooldowns.size
        };
    }
}

module.exports = RPSystem;