function Player(x, y) {
  this.baseSpeed = 400;
  this.jumpPower = 800;
  this.scale = 0.05;
  this.sprite = game.add.sprite(x, y, 'player');
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
  this.sprite.scale.setTo(this.scale);

  // Physics
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.collideWorldBounds = true;
  this.sprite.body.gravity.y = 1500;
  this.sprite.body.maxVelocity.x = this.baseSpeed;
  var shrinkBodyWidth = 400;
  this.sprite.body.setSize(1293 - shrinkBodyWidth, 2100, shrinkBodyWidth / 2);

  // Animations
  this.sprite.animations.add('run');
}

Object.defineProperties(Player.prototype, {
  onGround: {
    get: function () {
      return this.sprite.body.onFloor() || this.sprite.body.touching.down;
    },
    set: function (y) {
    }
  },
  speed: {
    get: function () {
      // Move slower in the air
      return this.baseSpeed * (this.onGround ? 1 : 0.05);
    }
  }
});

Player.prototype.readInput = function () {
  // Player is standing on ground
  if (this.onGround) {
    // Friction
    this.sprite.body.velocity.x = 0;

    // Jumping
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
      this.sprite.body.velocity.y = -this.jumpPower;
    }
    // Climbing down from a ledge
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
      this.sprite.y += 20;
    }
  }

  // Running Left
  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    this.sprite.body.velocity.x -= this.speed;
    this.sprite.scale.setTo(-this.scale, this.scale);
  }
  // Running Right
  if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    this.sprite.body.velocity.x += this.speed;
    this.sprite.scale.setTo(this.scale, this.scale);
  }
  if (Math.abs(this.sprite.body.velocity.x) > 0.1 && this.onGround) {
    this.sprite.animations.play('run', 15, true);
  } else {
    this.sprite.animations.stop('run', 0);
  }
};