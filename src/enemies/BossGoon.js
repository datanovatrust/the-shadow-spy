// src/enemies/BossGoon.js

export class BossGoon extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, epsilon) {
    super(scene, x, y, 'bossGoon');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Enemy properties
    this.health = 10 + (epsilon / 10); // Health increases with epsilon
    this.speed = 30 + (epsilon / 20);
    this.player = scene.player;
    this.isAggressive = true;
    this.canShoot = true;

    // Scale size with epsilon
    const scale = 1 + (epsilon / 200);
    this.setScale(scale);

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

    // Chase the player
    const direction = this.player.x < this.x ? -1 : 1;
    this.setVelocityX(direction * this.speed);

    // Shooting logic
    if (this.canShoot && Phaser.Math.Between(0, 100) < 5) { // 5% chance each frame
      this.shootQuery(this.player);
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
      projectile.setScale(1.5); // Boss queries are larger
      projectile.setVelocityX(this.player.x < this.x ? -300 : 300); // Shoot towards player

      this.scene.enemyProjectiles.add(projectile);

      // Cooldown for shooting
      this.canShoot = false;
      this.scene.time.addEvent({
        delay: 1000, // 1 second cooldown
        callback: () => {
          this.canShoot = true;
        },
      });
    }
  }
}
