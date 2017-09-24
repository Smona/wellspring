var width = 1920;
var height = 1080;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game-root');

var textStyle = {
  fill: 'white'
};

game.state.add('menu', {
  create: function () {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    var title = game.add.text(width / 2, height / 2, 'WELLSPRING', Object.assign(textStyle, {
      fontSize: '120px',
    }));
    title.anchor.set(0.5);

    var startButton = game.add.button(width / 2, height * 0.7, 'START', startGame)
    function startGame() {
      game.state.start('level1');
    }
  }
});

game.state.add('level1', {
  create: function () {
    game.add.text(game.world.centerX, game.world.centerY, 'Level 1', textStyle);
  }
});

game.state.start('menu');
