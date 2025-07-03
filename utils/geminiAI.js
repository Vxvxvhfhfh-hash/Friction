const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

class GeminiAI {
    constructor() {
        this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
        this.model = this.genAI.getGenerativeModel({ model: config.gemini.model });
        this.conversationHistory = new Map();
    }

    /**
     * Génère une réponse RP contextualisée
     * @param {string} userMessage - Message de l'utilisateur
     * @param {string} chatId - ID du chat
     * @param {Object} context - Contexte RP (personnage, lieu, etc.)
     * @returns {Promise<string>} Réponse générée
     */
    async generateRPResponse(userMessage, chatId, context = {}) {
        try {
            const prompt = this.buildRPPrompt(userMessage, context);
            
            // Récupérer l'historique de conversation
            const history = this.conversationHistory.get(chatId) || [];
            
            // Construire le contexte complet
            const fullPrompt = this.buildFullPrompt(prompt, history);
            
            const result = await this.model.generateContent(fullPrompt);
            const response = result.response.text();
            
            // Sauvegarder dans l'historique
            this.updateConversationHistory(chatId, userMessage, response);
            
            // Formatter la réponse avec l'esthétique
            return this.formatResponse(response, context);
            
        } catch (error) {
            console.error('Erreur Gemini AI:', error);
            return this.getErrorResponse();
        }
    }

    /**
     * Construit le prompt principal pour le RP
     */
    buildRPPrompt(userMessage, context) {
        const { character, location, scenario, mood } = context;
        
        return `
Tu es un maître de jeu (GM) pour un système de jeu de rôle immersif sur WhatsApp.

CONTEXTE ACTUEL:
- Personnage: ${character || 'Aventurier générique'}
- Lieu: ${location || 'Taverne du Dragon Doré'}
- Scénario: ${scenario || 'Aventure fantasy médiévale'}
- Ambiance: ${mood || 'Mystérieuse et aventureuse'}

RÈGLES IMPORTANTES:
1. Réponds TOUJOURS en français
2. Utilise un style narratif immersif à la 2ème personne
3. Inclus des descriptions sensorielles (vue, ouïe, odorat, toucher)
4. Propose des choix d'actions quand approprié
5. Maintiens la cohérence avec le contexte
6. Limite tes réponses à 300 mots maximum
7. Utilise un langage évocateur et poétique
8. Inclus des détails sur l'environnement et l'atmosphère

MESSAGE DU JOUEUR: "${userMessage}"

Génère une réponse narrative immersive qui:
- Décrit les conséquences de l'action du joueur
- Enrichit l'atmosphère du lieu
- Propose de nouveaux éléments narratifs
- Maintient le suspense et l'engagement
`;
    }

    /**
     * Construit le prompt complet avec l'historique
     */
    buildFullPrompt(mainPrompt, history) {
        let fullPrompt = mainPrompt;
        
        if (history.length > 0) {
            fullPrompt += '\n\nHISTORIQUE DE LA CONVERSATION:\n';
            history.slice(-5).forEach((entry, index) => {
                fullPrompt += `${index + 1}. Joueur: "${entry.user}"\n   GM: "${entry.ai}"\n`;
            });
        }
        
        return fullPrompt;
    }

    /**
     * Formate la réponse avec l'esthétique
     */
    formatResponse(response, context) {
        const { borders, symbols, emojis } = config.aesthetics;
        const emoji = this.selectContextEmoji(context);
        
        return `${borders.top}
${emoji} **MAÎTRE DE JEU** ${emoji}
${borders.side}
${response}
${borders.side}
${symbols.arrow} *Que fais-tu maintenant ?* ${symbols.sparkle}
${borders.bottom}`;
    }

    /**
     * Sélectionne l'emoji approprié selon le contexte
     */
    selectContextEmoji(context) {
        const { emojis } = config.aesthetics;
        
        if (context.type) {
            return emojis[context.type] || emojis.story;
        }
        
        return emojis.story;
    }

    /**
     * Met à jour l'historique de conversation
     */
    updateConversationHistory(chatId, userMessage, aiResponse) {
        const history = this.conversationHistory.get(chatId) || [];
        
        history.push({
            user: userMessage,
            ai: aiResponse,
            timestamp: new Date()
        });
        
        // Garde seulement les 10 dernières interactions
        if (history.length > 10) {
            history.shift();
        }
        
        this.conversationHistory.set(chatId, history);
    }

    /**
     * Réponse d'erreur formatée
     */
    getErrorResponse() {
        const { borders, symbols } = config.aesthetics;
        
        return `${borders.top}
${symbols.diamond} **SYSTÈME** ${symbols.diamond}
${borders.side}
Une perturbation magique empêche la communication...
Veuillez réessayer dans un moment.
${borders.side}
${borders.bottom}`;
    }

    /**
     * Génère une description d'ambiance pour un lieu
     */
    async generateLocationDescription(location, mood = 'mystérieux') {
        const prompt = `
Décris en 100 mots maximum l'ambiance du lieu suivant pour un jeu de rôle fantasy:
Lieu: ${location}
Ambiance: ${mood}

Inclus des détails sensoriels et une atmosphère immersive.
Écris à la 2ème personne du singulier en français.
`;
        
        try {
            const result = await this.model.generateContent(prompt);
            return this.formatResponse(result.response.text(), { type: 'location' });
        } catch (error) {
            console.error('Erreur génération lieu:', error);
            return this.getErrorResponse();
        }
    }

    /**
     * Nettoie l'historique d'un chat
     */
    clearHistory(chatId) {
        this.conversationHistory.delete(chatId);
    }
}

module.exports = GeminiAI;