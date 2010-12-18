var params = $.deparam.querystring();

$(function() {
  $('#imageView').mouseup(function() {
    if ($('#toggle_autoupdate input:checked').length) {
      redrawMap();
    }
  });

  $('<label id="toggle_autoupdate"><input type="checkbox" checked = "checked"/>auto-update</label>').appendTo('#admin_buttons').find('input').change(function() {
    if ($(this).attr('checked')) {
      redrawMap();
    }
  });

  $('<label id="toggle_autoupdate"><input type="checkbox" checked = "checked"/>auto-update</label>').appendTo('#admin_buttons').find('input').change(function() {
    if ($(this).attr('checked')) {
      redrawMap();
    }
  });

  $('<div style="display: inline"><a href="#" style="padding-right: 1px; padding-left: 3px;">Undo</a><a href="#" style="margin-left: 3px; padding-left: 6px; border-left: 1px solid #999">Redo</a></div>').appendTo('#undo_counter').find("a:contains('Undo')").click(function() {
    $().undo();
  }).parent().find("a:contains('Redo')").click(function() {
    $().redo();
  });

  $('#generate_url').click(function() {
    generateShortURL();

    return false;
  });

  if (params.name) {
    $('#level_name input').val(params.name);
  }

  $('.credits a').attr('target', '_blank');
})

// This gets run first thing after all non-bottom-scripts static HTML content inside of body has been read
function initBottom() {
  $('.fulltext').hide();
  $('.shorttext').click(function() {
    $(this).hide().siblings('.fulltext').show();
  });

  loadPalette();
  initEditor();
}

function loadPalette() {
  imgs = [];
  for(var i = 0; i < 10; i++) {
    var img = new Image();
    img.src = 'resources/palettes/default/' + i.toString() + '.png';
    img.id = 'brush' + i;
    img.setAttribute("class", "brush");
    $(img).appendTo('#palette');
  }
}

var testAction = new UndoableAction(function() {}, function() {});

afterEditorLoad = function() {
  // setLevel(["0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "1111111110000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "1111111111111111111111111111111111111111"]);

  // setLevel(["0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "7888876880000000000000000000000000000000", "1111111110000000000000000000000000000000", "4444444440000000000000000000000000000000", "4444444440000000000000000000000000000000", "4444444440000000000000000000000000000000", "4444444440000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "0000000000000000000000000000000000000000", "1111111111111111111111111111111111111111"]);
}