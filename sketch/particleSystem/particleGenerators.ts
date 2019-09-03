function fireParticle(position?: p5.Vector): Particle {
    return new Particle({
        position,
        velocity: createVector(s(random(-0.3, 0.3)), s(random(-0.3, 0.3))),
        color: color(255, random(150), 0),
        size: s(random(2, 12))
    })
}

function snowParticle(position?: p5.Vector): Particle {
    return new Particle({
        position,
        velocity: createVector(s(random(-0.7, 0.7)), s(random(-0.7, 0.7))),
        color: color(255),
        size: s(random(1, 6))
    })
}
