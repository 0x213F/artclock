/*
  canvas.width     : width of the screen
  canvas.height    : height of the screen
  canvas           : used to manipulate the canvas
  context          : used to draw on the canvas
*/

function drawClocks() {

    // initialize [x, y] coords and length
    var x = 0,
        y = 0,
        l = 0;

    // assign coordinates to center of screen
    if(canvas.width > canvas.height) {
        x = (canvas.width - canvas.height) / 2;
        l = canvas.height;
    } else {
        y = (canvas.height - canvas.width) / 2;
        l = canvas.width;
    }

    x += l/2;                 // xcoord for origin
    y += l/2;                 // ycoord for origin
    l = l/2 - l*padding/100;  // outter loop radius.

    context.rect(x-l/2,y-l,l,2*l)
    context.stroke();

}

function drawHourHand() {

}

function drawMinuteHand() {

}
