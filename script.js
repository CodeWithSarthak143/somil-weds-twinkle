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

    window.addEventListener('scroll', () => {
        const scrollValue = window.scrollY;
        const windowHeight = window.innerHeight;

        // --- Screen 1 Parallax Animations ---
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

        // --- Screen 2 Hand Union Scrolling Animations ---
        // Trigger hand movements when user starts scrolling down towards second screen
        // Threshold: Hands start coming in after scrolling 150px, and meet around 500px scroll
        const startScroll = 150;
        const endScroll = 550;

        if (scrollValue > startScroll) {
            const progress = Math.min(1, (scrollValue - startScroll) / (endScroll - startScroll));

            // Shiva Hand (moves from left to center)
            if (shivaHand) {
                shivaHand.style.opacity = progress;
                // Translate left coordinate from -40vw to meeting point near center (-6vw to offset wrist overlap)
                const currentLeft = -40 + (progress * 34); 
                // Moves slightly upwards as they join
                const currentY = 15 - (progress * 10);
                shivaHand.style.transform = `translate(${currentLeft}vw, ${currentY}vh)`;
            }

            // Parvati Hand (moves from right to center)
            if (parvatiHand) {
                parvatiHand.style.opacity = progress;
                // Translate right coordinate from -40vw to meeting point near center (-12vw offset)
                const currentRight = -40 + (progress * 28);
                const currentY = 15 - (progress * 10);
                parvatiHand.style.transform = `translate(${currentRight}vw, ${currentY}vh) scaleX(-1)`; // Flip image horizontally
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
            // Under threshold: hide hands
            if (shivaHand) {
                shivaHand.style.opacity = 0;
                shivaHand.style.transform = 'translate(-40vw, 15vh)';
            }
            if (parvatiHand) {
                parvatiHand.style.opacity = 0;
                parvatiHand.style.transform = 'translate(40vw, 15vh)';
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
    });
});
