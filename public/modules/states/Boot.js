// Entry point. Designed to load quickly and set global game settings

boot = {
  preload: function () {
    game.load.image('loadingBar', 'sprites/loading-bar.png');
  },
  create: function () {
    // Dynamically resize game canvas
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.state.start('preload');
  }
};