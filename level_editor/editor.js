var insp;
var afterEditorLoad;
var canvasContext;
var minimap;
var context;
var tool, mouseOverDelay, isMouseOut;
var editor;

var canvas, tool, px, py, tcolor, brush;
var camx = 0;
var camy = 0;
var total_brushes = 10;
var brushes = new Array(total_brushes);
var brushes_img = new Array(total_brushes);

NUM_LEVEL_ROWS = 30;
NUM_LEVEL_COLS = 40;
var level = new Array(NUM_LEVEL_ROWS);

// init the global level data structure
for (var i = 0; i < NUM_LEVEL_ROWS; i++) {
  level[i] = "0000000000000000000000000000000000000000";
}

if (levelParam.length == (NUM_LEVEL_COLS * NUM_LEVEL_ROWS)) {
  for (var c = 0; c < (NUM_LEVEL_COLS * NUM_LEVEL_ROWS); c += NUM_LEVEL_COLS) {
    level[c/NUM_LEVEL_COLS] = levelParam.substr(c, NUM_LEVEL_COLS);
  }
}

function setLevel(lvl) {
  level = lvl;

  editor.drawCanvas(camx, camy);
}

function loadLevelState(level) {
  setLevel(level);
  reloadMap();
  $('#last_saved').text(getCurrentTimestamp());
}

function getLevelDataForSaveFile() {
  return JSON.stringify(getLevelData());
}

function getLevelData() {
  return level;
}

function getLevelName() {
  return $('#level_name input').val();
}

function getFilenameForSave() {
  return getLevelName().toLowerCase().replace(/ /g, '_') + '_' + getCurrentTimestampForFile() + '.json';
}

function initEditor() {
  editor = new Editor();

  // Find the elements
  canvas = document.getElementById('imageView');
  	brushes = jQuery(".brush");
	var i = 0;
	brushes.each(function(){
		brushes_img[i] = new Image();
		brushes_img[i].src = this.src;
		i++;
	});
	brushes.live("click",function() {
		brush = this.id.replace('brush','');
		if(brush > total_brushes){
			brush = String.fromCharCode(brush);
		}
	});

  if (!canvas) {
    alert('Error: I cannot find the canvas element!');
    return;
  }

  if (!canvas.getContext) {
    alert('Error: no canvas.getContext!');
    return;
  }

  // Get the 2D canvas context.
  context = canvas.getContext('2d');
  if (!context) {
    alert('Error: failed to getContext!');
    return;
  }

  // Pencil tool instance.
  tool = new tool_pencil();

  canvas.addEventListener('mousedown', ev_canvas, false);
  canvas.addEventListener('mousemove', ev_canvas, false);
  document.body.addEventListener('mouseup',   ev_canvas, false);
  document.body.addEventListener('mouseout',   mouseOut, false);

  editor.drawCanvas(camx,camy);

  if (!UpdateMap.priorOldValue) {
    UpdateMap.priorOldValue = getLevelCopy();
  }

  if (afterEditorLoad) {
    afterEditorLoad();
  }
}

function replaceOneChar(s, c, n) {
  (s = s.split(''))[n] = c;
  return s.join('');
}

// This painting tool works like a drawing pencil which tracks the mouse
// movements.
function tool_pencil () {
  tool = this;
  this.started = false;

  // This is called when you start holding down the mouse button.
  this.mousedown = function (ev) {
      level[Math.floor(ev._y/32)+camy] = replaceOneChar(level[Math.floor(ev._y/32)+camy], brush, [Math.floor(ev._x/32)+camx]);
      tool.started = true;
      editor.drawCanvas(camx,camy);
  };

  // This function is called every time you move the mouse. Obviously, it only
  // draws if the tool.started state is set to true (when you are holding down
  // the mouse button).
  this.mousemove = function (ev) {

  px = ev._x;
  py = ev._y;
  isMouseOut = false;

  if (!tool.started && !isMouseOut) {

    if ( !((ev._x > 600 && camx < 20) || (ev._x < 40 && camx > 0) || (ev._y > 440 && camy < 15) || (ev._y < 40 && camy > 0)) )
      mouseOverDelay = 0;

    // move the camera when you hit the edge of the screen
    if (ev._x > 600 && camx < 20) {
      if (mouseOverDelay >= 2) camx += 1;
    }
    else if (ev._x < 40 && camx > 0) {
      if (mouseOverDelay >= 2) camx -= 1;
      }
    if (ev._y > 440 && camy < 15) {
      if (mouseOverDelay >= 2) camy += 1;
    }
    else if (ev._y < 40 && camy > 0) {
      if (mouseOverDelay >= 2) camy -= 1;
      }
   }

    if (tool.started) {
      level[Math.floor(ev._y/32)+camy] = replaceOneChar(level[Math.floor(ev._y/32)+camy], brush, [Math.floor(ev._x/32)+camx]);
      }
     editor.drawCanvas(camx,camy);
     context.lineWidth = 2;
  context.strokeStyle = '#800';
  context.strokeRect((Math.floor(ev._x/32))*32, Math.floor(ev._y/32)*32, 32, 32);

  };

  // This is called when you release the mouse button.
  this.mouseup = function (ev) {
    if (canvasContext) {genMiniMap();}
    if (tool.started) {
      tool.mousemove(ev);
      tool.started = false;
    }
  };
}

// The general-purpose event handler. This function just determines the mouse
// position relative to the canvas element.
function ev_canvas (ev) {
  if (ev.layerX || ev.layerX == 0) { // Firefox
    ev._x = ev.layerX;
    ev._y = ev.layerY;
  } else if (ev.offsetX || ev.offsetX == 0) { // Opera
    ev._x = ev.offsetX;
    ev._y = ev.offsetY;
  }

  // Call the event handler of the tool.
  var func = tool[ev.type];
  if (func) {
    func(ev);
  }
}

function genMiniMap () {
  reloadMap();
  minimap = canvasContext.getImageData(0, 0, 640*2, 480*2);
  var pix = minimap.data;

  // Loop over pixels, skipping every Nth since we're shrinking the image
  for (var i = 0, n = pix.length; i < n; i += 4)
    if (i % 32 == 0) {
      pix[(i/8)  ] = pix[i  ]; // r
      pix[(i/8)+1] = pix[i+1]; // g
      pix[(i/8)+2] = pix[i+2]; // b
      pix[(i/8)+3] = pix[i+3]; // a
    }
}

var Editor = Klass.extend({
  init: function(dom_base, options) {

  },

  drawCanvas: function(cx, cy) {
    for (var y = cy; y < cy+15; y++){
		for (var x = cx; x < cx+20; x++){
			var brush = jQuery("#brush"+level[y][x]);
			if(brush.length){
				context.drawImage(brush[0], (x-camx)*32, (y-camy)*32);
			}else{
				//We didnt find the brush the normal way, check out the char code then...
				var id = level[y][x].charCodeAt(0);
				var brush = jQuery("#brush"+id);
				if(brush.length){
					context.drawImage(brush[0], (x-camx)*32, (y-camy)*32);
				}else{
					console.log("Could not find brush for: "+level[y][x]);
				}
			}
		}
	}


    if (minimap) {
       var tc = document.createElement('canvas');
       tc.setAttribute('width',160);
       tc.setAttribute('height',120);

      var pix = minimap.data;
      var a = tc.getContext('2d').getImageData(0,0,160,120);
      var apix = a.data;

      for (var j = 0; j < pix.length/8; j += 640*2*4)
      for (var i = j; i <  j+160*4; i += 4) {
        var b = (i-j)+(j/(640*2*4)*160*4);
        apix[(b)  ] = pix[i  ]; // r
        apix[(b)+1] = pix[i+1]; // g
        apix[(b)+2] = pix[i+2]; // b
        apix[(b)+3] = pix[i+3]; // a
      }

      //tc.getContext('2d').putImageData(a, 0, 0);
      //minimap = tc.getContext('2d');

      context.putImageData(a,480,0,0,0,160,120);
    }

    context.strokeStyle = '#000';
    context.strokeRect(480,0,160,120);
    context.strokeRect(480+((camx*32)/8),0+((camy*32)/8),640/8,480/8);
  }
});

function drawCanvas(cx, cy) {

	for (var y = cy; y < cy+15; y++){
		for (var x = cx; x < cx+20; x++){
			var brush = jQuery("#brush"+level[y][x]);
			if(brush.length){
				context.drawImage(brush[0], (x-camx)*32, (y-camy)*32);
			}else{
				//We didnt find the brush the normal way, check out the char code then...
				var id = level[y][x].charCodeAt(0);
				var brush = jQuery("#brush"+id);
				if(brush.length){
					context.drawImage(brush[0], (x-camx)*32, (y-camy)*32);
				}else{
					console.log("Could not find brush for: "+level[y][x]);
				}
			}
		}
	}
  if (minimap) {
     var tc = document.createElement('canvas');
     tc.setAttribute('width',160);
     tc.setAttribute('height',120);

    var pix = minimap.data;
    var a = tc.getContext('2d').getImageData(0,0,160,120);
    var apix = a.data;

    for (var j = 0; j < pix.length/8; j += 640*2*4)
    for (var i = j; i <  j+160*4; i += 4) {
      var b = (i-j)+(j/(640*2*4)*160*4);
      apix[(b)  ] = pix[i  ]; // r
      apix[(b)+1] = pix[i+1]; // g
      apix[(b)+2] = pix[i+2]; // b
      apix[(b)+3] = pix[i+3]; // a
    }

    //tc.getContext('2d').putImageData(a, 0, 0);
    //minimap = tc.getContext('2d');

    context.putImageData(a,480,0,0,0,160,120);
  }

  context.strokeStyle = '#000';
  context.strokeRect(480,0,160,120);
  context.strokeRect(480+((camx*32)/8),0+((camy*32)/8),640/8,480/8);
}

function getLevelParams() {
  var levelParam = '';
  for (var i = 0; i < 30; i++) {
    levelParam += level[i];
  }
  return levelParam;
}

function redrawMap() {
  new UpdateMap(getLevelCopy());
  historyManager.addLevelState({ name: getLevelName(), date: getCurrentTimestampForFile(), level: getLevelData() })
}

function getLongURL() {
  var url_params = {
    name:  getLevelName(),
    level: getLevelParams(),
	  g:     1
  };
  return window.location.protocol + "//" + window.location.host + window.location.pathname + '?encoded='+compressObject(url_params);
}

function mouseOut() {
  isMouseOut = true;
  mouseOverDelay = 0;
}

var UpdateMap = UndoableAction.extend({
  init: function(value, options) {
    var self = this;
    self.value = value;

    this._super(function() {
      // The "do" method:

      self.oldValue = UpdateMap.priorOldValue;
      loadLevelState(getLevelCopy(self.value));
      UpdateMap.priorOldValue = self.value;
      // reportLevel(self.value, 'new');
      // reportLevel(level, 'current');
      // reportLevel(self.oldValue, 'old');
    }, function() {
      // The "undo" method:

      loadLevelState(self.oldValue);
      UpdateMap.priorOldValue = getLevelCopy(self.oldValue);
    });

    self.redo();
  }
});

if (!getURLParam('g')) {
  // If we want the editor

  // Load the default brush, #4
  brush = '4';

  camx = 0;
  camy = 0;
  px = -100;
  py = -100;

  mouseOverDelay = 0;
  isMouseOut = false;

  $(function() {
    $('#level_saving').downloadify({
      swf:           'resources/flash/downloadify.swf',
      downloadImage: 'images/save_level_92x128.png',
      width:         92,
      height:        32,
      filename:      getFilenameForSave,
      data:          getLevelDataForSaveFile
    });
  })

  setInterval (function() { mouseOverDelay++; }, 100);
}