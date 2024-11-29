// src/scenes/MenuScene.js

export class MenuScene extends Phaser.Scene {
    constructor() {
      super('MenuScene');
    }
  
    create() {
      // Clear existing display objects
      this.children.removeAll();
  
      // Set background color for visibility
      this.cameras.main.setBackgroundColor('#000000');
  
      // Add menu background
      this.menu_background = this.add.image(400, 300, 'menu_background');
  
      // Check if the GameScene is paused
      const isGamePaused = this.scene.get('GameScene')?.scene.isPaused() || false;
  
      // Add start or resume button based on game state
      this.start_button = this.add.image(400, 300, 'start_button').setInteractive();
      const buttonText = isGamePaused ? 'Resume' : 'Start';
  
      // Add button text
      const buttonLabel = this.add.text(400, 300, buttonText, {
        fontSize: '32px',
        fill: '#FFFFFF',
      }).setOrigin(0.5);
  
      // Start or resume the game when the button is clicked
      this.start_button.on('pointerdown', () => {
        if (isGamePaused) {
          // Resume the GameScene
          this.scene.stop('MenuScene');     // Stop the MenuScene
          this.scene.resume('GameScene');   // Resume the GameScene
        } else {
          // Start the GameScene
          this.scene.stop('MenuScene');     // Stop the MenuScene
          this.scene.start('GameScene');    // Start the GameScene
        }
      });
  
      // Optionally, add a quit button to return to the main menu or close the game
      const quitButton = this.add.text(400, 400, 'Quit', {
        fontSize: '24px',
        fill: '#FFFFFF',
      }).setOrigin(0.5).setInteractive();
  
      quitButton.on('pointerdown', () => {
        this.scene.stop('GameScene'); // Stop the GameScene
        this.scene.stop('MenuScene'); // Stop the MenuScene
        this.scene.start('MenuScene'); // Restart the MenuScene
      });
  
      // Bring the scene to the top
      this.scene.bringToTop();
  
      // Set depth higher than other scenes
      this.children.bringToTop(this.menu_background);
      this.children.bringToTop(this.start_button);
      this.children.bringToTop(buttonLabel);
      this.children.bringToTop(quitButton);
    }
  
    shutdown() {
      this.children.removeAll();
    }
  }
  