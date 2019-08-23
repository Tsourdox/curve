interface Point {
    x: number;
    y: number;
}

interface Controls {
    left: number,
    right: number,
    special?: number
}

class Snake {
    private readonly name: string;
    private readonly color: string;
    private readonly controls: Controls;
    private thickness!: number;
    private body!: Point[];
    private direction!: number;
    private isAlive!: boolean;

    constructor(name: string, color: string, controls: Controls) {
        this.name = name;
        this.color = color;
        this.controls = controls
        this.birth();
    }

    private birth() {
        const paddingX = width * 0.1;
        const paddingY = height * 0.1;
        this.body = [{
            x: paddingX + random() * (width - paddingX * 2),
            y: paddingY + random() * (height - paddingY * 2)
        }]
        this.direction = random(0, 360);
        this.thickness = 5;
        this.isAlive = true;
    }

    private get head() {
        return this.body[this.body.length - 1];
    }

    private get tail() {
        return this.body[0];
    }

    public update() {
        if (this.isAlive) {
            this.updateDirection();
            this.growBody();
            this.checkIfAlive();
        }
    }

    public draw() {
        this.drawStart();
        this.drawBody();
    }

    private drawStart() {
        const { x, y } = this.body[0];
        noStroke();
        fill(this.color);
        circle(x, y, this.thickness);
    }

    private drawBody() {
        stroke(this.color);
        strokeWeight(this.thickness);
        curveTightness(0.5);
        noFill();

        beginShape();
        curveVertex(this.tail.x, this.tail.y);
        for (let i = 0; i < this.body.length; i++) {
            const { x, y } = this.body[i];
            curveVertex(x, y);
        }
        curveVertex(this.head.x, this.head.y);
        endShape();
    }

    private updateDirection() {
        if (keyIsDown(this.controls.left)) {
            this.direction -= 0.05
        } else if (keyIsDown(this.controls.right)) {
            this.direction += 0.05
        }
    }

    private growBody() {
        const { x, y } = this.body[this.body.length - 1];
        this.body.push({
            x: x + cos(this.direction) * 1.5,
            y: y + sin(this.direction) * 1.5
        })
    }

    private checkIfAlive() {
        // TODO: optimate snake body and remove death by length
        if (this.body.length > 10000) {
            this.isAlive = false;
        }

        const { x, y } = this.head;
        // Dead by wall..
        if (x <= 0 || x >= width || y <= 0 || y >= height) {
            this.isAlive = false;
        }
    }
}