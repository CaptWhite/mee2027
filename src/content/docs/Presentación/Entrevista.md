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
  <div class="controls">
    <div class="ctrl">
      <label>Masa del objeto</label>
      <input type="range" id="mass" min="10" max="200" value="80" step="1">
      <span id="mass-out">80</span>
    </div>
    <div class="ctrl">
      <label>Posición del rayo</label>
      <input type="range" id="offset" min="-120" max="120" value="0" step="1">
      <span id="offset-out">0</span>
    </div>
    <p id="info">Arrastra los controles para explorar la curvatura gravitacional de la luz</p>
  </div>

  <footer>Simulador educativo · Relatividad General de Einstein · Archivo HTML autónomo</footer>

  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const CX = W / 2, CY = H / 2;

    const dark = matchMedia('(prefers-color-scheme: dark)').matches;

    const COL = {
      bg:      dark ? '#1a1a18' : '#f4f2eb',
      grid:    dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)',
      star:    dark ? 'rgba(255,255,255,0.55)' : 'rgba(60,60,60,0.35)',
      mass:    dark ? '#e0a840' : '#b07820',
      massGl:  dark ? 'rgba(224,168,64,0.18)' : 'rgba(176,120,32,0.12)',
      ray:     '#3B8BD4',
      deflect: '#1D9E75',
      deflG:   'rgba(29,158,117,0.18)',
      label:   dark ? '#9c9a92' : '#73726c',
      source:  '#D85A30',
      observer:'#534AB7',
    };

    function getMass()   { return +document.getElementById('mass').value; }
    function getOffset() { return +document.getElementById('offset').value; }

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
      const G = mass * 0.4;
      const dt = W / steps;

      for (let i = 0; i <= steps; i++) {
        pts.push({ x, y });
        const dx = CX - x, dy = CY - y;
        const dist2 = dx * dx + dy * dy;
        const dist  = Math.sqrt(dist2);
        const force = G / Math.max(dist2, 800);
        const ax = force * dx / dist;
        const ay = force * dy / dist;
        vx += ax * dt * 0.5;
        vy += ay * dt * 0.5;
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
      const r = Math.sqrt(mass) * 2.2;
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

    function drawLabels(pts, yOffset) {
      ctx.font = '12px system-ui, sans-serif';

      ctx.fillStyle = COL.source;
      ctx.beginPath(); ctx.arc(16, CY + yOffset, 5, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = 'left';
      ctx.fillStyle = COL.source;
      ctx.fillText('Fuente', 24, CY + yOffset - 8);
      ctx.fillStyle = COL.label;
      ctx.fillText('(estrella lejana)', 24, CY + yOffset + 18);

      const lastPt = pts[pts.length - 1];
      const ey = lastPt ? lastPt.y : CY + yOffset;
      ctx.fillStyle = COL.observer;
      ctx.beginPath(); ctx.arc(W - 16, ey, 5, 0, Math.PI * 2); ctx.fill();
      ctx.textAlign = 'right';
      ctx.fillText('Observador', W - 24, ey - 8);

      const straight = CY + yOffset;
      const delta = Math.round(Math.abs(ey - straight));
      if (delta > 2) {
        ctx.textAlign = 'center';
        ctx.fillStyle = '#1D9E75';
        ctx.fillText('↕ desviación: ' + delta + 'px', W - 110, (ey + straight) / 2);
      }

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
      drawMass(mass);
      drawLabels(pts, yOffset);
    }

    function update() {
      document.getElementById('mass-out').textContent = getMass();
      document.getElementById('offset-out').textContent = getOffset();
      draw();
    }

    document.getElementById('mass').addEventListener('input', update);
    document.getElementById('offset').addEventListener('input', update);

    draw();
  </script>

---


## 2. La predicción de Einstein y el experimento de Eddington (1919)

### El contexto: dos teorías en competencia

En 1915, Einstein terminó su Teoría General de la Relatividad y publicó una predicción concreta y verificable: la luz de una estrella lejana, al rozar el borde del Sol, debería desviarse exactamente 1,75 segundos de arco. Este número no era arbitrario; salía directamente de sus ecuaciones de campo.

Curiosamente, la física newtoniana también predecía una desviación, pero solo la mitad: 0,875 segundos de arco. Newton había calculado que, si la luz tuviera alguna "masa efectiva", el Sol la atraería. Einstein obtenía el doble porque su teoría incluye no solo la curvatura del espacio, sino también la curvatura del tiempo, y ambas contribuyen por igual. Había, pues, dos predicciones numéricamente distintas sobre el mismo fenómeno. El experimento podía falsificar una de las dos teorías.

El problema práctico era enorme: las estrellas cuya luz pasa cerca del Sol solo son visibles cuando el Sol se oscurece. Hace falta un eclipse solar total.

---

El diagrama siguiente muestra la geometría del experimento: cómo la posición aparente de una estrella cambia cuando su luz pasa cerca del Sol.### Arthur Eddington y la expedición de 1919

Arthur Eddington era el astrónomo más influyente de Gran Bretaña y uno de los primeros científicos occidentales que había comprendido la relatividad general en profundidad. Era también pacifista convencido, y ver a un científico alemán —Einstein— y a uno británico —él mismo— unir fuerzas en plena posguerra tenía para él una carga simbólica añadida.

El eclipse total del 29 de mayo de 1919 era perfecto: el Sol estaría exactamente delante de las Híades, un cúmulo estelar muy brillante. Habría decenas de estrellas de referencia en el campo visual. Eddington organizó dos expediciones simultáneas para minimizar el riesgo de fracaso por mal tiempo:

Una a Sobral, en el nordeste de Brasil, con un equipo del Observatorio de Greenwich, y otra a la isla de Príncipe, en el golfo de Guinea (África occidental), dirigida por él mismo. Llevar dos equipos a los confines del mundo era costoso y logísticamente formidable para la época, pero el Frank Dyson, Astrónomo Real de Gran Bretaña, consiguió financiación.

---

Aquí el cronograma del experimento, desde la predicción hasta la confirmación:### El día del eclipse y sus dificultades

El 29 de mayo de 1919, ambos equipos tuvieron solo unos seis minutos de eclipse total para fotografiar el campo estelar. Eddington, en la isla de Príncipe, pasó la mayor parte del eclipse luchando contra nubes que cubrían el cielo. Solo obtuvo 16 placas fotográficas utilizables, y de ellas únicamente dos mostraban estrellas con suficiente nitidez para medir. La medición resultante —1,61 ± 0,30 segundos de arco— era compatible con Einstein, aunque con gran incertidumbre.

El equipo de Sobral tuvo más suerte atmosférica, pero uno de sus telescopios sufrió una dilatación térmica inesperada que distorsionó las imágenes. Las mediciones del telescopio secundario de Sobral dieron 1,98 ± 0,12 segundos de arco. Combinando ambos resultados, el valor era incompatible con la predicción newtoniana de 0,875 segundos y consistente con la de Einstein.

### La reunión de la Royal Society

El 6 de noviembre de 1919, Dyson anunció los resultados ante la Royal Society de Londres. La sala estaba llena de los físicos más eminentes del mundo. Al terminar el anuncio, el filósofo Alfred North Whitehead escribió: "la atmósfera era como la de un drama griego". J.J. Thomson, descubridor del electrón y presidente de la sesión, declaró que era "uno de los resultados más importantes obtenidos en relación con la teoría de la gravitación desde que Newton formuló sus leyes".

Al día siguiente, el Times de Londres tituló en primera plana: "Revolución en la ciencia — Nueva teoría del universo — Ideas newtonianas desbancadas". Einstein se convirtió de la noche a la mañana en la figura científica más famosa del mundo.

### ¿Fue un experimento perfecto?

Con perspectiva histórica, hay que ser honestos: el experimento de Eddington fue significativo, pero sus márgenes de error eran considerables. Los historiadores de la ciencia han debatido si las mediciones eran suficientemente precisas para ser definitivas, y algunos sugieren que Eddington, convencido de la relatividad, descartó quizá demasiado fácilmente los datos del telescopio principal de Sobral que apuntaban a un valor intermedio entre Newton y Einstein.

Sin embargo, el experimento fue confirmado con mayor precisión en eclipses posteriores (1922, 1929, 1936…) y hoy la desviación gravitacional de la luz está medida con una precisión del 0,02% mediante técnicas de radioastronomía, coincidiendo perfectamente con la relatividad general. La conclusión de Eddington en 1919 era correcta; solo la precisión era limitada por la tecnología de la época.

Lo que sí fue incontestable fue su impacto cultural: convirtió la relatividad general, una teoría matemáticamente densa, en un hecho empírico comprobado, y a Einstein en el primer científico genuinamente célebre a escala mundial.

---

---
###  Interface gáfica de la aplicación - Find centroids

<div style="display: flex; justify-content: center; margin: 50px 0;">
    <img src="assets/eddington_timeline.svg" 
         alt="Haz clic para ampliar" 
         width="600">
</div>

---

## 3. Lo que hizo Eddington paso a paso

El experimento de Eddington es, en esencia, un problema de fotografía de precisión. La idea es sencilla de enunciar: fotografiar estrellas cuya luz roza el Sol durante un eclipse, y comparar esas posiciones con fotografías de las mismas estrellas tomadas de noche, meses antes, cuando el Sol no estaba en medio. Si Einstein tenía razón, las estrellas deberían aparecer ligeramente desplazadas hacia afuera respecto a su posición nocturna.

Aquí el proceso completo, paso a paso:### ¿Por qué Sobral y Príncipe dieron valores distintos?

Los dos equipos no obtuvieron el mismo número, y eso es importante entenderlo. En Príncipe, Eddington luchó contra nubes durante casi todo el eclipse y solo pudo medir dos estrellas con claridad suficiente. Con tan pocas estrellas, la incertidumbre estadística era grande (±0,30), lo que explica que el valor parezca algo bajo.

En Sobral el cielo estuvo despejado, pero el telescopio principal —el más preciso— sufrió una dilatación térmica inesperada: el espejo metálico se calentó con el sol matutino antes del eclipse y las imágenes quedaron ligeramente desenfocadas. Eddington y Dyson decidieron dar más peso a las mediciones del telescopio secundario de Sobral, que era de menor apertura pero no había sufrido ese problema, y que arrojó 1,98 ± 0,12.

Combinando ambos resultados la conclusión era clara: el valor newtoniano de 0,87 quedaba fuera de cualquier margen de error razonable, y el valor einsteiniano de 1,75 caía dentro. La relatividad general había pasado su primera prueba experimental.

### Lo que hizo Eddington realmente especial

Más allá de la logística, lo que Eddington aportó fue rigor metodológico en condiciones adversas. Viajó al otro lado del mundo con instrumentos delicados, instaló un observatorio de campaña en pocos días, fotografió un fenómeno de seis minutos de duración y luego pasó semanas midiendo manualmente desplazamientos de centésimas de milímetro en placas de vidrio. Eso, en 1919, sin ordenadores ni comparadores automáticos, representaba el límite absoluto de la precisión experimental alcanzable.

---
<div>
    <iframe 
      src="assets/3. eddington_steps.html"
      style="width: 100%; height: 100vh; border: none;" 
      title="Docker"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
</div>
---

## 4. En que consiste el proyecto MEE2027?

El proyecto se denomina MEE2027 (*Modern Eddington Experiment 2027*) y su objetivo es repetir el experimento de Eddington de 1919: medir la deflexión gravitacional de la luz estelar durante un eclipse total de Sol.

### Origen del proyecto

A mediados de 2024, un grupo de socios de ASTER (Agrupación Astronómica de Barcelona) inició el proyecto, motivados por la lectura de artículos sobre una experiencia similar realizada durante el eclipse de agosto de 2017 por el astrónomo aficionado americano Donald G. Bruns, publicada en *Sky & Telescope* con el título "A do-it-yourself Relativity Test".

Al incorporarse a un grupo internacional más amplio —con participantes de EE. UU., Portugal, Francia y España, tanto del mundo de la afición astronómica como del universitario— adoptaron el nombre MEE2027.

### ¿Qué lo diferencia del experimento original de 1919?

Los puntos diferenciales respecto al trabajo de 1919 son los siguientes: se propone realizar las medidas sobre imágenes digitales obtenidas con instrumental al alcance de aficionado; y la deflexión de la luz no se mide comparando fotos del eclipse con fotos tomadas meses antes, sino usando los datos del satélite Gaia —posiciones, movimientos propios, paralaje y velocidad radial— que permiten calcular la posición exacta de las estrellas con precisión suficiente para medir directamente la deflexión como diferencia entre la posición medida en las imágenes digitales y la posición calculada a partir de la literatura.

En otras palabras: Eddington necesitó viajar al otro lado del mundo meses antes para hacer fotografías de referencia nocturnas. El MEE2027 usa el catálogo estelar de Gaia como referencia, lo que simplifica enormemente la logística.

### La fórmula que quieren verificar

El valor teórico de la deflexión para una determinada estrella es D = 1,75 · R/R₀, donde R/R₀ es la distancia de la estrella al centro del Sol expresada en radios solares. Poder medir deflexiones de ese orden de magnitud significa trabajar con precisiones del orden de décimas de segundo de arco.

### Los tres pilares técnicos del proyecto

La preparación del proyecto se articula en tres partes: cálculos astrométricos (estudio de cambios de coordenadas y cálculo del polinomio astrométrico); tratamiento de imágenes (las estrellas cercanas al Sol no se ven por el resplandor de la corona solar y deben hacerse visibles con programas como PixInsight); y automatización de los procesos a realizar durante el eclipse.

### ¿Cuándo y dónde?

El experimento está planificado para ejecutarse en Egipto durante el eclipse total de Sol de 2027. Este eclipse del 2 de agosto de 2027 es particularmente favorable porque la franja de totalidad atraviesa el norte de África con una duración de hasta 6 minutos en algunos puntos, condiciones muy similares a las que tuvo Eddington en 1919.

### ¿Quién puede participar?

El proyecto invita a otras Agrupaciones Astronómicas españolas a unirse, y existe un grupo de comunicación internacional en groups.io abierto a profesores, astrónomos aficionados, estudiantes y prensa.

---

Es un proyecto que conecta directamente con todo lo que hemos visto hoy: cien años después, astrónomos aficionados intentan repetir el mismo experimento que cambió la física, pero ahora con una cámara digital, datos del satélite Gaia y software de procesado de imagen.

---

## Diferencias clave entre el experimento original y el MEE2027Aquí tienes la comparación completa y la explicación del catálogo Gaia:La diferencia más revolucionaria es la del catálogo Gaia, que merece una explicación aparte.

---

## El catálogo estelar Gaia: qué es y por qué cambia todo

Gaia es un telescopio espacial de la Agencia Espacial Europea (ESA) lanzado el 19 de diciembre de 2013 desde el puerto espacial de Kourou, en la Guayana Francesa. Su objetivo es construir el catálogo espacial tridimensional más grande y preciso jamás realizado, con aproximadamente mil millones de objetos astronómicos.

La misión Gaia ha producido el catálogo de estrellas más completo hasta la fecha, con mediciones de alta precisión de casi 1.700 millones de estrellas. Los datos incluyen posiciones, indicadores de distancia y movimientos de más de mil millones de estrellas.

### La precisión que lo hace único

El mapa obtenido tiene una precisión de 40 microsegundos de arco para las estrellas más brillantes, y de 700 microsegundos de arco para las más débiles, siendo el mapa del Universo más preciso obtenido hasta ahora.

Para entender lo que eso significa: un segundo de arco es 1/3600 de un grado. Un microsegundo de arco es la millonésima parte de ese segundo. Es como medir desde Barcelona la posición de una moneda en Madrid con un error menor que el grosor de un cabello.

Este nuevo catálogo es el doble de preciso y contiene casi 20 veces más estrellas que el referente astronómico anterior, el catálogo Hipparcos.

### Por qué Gaia elimina el problema central de Eddington

El mayor obstáculo logístico de 1919 era disponer de una referencia: saber dónde está cada estrella *sin* el Sol cerca. Eddington necesitó viajar meses antes a fotografiar el campo estelar de noche, en condiciones idénticas de instrumental. Cualquier diferencia entre ambas sesiones introducía error.

Los datos de Gaia —posiciones, movimientos propios, paralaje y velocidad radial— permiten calcular la posición exacta de las estrellas en la zona del eclipse con precisión suficiente como para poder medir directamente la deflexión de la luz como diferencia entre la posición medida sobre imágenes digitales y la posición calculada a partir de datos de la literatura.

En otras palabras: Gaia es la fotografía de referencia nocturna, pero tomada desde el espacio durante once años, con precisión imposible de alcanzar desde Tierra. El MEE2027 no necesita desplazarse meses antes ni comparar placas: compara sus imágenes del eclipse directamente con el catálogo.

### Qué contiene exactamente el catálogo para cada estrella

Para cada uno de los 1.700 millones de objetos catalogados, Gaia proporciona:

- Posición angular (ascensión recta y declinación) con precisión de microsegundos de arco
- Movimiento propio — hacia dónde se mueve la estrella y a qué velocidad en el plano del cielo
- Paralaje — de donde se deduce la distancia en años luz
- Velocidad radial — si se acerca o aleja de nosotros
- Temperatura superficial, color y luminosidad

Esos cinco datos juntos permiten al MEE2027 calcular exactamente dónde debería estar cada estrella el 2 de agosto de 2027 a la hora del eclipse, y compararlo con donde aparece en la fotografía real tomada con el Sol en medio. La diferencia es la deflexión gravitacional.

Después de once años de observaciones, la nave concluyó su misión y fue desplazada hacia una órbita de retiro alrededor del Sol. Pero su legado —el catálogo completo— está disponible en acceso abierto para cualquier investigador o aficionado del mundo, lo que hace posible proyectos como el MEE2027.

---

En resumen: Eddington necesitó dos expediciones al otro lado del mundo y meses de trabajo manual para obtener su referencia. El MEE2027 descarga esa misma referencia de internet, con una precisión mil veces mayor. Lo que no cambia es la física: la luz sigue curvándose exactamente los 1,75 segundos de arco que predijo Einstein.

---


  <style>
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--color-border-tertiary);border-radius:var(--border-radius-lg);overflow:hidden}
.cell{background:var(--color-background-primary);padding:14px 16px}
.header{background:var(--color-background-secondary);padding:10px 16px;font-size:12px;font-weight:500;color:var(--color-text-secondary);text-align:center}
.header.old{color:#854F0B}
.header.new{color:#085041}
.label{font-size:11px;color:var(--color-text-tertiary);margin-bottom:4px;text-transform:uppercase;letter-spacing:.04em}
.val{font-size:13px;color:var(--color-text-primary);line-height:1.5}
.val.old{color:#993C1D}
.val.new{color:#0F6E56}
.divider{background:var(--color-background-tertiary);padding:7px 16px;grid-column:1/-1;font-size:11px;font-weight:500;color:var(--color-text-tertiary);text-transform:uppercase;letter-spacing:.05em}
</style>

<h2 class="sr-only">Tabla comparativa entre el experimento de Eddington de 1919 y el proyecto MEE2027</h2>
<div class="grid">
  <div class="header old">Eddington 1919</div>
  <div class="header new">MEE2027 — 2027</div>

  <div class="divider">Referencia estelar</div>
  <div class="cell"><div class="label">Método</div><div class="val old">Fotografías nocturnas de las mismas estrellas meses antes del eclipse</div></div>
  <div class="cell"><div class="label">Método</div><div class="val new">Catálogo Gaia — posiciones calculadas con precisión submilisegundo de arco sin desplazarse</div></div>

  <div class="divider">Detección de luz</div>
  <div class="cell"><div class="label">Tecnología</div><div class="val old">Placas fotográficas de vidrio con emulsión de plata</div></div>
  <div class="cell"><div class="label">Tecnología</div><div class="val new">Sensores CCD digitales — al alcance de astrofotógrafo aficionado</div></div>

  <div class="divider">Medición del desplazamiento</div>
  <div class="cell"><div class="label">Instrumento</div><div class="val old">Micrómetro de tornillo manual sobre la placa de vidrio</div></div>
  <div class="cell"><div class="label">Instrumento</div><div class="val new">Software astrométrico (polinomio de distorsión óptica hasta grado 5)</div></div>

  <div class="divider">Precisión</div>
  <div class="cell"><div class="label">Margen de error</div><div class="val old">±0,12″ (Sobral) · ±0,30″ (Príncipe)</div></div>
  <div class="cell"><div class="label">Margen de error</div><div class="val new">Objetivo: décimas de segundo de arco — potencialmente mejor que 1919</div></div>

  <div class="divider">Logística</div>
  <div class="cell"><div class="label">Organización</div><div class="val old">Dos expediciones financiadas por el Estado — meses de preparación in situ</div></div>
  <div class="cell"><div class="label">Organización</div><div class="val new">Astrónomos aficionados coordinados internacionalmente — sin referencia previa en campo</div></div>

  <div class="divider">Procesado de datos</div>
  <div class="cell"><div class="label">Cálculo</div><div class="val old">Manual — semanas de medición con micrómetro estrella por estrella</div></div>
  <div class="cell"><div class="label">Cálculo</div><div class="val new">Automático — software de reducción astrométrica (PixInsight + scripts propios)</div></div>

  <div class="divider">Eclipse objetivo</div>
  <div class="cell"><div class="label">Fecha y lugar</div><div class="val old">29 mayo 1919 · Isla de Príncipe + Sobral (Brasil)</div></div>
  <div class="cell"><div class="label">Fecha y lugar</div><div class="val new">2 agosto 2027 · Egipto — hasta 6 min de totalidad</div></div>
</div>



---

## 6. Quién está involucrado en el MEE2027

El proyecto tiene una estructura de tres capas concéntricas: un núcleo impulsor, una red internacional activa y una comunidad abierta a cualquiera que quiera participar.

### El núcleo fundador — ASTER (Barcelona)

El grupo coordinador español está formado por socios de ASTER, Agrupación Astronómica de Barcelona: Jordi Blanca, Pedro Closas, Emilio Llorente, Esteve Pallarès y Rafael Quiles, que iniciaron el proyecto a mediados de 2024. Son astrónomos aficionados, no profesionales, lo que ya dice mucho del espíritu del proyecto.

### El inspirador técnico — Donald G. Bruns

El experimento moderno no habría sido posible sin el trabajo previo de Donald G. Bruns, astrónomo aficionado americano que realizó el experimento en solitario durante el eclipse de 2017 y publicó los resultados en revistas científicas revisadas por pares. Sus artículos son la hoja de ruta técnica que sigue el MEE2027.

### La red internacional activa

El grupo de comunicación internacional en groups.io/g/MEE2027 reúne a personas de EE. UU., Portugal, Francia y España, pertenecientes tanto al mundo de la afición astronómica como al universitario.

El grupo está dirigido a profesores, astrónomos aficionados, estudiantes y prensa para interactuar sobre la planificación y ejecución del Modern Eddington Experiment en Egipto en 2027.

### El antecedente directo — MEE2024

El experimento no nació de cero en 2027. El MEE fue realizado en 2017 y de nuevo en 2024 por los líderes del proyecto, y en ambos casos el experimento fue exitoso: los estudiantes lograron medir la curvatura del espacio obteniendo el coeficiente de Einstein.

Los tres equipos del experimento de 2024 contenían estudiantes, profesores y astrónomos aficionados de varios tipos de instituciones. La experiencia fue enriquecedora para todos, y el beneficio profesional para los estudiantes universitarios involucrados en este desafiante experimento no puede ser subestimado.

### La conexión con la física académica — AAPT

La American Association of Physics Teachers ha integrado el MEE2027 en su agenda. El taller organizado para su reunión de invierno de 2026 está diseñado para dar a los profesores la formación necesaria para preparar el eclipse de 2026 en España y los eclipses posteriores, con el objetivo de que sus estudiantes puedan contribuir a la historia de la física con el MEE2027 y MEE2028.

---

## El eclipse de 2026 como ensayo general — y la conexión española

Aquí hay un dato especialmente relevante dado que estamos en Barcelona: el MEE2027 ya está atrayendo participantes, incluyendo estudiantes y profesores de Portugal y España, para un ensayo durante el eclipse total del 12 de agosto de 2026.

El eclipse de 2026, desfavorable sobre todo por las horas en que ocurrirá (última hora del día) y la posición muy baja del Sol, se considera simplemente como una posibilidad de llevar a cabo algún ensayo.

La franja de totalidad de ese eclipse de 2026 pasa precisamente por el sur de España — Cádiz, Málaga, el Estrecho de Gibraltar — lo que convierte a equipos españoles en participantes naturales del ensayo previo al experimento definitivo.

---

## Cómo puedes participar — ciencia ciudadana real### Lo que hace al MEE2027 genuinamente especial como ciencia ciudadana

La mayoría de los proyectos de ciencia ciudadana piden contribuciones pasivas: clasificar imágenes, contar pájaros, reportar avistamientos. El MEE2027 es diferente en un sentido fundamental: los participantes no asisten a ver ciencia — ellos la hacen. El beneficio profesional para los estudiantes universitarios involucrados en este desafiante experimento no puede ser subestimado.

El resultado del experimento será una medición real, con su incertidumbre, de la deflexión gravitacional de la luz. Si el experimento tiene éxito, los participantes —aficionados, estudiantes, profesores— habrán contribuido a una verificación directa de la Relatividad General de Einstein, usando exactamente la misma geometría que usó Eddington en 1919, pero con instrumentos del siglo XXI.

El equipo coordinador español invita explícitamente a otras Agrupaciones Astronómicas a unirse al proyecto, considerando que sería interesante que a nivel español hubiera varios grupos implicados en esta experiencia de medida colectiva.

---


<style>
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
.cards{display:grid;grid-template-columns:1fr 1fr;gap:12px}
@media(max-width:500px){.cards{grid-template-columns:1fr}}
.card{border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:16px;background:var(--color-background-primary)}
.card-head{font-size:13px;font-weight:500;color:var(--color-text-primary);margin-bottom:6px}
.card-sub{font-size:12px;color:var(--color-text-secondary);line-height:1.6;margin-bottom:10px}
.tag{display:inline-block;font-size:11px;padding:2px 8px;border-radius:12px;margin:2px 2px 0 0}
.t-aficionado{background:#E1F5EE;color:#085041}
.t-estudiante{background:#EEEDFE;color:#3C3489}
.t-profesor{background:#FAEEDA;color:#633806}
.t-prensa{background:#FAECE7;color:#712B13}
@media(prefers-color-scheme:dark){
  .t-aficionado{background:#085041;color:#9FE1CB}
  .t-estudiante{background:#3C3489;color:#CECBF6}
  .t-profesor{background:#633806;color:#FAC775}
  .t-prensa{background:#712B13;color:#F5C4B3}
}
.link-row{margin-top:14px;padding-top:14px;border-top:0.5px solid var(--color-border-tertiary);font-size:13px;color:var(--color-text-secondary)}
.link-row a{color:var(--color-text-info);text-decoration:none}
.link-row a:hover{text-decoration:underline}
</style>
<h2 class="sr-only">Formas de participar en el proyecto MEE2027 según tu perfil</h2>

<div class="cards">

  <div class="card">
    <div class="card-head">Observación directa en Egipto</div>
    <div class="card-sub">Desplazarte a la franja de totalidad el 2 de agosto de 2027 con un telescopio portátil y cámara CCD monocromática. Es la contribución más valiosa: más equipos en más ubicaciones reducen el riesgo climático.</div>
    <span class="tag t-aficionado">Astrónomos aficionados</span>
    <span class="tag t-estudiante">Estudiantes</span>
  </div>

  <div class="card">
    <div class="card-head">Ensayo en el eclipse de 2026</div>
    <div class="card-sub">El eclipse del 12 agosto 2026 pasa por el sur de España (Cádiz, Málaga). Es el ensayo general del MEE2027 y la oportunidad de entrenarse en el procedimiento completo sin salir del país.</div>
    <span class="tag t-aficionado">Aficionados</span>
    <span class="tag t-estudiante">Estudiantes</span>
    <span class="tag t-profesor">Profesores</span>
  </div>

  <div class="card">
    <div class="card-head">Imágenes de calibración</div>
    <div class="card-sub">Obtener fotografías del campo estelar de las Híades en noches previas al eclipse, para validar el método astrométrico. No requiere desplazamiento y se puede hacer desde cualquier lugar con cielo oscuro.</div>
    <span class="tag t-aficionado">Astrofotógrafos</span>
  </div>

  <div class="card">
    <div class="card-head">Análisis de datos</div>
    <div class="card-sub">El procesado astrométrico de las imágenes (polinomio de distorsión, comparación con Gaia) es trabajo de software que puede hacerse desde casa. Se necesita gente con manejo de PixInsight o Python/astrometría.</div>
    <span class="tag t-estudiante">Estudiantes</span>
    <span class="tag t-profesor">Investigadores</span>
  </div>

  <div class="card">
    <div class="card-head">Colaboración universitaria</div>
    <div class="card-sub">El equipo español busca explícitamente contacto con universidades para resolver dudas técnicas pendientes y explorar el préstamo de instrumental especializado.</div>
    <span class="tag t-profesor">Profesores universitarios</span>
  </div>

  <div class="card">
    <div class="card-head">Difusión y comunicación</div>
    <div class="card-sub">El grupo internacional está abierto a la prensa. Divulgar el proyecto, documentarlo o cubrir el experimento en directo también es una forma de contribuir.</div>
    <span class="tag t-prensa">Prensa y divulgadores</span>
  </div>

</div>

<div class="link-row">
  Unirse al grupo internacional: <a href="https://groups.io/g/MEE2027" target="_blank">groups.io/g/MEE2027</a> &nbsp;·&nbsp;
  Web española: <a href="https://www.eclipse-spain.es/index.php/es/recursos-para-los-eclipses/proyecto-mee2027" target="_blank">eclipse-spain.es</a>
</div>

---

### El valor acumulativo: por qué 2027 y 2028 son irrepetibles

Los eclipses totales de 2027 y 2028 son ideales para repetir el experimento de Eddington y deberían permitir la medición de posiciones estelares en la "zona prohibida" —muy cerca del limbo solar—. Otros eclipses del siglo XXI no serán ni de lejos tan adecuados, de modo que si se pierden estas oportunidades, una replicación de alta precisión del experimento de Eddington podría postponerse décadas.

Esto introduce una urgencia real al proyecto. El eclipse de Luxor del 2 de agosto de 2027 ofrece seis minutos con el Sol en una posición alta sobre el horizonte y las Híades perfectamente situadas — una combinación que no volverá a darse en el siglo XXI. El MEE2027 no es solo valioso por lo que mide, sino por cuándo lo mide.

### Lo que el histórico de datos hace posible

Cada medición añadida a la serie histórica — 1919, los seis eclipses posteriores, Bruns en 2017, el MEE2024, y ahora el MEE2027 — no duplica lo anterior: lo refina. Los datos del MEE2024 están disponibles en moderneddingtonexperiment.org para que cualquier equipo del mundo pueda descargarlos, reproducir el análisis y comparar sus propios resultados con los obtenidos en México y Texas. Ese modelo de datos abiertos convierte cada experimento individual en un nodo de una red científica global, donde la reproducibilidad no es una aspiración sino la arquitectura del propio proyecto.

---


<style>
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
.tabs{display:flex;gap:4px;margin-bottom:16px;border-bottom:0.5px solid var(--color-border-tertiary);padding-bottom:0}
.tab{background:none;border:none;padding:8px 16px;font-size:13px;color:var(--color-text-secondary);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-0.5px;transition:color .15s,border-color .15s}
.tab.active{color:var(--color-text-primary);border-bottom-color:var(--color-text-primary);font-weight:500}
.panel{display:none}
.panel.active{display:block}
.row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
@media(max-width:480px){.row{grid-template-columns:1fr}}
.card{border:0.5px solid var(--color-border-tertiary);border-radius:var(--border-radius-lg);padding:14px;background:var(--color-background-primary)}
.card-title{font-size:13px;font-weight:500;color:var(--color-text-primary);margin-bottom:5px;display:flex;align-items:center;gap:6px}
.card-body{font-size:12px;color:var(--color-text-secondary);line-height:1.65}
.pill{display:inline-block;font-size:10px;padding:1px 8px;border-radius:10px;font-weight:500;margin-bottom:8px}
.p-hist{background:#EEEDFE;color:#3C3489}
.p-edu{background:#E1F5EE;color:#085041}
.p-cit{background:#FAEEDA;color:#633806}
@media(prefers-color-scheme:dark){
  .p-hist{background:#3C3489;color:#CECBF6}
  .p-edu{background:#085041;color:#9FE1CB}
  .p-cit{background:#633806;color:#FAC775}
}
.timeline{position:relative;margin:12px 0}
.tl-line{position:absolute;left:18px;top:8px;bottom:8px;width:1px;background:var(--color-border-secondary)}
.tl-item{display:flex;gap:12px;align-items:flex-start;margin-bottom:14px;position:relative}
.tl-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0;margin-top:3px;z-index:1;position:relative}
.tl-text{font-size:12px;color:var(--color-text-secondary);line-height:1.6}
.tl-year{font-size:11px;font-weight:500;color:var(--color-text-tertiary);margin-bottom:1px}
.highlight{color:var(--color-text-primary);font-weight:500}
.quote{border-left:2px solid var(--color-border-secondary);padding:8px 12px;margin:10px 0;font-size:12px;color:var(--color-text-secondary);line-height:1.65;border-radius:0 4px 4px 0;background:var(--color-background-secondary)}
</style>

<h2 class="sr-only">Tres dimensiones de valor del proyecto MEE2027: histórico de datos, reproducibilidad didáctica y ciencia ciudadana</h2>

<div class="tabs">
  <button class="tab active" onclick="go(0)"><i class="ti ti-database" aria-hidden="true"></i> Histórico de datos</button>
  <button class="tab" onclick="go(1)"><i class="ti ti-school" aria-hidden="true"></i> Valor didáctico</button>
  <button class="tab" onclick="go(2)"><i class="ti ti-users" aria-hidden="true"></i> Ciencia ciudadana</button>
</div>

<div id="panels">

<div class="panel active">
  <span class="pill p-hist">Dimensión histórica</span>
  <p style="font-size:13px;color:var(--color-text-primary);line-height:1.7;margin-bottom:12px">El MEE2027 no es solo un experimento aislado — es el eslabón más reciente de una cadena de mediciones que se extiende desde 1919 hasta hoy, y que colectivamente construyen la evidencia más sólida que tenemos de la relatividad general.</p>

  <div class="timeline">
    <div class="tl-line"></div>
    <div class="tl-item">
      <div class="tl-dot" style="background:#534AB7"></div>
      <div class="tl-text"><div class="tl-year">1919 · Eddington</div><span class="highlight">Sobral: 1,98 ± 0,12&quot; · Príncipe: 1,61 ± 0,30&quot;</span><br>Primera medición. Margen de error ~10%. Placas de vidrio, micrómetro manual. Resultado correcto pero límite de la tecnología de la época.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot" style="background:#888780"></div>
      <div class="tl-text"><div class="tl-year">1922–1973 · Seis eclipses adicionales</div>Solo ~10% de precisión en todos los casos. Las placas fotográficas no mejoraron lo suficiente para superar a Eddington de forma decisiva.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot" style="background:#0F6E56"></div>
      <div class="tl-text"><div class="tl-year">1995–hoy · Radioastronomía VLBI</div>Precisión del <span class="highlight">0,02%</span> usando radiofuentes cuásares. Confirma Einstein con exactitud de 5 decimales — pero con instrumental de millones de euros.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot" style="background:#BA7517"></div>
      <div class="tl-text"><div class="tl-year">2017 · Donald G. Bruns</div>Primer experimento exitoso con <span class="highlight">CCD digital y catálogo estelar moderno</span>. Resultado: 1,75 ± 0,05&quot; — dentro del 3% del valor teórico. Prueba de concepto para el MEE2027.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot" style="background:#D85A30"></div>
      <div class="tl-text"><div class="tl-year">2024 · MEE2024</div>Tres equipos en México y Texas. Resultado dentro del <span class="highlight">5% del valor aceptado</span>. Identifica el sensor ideal (ZWO ASI2600MM) y perfecciona el protocolo para 2027.</div>
    </div>
    <div class="tl-item">
      <div class="tl-dot" style="background:#185FA5"></div>
      <div class="tl-text"><div class="tl-year">2027 · MEE2027 — Egipto</div>Condiciones óptimas: <span class="highlight">6 min de totalidad en Luxor</span>, posición solar ideal, Híades bien situadas. Los mejores eclipses para este experimento en los próximos 100 años.</div>
    </div>
  </div>

  <div class="card" style="margin-top:4px">
    <div class="card-title"><i class="ti ti-archive" aria-hidden="true"></i> Datos abiertos en acceso público</div>
    <div class="card-body">Los datos del MEE2024 están disponibles en <strong>moderneddingtonexperiment.org</strong>. Cualquier investigador o estudiante puede descargar las imágenes crudas, los catálogos Gaia de referencia y los scripts de reducción astrométrica para reproducir el análisis completo. El MEE2027 seguirá el mismo modelo.</div>
  </div>
</div>

<div class="panel">
  <span class="pill p-edu">Dimensión educativa</span>
  <p style="font-size:13px;color:var(--color-text-primary);line-height:1.7;margin-bottom:12px">El MEE2027 es posiblemente el experimento de física más completo y pedagógicamente rico al que pueden acceder estudiantes de primer curso universitario — no para observarlo, sino para ejecutarlo.</p>

  <div class="row">
    <div class="card">
      <div class="card-title"><i class="ti ti-atom" aria-hidden="true"></i> Física fundamental real</div>
      <div class="card-body">Los estudiantes no simulan ni reproducen datos inventados. Miden la curvatura del espacio-tiempo con su propio telescopio. La física relativista no es abstracta — es un número que ellos mismos calculan.</div>
    </div>
    <div class="card">
      <div class="card-title"><i class="ti ti-chart-scatter" aria-hidden="true"></i> Estadística aplicada</div>
      <div class="card-body">El análisis exige calcular el polinomio astrométrico de distorsión óptica, propagar incertidumbres y combinar mediciones independientes. Es un curso de error experimental en contexto real.</div>
    </div>
    <div class="card">
      <div class="card-title"><i class="ti ti-code" aria-hidden="true"></i> Herramientas profesionales</div>
      <div class="card-body">Los estudiantes aprenden PixInsight para procesado de imágenes astronómicas y acceden al catálogo Gaia de la ESA — las mismas herramientas que usan los investigadores profesionales.</div>
    </div>
    <div class="card">
      <div class="card-title"><i class="ti ti-history" aria-hidden="true"></i> Historia de la ciencia viva</div>
      <div class="card-body">Repetir el mismo experimento que cambió la física en 1919 ancla la teoría en su contexto histórico. La relatividad general deja de ser una ecuación en una pizarra y se convierte en algo que ellos verifican.</div>
    </div>
  </div>

  <div class="quote">
    "El beneficio profesional para los estudiantes universitarios involucrados en este desafiante experimento no puede ser subestimado." — MEE2024 Results and Conclusions, Bulletin of the AAS (2025)
  </div>

  <div class="card">
    <div class="card-title"><i class="ti ti-calendar-event" aria-hidden="true"></i> El eclipse de 2026 como aula</div>
    <div class="card-body">La franja de totalidad del 12 de agosto de 2026 pasa por el sur de España — Cádiz y Málaga. La AAPT ya ofrece talleres de formación para que profesores lleven a sus estudiantes a observar ese eclipse como ensayo completo del MEE2027. Es una clase de física de campo, literalmente.</div>
  </div>
</div>

<div class="panel">
  <span class="pill p-cit">Dimensión ciudadana</span>
  <p style="font-size:13px;color:var(--color-text-primary);line-height:1.7;margin-bottom:12px">El MEE2027 representa lo que la ciencia ciudadana puede ser en su forma más ambiciosa: no recolección pasiva de datos, sino participación activa en la frontera del conocimiento.</p>

  <div class="row">
    <div class="card">
      <div class="card-title"><i class="ti ti-telescope" aria-hidden="true"></i> Instrumental al alcance</div>
      <div class="card-body">El MEE2024 demostró que el experimento es viable con una cámara CCD monocromática de aficionado (ZWO ASI2600MM, ~1.200€) y un telescopio portátil estándar. No hace falta un observatorio profesional.</div>
    </div>
    <div class="card">
      <div class="card-title"><i class="ti ti-map-pin" aria-hidden="true"></i> Distribución geográfica como ciencia</div>
      <div class="card-body">El MEE2024 aprendió que concentrar equipos en pocas ubicaciones es arriesgado. En 2027, más equipos distribuidos a lo largo de la franja egipcia mejoran estadísticamente el resultado y reducen el riesgo meteorológico.</div>
    </div>
    <div class="card">
      <div class="card-title"><i class="ti ti-git-pull-request" aria-hidden="true"></i> Datos abiertos para todos</div>
      <div class="card-body">Todas las imágenes y datos del experimento se publican en acceso abierto. Cualquier persona — investigador, estudiante o curioso — puede descargarlos y reproducir el análisis desde casa.</div>
    </div>
    <div class="card">
      <div class="card-title"><i class="ti ti-world" aria-hidden="true"></i> Red horizontal</div>
      <div class="card-body">El proyecto no tiene una institución financiadora central. Se coordina a través de groups.io, con participantes de EE. UU., Portugal, Francia y España, en pie de igualdad entre aficionados y académicos.</div>
    </div>
  </div>

  <div class="card" style="margin-top:4px">
    <div class="card-title"><i class="ti ti-sparkles" aria-hidden="true"></i> Lo que hace al MEE2027 diferente de la mayoría de ciencia ciudadana</div>
    <div class="card-body" style="line-height:1.8">La mayoría de proyectos de ciencia ciudadana son <strong>contributivos</strong>: el ciudadano recoge datos que un equipo profesional analiza. El MEE2027 es <strong>co-creativo</strong>: los participantes diseñan el protocolo, ejecutan el experimento, analizan los resultados y firman las publicaciones. La diferencia no es de grado — es de naturaleza.</div>
  </div>
</div>

</div>

<script>
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
function go(i) {
  tabs.forEach((t,j) => t.classList.toggle('active', i===j));
  panels.forEach((p,j) => p.classList.toggle('active', i===j));
}
</script>

---

## 8. Ensayo en 2026 y Objetivo 2027

La respuesta es una combinación de cinco factores físicos que hacen que los dos eclipses sean radicalmente distintos para los fines del experimento. Aquí la comparación técnica completa:### Por qué la altura del Sol lo determina casi todo

Este es el factor más técnico y el menos intuitivo, así que merece explicarse despacio.

Cuando la luz de una estrella llega a la Tierra, no viaja en línea recta a través de la atmósfera: se refracta. Y cuanto más baja está la estrella sobre el horizonte, más atmósfera atraviesa su luz y más se dobla su trayectoria aparente. Esto desplaza la posición aparente de las estrellas de manera irregular y difícil de calibrar. Para el MEE, donde hay que medir desplazamientos de 0,017 mm en una placa fotográfica, esa distorsión atmosférica es un ruido que puede enmascarar completamente la señal que se quiere detectar.

En el eclipse de 2027 en Luxor el Sol alcanzará una altura de 82° sobre el horizonte, lo que significa que la luz de las estrellas pasa por una columna de aire mínima, casi perpendicular a la superficie. En el eclipse de 2026 desde Madrid, el máximo se alcanzará a una altura de apenas 7,2 grados sobre el horizonte; desde Palma de Mallorca, la altura será de solo 2 grados. A 2° de altura, la refracción atmosférica puede desplazar la posición aparente de un objeto hasta 30 minutos de arco — diecisiete veces mayor que la señal que se busca medir.

### El problema añadido de la duración

La duración de la fase de totalidad del eclipse de 2026 variará desde 1 minuto 50 segundos hasta unos pocos segundos en los límites de la franja de totalidad. Con ese margen de tiempo, después de que los ojos se adapten a la oscuridad repentina, hay que verificar el enfoque, esperar que el autoguiado se estabilice y comenzar la secuencia de exposición. En la práctica, quedan 60–90 segundos de exposición útil. Para estadísticas robustas se necesitan decenas de imágenes de cada estrella: en 2026 simplemente no hay tiempo.

En Luxor, el eclipse total del 2 de agosto de 2027 comenzará a las 13:01 y el máximo ocurrirá a las 13:05, con el Sol a 82° de altura. Esos más de seis minutos permiten obtener cientos de fotogramas con múltiples tiempos de exposición, hacer varios intentos de calibración y aun así tener margen si algo falla al inicio.

### Lo que sí aporta el eclipse de 2026

Dado que el eclipse de 2026 es inútil para la medición científica, ¿por qué el MEE2027 lo incorpora como parte del proyecto? Por tres razones prácticas muy concretas.

Primera, es la única oportunidad antes del experimento real de ensayar el protocolo completo en condiciones de eclipse real — con la oscuridad repentina, el frío brusco, el cambio de seeing y la presión psicológica de tener solo minutos. No hay forma de simularlo en el laboratorio.

Segunda, permite verificar que el equipo mecánico —montura, telescopio, cámara, cables— no falla en campo. El MEE2024 descubrió que el telescopio principal de uno de los equipos de Sobral sufrió dilatación térmica inesperada: ese tipo de problema solo se detecta en condiciones reales.

Tercera, el MEE2027 ya está atrayendo participantes, incluyendo estudiantes y profesores de Portugal y España, para el ensayo durante el eclipse de 2026, que aunque no es útil para una determinación precisa de la deflexión por su baja posición sobre el horizonte, servirá bien como oportunidad de entrenamiento para el MEE2027.

En resumen: 2026 es la última clase antes del examen. El examen es 2027.

---

  <h2>Curvatura de la luz — Relatividad General</h1>
  <p class="sub">La cuadrícula deformada representa el espacio-tiempo curvo. La línea verde es la trayectoria real de la luz.</p>

<style>
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
.wrap{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--color-border-tertiary);border-radius:var(--border-radius-lg);overflow:hidden;margin-bottom:14px}
.col{background:var(--color-background-primary)}
.head{padding:10px 16px;font-size:12px;font-weight:500;text-align:center}
.h26{background:#EEEDFE;color:#3C3489}
.h27{background:#E1F5EE;color:#085041}
@media(prefers-color-scheme:dark){
  .h26{background:#3C3489;color:#CECBF6}
  .h27{background:#085041;color:#9FE1CB}
}
.row-g{display:contents}
.cell{padding:12px 16px;border-top:0.5px solid var(--color-border-tertiary);font-size:13px;color:var(--color-text-secondary);line-height:1.55}
.cell strong{color:var(--color-text-primary);font-weight:500}
.cat{padding:8px 16px;background:var(--color-background-secondary);font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.05em;color:var(--color-text-tertiary);grid-column:1/-1}
.bad{color:#993C1D}
.good{color:#0F6E56}
.neutral{color:#5F5E5A}

.bar-wrap{margin:4px 0 2px}
.bar-bg{height:8px;background:var(--color-border-tertiary);border-radius:4px;overflow:hidden}
.bar-fill{height:100%;border-radius:4px;transition:width .4s}
.bar-label{font-size:10px;color:var(--color-text-tertiary);margin-top:2px}
</style>

<h2 class="sr-only">Comparación técnica entre el eclipse de 2026 en España y el eclipse de 2027 en Egipto para el experimento MEE2027</h2>

<div class="card">
<div class="wrap">
  <div class="col head h26">Eclipse 12 agosto 2026 · España</div>
  <div class="col head h27">Eclipse 2 agosto 2027 · Egipto</div>

  <div class="cat">Duración de la totalidad</div>
  <div class="col cell">
    <strong class="bad">~1 min 50 seg</strong> en la línea central<br>
    <div class="bar-wrap"><div class="bar-bg"><div class="bar-fill" style="width:18%;background:#534AB7"></div></div><div class="bar-label">Pocos segundos para preparar instrumentos</div></div>
  </div>
  <div class="col cell">
    <strong class="good">6 min 23 seg</strong> en Luxor<br>
    <div class="bar-wrap"><div class="bar-bg"><div class="bar-fill" style="width:100%;background:#1D9E75"></div></div><div class="bar-label">Tiempo suficiente para exponer cientos de frames</div></div>
  </div>

  <div class="cat">Altura del Sol sobre el horizonte</div>
  <div class="col cell">
    <strong class="bad">7° en Madrid · 2° en Palma</strong><br>
    <span style="font-size:12px">Sol casi en el horizonte. Columna de aire atmosférico máxima → distorsión severa de posiciones estelares. Inútil para astrometría de precisión.</span>
  </div>
  <div class="col cell">
    <strong class="good">82° en Luxor</strong><br>
    <span style="font-size:12px">Sol prácticamente en el cénit. Mínima columna atmosférica → distorsión despreciable. Condición ideal para medir posiciones al nivel de décimas de segundo de arco.</span>
  </div>

  <div class="cat">Hora del día</div>
  <div class="col cell">
    <strong class="bad">20:32 hora local</strong><br>
    <span style="font-size:12px">Atardecer. Luz rasante, humedad y turbulencia térmica del terreno caldeado durante el día. El seeing astronómico es peor al anochecer.</span>
  </div>
  <div class="col cell">
    <strong class="good">13:05 hora local</strong><br>
    <span style="font-size:12px">Mediodía. Atmósfera desértica estable y seca. Probabilidad de cielo despejado muy alta en agosto en el alto Nilo.</span>
  </div>

  <div class="cat">Campo estelar disponible</div>
  <div class="col cell">
    <strong class="bad">Campo pobre</strong><br>
    <span style="font-size:12px">El Sol estará en Cáncer, una región con pocas estrellas brillantes cerca. Pocas referencias para el polinomio astrométrico.</span>
  </div>
  <div class="col cell">
    <strong class="good">Cúmulo de las Híades (Tauro)</strong><br>
    <span style="font-size:12px">Decenas de estrellas brillantes en el campo. Las mismas Híades que usó Eddington en 1919. Campo de referencia óptimo para astrometría.</span>
  </div>

  <div class="cat">Utilidad para el MEE</div>
  <div class="col cell">
    <strong class="neutral">Ensayo de protocolo</strong><br>
    <span style="font-size:12px">Permite probar el montaje completo: telescopio, cámara, secuencia de exposición, software de reducción. La medición científica será muy limitada o inútil.</span>
  </div>
  <div class="col cell">
    <strong class="good">Experimento definitivo</strong><br>
    <span style="font-size:12px">Todas las condiciones físicas son óptimas. El MEE2027 puede superar en precisión al experimento de Eddington de 1919 y alcanzar el nivel del MEE2017 de Bruns.</span>
  </div>
</div>
</div>

---

## 9. El Trío Ibérico de Eclipses (2026–2027–2028)

### Qué es y por qué es excepcional

Entre 2026 y 2028 España será escenario de una secuencia excepcional de fenómenos astronómicos conocida como Trío Ibérico de Eclipses, formada por dos eclipses solares totales y un eclipse solar anular.

Por término medio, el tiempo que tarda en repetirse un eclipse solar total en un mismo punto del globo es de 375 años. Las últimas veces en las que España disfrutó de eclipses solares totales fueron en 1860, 1870, 1900, 1905 y 1912. No habrá otro eclipse solar total en algún punto de España hasta 2053, y será el último en el siglo XXI.

La posibilidad de ver tres eclipses desde un mismo territorio a lo largo de tres años consecutivos no es una situación que se produzca con frecuencia. Menos aún cuando dos de ellos son totales.

Los tres eclipses son de naturaleza distinta, lo que los hace pedagógicamente complementarios. Aquí el mapa visual de cada uno:### Por qué un eclipse anular es diferente de uno total

Vale la pena entender la física detrás del eclipse de 2028, porque explica por qué no todos los eclipses solares son iguales aunque la geometría de alineación sea la misma.

La Luna no orbita la Tierra en un círculo perfecto sino en una elipse. Cuando está en su punto más cercano a la Tierra (perigeo), su disco aparente es lo bastante grande para cubrir completamente el Sol: eclipse total. Cuando está más lejos (apogeo), su disco aparente es algo menor que el del Sol: aunque se alineen perfectamente, el Sol asoma por los bordes formando el anillo de fuego: eclipse anular.

En el eclipse de 2028 la Luna estará un poco más lejos de la Tierra que en 2026 y 2027, por lo que es más pequeña aparentemente. Cuando se pone delante del Sol, no lo cubre entero, de tal forma que lo que se verá en el cielo es un anillo de fuego: el borde del Sol, como si de un anillo brillante se tratara.

### El alcance institucional: una respuesta de Estado

La excepcionalidad del fenómeno hizo que el Gobierno español reaccionara de forma inusual. El gobierno español publicó en el BOE de 30 de julio de 2025 el Real Decreto 686/2025, por el que se crea la Comisión Interministerial para la preparación, organización y coordinación de actuaciones relacionadas con el Trío de Eclipses 2026-2027-2028. No es nada habitual que se legisle sobre un evento astronómico.

En julio de 2025 se creó una Comisión Interministerial en la que participan trece ministerios, asistida a su vez por una Comisión Científica y de Asesoramiento del Trío de Eclipses. Entre los programas contemplados se encuentra el "Proyecto Globos: una visión estratosférica del eclipse", impulsado por la Federación de Asociaciones Astronómicas de España, que coordina a las diferentes agrupaciones participantes.

La web oficial del Gobierno —trioeclipses.es— centraliza información de seguridad, transporte, turismo y recursos educativos para los tres eventos. Es, en la práctica, el mayor dispositivo de divulgación científica coordinada que España ha puesto en marcha en décadas, movilizado precisamente por tres fenómenos celestes que coinciden sobre el mismo territorio en apenas dos años y medio.

### La conexión con todo lo que hemos visto

El Trío Ibérico no es solo un espectáculo astronómico. Para el MEE2027 y para la comunidad de ciencia ciudadana española, representa una ventana de oportunidad única: el eclipse de 2026 como ensayo técnico, el de 2027 como experimento definitivo, y el contexto institucional del Trío como plataforma de visibilidad para un proyecto que de otro modo quedaría relegado a un grupo pequeño de aficionados y académicos. La coincidencia geográfica e histórica convierte al MEE2027 en parte de algo mucho más grande.

---
<div>
    <iframe 
      src="assets/9. trio_iberico_eclipses.html"
      style="width: 100%; height: 140vh; border: none;" 
      title="Docker"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
</div>
---

