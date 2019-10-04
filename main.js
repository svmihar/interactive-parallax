var canvas = document.getElementById('canvas');

// get canvas context
var context = canvas.getContext('2d');

// loading variables
var load_counter = 0;

// image object for each layer
var background = new Image();
var shadows = new Image();
var clouds = new Image();
var floaties_1 = new Image();
var floaties_2 = new Image();
var floaties_3 = new Image();
var mask = new Image();
var humans = new Image();

var layer_list = [
    {
        'image': background,
        'src': './images/layer_1_1.png',
        'z_index': -2.25,
        'position': { x: 0, y: 0 },
        'blend': null,
        'opacity': 1
    },
    {
        'image': clouds,
        'src': './images/layer_2_1.png',
        'z_index': -2,
        'position': { x: 0, y: 0 },
        'blend': null,
        'opacity': 1
    },
    {
        'image': floaties_1,
        'src': './images/layer_3_1.png',
        'z_index': -1.25,
        'position': { x: 0, y: 0 },
        'blend': 'overlay',
        'opacity': 1
    },
    {
        'image': floaties_2,
        'src': './images/layer_4_1.png',
        'z_index': -.5,
        'position': { x: 0, y: 0 },
        'blend': 'overlay',
        'opacity': 1
    },
    {
        'image': shadows,
        'src': './images/layer_5_1.png',
        'z_index': -1.25,
        'position': { x: 0, y: 0 },
        'blend': 'multiply',
        'opacity': .75
    },
    {//this guys stays in place while everything moves
        'image': mask,
        'src': './images/layer_6_1.png',
        'z_index': 0,
        'position': { x: 0, y: 0 },
        'blend': null,
        'opacity': 1
    },
    {
        'image': humans,
        'src': './images/layer_7_1.png',
        'z_index': 0.8,
        'position': { x: 0, y: 0 },
        'blend': null,
        'opacity': 1
    },
    {
        'image': floaties_3,
        'src': './images/layer_8_1.png',
        'z_index': 2,
        'position': { x: 0, y: 0 },
        'blend': null,
        'opacity': .9
    }
];

layer_list.forEach(function (layer, index) {
    layer.image.onload = function () {
        load_counter += 1;
        console.log("layer " + load_counter + " loaded");
        if (load_counter >= layer_list.length) {
            requestAnimationFrame(drawCanvas);
        }
    }
    layer.image.src = layer.src;
});

function drawCanvas() {
    // clear everything in start
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Loop through each layer --> draw to canvas
    layer_list.forEach(function (layer, index) {

        layer.position = getOffset(layer);

        if (layer.blend) {
            context.globalCompositeOperation = layer.blend;
        } else {
            context.globalCompositeOperation = 'normal';
        }
        context.globalAlpha = layer.opacity;
        context.drawImage(layer.image, layer.position.x, layer.position.y);
    });
    requestAnimationFrame(drawCanvas);
}

function getOffset(layer) {
    var touch_multiplier = .3;
    var touch_offset_x = pointer.x * layer.z_index * touch_multiplier;
    var touch_offset_y = pointer.y * layer.z_index * touch_multiplier;

    var motion_multiplier = 1.5;
    var motion_offset_x = motion.x * layer.z_index * motion_multiplier;
    var motion_offset_y = motion.y * layer.z_index * motion_multiplier;

    var offset = {
        x: touch_offset_x + motion_offset_x,
        y: touch_offset_y + motion_offset_y
    };
    return offset
}
/* TOUCH AND MOUSE CONTROLS */
var moving = false;

// touch and mouse coordinates
var pointer_initial = { x: 0, y: 0 };
var pointer = { x: 0, y: 0 };
canvas.addEventListener('touchstart', pointerStart);
canvas.addEventListener('mousedown', pointerStart);

function pointerStart(event) {
    moving = true;

    if (event.type === 'touchstart') {
        pointer_initial.x = event.touches[0].clientX;
        pointer_initial.y = event.touches[0].clientY;

    } else if (event.type === 'mousedown') {
        pointer_initial.x = event.clientX;
        pointer_initial.y = event.clientY;
    }
}

// check if mouse/touch moves, offset the image accordingly
window.addEventListener('touchmove', pointerMove);
window.addEventListener('mousemove', pointerMove);

function pointerMove(event) {
    event.preventDefault();
    if (moving === true) {
        var current_x = 0;
        var current_y = 0;
        if (event.type === 'touchmove') {
            current_x = event.touches[0].clientX;
            current_y = event.touches[0].clientY;
        } else if (event.type === 'mousemove') {
            current_x = event.clientX;
            current_y = event.clientY;
        }
        pointer.x = current_x - pointer_initial.x;
        pointer.y = current_y - pointer_initial.y;

    }
}
canvas.addEventListener('touchmove', function (event) {
    event.preventDefault();
});

canvas.addEventListener('mousemove', function (event) {
    event.preventDefault();
}); window.addEventListener('touchend', function (event) {
    endGesture();
});
window.addEventListener('mouseup', function (event) {
    endGesture();
});
function endGesture() {
    moving = false;
    pointer.x = 0;
    pointer.y = 0;
}


/* motion controls within gyros */
var motion_initial = {
    x: null,
    y: null
};

var motion = {
    x: null,
    y: null
};
// listen to gyro moves
window.addEventListener('deviceorientation', function (event) {
    if (!motion_initial.x && !motion_initial.y) {
        motion_initial.x = event.beta;
        motion_initial.y = event.gamma;
    }

    /* covering all device orientation */
    if (window.orientation === 0) {
        motion.x = event.gamma - motion_initial.x;
        motion.y = event.beta -  motion_initial.y;

    }
    // portrait
    else if (window.orientation === 90) {
        motion.x = event.beta - motion_initial.x;
        motion.y = -event.gamma + motion_initial.y;
    }
    //landsacpe left
    else if (window.orientation === -90) {
        motion.x = -event.beta + motion_initial.x;
        motion.y = event.gamma - motion_initial.y;
    }
    //landscape right
    else {
        motion.x = -event.gamma + motion_initial.x;
        motion.y = -event.beta + motion_initial.y;

    }
});


window.addEventListener('orientationchange', function(event){
    motion_initial.x = 0;
    motion_initial.y = 0;
});


