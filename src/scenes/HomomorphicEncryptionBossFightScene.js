// src/scenes/HomomorphicEncryptionBossFightScene.js

import { Player } from '../characters/Player.js';
import { HomomorphicEncryptionBoss } from '../enemies/HomomorphicEncryptionBoss.js';

export class HomomorphicEncryptionBossFightScene extends Phaser.Scene {
    constructor() {
        super('HomomorphicEncryptionBossFightScene');
    }

    init(data) {
        console.log('Received playerData:', data.playerData);
        this.playerData = data.playerData || {};
    }

    create() {
        // Set world bounds
        this.physics.world.setBounds(0, 0, 800, 600);

        // Add background
        this.add.image(400, 300, 'he_boss_background');

        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'he_platform').refreshBody();

        // Create the player with existing data
        this.player = new Player(this, 100, 450);
        Object.assign(this.player, this.playerData);
        this.player.scene = this;

        // Create the Homomorphic Encryption boss
        this.createBoss();

        // Initialize AI helpers group
        this.aiHelpers = this.physics.add.group({
            collideWorldBounds: true,
        });

        // Collision between AI helpers and platforms
        this.physics.add.collider(this.aiHelpers, this.platforms);

        // Collision between AI helpers and boss
        this.physics.add.overlap(
            this.aiHelpers,
            this.boss,
            this.handleAIHelperBossCollision,
            null,
            this
        );

        // Collision between boss projectiles and AI helpers
        this.physics.add.overlap(
            this.aiHelpers,
            this.boss.projectiles,
            this.handleBossProjectileAIHelperCollision,
            null,
            this
        );

        // Initialize helper projectiles group
        this.helperProjectiles = this.physics.add.group();

        // Collision between helper projectiles and boss
        this.physics.add.overlap(
            this.helperProjectiles,
            this.boss,
            this.handleHelperProjectileBossCollision,
            null,
            this
        );

        // Collision between player and platforms
        this.physics.add.collider(this.player, this.platforms);

        // Collision between boss and platforms
        this.physics.add.collider(this.boss, this.platforms);

        // Colliders and overlaps
        this.physics.add.collider(
            this.player,
            this.boss,
            this.handlePlayerBossCollision,
            null,
            this
        );

        this.physics.add.overlap(
            this.player.weapon,
            this.boss,
            this.handleWeaponBossCollision,
            null,
            this
        );

        this.physics.add.overlap(
            this.player.projectiles,
            this.boss,
            this.handleProjectileBossCollision,
            null,
            this
        );

        // Collision with boss projectiles
        this.physics.add.overlap(
            this.player,
            this.boss.projectiles,
            this.handleBossProjectileCollision,
            null,
            this
        );

        // Collision between minions and platforms
        this.physics.add.collider(this.boss.minions, this.platforms);

        // Collision between player and minions
        this.physics.add.overlap(
            this.player,
            this.boss.minions,
            this.handlePlayerMinionCollision,
            null,
            this
        );

        // Collision between player's weapon and minions
        this.physics.add.overlap(
            this.player.weapon,
            this.boss.minions,
            this.handleWeaponMinionCollision,
            null,
            this
        );

        // Collision between player's projectiles and minions
        this.physics.add.overlap(
            this.player.projectiles,
            this.boss.minions,
            this.handleProjectileMinionCollision,
            null,
            this
        );

        // Decryption keys group
        this.decryptionKeys = this.physics.add.group();

        // Collision between decryption keys and player
        this.physics.add.overlap(
            this.player,
            this.decryptionKeys,
            this.handlePlayerKeyCollision,
            null,
            this
        );

        // Camera setup
        this.cameras.main.setBounds(0, 0, 800, 600);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);

        // Create HUD
        this.createHUD();

        // Input for menu
        this.input.keyboard.on('keydown-M', () => {
            this.scene.pause('HomomorphicEncryptionBossFightScene');
            if (this.scene.isActive('MenuScene')) {
                this.scene.bringToTop('MenuScene');
            } else {
                this.scene.launch('MenuScene');
            }
        });
    }

    createBoss() {
        this.boss = new HomomorphicEncryptionBoss(this, 600, 450);

        // Collision between boss and platforms
        this.physics.add.collider(this.boss, this.platforms);
    }

    spawnAIHelper(player) {
        const helper = this.physics.add.sprite(player.x, player.y, 'player');
        helper.setTint(0x32cd32); // Green tint to distinguish
        helper.body.allowGravity = true;

        // Add helper to the aiHelpers group
        this.aiHelpers.add(helper);

        // Helper properties
        helper.health = 5;
        helper.attackCooldown = 0;

        // Give the helper behavior to move towards the boss and attack
        helper.update = () => {
            if (this.boss && this.boss.active) {
                // Move towards the boss
                this.physics.moveToObject(helper, this.boss, 100);

                // Flip the helper sprite based on direction
                helper.flipX = helper.body.velocity.x < 0;

                // Attack the boss if attack cooldown is over
                const distanceToBoss = Phaser.Math.Distance.Between(helper.x, helper.y, this.boss.x, this.boss.y);
                if (distanceToBoss < 300 && helper.attackCooldown <= 0) {
                    // Shoot a projectile towards the boss
                    const projectile = this.helperProjectiles.create(helper.x, helper.y, 'projectile');
                    this.physics.moveToObject(projectile, this.boss, 300);
                    projectile.body.allowGravity = false;

                    // Set attack cooldown
                    helper.attackCooldown = 1000; // Cooldown in milliseconds
                }
            }

            // Reduce attack cooldown
            if (helper.attackCooldown > 0) {
                helper.attackCooldown -= this.game.loop.delta;
            }
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

    handleAIHelperBossCollision(helper, boss) {
        // Make the helper deal damage to the boss if close enough
        if (helper.attackCooldown <= 0) {
            boss.takeDamage(5); // Adjust damage as appropriate
            helper.attackCooldown = 1000; // Reset attack cooldown
        }
    }

    handleBossProjectileAIHelperCollision(helper, projectile) {
        projectile.destroy();
        helper.health -= 1;
        if (helper.health <= 0) {
            helper.destroy();
        }
    }

    handleHelperProjectileBossCollision(boss, projectile) {
        projectile.destroy();
        boss.takeDamage(5); // Adjust damage as needed
        this.updateBossHealthBar();

        if (boss.health <= 0) {
            this.bossDefeated();
        }
    }

    handlePlayerBossCollision(player, boss) {
        if (this.player.isInvincible) {
            return;
        }
        player.takeHit({ x: (player.x - boss.x) * 2, y: -200 });
        player.isInvincible = true;
        player.setTint(0xff0000);
        this.time.delayedCall(1000, () => {
            player.isInvincible = false;
            player.clearTint();
        });
        this.updateHealthDisplay();
    }

    handleWeaponBossCollision(weapon, boss) {
        if (this.player.isAttacking) {
            const damage = this.player.attackPower;
            boss.takeDamage(damage);
            this.updateBossHealthBar();

            if (boss.health <= 0) {
                this.bossDefeated();
            }
        }
    }

    handleProjectileBossCollision(boss, projectile) {
        const damage = this.player.attackPower;
        boss.takeDamage(damage);
        projectile.destroy();
        this.updateBossHealthBar();

        if (boss.health <= 0) {
            this.bossDefeated();
        }
    }

    handleBossProjectileCollision(player, projectile) {
        projectile.destroy();
        if (this.player.isInvincible) {
            return;
        }
        player.takeHit({ x: (player.x - projectile.x) * 2, y: -100 });
        player.isInvincible = true;
        player.setTint(0xff0000);
        this.time.delayedCall(1000, () => {
            player.isInvincible = false;
            player.clearTint();
        });
        this.updateHealthDisplay();
    }

    handlePlayerMinionCollision(player, minion) {
        if (player.isInvincible) return;
        player.takeHit({ x: (player.x - minion.x) * 2, y: -100 });
        minion.destroy();
        this.boss.displayBossMessage('Minion collected your data!');
        // Boss uses collected data to enhance itself
        this.boss.health += 20; // Boss regains health
        if (this.boss.health > this.boss.maxHealth) this.boss.health = this.boss.maxHealth;
        this.updateBossHealthBar();
    }

    handleWeaponMinionCollision(weapon, minion) {
        if (this.player.isAttacking) {
            minion.health -= this.player.attackPower;
            if (minion.health <= 0) {
                minion.destroy();
                // Drop a decryption key
                this.boss.spawnDecryptionKey(minion.x, minion.y);
            }
        }
    }

    handleProjectileMinionCollision(projectile, minion) {
        minion.health -= this.player.attackPower;
        projectile.destroy();
        if (minion.health <= 0) {
            minion.destroy();
            // Drop a decryption key
            this.boss.spawnDecryptionKey(minion.x, minion.y);
        }
    }

    handlePlayerKeyCollision(player, key) {
        key.destroy();
        this.boss.decryptionKeysCollected += 1;
        this.boss.displayBossMessage(
            `Decryption Key Collected (${this.boss.decryptionKeysCollected}/3)!`
        );

        // Check if enough keys have been collected to decrypt the boss
        if (this.boss.decryptionKeysCollected >= 3 && this.boss.isEncrypted) {
            this.boss.isEncrypted = false;
            this.boss.displayBossMessage('Boss Decrypted! Now you can deal full damage!');
        }
    }

    updateBossHealthBar() {
        const healthPercentage = Phaser.Math.Clamp(
            this.boss.health / this.boss.maxHealth,
            0,
            1
        );
        this.bossHealthBar.clear();
        this.bossHealthBar.fillStyle(0x000000);
        this.bossHealthBar.fillRect(250, 20, 300, 20);
        this.bossHealthBar.fillStyle(0xff0000);
        this.bossHealthBar.fillRect(250, 20, 300 * healthPercentage, 20);
    }

    createHUD() {
        // Boss Health Bar
        this.bossHealthBar = this.add.graphics();
        this.updateBossHealthBar();

        // Player HUD
        this.healthHearts = [];
        this.updateHealthDisplay();

        // PET HUD
        this.petHUD = [];
        const petKeys = ['DP', 'FL', 'HE', 'PE'];
        petKeys.forEach((key, index) => {
            const slot = this.add
                .image(16 + index * 50, 100, 'hud_petSlot')
                .setScrollFactor(0);

            const petIconKey = `petSkill_${this.getPetKeyName(key)}`;
            const petIcon = this.add
                .image(16 + index * 50, 100, petIconKey)
                .setScrollFactor(0);
            petIcon.setVisible(false);

            const keyText = this.add
                .text(16 + index * 50 - 10, 120, `${index + 1}`, {
                    fontSize: '16px',
                    fill: '#fff',
                })
                .setScrollFactor(0);

            this.petHUD.push({ slot, petIcon, keyText, key });
        });

        this.updatePetHUD();
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

    updatePetHUD() {
        this.petHUD.forEach((pet) => {
            if (this.player.petSkills[pet.key]) {
                pet.petIcon.setVisible(true);

                if (this.player.activePetEffects[pet.key]) {
                    pet.petIcon.setTint(0x00ff00);
                } else if (this.player.petCooldowns[pet.key] > 0) {
                    pet.petIcon.setTint(0xff0000); // Red tint for cooldown
                } else {
                    pet.petIcon.clearTint();
                }
            }
        });
    }

    updateHealthDisplay() {
        this.healthHearts.forEach((heart) => heart.destroy());
        this.healthHearts = [];

        for (let i = 0; i < this.player.health; i++) {
            const heart = this.add
                .image(30 + i * 30, 30, 'heart')
                .setScrollFactor(0);
            this.healthHearts.push(heart);
        }
    }

    homomorphicEncryptionBlast(x, y) {
        const radius = 200;

        // Damage the boss if within radius
        const boss = this.boss;
        if (boss && boss.active) {
            const distanceToBoss = Phaser.Math.Distance.Between(x, y, boss.x, boss.y);
            if (distanceToBoss <= radius) {
                const damage = 50; // High damage to represent homomorphic effect
                boss.takeDamage(damage);
                this.updateBossHealthBar();

                if (boss.health <= 0) {
                    this.bossDefeated();
                }
            }
        }

        // Damage minions within radius
        this.boss.minions.getChildren().forEach((minion) => {
            const distanceToMinion = Phaser.Math.Distance.Between(x, y, minion.x, minion.y);
            if (distanceToMinion <= radius) {
                minion.health -= 50;
                if (minion.health <= 0) {
                    minion.destroy();
                    // Drop a decryption key
                    this.boss.spawnDecryptionKey(minion.x, minion.y);
                }
            }
        });

        // Visual effect for the blast
        const blast = this.add.circle(x, y, radius, 0x00ff00, 0.3);
        this.tweens.add({
            targets: blast,
            alpha: 0,
            duration: 500,
            onComplete: () => {
                blast.destroy();
            },
        });
    }

    bossDefeated() {
        // Stop boss actions
        if (this.boss.attackEvent) {
            this.boss.attackEvent.remove(false);
        }

        // Play defeat animation or effects
        this.boss.setTint(0x808080);
        this.boss.setVelocity(0, 0);
        this.boss.body.enable = false;
        this.boss.active = false;

        // Destroy any remaining minions
        this.boss.minions.clear(true, true);

        // Destroy any remaining decryption keys
        this.decryptionKeys.clear(true, true);

        // Destroy AI helpers
        this.aiHelpers.clear(true, true);

        // Destroy helper projectiles
        this.helperProjectiles.clear(true, true);

        // Show victory text
        const victoryText = this.add.text(
            this.cameras.main.worldView.x + this.cameras.main.width / 2,
            this.cameras.main.worldView.y + this.cameras.main.height / 2,
            'You Defeated the Homomorphic Encryption Boss!',
            {
                fontSize: '32px',
                fill: '#00ff00',
            }
        );
        victoryText.setOrigin(0.5);

        // Transition to the next scene or end game
        this.time.delayedCall(3000, () => {
            // Proceed to the next boss or show credits
            this.scene.start('GameOverScene', {
                playerData: this.player.getData(),
            });
        });
    }

    gameOver() {
        // Stop all events and movements
        this.physics.pause();
        this.player.setTint(0xff0000);

        // Show Game Over text
        const gameOverText = this.add.text(
            this.cameras.main.worldView.x + this.cameras.main.width / 2,
            this.cameras.main.worldView.y + this.cameras.main.height / 2,
            'Game Over',
            {
                fontSize: '64px',
                fill: '#fff',
            }
        );
        gameOverText.setOrigin(0.5);

        // Restart the scene after a delay
        this.time.delayedCall(3000, () => {
            this.scene.restart({ playerData: this.player.getData() });
        });
    }

    update(time, delta) {
        // Update player
        if (this.player && this.player.active) {
            this.player.update();
        }

        // Update boss AI
        if (this.boss && this.boss.active) {
            this.boss.update(time, delta);
        }

        // Update AI helpers
        if (this.aiHelpers) {
            this.aiHelpers.getChildren().forEach((helper) => {
                if (helper.active) {
                    helper.update();
                }
            });
        }

        // Update helper projectiles
        if (this.helperProjectiles) {
            this.helperProjectiles.getChildren().forEach((projectile) => {
                if (
                    projectile.active &&
                    (projectile.x < 0 || projectile.x > 800 || projectile.y < 0 || projectile.y > 600)
                ) {
                    projectile.destroy();
                }
            });
        }

        // Update PET HUD
        this.updatePetHUD();
    }
}
