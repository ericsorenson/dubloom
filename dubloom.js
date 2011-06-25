window.addEventListener('load', eventWindowLoaded, false);    

function eventWindowLoaded() {
    dubloom();
}

function dubloom() {

    if (!Modernizr.canvas) {
        return false;
    }

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;  

    // circle colors
    var green = 'rgba(50,255,0, 1)';
    var lightGreen = 'rgba(150,255,0, 1)';
    var lighterGreen = 'rgba(200,255,0, 1)';
    var yellow = 'rgba(255,255,0, 1)';
    var orange = 'rgba(255,200,0, 1)';
    var red = 'rgba(255,0,0, 1)';

    // application states
    const STATE_INIT = 0;
    const STATE_WAIT = 1;
    const STATE_WAIT_FOR_LOAD = 2;
    const STATE_TITLE = 3;
    const STATE_PLAY = 4;

    // notes
    const NOTE_1 = ["sine",0.0000,0.1000,0.0000,2.0000,1.0000,1.0000,20.0000,100.0000,2400.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000];
    const NOTE_2 = ["sine",0.0000,0.1000,0.0000,2.0000,1.0000,1.0000,20.0000,200.0000,2400.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000];
    const NOTE_3 = ["sine",0.0000,0.1000,0.0000,2.0000,1.0000,1.0000,20.0000,400.0000,2400.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000];
    const NOTE_4 = ["sine",0.0000,0.1000,0.0000,2.0000,1.0000,1.0000,20.0000,600.0000,2400.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000];
    const NOTE_5 = ["sine",0.0000,0.1000,0.0000,2.0000,1.0000,1.0000,20.0000,800.0000,2400.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000];
    const NOTE_6 = ["sine",0.0000,0.1000,0.0000,2.0000,1.0000,1.0000,20.0000,1000.0000,2400.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000];


    var backgroundGradient = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, height / 1.1);
    backgroundGradient.addColorStop(0, '#444');
    backgroundGradient.addColorStop(1, '#000');

    var circles = [];

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
        for(var i=0; i < circles.length; i++) {
            context.fillStyle = circles[i].color;
            context.globalAlpha = circles[i].alpha;
            context.beginPath();
            context.arc(circles[i].x, circles[i].y, circles[i].radius, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
            circles[i].alpha = circles[i].alpha - .005;
            circles[i].radius = circles[i].radius + .5;
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
        if(x < width/6) {
            circle.color = red;
            circle.noteParams = NOTE_1;
        } else if(x < 2*width/6) {
            circle.color = orange;
            circle.noteParams = NOTE_2;
        } else if(x < 3*width/6) {
            circle.color = yellow;
            circle.noteParams = NOTE_3;
        } else if(x < 4*width/6) {
            circle.color = lighterGreen;
            circle.noteParams = NOTE_4;
        } else if(x < 5*width/6) {
            circle.color = lightGreen;
            circle.noteParams = NOTE_5;
        } else {
            circle.color = green;
            circle.noteParams = NOTE_6;
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

        if(event.layerX || event.layerX == 0) { // Firefox
            mouseX = event.layerX ;
            mouseY = event.layerY;
        } else if(event.offsetX || event.offsetX == 0) { // Opera
            mouseX = event.offsetX;
            mouseY = event.offsetY;
        }

        mouseX -= canvas.offsetLeft;
        mouseY -= canvas.offsetTop;

        addCircle(mouseX, mouseY);
    }

    canvas.addEventListener("mouseup", eventMouseUp, false);

    function reset() {
        circles.length = 0;
    }

    // begin the entire process
    const FRAME_RATE = 30;
    var intervalTime = 1000 / FRAME_RATE;
    setInterval( play, intervalTime );
}

