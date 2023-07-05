const width = 800;
const height = 500;

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

const player = {
    th: {
        y: 0,
        yv: 0,
        grounded: false
    },
    bh: {
        y: 0,
        yv: 0,
        grounded: false
    },
    connected: true
    
}

const gravity = 0.2;
const floor = 260;
let clicking = false;

let bh_sprite = two.makeSprite('resc/sprites/sbh.png',50,0,6,1,10,true);
let th_sprite = two.makeSprite('resc/sprites/sth.png',50,0,6,1,10,true);
console.log(bh_sprite)

two.bind('update', update);
two.play();

window.addEventListener("contextmenu", (event) => {
    event.preventDefault()
    if (player.connected || player.th.grounded) {
        if (player.connected && player.bh.grounded == false) {
            player.th.yv += -5;
            player.bh.yv += 3
        } else {
            player.th.yv += -8
        }
        
        //console.log(player.connected)
        player.connected = false;
        
    }
})

window.addEventListener("click", (event) => {
    //console.log(player.bh.grounded, player.connected)
    if (player.bh.grounded) {
        if (player.connected) {
            player.bh.yv += -8
        } else {
            player.bh.yv += -10
        }
        player.bh.grounded = false;
    }
})


function update(frameCount) {
    player.th.yv += gravity;
    player.bh.yv += gravity;
    player.bh.y = Math.min(player.bh.y + player.bh.yv,height-36);
    player.th.y = Math.min(player.th.y + player.th.yv,player.bh.y);
    bh_sprite.position.y = player.bh.y
    th_sprite.position.y = player.th.y

    if (player.bh.y == height-36) {
        player.bh.grounded = true;
    }
    if (player.th.y == player.bh.y && player.th.yv >= player.bh.yv) {
        if (player.connected == false) {
            avg = (player.th.yv*0.5 + player.bh.yv*1.5)/2;
            player.th.yv = avg;
            player.bh.yv = avg;
        }
        player.connected = true;
        player.th.yv = player.bh.yv;
    }
    if (player.bh.grounded) {
        player.bh.yv = 0;
        if (player.connected) {
            player.th.yv = 0;
        }
    }
}