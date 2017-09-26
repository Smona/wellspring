var player, ledges, map, tilemap = 0;

levelOne = {
  preload: function () {
    game.world.setBounds(0, 0, world.width, world.height);
  },
  create: function () {
    game.camera.setPosition(game.world.centerX, game.world.height - camera.height / 2);
    map = game.add.tilemap('level1');
    map.addTilesetImage('ledgeTile');
    map.addTilesetImage('wellTile');

    var wellTiles = map.createLayer('wellTiles');
    ledges = map.createLayer('ledgeTiles');
    map.setCollisionBetween(2, 9, true, 'ledgeTiles');

    player = new Player(game.world.centerX, game.world.height - 100);
  },
  update: function() {
    game.camera.follow(player.sprite);
    game.physics.arcade.collide(player.sprite, ledges, null, function (playerSprite, ledge) {
      // Allows the player to jump through the bottom of ledges
      return ledge.collides &&
        playerSprite.position.y - playerSprite.body.height * playerSprite.anchor.y <=
          ledge.worldY - ledge.height + 10;
    });
    player.update();
  }
};
