document.addEventListener('DOMContentLoaded', () => {
    const layerBg = document.getElementById('layer-bg');
    const layerMountains = document.getElementById('layer-mountains');
    const layerTemple = document.getElementById('layer-temple');
    const layerTrees = document.getElementById('layer-trees');
    const overlayText = document.getElementById('overlay-text');

    const shineFlash = document.getElementById('shine-flash');
    const saveDatesCard = document.getElementById('save-dates-card');
    const bgMusic = document.getElementById('bg-music');

    let flashTriggered = false;

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

    // IntersectionObserver to autoplay wedding video when scrolled into view
    const weddingVideo = document.getElementById('wedding-video');
    if (weddingVideo) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    weddingVideo.play().catch(err => {
                        console.log("Wedding video autoplay failed or blocked:", err);
                    });
                } else {
                    weddingVideo.pause();
                }
            });
        }, { threshold: 0.15 });

        videoObserver.observe(weddingVideo);
    }

    // --- Butterfly Spawner & Flight Animator ---
    const butterflyContainer = document.getElementById('butterfly-container');
    const butterflyColors = ['#ff758f', '#ffd700', '#4cc9f0', '#ff9f1c', '#b5179e', '#72efdd'];

    function createButterfly() {
        if (!butterflyContainer) return;

        const butterfly = document.createElement('div');
        butterfly.className = 'butterfly';

        // Select a random color for the butterfly wings
        const randomColor = butterflyColors[Math.floor(Math.random() * butterflyColors.length)];
        butterfly.style.color = randomColor;

        // Build wing and body structure
        const wings = document.createElement('div');
        wings.className = 'wings';
        const leftWing = document.createElement('div');
        leftWing.className = 'wing-left';
        const rightWing = document.createElement('div');
        rightWing.className = 'wing-right';
        const bodyLine = document.createElement('div');
        bodyLine.className = 'body-line';

        wings.appendChild(leftWing);
        wings.appendChild(rightWing);
        wings.appendChild(bodyLine);
        butterfly.appendChild(wings);

        // Set initial random position
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        butterfly.style.left = `${startX}px`;
        butterfly.style.top = `${startY}px`;

        butterflyContainer.appendChild(butterfly);

        // Start animating flight
        animateFlight(butterfly);
    }

    function animateFlight(butterfly) {
        if (!butterfly.parentNode) return;

        // Pick a random target coordinate
        const targetX = Math.random() * (window.innerWidth - 40);
        const targetY = Math.random() * (window.innerHeight - 40);

        // Calculate rotation angle to align with travel vector
        const currentX = parseFloat(butterfly.style.left) || 0;
        const currentY = parseFloat(butterfly.style.top) || 0;
        const dx = targetX - currentX;
        const dy = targetY - currentY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

        // Random duration between 5s and 10s
        const duration = 5000 + Math.random() * 5000;

        butterfly.style.transition = `left ${duration}ms ease-in-out, top ${duration}ms ease-in-out, transform 1000ms ease-in-out`;
        
        // Trigger position update
        butterfly.style.left = `${targetX}px`;
        butterfly.style.top = `${targetY}px`;
        butterfly.style.transform = `rotate(${angle}deg)`;

        // Schedule next segment of flight
        setTimeout(() => {
            animateFlight(butterfly);
        }, duration);
    }

    // Spawn 3 butterflies initially
    for (let i = 0; i < 3; i++) {
        setTimeout(createButterfly, i * 1500); // Stagger spawning slightly
    }
});
