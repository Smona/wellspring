var playerSpriteWidth, playerSpriteHeight;
var preload = {
  preload: function () {
    var preloadBar = game.add.sprite(game.world.centerX, game.world.centerY, 'loadingBar');
    preloadBar.anchor.setTo(0.5);
    preloadBar.scale.setTo(0.5);
    game.load.setPreloadSprite(preloadBar);

    playerSpriteWidth = 328;
    playerSpriteHeight = 648;
    game.load.spritesheet('player', 'sprites/Player.png', playerSpriteWidth, playerSpriteHeight);
    game.load.tilemap('level1', 'tilemaps/level1-tripled.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.image('ledgeTile','tilemaps/ledgeTile.png');
    game.load.image('wallTile','tilemaps/wallTile.png');
    game.load.image('vineTile', 'tilemaps/vineTile.png');

    game.load.audio('grassFall', 'audio/grass_fall.mp3');
    game.load.audio('grassStep', 'audio/grass_step.mp3')
  },
  create: function () {
    game.state.start(startState);
  }
};