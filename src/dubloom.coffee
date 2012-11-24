do ->
  supportsCanvas = ->
    !!document.createElement('canvas').getContext

  supportsWebAudio = ->
    if typeof webkitAudioContext is 'undefined'
      alert "Bummer, this browser doesn't support the Web Audio API yet."
      return false
    true

  dubloom = ->
    # create references to the canvas
    canvas = document.getElementById('dubloom')
    canvasContext = canvas.getContext('2d')

    # background gradient
    backgroundGradient = canvasContext.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.height / 1.1)
    backgroundGradient.addColorStop 0, '#333'
    backgroundGradient.addColorStop 1, '#000'

    # circle colors
    green = 'rgba(50,255,0, 1)'
    greenYellow = 'rgba(150,255,0, 1)'
    yellowGreen = 'rgba(200,255,0, 1)'
    yellow = 'rgba(255,255,0, 1)'
    orange = 'rgba(255,200,0, 1)'
    red = 'rgba(255,0,0, 1)'
    drawBackground = ->
      canvasContext.globalAlpha = 1.0
      canvasContext.fillStyle = backgroundGradient
      canvasContext.fillRect 0, 0, canvas.width, canvas.height

    drawCircles = ->
      for circle in circles
        canvasContext.fillStyle = circle.color
        canvasContext.globalAlpha = circle.alpha
        canvasContext.beginPath()
        canvasContext.arc circle.x, circle.y, circle.radius, 0, Math.PI * 2, true
        canvasContext.closePath()
        canvasContext.fill()
        circle.alpha -= 0.005
        circle.radius += 0.5
        if circle.alpha < 0
          circle.alpha = 1
          circle.radius = 1
          playSound circle.pitch

    # create a reference to the audio context
    audioContext = new webkitAudioContext()

    # store a single copy of the audio
    soundBuffer = undefined

    # load an mp3
    loadSound = (url, callback) ->
      request = new XMLHttpRequest()
      request.open 'GET', url, true
      request.responseType = 'arraybuffer'

      # decode asynchronously
      request.onload = ->
        audioContext.decodeAudioData request.response, (buffer) ->
          soundBuffer = buffer
          callback()
      request.send()

    # play the buffered audio at a specified pitch
    playSound = (pitch) ->
      # creates a sound source
      source = audioContext.createBufferSource()
      # tell the source which sound to play
      source.buffer = soundBuffer
      # connect the source to the context's destination (the speakers)
      source.connect audioContext.destination
      source.playbackRate.value = pitch
      # play the source now
      source.noteOn 0

    # circle collection
    circles = []
    addCircle = (x, y) ->
      circle = {}
      circle.x = x
      circle.y = y
      circle.radius = 1
      if x < canvas.width / 6
        circle.color = red
        circle.pitch = 1
      else if x < 2 * canvas.width / 6
        circle.color = orange
        circle.pitch = 2
      else if x < 3 * canvas.width / 6
        circle.color = yellow
        circle.pitch = 3
      else if x < 4 * canvas.width / 6
        circle.color = greenYellow
        circle.pitch = 4
      else if x < 5 * canvas.width / 6
        circle.color = yellowGreen
        circle.pitch = 5
      else
        circle.color = green
        circle.pitch = 6
      circle.alpha = 1.0
      playSound circle.pitch

      # add the new circle to the collection
      circles.push circle

    # listen for clicks
    eventMouseUp = (event) ->
      if event.pageX or event.pageY
        x = event.pageX
        y = event.pageY
      else
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop
      x -= canvas.offsetLeft
      y -= canvas.offsetTop
      addCircle x, y

    canvas.addEventListener 'mouseup', eventMouseUp, false
    play = ->
      drawBackground()
      drawCircles()

    # begin
    frameRate = 30
    intervalTime = 1000 / frameRate

    # when audio is loaded, play
    loadSound 'tone.mp3', ->
      setInterval play, intervalTime

  window.onload = ->
    dubloom() if supportsCanvas() and supportsWebAudio()