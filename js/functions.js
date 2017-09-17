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

    let height = canvas.height,
        width  = canvas.width,
        scale  = window.devicePixelRatio;

    let horizontal = 3 * height <= width,
        middle = {
            x : width/2,
            y : height/2,
        };

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

                let n,
                    d = new Date();

                if(i == 0) n = Math.floor(d.getHours() / 10);
                else if(i == 1) n = d.getHours() % 10;
                else if(i == 2) n = Math.floor(d.getMinutes() / 10);
                else if(i == 3) n = d.getMinutes() % 10;

                // draw clock
                context.beginPath();
                context.arc(xpos, ypos, side/2 - side/12, 0, 2*Math.PI);
                context.stroke();

                // draw hour hand
                context.beginPath();
                context.moveTo(xpos, ypos);
                context.lineTo(get_x(xpos, side/2 - side/8, hand_positions[n][j][k][0]), get_y(ypos, side/2 - side/8, hand_positions[n][j][k][0]));
                context.stroke();

                // draw minute hand
                context.beginPath();
                context.moveTo(xpos, ypos);
                context.lineTo(get_x(xpos, side/2 - side/6, hand_positions[n][j][k][1]), get_y(ypos, side/2 - side/6, hand_positions[n][j][k][1]));
                context.stroke();

            }
        }
    }


    //canvas.style.backgroundColor = 'black'

    return;
}
