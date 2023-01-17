export const key = {};
document.onkeydown = (e) => {
    key[e.key] = true;
    // console.log(e.key);
}
document.onkeyup = (e) => {
    key[e.key] = false;
}

export const sin = (theta) => Math.sin(Math.PI / 180 * theta);
export const cos = (theta) => Math.cos(Math.PI / 180 * theta);
export const tan = (theta) => Math.tan(Math.PI / 180 * theta);

export const atan = (tan) => Math.atan(tan) / Math.PI * 180;


// 三次元上の二点間の距離を計算する関数
export const calc3dLen = (pos1, pos2) => Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y + pos2.y) ** 2 + (pos1.z + pos2.z) ** 2);
