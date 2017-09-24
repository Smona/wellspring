var game = new Phaser.Game(1920, 1080, Phaser.AUTO, 'game-root');

game.state.add('menu', {
  create: function() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  }
});

game.state.start('menu');
