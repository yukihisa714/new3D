const can = document.createElement("canvas");
const con = can.getContext("2d");
can.width = 300;
can.height = 300;
can.style.background = "gray";
document.body.appendChild(can);

let glovalVertex = [
    { x: 100, y: 100, z: 200 },
    { x: 200, y: 100, z: 200 },
    { x: 200, y: 100, z: 100 },
    { x: 100, y: 100, z: 100 },
    { x: 100, y: 300, z: 150 },
    { x: 200, y: 300, z: 150 },
    { x: 200, y: 300, z: 50 },
    { x: 100, y: 300, z: 50 },
];

// カメラクラス
class Camera {
    constructor() {

        // カメラの座標
        this.coord = {
            x: 0,
            y: 0,
            z: 0,
        };

        // カメラの回転
        this.rotate = {
            x: 0,
            z: 0,
        };

        // 法線ベクトル
        this.normalVector = {
            length: 100, // 長さ
            st: {}, // 始点
            ed: {}, // 終点
            vector: {}, // ベクトル
        };

        // カメラの平面の方程式
        this.planeEquation = {};

        // カメラの移動速度
        this.speed = 2;

    }
    update() {
        if (key[87]) { // 前
            this.coord.x += sin(this.rotate.z + 0) * this.speed;
            this.coord.y += cos(this.rotate.z + 0) * this.speed;
        }
        if (key[83]) { // 後ろ
            this.coord.x -= sin(this.rotate.z + 0) * this.speed;
            this.coord.y -= cos(this.rotate.z + 0) * this.speed;
        }
        if (key[68]) { // 右
            if (this.rotate.z === 0) {
                this.coord.x += this.speed;
            }
            else {
                this.coord.x += sin(this.rotate.z + 90) * this.speed;
                this.coord.y += cos(this.rotate.z + 90) * this.speed;
            }
        }
        if (key[65]) { // 左
            if (this.rotate.z === 0) {
                this.coord.x -= this.speed;
            }
            else {
                this.coord.x += sin(this.rotate.z - 90) * this.speed;
                this.coord.y += cos(this.rotate.z - 90) * this.speed;
            }
        }
        if (key[32]) { // 上
            this.coord.z += this.speed;
        }
        if (key[16]) { // 下
            this.coord.z -= this.speed;
        }

        if (key[37]) this.rotate.z -= 2; // 左
        if (key[39]) this.rotate.z += 2; // 右
        if (key[38]) this.rotate.x += 2; // 上
        if (key[40]) this.rotate.x -= 2; // 下

        // 法線ベクトル
        // 始点
        this.normalVector.st = {
            x: this.coord.x,
            y: this.coord.y,
            z: this.coord.z,
        };

        const tmpZ1 = sin(this.rotate.x) * this.normalVector.length;
        const tmpY1 = cos(this.rotate.x) * this.normalVector.length;
        const tmpY2 = cos(this.rotate.z) * tmpY1;
        const tmpX1 = sin(this.rotate.z) * tmpY1;

        // 終点
        this.normalVector.ed = {
            x: tmpX1 + this.normalVector.st.x,
            y: tmpY2 + this.normalVector.st.y,
            z: tmpZ1 + this.normalVector.st.z,
        };

        // ベクトル
        this.normalVector.vector = {
            x: this.normalVector.ed.x - this.normalVector.st.x,
            y: this.normalVector.ed.y - this.normalVector.st.y,
            z: this.normalVector.ed.z - this.normalVector.st.z,
        };
        // console.log(this.normalVector.vector.x);
        // console.log(this.normalVector.vector.y);
        // console.log(this.normalVector.vector.z);

        // 平面の方程式 ax+by+cz+d=0
        this.planeEquation = {
            a: this.normalVector.vector.x,
            b: this.normalVector.vector.y,
            c: this.normalVector.vector.z,
            d: this.normalVector.vector.x * -this.coord.x +
                this.normalVector.vector.y * -this.coord.y +
                this.normalVector.vector.z * -this.coord.z,
        };
    }
}

let camera = new Camera();

// camera.update();

let key = [];
document.onkeydown = (e) => {
    key[e.keyCode] = true;
    // console.log(e.key);
}
document.onkeyup = (e) => {
    key[e.keyCode] = false;
}

function sin(theta) {
    return (Math.sin(Math.PI / 180 * theta));
}
function cos(theta) {
    return (Math.cos(Math.PI / 180 * theta));
}
function tan(theta) {
    return (Math.tan(Math.PI / 180 * theta));
}

function atan(tan) {
    return Math.atan(tan) / Math.PI * 180;
}

/**
 * 三次元上の2点間の距離を計算する関数
 * @param {Object} pos1 // x, y, z
 * @param {object} pos2 // x, y, z
 * @returns {Number} // 距離
 */
function calc3dLen(pos1, pos2) {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y + pos2.y) ** 2 + (pos1.z + pos2.z) ** 2);
}


function mainLoop() {
    con.clearRect(0, 0, can.width, can.height);

    camera.update();

    // カメラの法線ベクトル
    const camVector = camera.normalVector.vector;
    // カメラ平面の方程式
    const planeEq = camera.planeEquation;

    con.fillText(camVector.x + "," + camVector.y + "," + camVector.z, 10, 250);


    let newVertex = [];
    let d2Vertex = [];

    for (let i = 0; i < glovalVertex.length; i++) {
        const point = glovalVertex[i];
        const length = calc3dLen(camera.coord, point);
        const t = -(planeEq.a * point.x + planeEq.b * point.y + planeEq.c * point.z + planeEq.d)
            / (planeEq.a * camVector.x + planeEq.b * camVector.y + planeEq.c * camVector.z);

        // カメラ平面との交点
        newVertex[i] = {
            x: camVector.x * t + point.x,
            y: camVector.y * t + point.y,
            z: camVector.z * t + point.z,
        };

        con.fillText(newVertex[i].x.toFixed(2) + ", " + newVertex[i].y.toFixed(2) + ", " + newVertex[i].z.toFixed(2), 10, i * 10 + 120);

        let tmpLen = Math.sqrt(
            (camera.coord.x - newVertex[i].x) ** 2 +
            (camera.coord.y - newVertex[i].y) ** 2 +
            (camera.coord.z - newVertex[i].z) ** 2
        );

        let tmpVtx = newVertex[i];

        let dif = {};
        dif.x = tmpVtx.x - camera.coord.x;
        dif.y = tmpVtx.y - camera.coord.y;
        dif.z = tmpVtx.z - camera.coord.z;

        let len = {};
        len.x = Math.sqrt(dif.y ** 2 + dif.z ** 2);
        len.y = Math.sqrt(dif.x ** 2 + dif.z ** 2);
        len.z = Math.sqrt(dif.x ** 2 + dif.y ** 2);

        let tmpRotate = {};
        let tmpNewRotate = {};

        tmpRotate.z = atan(dif.x / dif.y);
        if (dif.y < 0) tmpRotate.z += 180;
        tmpNewRotate.z = tmpRotate.z - camera.rotate.z;

        // tmpVtx.x = camera.coord.x + sin(tmpNewRotate.z) * len.z;
        // tmpVtx.y = camera.coord.y + cos(tmpNewRotate.z) * len.z;
        tmpVtx.x = sin(tmpNewRotate.z) * len.z;
        tmpVtx.y = cos(tmpNewRotate.z) * len.z;

        dif.x = tmpVtx.x - camera.coord.x;
        dif.y = tmpVtx.y - camera.coord.y;
        dif.z = tmpVtx.z - camera.coord.z;

        len.x = Math.sqrt(dif.y ** 2 + dif.z ** 2);
        len.y = Math.sqrt(dif.x ** 2 + dif.z ** 2);
        len.z = Math.sqrt(dif.x ** 2 + dif.y ** 2);

        tmpRotate.x = atan(dif.z / dif.y);
        if (dif.y < 0) tmpRotate.x += 180;
        tmpNewRotate.x = tmpRotate.x - camera.rotate.x;

        // const tmpZ1 = sin(tmpNewRotate.x) * tmpLen;
        // const tmpY1 = cos(tmpNewRotate.x) * tmpLen;
        // const tmpY2 = cos(tmpNewRotate.z) * tmpY1;
        // const tmpX1 = sin(tmpNewRotate.z) * tmpY1;

        // tmpVtx = {
        //     x: tmpX1 + camera.coord.x,
        //     y: tmpY2 + camera.coord.y,
        //     z: tmpZ1 + camera.coord.z,
        // };


        // tmpVtx.y = camera.coord.y + cos(tmpNewRotate.x) * len.x;
        // tmpVtx.z = camera.coord.z + sin(tmpNewRotate.x) * len.x;
        tmpVtx.y = cos(tmpNewRotate.x) * len.x;
        tmpVtx.z = sin(tmpNewRotate.x) * len.x;

        d2Vertex[i] = {
            x: tmpVtx.x + can.width / 2,
            y: can.height - (tmpVtx.z + can.height / 2),
        };

        con.fillStyle = "black";

        con.fillText(d2Vertex[i].x.toFixed(2) + "," + d2Vertex[i].y.toFixed(2), 10, i * 10 + 20);


        con.beginPath();
        con.arc(d2Vertex[i].x, d2Vertex[i].y, 1000 / length, 0, 360, false);
        con.fillText(i, d2Vertex[i].x + 5, d2Vertex[i].y + 5);
        con.fill();

    }

    con.fillText(camera.coord.x + ", " + camera.coord.y + ", " + camera.coord.z, 10, 270);
    con.fillText(camera.rotate.x + ", " + camera.rotate.z, 10, 280);
}

setInterval(mainLoop, 1000 / 60);
