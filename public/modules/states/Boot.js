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
    cursors.w = game.input.keyboard.addKey(Phaser.Keyboard.W);
    cursors.a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    cursors.s = game.input.keyboard.addKey(Phaser.Keyboard.S);
    cursors.d = game.input.keyboard.addKey(Phaser.Keyboard.D);
    cursors.jump = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    game.state.start('preload');
  }
};