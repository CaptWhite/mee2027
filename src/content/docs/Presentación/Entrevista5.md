## 5 Diferencias clave entre el experimento original y el MEE2027



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
