export class Point {
    /**
     * 
     * @param {number} x 
     * @param {number} y 
     * @param {number} z 
     */
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * 
     * @param {Point} p 
     * @returns 
     */
    getDist(p) {
        return Math.sqrt((this.x - p.x) ** 2 + (this.y - p.y) ** 2 + (this.z - p.z) ** 2);
    }
}

export class Line {
    /**
     * 
     * @param {Point} st 
     * @param {Point} ed 
     */
    constructor(st, ed) {
        this.st = st;
        this.ed = ed;
        this.length = st.getDist(ed);
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