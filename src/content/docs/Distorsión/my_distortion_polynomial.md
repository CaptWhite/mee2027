# Descripción Teórica y Matemática de `my_distortion_polynomial.py`

Este documento proporciona una descripción formal, teórica y matemática del submódulo `my_distortion_polynomial.py`, el cual implementa los algoritmos de mínimos cuadrados ordinarios (OLS), cálculo de matrices de diseño polinomiales y de Legendre, absorción algebraica de parámetros de WCS (WCS Absorption) y estimación de la época de observación.

---

## Índice
- [Descripción Teórica y Matemática de `my_distortion_polynomial.py`](#descripción-teórica-y-matemática-de-my_distortion_polynomialpy)
  - [Índice](#índice)
  - [1. Introducción](#1-introducción)
  - [2. Formulación de Bases de Diseño](#2-formulación-de-bases-de-diseño)
    - [2.1 Polinomios Binomiales Clásicos](#21-polinomios-binomiales-clásicos)
    - [2.2 Polinomios Ortogonales de Legendre](#22-polinomios-ortogonales-de-legendre)
  - [3. Regresión Astrométrica por Mínimos Cuadrados Ordinarios (OLS)](#3-regresión-astrométrica-por-mínimos-cuadrados-ordinarios-ols)
    - [3.1 Ecuaciones Normales y Ajuste de Coeficientes](#31-ecuaciones-normales-y-ajuste-de-coeficientes)
    - [3.2 Soporte para Coeficientes Fijos (Fixed Coefficients)](#32-soporte-para-coeficientes-fijos-fixed-coefficients)
    - [3.3 Incertidumbres por Heterocedasticidad (HC0)](#33-incertidumbres-por-heterocedasticidad-hc0)
  - [4. Absorción de Parámetros Lineales en WCS (WCS Absorption)](#4-absorción-de-parámetros-lineales-en-wcs-wcs-absorption)
    - [4.1 Factor de Escala (Platescale)](#41-factor-de-escala-platescale)
    - [4.2 Centro de Placa (RA, Dec)](#42-centro-de-placa-ra-dec)
    - [4.3 Ángulo de Rotación (Roll)](#43-ángulo-de-rotación-roll)
  - [5. Algoritmo de Estimación de Época (Date Guessing)](#5-algoritmo-de-estimación-de-época-date-guessing)
  - [6. Interpolación y Apertura de Archivos de Calibración](#6-interpolación-y-apertura-de-archivos-de-calibración)
  - [7. Referencia de la API](#7-referencia-de-la-api)
    - [Clases y Funciones Principales](#clases-y-funciones-principales)
      - [1. `get_basis(y, x, w, m, options, use_special=False)`](#1-get_basisy-x-w-m-options-use_specialfalse)
      - [2. `_cubic_helper(q, plate, target, w, m, fix_coeff_x, fix_coeff_y, options, use_special=False, weights=1)`](#2-_cubic_helperq-plate-target-w-m-fix_coeff_x-fix_coeff_y-options-use_specialfalse-weights1)
      - [3. `apply_corrections(q, plate, coeff_x, coeff_y, img_shape, options)`](#3-apply_correctionsq-plate-coeff_x-coeff_y-img_shape-options)
      - [4. `do_cubic_fit(plate, stardata, initial_guess, img_shape, options, weights=1)`](#4-do_cubic_fitplate-stardata-initial_guess-img_shape-options-weights1)
  - [8. Bibliografía y Referencias de Soporte](#8-bibliografía-y-referencias-de-soporte)

---

## 1. Introducción

El script [my_distortion_polynomial.py](file:///c:/Users/captw/workspaces/MEE2027/MEE2024.v6/Source/mee2024/_working3/my_distortion_polynomial.py) contiene el núcleo de cómputo numérico del estimador de distorsiones. Su propósito es ajustar coeficientes de distorsión geométrica en el plano del sensor a partir de vectores de error residual en píxeles. A través de un bucle iterativo, separa las correcciones lineales puras (que pertenecen a los parámetros astrométricos globales) de las aberraciones ópticas de alto orden (que se retienen como distorsión polinomial).

---

## 2. Formulación de Bases de Diseño

Para modelar la distorsión, las coordenadas de los píxeles en el detector $(y_{obs}, x_{obs})$ se normalizan con respecto a un factor de escala espacial $w$:

$$
w = \frac{\max(\text{img\_shape})}{2}
$$

Este paso de normalización asegura que el rango de entrada para el ajuste polinomial esté acotado aproximadamente en el intervalo $[-1, 1]$, evitando desbordamientos numéricos y mejorando la estabilidad de la inversión de matrices.

### 2.1 Polinomios Binomiales Clásicos

Para una orden de distorsión $d$ (representado en el código por la clave `options['distortionOrder']`), la base polinomial se compone de monomios bidimensionales de la forma:

$$
\Phi_{i, j}(x, y) = \frac{y^j x^{i-j}}{w^i} \quad \text{donde } i \in [1, d], \ j \in [0, i]
$$


El número total de términos no constantes $M$ viene dado por:

$$
M = \frac{(d+2)(d+1)}{2} - 1
$$


Por ejemplo, para un ajuste cúbico ($d = 3$), la base de diseño de una estrella se compone de $M = 9$ términos:

$$
\mathbf{B}_{poly}(x, y) = \left[ \frac{x}{w}, \frac{y}{w}, \frac{x^2}{w^2}, \frac{xy}{w^2}, \frac{y^2}{w^2}, \frac{x^3}{w^3}, \frac{x^2y}{w^3}, \frac{xy^2}{w^3}, \frac{y^3}{w^3} \right]^T
$$


### 2.2 Polinomios Ortogonales de Legendre

Si la base binomial sufre de alta colinealidad (que infla los errores estándar de los coeficientes), se utiliza la base ortogonal de Legendre. Utilizando los polinomios clásicos de Legendre $L_k(u)$ generados por la relación de recurrencia:

$$
L_0(u) = 1, \quad L_1(u) = u, \quad L_{k+1}(u) = \frac{2k+1}{k+1} u L_k(u) - \frac{k}{k+1} L_{k-1}(u)
$$


La base bidimensional se expresa como:

$$
\Phi_{i, j}^{Legendre}(x, y) = L_j\left(\frac{y}{w}\right) L_{i-j}\left(\frac{x}{w}\right) \frac{1}{w^i}
$$


---

## 3. Regresión Astrométrica por Mínimos Cuadrados Ordinarios (OLS)

### 3.1 Ecuaciones Normales y Ajuste de Coeficientes

Sea $\mathbf{X}$ la matriz de diseño de dimensiones $N \times (M+1)$ construida evaluando los centroides de $N$ estrellas en la base seleccionada, añadiendo una columna de unos en la primera posición para modelar el intercepto constante:

$$
\mathbf{X} = \begin{pmatrix} 1 & B_{1}(x_1, y_1) & \dots & B_{M}(x_1, y_1) \\ 1 & B_{1}(x_2, y_2) & \dots & B_{M}(x_2, y_2) \\ \vdots & \vdots & \ddots & \vdots \\ 1 & B_{1}(x_N, y_N) & \dots & B_{M}(x_N, y_N) \end{pmatrix}
$$


Los vectores de error observados en el detector se definen como la diferencia entre la proyección lineal del catálogo celestes detransformados y los centroides medidos:

$$
\mathbf{e}_x = \mathbf{x}_{detransformed} - \mathbf{x}_{obs} \in \mathbb{R}^N
$$

$$
\mathbf{e}_y = \mathbf{y}_{detransformed} - \mathbf{y}_{obs} \in \mathbb{R}^N
$$

El ajuste por mínimos cuadrados ordinarios estima los coeficientes óptimos $\mathbf{c}_x$ y $\mathbf{c}_y$ resolviendo las ecuaciones normales:

$$
\mathbf{c}_x = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T (\mathbf{e}_x \cdot m)
$$

$$
\mathbf{c}_y = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T (\mathbf{e}_y \cdot m)
$$
donde $m$ es un factor de escala de normalización de placa (fijado típicamente en $1$).

### 3.2 Soporte para Coeficientes Fijos (Fixed Coefficients)

Cuando se realiza un ajuste híbrido en el cual los coeficientes de orden superior (por ejemplo, de grado 4 a 5) ya han sido calibrados y almacenados, la regresión lineal se realiza únicamente sobre los términos de menor orden (parámetros libres).

Si denotamos la base de diseño particionada en términos libres e independientes de dimensión $n_{free}$ y términos fijos o dependientes de dimensión $n_{fixed}$ tal que $n_{free} + n_{fixed} = M$:

$$
\mathbf{X} = [\mathbf{X}_{free} \ | \ \mathbf{X}_{fixed}]
$$


La rutina `_cubic_helper` resta el aporte de la distorsión ya conocida a los vectores de error observados para obtener errores corregidos fijos $\mathbf{e}^*_{x}$ y $\mathbf{e}^*_{y}$:

$$
\mathbf{e}^*_{x} = \mathbf{e}_x - \frac{\mathbf{X}_{fixed} \mathbf{c}_{x, fixed}}{m}
$$

$$
\mathbf{e}^*_{y} = \mathbf{e}_y - \frac{\mathbf{X}_{fixed} \mathbf{c}_{y, fixed}}{m}
$$

Posteriormente, el estimador calcula mediante regresión lineal ordinaria los coeficientes libres sobre la matriz reducida $\mathbf{X}_{free}$:

$$
\mathbf{c}_{x, free} = (\mathbf{X}_{free}^T \mathbf{X}_{free})^{-1} \mathbf{X}_{free}^T (\mathbf{e}^*_x \cdot m)
$$

$$
\mathbf{c}_{y, free} = (\mathbf{X}_{free}^T \mathbf{X}_{free})^{-1} \mathbf{X}_{free}^T (\mathbf{e}^*_y \cdot m)
$$

Los coeficientes de distorsión finales para cada eje corresponden a la concatenación de los coeficientes estimados y los fijos:

$$
\mathbf{c}_x = \begin{bmatrix} \mathbf{c}_{x, free} \\ \mathbf{c}_{x, fixed} \end{bmatrix}, \quad \mathbf{c}_y = \begin{bmatrix} \mathbf{c}_{y, free} \\ \mathbf{c}_{y, fixed} \end{bmatrix}
$$


### 3.3 Incertidumbres por Heterocedasticidad (HC0)

Dado que los residuos astrométricos pueden variar en magnitud (las estrellas débiles tienen centroides menos precisos que las estrellas brillantes), se utiliza el estimador robusto de White para la matriz de covarianza de los coeficientes para evitar sesgos sistemáticos en las desviaciones estándar de la escala de placa:

$$
\text{Cov}(\mathbf{c}) = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \text{diag}(\hat{\epsilon}_i^2) \mathbf{X} (\mathbf{X}^T \mathbf{X})^{-1}
$$


La varianza de la escala de placa se estima combinando los errores estándar de los coeficientes lineales de dilatación en los ejes $X$ e $Y$:

$$
\sigma_{scale} = \frac{\sqrt{\sigma_{a_x}^2 + \sigma_{b_y}^2}}{w}
$$

donde $\sigma_{a_x}$ y $\sigma_{b_y}$ son los errores estándar correspondientes a los parámetros lineales libres.

---

## 4. Absorción de Parámetros Lineales en WCS (WCS Absorption)

En lugar de almacenar efectos globales como rotación, cambios de escala generales e interceptos constantes en la matriz de distorsión óptica, estos se absorben en los parámetros globales de la placa. La función `_get_corrected_q` recalcula recursivamente el vector de estado astrométrico:

$$
\mathbf{q} = (s, \alpha_0, \delta_0, \theta)^T
$$

donde $s$ es la escala de la placa (radianes/píxel), $(\alpha_0, \delta_0)$ es el centro de placa en coordenadas celestes, y $\theta$ es el ángulo de Roll.

Los coeficientes lineales e interceptos calculados por la regresión OLS son:
- Interceptos constantes: $a_0 = c_{x, 0}$ y $b_0 = c_{y, 0}$
- Pendientes lineales en el eje X: $a_x = c_{x, 1}$ y $a_y = c_{x, 2}$ (correspondientes a los términos $x/w$ y $y/w$)
- Pendientes lineales en el eje Y: $b_x = c_{y, 1}$ y $b_y = c_{y, 2}$ (correspondientes a los términos $x/w$ y $y/w$)

### 4.1 Factor de Escala (Platescale)

Un cambio en el factor de escala lineal en el sensor se manifiesta como coeficientes de escala en $a_x$ y $b_y$. El nuevo factor de escala corregido se calcula mediante la media geométrica:

$$
s_{new} = s_{old} \cdot \sqrt{\left(1 + \frac{a_x}{w}\right)\left(1 + \frac{b_y}{w}\right)}
$$


### 4.2 Centro de Placa (RA, Dec)

Los términos constantes $a_0$ y $b_0$ representan un desplazamiento en píxeles del centro real de la placa astronómica. Este desplazamiento en el plano tangente se proyecta de regreso a la esfera celeste aplicando la matriz de rotación 2D del ángulo de Roll ($\theta$) e introduciendo la corrección de secante para la declinación $\delta_0$:

$$
\begin{pmatrix} \Delta\alpha \\ \Delta\delta \end{pmatrix} = s_{old} \begin{pmatrix} \frac{1}{\cos\delta_0} & 0 \\ 0 & 1 \end{pmatrix} \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix} \begin{pmatrix} a_0 \\ b_0 \end{pmatrix}
$$

$$
\alpha_{0, new} = \alpha_{0, old} + \Delta\alpha
$$

$$
\delta_{0, new} = \delta_{0, old} + \Delta\delta
$$


### 4.3 Ángulo de Rotación (Roll)

Una pequeña rotación física $\Delta\theta$ del plano focal del detector produce desplazamientos aparentes en el eje $X$ proporcionales a la coordenada $Y$, de la forma $\Delta x \approx -y \Delta\theta$. Al normalizar con la escala $w$, esto implica que la pendiente lineal de $y/w$ en el ajuste de errores en $X$ es $a_y \approx -w \Delta\theta$. Por lo tanto, aplicando la aproximación de ángulos pequeños:

$$
\Delta\theta = \frac{a_y}{w}
$$

$$
\theta_{new} = \theta_{old} - \Delta\theta
$$

Este refinamiento algebraico se ejecuta de manera repetida en tres pasadas consecutivas de la función `do_cubic_fit`, garantizando la estabilidad y reduciendo los términos lineales de la regresión de distorsión a cero.

---

## 5. Algoritmo de Estimación de Época (Date Guessing)

Cuando la fecha de observación no está definida, el programa realiza una optimización acotada de Brent utilizando `scipy.optimize.minimize_scalar`.

El algoritmo evalúa la posición de las estrellas del catálogo propagando su movimiento propio al año decimal $t$:

$$
\mathbf{x}_{cata}(t) = \mathbf{x}_{cata}(t_0) + \mathbf{\mu} \cdot (t - t_0)
$$

donde $\mathbf{\mu}$ representa el vector de movimiento propio reportado por el catálogo Gaia.

La función objetivo a minimizar es el error cuadrático medio de la regresión:

$$
F(t) = \text{RMS}\left(\mathbf{e}(t)\right) = \sqrt{\frac{1}{N}\sum_{i=1}^N \left[ \text{res\_x}_i^2(t) + \text{res\_y}_i^2(t) \right]}
$$

El optimizador busca:

$$
t_{opt} = \arg\min_{t \in [t_{base}-50, t_{base}+50]} F(t)
$$

donde $t_{base}$ es la fecha por defecto de inicialización (típicamente '2020-01-01').

---

## 6. Interpolación y Apertura de Archivos de Calibración

La función `_open_distortion_files` permite la carga de múltiples archivos de distorsión (`.zip` o `.txt`) de calibraciones de referencia históricas.

Si se especifican múltiples archivos separados por punto y coma, el script:
1. Extrae y parsea los archivos JSON `distortion_results.txt`.
2. Valida la consistencia de los datos comprobando que el orden de distorsión sea el mismo:

$$
\text{distortionOrder}_1 = \text{distortionOrder}_2 = \dots = \text{distortionOrder}_N
$$

3. Realiza un promedio aritmético simple de cada uno de los coeficientes de distorsión para mitigar errores instrumentales estocásticos o turbulencia atmosférica residual:

$$
c_{x, k}^{interpolado} = \frac{1}{N} \sum_{p=1}^N c_{x, k}^{(p)}, \quad c_{y, k}^{interpolado} = \frac{1}{N} \sum_{p=1}^N c_{y, k}^{(p)}
$$

4. Estima la incertidumbre combinada de la escala de la placa. Si los archivos de referencia reportan incertidumbres individuales, se calcula su norma promedio; de lo contrario, se infiere utilizando la desviación estándar de las escalas observadas:

$$
\sigma_{scale, comb} = \sqrt{\frac{1}{N-1}\sum_{p=1}^N (s^{(p)} - \bar{s})^2}
$$


---

## 7. Referencia de la API

### Clases y Funciones Principales

#### 1. `get_basis(y, x, w, m, options, use_special=False)`
* **Propósito:** Genera la matriz de diseño para la regresión.
* **Entradas:**
  - `y`, `x` (np.ndarray): Coordenadas de los píxeles respecto al centro geométrico del sensor.
  - `w` (float): Factor de escala de normalización espacial.
  - `m` (float): Multiplicador de escala astrométrica.
  - `options` (dict): Opciones del ajuste (`basis_type` y `distortionOrder`).
* **Salidas:** Matriz de diseño 2D (de tamaño `(N, M)`).

#### 2. `_cubic_helper(q, plate, target, w, m, fix_coeff_x, fix_coeff_y, options, use_special=False, weights=1)`
* **Propósito:** Ejecuta el paso de ajuste por OLS. Extrae los coeficientes de regresión, calcula las desviaciones estándar de la escala de placa por HC0 y corrige el vector de estado astrométrico `q`.
* **Retorna:** `(corrected_q, plate_corrected, coeff_x, coeff_y, basis, errors_fixed, ols_result_x, ols_result_y, platescale_stdrelerror)`.

#### 3. `apply_corrections(q, plate, coeff_x, coeff_y, img_shape, options)`
* **Propósito:** Aplica las correcciones de distorsión estimadas a las coordenadas de píxeles observadas de entrada. Omite los términos de orden constante (absorbidos en el centro de placa).
* **Retorna:** Coordenadas corregidas en píxeles.

#### 4. `do_cubic_fit(plate, stardata, initial_guess, img_shape, options, weights=1)`
* **Propósito:** Función de control del proceso de ajuste. Coordina las múltiples llamadas de calibración iterativa para la absorción de WCS.
* **Retorna:** `(q_corrected, plate_corrected, coeff_x, coeff_y, platescale_stdrelerror)`.

---

## 8. Bibliografía y Referencias de Soporte

1. **Shupe, D. L., et al. (2005).** *The SIP Convention for Representing Distortion in FITS Image Headers*. Astronomical Data Analysis Software and Systems XIV.
   - [Enlace ADS](https://ui.adsabs.harvard.edu/abs/2005ASPC..347..491S/abstract)
   - *Detalla el uso de representaciones polinómicas de distorsión geométrica en píxeles.*

2. **Calabretta, M. R., & Greisen, E. W. (2002).** *Representations of celestial coordinates in FITS*. Astronomy & Astrophysics, 395(3), 1077-1122.
   - *Explica la base matemática de las representaciones en plano tangente (WCS).*

3. **White, H. (1980).** *A Heteroskedasticity-Consistent Covariance Matrix Estimator and a Direct Test for Heteroskedasticity*. Econometrica, 48(4), 817-838.
   - [DOI: 10.2307/1912934](https://doi.org/10.2307/1912934)
   - *Formulación teórica del estimador HC0 utilizado para derivar la incertidumbre de la escala de placa.*

4. **Brent, R. P. (1973).** *Algorithms for Minimization without Derivatives*. Prentice-Hall.
   - *Detalla el optimizador unidimensional utilizado para la búsqueda estocástica de épocas.*

5. **Abramowitz, M., & Stegun, I. A. (1965).** *Handbook of Mathematical Functions*. Dover Publications.
   - *Describe las propiedades algebraicas y algoritmos de evaluación de los polinomios de Legendre.*
