// Entry point. Designed to load quickly and set global game settings

var cursors;

boot = {
  preload: function () {
    game.load.image('loadingBar', 'sprites/loading-bar.png');
  },
  create: function () {
    // Dynamically resize game canvas
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    cursors = game.input.keyboard.createCursorKeys();

    game.state.start('preload');
  }
};