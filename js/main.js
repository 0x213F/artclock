// intially draw the canvas
resizeCanvas(window);

// first animation
// setTimeout(draw, 800);

let d     = new Date();
    delay = 60000 - d.getSeconds() * 1000 + d.getMilliseconds();
setTimeout(function() {
    draw();
    setInterval(draw, 2000);
}, 800)
