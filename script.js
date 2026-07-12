/**
 * Wedding Website - Door opening, scratch reveal, and confetti.
 */
(function () {
    'use strict';

    const doorContainer  = document.getElementById('door-container');
    const doorLeft       = document.getElementById('door-left');
    const doorRight      = document.getElementById('door-right');
    const tapHint        = document.getElementById('tap-hint');
    const facadeWrapper  = document.getElementById('facade-wrapper');
    const introScene     = document.getElementById('intro-scene');
    const inviteScene    = document.getElementById('invitation-scene');
    const scratchCard    = document.getElementById('scratch-card');
    const scratchCanvas  = document.getElementById('scratch-canvas');
    const confettiCanvas = document.getElementById('confetti-canvas');
    const websiteContent = document.getElementById('website-content');

    const scratchCtx = scratchCanvas.getContext('2d', { willReadFrequently: true });
    const confettiCtx = confettiCanvas.getContext('2d');
    const redHeart = new Image();
    redHeart.src = 'images/%23d53636ff.png';

    let isAnimating = false;
    let scratchReady = false;
    let isScratching = false;
    let isRevealed = false;
    let lastPoint = null;
    let scratchCheckFrame = 0;
    let confettiPieces = [];
    let confettiAnimation = 0;

    function fitCanvasToDisplaySize(canvas, ctx) {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const width = Math.max(1, Math.round(rect.width * dpr));
        const height = Math.max(1, Math.round(rect.height * dpr));

        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return rect;
    }

    function drawScratchLayer() {
        if (!redHeart.complete || isRevealed) return;

        const rect = fitCanvasToDisplaySize(scratchCanvas, scratchCtx);
        scratchCtx.globalCompositeOperation = 'source-over';
        scratchCtx.clearRect(0, 0, rect.width, rect.height);
        scratchCtx.drawImage(redHeart, 0, 0, rect.width, rect.height);

        scratchCtx.fillStyle = '#ffffff';
        scratchCtx.textAlign = 'center';
        scratchCtx.textBaseline = 'middle';
        scratchCtx.font = `${Math.max(22, rect.width * 0.13)}px "Great Vibes", cursive`;
        scratchCtx.fillText('Scratch Here', rect.width * 0.5, rect.height * 0.44);
        scratchCtx.fillText('to find out', rect.width * 0.5, rect.height * 0.61);

        scratchReady = true;
    }

    function getScratchPoint(event) {
        const rect = scratchCanvas.getBoundingClientRect();
        const pointer = event.touches ? event.touches[0] : event;

        return {
            x: pointer.clientX - rect.left,
            y: pointer.clientY - rect.top
        };
    }

    function eraseAt(point, previousPoint) {
        const rect = scratchCanvas.getBoundingClientRect();
        const brush = Math.max(14, rect.width * 0.075);

        scratchCtx.globalCompositeOperation = 'destination-out';
        scratchCtx.lineCap = 'round';
        scratchCtx.lineJoin = 'round';
        scratchCtx.lineWidth = brush;

        scratchCtx.beginPath();
        if (previousPoint) {
            scratchCtx.moveTo(previousPoint.x, previousPoint.y);
            scratchCtx.lineTo(point.x, point.y);
        } else {
            scratchCtx.arc(point.x, point.y, brush * 0.5, 0, Math.PI * 2);
        }
        scratchCtx.stroke();
        scratchCtx.fill();
    }

    function checkRevealProgress() {
        cancelAnimationFrame(scratchCheckFrame);

        scratchCheckFrame = requestAnimationFrame(() => {
            const pixels = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
            let transparent = 0;

            for (let index = 3; index < pixels.length; index += 16) {
                if (pixels[index] < 20) transparent++;
            }

            const sampledPixels = pixels.length / 16;
            if (transparent / sampledPixels > 0.56) {
                revealHeart();
            }
        });
    }

    function startScratch(event) {
        if (!scratchReady || isRevealed) return;
        event.preventDefault();
        isScratching = true;
        lastPoint = getScratchPoint(event);
        eraseAt(lastPoint);
        checkRevealProgress();
    }

    function moveScratch(event) {
        if (!isScratching || isRevealed) return;
        event.preventDefault();
        const point = getScratchPoint(event);
        eraseAt(point, lastPoint);
        lastPoint = point;
        checkRevealProgress();
    }

    function stopScratch() {
        isScratching = false;
        lastPoint = null;
    }

    function revealHeart() {
        if (isRevealed) return;
        isRevealed = true;
        isScratching = false;
        scratchCard.classList.add('revealed');
        launchConfetti();
        showWebsiteAfterReveal();
    }

    function showWebsiteAfterReveal() {
        setTimeout(() => {
            scratchCard.classList.add('vanish');
        }, 1800);

        setTimeout(() => {
            inviteScene.classList.add('website-visible');
            websiteContent.classList.add('visible');
        }, 2500);
    }

    function resizeConfettiCanvas() {
        const dpr = window.devicePixelRatio || 1;
        confettiCanvas.width = Math.round(window.innerWidth * dpr);
        confettiCanvas.height = Math.round(window.innerHeight * dpr);
        confettiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function launchConfetti() {
        const colors = ['#ff6470', '#ff9ecf', '#f7cf54', '#ffffff', '#79d3ff', '#8adf9a'];
        const originX = window.innerWidth / 2;
        const originY = window.innerHeight * 0.42;

        resizeConfettiCanvas();
        confettiPieces = Array.from({ length: 230 }, () => {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI;
            const speed = 4 + Math.random() * 8;

            return {
                x: originX + (Math.random() - 0.5) * 120,
                y: originY + (Math.random() - 0.5) * 60,
                vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2,
                vy: Math.sin(angle) * speed,
                gravity: 0.055 + Math.random() * 0.055,
                drag: 0.992,
                size: 6 + Math.random() * 9,
                rotation: Math.random() * Math.PI,
                spin: (Math.random() - 0.5) * 0.28,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 300 + Math.random() * 150
            };
        });

        cancelAnimationFrame(confettiAnimation);
        animateConfetti();
    }

    function animateConfetti() {
        confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        confettiPieces = confettiPieces.filter((piece) => piece.life > 0);
        confettiPieces.forEach((piece) => {
            piece.x += piece.vx;
            piece.y += piece.vy;
            piece.vx *= piece.drag;
            piece.vy = piece.vy * piece.drag + piece.gravity;
            piece.rotation += piece.spin;
            piece.life -= 1;

            confettiCtx.save();
            confettiCtx.translate(piece.x, piece.y);
            confettiCtx.rotate(piece.rotation);
            confettiCtx.globalAlpha = Math.min(1, piece.life / 70);
            confettiCtx.fillStyle = piece.color;
            confettiCtx.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.65);
            confettiCtx.restore();
        });

        if (confettiPieces.length) {
            confettiAnimation = requestAnimationFrame(animateConfetti);
        } else {
            confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        }
    }

    function activateScratchScene() {
        scratchCard.classList.add('animate-in');
        setTimeout(drawScratchLayer, 250);
    }

    function openDoors() {
        if (isAnimating) return;
        isAnimating = true;

        tapHint.classList.add('hidden');
        doorLeft.classList.add('open');
        doorRight.classList.add('open');

        setTimeout(() => {
            facadeWrapper.classList.add('zooming');
        }, 600);

        setTimeout(() => {
            inviteScene.classList.add('visible');
        }, 1200);

        setTimeout(() => {
            introScene.classList.add('hidden');
            activateScratchScene();
        }, 2600);
    }

    doorContainer.addEventListener('click', openDoors);
    doorContainer.addEventListener('touchend', function (event) {
        event.preventDefault();
        openDoors();
    });

    scratchCanvas.addEventListener('mousedown', startScratch);
    scratchCanvas.addEventListener('mousemove', moveScratch);
    window.addEventListener('mouseup', stopScratch);

    scratchCanvas.addEventListener('touchstart', startScratch, { passive: false });
    scratchCanvas.addEventListener('touchmove', moveScratch, { passive: false });
    window.addEventListener('touchend', stopScratch);

    redHeart.addEventListener('load', drawScratchLayer);
    window.addEventListener('resize', function () {
        resizeConfettiCanvas();
        drawScratchLayer();
    });

    resizeConfettiCanvas();
})();
