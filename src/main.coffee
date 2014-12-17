clone = (obj) ->
  if not obj? or typeof obj isnt 'object'
    return obj

  if obj instanceof Date
    return new Date(obj.getTime()) 

  if obj instanceof RegExp
    flags = ''
    flags += 'g' if obj.global?
    flags += 'i' if obj.ignoreCase?
    flags += 'm' if obj.multiline?
    flags += 'y' if obj.sticky?
    return new RegExp(obj.source, flags) 

  newInstance = new obj.constructor()

  for key of obj
    newInstance[key] = clone obj[key]

  return newInstance


svg = d3.select("body").append("svg").attr({width: 1000, height: 1000})

size = 49

# Generate the data
conservation = []
for x in [0..size]
	conservation[x] = Math.random()

gc = []
for x in [0..size]
	gc[x] = Math.random()

matrix = []
for x in [0..size]
	for y in [0..size]
		matrix.push({x:x, y:y, value:Math.random()})

# Create mapping function for sorting
#   This function returns the new (sorted) index
#   ['b','e','a','f','d','c']
#   => [old: new, old:new, old:new, ...]
#   => {1:2,2:5,3:1,4:6,5:6,6:3}
mapping = (d) ->
	m = {}
	sortedD = clone(d)
	sortedD.sort()
	for x,i in d
		m[i] = sortedD.indexOf(x)
	return m

transitionConservation = () ->
	conservationMarks
		.transition()
		.duration(5000)
		.attr('cx', (d,i) -> mapping(conservation)[i]*2 )
	matrixMarks
		.transition()
		.duration(5000)
		.attr('x', (d) -> mapping(conservation)[d.x]*2 )
	return

transitionGc = () ->
	gcMarks
		.transition()
		.duration(5000)
		.attr('cy', (d,i) -> mapping(gc)[i]*2 )
	gcgcMarks
		.transition()
		.duration(5000)
		.attr('y', (d,i) -> mapping(gc)[i]*2 )
	matrixMarks
		.transition()
		.duration(5000)
		.attr('y', (d) -> mapping(gc)[d.y]*2 )

# Draw everything
conservationMarks = svg.selectAll("circle.conservation")
	.data(conservation)
	.enter()
	.append("circle")
	.attr({
		cx: (d,i) -> i*2
		cy: (d) -> d*20
		r: 2
		class: 'conservation'
		transform: 'translate(150,100)'
	})
	.style({
		fill: 'red'
	})
conservationMarks.append("svg:title")
	.text( (d) -> return d )

gcMarks = svg.selectAll("circle.gc")
	.data(gc)
	.enter()
	.append("circle")
	.attr({
		cx: (d) -> d*20
		cy: (d,i) -> i*2
		r: 2
		class: 'gc'
		transform: 'translate(100,150)'
	})
	.style({
		fill: 'green'
	})
gcMarks.append("svg:title")
	.text( (d) -> return d )

matrixMarks = svg.selectAll("rect.matrix")
	.data(matrix)
	.enter()
	.append("rect")
	.attr({
		x: (d) -> d.x*2
		y: (d) -> d.y*2
		width: 2
		height: 2
		class: 'matrix'
		transform: 'translate(150,150)'
	})
	.style({
		fill: 'blue'
		opacity: (d) -> d.value
	})
matrixMarks.append("svg:title")
	.text( (d) -> return d.value )

# Transition matrices
svg.selectAll("circle.gc2")
	.data(gc)
	.enter()
	.append("circle")
	.attr({
		cx: (d,i) -> i*2
		cy: (d) -> d*20
		r: 2
		class: 'gc2'
		transform: 'translate(0,120)'
	})
	.style({
		fill: 'green'
	})
gcgcMarks = svg.selectAll("rect.gcgc")
	.data(gc)
	.enter()
	.append("rect")
	.attr({
		x: (d,i) -> i*2
		y: (d,i) -> i*2
		width: 2
		height: 2
		class: 'gcgc'
		transform: 'translate(0,150)'
	})
	.style({
		fill: 'grey'
	})

# Buttons to press
svg.append('rect')
	.attr({
		x: 500,
		y: 300,
		width: 20,
		height: 20
	})
	.style({
		fill: 'grey'
	})
	.on("click", () -> transitionConservation() )
svg.append('rect')
	.attr({
		x: 550,
		y: 300,
		width: 20,
		height: 20
	})
	.style({
		fill: 'grey'
	})
	.on("click", () -> transitionGc() )