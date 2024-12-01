// src/scenes/FederatedLearningBossFightScene.js

import { Player } from '../characters/Player.js';
import { FederatedLearningBoss } from '../enemies/FederatedLearningBoss.js';

export class FederatedLearningBossFightScene extends Phaser.Scene {
    constructor() {
        super('FederatedLearningBossFightScene');
    }

    init(data) {
        console.log('Received playerData:', data.playerData);
        this.playerData = data.playerData || {};
    }

    create() {
        // Set world bounds
        this.physics.world.setBounds(0, 0, 800, 600);

        // Add background
        this.background = this.add.image(400, 300, 'background_sky');

        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms
            .create(400, 568, 'ground')
            .setScale(2)
            .refreshBody();

        // Create the player with existing data
        this.player = new Player(this, 100, 450);
        Object.assign(this.player, this.playerData); // Apply the saved data to the player
        this.player.scene = this;

        // Create the federated learning boss
        this.createBoss();

        // Initialize minions group
        this.minions = this.physics.add.group();

        // Collision between minions and platforms
        this.physics.add.collider(this.minions, this.platforms);

        // Collision between player and platforms
        this.physics.add.collider(this.player, this.platforms);

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

        // Overlaps with minions
        this.physics.add.overlap(
            this.player,
            this.minions,
            this.handlePlayerMinionCollision,
            null,
            this
        );

        this.physics.add.overlap(
            this.player.weapon,
            this.minions,
            this.handleWeaponMinionCollision,
            null,
            this
        );

        this.physics.add.overlap(
            this.player.projectiles,
            this.minions,
            this.handleProjectileMinionCollision,
            null,
            this
        );

        // Handle boss projectiles collision with player
        this.physics.add.overlap(
            this.player.projectiles,
            this.boss,
            this.handleProjectileBossCollision,
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
            this.scene.pause('FederatedLearningBossFightScene');
            if (this.scene.isActive('MenuScene')) {
                this.scene.bringToTop('MenuScene');
            } else {
                this.scene.launch('MenuScene');
            }
        });

        // Define laser charge animation using individual frames
        this.anims.create({
            key: 'laser_charge_anim',
            frames: [
                { key: 'laser_charge_frame1' },
                { key: 'laser_charge_frame2' },
                { key: 'laser_charge_frame3' },
                { key: 'laser_charge_frame4' },
            ],
            frameRate: 4,
            repeat: -1,
        });
    }

    createBoss() {
        // Create the boss using the enhanced FederatedLearningBoss class
        this.boss = new FederatedLearningBoss(this, 600, 450);

        // Collision between boss and platforms
        this.physics.add.collider(this.boss, this.platforms);

        // Initialize boss phases
        this.bossPhases = [
            {
                phase: 1,
                healthThreshold: 0.75,
                behaviors: ['summonMinions'],
                message: 'Phase 1: The boss is gathering data!',
            },
            {
                phase: 2,
                healthThreshold: 0.5,
                behaviors: ['summonMinions', 'shootProjectiles'],
                message: 'Phase 2: The boss is adapting!',
            },
            {
                phase: 3,
                healthThreshold: 0.25,
                behaviors: ['summonMinions', 'shootProjectiles', 'laserBeam'],
                message: 'Phase 3: The boss is fully learned!',
            },
        ];

        this.currentBossPhaseIndex = 0;
        this.updateBossPhase();
    }

    updateBossPhase() {
        if (this.currentBossPhaseIndex >= this.bossPhases.length) {
            // No more phases to update
            return;
        }
    
        const healthPercentage = this.boss.health / this.boss.maxHealth;
        const nextPhase = this.bossPhases[this.currentBossPhaseIndex];
    
        if (nextPhase && healthPercentage <= nextPhase.healthThreshold) {
            // Display phase change message
            const phaseText = this.add
                .text(
                    this.cameras.main.centerX,
                    100,
                    nextPhase.message,
                    {
                        fontSize: '24px',
                        fill: '#ffffff',
                        backgroundColor: '#000000',
                        padding: { x: 10, y: 5 },
                    }
                )
                .setOrigin(0.5)
                .setScrollFactor(0);
    
            this.time.delayedCall(2000, () => {
                phaseText.destroy();
            });
    
            // Update boss behaviors based on the current phase
            this.boss.setBehaviors(nextPhase.behaviors);
    
            // Move to the next phase
            this.currentBossPhaseIndex++;
    
            // Ensure we don't exceed the array bounds
            if (this.currentBossPhaseIndex >= this.bossPhases.length) {
                // All phases completed
                return;
            }
    
            // Schedule the next phase check when boss health decreases further
            this.time.delayedCall(1000, () => {
                this.updateBossPhase();
            });
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
        if (this.player.isAttacking && !boss.isShielded) {
            const damage = this.player.attackPower;
            boss.takeDamage(damage);
            this.updateBossHealthBar();

            if (boss.health <= 0) {
                this.bossDefeated();
            }
        } else {
            // Play shield hit sound or effect
        }
    }

    handleProjectileBossCollision(boss, projectile) {
        if (!boss.isShielded) {
            const damage = this.player.attackPower;
            boss.takeDamage(damage);
            projectile.destroy();
            this.updateBossHealthBar();
    
            if (boss.health <= 0) {
                this.bossDefeated();
            }
        } else {
            // Play shield hit sound or effect
            projectile.destroy();
        }
    }

    handlePlayerMinionCollision(player, minion) {
        if (this.player.isInvincible) {
            return;
        }
        player.takeHit({ x: (player.x - minion.x) * 2, y: -100 });
        this.player.isInvincible = true;
        this.player.setTint(0xff0000);
        this.time.delayedCall(1000, () => {
            this.player.isInvincible = false;
            this.player.clearTint();
        });
        this.updateHealthDisplay();
    }

    handleWeaponMinionCollision(weapon, minion) {
        if (this.player.isAttacking) {
            minion.takeDamage(this.player.attackPower);
            if (minion.health <= 0) {
                this.destroyMinion(minion, false);
            }
        }
    }

    handleProjectileMinionCollision(projectile, minion) {
        minion.takeDamage(this.player.attackPower);
        projectile.destroy();
        if (minion.health <= 0) {
            this.destroyMinion(minion, false);
        }
    }

    destroyMinion(minion, didReport) {
        if (didReport) {
            // The minion sent its update to the boss
            // Increase boss's aggregated data and adapt behavior
            this.boss.aggregateUpdate(minion.collectedData);
        }
        // Play minion destruction effect
        minion.destroy();

        // Check if all minions are defeated or reported
        const activeMinions = this.minions.getChildren().filter(
            (m) => m.active
        );
        if (activeMinions.length === 0) {
            // Boss removes shield when all minions have reported or are defeated
            this.boss.isShielded = false;
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

        // Damage the boss if within radius and not shielded
        const boss = this.boss;
        if (boss && boss.active) {
            const distanceToBoss = Phaser.Math.Distance.Between(
                x,
                y,
                boss.x,
                boss.y
            );
            if (distanceToBoss <= radius && !boss.isShielded) {
                const damage = 3; // Adjust damage as needed
                boss.takeDamage(damage);
                this.updateBossHealthBar();

                if (boss.health <= 0) {
                    this.bossDefeated();
                }
            }
        }

        // Damage minions within radius
        this.minions.getChildren().forEach((minion) => {
            if (minion.active) {
                const distanceToMinion = Phaser.Math.Distance.Between(
                    x,
                    y,
                    minion.x,
                    minion.y
                );
                if (distanceToMinion <= radius) {
                    minion.takeDamage(3); // Adjust damage as needed
                    if (minion.health <= 0) {
                        this.destroyMinion(minion, false);
                    }
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

        // Destroy existing minions
        this.minions.clear(true, true);

        // Play defeat animation or effects
        this.boss.setTint(0x808080);
        this.boss.setVelocity(0, 0);
        this.boss.body.enable = false;
        this.boss.active = false;

        // Show victory text
        const victoryText = this.add.text(
            this.cameras.main.worldView.x +
                this.cameras.main.width / 2,
            this.cameras.main.worldView.y +
                this.cameras.main.height / 2,
            'You Win!',
            {
                fontSize: '64px',
                fill: '#00ff00',
            }
        );
        victoryText.setOrigin(0.5);

        // Transition to the next boss or end game
        this.time.delayedCall(2000, () => {
            // Transition to the next scene or end game
            // For now, we'll just restart the game or go to a 'GameOverScene'
            this.scene.start('GameOverScene', {
                playerData: this.player.getData(),
            });
        });
    }

    gameOver() {
        // Stop all events and movements
        this.physics.pause();
        this.player.setTint(0xff0000);
        // this.player.anims.play('turn');

        // Show Game Over text
        const gameOverText = this.add.text(
            this.cameras.main.worldView.x +
                this.cameras.main.width / 2,
            this.cameras.main.worldView.y +
                this.cameras.main.height / 2,
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

        // Update minions
        if (this.minions) {
            this.minions.getChildren().forEach((minion) => {
                if (minion.active) {
                    minion.update();
                }
            });
        }

        // Update boss AI
        if (this.boss && this.boss.active) {
            this.boss.update(time, delta);
        }

        // Update PET HUD
        this.updatePetHUD();
    }
}
