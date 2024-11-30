// src/scenes/Level2Scene.js

import { Player } from '../characters/Player.js';
import { FishEnemy } from '../enemies/FishEnemy.js';
import { FederatedLearningMinigame } from './FederatedLearningMinigame.js';
import { BossFightScene } from './BossFightScene.js';

export class Level2Scene extends Phaser.Scene {
  constructor() {
    super('Level2Scene');
  }

  // Add this method at the beginning of Level2Scene class
  init(data) {
    console.log('Received playerData:', data.playerData);
    this.playerData = data.playerData || {};
  }

  create() {
    // Reset physics world
    this.physics.world.resume();
    this.physics.world.enable = true;
  
    // Set physics world bounds to match the level size
    this.physics.world.setBounds(0, 0, 8000, 600);
  
    // Initialize groups
    this.activeEnemies = this.physics.add.group();
    this.platforms = this.physics.add.staticGroup();
    this.healthPacks = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
    this.terminals = this.physics.add.staticGroup();
  
    // Create background layers
    this.createBackground();
  
    // Create platforms with variegated terrain
    this.createPlatforms();
  
    // Create the player with existing data
    this.player = new Player(this, 100, 450);
    if (this.playerData) {
      Object.assign(this.player, this.playerData); // Apply the saved data to the player
    }
    this.player.scene = this;
  
    // Set up colliders
    this.setupColliders();
  
    // Create enemies
    this.createEnemies();
  
    // Create collectibles and power-ups
    this.createCollectibles();
  
    // Create terminals for the minigame
    this.createTerminals();
  
    // Set up camera
    this.cameras.main.setBounds(0, 0, 8000, 600);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
  
    // HUD
    this.createHUD();
  
    // Input for menu
    this.input.keyboard.on('keydown-M', () => {
      this.scene.pause('Level2Scene');
      if (this.scene.isActive('MenuScene')) {
        this.scene.bringToTop('MenuScene');
      } else {
        this.scene.launch('MenuScene');
      }
    });
  
    // Add the minigame scene
    this.scene.add('FederatedLearningMinigame', FederatedLearningMinigame);
  
    // Add a trigger point for the boss fight
    this.createBossTrigger();
  }

  setupColliders() {
    // Player colliders
    if (this.player && this.platforms) {
      this.physics.add.collider(this.player, this.platforms);
    }

    // Player and sailboat collision
    if (this.player && this.sailboat) {
      this.physics.add.collider(this.player, this.sailboat);
    }

    // Enemy colliders
    if (this.activeEnemies && this.platforms) {
      this.physics.add.collider(this.activeEnemies, this.platforms);
    }

    // Overlaps between player and enemies
    if (this.player && this.activeEnemies) {
      this.physics.add.overlap(
        this.player,
        this.activeEnemies,
        this.handlePlayerEnemyCollision,
        null,
        this
      );

      // Overlaps for player's weapon
      if (this.player.weapon) {
        this.physics.add.overlap(
          this.player.weapon,
          this.activeEnemies,
          this.handleWeaponEnemyCollision,
          null,
          this
        );
      }

      // Overlaps for player's projectiles
      if (this.player.projectiles) {
        this.physics.add.overlap(
          this.player.projectiles,
          this.activeEnemies,
          this.handleProjectileEnemyCollision,
          null,
          this
        );
      }
    }

    // Overlaps with health packs
    if (this.player && this.healthPacks) {
      this.physics.add.overlap(
        this.player,
        this.healthPacks,
        this.collectHealthPack,
        null,
        this
      );
    }

    // Overlaps with terminals
    if (this.player && this.terminals) {
      this.physics.add.overlap(
        this.player,
        this.terminals,
        this.handleTerminalOverlap,
        null,
        this
      );
    }

    // Overlaps with boss trigger
    if (this.player && this.bossTrigger) {
      this.physics.add.overlap(
        this.player,
        this.bossTrigger,
        this.transitionToBossFight,
        null,
        this
      );
    }
  }

  createBackground() {
    // Add sky background
    this.backgroundSky = this.add
      .tileSprite(4000, 300, 8000, 600, 'background_river')
      .setScrollFactor(0);

    // Add sun
    this.sun = this.add.image(700, 100, 'sun').setScrollFactor(0.1);

    // Add clouds
    this.clouds = this.add.group();
    for (let i = 0; i < 5; i++) {
      const cloud = this.add
        .image(
          Phaser.Math.Between(0, 8000),
          Phaser.Math.Between(50, 200),
          'cloud'
        )
        .setScrollFactor(0.2);
      this.clouds.add(cloud);
    }

    // Add trees
    this.trees = this.add.group();
    for (let i = 0; i < 20; i++) {
      const tree = this.add
        .image(
          Phaser.Math.Between(0, 8000),
          Phaser.Math.Between(400, 500),
          'tree'
        )
        .setScrollFactor(0.5);
      this.trees.add(tree);
    }

    // Add animated water
    this.water = this.add
      .tileSprite(4000, 550, 8000, 100, 'animated_water')
      .setOrigin(0.5, 0)
      .setScrollFactor(0);
  }

  createPlatforms() {
    // Create ground platforms with variegated terrain
    const groundY = 584;
    const platformWidth = 200;
    const terrainHeights = [0, -20, -40, 0, 20, 0, -30, 0, 20, -10];

    for (let i = 0; i < 40; i++) {
      const heightVariation = terrainHeights[i % terrainHeights.length];
      const platformY = groundY + heightVariation;

      const platform = this.platforms
        .create(i * platformWidth + 100, platformY, 'wooden_platform')
        .setScale(1)
        .refreshBody();

      // Add slight rotation for hills effect
      if (heightVariation !== 0) {
        platform.angle = Phaser.Math.Between(-5, 5);
      }
    }

    // Create additional platforms at varying heights
    const extraPlatforms = [
      { x: 600, y: 450, key: 'wooden_platform', scale: 0.8 },
      { x: 800, y: 400, key: 'wooden_platform', scale: 0.6 },
      { x: 1000, y: 350, key: 'wooden_platform', scale: 0.8 },
      { x: 2200, y: 480, key: 'lily_pad', scale: 0.5 },
      { x: 2400, y: 460, key: 'lily_pad', scale: 0.5 },
      { x: 2600, y: 440, key: 'lily_pad', scale: 0.5 },
      { x: 2800, y: 420, key: 'wooden_platform', scale: 0.8 },
      { x: 3000, y: 400, key: 'wooden_platform', scale: 0.8 },
      { x: 3200, y: 380, key: 'wooden_platform', scale: 0.8 },
      { x: 3400, y: 360, key: 'wooden_platform', scale: 0.8 },
      { x: 3600, y: 340, key: 'wooden_platform', scale: 0.8 },
      { x: 3800, y: 320, key: 'wooden_platform', scale: 0.8 },
    ];

    extraPlatforms.forEach((plat) => {
      const platform = this.platforms
        .create(plat.x, plat.y, plat.key)
        .setScale(plat.scale)
        .refreshBody();

      // Randomize platform angle slightly
      platform.angle = Phaser.Math.Between(-5, 5);
    });

    // Create dock
    this.platforms.create(1200, 500, 'dock').refreshBody();

    // Create lily pad platforms over the river
    const lilyPadPositions = [
      { x: 1600, y: 500 },
      { x: 1700, y: 480 },
      { x: 1800, y: 500 },
      { x: 1900, y: 480 },
    ];

    lilyPadPositions.forEach((pos) => {
      this.platforms
        .create(pos.x, pos.y, 'lily_pad')
        .setScale(0.5)
        .refreshBody();
    });

    // Place the sailboat
    this.sailboat = this.physics.add.image(2000, 500, 'sailboat');
    this.sailboat.setImmovable(true);
    this.sailboat.body.allowGravity = false;
    this.sailboat.body.moves = false;

    // Sailboat movement via tween
    this.tweens.add({
      targets: this.sailboat,
      x: 4000,
      duration: 20000,
      ease: 'Linear',
      yoyo: false,
      repeat: 0,
    });

    // Add physics collider for sailboat with platforms (if needed)
    this.physics.add.collider(this.sailboat, this.platforms);
  }

  createEnemies() {
    // Initialize enemy data for dynamic spawning
    this.enemyData = [
      { x: 1600, y: 550, type: 'fish' },
      { x: 1800, y: 550, type: 'fish' },
      { x: 2200, y: 550, type: 'fish' },
      { x: 2400, y: 550, type: 'fish' },
      { x: 3000, y: 500, type: 'fish' },
      { x: 3200, y: 480, type: 'fish' },
      { x: 3400, y: 460, type: 'fish' },
    ];

    // Initialize active enemies group
    this.activeEnemies = this.physics.add.group();
  }

  createCollectibles() {
    // Implement collectibles like health packs or new items
    this.healthPacks.create(2500, 450, 'item_healthPack');
    this.healthPacks.create(3500, 400, 'item_healthPack');
  }

  createTerminals() {
    // Create interactive terminals for the Federated Learning minigame
    const terminalPositions = [
      { id: 1, x: 2000, y: 500 },
      { id: 2, x: 3700, y: 320 },
      { id: 3, x: 5000, y: 500 },
    ];

    terminalPositions.forEach((pos) => {
      const terminal = this.terminals.create(
        pos.x,
        pos.y - 32,
        'terminal_sprite'
      );
      terminal.setInteractive();
      terminal.minigameCompleted = false;
      terminal.id = pos.id; // Assign unique ID

      terminal.on('pointerdown', () => {
        if (!terminal.minigameCompleted) {
          this.startFederatedLearningMinigame(terminal);
        }
      });
    });
  }

  createBossTrigger() {
    // Create a trigger for the boss fight
    this.bossTrigger = this.physics.add.staticImage(
      7800,
      500,
      'finishFlag'
    );
    this.bossTrigger.setVisible(false); // Hide the trigger if you don't want it to be seen

    // Add overlap in setupColliders
    this.physics.add.overlap(
      this.player,
      this.bossTrigger,
      this.transitionToBossFight,
      null,
      this
    );
  }

  startFederatedLearningMinigame(terminal) {
    // Pause the current scene
    this.scene.pause();

    // Launch the minigame scene
    this.scene.launch('FederatedLearningMinigame', {
      returnScene: this,
      terminal: terminal,
    });
  }

  terminalCompleted(terminal) {
    terminal.minigameCompleted = true;
    // Provide visual feedback
    terminal.setTint(0x00ff00);
    this.checkAllTerminalsCompleted();
  }

  checkAllTerminalsCompleted() {
    const allCompleted = this.terminals.getChildren().every(
      (terminal) => terminal.minigameCompleted
    );
    if (allCompleted) {
      // Perform aggregation
      this.aggregateLocalUpdates();
    }
  }

  aggregateLocalUpdates() {
    let totalUpdate = 0;
    let terminalCount = 0;

    this.terminals.getChildren().forEach((terminal) => {
      if (terminal.localUpdate !== undefined) {
        totalUpdate += terminal.localUpdate;
        terminalCount++;
      }
    });

    const globalModelImprovement = totalUpdate / terminalCount;

    // Apply the global model improvement to the player
    this.player.upgradeWeapon(globalModelImprovement);

    // Notify the player
    this.showMessage(
      'Federated Learning Complete!\nGlobal Model Improved!',
      this.player.x,
      this.player.y - 50
    );

    // Show educational message
    this.showEducationalMessage();
  }

  showEducationalMessage() {
    const message = this.add
      .text(
        this.player.x,
        this.player.y - 100,
        'You participated in Federated Learning!\nLocal models were aggregated without sharing raw data.',
        {
          fontSize: '18px',
          fill: '#FFFFFF',
          backgroundColor: '#000000',
          padding: { x: 10, y: 10 },
          align: 'center',
          wordWrap: { width: 300 },
        }
      )
      .setOrigin(0.5);

    this.time.addEvent({
      delay: 5000,
      callback: () => {
        message.destroy();
      },
    });
  }

  homomorphicEncryptionBlast(x, y) {
    const radius = 200;
  
    // Iterate over active enemies and apply damage if within radius
    this.activeEnemies.children.iterate((enemy) => {
      if (!enemy || !enemy.active) {
        return; // Skip if enemy is undefined or inactive
      }
      const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
      if (distance <= radius) {
        enemy.takeDamage(3, {
          x: (enemy.x - x) * 2,
          y: -100,
        });
        if (enemy.health <= 0) {
          enemy.destroy();
        }
      }
    });
  
    // Visual effect for the blast
    const blast = this.add.circle(x, y, radius, 0x00ff00, 0.3);
    this.tweens.add({
      targets: blast,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        blast.destroy();
      },
    });
  }  

  showMessage(text, x, y) {
    const message = this.add.text(x, y, text, {
      fontSize: '24px',
      fill: '#FFD700',
      backgroundColor: '#000000',
      padding: { x: 10, y: 5 },
      align: 'center',
    });
    message.setOrigin(0.5);
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        message.destroy();
      },
    });
  }

  createHUD() {
    // Health Hearts
    this.healthHearts = [];
    for (let i = 0; i < this.player.health; i++) {
      const heart = this.add
        .image(30 + i * 30, 30, 'heart')
        .setScrollFactor(0);
      this.healthHearts.push(heart);
    }

    // PET HUD
    this.petHUD = [];
    const petKeys = ['DP', 'FL', 'HE', 'PE'];
    petKeys.forEach((key, index) => {
      const slot = this.add
        .image(16 + index * 50, 100, 'hud_petSlot')
        .setScrollFactor(0);

      const petIconKey = `petSkill_${this.getPetKeyName(key)}`;
      const petIcon = this.add
        .image(16 + index * 50, 100, petIconKey)
        .setScrollFactor(0);
      petIcon.setVisible(false);

      const keyText = this.add
        .text(16 + index * 50 - 10, 120, `${index + 1}`, {
          fontSize: '16px',
          fill: '#fff',
        })
        .setScrollFactor(0);

      this.petHUD.push({ slot, petIcon, keyText, key });
    });
  }

  getPetKeyName(key) {
    switch (key) {
      case 'DP':
        return 'differentialPrivacy';
      case 'FL':
        return 'federatedLearning';
      case 'HE':
        return 'homomorphicEncryption';
      case 'PE':
        return 'polymorphicEncryption';
      default:
        return '';
    }
  }

  updateHealthDisplay() {
    this.healthHearts.forEach((heart) => heart.destroy());
    this.healthHearts = [];

    for (let i = 0; i < this.player.health; i++) {
      const heart = this.add
        .image(30 + i * 30, 30, 'heart')
        .setScrollFactor(0);
      this.healthHearts.push(heart);
    }
  }

  updatePetHUD() {
    this.petHUD.forEach((pet) => {
      if (this.player.petSkills[pet.key]) {
        pet.petIcon.setVisible(true);

        if (this.player.activePetEffects[pet.key]) {
          pet.petIcon.setTint(0x00ff00);
        } else {
          pet.petIcon.clearTint();
        }
      }
    });
  }

  handleWeaponEnemyCollision(weapon, enemy) {
    if (
      !weapon.active ||
      !enemy.active ||
      !weapon.body ||
      !enemy.body
    ) {
      return;
    }

    if (this.player.isAttacking) {
      enemy.takeDamage(this.player.attackPower, {
        x: (enemy.x - this.player.x) * 2,
        y: -100,
      });

      if (enemy.health <= 0) {
        enemy.destroy();
      }
    }
  }

  handleProjectileEnemyCollision(projectile, enemy) {
    if (
      !projectile.active ||
      !enemy.active ||
      !projectile.body ||
      !enemy.body
    ) {
      return;
    }

    enemy.takeDamage(this.player.attackPower, {
      x: projectile.body.velocity.x > 0 ? 200 : -200,
      y: -50,
    });

    projectile.destroy();

    if (enemy.health <= 0) {
      enemy.destroy();
    }
  }

  handlePlayerEnemyCollision(player, enemy) {
    if (
      !player.active ||
      !enemy.active ||
      !player.body ||
      !enemy.body
    ) {
      return;
    }

    // Handle collision with fish enemy
    player.takeHit({ x: 0, y: -200 });
  }

  collectHealthPack(player, healthPack) {
    player.health += 1;
    healthPack.destroy();
    this.updateHealthDisplay();
  }

  handleTerminalOverlap(player, terminal) {
    // Show interaction hint
    this.showMessage('Press E to interact', terminal.x, terminal.y - 50);

    // Listen for 'E' key
    this.eKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.E
    );

    this.input.keyboard.on('keydown-E', () => {
      if (
        Phaser.Math.Distance.Between(
          player.x,
          player.y,
          terminal.x,
          terminal.y
        ) < 50
      ) {
        if (!terminal.minigameCompleted) {
          this.startFederatedLearningMinigame(terminal);
        }
      }
    });
  }

  // Add shutdown method to Level2Scene
  shutdown() {
    // Clean up physics world
    if (this.physics && this.physics.world) {
      this.physics.world.colliders.destroy();
      this.physics.world.bodies.clear();
      this.physics.world.staticBodies.clear();
    }

    // Clean up all game objects
    this.cleanupScene();
  }

  cleanupScene() {
    // Destroy physics groups with null checks
    [
      'activeEnemies',
      'platforms',
      'healthPacks',
      'terminals',
    ].forEach((group) => {
      if (this[group]) {
        this[group].clear(true, true); // Clear and destroy children
        this[group].destroy(true);
        this[group] = null;
      }
    });

    // Destroy player
    if (this.player) {
      this.player.destroy();
      this.player = null;
    }

    // Clear tweens and timers
    this.tweens.killAll();
    this.time.removeAllEvents();

    // Clear input
    this.input.keyboard.removeAllKeys();
  }

  transitionToBossFight(player, trigger) {
    // Stop all movement
    this.player.setVelocity(0);
    this.player.disableInput = true;

    // Fade out effect
    this.cameras.main.fadeOut(1000, 0, 0, 0);

    // After fade out, start the boss fight scene
    this.time.delayedCall(1000, () => {
      // Pass player data if needed
      this.scene.start('BossFightScene', {
        playerData: this.player.getData(),
      });
    });
  }

  update() {
    // Skip update if scene is transitioning or destroyed
    if (!this.scene.isActive('Level2Scene')) {
      return;
    }

    // Update the player and other game elements
    if (this.player && this.player.active) {
      this.player.update();
    }

    // Move clouds
    if (this.clouds) {
      this.clouds.children.iterate((cloud) => {
        cloud.x -= 0.2;
        if (cloud.x < -200) {
          cloud.x = 8200;
        }
      });
    }

    // Update sailboat's physics body to match the sprite
    if (this.sailboat && this.sailboat.body) {
      this.sailboat.body.updateFromGameObject();
    }

    // Spawn enemies when player is near
    if (this.enemyData && this.activeEnemies) {
      this.enemyData = this.enemyData.filter((data) => {
        if (Math.abs(this.player.x - data.x) < 500) {
          let enemy;
          if (data.type === 'fish') {
            enemy = new FishEnemy(this, data.x, data.y);
          }
          this.activeEnemies.add(enemy);
          return false; // Remove from enemyData
        }
        return true; // Keep in enemyData
      });
    }

    // Update active enemies
    if (this.activeEnemies && this.activeEnemies.children) {
      this.activeEnemies.children.iterate((enemy) => {
        if (enemy && enemy.active && enemy.update) {
          enemy.update();
          // Remove enemy if it's far behind the player
          if (enemy.x < this.player.x - 800) {
            enemy.destroy();
          }
        }
      });
    }

    // Update HUD
    this.updatePetHUD();

    // Check if player fell off the world
    if (this.player && this.player.y > 600) {
      if (this.cameras && this.cameras.main) {
        this.cameras.main.flash(500, 255, 16, 240);
        this.cameras.main.shake(500, 0.05);

        this.time.delayedCall(500, () => {
          this.cameras.main.fade(500, 0, 0, 0);
          this.time.delayedCall(500, () => {
            this.scene.restart();
          });
        });
      }
    }
  }
}
