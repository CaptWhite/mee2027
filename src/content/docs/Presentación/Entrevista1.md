## 1. La curvatura de la luz en la Relatividad General de Einstein

### El problema con Newton

La física newtoniana describía la gravedad como una *fuerza a distancia*: la Tierra atrae a la Luna, el Sol atrae a los planetas. Funcionaba perfectamente para objetos con masa. Pero la luz no tiene masa. ¿Cómo podría la gravedad afectarla?

La respuesta de Einstein fue radical: **la gravedad no es una fuerza, sino una curvatura del espacio-tiempo**.

### La idea clave: el espacio-tiempo como tejido

Imagina el espacio-tiempo como una membrana elástica extendida. Cuando colocas un objeto masivo (como el Sol) sobre ella, la membrana se deforma. Cualquier objeto que viaje por esa membrana —incluyendo la luz— seguirá la curvatura, no porque sea "atraído", sino porque el camino más recto posible en un espacio curvo ya no es una línea recta en el sentido euclidiano.

En relatividad general, ese camino más corto se llama **geodésica**. La luz siempre viaja por geodésicas. En el espacio vacío (sin masa), las geodésicas son líneas rectas. Cerca de una masa enorme, las geodésicas se curvan.

### La ecuación de Einstein

La teoría se resume en las **ecuaciones de campo de Einstein**:

$$
G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4} T_{\mu\nu}
$$

Traducido al lenguaje conceptual: **la geometría del espacio-tiempo (lado izquierdo) es determinada por la distribución de masa y energía (lado derecho)**. La masa le dice al espacio cómo curvarse; el espacio curvo le dice a la materia (y a la luz) cómo moverse.

### La predicción y su confirmación histórica

En 1915, Einstein predijo que la luz de estrellas lejanas debería desviarse al pasar cerca del Sol. La magnitud predicha era el doble de lo que habría predicho la mecánica newtoniana clásica: **1,75 segundos de arco**.

El 29 de mayo de 1919, durante un eclipse solar total, Arthur Eddington fotografió estrellas cuya luz pasaba rozando al Sol. Las posiciones observadas coincidían con la predicción de Einstein. Ese momento catapultó la relatividad general a la fama mundial.

### La lente gravitacional

Este fenómeno tiene consecuencias espectaculares. Cuando una galaxia masiva se interpone entre nosotros y una fuente de luz distante, actúa como una lente óptica: puede distorsionar, amplificar, e incluso duplicar la imagen de lo que hay detrás. Se observan anillos perfectos llamados **anillos de Einstein** cuando la alineación es exacta.

---

Aquí puedes explorar visualmente cómo una masa curva el espacio-tiempo y desvía la trayectoria de la luz:---

### ¿Qué observas en el simulador?

La línea discontinua gris es la trayectoria que seguiría la luz si no hubiera gravedad (línea recta). La línea verde es la trayectoria real, curvada por la masa central. La cuadrícula deformada representa el propio tejido del espacio-tiempo.

Al aumentar la masa, la curvatura es más pronunciada. Al acercar el rayo a la masa, la desviación es mayor (la luz roza el campo gravitacional más intenso). Esto tiene consecuencias directas en astrofísica: los agujeros negros curvan la luz de forma tan extrema que pueden atraparla por completo.

### Por qué esto es tan importante

La relatividad general no es solo teoría abstracta. El GPS que usas cada día requiere corregir los efectos relativistas del espacio-tiempo curvado por la Tierra. Los lentes gravitacionales permiten a los astrónomos "ver" materia oscura que no emite luz. Y la imagen del agujero negro M87, publicada en 2019 por el Event Horizon Telescope, es la confirmación visual más dramática de que la geometría del espacio-tiempo es física real.

---


  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: #f4f2eb;
      color: #2c2c2a;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem;
    }

    @media (prefers-color-scheme: dark) {
      body { background: #1a1a18; color: #c2c0b6; }
    }

    h1 {
      font-size: 1.3rem;
      font-weight: 500;
      margin-bottom: 0.3rem;
      text-align: center;
    }

    p.sub {
      font-size: 0.85rem;
      color: #73726c;
      text-align: center;
      margin-bottom: 1.5rem;
    }

    @media (prefers-color-scheme: dark) {
      p.sub { color: #9c9a92; }
    }

    canvas {
      width: 100%;
      max-width: 680px;
      border-radius: 12px;
      display: block;
    }

    .controls {
      width: 100%;
      max-width: 680px;
      margin-top: 1rem;
    }

    .ctrl {
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 8px 0;
      font-size: 13px;
      color: #73726c;
    }

    @media (prefers-color-scheme: dark) {
      .ctrl { color: #9c9a92; }
    }

    .ctrl label { min-width: 160px; }
    .ctrl input[type=range] { flex: 1; }
    .ctrl span {
      min-width: 38px;
      text-align: right;
      font-weight: 500;
      color: #2c2c2a;
    }

    @media (prefers-color-scheme: dark) {
      .ctrl span { color: #c2c0b6; }
    }

    #info {
      font-size: 12px;
      color: #9c9a92;
      margin-top: 0.75rem;
      text-align: center;
    }

    footer {
      margin-top: 2rem;
      font-size: 11px;
      color: #b4b2a9;
      text-align: center;
    }
  </style>

  <h1>Curvatura de la luz — Relatividad General</h1>
  <p class="sub">La cuadrícula deformada representa el espacio-tiempo curvo. La línea verde es la trayectoria real de la luz.</p>

  <div style="display: flex; justify-content: center; margin: 50px 0;">
  <canvas id="c" width="680" height="360"></canvas>
  </div>

  <div class="controls" >
    <div class="ctrl">
      <label>Posición de la estrella</label>
      <input type="range" id="offset" min="-56" max="-46" value="-46" step="1">
      <span id="offset-out">-69</span>
    </div>
    <p id="info">Arrastra el control para explorar la curvatura gravitacional de la luz</p>
  </div>

  <footer>Simulador educativo · Relatividad General de Einstein</footer>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const CX = W / 2, CY = H / 2;

    const dark = matchMedia('(prefers-color-scheme: dark)').matches;

    const COL = {
      bg:      dark ? '#1a1a18' : '#f4f2eb',
      grid:    dark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.45)',
      star:    dark ? 'rgba(255,255,255,0.55)' : 'rgba(60,60,60,0.35)',
      mass:    dark ? '#e0a840' : '#b07820',
      massGl:  dark ? 'rgba(224,168,64,0.18)' : 'rgba(176,120,32,0.12)',
      ray:     '#3B8BD4',
      deflect: '#1D9E75',
      deflG:   'rgba(29,158,117,0.18)',
      label:   dark ? '#9c9a92' : '#73726c',
      source:  '#d3cfcf',
      observer:'#d78a57',
    };

    function getMass()   { return 75; }
    function getOffset() { return +document.getElementById('offset').value; }

    <!-- comentar: Dibuja la cuadrícula deformada   -->
    function drawGrid() {
      ctx.strokeStyle = COL.grid;
      ctx.lineWidth = 0.5;
      const mass = getMass();
      const rows = 14, cols = 22;
      const gw = W / cols, gh = H / rows;

      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        for (let ci = 0; ci <= cols; ci++) {
          const x = ci * gw, y = r * gh;
          const dx = x - CX, dy = y - CY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pull = mass * 18 / Math.max(dist * dist * 0.002 + 30, 30); 
          const f = 1 - Math.min(dist / 250, 1);
          const px = x + (isNaN(dx/dist) ? 0 : dx / dist) * (-pull) * f;
          const py = y + (isNaN(dy/dist) ? 0 : dy / dist) * (-pull) * f;
          ci === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        for (let ri = 0; ri <= rows; ri++) {
          const x = c * gw, y = ri * gh;
          const dx = x - CX, dy = y - CY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const pull = mass * 18 / Math.max(dist * dist * 0.002 + 30, 30);
          const f = 1 - Math.min(dist / 250, 1);
          const px = x + (isNaN(dx/dist) ? 0 : dx / dist) * (-pull) * f;
          const py = y + (isNaN(dy/dist) ? 0 : dy / dist) * (-pull) * f;
          ri === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }

    function computeRay(mass, yOffset) {
      const pts = [];
      const steps = 300;
      let x = 0, y = CY + yOffset;
      let vx = 1, vy = 0;
      const G = mass * 0.1;
      const dt = W / steps;

      for (let i = 0; i <= steps; i++) {
        pts.push({ x, y });
        const dx = CX - x, dy = CY - y;
        const dist2 = dx * dx + dy * dy;
        const dist  = Math.sqrt(dist2);
        const force = G / Math.max(dist2, 800);
        const ax = force * dx / dist;
        const ay = force * dy / dist;
        vx += ax * dt * 0.8;
        vy += ay * dt * 0.8;
        const speed = Math.sqrt(vx * vx + vy * vy);
        vx /= speed; vy /= speed;
        x += vx * dt * 1.1;
        y += vy * dt * 1.1;
        if (x > W + 20) break;
      }
      return pts;
    }

    function drawRay(pts, color, glowColor) {
      if (pts.length < 2) return;
      ctx.save();
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 5;
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    function drawStraightRay(yOffset) {
      ctx.save();
      ctx.strokeStyle = COL.label;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 5]);
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(0, CY + yOffset);
      ctx.lineTo(W, CY + yOffset);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }

    function drawMass(mass) {
      const r = Math.sqrt(mass) * 4.4;
      const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, r * 3.5);
      g.addColorStop(0, dark ? 'rgba(224,168,64,0.35)' : 'rgba(176,120,32,0.25)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.beginPath(); ctx.arc(CX, CY, r * 3.5, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
      ctx.beginPath(); ctx.arc(CX, CY, r, 0, Math.PI * 2);
      ctx.fillStyle = COL.mass; ctx.fill();
      ctx.fillStyle = COL.label;
      ctx.font = '11px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Masa M', CX, CY + r + 14);
    }

    function drawStars() {
      [[30,40],[650,320],[60,290],[620,70],[20,180],[660,150]].forEach(([x,y]) => {
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = COL.star; ctx.fill();
      });
    }

    function drawTangent(pts) {
      if (pts.length < 2) return;
      const p1 = pts[pts.length - 2];
      const p2 = pts[pts.length - 1];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      if (len === 0) return;
      const tx = dx / len;
      const ty = dy / len;
      const srcX = 16;
      const t = (p2.x - srcX) / tx;
      const endY = p2.y - ty * t;

      ctx.save();
      ctx.strokeStyle = COL.source;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(p2.x, p2.y);
      ctx.lineTo(srcX, endY);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      ctx.fillStyle = COL.source;
      ctx.beginPath();
      ctx.arc(srcX, endY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '12px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillStyle = COL.source;
      ctx.fillText('Estrella aparente', 24, endY + 18);
    }

    function drawLabels(pts, yOffset) {
      ctx.font = '12px system-ui, sans-serif';

      ctx.fillStyle = COL.source;
      ctx.beginPath(); ctx.arc(16, CY + yOffset, 5, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = 'left';
      ctx.fillStyle = COL.source;
      ctx.fillText('Estrella', 24, CY + yOffset + 18);

      const lastPt = pts[pts.length - 1];
      const ey = lastPt ? lastPt.y : CY + yOffset;
      ctx.fillStyle = COL.observer;
      ctx.beginPath(); ctx.arc(W - 16, ey, 5, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = 'right';
      ctx.fillText('Observador', W - 24, ey - 8);

      ctx.textAlign = 'left';
      ctx.fillStyle = COL.label;
      ctx.globalAlpha = 0.55;
      ctx.fillText('trayectoria sin gravedad', W / 2 - 60, CY + yOffset - 6);
      ctx.globalAlpha = 1;
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = COL.bg;
      ctx.fillRect(0, 0, W, H);
      drawStars();
      drawGrid();
      const mass = getMass(), yOffset = getOffset();
      drawStraightRay(yOffset);
      const pts = computeRay(mass, yOffset);
      drawRay(pts, COL.deflect, COL.deflG);
      drawTangent(pts);
      drawMass(mass);
      drawLabels(pts, yOffset);
    }

    function update() {
      document.getElementById('offset-out').textContent = getOffset();
      draw();
    }

    document.getElementById('offset').addEventListener('input', update);

    draw();
  </script>
