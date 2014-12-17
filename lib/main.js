var clone, conservation, conservationMarks, gc, gcMarks, gcgcMarks, mapping, matrix, matrixMarks, size, svg, transitionConservation, transitionGc, x, y, _i, _j, _k, _l;

clone = function(obj) {
  var flags, key, newInstance;
  if ((obj == null) || typeof obj !== 'object') {
    return obj;
  }
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  if (obj instanceof RegExp) {
    flags = '';
    if (obj.global != null) {
      flags += 'g';
    }
    if (obj.ignoreCase != null) {
      flags += 'i';
    }
    if (obj.multiline != null) {
      flags += 'm';
    }
    if (obj.sticky != null) {
      flags += 'y';
    }
    return new RegExp(obj.source, flags);
  }
  newInstance = new obj.constructor();
  for (key in obj) {
    newInstance[key] = clone(obj[key]);
  }
  return newInstance;
};

svg = d3.select("body").append("svg").attr({
  width: 1000,
  height: 1000
});

size = 49;

conservation = [];

for (x = _i = 0; 0 <= size ? _i <= size : _i >= size; x = 0 <= size ? ++_i : --_i) {
  conservation[x] = Math.random();
}

gc = [];

for (x = _j = 0; 0 <= size ? _j <= size : _j >= size; x = 0 <= size ? ++_j : --_j) {
  gc[x] = Math.random();
}

matrix = [];

for (x = _k = 0; 0 <= size ? _k <= size : _k >= size; x = 0 <= size ? ++_k : --_k) {
  for (y = _l = 0; 0 <= size ? _l <= size : _l >= size; y = 0 <= size ? ++_l : --_l) {
    matrix.push({
      x: x,
      y: y,
      value: Math.random()
    });
  }
}

mapping = function(d) {
  var i, m, sortedD, _len, _m;
  m = {};
  sortedD = clone(d);
  sortedD.sort();
  for (i = _m = 0, _len = d.length; _m < _len; i = ++_m) {
    x = d[i];
    m[i] = sortedD.indexOf(x);
  }
  return m;
};

transitionConservation = function() {
  conservationMarks.transition().duration(5000).attr('cx', function(d, i) {
    return mapping(conservation)[i] * 2;
  });
  matrixMarks.transition().duration(5000).attr('x', function(d) {
    return mapping(conservation)[d.x] * 2;
  });
};

transitionGc = function() {
  gcMarks.transition().duration(5000).attr('cy', function(d, i) {
    return mapping(gc)[i] * 2;
  });
  gcgcMarks.transition().duration(5000).attr('y', function(d, i) {
    return mapping(gc)[i] * 2;
  });
  return matrixMarks.transition().duration(5000).attr('y', function(d) {
    return mapping(gc)[d.y] * 2;
  });
};

conservationMarks = svg.selectAll("circle.conservation").data(conservation).enter().append("circle").attr({
  cx: function(d, i) {
    return i * 2;
  },
  cy: function(d) {
    return d * 20;
  },
  r: 2,
  "class": 'conservation',
  transform: 'translate(150,100)'
}).style({
  fill: 'red'
});

conservationMarks.append("svg:title").text(function(d) {
  return d;
});

gcMarks = svg.selectAll("circle.gc").data(gc).enter().append("circle").attr({
  cx: function(d) {
    return d * 20;
  },
  cy: function(d, i) {
    return i * 2;
  },
  r: 2,
  "class": 'gc',
  transform: 'translate(100,150)'
}).style({
  fill: 'green'
});

gcMarks.append("svg:title").text(function(d) {
  return d;
});

matrixMarks = svg.selectAll("rect.matrix").data(matrix).enter().append("rect").attr({
  x: function(d) {
    return d.x * 2;
  },
  y: function(d) {
    return d.y * 2;
  },
  width: 2,
  height: 2,
  "class": 'matrix',
  transform: 'translate(150,150)'
}).style({
  fill: 'blue',
  opacity: function(d) {
    return d.value;
  }
});

matrixMarks.append("svg:title").text(function(d) {
  return d.value;
});

svg.selectAll("circle.gc2").data(gc).enter().append("circle").attr({
  cx: function(d, i) {
    return i * 2;
  },
  cy: function(d) {
    return d * 20;
  },
  r: 2,
  "class": 'gc2',
  transform: 'translate(0,120)'
}).style({
  fill: 'green'
});

gcgcMarks = svg.selectAll("rect.gcgc").data(gc).enter().append("rect").attr({
  x: function(d, i) {
    return i * 2;
  },
  y: function(d, i) {
    return i * 2;
  },
  width: 2,
  height: 2,
  "class": 'gcgc',
  transform: 'translate(0,150)'
}).style({
  fill: 'grey'
});

svg.append('rect').attr({
  x: 500,
  y: 300,
  width: 20,
  height: 20
}).style({
  fill: 'grey'
}).on("click", function() {
  return transitionConservation();
});

svg.append('rect').attr({
  x: 550,
  y: 300,
  width: 20,
  height: 20
}).style({
  fill: 'grey'
}).on("click", function() {
  return transitionGc();
});
