// src/scenes/GameScene.js

import { Player } from '../characters/Player.js';
import { BasicGoon } from '../enemies/BasicGoon.js';
import { BigMobGoon } from '../enemies/BigMobGoon.js';
import { BossGoon } from '../enemies/BossGoon.js';
import { WeaponPowerUp } from '../collectibles/WeaponPowerUp.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // Set world bounds to create a larger level
    this.physics.world.setBounds(0, 0, 8000, 600);

    // Create layered cyberpunk background
    this.backgroundSky = this.add.tileSprite(4000, 300, 8000, 600, 'background_sky')
      .setScrollFactor(0);

    this.backgroundBuildingsFar = this.add.tileSprite(4000, 300, 8000, 600, 'background_buildings_far')
      .setScrollFactor(0.1);

    this.backgroundPlatforms = this.add.tileSprite(4000, 300, 8000, 600, 'background_platforms')
      .setScrollFactor(0.3);

    this.backgroundForeground = this.add.tileSprite(4000, 300, 8000, 600, 'background_foreground')
      .setScrollFactor(0.5);

    // Add vertical light beam effects
    this.createLightBeams();

    // Create platforms
    this.platforms = this.physics.add.staticGroup();

    // Ground platforms across the level without individual tweens
    for (let i = 0; i < 40; i++) {
      this.platforms.create(i * 200 + 100, 584, 'ground')
        .setScale(2)
        .refreshBody();
    }

    // Additional platforms for jumping (Varied terrain)
    this.createLevelTerrain();

    // Moving platforms with simplified effects
    this.createMovingPlatforms();

    // Create the player
    this.player = new Player(this, 100, 450);
    this.player.scene = this;

    // Create emitter for platform effects
    this.platformParticleEmitter = this.add.particles('particle', {
      speed: { min: -50, max: 50 },
      angle: { min: 0, max: 360 },
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      lifespan: 200,
      gravityY: 0,
      tint: [0xFF10F0, 0x00FFFF],
      frequency: -1, // Emit manually
    });

    // Create emitter for projectile effects
    this.projectileParticleEmitter = this.add.particles('particle', {
      scale: { start: 0.2, end: 0 },
      blendMode: 'ADD',
      lifespan: 100,
      tint: 0xFF10F0,
      frequency: -1, // Emit manually
    });

    // Collide the player with the platforms
    this.physics.add.collider(this.player, this.platforms, (player, platform) => {
      // Emit particles when player lands on platform
      if (player.body.touching.down) {
        this.platformParticleEmitter.emitParticleAt(player.x, player.y + 16, 5);
      }
    });
    this.physics.add.collider(this.player, this.movingPlatforms);

    // Create enemies group
    this.createEnemies();

    // Camera follow with smooth transition
    this.cameras.main.setBounds(0, 0, 8000, 600);
    this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

    // Add cyberpunk post-processing effects
    this.cameras.main.setRoundPixels(true);

    // Create scanline effect (static)
    this.scanlines = this.add.tileSprite(400, 300, 800, 600, 'background_sky')
      .setScrollFactor(0)
      .setAlpha(0.1)
      .setBlendMode(Phaser.BlendModes.MULTIPLY);

    // Finish point without tweens
    this.finishPoint = this.physics.add.staticImage(7900, 550, 'finishFlag').setScale(0.5);

    const finishGlow = this.add.sprite(7900, 550, 'finishFlag')
      .setScale(0.6)
      .setAlpha(0.3)
      .setTint(0xFF10F0)
      .setBlendMode(Phaser.BlendModes.ADD);

    this.physics.add.overlap(this.player, this.finishPoint, this.reachFinish, null, this);

    // Create collectibles and power-ups
    this.createDataBreaches();
    this.createHealthPacks();
    this.createPetSkills();
    this.createWeaponPowerUps();

    // Create HUD
    this.createHUD();

    // Enemy projectiles group
    this.enemyProjectiles = this.physics.add.group();

    // Overlaps for projectiles
    this.physics.add.overlap(this.player, this.enemyProjectiles, this.handleProjectileCollision, null, this);
    this.physics.add.overlap(this.player.projectiles, this.enemies, this.handleProjectileEnemyCollision, null, this);

    // Boss spawn threshold
    this.nextBossEpsilonThreshold = 100;

    // Initialize activeEnemies
    this.activeEnemies = this.physics.add.group();

    // Set up colliders and overlaps with activeEnemies
    this.physics.add.collider(this.activeEnemies, this.platforms);
    this.physics.add.collider(this.activeEnemies, this.movingPlatforms);
    this.physics.add.overlap(this.player.weapon, this.activeEnemies, this.handleWeaponEnemyCollision, null, this);
    this.physics.add.overlap(this.player, this.activeEnemies, this.handlePlayerEnemyCollision, null, this);
    this.physics.add.overlap(this.player.projectiles, this.activeEnemies, this.handleProjectileEnemyCollision, null, this);

    // Initialize city lights array and create the lights
    this.cityLights = [];
    this.createCityLights();

    // Initialize frame counter for performance optimization
    this.frameCounter = 0;
  }
  
  createCityLights() {
    const lightCount = 20;
    for (let i = 0; i < lightCount; i++) {
      const x = Phaser.Math.Between(0, 8000);
      const y = Phaser.Math.Between(100, 400);
      const light = this.add.circle(x, y, 3, 0xFF10F0, 1)
        .setScrollFactor(0.2);

      // Removed pulsing animation to reduce CPU load
      this.cityLights.push(light);
    }
  }

  createLevelTerrain() {
    // Create base terrain (replaces the simple ground platforms)
    this.createBaseGround();
  
    // Create varied terrain sections
    // Section 1: Starting Area - Tutorial-style platforms with neon walkways
    const startingArea = [
      { x: 300, y: 500, scale: 1.2, type: 'platform' },
      { x: 450, y: 450, scale: 0.7, type: 'floating' },
      { x: 600, y: 400, scale: 0.7, type: 'floating' },
      { x: 750, y: 400, scale: 1, type: 'platform' }
    ];
  
    // Section 2: Vertical Challenge with alternating platform types
    const verticalChallenge = [
      { x: 1000, y: 500, scale: 1, type: 'platform' },
      { x: 1100, y: 400, scale: 0.5, type: 'floating' },
      { x: 1100, y: 300, scale: 0.5, type: 'floating' },
      { x: 1100, y: 200, scale: 0.5, type: 'floating' },
      { x: 1200, y: 150, scale: 1, type: 'platform' }
    ];
  
    // Section 3: Cyber Highway - Elevated neon walkways
    const cyberHighway = [
      { x: 1500, y: 300, scale: 2, type: 'highway' },
      { x: 1900, y: 300, scale: 2, type: 'highway' },
      { x: 2300, y: 300, scale: 2, type: 'highway' }
    ];
  
    // Section 4: Data Center - Dense grid-like platform arrangement
    const dataCenter = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 3; j++) {
        dataCenter.push({
          x: 2800 + i * 150,
          y: 200 + j * 150,
          scale: 0.7,
          type: j % 2 === 0 ? 'platform' : 'floating'
        });
      }
    }
  
    // Section 5: Quantum Maze - Sinusoidal pattern with varied heights
    const quantumMaze = [];
    let currentX = 3800;
    for (let i = 0; i < 8; i++) {
      quantumMaze.push({
        x: currentX,
        y: 300 + Math.sin(i * 0.8) * 150,
        scale: 0.8,
        type: i % 2 === 0 ? 'floating' : 'platform'
      });
      currentX += Phaser.Math.Between(150, 250);
    }
  
    // Section 6: Security Zone - Tight platforming with laser gaps
    const securityZone = [
      { x: 5000, y: 500, scale: 0.5, type: 'laser' },
      { x: 5150, y: 400, scale: 0.5, type: 'platform' },
      { x: 5300, y: 300, scale: 0.5, type: 'laser' },
      { x: 5450, y: 200, scale: 0.5, type: 'platform' },
      { x: 5600, y: 200, scale: 1.5, type: 'highway' }
    ];
  
    // Section 7: Encryption Valley - Cascading platforms with data streams
    const encryptionValley = [];
    currentX = 6000;
    for (let i = 0; i < 6; i++) {
      encryptionValley.push({
        x: currentX,
        y: 200 + i * 50,
        scale: 1,
        type: 'data'
      });
      currentX += 200;
    }
  
    // Section 8: Final Approach - Dynamic final stretch
    const finalApproach = [
      { x: 7000, y: 400, scale: 0.7, type: 'floating' },
      { x: 7200, y: 350, scale: 0.5, type: 'laser' },
      { x: 7400, y: 300, scale: 0.5, type: 'platform' },
      { x: 7600, y: 250, scale: 0.5, type: 'floating' },
      { x: 7800, y: 200, scale: 1.5, type: 'highway' }
    ];
  
    // Combine all sections
    const allPlatforms = [
      ...startingArea,
      ...verticalChallenge,
      ...cyberHighway,
      ...dataCenter,
      ...quantumMaze,
      ...securityZone,
      ...encryptionValley,
      ...finalApproach
    ];
  
    // Create platforms with pre-rendered visuals
    allPlatforms.forEach((platform) => {
      this.createPlatformByType(platform);
    });
  }

  addPlatformEffects(platform, config) {
    if (config.type === 'laser') {
      // Add laser beam effect
      const beam = this.add.rectangle(platform.x, platform.y - 40, 2, 80, 0xFF0000, 0.8);
      this.tweens.add({
        targets: beam,
        alpha: 0.2,
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    }
  
    if (config.type === 'data') {
      // Add scrolling data effect
      const dataStream = this.add.particles('particle', {
        x: platform.x,
        y: platform.y,
        frequency: 500,
        scale: { start: 0.2, end: 0 },
        alpha: { start: 0.5, end: 0 },
        tint: 0x00FF00,
        blendMode: 'ADD',
        lifespan: 1000,
        speedY: { min: -50, max: -100 },
      });
    }
  }
  
  addPlatformGlow(platform, config) {
    const glowColor = {
      'highway': 0x00FFFF,
      'floating': 0xFF10F0,
      'laser': 0xFF0000,
      'data': 0x00FF00,
      'platform': 0xFF10F0
    }[config.type];
  
    const glow = this.add.sprite(platform.x, platform.y + 2, 'platform_glow')
      .setScale(config.scale * 1.2)
      .setAlpha(0.3)
      .setTint(glowColor)
      .setBlendMode(Phaser.BlendModes.ADD);
      
    this.tweens.add({
      targets: glow,
      alpha: 0.1,
      duration: 1500 + Math.random() * 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  // Helper methods for platform creation
  createPlatformByType(platform) {
    const base = this.platforms.create(platform.x, platform.y, 'ground')
      .setScale(platform.scale)
      .refreshBody();
    return base;
  }

  getPlatformSpriteKey(type) {
    // Use 'ground' for all platform types
    return 'ground';
  }

  createBaseGround() {
    const groundSegments = [];
    let currentX = 0;

    while (currentX < 8000) {
      const segmentType = Phaser.Math.Between(0, 3);
      let segment;

      switch (segmentType) {
        case 0: // Raised section
          segment = {
            x: currentX,
            y: 584,
            width: Phaser.Math.Between(300, 500),
            height: 32,
            type: 'raised'
          };
          break;
        case 1: // Lowered section
          segment = {
            x: currentX,
            y: 594,
            width: Phaser.Math.Between(200, 400),
            height: 24,
            type: 'lowered'
          };
          break;
        case 2: // Split-level section
          segment = {
            x: currentX,
            y: 589,
            width: Phaser.Math.Between(250, 450),
            height: 28,
            type: 'split'
          };
          break;
        case 3: // Cyber-grid section
          segment = {
            x: currentX,
            y: 584,
            width: Phaser.Math.Between(350, 550),
            height: 32,
            type: 'cyber'
          };
          break;
      }

      groundSegments.push(segment);
      currentX += segment.width;
    }

    // Create the ground segments using pre-made sprites
    groundSegments.forEach(segment => {
      const spriteKey = this.getGroundSpriteKey(segment.type);
      this.platforms.create(segment.x + segment.width / 2, segment.y, spriteKey)
        .setScale(segment.width / 64, segment.height / 16)
        .refreshBody();
    });
  }

  getGroundSpriteKey(type) {
    // Use 'ground' for all ground types
    return 'ground';
  }

  addCyberGridEffect(ground) {
    // Add a cyber grid pattern overlay
    for (let i = 0; i < ground.width; i += 20) {
      const line = this.add.rectangle(ground.x - ground.width/2 + i, 
        ground.y, 1, ground.height, 0x00FFFF, 0.3)
        .setBlendMode(Phaser.BlendModes.ADD);
    }
  }

  addSplitLevelEffect(ground) {
    // Create a split in the middle with a neon glow
    const split = this.add.rectangle(ground.x, ground.y, 
      ground.width, 4, 0xFF10F0, 0.8)
      .setBlendMode(Phaser.BlendModes.ADD);
      
    this.tweens.add({
      targets: split,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });
  }

  addNeonTrim(ground, color) {
    const trim = this.add.rectangle(ground.x, ground.y - ground.height/2, 
      ground.width, 2, color, 1)
      .setBlendMode(Phaser.BlendModes.ADD);
      
    this.tweens.add({
      targets: trim,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  // Add new method for creating dynamic light beams
  createLightBeams() {
    const beamCount = 10;
    this.lightBeams = [];

    for (let i = 0; i < beamCount; i++) {
      const x = Phaser.Math.Between(0, 8000);
      const beam = this.add.rectangle(x, 300, 10, 600, 0xFF10F0, 0.1)
        .setScrollFactor(0.2);
      this.lightBeams.push(beam);

      // Removed pulsing animation to reduce CPU load
    }
  }

  createMovingPlatforms() {
    this.movingPlatforms = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // Create moving platforms with tween animations
    const movingPlatform1 = this.movingPlatforms.create(1500, 400, 'movingPlatform');
    this.tweens.add({
      targets: movingPlatform1,
      x: 1800,
      ease: 'Linear',
      duration: 3000,
      yoyo: true,
      repeat: -1,
    });

    const movingPlatform2 = this.movingPlatforms.create(3500, 300, 'movingPlatform');
    this.tweens.add({
      targets: movingPlatform2,
      y: 200,
      ease: 'Linear',
      duration: 2000,
      yoyo: true,
      repeat: -1,
    });

    // Removed particle trails to optimize performance
  }
  
  createEnemies() {
    // Initialize enemy data for dynamic spawning
    this.enemyData = [
      // Basic Goons
      { x: 600, y: 450, type: 'basic' },
      { x: 1200, y: 450, type: 'basic' },
      { x: 1800, y: 450, type: 'basic' },
      { x: 2400, y: 450, type: 'basic' },
      { x: 2800, y: 450, type: 'basic' },
      { x: 3400, y: 450, type: 'basic' },
      { x: 4000, y: 450, type: 'basic' },
      { x: 4600, y: 450, type: 'basic' },
      { x: 5200, y: 450, type: 'basic' },
      { x: 5800, y: 450, type: 'basic' },
      { x: 6400, y: 450, type: 'basic' },
      { x: 7000, y: 450, type: 'basic' },
      // Big Mob Goons
      { x: 1600, y: 450, type: 'bigMob' },
      { x: 3200, y: 450, type: 'bigMob' },
      { x: 4800, y: 450, type: 'bigMob' },
      { x: 6400, y: 450, type: 'bigMob' },
    ];

    // Initialize active enemies group
    this.activeEnemies = this.physics.add.group();
  }

  createDataBreaches() {
    this.dataBreaches = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    const dataBreachPositions = [
      { x: 1500, y: 500 },
      { x: 2300, y: 350 },
      // ... other positions ...
    ];

    dataBreachPositions.forEach((pos) => {
      this.dataBreaches.create(pos.x, pos.y, 'dataBreach');
    });

    // Overlap with player
    this.physics.add.overlap(this.player, this.dataBreaches, this.handleDataBreachCollision, null, this);
  }

  createHealthPacks() {
    this.healthPacks = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    const healthPackPositions = [
      { x: 1000, y: 500 },
      { x: 2000, y: 300 },
      { x: 3500, y: 400 },
      { x: 4700, y: 350 },
      { x: 6000, y: 250 },
    ];

    healthPackPositions.forEach((pos) => {
      this.healthPacks.create(pos.x, pos.y, 'item_healthPack');
    });

    // Overlap with player
    this.physics.add.overlap(this.player, this.healthPacks, this.collectHealthPack, null, this);
  }

  createPetSkills() {
    this.petSkills = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // Place PET skills in the level
    this.petSkills.create(2500, 350, 'petSkill_differentialPrivacy');
    this.petSkills.create(3000, 250, 'petSkill_federatedLearning');
    this.petSkills.create(5500, 150, 'petSkill_homomorphicEncryption');
    this.petSkills.create(7000, 450, 'petSkill_polymorphicEncryption');

    // Overlap with player
    this.physics.add.overlap(this.player, this.petSkills, this.collectPetSkill, null, this);
  }

  handleWeaponEnemyCollision(weapon, enemy) {
    if (this.player.isAttacking) {
      enemy.takeDamage(this.player.attackPower, {
        x: (enemy.x - this.player.x) * 2,
        y: -100,
      });
      
      if (enemy.health <= 0) {
        enemy.destroy();
        this.activeEnemies.remove(enemy, true, true); // Remove enemy from group
      }
    }
  }   

  handlePlayerEnemyCollision(player, enemy) {
    if (player.activePetEffects.PE) {
      return;
    }
  
    let epsilonIncrease = player.activePetEffects.DP ? 5 : 10;
    player.epsilon += epsilonIncrease;
  
    this.updateEpsilonDisplay();
  
    const baseKnockback = 100;
    const epsilonKnockback = player.epsilon * 5;
    const totalKnockback = baseKnockback + epsilonKnockback;
    const direction = player.x < enemy.x ? -1 : 1;
    const knockback = {
      x: -direction * totalKnockback,
      y: -200,
    };
  
    player.takeHit(knockback);
  
    if (player.epsilon >= this.nextBossEpsilonThreshold) {
      this.spawnBossGoon();
      this.nextBossEpsilonThreshold += 100;
    }

    if (enemy.health <= 0) {
      enemy.destroy();
      this.activeEnemies.remove(enemy, true, true); // Remove enemy from group
    }
  }

  handleDataBreachCollision(player, dataBreach) {
    player.epsilon += 20;
    dataBreach.destroy();
    this.updateEpsilonDisplay();
  }

  collectHealthPack(player, healthPack) {
    player.health += 1;
    healthPack.destroy();
    this.updateHealthDisplay();
  }

  collectPetSkill(player, petSkill) {
    let skill;
    switch (petSkill.texture.key) {
      case 'petSkill_differentialPrivacy':
        skill = 'DP';
        break;
      case 'petSkill_federatedLearning':
        skill = 'FL';
        break;
      case 'petSkill_homomorphicEncryption':
        skill = 'HE';
        break;
      case 'petSkill_polymorphicEncryption':
        skill = 'PE';
        break;
    }
    player.addPetSkill(skill);
    petSkill.destroy();

    const petNames = {
      DP: 'Differential Privacy',
      FL: 'Federated Learning',
      HE: 'Homomorphic Encryption',
      PE: 'Polymorphic Encryption',
    };
    this.add.text(player.x - 100, player.y - 50, `Acquired PET: ${petNames[skill]}`, { fontSize: '16px', fill: '#00CED1' });
  }

  spawnAIHelper(player) {
    const helper = this.physics.add.sprite(player.x, player.y, 'player');
    helper.setTint(0x32cd32); // Green tint to distinguish
    helper.body.allowGravity = false;
  
    this.physics.add.overlap(helper, this.activeEnemies, (helper, enemy) => {
      enemy.takeDamage(1, { x: 0, y: 0 });
      if (enemy.health <= 0) {
        enemy.destroy();
      }
    });
  
    // Move helper with player
    helper.update = () => {
      helper.x = player.x + 50;
      helper.y = player.y;
    };
  
    // Remove helper after some time
    this.time.addEvent({
      delay: 10000, // Helper lasts 10 seconds
      callback: () => {
        helper.destroy();
        player.activePetEffects.FL = false;
      },
    });
  }
  

  handleProjectileCollision(player, projectile) {
    let epsilonIncrease = player.activePetEffects.DP ? 2 : 5;
    player.epsilon += epsilonIncrease;
    this.updateEpsilonDisplay();

    const baseKnockback = 50;
    const epsilonKnockback = player.epsilon * 2;
    const totalKnockback = baseKnockback + epsilonKnockback;
    const direction = player.x < projectile.x ? -1 : 1;
    const knockback = {
      x: -direction * totalKnockback,
      y: -100,
    };

    player.takeHit(knockback);
    projectile.destroy();

    if (player.epsilon >= this.nextBossEpsilonThreshold) {
      this.spawnBossGoon();
      this.nextBossEpsilonThreshold += 100;
    }
  }

  createWeaponPowerUps() {
    this.weaponPowerUps = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    const powerUpPositions = [
      { x: 2000, y: 350, level: 2 },
      { x: 5000, y: 300, level: 3 },
    ];

    powerUpPositions.forEach((pos) => {
      const powerUp = new WeaponPowerUp(this, pos.x, pos.y, pos.level);
      this.weaponPowerUps.add(powerUp);
    });

    // Overlap with player
    this.physics.add.overlap(this.player, this.weaponPowerUps, this.collectWeaponPowerUp, null, this);
  }

  collectWeaponPowerUp(player, powerUp) {
    if (player.weaponLevel < powerUp.level) {
      player.weaponLevel = powerUp.level;
      player.attackPower = powerUp.level;
      this.showMessage(`Weapon upgraded to Level ${powerUp.level}!`, player.x, player.y - 50);
    }
    powerUp.destroy();
  }

  showMessage(text, x, y) {
    const message = this.add.text(x, y, text, {
      fontSize: '16px',
      fill: '#FFD700',
    });
    message.setOrigin(0.5);
    this.time.addEvent({
      delay: 2000,
      callback: () => {
        message.destroy();
      },
    });
  }

  handleProjectileEnemyCollision(projectile, enemy) {
    enemy.takeDamage(this.player.attackPower, {
      x: projectile.body.velocity.x > 0 ? 200 : -200,
      y: -50,
    });
    
    if (enemy.health <= 0) {
      enemy.destroy();
      this.activeEnemies.remove(enemy, true, true); // Remove enemy from group
    }
    projectile.destroy();
  }  

  homomorphicEncryptionBlast(x, y) {
    const radius = 200;
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
          this.activeEnemies.remove(enemy, true, true); // Remove enemy from group
        }
      }
    });
    
    // Simplified visual effect for performance
  }
  
  spawnBossGoon() {
    const boss = new BossGoon(this, this.player.x + 500, 450, this.player.epsilon);
    this.activeEnemies.add(boss);
    this.physics.add.collider(boss, this.platforms);
    this.physics.add.collider(boss, this.movingPlatforms);
  }
  

  reachFinish(player, finishPoint) {
    this.add.text(player.x - 100, 200, 'Level Completed!', { fontSize: '48px', fill: '#fff' });
    this.physics.pause();
    player.setTint(0x00ff00);

    // Additional level completion logic
  }

  createHUD() {
    // Health Hearts
    this.healthHearts = [];
    for (let i = 0; i < this.player.health; i++) {
      const heart = this.add.image(30 + i * 30, 30, 'heart').setScrollFactor(0);
      this.healthHearts.push(heart);
    }

    // Epsilon Meter
    this.epsilonMeter = this.add.image(100, 70, 'hud_epsilonMeter').setScrollFactor(0);
    this.epsilonBar = this.add.rectangle(2, 2, 196, 16, 0x00CED1);
    this.epsilonBar.setOrigin(0, 0);
    this.epsilonBar.setScrollFactor(0);
    this.epsilonMeter.mask = new Phaser.Display.Masks.GeometryMask(this, this.epsilonBar);

    // PET HUD
    this.petHUD = [];
    const petKeys = ['DP', 'FL', 'HE', 'PE'];
    petKeys.forEach((key, index) => {
      const slot = this.add.image(16 + index * 50, 100, 'hud_petSlot').setScrollFactor(0);

      const petIconKey = `petSkill_${this.getPetKeyName(key)}`;
      const petIcon = this.add.image(16 + index * 50, 100, petIconKey).setScrollFactor(0);
      petIcon.setVisible(false);

      const keyText = this.add.text(16 + index * 50 - 10, 120, `${index + 1}`, {
        fontSize: '16px',
        fill: '#fff',
      }).setScrollFactor(0);

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
      const heart = this.add.image(30 + i * 30, 30, 'heart').setScrollFactor(0);
      this.healthHearts.push(heart);
    }
  }

  updateEpsilonDisplay() {
    const maxEpsilon = 1000;
    const epsilonPercentage = Phaser.Math.Clamp(this.player.epsilon / maxEpsilon, 0, 1);
    this.epsilonBar.width = 196 * epsilonPercentage;
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

  update() {
    this.frameCounter++;

    // Update player
    this.player.update();

    // Spawn enemies when player is near
    this.enemyData = this.enemyData.filter((data) => {
      if (Math.abs(this.player.x - data.x) < 500) {
        let enemy;
        if (data.type === 'basic') {
          enemy = new BasicGoon(this, data.x, data.y);
        } else if (data.type === 'bigMob') {
          enemy = new BigMobGoon(this, data.x, data.y);
        }
        this.activeEnemies.add(enemy);
        this.physics.add.collider(enemy, this.platforms);
        this.physics.add.collider(enemy, this.movingPlatforms);
        return false; // Remove from enemyData
      }
      return true; // Keep in enemyData
    });

    // Update active enemies
    this.activeEnemies.children.iterate((enemy) => {
      if (enemy && enemy.update) {
        enemy.update();
        // Remove enemy if it's far behind the player
        if (enemy.x < this.player.x - 800) {
          enemy.destroy();
          this.activeEnemies.remove(enemy, true, true); // Remove enemy from group
        }
      }
    });    

    // Throttle background updates
    if (this.frameCounter % 5 === 0) {
      const camX = this.cameras.main.scrollX;
      this.backgroundSky.tilePositionX = camX * 0.05;
      this.backgroundBuildingsFar.tilePositionX = camX * 0.1;
      this.backgroundPlatforms.tilePositionX = camX * 0.3;
      this.backgroundForeground.tilePositionX = camX * 0.5;

      // Update light beams and city lights
      this.lightBeams.forEach(beam => {
        beam.x -= 0.5;
        if (beam.x < -10) {
          beam.x = 8010;
        }
      });

      this.cityLights.forEach(light => {
        light.x -= 0.2;
        if (light.x < -10) {
          light.x = 8010;
        }
      });
    }

    // Update platform particle effects
    if (this.player.body.velocity.y > 0 && this.frameCounter % 5 === 0) {
      this.platformParticleEmitter.emitParticleAt(this.player.x, this.player.y + 20, 1);
    }

    // Update projectile particle effects
    this.player.projectiles.getChildren().forEach(projectile => {
      if (this.frameCounter % 5 === 0) {
        this.projectileParticleEmitter.emitParticleAt(projectile.x, projectile.y, 1);
      }
    });

    // Check if player fell off the world
    if (this.player.y > 600) {
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