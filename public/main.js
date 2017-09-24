var width = 1920;
var height = 1080;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game-root');

var textStyle = {
  fill: 'white'
};

function applyGameSettings() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
}

game.state.add('menu', {
  create: function () {
    applyGameSettings();
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

var player;

game.state.add('level1', {
  preload: function () {
    game.load.image('player', 'sprites/player.jpg');
  },
  create: function () {
    applyGameSettings();
    player = new Player(game.world.centerX, height - 20);
  },
  update: function() {
    player.readInput();
  }
});

game.state.start('level1');
