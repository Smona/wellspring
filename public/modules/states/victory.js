var victory = {
  create: function () {
    var bg = game.add.sprite(0, 0, 'victory_bg');
    bg.scale.setTo(1.6);
    var player = new Player(camera.width * 0.3, camera.height * 0.9);
    player.sprite.body.gravity.y = 0;
    player.sprite.scale.setTo(0.1);
    player.sprite.animations.play('dance');
  }
};