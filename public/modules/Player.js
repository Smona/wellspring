function Player(x, y) {
  this.baseSpeed = 500;
  this.jumpPower = 1000;
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
    this.sprite.body.velocity.x = 0;
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
      this.sprite.body.velocity.y = -this.jumpPower;
    }
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    this.sprite.body.velocity.x -= this.speed;
    this.sprite.scale.setTo(this.scale, this.scale);
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    this.sprite.body.velocity.x += this.speed;
    this.sprite.scale.setTo(-this.scale, this.scale);
  }
  if (Math.abs(this.sprite.body.velocity.x) > 0.1 && this.onGround) {
    this.sprite.animations.play('run', 15, true);
  } else {
    this.sprite.animations.stop('run', 0);
  }
};