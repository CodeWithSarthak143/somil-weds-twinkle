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
    const videoSection = document.querySelector('.video-section');
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

        // Trigger loop and overlay 1 second before first playback finishes
        let maskTriggered = false;

        weddingVideo.addEventListener('timeupdate', () => {
            if (weddingVideo.duration && (weddingVideo.duration - weddingVideo.currentTime <= 1.0)) {
                if (!maskTriggered) {
                    maskTriggered = true;
                    if (videoSection) {
                        videoSection.classList.add('masked');
                    }
                    weddingVideo.loop = true;
                }
            } else if (weddingVideo.currentTime < 1.0) {
                // Reset mask state if video restarts from the beginning
                maskTriggered = false;
                if (videoSection) {
                    videoSection.classList.remove('masked');
                }
                weddingVideo.loop = false;
            }
        });
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

        // Determine starting edge (outside viewport)
        const edge = Math.floor(Math.random() * 4);
        let startX, startY;
        const offset = 60; // offset outside screen bounds

        if (edge === 0) { // Left
            startX = -offset;
            startY = Math.random() * window.innerHeight;
        } else if (edge === 1) { // Right
            startX = window.innerWidth + offset;
            startY = Math.random() * window.innerHeight;
        } else if (edge === 2) { // Top
            startX = Math.random() * window.innerWidth;
            startY = -offset;
        } else { // Bottom
            startX = Math.random() * window.innerWidth;
            startY = window.innerHeight + offset;
        }

        butterfly.style.left = `${startX}px`;
        butterfly.style.top = `${startY}px`;
        butterflyContainer.appendChild(butterfly);

        // Flight stages:
        // 0 & 1: Flutter to random points inside screen
        // 2: Fly outside screen (exit stage) and self-destruct
        let flightStage = 0;

        function fly() {
            if (!butterfly.parentNode) return;

            let targetX, targetY;
            let duration = 4000 + Math.random() * 4000; // 4s to 8s per segment

            if (flightStage < 2) {
                // Fly to random points inside the viewport
                targetX = 100 + Math.random() * (window.innerWidth - 200);
                targetY = 100 + Math.random() * (window.innerHeight - 200);
                flightStage++;
            } else {
                // Exit screen
                const exitEdge = Math.floor(Math.random() * 4);
                if (exitEdge === 0) { // Left
                    targetX = -offset;
                    targetY = Math.random() * window.innerHeight;
                } else if (exitEdge === 1) { // Right
                    targetX = window.innerWidth + offset;
                    targetY = Math.random() * window.innerHeight;
                } else if (exitEdge === 2) { // Top
                    targetX = Math.random() * window.innerWidth;
                    targetY = -offset;
                } else { // Bottom
                    targetX = Math.random() * window.innerWidth;
                    targetY = window.innerHeight + offset;
                }
                flightStage++;
            }

            // Calculate angle to rotate butterfly in the direction of flight
            const currentX = parseFloat(butterfly.style.left) || 0;
            const currentY = parseFloat(butterfly.style.top) || 0;
            const dx = targetX - currentX;
            const dy = targetY - currentY;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;

            butterfly.style.transition = `left ${duration}ms ease-in-out, top ${duration}ms ease-in-out, transform 1200ms ease-in-out`;
            butterfly.style.left = `${targetX}px`;
            butterfly.style.top = `${targetY}px`;
            butterfly.style.transform = `rotate(${angle}deg)`;

            if (flightStage <= 2) {
                setTimeout(fly, duration);
            } else {
                // Once it exits the screen, remove from DOM
                setTimeout(() => {
                    butterfly.remove();
                }, duration);
            }
        }

        // Start flight after a tiny delay
        setTimeout(fly, 50);
    }

    // Spawn manager to dynamically control population (keeps 1 to 2 butterflies)
    function spawnManager() {
        const activeCount = butterflyContainer ? butterflyContainer.children.length : 0;
        
        // Pick a random target between 1 and 2
        const targetCount = 1 + Math.floor(Math.random() * 2); // 1 or 2
        
        if (activeCount < targetCount) {
            createButterfly();
        }
        
        // Schedule next check
        setTimeout(spawnManager, 2000 + Math.random() * 2000);
    }

    // Start spawn manager
    spawnManager();

    // --- Petal Rain Spawner ---
    const petalContainer = document.getElementById('petal-container');
    const petalImages = [
        'images/delicate-pink-flower-petal-with-yellow-base_53876-1375095-Photoroom.png',
        'images/delicate-pink-rose-petal-isolated-on-transparent-background-free-png.png',
        'images/df0f9a13eb63265708631abee52245c7-Photoroom.png',
        'images/images-Photoroom.png'
    ];

    function createPetal() {
        if (!petalContainer) return;
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        const randomImg = petalImages[Math.floor(Math.random() * petalImages.length)];
        petal.style.backgroundImage = `url('${randomImg}')`;
        petal.style.backgroundSize = 'contain';
        petal.style.backgroundRepeat = 'no-repeat';
        
        // Random size between 12px and 26px
        const size = 12 + Math.random() * 14;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        
        // Random starting horizontal position
        petal.style.left = `${Math.random() * window.innerWidth}px`;
        
        // Randomize fall properties
        const duration = 6000 + Math.random() * 6000; // 6s to 12s
        const delay = Math.random() * 1000; // 0s to 1s delay
        const drift = -80 + Math.random() * 160; // drift left or right up to 80px
        const rotation = 360 + Math.random() * 720; // spin degrees
        const flip = Math.random() > 0.5 ? 360 : -360; // 3D flip direction

        petal.style.animationDuration = `${duration}ms`;
        petal.style.animationDelay = `${delay}ms`;
        
        // Inject properties into CSS using CSS variables
        petal.style.setProperty('--drift', `${drift}px`);
        petal.style.setProperty('--rotation', `${rotation}deg`);
        petal.style.setProperty('--flip', `${flip}deg`);
        
        petalContainer.appendChild(petal);
        
        // Clean up from DOM once animation is complete
        setTimeout(() => {
            petal.remove();
        }, duration + delay);
    }

    // Spawn a petal periodically (every 450ms to keep a steady, elegant rain)
    setInterval(createPetal, 450);
});
