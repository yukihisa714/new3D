import { camera } from "./camera.js";
import { key, sin, cos, tan, atan, calc3dLen } from "./utility.js";
import { Point, Vector, Line, globalVertex, lines } from "./shape.js";


const can = camera.can;
const con = camera.con;

const can2 = document.createElement("canvas");
const con2 = can2.getContext("2d");
can2.width = 240;
can2.height = 240;
can2.style.background = "gray";
document.body.appendChild(can2);

const hc2 = can2.width / 2;

let frame = 0;

// canvasに線を描画する関数
function drawLine(context, pos1, pos2) {
    context.beginPath()
    context.lineTo(pos1.x, pos1.y);
    context.lineTo(pos2.x, pos2.y);
    context.stroke();
}

function mainLoop() {
    con.clearRect(0, 0, can.width, can.height);
    con2.clearRect(0, 0, 300, 300);

    camera.update();

    // カメラの法線ベクトル
    const CNV = camera.normalVector.vector;
    // カメラ平面の方程式
    const CPE = camera.planeEquation;

    // con.fillText("camVector: " + camVector.x.toFixed(0) +
    //     "," + camVector.y.toFixed(0) +
    //     "," + camVector.z.toFixed(0),
    //     10, 250);


    const intersectionVtx = [];
    const d2Vertex = [];

    for (let i = 0; i < globalVertex.length; i++) {
        const point = globalVertex[i];
        const length = calc3dLen(camera.coord, point);
        const t = -(CPE.a * point.x + CPE.b * point.y + CPE.c * point.z + CPE.d)
            / (CPE.a * CNV.x + CPE.b * CNV.y + CPE.c * CNV.z);

        // カメラ平面との交点
        intersectionVtx[i] = new Point(
            CNV.x * t + point.x,
            CNV.y * t + point.y,
            CNV.z * t + point.z,
        );

        // con.fillText(intersectionVtx[i].x.toFixed(0) + ", " + intersectionVtx[i].y.toFixed(0) + ", " + intersectionVtx[i].z.toFixed(0), 10, i * 10 + 120);

        // 交点から点までのベクトル
        const intToPointVector = new Vector(intersectionVtx[i], point);

        // 点が自分の前にあるか後ろにあるか
        let isPointInFront = true;

        // 点がカメラの後ろにあるときに描画しない
        if (Math.sign(CNV.y) !== Math.sign(intToPointVector.vector.y)) {
            continue;
            isPointInFront = false;
        }

        // カメラ平面との交点を二次元に変換

        const tmpIntVtx = Object.assign({}, intersectionVtx[i]);

        const dif = {
            x: tmpIntVtx.x - camera.coord.x,
            y: tmpIntVtx.y - camera.coord.y,
            z: tmpIntVtx.z - camera.coord.z,
        };

        const sinX = sin(camera.rotate.x);
        const cosX = cos(camera.rotate.x);
        const sinZ = sin(camera.rotate.z);
        const cosZ = cos(camera.rotate.z);

        // 三角関数の点の回転を利用
        tmpIntVtx.x = dif.x * cosZ - dif.y * sinZ;
        tmpIntVtx.y = dif.y * cosZ + dif.x * sinZ;

        // データの更新
        // dif.x = tmpIntVtx.x - camera.coord.x;
        dif.y = tmpIntVtx.y - camera.coord.y;
        dif.z = tmpIntVtx.z - camera.coord.z;

        tmpIntVtx.y = dif.y * cosX + dif.z * sinX;
        tmpIntVtx.z = dif.z * cosX - dif.y * sinX;


        // 二次元座標に格納
        d2Vertex[i] = {
            x: tmpIntVtx.x * 20 / Math.sqrt(length) + can.width / 2,
            y: can.height - (tmpIntVtx.z * 20 / Math.sqrt(length) + can.height / 2),
            // x: tmpIntVtx.x + can.width / 2,
            // y: can.height - (tmpIntVtx.z + can.height / 2),
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
        con.fillText(`dist: ${length.toFixed(0)}`, d2Vertex[i].x + 15, d2Vertex[i].y + 15);



    }

    // con.fillText(`${camera.coord.x}, ${camera.coord.y}, ${camera.coord.z}`, 10, 270);
    // con.fillText(`${camera.rotate.x}, ${camera.rotate.z}`, 10, 280);

    for (const line of lines) {
        con.strokeStyle = "black";
        if (d2Vertex[line.num1] && d2Vertex[line.num2]) {
            drawLine(con, d2Vertex[line.num1], d2Vertex[line.num2]);
        }
    }


    for (const point of globalVertex) {
        if (!point.isDraw) continue;
        con2.fillStyle = "black";
        con2.beginPath();
        con2.arc(point.x / 8 + hc2, hc2 - point.y / 8, 5, 0, 360, false);
        con2.fill();
    }

    for (const line of lines) {
        const p1 = {
            x: globalVertex[line.num1].x / 8 + hc2,
            y: hc2 - globalVertex[line.num1].y / 8,
        }
        const p2 = {
            x: globalVertex[line.num2].x / 8 + hc2,
            y: hc2 - globalVertex[line.num2].y / 8,
        }
        con2.strokeStyle = "black";
        drawLine(con2, p1, p2);
    }

    con2.fillStyle = "red";
    con2.beginPath();
    con2.arc(camera.coord.x / 8 + hc2, hc2 - camera.coord.y / 8, 5, 0, 360, false);
    con2.fill();

    con2.strokeStyle = "red";
    con2.beginPath();
    con2.lineTo(camera.coord.x / 8 + hc2, hc2 - camera.coord.y / 8);
    con2.lineTo(camera.normalVector.ed.x / 8 + hc2, hc2 - camera.normalVector.ed.y / 8);
    con2.stroke();

    frame++;
}

setInterval(mainLoop, 1000 / 60);