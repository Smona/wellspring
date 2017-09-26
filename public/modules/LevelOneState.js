var player, ledges, map, tilemap = 0;

levelOne = {
  preload: function () {
    game.world.setBounds(0, 0, world.width, world.height);

    var tilemapURL = 'tilemaps/level1.json';
    game.load.spritesheet('player', 'sprites/player.png', 1293, 2206);
    game.load.tilemap('level1', tilemapURL,null,Phaser.Tilemap.TILED_JSON);
    game.load.image('ledgeTile','tilemaps/ledgeTile.png');
    game.load.image('wellTile','tilemaps/wellTile.png');
  },
  create: function () {
    game.camera.setPosition(game.world.centerX, game.world.height - camera.height / 2);
    map = game.add.tilemap('level1');
    map.addTilesetImage('ledgeTile');
    map.addTilesetImage('wellTile');

    var wellTiles = map.createLayer('wellTiles');
    ledges = map.createLayer('ledgeTiles');
    map.setCollisionBetween(2, 9, true, 'ledgeTiles');

    game.physics.startSystem(Phaser.Physics.ARCADE);

    player = new Player(game.world.centerX, game.world.height - 100);
  },
  update: function() {
    game.camera.follow(player.sprite);
    game.physics.arcade.collide(player.sprite, ledges, null, function (player, ledge) {
      // Allows the player to jump through the bottom of ledges
      return ledge.collides &&
        player.position.y - player.body.height * player.anchor.y <= ledge.worldY - ledge.height + 10;
    });
    player.readInput();
  }
};
