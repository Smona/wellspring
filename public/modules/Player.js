function Player(x, y) {
  this.baseSpeed = 500;
  this.jumpPower = 1000;
  this.sprite = game.add.sprite(x, y, 'player');
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;

  // Physics
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.collideWorldBounds = true;
  this.sprite.body.gravity.y = 1500;
  this.sprite.body.maxVelocity.x = this.baseSpeed;
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
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    this.sprite.body.velocity.x += this.speed;
  }
};