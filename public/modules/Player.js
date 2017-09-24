function Player(x, y) {
  this.speed = 5;
  this.jumpPower = 500;
  this.sprite = game.add.sprite(x, y, 'player');
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;

  // Physics
  game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
  this.sprite.body.collideWorldBounds = true;
  this.sprite.body.gravity.y = 500;
}
Player.prototype.readInput = function () {
  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    this.sprite.x -= this.speed;
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    this.sprite.x += this.speed;
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
    this.sprite.body.velocity.y = -this.jumpPower;
  }
};