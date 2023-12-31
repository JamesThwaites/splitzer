const width = 800;
const height = 500;
const hspeed = 2.8;
const dilation = 0.1;
const start_height = 400;
const gravity = 0.2;
const start_x = 50;
const end_x = 2520;

let clicking = false;
let xpos = start_x;
let top_jump_down = false;
let bottom_jump_down = false;



let params = {
    width: width,
    height: height
};

let elem = document.body;
let two = new Two(params).appendTo(elem);
console.log(two)

let background = two.makeRectangle(width/2,height/2,width-1,height-1);
background.fill = rgb(255,252,208);


function rgb(x,y,z) {
    return 'rgb(' + x.toString() + ',' + y.toString() + ',' + z.toString() + ')'
}

function bh_jump() {
    if (player.bh.grounded) {
        if (player.connected) {
            player.bh.yv += -8
        } else {
            player.bh.yv += -10
        }
        console.log(player.connected, 'bhjump:', player.th.yv, player.bh.yv)
        player.bh.grounded = false;
        if (player.connected) {
            player.th.yv = player.bh.yv
        }
    }
    
}

function th_jump() {
    if (player.connected || player.th.grounded) {
        if (player.th.hanging == false) {
            if (player.connected && player.bh.grounded == false) {
                player.th.yv += -5;
                player.bh.yv += 3
            } else {
                player.th.yv += -8
            }
            console.log(player.connected, player.th.grounded, player.th.hanging, 'thjump:', player.th.yv, player.bh.yv)
            player.connected = false;  
        }

        th_sprite.play(6,11);
        
        

    }
}

function check_collision(old_x, old_y, new_x, new_y, platform, top_half) {
    p_s = platform.x - platform.w/2
    p_e = platform.x + platform.w/2
    //console.log(platform.y)

    if (new_x < p_s || new_x > p_e) {
        return -1
    }

    if (top_half && platform.type == 1) {
        return -1
    }

    if (!top_half && platform.type == 2) {
        return -1
    }

    if (old_x > p_s && old_x < p_e) {
        return 0
    }

    if (new_y < platform.y + platform.h/2 && new_y > platform.y - platform.h/2) {
        return -2
    }

    if ((new_y <= platform.y + platform.h/2 && old_y > platform.y + platform.h/2) || (new_y >= platform.y - platform.h/2 && old_y < platform.y - platform.h/2)) {
        return -2
    }

    return 0
}

function reset() {
    player.th.y = start_height;
    player.th.yv = 0;
    player.th.grounded = false;
    player.th.hanging = false;
    th_sprite.stop()
    bh_sprite.stop()
    th_sprite.play(0,5)
    bh_sprite.play(0,5)

    player.bh.y = start_height;
    player.bh.yv = 0;
    player.bh.grounded = false;

    player.connected = true;

    xpos = start_x;
}

const player = {
    th: {
        y: start_height,
        yv: 0,
        grounded: false,
        hanging: false
    },
    bh: {
        y: start_height,
        yv: 0,
        grounded: false
    },
    connected: true
}



class Platform {
    constructor (x, y, w, h, t) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.rect = two.makeRectangle(x,y,w,h);
        if (t == 1) {
            this.rect.fill = rgb(200,50,50);
            this.rect.stroke = rgb(50,50,50);
        }
        else if (t == 2) {
            this.rect.fill = rgb(50,50,200);
            this.rect.stroke = rgb(50,50,50);
        } else if (t == 3) {
            this.rect.fill = rgb(50,200,50);
            this.rect.stroke = rgb(50,50,50);
        } else {
            this.rect.fill = rgb(50,50,50);
        }
        this.type = t;
    }
}



let bh_sprite = two.makeSprite('resc/sprites/sbh.png',50,0,6,1,10,false);
let th_sprite = two.makeSprite('resc/sprites/sth.png',50,0,12,1,10,false);
console.log(bh_sprite)

const platforms = [];
// platforms.push(new Platform(500,400,300,18, 0))
// platforms.push(new Platform(500,425,300,18, 0))
// platforms.push(new Platform(800,300,300,18, 2))
// platforms.push(new Platform(800,360,300,18, 1))
// platforms.push(new Platform(1200,400,300,18, 1))
// platforms.push(new Platform(1400,380,300,18, 2))
// platforms.push(new Platform(2000,300,300,18, 0))
platforms.push(new Platform(end_x + 25,height/2,30,height, 3))
platforms.push(new Platform(100,475,200,50,0))
platforms.push(new Platform(400,475,150,50,0))
platforms.push(new Platform(900,475,550,50,0))
platforms.push(new Platform(900,380,20,150,2))
platforms.push(new Platform(900,230,20,150,1))
platforms.push(new Platform(1400,100,550,50,0))
platforms.push(new Platform(1175,-100,100,350,0))
platforms.push(new Platform(1500,475,400,50,0))
platforms.push(new Platform(1325,300,50,300,2))
platforms.push(new Platform(1900,475,400,50,0))
platforms.push(new Platform(1610,150,20,50,2))
platforms.push(new Platform(1750,300,20,300,2))
platforms.push(new Platform(2330,375,400,25,0))
platforms.push(new Platform(2330,275,400,25,0))
platforms.push(new Platform(2330,175,400,25,0))
platforms.push(new Platform(2500,225,20,80,1))
platforms.push(new Platform(2500,325,20,80,2))
platforms.push(new Platform(2155,0,50,375,0))


//console.log(platforms[0])

two.bind('update', update);
two.play();
bh_sprite.play(0,5);
th_sprite.play(0,5);


// window.addEventListener("contextmenu", (event) => {
//     event.preventDefault()
//     th_jump();
    
// })

// window.addEventListener("click", (event) => {
//     bh_jump();
// })

window.addEventListener('keydown', (event) => {
    //console.log(event.code);
    if (event.code === 'Space') {
        bottom_jump_down = true;  
    }
    if (event.code === 'ShiftLeft') {
        top_jump_down = true;
    }
})

window.addEventListener('keyup', (event) => {
    //console.log(event.code);
    if (event.code === 'Space') {
        bottom_jump_down = false;  
    }
    if (event.code === 'ShiftLeft') {
        top_jump_down = false;
    }
})


function update(frameCount) {
    reset_flag = false;
    player.th.yv += gravity * two.timeDelta * dilation * !player.th.hanging;
    player.bh.yv += gravity * two.timeDelta * dilation;

    if (bottom_jump_down) {
        bh_jump();
    }
    if (top_jump_down) {
        th_jump();
    }
    

    bhroof = -1000
    bhfloor = height-36
    throof = -1000
    newbh = Math.min(player.bh.y + player.bh.yv * two.timeDelta * dilation,bhfloor);
    newth = Math.min(player.th.y + player.th.yv * two.timeDelta * dilation,newbh);
    thfloor = newbh

    for (p of platforms) {
        r = check_collision(xpos, player.bh.y, xpos+hspeed*two.timeDelta*dilation, newbh, p, false)
        if (r == -2) {
            console.log('bottom died')
            reset_flag = true;
        }
        else if (r == -1) {
        }
        else {
            if (player.bh.y + 8 > p.y) {
                bhroof = Math.max(bhroof, p.y + p.h/2 - 8)
            } else {
                bhfloor = Math.min(bhfloor, p.y - p.h/2 - 32)
            }
        }
        

        r = check_collision(xpos, player.th.y, xpos+hspeed*two.timeDelta*dilation, newth, p, true)
        if (r == -2) {
            console.log('top died')
            reset_flag = true;
        }
        else if (r == -1) {
        }
        else {
            if (player.th.y > p.y) {
                throof = Math.max(throof, p.y + p.h/2 + 3)
            } else {
                
                thfloor = Math.min(thfloor, p.y - p.h/2 - 15)
            }
        }
        

        p.rect.position.x = p.x + start_x - xpos
    }

    newbh = Math.min(player.bh.y + player.bh.yv * two.timeDelta * dilation,bhfloor);
    newth = Math.min(player.th.y + player.th.yv * two.timeDelta * dilation,thfloor, newbh);
    newth = Math.max(newth, throof);
    newbh = Math.max(newbh, bhroof, newth);

    xpos += hspeed*two.timeDelta*dilation
    player.bh.y = newbh
    player.th.y = newth

    if (xpos > end_x) {
        two.pause();
    }
    if (player.bh.y == height - 36) {
        reset_flag = true;
    }

    bh_sprite.position.y = player.bh.y
    th_sprite.position.y = player.th.y
    if (player.bh.y - player.th.y < 5 && player.th.hanging) { // shitty graphics workaround
        bh_sprite.position.y -= 2
    }
    //console.log(player.th.y, player.bh.y)



    if (player.th.y == player.bh.y && player.th.yv >= player.bh.yv) {
        if (player.connected == false) {
            avg = (player.th.yv*0.5 + player.bh.yv*1.5)/2;
            player.th.yv = avg;
            player.bh.yv = avg;
            th_sprite.stop()
            bh_sprite.stop()
            th_sprite.play(0,5)
            bh_sprite.play(0,5)
            console.log('recon', player.th.yv, player.bh.yv, player.th.y, player.bh.y)
        }
        player.connected = true;
        player.th.yv = player.bh.yv;

    } else {
        if (player.connected == true) {
            th_sprite.play(6,11);
        }
        player.connected = false;
    }

    if (player.bh.y == bhroof) {
        player.bh.yv = 0;
    }
    player.th.hanging = false;
    if (player.th.y == throof) {
        player.th.yv = 0;
        if (player.connected) {
            player.bh.yv = 0;
        }
        if (top_jump_down) {
            //player.th.yv -= gravity * two.timeDelta * dilation;
            player.th.hanging = true;
        }
    }
    if (player.th.y == thfloor) {
        player.th.grounded = true;
        if (player.connected == false && player.th.yv > 0) {
            if (player.th.yv > gravity * two.timeDelta * dilation ) {
                th_sprite.play(0,5);
            }
            player.th.yv = 0;
        }
    } else {
        player.th.grounded = false;
    }
    if (player.bh.y == bhfloor) {
        player.bh.yv = 0;
        player.bh.grounded = true;
        if (player.connected) {
            player.th.yv = 0;
            player.th.grounded = true;
        }
    } else {
        player.bh.grounded = false;
    }


    if (reset_flag) {
        reset();
    }
}
