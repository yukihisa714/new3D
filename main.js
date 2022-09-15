import { Camera } from "./camera.js";
import { key, sin, cos, tan, atan, calc3dLen } from "./utility.js";
import { Point } from "./shape.js";


const can = document.createElement("canvas");
const con = can.getContext("2d");
can.width = 300;
can.height = 300;
can.style.background = "gray";
document.body.appendChild(can);

let glovalVertex = [
    new Point(100, 100, 200),
    new Point(200, 100, 200),
    new Point(200, 100, 100),
    new Point(100, 100, 100),
    new Point(100, 200, 200),
    new Point(200, 200, 200),
    new Point(200, 200, 100),
    new Point(100, 200, 100),
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

        let tmpVtx = newVertex[i];

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


        d2Vertex[i] = {
            x: tmpVtx.x + can.width / 2,
            y: can.height - (tmpVtx.z + can.height / 2),
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