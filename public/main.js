var width = 1920;
var height = 1080;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game-root');

var textStyle = {
  fill: 'white'
};

function applyGameSettings() {
  // Dynamically resize game canvas
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
}

game.state.add('menu', {
  create: function () {
    applyGameSettings();
    var title = game.add.text(width / 2, height / 2, 'WELLSPRING', Object.assign(textStyle, {
      fontSize: '120px',
    }));
    title.anchor.set(0.5);

    var startButton = game.add.button(width / 2, height * 0.7, 'START', startGame);
    function startGame() {
      game.state.start('level1');
    }
  }
});

var player, ground;

game.state.add('level1', {
  preload: function () {
    // game.load.image('player', 'sprites/player.jpg');
    game.load.spritesheet('player', 'sprites/player.png', 1311, 2194);
    game.load.image('platform', 'sprites/well_bottom.png');
  },
  create: function () {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    applyGameSettings();
    ground = game.add.sprite(0, height * 0.7, 'platform');
    game.physics.enable(ground, Phaser.Physics.ARCADE);
    ground.body.immovable = true;
    ground.body.checkCollision = {
      top: true,
      bottom: false, left: false, right: false
    };

    player = new Player(game.world.centerX, height - 20);
  },
  update: function() {
    game.physics.arcade.collide(player.sprite, ground);
    player.readInput();
  }
});

game.state.start('level1');
