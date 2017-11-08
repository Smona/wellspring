levels[1] = new Level('level1', {
  create: function () {
    this.tut1 = game.add.group();
    
    var caveNoise = game.add.audio('cave_noise');
    caveNoise.play(null, 0, 0.1, true);
},
  update: function () {
     if (!this.hasOwnProperty('tut2') && this.player.sprite.y < this.height - 300) {
       this.tut2 = game.add.text(camera.width / 2, camera.height * 0.7,
         'PRESS UP TO GRAB VINES', {
         fontSize: '30px',
         fill: 'white',
         font: gameFont,
       });
       this.tut2.anchor.setTo(0.5);
       this.tut2.fixedToCamera = true;
     }
     if (this.hasOwnProperty('tut2') && this.tut2 && this.player.climbingVines) {
       this.tut2.kill();
       this.tut2 = false;
     }

});
