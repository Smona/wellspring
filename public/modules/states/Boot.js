// Entry point. Designed to load quickly and set global game settings

boot = {
  create: function () {
    // Dynamically resize game canvas
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.state.start('level1');
  }
};