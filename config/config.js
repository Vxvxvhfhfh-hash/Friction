const config = {
    // Configuration Gemini AI
    gemini: {
        apiKey: process.env.GEMINI_API_KEY || 'AIzaSyAZ2kEdV2msOk_oGozkExOXfxEaudOUFOA',
        model: 'gemini-pro'
    },

    // Configuration WhatsApp
    whatsapp: {
        sessionPath: './session',
        puppeteerOptions: {
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    },

    // Configuration RP
    rp: {
        defaultLanguage: 'fr',
        maxMessageLength: 2000,
        cooldownTime: 3000, // 3 secondes
        mediaPath: './media/',
        charactersDataPath: './data/characters.json'
    },

    // Configuration serveur
    server: {
        port: process.env.PORT || 3000,
        host: '0.0.0.0'
    },

    // Caractères spéciaux pour l'esthétique
    aesthetics: {
        borders: {
            top: '═══════════════════════════',
            side: '║',
            bottom: '═══════════════════════════',
            corner: '╔╗╚╝'
        },
        symbols: {
            star: '✦',
            diamond: '◆',
            arrow: '➤',
            dot: '●',
            sparkle: '✨',
            crown: '👑',
            sword: '⚔️',
            shield: '🛡️',
            magic: '🪄',
            scroll: '📜'
        },
        emojis: {
            action: '🎭',
            story: '📖',
            character: '👤',
            location: '🏰',
            item: '💎',
            combat: '⚔️',
            magic: '✨',
            dialogue: '💬'
        }
    }
};

module.exports = config;
