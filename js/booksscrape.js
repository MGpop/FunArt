document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.querySelector(".booksscrape-header-animation");
    const lightbox = document.querySelector(".booksscrape-lightbox");
    const lightboxImage = lightbox?.querySelector("img");
    const screenshots = document.querySelectorAll(".booksscrape-media img");

    if (lightbox && lightboxImage) {
        screenshots.forEach((screenshot) => {
            screenshot.addEventListener("click", () => {
                lightboxImage.src = screenshot.src;
                lightboxImage.alt = screenshot.alt;
                lightbox.showModal();
            });
        });

        lightbox.addEventListener("click", (event) => {
            if (event.target === lightbox) {
                lightbox.close();
            }
        });
    }

    if (!canvas) {
        return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
        return;
    }

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    const lineColors = [
        "#000f94",
        "#99a6ec",
        "#3048ce",
        "#b9c3ff"
    ];


    const lineCount = 14;

    let width = 0;
    let height = 0;
    let phase = 0;
    let animationFrameId = null;


    function resizeCanvas() {
        const rectangle = canvas.getBoundingClientRect();
        const pixelRatio = window.devicePixelRatio || 1;

        width = Math.max(1, rectangle.width);
        height = Math.max(1, rectangle.height);

        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);

        context.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );

        drawLines();
    }


    function drawLines() {
        context.clearRect(
            0,
            0,
            width,
            height
        );

        const spacing = width / (lineCount + 1);
        const yStep = 12;

        for (let index = 0; index < lineCount; index += 1) {
            const baseX = spacing * (index + 1);

            const amplitude = 12 + (index % 4) * 3;
            const frequency = 0.025 + (index % 3) * 0.004;
            const speed = 0.55 + (index % 5) * 0.06;

            context.beginPath();

            for (
                let y = -yStep;
                y <= height + yStep;
                y += yStep
            ) {
                const wave1 = Math.sin(
                    y * frequency
                    + phase * speed
                    + index * 0.65
                );

                const wave2 = Math.sin(
                    y * 0.04
                    - phase * 0.45
                    + index * 0.9
                );

                const x = (
                    baseX
                    + amplitude * wave1
                    + 5 * wave2
                );

                if (y === -yStep) {
                    context.moveTo(x, y);
                } else {
                    context.lineTo(x, y);
                }
            }

            context.strokeStyle = (
                lineColors[index % lineColors.length]
            );

            context.lineWidth = (
                index % 4 === 0
                    ? 5
                    : 3
            );

            context.lineCap = "round";
            context.lineJoin = "round";
            context.stroke();
        }
    }


    function animate() {
        drawLines();

        phase += 0.025;

        animationFrameId = window.requestAnimationFrame(
            animate
        );
    }


    function updateAnimationPreference() {
        if (animationFrameId !== null) {
            window.cancelAnimationFrame(
                animationFrameId
            );

            animationFrameId = null;
        }

        if (reduceMotion.matches) {
            drawLines();
        } else {
            animate();
        }
    }


    window.addEventListener(
        "resize",
        resizeCanvas
    );

    if (typeof reduceMotion.addEventListener === "function") {
        reduceMotion.addEventListener(
            "change",
            updateAnimationPreference
        );
    } else if (typeof reduceMotion.addListener === "function") {
        reduceMotion.addListener(
            updateAnimationPreference
        );
    }

    resizeCanvas();
    updateAnimationPreference();
});
