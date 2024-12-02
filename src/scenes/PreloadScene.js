// src/scenes/PreloadScene.js

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Load SVG assets as images
    this.load.image('player', 'src/assets/sprites/player.svg');
    this.load.image('attackAnimation', 'src/assets/sprites/attackAnimation.svg');
    this.load.image('projectile', 'src/assets/sprites/projectile.svg');
    this.load.image('heart', 'src/assets/sprites/heart.svg');

    // Enemies
    this.load.image('basicGoon', 'src/assets/sprites/basicGoon.svg');
    this.load.image('bigMobGoon', 'src/assets/sprites/bigMobGoon.svg');
    this.load.image('bossGoon', 'src/assets/sprites/bossGoon.svg');
    this.load.image('fish_enemy', 'src/assets/sprites/fish_enemy.svg');

    // Platforms and environment
    this.load.image('ground', 'src/assets/sprites/ground.svg');
    this.load.image('movingPlatform', 'src/assets/sprites/movingPlatform.svg');
    this.load.image('wooden_platform', 'src/assets/sprites/wooden_platform.svg');
    this.load.image('lily_pad', 'src/assets/sprites/lily_pad.svg');
    this.load.image('dock', 'src/assets/sprites/dock.svg');

    // Background layers
    this.load.image('background_sky', 'src/assets/sprites/background_sky.svg');
    this.load.image('background_river', 'src/assets/sprites/background_river.svg');
    this.load.image('background_mountains', 'src/assets/sprites/background_mountains.svg');
    this.load.image('background_hills', 'src/assets/sprites/background_hills.svg');
    this.load.image('background_trees', 'src/assets/sprites/background_trees.svg');
    this.load.image('background_clouds', 'src/assets/sprites/background_clouds.svg');
    this.load.image('background_buildings_far', 'src/assets/sprites/background_buildings_far.svg');
    this.load.image('background_platforms', 'src/assets/sprites/background_platforms.svg');
    this.load.image('background_foreground', 'src/assets/sprites/background_foreground.svg');
    this.load.image('animated_water', 'src/assets/sprites/animated_water.svg');

    // Decorative elements
    this.load.image('sun', 'src/assets/sprites/sun.svg');
    this.load.image('cloud', 'src/assets/sprites/cloud.svg');
    this.load.image('tree', 'src/assets/sprites/tree.svg');
    this.load.image('bird', 'src/assets/sprites/bird.svg');
    this.load.image('butterfly', 'src/assets/sprites/butterfly.svg');

    // Collectibles and items
    this.load.image('item_healthPack', 'src/assets/sprites/item_healthPack.svg');
    this.load.image('dataBreach', 'src/assets/sprites/dataBreach.svg');
    this.load.image('ad', 'src/assets/sprites/ad.svg');

    // PET Skills
    this.load.image('petSkill_differentialPrivacy', 'src/assets/sprites/petSkill_differentialPrivacy.svg');
    this.load.image('petSkill_federatedLearning', 'src/assets/sprites/petSkill_federatedLearning.svg');
    this.load.image('petSkill_homomorphicEncryption', 'src/assets/sprites/petSkill_homomorphicEncryption.svg');
    this.load.image('petSkill_polymorphicEncryption', 'src/assets/sprites/petSkill_polymorphicEncryption.svg');

    // HUD Elements
    this.load.image('hud_petSlot', 'src/assets/sprites/hud_petSlot.svg');
    this.load.image('hud_epsilonMeter', 'src/assets/sprites/hud_epsilonMeter.svg');

    // Weapon Power-ups
    this.load.image('weapon_powerup_1', 'src/assets/sprites/weapon_powerup_1.svg');
    this.load.image('weapon_powerup_2', 'src/assets/sprites/weapon_powerup_2.svg');
    this.load.image('weapon_powerup_3', 'src/assets/sprites/weapon_powerup_3.svg');

    // Level-specific assets
    this.load.image('sailboat', 'src/assets/sprites/sailboat.svg');
    this.load.image('terminal_sprite', 'src/assets/sprites/terminal_sprite.svg');

    // Load AI Helper and Projectile
    this.load.image('ai_helper', 'src/assets/sprites/ai_helper.svg');
    this.load.image('ai_projectile', 'src/assets/sprites/ai_projectile.svg');

    // Menu assets
    this.load.image('menu_background', 'src/assets/sprites/menu_background.svg');
    this.load.image('start_button', 'src/assets/sprites/start_button.svg');

    // Particle and other effects
    // this.load.image('particle', 'src/assets/sprites/particle.svg');
    this.load.image('platform_glow', 'src/assets/sprites/platform_glow.svg');
    this.load.image('neon_trail', 'src/assets/sprites/neon_trail.svg');
    this.load.image('city_light', 'src/assets/sprites/city_light.svg');

    // New assets for the boss fight
    this.load.image('noise_shield', 'src/assets/sprites/noise_shield.svg');
    this.load.image('gaussian_wave', 'src/assets/sprites/gaussian_wave.svg');

    this.load.svg('epsilon', 'src/assets/sprites/epsilon.svg');
    this.load.svg('delta', 'src/assets/sprites/delta.svg');
    this.load.svg('sigma', 'src/assets/sprites/sigma.svg');

    // Load new assets for Federated Learning Boss Fight
    this.load.image('fl_boss', 'src/assets/sprites/fl_boss.svg');
    this.load.image('fl_minion', 'src/assets/sprites/fl_minion.svg');

    // Load boss projectile
    this.load.image('boss_projectile', 'src/assets/sprites/boss_projectile.svg');

    // Generate a simple 'particle' texture if it doesn't exist
    if (!this.textures.exists('particle')) {
      const graphics = this.make.graphics({ x: 0, y: 0, add: false });
      graphics.fillStyle(0xffffff, 1);
      graphics.fillRect(0, 0, 4, 4);
      graphics.generateTexture('particle', 4, 4);
      graphics.destroy();
    }

    // New assets for Homomorphic Encryption Boss Fight
    this.load.image('he_boss_phase1', 'src/assets/sprites/he_boss_phase1.svg');
    this.load.image('he_boss_phase2', 'src/assets/sprites/he_boss_phase2.svg');
    this.load.image('he_boss_phase3', 'src/assets/sprites/he_boss_phase3.svg');
    this.load.image('he_minion', 'src/assets/sprites/he_minion.svg');
    this.load.image('decryption_key', 'src/assets/sprites/decryption_key.svg');
    this.load.image('encrypted_projectile', 'src/assets/sprites/encrypted_projectile.svg');
    this.load.image('he_boss_background', 'src/assets/sprites/he_boss_background.svg');
    this.load.image('he_platform', 'src/assets/sprites/he_platform.svg');

    // Load portal SVG
    this.load.svg('secret_portal', 'src/assets/sprites/secret_portal.svg', { width: 64, height: 64 });

    // Load laser charge frames
    for (let i = 1; i <= 4; i++) {
      this.load.image(
        `laser_charge_frame${i}`,
        `src/assets/sprites/laser_charge_frame${i}.svg`
      );
    }
  }

  create() {
    // Start the GameScene or Level2Scene as needed
    this.scene.start('GameScene'); // or 'Level2Scene' to test Level 2 directly
  }
}
