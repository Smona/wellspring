function DepthSign(x, y, depth) {
  this.x = x;
  this.y = y;
  this.sign = game.add.sprite(x, y, 'sign');
  this.sign.anchor.setTo(0.5);
  this.sign.scale.setTo(1.8);
  this.text = game.add.text(x, y - 2, '-' + depth + ' FT', {
    font: gameFont,
  });
  this.text.anchor.setTo(0.5)
}