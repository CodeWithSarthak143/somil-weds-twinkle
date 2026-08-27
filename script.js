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
            }, 1200);
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

        // --- Screen 3 Parallax Photo & Feather Gallery ---
        const galleryEl = document.getElementById('gallery-parallax');
        if (galleryEl) {
            const rect = galleryEl.getBoundingClientRect();
            // Check if section is visible in/near viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
                // Calculate scroll distance relative to the top of the gallery section
                const relativeScroll = window.scrollY - (galleryEl.offsetTop - windowHeight);

                // Parallax Polaroids
                const polaroids = galleryEl.querySelectorAll('.polaroid-card');
                polaroids.forEach(card => {
                    const speed = parseFloat(card.getAttribute('data-speed')) || 0.1;
                    const yTranslate = relativeScroll * speed;
                    // Retain the base rotation styling from CSS
                    let baseRotation = 0;
                    if (card.classList.contains('card-left')) baseRotation = -6;
                    if (card.classList.contains('card-center')) baseRotation = 2;
                    if (card.classList.contains('card-right')) baseRotation = 5;

                    card.style.transform = `translateY(${yTranslate}px) rotate(${baseRotation}deg)`;
                });

                // Parallax Feathers
                const feathers = galleryEl.querySelectorAll('.parallax-feather');
                feathers.forEach(feather => {
                    const speed = parseFloat(feather.getAttribute('data-speed')) || 0.2;
                    const yTranslate = relativeScroll * speed;
                    let baseRotate = 0;
                    let baseScale = '';
                    if (feather.classList.contains('f1')) baseRotate = 35;
                    if (feather.classList.contains('f2')) baseRotate = -45;
                    if (feather.classList.contains('f3')) baseRotate = -10;
                    if (feather.classList.contains('f4')) {
                        baseRotate = 80;
                        baseScale = ' scaleX(-1)';
                    }
                    feather.style.transform = `translateY(${yTranslate}px) rotate(${baseRotate}deg)${baseScale}`;
                });
            }
        }
        // --- Interactive Vertical Timeline Progress Scroll Trigger ---
        const timelineProgress = document.getElementById('timeline-progress');
        const timelineSteps = document.querySelectorAll('.timeline-step');
        const contentSection = document.querySelector('.content-section');
        
        if (timelineProgress && contentSection) {
            const rect = contentSection.getBoundingClientRect();
            const sectionHeight = rect.height;
            const viewHeight = window.innerHeight;
            
            // Calculate progress based on how far the user has scrolled through the invite section
            // Starts drawing line when section enters center, completes when scrolled deep
            const startReveal = rect.top - viewHeight * 0.5;
            const scrollDistance = -startReveal;
            const scrollRange = sectionHeight - viewHeight * 0.4;
            
            let progressPercent = 0;
            if (scrollDistance > 0) {
                progressPercent = Math.min(100, (scrollDistance / scrollRange) * 100);
            }
            
            // Vertical bar filling (now vertical on both desktop and mobile)
            timelineProgress.style.height = `${progressPercent}%`;
            timelineProgress.style.width = `3px`;
            
            // Activate step points and animate slide-in cards based on progress values
            timelineSteps.forEach(step => {
                const targetPercent = parseInt(step.getAttribute('data-progress')) || 0;
                
                // When line reaches the step, light it up
                if (progressPercent >= targetPercent - 5) {
                    step.classList.add('active');
                } else {
                    step.classList.remove('active');
                }

                // If user scrolls past the threshold, make the box slide in beautifully
                if (progressPercent >= targetPercent - 20) {
                    step.classList.add('revealed');
                } else {
                    step.classList.remove('revealed');
                }
            });
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

    // --- Golden Scratch Card Logic ---
    const canvas = document.getElementById('scratch-canvas');
    const wrapper = document.querySelector('.dates-reveal-wrapper');
    
    if (canvas && wrapper) {
        const ctx = canvas.getContext('2d');
        let isDrawing = false;
        let scratched = false;

        // Resize canvas to match its visible wrapper bounding box
        function resizeCanvas() {
            if (scratched) return;
            const rect = wrapper.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            drawGoldLayer();
        }

        function drawGoldLayer() {
            if (!ctx) return;
            
            // Clear
            ctx.globalCompositeOperation = 'source-over';
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw metallic gold gradient
            const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            grad.addColorStop(0, '#d4af37');   // Metallic Gold
            grad.addColorStop(0.3, '#fff3a8');  // Bright Gold Highlight
            grad.addColorStop(0.7, '#aa771c');  // Deep Golden Bronze
            grad.addColorStop(1, '#f3e5ab');    // Brass/Soft Gold
            
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add fine gold texture lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
            ctx.lineWidth = 1;
            for (let i = 0; i < canvas.width; i += 8) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + 20, canvas.height);
                ctx.stroke();
            }

            // Draw text prompt
            ctx.fillStyle = '#4a3300';
            ctx.font = "bold 16px 'Playfair Display', serif";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            // Add slight shadow to scratch text
            ctx.shadowColor = 'rgba(255, 255, 255, 0.35)';
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            ctx.fillText('SCRATCH HERE', canvas.width / 2, canvas.height / 2);
            
            // Reset shadows
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }

        // Initialize canvas sizing (staggered to ensure DOM layout is calculated)
        setTimeout(resizeCanvas, 500);
        window.addEventListener('resize', resizeCanvas);

        // Drawing actions
        function getPointerPos(e) {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        }

        function scratch(e) {
            if (!isDrawing || scratched) return;
            e.preventDefault();
            const pos = getPointerPos(e);
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, 22, 0, Math.PI * 2); // 22px scratch brush radius
            ctx.fill();
        }

        function checkScratchPercentage() {
            if (scratched) return;
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let cleared = 0;
            const totalPixels = imgData.data.length / 4;
            
            for (let i = 3; i < imgData.data.length; i += 4) {
                if (imgData.data[i] === 0) {
                    cleared++;
                }
            }

            const percent = cleared / totalPixels;
            if (percent > 0.40) { // 40% cleared triggers reveal
                scratched = true;
                canvas.style.opacity = '0';
                canvas.style.pointerEvents = 'none';

                // Confetti blast! (Party popper)
                triggerConfettiPopper();

                setTimeout(() => {
                    canvas.remove();
                }, 600);
            }
        }

        function triggerConfettiPopper() {
            if (typeof confetti === 'function') {
                // Left popper blast
                confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { x: 0.2, y: 0.6 },
                    colors: ['#ffd700', '#ff69b4', '#ff758f', '#ffffff']
                });
                
                // Right popper blast
                confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { x: 0.8, y: 0.6 },
                    colors: ['#ffd700', '#ff69b4', '#ff758f', '#ffffff']
                });

                // Center burst after short delay
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        spread: 80,
                        origin: { x: 0.5, y: 0.5 },
                        colors: ['#ffd700', '#ff9f1c', '#ffffff']
                    });
                }, 200);
            }
        }

        // Event listeners
        canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
        canvas.addEventListener('mousemove', scratch);
        window.addEventListener('mouseup', () => { if (isDrawing) { isDrawing = false; checkScratchPercentage(); } });

        canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); });
        canvas.addEventListener('touchmove', scratch);
        window.addEventListener('touchend', () => { if (isDrawing) { isDrawing = false; checkScratchPercentage(); } });
    }

    // --- IST Wedding Countdown Timer ---
    const targetDate = new Date("2026-12-12T00:00:00+05:30").getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Run immediately and then update every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
