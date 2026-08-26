document.addEventListener('DOMContentLoaded', () => {
    const layerBg = document.getElementById('layer-bg');
    const layerMountains = document.getElementById('layer-mountains');
    const layerTemple = document.getElementById('layer-temple');
    const layerTrees = document.getElementById('layer-trees');
    const overlayText = document.getElementById('overlay-text');

    const shineFlash = document.getElementById('shine-flash');
    const saveDatesCard = document.getElementById('save-dates-card');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');

    let flashTriggered = false;

    // Sync button state (icon & rotation) with actual audio playback status
    function updateMusicButtonState() {
        if (!bgMusic || !musicToggle) return;
        const iconSpan = musicToggle.querySelector('.music-icon');
        if (bgMusic.paused) {
            musicToggle.classList.remove('playing');
            if (iconSpan) iconSpan.textContent = '🔇';
        } else {
            musicToggle.classList.add('playing');
            if (iconSpan) iconSpan.textContent = '🎵';
        }
    }

    // Toggle play/pause
    function toggleMusic() {
        if (!bgMusic) return;
        if (bgMusic.paused) {
            bgMusic.play().then(() => {
                updateMusicButtonState();
            }).catch(e => {
                console.log('Playback failed on toggle:', e);
            });
        } else {
            bgMusic.pause();
            updateMusicButtonState();
        }
    }

    if (musicToggle) {
        musicToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering document-wide listeners
            toggleMusic();
        });
    }

    const welcomeOverlay = document.getElementById('welcome-overlay');
    const enterBtn = document.getElementById('enter-btn');

    // Prevent scroll until overlay is dismissed
    document.body.classList.add('no-scroll');

    if (enterBtn && welcomeOverlay) {
        enterBtn.addEventListener('click', () => {
            // Dismiss welcome screen
            welcomeOverlay.classList.add('fade-out');
            document.body.classList.remove('no-scroll');

            // Play background music (unlocked by this click)
            if (bgMusic && bgMusic.paused) {
                bgMusic.play().then(() => {
                    console.log('Music started successfully via Open Invitation button.');
                    updateMusicButtonState();
                }).catch(e => {
                    console.log('Audio playback failed:', e);
                });
            }

            // Remove welcome screen from DOM after transition finishes
            setTimeout(() => {
                welcomeOverlay.remove();
            }, 800);
        });
    }

    // Set initial button state (mute icon displayed initially since it hasn't played yet)
    updateMusicButtonState();

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

        // --- Screen 2 Save the Dates Reveal ---
        // Second Screen triggers Save the Dates content between 100vh and 185vh scroll depth.
        const startScroll = windowHeight;
        const endScroll = windowHeight * 1.85;

        if (scrollValue >= startScroll) {
            const progress = Math.min(1, (scrollValue - startScroll) / (endScroll - startScroll));

            // If progress hits 100%, trigger flash and display card.
            if (progress >= 0.7) {
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
            // Under threshold: reset animation triggers
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
