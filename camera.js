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
            st: undefined, // 始点
            ed: undefined, // 終点
            vector: undefined, // ベクトル
        };

        // カメラの平面の方程式
        this.planeEquation = {};

        // カメラの移動速度
        this.speed = 2;
        this.sensitive = 0.5;

    }
    update() {
        if (key["w"]) { // 前
            this.coord.x += sin(this.rotate.z + 0) * this.speed;
            this.coord.y += cos(this.rotate.z + 0) * this.speed;
        }
        if (key["s"]) { // 後ろ
            this.coord.x -= sin(this.rotate.z + 0) * this.speed;
            this.coord.y -= cos(this.rotate.z + 0) * this.speed;
        }
        if (key["d"]) { // 右
            if (this.rotate.z === 0) {
                this.coord.x += this.speed;
            }
            else {
                this.coord.x += sin(this.rotate.z + 90) * this.speed;
                this.coord.y += cos(this.rotate.z + 90) * this.speed;
            }
        }
        if (key["a"]) { // 左
            if (this.rotate.z === 0) {
                this.coord.x -= this.speed;
            }
            else {
                this.coord.x += sin(this.rotate.z - 90) * this.speed;
                this.coord.y += cos(this.rotate.z - 90) * this.speed;
            }
        }
        if (key[" "]) { // 上
            this.coord.z += this.speed;
        }
        if (key["Shift"]) { // 下
            this.coord.z -= this.speed;
        }

        if (key["ArrowLeft"]) this.rotate.z -= this.sensitive; // 左
        if (key["ArrowRight"]) this.rotate.z += this.sensitive; // 右
        if (key["ArrowUp"]) this.rotate.x += this.sensitive; // 上
        if (key["ArrowDown"]) this.rotate.x -= this.sensitive; // 下

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
        this.normalVector.vector = displacement.vector;

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
