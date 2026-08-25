document.addEventListener('DOMContentLoaded', () => {
    const layerBg = document.getElementById('layer-bg');
    const layerMountains = document.getElementById('layer-mountains');
    const layerTemple = document.getElementById('layer-temple');
    const layerTrees = document.getElementById('layer-trees');
    const overlayText = document.getElementById('overlay-text');

    window.addEventListener('scroll', () => {
        const scrollValue = window.scrollY;

        // Background Deities (moves slowly downward to stay visible)
        if (layerBg) {
            layerBg.style.transform = `translateY(${scrollValue * 0.4}px)`;
        }

        // Mountains: offset by baseline (15% height translation) + scrolls up relative to viewport
        if (layerMountains) {
            layerMountains.style.transform = `translateY(calc(15% - ${scrollValue * 0.1}px))`;
        }

        // Temple: starts low (80vh translation) and scrolls up much faster to land on the screen
        if (layerTemple) {
            layerTemple.style.transform = `translateY(calc(80vh - ${scrollValue * 0.9}px))`;
        }

        // Trees (foreground layer)
        if (layerTrees) {
            layerTrees.style.transform = `translateY(${scrollValue * 0.02}px)`;
        }

        // Main overlay text (fades and moves up relative to its bottom: 15% origin)
        if (overlayText) {
            overlayText.style.transform = `translate(-50%, ${-scrollValue * 0.4}px)`;
            overlayText.style.opacity = Math.max(0, 1 - scrollValue / 300);
        }
    });
});
