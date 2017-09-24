function Player(x, y) {
  this.speed = 5;
  this.sprite = game.add.sprite(x, y, 'player');
  this.sprite.anchor.x = 0.5;
  this.sprite.anchor.y = 1;
}
Player.prototype.readInput = function () {
  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    this.sprite.x -= this.speed;
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    this.sprite.x += this.speed;
  }
};