// export let key = [];
export let key = {};
document.onkeydown = (e) => {
    // key[e.keyCode] = true;
    key[e.key] = true;
    console.log(e.key);
}
document.onkeyup = (e) => {
    key[e.key] = false;
}

export function sin(theta) {
    return (Math.sin(Math.PI / 180 * theta));
}
export function cos(theta) {
    return (Math.cos(Math.PI / 180 * theta));
}
export function tan(theta) {
    return (Math.tan(Math.PI / 180 * theta));
}

export function atan(tan) {
    return Math.atan(tan) / Math.PI * 180;
}

// 三次元上の二点間の距離を計算する関数
export function calc3dLen(pos1, pos2) {
    return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y + pos2.y) ** 2 + (pos1.z + pos2.z) ** 2);
}
