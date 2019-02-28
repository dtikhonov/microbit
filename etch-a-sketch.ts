/*
 * etch-a-sketch.ts -- Etch-A-Sketch for micro:bit
 *
 * Author: Dmitri Tikhonov
 *
 * Functionality:
 *    - Shake:begin a new game.
 *    - Tilt board in any of the four directions: move cursor.
 *    - Press A: toggle LED under cursor.
 *    - Press AB: save current picture and stop cursor
 *    - Press B: restore and edit saved picture.
 */

let cursor_x = -1
let cursor_y = -1
let old_x = -1, old_y = -1
let picture = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
]

let savedPicture = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
]

function resetPicture() {
    for (let x = 0; x < 5; ++x)
        for (let y = 0; y < 5; ++y)
            picture[x][y] = 0
}

function savePicture() {
    for (let x = 0; x < 5; ++x)
        for (let y = 0; y < 5; ++y)
            savedPicture[x][y] = picture[x][y]
}

function restorePicture() {
    for (let x = 0; x < 5; ++x)
        for (let y = 0; y < 5; ++y) {
            picture[x][y] = savedPicture[x][y]
            if (picture[x][y] != (led.point(x, y) ? 1 : 0))
                led.toggle(x, y)
        }
}

function newCursor() {
    cursor_x = 2
    cursor_y = 2
    old_x = 2
    old_y = 2
}

function newGame() {
    resetPicture()
    basic.clearScreen()
    newCursor()
}

function needUpdate() { return old_x != cursor_x || old_y != cursor_y }

input.onGesture(Gesture.TiltLeft, function () {
    if (cursor_x > 0 && !needUpdate()) {
        moveCursor(cursor_x - 1, cursor_y)
    }
})

input.onGesture(Gesture.TiltRight, function () {
    if (cursor_x >= 0 && cursor_x < 4 && !needUpdate()) {
        moveCursor(cursor_x + 1, cursor_y)
    }
})

input.onGesture(Gesture.LogoUp, function () {
    if (cursor_x >= 0 && cursor_y < 4 && !needUpdate()) {
        moveCursor(cursor_x, cursor_y + 1)
    }
})

input.onGesture(Gesture.LogoDown, function () {
    if (cursor_x >= 0 && cursor_y > 0 && !needUpdate()) {
        moveCursor(cursor_x, cursor_y - 1)
    }
})

input.onButtonPressed(Button.A, function () {
    if (cursor_x >= 0) {
        picture[cursor_x][cursor_y] = picture[cursor_x][cursor_y] ? 0 : 1
    }
})

input.onButtonPressed(Button.AB, function () {
    cursor_x = -1
    savePicture()
})

input.onButtonPressed(Button.B, function () {
    if (cursor_x >= 0) {
        let old_cur = cursor_x
        cursor_x = -1
        restorePicture()
        cursor_x = old_cur
    }
    else
        newCursor()
})

input.onGesture(Gesture.Shake, newGame)

function moveCursor(x: number, y: number) {
    old_x = cursor_x, old_y = cursor_y
    cursor_x = x
    cursor_y = y
}

basic.forever(function () {
    while (true) {
        if (cursor_x >= -1) {
            if (needUpdate()) {
                if (picture[old_x][old_y] != (led.point(old_x, old_y) ? 1 : 0))
                    led.toggle(old_x, old_y)
                old_x = cursor_x
                old_y = cursor_y
            }
            led.toggle(cursor_x, cursor_y)
            basic.pause(150)
        }
    }
})

