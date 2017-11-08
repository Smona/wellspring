levels[1] = new Level('level1', {
  create: function() {
    this.tut2 = game.add.group();
    var keys = game.add.sprite(camera.width / 2, camera.height * 0.4, 'up_arrow');
    keys.anchor.setTo(0.5);
    var text = game.add.text(camera.width / 2, camera.height * 0.5,
      'PRESS UP TO GRAB VINES AND LADDERS', {
        fontSize: '30px',
        fill: 'white',
        font: gameFont,
      });
    text.anchor.setTo(0.5);
    this.tut2.fixedToCamera = true;

    this.tut2.addMultiple([keys, text]);
    this.player.sprite.position.x -= 150;
  },
  update: function() {
    if (this.hasOwnProperty('tut2') && this.tut2 && this.player.climbingVines) {
      this.tut2.removeChildren();
      this.tut2 = false;
    }
  }
});