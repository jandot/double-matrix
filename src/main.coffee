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

padding = 10

size = 99
translationMainMatrixX = padding + size*2 + padding + 20 + padding
translationMainMatrixY = padding + size*2 + padding + 20 + padding

transitionDuration = 1000

conservationSorted = false
gcSorted = false

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

mappingConservation = mapping(conservation)
mappingGc = mapping(gc)

transitionConservation = () ->
	if conservationSorted
		conservationMarks
			.transition()
			.duration(transitionDuration )
			.attr('cx', (d,i) -> i*2 )
		conservationconservationMarks
			.transition()
			.duration(transitionDuration )
			.attr('x', (d,i) -> i*2 )
		matrixMarks
			.transition()
			.duration(transitionDuration )
			.attr('x', (d) -> d.x*2 )
		conservationSorted = false
	else
		conservationMarks
			.transition()
			.duration(transitionDuration )
			.attr('cx', (d,i) -> mappingConservation[i]*2 )
		conservationconservationMarks
			.transition()
			.duration(transitionDuration )
			.attr('x', (d,i) -> mappingConservation[i]*2 )
		matrixMarks
			.transition()
			.duration(transitionDuration )
			.attr('x', (d) -> mappingConservation[d.x]*2 )
		conservationSorted = true
	return

transitionGc = () ->
	if gcSorted
		gcMarks
			.transition()
			.duration(transitionDuration )
			.attr('cy', (d,i) -> i*2 )
		gcgcMarks
			.transition()
			.duration(transitionDuration )
			.attr('y', (d,i) -> i*2 )
		matrixMarks
			.transition()
			.duration(transitionDuration )
			.attr('y', (d) -> d.y*2 )
		gcSorted = false
	else
		gcMarks
			.transition()
			.duration(transitionDuration )
			.attr('cy', (d,i) -> mappingGc[i]*2 )
		gcgcMarks
			.transition()
			.duration(transitionDuration )
			.attr('y', (d,i) -> mappingGc[i]*2 )
		matrixMarks
			.transition()
			.duration(transitionDuration )
			.attr('y', (d) -> mappingGc[d.y]*2 )
		gcSorted = true

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
		transform: 'translate(' + translationMainMatrixX + ',' + (translationMainMatrixY - 20 - padding) + ')'
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
		transform: 'translate(' + (translationMainMatrixX - 20 - padding) + ',' + translationMainMatrixY + ')'
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
		transform: 'translate(' + translationMainMatrixX + ',' + translationMainMatrixY + ')'
	})
	.style({
		fill: 'blue'
		opacity: (d) -> d.value
	})
matrixMarks.append("svg:title")
	.text( (d) -> return d.value )

# Transition matrices
svg.selectAll("circle.conservation2")
	.data(conservation)
	.enter()
	.append("circle")
	.attr({
		cx: (d) -> d*20
		cy: (d,i) -> i*2
		r: 2
		class: 'conservation'
		transform: 'translate(' + (padding + size*2 + padding) + ',' + padding + ')'
	})
	.style({
		fill: 'red'
	})
conservationconservationMarks = svg.selectAll("rect.conservationconservation")
	.data(conservation)
	.enter()
	.append("rect")
	.attr({
		x: (d,i) -> i*2
		y: (d,i) -> i*2
		width: 4
		height: 4
		class: 'conservationconservation'
		transform: 'translate(' + translationMainMatrixX + ',' + padding + ')'
	})
	.style({
		fill: 'grey'
	})

svg.selectAll("circle.gc2")
	.data(gc)
	.enter()
	.append("circle")
	.attr({
		cx: (d,i) -> i*2
		cy: (d) -> d*20
		r: 2
		class: 'gc2'
		transform: 'translate(' + padding + ',' + (translationMainMatrixY - 20 - padding) + ')'
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
		width: 4
		height: 4
		class: 'gcgc'
		transform: 'translate(' + padding + ',' + translationMainMatrixY + ')'
	})
	.style({
		fill: 'grey'
	})

# Buttons to press
svg.append('rect')
	.attr({
		x: padding,
		y: padding,
		width: 20,
		height: 20
	})
	.style({
		fill: 'grey'
	})
	.on("click", () -> transitionConservation() )
svg.append('rect')
	.attr({
		x: padding*2 + 20,
		y: padding,
		width: 20,
		height: 20
	})
	.style({
		fill: 'grey'
	})
	.on("click", () -> transitionGc() )