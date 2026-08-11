/* ==========================================================================
   GEOCITIES SPACE THEME JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initVisitorCounter();
    initGuestbook();
    initSpaceCanvas();
    initCDPlayer();
});

/* ==========================================================================
   1. VISITOR COUNTER
   ========================================================================== */
function initVisitorCounter() {
    let visits = localStorage.getItem('geocities_visits');
    if (!visits) {
        visits = 1337; // Initial cool start number
    } else {
        visits = parseInt(visits) + 1;
    }
    localStorage.setItem('geocities_visits', visits);

    const counterStr = visits.toString().padStart(6, '0');
    const counterEl = document.getElementById('visitorCounter');
    
    if (counterEl) {
        counterEl.innerHTML = '';
        for (let char of counterStr) {
            const span = document.createElement('span');
            span.className = 'counter-digit';
            span.textContent = char;
            counterEl.appendChild(span);
        }
    }
}

/* ==========================================================================
   2. GUESTBOOK SYSTEM
   ========================================================================== */
const SEED_LOGS = [
    {
        name: "🌌 MajorTom99",
        msg: "Ground Control to Lionel! This web portal is out of this world! Love the retro spaceship animations. Webring is working great 🛸",
        date: "08/10/1999, 11:24:45 PM"
    },
    {
        name: "👾 RetroGalaxia",
        msg: "Awesome space cadet zone! Please sign my cyber-guestbook when you get a chance! A+++ site design, bookmarked!",
        date: "05/14/2001, 3:12:09 AM"
    }
];

function initGuestbook() {
    const form = document.getElementById('guestbookForm');
    const logContainer = document.getElementById('logEntries');
    
    if (!form || !logContainer) return;

    // Load or initialize logs
    let logs = localStorage.getItem('geocities_guestbook');
    if (!logs) {
        logs = SEED_LOGS;
        localStorage.setItem('geocities_guestbook', JSON.stringify(logs));
    } else {
        logs = JSON.parse(logs);
    }

    // Render helper
    const renderLogs = () => {
        logContainer.innerHTML = '';
        // Show newest first
        const reversedLogs = [...logs].reverse();
        reversedLogs.forEach(entry => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'log-entry';
            entryDiv.innerHTML = `
                <div class="entry-header">
                    <span class="entry-name">${escapeHTML(entry.name)}</span>
                    <span class="entry-date">${escapeHTML(entry.date)}</span>
                </div>
                <div class="entry-body">${escapeHTML(entry.msg)}</div>
            `;
            logContainer.appendChild(entryDiv);
        });
    };

    // Form submit listener
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('gName');
        const msgInput = document.getElementById('gMsg');

        if (nameInput.value.trim() && msgInput.value.trim()) {
            const now = new Date();
            const newEntry = {
                name: nameInput.value.trim(),
                msg: msgInput.value.trim(),
                date: now.toLocaleString()
            };

            logs.push(newEntry);
            localStorage.setItem('geocities_guestbook', JSON.stringify(logs));
            renderLogs();

            // Clear inputs
            msgInput.value = '';
            nameInput.value = '';
        }
    });

    renderLogs();
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

/* ==========================================================================
   3. RETRO AUDIO PLAYER (WEB AUDIO SYNTH MELODY)
   ========================================================================== */
function initCDPlayer() {
    const btnPlay = document.getElementById('btnPlay');
    const btnStop = document.getElementById('btnStop');
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    const volSlider = document.getElementById('volSlider');
    const cdTrack = document.getElementById('cdTrack');
    const cdTrackName = document.getElementById('cdTrackName');
    const cdTime = document.getElementById('cdTime');
    const cdVisualizer = document.getElementById('cdVisualizer');
    const visBars = document.querySelectorAll('.vis-bar');

    let player = null;
    let isPlaying = false;
    let timeInterval = null;
    let visualizerInterval = null;
    let activeTrackIdx = 0;

    const tracks = [
        {
            name: "SYNTHWAVE RADIO",
            videoId: "4xDzrJKXOOY"
        },
        {
            name: "LOFI HIP HOP RADIO",
            videoId: "oCIzK6--3FM"
        },
        {
            name: "COSMIC RADIO",
            videoId: "WckzeouU2zY"
        },
        {
            name: "TOKYO NIGHT LOFI",
            videoId: "09K79_bD6w0"
        },
        {
            name: "1999 MOMENTUM",
            videoId: "jUyk52REKKg"
        },
        {
            name: "1999 MEMORY",
            videoId: "HpyVBF03vI8"
        }
    ];

    const updateDisplay = () => {
        const trackNum = (activeTrackIdx + 1).toString().padStart(2, '0');
        cdTrack.textContent = `TRK ${trackNum}`;
        if (cdTrackName) {
            cdTrackName.textContent = tracks[activeTrackIdx].name;
        }
        const trackSelect = document.getElementById('trackSelect');
        if (trackSelect) {
            trackSelect.value = activeTrackIdx;
        }
    };

    const startTimer = () => {
        if (timeInterval) clearInterval(timeInterval);
        timeInterval = setInterval(() => {
            if (player && typeof player.getCurrentTime === 'function') {
                const time = Math.floor(player.getCurrentTime());
                const m = Math.floor(time / 60).toString().padStart(2, '0');
                const s = (time % 60).toString().padStart(2, '0');
                cdTime.textContent = `${m}:${s}`;
            }
        }, 1000);

        if (visualizerInterval) clearInterval(visualizerInterval);
        visualizerInterval = setInterval(() => {
            visBars.forEach(bar => {
                const height = Math.floor(Math.random() * 16) + 4;
                bar.style.height = `${height}px`;
            });
        }, 100);
    };

    const stopTimer = () => {
        if (timeInterval) {
            clearInterval(timeInterval);
            timeInterval = null;
        }
        if (visualizerInterval) {
            clearInterval(visualizerInterval);
            visualizerInterval = null;
        }
        visBars.forEach(bar => {
            bar.style.height = `2px`;
        });
    };

    const setupPlayer = () => {
        player = new YT.Player('ytPlayerFrame', {
            videoId: tracks[activeTrackIdx].videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'showinfo': 0,
                'rel': 0,
                'loop': 1,
                'mute': 0,
                'disablekb': 1,
                'modestbranding': 1,
                'enablejsapi': 1
            },
            events: {
                'onReady': () => {
                    btnPlay.disabled = false;
                    volSlider.disabled = false;
                    player.unMute();
                    player.setVolume(volSlider.value * 100);
                },
                'onStateChange': (e) => {
                    if (e.data === YT.PlayerState.PLAYING) {
                        isPlaying = true;
                        btnPlay.disabled = true;
                        btnStop.disabled = false;
                        startTimer();
                    } else {
                        isPlaying = false;
                        btnPlay.disabled = false;
                        btnStop.disabled = true;
                        stopTimer();
                    }
                }
            }
        });
    };

    // Dynamically inject YouTube API Script
    if (typeof YT !== 'undefined' && YT.Player) {
        setupPlayer();
    } else {
        window.onYouTubeIframeAPIReady = () => {
            setupPlayer();
        };

        if (!document.getElementById('ytScript')) {
            const tag = document.createElement('script');
            tag.id = 'ytScript';
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
    }

    const startSynth = () => {
        if (player && typeof player.playVideo === 'function') {
            player.unMute();
            player.setVolume(volSlider.value * 100);
            player.playVideo();
        }
    };

    const stopSynth = () => {
        if (player && typeof player.pauseVideo === 'function') {
            player.pauseVideo();
        }
    };

    const changeTrack = (direction) => {
        if (!player) return;

        const wasPlaying = isPlaying;
        if (direction === 'next') {
            activeTrackIdx = (activeTrackIdx + 1) % tracks.length;
        } else {
            activeTrackIdx = (activeTrackIdx - 1 + tracks.length) % tracks.length;
        }

        updateDisplay();

        if (wasPlaying) {
            player.loadVideoById(tracks[activeTrackIdx].videoId);
            player.unMute();
            player.setVolume(volSlider.value * 100);
        } else {
            player.cueVideoById(tracks[activeTrackIdx].videoId);
        }
    };

    btnPlay.addEventListener('click', startSynth);
    btnStop.addEventListener('click', stopSynth);
    if (btnPrev) btnPrev.addEventListener('click', () => changeTrack('prev'));
    if (btnNext) btnNext.addEventListener('click', () => changeTrack('next'));

    const trackSelect = document.getElementById('trackSelect');
    if (trackSelect) {
        trackSelect.addEventListener('change', (e) => {
            const selectedIdx = parseInt(e.target.value);
            if (!isNaN(selectedIdx) && player) {
                const wasPlaying = isPlaying;
                activeTrackIdx = selectedIdx;
                updateDisplay();

                if (wasPlaying) {
                    player.loadVideoById(tracks[activeTrackIdx].videoId);
                    player.unMute();
                    player.setVolume(volSlider.value * 100);
                } else {
                    player.cueVideoById(tracks[activeTrackIdx].videoId);
                }
            }
        });
    }

    volSlider.addEventListener('input', () => {
        if (player && typeof player.setVolume === 'function') {
            player.setVolume(volSlider.value * 100);
        }
    });

    updateDisplay();
}

/* ==========================================================================
   4. SPACE BACKGROUND & CURSOR TRAILS
   ========================================================================== */
function initSpaceCanvas() {
    const canvas = document.getElementById('trailCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Particle Classes
    class Sparkle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 2;
            this.color = this.getRandomColor();
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.life = 1.0;
            this.decay = Math.random() * 0.03 + 0.02;
        }

        getRandomColor() {
            const colors = ['#00ffff', '#ff00cc', '#ffff00', '#00ff00', '#ffffff'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= this.decay;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 5;
            ctx.shadowColor = this.color;
            
            // Draw a tiny 4-pointed retro star shape
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size);
            ctx.lineTo(this.x + this.size / 3, this.y - this.size / 3);
            ctx.lineTo(this.x + this.size, this.y);
            ctx.lineTo(this.x + this.size / 3, this.y + this.size / 3);
            ctx.lineTo(this.x, this.y + this.size);
            ctx.lineTo(this.x - this.size / 3, this.y + this.size / 3);
            ctx.lineTo(this.x - this.size, this.y);
            ctx.lineTo(this.x - this.size / 3, this.y - this.size / 3);
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        }
    }

    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = 0;
            this.len = Math.random() * 80 + 40;
            this.speed = Math.random() * 8 + 6;
            this.angle = Math.PI / 4; // 45 degrees downward right
            this.opacity = 0;
            this.maxOpacity = Math.random() * 0.8 + 0.2;
            this.state = 'fadein'; // fadein, active, fadeout
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;

            if (this.state === 'fadein') {
                this.opacity += 0.05;
                if (this.opacity >= this.maxOpacity) {
                    this.opacity = this.maxOpacity;
                    this.state = 'active';
                }
            } else if (this.state === 'active') {
                if (this.x > width || this.y > height) {
                    this.state = 'fadeout';
                }
            } else if (this.state === 'fadeout') {
                this.opacity -= 0.05;
                if (this.opacity <= 0) {
                    this.reset();
                }
            }
        }

        draw() {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            // Draw gradient trail
            const grad = ctx.createLinearGradient(
                this.x, this.y, 
                this.x - Math.cos(this.angle) * this.len, 
                this.y - Math.sin(this.angle) * this.len
            );
            grad.addColorStop(0, '#ffff00');
            grad.addColorStop(0.2, '#ff00cc');
            grad.addColorStop(1, 'rgba(0, 255, 255, 0)');

            ctx.strokeStyle = grad;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x - Math.cos(this.angle) * this.len, 
                this.y - Math.sin(this.angle) * this.len
            );
            ctx.stroke();
            ctx.restore();
        }
    }

    const particles = [];
    const shootingStars = [new ShootingStar(), new ShootingStar()];

    // Listen to mousemove
    window.addEventListener('mousemove', (e) => {
        // Emit sparkles occasionally
        if (Math.random() < 0.3) {
            particles.push(new Sparkle(e.clientX, e.clientY));
        }
    });

    // Listen to touchmove for mobile sparkles
    window.addEventListener('touchmove', (e) => {
        if (e.touches && e.touches.length > 0) {
            if (Math.random() < 0.4) {
                particles.push(new Sparkle(e.touches[0].clientX, e.touches[0].clientY));
            }
        }
    }, { passive: true });

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Update & Draw sparkles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            } else {
                particles[i].draw();
            }
        }

        // Update & Draw shooting stars
        shootingStars.forEach(star => {
            star.update();
            star.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}
