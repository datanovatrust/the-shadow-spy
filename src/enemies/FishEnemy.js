// src/enemies/FishEnemy.js

export class FishEnemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'fish_enemy');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Enemy properties
    this.health = 3;
    this.speed = 50;
    this.direction = 1;
    this.initialX = x;

    this.setScale(0.5);
    this.body.setSize(this.width, this.height);
    this.body.allowGravity = false;

    this.setFlipX(true); // Facing left initially
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    // Move the fish enemy horizontally
    this.x += this.speed * this.direction * (delta / 1000);

    // Change direction at bounds
    if (this.x > this.initialX + 100) {
      this.direction = -1;
      this.setFlipX(false);
    } else if (this.x < this.initialX - 100) {
      this.direction = 1;
      this.setFlipX(true);
    }

    // Synchronize physics body with sprite position
    this.body.updateFromGameObject();
  }

  takeDamage(amount, knockback) {
    this.health -= amount;
    this.setVelocityX(knockback.x);
    this.setVelocityY(knockback.y);

    if (this.health <= 0) {
      // Disable the physics body and hide the sprite
      this.disableBody(true, true);

      // Remove from activeEnemies group
      this.scene.activeEnemies.remove(this);

      // Schedule destruction in the next frame
      this.scene.time.addEvent({
        delay: 0,
        callback: () => {
          this.destroy();
        },
      });
    }
  }
}
