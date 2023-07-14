const width = 800;
const height = 500;
const hspeed = 2;

let params = {
    width: width,
    height: height
};

let elem = document.body;
let two = new Two(params).appendTo(elem);
console.log(two)

let background = two.makeRectangle(width/2,height/2,width-4,height-4);
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
        player.bh.grounded = false;
    }
    if (player.connected) {
        player.th.yv = player.bh.yv
    }
    console.log('bhjump:', player.th.yv, player.bh.yv)
}

function th_jump() {
    if (player.connected || player.th.grounded) {
        if (player.connected && player.bh.grounded == false) {
            player.th.yv += -5;
            player.bh.yv += 3
        } else {
            player.th.yv += -8
        }

        
        
        console.log(player.connected)
        player.connected = false;
        
    }
    console.log('thjump:', player.th.yv, player.bh.yv)
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

const player = {
    th: {
        y: 460,
        yv: 0,
        grounded: false
    },
    bh: {
        y: 460,
        yv: 0,
        grounded: false
    },
    connected: true
    
}

let xpos = 50;

class Platform {
    constructor (x, y, w, h, t) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.rect = two.makeRectangle(x,y,w,h);
        if (t == 1) {
            this.rect.fill = rgb(200,50,50);
        }
        else if (t == 2) {
            this.rect.fill = rgb(50,50,200);
        } else {
            this.rect.fill = rgb(50,50,50);
        }
        this.type = t;
    }
}

const gravity = 0.2;
const floor = 260;
let clicking = false;

let bh_sprite = two.makeSprite('resc/sprites/sbh.png',50,0,6,1,10,true);
let th_sprite = two.makeSprite('resc/sprites/sth.png',50,0,6,1,10,true);
console.log(bh_sprite)

const platforms = [];
platforms.push(new Platform(500,400,300,18, 0))
platforms.push(new Platform(800,300,300,18, 2))
platforms.push(new Platform(800,360,300,18, 1))
platforms.push(new Platform(1200,400,300,18, 1))
platforms.push(new Platform(1400,380,300,18, 2))
platforms.push(new Platform(2000,300,300,18, 0))
// platforms.push(new Platform(1600,400,2000,18,0))
// platforms.push(new Platform(1900,350,2000,18,0))


//console.log(platforms[0])

two.bind('update', update);
two.play();

window.addEventListener("contextmenu", (event) => {
    event.preventDefault()
    th_jump();
    
})

window.addEventListener("click", (event) => {
    //console.log(player.bh.grounded, player.connected)
    bh_jump();
})

window.addEventListener('keydown', (event) => {
    //console.log(event.code);
    if (event.code === 'Space') {
        bh_jump();  
    }
    if (event.code === 'ShiftLeft') {
        th_jump();
    }
})


function update(frameCount) {
    player.th.yv += gravity;
    player.bh.yv += gravity;

    bhroof = 0
    bhfloor = height-36
    throof = 0
    //console.log(player.bh.y + player.bh.yv,bhfloor)
    newbh = Math.min(player.bh.y + player.bh.yv,bhfloor);
    newth = Math.min(player.th.y + player.th.yv,newbh);
    //console.log(newth)
    thfloor = newbh

    for (p of platforms) {
        //console.log(p)
        r = check_collision(xpos, player.bh.y, xpos+hspeed, newbh, p, false)
        if (r == -2) {
            console.log('bottom died')
        }
        else if (r == -1) {
            //console.log('dd')
        }

        else {
            //console.log(bhfloor, newbh, p.y)
            if (player.bh.y + 8 > p.y) {
                //console.log(1, bhfloor)
                bhroof = Math.max(bhroof, p.y + p.h/2 - 8)
            } else {
                //console.log(2, bhfloor)
                bhfloor = Math.min(bhfloor, p.y - p.h/2 - 32)
                //console.log(bhfloor)
            }
            //console.log(bhfloor, p.y - p.h/2)
        }
        

        r = check_collision(xpos, player.th.y, xpos+hspeed, newth, p, true)
        if (r == -2) {
            console.log('top died')
        }
        else if (r == -1) {
            //console.log('dd')
        }

        else {
            if (newth > p.y) {
                throof = Math.max(throof, p.y + p.h/2 + 3)
            } else {
                
                thfloor = Math.min(thfloor, p.y - p.h/2 - 15)
                //console.log(thfloor, p.y)
            }
        }
        

        p.rect.position.x = p.x + 50 - xpos
    }

    newbh = Math.min(player.bh.y + player.bh.yv,bhfloor);
    newth = Math.min(player.th.y + player.th.yv,thfloor, newbh);
    
    newth = Math.max(newth, throof);
    newbh = Math.max(newbh, bhroof, newth);

    //console.log(bhroof, bhfloor)

    //console.log(player.th.y)
    xpos += hspeed
    player.bh.y = newbh
    player.th.y = newth
    
    // if (player.connected == true) {
    //     player.th.y = player.bh.y;
    //     player.th.yv = player.bh.yv;
    // }

    bh_sprite.position.y = player.bh.y
    th_sprite.position.y = player.th.y

    if (player.th.y == player.bh.y && player.th.yv >= player.bh.yv) {
        if (player.connected == false) {
            avg = (player.th.yv*0.5 + player.bh.yv*1.5)/2;
            player.th.yv = avg;
            player.bh.yv = avg;
        }
        player.connected = true;
        player.th.yv = player.bh.yv;

    } else {
        player.connected = false;
    }
    if (player.th.y == thfloor) {
        player.th.grounded = true;
        if (player.connected == false && player.th.yv > 0) {
            //console.log('triggered')
            player.th.yv = 0;
        }

    } else {
        player.th.grounded = false;
    }
    if (player.bh.y == bhfloor) {
        player.bh.grounded = true;
        player.bh.yv = 0;

    } else {
        player.bh.grounded = false;
    }
}