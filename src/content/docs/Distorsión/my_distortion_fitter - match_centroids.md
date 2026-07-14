# Descripción Teórica y Matemática de la Rutina `match_centroids`

Este documento proporciona una descripción teórica y matemática detallada de la rutina `match_centroids` implementada en el módulo [my_distortion_fitter.py](file:///c:/Users/captw/workspaces/MEE2027/MEE2024.v6/Source/mee2024/_working3/my_distortion_fitter.py). Esta rutina es la responsable de asociar los centroides de estrellas observadas en el sensor con sus posiciones físicas reales reportadas en el catálogo de astrometría Gaia.

---

## Índice
- [Descripción Teórica y Matemática de la Rutina `match_centroids`](#descripción-teórica-y-matemática-de-la-rutina-match_centroids)
  - [Índice](#índice)
  - [1. Introducción](#1-introducción)
        - [1. `stardata0` *(Objeto StarData)*](#1-stardata0-objeto-stardata)
        - [2. `stardata` *(Objeto StarData)*](#2-stardata-objeto-stardata)
        - [3. `plate2` *(np.ndarray de tamaño $N\_{matched} \\times 2$)*](#3-plate2-npndarray-de-tamaño-n_matched-times-2)
        - [4. `alt` *(float o None)*](#4-alt-float-o-none)
        - [5. `az` *(float o None)*](#5-az-float-o-none)
        - [6. `mask_select` *(np.ndarray de enteros)*](#6-mask_select-npndarray-de-enteros)
  - [2. Flujo Algorítmico y Geométrico](#2-flujo-algorítmico-y-geométrico)
    - [2.1 Descarga y Corrección de Coordenadas de Catálogo](#21-descarga-y-corrección-de-coordenadas-de-catálogo)
    - [2.2 Proyección Inversa de Centroides Observados](#22-proyección-inversa-de-centroides-observados)
  - [3. Algoritmo de Asociación de Estrellas (Nearest Neighbors)](#3-algoritmo-de-asociación-de-estrellas-nearest-neighbors)
    - [3.1 Búsquedas Bilaterales de Vecinos Cercanos](#31-búsquedas-bilaterales-de-vecinos-cercanos)
      - [Búsqueda A: De observaciones estimadas al catálogo ($O \\to C$)](#búsqueda-a-de-observaciones-estimadas-al-catálogo-o-to-c)
      - [Búsqueda B: Del catálogo a las observaciones estimadas ($C \\to O$)](#búsqueda-b-del-catálogo-a-las-observaciones-estimadas-c-to-o)
    - [3.2 Filtro de Distancia Angular Máxima](#32-filtro-de-distancia-angular-máxima)
    - [3.3 Criterio de Lowe para Ambigüedad (Lowe's Ratio Test)](#33-criterio-de-lowe-para-ambigüedad-lowes-ratio-test)
    - [3.4 Criterio de Reflexividad Bidireccional (Mutual Matching)](#34-criterio-de-reflexividad-bidireccional-mutual-matching)
  - [4. Filtrado Geométrico de Borde (Crop Circle)](#4-filtrado-geométrico-de-borde-crop-circle)
  - [5. Bibliografía y Referencias de Soporte](#5-bibliografía-y-referencias-de-soporte)

---

## 1. Introducción

El emparejamiento estelar es uno de los pasos críticos en la calibración astrométrica fina. Dado un conjunto de coordenadas en píxeles detectadas en una imagen y un catálogo de coordenadas celestes de referencia, la rutina `match_centroids` establece una biyección (correspondencia uno a uno) matemática libre de ambigüedades. 

Este problema se complica debido a:
1. Errores de escala, rotación y traslación en la solución astrométrica inicial (WCS aproximado).
2. Estrellas espurias en la imagen (ruido, satélites, rayos cósmicos).
3. Estrellas de catálogo ausentes en la imagen debido al límite de sensibilidad del telescopio.
4. Alta densidad estelar (que puede confundir asociaciones adyacentes).


A continuación se detalla la información y el formato que contiene cada una de estas variables:


##### 1. `stardata0` *(Objeto StarData)*
Contiene la información de **todas las estrellas de referencia del catálogo Gaia** descargadas para la región geográfica del cielo delimitada por la imagen (bounding box).
*   **Información:** Contiene los datos crudos del catálogo (RA, Dec, movimientos propios, paralaje, identificadores y magnitudes fotométricas) de todas las estrellas que están dentro del campo visual simulado, antes de realizar cualquier filtro de correspondencia con la imagen.

##### 2. `stardata` *(Objeto StarData)*
Es el subconjunto de `stardata0` que contiene únicamente las estrellas del catálogo Gaia que **fueron emparejadas con éxito** con los centroides detectados en la imagen.
*   **Información:** Contiene los mismos campos astrométricos que `stardata0` pero filtrados. Solo incluye estrellas que pasaron el filtro de tolerancia angular (`match_threshhold`), el test de Lowe de ambigüedad (`confusion_ratio`), la reflexividad bidireccional uno a uno y el límite circular del borde del sensor (`crop_circle`).

##### 3. `plate2` *(np.ndarray de tamaño $N_{matched} \times 2$)*
Contiene las coordenadas de los centroides de las estrellas observadas emparejadas, **desplazadas con respecto al centro geométrico del detector**.
*   **Información:** Cada fila contiene un par $(y, x)$ en píxeles del centroide medido en el sensor tras restarle la mitad de la resolución del sensor:

$$
\mathbf{x}_{centered} = \begin{pmatrix} y_{obs} - H/2 \\ x_{obs} - W/2 \end{pmatrix}
$$

    Tiene una correspondencia índice a índice directa con las estrellas contenidas en el objeto `stardata`.

##### 4. `alt` *(float o None)*
Representa la **altitud media aparente (Altitud)** del campo estelar observado sobre el horizonte local del observador (en grados sexagesimales).
*   **Información:** Se calcula durante las correcciones celestes locales (refracción atmosférica) si `options['enable_corrections']` está activo; de lo contrario, se devuelve como `None`.

##### 5. `az` *(float o None)*
Representa el **azimut medio aparente (Azimut)** del campo estelar observado respecto al Norte (en grados sexagesimales).
*   **Información:** Al igual que `alt`, se deriva de la transformación horaria local con atmósfera; si está desactivada, su valor es `None`.

##### 6. `mask_select` *(np.ndarray de enteros)*
Es el arreglo de índices del catálogo `stardata0` que identifica cuáles estrellas de referencia son las que se emparejaron con las observaciones de la imagen.
*   **Información:** Contiene los índices planos que se usan para mapear y filtrar `stardata0` y convertirlo en `stardata`:

$$
\text{stardata} = \text{stardata0}[\text{mask\_select}]
$$

---

## 2. Flujo Algorítmico y Geométrico

### 2.1 Descarga y Corrección de Coordenadas de Catálogo

En primer lugar, a partir de las esquinas estimadas de la imagen en el cielo, se calcula un volumen delimitador (bounding box) para descargar del catálogo de Gaia las estrellas de referencia de la zona geográfica:

$$
\alpha_{cata} \in [\alpha_{min}, \alpha_{max}], \quad \delta_{cata} \in [\delta_{min}, \delta_{max}]
$$


Si las correcciones físicas locales están habilitadas (`options['enable_corrections']`), se aplican efectos de refracción atmosférica diferencial, aberración anual y paralaje diurno sobre las estrellas del catálogo en la época y hora exacta de la toma de datos utilizando el módulo `AstroCorrect`. Esto genera un conjunto de coordenadas celestes corregidas en declinación y ascensión recta en grados:

$$
C = \left\{ (\delta_{cata, j}, \alpha_{cata, j}) \right\}_{j=1}^{N_{cata}}
$$


### 2.2 Proyección Inversa de Centroides Observados

Los centroides medidos en píxeles $(y_{obs, i}, x_{obs, i})$ en la imagen (contenidos en el dataframe `other_stars_df`) se centran geométricamente respecto al sensor:

$$
\mathbf{x}_{centered, i} = \begin{pmatrix} y_{obs, i} - \frac{H}{2} \\ x_{obs, i} - \frac{W}{2} \end{pmatrix}
$$

donde $H, W$ representan el alto y ancho del sensor en píxeles.

A continuación, se proyectan al cielo utilizando la solución astrométrica inicial aproximada (WCS lineal) $\mathbf{q} = (s, \alpha_0, \delta_0, \theta)$:

$$
\mathbf{v}_{projected, i} = \text{linear\_transform}(\mathbf{q}, \mathbf{x}_{centered, i})
$$


Los vectores de coordenadas unitarias 3D resultantes $\mathbf{v}_{projected, i}$ se transforman a coordenadas esféricas polares de grados celestes $(\delta_{obs, i}, \alpha_{obs, i})$ mediante la función `transforms.to_polar`:

$$
\delta_{obs, i} = \arcsin(v_{z, i}) \times \frac{180}{\pi}
$$

$$
\alpha_{obs, i} = \arctan2(v_{y, i}, v_{x, i}) \times \frac{180}{\pi} \quad (\text{normalizado en el intervalo } [0, 360^\circ))
$$

Esto produce el conjunto de observaciones estimadas proyectadas al cielo en grados:

$$
O = \left\{ (\delta_{obs, i}, \alpha_{obs, i}) \right\}_{i=1}^{N_{obs}}
$$


---

## 3. Algoritmo de Asociación de Estrellas (Nearest Neighbors)

Para realizar la asociación biyectiva entre los conjuntos $O$ y $C$ en el plano esférico $(\alpha, \delta)$, la rutina implementa un algoritmo de emparejamiento por vecindad más cercana estructurado en cuatro filtros matemáticos.

### 3.1 Búsquedas Bilaterales de Vecinos Cercanos

Utilizando estructuras de datos de particionado del espacio (k-d trees implementados a través de `sklearn.neighbors.NearestNeighbors`), el software ejecuta búsquedas bilaterales rápidas de distancias euclidianas.

#### Búsqueda A: De observaciones estimadas al catálogo ($O \to C$)
Para cada estrella proyectada de la observación $\mathbf{o}_i = (\delta_{obs, i}, \alpha_{obs, i})$, se encuentran los **dos** vecinos más cercanos en el catálogo, identificados por los índices $j_1(i)$ y $j_2(i)$, con distancias angulares:

$$
d_1(i) = \|\mathbf{o}_i - \mathbf{c}_{j_1(i)}\|_2 = \sqrt{(\alpha_{obs, i} - \alpha_{cata, j_1})^2 + (\delta_{obs, i} - \delta_{cata, j_1})^2}
$$

$$
d_2(i) = \|\mathbf{o}_i - \mathbf{c}_{j_2(i)}\|_2 = \sqrt{(\alpha_{obs, i} - \alpha_{cata, j_2})^2 + (\delta_{obs, i} - \delta_{cata, j_2})^2}
$$
donde por definición de orden se cumple que $d_1(i) \le d_2(i)$.

#### Búsqueda B: Del catálogo a las observaciones estimadas ($C \to O$)
Para cada estrella del catálogo $\mathbf{c}_j = (\delta_{cata, j}, \alpha_{cata, j})$, se encuentra **un único** vecino más cercano en las observaciones estimadas, identificado por el índice de observación $i_{best}(j)$, con distancia angular:

$$
d_{best}(j) = \|\mathbf{c}_j - \mathbf{o}_{i_{best}(j)}\|_2
$$


---

### 3.2 Filtro de Distancia Angular Máxima

El vecino más cercano encontrado para cada observación debe encontrarse a una distancia menor que un radio de tolerancia angular máximo $D_{max}$. Si denotamos la tolerancia configurada en segundos de arco como $\theta_{tol}$ (parámetro `rough_match_threshhold`), el límite de distancia se establece en grados:

$$
d_1(i) < D_{max} = \frac{\theta_{tol}}{3600}
$$

*(Nota: En la línea 105 del script se implementa un factor divisor de 33600 por un error tipográfico en lugar de 3600, lo que reduce la tolerancia activa real a $\theta_{tol}/33600$, actuando como un filtro de proximidad extremadamente estricto).*

---

### 3.3 Criterio de Lowe para Ambigüedad (Lowe's Ratio Test)

En regiones de alta densidad estelar, es común que una estrella observada se encuentre cerca de más de una estrella de catálogo, lo que puede dar lugar a falsos emparejamientos. Para evitar ambigüedades, se implementa el criterio de relación de distancia (Lowe's Ratio Test). 

Se requiere que la primera estrella de catálogo más cercana sea significativamente más próxima que la segunda estrella más cercana por un factor de confusión $\gamma = 2$:

$$
\frac{d_2(i)}{d_1(i)} > \gamma \implies d_2(i) > 2 \cdot d_1(i)
$$


Si este criterio no se cumple, la asociación de la estrella observada $i$ se considera ambigua y es descartada por completo de la calibración para evitar contaminar el ajuste de distorsión.

---

### 3.4 Criterio de Reflexividad Bidireccional (Mutual Matching)

Para resolver el problema del emparejamiento múltiple (donde varias estrellas observadas compiten por asociarse al mismo objeto de catálogo), el algoritmo impone que la relación de vecindad sea **reflexiva** (mutual matching).

Un emparejamiento entre la observación $i$ y la estrella de catálogo $j = j_1(i)$ se declara válido si y solo si:

$$
i_{best}(j_1(i)) = i
$$


Esto significa que:
1. La estrella de catálogo $j$ es la más cercana a la estrella observada $i$.
2. **Y al mismo tiempo**, la estrella observada $i$ es la más cercana a la estrella de catálogo $j$.

Cualquier relación de correspondencia de tipo muchos-a-uno o uno-a-muchos es eliminada automáticamente por esta máscara binaria de reflexividad.

---

## 4. Filtrado Geométrico de Borde (Crop Circle)

Debido a que las aberraciones ópticas en telescopios de campo amplio (como coma, astigmatismo y distorsión geométrica) son más severas en la periferia de la lente o espejo, y a que los sensores CCD suelen sufrir de viñeteado óptico en las esquinas, el software implementa un filtro de radio de descarte circular (`crop_circle`).

Para cada estrella observada centrada en coordenadas de píxeles $\mathbf{x}_{centered, i} = (y_c, x_c)$, se calcula su distancia radial normalizada $r_i$ con respecto al radio de la diagonal del sensor:

$$
r_i = \frac{2 \sqrt{y_c^2 + x_c^2}}{\sqrt{H^2 + W^2}}
$$


Las estrellas que se ubiquen fuera del umbral estipulado de radio circular $\eta_{radius}$ (definido por el parámetro `crop_circle_thresh`, típicamente $1.0$ para el círculo inscrito en el sensor) son excluidas del proceso:

$$
r_i < \eta_{radius}
$$


---

## 5. Bibliografía y Referencias de Soporte

1. **Lowe, D. G. (2004).** *Distinctive Image Features from Scale-Invariant Keypoints*. International Journal of Computer Vision, 60(2), 91-110.
   - [DOI: 10.1023/B:VISI.0000029904.91272.1a](https://doi.org/10.1023/B:VISI.0000029904.91272.1a)
   - *Artículo seminal donde se define matemáticamente el "Ratio Test" (criterio de Lowe) para eliminar ambigüedades en la asociación de descriptores locales en visión artificial.*

2. **Bentley, J. L. (1975).** *Multidimensional binary search trees used for associative searching*. Communications of the ACM, 18(9), 509-517.
   - [DOI: 10.1145/361002.361007](https://doi.org/10.1145/361002.361007)
   - *Fundamento de los k-d trees (K-Dimensional Trees) utilizados por la clase NearestNeighbors para realizar búsquedas rápidas en complejidad temporal $O(\log N)$ en lugar de búsquedas exhaustivas $O(N^2)$.*

3. **Budavari, T., & Szalay, A. S. (2008).** *Astrometric Matching with Bayesian Statistics*. The Astrophysical Journal, 679(1), 301-309.
   - [DOI: 10.1086/587156](https://doi.org/10.1086/587156)
   - *Describe los fundamentos matemáticos de la probabilidad de emparejamiento estelar a partir de posiciones aproximadas en el plano tangente y esférico.*
