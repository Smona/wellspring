function Tilemap(key, player) {
  var map = game.add.tilemap(key);

  map.addTilesetImage('ledgeTile');
  map.addTilesetImage('wallTile');
  map.addTilesetImage('vineTile');

  this.wellTiles = map.createLayer('wall');
  this.ledges = map.createLayer('ledge');
  this.vines = map.createLayer('vine');
  if (typeof player !== 'undefined') {
    map.setCollisionByExclusion([0], true, this.ledges);
    map.setCollisionByExclusion([0], true, this.vines);
    var vineFallTimer;
    map.setTileIndexCallback([1, 2, 3, 4, 5, 6, 7], function () {
      if (!!vineFallTimer) {
        clearTimeout(vineFallTimer);
      }
      player.onVines = true;
      vineFallTimer = setTimeout(function () {
        player.onVines = false;
      }, 32);
    }, game, this.vines);
  }

  this.map = map;
}

Tilemap.prototype.checkCollisions = function (body) {
  game.physics.arcade.collide(body, this.ledges, null, function (collidedBody, ledge) {
    // Allows the player to jump through the bottom of ledges
    var colliding = ledge.collides &&
      collidedBody.position.y - collidedBody.body.height * collidedBody.anchor.y <=
      ledge.worldY - ledge.height + 40;
    return colliding;
  });
  game.physics.arcade.collide(body, this.vines);
};