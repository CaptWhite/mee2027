# Descripción Teórica y Matemática de la Rutina `_platesolve_helper`

Este documento proporciona una descripción teórica y matemática detallada del funcionamiento de la subrutina `_platesolve_helper` implementada en el resolvedor de placas astronómicas [my_platesolve_triangle.py](file:///c:/Users/captw/workspaces/MEE2027/MEE2024.v6/Source/mee2024/_working3/my_platesolve_triangle.py).

---

## Índice
- [Descripción Teórica y Matemática de la Rutina `_platesolve_helper`](#descripción-teórica-y-matemática-de-la-rutina-_platesolve_helper)
  - [Índice](#índice)
  - [1. Introducción y Propósito](#1-introducción-y-propósito)
        - [1. Caso de Éxito (`success: True`)](#1-caso-de-éxito-success-true)
        - [2. Caso de Fallo (`success: False`)](#2-caso-de-fallo-success-false)
  - [2. El Espacio de Fase 5D de Votación Estilo Hough](#2-el-espacio-de-fase-5d-de-votación-estilo-hough)
  - [3. Estructuración de Grafo Disperso y Componentes Conexas](#3-estructuración-de-grafo-disperso-y-componentes-conexas)
  - [4. Fusión Estelar y Refinamiento Astrométrico SVD (Procrustes)](#4-fusión-estelar-y-refinamiento-astrométrico-svd-procrustes)
  - [5. Verificación Final por Estadística de Poisson](#5-verificación-final-por-estadística-de-poisson)
  - [6. Bibliografía y Referencias de Soporte](#6-bibliografía-y-referencias-de-soporte)

---

## 1. Introducción y Propósito

La rutina `_platesolve_helper` constituye la columna vertebral del motor de resolución astrométrica ciega. Acepta los centroides medidos en píxeles y realiza las siguientes tareas de cálculo numérico:
1. Agrupa las estimaciones tentativas de triángulos WCS en una vecindad continua de votación de 5 dimensiones.
2. Construye un grafo disperso de correspondencias y extrae las componentes conexas que representan soluciones astrométricas físicamente coherentes.
3. Fusiona los triángulos no redundantes de cada grupo candidato.
4. Refina la orientación y la escala de placa mediante mínimos cuadrados analíticos utilizando la descomposición SVD.
5. Realiza la verificación y validación final de la solución astrométrica a través de un contraste de hipótesis estadísticas de Poisson.

Esta rutina devuelve:
##### 1. Caso de Éxito (`success: True`)

Cuando se encuentra y valida una solución astrométrica, la variable `best_result` contiene las siguientes llaves:

*   **`'success'`** *(bool)*: Establecida en `True`.
*   **`'x'`** *(np.ndarray de 4 elementos)*: La solución astrométrica expresada en **radianes celestes**. Contiene los parámetros:

$$
[s_{rad}, \alpha_{rad}, \delta_{rad}, \theta_{rad}]
$$

    *   $s_{rad}$: Escala de placa en radianes por píxel.
    *   $\alpha_{rad}$: Ascensión Recta (RA) central en radianes.
    *   $\delta_{rad}$: Declinación (Dec) central en radianes.
    *   $\theta_{rad}$: Ángulo de rotación de campo (Roll) en radianes.
*   **`'platescale/arcsec'`** *(float)*: La escala de placa de la imagen expresada en **segundos de arco por píxel** (`arcsec/pixel`).
*   **`'ra'`** *(float)*: La coordenada de Ascensión Recta (RA) del centro óptico de la imagen en **grados sexagesimales** (rango $[0, 360^\circ)$).
*   **`'dec'`** *(float)*: La coordenada de Declinación (Dec) del centro óptico de la imagen en **grados sexagesimales** (rango $[-90^\circ, 90^\circ]$).
*   **`'roll'`** *(float)*: El ángulo de rotación de campo (Roll) de la cámara en **grados sexagesimales** (rango $[0, 360^\circ)$).
*   **`'matched_centroids'`** *(np.ndarray)*: Arreglo bidimensional de tamaño $N_{matched} \times 2$ con las coordenadas en píxeles $(x, y)$ de los centroides de la imagen que fueron emparejados con éxito.
*   **`'matched_stars'`** *(np.ndarray / StarData)*: Colección de datos de catálogo (Tycho-2) que contiene la información astrométrica física real (coordenadas celestes, magnitudes y vectores unitarios 3D) de las estrellas coincidentes.

##### 2. Caso de Fallo (`success: False`)

Si el algoritmo no logra encontrar un grupo de triángulos con suficiente consenso o si los candidatos no superan el umbral estadístico de Poisson, el método devuelve un diccionario de inicialización por defecto con valores nulos:

```python
best_result = {
    'success': False, 
    'x': None, 
    'platescale': None, 
    'matched_centroids': None, 
    'matched_stars': None, 
    'platescale/arcsec': None, 
    'ra': None, 
    'dec': None, 
    'roll': None
}
```

---

## 2. El Espacio de Fase 5D de Votación Estilo Hough

Cada triángulo de estrellas de la imagen que coincide en proporciones y ángulo con un triángulo de la base de datos Tycho-2 proporciona una estimación para la escala de placa $s$, el ángulo de Roll $\theta$ y el vector unitario 3D del centro óptico de la cámara $\mathbf{v}_{center} \in \mathbb{R}^3$. 

Para consolidar las coincidencias coherentes y filtrar los emparejamientos espurios, la rutina proyecta cada coincidencia preliminar $p$ en un espacio de fase continuo de 5 dimensiones. La escala se normaliza logarítmicamente para manejar de forma simétrica dilataciones y compresiones:

$$
\mathbf{w}_p = \begin{pmatrix} \ln(s_p) / \sigma_{\ln s} \\ \theta_p / \sigma_{\theta} \\ v_{center, x, p} / \sigma_{\mathbf{v}} \\ v_{center, y, p} / \sigma_{\mathbf{v}} \\ v_{center, z, p} / \sigma_{\mathbf{v}} \end{pmatrix} \in \mathbb{R}^5
$$

donde $\sigma_{\ln s}$ (`log_TOL_SCALE`), $\sigma_{\theta}$ (`TOL_ROLL`) y $\sigma_{\mathbf{v}}$ (`TOL_CENT`) representan las desviaciones toleradas para cada coordenada astronómica.

Posteriormente:
1. Se construye un árbol binario `KDTree` de búsqueda espacial sobre la matriz de votos $\mathbf{W} \in \mathbb{R}^{T \times 5}$:

$$
\text{tree\_matches} = \text{KDTree}(\mathbf{W})
$$

2. Se extraen todas las parejas de triángulos cuyas predicciones astrométricas concuerdan dentro de una hiper-esfera normalizada de radio 1.0 en el espacio 5D a través de `tree_matches.query_pairs(1)`:

$$
E_{p, q} = \|\mathbf{w}_p - \mathbf{w}_q\|_2 \le 1.0
$$


---

## 3. Estructuración de Grafo Disperso y Componentes Conexas

Para consolidar grupos coherentes de múltiples triángulos redundantes, el problema se modela mediante teoría de grafos.

Se define un grafo no dirigido $G = (V, E)$, donde:
- El conjunto de vértices $V$ corresponde a los triángulos coincidentes.
- El conjunto de aristas $E$ representa las parejas de consistencia física ($E_{p, q} \le 1.0$).

La matriz de adyacencia $\mathbf{A} \in \mathbb{R}^{T \times T}$ se construye de forma eficiente como una matriz dispersa en formato de filas comprimidas (`csr_matrix`):

$$
\mathbf{A}_{p, q} = \begin{cases} 1 & \text{si } \|\mathbf{w}_p - \mathbf{w}_q\|_2 \le 1.0 \\ 0 & \text{en otro caso} \end{cases}
$$


El programa descompone el grafo en sus componentes conexas utilizando la rutina `scipy.sparse.csgraph.connected_components`:

$$
\text{componentes, etiquetas} = \text{connected\_components}(\mathbf{A}, \text{directed}=\text{False})
$$


Cada componente conexa con 4 o más votos es analizada como candidata a solución astrométrica real.

---

## 4. Fusión Estelar y Refinamiento Astrométrico SVD (Procrustes)

Para una componente conexa seleccionada, se realiza la fusión de la información geométrica:
1. **Eliminación de Redundancia de Permutación:** El número de votos puede inflarse artificialmente por permutaciones combinatorias de los mismos tres vértices (ej. triángulos $(a, b, c)$ y $(b, a, c)$). El algoritmo filtra mediante un hash de conjunto (`seen`) para conservar únicamente triángulos geométricamente disjuntos o independientes.
2. **Consolidación del Conjunto de Coincidencias (`matchset`):** Si el conteo final de triángulos independientes es $\ge 4$, se fusionan sus correspondencias de estrellas individuales (observadas $\longleftrightarrow$ catálogo) en un único diccionario biyectivo.
3. **Cálculo de la Orientación de Placa por SVD:**
   Sean $\mathbf{u}_i \in \mathbb{R}^3$ los vectores de píxeles proyectados a la esfera unitaria y $\mathbf{v}_i \in \mathbb{R}^3$ los correspondientes vectores celestes reales en Tycho-2. El tensor de rotación ortogonal óptimo $R \in SO(3)$ se calcula a partir de la descomposición SVD de la covarianza cruzada de los conjuntos estelares fusionados:

$$
H = \sum_{i=1}^{N_{stars}} \mathbf{u}_i \mathbf{v}_i^T
$$

   $$H = U \Sigma V^T \implies R = U V^T$$
4. **Extracción de Coordenadas de Placa Refinadas:** Las coordenadas celestes centrales $(\alpha_0, \delta_0)$ y el ángulo de Roll de campo se extraen analíticamente del tensor $R$:

$$
\alpha_0 = \arctan2(R_{0, 1}, R_{0, 0}) \pmod{360^\circ}
$$

$$
\delta_0 = \arctan2(R_{0, 2}, \sqrt{R_{1, 2}^2 + R_{2, 2}^2})
$$

$$
\theta_{roll} = \arctan2(R_{1, 2}, R_{2, 2}) \pmod{360^\circ}
$$


---

## 5. Verificación Final por Estadística de Poisson

A partir de la solución de placa refinada por SVD, se realiza la validación definitiva del platesolve:
1. **Asociación General:** Se llama a la rutina `match_centroids` utilizando las coordenadas celestes estimadas refinadas frente a todo el conjunto de centroides de la imagen (limitado a las `MAX_MATCH` estrellas más brillantes para mantener la eficiencia de cómputo). Esto genera el número de coincidencias encontradas $N_{matched}$ y el error angular de emparejamiento máximo.
2. **Contraste de Hipótesis de Poisson:** Se calcula el umbral de aceptación $N_{thresh}$ en función de la densidad de estrellas del catálogo, el número de estrellas en la imagen y la tolerancia de distancia máxima (ver fórmula basada en la función W de Lambert en el documento de `platesolve.md`):

$$
N_{thresh} = \text{estimate\_acceptance\_threshold}(n_{obs}, N_{catalog}, \theta_{max\_error}, g)
$$

3. **Validación:**
   - Si $N_{matched} \ge N_{thresh}$, el ajuste de placa se considera válido, la bandera `success` se establece en `True` y se guardan los datos en el diccionario de mejores resultados.
   - Si $N_{matched} < N_{thresh}$, la coincidencia se cataloga como falso positivo estocástico y es rechazada.

---

## 6. Bibliografía y Referencias de Soporte

1. **Lang, D., Hogg, D. W., Mierle, K., Blanton, M., & Roweis, S. (2010).** *Astrometry.net: Blind Astrometric Calibration of Arbitrary Astronomical Images*. The Astronomical Journal, 139(5), 1782-1800.
   - *Detalla el uso de técnicas de votación geométrica e indexación espacial para la resolución astrométrica de imágenes arbitrarias.*

2. **Duda, R. O., & Hart, P. E. (1972).** *Use of the Hough Transformation to Detect Lines and Curves in Pictures*. Communications of the ACM, 15(1), 11-15.
   - *Fundamento clásico de la Transformada de Hough y los métodos de votación en espacios de fase discretos y continuos para el consenso de parámetros.*

3. **Kabsch, W. (1976).** *A solution for the best rotation to relate two sets of vectors*. Acta Crystallographica Section A, 32(5), 922-923.
   - *Establece las bases analíticas de la optimización y estimación ortogonal Procrustes basada en SVD utilizada para el refinamiento de la matriz de rotación de placa.*

4. **Tarjan, R. (1972).** *Depth-First Search and Linear Graph Algorithms*. SIAM Journal on Computing, 1(2), 146-160.
   - *Describe los fundamentos algorítmicos de la búsqueda de componentes conexas en matrices dispersas y grafos utilizados en el resolvedor.*
