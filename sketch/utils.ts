/** Scale relative to screen  */
function s(value: number) {
    return min(width, height) * value * 0.001
}

/** Because % operator can't handle negative values */
function modulo(value: number, limit: number) {
    return ((value % limit) + limit) % limit;
};