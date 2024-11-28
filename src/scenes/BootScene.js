// src/scenes/BootScene.js

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Load any assets needed for the loading screen
  }

  create() {
    this.scene.start('PreloadScene');
  }
}
