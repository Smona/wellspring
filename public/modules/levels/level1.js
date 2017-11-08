levels[1] = new Level({
  name: 'level1',
  tutorials: [
    {
      text: 'PRESS UP TO GRAB VINES AND LADDERS',
      condition: function () {
        return this.player.climbingVines;
      },
      sprites: {
        'up_arrow': {
          y: 0.4
        }
      }
    }
  ],
  hooks: {
    create: function() {
      this.player.sprite.position.x -= 150;
    },
    update: function() {
      if (!this.hasOwnProperty('tut3') && this.player.sprite.position.y < 1800 && this.player.climbingVines) {
        this.tut3 = game.add.text(camera.width / 2, camera.height / 2,
          'THESE VINES SEEM STURDY ENOUGH TO JUMP OFF', tutFont);
        this.tut3.anchor.setTo(0.5);
        // this.tut3.setTextBounds(400, 0, camera.width - 100, camera.height);
        this.tut3.fixedToCamera = true;
      }
      if (this.hasOwnProperty('tut3') && this.tut3 && cursors.jump.isDown) {
        this.tut3.kill();
      }
    }
  }
});