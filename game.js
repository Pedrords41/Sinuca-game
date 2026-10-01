'use strict';
/* ══════════════════════════════════════════════════════════════
   FUTEVÔLEI 2 vs 2 — Complete Game Engine
   All rendering is procedural on <canvas>. No external images.
   ══════════════════════════════════════════════════════════════ */

// ========================= CONFIGURATION =========================
const CFG = {
    // World (game-coordinate units)
    W: 1200, H: 680,
    GROUND: 550,
    COURT_L: 120, COURT_R: 1080,
    NET_X: 600,
    NET_TOP: 442, // ~108 px above ground → need to jump to spike
    NET_W: 6,
    POST_W: 10, POST_H: 118,

    // Ball
    B_RAD: 13,
    B_GRAV: 920,        // px/s² — tuned so a header flight ≈ 1s
    B_AIR: 0.9985,      // per-frame air resistance multiplier
    B_MAX: 950,
    B_BOUNCE: 0.55,

    // Player
    P_GRAV: 2200,
    P_SPD: 340,
    P_ACCEL: 2000,
    P_DECEL: 1400,
    P_JUMP: -670,
    P_COYOTE: 0.08,     // coyote time (seconds)
    P_JBUF: 0.12,       // jump buffer (seconds)
    P_HEAD_R: 10,
    P_TORSO: 24,
    P_UARM: 14, P_FARM: 12,
    P_THIGH: 17, P_SHIN: 17,
    P_SHOULDER_W: 10,
    P_HIP_W: 6,

    // Game rules
    MAX_TOUCHES: 3,
    PTS_TO_WIN: 15,
    ADVANTAGE: true,
    SETS_TO_WIN: 2,

    // AI difficulty presets {reactionDelay, posError, spikeChance, moveError}
    AI_EASY:  { react: 0.38, posErr: 40, spike: 0.15, moveErr: 0.25 },
    AI_MED:   { react: 0.18, posErr: 18, spike: 0.45, moveErr: 0.12 },
    AI_HARD:  { react: 0.06, posErr: 6,  spike: 0.75, moveErr: 0.04 },
};
const HALF_W = (CFG.COURT_R - CFG.COURT_L) / 2;

// ========================= UTILITIES =========================
const lerp  = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
const dist  = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
const rnd   = (lo, hi) => lo + Math.random() * (hi - lo);
const rndI  = (lo, hi) => Math.floor(rnd(lo, hi + 1));
const ease  = t => t < .5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; // ease-in-out quad

// ========================= AUDIO MANAGER =========================
class Audio_ {
    constructor() {
        this.ctx = null; this.enabled = true; this.vol = 0.35;
        try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    }
    resume() { if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume(); }
    _tone(freq, dur, type, vol) {
        if (!this.ctx || !this.enabled) return;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.type = type; o.frequency.value = freq;
        g.gain.setValueAtTime(vol * this.vol, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        o.connect(g); g.connect(this.ctx.destination);
        o.start(); o.stop(this.ctx.currentTime + dur);
    }
    _noise(dur, vol) {
        if (!this.ctx || !this.enabled) return;
        const sr = this.ctx.sampleRate;
        const buf = this.ctx.createBuffer(1, sr * dur, sr);
        const d = buf.getChannelData(0);
        for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1);
        const s = this.ctx.createBufferSource(); s.buffer = buf;
        const bp = this.ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 800; bp.Q.value = 0.5;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(vol * this.vol, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
        s.connect(bp); bp.connect(g); g.connect(this.ctx.destination);
        s.start(); s.stop(this.ctx.currentTime + dur);
    }
    hit(force) {
        const v = clamp(force / CFG.B_MAX, 0.2, 1);
        this._tone(220 + v * 180, 0.12, 'triangle', v * 0.5);
        this._noise(0.06, v * 0.3);
    }
    whistle() { this._tone(880, 0.15, 'sine', 0.4); setTimeout(()=>this._tone(1100,0.25,'sine',0.45), 180); }
    point() { this._tone(523, 0.1,'square',0.25); setTimeout(()=>this._tone(659,0.1,'square',0.25),120); setTimeout(()=>this._tone(784,0.2,'square',0.3),240); }
    netHit() { this._noise(0.1, 0.25); this._tone(150, 0.15, 'sawtooth', 0.15); }
    sand() { this._noise(0.05, 0.08); }
}
const audio = new Audio_();

// ========================= INPUT HANDLER =========================
class InputHandler {
    constructor() {
        this.keys = {};
        this.prev = {};
        window.addEventListener('keydown', e => { this.keys[e.code] = true; e.preventDefault(); });
        window.addEventListener('keyup',   e => { this.keys[e.code] = false; });
        // Touch controls → map to arrow keys for Player 1
        this._touchSetup('tl', 'ArrowLeft');
        this._touchSetup('tr', 'ArrowRight');
        this._touchSetup('tj', 'ArrowUp');
        this._touchSetup('td', 'ArrowDown');
    }
    _touchSetup(id, code) {
        const el = document.getElementById(id);
        if (!el) return;
        const on  = () => { this.keys[code] = true; audio.resume(); };
        const off = () => { this.keys[code] = false; };
        el.addEventListener('touchstart', e => { e.preventDefault(); on(); });
        el.addEventListener('touchend',   e => { e.preventDefault(); off(); });
        el.addEventListener('touchcancel',e => { e.preventDefault(); off(); });
    }
    pressed(code)  { return !!this.keys[code]; }
    justPressed(code) { return !!this.keys[code] && !this.prev[code]; }
    snapshot() { this.prev = Object.assign({}, this.keys); }
}

// ========================= CAMERA =========================
class Camera {
    constructor() { this.sx = 0; this.sy = 0; this.t = 0; this.mag = 0; }
    shake(magnitude, dur) { this.mag = magnitude; this.t = dur; }
    update(dt) {
        if (this.t > 0) {
            this.t -= dt;
            this.sx = (Math.random() - .5) * 2 * this.mag;
            this.sy = (Math.random() - .5) * 2 * this.mag;
        } else { this.sx = 0; this.sy = 0; }
    }
}

// ========================= PARTICLE SYSTEM =========================
class Particle {
    constructor(x, y, vx, vy, life, r, color, alpha) {
        this.x=x;this.y=y;this.vx=vx;this.vy=vy;this.life=life;this.maxLife=life;
        this.r=r;this.color=color;this.alpha=alpha||1;
    }
    update(dt) {
        this.vy += 400 * dt; this.x += this.vx*dt; this.y += this.vy*dt;
        this.life -= dt; return this.life > 0;
    }
}
class Footprint {
    constructor(x,y) { this.x=x; this.y=y; this.alpha=0.3; }
    update(dt) { this.alpha -= dt * 0.06; return this.alpha > 0; }
}

// ========================= BALL =========================
class Ball {
    constructor() { this.reset(1); this.trail = []; this.spin = 0; this.spinAngle = 0; }
    reset(side) {
        // side: 1=left team serves, 2=right team serves
        const sx = side === 1 ? CFG.COURT_L + 100 : CFG.COURT_R - 100;
        this.x = sx; this.y = CFG.GROUND - 120;
        this.vx = 0; this.vy = 0;
        this.spin = 0; this.spinAngle = 0;
        this.active = false;     // not in play until served
        this.lastTeam = side;    // team that will serve
        this.trail = [];
    }
    serve(vx, vy) {
        this.vx = vx; this.vy = vy; this.active = true;
    }
    update(dt) {
        if (!this.active) return;
        this.vy += CFG.B_GRAV * dt;
        this.vx *= Math.pow(CFG.B_AIR, dt * 60);
        // clamp speed
        const spd = Math.hypot(this.vx, this.vy);
        if (spd > CFG.B_MAX) { const s = CFG.B_MAX / spd; this.vx *= s; this.vy *= s; }
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        // spin (visual)
        this.spin = this.vx * 0.004;
        this.spinAngle += this.spin * dt * 60;
        // trail
        if (spd > 200) this.trail.push({ x:this.x, y:this.y, a:Math.min(1, spd/CFG.B_MAX) });
        if (this.trail.length > 12) this.trail.shift();
    }
    render(ctx, cam) {
        const bx = this.x + cam.sx, by = this.y + cam.sy;
        // trail
        for (let i = 0; i < this.trail.length; i++) {
            const t = this.trail[i];
            const a = (i / this.trail.length) * 0.35 * t.a;
            ctx.globalAlpha = a;
            ctx.beginPath(); ctx.arc(t.x+cam.sx, t.y+cam.sy, CFG.B_RAD*(0.5+0.5*i/this.trail.length), 0, Math.PI*2);
            ctx.fillStyle = '#ffe066'; ctx.fill();
        }
        ctx.globalAlpha = 1;
        // shadow on ground
        const hAbove = Math.max(0, CFG.GROUND - this.y);
        const sScale = clamp(1 - hAbove / 300, 0.3, 1);
        ctx.save(); ctx.globalAlpha = 0.25 * sScale;
        ctx.beginPath(); ctx.ellipse(bx, CFG.GROUND+cam.sy+2, CFG.B_RAD*sScale*1.5, 4*sScale, 0, 0, Math.PI*2);
        ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();
        // ball body
        ctx.save(); ctx.translate(bx, by); ctx.rotate(this.spinAngle);
        const grad = ctx.createRadialGradient(-3,-4, 1, 0,0, CFG.B_RAD);
        grad.addColorStop(0, '#fffbe6'); grad.addColorStop(0.6, '#ffe066'); grad.addColorStop(1, '#d4a017');
        ctx.beginPath(); ctx.arc(0,0, CFG.B_RAD, 0, Math.PI*2);
        ctx.fillStyle = grad; ctx.fill();
        // ball panel lines
        ctx.strokeStyle = 'rgba(180,140,20,0.5)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-CFG.B_RAD,0); ctx.lineTo(CFG.B_RAD,0); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,-CFG.B_RAD); ctx.lineTo(0,CFG.B_RAD); ctx.stroke();
        // highlight
        ctx.beginPath(); ctx.arc(-3,-4, 4, 0, Math.PI*2);
        ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fill();
        ctx.restore();
    }
}

// ========================= PLAYER SKELETON & RENDERING =========================
// Poses are joint offsets from hip center {head,shoulder, lK,lF, rK,rF, lE,lH, rE,rH}
// Defined for right-facing; x is mirrored for left-facing.
function P(hx,hy, sx,sy, lKx,lKy,lFx,lFy, rKx,rKy,rFx,rFy, lEx,lEy,lHx,lHy, rEx,rEy,rHx,rHy) {
    return {head:{x:hx,y:hy},shoulder:{x:sx,y:sy},
        lK:{x:lKx,y:lKy},lF:{x:lFx,y:lFy},rK:{x:rKx,y:rKy},rF:{x:rFx,y:rFy},
        lE:{x:lEx,y:lEy},lH:{x:lHx,y:lHy},rE:{x:rEx,y:rEy},rH:{x:rHx,y:rHy}};
}
const POSES = {
    idle: P(  0,-36,  0,-24,  -6,17,-5,34,  6,17,5,34,  -14,-12,-12,0,  14,-12,12,0),
    run1: P(  2,-35,  2,-23,  10,13,4,30,  -8,15,-12,31,  -16,-16,-10,-4,  18,-14,12,-2),
    run2: P(  1,-36,  1,-24,  -2,17,-3,34,  2,17,3,34,  -12,-14,-13,-2,  12,-14,13,-2),
    run3: P(  2,-35,  2,-23,  -8,15,-12,31,  10,13,4,30,  18,-14,12,-2,  -16,-16,-10,-4),
    jumpPrep: P( 0,-30,  0,-18,  -7,16,-8,30,  7,16,8,30,  -14,-8,-10,4,  14,-8,10,4),
    jumpUp: P(  0,-38,  0,-26,  -5,14,-7,28,  5,14,7,28,  -16,-18,-14,-6,  16,-18,14,-6),
    jumpPeak: P( 0,-38,  0,-26,  -8,10,-14,20,  8,10,14,20,  -18,-20,-16,-10,  18,-20,16,-10),
    jumpDown: P( 0,-36,  0,-24,  -6,14,-8,28,  6,14,8,28,  -14,-16,-12,-4,  14,-16,12,-4),
    header: P(  -6,-32,  -4,-22,  -5,16,-6,33,  5,16,6,33,  -18,-16,-16,-8,  18,-16,16,-8),
    kick:  P(  -2,-35,  0,-24,  -6,17,-5,34,  18,4,28,16,  -16,-14,-14,-2,  16,-18,14,-8),
    chest: P(  -4,-34,  -2,-22,  -6,17,-5,34,  6,17,5,34,  -16,-14,-14,0,  16,-14,14,0),
    serve: P(  0,-36,  0,-24,  -6,17,-5,34,  6,17,5,34,  -12,-20,-8,-28,  14,-12,12,0),
    celebrate:P(0,-40, 0,-28, -7,14,-8,30,  7,14,8,30,  -16,-28,-14,-36,  16,-28,14,-36),
    disappoint:P(0,-34,0,-22, -6,17,-5,34, 6,17,5,34, -10,-24,-4,-30, 10,-24,4,-30),
    dive:  P(  20,-10,  14,-8,  -10,8,-18,14,  14,6,22,10,  -18,-6,-24,2,  22,-4,28,4),
};

function lerpPose(a, b, t) {
    const r = {};
    for (const k of Object.keys(a)) {
        r[k] = { x: lerp(a[k].x, b[k].x, t), y: lerp(a[k].y, b[k].y, t) };
    }
    return r;
}

// Player appearance config
const PLAYER_LOOKS = [
    { skin:'#c68642', hair:'#1a1a1a', hairLen:3, shirt:'#f7c948', shorts:'#2d7a3a', num:'1' },
    { skin:'#f1c27d', hair:'#6b3a15', hairLen:6, shirt:'#f7c948', shorts:'#2d7a3a', num:'2' },
    { skin:'#8d5524', hair:'#111',    hairLen:4, shirt:'#3a8fd4', shorts:'#eee',    num:'3' },
    { skin:'#e0ac69', hair:'#3a1c00', hairLen:7, shirt:'#3a8fd4', shorts:'#eee',    num:'4' },
];

// ========================= PLAYER =========================
class Player {
    constructor(id, team, startX, look, controlScheme) {
        this.id = id; this.team = team; // 0=left, 1=right
        this.look = look;
        this.ctrl = controlScheme; // null = AI
        this.x = startX; this.y = CFG.GROUND;
        this.vx = 0; this.vy = 0;
        this.facing = team === 0 ? 1 : -1;
        this.grounded = true;
        this.pose = Object.assign({}, POSES.idle);
        this.targetPose = POSES.idle;
        this.animState = 'idle';
        this.animTimer = 0;
        this.runPhase = 0;
        this.coyoteTimer = 0;
        this.jumpBuffer = 0;
        this.touchCooldown = 0; // prevent double-hitting ball
        // expression
        this.expression = 'neutral'; // neutral, focused, happy, sad
        this.exprTimer = 0;
        // input commands (set by player input or AI)
        this.cmdLeft = false; this.cmdRight = false;
        this.cmdJump = false; this.cmdDown = false;
    }

    get minX() { return this.team === 0 ? CFG.COURT_L : CFG.NET_X + CFG.NET_W/2 + 12; }
    get maxX() { return this.team === 0 ? CFG.NET_X - CFG.NET_W/2 - 12 : CFG.COURT_R; }

    update(dt, teammates) {
        // --- Horizontal movement with acceleration ---
        let inputDir = 0;
        if (this.cmdLeft) inputDir -= 1;
        if (this.cmdRight) inputDir += 1;

        if (inputDir !== 0) {
            this.vx += inputDir * CFG.P_ACCEL * dt;
            this.vx = clamp(this.vx, -CFG.P_SPD, CFG.P_SPD);
            this.facing = inputDir;
        } else {
            // decelerate
            if (this.vx > 0) { this.vx = Math.max(0, this.vx - CFG.P_DECEL * dt); }
            else if (this.vx < 0) { this.vx = Math.min(0, this.vx + CFG.P_DECEL * dt); }
        }
        this.x += this.vx * dt;

        // --- Coyote time ---
        if (this.grounded) this.coyoteTimer = CFG.P_COYOTE;
        else this.coyoteTimer -= dt;

        // --- Jump buffer ---
        if (this.cmdJump) this.jumpBuffer = CFG.P_JBUF;
        else this.jumpBuffer -= dt;

        // --- Jump ---
        if (this.jumpBuffer > 0 && this.coyoteTimer > 0) {
            this.vy = CFG.P_JUMP;
            this.grounded = false;
            this.coyoteTimer = 0;
            this.jumpBuffer = 0;
            audio.sand();
        }

        // --- Vertical (gravity) ---
        if (!this.grounded) {
            this.vy += CFG.P_GRAV * dt;
            this.y += this.vy * dt;
            if (this.y >= CFG.GROUND) {
                this.y = CFG.GROUND; this.vy = 0; this.grounded = true;
            }
        }

        // --- Court bounds ---
        this.x = clamp(this.x, this.minX, this.maxX);

        // --- Teammate collision (gentle push) ---
        if (teammates) {
            for (const t of teammates) {
                if (t === this) continue;
                const dx = this.x - t.x;
                const d = Math.abs(dx);
                if (d < 26) {
                    const push = (26 - d) * 0.5;
                    this.x += (dx > 0 ? push : -push);
                    t.x -= (dx > 0 ? push : -push);
                }
            }
        }

        // --- Touch cooldown ---
        if (this.touchCooldown > 0) this.touchCooldown -= dt;

        // --- Expression timer ---
        if (this.exprTimer > 0) { this.exprTimer -= dt; if (this.exprTimer <= 0) this.expression = 'neutral'; }

        // --- Animation ---
        this.updateAnimation(dt);
    }

    updateAnimation(dt) {
        this.animTimer += dt;
        const speed = Math.abs(this.vx);

        if (this.animState === 'celebrate' || this.animState === 'disappoint') {
            if (this.animTimer > 1.5) this.animState = 'idle';
        }
        if (this.animState === 'header' || this.animState === 'kick' || this.animState === 'chest' || this.animState === 'dive') {
            if (this.animTimer > 0.35) {
                this.animState = this.grounded ? (speed > 30 ? 'run' : 'idle') : 'jump';
            }
        }
        if (this.animState !== 'celebrate' && this.animState !== 'disappoint' &&
            this.animState !== 'header' && this.animState !== 'kick' && this.animState !== 'chest' && this.animState !== 'dive') {
            if (!this.grounded) {
                this.animState = 'jump';
            } else if (speed > 30) {
                this.animState = 'run';
            } else {
                this.animState = 'idle';
            }
        }

        // compute target pose
        let target;
        switch (this.animState) {
            case 'idle': {
                // breathing: subtle vertical sway
                const b = Math.sin(this.animTimer * 2.5) * 1.5;
                target = Object.assign({}, POSES.idle);
                target.head = {x: POSES.idle.head.x, y: POSES.idle.head.y + b};
                target.shoulder = {x: POSES.idle.shoulder.x, y: POSES.idle.shoulder.y + b*0.7};
                break;
            }
            case 'run': {
                this.runPhase += dt * speed * 0.06;
                const ph = this.runPhase;
                const frames = [POSES.run1, POSES.run2, POSES.run3, POSES.run2];
                const idx = ph % 4;
                const fi = Math.floor(idx);
                const ft = idx - fi;
                target = lerpPose(frames[fi % 4], frames[(fi+1) % 4], ft);
                break;
            }
            case 'jump': {
                if (this.vy < -200) target = POSES.jumpUp;
                else if (this.vy < 100) target = POSES.jumpPeak;
                else target = POSES.jumpDown;
                break;
            }
            case 'header': target = POSES.header; break;
            case 'kick': target = POSES.kick; break;
            case 'chest': target = POSES.chest; break;
            case 'dive': target = POSES.dive; break;
            case 'celebrate': target = POSES.celebrate; break;
            case 'disappoint': target = POSES.disappoint; break;
            case 'serve': target = POSES.serve; break;
            default: target = POSES.idle;
        }
        this.targetPose = target;
        // Lerp current pose toward target
        const lSpeed = 12 * dt;
        this.pose = lerpPose(this.pose, this.targetPose, Math.min(1, lSpeed));
    }

    setAnim(state) { this.animState = state; this.animTimer = 0; }

    // Get world-space hitbox positions
    getHitboxes() {
        const f = this.facing;
        const hipX = this.x, hipY = this.y - 34;
        return {
            head: { x: hipX + this.pose.head.x * f, y: hipY + this.pose.head.y, r: CFG.P_HEAD_R + 4 },
            chest: { x: hipX + this.pose.shoulder.x * f, y: hipY + this.pose.shoulder.y + 6, r: 14 },
            foot: {
                x: hipX + ((this.pose.rF.x + this.pose.lF.x) * 0.5) * f,
                y: hipY + Math.max(this.pose.rF.y, this.pose.lF.y),
                r: 12
            },
            knee: {
                x: hipX + ((this.pose.rK.x + this.pose.lK.x) * 0.5) * f,
                y: hipY + (this.pose.rK.y + this.pose.lK.y) * 0.5,
                r: 10
            }
        };
    }

    render(ctx, cam) {
        const f = this.facing;
        const hipX = this.x + cam.sx;
        const hipY = (this.y - 34) + cam.sy;

        // Shadow on ground
        const heightAbove = Math.max(0, CFG.GROUND - this.y);
        const sAlpha = clamp(0.3 - heightAbove * 0.001, 0.05, 0.3);
        const sScale = clamp(1 - heightAbove / 250, 0.4, 1);
        ctx.save(); ctx.globalAlpha = sAlpha;
        ctx.beginPath();
        ctx.ellipse(hipX, CFG.GROUND + cam.sy + 2, 18 * sScale, 5 * sScale, 0, 0, Math.PI*2);
        ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();

        // Joint world positions
        const j = {};
        for (const k of Object.keys(this.pose)) {
            j[k] = { x: hipX + this.pose[k].x * f, y: hipY + this.pose[k].y };
        }
        // Derived positions
        const lHip = { x: hipX - CFG.P_HIP_W * f, y: hipY };
        const rHip = { x: hipX + CFG.P_HIP_W * f, y: hipY };
        const lSh  = { x: j.shoulder.x - CFG.P_SHOULDER_W * f, y: j.shoulder.y };
        const rSh  = { x: j.shoulder.x + CFG.P_SHOULDER_W * f, y: j.shoulder.y };

        const skin = this.look.skin;
        const skinDark = this._darken(skin, 0.8);
        const shirt = this.look.shirt;
        const shorts = this.look.shorts;
        const shirtDark = this._darken(shirt, 0.75);

        // Drawing order based on facing
        const backLeg  = f > 0 ? { hip:lHip, k:j.lK, ft:j.lF } : { hip:rHip, k:j.rK, ft:j.rF };
        const frontLeg = f > 0 ? { hip:rHip, k:j.rK, ft:j.rF } : { hip:lHip, k:j.lK, ft:j.lF };
        const backArm  = f > 0 ? { sh:lSh, e:j.lE, h:j.lH } : { sh:rSh, e:j.rE, h:j.rH };
        const frontArm = f > 0 ? { sh:rSh, e:j.rE, h:j.rH } : { sh:lSh, e:j.lE, h:j.lH };

        // Back leg
        this._drawLimb(ctx, backLeg.hip, backLeg.k, 9, 7, shorts);
        this._drawLimb(ctx, backLeg.k, backLeg.ft, 7, 5, skinDark);
        this._drawFoot(ctx, backLeg.ft, f, skinDark);
        // Back arm
        this._drawLimb(ctx, backArm.sh, backArm.e, 7, 5, skinDark);
        this._drawLimb(ctx, backArm.e, backArm.h, 5, 4, skinDark);

        // Torso
        this._drawTorso(ctx, {x:hipX,y:hipY}, j.shoulder, shirt, shirtDark, this.look.num, f);
        // Shorts
        this._drawLimb(ctx, {x:hipX,y:hipY-2}, {x:hipX,y:hipY+4}, 20, 22, shorts);

        // Front leg
        this._drawLimb(ctx, frontLeg.hip, frontLeg.k, 9, 7, shorts);
        this._drawLimb(ctx, frontLeg.k, frontLeg.ft, 7, 5, skin);
        this._drawFoot(ctx, frontLeg.ft, f, skin);
        // Front arm
        this._drawLimb(ctx, frontArm.sh, frontArm.e, 7, 6, skin);
        this._drawLimb(ctx, frontArm.e, frontArm.h, 6, 4, skin);

        // Head
        this._drawHead(ctx, j.head, f, skin);
    }

    _drawLimb(ctx, a, b, w1, w2, color) {
        const angle = Math.atan2(b.y - a.y, b.x - a.x);
        const px = Math.cos(angle + Math.PI/2);
        const py = Math.sin(angle + Math.PI/2);
        ctx.beginPath();
        ctx.moveTo(a.x + px*w1/2, a.y + py*w1/2);
        ctx.lineTo(b.x + px*w2/2, b.y + py*w2/2);
        ctx.lineTo(b.x - px*w2/2, b.y - py*w2/2);
        ctx.lineTo(a.x - px*w1/2, a.y - py*w1/2);
        ctx.closePath();
        ctx.fillStyle = color; ctx.fill();
    }

    _drawTorso(ctx, hip, shoulder, color, darkColor, num, f) {
        const sw = CFG.P_SHOULDER_W + 2;
        const hw = CFG.P_HIP_W + 2;
        ctx.beginPath();
        ctx.moveTo(hip.x - hw*f, hip.y);
        ctx.lineTo(shoulder.x - sw*f, shoulder.y);
        ctx.lineTo(shoulder.x + sw*f, shoulder.y);
        ctx.lineTo(hip.x + hw*f, hip.y);
        ctx.closePath();
        // gradient for fabric texture
        const g = ctx.createLinearGradient(shoulder.x, shoulder.y, hip.x, hip.y);
        g.addColorStop(0, color); g.addColorStop(0.5, darkColor); g.addColorStop(1, color);
        ctx.fillStyle = g; ctx.fill();
        // subtle lines for fabric
        ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 0.5;
        for (let i = 0; i < 4; i++) {
            const t = (i + 1) / 5;
            const lx = lerp(hip.x - hw*f, shoulder.x - sw*f, t);
            const rx = lerp(hip.x + hw*f, shoulder.x + sw*f, t);
            const ly = lerp(hip.y, shoulder.y, t);
            ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(rx, ly); ctx.stroke();
        }
        // Number
        const nX = lerp(hip.x, shoulder.x, 0.5);
        const nY = lerp(hip.y, shoulder.y, 0.45);
        ctx.fillStyle = 'rgba(255,255,255,0.75)';
        ctx.font = 'bold 9px Outfit'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(num, nX, nY);
    }

    _drawFoot(ctx, pos, f, color) {
        ctx.beginPath();
        ctx.ellipse(pos.x + 3*f, pos.y + 1, 7, 3.5, 0, 0, Math.PI*2);
        ctx.fillStyle = '#333'; ctx.fill();
    }

    _drawHead(ctx, pos, f, skin) {
        const r = CFG.P_HEAD_R;
        // head
        const g = ctx.createRadialGradient(pos.x - 2*f, pos.y - 2, r*0.3, pos.x, pos.y, r);
        g.addColorStop(0, this._lighten(skin, 1.15)); g.addColorStop(1, skin);
        ctx.beginPath(); ctx.arc(pos.x, pos.y, r, 0, Math.PI*2);
        ctx.fillStyle = g; ctx.fill();
        // hair
        const hair = this.look.hair;
        const hl = this.look.hairLen;
        ctx.fillStyle = hair;
        ctx.beginPath();
        ctx.arc(pos.x - f*1, pos.y - 2, r + 1, -Math.PI*0.85, Math.PI * 0.15, f < 0);
        ctx.lineTo(pos.x - f * (r + hl), pos.y - 2);
        ctx.closePath(); ctx.fill();
        // face
        this._drawFace(ctx, pos, f);
    }

    _drawFace(ctx, pos, f) {
        const ex = pos.x + 3 * f;
        const ey = pos.y - 1;
        // eye
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.ellipse(ex, ey, 3.5, 2.5, 0, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = '#222';
        const pupilX = ex + (this.expression === 'focused' ? 1*f : 0.5*f);
        ctx.beginPath(); ctx.arc(pupilX, ey, 1.5, 0, Math.PI*2); ctx.fill();
        // eyebrow
        ctx.strokeStyle = this.look.hair; ctx.lineWidth = 1.2;
        const browY = ey - 4;
        if (this.expression === 'focused') {
            ctx.beginPath(); ctx.moveTo(ex-3*f, browY+1); ctx.lineTo(ex+3*f, browY-0.5); ctx.stroke();
        } else if (this.expression === 'sad') {
            ctx.beginPath(); ctx.moveTo(ex-3*f, browY-1); ctx.lineTo(ex+3*f, browY+1); ctx.stroke();
        } else {
            ctx.beginPath(); ctx.moveTo(ex-3*f, browY); ctx.lineTo(ex+3*f, browY); ctx.stroke();
        }
        // mouth
        ctx.strokeStyle = '#5a3020'; ctx.lineWidth = 1;
        const mx = pos.x + 3*f, my = pos.y + 4;
        if (this.expression === 'happy') {
            ctx.beginPath(); ctx.arc(mx, my-1, 2.5, 0.1*Math.PI, 0.9*Math.PI); ctx.stroke();
        } else if (this.expression === 'sad') {
            ctx.beginPath(); ctx.arc(mx, my+2, 2.5, 1.1*Math.PI, 1.9*Math.PI); ctx.stroke();
        } else {
            ctx.beginPath(); ctx.moveTo(mx-2, my); ctx.lineTo(mx+2, my); ctx.stroke();
        }
    }

    _darken(hex, factor) {
        const r = parseInt(hex.slice(1,3),16);
        const g = parseInt(hex.slice(3,5),16);
        const b = parseInt(hex.slice(5,7),16);
        return `rgb(${Math.floor(r*factor)},${Math.floor(g*factor)},${Math.floor(b*factor)})`;
    }
    _lighten(hex, factor) {
        const r = Math.min(255, parseInt(hex.slice(1,3),16)*factor);
        const g = Math.min(255, parseInt(hex.slice(3,5),16)*factor);
        const b = Math.min(255, parseInt(hex.slice(5,7),16)*factor);
        return `rgb(${Math.floor(r)},${Math.floor(g)},${Math.floor(b)})`;
    }
}

// ========================= AI CONTROLLER =========================
class AIController {
    constructor(difficulty) {
        this.diff = difficulty; // CFG.AI_EASY / AI_MED / AI_HARD
        this.predicted = null;
        this.predTimer = 0;
        this.role = 'defend'; // 'defend' | 'attack'
    }

    predictLanding(ball) {
        let x = ball.x, y = ball.y, vx = ball.vx, vy = ball.vy;
        const dt = 1/60;
        for (let i = 0; i < 360; i++) {
            vy += CFG.B_GRAV * dt;
            vx *= CFG.B_AIR;
            x += vx * dt; y += vy * dt;
            // net collision (simplified: if crosses net line vertically above net top)
            if (y > CFG.NET_TOP && y < CFG.GROUND) {
                if ((x < CFG.NET_X && x + vx*dt > CFG.NET_X) || (x > CFG.NET_X && x + vx*dt < CFG.NET_X)) {
                    vx = -vx * 0.3; // bounce off net
                }
            }
            if (y >= CFG.GROUND - CFG.B_RAD) {
                return { x, y: CFG.GROUND, time: i * dt };
            }
        }
        return { x, y: CFG.GROUND, time: 6 };
    }

    update(dt, player, partner, ball, gameState, touchCount) {
        this.predTimer -= dt;
        // Re-predict periodically
        if (this.predTimer <= 0 || !this.predicted) {
            this.predTimer = this.diff.react * (0.8 + Math.random() * 0.4);
            if (ball.active) {
                this.predicted = this.predictLanding(ball);
                // Add error based on difficulty
                this.predicted.x += (Math.random() - 0.5) * 2 * this.diff.posErr;
            }
        }

        // Role assignment: closer to predicted = receiver, other = attacker
        if (this.predicted && partner) {
            const myDist = Math.abs(player.x - this.predicted.x);
            const partDist = Math.abs(partner.x - this.predicted.x);
            this.role = myDist < partDist ? 'defend' : 'attack';
        }

        // Default: no input
        player.cmdLeft = false; player.cmdRight = false;
        player.cmdJump = false; player.cmdDown = false;

        const side = player.team; // 0=left, 1=right
        const myCourtCenter = side === 0
            ? (CFG.COURT_L + CFG.NET_X) / 2
            : (CFG.NET_X + CFG.COURT_R) / 2;

        if (!ball.active || gameState !== 'playing') {
            // Return to default position
            this._moveToward(player, myCourtCenter, dt);
            return;
        }

        const ballOnMySide = (side === 0 && ball.x < CFG.NET_X) || (side === 1 && ball.x >= CFG.NET_X);

        if (ballOnMySide) {
            player.expression = 'focused'; player.exprTimer = 0.5;

            if (this.role === 'defend' || !partner) {
                // Move to predicted landing (or ball x if close)
                let targetX = this.predicted ? this.predicted.x : ball.x;
                // Clamp to own court
                targetX = clamp(targetX, player.minX + 20, player.maxX - 20);
                this._moveToward(player, targetX, dt);

                // Jump decision
                const bDist = dist(player.x, player.y - 40, ball.x, ball.y);
                if (bDist < 80 && ball.y < player.y - 20) {
                    player.cmdJump = true;
                    // Spike if 3rd touch or aggressive
                    if ((touchCount >= 2 || Math.random() < this.diff.spike * 0.3) && ball.y < CFG.NET_TOP + 30) {
                        player.cmdDown = true;
                    }
                }
            } else {
                // Attacker: position for spike
                const attackX = side === 0 ? CFG.NET_X - 80 : CFG.NET_X + 80;
                this._moveToward(player, attackX, dt);

                // Jump to spike when ball is set near net
                const bDist = dist(player.x, player.y - 50, ball.x, ball.y);
                if (bDist < 70 && ball.y < CFG.NET_TOP + 60 && touchCount >= 1) {
                    player.cmdJump = true;
                    if (ball.y < CFG.NET_TOP + 40 && Math.random() < this.diff.spike) {
                        player.cmdDown = true;
                    }
                }
            }
        } else {
            // Ball on opponent's side: position defensively
            let defX = myCourtCenter + (Math.random()-0.5) * this.diff.moveErr * 200;
            defX = clamp(defX, player.minX + 30, player.maxX - 30);
            this._moveToward(player, defX, dt);
        }
    }

    _moveToward(player, targetX, dt) {
        const dx = targetX - player.x;
        const deadzone = 8 + this.diff.posErr * 0.3;
        if (Math.abs(dx) > deadzone) {
            if (dx > 0) player.cmdRight = true;
            else player.cmdLeft = true;
        }
    }
}

// ========================= NET =========================
class Net {
    constructor() {
        this.deform = 0; // current deformation (-1 to 1)
        this.deformVel = 0;
    }

    checkCollision(ball) {
        if (!ball.active) return false;
        const nx = CFG.NET_X;
        const halfW = CFG.NET_W / 2 + CFG.B_RAD;
        // Ball near net horizontally?
        if (Math.abs(ball.x - nx) < halfW && ball.y > CFG.NET_TOP - CFG.B_RAD && ball.y < CFG.GROUND) {
            const speed = Math.hypot(ball.vx, ball.vy);
            // Ball hit from top?
            if (ball.y < CFG.NET_TOP + 10 && ball.vy > 0 && speed < 300) {
                // Weak hit on top → falls same side
                ball.vy = Math.abs(ball.vy) * -0.2;
                ball.vx *= 0.1;
            } else {
                // Strong enough or side hit → bounce with loss
                ball.vx = -ball.vx * 0.35;
                ball.vy *= 0.7;
                // Push ball out of net
                ball.x = ball.x < nx ? nx - halfW - 1 : nx + halfW + 1;
            }
            this.deform = ball.vx > 0 ? 0.4 : -0.4;
            this.deformVel = 0;
            audio.netHit();
            return true;
        }
        return false;
    }

    update(dt) {
        // Spring back
        const stiffness = 120, damping = 8;
        const force = -stiffness * this.deform - damping * this.deformVel;
        this.deformVel += force * dt;
        this.deform += this.deformVel * dt;
        if (Math.abs(this.deform) < 0.001 && Math.abs(this.deformVel) < 0.01) {
            this.deform = 0; this.deformVel = 0;
        }
    }

    render(ctx, cam) {
        const nx = CFG.NET_X + cam.sx;
        const top = CFG.NET_TOP + cam.sy;
        const bot = CFG.GROUND + cam.sy;
        const pw = CFG.POST_W;

        // Posts
        ctx.fillStyle = '#888'; ctx.strokeStyle = '#666'; ctx.lineWidth = 1;
        // Left post
        ctx.fillRect(nx - pw/2 - 1, top - 8 + cam.sy*0, pw, bot - top + 8);
        // Right post (same position, it's a center net)
        // Actually posts are on the sides — but for futevolei, the net is in the center
        // Let's draw the net post as a single pole
        const postGrad = ctx.createLinearGradient(nx - pw/2, 0, nx + pw/2, 0);
        postGrad.addColorStop(0, '#999'); postGrad.addColorStop(0.5, '#ccc'); postGrad.addColorStop(1, '#888');
        ctx.fillStyle = postGrad;
        ctx.fillRect(nx - pw/2, top - 10, pw, bot - top + 10);

        // Net mesh
        const meshSteps = 12;
        const hSteps = 8;
        ctx.strokeStyle = 'rgba(220,220,220,0.6)'; ctx.lineWidth = 0.7;
        const netW = 50; // visual width of net
        for (let i = 0; i <= meshSteps; i++) {
            const t = i / meshSteps;
            const y = lerp(top, bot, t);
            const def = this.deform * Math.sin(t * Math.PI) * 15;
            ctx.beginPath();
            ctx.moveTo(nx - netW/2 + def, y);
            ctx.lineTo(nx + netW/2 + def, y);
            ctx.stroke();
        }
        for (let i = 0; i <= hSteps; i++) {
            const t = i / hSteps;
            const x = lerp(nx - netW/2, nx + netW/2, t);
            ctx.beginPath();
            ctx.moveTo(x + this.deform * 7, top);
            ctx.lineTo(x + this.deform * 7, bot);
            ctx.stroke();
        }
        // Top cable
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(nx - netW/2, top);
        ctx.quadraticCurveTo(nx + this.deform * 20, top + 3, nx + netW/2, top);
        ctx.stroke();
    }
}

// ========================= SCENERY =========================
class Scenery {
    constructor() {
        this.clouds = [];
        for (let i = 0; i < 6; i++) {
            this.clouds.push({
                x: rnd(0, CFG.W), y: rnd(15, 120),
                w: rnd(60, 150), h: rnd(18, 35),
                speed: rnd(4, 12), alpha: rnd(0.2, 0.5)
            });
        }
        this.time = 0;
        this.palms = [
            { x: 40, h: 140, lean: 0.15 },
            { x: CFG.W - 50, h: 130, lean: -0.12 },
            { x: 70, h: 100, lean: 0.2 },
        ];
        this.umbrellas = [
            { x: 55, color1: '#e74c3c', color2: '#fff' },
            { x: CFG.W - 65, color1: '#3498db', color2: '#f1c40f' },
        ];
        // Sand grain positions (precomputed for performance)
        this.grains = [];
        for (let i = 0; i < 300; i++) {
            this.grains.push({ x: rnd(0, CFG.W), y: rnd(CFG.GROUND - 80, CFG.H), r: rnd(0.5, 1.5), a: rnd(0.05, 0.15) });
        }
        this.skyMode = rndI(0, 2); // 0=day, 1=sunset, 2=dusk
    }

    update(dt) {
        this.time += dt;
        for (const c of this.clouds) {
            c.x += c.speed * dt;
            if (c.x > CFG.W + c.w) c.x = -c.w;
        }
    }

    render(ctx) {
        // --- Sky ---
        const skyGrad = ctx.createLinearGradient(0, 0, 0, CFG.GROUND - 80);
        if (this.skyMode === 0) { // Day
            skyGrad.addColorStop(0, '#0a2463'); skyGrad.addColorStop(0.4, '#1e6091');
            skyGrad.addColorStop(0.7, '#3a9bdc'); skyGrad.addColorStop(1, '#87ceeb');
        } else if (this.skyMode === 1) { // Sunset
            skyGrad.addColorStop(0, '#1a0533'); skyGrad.addColorStop(0.3, '#6b2fa0');
            skyGrad.addColorStop(0.6, '#e85d04'); skyGrad.addColorStop(0.85, '#fb8b24');
            skyGrad.addColorStop(1, '#ffd166');
        } else { // Dusk
            skyGrad.addColorStop(0, '#0d1b2a'); skyGrad.addColorStop(0.4, '#1b3a4b');
            skyGrad.addColorStop(0.7, '#3d5a80'); skyGrad.addColorStop(1, '#98c1d9');
        }
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, CFG.W, CFG.GROUND - 40);

        // Sun/Moon
        if (this.skyMode === 1) {
            const sunG = ctx.createRadialGradient(CFG.W-120, 130, 5, CFG.W-120, 130, 60);
            sunG.addColorStop(0, 'rgba(255,220,80,0.9)'); sunG.addColorStop(0.5, 'rgba(255,160,40,0.4)');
            sunG.addColorStop(1, 'rgba(255,100,0,0)');
            ctx.fillStyle = sunG; ctx.fillRect(CFG.W-180, 70, 120, 120);
        }

        // --- Clouds ---
        for (const c of this.clouds) {
            ctx.save(); ctx.globalAlpha = c.alpha;
            ctx.fillStyle = this.skyMode === 1 ? '#ffeebb' : '#fff';
            ctx.beginPath();
            ctx.ellipse(c.x, c.y, c.w/2, c.h/2, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(c.x - c.w*0.25, c.y + 4, c.w*0.35, c.h*0.4, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(c.x + c.w*0.2, c.y + 2, c.w*0.3, c.h*0.35, 0, 0, Math.PI*2);
            ctx.fill();
            ctx.restore();
        }

        // --- Ocean ---
        const oceanTop = CFG.GROUND - 180;
        const oceanBot = CFG.GROUND - 50;
        const oceanGrad = ctx.createLinearGradient(0, oceanTop, 0, oceanBot);
        if (this.skyMode === 1) {
            oceanGrad.addColorStop(0, '#c45b28'); oceanGrad.addColorStop(0.5, '#1565c0'); oceanGrad.addColorStop(1, '#0d47a1');
        } else {
            oceanGrad.addColorStop(0, '#1565c0'); oceanGrad.addColorStop(0.5, '#0d47a1'); oceanGrad.addColorStop(1, '#0a3d7a');
        }
        ctx.fillStyle = oceanGrad;
        ctx.fillRect(0, oceanTop, CFG.W, oceanBot - oceanTop);
        // Waves
        ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 1.5;
        for (let w = 0; w < 5; w++) {
            const wy = oceanTop + 20 + w * 30;
            ctx.beginPath();
            for (let x = 0; x <= CFG.W; x += 4) {
                const y = wy + Math.sin(x * 0.02 + this.time * (1.5 + w*0.3) + w) * (4 + w);
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        // Shoreline foam
        const foamY = oceanBot;
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 0; x <= CFG.W; x += 3) {
            const y = foamY + Math.sin(x*0.03 + this.time*2) * 3 + Math.sin(x*0.01 + this.time*0.7)*5;
            if (x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        }
        ctx.stroke();

        // --- Sand ---
        const sandGrad = ctx.createLinearGradient(0, oceanBot - 10, 0, CFG.H);
        sandGrad.addColorStop(0, '#c2a06a'); sandGrad.addColorStop(0.3, '#d4b07a');
        sandGrad.addColorStop(0.7, '#c9a56c'); sandGrad.addColorStop(1, '#b89058');
        ctx.fillStyle = sandGrad;
        ctx.fillRect(0, oceanBot - 5, CFG.W, CFG.H - oceanBot + 5);

        // Sand grains
        for (const g of this.grains) {
            ctx.globalAlpha = g.a;
            ctx.fillStyle = '#a0854a';
            ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI*2); ctx.fill();
        }
        ctx.globalAlpha = 1;

        // --- Palm trees (decorative) ---
        for (const p of this.palms) this._drawPalm(ctx, p);

        // --- Umbrellas ---
        for (const u of this.umbrellas) this._drawUmbrella(ctx, u);
    }

    renderCourtLines(ctx) {
        ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 3;
        ctx.setLineDash([]);
        // Court boundary
        ctx.strokeRect(CFG.COURT_L, CFG.GROUND - 2, CFG.COURT_R - CFG.COURT_L, 6);
        // Center line (under net)
        ctx.beginPath();
        ctx.moveTo(CFG.NET_X, CFG.GROUND - 2);
        ctx.lineTo(CFG.NET_X, CFG.GROUND + 4);
        ctx.stroke();
        // Side lines (depth markers)
        ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 2; ctx.setLineDash([8,6]);
        const backL = CFG.COURT_L + 40;
        const backR = CFG.COURT_R - 40;
        ctx.beginPath(); ctx.moveTo(backL, CFG.GROUND-2); ctx.lineTo(backL, CFG.GROUND+4); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(backR, CFG.GROUND-2); ctx.lineTo(backR, CFG.GROUND+4); ctx.stroke();
        ctx.setLineDash([]);
    }

    _drawPalm(ctx, p) {
        const base = CFG.GROUND;
        // Trunk
        ctx.strokeStyle = '#6d4c2a'; ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(p.x, base);
        const topX = p.x + p.lean * p.h;
        const topY = base - p.h;
        ctx.quadraticCurveTo(p.x + p.lean * p.h * 0.3, base - p.h * 0.5, topX, topY);
        ctx.stroke();
        // Leaves
        ctx.fillStyle = '#228b22'; ctx.strokeStyle = '#1a6b1a'; ctx.lineWidth = 2;
        for (let i = 0; i < 7; i++) {
            const ang = -Math.PI/2 + (i - 3) * 0.45 + Math.sin(this.time * 0.8 + i) * 0.05;
            const len = 45 + rnd(-5, 5);
            ctx.beginPath();
            ctx.moveTo(topX, topY);
            const ex = topX + Math.cos(ang) * len;
            const ey = topY + Math.sin(ang) * len;
            const cx = topX + Math.cos(ang) * len * 0.5 + (i%2?8:-8);
            const cy = topY + Math.sin(ang) * len * 0.5 - 5;
            ctx.quadraticCurveTo(cx, cy, ex, ey);
            ctx.quadraticCurveTo(cx + 3, cy + 3, topX, topY);
            ctx.fill(); ctx.stroke();
        }
    }

    _drawUmbrella(ctx, u) {
        const baseY = CFG.GROUND;
        const topY = baseY - 80;
        // Pole
        ctx.strokeStyle = '#aaa'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(u.x, baseY); ctx.lineTo(u.x, topY); ctx.stroke();
        // Canopy
        ctx.beginPath();
        ctx.arc(u.x, topY, 30, Math.PI, 0);
        ctx.fillStyle = u.color1; ctx.fill();
        // Stripes
        for (let i = 0; i < 3; i++) {
            const a1 = Math.PI + i * Math.PI / 3;
            const a2 = a1 + Math.PI / 6;
            ctx.beginPath(); ctx.moveTo(u.x, topY);
            ctx.arc(u.x, topY, 30, a1, a2); ctx.closePath();
            ctx.fillStyle = u.color2; ctx.fill();
        }
    }
}

// ========================= HUD =========================
class HUD {
    constructor() {
        this.msg = ''; this.msgTimer = 0; this.msgScale = 1;
        this.flashAlpha = 0;
    }

    showMessage(text, duration) {
        this.msg = text; this.msgTimer = duration || 2; this.msgScale = 2;
    }

    flash() { this.flashAlpha = 0.3; }

    update(dt) {
        if (this.msgTimer > 0) {
            this.msgTimer -= dt;
            this.msgScale = lerp(this.msgScale, 1, 6 * dt);
        }
        if (this.flashAlpha > 0) this.flashAlpha -= dt * 2;
    }

    render(ctx, game) {
        // === Score board ===
        const midX = CFG.W / 2;
        // Background bar
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        this._roundRect(ctx, midX - 160, 8, 320, 48, 12);
        ctx.fill();

        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // Team names
        ctx.font = 'bold 13px Outfit'; ctx.fillStyle = '#f7c948';
        ctx.fillText('TIME A', midX - 95, 22);
        ctx.fillStyle = '#3a8fd4';
        ctx.fillText('TIME B', midX + 95, 22);

        // Score
        ctx.font = 'bold 28px Outfit'; ctx.fillStyle = '#fff';
        ctx.fillText(`${game.score[0]}`, midX - 45, 35);
        ctx.fillText('—', midX, 34);
        ctx.fillText(`${game.score[1]}`, midX + 45, 35);

        // Sets
        ctx.font = '11px Outfit'; ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText(`Sets: ${game.sets[0]} - ${game.sets[1]}`, midX, 55);

        // === Touch counter ===
        if (game.state === 'playing' && game.possessionTeam !== -1) {
            const px = game.possessionTeam === 0 ? midX - 150 : midX + 150;
            const remaining = CFG.MAX_TOUCHES - game.touchCount;
            ctx.font = 'bold 14px Outfit';
            ctx.fillStyle = remaining <= 1 ? '#ff6b6b' : '#fff';
            ctx.fillText(`Toques: ${game.touchCount}/${CFG.MAX_TOUCHES}`, px, 75);
        }

        // === Serving indicator ===
        if (game.state === 'serve') {
            ctx.font = 'bold 16px Outfit'; ctx.fillStyle = 'rgba(255,255,255,0.75)';
            const st = game.servingTeam === 0 ? 'Time A' : 'Time B';
            ctx.fillText(`Saque: ${st}  —  Pressione ESPAÇO`, midX, CFG.GROUND + 30);
        }

        // === Player indicators (arrow above human-controlled players) ===
        for (const p of game.players) {
            if (p.ctrl) {
                const ax = p.x, ay = p.y - 80 + Math.sin(game.totalTime * 4) * 3;
                ctx.fillStyle = p.team === 0 ? '#f7c948' : '#3a8fd4';
                ctx.beginPath();
                ctx.moveTo(ax, ay); ctx.lineTo(ax - 5, ay - 8); ctx.lineTo(ax + 5, ay - 8);
                ctx.closePath(); ctx.fill();
            }
        }

        // === Animated message ===
        if (this.msgTimer > 0) {
            ctx.save();
            ctx.globalAlpha = clamp(this.msgTimer, 0, 1);
            ctx.font = `bold ${Math.floor(36 * this.msgScale)}px Outfit`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            // text shadow
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillText(this.msg, midX + 2, CFG.H / 2 + 2);
            ctx.fillStyle = '#fff';
            ctx.fillText(this.msg, midX, CFG.H / 2);
            ctx.restore();
        }

        // === Flash overlay ===
        if (this.flashAlpha > 0) {
            ctx.save(); ctx.globalAlpha = this.flashAlpha;
            ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, CFG.W, CFG.H);
            ctx.restore();
        }

        // === Controls reference ===
        ctx.font = '10px Outfit'; ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.textAlign = 'left';
        ctx.fillText('P1: ← → ↑ ↓  |  P2: WASD  |  Saque: ESPAÇO  |  Pausa: ESC/P  |  Reiniciar: R', 10, CFG.H - 8);
    }

    renderPause(ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, CFG.W, CFG.H);
        ctx.font = 'bold 48px Outfit'; ctx.fillStyle = '#fff';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('⏸ PAUSADO', CFG.W/2, CFG.H/2 - 20);
        ctx.font = '18px Outfit'; ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText('Pressione ESC ou P para continuar', CFG.W/2, CFG.H/2 + 30);
    }

    renderGameOver(ctx, winner, score, sets) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, CFG.W, CFG.H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = 'bold 42px Outfit';
        ctx.fillStyle = winner === 0 ? '#f7c948' : '#3a8fd4';
        ctx.fillText(`🏆 ${winner === 0 ? 'TIME A' : 'TIME B'} VENCEU! 🏆`, CFG.W/2, CFG.H/2 - 60);
        ctx.font = '24px Outfit'; ctx.fillStyle = '#fff';
        ctx.fillText(`Placar: ${score[0]} — ${score[1]}`, CFG.W/2, CFG.H/2);
        ctx.fillText(`Sets: ${sets[0]} — ${sets[1]}`, CFG.W/2, CFG.H/2 + 35);
        // Play again button
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        this._roundRect(ctx, CFG.W/2 - 110, CFG.H/2 + 65, 220, 45, 10); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;
        this._roundRect(ctx, CFG.W/2 - 110, CFG.H/2 + 65, 220, 45, 10); ctx.stroke();
        ctx.font = 'bold 18px Outfit'; ctx.fillStyle = '#fff';
        ctx.fillText('🔄  Jogar Novamente  (R)', CFG.W/2, CFG.H/2 + 88);
    }

    renderMenu(ctx, totalTime, difficulty) {
        ctx.fillStyle = 'rgba(0,0,0,0.55)'; ctx.fillRect(0, 0, CFG.W, CFG.H);
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        // Title
        const sc = 1 + Math.sin(totalTime * 2) * 0.03;
        ctx.save(); ctx.translate(CFG.W/2, 140); ctx.scale(sc, sc);
        ctx.font = 'bold 54px Outfit';
        ctx.fillStyle = '#f7c948';
        ctx.fillText('⚽ FUTEVÔLEI 2v2', 0, 0);
        ctx.font = '20px Outfit'; ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.fillText('Praia — Modo Arcade', 0, 40);
        ctx.restore();

        // Difficulty selector
        const diffs = ['Fácil', 'Médio', 'Difícil'];
        const colors = ['#2ecc71', '#f39c12', '#e74c3c'];
        ctx.font = 'bold 16px Outfit';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.fillText('Dificuldade da IA (1, 2, 3):', CFG.W/2, 240);
        for (let i = 0; i < 3; i++) {
            const bx = CFG.W/2 - 130 + i * 130;
            const sel = difficulty === i;
            ctx.fillStyle = sel ? colors[i] : 'rgba(255,255,255,0.1)';
            this._roundRect(ctx, bx - 45, 258, 90, 34, 8); ctx.fill();
            if (sel) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; this._roundRect(ctx, bx-45,258,90,34,8); ctx.stroke(); }
            ctx.fillStyle = sel ? '#fff' : 'rgba(255,255,255,0.5)';
            ctx.font = `${sel?'bold ':''} 14px Outfit`;
            ctx.fillText(diffs[i], bx, 276);
        }

        // Controls info
        ctx.font = '14px Outfit'; ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('Jogador 1: ← → ↑ ↓    |    Jogador 2: W A S D', CFG.W/2, 330);
        ctx.fillText('↓ ou S = modificador de cortada (no ar)', CFG.W/2, 352);

        // Start
        const pulse = 0.85 + Math.sin(totalTime * 3) * 0.15;
        ctx.globalAlpha = pulse;
        ctx.font = 'bold 22px Outfit'; ctx.fillStyle = '#fff';
        ctx.fillText('Pressione ENTER ou ESPAÇO para começar', CFG.W/2, 420);
        ctx.globalAlpha = 1;

        // Mode info
        ctx.font = '12px Outfit'; ctx.fillStyle = 'rgba(255,255,255,0.35)';
        ctx.fillText('Time A: 1 humano + 1 IA   vs   Time B: 2 IAs   |   Melhor de 3 sets, 15 pontos com vantagem', CFG.W/2, 470);
    }

    _roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x+r, y);
        ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
        ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
        ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
        ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
        ctx.closePath();
    }
}

// ========================= MAIN GAME =========================
class Game {
    constructor() {
        this.canvas = document.getElementById('c');
        this.ctx = this.canvas.getContext('2d');
        this.input = new InputHandler();
        this.camera = new Camera();
        this.ball = new Ball();
        this.net = new Net();
        this.scenery = new Scenery();
        this.hud = new HUD();
        this.particles = [];
        this.footprints = [];

        // State
        this.state = 'menu'; // menu, serve, playing, point, setover, gameover, paused
        this.prevState = 'menu';
        this.score = [0, 0];
        this.sets = [0, 0];
        this.servingTeam = 0;
        this.possessionTeam = -1;
        this.touchCount = 0;
        this.lastTouchPlayer = -1;
        this.pointTimer = 0;
        this.totalTime = 0;
        this.difficulty = 1; // 0=easy, 1=med, 2=hard

        // Players
        this._createPlayers();

        // AI controllers
        this.aiControllers = [];
        this._createAI();

        // Canvas sizing
        this._resize();
        window.addEventListener('resize', () => this._resize());

        // Start loop
        this.lastTS = 0;
        requestAnimationFrame(ts => this.loop(ts));
    }

    _createPlayers() {
        // Team 0 (left): Player 0 = human (arrows), Player 1 = AI
        // Team 1 (right): Player 2 = AI, Player 3 = AI
        this.players = [
            new Player(0, 0, CFG.COURT_L + 80,  PLAYER_LOOKS[0], { left:'ArrowLeft', right:'ArrowRight', jump:'ArrowUp', down:'ArrowDown' }),
            new Player(1, 0, CFG.NET_X - 100,   PLAYER_LOOKS[1], null), // AI
            new Player(2, 1, CFG.NET_X + 100,   PLAYER_LOOKS[2], null), // AI
            new Player(3, 1, CFG.COURT_R - 80,  PLAYER_LOOKS[3], null), // AI
        ];
        // P2 human controls (WASD) — can be activated
        // For now, Player 1 (index 1) is AI. To make it human: uncomment next line
        // this.players[1].ctrl = { left:'KeyA', right:'KeyD', jump:'KeyW', down:'KeyS' };
    }

    _createAI() {
        const diffs = [CFG.AI_EASY, CFG.AI_MED, CFG.AI_HARD];
        const d = diffs[this.difficulty];
        this.aiControllers = [];
        for (const p of this.players) {
            if (!p.ctrl) {
                this.aiControllers.push({ player: p, ai: new AIController(d) });
            }
        }
    }

    _resize() {
        const ratio = CFG.W / CFG.H;
        let w = window.innerWidth, h = window.innerHeight;
        if (w / h > ratio) { w = h * ratio; } else { h = w / ratio; }
        this.canvas.width = CFG.W; this.canvas.height = CFG.H;
        this.canvas.style.width = `${Math.floor(w)}px`;
        this.canvas.style.height = `${Math.floor(h)}px`;
        this.scale = w / CFG.W;
    }

    restart() {
        this.score = [0, 0];
        this.sets = [0, 0];
        this.servingTeam = 0;
        this._resetRally();
        this.state = 'serve';
        audio.whistle();
    }

    _resetRally() {
        this.ball.reset(this.servingTeam + 1);
        this.possessionTeam = -1;
        this.touchCount = 0;
        this.lastTouchPlayer = -1;
        // Position players at defaults
        const positions = [
            CFG.COURT_L + 80, CFG.NET_X - 100,
            CFG.NET_X + 100, CFG.COURT_R - 80
        ];
        for (let i = 0; i < 4; i++) {
            this.players[i].x = positions[i];
            this.players[i].y = CFG.GROUND;
            this.players[i].vx = 0; this.players[i].vy = 0;
            this.players[i].grounded = true;
            this.players[i].animState = 'idle'; this.players[i].animTimer = 0;
        }
    }

    // =================== MAIN LOOP ===================
    loop(ts) {
        let dt = (ts - this.lastTS) / 1000;
        this.lastTS = ts;
        if (dt > 0.05) dt = 0.05; // cap deltaTime
        if (dt <= 0) dt = 1/60;

        this.totalTime += dt;
        audio.resume();

        this.processInput();
        if (this.state !== 'paused' && this.state !== 'menu' && this.state !== 'gameover') {
            this.update(dt);
        }
        this.render();
        this.input.snapshot();

        requestAnimationFrame(t => this.loop(t));
    }

    // =================== INPUT ===================
    processInput() {
        // Pause toggle
        if (this.input.justPressed('Escape') || this.input.justPressed('KeyP')) {
            if (this.state === 'paused') { this.state = this.prevState; }
            else if (this.state === 'playing' || this.state === 'serve') {
                this.prevState = this.state; this.state = 'paused';
            }
        }
        // Restart
        if (this.input.justPressed('KeyR')) {
            if (this.state === 'gameover' || this.state === 'playing' || this.state === 'paused' || this.state === 'serve') {
                this.state = 'menu';
            }
        }

        // Menu
        if (this.state === 'menu') {
            if (this.input.justPressed('Digit1')) this.difficulty = 0;
            if (this.input.justPressed('Digit2')) this.difficulty = 1;
            if (this.input.justPressed('Digit3')) this.difficulty = 2;
            if (this.input.justPressed('Enter') || this.input.justPressed('Space')) {
                this._createAI();
                this.restart();
            }
            return;
        }
        if (this.state === 'gameover') {
            if (this.input.justPressed('Enter') || this.input.justPressed('Space') || this.input.justPressed('KeyR')) {
                this.state = 'menu';
            }
            return;
        }

        // Player controls
        for (const p of this.players) {
            if (!p.ctrl) continue;
            p.cmdLeft  = this.input.pressed(p.ctrl.left);
            p.cmdRight = this.input.pressed(p.ctrl.right);
            p.cmdJump  = this.input.justPressed(p.ctrl.jump);
            p.cmdDown  = this.input.pressed(p.ctrl.down);
        }

        // Serve
        if (this.state === 'serve') {
            if (this.input.justPressed('Space')) {
                this._doServe();
            }
        }
    }

    _doServe() {
        const dir = this.servingTeam === 0 ? 1 : -1;
        this.ball.serve(dir * rnd(200, 350), rnd(-420, -350));
        this.state = 'playing';
        this.possessionTeam = this.servingTeam;
        this.touchCount = 0;
        audio.hit(200);
    }

    // =================== UPDATE ===================
    update(dt) {
        // Scenery
        this.scenery.update(dt);
        this.camera.update(dt);
        this.hud.update(dt);
        this.net.update(dt);

        // Point scored timer
        if (this.state === 'point' || this.state === 'setover') {
            this.pointTimer -= dt;
            if (this.pointTimer <= 0) {
                if (this.state === 'setover') {
                    // Check if match is over
                    if (this.sets[0] >= CFG.SETS_TO_WIN || this.sets[1] >= CFG.SETS_TO_WIN) {
                        this.state = 'gameover';
                        return;
                    }
                    this.score = [0, 0];
                }
                this._resetRally();
                this.state = 'serve';
            }
            // Still update player animations during point celebration
            for (const p of this.players) p.updateAnimation(dt);
            return;
        }

        // Update AI
        for (const ac of this.aiControllers) {
            const partner = this.players.find(p => p.team === ac.player.team && p !== ac.player);
            ac.ai.update(dt, ac.player, partner, this.ball, this.state, this.touchCount);
        }

        // Update players
        const teamA = this.players.filter(p => p.team === 0);
        const teamB = this.players.filter(p => p.team === 1);
        for (const p of teamA) p.update(dt, teamA);
        for (const p of teamB) p.update(dt, teamB);

        // Footprints
        for (const p of this.players) {
            if (p.grounded && Math.abs(p.vx) > 50) {
                if (Math.random() < 0.15) {
                    this.footprints.push(new Footprint(p.x + rnd(-5,5), CFG.GROUND + rnd(0,3)));
                }
            }
        }
        this.footprints = this.footprints.filter(f => f.update(dt));

        // Update ball
        this.ball.update(dt);

        if (this.state !== 'playing') return;

        // === Ball-Net collision ===
        this.net.checkCollision(this.ball);

        // === Ball-Player collision ===
        this._checkBallPlayerCollisions();

        // === Ball out of bounds / ground ===
        this._checkBallBounds();

        // Particles update
        this.particles = this.particles.filter(p => p.update(dt));
    }

    _checkBallPlayerCollisions() {
        for (const p of this.players) {
            if (p.touchCooldown > 0) continue;
            const hb = p.getHitboxes();
            const bx = this.ball.x, by = this.ball.y, br = CFG.B_RAD;

            // Check each hitbox
            let touchType = null;
            let contactPt = null;

            // Head
            if (dist(bx, by, hb.head.x, hb.head.y) < br + hb.head.r) {
                touchType = 'head'; contactPt = hb.head;
            }
            // Chest
            else if (dist(bx, by, hb.chest.x, hb.chest.y) < br + hb.chest.r) {
                touchType = 'chest'; contactPt = hb.chest;
            }
            // Foot
            else if (dist(bx, by, hb.foot.x, hb.foot.y) < br + hb.foot.r) {
                touchType = 'foot'; contactPt = hb.foot;
            }
            // Knee
            else if (dist(bx, by, hb.knee.x, hb.knee.y) < br + hb.knee.r) {
                touchType = 'knee'; contactPt = hb.knee;
            }

            if (!touchType) continue;

            // Determine direction toward opponent court
            const dir = p.team === 0 ? 1 : -1;
            const spike = p.cmdDown && !p.grounded;

            let newVx, newVy;
            switch (touchType) {
                case 'head':
                    if (spike) {
                        // Spike header (downward angle)
                        newVx = dir * rnd(500, 700);
                        newVy = rnd(150, 350);
                        p.setAnim('header');
                    } else {
                        // Normal header
                        newVx = dir * rnd(150, 300) + p.vx * 0.3;
                        newVy = rnd(-520, -380);
                        p.setAnim('header');
                    }
                    break;
                case 'chest':
                    // Cushion: slow ball, redirect slightly up
                    newVx = this.ball.vx * 0.2 + dir * rnd(40, 100);
                    newVy = rnd(-320, -220);
                    p.setAnim('chest');
                    break;
                case 'foot':
                case 'knee':
                    if (spike) {
                        // Powerful spike/volley
                        newVx = dir * rnd(600, 850);
                        newVy = rnd(50, 250);
                        p.setAnim('kick');
                        this.camera.shake(5, 0.15);
                    } else if (!p.grounded) {
                        // Aerial kick
                        newVx = dir * rnd(350, 550);
                        newVy = rnd(-250, -100);
                        p.setAnim('kick');
                    } else {
                        // Ground kick
                        newVx = dir * rnd(300, 500);
                        newVy = rnd(-400, -280);
                        p.setAnim('kick');
                    }
                    break;
            }

            this.ball.vx = newVx;
            this.ball.vy = newVy;
            // Push ball out of player
            const angle = Math.atan2(by - contactPt.y, bx - contactPt.x);
            this.ball.x = contactPt.x + Math.cos(angle) * (br + contactPt.r + 2);
            this.ball.y = contactPt.y + Math.sin(angle) * (br + contactPt.r + 2);

            p.touchCooldown = 0.15;
            p.expression = 'focused'; p.exprTimer = 0.5;

            // Touch counting
            if (this.possessionTeam === p.team) {
                this.touchCount++;
                if (this.touchCount > CFG.MAX_TOUCHES) {
                    // Fault: too many touches
                    this._scorePoint(p.team === 0 ? 1 : 0, '4 TOQUES!');
                    return;
                }
            } else {
                this.possessionTeam = p.team;
                this.touchCount = 1;
            }
            this.lastTouchPlayer = p.id;

            // Sand particles
            if (touchType === 'foot' && p.grounded) {
                for (let i = 0; i < 5; i++) {
                    this.particles.push(new Particle(
                        p.x, CFG.GROUND, rnd(-60,60), rnd(-80,-20), rnd(0.3,0.6), rnd(1,3), '#c9a56c', 0.5
                    ));
                }
            }

            audio.hit(Math.hypot(newVx, newVy));
            break; // only one player touches per frame
        }
    }

    _checkBallBounds() {
        const b = this.ball;
        if (!b.active) return;

        // Ground hit
        if (b.y >= CFG.GROUND - CFG.B_RAD) {
            b.y = CFG.GROUND - CFG.B_RAD;
            b.vy = 0; b.vx = 0; b.active = false;
            // Sand particles on impact
            for (let i = 0; i < 12; i++) {
                this.particles.push(new Particle(
                    b.x, CFG.GROUND, rnd(-100,100), rnd(-120,-30), rnd(0.3,0.7), rnd(1,3), '#c9a56c', 0.6
                ));
            }
            audio.sand();
            // Determine who gets the point
            if (b.x < CFG.NET_X) {
                // Ball landed on left side → right team (1) scores
                this._scorePoint(1);
            } else {
                // Ball landed on right side → left team (0) scores
                this._scorePoint(0);
            }
            return;
        }

        // Out of bounds (sides / back)
        if (b.x < CFG.COURT_L - 30 || b.x > CFG.COURT_R + 30) {
            b.active = false;
            // Last team to touch loses the point
            if (this.lastTouchPlayer >= 0) {
                const lastTeam = this.players[this.lastTouchPlayer].team;
                this._scorePoint(lastTeam === 0 ? 1 : 0, 'FORA!');
            } else {
                this._scorePoint(this.servingTeam === 0 ? 1 : 0, 'FORA!');
            }
            return;
        }

        // Ceiling
        if (b.y < -50) {
            b.vy = Math.abs(b.vy) * 0.5;
            b.y = -50;
        }
    }

    _scorePoint(winnerTeam, msg) {
        this.score[winnerTeam]++;
        this.servingTeam = winnerTeam;
        this.state = 'point';
        this.pointTimer = 2.0;

        this.hud.showMessage(msg || 'PONTO!', 1.8);
        this.hud.flash();
        this.camera.shake(4, 0.2);
        audio.point();

        // Player expressions
        for (const p of this.players) {
            if (p.team === winnerTeam) {
                p.expression = 'happy'; p.exprTimer = 2;
                p.setAnim('celebrate');
            } else {
                p.expression = 'sad'; p.exprTimer = 2;
                p.setAnim('disappoint');
            }
        }

        // Check set win
        const s0 = this.score[0], s1 = this.score[1];
        const target = CFG.PTS_TO_WIN;
        const checkWin = (a, b) => {
            if (a >= target && (a - b >= 2 || !CFG.ADVANTAGE)) return true;
            return false;
        };
        if (checkWin(s0, s1)) {
            this.sets[0]++;
            this.state = 'setover';
            this.pointTimer = 3.0;
            this.hud.showMessage(`TIME A VENCE O SET! (${this.sets[0]}-${this.sets[1]})`, 2.5);
            audio.whistle();
        } else if (checkWin(s1, s0)) {
            this.sets[1]++;
            this.state = 'setover';
            this.pointTimer = 3.0;
            this.hud.showMessage(`TIME B VENCE O SET! (${this.sets[0]}-${this.sets[1]})`, 2.5);
            audio.whistle();
        }
    }

    // =================== RENDER ===================
    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, CFG.W, CFG.H);

        // Scenery (sky, ocean, sand)
        this.scenery.render(ctx);

        // Footprints
        for (const f of this.footprints) {
            ctx.globalAlpha = f.alpha;
            ctx.fillStyle = '#b08850';
            ctx.beginPath(); ctx.ellipse(f.x, f.y, 5, 2.5, 0, 0, Math.PI*2); ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Court lines
        this.scenery.renderCourtLines(ctx);

        // Net
        this.net.render(ctx, this.camera);

        // Particles (behind players)
        for (const p of this.particles) {
            ctx.globalAlpha = p.alpha * (p.life / p.maxLife);
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Players (sorted by y for basic depth)
        const sorted = [...this.players].sort((a,b) => a.y - b.y);
        for (const p of sorted) p.render(ctx, this.camera);

        // Ball
        this.ball.render(ctx, this.camera);

        // HUD
        this.hud.render(ctx, this);

        // Overlays
        if (this.state === 'paused') this.hud.renderPause(ctx);
        if (this.state === 'gameover') this.hud.renderGameOver(ctx, this.sets[0] >= CFG.SETS_TO_WIN ? 0 : 1, this.score, this.sets);
        if (this.state === 'menu') this.hud.renderMenu(ctx, this.totalTime, this.difficulty);
    }
}

// ========================= BOOT =========================
window.addEventListener('load', () => { new Game(); });
