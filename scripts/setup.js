#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * Script de configuration initiale du bot WhatsApp RP
 */
class SetupScript {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
    }

    async run() {
        console.log(chalk.cyan('🎭 Configuration du Bot WhatsApp RP\n'));

        try {
            await this.checkPrerequisites();
            await this.createDirectories();
            await this.createConfigFiles();
            await this.showNextSteps();
        } catch (error) {
            console.error(chalk.red('❌ Erreur durant la configuration:'), error.message);
            process.exit(1);
        }
    }

    async checkPrerequisites() {
        console.log(chalk.blue('🔍 Vérification des prérequis...'));

        // Vérifier Node.js
        const nodeVersion = process.version;
        console.log(chalk.green(`✅ Node.js ${nodeVersion}`));

        // Vérifier si npm est installé
        try {
            const { execSync } = require('child_process');
            const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
            console.log(chalk.green(`✅ npm ${npmVersion}`));
        } catch (error) {
            throw new Error('npm n\'est pas installé');
        }

        console.log('');
    }

    async createDirectories() {
        console.log(chalk.blue('📁 Création de la structure des dossiers...'));

        const directories = [
            'data',
            'media/images/locations',
            'media/images/actions',
            'media/images/characters',
            'media/images/items',
            'media/images/weather',
            'media/audio/ambiance',
            'media/audio/effects',
            'media/videos/cutscenes',
            'logs'
        ];

        for (const dir of directories) {
            const fullPath = path.join(this.projectRoot, dir);
            await fs.ensureDir(fullPath);
            console.log(chalk.green(`✅ ${dir}/`));
        }

        console.log('');
    }

    async createConfigFiles() {
        console.log(chalk.blue('⚙️ Création des fichiers de configuration...'));

        // Créer le fichier .env s'il n'existe pas
        const envPath = path.join(this.projectRoot, '.env');
        const envExamplePath = path.join(this.projectRoot, '.env.example');

        if (!await fs.pathExists(envPath)) {
            if (await fs.pathExists(envExamplePath)) {
                await fs.copy(envExamplePath, envPath);
                console.log(chalk.green('✅ .env créé à partir de .env.example'));
            } else {
                await this.createDefaultEnv(envPath);
                console.log(chalk.green('✅ .env créé avec des valeurs par défaut'));
            }
        } else {
            console.log(chalk.yellow('⚠️ .env existe déjà'));
        }

        console.log('');
    }

    async createDefaultEnv(envPath) {
        const defaultEnv = `# Configuration de l'API Gemini
GEMINI_API_KEY=your-gemini-api-key-here

# Configuration du serveur web
PORT=3000
HOST=0.0.0.0

# Configuration optionnelle
NODE_ENV=development
`;
        await fs.writeFile(envPath, defaultEnv);
    }

    showNextSteps() {
        console.log(chalk.yellow('🚀 Prochaines étapes:\n'));

        console.log(chalk.white('1. ') + chalk.cyan('Configurer l\'API Gemini:'));
        console.log('   • Allez sur https://makersuite.google.com/app/apikey');
        console.log('   • Créez une clé API');
        console.log('   • Remplacez "your-gemini-api-key-here" dans le fichier .env\n');

        console.log(chalk.white('2. ') + chalk.cyan('Installer les dépendances:'));
        console.log('   npm install\n');

        console.log(chalk.white('3. ') + chalk.cyan('Ajouter des médias (optionnel):'));
        console.log('   • Placez vos images dans media/images/');
        console.log('   • Placez vos audios dans media/audio/');
        console.log('   • Placez vos vidéos dans media/videos/\n');

        console.log(chalk.white('4. ') + chalk.cyan('Démarrer le bot:'));
        console.log('   npm start\n');

        console.log(chalk.white('5. ') + chalk.cyan('Scanner le QR Code WhatsApp'));
        console.log('   Le QR Code s\'affichera dans le terminal\n');

        console.log(chalk.green('✨ Votre bot sera prêt à recevoir des messages !'));
        console.log(chalk.gray('Tapez /aide dans WhatsApp pour voir les commandes disponibles.\n'));
    }
}

// Exécuter le script si appelé directement
if (require.main === module) {
    const setup = new SetupScript();
    setup.run();
}

module.exports = SetupScript;