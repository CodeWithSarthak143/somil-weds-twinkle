document.addEventListener('DOMContentLoaded', () => {
    const layerBg = document.getElementById('layer-bg');
    const layerMountains = document.getElementById('layer-mountains');
    const layerTemple = document.getElementById('layer-temple');
    const layerTrees = document.getElementById('layer-trees');
    const overlayText = document.getElementById('overlay-text');

    window.addEventListener('scroll', () => {
        const scrollValue = window.scrollY;

        // Perform translate transformations based on scroll speed ratios
        // Background Deities (moves very slowly downward to stay visible)
        if (layerBg) {
            layerBg.style.transform = `translateY(${scrollValue * 0.4}px)`;
        }

        // Midground Snowy Peaks (moves moderately slowly)
        if (layerMountains) {
            layerMountains.style.transform = `translateY(${scrollValue * 0.25}px)`;
        }

        // Temple (moves slightly slower than mountains)
        if (layerTemple) {
            layerTemple.style.transform = `translateY(${scrollValue * 0.12}px)`;
        }

        // Trees (foreground layer, stays static or moves very little to anchor page transition)
        if (layerTrees) {
            layerTrees.style.transform = `translateY(${scrollValue * 0.02}px)`;
        }

        // Main overlay text (moves fast upward and fades out)
        if (overlayText) {
            overlayText.style.transform = `translateY(${-scrollValue * 0.6}px)`;
            overlayText.style.opacity = Math.max(0, 1 - scrollValue / 400);
        }
    });
});
