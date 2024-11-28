export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Load SVG assets as images
    this.load.image('player', 'src/assets/sprites/player.svg');
    this.load.image('basicGoon', 'src/assets/sprites/basicGoon.svg');
    this.load.image('bigMobGoon', 'src/assets/sprites/bigMobGoon.svg');
    this.load.image('bossGoon', 'src/assets/sprites/bossGoon.svg');
    this.load.image('ground', 'src/assets/sprites/ground.svg');
    this.load.image('movingPlatform', 'src/assets/sprites/movingPlatform.svg');

    // Updated background layers
    this.load.image('background_sky', 'src/assets/sprites/background_sky.svg');
    this.load.image('background_buildings_far', 'src/assets/sprites/background_buildings_far.svg');
    this.load.image('background_platforms', 'src/assets/sprites/background_platforms.svg');
    this.load.image('background_foreground', 'src/assets/sprites/background_foreground.svg');

    // Original background assets (keeping for compatibility)
    this.load.image('background_mountains', 'src/assets/sprites/background_mountains.svg');
    this.load.image('background_hills', 'src/assets/sprites/background_hills.svg');
    this.load.image('background_trees', 'src/assets/sprites/background_trees.svg');
    this.load.image('background_clouds', 'src/assets/sprites/background_clouds.svg');

    this.load.image('finishFlag', 'src/assets/sprites/finishFlag.svg');
    this.load.image('dataBreach', 'src/assets/sprites/dataBreach.svg');
    this.load.image('item_healthPack', 'src/assets/sprites/item_healthPack.svg');
    this.load.image('attackAnimation', 'src/assets/sprites/attackAnimation.svg');
    this.load.image('queryProjectile', 'src/assets/sprites/queryProjectile.svg');
    
    // PET Skills
    this.load.image('petSkill_differentialPrivacy', 'src/assets/sprites/petSkill_differentialPrivacy.svg');
    this.load.image('petSkill_federatedLearning', 'src/assets/sprites/petSkill_federatedLearning.svg');
    this.load.image('petSkill_homomorphicEncryption', 'src/assets/sprites/petSkill_homomorphicEncryption.svg');
    this.load.image('petSkill_polymorphicEncryption', 'src/assets/sprites/petSkill_polymorphicEncryption.svg');
    
    // HUD Elements
    this.load.image('hud_petSlot', 'src/assets/sprites/hud_petSlot.svg');
    this.load.image('hud_epsilonMeter', 'src/assets/sprites/hud_epsilonMeter.svg');
    this.load.image('heart', 'src/assets/sprites/heart.svg');
    
    // Weapon Power-ups
    this.load.image('weapon_powerup_1', 'src/assets/sprites/weapon_powerup_1.svg');
    this.load.image('weapon_powerup_2', 'src/assets/sprites/weapon_powerup_2.svg');
    this.load.image('weapon_powerup_3', 'src/assets/sprites/weapon_powerup_3.svg');

    // Loading new cyberpunk-specific assets
    this.load.image('platform_glow', 'src/assets/sprites/platform_glow.svg');
    this.load.image('neon_trail', 'src/assets/sprites/neon_trail.svg');
    this.load.image('city_light', 'src/assets/sprites/city_light.svg');

    // In PreloadScene.js
    this.load.image('particle', 'src/assets/sprites/particle.svg');
    this.load.image('projectile', 'src/assets/sprites/projectile.svg');
  }

  create() {
    this.scene.start('GameScene');
  }
}