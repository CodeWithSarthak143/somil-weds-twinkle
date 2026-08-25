document.addEventListener('DOMContentLoaded', () => {
    const layerBg = document.getElementById('layer-bg');
    const layerMountains = document.getElementById('layer-mountains');
    const layerTemple = document.getElementById('layer-temple');
    const layerTrees = document.getElementById('layer-trees');
    const overlayText = document.getElementById('overlay-text');

    const shivaHand = document.getElementById('shiva-hand');
    const parvatiHand = document.getElementById('parvati-hand');
    const shineFlash = document.getElementById('shine-flash');
    const saveDatesCard = document.getElementById('save-dates-card');

    let flashTriggered = false;

    function updateScene() {
        const scrollValue = window.scrollY;
        const windowHeight = window.innerHeight;
        const parallaxScroll = Math.min(scrollValue, windowHeight);

        // --- Screen 1 Parallax Animations ---
        // Background Deities (remains static, does not go down)
        if (layerBg) {
            layerBg.style.transform = `translateY(0px)`;
        }

        // Mountains: offset by baseline (15% height translation) + scrolls up relative to viewport
        if (layerMountains) {
            layerMountains.style.transform = `translateY(calc(15% - ${parallaxScroll * 0.1}px))`;
        }

        // Temple: starts low (80vh translation) and scrolls up much faster to land on the screen
        if (layerTemple) {
            layerTemple.style.transform = `translateY(calc(80vh - ${parallaxScroll * 0.9}px))`;
        }

        // Trees (foreground layer)
        if (layerTrees) {
            layerTrees.style.transform = `translateY(${parallaxScroll * 0.02}px)`;
        }

        // Main overlay text (fades and moves up relative to its bottom: 15% origin)
        if (overlayText) {
            overlayText.style.transform = `translate(-50%, ${-parallaxScroll * 0.4}px)`;
            overlayText.style.opacity = Math.max(0, 1 - parallaxScroll / 300);
        }

        // --- Screen 2 Hand Union Animation ---
        // Keep the first viewport exclusively for the parallax. The hands begin only
        // after that sequence has completed, then have most of the second viewport to meet.
        const startScroll = windowHeight;
        const endScroll = windowHeight * 1.85;

        if (scrollValue >= startScroll) {
            const progress = Math.min(1, (scrollValue - startScroll) / (endScroll - startScroll));

            // Shiva Hand (moves from left to center first)
            // It starts immediately at 0% scroll progress and reaches center by 60% progress
            const shivaProgress = Math.min(1, progress / 0.6);
            if (shivaHand) {
                shivaHand.style.opacity = shivaProgress;
                const currentLeft = -45 + (shivaProgress * 39); 
                const currentY = 10 - (shivaProgress * 5);
                shivaHand.style.transform = `translate(${currentLeft}vw, ${currentY}vh)`;
            }

            // Parvati Hand (moves from right to center next)
            // It starts coming in after Shiva's hand is halfway (starts at 40% progress, reaches center by 100% progress)
            const parvatiProgress = progress < 0.4 ? 0 : Math.min(1, (progress - 0.4) / 0.6);
            if (parvatiHand) {
                parvatiHand.style.opacity = parvatiProgress;
                const currentRight = -45 + (parvatiProgress * 33);
                const currentY = 10 - (parvatiProgress * 5);
                parvatiHand.style.transform = `translate(${currentRight}vw, ${currentY}vh)`;
            }

            // If progress hits 100%, hands are joined. Trigger flash and display card.
            if (progress >= 1) {
                if (!flashTriggered) {
                    flashTriggered = true;
                    if (shineFlash) {
                        shineFlash.classList.add('activate');
                    }
                    setTimeout(() => {
                        if (saveDatesCard) {
                            saveDatesCard.classList.add('reveal');
                        }
                    }, 300);
                }
            } else {
                // If user scrolls back up, reset shine flash and card reveal
                if (flashTriggered) {
                    flashTriggered = false;
                    if (shineFlash) {
                        shineFlash.classList.remove('activate');
                    }
                    if (saveDatesCard) {
                        saveDatesCard.classList.remove('reveal');
                    }
                }
            }
        } else {
            // During the parallax screen: keep both hands completely off-screen.
            if (shivaHand) {
                shivaHand.style.opacity = 0;
                shivaHand.style.transform = 'translate(-45vw, 10vh)';
            }
            if (parvatiHand) {
                parvatiHand.style.opacity = 0;
                parvatiHand.style.transform = 'translate(45vw, 10vh)';
            }
            if (flashTriggered) {
                flashTriggered = false;
                if (shineFlash) {
                    shineFlash.classList.remove('activate');
                }
                if (saveDatesCard) {
                    saveDatesCard.classList.remove('reveal');
                }
            }
        }
    }

    window.addEventListener('scroll', updateScene, { passive: true });
    window.addEventListener('resize', updateScene);
    updateScene();
});
