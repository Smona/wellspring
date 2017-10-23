var playerSpriteWidth, playerSpriteHeight;

var gameFont = 'Josefin Sans';
WebFontConfig = {

  //  'active' means all requested fonts have finished loading
  //  We set a 1 second delay before calling 'createText'.
  //  For some reason if we don't the browser cannot render the text the first time it's created.
  active: function() {
    console.log('fonts loaded')
  },

  //  The Google Fonts we want to load (specify as many as you like in the array)
  google: {
    families: [gameFont]
  }

};


var preload = {
  preload: function () {
    var preloadBar = game.add.sprite(game.world.centerX, game.world.centerY, 'loadingBar');
    preloadBar.anchor.setTo(0.5);
    preloadBar.scale.setTo(0.5);
    game.load.setPreloadSprite(preloadBar);

    playerSpriteWidth = 664;
    playerSpriteHeight = 648;
    game.load.spritesheet('player', 'sprites/Player.png', playerSpriteWidth, playerSpriteHeight);
    game.load.tilemap('level1', 'tilemaps/level1-tripled.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.image('ledgeTile','tilemaps/ledgeTile.png');
    game.load.image('wallTile','tilemaps/wallTile.png');
    game.load.image('vineTile', 'tilemaps/vineTile.png');
    game.load.spritesheet('startButton', 'sprites/start_button.png', 175, 74);
    game.load.image('start_hover', 'sprites/start_hover.png');
    //  Load the Google WebFont Loader script
    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

    game.load.audio('grassFall', 'audio/grass_fall.mp3');
    game.load.audio('grassStep', 'audio/grass_step.mp3')
  },
  create: function () {
    game.state.start(startState);
  }
};