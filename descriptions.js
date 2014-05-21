var descriptions = {
    speed: [
        "<h6>Speed</h6>",
        "This controls the speed that balls travel upwards, applied as a modifier to their base speed (which itself is a function of the ball's size).",
        "Setting this too low may lead to overly-sluggish balls.",
        "Setting this too high may lead to ridiculously-fast balls."
    ],
    rate: [
        "<h6>Rate</h6>",
        "This controls the rate at which new balls will be created.", 
        "Setting this too low may lead to long periods of inactivity.",
        "Setting this too high may lead to chaos (depends upon user's definition of chaos)."
    ],
    size: [
        "<h6>Size</h6>",
        "This controls the range of sizes that newly-spawned balls will be given.", 
        "Setting this too low may cause some of the spawned balls to not render."
    ],
    threshold: [
        "<h6>Threshold</h6>",
        "This controls the cutoff point at which any given vertex will render.",
        "Setting this too low with respect to the balls' resolution causes some or all of them to not render."
    ],
    resolution: [
        "<h6>Resolution</h6>",
        "This controls the spacing of the points taken into consideration when rendering the balls and, subsequently, the quality of the render.",
        "Setting this too low will yield a poor-looking render and cause undesirable artifacts to appear.",
        "Setting this too high will lead to performance issues on all but the beefiest systems."
    ]
};