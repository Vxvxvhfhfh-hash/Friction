const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const fs = require('fs-extra');
const chalk = require('chalk');
const figlet = require('figlet');
const cron = require('node-cron');

// Importation des modules personnalisés
const config = require('./config/config');
const GeminiAI = require('./utils/geminiAI');
const MediaManager = require('./utils/mediaManager');
const RPSystem = require('./utils/rpSystem');

class WhatsAppRPBot {
    constructor() {
        this.client = null;
        this.app = express();
        this.gemini = new GeminiAI();
        this.mediaManager = new MediaManager();
        this.rpSystem = new RPSystem();
        this.isReady = false;
        this.stats = {
            messagesProcessed: 0,
            sessionsCreated: 0,
            mediasSent: 0,
            startTime: new Date()
        };
    }

    /**
     * Initialise le bot
     */
    async initialize() {
        this.showWelcomeMessage();
        
        try {
            // Initialiser WhatsApp Client
            await this.initializeWhatsAppClient();
            
            // Initialiser le serveur web
            await this.initializeWebServer();
            
            // Initialiser les tâches programmées
            this.initializeCronJobs();
            
            // Générer les médias de démonstration
            await this.mediaManager.generateDemoMedia();
            
            console.log(chalk.green('✅ Bot WhatsApp RP initialisé avec succès !'));
            
        } catch (error) {
            console.error(chalk.red('❌ Erreur lors de l\'initialisation :'), error);
            process.exit(1);
        }
    }

    /**
     * Affiche le message de bienvenue
     */
    showWelcomeMessage() {
        console.clear();
        
        figlet('WhatsApp RP Bot', (err, data) => {
            if (err) {
                console.log(chalk.cyan('🎭 WHATSAPP RP BOT 🎭'));
            } else {
                console.log(chalk.cyan(data));
            }
            
            console.log(chalk.yellow('═'.repeat(60)));
            console.log(chalk.green('🤖 Bot de Jeu de Rôle avec IA Gemini'));
            console.log(chalk.blue('📱 Intégration WhatsApp Web.js'));
            console.log(chalk.magenta('🎮 Système RP immersif avec médias'));
            console.log(chalk.yellow('═'.repeat(60)));
            console.log('');
        });
    }

    /**
     * Initialise le client WhatsApp
     */
    async initializeWhatsAppClient() {
        console.log(chalk.blue('🔄 Initialisation du client WhatsApp...'));
        
        this.client = new Client({
            authStrategy: new LocalAuth({
                dataPath: config.whatsapp.sessionPath
            }),
            puppeteer: config.whatsapp.puppeteerOptions
        });

        // Événements WhatsApp
        this.setupWhatsAppEvents();
        
        // Démarrer le client
        await this.client.initialize();
    }

    /**
     * Configure les événements WhatsApp
     */
    setupWhatsAppEvents() {
        // QR Code pour la connexion
        this.client.on('qr', (qr) => {
            console.log(chalk.yellow('📱 Scannez ce QR code avec WhatsApp :'));
            qrcode.generate(qr, { small: true });
        });

        // Client prêt
        this.client.on('ready', () => {
            this.isReady = true;
            console.log(chalk.green('✅ Client WhatsApp connecté !'));
            console.log(chalk.blue(`📱 Connecté en tant que: ${this.client.info.pushname}`));
        });

        // Réception de messages
        this.client.on('message', async (message) => {
            await this.handleMessage(message);
        });

        // Déconnexion
        this.client.on('disconnected', (reason) => {
            console.log(chalk.red('❌ Client déconnecté:', reason));
            this.isReady = false;
        });

        // Erreurs
        this.client.on('auth_failure', (msg) => {
            console.error(chalk.red('❌ Échec d\'authentification:', msg));
        });
    }

    /**
     * Gère les messages entrants
     */
    async handleMessage(message) {
        try {
            // Ignorer les messages du bot lui-même
            if (message.fromMe) return;
            
            // Ignorer les messages de groupes (optionnel)
            if (message.from.includes('@g.us')) {
                // Décommenter pour activer dans les groupes
                // return;
            }

            this.stats.messagesProcessed++;
            
            const chatId = message.from;
            const userId = message.author || message.from;
            const messageText = message.body;
            
            console.log(chalk.cyan(`📨 Message reçu de ${userId}: ${messageText}`));
            
            // Traiter le message avec le système RP
            const result = await this.rpSystem.processRPCommand(messageText, chatId, userId);
            
            // Si c'est une commande système directe
            if (result.text) {
                await this.sendFormattedMessage(chatId, result.text);
                
                // Envoyer un média contextuel si disponible
                await this.sendContextualMedia(chatId, result.context);
                return;
            }
            
            // Générer une réponse IA
            if (result.context && result.session) {
                await this.processAIResponse(chatId, messageText, result.context, result.session);
            }
            
        } catch (error) {
            console.error(chalk.red('❌ Erreur traitement message:'), error);
            await this.sendErrorMessage(message.from);
        }
    }

    /**
     * Traite la réponse IA et envoie les médias
     */
    async processAIResponse(chatId, messageText, context, session) {
        try {
            // Générer la réponse avec Gemini AI
            const aiResponse = await this.gemini.generateRPResponse(messageText, chatId, context);
            
            // Envoyer la réponse textuelle
            await this.sendFormattedMessage(chatId, aiResponse);
            
            // Envoyer les médias contextuels
            await this.sendContextualMedia(chatId, context);
            
            console.log(chalk.green(`✅ Réponse RP envoyée pour ${chatId}`));
            
        } catch (error) {
            console.error(chalk.red('❌ Erreur réponse IA:'), error);
            await this.sendErrorMessage(chatId);
        }
    }

    /**
     * Envoie un message formaté
     */
    async sendFormattedMessage(chatId, text) {
        try {
            await this.client.sendMessage(chatId, text);
        } catch (error) {
            console.error(chalk.red('❌ Erreur envoi message:'), error);
        }
    }

    /**
     * Envoie des médias contextuels
     */
    async sendContextualMedia(chatId, context) {
        try {
            const mediaInfo = this.mediaManager.selectContextualMedia(context);
            
            if (mediaInfo && mediaInfo.hasMedia) {
                const mediaMessages = await this.mediaManager.createMediaMessage(mediaInfo);
                
                if (mediaMessages && mediaMessages.length > 0) {
                    for (const mediaMsg of mediaMessages) {
                        await this.sendMediaMessage(chatId, mediaMsg);
                        this.stats.mediasSent++;
                        
                        // Délai entre les médias
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
        } catch (error) {
            console.error(chalk.red('❌ Erreur envoi média:'), error);
        }
    }

    /**
     * Envoie un message média
     */
    async sendMediaMessage(chatId, mediaMessage) {
        try {
            if (!await fs.pathExists(mediaMessage.path)) {
                console.log(chalk.yellow(`⚠️ Fichier média introuvable: ${mediaMessage.path}`));
                return;
            }

            const media = MessageMedia.fromFilePath(mediaMessage.path);
            
            switch (mediaMessage.type) {
                case 'image':
                    await this.client.sendMessage(chatId, media, {
                        caption: mediaMessage.caption || ''
                    });
                    break;
                    
                case 'audio':
                    await this.client.sendMessage(chatId, media, {
                        sendAudioAsVoice: mediaMessage.ptt || false
                    });
                    break;
                    
                case 'video':
                    await this.client.sendMessage(chatId, media, {
                        caption: mediaMessage.caption || ''
                    });
                    break;
            }
            
            console.log(chalk.blue(`📎 Média ${mediaMessage.type} envoyé: ${mediaMessage.path}`));
            
        } catch (error) {
            console.error(chalk.red('❌ Erreur envoi média:'), error);
        }
    }

    /**
     * Envoie un message d'erreur
     */
    async sendErrorMessage(chatId) {
        const { borders, symbols } = config.aesthetics;
        const errorMessage = `${borders.top}
${symbols.diamond} **ERREUR SYSTÈME** ${symbols.diamond}
${borders.side}
Une erreur temporaire s'est produite.
Veuillez réessayer dans un moment.
${borders.side}
${symbols.arrow} Tapez \`/aide\` pour obtenir de l'aide
${borders.bottom}`;

        await this.sendFormattedMessage(chatId, errorMessage);
    }

    /**
     * Initialise le serveur web pour le monitoring
     */
    async initializeWebServer() {
        this.app.use(express.json());
        
        // Route de statut
        this.app.get('/status', (req, res) => {
            res.json({
                status: this.isReady ? 'online' : 'offline',
                uptime: Date.now() - this.stats.startTime,
                stats: {
                    ...this.stats,
                    rpSystem: this.rpSystem.getSystemStats(),
                    mediaManager: this.mediaManager.getMediaStats()
                }
            });
        });
        
        // Route de santé
        this.app.get('/health', (req, res) => {
            res.json({ 
                status: 'healthy',
                timestamp: new Date().toISOString(),
                whatsapp: this.isReady ? 'connected' : 'disconnected'
            });
        });
        
        // Route d'informations
        this.app.get('/', (req, res) => {
            res.json({
                name: 'WhatsApp RP Bot',
                version: '1.0.0',
                description: 'Bot de jeu de rôle avec IA Gemini pour WhatsApp',
                endpoints: ['/status', '/health']
            });
        });
        
        const server = this.app.listen(config.server.port, config.server.host, () => {
            console.log(chalk.green(`🌐 Serveur web démarré sur http://${config.server.host}:${config.server.port}`));
        });
        
        // Gestion de l'arrêt propre
        process.on('SIGTERM', () => {
            console.log(chalk.yellow('🔄 Arrêt du serveur...'));
            server.close(() => {
                if (this.client) {
                    this.client.destroy();
                }
                process.exit(0);
            });
        });
    }

    /**
     * Initialise les tâches programmées
     */
    initializeCronJobs() {
        // Nettoyage des sessions inactives toutes les heures
        cron.schedule('0 * * * *', () => {
            console.log(chalk.blue('🧹 Nettoyage des sessions inactives...'));
            this.rpSystem.cleanupInactiveSessions();
        });
        
        // Statistiques toutes les 6 heures
        cron.schedule('0 */6 * * *', () => {
            const stats = {
                ...this.stats,
                rpSystem: this.rpSystem.getSystemStats(),
                mediaManager: this.mediaManager.getMediaStats()
            };
            
            console.log(chalk.cyan('📊 Statistiques:'), stats);
        });
        
        console.log(chalk.green('⏰ Tâches programmées configurées'));
    }

    /**
     * Affiche les informations de démarrage
     */
    showStartupInfo() {
        console.log(chalk.yellow('\n' + '═'.repeat(60)));
        console.log(chalk.green('🎉 BOT WHATSAPP RP DÉMARRÉ AVEC SUCCÈS !'));
        console.log(chalk.yellow('═'.repeat(60)));
        console.log(chalk.blue('📱 Prêt à recevoir des messages WhatsApp'));
        console.log(chalk.magenta('🎭 Système RP avec IA Gemini activé'));
        console.log(chalk.cyan('📁 Gestionnaire de médias initialisé'));
        console.log(chalk.green(`🌐 Interface web: http://localhost:${config.server.port}`));
        console.log(chalk.yellow('═'.repeat(60)));
        console.log(chalk.white('\nCommandes disponibles:'));
        console.log(chalk.gray('• /personnage - Choisir un personnage'));
        console.log(chalk.gray('• /statut - Voir le statut actuel'));
        console.log(chalk.gray('• /aide - Afficher l\'aide'));
        console.log(chalk.yellow('═'.repeat(60)));
        console.log('');
    }

    /**
     * Démarre le bot
     */
    async start() {
        await this.initialize();
        
        // Attendre que le client soit prêt
        const waitForReady = () => {
            return new Promise((resolve) => {
                if (this.isReady) {
                    resolve();
                } else {
                    this.client.once('ready', resolve);
                }
            });
        };
        
        await waitForReady();
        this.showStartupInfo();
    }
}

// Démarrage du bot
if (require.main === module) {
    const bot = new WhatsAppRPBot();
    
    bot.start().catch(error => {
        console.error(chalk.red('❌ Erreur fatale:'), error);
        process.exit(1);
    });
    
    // Gestion des signaux de fin
    process.on('SIGINT', () => {
        console.log(chalk.yellow('\n🔄 Arrêt du bot...'));
        if (bot.client) {
            bot.client.destroy();
        }
        process.exit(0);
    });
}

module.exports = WhatsAppRPBot;