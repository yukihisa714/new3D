import { Point, Vector, globalVertex, lines } from "./shape.js";
import { key, sin, cos, tan, atan, calc3dLen } from "./utility.js";

// カメラクラス
class Camera {
    constructor() {

        // カメラの座標
        this.coord = new Point(0, 0, 0);

        // カメラの回転
        this.rotate = {
            x: 0,
            z: 0,
        };

        // カメラの移動速度
        this.speed = 3;
        this.sensitive = 0.8;

        // 法線ベクトル
        this.normalVectorLength = 100;

        // キャンバスの設定
        this.can = document.createElement("canvas");
        this.con = this.can.getContext("2d");
        this.can.width = 540;
        this.can.height = 405;
        this.can.style.background = "gray";
        document.body.appendChild(this.can);

    }

    // キーボードの操作
    keyControl() {
        if (key["w"]) { // 前
            this.coord.x += sin(this.rotate.z + 0) * this.speed;
            this.coord.y += cos(this.rotate.z + 0) * this.speed;
        }
        if (key["s"]) { // 後ろ
            this.coord.x -= sin(this.rotate.z + 0) * this.speed;
            this.coord.y -= cos(this.rotate.z + 0) * this.speed;
        }
        if (key["d"]) { // 右
            this.coord.x += sin(this.rotate.z + 90) * this.speed;
            this.coord.y += cos(this.rotate.z + 90) * this.speed;
        }
        if (key["a"]) { // 左
            this.coord.x += sin(this.rotate.z - 90) * this.speed;
            this.coord.y += cos(this.rotate.z - 90) * this.speed;
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
    }

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

    // カメラ平面の方程式 ax+by+cz+d=0
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

    update() {
        // キーボード操作
        this.keyControl();

        // 法線ベクトルの更新
        this.updateNormalVector();
        // カメラ平面の方程式を更新
        this.updatePlaneEquation();
    }
}

export const camera = new Camera();