// src/collectibles/WeaponPowerUp.js

export class WeaponPowerUp extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, level) {
      const textureKey = `weapon_powerup_${level}`;
      super(scene, x, y, textureKey);
      scene.add.existing(this);
      scene.physics.add.existing(this);
  
      this.level = level;
      this.body.allowGravity = false;
      this.setImmovable(true);
    }
  }
  