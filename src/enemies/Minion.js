// src/enemies/Minion.js

export class Minion extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'fl_minion') {
        super(scene, x, y, texture);

        // Add to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.health = 5;
        this.collectedData = 0; // Data collected from the player
        this.reported = false; // Whether the minion has reported back
        this.moveSpeed = 100;

        // Set properties
        this.setCollideWorldBounds(true);
        this.body.setSize(32, 32);
    }

    update() {
        if (!this.active) return;

        // Move towards the player
        this.scene.physics.moveToObject(this, this.scene.player, this.moveSpeed);

        // Flip based on movement direction
        this.setFlipX(this.body.velocity.x < 0);

        // Collect data over time
        this.collectedData += this.scene.game.loop.delta / 1000; // Increment data based on time alive

        // After some time, minion reports back to boss
        if (this.collectedData >= 5 && !this.reported) {
            this.reported = true;
            // Move back to boss
            this.scene.physics.moveToObject(this, this.scene.boss, this.moveSpeed);
            // Check if minion reached the boss
            if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.boss.x, this.scene.boss.y) < 10) {
                // Minion sends update to boss
                this.scene.destroyMinion(this, true);
            }
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        this.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            this.clearTint();
        });
    }
}
