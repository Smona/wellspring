levels[1] = new Level('level1', {
  create: function() {
    var keys = game.add.sprite(camera.width / 2, camera.height / 2, 'up_arrow');
    keys.anchor.setTo(0.5);
    this.tut2 = game.add.text(camera.width / 2, camera.height * 0.7,
      'PRESS UP TO GRAB VINES', {
        fontSize: '30px',
        fill: 'white',
        font: gameFont,
      });
    this.tut2.anchor.setTo(0.5);
    this.tut2.fixedToCamera = true;
  },
  update: function() {
    if (this.hasOwnProperty('tut2') && this.tut2 && this.player.climbingVines) {
      this.tut2.kill();
      this.tut2 = false;
    }
  }
});