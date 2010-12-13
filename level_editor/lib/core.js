function loadImage(path, callback) {
  var image = new Image();
  image.src = path;
  if (callback) {
    image.onload = callback;
  }
  return image;
}

function timestamp() {
  return new Date().getTime();
}

function getCurrentTimestampForFile() {
  return dateFormat(timestamp(), 'yyyy-mm-dd__HH-MM-ss');
}

function getCurrentTimestamp() {
  return dateFormat('ddd, mmm ddS, yyyy HH:MM:ss');
}

function requireLib(libraryName) {
  document.write('<script type="text/javascript" src="' + libraryName + '"><\/script>');
}

var undoCounter = 0;

var UndoableAction = Klass.extend({
  init: function(do_func, undo_func, options){
    // this.parent = jQuery(parent);
    this.options   = options || {};
    this.do_func   = do_func;
    this.undo_func = undo_func;
    this.counter = 0;
  },

  do: function() {
    var action = this;
    this.counter++;
    var my_num = this.counter;
    // console.log('making ' + my_num);

    $().undoable(function() {
      // console.log('doing #' + my_num);
      action.do_func();
      Undos.updateCounter();
    }, function() {
      // console.log('undoing #' + my_num);
      action.undo_func();
      Undos.updateCounter();
    });

    Undos.updateCounter();
  },

  undo: function() {
    console.log('un-doing');
  }
});

var UpdateValue = UndoableAction.extend({
  init: function(value, options) {
    var self = this;
    self.value = value;

    this._super(function() {
      self.oldValue = UpdateValue.priorOldValue;
      loadValue(self.value);
      UpdateValue.priorOldValue = self.value;
    }, function() {
      loadValue(self.oldValue);
      UpdateValue.priorOldValue = self.oldValue;
    });

    self.do();
  }
});

var Undos = {
  updateCounter: function() {
    $('#undo_counter span').text(Undos.getNumUndoFunctions());
  },

  getNumUndoFunctions: function() {
    var allUndoFuncs = jQuery('body').data('undoFunctions');

    if (allUndoFuncs) {
      return undoCounter = allUndoFuncs.length;
    } else {
      return undoCounter = 0;
    }
  }
}

function readTextFile(file, callback) {
  var reader = new FileReader();

  // Closure to capture the file information.
  reader.onload = (function(theFile) {
    return function(e) {
      callback(e, theFile);
    };
  })(file);

  // Read in the image file as a data URL.
  return reader.readAsText(file);
}