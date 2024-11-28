// src/enemies/BasicGoon.js

export class BasicGoon extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'basicGoon');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Enemy properties
    this.health = 2;
    this.speed = 50;
    this.player = scene.player;
    this.isAggressive = false;
    this.canShoot = true;

    // Set enemy physics properties
    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setGravityY(300);
    this.setVelocityX(-this.speed); // Move left by default
  }

  update() {
    // If player is invisible, do not detect
    if (this.player.activePetEffects.PE) {
      this.setVelocityX(0);
      return;
    }

    // Patrol or chase player
    if (this.isAggressive) {
      // Chase the player
      const direction = this.player.x < this.x ? -1 : 1;
      this.setVelocityX(direction * this.speed);

      // Shooting logic
      if (this.canShoot && Phaser.Math.Between(0, 100) < 2) { // 2% chance each frame
        this.shootQuery(this.player);
      }
    } else {
      // Basic patrol logic
      if (this.body.blocked.left || this.body.touching.left) {
        this.setVelocityX(this.speed); // Move right
      } else if (this.body.blocked.right || this.body.touching.right) {
        this.setVelocityX(-this.speed); // Move left
      }

      // Detect player
      const distance = Phaser.Math.Distance.Between(this.x, this.y, this.player.x, this.player.y);
      if (distance < 200) {
        this.isAggressive = true;
      }
    }
  }

  takeDamage(amount, knockback) {
    this.health -= amount;

    // Apply knockback to enemy
    this.setVelocityX(knockback.x);
    this.setVelocityY(knockback.y);

    // Flash red to indicate damage
    this.setTint(0xff0000);
    this.scene.time.delayedCall(100, () => {
      this.clearTint();
    });
  }

  shootQuery(target) {
    if (this.canShoot) {
      const projectile = this.scene.physics.add.sprite(this.x, this.y, 'queryProjectile');
      projectile.body.allowGravity = false;
      projectile.setVelocityX(this.player.x < this.x ? -200 : 200); // Shoot towards player

      this.scene.enemyProjectiles.add(projectile);

      // Cooldown for shooting
      this.canShoot = false;
      this.scene.time.addEvent({
        delay: 2000, // 2 seconds cooldown
        callback: () => {
          this.canShoot = true;
        },
      });
    }
  }
}
