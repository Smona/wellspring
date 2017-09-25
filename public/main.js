var world = {
  width: 640,
  height: 3200,
};
var camera = {
  width: 640,
  height: 500,
};
var game = new Phaser.Game(camera.width, camera.height, Phaser.AUTO, 'game-root');

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
    var title = game.add.text(camera.width / 2, camera.height / 2, 'WELLSPRING', Object.assign(textStyle, {
      fontSize: '80px',
    }));
    title.anchor.set(0.5);

    var startButton = game.add.button(camera.width / 2, camera.height * 0.7, 'START', startGame);
    function startGame() {
      game.state.start('level1');
    }
  }
});

var player, ledges;

var i = 0;
game.state.add('level1', {
  preload: function () {
    game.world.setBounds(0, 0, world.width, world.height);

    var tilemapURL = 'tilemaps/level1.json';
    game.load.spritesheet('player', 'sprites/player.png', 1293, 2206);
    game.load.tilemap('level1', tilemapURL,null,Phaser.Tilemap.TILED_JSON);
    game.load.image('ledgeTile','tilemaps/ledgeTile.png');
    game.load.image('wellTile','tilemaps/wellTile.png');
  },
  create: function () {
    game.camera.setPosition(game.world.centerX, game.world.height - camera.height / 2);
    var map = game.add.tilemap('level1');
    map.addTilesetImage('ledgeTile');
    map.addTilesetImage('wellTile');
        
    var wellTiles = map.createLayer('wellTiles');
    ledges = map.createLayer('ledgeTiles');
    map.setCollisionBetween(2, 9, true, 'ledgeTiles')
      
    game.physics.startSystem(Phaser.Physics.ARCADE);
    applyGameSettings();

    player = new Player(game.world.centerX, game.world.height - 100);
  },
  update: function() {
    game.camera.follow(player.sprite);
    game.physics.arcade.collide(player.sprite, ledges, null, function (player, ledge) {
      if (i < 5) {
        if (ledge.collides) i++;
        // console.log('player: ', player.position.y - player.body.height * player., player.body.height, player.anchor.y)
        // console.log('ledge', ledge.worldY - ledge.height, ledge.height)
        console.log(ledge.collides)
      }
      return ledge.collides &&
        player.position.y - player.body.height * player.anchor.y <= ledge.worldY - ledge.height;
    });
    player.readInput();
  }
});

game.state.start('level1');
