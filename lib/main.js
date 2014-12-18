var clone, conservation, conservationMarks, conservationSorted, conservationconservationMarks, gc, gcMarks, gcSorted, gcgcMarks, mapping, mappingConservation, mappingGc, matrix, matrixMarks, padding, size, svg, transitionConservation, transitionDuration, transitionGc, translationMainMatrixX, translationMainMatrixY, x, y, _i, _j, _k, _l;

Array.prototype.chunk = function(chunkSize) {
  var array;
  array = this;
  return [].concat.apply([], array.map(function(elem, i) {
    if (i % chunkSize) {
      return [];
    } else {
      return [array.slice(i, i + chunkSize)];
    }
  }));
};

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

padding = 10;

size = 99;

translationMainMatrixX = padding + size * 2 + padding + 20 + padding;

translationMainMatrixY = padding + size * 2 + padding + 20 + padding;

transitionDuration = 1000;

conservationSorted = false;

gcSorted = false;

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

mappingConservation = mapping(conservation);

mappingGc = mapping(gc);

transitionConservation = function() {
  if (conservationSorted) {
    conservationMarks.transition().duration(transitionDuration).attr('cx', function(d, i) {
      return i * 2;
    });
    conservationconservationMarks.transition().duration(transitionDuration).attr('x', function(d, i) {
      return i * 2;
    });
    matrixMarks.transition().duration(transitionDuration).attr('x', function(d) {
      return d.x * 2;
    });
    conservationSorted = false;
  } else {
    conservationMarks.transition().duration(transitionDuration).attr('cx', function(d, i) {
      return mappingConservation[i] * 2;
    });
    conservationconservationMarks.transition().duration(transitionDuration).attr('x', function(d, i) {
      return mappingConservation[i] * 2;
    });
    matrixMarks.transition().duration(transitionDuration).attr('x', function(d) {
      return mappingConservation[d.x] * 2;
    });
    conservationSorted = true;
  }
};

transitionGc = function() {
  if (gcSorted) {
    gcMarks.transition().duration(transitionDuration).attr('cy', function(d, i) {
      return i * 2;
    });
    gcgcMarks.transition().duration(transitionDuration).attr('y', function(d, i) {
      return i * 2;
    });
    matrixMarks.transition().duration(transitionDuration).attr('y', function(d) {
      return d.y * 2;
    });
    return gcSorted = false;
  } else {
    gcMarks.transition().duration(transitionDuration).attr('cy', function(d, i) {
      return mappingGc[i] * 2;
    });
    gcgcMarks.transition().duration(transitionDuration).attr('y', function(d, i) {
      return mappingGc[i] * 2;
    });
    matrixMarks.transition().duration(transitionDuration).attr('y', function(d) {
      return mappingGc[d.y] * 2;
    });
    return gcSorted = true;
  }
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
  transform: 'translate(' + translationMainMatrixX + ',' + (translationMainMatrixY - 20 - padding) + ')'
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
  transform: 'translate(' + (translationMainMatrixX - 20 - padding) + ',' + translationMainMatrixY + ')'
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
  transform: 'translate(' + translationMainMatrixX + ',' + translationMainMatrixY + ')'
}).style({
  fill: 'blue',
  opacity: function(d) {
    return d.value;
  }
});

matrixMarks.append("svg:title").text(function(d) {
  return d.value;
});

svg.selectAll("circle.conservation2").data(conservation).enter().append("circle").attr({
  cx: function(d) {
    return d * 20;
  },
  cy: function(d, i) {
    return i * 2;
  },
  r: 2,
  "class": 'conservation',
  transform: 'translate(' + (padding + size * 2 + padding) + ',' + padding + ')'
}).style({
  fill: 'red'
});

conservationconservationMarks = svg.selectAll("rect.conservationconservation").data(conservation).enter().append("rect").attr({
  x: function(d, i) {
    return i * 2;
  },
  y: function(d, i) {
    return i * 2;
  },
  width: 4,
  height: 4,
  "class": 'conservationconservation',
  transform: 'translate(' + translationMainMatrixX + ',' + padding + ')'
}).style({
  fill: 'grey'
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
  transform: 'translate(' + padding + ',' + (translationMainMatrixY - 20 - padding) + ')'
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
  width: 4,
  height: 4,
  "class": 'gcgc',
  transform: 'translate(' + padding + ',' + translationMainMatrixY + ')'
}).style({
  fill: 'grey'
});

svg.append('rect').attr({
  x: padding,
  y: padding,
  width: 20,
  height: 20
}).style({
  fill: 'grey'
}).on("click", function() {
  return transitionConservation();
});

svg.append('rect').attr({
  x: padding * 2 + 20,
  y: padding,
  width: 20,
  height: 20
}).style({
  fill: 'grey'
}).on("click", function() {
  return transitionGc();
});
