(function() {

  (function() {
    var dubloom, supportsCanvas, supportsWebAudio;
    supportsCanvas = function() {
      return !!document.createElement('canvas').getContext;
    };
    supportsWebAudio = function() {
      if (typeof webkitAudioContext === 'undefined') {
        alert("Bummer, this browser doesn't support the Web Audio API yet.");
        return false;
      }
      return true;
    };
    dubloom = function() {
      var addCircle, audioContext, backgroundGradient, canvas, canvasContext, circles, drawBackground, drawCircles, eventMouseUp, frameRate, green, greenYellow, intervalTime, loadSound, orange, play, playSound, red, soundBuffer, yellow, yellowGreen;
      canvas = document.getElementById('dubloom');
      canvasContext = canvas.getContext('2d');
      backgroundGradient = canvasContext.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.height / 1.1);
      backgroundGradient.addColorStop(0, '#333');
      backgroundGradient.addColorStop(1, '#000');
      green = 'rgba(50,255,0, 1)';
      greenYellow = 'rgba(150,255,0, 1)';
      yellowGreen = 'rgba(200,255,0, 1)';
      yellow = 'rgba(255,255,0, 1)';
      orange = 'rgba(255,200,0, 1)';
      red = 'rgba(255,0,0, 1)';
      drawBackground = function() {
        canvasContext.globalAlpha = 1.0;
        canvasContext.fillStyle = backgroundGradient;
        return canvasContext.fillRect(0, 0, canvas.width, canvas.height);
      };
      drawCircles = function() {
        var circle, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = circles.length; _i < _len; _i++) {
          circle = circles[_i];
          canvasContext.fillStyle = circle.color;
          canvasContext.globalAlpha = circle.alpha;
          canvasContext.beginPath();
          canvasContext.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);
          canvasContext.closePath();
          canvasContext.fill();
          circle.alpha -= 0.005;
          circle.radius += 0.5;
          if (circle.alpha < 0) {
            circle.alpha = 1;
            circle.radius = 1;
            _results.push(playSound(circle.pitch));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      audioContext = new webkitAudioContext();
      soundBuffer = void 0;
      loadSound = function(url, callback) {
        var request;
        request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        request.onload = function() {
          return audioContext.decodeAudioData(request.response, function(buffer) {
            soundBuffer = buffer;
            return callback();
          });
        };
        return request.send();
      };
      playSound = function(pitch) {
        var source;
        source = audioContext.createBufferSource();
        source.buffer = soundBuffer;
        source.connect(audioContext.destination);
        source.playbackRate.value = pitch;
        return source.noteOn(0);
      };
      circles = [];
      addCircle = function(x, y) {
        var circle;
        circle = {};
        circle.x = x;
        circle.y = y;
        circle.radius = 1;
        if (x < canvas.width / 6) {
          circle.color = red;
          circle.pitch = 1;
        } else if (x < 2 * canvas.width / 6) {
          circle.color = orange;
          circle.pitch = 2;
        } else if (x < 3 * canvas.width / 6) {
          circle.color = yellow;
          circle.pitch = 3;
        } else if (x < 4 * canvas.width / 6) {
          circle.color = greenYellow;
          circle.pitch = 4;
        } else if (x < 5 * canvas.width / 6) {
          circle.color = yellowGreen;
          circle.pitch = 5;
        } else {
          circle.color = green;
          circle.pitch = 6;
        }
        circle.alpha = 1.0;
        playSound(circle.pitch);
        return circles.push(circle);
      };
      eventMouseUp = function(event) {
        var x, y;
        if (event.pageX || event.pageY) {
          x = event.pageX;
          y = event.pageY;
        } else {
          x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        x -= canvas.offsetLeft;
        y -= canvas.offsetTop;
        return addCircle(x, y);
      };
      canvas.addEventListener('mouseup', eventMouseUp, false);
      play = function() {
        drawBackground();
        return drawCircles();
      };
      frameRate = 30;
      intervalTime = 1000 / frameRate;
      return loadSound('tone.mp3', function() {
        return setInterval(play, intervalTime);
      });
    };
    return window.onload = function() {
      if (supportsCanvas() && supportsWebAudio()) {
        return dubloom();
      }
    };
  })();

}).call(this);
