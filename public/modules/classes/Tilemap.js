function Tilemap(key, player) {
  var map = game.add.tilemap(key);
  var that = this;
  // Generate array of non-0 indexes
  var indexes = new Array(1000);
  for (var i = 0; i < indexes.length; i++) {
    indexes[i] = i + 1;
  }

  function setupLayer(layerName, cb) {
    var hasLayer = map.layers.filter(function (layer) {
      return layer.name === layerName;
    }).length > 0;
    if (hasLayer) {
      cb.call(that);
      that[layerName] = map.createLayer(layerName);
      climbBehavior(layerName);
    }
  }
  function climbBehavior(layerName) {
    if (typeof player !== 'undefined') {
      map.setCollisionByExclusion([0], true, that[layerName]);
      var fallTimer;
      var propName = 'on' + layerName.charAt(0).toUpperCase() + layerName.slice(1);

      // Remove vine/player separation and add grabbing mechanic
      map.setTileIndexCallback(indexes, function () {
        if (!!fallTimer) {
          clearTimeout(fallTimer);
        }
        player[propName] = true;
        fallTimer = setTimeout(function () {
          player[propName] = false;
        }, 32);
      }, game, that[layerName]);
    }
  }

  map.addTilesetImage('grassLedgeTile');
  map.addTilesetImage('stoneLedgeTile');
  map.addTilesetImage('wellBottom');
  map.addTilesetImage('wallTile');

  this.wellTiles = map.createLayer('wall');
  this.ledges = map.createLayer('grassLedge');

  setupLayer('vine', function() {
    map.addTilesetImage('vineTile');
    // map.addTilesetImage("vines");
  });

  setupLayer('ladder', function() {
    map.addTilesetImage('ladder');
  });

  this.stoneLedges = map.createLayer('stoneLedge');
  this.wellBottom = map.createLayer('stone');
  if (typeof player !== 'undefined') {
    map.setCollisionByExclusion([0], true, this.ledges);
    map.setCollisionByExclusion([0], true, this.stoneLedges);
    map.setCollisionByExclusion([0], true, this.wellBottom);
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
  if (this.vine) {
    game.physics.arcade.collide(body, this.vine);
  }
  if (this.ladder) {
    game.physics.arcade.collide(body, this.ladder);
  }
  game.physics.arcade.collide(body, this.wellBottom);
};