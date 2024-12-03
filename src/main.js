// src/main.js

import { BootScene } from './scenes/BootScene.js';
import { PreloadScene } from './scenes/PreloadScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { PauseScene } from './scenes/PauseScene.js';
import { Level2Scene } from './scenes/Level2Scene.js';
import { BossFightScene } from './scenes/BossFightScene.js';
import { FederatedLearningBossFightScene } from './scenes/FederatedLearningBossFightScene.js';
import { HomomorphicEncryptionBossFightScene } from './scenes/HomomorphicEncryptionBossFightScene.js';
import { SecureMultipartyBossFightScene } from './scenes/SecureMultipartyBossFightScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [
    BootScene,
    PreloadScene,
    MenuScene,
    GameScene,
    PauseScene,
    Level2Scene,
    FederatedLearningBossFightScene,
    BossFightScene,
    HomomorphicEncryptionBossFightScene,
    SecureMultipartyBossFightScene,
  ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
