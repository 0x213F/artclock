// initialize the canvas
let canvas = document.getElementById('main'),
    context = canvas.getContext('2d'),
    padding = 10;

// resize the canvas when the screen is resized
window.addEventListener('resize', function() {
    resizeCanvas(window, canvas, padding, rendering_function);
}, false);

/**
 * Resize canvas
 * @param {Object} window
 * @param {Object} canvas
 * @param {Number} padding
 * @return {Undefined}
 */
function resizeCanvas({
                         innerWidth       : width,
                         innerHeight      : height,
                         devicePixelRatio : scale
                      }) {

    // is there nothing to draw?
    if(height < 2*padding || width < 2*padding) {
        throw 'Padding is larger than view'
    }

    // style the width
    canvas.width  = (width - 2*padding) * scale;
    canvas.style.width = (width - 2*padding) + 'px';

    // style the height
    canvas.height = (height - 2*padding) * scale;
    canvas.style.height = (height - 2*padding) + 'px';

    // give proper padding
    canvas.style.top  = padding + 'px';
    canvas.style.left = padding + 'px';

    return rendering_function();
}

/**
 * draw canvas
 * @param {Boolean} clear
 * @param {Boolean} animate
 * @param {Function} rendering_function
 * @param {Object} canvas
 * @param {Object} context
 * @return {Function}
 */
function draw() {

    // recursively redraw the canvas at screen refresh rate
    requestAnimationFrame(draw);

    // wipe the canvas clean
    context.clearRect(0, 0, canvas.width, canvas.height);

    // paint!
    return rendering_function();
}
