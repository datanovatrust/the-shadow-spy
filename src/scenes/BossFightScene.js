// src/scenes/BossFightScene.js

import { Player } from '../characters/Player.js';
import { Boss } from '../enemies/Boss.js';

export class BossFightScene extends Phaser.Scene {
    constructor() {
        super('BossFightScene');
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
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    
        // Create the player with existing data
        this.player = new Player(this, 100, 450);
        Object.assign(this.player, this.playerData); // Apply the saved data to the player
        this.player.scene = this;
    
        // Create the boss
        this.createBoss();
    
        // Initialize AI helpers group
        this.aiHelpers = this.physics.add.group({
            collideWorldBounds: true,
        });
    
        // Collision between AI helpers and platforms
        this.physics.add.collider(this.aiHelpers, this.platforms);
    
        // Collision between AI helpers and boss
        this.physics.add.collider(this.aiHelpers, this.boss);
    
        // Initialize enemy projectiles group
        this.enemyProjectiles = this.physics.add.group();
    
        // Colliders and overlaps
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.boss, this.platforms);
        this.physics.add.collider(
            this.player,
            this.boss,
            this.handlePlayerBossCollision,
            null,
            this
        );
    
        // Overlaps for attacks
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
    
        // Overlap for boss projectiles
        this.physics.add.overlap(
            this.player,
            this.boss.projectiles,
            this.handleBossProjectileCollision,
            null,
            this
        );
    
        // Camera setup
        this.cameras.main.setBounds(0, 0, 800, 600);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    
        // Create HUD
        this.createHUD();
    
        // Create distributions
        this.createDistributions();
    
        // Input for adjusting distributions
        this.cursors = this.input.keyboard.createCursorKeys();
    
        // Input for menu
        this.input.keyboard.on('keydown-M', () => {
            this.scene.pause('BossFightScene');
            if (this.scene.isActive('MenuScene')) {
                this.scene.bringToTop('MenuScene');
            } else {
                this.scene.launch('MenuScene');
            }
        });
    }

    createBoss() {
        // Create the boss using the Boss class
        this.boss = new Boss(this, 600, 450);
    }

    createDistributions() {
        // Initialize distributions
        this.playerDistribution = { mean: 0, variance: 100 };
        this.bossDistribution = { mean: 0, variance: 100 };

        // Graphics objects for distributions
        this.playerDistributionGraphics = this.add.graphics();
        this.bossDistributionGraphics = this.add.graphics();

        // Position for distributions
        this.distributionY = 500;

        // Text to display overlap
        this.overlapText = this.add
            .text(400, 50, '', {
                fontSize: '20px',
                fill: '#fff',
            })
            .setOrigin(0.5);

        // Draw initial distributions
        this.previousOverlap = 0;
        this.drawDistributions();
    }

    drawDistributions() {
        // Clear previous drawings
        this.playerDistributionGraphics.clear();
        this.bossDistributionGraphics.clear();

        // Draw boss distribution (red)
        this.drawGaussian(
            this.bossDistributionGraphics,
            this.bossDistribution.mean,
            this.bossDistribution.variance,
            0xff0000
        );

        // Draw player distribution (white)
        this.drawGaussian(
            this.playerDistributionGraphics,
            this.playerDistribution.mean,
            this.playerDistribution.variance,
            0xffffff
        );

        // Calculate overlap
        const overlap = this.calculateOverlap(
            this.playerDistribution,
            this.bossDistribution
        );

        // Update boss shield based on overlap
        this.boss.shieldStrength = 1 - overlap; // Shield strength decreases with more overlap
        if (this.boss.shieldStrength < 0) {
            this.boss.shieldStrength = 0;
        }

        // Update overlap text
        this.overlapText.setText(
            `Distribution Overlap: ${(overlap * 100).toFixed(2)}%`
        );

        // Visual effects when overlap increases
        if (overlap > this.previousOverlap) {
            this.emitOverlapParticles();
        }

        this.previousOverlap = overlap;
    }

    drawGaussian(graphics, mean, variance, color) {
        graphics.lineStyle(2, color, 1);
        const numPoints = 200;
        const width = 800;
        const dx = width / numPoints;
        const scale = 5000; // Scale for the height of the distribution
        let firstPoint = true;
        for (let i = 0; i <= numPoints; i++) {
            const x = i * dx - 400;
            const y = this.gaussian(x, mean, variance) * scale;
            const screenX = i * dx;
            const screenY = this.distributionY - y;
            if (firstPoint) {
                graphics.moveTo(screenX, screenY);
                firstPoint = false;
            } else {
                graphics.lineTo(screenX, screenY);
            }
        }
        graphics.strokePath();
    }

    gaussian(x, mean, variance) {
        const coeff = 1 / Math.sqrt(2 * Math.PI * variance);
        const exponent = -((x - mean) * (x - mean)) / (2 * variance);
        return coeff * Math.exp(exponent);
    }

    calculateOverlap(dist1, dist2) {
        // Approximate overlap by integrating the minimum of the two distributions
        const numPoints = 200;
        const width = 800;
        const dx = width / numPoints;
        let overlapArea = 0;
        for (let i = 0; i <= numPoints; i++) {
            const x = i * dx - 400;
            const y1 = this.gaussian(x, dist1.mean, dist1.variance);
            const y2 = this.gaussian(x, dist2.mean, dist2.variance);
            const minY = Math.min(y1, y2);
            overlapArea += minY * dx;
        }
        // Normalize overlapArea
        const totalArea = 1; // For normalized Gaussians
        return overlapArea / totalArea;
    }

    emitOverlapParticles() {
        // In Phaser 3.60, particles are created differently
        // We use this.add.particles(x, y, texture, config)
        this.add.particles(400, this.distributionY - 50, 'particle', {
            speed: { min: -200, max: 200 },
            angle: { min: 0, max: 360 },
            lifespan: 500,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            quantity: 20,
            maxParticles: 20,
        });
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

    handlePlayerBossCollision(player, boss) {
        // Reduce collision damage
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

    // Corrected method with parameters in the right order
    handleProjectileBossCollision(boss, projectile) {
        const damage =
            this.player.attackPower * (1 - boss.shieldStrength) * 0.2;
        boss.takeDamage(damage);
        projectile.destroy();
        this.updateBossHealthBar();

        if (boss.health <= 0) {
            this.bossDefeated();
        }
    }

    // Corrected method with parameters in the right order
    handleWeaponBossCollision(weapon, boss) {
        if (this.player.isAttacking) {
            const damage =
                this.player.attackPower * (1 - boss.shieldStrength) * 0.2;
            boss.takeDamage(damage);
            this.updateBossHealthBar();

            if (boss.health <= 0) {
                this.bossDefeated();
            }
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

        // Update boss phase based on health
        if (healthPercentage <= 0.33 && this.boss.phase !== 3) {
            this.boss.phase = 3;
            this.boss.attackEvent.delay = 1000; // Faster attacks
        } else if (healthPercentage <= 0.66 && this.boss.phase !== 2) {
            this.boss.phase = 2;
            this.boss.attackEvent.delay = 2000; // Moderate attacks
        }
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
        // Since we only have one boss, check if it's within the radius
        const boss = this.boss;
        if (boss && boss.active) {
            const distance = Phaser.Math.Distance.Between(x, y, boss.x, boss.y);
            if (distance <= radius) {
                const damage = 3 * (1 - boss.shieldStrength) * 0.2;
                boss.takeDamage(damage);
                this.updateBossHealthBar();

                if (boss.health <= 0) {
                    this.bossDefeated();
                }
            }
        }

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
        // Stop boss attacks
        if (this.boss.attackEvent) {
            this.boss.attackEvent.remove(false);
        }
    
        // Destroy existing boss projectiles
        this.boss.projectiles.clear(true, true);
    
        // Play defeat animation or effects
        this.boss.setTint(0x808080);
        this.boss.setVelocity(0, 0);
        this.boss.body.enable = false;
        this.boss.active = false;
    
        // Show victory text
        const victoryText = this.add.text(
            this.cameras.main.worldView.x + this.cameras.main.width / 2,
            this.cameras.main.worldView.y + this.cameras.main.height / 2,
            'Boss Defeated!',
            {
                fontSize: '64px',
                fill: '#00ff00',
            }
        );
        victoryText.setOrigin(0.5);
    
        // Transition to the Federated Learning Boss Fight Scene
        this.time.delayedCall(2000, () => {
            this.scene.start('FederatedLearningBossFightScene', {
                playerData: this.player.getData(),
            });
        });
    }

    gameOver() {
        // Stop all events and movements
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.play('turn');

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

        // Update AI helpers
        if (this.aiHelpers) {
            this.aiHelpers.getChildren().forEach((helper) => {
                if (helper.active) {
                    helper.update();
                }
            });
        }

        // Update boss AI
        if (this.boss && this.boss.active) {
            this.boss.update(time, delta);
        }

        // Update homing projectiles
        if (this.boss && this.boss.projectiles) {
            this.boss.projectiles.getChildren().forEach((projectile) => {
                if (projectile.isHoming && projectile.active) {
                    this.physics.moveToObject(projectile, this.player, 200);
                }
            });
        }

        // Update distributions based on player input
        let distributionChanged = false;
        if (this.cursors.left.isDown) {
            this.playerDistribution.mean -= 2;
            distributionChanged = true;
        } else if (this.cursors.right.isDown) {
            this.playerDistribution.mean += 2;
            distributionChanged = true;
        }

        if (
            this.cursors.up.isDown &&
            this.playerDistribution.variance < 300
        ) {
            this.playerDistribution.variance += 2;
            distributionChanged = true;
        } else if (
            this.cursors.down.isDown &&
            this.playerDistribution.variance > 10
        ) {
            this.playerDistribution.variance -= 2;
            distributionChanged = true;
        }

        if (distributionChanged) {
            this.drawDistributions();
        }

        // Update PET HUD
        this.updatePetHUD();
    }
}
