/* ══════════════════════════════════════════════════════════
   MOTOR DO JOGO: CONSTANTES, MATEMÁTICA & CONFIGURAÇÕES
   ══════════════════════════════════════════════════════════ */
const GAME_CONFIG = {
    // Dimensões do feltro de jogo padrão 2:1
    TABLE: {
        WIDTH: 1000,
        HEIGHT: 500,
        CUSHION_SIZE: 40,
        CORNER_POCKET_RADIUS: 28,
        SIDE_POCKET_RADIUS: 24,
        POCKET_DROP_RADIUS: 22,
        BAULK_X: 250 // Linha de saída da bola branca
    },
    BALLS: {
        RADIUS: 14,
        MASS: 1.0,
        DRAG: 0.988,          // Arrasto por frame (~atrito com o feltro)
        RESTITUTION: 0.965,    // Elasticidade choque bola-bola
        CUSHION_RESTITUTION: 0.82, // Elasticidade choque com a borracha da tabela
        STOP_SPEED: 1.2        // Velocidade abaixo da qual a bola para totalmente
    },
    PHYSICS: {
        SUB_STEPS: 8,          // Sub-passos de integração para impedir atravessamento
        MAX_POWER: 42          // Impulso máximo da tacada
    },
    ECONOMY: {
        WIN_XP: 140,
        LOSE_XP: 35,
        BALL_XP: 15,
        WIN_COINS: 100,
        BALL_COINS: 10,
        LEVEL_UP_COINS: 150
    }
};

// Cores Oficiais das Bolas de Sinuca (1 a 15)
const BALL_PALETTE = {
    0:  { color: '#ffffff', name: 'Branca', stripe: false },
    1:  { color: '#f1c40f', name: 'Amarela', stripe: false },
    2:  { color: '#2980b9', name: 'Azul', stripe: false },
    3:  { color: '#e74c3c', name: 'Vermelha', stripe: false },
    4:  { color: '#8e44ad', name: 'Roxa', stripe: false },
    5:  { color: '#e67e22', name: 'Laranja', stripe: false },
    6:  { color: '#27ae60', name: 'Verde', stripe: false },
    7:  { color: '#78281f', name: 'Borgonha', stripe: false },
    8:  { color: '#111111', name: 'Preta', stripe: false },
    9:  { color: '#f1c40f', name: 'Amarela Listrada', stripe: true },
    10: { color: '#2980b9', name: 'Azul Listrada', stripe: true },
    11: { color: '#e74c3c', name: 'Vermelha Listrada', stripe: true },
    12: { color: '#8e44ad', name: 'Roxa Listrada', stripe: true },
    13: { color: '#e67e22', name: 'Laranja Listrada', stripe: true },
    14: { color: '#27ae60', name: 'Verde Listrada', stripe: true },
    15: { color: '#78281f', name: 'Borgonha Listrada', stripe: true }
};

// Catálogo de Tacos com Atributos Especiais
const CUE_CATALOG = [
    { id: 'cue_bar', name: 'Taco Bar Tradicional', price: 0, rarity: 'comum', aimLen: 380, powerMod: 1.0, spinMod: 1.0, color: '#8b5a2b', accent: '#d2b48c' },
    { id: 'cue_bambu', name: 'Taco Bambu da Ilha', price: 200, rarity: 'comum', aimLen: 420, powerMod: 1.03, spinMod: 1.05, color: '#c2b280', accent: '#556b2f' },
    { id: 'cue_brasil', name: 'Verde e Amarelo Campeão', price: 500, rarity: 'raro', aimLen: 480, powerMod: 1.08, spinMod: 1.15, color: '#009b3a', accent: '#fedf00' },
    { id: 'cue_carbono', name: 'Fibra de Carbono Pro', price: 900, rarity: 'raro', aimLen: 520, powerMod: 1.12, spinMod: 1.2, color: '#1a1a1a', accent: '#444444' },
    { id: 'cue_ouro', name: 'Dourado Imperial VIP', price: 1600, rarity: 'epico', aimLen: 580, powerMod: 1.16, spinMod: 1.3, color: '#ffd700', accent: '#ffffff' },
    { id: 'cue_neon', name: 'Neon Cyberpunk 2077', price: 2400, rarity: 'epico', aimLen: 620, powerMod: 1.20, spinMod: 1.35, color: '#00ffff', accent: '#ff00ff' },
    { id: 'cue_dragao', name: 'Dragão de Fogo Carmesim', price: 3500, rarity: 'lendario', aimLen: 680, powerMod: 1.24, spinMod: 1.45, color: '#ff2200', accent: '#ffaa00' },
    { id: 'cue_gelo', name: 'Gelo Glacial Ártico', price: 4200, rarity: 'lendario', aimLen: 720, powerMod: 1.26, spinMod: 1.5, color: '#e0f7fa', accent: '#00b0ff' },
    { id: 'cue_galaxia', name: 'Galáxia Cósmica Estelar', price: 5500, rarity: 'lendario', aimLen: 780, powerMod: 1.30, spinMod: 1.6, color: '#4a148c', accent: '#ea80fc' },
    { id: 'cue_mestre', name: 'Taco do Mestre Supremo', price: 8000, rarity: 'lendario', aimLen: 850, powerMod: 1.35, spinMod: 1.7, color: '#212121', accent: '#ffd700' }
];

// Catálogo de Cenários e Mesas
const SCENARIO_CATALOG = [
    { id: 'scen_bar', name: 'Bar Brasileiro Tradicional', price: 0, felt: '#0d5c30', wood: '#4a2711', cushion: '#08381c' },
    { id: 'scen_favela', name: 'Favela Sunset na Laje', price: 400, felt: '#9c3b1e', wood: '#3d1c10', cushion: '#6b2510' },
    { id: 'scen_luxo', name: 'Mansão & Piscina de Luxo', price: 800, felt: '#144673', wood: '#1c222b', cushion: '#0b2b47' },
    { id: 'scen_campo', name: 'Chácara Imperial no Campo', price: 1200, felt: '#5c1228', wood: '#2b1319', cushion: '#380a18' }
];

// Conquistas do Jogador
const ACHIEVEMENTS_DATA = [
    { id: 'first_win', title: 'Primeira Vitória', desc: 'Vença sua primeira partida de sinuca.', reward: 100, icon: '🥇' },
    { id: 'pot_8_clean', title: 'Mestre da Oito', desc: 'Encaçape a bola 8 para garantir a vitória.', reward: 150, icon: '🎱' },
    { id: 'no_foul', title: 'Jogo Limpo', desc: 'Vença uma partida sem cometer nenhuma falta.', reward: 200, icon: '✨' },
    { id: 'pot_three', title: 'Tacada em Série', desc: 'Encaçape 3 ou mais bolas na mesma partida.', reward: 250, icon: '🔥' },
    { id: 'defeat_master', title: 'Domador de Tubarão', desc: 'Vença a IA na dificuldade Mestre.', reward: 500, icon: '🦈' }
];

/* ══════════════════════════════════════════════════════════
   CLASSE VETORIAL 2D (VEC2)
   ══════════════════════════════════════════════════════════ */
class Vec2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    set(x, y) { this.x = x; this.y = y; return this; }
    copy() { return new Vec2(this.x, this.y); }
    add(v) { return new Vec2(this.x + v.x, this.y + v.y); }
    sub(v) { return new Vec2(this.x - v.x, this.y - v.y); }
    mult(s) { return new Vec2(this.x * s, this.y * s); }
    div(s) { return s !== 0 ? new Vec2(this.x / s, this.y / s) : new Vec2(); }
    dot(v) { return this.x * v.x + this.y * v.y; }
    cross(v) { return this.x * v.y - this.y * v.x; }
    magSq() { return this.x * this.x + this.y * this.y; }
    mag() { return Math.sqrt(this.magSq()); }
    dist(v) { return this.sub(v).mag(); }
    distSq(v) { return this.sub(v).magSq(); }
    normalize() {
        let m = this.mag();
        return m > 0.00001 ? this.div(m) : new Vec2(0, 0);
    }
    rotate(angle) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        return new Vec2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
    }
    heading() { return Math.atan2(this.y, this.x); }
}

/* ══════════════════════════════════════════════════════════
   SISTEMA DE ÁUDIO SINTETIZADO (WEB AUDIO API)
   ══════════════════════════════════════════════════════════ */
const AudioEngine = {
    ctx: null,
    muted: false,

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                try {
                    this.ctx = new AudioCtx();
                } catch(e) {}
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            try { this.ctx.resume(); } catch(e) {}
        }
    },

    toggleMute() {
        this.muted = !this.muted;
        document.getElementById('sound-icon-display').innerText = this.muted ? '🔇' : '🔊';
        SaveSystem.data.settings.sound = !this.muted;
        SaveSystem.save();
    },

    setSound(enabled) {
        this.muted = !enabled;
        document.getElementById('sound-icon-display').innerText = this.muted ? '🔇' : '🔊';
        SaveSystem.data.settings.sound = enabled;
        SaveSystem.save();
    },

    // Som de impacto Bola-Bola (clique resinoso nítido)
    playBallHit(vol = 1.0) {
        if (this.muted) return;
        this.init();
        try {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            let now = this.ctx.currentTime;

            osc.type = 'triangle';
            let freq = 1100 + Math.random() * 300;
            osc.frequency.setValueAtTime(freq, now);
            osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

            let v = Math.min(1.0, Math.max(0.1, vol));
            gain.gain.setValueAtTime(v * 0.7, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.05);
        } catch(e) {}
    },

    // Som de impacto com a Tabela (batida mais grave e abafada)
    playCushionHit(vol = 1.0) {
        if (this.muted) return;
        this.init();
        try {
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            let now = this.ctx.currentTime;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.exponentialRampToValueAtTime(90, now + 0.09);

            let v = Math.min(1.0, Math.max(0.1, vol));
            gain.gain.setValueAtTime(v * 0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.09);
        } catch(e) {}
    },

    // Som da Tacada (batida de giz + madeira)
    playCueShot(powerRatio = 0.5) {
        if (this.muted) return;
        this.init();
        try {
            let now = this.ctx.currentTime;

            // Ruído de giz
            let bufferSize = this.ctx.sampleRate * 0.06;
            let buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            let data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            let noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            let filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1600;

            let gain = this.ctx.createGain();
            gain.gain.setValueAtTime(powerRatio * 0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
            noise.stop(now + 0.06);
        } catch(e) {}
    },

    // Som de bola caindo na caçapa (queda + chocalho de rede)
    playPocket() {
        if (this.muted) return;
        this.init();
        try {
            let now = this.ctx.currentTime;
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(140, now);
            osc.frequency.exponentialRampToValueAtTime(50, now + 0.25);

            gain.gain.setValueAtTime(0.7, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.25);
        } catch(e) {}
    },

    // Fanfarra de Vitória
    playWin() {
        if (this.muted) return;
        this.init();
        let notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                try {
                    let now = this.ctx.currentTime;
                    let osc = this.ctx.createOscillator();
                    let gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.35);
                } catch(e) {}
            }, idx * 120);
        });
    },

    // Som de Falta ou Derrota
    playFoul() {
        if (this.muted) return;
        this.init();
        try {
            let now = this.ctx.currentTime;
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.3);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        } catch(e) {}
    },

    // Clique de UI
    playClick() {
        if (this.muted) return;
        this.init();
        try {
            let now = this.ctx.currentTime;
            let osc = this.ctx.createOscillator();
            let gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.04);
        } catch(e) {}
    }
};

/* ══════════════════════════════════════════════════════════
   SISTEMA DE PERSISTÊNCIA LOCAL (LOCALSTORAGE)
   ══════════════════════════════════════════════════════════ */
const SaveSystem = {
    key: 'sinuca_master_save_v2',
    data: {
        playerName: 'Mestre da Sinuca',
        level: 1,
        xp: 0,
        coins: 1000,
        equippedCue: 'cue_bar',
        equippedScenario: 'scen_bar',
        ownedCues: ['cue_bar'],
        ownedScenarios: ['scen_bar'],
        achievements: [],
        lastDailyClaim: 0,
        settings: {
            sound: true,
            guide: true,
            particles: true,
            shake: true
        }
    },

    load() {
        try {
            let saved = localStorage.getItem(this.key);
            if (saved) {
                let parsed = JSON.parse(saved);
                this.data = { ...this.data, ...parsed };
                if (parsed.settings) {
                    this.data.settings = { ...this.data.settings, ...parsed.settings };
                }
            }
        } catch (e) {
            console.warn('Erro ao carregar dados locais:', e);
        }
        AudioEngine.muted = !this.data.settings.sound;
    },

    save() {
        try {
            localStorage.setItem(this.key, JSON.stringify(this.data));
        } catch (e) {
            console.warn('Erro ao salvar no localStorage:', e);
        }
    },

    addXP(amount) {
        this.data.xp += amount;
        let neededXP = this.data.level * 250;
        let leveledUp = false;
        while (this.data.xp >= neededXP && this.data.level < 50) {
            this.data.xp -= neededXP;
            this.data.level++;
            this.data.coins += GAME_CONFIG.ECONOMY.LEVEL_UP_COINS;
            neededXP = this.data.level * 250;
            leveledUp = true;
        }
        this.save();
        UI.updateTopBar();
        if (leveledUp) {
            UI.showNotice(`SUBIU DE NÍVEL! NÍVEL ${this.data.level} 👑`);
            AudioEngine.playWin();
        }
    },

    addCoins(amount) {
        this.data.coins += amount;
        this.save();
        UI.updateTopBar();
    },

    unlockAchievement(id) {
        if (!this.data.achievements.includes(id)) {
            let ach = ACHIEVEMENTS_DATA.find(a => a.id === id);
            if (ach) {
                this.data.achievements.push(id);
                this.addCoins(ach.reward);
                this.save();
                UI.showNotice(`🏆 CONQUISTA: ${ach.title}! +${ach.reward} $`);
                AudioEngine.playWin();
            }
        }
    },

    resetAllProgress() {
        if (confirm("Deseja realmente zerar todo o seu progresso e fichas?")) {
            localStorage.removeItem(this.key);
            location.reload();
        }
    }
};

/* ══════════════════════════════════════════════════════════
   ENTIDADE BOLA DE SINUCA (BOLA 3D REALISTA)
   ══════════════════════════════════════════════════════════ */
class Ball {
    constructor(id, x, y) {
        this.id = id;
        this.pos = new Vec2(x, y);
        this.vel = new Vec2(0, 0);
        this.radius = GAME_CONFIG.BALLS.RADIUS;
        this.active = true;
        this.isPotted = false;
        this.falling = false;
        this.scale = 1.0;
        this.opacity = 1.0;

        // Propriedades visuais do catálogo
        const meta = BALL_PALETTE[id] || BALL_PALETTE[0];
        this.color = meta.color;
        this.isStripe = meta.stripe;

        // Rotação da bola no espaço 3D (para visualização do rolamento)
        this.rotX = Math.random() * Math.PI * 2;
        this.rotY = Math.random() * Math.PI * 2;

        // Efeito Spin da Bola Branca
        this.spin = new Vec2(0, 0); // (top/bottom, left/right)
    }

    update(dt) {
        if (!this.active) return;

        // Animação de queda na caçapa
        if (this.falling) {
            this.scale *= 0.88;
            this.opacity *= 0.88;
            this.vel = this.vel.mult(0.6);
            this.pos = this.pos.add(this.vel.mult(dt));
            if (this.scale < 0.1) {
                this.active = false;
                this.falling = false;
                this.isPotted = true;
            }
            return;
        }

        // Integração de movimento com arrasto do feltro
        let speed = this.vel.mag();
        if (speed > 0.001) {
            this.pos = this.pos.add(this.vel.mult(dt));
            this.vel = this.vel.mult(Math.pow(GAME_CONFIG.BALLS.DRAG, dt * 60));

            // Rotação visual 3D proporcional à velocidade
            this.rotX += (this.vel.y / this.radius) * dt * 3;
            this.rotY += (this.vel.x / this.radius) * dt * 3;

            // Se for muito lenta, para por completo
            if (this.vel.mag() < GAME_CONFIG.BALLS.STOP_SPEED) {
                this.vel.set(0, 0);
            }
        }
    }

    draw(ctx) {
        if (!this.active || this.opacity <= 0.02) return;

        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.scale(this.scale, this.scale);
        ctx.globalAlpha = this.opacity;

        // 1. Sombra suave no feltro (ligeiramente deslocada para baixo-direita)
        ctx.beginPath();
        ctx.ellipse(3, 4, this.radius * 1.05, this.radius * 0.85, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fill();

        // 2. Base da Esfera
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.isStripe ? '#f8f9fa' : this.color;
        ctx.fill();

        // 3. Faixa colorida central para bolas Listradas (9-15)
        if (this.isStripe) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, this.radius - 0.5, 0, Math.PI * 2);
            ctx.clip();

            // Faixa com leve oscilação de rotação 3D
            let stripeOffset = Math.sin(this.rotX) * 4;
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.radius, -this.radius * 0.55 + stripeOffset, this.radius * 2, this.radius * 1.1);
            ctx.restore();
        }

        // 4. Círculo branco com o número da bola (1 a 15)
        if (this.id > 0) {
            let numOffsetY = Math.sin(this.rotX) * (this.radius * 0.35);
            let numOffsetX = Math.sin(this.rotY) * (this.radius * 0.35);

            ctx.beginPath();
            ctx.arc(numOffsetX, numOffsetY, this.radius * 0.44, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Texto do número
            ctx.fillStyle = '#111111';
            ctx.font = `900 ${this.id >= 10 ? '7.5px' : '9px'} sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.id.toString(), numOffsetX, numOffsetY + 0.5);
        }

        // 5. Brilho Especular 3D (Reflexo de luz superior esquerda)
        let highlight = ctx.createRadialGradient(
            -this.radius * 0.35, -this.radius * 0.35, 1,
            -this.radius * 0.2, -this.radius * 0.2, this.radius * 1.1
        );
        highlight.addColorStop(0, 'rgba(255, 255, 255, 0.75)');
        highlight.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)');
        highlight.addColorStop(0.8, 'rgba(0, 0, 0, 0.25)');
        highlight.addColorStop(1, 'rgba(0, 0, 0, 0.6)');

        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = highlight;
        ctx.fill();

        ctx.restore();
    }
}

/* ══════════════════════════════════════════════════════════
   MOTOR FÍSICO (COLISÕES, TABELAS & CAÇAPAS)
   ══════════════════════════════════════════════════════════ */
const PhysicsEngine = {
    // 6 Caçapas oficiais da mesa
    pockets: [
        { x: 42,  y: 42,  r: GAME_CONFIG.TABLE.CORNER_POCKET_RADIUS }, // Canto Sup Esq
        { x: 500, y: 32,  r: GAME_CONFIG.TABLE.SIDE_POCKET_RADIUS },   // Meio Sup
        { x: 958, y: 42,  r: GAME_CONFIG.TABLE.CORNER_POCKET_RADIUS }, // Canto Sup Dir
        { x: 42,  y: 458, r: GAME_CONFIG.TABLE.CORNER_POCKET_RADIUS }, // Canto Inf Esq
        { x: 500, y: 468, r: GAME_CONFIG.TABLE.SIDE_POCKET_RADIUS },   // Meio Inf
        { x: 958, y: 458, r: GAME_CONFIG.TABLE.CORNER_POCKET_RADIUS }  // Canto Inf Dir
    ],

    // Limites de borracha das 6 tabelas
    cushions: [
        // Tabela Superior Esquerda
        { p1: new Vec2(72, 40), p2: new Vec2(468, 40), norm: new Vec2(0, 1) },
        // Tabela Superior Direita
        { p1: new Vec2(532, 40), p2: new Vec2(928, 40), norm: new Vec2(0, 1) },
        // Tabela Inferior Esquerda
        { p1: new Vec2(72, 460), p2: new Vec2(468, 460), norm: new Vec2(0, -1) },
        // Tabela Inferior Direita
        { p1: new Vec2(532, 460), p2: new Vec2(928, 460), norm: new Vec2(0, -1) },
        // Tabela Lateral Esquerda
        { p1: new Vec2(40, 72), p2: new Vec2(40, 428), norm: new Vec2(1, 0) },
        // Tabela Lateral Direita
        { p1: new Vec2(960, 72), p2: new Vec2(960, 428), norm: new Vec2(-1, 0) }
    ],

    update(balls, dt) {
        let subDt = dt / GAME_CONFIG.PHYSICS.SUB_STEPS;

        for (let step = 0; step < GAME_CONFIG.PHYSICS.SUB_STEPS; step++) {
            // Atualiza posição de todas
            for (let i = 0; i < balls.length; i++) {
                balls[i].update(subDt);
            }

            // Verifica caçapas
            this.checkPockets(balls);

            // Colisões Bola-Bola
            for (let i = 0; i < balls.length; i++) {
                let b1 = balls[i];
                if (!b1.active || b1.falling) continue;

                for (let j = i + 1; j < balls.length; j++) {
                    let b2 = balls[j];
                    if (!b2.active || b2.falling) continue;

                    this.resolveBallBall(b1, b2);
                }

                // Colisões com Tabelas
                this.resolveCushions(b1);
            }
        }
    },

    resolveBallBall(b1, b2) {
        let delta = b1.pos.sub(b2.pos);
        let dist = delta.mag();
        let minDist = b1.radius + b2.radius;

        if (dist < minDist && dist > 0.0001) {
            let normal = delta.div(dist);

            // Correção de penetração (empurra para fora igualmente)
            let overlap = minDist - dist;
            b1.pos = b1.pos.add(normal.mult(overlap * 0.5));
            b2.pos = b2.pos.sub(normal.mult(overlap * 0.5));

            // Velocidade relativa ao longo da normal
            let relVel = b1.vel.sub(b2.vel);
            let velAlongNormal = relVel.dot(normal);

            // Apenas colide se estiverem se aproximando
            if (velAlongNormal < 0) {
                let impulse = -(1 + GAME_CONFIG.BALLS.RESTITUTION) * velAlongNormal * 0.5;
                let impulseVec = normal.mult(impulse);

                b1.vel = b1.vel.add(impulseVec);
                b2.vel = b2.vel.sub(impulseVec);

                // Transferência de spin caso uma seja a bola branca
                if (b1.id === 0 && b1.spin.magSq() > 0.01) {
                    b1.vel = b1.vel.add(normal.mult(b1.spin.y * 6));
                    b1.spin = b1.spin.mult(0.5); // dissipa spin
                } else if (b2.id === 0 && b2.spin.magSq() > 0.01) {
                    b2.vel = b2.vel.sub(normal.mult(b2.spin.y * 6));
                    b2.spin = b2.spin.mult(0.5);
                }

                // Efeito sonoro
                let hitVol = Math.min(1.0, Math.abs(velAlongNormal) / 25);
                AudioEngine.playBallHit(hitVol);

                // Partículas de impacto se habilitado
                if (SaveSystem.data.settings.particles && hitVol > 0.2) {
                    let contactPt = b2.pos.add(normal.mult(b2.radius));
                    EffectsEngine.spawnSparks(contactPt.x, contactPt.y, 4);
                }

                // Registra choque nas regras da partida
                RulesSystem.onBallHit(b1.id, b2.id);
            }
        }
    },

    resolveCushions(b) {
        for (let i = 0; i < this.cushions.length; i++) {
            let c = this.cushions[i];

            // Projeção do ponto no segmento
            let seg = c.p2.sub(c.p1);
            let segLen = seg.mag();
            let segDir = seg.div(segLen);

            let pt = b.pos.sub(c.p1);
            let proj = pt.dot(segDir);

            if (proj >= 0 && proj <= segLen) {
                let closest = c.p1.add(segDir.mult(proj));
                let distVec = b.pos.sub(closest);
                let dist = distVec.mag();

                if (dist < b.radius) {
                    // Colisão com a face da tabela
                    let overlap = b.radius - dist;
                    b.pos = b.pos.add(c.norm.mult(overlap));

                    let vDotN = b.vel.dot(c.norm);
                    if (vDotN < 0) {
                        b.vel = b.vel.sub(c.norm.mult((1 + GAME_CONFIG.BALLS.CUSHION_RESTITUTION) * vDotN));

                        // Efeito de spin lateral na tabela
                        if (b.id === 0 && Math.abs(b.spin.x) > 0.05) {
                            let tangent = new Vec2(-c.norm.y, c.norm.x);
                            b.vel = b.vel.add(tangent.mult(b.spin.x * 5));
                            b.spin.x *= 0.5;
                        }

                        let hitVol = Math.min(1.0, Math.abs(vDotN) / 20);
                        AudioEngine.playCushionHit(hitVol);
                        RulesSystem.onCushionHit();
                    }
                }
            }
        }
    },

    checkPockets(balls) {
        for (let i = 0; i < balls.length; i++) {
            let b = balls[i];
            if (!b.active || b.falling) continue;

            for (let j = 0; j < this.pockets.length; j++) {
                let p = this.pockets[j];
                let dist = b.pos.dist(p);

                if (dist < GAME_CONFIG.TABLE.POCKET_DROP_RADIUS) {
                    b.falling = true;
                    // Força em direção ao centro da caçapa
                    let toCenter = new Vec2(p.x - b.pos.x, p.y - b.pos.y).normalize();
                    b.vel = toCenter.mult(8);

                    AudioEngine.playPocket();
                    RulesSystem.onBallPotted(b.id);
                    break;
                }
            }
        }
    }
};

/* ══════════════════════════════════════════════════════════
   MOTOR DE EFEITOS VISUAIS (PARTÍCULAS & SCREEN SHAKE)
   ══════════════════════════════════════════════════════════ */
const EffectsEngine = {
    particles: [],
    shakeIntensity: 0,

    triggerShake(amount) {
        if (!SaveSystem.data.settings.shake) return;
        this.shakeIntensity = Math.min(18, amount);
    },

    spawnSparks(x, y, count = 6, color = '#ffd700') {
        for (let i = 0; i < count; i++) {
            let angle = Math.random() * Math.PI * 2;
            let speed = 20 + Math.random() * 60;
            this.particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: 2.5 + Math.random() * 2.0,
                size: 2 + Math.random() * 2,
                color: color
            });
        }
    },

    spawnChalkDust(x, y, angle) {
        for (let i = 0; i < 8; i++) {
            let spread = (Math.random() - 0.5) * 1.2;
            let speed = 15 + Math.random() * 45;
            this.particles.push({
                x: x, y: y,
                vx: Math.cos(angle + spread) * speed,
                vy: Math.sin(angle + spread) * speed,
                life: 1.0,
                decay: 2.0,
                size: 3 + Math.random() * 3,
                color: 'rgba(74, 144, 226, 0.7)' // Giz azul
            });
        }
    },

    update(dt) {
        // Atualiza tremor de tela
        if (this.shakeIntensity > 0.1) {
            this.shakeIntensity *= 0.88;
        } else {
            this.shakeIntensity = 0;
        }

        // Atualiza partículas
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let p = this.particles[i];
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.life -= p.decay * dt;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    },

    draw(ctx) {
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }
};

/* ══════════════════════════════════════════════════════════
   SISTEMA DE REGRAS 8-BALL & GERENCIAMENTO DE TURNOS
   ══════════════════════════════════════════════════════════ */
const RulesSystem = {
    mode: 1,              // 1: 1v1 IA, 2: 1v1 Local, 3: 2v2 Misto, 4: 2v2 Coop, 5: 2v2 4 Locais
    players: [],          // Lista de jogadores da partida
    turnIndex: 0,         // Índice do jogador da vez (0, 1, 2 ou 3)
    tableOpen: true,      // Mesa aberta (grupos ainda não definidos)
    team1Group: 0,        // 0: Indefinido, 1: Lisas, 2: Listradas
    team2Group: 0,
    breakShot: true,      // Tacada de abertura
    whiteInHand: false,   // Bola branca na mão (após falta)

    // Estatísticas da jogada atual
    turnStats: {
        firstHitId: -1,
        pottedBalls: [],
        whitePotted: false,
        cushionAfterHit: false
    },

    init(mode, playersData) {
        this.mode = mode;
        this.players = playersData;
        this.turnIndex = 0;
        this.tableOpen = true;
        this.team1Group = 0;
        this.team2Group = 0;
        this.breakShot = true;
        this.whiteInHand = false;
        this.resetTurnStats();
        UI.updateHUD();
    },

    resetTurnStats() {
        this.turnStats = {
            firstHitId: -1,
            pottedBalls: [],
            whitePotted: false,
            cushionAfterHit: false
        };
    },

    getCurrentPlayer() {
        if (!this.players || this.players.length === 0) {
            return { name: 'Jogador 1', isAI: false };
        }
        return this.players[this.turnIndex] || this.players[0] || { name: 'Jogador 1', isAI: false };
    },

    getCurrentTeamIndex() {
        // Em 2v2: Jogadores 0 e 2 são Equipe 1; Jogadores 1 e 3 são Equipe 2
        return this.turnIndex % 2; // 0 = Equipe 1, 1 = Equipe 2
    },

    getTeamGroup(teamIndex) {
        return teamIndex === 0 ? this.team1Group : this.team2Group;
    },

    setTeamGroup(teamIndex, group) {
        if (teamIndex === 0) {
            this.team1Group = group;
            this.team2Group = group === 1 ? 2 : 1;
        } else {
            this.team2Group = group;
            this.team1Group = group === 1 ? 2 : 1;
        }
        this.tableOpen = false;
    },

    onBallHit(id1, id2) {
        if (this.turnStats.firstHitId === -1) {
            if (id1 === 0) this.turnStats.firstHitId = id2;
            else if (id2 === 0) this.turnStats.firstHitId = id1;
        }
    },

    onCushionHit() {
        if (this.turnStats.firstHitId !== -1) {
            this.turnStats.cushionAfterHit = true;
        }
    },

    onBallPotted(id) {
        if (id === 0) {
            this.turnStats.whitePotted = true;
        } else {
            this.turnStats.pottedBalls.push(id);
        }
        UI.updateHUD();
    },

    // Avalia o resultado após todas as bolas pararem
    evaluateTurn() {
        let curPlayer = this.getCurrentPlayer();
        let curTeam = this.getCurrentTeamIndex();
        let curGroup = this.getTeamGroup(curTeam);

        let isFoul = false;
        let foulReason = "";
        let continueTurn = false;

        // 1. Bola branca encaçapada
        if (this.turnStats.whitePotted) {
            isFoul = true;
            foulReason = "FALTA: Bola branca encaçapada!";
        }
        // 2. Não tocou em nenhuma bola
        else if (this.turnStats.firstHitId === -1 && !this.breakShot) {
            isFoul = true;
            foulReason = "FALTA: Nenhuma bola foi atingida!";
        }
        // 3. Tocou primeiro na bola incorreta
        else if (this.turnStats.firstHitId !== -1) {
            if (!this.tableOpen) {
                let hitGroup = this.turnStats.firstHitId < 8 ? 1 : (this.turnStats.firstHitId > 8 ? 2 : 8);
                let remainingOwnBalls = GameCore.getRemainingBallsForGroup(curGroup);

                if (remainingOwnBalls > 0) {
                    if (hitGroup !== curGroup) {
                        isFoul = true;
                        foulReason = hitGroup === 8 ? "FALTA: Tocou na bola 8 antes da hora!" : "FALTA: Tocou na bola do adversário primeiro!";
                    }
                } else {
                    // Já limpou o grupo, DEVE tocar na bola 8 primeiro
                    if (this.turnStats.firstHitId !== 8) {
                        isFoul = true;
                        foulReason = "FALTA: Você deve atingir a bola 8!";
                    }
                }
            }
        }

        // 4. Se encaçapou a bola 8
        let pottedEight = this.turnStats.pottedBalls.includes(8);
        if (pottedEight) {
            let remainingOwn = GameCore.getRemainingBallsForGroup(curGroup);
            if (remainingOwn === 0 && !isFoul) {
                // VITÓRIA LEGÍTIMA!
                this.endMatch(curTeam, `${curPlayer.name} encaçapou a Bola 8 com perfeição e venceu!`);
                return;
            } else {
                // DERROTA POR ENCAÇAPAR A 8 PREMATURAMENTE OU COM FALTA
                let winnerTeam = curTeam === 0 ? 1 : 0;
                this.endMatch(winnerTeam, `${curPlayer.name} encaçapou a Bola 8 incorretamente!`);
                return;
            }
        }

        // 5. Definição dos grupos se a mesa estava aberta
        if (this.tableOpen && !isFoul && this.turnStats.pottedBalls.length > 0) {
            let validBall = this.turnStats.pottedBalls.find(id => id !== 8 && id !== 0);
            if (validBall) {
                let g = validBall < 8 ? 1 : 2;
                this.setTeamGroup(curTeam, g);
                UI.showNotice(`${curPlayer.name} é ${g === 1 ? 'LISAS (1-7)' : 'LISTRADAS (9-15)'}!`);
            }
        }

        // 6. Continua a vez se encaçapou bola própria sem cometer falta
        if (!isFoul && this.turnStats.pottedBalls.length > 0) {
            let pottedOwn = this.turnStats.pottedBalls.some(id => {
                if (id === 0 || id === 8) return false;
                let bg = id < 8 ? 1 : 2;
                return this.tableOpen || bg === this.getTeamGroup(curTeam);
            });
            if (pottedOwn) {
                continueTurn = true;
            }
        }

        // Processa Falta
        if (isFoul) {
            AudioEngine.playFoul();
            UI.showNotice(foulReason);
            this.whiteInHand = true;
            // Recoloca a branca se tiver sido encaçapada
            if (this.turnStats.whitePotted) {
                GameCore.respawnWhiteBall();
            }
        }

        this.breakShot = false;
        this.resetTurnStats();

        // Passagem de turno
        if (!continueTurn || isFoul) {
            this.nextTurn();
        } else {
            UI.showNotice("Boa tacada! Continue jogando.");
            // Se for IA continuando
            if (this.getCurrentPlayer().isAI) {
                setTimeout(() => AIBrain.planAndShoot(), 1200);
            }
        }

        UI.updateHUD();
    },

    nextTurn() {
        // Avança turno circular
        this.turnIndex = (this.turnIndex + 1) % this.players.length;
        let nextPlayer = this.getCurrentPlayer();

        // Se for jogador humano em modo local, mostra tela de passe de dispositivo
        if (!nextPlayer.isAI && (this.mode === 2 || this.mode === 4 || this.mode === 5)) {
            UI.showPassTurnModal(nextPlayer.name);
        } else {
            UI.showNotice(`Vez de: ${nextPlayer.name}`);
            if (nextPlayer.isAI) {
                setTimeout(() => AIBrain.planAndShoot(), 1400);
            }
        }
    },

    endMatch(winnerTeamIndex, reason) {
        GameCore.state = 'ENDED';
        let winnerName = winnerTeamIndex === 0 ? "Equipe 1" : "Equipe 2";

        // Nome do jogador se for 1v1
        if (this.mode === 1 || this.mode === 2) {
            winnerName = this.players[winnerTeamIndex].name;
        }

        let isHumanWinner = !this.players[winnerTeamIndex].isAI;

        let xpGained = isHumanWinner ? GAME_CONFIG.ECONOMY.WIN_XP : GAME_CONFIG.ECONOMY.LOSE_XP;
        let coinsGained = isHumanWinner ? GAME_CONFIG.ECONOMY.WIN_COINS : 20;

        SaveSystem.addXP(xpGained);
        SaveSystem.addCoins(coinsGained);

        if (isHumanWinner) {
            SaveSystem.unlockAchievement('first_win');
            SaveSystem.unlockAchievement('pot_8_clean');
            AudioEngine.playWin();
            ConfettiEngine.start();
        } else {
            AudioEngine.playFoul();
        }

        document.getElementById('result-winner-title').innerText = `VITÓRIA: ${winnerName}!`;
        document.getElementById('result-reason-desc').innerText = reason;
        document.getElementById('result-xp-val').innerText = `+${xpGained} XP`;
        document.getElementById('result-coins-val').innerText = `+${coinsGained} $`;

        UI.showScreen('screen-result');
        document.getElementById('game-hud').style.display = 'none';
    }
};

/* ══════════════════════════════════════════════════════════
   INTELIGÊNCIA ARTIFICIAL (IA COM 4 NÍVEIS DE PRECISÃO)
   ══════════════════════════════════════════════════════════ */
const AIBrain = {
    isThinking: false,

    planAndShoot() {
        if (GameCore.state !== 'AIMING' || !RulesSystem.getCurrentPlayer().isAI) return;
        this.isThinking = true;

        let diff = MatchSetup.aiDifficulty; // 1: Fácil, 2: Média, 3: Difícil, 4: Mestre
        let curTeam = RulesSystem.getCurrentTeamIndex();
        let curGroup = RulesSystem.getTeamGroup(curTeam);

        let cueBall = GameCore.balls[0];
        if (!cueBall || !cueBall.active) return;

        // Se bola na mão para a IA, posiciona estrategicamente
        if (RulesSystem.whiteInHand) {
            cueBall.pos = new Vec2(GAME_CONFIG.TABLE.BAULK_X, GAME_CONFIG.TABLE.HEIGHT / 2 + (Math.random() - 0.5) * 80);
            cueBall.active = true;
            RulesSystem.whiteInHand = false;
        }

        // Filtra bolas válidas para atingir
        let candidateBalls = [];
        let remainingOwn = GameCore.getRemainingBallsForGroup(curGroup);

        if (RulesSystem.tableOpen) {
            candidateBalls = GameCore.balls.filter(b => b.id !== 0 && b.id !== 8 && b.active && !b.falling);
        } else if (remainingOwn > 0) {
            candidateBalls = GameCore.balls.filter(b => b.active && !b.falling && (b.id < 8 ? 1 : 2) === curGroup);
        } else {
            // Apenas a bola 8
            let b8 = GameCore.balls.find(b => b.id === 8 && b.active);
            if (b8) candidateBalls.push(b8);
        }

        if (candidateBalls.length === 0) {
            candidateBalls = GameCore.balls.filter(b => b.id !== 0 && b.active && !b.falling);
        }

        // Avalia todas as combinações de bolas e caçapas
        let bestShot = null;
        let highestScore = -999999;

        for (let b of candidateBalls) {
            for (let p of PhysicsEngine.pockets) {
                let toPocket = new Vec2(p.x - b.pos.x, p.y - b.pos.y);
                let pocketDist = toPocket.mag();
                let pocketDir = toPocket.normalize();

                // Ponto fantasma de impacto (onde a branca deve bater)
                let ghostPos = b.pos.sub(pocketDir.mult(b.radius + cueBall.radius));
                let toGhost = ghostPos.sub(cueBall.pos);
                let ghostDist = toGhost.mag();
                let ghostDir = toGhost.normalize();

                // Ângulo de corte (cut angle) entre branca->alvo e alvo->caçapa
                let cutAngle = Math.acos(Math.max(-1, Math.min(1, ghostDir.dot(pocketDir))));

                // Se o ângulo for muito agudo (> 80°), é muito difícil encaçapar
                if (cutAngle > Math.PI * 0.44) continue;

                // Pontuação do tiro: prefere bolas perto da caçapa e ângulos retos
                let score = 1000 - (cutAngle * 600) - (pocketDist * 0.5) - (ghostDist * 0.4);

                if (score > highestScore) {
                    highestScore = score;
                    bestShot = {
                        targetBall: b,
                        pocket: p,
                        angle: toGhost.heading(),
                        dist: ghostDist + pocketDist
                    };
                }
            }
        }

        // Se não achou caçapa viável, dá um toque de segurança em qualquer bola
        let finalAngle = 0;
        let power = 15;

        if (bestShot) {
            finalAngle = bestShot.angle;
            power = Math.min(GAME_CONFIG.PHYSICS.MAX_POWER, 14 + (bestShot.dist * 0.04));
        } else if (candidateBalls.length > 0) {
            let randomTarget = candidateBalls[0];
            finalAngle = randomTarget.pos.sub(cueBall.pos).heading();
            power = 18;
        }

        // Aplica margem de erro baseada na dificuldade
        let errorSpread = 0.16; // Fácil: ~9 graus
        if (diff === 2) errorSpread = 0.07; // Média: ~4 graus
        if (diff === 3) errorSpread = 0.025; // Difícil: ~1.4 graus
        if (diff === 4) errorSpread = 0.005; // Mestre: quase milimétrico

        finalAngle += (Math.random() - 0.5) * errorSpread;

        // Animação natural da IA "mirando" antes de tacar
        let startAim = GameCore.aimAngle;
        let startTime = performance.now();
        let animDuration = 1000;

        function animateAim(now) {
            let elapsed = now - startTime;
            let progress = Math.min(1.0, elapsed / animDuration);
            // Interpolação suave
            GameCore.aimAngle = startAim + (finalAngle - startAim) * progress;

            if (progress < 1.0) {
                requestAnimationFrame(animateAim);
            } else {
                // Dispara a tacada
                setTimeout(() => {
                    GameCore.shoot(power, 0, 0);
                    AIBrain.isThinking = false;
                }, 300);
            }
        }

        requestAnimationFrame(animateAim);
    }
};

/* ══════════════════════════════════════════════════════════
   NÚCLEO PRINCIPAL DO JOGO (GAMECORE)
   ══════════════════════════════════════════════════════════ */
const GameCore = {
    canvas: null,
    ctx: null,
    w: 0,
    h: 0,
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    balls: [],
    state: 'AIMING', // 'AIMING', 'ROLLING', 'ENDED', 'PAUSED'
    aimAngle: 0,
    power: 0,
    maxPower: GAME_CONFIG.PHYSICS.MAX_POWER,
    spin: new Vec2(0, 0),
    isDraggingPower: false,
    isDraggingWhite: false,
    lastFrameTime: 0,
    equippedCue: CUE_CATALOG[0],
    equippedScenario: SCENARIO_CATALOG[0],

    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.setupRack();
        this.bindEvents();
    },

    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvas.width = this.w;
        this.canvas.height = this.h;

        // Escala proporcional 2:1 mantendo a mesa centralizada
        let targetRatio = (GAME_CONFIG.TABLE.WIDTH + 80) / (GAME_CONFIG.TABLE.HEIGHT + 80);
        let screenRatio = this.w / this.h;

        if (screenRatio > targetRatio) {
            this.scale = (this.h * 0.94) / (GAME_CONFIG.TABLE.HEIGHT + 80);
        } else {
            this.scale = (this.w * 0.96) / (GAME_CONFIG.TABLE.WIDTH + 80);
        }

        this.offsetX = (this.w - (GAME_CONFIG.TABLE.WIDTH * this.scale)) / 2;
        this.offsetY = (this.h - (GAME_CONFIG.TABLE.HEIGHT * this.scale)) / 2;
    },

    setupRack() {
        this.balls = [];

        // 1. Bola Branca na linha de baulk
        let whiteBall = new Ball(0, GAME_CONFIG.TABLE.BAULK_X, GAME_CONFIG.TABLE.HEIGHT / 2);
        this.balls.push(whiteBall);

        // 2. Rack Oficial em Triângulo com a Bola 8 estritamente no centro
        let startX = GAME_CONFIG.TABLE.WIDTH * 0.70;
        let startY = GAME_CONFIG.TABLE.HEIGHT / 2;
        let r = GAME_CONFIG.BALLS.RADIUS;
        let rowDist = r * Math.sqrt(3) + 0.4;

        // Ordem clássica com a 8 no centro da 3ª coluna e cantos alternados
        let rackOrder = [
            1,
            9, 2,
            10, 8, 3,
            11, 4, 12, 5,
            7, 14, 6, 13, 15
        ];

        let idx = 0;
        for (let col = 0; col < 5; col++) {
            let colX = startX + col * rowDist;
            let colStartY = startY - (col * r);

            for (let row = 0; row <= col; row++) {
                let ballY = colStartY + (row * r * 2.05);
                let ballId = rackOrder[idx++];
                this.balls.push(new Ball(ballId, colX, ballY));
            }
        }

        this.state = 'AIMING';
        this.aimAngle = 0;
        this.power = 0;
        this.spin.set(0, 0);
    },

    respawnWhiteBall() {
        let white = this.balls.find(b => b.id === 0);
        if (white) {
            white.pos = new Vec2(GAME_CONFIG.TABLE.BAULK_X, GAME_CONFIG.TABLE.HEIGHT / 2);
            white.vel.set(0, 0);
            white.active = true;
            white.falling = false;
            white.isPotted = false;
            white.scale = 1.0;
            white.opacity = 1.0;
        }
    },

    getRemainingBallsForGroup(group) {
        if (group === 0) return 7;
        return this.balls.filter(b => b.active && !b.falling && b.id !== 0 && b.id !== 8 && (b.id < 8 ? 1 : 2) === group).length;
    },

    shoot(powerAmount, spinX = 0, spinY = 0) {
        if (this.state !== 'AIMING') return;

        let white = this.balls[0];
        if (!white || !white.active) return;

        // Aplica modificador do taco equipado
        let actualPower = powerAmount * (this.equippedCue.powerMod || 1.0);
        let actualSpinMod = this.equippedCue.spinMod || 1.0;

        white.vel = new Vec2(
            Math.cos(this.aimAngle) * actualPower,
            Math.sin(this.aimAngle) * actualPower
        );

        // Aplica Spin
        white.spin.set(spinX * actualSpinMod, spinY * actualSpinMod);

        AudioEngine.playCueShot(powerAmount / this.maxPower);
        EffectsEngine.spawnChalkDust(white.pos.x, white.pos.y, this.aimAngle);
        EffectsEngine.triggerShake(actualPower * 0.35);

        this.state = 'ROLLING';
        RulesSystem.whiteInHand = false;

        // Reseta barra de força
        this.power = 0;
        document.getElementById('power-fill').style.height = '0%';
        document.getElementById('power-percent-txt').innerText = '0%';
    },

    bindEvents() {
        const getCanvasPos = (evt) => {
            let cx = evt.touches ? evt.touches[0].clientX : evt.clientX;
            let cy = evt.touches ? evt.touches[0].clientY : evt.clientY;
            return new Vec2(
                (cx - this.offsetX) / this.scale,
                (cy - this.offsetY) / this.scale
            );
        };

        // Mira com Mouse e Toque
        let isAimingDrag = false;

        this.canvas.addEventListener('mousedown', (e) => {
            if (this.state !== 'AIMING' || RulesSystem.getCurrentPlayer().isAI) return;
            let pos = getCanvasPos(e);

            // Verifica se está reposicionando a branca
            if (RulesSystem.whiteInHand) {
                let d = pos.dist(this.balls[0].pos);
                if (d < 40) {
                    this.isDraggingWhite = true;
                    return;
                }
            }

            isAimingDrag = true;
            this.updateAimAngle(pos);
        });

        window.addEventListener('mousemove', (e) => {
            let pos = getCanvasPos(e);
            if (this.isDraggingWhite) {
                // Restringe dentro dos limites do feltro
                let c = GAME_CONFIG.TABLE.CUSHION_SIZE + GAME_CONFIG.BALLS.RADIUS;
                pos.x = Math.max(c, Math.min(GAME_CONFIG.TABLE.WIDTH - c, pos.x));
                pos.y = Math.max(c, Math.min(GAME_CONFIG.TABLE.HEIGHT - c, pos.y));
                this.balls[0].pos = pos;
            } else if (isAimingDrag) {
                this.updateAimAngle(pos);
            }
        });

        window.addEventListener('mouseup', () => {
            isAimingDrag = false;
            this.isDraggingWhite = false;
        });

        // Touch equivalente
        this.canvas.addEventListener('touchstart', (e) => {
            if (this.state !== 'AIMING' || RulesSystem.getCurrentPlayer().isAI) return;
            let pos = getCanvasPos(e);
            if (RulesSystem.whiteInHand) {
                if (pos.dist(this.balls[0].pos) < 50) {
                    this.isDraggingWhite = true;
                    return;
                }
            }
            isAimingDrag = true;
            this.updateAimAngle(pos);
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            let pos = getCanvasPos(e);
            if (this.isDraggingWhite) {
                let c = GAME_CONFIG.TABLE.CUSHION_SIZE + GAME_CONFIG.BALLS.RADIUS;
                pos.x = Math.max(c, Math.min(GAME_CONFIG.TABLE.WIDTH - c, pos.x));
                pos.y = Math.max(c, Math.min(GAME_CONFIG.TABLE.HEIGHT - c, pos.y));
                this.balls[0].pos = pos;
            } else if (isAimingDrag) {
                this.updateAimAngle(pos);
            }
        }, { passive: false });

        window.addEventListener('touchend', () => {
            isAimingDrag = false;
            this.isDraggingWhite = false;
        });

        // Barra de Força Lateral
        const powerTrack = document.getElementById('power-track');
        let dragPower = (clientY) => {
            let rect = powerTrack.getBoundingClientRect();
            let p = 1.0 - (clientY - rect.top) / rect.height;
            p = Math.max(0, Math.min(1, p));
            this.power = p * this.maxPower;

            document.getElementById('power-fill').style.height = (p * 100) + '%';
            document.getElementById('power-percent-txt').innerText = Math.round(p * 100) + '%';
        };

        powerTrack.addEventListener('mousedown', (e) => {
            this.isDraggingPower = true;
            dragPower(e.clientY);
        });

        window.addEventListener('mousemove', (e) => {
            if (this.isDraggingPower) dragPower(e.clientY);
        });

        window.addEventListener('mouseup', () => {
            if (this.isDraggingPower) {
                this.isDraggingPower = false;
                if (this.power > 1.5) {
                    this.shoot(this.power, this.spin.x, this.spin.y);
                }
            }
        });

        powerTrack.addEventListener('touchstart', (e) => {
            this.isDraggingPower = true;
            dragPower(e.touches[0].clientY);
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (this.isDraggingPower) dragPower(e.touches[0].clientY);
        }, { passive: false });

        window.addEventListener('touchend', () => {
            if (this.isDraggingPower) {
                this.isDraggingPower = false;
                if (this.power > 1.5) {
                    this.shoot(this.power, this.spin.x, this.spin.y);
                }
            }
        });

        // Widget de Spin
        const spinDisc = document.getElementById('spin-ball-disc');
        const spinDot = document.getElementById('spin-target-dot');
        let isSpinDrag = false;

        let updateSpin = (clientX, clientY) => {
            let rect = spinDisc.getBoundingClientRect();
            let rx = (clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
            let ry = (clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
            let dist = Math.sqrt(rx * rx + ry * ry);
            if (dist > 0.8) {
                rx = (rx / dist) * 0.8;
                ry = (ry / dist) * 0.8;
            }
            this.spin.set(rx, -ry); // Inverte Y para cima = seguir (topspin)
            spinDot.style.left = (50 + rx * 50) + '%';
            spinDot.style.top = (50 + ry * 50) + '%';
        };

        spinDisc.addEventListener('mousedown', (e) => { isSpinDrag = true; updateSpin(e.clientX, e.clientY); });
        window.addEventListener('mousemove', (e) => { if (isSpinDrag) updateSpin(e.clientX, e.clientY); });
        window.addEventListener('mouseup', () => isSpinDrag = false);

        spinDisc.addEventListener('touchstart', (e) => { isSpinDrag = true; updateSpin(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
        window.addEventListener('touchmove', (e) => { if (isSpinDrag) updateSpin(e.touches[0].clientX, e.touches[0].clientY); }, { passive: false });
        window.addEventListener('touchend', () => isSpinDrag = false);

        // Botões de Ajuste Fino
        document.getElementById('btn-fine-left').addEventListener('click', () => {
            this.aimAngle -= 0.02;
            AudioEngine.playClick();
        });
        document.getElementById('btn-fine-right').addEventListener('click', () => {
            this.aimAngle += 0.02;
            AudioEngine.playClick();
        });

        // Teclas de Atalho no Teclado
        window.addEventListener('keydown', (e) => {
            if (this.state !== 'AIMING' || RulesSystem.getCurrentPlayer().isAI) return;
            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.aimAngle -= 0.025;
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.aimAngle += 0.025;
            } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                this.power = Math.min(this.maxPower, this.power + 2);
                this.updatePowerUI();
            } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                this.power = Math.max(0, this.power - 2);
                this.updatePowerUI();
            } else if (e.key === ' ' || e.key === 'Enter') {
                if (this.power > 1) {
                    this.shoot(this.power, this.spin.x, this.spin.y);
                } else {
                    this.shoot(22, this.spin.x, this.spin.y);
                }
            }
        });
    },

    updateAimAngle(targetPos) {
        if (!this.balls[0]) return;
        let delta = targetPos.sub(this.balls[0].pos);
        if (delta.magSq() > 10) {
            this.aimAngle = delta.heading();
        }
    },

    updatePowerUI() {
        let p = this.power / this.maxPower;
        document.getElementById('power-fill').style.height = (p * 100) + '%';
        document.getElementById('power-percent-txt').innerText = Math.round(p * 100) + '%';
    },

    loop(timestamp) {
        let dt = (timestamp - this.lastFrameTime) / 1000;
        if (dt > 0.05) dt = 0.05; // trava para evitar quedas bruscas
        this.lastFrameTime = timestamp;

        this.update(dt);
        this.draw();

        requestAnimationFrame((ts) => this.loop(ts));
    },

    update(dt) {
        EffectsEngine.update(dt);

        if (this.state === 'ROLLING') {
            PhysicsEngine.update(this.balls, dt);

            // Verifica se todas as bolas pararam completamente
            let allStopped = true;
            for (let b of this.balls) {
                if (b.active && b.vel.magSq() > 0.001) {
                    allStopped = false;
                    break;
                }
            }

            if (allStopped) {
                this.state = 'AIMING';
                RulesSystem.evaluateTurn();
            }
        }
    },

    draw() {
        this.ctx.fillStyle = '#080a0d';
        this.ctx.fillRect(0, 0, this.w, this.h);

        this.ctx.save();

        // Screen Shake
        if (EffectsEngine.shakeIntensity > 0) {
            let sx = (Math.random() - 0.5) * EffectsEngine.shakeIntensity;
            let sy = (Math.random() - 0.5) * EffectsEngine.shakeIntensity;
            this.ctx.translate(sx, sy);
        }

        // Posiciona a mesa no centro com escala uniforme
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.scale, this.scale);

        // 1. Desenha a Mesa (Madeira, Feltro, Borrachas, Caçapas e Diamantes)
        TableRenderer.draw(this.ctx, this.equippedScenario);

        // 2. Linha Guia Preditiva (Trajetória & Bola Fantasma)
        if (this.state === 'AIMING' && SaveSystem.data.settings.guide && !RulesSystem.getCurrentPlayer().isAI) {
            this.drawGuideline();
        }

        // 3. Desenha todas as Bolas
        for (let b of this.balls) {
            b.draw(this.ctx);
        }

        // 4. Indicador de Bola na Mão (se aplicável)
        if (this.state === 'AIMING' && RulesSystem.whiteInHand) {
            this.drawWhiteInHandRing();
        }

        // 5. Taco de Sinuca
        if (this.state === 'AIMING' && !this.isDraggingWhite && !RulesSystem.getCurrentPlayer().isAI) {
            this.drawCueStick();
        }

        // 6. Partículas de Efeitos
        EffectsEngine.draw(this.ctx);

        this.ctx.restore();
    },

    drawGuideline() {
        let white = this.balls[0];
        if (!white || !white.active) return;

        let dir = new Vec2(Math.cos(this.aimAngle), Math.sin(this.aimAngle));
        let maxDist = this.equippedCue.aimLen || 500;

        // Procura primeira bola atingida
        let closestHit = null;
        let closestDist = maxDist;

        for (let b of this.balls) {
            if (b.id === 0 || !b.active || b.falling) continue;

            // Raio contra esfera
            let toBall = b.pos.sub(white.pos);
            let proj = toBall.dot(dir);

            if (proj > 0 && proj < closestDist) {
                let perpDistSq = toBall.magSq() - (proj * proj);
                let touchDist = white.radius + b.radius;

                if (perpDistSq < touchDist * touchDist) {
                    let d = proj - Math.sqrt(touchDist * touchDist - perpDistSq);
                    if (d < closestDist && d > 0) {
                        closestDist = d;
                        closestHit = b;
                    }
                }
            }
        }

        let impactPos = white.pos.add(dir.mult(closestDist));

        // Linha pontilhada da bola branca até o ponto de impacto
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(white.pos.x, white.pos.y);
        this.ctx.lineTo(impactPos.x, impactPos.y);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.lineWidth = 2.5;
        this.ctx.setLineDash([6, 6]);
        this.ctx.stroke();

        // Bola Fantasma translúcida no ponto de contato
        this.ctx.setLineDash([]);
        this.ctx.beginPath();
        this.ctx.arc(impactPos.x, impactPos.y, white.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.lineWidth = 1.5;
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        this.ctx.fill();
        this.ctx.stroke();

        // Se colidir com uma bola alvo, desenha a direção de saída da bola alvo E deflexão da branca
        if (closestHit) {
            let targetNormal = closestHit.pos.sub(impactPos).normalize();
            let targetEnd = closestHit.pos.add(targetNormal.mult(90));

            // Vetor da bola alvo (Amarelo)
            this.ctx.beginPath();
            this.ctx.moveTo(closestHit.pos.x, closestHit.pos.y);
            this.ctx.lineTo(targetEnd.x, targetEnd.y);
            this.ctx.strokeStyle = 'rgba(241, 196, 15, 0.9)';
            this.ctx.lineWidth = 2.5;
            this.ctx.stroke();

            // Seta na ponta do vetor da bola alvo
            let arrowHead1 = targetEnd.add(targetNormal.rotate(Math.PI * 0.85).mult(10));
            let arrowHead2 = targetEnd.add(targetNormal.rotate(-Math.PI * 0.85).mult(10));
            this.ctx.beginPath();
            this.ctx.moveTo(targetEnd.x, targetEnd.y);
            this.ctx.lineTo(arrowHead1.x, arrowHead1.y);
            this.ctx.moveTo(targetEnd.x, targetEnd.y);
            this.ctx.lineTo(arrowHead2.x, arrowHead2.y);
            this.ctx.stroke();

            // Vetor de deflexão da bola branca (tangencial à normal)
            let tangent = new Vec2(-targetNormal.y, targetNormal.x);
            // Escolhe o sinal da tangente de acordo com a direção da tacada
            if (tangent.dot(dir) < 0) tangent = tangent.mult(-1);

            let whiteDeflectEnd = impactPos.add(tangent.mult(55)).add(dir.mult(this.spin.y * 25));
            this.ctx.beginPath();
            this.ctx.moveTo(impactPos.x, impactPos.y);
            this.ctx.lineTo(whiteDeflectEnd.x, whiteDeflectEnd.y);
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([4, 4]);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
        }

        this.ctx.restore();
    },

    drawCueStick() {
        let white = this.balls[0];
        if (!white || !white.active) return;

        let pullDist = 24 + (this.power / this.maxPower) * 75;

        this.ctx.save();
        this.ctx.translate(white.pos.x, white.pos.y);
        this.ctx.rotate(this.aimAngle + Math.PI); // Taco fica atrás da bola

        let cueLength = 320;
        let cue = this.equippedCue;

        // Corpo do Taco com gradiente do modelo equipado
        let grad = this.ctx.createLinearGradient(pullDist, 0, pullDist + cueLength, 0);
        grad.addColorStop(0, '#ffffff'); // Ponteira de giz branco
        grad.addColorStop(0.04, cue.accent || '#d2b48c');
        grad.addColorStop(0.3, cue.color || '#8b5a2b');
        grad.addColorStop(1, '#111111'); // Empunhadura preta

        // Sombra do taco no feltro
        this.ctx.beginPath();
        this.ctx.moveTo(pullDist, 6);
        this.ctx.lineTo(pullDist + cueLength, 12);
        this.ctx.lineTo(pullDist + cueLength, 16);
        this.ctx.lineTo(pullDist, 10);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        this.ctx.fill();

        // O Taco de Sinuca
        this.ctx.beginPath();
        this.ctx.moveTo(pullDist, -2.5);
        this.ctx.lineTo(pullDist + cueLength, -6);
        this.ctx.lineTo(pullDist + cueLength, 6);
        this.ctx.lineTo(pullDist, 2.5);
        this.ctx.closePath();
        this.ctx.fillStyle = grad;
        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        this.ctx.restore();
    },

    drawWhiteInHandRing() {
        let white = this.balls[0];
        if (!white) return;

        let now = performance.now();
        let pulse = (Math.sin(now * 0.008) + 1) * 0.5;

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(white.pos.x, white.pos.y, white.radius + 8 + pulse * 4, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#2ecc71';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();
        this.ctx.restore();
    },

    pause() {
        if (this.state === 'ROLLING') return;
        this.state = 'PAUSED';
        UI.showScreen('screen-pause');
    },

    resume() {
        this.state = 'AIMING';
        UI.hideAllScreens();
        document.getElementById('game-hud').style.display = 'block';
    },

    exitToMenu() {
        this.state = 'ENDED';
        UI.hideAllScreens();
        document.getElementById('game-hud').style.display = 'none';
        UI.showScreen('screen-menu');
    },

    confirmTurnPass() {
        document.getElementById('pass-turn-modal').style.display = 'none';
        UI.showNotice(`Sua vez, ${RulesSystem.getCurrentPlayer().name}!`);
    }
};

/* ══════════════════════════════════════════════════════════
   RENDERIZADOR DA MESA DE SINUCA (TABLE RENDERER)
   ══════════════════════════════════════════════════════════ */
const TableRenderer = {
    draw(ctx, scenario) {
        let w = GAME_CONFIG.TABLE.WIDTH;
        let h = GAME_CONFIG.TABLE.HEIGHT;
        let c = GAME_CONFIG.TABLE.CUSHION_SIZE;

        let woodColor = scenario.wood || '#4a2711';
        let feltColor = scenario.felt || '#0d5c30';
        let cushionColor = scenario.cushion || '#08381c';

        // 1. Moldura Externa de Madeira com chanfros metálicos
        ctx.fillStyle = woodColor;
        ctx.beginPath();
        ctx.roundRect(-24, -24, w + 48, h + 48, 16);
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // 2. Chanfros Dourados nos 4 cantos
        ctx.fillStyle = '#b8860b';
        const drawCornerCap = (cx, cy) => {
            ctx.beginPath();
            ctx.arc(cx, cy, 28, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.stroke();
        };
        drawCornerCap(0, 0);
        drawCornerCap(w, 0);
        drawCornerCap(0, h);
        drawCornerCap(w, h);

        // 3. Diamantes Guia na Madeira (Pontos de mira clássicos)
        ctx.fillStyle = '#ffffff';
        // Diamantes horizontais
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(w * 0.125 * i + 35, -12, 3, 0, Math.PI * 2);
            ctx.arc(w * 0.5 + w * 0.125 * i - 35, -12, 3, 0, Math.PI * 2);
            ctx.arc(w * 0.125 * i + 35, h + 12, 3, 0, Math.PI * 2);
            ctx.arc(w * 0.5 + w * 0.125 * i - 35, h + 12, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        // Diamantes verticais
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(-12, h * 0.25 * i, 3, 0, Math.PI * 2);
            ctx.arc(w + 12, h * 0.25 * i, 3, 0, Math.PI * 2);
            ctx.fill();
        }

        // 4. Tecido do Feltro Principal (gradiente sutil para efeito de iluminação de luminária)
        let feltGrad = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, w * 0.6);
        feltGrad.addColorStop(0, feltColor);
        feltGrad.addColorStop(1, cushionColor);

        ctx.fillStyle = feltGrad;
        ctx.fillRect(c, c, w - c * 2, h - c * 2);

        // 5. Linha de Saída (Baulk Line)
        ctx.beginPath();
        ctx.moveTo(GAME_CONFIG.TABLE.BAULK_X, c);
        ctx.lineTo(GAME_CONFIG.TABLE.BAULK_X, h - c);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // 6. As 6 Borrachas de Tabela (Cushions)
        ctx.fillStyle = cushionColor;
        for (let cush of PhysicsEngine.cushions) {
            ctx.beginPath();
            if (cush.norm.y === 1) { // Superior
                ctx.moveTo(cush.p1.x - 12, c - 14);
                ctx.lineTo(cush.p1.x, c);
                ctx.lineTo(cush.p2.x, c);
                ctx.lineTo(cush.p2.x + 12, c - 14);
            } else if (cush.norm.y === -1) { // Inferior
                ctx.moveTo(cush.p1.x - 12, h - c + 14);
                ctx.lineTo(cush.p1.x, h - c);
                ctx.lineTo(cush.p2.x, h - c);
                ctx.lineTo(cush.p2.x + 12, h - c + 14);
            } else if (cush.norm.x === 1) { // Esquerda
                ctx.moveTo(c - 14, cush.p1.y - 12);
                ctx.lineTo(c, cush.p1.y);
                ctx.lineTo(c, cush.p2.y);
                ctx.lineTo(c - 14, cush.p2.y + 12);
            } else { // Direita
                ctx.moveTo(w - c + 14, cush.p1.y - 12);
                ctx.lineTo(w - c, cush.p1.y);
                ctx.lineTo(w - c, cush.p2.y);
                ctx.lineTo(w - c + 14, cush.p2.y + 12);
            }
            ctx.closePath();
            ctx.fill();
        }

        // 7. As 6 Caçapas (Bolsões Pretos com anel metálico)
        for (let p of PhysicsEngine.pockets) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = '#05070a';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
};

/* ══════════════════════════════════════════════════════════
   CANVAS DE FUNDO DO MENU (BAR BRASILEIRO COM LUZ PENDENTE)
   ══════════════════════════════════════════════════════════ */
const MenuBackground = {
    canvas: null,
    ctx: null,
    w: 0,
    h: 0,
    lampAngle: 0,
    motes: [],
    ambientBalls: [],

    init() {
        this.canvas = document.getElementById('menu-bg-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Partículas flutuantes de poeira dourada
        for (let i = 0; i < 40; i++) {
            this.motes.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                vx: (Math.random() - 0.5) * 8,
                vy: -5 - Math.random() * 15,
                size: 1 + Math.random() * 2.5,
                alpha: Math.random() * 0.7
            });
        }

        // Bolas decorativas rolando devagar no fundo
        for (let i = 0; i < 5; i++) {
            this.ambientBalls.push({
                x: Math.random() * this.w,
                y: Math.random() * this.h,
                vx: (Math.random() - 0.5) * 20,
                vy: (Math.random() - 0.5) * 20,
                color: BALL_PALETTE[i + 1].color,
                r: 16
            });
        }

        this.loop();
    },

    resize() {
        this.w = window.innerWidth;
        this.h = window.innerHeight;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
    },

    loop() {
        let now = performance.now() * 0.001;
        this.lampAngle = Math.sin(now * 0.8) * 0.08;

        this.ctx.fillStyle = '#080a0d';
        this.ctx.fillRect(0, 0, this.w, this.h);

        // Parede de tijolos/azulejos ao fundo
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        this.ctx.lineWidth = 1;
        for (let y = 0; y < this.h; y += 30) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.w, y);
            this.ctx.stroke();
        }

        // Letreiros Neon no fundo
        this.ctx.save();
        let flicker = Math.random() > 0.04 ? 1.0 : 0.4;
        this.ctx.font = '900 24px sans-serif';
        this.ctx.textAlign = 'left';
        
        // Neon 1: "BAR DO ZÉ" (Ciano Neon)
        this.ctx.shadowColor = '#00ffff';
        this.ctx.shadowBlur = 18 * flicker;
        this.ctx.fillStyle = `rgba(0, 255, 255, ${0.85 * flicker})`;
        this.ctx.fillText('🍻 BAR & BILHAR DO ZÉ', 40, 60);

        // Neon 2: "SINUCA OFICIAL" (Rosa Neon)
        this.ctx.shadowColor = '#ff007f';
        this.ctx.shadowBlur = 15 * flicker;
        this.ctx.fillStyle = `rgba(255, 0, 127, ${0.8 * flicker})`;
        this.ctx.font = '800 16px sans-serif';
        this.ctx.fillText('MESAS PROFISSIONAIS • 8 BALL', 40, 85);
        this.ctx.restore();

        // Luz da luminária pendente (cone de luz quente)
        let lampX = this.w * 0.5 + Math.sin(this.lampAngle) * 60;
        let lampY = 60;

        let coneGrad = this.ctx.createRadialGradient(lampX, lampY, 30, lampX, lampY + 350, 480);
        coneGrad.addColorStop(0, 'rgba(255, 215, 0, 0.28)');
        coneGrad.addColorStop(0.5, 'rgba(255, 180, 0, 0.08)');
        coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = coneGrad;
        this.ctx.beginPath();
        this.ctx.moveTo(lampX, lampY);
        this.ctx.lineTo(lampX - 350, this.h);
        this.ctx.lineTo(lampX + 350, this.h);
        this.ctx.closePath();
        this.ctx.fill();

        // Fio e cúpula da luminária
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(this.w * 0.5, 0);
        this.ctx.lineTo(lampX, lampY);
        this.ctx.stroke();

        this.ctx.fillStyle = '#111';
        this.ctx.beginPath();
        this.ctx.arc(lampX, lampY, 26, Math.PI, 0);
        this.ctx.fill();

        // Bolas decorativas em movimento lento
        for (let b of this.ambientBalls) {
            b.x += b.vx * 0.016;
            b.y += b.vy * 0.016;
            if (b.x < 0 || b.x > this.w) b.vx *= -1;
            if (b.y < 0 || b.y > this.h) b.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            this.ctx.fillStyle = b.color;
            this.ctx.globalAlpha = 0.25;
            this.ctx.fill();
            this.ctx.globalAlpha = 1.0;
        }

        // Poeira dourada flutuante
        this.ctx.fillStyle = '#ffd700';
        for (let m of this.motes) {
            m.x += m.vx * 0.016;
            m.y += m.vy * 0.016;
            if (m.y < 0) m.y = this.h;
            if (m.x < 0) m.x = this.w;
            if (m.x > this.w) m.x = 0;

            this.ctx.globalAlpha = m.alpha;
            this.ctx.beginPath();
            this.ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1.0;

        requestAnimationFrame(() => this.loop());
    }
};

/* ══════════════════════════════════════════════════════════
   CANVAS DE CONFETES & FOGOS (VITÓRIA)
   ══════════════════════════════════════════════════════════ */
const ConfettiEngine = {
    canvas: null,
    ctx: null,
    particles: [],
    active: false,

    init() {
        this.canvas = document.getElementById('confetti-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    start() {
        this.init();
        this.canvas.style.display = 'block';
        this.particles = [];
        this.active = true;

        const colors = ['#ffd700', '#2ecc71', '#e74c3c', '#007aff', '#9b59b6', '#ffffff'];
        for (let i = 0; i < 150; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -10 - Math.random() * 300,
                vx: (Math.random() - 0.5) * 80,
                vy: 80 + Math.random() * 200,
                rot: Math.random() * Math.PI,
                vrot: (Math.random() - 0.5) * 8,
                size: 6 + Math.random() * 6,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        this.loop();
    },

    loop() {
        if (!this.active) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let dt = 0.016;
        let alive = false;

        for (let p of this.particles) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.rot += p.vrot * dt;

            if (p.y < this.canvas.height + 50) {
                alive = true;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rot);
                this.ctx.fillStyle = p.color;
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
                this.ctx.restore();
            }
        }

        if (alive) {
            requestAnimationFrame(() => this.loop());
        } else {
            this.active = false;
            this.canvas.style.display = 'none';
        }
    }
};

/* ══════════════════════════════════════════════════════════
   SISTEMA DE CONFIGURAÇÃO DE PARTIDA (MATCH SETUP)
   ══════════════════════════════════════════════════════════ */
const MatchSetup = {
    selectedMode: 1,
    aiDifficulty: 2,

    open(mode) {
        this.selectedMode = mode;
        AudioEngine.playClick();

        let titleMap = {
            1: '1 vs 1 vs COMPUTADOR (IA)',
            2: '1 vs 1 MULTIPLAYER LOCAL',
            3: '2 vs 2 COM PARCEIRO IA',
            4: '2 vs 2 COOPERATIVO LOCAL',
            5: '2 vs 2 QUATRO JOGADORES LOCAIS'
        };
        document.getElementById('setup-modal-title').innerText = titleMap[mode] || 'CONFIGURAR PARTIDA';

        let playersContainer = document.getElementById('setup-players-container');
        let aiGroup = document.getElementById('setup-ai-group');

        // Exibe ou oculta seletor de IA
        aiGroup.style.display = (mode === 2 || mode === 5) ? 'none' : 'flex';

        let html = '';
        if (mode === 1) {
            html = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Seu Nome</label>
                        <input type="text" class="form-input" id="cfg-p1-name" value="${SaveSystem.data.playerName}">
                    </div>
                    <div class="form-group">
                        <label>Nome do Robô</label>
                        <input type="text" class="form-input" id="cfg-p2-name" value="Robô Tubarão" disabled>
                    </div>
                </div>
            `;
        } else if (mode === 2) {
            html = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Jogador 1</label>
                        <input type="text" class="form-input" id="cfg-p1-name" value="Jogador 1">
                    </div>
                    <div class="form-group">
                        <label>Jogador 2</label>
                        <input type="text" class="form-input" id="cfg-p2-name" value="Jogador 2">
                    </div>
                </div>
            `;
        } else if (mode === 3) {
            html = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Você (Equipe 1)</label>
                        <input type="text" class="form-input" id="cfg-p1-name" value="${SaveSystem.data.playerName}">
                    </div>
                    <div class="form-group">
                        <label>Parceiro IA (Equipe 1)</label>
                        <input type="text" class="form-input" id="cfg-p3-name" value="Parceiro Robô" disabled>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Adversário IA 1 (Equipe 2)</label>
                        <input type="text" class="form-input" id="cfg-p2-name" value="Rival IA 1" disabled>
                    </div>
                    <div class="form-group">
                        <label>Adversário IA 2 (Equipe 2)</label>
                        <input type="text" class="form-input" id="cfg-p4-name" value="Rival IA 2" disabled>
                    </div>
                </div>
            `;
        } else if (mode === 4) {
            html = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Jogador 1 (Equipe 1)</label>
                        <input type="text" class="form-input" id="cfg-p1-name" value="Humano 1">
                    </div>
                    <div class="form-group">
                        <label>Jogador 2 (Equipe 1)</label>
                        <input type="text" class="form-input" id="cfg-p3-name" value="Humano 2">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Robô 1 (Equipe 2)</label>
                        <input type="text" class="form-input" id="cfg-p2-name" value="Robô Alpha" disabled>
                    </div>
                    <div class="form-group">
                        <label>Robô 2 (Equipe 2)</label>
                        <input type="text" class="form-input" id="cfg-p4-name" value="Robô Beta" disabled>
                    </div>
                </div>
            `;
        } else if (mode === 5) {
            html = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Equipe 1 - Jogador A</label>
                        <input type="text" class="form-input" id="cfg-p1-name" value="Jogador 1">
                    </div>
                    <div class="form-group">
                        <label>Equipe 1 - Jogador B</label>
                        <input type="text" class="form-input" id="cfg-p3-name" value="Jogador 3">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Equipe 2 - Jogador A</label>
                        <input type="text" class="form-input" id="cfg-p2-name" value="Jogador 2">
                    </div>
                    <div class="form-group">
                        <label>Equipe 2 - Jogador B</label>
                        <input type="text" class="form-input" id="cfg-p4-name" value="Jogador 4">
                    </div>
                </div>
            `;
        }

        playersContainer.innerHTML = html;
        UI.showScreen('screen-setup');
    },

    startMatch() {
        AudioEngine.playClick();
        this.aiDifficulty = parseInt(document.getElementById('setup-ai-diff').value) || 2;
        let scenId = document.getElementById('setup-scenario').value;
        let foundScen = SCENARIO_CATALOG.find(s => s.id === scenId) || SCENARIO_CATALOG[0];
        GameCore.equippedScenario = foundScen;

        let cue = CUE_CATALOG.find(c => c.id === SaveSystem.data.equippedCue) || CUE_CATALOG[0];
        GameCore.equippedCue = cue;

        let p1Name = document.getElementById('cfg-p1-name') ? document.getElementById('cfg-p1-name').value : "Jogador 1";
        let p2Name = document.getElementById('cfg-p2-name') ? document.getElementById('cfg-p2-name').value : "Computador";

        let players = [];
        if (this.selectedMode === 1) {
            players = [
                { name: p1Name || "Jogador 1", isAI: false },
                { name: p2Name || "Robô Tubarão", isAI: true }
            ];
        } else if (this.selectedMode === 2) {
            players = [
                { name: p1Name || "Jogador 1", isAI: false },
                { name: p2Name || "Jogador 2", isAI: false }
            ];
        } else if (this.selectedMode === 3) {
            players = [
                { name: p1Name || "Você", isAI: false },
                { name: document.getElementById('cfg-p2-name').value, isAI: true },
                { name: document.getElementById('cfg-p3-name').value, isAI: true },
                { name: document.getElementById('cfg-p4-name').value, isAI: true }
            ];
        } else if (this.selectedMode === 4) {
            players = [
                { name: p1Name || "Humano 1", isAI: false },
                { name: document.getElementById('cfg-p2-name').value, isAI: true },
                { name: document.getElementById('cfg-p3-name').value || "Humano 2", isAI: false },
                { name: document.getElementById('cfg-p4-name').value, isAI: true }
            ];
        } else if (this.selectedMode === 5) {
            players = [
                { name: p1Name || "Jogador 1", isAI: false },
                { name: p2Name || "Jogador 2", isAI: false },
                { name: document.getElementById('cfg-p3-name').value || "Jogador 3", isAI: false },
                { name: document.getElementById('cfg-p4-name').value || "Jogador 4", isAI: false }
            ];
        }

        UI.hideAllScreens();
        document.getElementById('game-hud').style.display = 'block';

        GameCore.setupRack();
        RulesSystem.init(this.selectedMode, players);
        UI.showNotice(`INÍCIO DA PARTIDA: Vez de ${players[0].name}!`);
    },

    restartMatch() {
        this.startMatch();
    }
};

/* ══════════════════════════════════════════════════════════
   SISTEMA DA LOJA (SHOPPING & EQUIPAMENTOS)
   ══════════════════════════════════════════════════════════ */
const ShopSystem = {
    currentTab: 'cues',

    switchTab(tab) {
        this.currentTab = tab;
        document.getElementById('tab-cues-btn').className = `shop-tab-btn ${tab === 'cues' ? 'active' : ''}`;
        document.getElementById('tab-scen-btn').className = `shop-tab-btn ${tab === 'scenarios' ? 'active' : ''}`;
        this.render();
    },

    render() {
        let container = document.getElementById('shop-items-container');
        document.getElementById('shop-coins-display').innerText = SaveSystem.data.coins.toLocaleString('pt-BR');

        let items = this.currentTab === 'cues' ? CUE_CATALOG : SCENARIO_CATALOG;
        let html = '';

        items.forEach(item => {
            let isOwned = this.currentTab === 'cues' 
                ? SaveSystem.data.ownedCues.includes(item.id) 
                : SaveSystem.data.ownedScenarios.includes(item.id);

            let isEquipped = this.currentTab === 'cues'
                ? SaveSystem.data.equippedCue === item.id
                : SaveSystem.data.equippedScenario === item.id;

            let btnText = '';
            let btnClass = '';
            let btnAction = '';

            if (isEquipped) {
                btnText = 'EQUIPADO';
                btnClass = 'btn-gold';
                btnAction = '';
            } else if (isOwned) {
                btnText = 'EQUIPAR';
                btnClass = 'btn-secondary';
                btnAction = `ShopSystem.equip('${item.id}')`;
            } else {
                btnText = `COMPRAR (${item.price} $)`;
                btnClass = 'btn-green';
                btnAction = `ShopSystem.buy('${item.id}', ${item.price})`;
            }

            let previewHtml = '';
            if (this.currentTab === 'cues') {
                previewHtml = `
                    <div style="width: 85%; height: 8px; border-radius: 4px; background: linear-gradient(90deg, ${item.accent}, ${item.color}); box-shadow: 0 0 10px rgba(0,0,0,0.8);"></div>
                `;
            } else {
                previewHtml = `
                    <div style="width: 70px; height: 35px; border-radius: 6px; background: ${item.felt}; border: 3px solid ${item.wood};"></div>
                `;
            }

            html += `
                <div class="shop-card ${isEquipped ? 'equipped' : ''}">
                    <div class="shop-item-preview">${previewHtml}</div>
                    <div class="shop-item-name">${item.name}</div>
                    ${item.rarity ? `<div class="shop-rarity-badge rarity-${item.rarity}">${item.rarity}</div>` : ''}
                    <button class="btn ${btnClass}" style="width: 100%; min-height: 38px; font-size: 13px; padding: 6px;" onclick="${btnAction}">${btnText}</button>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    buy(id, price) {
        if (SaveSystem.data.coins >= price) {
            SaveSystem.data.coins -= price;
            if (this.currentTab === 'cues') {
                SaveSystem.data.ownedCues.push(id);
                SaveSystem.data.equippedCue = id;
            } else {
                SaveSystem.data.ownedScenarios.push(id);
                SaveSystem.data.equippedScenario = id;
            }
            SaveSystem.save();
            AudioEngine.playWin();
            UI.updateTopBar();
            this.render();
            UI.showNotice("ITEM ADQUIRIDO COM SUCESSO!");
        } else {
            AudioEngine.playFoul();
            alert("Fichas insuficientes! Jogue partidas ou colete o bônus diário para ganhar mais fichas.");
        }
    },

    equip(id) {
        if (this.currentTab === 'cues') {
            SaveSystem.data.equippedCue = id;
            let cue = CUE_CATALOG.find(c => c.id === id);
            if (cue) GameCore.equippedCue = cue;
        } else {
            SaveSystem.data.equippedScenario = id;
            let scen = SCENARIO_CATALOG.find(s => s.id === id);
            if (scen) GameCore.equippedScenario = scen;
        }
        SaveSystem.save();
        AudioEngine.playClick();
        this.render();
    }
};

/* ══════════════════════════════════════════════════════════
   RECOMPENSA DIÁRIA (DAILY REWARD)
   ══════════════════════════════════════════════════════════ */
const DailyReward = {
    open() {
        let now = Date.now();
        let oneDay = 24 * 60 * 60 * 1000;
        let timePassed = now - SaveSystem.data.lastDailyClaim;

        if (timePassed > oneDay || SaveSystem.data.lastDailyClaim === 0) {
            let reward = 250;
            SaveSystem.addCoins(reward);
            SaveSystem.data.lastDailyClaim = now;
            SaveSystem.save();
            AudioEngine.playWin();
            alert(`🎉 PARABÉNS! Você coletou seu Bônus Diário de +${reward} Fichas Douradas!`);
        } else {
            let hoursLeft = Math.ceil((oneDay - timePassed) / (1000 * 60 * 60));
            alert(`⏳ Bônus já coletado hoje! Volte em aproximadamente ${hoursLeft} hora(s) para o próximo presente.`);
        }
    }
};

/* ══════════════════════════════════════════════════════════
   INTERFACE DO USUÁRIO & HUD CONTROLLER
   ══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════
   SISTEMA DE PERFIL DO JOGADOR
   ══════════════════════════════════════════════════════════ */
const ProfileSystem = {
    avatar: '👑',
    selectAvatar(icon) {
        this.avatar = icon;
        document.getElementById('player-avatar-icon').innerText = icon;
        document.getElementById('profile-avatar-large').innerText = icon;
        SaveSystem.data.avatar = icon;
        SaveSystem.save();
        AudioEngine.playClick();
    },
    saveName() {
        let val = document.getElementById('profile-name-input').value.trim();
        if (val) {
            SaveSystem.data.playerName = val;
            SaveSystem.save();
            UI.updateTopBar();
            UI.showNotice("NOME ATUALIZADO!");
            AudioEngine.playClick();
        }
    },
    updateUI() {
        document.getElementById('profile-name-input').value = SaveSystem.data.playerName;
        document.getElementById('profile-stat-level').innerText = SaveSystem.data.level;
        document.getElementById('profile-stat-coins').innerText = SaveSystem.data.coins.toLocaleString('pt-BR');
        let cue = CUE_CATALOG.find(c => c.id === SaveSystem.data.equippedCue);
        document.getElementById('profile-stat-cue').innerText = cue ? cue.name : 'Madeira Tradicional';
        document.getElementById('profile-stat-achievements').innerText = `${SaveSystem.data.achievements.length} / ${ACHIEVEMENTS_DATA.length}`;
        let icon = SaveSystem.data.avatar || '👑';
        document.getElementById('player-avatar-icon').innerText = icon;
        document.getElementById('profile-avatar-large').innerText = icon;
    }
};

const UI = {
    screens: document.querySelectorAll('.screen'),

    showScreen(id) {
        this.screens.forEach(s => s.classList.remove('active'));
        let target = document.getElementById(id);
        if (target) {
            target.classList.add('active');
            if (id === 'screen-shop') ShopSystem.render();
            if (id === 'screen-achievements') this.renderAchievements();
            if (id === 'screen-profile') ProfileSystem.updateUI();
        }
        AudioEngine.playClick();
    },

    hideAllScreens() {
        this.screens.forEach(s => s.classList.remove('active'));
    },

    updateTopBar() {
        document.getElementById('player-name-display').innerText = SaveSystem.data.playerName;
        document.getElementById('player-level-badge').innerText = SaveSystem.data.level;
        document.getElementById('player-coins-display').innerText = SaveSystem.data.coins.toLocaleString('pt-BR');

        let neededXP = SaveSystem.data.level * 250;
        let pct = Math.min(100, (SaveSystem.data.xp / neededXP) * 100);
        document.getElementById('player-xp-fill').style.width = pct + '%';
    },

    showNotice(text) {
        let banner = document.getElementById('notice-banner');
        banner.innerText = text;
        banner.classList.add('show');
        clearTimeout(this._noticeTimer);
        this._noticeTimer = setTimeout(() => {
            banner.classList.remove('show');
        }, 2400);
    },

    showPassTurnModal(playerName) {
        document.getElementById('pass-turn-player-name').innerText = `Vez de: ${playerName}`;
        document.getElementById('pass-turn-modal').style.display = 'flex';
    },

    updateHUD() {
        if (!RulesSystem.players || RulesSystem.players.length < 2) return;

        let p1 = RulesSystem.players[0];
        let p2 = RulesSystem.players[1];

        // Atualiza nomes
        document.getElementById('hud-name-p1').innerText = p1.name;
        document.getElementById('hud-name-p2').innerText = p2.name;

        // Destaque da vez
        let curTeam = RulesSystem.getCurrentTeamIndex();
        document.getElementById('hud-card-p1').className = `hud-player-card ${curTeam === 0 ? 'active-turn' : ''}`;
        document.getElementById('hud-card-p2').className = `hud-player-card ${curTeam === 1 ? 'active-turn' : ''}`;

        // Grupos
        let g1 = RulesSystem.team1Group;
        let g2 = RulesSystem.team2Group;

        let getGroupBadge = (g) => {
            if (g === 0) return { txt: 'Mesa Aberta', cls: 'group-open' };
            if (g === 1) return { txt: 'Lisas (1-7)', cls: 'group-solids' };
            return { txt: 'Listradas (9-15)', cls: 'group-stripes' };
        };

        let b1 = getGroupBadge(g1);
        let b2 = getGroupBadge(g2);

        let elG1 = document.getElementById('hud-group-p1');
        elG1.innerText = b1.txt;
        elG1.className = `hud-group-badge ${b1.cls}`;

        let elG2 = document.getElementById('hud-group-p2');
        elG2.innerText = b2.txt;
        elG2.className = `hud-group-badge ${b2.cls}`;

        // Mini bolas restantes
        const renderRack = (containerId, group) => {
            let container = document.getElementById(containerId);
            if (group === 0) {
                container.innerHTML = '';
                return;
            }
            let startId = group === 1 ? 1 : 9;
            let html = '';
            for (let id = startId; id < startId + 7; id++) {
                let ball = GameCore.balls.find(b => b.id === id);
                let isPotted = !ball || !ball.active || ball.isPotted;
                let color = BALL_PALETTE[id].color;
                html += `<div class="mini-rack-ball ${isPotted ? 'potted' : ''}" style="background: ${color};"></div>`;
            }
            container.innerHTML = html;
        };

        renderRack('hud-rack-p1', g1);
        renderRack('hud-rack-p2', g2);
    },

    renderAchievements() {
        let container = document.getElementById('achievements-list-container');
        let html = '';
        ACHIEVEMENTS_DATA.forEach(ach => {
            let isUnlocked = SaveSystem.data.achievements.includes(ach.id);
            html += `
                <div class="glass-card" style="display: flex; align-items: center; justify-content: space-between; padding: 14px; opacity: ${isUnlocked ? 1 : 0.6};">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <span style="font-size: 32px;">${ach.icon}</span>
                        <div>
                            <div style="font-weight: 800; font-size: 15px; color: ${isUnlocked ? 'var(--gold)' : '#fff'};">${ach.title}</div>
                            <div style="font-size: 12px; color: var(--text-muted);">${ach.desc}</div>
                        </div>
                    </div>
                    <div style="font-weight: 800; color: ${isUnlocked ? '#2ecc71' : 'var(--gold)'}; font-size: 14px;">
                        ${isUnlocked ? '✓ CONQUISTADO' : `+${ach.reward} $`}
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    },

    saveSettings() {
        SaveSystem.data.settings.sound = document.getElementById('conf-chk-sound').checked;
        SaveSystem.data.settings.guide = document.getElementById('conf-chk-guide').checked;
        SaveSystem.data.settings.particles = document.getElementById('conf-chk-particles').checked;
        SaveSystem.data.settings.shake = document.getElementById('conf-chk-shake').checked;
        SaveSystem.save();
        AudioEngine.setSound(SaveSystem.data.settings.sound);
        this.showScreen('screen-menu');
    }
};

/* ══════════════════════════════════════════════════════════
   INICIALIZAÇÃO DO JOGO
   ══════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
    SaveSystem.load();
    UI.updateTopBar();

    // Inicia motores
    MenuBackground.init();
    GameCore.init();

    // Ativa áudio no primeiro toque do usuário
    const unlockAudio = () => {
        AudioEngine.init();
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    // Inicia Loop do Jogo
    requestAnimationFrame((ts) => GameCore.loop(ts));
});