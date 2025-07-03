const fs = require('fs-extra');
const path = require('path');
const config = require('../config/config');

class MediaManager {
    constructor() {
        this.mediaPath = config.rp.mediaPath;
        this.initializeMediaFolders();
        this.mediaDatabase = new Map();
        this.loadMediaDatabase();
    }

    /**
     * Initialise les dossiers de médias
     */
    async initializeMediaFolders() {
        const folders = [
            'images/locations',
            'images/characters',
            'images/items',
            'images/actions',
            'images/weather',
            'audio/ambiance',
            'audio/effects',
            'videos/cutscenes'
        ];

        for (const folder of folders) {
            await fs.ensureDir(path.join(this.mediaPath, folder));
        }
    }

    /**
     * Charge la base de données des médias
     */
    async loadMediaDatabase() {
        try {
            const dbPath = path.join(this.mediaPath, 'media-database.json');
            
            if (await fs.pathExists(dbPath)) {
                const data = await fs.readJson(dbPath);
                this.mediaDatabase = new Map(Object.entries(data));
            } else {
                // Créer une base de données par défaut
                await this.createDefaultMediaDatabase();
            }
        } catch (error) {
            console.error('Erreur chargement base médias:', error);
            await this.createDefaultMediaDatabase();
        }
    }

    /**
     * Crée une base de données de médias par défaut
     */
    async createDefaultMediaDatabase() {
        const defaultDatabase = {
            locations: {
                'taverne': {
                    images: ['taverne1.jpg', 'taverne2.jpg'],
                    audio: ['taverne-ambiance.mp3'],
                    description: 'Taverne chaleureuse avec cheminée'
                },
                'forêt': {
                    images: ['foret1.jpg', 'foret2.jpg'],
                    audio: ['foret-ambiance.mp3'],
                    description: 'Forêt mystérieuse et dense'
                },
                'château': {
                    images: ['chateau1.jpg', 'chateau2.jpg'],
                    audio: ['chateau-ambiance.mp3'],
                    description: 'Château imposant et ancien'
                },
                'donjon': {
                    images: ['donjon1.jpg', 'donjon2.jpg'],
                    audio: ['donjon-ambiance.mp3'],
                    description: 'Souterrains sombres et humides'
                }
            },
            actions: {
                'combat': {
                    images: ['combat1.jpg', 'combat2.jpg'],
                    audio: ['combat-effect.mp3'],
                    description: 'Scène de combat épique'
                },
                'magie': {
                    images: ['magie1.jpg', 'magie2.jpg'],
                    audio: ['magie-effect.mp3'],
                    description: 'Effets magiques impressionnants'
                },
                'exploration': {
                    images: ['exploration1.jpg', 'exploration2.jpg'],
                    audio: ['exploration-ambiance.mp3'],
                    description: 'Découverte de nouveaux lieux'
                },
                'dialogue': {
                    images: ['dialogue1.jpg', 'dialogue2.jpg'],
                    audio: ['dialogue-ambiance.mp3'],
                    description: 'Conversation importante'
                }
            },
            weather: {
                'pluie': {
                    images: ['pluie1.jpg'],
                    audio: ['pluie.mp3'],
                    description: 'Pluie battante'
                },
                'orage': {
                    images: ['orage1.jpg'],
                    audio: ['orage.mp3'],
                    description: 'Orage violent'
                },
                'soleil': {
                    images: ['soleil1.jpg'],
                    audio: ['vent-leger.mp3'],
                    description: 'Beau temps ensoleillé'
                }
            },
            items: {
                'épée': {
                    images: ['epee1.jpg', 'epee2.jpg'],
                    description: 'Épée légendaire'
                },
                'potion': {
                    images: ['potion1.jpg', 'potion2.jpg'],
                    description: 'Potion magique'
                },
                'livre': {
                    images: ['livre1.jpg', 'livre2.jpg'],
                    description: 'Grimoire ancien'
                }
            }
        };

        this.mediaDatabase = new Map(Object.entries(defaultDatabase));
        await this.saveMediaDatabase();
    }

    /**
     * Sauvegarde la base de données des médias
     */
    async saveMediaDatabase() {
        try {
            const dbPath = path.join(this.mediaPath, 'media-database.json');
            const data = Object.fromEntries(this.mediaDatabase);
            await fs.writeJson(dbPath, data, { spaces: 2 });
        } catch (error) {
            console.error('Erreur sauvegarde base médias:', error);
        }
    }

    /**
     * Sélectionne un média approprié selon le contexte
     * @param {Object} context - Contexte RP
     * @returns {Object|null} Informations du média sélectionné
     */
    selectContextualMedia(context) {
        const { location, action, weather, item, type } = context;
        
        // Priorité aux éléments spécifiques
        if (item && this.mediaDatabase.has('items')) {
            const itemMedia = this.findMediaForCategory('items', item);
            if (itemMedia) return itemMedia;
        }
        
        if (action && this.mediaDatabase.has('actions')) {
            const actionMedia = this.findMediaForCategory('actions', action);
            if (actionMedia) return actionMedia;
        }
        
        if (weather && this.mediaDatabase.has('weather')) {
            const weatherMedia = this.findMediaForCategory('weather', weather);
            if (weatherMedia) return weatherMedia;
        }
        
        if (location && this.mediaDatabase.has('locations')) {
            const locationMedia = this.findMediaForCategory('locations', location);
            if (locationMedia) return locationMedia;
        }
        
        // Media par défaut selon le type
        return this.getDefaultMediaForType(type);
    }

    /**
     * Trouve un média pour une catégorie spécifique
     */
    findMediaForCategory(category, keyword) {
        const categoryData = this.mediaDatabase.get(category);
        if (!categoryData) return null;
        
        // Recherche exacte
        if (categoryData[keyword]) {
            return this.formatMediaInfo(category, keyword, categoryData[keyword]);
        }
        
        // Recherche partielle
        const keys = Object.keys(categoryData);
        const partialMatch = keys.find(key => 
            key.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(key.toLowerCase())
        );
        
        if (partialMatch) {
            return this.formatMediaInfo(category, partialMatch, categoryData[partialMatch]);
        }
        
        return null;
    }

    /**
     * Formate les informations de média
     */
    formatMediaInfo(category, key, mediaData) {
        const selectedImage = mediaData.images ? 
            this.selectRandomFromArray(mediaData.images) : null;
        const selectedAudio = mediaData.audio ? 
            this.selectRandomFromArray(mediaData.audio) : null;
        const selectedVideo = mediaData.videos ? 
            this.selectRandomFromArray(mediaData.videos) : null;

        return {
            category,
            key,
            description: mediaData.description,
            image: selectedImage ? path.join(this.mediaPath, `images/${category}`, selectedImage) : null,
            audio: selectedAudio ? path.join(this.mediaPath, `audio/${category}`, selectedAudio) : null,
            video: selectedVideo ? path.join(this.mediaPath, `videos/${category}`, selectedVideo) : null,
            hasMedia: !!(selectedImage || selectedAudio || selectedVideo)
        };
    }

    /**
     * Sélectionne un élément aléatoire d'un tableau
     */
    selectRandomFromArray(array) {
        if (!array || array.length === 0) return null;
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Obtient un média par défaut selon le type
     */
    getDefaultMediaForType(type) {
        const defaults = {
            'combat': () => this.findMediaForCategory('actions', 'combat'),
            'magic': () => this.findMediaForCategory('actions', 'magie'),
            'dialogue': () => this.findMediaForCategory('actions', 'dialogue'),
            'exploration': () => this.findMediaForCategory('actions', 'exploration'),
            'location': () => this.findMediaForCategory('locations', 'taverne')
        };
        
        if (defaults[type]) {
            return defaults[type]();
        }
        
        return null;
    }

    /**
     * Vérifie si un fichier média existe
     */
    async mediaExists(filePath) {
        try {
            return await fs.pathExists(filePath);
        } catch (error) {
            return false;
        }
    }

    /**
     * Crée un message de média pour WhatsApp
     */
    async createMediaMessage(mediaInfo, caption = '') {
        if (!mediaInfo || !mediaInfo.hasMedia) {
            return null;
        }

        const messages = [];
        
        // Message image
        if (mediaInfo.image && await this.mediaExists(mediaInfo.image)) {
            messages.push({
                type: 'image',
                path: mediaInfo.image,
                caption: caption || mediaInfo.description || ''
            });
        }
        
        // Message audio
        if (mediaInfo.audio && await this.mediaExists(mediaInfo.audio)) {
            messages.push({
                type: 'audio',
                path: mediaInfo.audio,
                ptt: true // Push to talk
            });
        }
        
        // Message vidéo
        if (mediaInfo.video && await this.mediaExists(mediaInfo.video)) {
            messages.push({
                type: 'video',
                path: mediaInfo.video,
                caption: caption || mediaInfo.description || ''
            });
        }
        
        return messages.length > 0 ? messages : null;
    }

    /**
     * Ajoute un nouveau média à la base de données
     */
    async addMedia(category, key, mediaData) {
        if (!this.mediaDatabase.has(category)) {
            this.mediaDatabase.set(category, {});
        }
        
        const categoryData = this.mediaDatabase.get(category);
        categoryData[key] = mediaData;
        
        await this.saveMediaDatabase();
    }

    /**
     * Génère des médias de démonstration (URLs d'exemple)
     */
    async generateDemoMedia() {
        const demoImages = {
            'taverne1.jpg': 'https://example.com/taverne1.jpg',
            'foret1.jpg': 'https://example.com/foret1.jpg',
            'chateau1.jpg': 'https://example.com/chateau1.jpg',
            'combat1.jpg': 'https://example.com/combat1.jpg',
            'magie1.jpg': 'https://example.com/magie1.jpg'
        };

        // Créer des fichiers de démonstration (texte)
        for (const [filename, url] of Object.entries(demoImages)) {
            const category = filename.includes('taverne') || filename.includes('foret') || filename.includes('chateau') ? 'locations' : 'actions';
            const demoPath = path.join(this.mediaPath, 'images', category, filename + '.demo');
            
            await fs.writeFile(demoPath, `Fichier de démonstration: ${url}\nRemplacez par un vrai fichier média.`);
        }
        
        console.log('📁 Fichiers de démonstration créés dans:', this.mediaPath);
    }

    /**
     * Obtient les statistiques des médias
     */
    getMediaStats() {
        const stats = {
            totalCategories: this.mediaDatabase.size,
            totalItems: 0,
            categoriesBreakdown: {}
        };
        
        for (const [category, items] of this.mediaDatabase.entries()) {
            const itemCount = Object.keys(items).length;
            stats.categoriesBreakdown[category] = itemCount;
            stats.totalItems += itemCount;
        }
        
        return stats;
    }
}

module.exports = MediaManager;