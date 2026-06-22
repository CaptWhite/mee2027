# Descripción Teórica y Matemática del Algoritmo `platesolve`

Este documento proporciona una descripción formal, teórica y matemática del funcionamiento de la rutina de resolución astrométrica ciega `platesolve` implementada en el módulo [my_platesolve_triangle.py](file:///c:/Users/captw/workspaces/MEE2027/MEE2024.v6/Source/mee2024/_working3/my_platesolve_triangle.py).

---

## Índice
1. [Introducción y Objetivos](#1-introducción-y-contexto)
2. [Fundamentos de la Geometría de Triángulos (Geometric Invariants)](#2-fundamentos-de-la-geometría-de-triángulos-geometric-invariants)
3. [Ajuste Analítico de Placa y Rotación 3D](#3-ajuste-analítico-de-placa-y-rotación-3d)
4. [Agrupamiento y Consenso de Soluciones (Hough KDTree Voting)](#4-agrupamiento-y-consenso-de-soluciones-hough-kdtree-voting)
5. [Cálculo Estadístico del Umbral de Aceptación Astrométrico](#5-cálculo-estadístico-del-umbral-de-aceptación-astrométrico)
6. [Estructura y API del resolvedor](#6-estructura-y-api-del-resolvedor)
7. [Bibliografía y Referencias de Soporte](#7-bibliografía-y-referencias-de-soporte)

---

## 1. Introducción y Contexto

La función `platesolve` tiene como objetivo estimar la solución de placa astrométrica inicial (WCS) de una imagen de forma ciega; es decir, sin información preexistente sobre el apuntamiento real del telescopio, la escala de placa, la orientación o el Roll. 

Para lograr esto de forma robusta y computacionalmente eficiente frente a miles de estrellas de catálogo, el software implementa un algoritmo de emparejamiento de triángulos estelares. Este método utiliza relaciones geométricas de distancia y ángulos que permanecen invariables frente a traslaciones, rotaciones y factores de escala en proyecciones bidimensionales.

---

## 2. Fundamentos de la Geometría de Triángulos (Geometric Invariants)

En una proyección plana local, consideramos un triángulo formado por tres estrellas en la imagen: la estrella central (o estrella de anclaje) $\mathbf{v}_0 \in \mathbb{R}^2$ y dos estrellas vecinas $\mathbf{v}_1, \mathbf{v}_2 \in \mathbb{R}^2$.

Definimos los vectores relativos locales en píxeles:

$$
\mathbf{w}_1 = \mathbf{v}_1 - \mathbf{v}_0
$$

$$\mathbf{w}_2 = \mathbf{v}_2 - \mathbf{v}_0$$

Calculamos sus distancias físicas en píxeles:

$$
r_1 = \|\mathbf{w}_1\|_2, \quad r_2 = \|\mathbf{w}_2\|_2
$$


Para asegurar la invarianza de escala (ya que la escala de la placa es desconocida a priori), se ordena la pareja de vecinos de forma que $r_1 \ge r_2$. Se definen dos parámetros invariantes puros:

#### 1. Relación de Lados (Ratio)
Representa la proporción entre el lado menor y el lado mayor del triángulo:

$$
\text{ratio} = \frac{r_2}{r_1} \in (0, 1]
$$


#### 2. Diferencia de Ángulo Polar ($\Delta\phi$)
Representa el ángulo subtendido en píxeles entre los vectores de las estrellas vecinas respecto a la estrella de anclaje:

$$
\phi_1 = \text{arctan2}(w_{1, y}, w_{1, x})
$$

$$\phi_2 = \text{arctan2}(w_{2, y}, w_{2, x})$$

$$
\Delta\phi = (\phi_2 - \phi_1) \pmod{2\pi}
$$


El par $(\text{ratio}, \Delta\phi)$ es un invariante geométrico puro que coincide exactamente con los parámetros celestes esféricos correspondientes bajo la proyección tangente. El catálogo de triángulos de referencia Tycho-2 precalculado se estructura en un árbol binario multidimensional `KDTree` indexado por estos dos parámetros. La consulta de vecinos del árbol en un radio de tolerancia $\epsilon$ (`TOLERANCE` $\approx 0.01$) asocia rápidamente cada triángulo de la imagen con una lista de candidatos de catálogo.

---

## 3. Ajuste Analítico de Placa y Rotación 3D

Para cada triángulo candidato emparejado, la función `compute_platescale` calcula analíticamente los parámetros de placa correspondientes.

### 1. Escala de Placa ($s$)
Si la distancia angular real entre la estrella de anclaje de catálogo y su vecino mayor en el cielo es $\theta_{cata}$ (en radianes), la escala de píxel implícita (en radianes/píxel) es:

$$
s = \frac{\theta_{cata}}{r_1}
$$


### 2. Matriz de Rotación de Placa ($R$)
Sean $\mathbf{x}_{0}, \mathbf{x}_{1}, \mathbf{x}_{2} \in \mathbb{R}^2$ las coordenadas de píxeles observadas centradas de los vértices del triángulo. Las proyectamos al espacio plano local utilizando la escala calculada $s$:

$$
\mathbf{z}_i = s \cdot \mathbf{x}_{i}
$$


Convertimos estas coordenadas planas a vectores unitarios 3D utilizando la proyección inversa en la esfera unitaria a través de la función `transforms.icoord_to_vector`:

$$
\mathbf{u}_i = \text{icoord\_to\_vector}(\mathbf{z}_i) \in \mathbb{R}^3
$$


Sean $\mathbf{v}_0, \mathbf{v}_1, \mathbf{v}_2 \in \mathbb{R}^3$ las posiciones celestes unitarias tridimensionales reales de las tres estrellas en el catálogo. Construimos las matrices de correspondencia de dimensión $3 \times 3$:

$$
\mathbf{U} = [\mathbf{u}_0 \ | \ \mathbf{u}_1 \ | \ \mathbf{u}_2]
$$

$$\mathbf{V} = [\mathbf{v}_0 \ | \ \mathbf{v}_1 \ | \ \mathbf{v}_2]$$

La matriz de rotación de placa $R \in \mathbb{R}^{3 \times 3}$ satisface la relación lineal:

$$
\mathbf{V} = R \mathbf{U} \implies R = \mathbf{V} \mathbf{U}^{-1}
$$


Dado que los tres puntos del triángulo no son colineales en la esfera, la matriz $\mathbf{U}$ es invertible y su inversa se calcula de forma explícita mediante su matriz adjunta y determinante:

$$
\mathbf{U}^{-1} = \frac{1}{\det(\mathbf{U})} \text{Adj}(\mathbf{U})
$$


A partir del tensor de rotación estimado $R$:
- El centro de placa proyectado en el cielo corresponde a la primera columna de la matriz de rotación:

$$
\mathbf{v}_{center} = R_{\cdot, 0} = \begin{pmatrix} R_{0, 0} \\ R_{1, 0} \\ R_{2, 0} \end{pmatrix}
$$

- El ángulo de Roll $\theta$ se calcula mediante:

$$
\theta = \arctan2(R_{1, 2}, R_{2, 2})
$$


---

## 4. Agrupamiento y Consenso de Soluciones (Hough KDTree Voting)

Debido al ruido y a las falsas coincidencias estocásticas de la base de datos de triángulos, un emparejamiento individual de un triángulo puede ser incorrecto. Para identificar la solución astrométrica real, el resolvedor proyecta cada triángulo emparejado como un voto en un espacio de parámetros astrométricos de 5 dimensiones:

$$
\mathbf{w} = \begin{pmatrix} \ln s / \sigma_{\ln s} \\ \theta / \sigma_{\theta} \\ \mathbf{v}_{center} / \sigma_{\mathbf{v}} \end{pmatrix} \in \mathbb{R}^5
$$

donde el logaritmo de la escala de la placa y los ángulos de orientación se dividen por sus respectivas tolerancias de agrupamiento (`log_TOL_SCALE`, `TOL_ROLL`, `TOL_CENT`) para normalizar el espacio de búsqueda.

A continuación:
1. Se construye un `KDTree` en 5D sobre estos vectores de estado de votación.
2. Se buscan pares de triángulos cercanos que coincidan estrechamente en sus estimaciones de WCS a través del método `tree_matches.query_pairs(1)`.
3. Se construye una matriz de adyacencia de grafo dispersa en la cual los nodos representan triángulos y los aristas representan consistencia de WCS.
4. Se extraen las componentes conexas utilizando algoritmos de teoría de grafos. Aquella componente conexa con un conteo de votos de triángulos coherentes superior o igual a 4 se evalúa como una solución astrométrica candidata viable.

---

## 5. Cálculo Estadístico del Umbral de Aceptación Astrométrico

Para declarar exitosa y válida una solución astrométrica y descartar coincidencias azarosas causadas por fluctuaciones estocásticas en campos de estrellas densos, la rutina calcula un umbral estadístico adaptativo.

Sea $p$ la probabilidad de que una estrella aleatoria caiga dentro del radio de tolerancia de emparejamiento $\theta_{match}$ en una esfera celeste que contiene $N_{catalog}$ estrellas de catálogo Tycho-2:

$$
p = \frac{N_{catalog} \cdot \theta_{match}^2}{4}
$$


Si la imagen contiene $n_{obs}$ estrellas observadas, el número esperado de emparejamientos espurios por puro azar en un intento sigue una distribución de Poisson con media:

$$
\lambda = p \cdot (n_{obs} - 3)
$$


El número de posibles combinaciones de emparejamiento (intentos) en el espacio de búsqueda se modela a partir de los coeficientes binomiales de triángulos y la tolerancia del ajuste:

$$
N_{attempts} = \binom{N_{catalog}}{3} \binom{n_{obs}}{3} \cdot \epsilon^2
$$


Utilizando el límite de la distribución del máximo de variables aleatorias de Poisson independientes ( Briggs et al., 2009), el valor extremo esperado de coincidencias por azar se calcula mediante la función W de Lambert:

$$
x_0 = \frac{\ln(N_{attempts})}{W\left( \frac{\ln N_{attempts}}{e \cdot \lambda} \right)}
$$

$$x_1 = x_0 + \frac{\ln\lambda - \lambda - \frac{1}{2}\ln(2\pi) - \frac{3}{2}\ln x_0}{\ln x_0 - \ln\lambda}$$

El umbral de aceptación final de la hipótesis astrométrica se define sumando las tres estrellas del triángulo inicial de anclaje:

$$
\text{Threshold} = \text{round}(x_1) + 3 + \text{addon}
$$

donde $\text{addon} \approx 3$. Si el número de estrellas asociadas en la placa final es mayor o igual a este límite, la solución se declara matemáticamente **confirmada y exitosa**.

---

## 6. Estructura y API del resolvedor

### `platesolve(centroids, image_shape, options, output_dir=None, try_mirror_also=True)`
* **Propósito:** Función de control principal. Ejecuta el resolvedor y busca la consistencia de los triángulos.
* **Entradas:**
  - `centroids` (np.ndarray): Matriz de tamaño $N \times 2$ con las posiciones observadas de los píxeles (en formato `[y, x]`).
  - `image_shape` (tuple): Dimensiones físicas de la imagen `(H, W)`.
  - `options` (dict): Parámetros y tolerancias de control.
  - `try_mirror_also` (bool): Si es verdadero y el primer intento falla, invoca nuevamente al resolvedor transponiendo los píxeles para resolver campos con inversión especular.
* **Retorna:** Un diccionario con el estado del proceso:
  - `"success"` (bool): Éxito del resolvedor.
  - `"ra"`, `"dec"`, `"roll"`, `"platescale"`: Solución astrométrica física en unidades estándar.
  - `"x"`: Tupla de solución WCS final expresada en radianes celestes.
  - `"matched_centroids"`, `"matched_stars"`: Centroides y estrellas asociadas en el cielo.
  - `"mirror"` (bool): Si requirió o no inversión especular para resolver.

---

## 7. Bibliografía y Referencias de Soporte

1. **Lang, D., Hogg, D. W., Mierle, K., Blanton, M., & Roweis, S. (2010).** *Astrometry.net: Blind Astrometric Calibration of Arbitrary Astronomical Images*. The Astronomical Journal, 139(5), 1782-1800.
   - [DOI: 10.1088/0004-6256/139/5/1782](https://doi.org/10.1088/0004-6256/139/5/1782)
   - *Artículo clásico de calibración astrométrica ciega mediante el agrupamiento de estrellas en descriptores invariantes de forma (quads), base teórica de la resolvedor de triángulos.*

2. **Briggs, K., Song, L., & Prellberg, T. (2009).** *A note on the distribution of the maximum of a set of Poisson random variables*. BT Research & Queen Mary University of London.
   - *Establece las fórmulas matemáticas basadas en la función W de Lambert para calcular el comportamiento extremo de variables de Poisson independientes, utilizadas en el cálculo de umbrales.*

3. **Høg, E., et al. (2000).** *The Tycho-2 catalogue of the 2.5 million brightest stars*. Astronomy & Astrophysics, 355, L27-L30.
   - *Describe el catálogo Tycho-2 del cual se extraen y precalculan los triángulos de anclaje de referencia de la base de datos.*

4. **Corless, R. M., Gonnet, G. H., Hare, D. E. G., Jeffrey, D. J., & Knuth, D. E. (1996).** *On the Lambert W Function*. Advances in Computational Mathematics, 5(1), 329-359.
   - *Detalla el análisis matemático y la evaluación numérica de la función W de Lambert utilizada en la solución del umbral.*
