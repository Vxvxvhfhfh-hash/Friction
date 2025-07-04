import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration esthétique
const aesthetics = {
    borders: {
        top: '═══════════════════════════',
        side: '║',
        bottom: '═══════════════════════════'
    },
    symbols: {
        arrow: '➤',
        sparkle: '✨'
    },
    emojis: {
        location: '🏰'
    }
};

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { location } = req.body;
        
        if (!location) {
            return res.status(400).json({ error: 'Location requise' });
        }

        const description = await generateLocationDescription(location);
        
        res.status(200).json({
            success: true,
            description
        });

    } catch (error) {
        console.error('Erreur description lieu:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Erreur lors de la génération de la description' 
        });
    }
}

// Générer une description de lieu avec Gemini AI
async function generateLocationDescription(location, mood = 'mystérieux') {
    try {
        const geminiApiKey = process.env.GEMINI_API_KEY;
        
        if (!geminiApiKey) {
            return getErrorResponse();
        }

        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const prompt = `
Décris en 150 mots maximum l'ambiance du lieu suivant pour un jeu de rôle fantasy:
Lieu: ${location}
Ambiance: ${mood}

RÈGLES:
- Utilise la 2ème personne du singulier
- Inclus des détails sensoriels (vue, ouïe, odorat)
- Crée une atmosphère immersive
- Écris en français avec un style poétique
- Termine par une invitation à l'action

Exemple de structure:
"Tu te trouves dans... L'air est chargé de... Au loin, tu entends... Que fais-tu ?"
`;
        
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        
        return formatLocationResponse(response, location);

    } catch (error) {
        console.error('Erreur génération lieu:', error);
        return getErrorResponse();
    }
}

// Formater la réponse de lieu
function formatLocationResponse(response, location) {
    const { borders, symbols, emojis } = aesthetics;
    
    return `${borders.top}
${emojis.location} **${location.toUpperCase()}** ${emojis.location}
${borders.side}
${response}
${borders.side}
${symbols.arrow} *L'aventure commence ici...* ${symbols.sparkle}
${borders.bottom}`;
}

// Réponse d'erreur formatée
function getErrorResponse() {
    const { borders, symbols } = aesthetics;
    
    return `${borders.top}
${symbols.diamond} **SYSTÈME** ${symbols.diamond}
${borders.side}
Les brumes magiques obscurcissent votre vision...
Impossible de décrire ce lieu pour le moment.
${borders.side}
${borders.bottom}`;
}