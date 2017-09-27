////////////////////////////////////////////////////////////////////////////////

/**
 * Resize canvas
 * @param {Object} window
 * @return {Undefined}
 */

function resizeCanvas({
                         innerWidth       : width,
                         innerHeight      : height,
                         devicePixelRatio : scale
                      }) {

    // is there nothing to draw?
    if(height < 2*padding || width < 2*padding) {
        throw 'Padding is larger than view';
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

    // draw the clocks
    return renderingFunction();
}

////////////////////////////////////////////////////////////////////////////////

/**
 * Draw canvas
 * @return {Undefined}
 */

function draw() {

    // only allow one animation at a time
    if(is_drawing) {
        return;
    } else {
        is_drawing = true;
    }

    // setup the details for the animation
    let d                = new Date();
    let transition_time  = 1600;

        // time = (Number(time.join('')) + 1).toString();
        // while(time.length !== 4) time = '0' + time;
        // time = time.split('');

        time[0]          = Math.floor(d.getHours() / 10);
        time[1]          = d.getHours() % 10;
        time[2]          = Math.floor(d.getMinutes() / 10);
        time[3]          = d.getMinutes() % 10;
        animation.start  = [null,null,null,null];
        animation.finish = [null,null,null,null];
        animation.et     = d.getTime() + transition_time;
        animation.st     = d.getTime();
        animation.tt     = transition_time;

    // assign the starting and ending values

    for(let i in animation.start) {    // TODO faster deep copy
        animation.start[i]  = JSON.parse(JSON.stringify(clock[i]));
        animation.finish[i] = JSON.parse(JSON.stringify(hand_positions[time[i]]));
    }

    // add radian offset for more dramatic animation
    for(let i in animation.finish) {
        for(let j in animation.finish[i]) {
            for(let k in animation.finish[i][j]) {
                if(animation.start[i][j][k][0] === animation.start[i][j][k][0] && animation.start[i][j][k][1] === animation.start[i][j][k][1]) {
                    // nothing here
                } else {
                    animation.finish[i][j][k][0] += 2*pi;
                    animation.finish[i][j][k][1] -= 2*pi;
                }
            }
        }
    }

    // start the animation
    setTimeout(spinHands, 1);
}

////////////////////////////////////////////////////////////////////////////////

/**
 * Animate the clock
 * @return {Undefined}
 */

function spinHands() {

    // animation easing
    const getTime = function(time, total) {

        const url        = new URL(window.location.href);
        const transition = url.searchParams.get('transition');
        const t          = time / total;

        if(transition === 'linear') {
            return t;

        } else  { // if (transition === 'sinusoidal') { // default
            return (1-Math.cos(t*pi)*Math.sign(Math.sin(t*pi)))/2;
        }

    }

    // animation is over
    let d = new Date().getTime();
    if(d > animation.et) {

        for(let i in animation.start) {
            // TODO faster deep copy
            animation.finish[i] = JSON.parse(JSON.stringify(hand_positions[time[i]]));
        }

        for(var i in coords) {
            for(var j=0 ; j<6 ; j++) {
                for(var k=0 ; k<4 ; k++) {
                    let hour_hand_pos,
                        min_hand_pos;
                    if(animation.start[i][j][k][0] === animation.start[i][j][k][0] && animation.start[i][j][k][1] === animation.start[i][j][k][1]) {
                        hour_hand_pos = animation.finish[i][j][k][0];
                        min_hand_pos = animation.finish[i][j][k][1];
                    } else {
                        hour_hand_pos = animation.start[i][j][k][0] - 2*pi;
                        min_hand_pos = animation.start[i][j][k][1] + 2*pi;
                    }
                    clock[i][j][k] = [hour_hand_pos, min_hand_pos];
                }
            }
        }

    // animation is still going
    } else {

        requestAnimationFrame(spinHands);
        is_drawing = false;
        let t = getTime((d - animation.st), animation.tt);

        for(var i in coords) {
            for(var j=0 ; j<6 ; j++) {
                for(var k=0 ; k<4 ; k++) {
                    let hour_hand_pos = animation.start[i][j][k][0] + (animation.finish[i][j][k][0] - animation.start[i][j][k][0]) * t;
                    let min_hand_pos = animation.start[i][j][k][1] + (animation.finish[i][j][k][1] - animation.start[i][j][k][1]) * t;
                    clock[i][j][k] = [hour_hand_pos, min_hand_pos];
                }
            }
        }


    }

    // draw the clocks
    renderingFunction();
}

////////////////////////////////////////////////////////////////////////////////

/**
 * Draw the clocks
 * @return {Undefined}
 */
function renderingFunction() {

    // clear the canvas from last frame
    context.clearRect(0, 0, canvas.width, canvas.height);

    // define size of canvas
    let height = canvas.height,
        width  = canvas.width,
        scale  = window.devicePixelRatio;

    let horizontal = 3 * height <= width,
        vertical = 1.5 * width <= height,
        middle = {
            x : width/2,
            y : height/2,
        };

    // the can board fit horizontally
    if(horizontal) {

        let digit_width = height / 3 * 2;

        for(let i in coords) {

            let curr        = coords[i];
                curr.x      = i < 2 ? middle.x + digit_width * i - 2.125*digit_width : middle.x + digit_width * i - 1.875*digit_width;
                curr.y      = 0;
                curr.height = height;
                curr.width  = digit_width;
                curr.side   = digit_width / 4;

            //context.rect(curr.x, curr.y, curr.width, curr.height);
            // context.stroke();

        }

    // the board fills the maximum vertical height
    // TODO the board fits vertically at maximum width
    } else if(vertical) {

        let digit_width = width / 8 * 3;

        for(let i in coords) {
            let curr        = coords[i];
                curr.x      = i % 2 === 0 ? middle.x - digit_width : middle.x;
                curr.y      = i < 2       ? middle.y - 1.5*digit_width                     : middle.y;
                curr.height = height / 2;
                curr.width  = digit_width;
                curr.side   = digit_width / 4;

            //context.rect(curr.x, curr.y, curr.width, curr.height);
            // context.stroke();
        }

    } else {

        let digit_width = height / 3;

        for(let i in coords) {
            let curr        = coords[i];
                curr.x      = i % 2 === 0 ? middle.x - digit_width : middle.x;
                curr.y      = i < 2       ? 0                      : middle.y;
                curr.height = height / 2;
                curr.width  = digit_width;
                curr.side   = digit_width / 4;

            //context.rect(curr.x, curr.y, curr.width, curr.height);
            // context.stroke();
        }

    }

    const url            = new URL(window.location.href);
    let background_color = url.searchParams.get('backgroundColor');
    canvas.style.backgroundColor = background_color ? '#' + background_color : 'black';
    const clock_color = url.searchParams.get('clockColor') ? '#' + url.searchParams.get('clockColor') : 'white';
    console.log(clock_color)

    for(let i in coords) {
        let {x, y, height, width, side} = coords[i];
        for(let j=0 ; j<6 ; j++) {
            for(let k=0 ; k<4 ; k++) {

                let get_x = function(x, len, rad) {
                        return x + len * Math.cos(rad);
                    },
                    get_y = function(y, len, rad) {
                        return y - len * Math.sin(rad);
                    },
                    xpos = x+side/2 + side*k,
                    ypos = y+side/2 + side*j;

                let d = new Date();

                let hour_hand_len = side/2 - side/8,
                    hour_hand_rad = clock[i][j][k][0],
                    min_hand_len  = side/2 - side/6,
                    min_hand_rad  = clock[i][j][k][1];

                // draw clock
                context.beginPath();
                context.lineWidth = 1*scale;
                context.strokeStyle = clock_color;
                context.arc(xpos, ypos, side/2 - side/12, 0, 2*Math.PI);
                context.stroke();

                // draw peg
                context.beginPath();
                context.arc(xpos, ypos, 2*scale, 0, 2*Math.PI);
                context.fillStyle = clock_color;
                context.fill();

                // draw hour hand
                context.beginPath();
                context.strokeStyle = clock_color;
                context.lineWidth = 4*scale;
                context.moveTo(xpos, ypos);
                context.lineTo(
                    get_x(xpos, hour_hand_len, hour_hand_rad),
                    get_y(ypos, hour_hand_len, hour_hand_rad)
                );
                context.stroke();

                // draw minute hand
                context.beginPath();
                context.strokeStyle = clock_color;
                context.lineWidth = 4*scale;
                context.moveTo(xpos, ypos);
                context.lineTo(
                    get_x(xpos, min_hand_len, min_hand_rad),
                    get_y(ypos, min_hand_len, min_hand_rad)
                );
                context.stroke();

            }
        }
    }

}
