import { Camera } from "./camera.js";
import { key, sin, cos, tan, atan, calc3dLen } from "./utility.js";
import { Point, Vector } from "./shape.js";


const can = document.createElement("canvas");
const con = can.getContext("2d");
can.width = 400;
can.height = 300;
can.style.background = "gray";
document.body.appendChild(can);

let glovalVertex = [
    new Point(-200, 100, 200),
    new Point(200, 100, 200),
    new Point(200, 100, -200),
    new Point(-200, 100, -200),
    new Point(-200, 500, 200),
    new Point(200, 500, 200),
    new Point(200, 500, -200),
    new Point(-200, 500, -200),
    new Point(0, -200, 0),
];

let camera = new Camera();


function mainLoop() {
    con.clearRect(0, 0, can.width, can.height);

    camera.update();

    // カメラの法線ベクトル
    const camVector = camera.normalVector.vector;
    // カメラ平面の方程式
    const planeEq = camera.planeEquation;

    con.fillText(camVector.x + "," + camVector.y + "," + camVector.z, 10, 250);


    let intersectionVtx = [];
    let d2Vertex = [];

    for (let i = 0; i < glovalVertex.length; i++) {
        const point = glovalVertex[i];
        const length = calc3dLen(camera.coord, point);
        const t = -(planeEq.a * point.x + planeEq.b * point.y + planeEq.c * point.z + planeEq.d)
            / (planeEq.a * camVector.x + planeEq.b * camVector.y + planeEq.c * camVector.z);

        // カメラ平面との交点
        intersectionVtx[i] = new Point(
            camVector.x * t + point.x,
            camVector.y * t + point.y,
            camVector.z * t + point.z,
        );

        con.fillText(intersectionVtx[i].x.toFixed(2) + ", " + intersectionVtx[i].y.toFixed(2) + ", " + intersectionVtx[i].z.toFixed(2), 10, i * 10 + 120);

        // 交点から点までのベクトル
        const intToPointVector = new Vector(intersectionVtx, point);

        // 点がカメラの後ろにあるときに描画しない
        if (Math.sign(camVector.x) === Math.sign(intToPointVector.x)) {
            // continue;
            console.log(i);
        }

        // カメラ平面との交点を二次元に変換

        let tmpVtx = intersectionVtx[i];

        let tmpRotate = {};
        let tmpNewRotate = {};

        let dif = {
            x: tmpVtx.x - camera.coord.x,
            y: tmpVtx.y - camera.coord.y,
            z: tmpVtx.z - camera.coord.z,
        };

        let len = {
            x: Math.sqrt(dif.y ** 2 + dif.z ** 2),
            y: Math.sqrt(dif.x ** 2 + dif.z ** 2),
            z: Math.sqrt(dif.x ** 2 + dif.y ** 2),
        };

        tmpRotate.z = atan(dif.x / dif.y);
        if (dif.y < 0) tmpRotate.z += 180;
        tmpNewRotate.z = tmpRotate.z - camera.rotate.z;

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

        tmpVtx.z = sin(tmpNewRotate.x) * len.x;
        tmpVtx.y = cos(tmpNewRotate.x) * len.x;


        // 二次元座標に格納
        d2Vertex[i] = {
            x: tmpVtx.x * 200 / length + can.width / 2,
            y: can.height - (tmpVtx.z * 200 / length + can.height / 2),
        };

        con.fillStyle = "black";

        con.fillText(d2Vertex[i].x.toFixed(2) + "," + d2Vertex[i].y.toFixed(2), 10, i * 10 + 20);


        con.beginPath();
        con.arc(d2Vertex[i].x, d2Vertex[i].y, 5, 0, 360, false);
        con.fillText(i, d2Vertex[i].x + 5, d2Vertex[i].y + 5);
        con.fill();

    }

    con.fillText(camera.coord.x + ", " + camera.coord.y + ", " + camera.coord.z, 10, 270);
    con.fillText(camera.rotate.x + ", " + camera.rotate.z, 10, 280);
}

setInterval(mainLoop, 1000 / 60);
