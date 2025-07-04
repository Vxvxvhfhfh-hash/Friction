// Sessions temporaires en mémoire (en production, utiliser une base de données)
const sessions = new Map();

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { characterKey } = req.body;
        
        if (!characterKey) {
            return res.status(400).json({ error: 'characterKey requis' });
        }

        // Obtenir l'IP comme identifiant de session temporaire
        const sessionId = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'default';
        
        // Personnages disponibles
        const characters = {
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

        const character = characters[characterKey];
        
        if (!character) {
            return res.status(400).json({ error: 'Personnage introuvable' });
        }

        // Créer ou mettre à jour la session
        const session = {
            characterKey,
            character,
            currentLocation: character.location,
            scenario: 'Aventure fantasy médiévale',
            mood: 'mystérieuse',
            history: [],
            createdAt: new Date(),
            lastActivity: new Date()
        };

        sessions.set(sessionId, session);

        res.status(200).json({
            success: true,
            message: `Personnage ${character.name} sélectionné`,
            character,
            sessionId
        });

    } catch (error) {
        console.error('Erreur sélection personnage:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}