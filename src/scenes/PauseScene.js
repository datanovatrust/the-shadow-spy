// src/scenes/PauseScene.js

export class PauseScene extends Phaser.Scene {
    constructor() {
        super('PauseScene');
    }

    create() {
        // Dim the background
        this.cameras.main.setBackgroundColor('rgba(0, 0, 0, 0.5)');

        // Display 'Paused' text
        this.add.text(400, 200, 'Paused', {
            fontSize: '48px',
            fill: '#FFFFFF',
        }).setOrigin(0.5);

        // Add resume button
        const resumeButton = this.add.text(400, 300, 'Resume', {
            fontSize: '32px',
            fill: '#FFFFFF',
        }).setOrigin(0.5).setInteractive();

        resumeButton.on('pointerdown', () => {
            this.scene.stop();
            this.scene.resume('GameScene');
        });

        // Add quit to menu button
        const quitButton = this.add.text(400, 400, 'Quit to Menu', {
            fontSize: '32px',
            fill: '#FFFFFF',
        }).setOrigin(0.5).setInteractive();

        quitButton.on('pointerdown', () => {
            this.scene.stop('GameScene');
            this.scene.start('MenuScene');
        });
    }
}
