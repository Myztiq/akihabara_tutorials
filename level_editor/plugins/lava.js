introduceALESPlugin({
  targetALESVersion: '0.0.1',
  sourceURL:         'http://ryan-kahn.com/akihabara/lava/lava.js',
  name:              'Fire Pits', //For display on hover overs and in general...
  sprite:            ['lava_sprite', 'http://ryan-kahn.com/akihabara/lava/lava.png'],
  paletteImage:      'http://ryan-kahn.com/akihabara/lava/lavaPalette.png',
  tile: {
    id:              'lava',
    image:           'lava_sprite',
    tileh:           32,
    tilew:           32,
    tilerow:         8,
    gapx:            0,
    gapy:            0
  },
  group:             'enemies',
  tileset:           'lava',
  solidFloor:        false,
  solidCeil:         false,
  solidLeft:         false,
  solidRight:        false,
  add: function(data) {
    gbox.addObject({
      tileID:     data.tileID,
      group:      this.group,
      tileset:    this.tileset,
      initialize: function() {
        toys.platformer.initialize(this, {
          frames: {
            still:    { speed: 4, frames:[0] },
            fullLava: { speed: 4, frames:[0] },
            walking:  { speed: 4, frames:[0] },
            jumping:  { speed: 4, frames:[0] },
            falling:  { speed: 4, frames:[0] },
            die:      { speed: 4, frames:[0] }
          },
          x:        data.x,
          y:        data.y,
          jumpaccy: 10,
          side:     data.side,
          onBox:    false
        });
      },

      first: function() {
        // Counter
        this.counter = (this.counter + 1) % 10;

        var pl = gbox.getObject('player', 'player_id');
        if (gbox.objectIsVisible(this) && pl) {
          var topleft = help.getTileInMap(this.x + 4, this.y-1, map, 0, 'map');
          var topright = help.getTileInMap(this.x + this.w - 4, this.y - 1, map, 0, 'map');
          if ((topleft && topleft == this.tileID) || (topright && topright == this.tileID)) {
            //This is below an existing tile. Don't show the bubbly animation
            this.frame = help.decideFrame(this.counter, { speed:4, frames:[4, 5, 6, 7] });
          } else {
            this.frame = help.decideFrame(this.counter, { speed:4, frames:[1, 2, 3, 4] });
          }

          //-1 is a hack because it wasnt working with 0, however! the heat from the lava could kill well before they hit it... :)
          if (gbox.collides(this, pl, 0)) {
            pl.resetGame();
          }

          for (var i in gbox._objects['enemies']) {
            if ((!gbox._objects['enemies'][i].initialize) && gbox._objects['enemies'][i].tileset != 'lava' && gbox.collides(this, gbox._objects['enemies'][i], 0)){
              gbox.trashObject(gbox._objects['enemies'][i]);
            }
          }
        }
      },

      blit: function() {
        // Render the current sprite.. don't worry too much about what's going on here. We're pretty much doing
        //  the default drawing function, sending along the tileset, the frame info, coordinates, whether the
        //  spries is flipped, camera info, and the alpha transparency value
        gbox.blitTile(gbox.getBufferContext(), {
          tileset: this.tileset,
          tile:    this.frame,
          dx:      this.x,
          dy:      this.y,
          fliph:   this.fliph,
          flipv:   this.flipv,
          camera:  this.camera,
          alpha:   1.0
        });
      }
    });
  }
});