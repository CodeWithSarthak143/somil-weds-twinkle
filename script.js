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
        // Second Screen triggers between 400px and 900px scroll depth.
        const startScroll = 400;
        const endScroll = 850;
        const handUnionContainer = document.getElementById('hand-union-container');

        if (scrollValue > startScroll) {
            const progress = Math.min(1, (scrollValue - startScroll) / (endScroll - startScroll));

            if (handUnionContainer) {
                // Add wiggle class when hands are active and moving, remove it when fully joined
                if (progress > 0 && progress < 1) {
                    handUnionContainer.classList.add('active-wiggle');
                } else {
                    handUnionContainer.classList.remove('active-wiggle');
                }
            }

            // Shiva Hand (moves from left to center)
            if (shivaHand) {
                shivaHand.style.opacity = progress;
                // Meet in center
                const currentLeft = -45 + (progress * 39); 
                const currentY = 10 - (progress * 5);
                shivaHand.style.transform = `translate(${currentLeft}vw, ${currentY}vh)`;
            }

            // Parvati Hand (moves from right to center)
            if (parvatiHand) {
                parvatiHand.style.opacity = progress;
                const currentRight = -45 + (progress * 33);
                const currentY = 10 - (progress * 5);
                parvatiHand.style.transform = `translate(${currentRight}vw, ${currentY}vh) scaleX(-1)`;
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
            if (handUnionContainer) {
                handUnionContainer.classList.remove('active-wiggle');
            }
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
    });
});
