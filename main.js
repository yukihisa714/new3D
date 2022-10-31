import { Camera } from "./camera.js";
import { key, sin, cos, tan, atan, calc3dLen } from "./utility.js";
import { Point, Vector, Line } from "./shape.js";


const can = document.createElement("canvas");
const con = can.getContext("2d");
can.width = 540;
can.height = 405;
can.style.background = "gray";
document.body.appendChild(can);

const can2 = document.createElement("canvas");
const con2 = can2.getContext("2d");
can2.width = 300;
can2.height = 300;
can2.style.background = "gray";
document.body.appendChild(can2);

let globalVertex = [
    new Point(-200, 100, 200, true),
    new Point(200, 100, 200, true),
    new Point(200, 100, -200, true),
    new Point(-200, 100, -200, true),
    new Point(-200, 500, 200, true),
    new Point(200, 500, 200, true),
    new Point(200, 500, -200, true),
    new Point(-200, 500, -200, true),
    new Point(0, -200, 0, true),
    new Point(0, 0, 0, false),
    new Point(50, 0, 0, false),
    new Point(0, 50, 0, false),
    new Point(0, 0, 50, false),
];

let lines = [
    new Line(0, 1),
    new Line(0, 3),
    new Line(0, 4),
    new Line(0, 8),
    new Line(1, 2),
    new Line(1, 5),
    new Line(1, 8),
    new Line(2, 3),
    new Line(2, 6),
    new Line(2, 8),
    new Line(3, 7),
    new Line(3, 8),
    new Line(4, 5),
    new Line(4, 7),
    new Line(5, 6),
    new Line(6, 7),
    new Line(9, 10),
    new Line(9, 11),
    new Line(9, 12),
];

let camera = new Camera();

let frame = 0;

// canvasに線を描画する関数
function drawLine(pos1, pos2) {
    con.beginPath()
    con.lineTo(pos1.x, pos1.y);
    con.lineTo(pos2.x, pos2.y);
    con.stroke();
}

function mainLoop() {
    con.clearRect(0, 0, can.width, can.height);
    con2.clearRect(0, 0, 300, 300);

    camera.update();

    // カメラの法線ベクトル
    const camVector = camera.normalVector.vector;
    // カメラ平面の方程式
    const planeEq = camera.planeEquation;

    // con.fillText("camVector: " + camVector.x.toFixed(0) +
    //     "," + camVector.y.toFixed(0) +
    //     "," + camVector.z.toFixed(0),
    //     10, 250);


    let intersectionVtx = [];
    let d2Vertex = [];

    for (let i = 0; i < globalVertex.length; i++) {
        const point = globalVertex[i];
        const length = calc3dLen(camera.coord, point);
        const t = -(planeEq.a * point.x + planeEq.b * point.y + planeEq.c * point.z + planeEq.d)
            / (planeEq.a * camVector.x + planeEq.b * camVector.y + planeEq.c * camVector.z);

        // カメラ平面との交点
        intersectionVtx[i] = new Point(
            camVector.x * t + point.x,
            camVector.y * t + point.y,
            camVector.z * t + point.z,
        );

        // con.fillText(intersectionVtx[i].x.toFixed(0) + ", " + intersectionVtx[i].y.toFixed(0) + ", " + intersectionVtx[i].z.toFixed(0), 10, i * 10 + 120);

        // 交点から点までのベクトル
        const intToPointVector = new Vector(intersectionVtx[i], point);

        // 点が自分の前にあるか後ろにあるか
        let isPointInFront = true;

        // 点がカメラの後ろにあるときに描画しない
        if (Math.sign(camVector.y) !== Math.sign(intToPointVector.vector.y)) {
            continue;
            isPointInFront = false;
        }

        // カメラ平面との交点を二次元に変換

        let tmpIntVtx = intersectionVtx[i];

        let tmpRotate = {};
        let tmpNewRotate = {};

        let dif = {
            x: tmpIntVtx.x - camera.coord.x,
            y: tmpIntVtx.y - camera.coord.y,
            z: tmpIntVtx.z - camera.coord.z,
        };

        let len = {
            x: Math.sqrt(dif.y ** 2 + dif.z ** 2),
            y: Math.sqrt(dif.x ** 2 + dif.z ** 2),
            z: Math.sqrt(dif.x ** 2 + dif.y ** 2),
        };

        tmpRotate.z = atan(dif.x / dif.y);
        if (dif.y < 0) tmpRotate.z += 180;
        tmpNewRotate.z = tmpRotate.z - camera.rotate.z;

        tmpIntVtx.x = sin(tmpNewRotate.z) * len.z;
        tmpIntVtx.y = cos(tmpNewRotate.z) * len.z;

        dif.x = tmpIntVtx.x - camera.coord.x;
        dif.y = tmpIntVtx.y - camera.coord.y;
        dif.z = tmpIntVtx.z - camera.coord.z;

        len.x = Math.sqrt(dif.y ** 2 + dif.z ** 2);
        len.y = Math.sqrt(dif.x ** 2 + dif.z ** 2);
        len.z = Math.sqrt(dif.x ** 2 + dif.y ** 2);

        tmpRotate.x = atan(dif.z / dif.y);
        if (dif.y < 0) tmpRotate.x += 180;
        tmpNewRotate.x = tmpRotate.x - camera.rotate.x;

        tmpIntVtx.z = sin(tmpNewRotate.x) * len.x;
        tmpIntVtx.y = cos(tmpNewRotate.x) * len.x;


        // 二次元座標に格納
        d2Vertex[i] = {
            // x: tmpIntVtx.x * 400 / length + can.width / 2,
            // y: can.height - (tmpIntVtx.z * 400 / length + can.height / 2),
            x: tmpIntVtx.x + can.width / 2,
            y: can.height - (tmpIntVtx.z + can.height / 2),
        };

        con.fillStyle = "black";

        // con.fillText(`${d2Vertex[i].x.toFixed(0)}, ${d2Vertex[i].y.toFixed(0)}`, 10, i * 10 + 20);


        if (isPointInFront) {
            if (globalVertex[i].isDraw) {
                con.beginPath();
                con.arc(d2Vertex[i].x, d2Vertex[i].y, 5, 0, 360, false);
                // con.fillText(i, d2Vertex[i].x + 5, d2Vertex[i].y + 5);
                con.fill();
            }
        }

        // con.fillText(`Vector→${intToPointVector.vector.x.toFixed(0)}, ${intToPointVector.vector.y.toFixed(0)}, ${intToPointVector.vector.z.toFixed(0)}`,
        //     d2Vertex[i].x + 15, d2Vertex[i].y + 5);
        // con.fillText(`dist: ${length.toFixed(0)}`, d2Vertex[i].x + 15, d2Vertex[i].y + 15);



    }

    // con.fillText(`${camera.coord.x}, ${camera.coord.y}, ${camera.coord.z}`, 10, 270);
    // con.fillText(`${camera.rotate.x}, ${camera.rotate.z}`, 10, 280);

    for (let i = 0; i < lines.length; i++) {
        con.strokeStyle = "black";
        if (d2Vertex[lines[i].num1] && d2Vertex[lines[i].num2]) {
            drawLine(d2Vertex[lines[i].num1], d2Vertex[lines[i].num2]);
        }
    }


    for (const point of globalVertex) {
        if (!point.isDraw) continue;
        con2.fillStyle = "black";
        con2.beginPath();
        con2.arc(point.x / 8 + 150, 150 - point.y / 8, 5, 0, 360, false);
        con2.fill();
    }

    for (const line of lines) {
        con2.strokeStyle = "black";
        con2.beginPath();
        con2.lineTo(globalVertex[line.num1].x / 8 + 150, 150 - globalVertex[line.num1].y / 8);
        con2.lineTo(globalVertex[line.num2].x / 8 + 150, 150 - globalVertex[line.num2].y / 8);
        con2.stroke();
    }

    con2.fillStyle = "red";
    con2.beginPath();
    con2.arc(camera.coord.x / 8 + 150, 150 - camera.coord.y / 8, 5, 0, 360, false);
    con2.fill();

    con2.strokeStyle = "red";
    con2.beginPath();
    con2.lineTo(camera.coord.x / 8 + 150, 150 - camera.coord.y / 8);
    con2.lineTo(camera.normalVector.ed.x / 8 + 150, 150 - camera.normalVector.ed.y / 8);
    con2.stroke();

    frame++;
}

setInterval(mainLoop, 1000 / 60);
