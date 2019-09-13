function fireParticle(position?: p5.Vector): Particle[] {
    return [
        new Particle({
            position,
            velocity: createVector(s(random(-0.3, 0.3)), s(random(-0.3, 0.3))),
            color: color(255, random(150), 0),
            size: s(random(2, 12)),
            lifespan: random(1, 2)
        })
    ]
}

function snowParticle(position?: p5.Vector): Particle[] {
    return [
        new Particle({
            position,
            velocity: createVector(s(random(-0.7, 0.7)), s(random(-0.7, 0.7))),
            color: color(255),
            size: s(random(1, 6)),
            lifespan: random(0.4, 0.8)
        })
    ]
}

function glowParticle(position?: p5.Vector): Particle[] {
    return [
        new Particle({
            position,
            velocity: createVector(s(random(-0.4, 0.4)), s(random(-0.4, 0.4))),
            color: color(255, 255, 0),
            size: s(random(6, 10)),
            lifespan: random(1, 2.5)
        })
    ]
}

function teleportParticle(position?: p5.Vector): Particle[] {
    let particles: Particle[] = []
    for (let i = 0; i < 100; i++) {

        let particleColor = color(255)
        if (random(1) < 0.6) {
            particleColor = color(round(random(50)), 255, round(random(50)))
        }

        particles.push(
            new Particle({
                position,
                velocity: createVector(s(random(-5, 5)), s(random(-5, 5))),
                color: particleColor,
                size: s(random(1, 4)),
                lifespan: random(0.1, 0.3)
            })
        )
    }

    return particles
}
