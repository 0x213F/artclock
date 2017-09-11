var canvas = document.getElementById('main'),
    context = canvas.getContext('2d'),
    padding = 25;

window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function draw() {
    requestAnimationFrame(draw);
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawClocks();
    drawHourHand();
    drawMinuteHand();
}

/*
    http://stackoverflow.com/questions/4288253/html5-canvas-100-width-height-of-viewport
*/
