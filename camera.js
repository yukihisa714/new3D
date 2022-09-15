import { Point, Vector } from "./shape.js";
import { key, sin, cos, tan, atan, calc3dLen } from "./utility.js";

// カメラクラス
export class Camera {
    constructor() {

        // カメラの座標
        this.coord = new Point(0, 0, 0);

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
        this.normalVector.st = this.coord;

        const tmpZ1 = sin(this.rotate.x) * this.normalVector.length;
        const tmpY1 = cos(this.rotate.x) * this.normalVector.length;
        const tmpY2 = cos(this.rotate.z) * tmpY1;
        const tmpX1 = sin(this.rotate.z) * tmpY1;

        // 終点
        this.normalVector.ed = new Point(
            tmpX1 + this.normalVector.st.x,
            tmpY2 + this.normalVector.st.y,
            tmpZ1 + this.normalVector.st.z
        );
        // this.normalVector.ed = {
        //     x: tmpX1 + this.normalVector.st.x,
        //     y: tmpY2 + this.normalVector.st.y,
        //     z: tmpZ1 + this.normalVector.st.z,
        // };

        let displacement = new Vector(this.normalVector.st, this.normalVector.ed);

        // ベクトル
        this.normalVector.vector = displacement.calcDisplacement();

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
