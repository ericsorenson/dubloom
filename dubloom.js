function dubloom() {

    // quit if canvas tag not supported
    if (!Modernizr.canvas) {
        return false;
    }
    
    // create references to the canvas
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;  

    // background
    var backgroundGradient = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, height / 1.1);
    backgroundGradient.addColorStop(0, '#444');
    backgroundGradient.addColorStop(1, '#000');

    // circle collection
    var circles = [];

    // circle colors
    var green = 'rgba(50,255,0, 1)';
    var lightGreen = 'rgba(150,255,0, 1)';
    var lighterGreen = 'rgba(200,255,0, 1)';
    var yellow = 'rgba(255,255,0, 1)';
    var orange = 'rgba(255,200,0, 1)';
    var red = 'rgba(255,0,0, 1)';

    // notes
    var note1 = ["sine",0.0000,0.1000,0.0000,2.0000,1.0000,1.0000,20.0000,100.0000,2400.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000];
    var note2 = ["sine",0.0000,0.1000,0.0000,2.0000,1.0000,1.0000,20.0000,200.0000,2400.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000];
    var note3 = ["sine",0.0000,0.1000,0.0000,2.0000,1.0000,1.0000,20.0000,400.0000,2400.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000];
    var note4 = ["sine",0.0000,0.1000,0.0000,2.0000,1.0000,1.0000,20.0000,600.0000,2400.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000];
    var note5 = ["sine",0.0000,0.1000,0.0000,2.0000,1.0000,1.0000,20.0000,800.0000,2400.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000];
    var note6 = ["sine",0.0000,0.1000,0.0000,2.0000,1.0000,1.0000,20.0000,1000.0000,2400.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000];

    function play() {
        drawBackground();  
        drawCircles();
    }

    function drawBackground() {
        context.globalAlpha = 1.0;
        context.fillStyle = backgroundGradient;
        context.fillRect(0, 0, width, height);
    }

    function drawCircles() {
        for (var i=0; i < circles.length; i++) {
            context.fillStyle = circles[i].color;
            context.globalAlpha = circles[i].alpha;
            context.beginPath();
            context.arc(circles[i].x, circles[i].y, circles[i].radius, 0, Math.PI*2, true);
            context.closePath();
            context.fill();
            circles[i].alpha -= .005;
            circles[i].radius += .5;
            if(circles[i].alpha < 0) {
                circles[i].alpha = 1;
                circles[i].radius = 1;
                circles[i].note.play();
            }
        }
    }

    function addCircle(x, y) {
        var circle = {};
        circle.x = x;
        circle.y = y;
        circle.radius = 1;
        if (x < width/6) {
            circle.color = red;
            circle.noteParams = note1;
        } else if (x < 2*width/6) {
            circle.color = orange;
            circle.noteParams = note2;
        } else if (x < 3*width/6) {
            circle.color = yellow;
            circle.noteParams = note3;
        } else if (x < 4*width/6) {
            circle.color = lighterGreen;
            circle.noteParams = note4;
        } else if (x < 5*width/6) {
            circle.color = lightGreen;
            circle.noteParams = note5;
        } else {
            circle.color = green;
            circle.noteParams = note6;
        }
        circle.alpha = 1.0;
        
        // create the sound for this circle
        var params = jsfxlib.arrayToParams(circle.noteParams);
        var data = jsfx.generate(params);
        circle.note = audio.make(data);

        // play the sound as the user clicks
        circle.note.play();

        // add the new circle to the collection
        circles.push(circle);
    }

    function eventMouseUp(event) {
        var mouseX;
        var mouseY;

        if (event.layerX || event.layerX == 0) { // Firefox
            mouseX = event.layerX ;
            mouseY = event.layerY;
        } else if (event.offsetX || event.offsetX == 0) { // Opera or WebKit

            mouseX = event.offsetX;
            mouseY = event.offsetY;
        }
        
        // fixes positioning in Chrome
        // mouseX -= canvas.offsetLeft;
        // mouseY -= canvas.offsetTop;

        addCircle(mouseX, mouseY);
    }

    canvas.addEventListener("mouseup", eventMouseUp, false);

    function reset() {
        circles.length = 0;
    }

    // begin the entire process
    var FRAME_RATE = 30;
    var intervalTime = 1000 / FRAME_RATE;
    setInterval( play, intervalTime );
}

window.addEventListener('load', eventWindowLoaded, false);    

function eventWindowLoaded() {
    dubloom();
}

