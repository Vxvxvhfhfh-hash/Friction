import { GoogleGenerativeAI } from '@google/generative-ai';

// Sessions temporaires en mémoire
const sessions = new Map();

// Configuration esthétique
const aesthetics = {
    borders: {
        top: '═══════════════════════════',
        side: '║',
        bottom: '═══════════════════════════'
    },
    symbols: {
        star: '✦',
        diamond: '◆',
        arrow: '➤',
        dot: '●',
        sparkle: '✨'
    },
    emojis: {
        action: '🎭',
        story: '📖',
        character: '👤',
        location: '🏰',
        combat: '⚔️',
        magic: '✨',
        dialogue: '💬'
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { message, character } = req.body;
        
        if (!message || !character) {
            return res.status(400).json({ error: 'Message et personnage requis' });
        }

        // Obtenir l'ID de session
        const sessionId = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'default';
        
        // Analyser le contexte du message
        const context = analyzeMessage(message, character);
        
        // Générer la réponse avec Gemini AI
        const aiResponse = await generateRPResponse(message, context, sessionId);
        
        // Sélectionner les médias contextuels
        const media = selectContextualMedia(context);
        
        res.status(200).json({
            success: true,
            response: aiResponse,
            context,
            media
        });

    } catch (error) {
        console.error('Erreur chat RP:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erreur lors de la génération de la réponse' 
        });
    }
}

// Analyser le message pour extraire le contexte
function analyzeMessage(message, character) {
    const context = {
        type: 'dialogue',
        action: null,
        location: character.location || 'taverne',
        character: character.name,
        scenario: 'Aventure fantasy médiévale',
        mood: 'mystérieuse',
        weather: null,
        item: null
    };

    const messageLC = message.toLowerCase();

    // Détection d'actions de combat
    if (messageLC.match(/attaque|combat|frappe|épée|guerre|bataille|tue|mort/)) {
        context.type = 'combat';
        context.action = 'combat';
    }
    // Détection de magie
    else if (messageLC.match(/magie|sort|enchantement|sortilège|incantation|pouvoir/)) {
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

// Générer une réponse RP avec Gemini AI
async function generateRPResponse(userMessage, context, sessionId) {
    try {
        const geminiApiKey = process.env.GEMINI_API_KEY;
        
        if (!geminiApiKey) {
            return getErrorResponse();
        }

        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = buildRPPrompt(userMessage, context);
        const result = await model.generateContent(prompt);
        const response = result.response.text();

        // Sauvegarder dans l'historique de session
        updateSessionHistory(sessionId, userMessage, response);

        return formatResponse(response, context);

    } catch (error) {
        console.error('Erreur Gemini AI:', error);
        return getErrorResponse();
    }
}

// Construire le prompt pour le RP
function buildRPPrompt(userMessage, context) {
    const { character, location, scenario, mood } = context;
    
    return `
Tu es un maître de jeu (GM) pour un système de jeu de rôle immersif sur le web.

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
6. Limite tes réponses à 250 mots maximum
7. Utilise un langage évocateur et poétique
8. Inclus des détails sur l'environnement et l'atmosphère
9. Crée du suspense et maintiens l'engagement

MESSAGE DU JOUEUR: "${userMessage}"

Génère une réponse narrative immersive qui:
- Décrit les conséquences de l'action du joueur
- Enrichit l'atmosphère du lieu
- Propose de nouveaux éléments narratifs
- Maintient le suspense et l'engagement
- Se termine par une question ou suggestion d'action
`;
}

// Formater la réponse avec l'esthétique
function formatResponse(response, context) {
    const { borders, symbols, emojis } = aesthetics;
    const emoji = selectContextEmoji(context);
    
    return `${borders.top}
${emoji} **MAÎTRE DE JEU** ${emoji}
${borders.side}
${response}
${borders.side}
${symbols.arrow} *Que fais-tu maintenant ?* ${symbols.sparkle}
${borders.bottom}`;
}

// Sélectionner l'emoji approprié selon le contexte
function selectContextEmoji(context) {
    const { emojis } = aesthetics;
    
    if (context.type) {
        return emojis[context.type] || emojis.story;
    }
    
    return emojis.story;
}

// Réponse d'erreur formatée
function getErrorResponse() {
    const { borders, symbols } = aesthetics;
    
    return `${borders.top}
${symbols.diamond} **SYSTÈME** ${symbols.diamond}
${borders.side}
Une perturbation magique empêche la communication...
Veuillez réessayer dans un moment.
${borders.side}
${borders.bottom}`;
}

// Mettre à jour l'historique de session
function updateSessionHistory(sessionId, userMessage, aiResponse) {
    const session = sessions.get(sessionId) || { history: [] };
    
    session.history.push({
        user: userMessage,
        ai: aiResponse,
        timestamp: new Date()
    });
    
    // Garder seulement les 10 dernières interactions
    if (session.history.length > 10) {
        session.history = session.history.slice(-10);
    }
    
    sessions.set(sessionId, session);
}

// Sélectionner les médias contextuels
function selectContextualMedia(context) {
    const mediaDatabase = {
        locations: {
            'taverne': {
                image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
                description: 'Une taverne chaleureuse aux lumières tamisées'
            },
            'forêt': {
                image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
                description: 'Une forêt mystérieuse et profonde'
            },
            'château': {
                image: 'https://images.unsplash.com/photo-1549041943-61ae93529fa3?w=800',
                description: 'Un château majestueux sur une colline'
            }
        },
        actions: {
            'combat': {
                image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
                description: 'Une scène de combat épique'
            },
            'magie': {
                image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
                description: 'Des effets magiques mystérieux'
            },
            'exploration': {
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
                description: 'Un paysage à explorer'
            }
        }
    };

    // Priorité aux actions spécifiques
    if (context.action && mediaDatabase.actions[context.action]) {
        return mediaDatabase.actions[context.action];
    }
    
    // Puis aux lieux
    if (context.location && mediaDatabase.locations[context.location]) {
        return mediaDatabase.locations[context.location];
    }
    
    return null;
}