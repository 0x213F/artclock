// change the background color
const url            = new URL(window.location.href);
const clock_color = url.searchParams.get('clockColor') ? '#' + url.searchParams.get('clockColor') : 'white';
document.body.style.backgroundColor = clock_color;

// intially draw the canvas
resizeCanvas(window);

// first animation
// setTimeout(draw, 800);

let d     = new Date();
    delay = 60000 - d.getSeconds() * 1000 + d.getMilliseconds();
setTimeout(function() {
    draw();
    setInterval(draw, 60000);
}, delay + 1)
