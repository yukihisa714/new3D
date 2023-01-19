export class Point {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor(x, y, z, isDraw) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.isDraw = isDraw;
    }

    /**
     * 
     * @param {Point} p 
     * @returns 
     */
    getDist(p) {
        return Math.sqrt((this.x - p.x) ** 2 + (this.y - p.y) ** 2 + (this.z - p.z) ** 2);
    }

    getIsPointInFront() {

    }
}

// export class Line {
//     /**
//      * 
//      * @param {Point} st 
//      * @param {Point} ed 
//      */
//     constructor(st, ed) {
//         this.st = st;
//         this.ed = ed;
//         this.length = st.getDist(ed);
//     }
// }

export class Line {
    constructor(point1Num, point2Num) {
        this.num1 = point1Num;
        this.num2 = point2Num;
    }
}

export class Triangle {
    /**
     * 
     * @param {Point} p1 
     * @param {Point} p2 
     * @param {Point} p3 
     */
    constructor(p1, p2, p3) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }
}

export class Vector {
    /**
     * 
     * @param {Point} st 
     * @param {Point} ed 
     */
    constructor(st, ed) {
        this.st = st;
        this.ed = ed;
        this.vector = {
            x: this.ed.x - this.st.x,
            y: this.ed.y - this.st.y,
            z: this.ed.z - this.st.z,
        };
    }
}


export const globalVertex = [
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

export const lines = [
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
