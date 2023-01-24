import { Point, Vector, globalVertex, lines } from "./shape.js";
import { key, sin, cos, tan, atan, calc3dLen } from "./utility.js";

class Camera {
    constructor() {
        // カメラの座標
        this.coord = new Point(0, 0, 0);

        // カメラの回転
        this.rotate = {
            x: 0,
            z: 0,
        };

        // 法線ベクトルの長さ
        this.normalVectorLength = 100;
    }
    // }
    // const camera = new Camera();

    // 法線ベクトルの更新
    updateNormalVector() {
        const tmpZ1 = sin(this.rotate.x) * this.normalVectorLength;
        const tmpY1 = cos(this.rotate.x) * this.normalVectorLength;
        const tmpY2 = cos(this.rotate.z) * tmpY1;
        const tmpX1 = sin(this.rotate.z) * tmpY1;

        // 終点
        const normalVectorEd = new Point(
            tmpX1 + this.coord.x,
            tmpY2 + this.coord.y,
            tmpZ1 + this.coord.z,
        );

        // ベクトル
        this.normalVector = new Vector(this.coord, normalVectorEd);
    }

    // カメラ平面の方程式（ax+by+cz+d=0）の更新
    updatePlaneEquation() {
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

const length = calc3dLen(camera.coord, point);



// カメラの法線ベクトル
const CNV = camera.normalVector.vector;
// カメラ平面の方程式
const CPE = camera.planeEquation;
// 簡略化
const point = globalVertex[i];


const t = -(CPE.a * point.x + CPE.b * point.y + CPE.c * point.z + CPE.d) / (CPE.a * CNV.x + CPE.b * CNV.y + CPE.c * CNV.z);

// カメラ平面との交点
intersectionVtx[i] = new Point(
    CNV.x * t + point.x,
    CNV.y * t + point.y,
    CNV.z * t + point.z,
);

class Point {
    constructor(x, y, z) {
        this.x = x; // x座標
        this.y = y; // y座標
        this.z = z; // z座標
    }
}

class Vector {
    constructor(st, ed) {
        this.st = st;   // 始点
        this.ed = ed;   // 終点
        this.vector = { // ベクトル
            x: this.ed.x - this.st.x,
            y: this.ed.y - this.st.y,
            z: this.ed.z - this.st.z,
        };
    }
}


const dif = {
    x: tmpIntVtx.x - camera.coord.x,
    y: tmpIntVtx.y - camera.coord.y,
    z: tmpIntVtx.z - camera.coord.z,
};

const sinX = sin(camera.rotate.x);
const cosX = cos(camera.rotate.x);
const sinZ = sin(camera.rotate.z);
const cosZ = cos(camera.rotate.z);

// 加法定理の点の回転を利用
tmpIntVtx.x = dif.x * cosZ - dif.y * sinZ;
tmpIntVtx.y = dif.y * cosZ + dif.x * sinZ;

// データの更新
dif.x = tmpIntVtx.x - camera.coord.x;
dif.y = tmpIntVtx.y - camera.coord.y;
dif.z = tmpIntVtx.z - camera.coord.z;

// 加法定理の点の回転を利用
mpIntVtx.y = dif.y * cosX + dif.z * sinX;
tmpIntVtx.z = dif.z * cosX - dif.y * sinX;

// 二次元座標の配列に格納
d2Vertex[i] = {
    x: tmpIntVtx.x,
    y: tmpIntVtx.z,
};


// 二次元座標の配列に格納
d2Vertex[i].x = d2Vertex[i].x * 20 / Math.sqrt(length) + can.width / 2;
d2Vertex[i].y = can.height - (tmpInd2Vertex[i].y * 20 / Math.sqrt(length) + can.height / 2);
