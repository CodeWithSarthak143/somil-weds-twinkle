/**
 * Wedding Website — Door Opening Interaction Script
 * 
 * Flow:
 * 1. User sees the palace facade with closed doors.
 * 2. A "Tap to Open" hint pulses on the doors.
 * 3. On click/tap:
 *    a. Doors swing open with a 3D rotateY animation (CSS transition).
 *    b. After a short delay, the entire facade zooms in toward the archway opening.
 *    c. While zooming, the white invitation scene fades in behind.
 *    d. Once the zoom is complete, the intro scene is hidden entirely.
 *    e. The invitation card animates into view.
 */

(function () {
    'use strict';

    // DOM Elements
    const doorContainer = document.getElementById('door-container');
    const doorLeft      = document.getElementById('door-left');
    const doorRight     = document.getElementById('door-right');
    const tapHint       = document.getElementById('tap-hint');
    const facadeWrapper = document.getElementById('facade-wrapper');
    const introScene    = document.getElementById('intro-scene');
    const inviteScene   = document.getElementById('invitation-scene');
    const inviteCard    = document.getElementById('invitation-card');

    let isAnimating = false;

    /**
     * Main handler: opens the doors and triggers the full transition sequence.
     */
    function openDoors() {
        if (isAnimating) return;
        isAnimating = true;

        // 1. Hide the tap hint immediately
        tapHint.classList.add('hidden');

        // 2. Swing doors open (CSS transition: 1.6s)
        doorLeft.classList.add('open');
        doorRight.classList.add('open');

        // 3. After doors are partially open, start zooming in
        setTimeout(() => {
            facadeWrapper.classList.add('zooming');
        }, 600);

        // 4. Fade in the invitation scene behind the zoom
        setTimeout(() => {
            inviteScene.classList.add('visible');
        }, 1200);

        // 5. After the zoom completes, hide the intro scene entirely
        //    and animate the invitation card in
        setTimeout(() => {
            introScene.classList.add('hidden');

            // Small delay before card animation for a clean feel
            setTimeout(() => {
                inviteCard.classList.add('animate-in');
            }, 300);
        }, 2600);
    }

    // Attach event listener
    doorContainer.addEventListener('click', openDoors);
    doorContainer.addEventListener('touchend', function (e) {
        e.preventDefault(); // prevent ghost click
        openDoors();
    });
})();
