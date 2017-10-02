var preload = {
  preload: function () {
    var preloadBar = game.add.sprite(game.world.centerX, game.world.centerY, 'loadingBar');
    preloadBar.anchor.setTo(0.5);
    preloadBar.scale.setTo(0.5);
    game.load.setPreloadSprite(preloadBar);

    game.load.spritesheet('player', 'sprites/Player.png', 328, 529);
    game.load.tilemap('level1', 'tilemaps/level1.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.image('ledgeTile','tilemaps/ledgeTile.png');
    game.load.image('wellTile','tilemaps/wellTile.png');

    game.load.audio('grassFall', 'audio/grass_fall.mp3');
  },
  create: function () {
    game.state.start(startState);
  }
};