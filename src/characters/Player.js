// src/characters/Player.js

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
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

    // Adjust player size for better collision
    this.setSize(16, 32).setOffset(8, 16);

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

    // Projectile Group
    this.projectiles = scene.physics.add.group();

    // Timers for PET effects
    this.petTimers = {};

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
    if (
      Phaser.Input.Keyboard.JustDown(this.attackKey) &&
      !this.isAttacking
    ) {
      this.attack();
    }

    // Update weapon position
    if (this.isAttacking) {
      this.weapon.x = this.x + (this.direction === 'left' ? -20 : 20);
      this.weapon.y = this.y;
    }

    // PET activation
    if (
      Phaser.Input.Keyboard.JustDown(this.petKeys.DP) &&
      this.petSkills.DP
    ) {
      this.activatePetSkill('DP');
    }
    if (
      Phaser.Input.Keyboard.JustDown(this.petKeys.FL) &&
      this.petSkills.FL
    ) {
      this.activatePetSkill('FL');
    }
    if (
      Phaser.Input.Keyboard.JustDown(this.petKeys.HE) &&
      this.petSkills.HE
    ) {
      this.activatePetSkill('HE');
    }
    if (
      Phaser.Input.Keyboard.JustDown(this.petKeys.PE) &&
      this.petSkills.PE
    ) {
      this.activatePetSkill('PE');
    }
  }

  attack() {
    this.isAttacking = true;
    this.weapon.setVisible(true);

    // Enable weapon physics body
    this.scene.physics.world.enable(this.weapon);
    this.weapon.body.allowGravity = false;
    this.weapon.body.setSize(32, 32);
    this.weapon.body.setCircle(16);
    this.weapon.body.setOffset(0, 0);

    // Set weapon position
    this.weapon.x = this.x + (this.direction === 'left' ? -20 : 20);
    this.weapon.y = this.y;

    // Fire projectile
    this.fireProjectile();

    // Hide weapon after a short duration
    this.scene.time.addEvent({
      delay: 200, // Weapon active for 200ms
      callback: () => {
        this.weapon.setVisible(false);
        this.isAttacking = false;
        this.weapon.body.enable = false;
      },
    });
  }

  fireProjectile() {
    const projectile = this.projectiles.create(
      this.x,
      this.y,
      'projectile' // Use the new 'projectile' asset
    );
    projectile.setScale(0.5 + 0.1 * this.weaponLevel);
    projectile.body.allowGravity = false;
    projectile.body.setCircle(8 + 2 * this.weaponLevel);

    const velocity = this.direction === 'left' ? -300 : 300;
    projectile.setVelocityX(velocity);

    projectile.damage = this.attackPower;

    // Destroy projectile after some time
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        projectile.destroy();
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
          },
        });
        break;
      case 'FL':
        // Summon AI helper
        this.activePetEffects.FL = true;
        this.scene.spawnAIHelper(this);
        break;
      case 'HE':
        // Area-of-effect attack
        this.activePetEffects.HE = true;
        this.scene.homomorphicEncryptionBlast(this.x, this.y);
        break;
      case 'PE':
        // Become invisible to enemies
        this.activePetEffects.PE = true;
        this.scene.time.addEvent({
          delay: 10000, // Effect lasts 10 seconds
          callback: () => {
            this.activePetEffects.PE = false;
          },
        });
        break;
    }
    // Update PET HUD to show active effect
    this.scene.updatePetHUD();
  }

  upgradeWeapon() {
    if (this.weaponLevel < 3) {
      this.weaponLevel += 1;
      this.attackPower += 1;
      this.scene.showMessage(
        `Weapon upgraded to Level ${this.weaponLevel}!`,
        this.x,
        this.y - 50
      );
    }
  }

  takeHit(knockback) {
    // Apply knockback
    this.setVelocityX(knockback.x);
    this.setVelocityY(knockback.y);
  }
}
