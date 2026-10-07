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
        STOP_SPEED: 10.0       // Velocidade abaixo da qual a bola para totalmente
    },
    PHYSICS: {
        SUB_STEPS: 10,         // Sub-passos de integração para impedir atravessamento
        MAX_POWER: 100,        // Escala percentual de força (0 a 100%)
        MAX_SPEED: 2600,       // Velocidade física máxima de tacada (px/s a 100%)
        POWER_EXPONENT: 1.6,   // Curva da força: >1 dá mais precisão nas tacadas leves
        MIN_SHOT_PERCENT: 3,   // Abaixo disso a tacada é cancelada (clique acidental)
        MAX_STEP_MOVE: 6       // Máx. de px que uma bola anda por sub-passo (evita atravessar bolas/tabelas)
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

/* ══════════════════════════════════════════════════════════
   MESA FIXA + FUNDOS (CENÁRIOS) — a mesa NUNCA muda; só o ambiente atrás dela
   ══════════════════════════════════════════════════════════ */
const TABLE_THEME = { felt: '#0d5c30', wood: '#4a2711', cushion: '#08381c' };
const DEFAULT_BG = 'bg_padrao';
const TAU = Math.PI * 2;
const rng = s => () => (s = (s * 16807) % 2147483647) / 2147483647; // aleatório determinístico

// Letreiro pintado à mão
function bgSign(c, txt, x, y, rot, bg, fg, sz) {
    c.save(); c.translate(x, y); c.rotate(rot); c.font = `900 ${sz}px Impact, sans-serif`;
    const tw = c.measureText(txt).width + sz;
    c.fillStyle = bg; c.fillRect(-tw / 2, -sz * .7, tw, sz * 1.4);
    c.strokeStyle = fg; c.lineWidth = 2; c.strokeRect(-tw / 2 + 3, -sz * .7 + 3, tw - 6, sz * 1.4 - 6);
    c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(txt, 0, 1); c.restore();
}

/* ── Fundo 0: padrão gratuito (visual original do jogo) ── */
function bgPadraoEst(c, w, h) { c.fillStyle = '#080a0d'; c.fillRect(0, 0, w, h); }

/* ── Helpers visuais compartilhados pelos cenários ── */
function glow(c, x, y, r, rgb, a) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }
function speckle(c, w, h, seed, n, col) { const r = rng(seed); c.fillStyle = col; for (let i = 0; i < n; i++) c.fillRect(r() * w, r() * h, 1 + r() * 1.5, 1 + r() * 1.5); }
function vignette(c, w, h, a) { const g = c.createRadialGradient(w / 2, h / 2, h * .35, w / 2, h / 2, w * .7); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); c.fillStyle = g; c.fillRect(0, 0, w, h); }
function vgrad(c, y0, y1, stops) { const g = c.createLinearGradient(0, y0, 0, y1); stops.forEach(s => g.addColorStop(s[0], s[1])); return g; }
// Palmeira com folhas animadas (usada na mansão e na chácara)
function palm(c, x, y, size, t, n, trunk, leaf) {
    c.strokeStyle = trunk; c.lineWidth = size * .09; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y + size * 1.1); c.quadraticCurveTo(x + size * .12, y + size * .5, x, y); c.stroke();
    for (let k = 0; k < 9; k++) {
        const a = -Math.PI / 2 + (k - 4) * .46 + Math.sin(t * 1.3 + n + k * .7) * .06, ex = x + Math.cos(a) * size * .55, ey = y + Math.sin(a) * size * .4 + size * .22;
        c.strokeStyle = leaf; c.lineWidth = size * .06; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a) * size * .3, y + Math.sin(a) * size * .4 - size * .1, ex, ey); c.stroke();
        c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + Math.cos(a) * size * .3, y + Math.sin(a) * size * .4 - size * .1 - 2, ex, ey); c.stroke();
    }
    c.lineCap = 'butt';
}

/* ── Fundo 1: Bar Brasileira Tradicional ── */
function bgBarEst(c, w, h) {
    c.fillStyle = vgrad(c, 0, h * .64, [[0, '#9b6f28'], [.5, '#d4ab58'], [1, '#ecce8a']]); c.fillRect(0, 0, w, h);
    speckle(c, w, h * .64, 3, w * h / 700, 'rgba(90,50,10,.13)');
    c.fillStyle = vgrad(c, 0, h * .06, [[0, '#2e180a'], [1, '#5a3418']]); c.fillRect(0, 0, w, h * .055); // viga do teto
    c.fillStyle = 'rgba(255,255,255,.08)'; c.fillRect(0, h * .055, w, 2);
    const s = h * .06, y0 = h * .64; // azulejo hidráulico com rejunte e detalhes
    for (let j = 0, y = y0; y < h; y += s, j++) for (let i = 0, x = 0; x < w; x += s, i++) {
        c.fillStyle = '#f6f3e8'; c.fillRect(x, y, s, s); c.strokeStyle = '#cdc7b0'; c.lineWidth = 1; c.strokeRect(x + .5, y + .5, s - 1, s - 1);
        if ((i + j) % 2 === 0) {
            c.fillStyle = '#1f8a4c'; c.beginPath(); c.moveTo(x + s / 2, y + s * .1); c.lineTo(x + s * .9, y + s / 2); c.lineTo(x + s / 2, y + s * .9); c.lineTo(x + s * .1, y + s / 2); c.fill();
            c.fillStyle = '#f6f3e8'; c.beginPath(); c.arc(x + s / 2, y + s / 2, s * .17, 0, TAU); c.fill(); c.fillStyle = '#e6b422'; c.beginPath(); c.arc(x + s / 2, y + s / 2, s * .07, 0, TAU); c.fill();
        } else { c.fillStyle = 'rgba(31,138,76,.35)'; for (let k = 0; k < 4; k++) { c.beginPath(); c.arc(x + s * (k % 2 ? .78 : .22), y + s * (k < 2 ? .22 : .78), s * .06, 0, TAU); c.fill(); } }
    }
    c.fillStyle = vgrad(c, y0 - 4, y0 + 8, [[0, '#2d6a45'], [1, '#143d27']]); c.fillRect(0, y0 - 4, w, 12); c.fillStyle = 'rgba(255,255,255,.3)'; c.fillRect(0, y0 - 4, w, 2);
    const cols = ['#2e7d32', '#f9a825', '#c62828', '#6d4c41', '#1565c0', '#ef6c00'], r = rng(7); // prateleiras com garrafas rotuladas
    [h * .3, h * .45].forEach((sy, row) => {
        c.fillStyle = '#6b3d1a'; c.fillRect(w * .06, sy, w * .88, h * .018); c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(w * .06, sy + h * .018, w * .88, 5);
        for (let i = 0; i < 30; i++) {
            const x = w * .07 + i * w * .86 / 30, bh = h * .05 + r() * h * .045, bw = w * .0105, col = cols[(i + row * 2) % 6];
            c.fillStyle = col; c.fillRect(x, sy - bh, bw, bh); c.fillRect(x + bw * .28, sy - bh - h * .022, bw * .44, h * .022);
            c.fillStyle = '#f3ecd0'; c.fillRect(x, sy - bh * .6, bw, bh * .22); c.fillStyle = 'rgba(255,255,255,.4)'; c.fillRect(x + bw * .12, sy - bh * .95, bw * .18, bh * .85);
            c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(x + bw * .8, sy - bh, bw * .2, bh);
        }
    });
    c.fillStyle = vgrad(c, h * .575, h * .65, [[0, '#7a4521'], [1, '#3e2010']]); c.fillRect(0, h * .575, w, h * .075); // balcão com veios
    c.strokeStyle = 'rgba(0,0,0,.2)'; for (let i = 0; i < 12; i++) { c.beginPath(); c.moveTo(0, h * (.585 + i * .005)); c.lineTo(w, h * (.585 + i * .005)); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(0, h * .575, w, 2);
    for (let i = 0; i < 9; i++) { const x = w * (.05 + i * .115); c.fillStyle = '#9aa0a6'; c.fillRect(x - 2, h * .7, 4, h * .11); c.fillRect(x - w * .015, h * .8, w * .03, 3); c.fillStyle = vgrad(c, h * .69, h * .71, [[0, '#e0342f'], [1, '#8a1511']]); c.beginPath(); c.ellipse(x, h * .7, w * .02, h * .016, 0, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillRect(x - w * .012, h * .694, w * .01, 2); }
    // quadros: bandeira do Brasil e flâmula
    c.fillStyle = '#5a3418'; c.fillRect(w * .66 - 3, h * .08 - 3, w * .09 + 6, h * .1 + 6); c.fillStyle = '#009b3a'; c.fillRect(w * .66, h * .08, w * .09, h * .1);
    c.fillStyle = '#ffdf00'; c.beginPath(); c.moveTo(w * .705, h * .09); c.lineTo(w * .74, h * .13); c.lineTo(w * .705, h * .17); c.lineTo(w * .67, h * .13); c.fill(); c.fillStyle = '#002776'; c.beginPath(); c.arc(w * .705, h * .13, h * .028, 0, TAU); c.fill();
    c.fillStyle = '#26323a'; c.fillRect(w * .08, h * .09, w * .12, h * .12); c.strokeStyle = '#8d6e63'; c.lineWidth = 4; c.strokeRect(w * .08, h * .09, w * .12, h * .12); // lousa
    c.fillStyle = '#e8e8e8'; c.font = `700 ${h * .022}px Georgia, serif`; c.fillText('PASTEL  R$8', w * .09, h * .13); c.fillText('CALDO   R$12', w * .09, h * .16); c.fillText('COXINHA R$6', w * .09, h * .19);
    bgSign(c, 'CERVEJA GELADA', w * .3, h * .2, -.04, '#c62828', '#fff59d', h * .04);
    bgSign(c, 'PASTEL', w * .83, h * .24, .05, '#1565c0', '#ffffff', h * .045);
    bgSign(c, 'BAR DO ZÉ', w * .5, h * .13, 0, '#2e7d32', '#ffeb3b', h * .05);
    glow(c, w * .5, h * .3, h * .5, '255,190,90', .18); vignette(c, w, h, .65);
}
function bgBarAni(c, w, h, t) {
    const fl = ['#2e7d32', '#fdd835', '#1565c0', '#e53935'];
    for (let row = 0; row < 2; row++) { const y0 = h * (.02 + row * .03); c.strokeStyle = '#ddd'; c.lineWidth = 1; c.beginPath(); for (let i = 0; i <= 30; i++) { const x = i * w / 30, y = y0 + Math.sin(i / 30 * Math.PI) * h * .03; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
        for (let i = 0; i < 18; i++) { const x = i * w / 17, sag = Math.sin(i / 17 * Math.PI) * h * .03, sw = Math.sin(t * 2 + i + row) * 3; c.fillStyle = fl[(i + row) % 4]; c.beginPath(); c.moveTo(x - 8, y0 + sag); c.lineTo(x + 8, y0 + sag); c.lineTo(x + sw, y0 + sag + h * .04); c.fill(); } }
    [.2, .5, .8].forEach((k, n) => {
        const x = w * k + Math.sin(t * .9 + n) * 6, y = h * .25, f = .8 + .2 * Math.sin(t * 11 + n * 3) * Math.sin(t * 2.3 + n);
        c.strokeStyle = '#222'; c.lineWidth = 2; c.beginPath(); c.moveTo(w * k, 0); c.lineTo(x, y - 8); c.stroke();
        c.fillStyle = '#2b2b2b'; c.beginPath(); c.arc(x, y - 6, 12, Math.PI, 0); c.fill();
        c.fillStyle = 'rgba(255,200,90,.07)'; c.beginPath(); c.moveTo(x - 10, y - 4); c.lineTo(x - h * .25, h); c.lineTo(x + h * .25, h); c.lineTo(x + 10, y - 4); c.fill(); // cone de luz
        glow(c, x, y, h * .22, '255,210,110', .75 * f); c.fillStyle = '#fff6c8'; c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill();
    });
    c.save(); c.translate(w * .9, h * .1); c.fillStyle = '#333'; c.fillRect(-2, -h * .1, 4, h * .1); c.rotate(t * 1.5); c.fillStyle = '#5d4037';
    for (let k = 0; k < 4; k++) { c.rotate(Math.PI / 2); c.beginPath(); c.ellipse(h * .055, 0, h * .055, h * .013, 0, 0, TAU); c.fill(); } c.restore();
    const on = Math.sin(t * 3) > -.3; c.save(); c.font = `900 ${h * .032}px sans-serif`; c.shadowBlur = 16; c.shadowColor = on ? '#ff1744' : '#00e676'; c.fillStyle = on ? '#ff5252' : '#69f0ae'; c.fillText('ABERTO', w * .03, h * .33); c.restore();
    c.fillStyle = 'rgba(255,220,140,.7)'; for (let i = 0; i < 18; i++) { const x = (i * 97 % 100) / 100 * w + Math.sin(t * .5 + i) * 15, y = ((t * 8 + i * 53) % 100) / 100 * h; c.fillRect(x, y, 1.6, 1.6); } // poeira no ar
}

/* ── Fundo 2: Favela Sunset na Laje ── */
function bgFavelaEst(c, w, h) {
    const hz = h * .66; c.fillStyle = vgrad(c, 0, hz, [[0, '#0f1440'], [.25, '#3d2478'], [.5, '#c4468a'], [.75, '#ff7f4f'], [1, '#ffc766']]); c.fillRect(0, 0, w, h);
    const sx = w * .5, sy = hz - h * .05; glow(c, sx, sy, h * .7, '255,150,80', .55);
    c.save(); c.globalAlpha = .12; c.fillStyle = '#fff2b0'; for (let i = 0; i < 14; i++) { const a = Math.PI + i / 13 * Math.PI; c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + Math.cos(a - .04) * w, sy + Math.sin(a - .04) * w); c.lineTo(sx + Math.cos(a + .04) * w, sy + Math.sin(a + .04) * w); c.fill(); } c.restore(); // raios
    c.fillStyle = vgrad(c, sy - h * .1, sy + h * .1, [[0, '#fff8c8'], [1, '#ffb347']]); c.beginPath(); c.arc(sx, sy, h * .1, 0, TAU); c.fill();
    const r = rng(11);
    [['#5a2a6a', .13, .03], ['#43204f', .09, .04]].forEach((L, n) => { c.fillStyle = L[0]; for (let x = 0; x < w; x += w * L[2]) c.fillRect(x, hz - h * (.02 + r() * L[1]), w * L[2] + 1, h); }); // cidade ao fundo (profundidade)
    c.fillStyle = 'rgba(255,170,120,.18)'; c.fillRect(0, hz - h * .12, w, h * .12); // névoa
    for (let x = -w * .02; x < w; x += w * .075) { // casas empilhadas com detalhes
        const fl = 1 + Math.floor(r() * 3), bw = w * .07, top = hz + h * .1 - fl * h * .08;
        c.fillStyle = vgrad(c, top, h, [[0, r() > .5 ? '#2a1428' : '#341c30'], [1, '#150a14']]); c.fillRect(x, top, bw, h);
        c.fillStyle = 'rgba(255,150,100,.18)'; c.fillRect(x + bw - 3, top, 3, h); c.fillStyle = '#4a2a38'; c.fillRect(x - 2, top - 5, bw + 4, 6);
        for (let k = 0; k < fl * 2; k++) if (r() > .3) { const wx = x + bw * (.15 + (k % 2) * .45), wy = top + h * .015 + Math.floor(k / 2) * h * .07; c.fillStyle = '#ffc247'; c.fillRect(wx, wy, bw * .22, h * .035); glow(c, wx + bw * .11, wy + h * .017, h * .05, '255,190,70', .22); }
        if (r() > .35) { c.fillStyle = r() > .5 ? '#2a78c4' : '#15151a'; c.fillRect(x + bw * .3, top - h * .05, bw * .4, h * .045); c.fillStyle = 'rgba(255,255,255,.25)'; c.fillRect(x + bw * .32, top - h * .05, 2, h * .045); c.fillStyle = '#000'; c.fillRect(x + bw * .3, top - h * .05, bw * .4, 3); }
        if (r() > .55) { c.strokeStyle = '#0c0610'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + bw * .7, top); c.lineTo(x + bw * .7, top - h * .11); c.moveTo(x + bw * .55, top - h * .085); c.lineTo(x + bw * .85, top - h * .085); c.moveTo(x + bw * .6, top - h * .06); c.lineTo(x + bw * .8, top - h * .06); c.stroke(); }
    }
    const my = h * .88; c.fillStyle = vgrad(c, my, h, [[0, '#a24528'], [1, '#6d2a18']]); c.fillRect(0, my, w, h - my); c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 1; // muro de tijolos
    for (let y = my, n = 0; y < h; y += h * .03, n++) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); for (let x = (n % 2) * w * .02; x < w; x += w * .04) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + h * .03); c.stroke(); } }
    c.fillStyle = '#c9644a'; c.fillRect(0, my - h * .018, w, h * .018); c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(0, my - h * .018, w, 2);
    for (let x = w * .1; x < w * .9; x += w * .05) { c.fillStyle = '#20100a'; c.beginPath(); c.moveTo(x + w * .0125, my + h * .03); c.lineTo(x + w * .025, my + h * .06); c.lineTo(x + w * .0125, my + h * .09); c.lineTo(x, my + h * .06); c.fill(); } // cobogós em losango
    [.04, .16, .84].forEach(k => { c.fillStyle = vgrad(c, my - h * .05, my, [[0, '#d3693a'], [1, '#8a3a1c']]); c.beginPath(); c.moveTo(w * k, my - h * .05); c.lineTo(w * k + w * .025, my - h * .05); c.lineTo(w * k + w * .021, my); c.lineTo(w * k + w * .004, my); c.fill(); c.fillStyle = '#2f8a3c'; for (let q = 0; q < 6; q++) { c.beginPath(); c.ellipse(w * k + w * .0125 + (q - 2.5) * 5, my - h * .07 - (q % 2) * 6, 5, h * .03, (q - 2.5) * .25, 0, TAU); c.fill(); } });
    c.fillStyle = '#ececec'; c.fillRect(w * .9, my - h * .07, w * .04, h * .03); c.fillRect(w * .9, my - h * .07, w * .008, h * .07); c.fillRect(w * .93, my - h * .04, w * .008, h * .04); c.fillRect(w * .9, my - h * .04, w * .04, h * .008); // cadeira de plástico
    c.fillStyle = '#111'; c.fillRect(w * .94, my - h * .1, w * .035, h * .1); c.fillStyle = '#2c2c2c'; c.fillRect(w * .942, my - h * .095, w * .031, h * .02);
    vignette(c, w, h, .35);
}
function bgFavelaAni(c, w, h, t) {
    for (let i = 0; i < 5; i++) { const x = ((t * 6 + i * w * .25) % (w * 1.4)) - w * .2, y = h * (.08 + i * .06); c.fillStyle = 'rgba(255,190,200,.22)'; [0, 1, 2].forEach(k => { c.beginPath(); c.ellipse(x + k * w * .03, y - (k % 2) * 5, w * .06, h * .014, 0, 0, TAU); c.fill(); }); }
    c.strokeStyle = 'rgba(10,6,16,.85)'; c.lineWidth = 1.5; for (let k = 0; k < 3; k++) { c.beginPath(); for (let i = 0; i <= 24; i++) { const x = i / 24 * w, y = h * (.34 + k * .035) + Math.sin(i / 24 * Math.PI) * h * .05 + Math.sin(t * .8 + i + k) * 1.5; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); } // fios de luz
    c.lineWidth = 2; for (let i = 0; i < 6; i++) { const x = ((t * 45 + i * w * .2) % (w + 100)) - 50, y = h * (.16 + (i % 3) * .06) + Math.sin(t * 3 + i) * 6, f = Math.sin(t * 12 + i) * 5; c.beginPath(); c.moveTo(x - 10, y + f); c.quadraticCurveTo(x - 4, y - 4, x, y); c.quadraticCurveTo(x + 4, y - 4, x + 10, y + f); c.stroke(); }
    [[.2, .18, '#ff1744'], [.78, .25, '#00e5ff'], [.62, .14, '#ffea00'], [.4, .22, '#76ff03']].forEach((k, n) => {
        const x = w * k[0] + Math.sin(t * 1.3 + n) * 12, y = h * k[1] + Math.cos(t * 1.1 + n) * 6, s = h * .04, rot = Math.sin(t + n) * .2;
        c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1; c.beginPath(); c.moveTo(x, y + s); c.quadraticCurveTo(x + Math.sin(t + n) * 18, y + h * .2, w * (.3 + n * .15), h * .64); c.stroke();
        c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = k[2]; c.beginPath(); c.moveTo(0, -s); c.lineTo(s * .7, 0); c.lineTo(0, s); c.lineTo(-s * .7, 0); c.fill(); c.strokeStyle = 'rgba(255,255,255,.6)'; c.beginPath(); c.moveTo(0, -s); c.lineTo(0, s); c.moveTo(-s * .7, 0); c.lineTo(s * .7, 0); c.stroke();
        c.strokeStyle = k[2]; c.beginPath(); c.moveTo(0, s); for (let q = 1; q < 6; q++) c.lineTo(Math.sin(t * 4 + q + n) * 5, s + q * s * .45); c.stroke(); c.restore(); });
    const ly = h * .79; c.strokeStyle = '#ddd'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(w * .02, ly); c.lineTo(w * .32, ly + h * .012); c.stroke();
    ['#e53935', '#fdd835', '#1e88e5', '#43a047', '#8e24aa', '#fb8c00'].forEach((col, i) => { const x = w * (.035 + i * .047), sw = Math.sin(t * 2.2 + i) * 4; c.fillStyle = col; c.beginPath(); c.moveTo(x, ly); c.lineTo(x + w * .03, ly); c.lineTo(x + w * .03 + sw, ly + h * .075); c.lineTo(x + sw, ly + h * .075); c.fill(); c.fillStyle = 'rgba(255,255,255,.18)'; c.fillRect(x + sw * .5, ly, 3, h * .07); });
    const my = h * .88; for (let i = 0; i < 24; i++) { const x = w * (.03 + i * .04), y = my - h * .035 + Math.sin(i / 24 * Math.PI * 4) * 4, on = .6 + .4 * Math.sin(t * 3 + i * 1.7); glow(c, x, y, 12, ['255,120,90', '255,220,90', '120,200,255'][i % 3], .7 * on); c.fillStyle = '#fff'; c.fillRect(x - 1, y - 1, 2, 2); } // luzinhas do varal
    const p = 1 + Math.sin(t * 7) * .06; c.fillStyle = '#555'; c.beginPath(); c.arc(w * .9575, my - h * .04, w * .0105 * p, 0, TAU); c.fill(); glow(c, w * .9575, my - h * .04, w * .03, '255,255,255', .06 * p);
    c.fillStyle = 'rgba(255,230,150,.8)'; for (let i = 0; i < 16; i++) if (Math.sin(t * 3 + i * 5) > -.2) c.fillRect(w * (.04 + i * .06), h * .645, 2, 2);
}

/* ── Fundo 3: Mansão & Piscina de Luxo ── */
function bgMansaoEst(c, w, h) {
    c.fillStyle = vgrad(c, 0, h * .6, [[0, '#050820'], [.55, '#241657'], [1, '#7a4392']]); c.fillRect(0, 0, w, h);
    const r = rng(5); for (let i = 0; i < 90; i++) { c.fillStyle = '#fff'; c.globalAlpha = .25 + r() * .6; c.fillRect(r() * w, r() * h * .4, 1.5, 1.5); } c.globalAlpha = 1;
    glow(c, w * .85, h * .1, h * .25, '220,230,255', .35); c.fillStyle = '#f4f6ff'; c.beginPath(); c.arc(w * .85, h * .1, h * .035, 0, TAU); c.fill(); // lua
    c.fillStyle = '#2a1d52'; for (let x = 0; x < w; x += w * .02) c.fillRect(x, h * (.36 - r() * .08), w * .02 + 1, h * .3); // skyline distante
    const fy = h * .27, fh = h * .31; c.fillStyle = vgrad(c, fy, fy + fh, [[0, '#f2eff6'], [1, '#c9c4d2']]); c.fillRect(w * .1, fy, w * .8, fh); // fachada de mármore
    c.fillStyle = '#d8d3e0'; c.fillRect(w * .06, fy - h * .035, w * .88, h * .04); c.fillStyle = '#b5aec2'; c.fillRect(w * .28, fy - h * .11, w * .44, h * .11);
    for (let i = 0; i < 8; i++) { const x = w * .12 + i * w * .095, gy = fy + h * .035, gh = fh - h * .055; c.fillStyle = vgrad(c, gy, gy + gh, [[0, '#ffe7ae'], [1, '#ff9a47']]); c.fillRect(x, gy, w * .075, gh);
        c.fillStyle = 'rgba(70,40,20,.55)'; c.fillRect(x + w * .006, gy + gh * .55, w * .02, gh * .45); c.fillRect(x + w * .045, gy + gh * .7, w * .025, gh * .3); // móveis em silhueta
        c.fillStyle = 'rgba(255,255,255,.75)'; c.beginPath(); c.arc(x + w * .0375, gy + gh * .12, 3, 0, TAU); c.fill(); glow(c, x + w * .0375, gy + gh * .14, w * .03, '255,230,150', .5); // lustre
        c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.moveTo(x, gy); c.lineTo(x + w * .03, gy); c.lineTo(x, gy + gh * .6); c.fill(); c.fillStyle = '#9d97aa'; c.fillRect(x + w * .0375 - 1, gy, 2, gh); } // reflexo no vidro
    for (let i = 0; i < 3; i++) { c.fillStyle = '#ffd47a'; c.fillRect(w * .32 + i * w * .1, fy - h * .085, w * .08, h * .06); glow(c, w * .36 + i * w * .1, fy - h * .055, h * .08, '255,200,100', .25); }
    c.fillStyle = vgrad(c, h * .58, h, [[0, '#7a4a24'], [1, '#3d2210']]); c.fillRect(0, h * .58, w, h * .42); // deck de madeira nobre
    for (let y = h * .58, n = 0; y < h; y += h * .028, n++) { c.strokeStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); for (let x = (n * 137) % 200; x < w; x += 200) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + h * .028); c.stroke(); } }
    const px = w * .06, pw = w * .88, py = h * .62, ph = h * .2; c.fillStyle = vgrad(c, py, py + ph, [[0, '#2ff0e0'], [.5, '#14b7c9'], [1, '#08729a']]); c.fillRect(px, py, pw, ph); // piscina infinita
    c.save(); c.beginPath(); c.rect(px, py, pw, ph * .4); c.clip(); c.globalAlpha = .28; c.translate(0, py * 2 + ph * .4); c.scale(1, -1); c.fillStyle = '#ffd27a'; for (let i = 0; i < 8; i++) c.fillRect(w * .12 + i * w * .095, fy + h * .035, w * .075, fh * .5); c.restore(); // reflexo da casa na água
    c.fillStyle = '#fff'; c.fillRect(px, py - 3, pw, 4); c.fillStyle = '#cfd8dc'; c.fillRect(px - 5, py + ph, pw + 10, 6);
    [.12, .22, .72, .82].forEach(k => { c.save(); c.translate(w * k, h * .9); c.rotate(-.1); c.fillStyle = '#fafafa'; c.fillRect(0, 0, w * .07, h * .03); c.fillStyle = '#e0e0e0'; c.fillRect(0, h * .03, w * .07, 3); c.fillStyle = '#fafafa'; c.fillRect(0, -h * .045, w * .02, h * .045); c.fillStyle = '#19b5c9'; c.fillRect(w * .015, -h * .004, w * .05, h * .01); c.restore(); });
    [.17, .77].forEach(k => { c.fillStyle = '#8d6e63'; c.fillRect(w * k, h * .78, 3, h * .15); c.fillStyle = vgrad(c, h * .74, h * .78, [[0, '#ffffff'], [1, '#d9d9d9']]); c.beginPath(); c.arc(w * k + 1.5, h * .78, w * .055, Math.PI, 0); c.fill(); c.strokeStyle = 'rgba(0,0,0,.12)'; for (let q = 1; q < 5; q++) { c.beginPath(); c.moveTo(w * k + 1.5, h * .78); c.lineTo(w * k + 1.5 + (q - 2.5) * w * .022, h * .78 - h * .035); c.stroke(); } });
    for (let i = 0; i < 12; i++) { const x = w * (.08 + i * .075); c.fillStyle = '#222'; c.fillRect(x - 2, h * .575, 4, h * .02); glow(c, x, h * .573, h * .03, '255,225,150', .6); } // balizadores do jardim
}
function bgMansaoAni(c, w, h, t) {
    const px = w * .06, pw = w * .88, py = h * .62, ph = h * .2; c.save(); c.beginPath(); c.rect(px, py, pw, ph); c.clip();
    c.strokeStyle = 'rgba(255,255,255,.3)'; c.lineWidth = 1.5; for (let k = 0; k < 8; k++) { c.beginPath(); for (let x = px; x <= px + pw; x += 8) { const y = py + ph * (.1 + k * .12) + Math.sin(x * .03 + t * 1.8 + k) * 3 + Math.sin(x * .011 - t + k) * 2; x === px ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); }
    c.globalCompositeOperation = 'lighter'; for (let i = 0; i < 14; i++) { const x = px + ((i * 91 + Math.sin(t * .6 + i) * 30) % pw + pw) % pw, y = py + ph * (.15 + (i * 37 % 70) / 100); glow(c, x, y, 14, '160,255,250', .16 + .1 * Math.sin(t * 2 + i)); } // cáusticas
    [.2, .5, .8].forEach((k, n) => glow(c, w * k, h * .76, h * .12, '170,255,255', .55 + .3 * Math.sin(t * 2 + n))); c.restore(); // luzes subaquáticas
    palm(c, w * .03 + 20, h * .55, h * .24, t, 0, '#4a3020', '#1f6b3a'); palm(c, w * .97 - 20, h * .55, h * .24, t, 3, '#4a3020', '#1f6b3a');
    [.3, .7].forEach((k, n) => { const x = w * k, y = h * .575, f = 1 + Math.sin(t * 12 + n * 2) * .18; c.fillStyle = '#3a2a22'; c.beginPath(); c.moveTo(x - 10, y + h * .04); c.lineTo(x - 7, y); c.lineTo(x + 7, y); c.lineTo(x + 10, y + h * .04); c.fill(); glow(c, x, y - 4, h * .07 * f, '255,150,40', .8); c.fillStyle = '#ffdf70'; c.beginPath(); c.ellipse(x, y - 4, 4, 9 * f, 0, 0, TAU); c.fill(); });
    for (let i = 0; i < 6; i++) { const x = w * (.1 + i * .15), tw = .5 + .5 * Math.sin(t * 2 + i * 2); c.fillStyle = `rgba(255,255,255,${.4 + tw * .5})`; c.fillRect(x, h * (.05 + (i % 3) * .06), 2, 2); } // estrelas cintilando
}

/* ── Fundo 4: Chácara Imperial no Campo ── */
function bgChacaraEst(c, w, h) {
    const hz = h * .55; c.fillStyle = vgrad(c, 0, hz, [[0, '#3b97ee'], [.7, '#9fd2fb'], [1, '#e4f3ff']]); c.fillRect(0, 0, w, h);
    glow(c, w * .85, h * .1, h * .5, '255,248,190', .75); c.fillStyle = '#fffbe0'; c.beginPath(); c.arc(w * .85, h * .1, h * .04, 0, TAU); c.fill();
    [['#9fbbdc', .22, 0], ['#7ea8bd', .15, 1], ['#5b977a', .09, 2]].forEach((m, n) => { // montanhas em camadas com neblina
        c.fillStyle = m[0]; c.beginPath(); c.moveTo(0, hz); for (let x = 0; x <= w; x += 8) c.lineTo(x, hz - h * m[1] * (.55 + .45 * Math.sin(x / w * (4 + n * 3) + n * 2) * Math.cos(x / w * 7 + n))); c.lineTo(w, hz); c.fill();
        c.fillStyle = vgrad(c, hz - h * .16, hz, [[0, 'rgba(255,255,255,0)'], [1, 'rgba(255,255,255,.5)']]); c.fillRect(0, hz - h * .16, w, h * .16);
    });
    c.fillStyle = vgrad(c, hz, h, [[0, '#86cb62'], [.5, '#4f9a39'], [1, '#2f6a22']]); c.fillRect(0, hz, w, h - hz);
    c.fillStyle = '#6fb552'; c.beginPath(); c.moveTo(0, hz + h * .03); c.quadraticCurveTo(w * .3, hz - h * .02, w * .6, hz + h * .04); c.lineTo(w * .6, h); c.lineTo(0, h); c.fill();
    c.fillStyle = 'rgba(214,190,140,.55)'; c.beginPath(); c.moveTo(w * .3, h * .52); c.lineTo(w * .36, h * .52); c.lineTo(w * .5, h); c.lineTo(w * .25, h); c.fill(); // caminho de terra
    const hx = w * .05, hy = h * .26, hw = w * .34, hh = h * .24; // casarão imperial
    c.fillStyle = vgrad(c, hy, hy + hh, [[0, '#f8edd0'], [1, '#e2cfa0']]); c.fillRect(hx, hy, hw, hh);
    c.fillStyle = '#c0583a'; c.beginPath(); c.moveTo(hx - 10, hy); c.lineTo(hx + hw * .12, hy - h * .1); c.lineTo(hx + hw * .88, hy - h * .1); c.lineTo(hx + hw + 10, hy); c.fill();
    c.strokeStyle = 'rgba(90,25,5,.4)'; for (let i = 1; i < 8; i++) { c.beginPath(); c.moveTo(hx - 10 + i, hy - i * h * .0125); c.lineTo(hx + hw + 10 - i, hy - i * h * .0125); c.stroke(); } for (let k = 0; k < 24; k++) { c.beginPath(); c.moveTo(hx + k * hw / 24, hy); c.lineTo(hx + hw * .12 + k * hw * .76 / 24, hy - h * .1); c.stroke(); }
    c.fillStyle = '#8a8a8a'; c.fillRect(hx + hw * .7, hy - h * .15, hw * .06, h * .08); // chaminé
    c.fillStyle = '#fff'; for (let i = 0; i < 7; i++) { c.fillRect(hx + hw * .05 + i * hw * .145, hy + h * .012, hw * .028, hh - h * .012); c.fillStyle = '#e6e6e6'; c.fillRect(hx + hw * .05 + i * hw * .145 + hw * .022, hy + h * .012, hw * .006, hh - h * .012); c.fillStyle = '#fff'; }
    c.fillStyle = '#d6c294'; c.fillRect(hx, hy + h * .012, hw, h * .012);
    for (let i = 0; i < 4; i++) { const wx = hx + hw * .13 + i * hw * .22; c.fillStyle = '#5a3a1c'; c.fillRect(wx, hy + hh * .22, hw * .08, hh * .46); c.fillStyle = '#9fd0e8'; c.fillRect(wx + 3, hy + hh * .25, hw * .08 - 6, hh * .4); c.fillStyle = '#2f7a4a'; c.fillRect(wx - 4, hy + hh * .22, 4, hh * .46); c.fillRect(wx + hw * .08, hy + hh * .22, 4, hh * .46); } // janelas com venezianas
    c.fillStyle = '#4a2f17'; c.fillRect(hx + hw * .45, hy + hh * .42, hw * .1, hh * .58); c.fillStyle = '#d6c294'; for (let i = 0; i < 3; i++) c.fillRect(hx + hw * .4 - i * 4, hy + hh - i * 4 + 4, hw * .2 + i * 8, 4);
    c.fillStyle = '#7b5a35'; for (let x = w * .4; x < w * .64; x += w * .014) { c.fillRect(x, h * .5, 3, h * .055); c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(x, h * .5, 1, h * .055); c.fillStyle = '#7b5a35'; } c.fillRect(w * .4, h * .515, w * .24, 3); c.fillRect(w * .4, h * .538, w * .24, 3);
    c.fillStyle = vgrad(c, h * .45, h * .56, [[0, '#b0b0b0'], [1, '#6e6e6e']]); c.fillRect(w * .66, h * .45, w * .022, h * .11); c.fillRect(w * .72, h * .45, w * .022, h * .11); c.fillStyle = '#8a8a8a'; c.fillRect(w * .655, h * .442, w * .032, h * .014); c.fillRect(w * .715, h * .442, w * .032, h * .014); // pilares de pedra
    const rr = rng(3); c.fillStyle = '#5a3a1c'; c.fillRect(w * .905, h * .34, w * .012, h * .22); // ipê amarelo
    for (let i = 0; i < 22; i++) { c.fillStyle = ['#f6cc1a', '#ffd93b', '#e8b90e'][i % 3]; c.beginPath(); c.arc(w * .911 + (rr() - .5) * w * .11, h * .31 + (rr() - .5) * h * .12, h * .042, 0, TAU); c.fill(); }
    c.fillStyle = '#5a3a1c'; c.fillRect(w * .46, h * .36, w * .01, h * .17); for (let i = 0; i < 6; i++) { c.fillStyle = ['#a63fb0', '#c15bcb', '#8e2b99'][i % 3]; c.beginPath(); c.arc(w * .465 + (rr() - .5) * w * .07, h * .34 + (rr() - .5) * h * .07, h * .04, 0, TAU); c.fill(); } // ipê roxo
    c.fillStyle = '#5a3a1c'; c.fillRect(w * .96, h * .4, w * .01, h * .15); for (let i = 0; i < 8; i++) { c.fillStyle = ['#2e7d32', '#388e3c', '#256b2a'][i % 3]; c.beginPath(); c.arc(w * .965 + (rr() - .5) * w * .06, h * .39 + (rr() - .5) * h * .07, h * .042, 0, TAU); c.fill(); } // mangueira
    c.fillStyle = vgrad(c, h * .84, h * .96, [[0, '#6cc3e6'], [1, '#2f86b3']]); c.beginPath(); c.ellipse(w * .8, h * .9, w * .14, h * .06, 0, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(w * .78, h * .885, w * .06, h * .014, 0, 0, TAU); c.fill(); // lago
    for (let i = 0; i < 40; i++) { c.fillStyle = ['#ff6b81', '#ffd93b', '#fff', '#c77dff'][i % 4]; c.beginPath(); c.arc(rr() * w, h * (.62 + rr() * .34), 2.2, 0, TAU); c.fill(); } // flores no gramado
    [.52, .58].forEach(k => { c.fillStyle = '#f6f6f6'; c.fillRect(w * k, h * .575, w * .018, h * .016); c.fillStyle = '#2b2b2b'; c.fillRect(w * k + 4, h * .577, w * .006, h * .009); c.fillRect(w * k + w * .015, h * .572, w * .005, h * .008); c.fillRect(w * k + 2, h * .59, 2, h * .01); c.fillRect(w * k + w * .013, h * .59, 2, h * .01); });
    c.fillStyle = '#6b4a2b'; c.fillRect(w * .66, h * .585, w * .02, h * .014); c.fillRect(w * .665, h * .576, w * .008, h * .01); c.fillRect(w * .66 + 2, h * .599, 2, h * .01); c.fillRect(w * .675, h * .599, 2, h * .01); // cavalo ao longe
}
function bgChacaraAni(c, w, h, t) {
    c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,250,200,${.05 + .03 * Math.sin(t * .8)})`; for (let i = 0; i < 9; i++) { const a = Math.PI * .55 + i * .12 + Math.sin(t * .3 + i) * .02; c.beginPath(); c.moveTo(w * .85, h * .1); c.lineTo(w * .85 + Math.cos(a - .025) * w, h * .1 + Math.sin(a - .025) * w); c.lineTo(w * .85 + Math.cos(a + .025) * w, h * .1 + Math.sin(a + .025) * w); c.fill(); } c.restore(); // raios de sol
    for (let i = 0; i < 5; i++) { const x = ((t * 8 + i * w * .26) % (w * 1.4)) - w * .2, y = h * (.07 + i * .045); c.fillStyle = 'rgba(255,255,255,.88)'; [0, 1, 2, 3].forEach(k => { c.beginPath(); c.ellipse(x + k * w * .022, y - (k % 2) * 7 + (k === 3 ? 4 : 0), w * .04, h * .02, 0, 0, TAU); c.fill(); }); c.fillStyle = 'rgba(190,210,235,.35)'; c.beginPath(); c.ellipse(x + w * .03, y + h * .012, w * .08, h * .008, 0, 0, TAU); c.fill(); }
    c.strokeStyle = '#223'; c.lineWidth = 1.5; for (let i = 0; i < 4; i++) { const x = ((t * 30 + i * w * .26) % (w + 80)) - 40, y = h * (.15 + (i % 3) * .05), f = Math.sin(t * 10 + i) * 4; c.beginPath(); c.moveTo(x - 8, y + f); c.quadraticCurveTo(x - 3, y - 3, x, y); c.quadraticCurveTo(x + 3, y - 3, x + 8, y + f); c.stroke(); }
    c.lineWidth = 2; for (let i = 0; i < 90; i++) { const x = i / 90 * w, y = h * (.6 + (i * 37 % 38) / 100), sw = Math.sin(t * 2 + i * .5) * 3.5; c.strokeStyle = i % 3 ? '#3f8f2e' : '#5aa844'; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + sw / 2, y - 6, x + sw, y - 12); c.stroke(); }
    palm(c, w * .405, h * .43, h * .2, t, 1, '#6b5a3a', '#2e8b3e'); palm(c, w * .625, h * .43, h * .2, t, 2, '#6b5a3a', '#2e8b3e'); // palmeiras imperiais ao lado do portão
    for (let i = 0; i < 14; i++) { const x = w * (.88 + (i % 5) * .02) + Math.sin(t + i) * 12, y = ((t * 18 + i * 31) % 100) / 100 * h * .35 + h * .35; c.fillStyle = i % 2 ? '#ffd93b' : '#a63fb0'; c.fillRect(x, y, 2.5, 2.5); } // pétalas caindo
    [[.3, .7], [.6, .8], [.45, .9]].forEach((p, n) => { const x = w * p[0] + Math.sin(t * .8 + n * 2) * 22, y = h * p[1] + Math.cos(t * 1.2 + n) * 10, f = Math.abs(Math.sin(t * 12 + n)) * 5 + 1; c.fillStyle = ['#ff9800', '#42a5f5', '#ffee58'][n]; c.beginPath(); c.ellipse(x - 3, y, f, 4, -.4, 0, TAU); c.ellipse(x + 3, y, f, 4, .4, 0, TAU); c.fill(); });
    [0, 1, 2].forEach(n => { const x = w * (.76 + n * .035) + Math.sin(t * .6 + n) * 9, y = h * .9 + Math.sin(t * 2 + n) * 1.4; c.fillStyle = '#fff'; c.beginPath(); c.ellipse(x, y, 7, 4, 0, 0, TAU); c.fill(); c.beginPath(); c.arc(x + 6, y - 4, 2.6, 0, TAU); c.fill(); c.fillStyle = '#ff9800'; c.fillRect(x + 8, y - 4.5, 3, 1.5); c.strokeStyle = 'rgba(255,255,255,.4)'; c.beginPath(); c.ellipse(x, y + 5, 11 + Math.sin(t * 2 + n) * 2, 2, 0, 0, TAU); c.stroke(); }); // patos no lago
}

// Catálogo de fundos (a mesa é a mesma em todos). O primeiro é o padrão gratuito.
const BACKGROUNDS = [
    { id: 'bg_padrao', nome: 'Padrão Clássico', descricao: 'O ambiente escuro original do jogo.', preco: 0, est: bgPadraoEst },
    { id: 'bar_brasileiro', nome: 'Bar Brasileira Tradicional', descricao: 'Boteco com azulejo, garrafas, letreiros e lâmpadas quentes.', preco: 300, est: bgBarEst, ani: bgBarAni },
    { id: 'favela_sunset', nome: 'Favela Sunset na Laje', descricao: 'Pôr do sol na laje, com pipas, varal e luzes da cidade.', preco: 600, est: bgFavelaEst, ani: bgFavelaAni },
    { id: 'chacara_imperial', nome: 'Chácara Imperial no Campo', descricao: 'Casarão colonial, ipê florido e montanhas com neblina.', preco: 1000, est: bgChacaraEst, ani: bgChacaraAni },
    { id: 'mansao_piscina', nome: 'Mansão & Piscina de Luxo', descricao: 'Fachada de vidro, piscina infinita e noite estrelada.', preco: 1600, est: bgMansaoEst, ani: bgMansaoAni }
];
BACKGROUNDS.forEach(b => { b.desenhar = (c, w, h, t) => drawBackground(c, b.id, w, h, t); });

// Desenha o fundo: camada estática pré-renderizada em canvas offscreen + só os elementos móveis por frame
const BG_CACHE = {};
function drawBackground(ctx, themeId, w, h, t) {
    const th = BACKGROUNDS.find(b => b.id === themeId) || BACKGROUNDS[0], key = th.id + '@' + w + 'x' + h;
    let k = BG_CACHE[key];
    if (!k) {
        if (Object.keys(BG_CACHE).length > 14) for (let o in BG_CACHE) delete BG_CACHE[o];
        k = BG_CACHE[key] = document.createElement('canvas'); k.width = w; k.height = h; th.est(k.getContext('2d'), w, h);
    }
    ctx.drawImage(k, 0, 0);
    if (th.ani) th.ani(ctx, w, h, t || 0);
}

// Só os fundos comprados (+ o padrão gratuito) — filtrado em JS, nunca por CSS
function getAvailableBackgrounds() {
    const own = (SaveSystem.data && SaveSystem.data.ownedScenarios) || [];
    return BACKGROUNDS.filter(b => b.preco === 0 || own.includes(b.id));
}
// Validação anti-burla: id inválido ou não comprado volta para o padrão
function resolveBackground(id) { return getAvailableBackgrounds().find(b => b.id === id) || BACKGROUNDS[0]; }

/* ══════════════════════════════════════════════════════════
   TACOS REALISTAS: dados visuais + função única drawCue
   ══════════════════════════════════════════════════════════ */
// shaft: madeira do fuste | butt: cores do cabo | pat: padrão | ring: anéis | fx: efeito animado (lendário/épico)
const CUE_SKINS = {
    cue_bar:     { shaft: ['#ead7a8', '#c9a66b'], butt: ['#4a2c17', '#2b190c'], pat: 'rings', ring: '#b08d57' },
    cue_bambu:   { shaft: ['#eadcae', '#cdb97d'], butt: ['#b3a04a', '#6f6a2a'], pat: 'bands', ring: '#556b2f' },
    cue_brasil:  { shaft: ['#ecd9aa', '#cfae70'], butt: ['#009b3a', '#006b28'], pat: 'bands', ring: '#fedf00' },
    cue_carbono: { shaft: ['#e8d7ad', '#c4a870'], butt: ['#262626', '#0b0b0b'], pat: 'geo', ring: '#9aa0a6' },
    cue_ouro:    { shaft: ['#f0dca8', '#d2b06a'], butt: ['#ffd700', '#b8860b'], pat: 'diamonds', ring: '#fff3b0', fx: 1 },
    cue_neon:    { shaft: ['#e6d6ae', '#c8aa72'], butt: ['#14143c', '#05051a'], pat: 'geo', ring: '#00ffff', fx: 1 },
    cue_dragao:  { shaft: ['#f0d9a6', '#d1a666'], butt: ['#6e0000', '#ff2200'], pat: 'runes', ring: '#ffaa00', fx: 1 },
    cue_gelo:    { shaft: ['#f2ead2', '#d8c9a0'], butt: ['#e0f7fa', '#4fc3f7'], pat: 'diamonds', ring: '#00b0ff', fx: 1 },
    cue_galaxia: { shaft: ['#e9d8ae', '#caa970'], butt: ['#2a0a4f', '#6a1b9a'], pat: 'runes', ring: '#ea80fc', fx: 1 },
    cue_mestre:  { shaft: ['#f1dda8', '#d3ae68'], butt: ['#1c1c1c', '#000000'], pat: 'runes', ring: '#ffd700', fx: 1 }
};

// Desenha um taco: ponta em (x,y) recuada 'pull' px ao longo de 'angle' (a ponta aponta para +x local)
function drawCue(ctx, cue, x, y, angle, pull, scale, t) {
    const sk = CUE_SKINS[cue.id] || CUE_SKINS.cue_bar, L = 320, hw = s => 3.3 + 4.2 * s; // afunila de ~6,6px a ~15px
    const seg = (a, b) => { ctx.beginPath(); ctx.moveTo(a * L, -hw(a)); ctx.lineTo(b * L, -hw(b)); ctx.lineTo(b * L, hw(b)); ctx.lineTo(a * L, hw(a)); ctx.closePath(); };
    const lin = (a, b, c1, c2) => { const g = ctx.createLinearGradient(a * L, 0, b * L, 0); g.addColorStop(0, c1); g.addColorStop(1, c2); return g; };
    const ac = cue.accent || '#ffffff', ring = sk.ring, band = (a, b, col) => { ctx.fillStyle = col; ctx.fillRect(a * L, -8, (b - a) * L, 16); };
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle); ctx.scale(scale || 1, scale || 1); ctx.translate(pull || 0, 0);
    // sombra suave no feltro
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 8; ctx.shadowOffsetX = 3; ctx.shadowOffsetY = 5; seg(0, 1); ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();
    if (sk.fx && t !== undefined) { // aura luminosa pulsante nos tacos especiais
        ctx.save(); ctx.shadowColor = ac; ctx.shadowBlur = 10 + 6 * Math.sin(t * 3); seg(.6, .97); ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();
    }
    // ponteira de couro azul, virola marfim e fuste de maple com veios
    ctx.beginPath(); ctx.ellipse(2.2, 0, 2.4, hw(0), 0, 0, TAU); ctx.fillStyle = '#2f80d8'; ctx.fill();
    seg(.012, .05); ctx.fillStyle = '#f4efe0'; ctx.fill();
    seg(.05, .6); ctx.fillStyle = lin(.05, .6, sk.shaft[0], sk.shaft[1]); ctx.fill();
    ctx.save(); seg(.05, .6); ctx.clip(); ctx.strokeStyle = 'rgba(107,74,30,.22)'; ctx.lineWidth = .6;
    for (let i = 0; i < 16; i++) { const yy = ((i * 37) % 13 - 6) / 6 * 4.8; ctx.beginPath(); ctx.moveTo(.06 * L, yy); ctx.quadraticCurveTo(.3 * L, yy + (i % 2 ? 1 : -1), .6 * L, yy * 1.2); ctx.stroke(); }
    ctx.restore();
    // butt decorado (padrão depende do taco)
    seg(.6, .97); ctx.fillStyle = lin(.6, .97, sk.butt[0], sk.butt[1]); ctx.fill();
    ctx.save(); seg(.6, .97); ctx.clip();
    if (sk.pat === 'rings') { band(.64, .65, ring); band(.68, .685, ring); band(.9, .91, ring); band(.93, .935, ring); }
    else if (sk.pat === 'bands') { band(.64, .68, ac); band(.7, .715, ring); band(.78, .82, ac); band(.84, .855, ring); band(.9, .94, ac); }
    else if (sk.pat === 'geo') { ctx.strokeStyle = ac; ctx.globalAlpha = .55; ctx.lineWidth = 1.2; for (let xx = .62 * L; xx < .95 * L; xx += 7) { ctx.beginPath(); ctx.moveTo(xx, -8); ctx.lineTo(xx + 8, 8); ctx.stroke(); } ctx.globalAlpha = 1; band(.62, .63, ring); band(.94, .95, ring); }
    else if (sk.pat === 'diamonds') { for (let i = 0; i < 6; i++) { const cx = (.66 + i * .05) * L; ctx.beginPath(); ctx.moveTo(cx - 6, 0); ctx.lineTo(cx, -6); ctx.lineTo(cx + 6, 0); ctx.lineTo(cx, 6); ctx.closePath(); ctx.fillStyle = ac; ctx.globalAlpha = .9; ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = ring; ctx.lineWidth = .8; ctx.stroke(); } band(.62, .635, ring); band(.94, .955, ring); }
    else { ctx.strokeStyle = ac; ctx.lineWidth = 1.3; for (let i = 0; i < 6; i++) { const cx = (.66 + i * .05) * L; ctx.beginPath(); if (i % 3 === 0) { ctx.moveTo(cx - 3, -4); ctx.lineTo(cx + 3, 0); ctx.lineTo(cx - 3, 4); } else if (i % 3 === 1) { ctx.moveTo(cx - 3, -4); ctx.lineTo(cx + 3, 4); ctx.moveTo(cx + 3, -4); ctx.lineTo(cx - 3, 4); } else { ctx.moveTo(cx - 3, -4); ctx.lineTo(cx + 3, -4); ctx.lineTo(cx - 3, 4); ctx.lineTo(cx + 3, 4); } ctx.stroke(); } band(.62, .635, ring); band(.94, .955, ring); }
    if (sk.fx && t !== undefined) { // brilho pulsante que percorre o butt
        ctx.globalCompositeOperation = 'lighter'; const cx = (.6 + ((t * .35) % 1) * .37) * L, g = ctx.createLinearGradient(cx - 30, 0, cx + 30, 0);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, ac + '99'); g.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = g; ctx.fillRect(.6 * L, -8, .37 * L, 16);
    }
    ctx.restore();
    // bumper de borracha e anéis metálicos (junta e fim do butt)
    seg(.97, 1); ctx.fillStyle = '#111'; ctx.fill();
    [[.6, .615], [.955, .97], [.05, .056]].forEach(r => { seg(r[0], r[1]); const mg = ctx.createLinearGradient(0, -8, 0, 8); mg.addColorStop(0, '#ffffff'); mg.addColorStop(.3, ring); mg.addColorStop(.6, '#6b6b6b'); mg.addColorStop(1, ring); ctx.fillStyle = mg; ctx.fill(); });
    // volume cilíndrico: claro em cima, escuro embaixo
    seg(0, 1); const vg = ctx.createLinearGradient(0, -7.5, 0, 7.5);
    vg.addColorStop(0, 'rgba(255,255,255,.4)'); vg.addColorStop(.35, 'rgba(255,255,255,0)'); vg.addColorStop(.75, 'rgba(0,0,0,.25)'); vg.addColorStop(1, 'rgba(0,0,0,.6)'); ctx.fillStyle = vg; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(.02 * L, -hw(.02) * .5); ctx.lineTo(.96 * L, -hw(.96) * .5); ctx.stroke(); // brilho especular
    seg(0, 1); ctx.strokeStyle = 'rgba(0,0,0,.65)'; ctx.lineWidth = .8; ctx.stroke(); // contorno
    ctx.beginPath(); ctx.ellipse(.2, 0, 1.3, hw(0) * .75, 0, 0, TAU); ctx.fillStyle = '#9fd8ff'; ctx.fill(); // giz azul na pontinha
    if (sk.fx && t !== undefined) { ctx.fillStyle = ac; for (let i = 0; i < 4; i++) { ctx.globalAlpha = .5 + .5 * Math.sin(t * 6 + i); ctx.beginPath(); ctx.arc((.62 + ((t * .2 + i * .25) % 1) * .35) * L, Math.sin(t * 3 + i * 2) * 5, 1.2, 0, TAU); ctx.fill(); } }
    ctx.restore();
}

// Miniatura do taco (loja): diagonal, centralizada, com brilho de fundo conforme a raridade
const CuePreview = {
    glow: { comum: '#9aa0a6', raro: '#2a8cff', epico: '#b05cff', lendario: '#ffb020' },
    draw(cv, cue, t) {
        const c = cv.getContext('2d'), a = -.38, s = cv.width * .9 / (320 * Math.cos(.38));
        c.clearRect(0, 0, cv.width, cv.height);
        const g = c.createRadialGradient(cv.width / 2, cv.height / 2, 4, cv.width / 2, cv.height / 2, cv.width * .55);
        g.addColorStop(0, (this.glow[cue.rarity] || '#999') + '66'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, cv.width, cv.height);
        drawCue(c, cue, cv.width / 2 - 160 * s * Math.cos(a), cv.height / 2 - 160 * s * Math.sin(a), a, 0, s, t);
    }
};

// Anima todas as miniaturas visíveis (fundos e tacos) reutilizando as mesmas funções de desenho
const Thumbs = {
    loop(ts) {
        const t = ts / 1000;
        document.querySelectorAll('canvas[data-bg]').forEach(cv => { if (cv.offsetParent) drawBackground(cv.getContext('2d'), cv.dataset.bg, cv.width, cv.height, t); });
        document.querySelectorAll('canvas[data-cue]').forEach(cv => { const q = CUE_CATALOG.find(x => x.id === cv.dataset.cue); if (q && cv.offsetParent) CuePreview.draw(cv, q, t); });
        requestAnimationFrame(n => Thumbs.loop(n));
    }
};

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

    // Som da Tacada (batida de giz + madeira na bola de resina)
    playCueShot(powerRatio = 0.5) {
        if (this.muted) return;
        this.init();
        try {
            let now = this.ctx.currentTime;
            let p = Math.max(0.12, Math.min(1.0, powerRatio));

            // 1. Pancada de impacto da ponteira de madeira e couro (thwack ressonante)
            let osc = this.ctx.createOscillator();
            let gainOsc = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(460, now);
            osc.frequency.exponentialRampToValueAtTime(100, now + 0.055);

            gainOsc.gain.setValueAtTime(p * 0.75, now);
            gainOsc.gain.exponentialRampToValueAtTime(0.001, now + 0.055);

            osc.connect(gainOsc);
            gainOsc.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.055);

            // 2. Ruído de giz seco e atrito na bola
            let bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
            let buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            let data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            let noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            let filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1750;
            filter.Q.value = 2.0;

            let gain = this.ctx.createGain();
            gain.gain.setValueAtTime(p * 0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start(now);
            noise.stop(now + 0.05);
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
        equippedScenario: 'bg_padrao',
        ownedCues: ['cue_bar'],
        ownedScenarios: ['bg_padrao'],
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
        this.migrateBackgrounds();
        AudioEngine.muted = !this.data.settings.sound;
    },

    // Converte saves antigos (scen_*) e corrige dados ausentes/corrompidos dos fundos
    migrateBackgrounds() {
        const map = { scen_bar: 'bg_padrao', scen_favela: 'favela_sunset', scen_luxo: 'mansao_piscina', scen_campo: 'chacara_imperial' };
        const fix = id => map[id] || id, d = this.data;
        d.ownedScenarios = Array.isArray(d.ownedScenarios) ? [...new Set(d.ownedScenarios.map(fix))].filter(id => BACKGROUNDS.some(b => b.id === id)) : [];
        if (!d.ownedScenarios.includes('bg_padrao')) d.ownedScenarios.unshift('bg_padrao');
        d.equippedScenario = fix(d.equippedScenario);
        if (!d.ownedScenarios.includes(d.equippedScenario)) d.equippedScenario = 'bg_padrao';
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

            // Rotação visual 3D proporcional à velocidade física
            this.rotX += (this.vel.y / this.radius) * dt;
            this.rotY += (this.vel.x / this.radius) * dt;

            // Se for muito lenta, para por completo
            if (this.vel.mag() < GAME_CONFIG.BALLS.STOP_SPEED) {
                this.vel.set(0, 0);
            }

            // Proteção de limites: impede que bolas ativas atravessem para fora da mesa
            let cushion = GAME_CONFIG.TABLE.CUSHION_SIZE;
            let minX = cushion;
            let maxX = GAME_CONFIG.TABLE.WIDTH - cushion;
            let minY = cushion;
            let maxY = GAME_CONFIG.TABLE.HEIGHT - cushion;
            if (this.pos.x < minX) this.pos.x = minX;
            if (this.pos.x > maxX) this.pos.x = maxX;
            if (this.pos.y < minY) this.pos.y = minY;
            if (this.pos.y > maxY) this.pos.y = maxY;
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
        // Sub-passos adaptativos: quanto mais rápida a bola, mais passos por frame
        let fastest = 0;
        for (let i = 0; i < balls.length; i++) {
            if (balls[i].active) fastest = Math.max(fastest, balls[i].vel.mag());
        }
        let needed = Math.ceil((fastest * dt) / GAME_CONFIG.PHYSICS.MAX_STEP_MOVE);
        let steps = Math.min(80, Math.max(GAME_CONFIG.PHYSICS.SUB_STEPS, needed));
        let subDt = dt / steps;

        for (let step = 0; step < steps; step++) {
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
                let hitSpeed = Math.abs(velAlongNormal);
                // normal aponta de b2 -> b1. "Seguir" (spin.y > 0) empurra a branca PARA FRENTE
                // (em direção à bola alvo); "puxar" (spin.y < 0) faz ela voltar.
                if (b1.id === 0 && b1.spin.magSq() > 0.01) {
                    b1.vel = b1.vel.sub(normal.mult(b1.spin.y * (hitSpeed * 0.45)));
                    b1.spin = b1.spin.mult(0.4); // dissipa spin
                } else if (b2.id === 0 && b2.spin.magSq() > 0.01) {
                    b2.vel = b2.vel.add(normal.mult(b2.spin.y * (hitSpeed * 0.45)));
                    b2.spin = b2.spin.mult(0.4);
                }

                // Efeito sonoro proporcional à velocidade física
                let hitVol = Math.min(1.0, Math.max(0.12, hitSpeed / 850));
                AudioEngine.playBallHit(hitVol);

                // Partículas de impacto se habilitado
                if (SaveSystem.data.settings.particles && hitVol > 0.35) {
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
                        let impactSpeed = Math.abs(vDotN);
                        if (b.id === 0 && Math.abs(b.spin.x) > 0.05) {
                            let tangent = new Vec2(-c.norm.y, c.norm.x);
                            b.vel = b.vel.add(tangent.mult(b.spin.x * (impactSpeed * 0.35)));
                            b.spin.x *= 0.5;
                        }

                        let hitVol = Math.min(1.0, Math.max(0.12, impactSpeed / 650));
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
                    b.vel = toCenter.mult(200);

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

    // Nome da equipe: em 2v2 mostra a dupla (ex.: "Jogador 1 e Jogador 3"); em 1v1 só o nome
    getTeamLabel(teamIndex) {
        if (this.players.length < 4) return (this.players[teamIndex] || { name: '' }).name;
        return this.players.filter((_, i) => i % 2 === teamIndex).map(p => p.name).join(' e ');
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
        } else {
            winnerName = `${winnerName} (${this.getTeamLabel(winnerTeamIndex)})`;
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
                        dist: ghostDist + pocketDist,
                        ghostDist: ghostDist,
                        pocketDist: pocketDist,
                        cutAngle: cutAngle
                    };
                }
            }
        }

        // Se não achou caçapa viável, dá um toque de segurança em qualquer bola
        let finalAngle = 0;
        let power = 45;

        if (RulesSystem.breakShot) {
            // Tacada de abertura (Break): quebra potente no centro do rack
            let ball1 = GameCore.balls.find(b => b.id === 1);
            if (ball1) {
                finalAngle = ball1.pos.sub(cueBall.pos).heading();
            }
            power = 92 + Math.floor(Math.random() * 8); // 92% a 100%
        } else if (bestShot) {
            finalAngle = bestShot.angle;
            // Física: com arrasto exponencial a velocidade cai linearmente com a distância (v = v0 - k*d).
            // Calcula a velocidade necessária para a branca chegar na bola alvo e empurrá-la até a caçapa.
            let k = GameCore.dragPerDistance();
            let cutFactor = Math.max(0.35, Math.cos(bestShot.cutAngle));
            let needSpeed = k * bestShot.ghostDist + (k * bestShot.pocketDist + 140) / cutFactor;
            power = GameCore.speedToPercent(needSpeed / (GameCore.equippedCue.powerMod || 1.0));
            power = Math.min(88, Math.max(14, Math.round(power)));
            // Pequena imprecisão de força nas dificuldades baixas
            let powerNoise = diff === 1 ? 12 : diff === 2 ? 7 : diff === 3 ? 3 : 1;
            power = Math.max(10, Math.min(95, Math.round(power + (Math.random() - 0.5) * powerNoise)));
        } else if (candidateBalls.length > 0) {
            let randomTarget = candidateBalls[0];
            finalAngle = randomTarget.pos.sub(cueBall.pos).heading();
            power = 38;
        }

        // Aplica margem de erro baseada na dificuldade
        let errorSpread = 0.16; // Fácil: ~9 graus
        if (diff === 2) errorSpread = 0.07; // Média: ~4 graus
        if (diff === 3) errorSpread = 0.025; // Difícil: ~1.4 graus
        if (diff === 4) errorSpread = 0.005; // Mestre: quase milimétrico

        finalAngle += (Math.random() - 0.5) * errorSpread;

        // Animação natural da IA mirando e puxando o taco antes de tacar
        let startAim = GameCore.aimAngle;
        let startTime = performance.now();
        let animDuration = 900;

        function animateAim(now) {
            let elapsed = now - startTime;
            let progress = Math.min(1.0, elapsed / animDuration);
            // Interpolação suave de mira
            GameCore.aimAngle = startAim + (finalAngle - startAim) * progress;

            // IA puxa o taco visualmente para a força calculada
            GameCore.power = Math.round(power * progress);
            GameCore.updatePowerUI();

            if (progress < 1.0) {
                requestAnimationFrame(animateAim);
            } else {
                // Pausa sutil antes de desferir a tacada
                const fire = () => {
                    // Se a partida foi pausada no meio da jogada da IA, espera retomar
                    if (GameCore.state === 'PAUSED') { setTimeout(fire, 300); return; }
                    GameCore.shoot(power, 0, 0);
                    AIBrain.isThinking = false;
                };
                setTimeout(fire, 200);
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
    strike: null,          // Animação da tacada (taco batendo na bola)
    lastFrameTime: 0,
    equippedCue: CUE_CATALOG[0],
    equippedScenario: BACKGROUNDS[0],

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

        // Mesa um pouco menor em telas grandes para o cenário de fundo aparecer ao redor (telas pequenas mantêm a mesa grande)
        let fill = Math.min(this.w, this.h) < 520 ? 0.88 : 0.70;
        if (screenRatio > targetRatio) {
            this.scale = (this.h * fill) / (GAME_CONFIG.TABLE.HEIGHT + 80);
        } else {
            this.scale = (this.w * Math.min(0.96, fill + 0.04)) / (GAME_CONFIG.TABLE.WIDTH + 80);
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

    /* ── SISTEMA DE FORÇA ──────────────────────────────────────
       A barra trabalha em PORCENTAGEM (0-100). Aqui ela vira velocidade real (px/s):
       velocidade = MAX_SPEED * (porcentagem/100) ^ POWER_EXPONENT                */
    powerToSpeed(percent) {
        let f = Math.max(0, Math.min(100, percent)) / this.maxPower;
        return GAME_CONFIG.PHYSICS.MAX_SPEED * Math.pow(f, GAME_CONFIG.PHYSICS.POWER_EXPONENT);
    },

    speedToPercent(speed) {
        let f = Math.max(0, speed) / GAME_CONFIG.PHYSICS.MAX_SPEED;
        return Math.min(100, Math.pow(f, 1 / GAME_CONFIG.PHYSICS.POWER_EXPONENT) * this.maxPower);
    },

    // Quanta velocidade a bola perde por px andado (arrasto exponencial: dv/dx = -k)
    dragPerDistance() {
        return -Math.log(GAME_CONFIG.BALLS.DRAG) * 60;
    },

    // Só o jogador humano da vez, com a mesa na tela, pode controlar a tacada
    canHumanControl() {
        if (this.state !== 'AIMING') return false;
        if (RulesSystem.getCurrentPlayer().isAI) return false;
        if (document.getElementById('game-hud').style.display !== 'block') return false;
        if (getComputedStyle(document.getElementById('pass-turn-modal')).display !== 'none') return false;
        return true;
    },

    // Define a força (0-100) e atualiza barra, marcador e texto de uma vez só
    setPower(percent) {
        this.power = Math.max(0, Math.min(this.maxPower, percent));
        this.updatePowerUI();
    },

    // Inicia a tacada: o taco avança rápido e, no contato, a bola recebe a velocidade
    shoot(powerPercent, spinX = 0, spinY = 0) {
        if (this.state !== 'AIMING') return;

        let white = this.balls[0];
        if (!white || !white.active) return;

        let pct = Math.max(GAME_CONFIG.PHYSICS.MIN_SHOT_PERCENT, Math.min(this.maxPower, powerPercent));
        this.strike = { pct: pct, spinX: spinX, spinY: spinY, t: 0, dur: 0.12 };
        this.isDraggingPower = false;
        this.state = 'STRIKING';
        this.setPower(pct);
    },

    // Contato do taco com a bola: aplica a velocidade física real
    applyShot() {
        let st = this.strike;
        this.strike = null;
        let white = this.balls[0];
        if (!st || !white || !white.active) { this.state = 'AIMING'; return; }

        let cueMod = this.equippedCue.powerMod || 1.0;
        let spinMod = this.equippedCue.spinMod || 1.0;
        let speed = this.powerToSpeed(st.pct) * cueMod;

        white.vel = new Vec2(Math.cos(this.aimAngle) * speed, Math.sin(this.aimAngle) * speed);
        white.spin.set(st.spinX * spinMod, st.spinY * spinMod);

        let ratio = st.pct / this.maxPower;
        AudioEngine.playCueShot(ratio);
        EffectsEngine.spawnChalkDust(white.pos.x, white.pos.y, this.aimAngle);
        EffectsEngine.triggerShake(ratio * ratio * 14 * cueMod);

        this.state = 'ROLLING';
        RulesSystem.whiteInHand = false;
        this.setPower(0);
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

        // Barra de Força Lateral (arraste, e solte para tacar)
        const powerTrack = document.getElementById('power-track');
        let dragPower = (clientY) => {
            let rect = powerTrack.getBoundingClientRect();
            let p = 1.0 - (clientY - rect.top) / rect.height;
            p = Math.max(0, Math.min(1, p));
            this.setPower(p * this.maxPower);
        };

        let startPowerDrag = (clientY) => {
            if (!this.canHumanControl()) return;
            this.isDraggingPower = true;
            dragPower(clientY);
        };

        // Soltar: tacada se passou do mínimo; senão cancela (clique acidental)
        let releasePower = () => {
            if (!this.isDraggingPower) return;
            this.isDraggingPower = false;
            if (!this.canHumanControl()) { this.setPower(0); return; }
            if (this.power >= GAME_CONFIG.PHYSICS.MIN_SHOT_PERCENT) {
                this.shoot(this.power, this.spin.x, this.spin.y);
            } else {
                this.setPower(0);
            }
        };

        powerTrack.addEventListener('mousedown', (e) => { e.preventDefault(); startPowerDrag(e.clientY); });
        window.addEventListener('mousemove', (e) => { if (this.isDraggingPower) dragPower(e.clientY); });
        window.addEventListener('mouseup', releasePower);

        powerTrack.addEventListener('touchstart', (e) => { e.preventDefault(); startPowerDrag(e.touches[0].clientY); }, { passive: false });
        window.addEventListener('touchmove', (e) => { if (this.isDraggingPower) dragPower(e.touches[0].clientY); }, { passive: false });
        window.addEventListener('touchend', releasePower);
        window.addEventListener('touchcancel', () => { this.isDraggingPower = false; this.setPower(0); });

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
            // Não interfere quando o jogador está digitando (ex.: nome no perfil) ou fora da partida
            let tag = (e.target && e.target.tagName) || '';
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            if (!this.canHumanControl()) return;

            if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                this.aimAngle -= 0.025;
            } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                this.aimAngle += 0.025;
            } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
                this.setPower(this.power + 2);
                e.preventDefault();
            } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
                this.setPower(this.power - 2);
                e.preventDefault();
            } else if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                // Sem força definida: tacada leve padrão de 25%
                let p = this.power >= GAME_CONFIG.PHYSICS.MIN_SHOT_PERCENT ? this.power : 25;
                this.shoot(p, this.spin.x, this.spin.y);
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
        let pct = Math.max(0, Math.min(100, (this.power / this.maxPower) * 100));
        document.getElementById('power-fill').style.height = pct + '%';
        document.getElementById('power-knob').style.bottom = pct + '%';
        document.getElementById('power-percent-txt').innerText = Math.round(pct) + '%';
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

        if (this.state === 'STRIKING' && this.strike) {
            this.strike.t += dt;
            if (this.strike.t >= this.strike.dur) this.applyShot();
        }

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
        // Fundo do cenário (a mesa abaixo nunca muda)
        drawBackground(this.ctx, this.equippedScenario.id, this.w, this.h, performance.now() / 1000);

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
        // Sombra projetada da mesa sobre o cenário (fica atrás da mesa; a mesa em si não muda)
        this.ctx.save();
        this.ctx.shadowColor = 'rgba(0,0,0,0.6)'; this.ctx.shadowBlur = 40; this.ctx.shadowOffsetY = 14;
        this.ctx.fillStyle = '#000'; this.ctx.beginPath(); this.ctx.roundRect(-24, -24, GAME_CONFIG.TABLE.WIDTH + 48, GAME_CONFIG.TABLE.HEIGHT + 48, 16); this.ctx.fill();
        this.ctx.restore();
        TableRenderer.draw(this.ctx, TABLE_THEME);

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
        if ((this.state === 'AIMING' || this.state === 'STRIKING') && !this.isDraggingWhite) {
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

    // Taco: usa a função única drawCue (recua com a força e avança até encostar na bola)
    drawCueStick() {
        let white = this.balls[0];
        if (!white || !white.active) return;
        let pull = 24 + (this.power / this.maxPower) * 75;
        if (this.state === 'STRIKING' && this.strike) {
            let t = Math.min(1, this.strike.t / this.strike.dur);
            let s0 = 24 + (this.strike.pct / this.maxPower) * 75;
            pull = s0 + (15 - s0) * (t * t);
        }
        drawCue(this.ctx, this.equippedCue, white.pos.x, white.pos.y, this.aimAngle + Math.PI, pull, 1, performance.now() / 1000);
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
        if (this.state === 'ROLLING' || this.state === 'STRIKING') return;
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
        this.renderMatchOptions();
        UI.showScreen('screen-setup');
    },

    // Monta o seletor de cenário SÓ com os fundos que o jogador possui (+ padrão gratuito)
    renderMatchOptions() {
        const sel = document.getElementById('setup-scenario'), list = getAvailableBackgrounds();
        sel.innerHTML = list.map(b => `<option value="${b.id}">${b.nome}</option>`).join('');
        sel.value = resolveBackground(SaveSystem.data.equippedScenario).id;
        sel.onchange = () => this.previewBg();
        this.previewBg();
    },

    previewBg() {
        document.getElementById('setup-bg-preview').dataset.bg = document.getElementById('setup-scenario').value;
    },

    startMatch() {
        AudioEngine.playClick();
        this.aiDifficulty = parseInt(document.getElementById('setup-ai-diff').value) || 2;
        // Anti-burla: o fundo escolhido precisa estar comprado (ou ser o padrão)
        let foundScen = resolveBackground(document.getElementById('setup-scenario').value);
        GameCore.equippedScenario = foundScen;
        SaveSystem.data.equippedScenario = foundScen.id;
        SaveSystem.save();

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
    pending: null,

    switchTab(tab) {
        this.currentTab = tab;
        document.getElementById('tab-cues-btn').className = `shop-tab-btn ${tab === 'cues' ? 'active' : ''}`;
        document.getElementById('tab-scen-btn').className = `shop-tab-btn ${tab === 'scenarios' ? 'active' : ''}`;
        this.render();
    },

    isCues() { return this.currentTab === 'cues'; },
    findItem(id) { return (this.isCues() ? CUE_CATALOG : BACKGROUNDS).find(i => i.id === id); },
    priceOf(it) { return this.isCues() ? it.price : it.preco; },
    nameOf(it) { return this.isCues() ? it.name : it.nome; },
    isOwned(it) {
        const D = SaveSystem.data;
        return this.isCues() ? D.ownedCues.includes(it.id) : (it.preco === 0 || D.ownedScenarios.includes(it.id));
    },

    // Desenha a loja (Tacos / Cenários) com selos COMPRADO / EM USO
    render() {
        const D = SaveSystem.data, cues = this.isCues();
        document.getElementById('shop-coins-display').innerText = D.coins.toLocaleString('pt-BR');
        document.getElementById('shop-items-container').innerHTML = (cues ? CUE_CATALOG : BACKGROUNDS).map(it => {
            const price = this.priceOf(it), owned = this.isOwned(it);
            const eq = (cues ? D.equippedCue : D.equippedScenario) === it.id;
            let btn;
            if (eq) btn = `<button class="btn btn-gold" disabled style="width:100%;min-height:38px;font-size:13px;padding:6px;">EM USO</button>`;
            else if (owned) btn = `<button class="btn btn-secondary" style="width:100%;min-height:38px;font-size:13px;padding:6px;" onclick="ShopSystem.equip('${it.id}')">EQUIPAR</button>`;
            else if (D.coins < price) btn = `<button class="btn btn-secondary" disabled style="width:100%;min-height:38px;font-size:12px;padding:6px;opacity:.6;">Moedas insuficientes (faltam ${price - D.coins} $)</button>`;
            else btn = `<button class="btn btn-green" style="width:100%;min-height:38px;font-size:13px;padding:6px;" onclick="ShopSystem.askBuy('${it.id}')">COMPRAR (${price} $)</button>`;
            const seal = eq ? '<span class="shop-seal seal-use">EM USO</span>' : (owned && price > 0 ? '<span class="shop-seal">COMPRADO</span>' : '');
            const preview = cues
                ? `<canvas width="170" height="70" data-cue="${it.id}"></canvas>`
                : `<canvas width="170" height="70" data-bg="${it.id}"></canvas>`;
            const info = cues
                ? `<div class="shop-rarity-badge rarity-${it.rarity}">${it.rarity}</div><div style="font-size:11px;color:var(--text-muted);">Força ${Math.round(it.powerMod * 100)}% • Efeito ${Math.round(it.spinMod * 100)}% • Mira ${it.aimLen}</div>`
                : `<div style="font-size:11px;color:var(--text-muted);">${it.descricao}</div>`;
            return `<div class="shop-card ${eq ? 'equipped' : ''}">${seal}<div class="shop-item-preview">${preview}</div>
                <div class="shop-item-name">${this.nameOf(it)}</div>${info}
                <div style="font-weight:800;color:var(--gold);font-size:13px;">${price === 0 ? 'GRÁTIS' : price + ' $'}</div>${btn}</div>`;
        }).join('');
    },

    // Confirmação antes de comprar
    askBuy(id) {
        const it = this.findItem(id);
        if (!it || this.isOwned(it)) return; // sem compra duplicada
        this.pending = id;
        document.getElementById('buy-text').innerText = `Comprar "${this.nameOf(it)}" por ${this.priceOf(it)} moedas?`;
        document.getElementById('buy-ok').onclick = () => this.buy(id);
        document.getElementById('buy-modal').classList.add('show');
    },
    closeBuy() { this.pending = null; document.getElementById('buy-modal').classList.remove('show'); },

    // Compra: desconta, registra, salva e libera na hora (aparece nas opções de partida sem recarregar)
    buy(id) {
        this.closeBuy();
        const it = this.findItem(id), D = SaveSystem.data, price = it ? this.priceOf(it) : 0;
        if (!it || this.isOwned(it)) return;
        if (D.coins < price) { AudioEngine.playFoul(); UI.showNotice(`Moedas insuficientes! Faltam ${price - D.coins} $`); return; }
        D.coins -= price;
        if (this.isCues()) { D.ownedCues.push(id); D.equippedCue = id; GameCore.equippedCue = it; }
        else { D.ownedScenarios.push(id); D.equippedScenario = id; }
        SaveSystem.save();
        AudioEngine.playWin();
        UI.updateTopBar();
        this.render();
        UI.showNotice(this.isCues() ? "ITEM ADQUIRIDO COM SUCESSO!" : "Cenário desbloqueado! 🎉");
    },

    equip(id) {
        const it = this.findItem(id);
        if (!it || !this.isOwned(it)) return;
        if (this.isCues()) { SaveSystem.data.equippedCue = id; GameCore.equippedCue = it; }
        else SaveSystem.data.equippedScenario = id;
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
        let txt = `Vez de: ${playerName}`;
        if (RulesSystem.players.length === 4) txt += `\n(Dupla: ${RulesSystem.getTeamLabel(RulesSystem.getCurrentTeamIndex())})`;
        document.getElementById('pass-turn-player-name').innerText = txt;
        document.getElementById('pass-turn-modal').style.display = 'flex';
    },

    updateHUD() {
        if (!RulesSystem.players || RulesSystem.players.length < 2) return;

        let p1 = RulesSystem.players[0];
        let p2 = RulesSystem.players[1];

        // Atualiza nomes
        document.getElementById('hud-name-p1').innerText = RulesSystem.getTeamLabel(0);
        document.getElementById('hud-name-p2').innerText = RulesSystem.getTeamLabel(1);

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
    requestAnimationFrame((ts) => Thumbs.loop(ts));
});