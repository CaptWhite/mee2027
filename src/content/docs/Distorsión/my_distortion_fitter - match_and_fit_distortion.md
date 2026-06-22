# Descripción Teórica y Matemática de la Rutina `match_and_fit_distortion`

Este documento proporciona una descripción teórica y matemática detallada del funcionamiento de la rutina `match_and_fit_distortion` implementada en el módulo [my_distortion_fitter.py](file:///c:/Users/captw/workspaces/MEE2027/MEE2024.v6/Source/mee2024/_working3/my_distortion_fitter.py).

---

## Índice
1. [Introducción y Flujo General](#1-introducción-y-flujo-general)
2. [Solución Inicial de Placa y Manejo de Espejo](#2-solución-inicial-de-placa-y-manejo-de-espejo)
3. [Optimización de la Época y Búsqueda del Catálogo](#3-optimización-de-la-época-y-búsqueda-del-catálogo)
4. [Filtrado Astrométrico Robusto de Estrellas](#4-filtrado-astrométrico-robusto-de-estrellas)
   - [4.1 Detección de Estrellas Dobles (Confusion Filter)](#41-detección-de-estrellas-dobles-confusion-filter)
   - [4.2 Descarte de Movimiento Propio Incompleto](#42-descarte-de-movimiento-propio-incompleto)
   - [4.3 Criterio de Rechazo de Outliers Geométricos](#43-criterio-de-rechazo-de-outliers-geométricos)
5. [Ajuste de Distorsión de Segunda Pasada y Gravity Sweep](#5-ajuste-de-distorsión-de-segunda-pasada-y-gravity-sweep)
6. [Estructuración y Archivos de Salida](#6-estructuración-y-archivos-de-salida)
7. [Bibliografía y Referencias de Soporte](#7-bibliografía-y-referencias-de-soporte)

---

## 1. Introducción y Flujo General

La función `match_and_fit_distortion` es el punto de entrada de más alto nivel para el proceso de calibración de distorsiones geométricas instrumentales y refracción. Su objetivo principal es recibir los centroides en píxeles medidos en una imagen astrofotográfica y orquestar secuencialmente: la inicialización astrométrica, la búsqueda y emparejamiento de catálogo, el descarte robusto de estrellas contaminadas (binarias, sin movimiento propio u outliers de brillo), la estimación de época y deflexión física, y el cómputo final de la deformación óptica del plano focal.

---

## 2. Solución Inicial de Placa y Manejo de Espejo

Dada una matriz de $N$ centroides en píxeles detectados $(y_{obs, i}, x_{obs, i})$, el software ejecuta inicialmente un algoritmo de triangulación astronómica de triángulos estelares (`platesolve_triangle.platesolve`):

$$
\mathbf{q}_{rough} = \text{platesolve}(O, \text{image\_size})
$$


El resolvedor de placas reporta la posición aproximada en el cielo y si el plano focal ha sufrido una inversión especular (mirroring) debido a reflexiones ópticas intermedias en prismas o espejos del telescopio.

Si la bandera `mirror` es verdadera:
- Se realiza una transposición matemática de los ejes del sensor para alinear la quiralidad del detector con la del cielo:

$$
y_{obs, i} \longleftrightarrow x_{obs, i}
$$

- Se intercambian las dimensiones del sensor:

$$
H_{new} = W_{old}, \quad W_{new} = H_{old}
$$


Posteriormente, a partir de la estimación inicial $\mathbf{q}_{rough}$, se calculan los límites geográficos de las esquinas del sensor para circunscribir la región de búsqueda de estrellas en el catálogo Gaia:

$$
\mathbf{c}_{corners} = \text{transforms.to\_polar}(\text{transforms.linear\_transform}(\mathbf{q}_{rough}, \mathbf{x}_{corners}))
$$


---

## 3. Optimización de la Época y Búsqueda del Catálogo

Dado que el movimiento propio de las estrellas acumula un cambio de posición angular que crece linealmente con el tiempo, la calibración geométrica de alta precisión exige propagar las coordenadas celestes a la fecha de observación exacta.

Si la fecha no es conocida con precisión (`options['guess_date']` habilitado), el programa ejecuta un bucle de estimación estocástica:
1. Inicia con una fecha por defecto $t_0$ (típicamente '2020-01-01').
2. Realiza un primer emparejamiento con el catálogo Gaia mediante `match_centroids` a la época $t_0$.
3. Estima la época óptima de observación $t_{opt}$ minimizando los residuos mediante la subrutina `_date_guess`:

$$
t_{opt} = \arg\min_t \text{RMS}\left( \mathbf{e}(t) \right)
$$

4. Ejecuta un segundo emparejamiento a la fecha refinada $t_{opt}$, recalculando la posición aparente de catálogo de cada estrella por movimiento propio a la fecha corregida.

---

## 4. Filtrado Astrométrico Robusto de Estrellas

Para evitar sesgos y deformaciones artificiales en la superficie de distorsión ajustada causados por mediciones espurias o estrellas no aptas, `match_and_fit_distortion` implementa tres filtros estadísticos concurrentes.

### 4.1 Detección de Estrellas Dobles (Confusion Filter)

Las estrellas binarias visuales o las estrellas de fondo muy cercanas geométricamente en el cielo producen una superposición de sus perfiles de brillo (PSF - Point Spread Function) en el detector CCD/CMOS. Esto introduce un sesgo sistemático en el cálculo de sus centroides por ajuste gaussiano o centro de gravedad.

Para identificar estos casos, el software realiza una consulta radial en el catálogo Gaia DR3 (`my_gaia_search.lookup_nearby`) alrededor de cada estrella emparejada con un radio angular umbral $\Delta\theta_d$ (parámetro `options['double_star_cutoff']`, típicamente $10''$) y un límite de magnitud para la estrella secundaria $G_{lim}$ (`options['double_star_mag']`):

$$
\text{Vecinos}(i) = \left\{ \text{estrella } k \neq i \text{ en Gaia} \ \Big| \ \|\mathbf{v}_{cata, i} - \mathbf{v}_{cata, k}\|_2 \times \frac{180}{\pi} \times 3600 < \Delta\theta_d \ \land \ G_k < G_{lim} \right\}
$$


Si $\text{Vecinos}(i)$ no está vacío, la estrella se etiqueta con la bandera `flag_is_double = True`.

### 4.2 Descarte de Movimiento Propio Incompleto

Si una estrella reportada en el catálogo Gaia carece de la estimación de sus componentes de movimiento propio debido a limitaciones en las observaciones (lo cual se manifiesta como un valor no numérico `NaN` en los campos `pmra` o `pmdec`), la estrella se etiqueta con la bandera `flag_missing_pm = True`. Dado que no es posible realizar la propagación temporal del objeto a la época de observación, se descarta para evitar introducir distorsiones sistemáticas a largo plazo.

### 4.3 Criterio de Rechazo de Outliers Geométricos

Tras realizar un primer ajuste polinomial aproximado, se calculan los errores residuales en segundos de arco en el plano de proyección:

$$
e_i = \|\mathbf{v}_{obs, i} - \mathbf{v}_{cata, i}\|_2 \times \frac{180}{\pi} \times 3600
$$


Aquellas estrellas cuyo error residual supera la tolerancia permitida $\tau_{fit}$ (`options['distortion_fit_tol']`, típicamente $1.0''$) son marcadas como valores atípicos:

$$
\text{flag\_is\_outlier}(i) = (e_i \ge \tau_{fit})
$$


#### Criterio de Selección de Estrellas para el Ajuste Final
Si la opción `options['remove_double_tab2']` está habilitada, la máscara booleana de estrellas aceptadas para el reajuste final se define como la intersección lógica de la ausencia de todas las banderas anteriores:

$$
\text{keep}_i = \left( e_i < \tau_{fit} \right) \ \land \ \left( \neg\text{flag\_is\_double}(i) \right) \ \land \ \left( \neg\text{flag\_missing\_pm}(i) \right)
$$

De lo contrario, únicamente se filtran los outliers geométricos:

$$
\text{keep}_i = \left( e_i < \tau_{fit} \right)
$$


---

## 5. Ajuste de Distorsión de Segunda Pasada y Gravity Sweep

Una vez descartadas las estrellas contaminadas, el programa realiza el ajuste final de precisión utilizando el conjunto de observaciones depuradas:
1. **Barrido de Deflexión Activo:** Si `options['gravity_sweep']` es verdadero, se invoca a `gravity_sweep.gravity_sweep` para estimar el coeficiente óptimo de deflexión gravitacional $g$ mediante la optimización de Nelder-Mead sobre el conjunto limpio de estrellas.
2. **Ajuste Estándar:** Si el barrido está inactivo, se vuelve a ejecutar `distortion_polynomial.do_cubic_fit` sobre el conjunto estelar filtrado para estimar los coeficientes óptimos de distorsión final $\mathbf{c}_x, \mathbf{c}_y$ y los parámetros de placa refinados.

---

## 6. Estructuración y Archivos de Salida

Finalmente, el software guarda los datos de calibración en el disco rígido dentro de la estructura de subcarpetas creadas dinámicamente con marcas de tiempo en formato de texto JSON comprimido:
- `distortion_results.txt`: Archivo JSON que recopila los parámetros de placa ($\alpha_0, \delta_0, \theta, s$), errores cuadráticos medios finales (RMS), número de estrellas útiles, coeficientes de distorsión refinados y la incertidumbre de la escala.
- `CATALOGUE_MATCHED_ERRORS.csv`: Tabla CSV que detalla las posiciones de los píxeles brutos y corregidos, identificadores de Gaia celestes de referencia, errores de coincidencia individuales y marcas lógicas de filtrado.
- `Error_graphs.png`: Gráficos que caracterizan la distribución del error de calibración en segundos de arco en función de la magnitud de la estrella, su paralaje en el espacio y su posición radial en el sensor.

---

## 7. Bibliografía y Referencias de Soporte

1. **Gaia Collaboration, et al. (Vallenari, A., et al.) (2023).** *Gaia Data Release 3 - Summary of the content and properties of the release*. Astronomy & Astrophysics, 674, A1.
   - *Detalla el catálogo del cual se consultan y filtran las estrellas de referencia.*

2. **Lowe, D. G. (2004).** *Distinctive Image Features from Scale-Invariant Keypoints*. International Journal of Computer Vision, 60(2), 91-110.
   - *Describe los criterios generales de rechazo de coincidencia y confusión en imágenes digitales.*

3. **Budavari, T., & Szalay, A. S. (2008).** *Astrometric Matching with Bayesian Statistics*. The Astrophysical Journal, 679(1), 301-309.
   - *Soporte matemático sobre métodos estadísticos de emparejamiento estelar y rechazo de valores atípicos en catálogos celestes.*

4. **Dyson, F. W., Eddington, A. S., & Davidson, C. (1920).** *A Determination of the Deflection of Light by the Sun's Gravitational Field, from Observations Made at the Total Eclipse of May 29, 1919*. Philosophical Transactions of the Royal Society of London. Series A, 220, 291-333.
   - *Fundamento astrométrico histórico de la deflexión de la luz y el descarte de estrellas dobles/deformadas cerca del Sol.*
