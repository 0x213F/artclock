function update_clock() {

    // can I use `let` here?
    var getTime = function(time, total) {

        // linear
        return time / total;
    }
    requestAnimationFrame(update_clock);

    let d = new Date().getTime();

    if(d > animation.et) {

        for(let i in animation.start) {

            // TODO faster deep copy
            animation.finish[i] = JSON.parse(JSON.stringify(hand_positions[time[i]]));
        }

        for(var i in coords) {
            for(var j=0 ; j<6 ; j++) {
                for(var k=0 ; k<4 ; k++) {
                    let hour_hand_pos = animation.finish[i][j][k][0];
                    let min_hand_pos = animation.finish[i][j][k][1];

                    // remove the animation constant
                    clock[i][j][k] = [hour_hand_pos - 2*pi, min_hand_pos + 2*pi];
                }
            }
        }
    } else {

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

    rendering_function();
}

/**
 * draw canvas
 * @param {Object} clear
 * @param {Boolean} animate
 * @param {Function} rendering_function
 * @param {Object} canvas
 * @param {Object} context
 * @return {Function}
 */
function rendering_function() {

    context.clearRect(0, 0, canvas.width, canvas.height);

    // define size of canvas
    let height = canvas.height,
        width  = canvas.width,
        scale  = window.devicePixelRatio;

    let horizontal = 3 * height <= width,
        middle = {
            x : width/2,
            y : height/2,
        };

    // the can board fit horizontally
    if(horizontal) {

        let digit_width = height / 3 * 2;

        for(let i in coords) {

            let curr        = coords[i];
                curr.x      = i < 2 ? middle.x + digit_width * i - 2.25*digit_width : middle.x + digit_width * i - 1.75*digit_width;
                curr.y      = 0;
                curr.height = height;
                curr.width  = digit_width;
                curr.side   = digit_width / 4;

            context.rect(curr.x, curr.y, curr.width, curr.height);
            // context.stroke();

        }

    // the board fills the maximum vertical height
    // TODO the board fits vertically at maximum width
    } else {

        let digit_width = height / 3;

        for(let i in coords) {
            let curr        = coords[i];
                curr.x      = i % 2 === 0 ? middle.x - digit_width : middle.x;
                curr.y      = i < 2       ? 0                      : middle.y;
                curr.height = height / 2;
                curr.width  = digit_width;
                curr.side   = digit_width / 4;

            context.rect(curr.x, curr.y, curr.width, curr.height);
            // context.stroke();
        }

    }

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
                context.strokeStyle = "#FFFFFF";
                context.lineWidth = 1*scale;
                context.arc(xpos, ypos, side/2 - side/12, 0, 2*Math.PI);
                context.stroke();

                // draw hour hand
                context.beginPath();
                context.strokeStyle = "#FFFFFF";
                context.lineWidth = 3*scale;
                context.moveTo(xpos, ypos);
                context.lineTo(
                    get_x(xpos, hour_hand_len, hour_hand_rad),
                    get_y(ypos, hour_hand_len, hour_hand_rad)
                );
                context.stroke();

                // draw minute hand
                context.beginPath();
                context.strokeStyle = "#FFFFFF";
                context.lineWidth = 3*scale;
                context.moveTo(xpos, ypos);
                context.lineTo(
                    get_x(xpos, min_hand_len, min_hand_rad),
                    get_y(ypos, min_hand_len, min_hand_rad)
                );
                context.stroke();

            }
        }
    }

    return;
}
