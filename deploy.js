const fs = require('fs');
const path = require('path');
const readline = require('readline');

class DeploymentManager {
    constructor() {
        this.platforms = ['vercel', 'netlify', 'github-pages', 'heroku', 'aws'];
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async deploy() {
        console.log('🚀 Instagram CRM Deployment Manager');
        console.log('================================\n');

        const platform = await this.selectPlatform();
        console.log(`\n📦 Preparing deployment to ${platform}...\n`);

        switch(platform) {
            case 'vercel':
                await this.deployToVercel();
                break;
            case 'netlify':
                await this.deployToNetlify();
                break;
            case 'github-pages':
                await this.deployToGitHubPages();
                break;
            case 'heroku':
                await this.deployToHeroku();
                break;
            case 'aws':
                await this.deployToAWS();
                break;
        }

        this.rl.close();
    }

    async selectPlatform() {
        return new Promise((resolve) => {
            console.log('Select deployment platform:');
            this.platforms.forEach((platform, index) => {
                console.log(`${index + 1}. ${platform}`);
            });

            this.rl.question('\nEnter platform number: ', (answer) => {
                const index = parseInt(answer) - 1;
                if (index >= 0 && index < this.platforms.length) {
                    resolve(this.platforms[index]);
                } else {
                    console.log('Invalid selection');
                    resolve(this.platforms[0]);
                }
            });
        });
    }

    async deployToVercel() {
        console.log('📦 Deploying to Vercel...');
        this.executeCommand('npm install -g vercel');
        this.executeCommand('vercel --prod');
    }

    async deployToNetlify() {
        console.log('📦 Deploying to Netlify...');
        this.executeCommand('npm install -g netlify-cli');
        this.executeCommand('netlify deploy --prod');
    }

    async deployToGitHubPages() {
        console.log('📦 Deploying to GitHub Pages...');
        this.executeCommand('npm install -g gh-pages');
        this.executeCommand('gh-pages -d public');
    }

    async deployToHeroku() {
        console.log('📦 Deploying to Heroku...');
        this.executeCommand('heroku login');
        this.rl.question('Enter Heroku app name: ', (appName) => {
            this.executeCommand(`heroku git:remote -a ${appName}`);
            this.executeCommand('git push heroku main');
        });
    }

    async deployToAWS() {
        console.log('📦 Deploying to AWS...');
        console.log('Please ensure AWS CLI is installed and configured');
        this.executeCommand('aws --version');
        console.log('For detailed AWS deployment, refer to the documentation');
    }

    executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`❌ Error: ${error.message}`);
                    reject(error);
                    return;
                }
                if (stderr) {
                    console.log(`⚠️  ${stderr}`);
                }
                console.log(`✅ ${stdout}`);
                resolve(stdout);
            });
        });
    }
}

// Run deployment if script is executed directly
if (require.main === module) {
    const manager = new DeploymentManager();
    manager.deploy();
}

javascript