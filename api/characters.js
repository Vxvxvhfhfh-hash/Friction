// Endpoint pour récupérer la liste des personnages
export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Personnages par défaut (en production, ceci pourrait venir d'une base de données)
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

        res.status(200).json(characters);
    } catch (error) {
        console.error('Erreur récupération personnages:', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}