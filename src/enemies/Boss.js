// src/enemies/Boss.js

export class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
      super(scene, x, y, 'bossGoon');
      scene.add.existing(this);
      scene.physics.add.existing(this);
  
      // Boss properties
      this.health = 500;
      this.maxHealth = 500;
      this.phase = 1;
      this.shieldStrength = 1; // Full strength initially
      this.active = true;
  
      // Boss AI properties
      this.speed = 50;
      this.jumpTimer = 0;
      this.jumpInterval = 2000; // Boss attempts to jump every 2 seconds
  
      // Boss attacks
      this.projectiles = scene.physics.add.group();
  
      // Set physics properties
      this.setCollideWorldBounds(true);
      this.setBounce(0.2);
  
      // Reference to the player
      this.player = scene.player;
  
      // Start boss attack patterns
      this.attackEvent = scene.time.addEvent({
        delay: 3000,
        loop: true,
        callback: this.attack,
        callbackScope: this,
      });
    }
  
    update(time, delta) {
      if (!this.active) {
        return;
      }
  
      // Boss moves towards the player
      const direction = this.player.x < this.x ? -1 : 1;
      this.setVelocityX(direction * this.speed);
  
      // Boss jumps occasionally
      this.jumpTimer += delta;
      if (this.jumpTimer >= this.jumpInterval) {
        if (this.body.blocked.down) {
          this.setVelocityY(-400); // Adjust jump force as needed
        }
        this.jumpTimer = 0;
      }
    }
  
    attack() {
      if (!this.active) {
        return;
      }
  
      if (this.phase === 1) {
        this.shootSymbolProjectile();
      } else if (this.phase === 2) {
        this.shootSpreadAttack();
      } else if (this.phase === 3) {
        this.shootHomingProjectile();
      }
    }
  
    shootSymbolProjectile() {
      // Boss attacks with symbols
      const attackSpeed = 200 + this.shieldStrength * 200;
      const symbols = ['epsilon', 'delta', 'sigma'];
      const symbolKey = Phaser.Utils.Array.GetRandom(symbols);
      const projectile = this.projectiles.create(this.x, this.y, symbolKey);
      this.scene.physics.moveToObject(projectile, this.player, attackSpeed);
      projectile.body.allowGravity = false;
  
      // Overlap with player
      this.scene.physics.add.overlap(
        this.player,
        projectile,
        this.scene.handleBossProjectileCollision,
        null,
        this.scene
      );
    }
  
    shootSpreadAttack() {
      // Boss shoots a spread of projectiles
      const attackSpeed = 200 + this.shieldStrength * 200;
      const angles = [-30, 0, 30];
      angles.forEach((angle) => {
        const projectile = this.projectiles.create(this.x, this.y, 'delta');
        this.scene.physics.velocityFromAngle(
          angle,
          attackSpeed,
          projectile.body.velocity
        );
        projectile.body.allowGravity = false;
  
        // Overlap with player
        this.scene.physics.add.overlap(
          this.player,
          projectile,
          this.scene.handleBossProjectileCollision,
          null,
          this.scene
        );
      });
    }
  
    shootHomingProjectile() {
      // Boss shoots a homing projectile
      const projectile = this.projectiles.create(this.x, this.y, 'sigma');
      projectile.body.allowGravity = false;
      projectile.isHoming = true;
  
      // Overlap with player
      this.scene.physics.add.overlap(
        this.player,
        projectile,
        this.scene.handleBossProjectileCollision,
        null,
        this.scene
      );
    }
  
    takeDamage(amount) {
      this.health -= amount;
  
      // Visual effect when boss takes damage
      this.setTint(0xff0000);
      this.scene.time.delayedCall(100, () => {
        this.clearTint();
      });
  
      if (this.health <= 0) {
        this.defeated();
      }
    }
  
    defeated() {
      // Stop boss attacks
      if (this.attackEvent) {
        this.attackEvent.remove(false);
      }
  
      // Destroy existing boss projectiles
      this.projectiles.clear(true, true);
  
      // Play defeat animation or effects
      this.setTint(0x808080);
      this.setVelocity(0, 0);
      this.body.enable = false;
      this.active = false;
  
      // Inform the scene
      this.scene.bossDefeated();
    }
  }
  