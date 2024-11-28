// src/main.js

import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { GameScene } from './scenes/GameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 500 }, debug: false },
  },
  scene: [BootScene, PreloadScene, GameScene],
};

const game = new Phaser.Game(config);
