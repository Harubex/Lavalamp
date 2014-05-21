var descriptions = {
    speed: [
        "<header>Speed</header>",
        "This controls the speed that balls travel upwards, applied as a modifier to their base speed (which itself is a function of the ball's size).",
        "Setting this too low may lead to overly-sluggish balls.",
        "Setting this too high may lead to ridiculously-fast balls."
    ],
    rate: [
        "<header>Rate</header>",
        "This controls the rate at which new balls will be created.", 
        "Setting this too low may lead to long periods of inactivity.",
        "Setting this too high may lead to chaos (depends upon user's definition of chaos)."
    ],
    size: [
        "<header>Size</header>",
        "This controls the range of sizes that newly-spawned balls will be given.", 
        "Setting this too low may cause some of the spawned balls to not render."
    ],
    threshold: [
        "<header>Threshold</header>",
        "This controls the cutoff point at which any given vertex will render.",
        "Setting this too low with respect to the balls' resolution causes some or all of them to not render."
    ],
    resolution: [
        "<header>Resolution</header>",
        "This controls the spacing of each point taken into consideration when rendering the balls and, subsequently, affects the quality of the render.",
        "Setting this too low will yield a poor-looking render and cause undesirable artifacts to appear.",
        "Setting this too high will lead to performance issues on all but the beefiest systems."
    ],
    materials: [
        "<header>Materials</header>",
        "This controls which material the balls are rendered with.",
        "Basic - A basic material that doesn't care about lighting. Kinda neat for seeing what 2d metaballs look like.",
        "Lambert - A material for non-shiny surfaces. In my opinion this one seems the most lava-y.",
        "Normal - A material that maps the faces' normal vectors to RGB colors.",
        "Phong - A material for shiny surfaces. This one kinda creeps me out a bit.",
        "Wireframe - A material that shows, well, a wireframe."
    ]
};