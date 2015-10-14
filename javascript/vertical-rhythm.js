(function() {
  var body, establish_vertical_rhythm, float, integer, last, missing_space, rhythm, u, unit;

  unit = function(value) {
    return last(value.match(/[a-z]+/g));
  };

  float = function(value) {
    return parseFloat(value);
  };

  integer = function(value) {
    return Math.round(parseFloat(value));
  };

  last = function(array) {
    return array[array.length - 1];
  };

  missing_space = function(num) {
    var lines;
    lines = Math.floor(num / rhythm) + 1;
    return lines * rhythm - num;
  };

  body = $('body').css('line-height');

  rhythm = float(body);

  u = unit(body);

  establish_vertical_rhythm = function() {
    return $('*[data-vertical-rhythm="true"]').each(function() {
      var h, padding;
      h = float($(this).height());
      padding = missing_space(h);
      return $(this).css('padding-bottom', "" + padding + u);
    });
  };

  $(window).resize(establish_vertical_rhythm);

  establish_vertical_rhythm();

}).call(this);


$(window).load(function() {
    $('img').keepTheRhythm({baseLine: 24});
    $('svg').keepTheRhythm({baseLine: 24});


    });
