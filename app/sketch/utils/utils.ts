/** Scale relative to screen  */
function s(value: number) {
    return min(width, height) * value * 0.001
}

/** Because % operator can't handle negative values */
function modulo(value: number, limit: number) {
    return ((value % limit) + limit) % limit
}

/** Distance between two points with subtracted radius */
function distanceBetween(a: Point, b: Point, aRadius = 0, bRadius = 0): number {
    const dx = a.x - b.x
    const dy = a.y - b.y
    const distance = sqrt(dx * dx + dy * dy)
    const radius = (aRadius * 0.5) + (bRadius * 0.5)
    return distance - radius
}

/** Formats a number to be seperated with a space for every thousand */
function numberWithSpaces(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** A p5.js function which is called when the user resizes the window  */
function windowResized() {
    resizeCanvas(windowWidth, windowHeight)
}