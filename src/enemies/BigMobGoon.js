// src/enemies/BigMobGoon.js

export class BigMobGoon extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'bigMobGoon');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Enemy properties
    this.health = 5;
    this.speed = 40;
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
      if (this.canShoot && Phaser.Math.Between(0, 100) < 3) { // 3% chance each frame
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
      if (distance < 300) {
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
      projectile.setVelocityX(this.player.x < this.x ? -250 : 250); // Shoot towards player

      this.scene.enemyProjectiles.add(projectile);

      // Cooldown for shooting
      this.canShoot = false;
      this.scene.time.addEvent({
        delay: 1500, // 1.5 seconds cooldown
        callback: () => {
          this.canShoot = true;
        },
      });
    }
  }
}
