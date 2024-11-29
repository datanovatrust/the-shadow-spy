// src/characters/Player.js

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');

    // Add the player to the scene
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Player properties
    this.epsilon = 0;
    this.health = 5; // Starting health
    this.attackPower = 1;
    this.direction = 'right';
    this.isAttacking = false;
    this.petSkills = {};
    this.activePetEffects = {};

    // Weapon Level
    this.weaponLevel = 1;

    // Enable collision with world bounds
    this.setCollideWorldBounds(true);

    // Adjust player size for better collision (adjust as needed)
    this.setSize(32, 48).setOffset(0, 0);

    // Input keys
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.attackKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); // Attack key assigned to 'SPACE'
    this.jumpKey = this.cursors.up; // Up arrow for jumping

    // PET activation keys
    this.petKeys = {
      DP: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      FL: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      HE: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE),
      PE: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR),
    };

    // Weapon
    this.weapon = scene.add.sprite(this.x, this.y, 'attackAnimation');
    this.weapon.setVisible(false);
    this.weapon.active = false;

    // Initialize physics for the weapon
    scene.physics.add.existing(this.weapon);
    this.weapon.body.allowGravity = false;
    this.weapon.body.setSize(32, 32);
    this.weapon.body.setCircle(16);
    this.weapon.body.setOffset(0, 0);
    this.weapon.body.checkCollision.none = true;

    // Projectile Group
    this.projectiles = scene.physics.add.group();

    // Jump variables
    this.jumpCount = 0;
    this.canDoubleJump = true;
  }

  update() {
    const speed = 160;

    // Apply Polymorphic Encryption effect
    if (this.activePetEffects.PE) {
      // Make the player semi-transparent
      this.setAlpha(0.5);
    } else {
      this.setAlpha(1);
    }

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.setVelocityX(-speed);
      this.direction = 'left';
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(speed);
      this.direction = 'right';
    } else {
      this.setVelocityX(0);
    }

    // Reset jump count when the player lands
    if (this.body.blocked.down) {
      this.jumpCount = 0;
      this.canDoubleJump = true;
    }

    // Jumping
    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
      if (this.body.blocked.down) {
        // First jump
        this.setVelocityY(-330);
        this.jumpCount++;
      } else if (this.canDoubleJump && this.jumpCount < 2) {
        // Double jump
        this.setVelocityY(-330);
        this.jumpCount++;
        this.canDoubleJump = false;

        // Optional: Add a visual or sound effect for double jump
      }
    }

    // Attacking
    if (Phaser.Input.Keyboard.JustDown(this.attackKey) && !this.isAttacking) {
      this.attack();
    }

    // Update weapon position
    if (this.isAttacking) {
      this.weapon.x = this.x + (this.direction === 'left' ? -20 : 20);
      this.weapon.y = this.y;
    }

    // PET activation
    for (const skill in this.petKeys) {
      if (Phaser.Input.Keyboard.JustDown(this.petKeys[skill]) && this.petSkills[skill]) {
        this.activatePetSkill(skill);
      }
    }
  }

  attack() {
    this.isAttacking = true;
    this.weapon.setVisible(true);
    this.weapon.active = true;
    this.weapon.body.checkCollision.none = false;

    // Set weapon position
    this.weapon.x = this.x + (this.direction === 'left' ? -20 : 20);
    this.weapon.y = this.y;

    // Set up the overlap dynamically
    this.weaponOverlap = this.scene.physics.add.overlap(
      this.weapon,
      this.scene.activeEnemies,
      this.scene.handleWeaponEnemyCollision,
      null,
      this.scene
    );

    // Fire projectile
    this.fireProjectile();

    // Hide weapon after a short duration
    this.scene.time.addEvent({
      delay: 200, // Weapon active for 200ms
      callback: () => {
        this.weapon.setVisible(false);
        this.isAttacking = false;
        this.weapon.active = false;
        this.weapon.body.checkCollision.none = true;

        // Remove the overlap
        this.scene.physics.world.removeCollider(this.weaponOverlap);
      },
    });
  }

  fireProjectile() {
    const projectile = this.projectiles.create(this.x, this.y, 'projectile');
    projectile.setScale(0.5 + 0.1 * this.weaponLevel);
    projectile.body.allowGravity = false;
    projectile.body.setCircle(8 + 2 * this.weaponLevel);
    projectile.damage = this.attackPower;
    projectile.active = true;

    const velocity = this.direction === 'left' ? -300 : 300;
    projectile.setVelocityX(velocity);

    // Set up overlap for this projectile
    projectile.overlap = this.scene.physics.add.overlap(
      projectile,
      this.scene.activeEnemies,
      this.scene.handleProjectileEnemyCollision,
      null,
      this.scene
    );

    // Store the timer event for later cancellation
    projectile.timerEvent = this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        if (projectile && projectile.body) {
          projectile.active = false;
          projectile.body.checkCollision.none = true;

          // Remove overlap collider
          if (projectile.overlap) {
            this.scene.physics.world.removeCollider(projectile.overlap);
            projectile.overlap = null;
          }

          projectile.destroy();
        }
      },
    });
  }

  addPetSkill(skill) {
    this.petSkills[skill] = true;
    this.scene.updatePetHUD();
  }

  activatePetSkill(skill) {
    if (this.activePetEffects[skill]) {
      // Skill is already active
      return;
    }
    switch (skill) {
      case 'DP':
        // Temporarily reduce epsilon gain
        this.activePetEffects.DP = true;
        this.scene.time.addEvent({
          delay: 10000, // Effect lasts 10 seconds
          callback: () => {
            this.activePetEffects.DP = false;
            this.scene.updatePetHUD();
          },
        });
        break;
      case 'FL':
        // Summon AI helper
        this.activePetEffects.FL = true;
        this.spawnAIHelper();
        break;
      case 'HE':
        // Area-of-effect attack
        this.activePetEffects.HE = true;
        this.scene.homomorphicEncryptionBlast(this.x, this.y);
        this.activePetEffects.HE = false; // Immediate effect
        break;
      case 'PE':
        // Become invisible to enemies
        this.activePetEffects.PE = true;
        this.scene.time.addEvent({
          delay: 10000, // Effect lasts 10 seconds
          callback: () => {
            this.activePetEffects.PE = false;
            this.scene.updatePetHUD();
          },
        });
        break;
    }
    // Update PET HUD to show active effect
    this.scene.updatePetHUD();
  }

  spawnAIHelper() {
    const helper = this.scene.physics.add.sprite(this.x + 50, this.y, 'ai_helper');
    helper.setTint(0x32cd32); // Green tint to distinguish
    helper.body.allowGravity = false;

    // AI helper behavior
    helper.update = () => {
      helper.x = this.x + 50;
      helper.y = this.y;
    };

    // Helper attacks enemies
    this.scene.physics.add.overlap(
      helper,
      this.scene.activeEnemies,
      (helper, enemy) => {
        enemy.takeDamage(1, { x: 0, y: 0 });
        if (enemy.health <= 0) {
          enemy.destroy();
        }
      }
    );

    // Remove helper after some time
    this.scene.time.addEvent({
      delay: 10000, // Helper lasts 10 seconds
      callback: () => {
        helper.destroy();
        this.activePetEffects.FL = false;
        this.scene.updatePetHUD();
      },
    });
  }

  upgradeWeapon(improvementFactor = 1) {
    // Upgrade weapon based on improvementFactor
    const upgradeAmount = Math.ceil(improvementFactor * 2); // Adjust scaling as needed
    this.weaponLevel += upgradeAmount;
    this.attackPower += upgradeAmount;

    this.scene.showMessage(
      `Weapon upgraded to Level ${this.weaponLevel}!`,
      this.x,
      this.y - 50
    );
  }

  takeHit(knockback) {
    // Apply knockback
    this.setVelocityX(knockback.x);
    this.setVelocityY(knockback.y);

    // Reduce health
    this.health -= 1;
    this.scene.updateHealthDisplay();

    // Check for game over
    if (this.health <= 0) {
      this.scene.gameOver();
    }
  }
}
