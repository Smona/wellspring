function Level(width, height, tilemapKey, next) {
  this.width = width;
  this.height = height;
  this.tilemapKey = tilemapKey;
  this.next = next;
}

Object.defineProperties(Level.prototype, {
  state: {
    get: function () {
      return {
        preload: function () {
          game.time.advancedTiming = true; // enables fps monitoring
        }.bind(this),
        create: function () {
          game.world.setBounds(0, 0, this.width, this.height);
          this.player = new Player(game.world.centerX, game.world.height - 70);
          this.map = new Tilemap(this.tilemapKey, this.player);
          wellShader(game.world);
          game.world.bringToTop(this.player.sprite);
        }.bind(this),
        update: function() {
          game.camera.follow(this.player.sprite);

          // World Wrapping
          if (this.player.x > this.width / 3 * 2) {
            this.player.sprite.x = this.width / 3;
          } else if (this.player.x < this.width / 3) {
            this.player.sprite.x = this.width / 3 * 2;
          }

          // Level Completion
          if (this.next && this.player.sprite.y < 180) {
            game.state.start(this.next);
          }

          this.map.checkCollisions(this.player.sprite);
          this.player.update();
        }.bind(this),
        render: function () {
          // this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
        }
      }
    }
  }
});