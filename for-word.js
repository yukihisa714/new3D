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

    // 法線ベクトル
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


const t = -(CPE.a * point.x + CPE.b * point.y + CPE.c * point.z + CPE.d)
    / (CPE.a * CNV.x + CPE.b * CNV.y + CPE.c * CNV.z);

// カメラ平面との交点
intersectionVtx[i] = new Point(
    CNV.x * t + point.x,
    CNV.y * t + point.y,
    CNV.z * t + point.z,
);

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