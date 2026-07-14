# Descripción Teórica y Matemática de `my_gaia_search.py`

Este documento proporciona una descripción formal, teórica y matemática del funcionamiento del módulo de búsqueda y consulta astrométrica en el catálogo Gaia (Data Release 3) implementado en `my_gaia_search.py`.

---

## Índice
- [Descripción Teórica y Matemática de `my_gaia_search.py`](#descripción-teórica-y-matemática-de-my_gaia_searchpy)
  - [Índice](#índice)
  - [1. Introducción y Propósito](#1-introducción-y-propósito)
  - [2. Fundamentos Físico-Matemáticos](#2-fundamentos-físico-matemáticos)
    - [2.1 Propagación de Movimiento Propio en la Esfera Celeste](#21-propagación-de-movimiento-propio-en-la-esfera-celeste)
    - [2.2 El Algoritmo de Propagación de Época de la ESA (ESDC)](#22-el-algoritmo-de-propagación-de-época-de-la-esa-esdc)
      - [Formulación de la Propagación Tridimensional](#formulación-de-la-propagación-tridimensional)
    - [2.3 Geometría de Búsqueda y Corrección por Coseno de la Declinación](#23-geometría-de-búsqueda-y-corrección-por-coseno-de-la-declinación)
    - [2.4 Transformación a Vectores Unitarios Cartesianos 3D](#24-transformación-a-vectores-unitarios-cartesianos-3d)
  - [3. Descripción de la API del Módulo](#3-descripción-de-la-api-del-módulo)
    - [Funciones Principales](#funciones-principales)
      - [1. `select_in_box(T1, ra_range, dec_range, max_mag)`](#1-select_in_boxt1-ra_range-dec_range-max_mag)
      - [2. `lookup_nearby(startable, distance, max_mag_neighbours)`](#2-lookup_nearbystartable-distance-max_mag_neighbours)
      - [3. `dbs_gaia` (Clase)](#3-dbs_gaia-clase)
  - [4. Bibliografía y Referencias de Soporte](#4-bibliografía-y-referencias-de-soporte)

---

## 1. Introducción y Propósito

El módulo [my_gaia_search.py](file:///c:/Users/captw/workspaces/MEE2027/MEE2024.v6/Source/mee2024/_working3/my_gaia_search.py) sirve como la interfaz de adquisición de datos del catálogo astrométrico de precisión **Gaia DR3** (u otros catálogos compatibles) mediante consultas en el lenguaje **ADQL** (Astrometric Query Language). Su rol principal es el de proporcionar las coordenadas de catálogo corregidas temporalmente para estrellas de referencia en el campo visual de la cámara CCD/CMOS. Estas coordenadas celestes de alta precisión son el estándar de comparación contra el cual se estiman las distorsiones ópticas y los parámetros WCS en el resolvedor principal de placas.

---

## 2. Fundamentos Físico-Matemáticos

### 2.1 Propagación de Movimiento Propio en la Esfera Celeste

Las estrellas del catálogo de astrometría no son estáticas; se mueven en un espacio tridimensional debido a su velocidad peculiar y la rotación galáctica. Este movimiento se proyecta sobre la esfera celeste en dos componentes angulares llamadas **Movimiento Propio**:
- $\mu_\alpha \cos\delta$: Movimiento propio en Ascensión Recta (RA), proyectado localmente en segundos de arco por año.
- $\mu_\delta$: Movimiento propio en Declinación (Dec) en segundos de arco por año.

Si una estrella se encuentra a una distancia determinada (expresada por su paralaje anual $\pi$ en segundos de arco) y posee una velocidad radial $v_r$ (en kilómetros por segundo), la proyección lineal directa de su posición a lo largo del tiempo es una aproximación para periodos cortos. Sin embargo, para escalas de precisión de mas (miliarcosegundos) y diferencias de épocas considerables, se requiere una propagación rigurosa en coordenadas cartesianas 3D para evitar distorsiones por aceleración perspectiva.

---

### 2.2 El Algoritmo de Propagación de Época de la ESA (ESDC)

El módulo aprovecha las capacidades de computación remota del archivo de Gaia de la Agencia Espacial Europea (ESA) mediante la función integrada en su motor de base de datos ADQL denominada `ESDC_EPOCH_PROP_POS`.

Esta función toma las coordenadas celestes y velocidades de la estrella a la época de referencia del catálogo $t_{ref}$ (para Gaia DR3, $t_{ref} = 2016.0$) y calcula la posición exacta a la época de observación deseada $T_1$ (año decimal):

$$
\mathbf{v}(T_1) = \text{ESDC\_EPOCH\_PROP\_POS}(\alpha_0, \delta_0, \pi, \mu_\alpha^*, \mu_\delta, v_r, t_{ref}, T_1)
$$

donde $\mu_\alpha^* = \mu_\alpha \cos\delta$.

#### Formulación de la Propagación Tridimensional
El algoritmo calcula el vector de posición cartesiano tridimensional en la época de referencia:

$$
\mathbf{r}_0 = \begin{pmatrix} r_{0, x} \\ r_{0, y} \\ r_{0, z} \end{pmatrix} = \frac{1}{\pi} \begin{pmatrix} \cos\alpha_0 \cos\delta_0 \\ \sin\alpha_0 \cos\delta_0 \\ \sin\delta_0 \end{pmatrix}
$$

donde $\pi$ es el paralaje en arcosegundos (si $\pi \le 0$, se asume un valor de paralaje extremadamente pequeño para aproximar distancia infinita, ej. $\pi = 10^{-7}$).

El vector de velocidad espacial tridimensional $\mathbf{v}$ en km/s se construye combinando los movimientos propios con la velocidad radial $v_r$:

$$
\mathbf{v}_{3D} = \begin{pmatrix} v_x \\ v_y \\ v_z \end{pmatrix} = \mathbf{J} \begin{pmatrix} \mu_\alpha^* / \pi \\ \mu_\delta / \pi \\ v_r / A_u \end{pmatrix}
$$

donde $\mathbf{J}$ es la matriz jacobiana de transformación de coordenadas esféricas a cartesianas:

$$
\mathbf{J} = \begin{pmatrix} -\sin\alpha_0 & -\cos\alpha_0 \sin\delta_0 & \cos\alpha_0 \cos\delta_0 \\ \cos\alpha_0 & -\sin\alpha_0 \sin\delta_0 & \sin\alpha_0 \cos\delta_0 \\ 0 & \cos\delta_0 & \sin\delta_0 \end{pmatrix}
$$

y $A_u$ es el factor de conversión de kilómetros a unidades astronómicas anuales ($A_u \approx 4.74047$).

El nuevo vector de posición en el instante de destino $T_1$ es:

$$
\mathbf{r}(T_1) = \mathbf{r}_0 + \mathbf{v}_{3D} \cdot (T_1 - t_{ref})
$$


Las nuevas coordenadas esféricas celestes propagadas $(\alpha_{T1}, \delta_{T1})$ se extraen mediante las funciones `COORD1` (Ascensión Recta) y `COORD2` (Declinación) tras re-proyectar el vector resultante $\mathbf{r}(T_1)$:

$$
\alpha_{T1} = \text{COORD1}(\mathbf{r}(T_1)) = \arctan2(r_y(T_1), r_x(T_1))
$$

$$
\delta_{T1} = \text{COORD2}(\mathbf{r}(T_1)) = \arcsin\left( \frac{r_z(T_1)}{\|\mathbf{r}(T_1)\|_2} \right)
$$

Este método maneja automáticamente el efecto de la aceleración perspectiva producido por estrellas muy cercanas y veloces.

---

### 2.3 Geometría de Búsqueda y Corrección por Coseno de la Declinación

Cuando se realiza la búsqueda de estrellas vecinas a una estrella central dada con coordenadas $(\alpha_c, \delta_c)$ dentro de un radio de separación angular de $\Delta\theta$ segundos de arco, el módulo calcula un marco envolvente (bounding box) de búsqueda.

En declinación, la separación es directa ya que los círculos de declinación son círculos máximos:

$$
\delta \in \left[ \delta_c - \frac{\Delta\theta}{3600}, \ \delta_c + \frac{\Delta\theta}{3600} \right]
$$


Sin embargo, los círculos de Ascensión Recta convergen en los polos celestes. La distancia lineal física proyectada en la esfera sobre un paralelo de declinación $\delta$ disminuye con el factor $\cos\delta$. Por lo tanto, para garantizar que el área de búsqueda cubra el mismo arco angular real de cielo $\Delta\theta$, el rango en Ascensión Recta debe dilatarse dividiendo por el coseno de la declinación:

$$
\alpha \in \left[ \alpha_c - \frac{\Delta\theta}{3600 \cos\delta_c}, \ \alpha_c + \frac{\Delta\theta}{3600 \cos\delta_c} \right]
$$


Si no se aplicara el divisor $\cos\delta_c$, la caja de búsqueda en el cielo se estrecharía en dirección de las ascensiones rectas a medida que se apunta a declinaciones más altas (cerca de los polos celestes), perdiendo estrellas candidatas y sesgando la muestra de vecinos.

---

### 2.4 Transformación a Vectores Unitarios Cartesianos 3D

Para las operaciones matemáticas dentro de la rutina de interpolación y triangulación, las posiciones celestes reportadas en grados sexagesimales se convierten en vectores unitarios cartesianos tridimensionales sobre la esfera de radio unitario:

$$
\alpha_{rad} = \alpha_{deg} \times \frac{\pi}{180}
$$

$$
\delta_{rad} = \delta_{deg} \times \frac{\pi}{180}
$$
El vector unitario correspondiente $\mathbf{u} = (x, y, z)^T$ es:

$$
x = \cos\alpha_{rad} \cos\delta_{rad}
$$

$$
y = \sin\alpha_{rad} \cos\delta_{rad}
$$

$$
z = \sin\delta_{rad}
$$


---

## 3. Descripción de la API del Módulo

### Funciones Principales

#### 1. `select_in_box(T1, ra_range, dec_range, max_mag)`
* **Propósito:** Realiza una consulta asíncrona a la base de datos de Gaia para obtener las estrellas dentro de una caja de coordenadas ecuatoriales en una época de destino $T_1$.
* **Entradas:**
  - `T1` (float): Época de destino del catálogo expresada en año decimal.
  - `ra_range` (tuple): Tupla `(ra_min, ra_max)` en grados celestes.
  - `dec_range` (tuple): Tupla `(dec_min, dec_max)` en grados celestes.
  - `max_mag` (float): Magnitud límite superior en la banda fotométrica G de Gaia.
* **Retorna:** Una tabla de resultados de `astropy.table.Table` con los identificadores de Gaia, la magnitud media de G y las posiciones ecuatoriales propagadas.
*  ** Llamada a Gaia** 
``` sql
    SELECT source_id, phot_g_mean_mag, COORD1(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra,
     pmdec, radial_velocity, ref_epoch, {T1})),COORD2(ESDC_EPOCH_PROP_POS(ra, dec, parallax,
     pmra, pmdec, radial_velocity, ref_epoch, {T1})), parallax, pmra, pmdec, ref_epoch
    FROM gaiadr3.gaia_source 
    WHERE ra BETWEEN {ra_range[0]} AND {ra_range[1]} AND 
      dec BETWEEN {dec_range[0]} AND {dec_range[1]} AND 
      phot_g_mean_mag BETWEEN 3 AND {max_mag}
```

#### 2. `lookup_nearby(startable, distance, max_mag_neighbours)`
* **Propósito:** Busca estrellas dobles u objetos adyacentes en el catálogo para una lista completa de estrellas observadas de entrada.
* **Entradas:**
  - `startable` (StarData): Objeto contenedor de los centroides de las estrellas observadas.
  - `distance` (float): Distancia radial en segundos de arco alrededor de la cual buscar vecinos.
  - `max_mag_neighbours` (float): Magnitud límite para las estrellas vecinas.
* **Retorna:** Objeto `StarData` con las estrellas vecinas encontradas. Construye de forma dinámica una consulta ADQL uniendo las sub-cajas con el operador lógico `OR`.
*  ** Llamada a Gaia** 
``` sql
   SELECT source_id, phot_g_mean_mag, ra, dec, ref_epoch
   FROM gaiadr3.gaia_source
   WHERE 
      ra BETWEEN {(ra1 - distance/3600/np.cos(dec1)):.5f} AND {(ra1 + distance / 3600 / np.cos(dec1)):.5f} AND dec BETWEEN  {(dec1 - distance/3600):.5f} AND {(dec1 + distance / 3600):.5f} OR    
      ra BETWEEN {(ra2 - distance/3600/np.cos(dec2)):.5f} AND {(ra2 + distance / 3600 / np.cos(dec2)):.5f} AND dec BETWEEN  {(dec2 - distance/3600):.5f} AND {(dec2 + distance / 3600):.5f} OR
      ...
      ra BETWEEN {(ran - distance/3600/np.cos(decn)):.5f} AND {(ran + distance / 3600 / np.cos(decn)):.5f} AND dec BETWEEN  {(decn - distance/3600):.5f} AND {(decn + distance / 3600):.5f} AND
      phot_g_mean_mag BETWEEN 3 AND {max_mag}
```
*  ** Ejemplo de Llamada a Gaia** 
``` sql
SELECT source_id, phot_g_mean_mag, ra, dec, ref_epoch 
FROM gaiadr3.gaia_source 
WHERE (
   (ra BETWEEN 15.81263 AND 15.65880 AND dec BETWEEN  7.88733 AND 7.89288) OR 
   (ra BETWEEN 16.21631 AND 16.22317 AND dec BETWEEN  5.65382 AND 5.65937) OR 
   (ra BETWEEN 17.08716 AND 17.09406 AND dec BETWEEN  5.64618 AND 5.65174) OR 
   (ra BETWEEN 14.95494 AND 14.96061 AND dec BETWEEN  6.48061 AND 6.48617) OR 
   (ra BETWEEN 18.42356 AND 18.44373 AND dec BETWEEN  7.57215 AND 7.57771) OR 
   (ra BETWEEN 18.67255 AND 18.67989 AND dec BETWEEN  6.99224 AND 6.99780) OR 
   (ra BETWEEN 16.66226 AND 16.65079 AND dec BETWEEN  8.35671 AND 8.36227) OR 
   (ra BETWEEN 15.35164 AND 15.34174 AND dec BETWEEN  8.44741 AND 8.45297) OR 
   (ra BETWEEN 18.88532 AND 18.89242 AND dec BETWEEN  6.95347 AND 6.95902) OR 
   (ra BETWEEN 18.42967 AND 18.45006 AND dec BETWEEN  7.57518 AND 7.58074) OR 
   (ra BETWEEN 19.39502 AND 19.40104 AND dec BETWEEN  5.88171 AND 5.88726) OR 
   (ra BETWEEN 15.62710 AND 15.62035 AND dec BETWEEN  8.81818 AND 8.82373) OR 
   (ra BETWEEN 15.56121 AND 15.49694 AND dec BETWEEN  7.93775 AND 7.94331) OR 
   (ra BETWEEN 15.41010 AND 15.42076 AND dec BETWEEN  7.30248 AND 7.30804) OR 
   (ra BETWEEN 19.73178 AND 19.74530 AND dec BETWEEN  7.42761 AND 7.43316) OR 
   (ra BETWEEN 15.69815 AND 15.71420 AND dec BETWEEN  7.49782 AND 7.50337) OR 
   (ra BETWEEN 15.31475 AND 15.28363 AND dec BETWEEN  8.03067 AND 8.03623) OR 
   (ra BETWEEN 18.15965 AND 18.16549 AND dec BETWEEN  6.59010 AND 6.59566)) AND 
   phot_g_mean_mag BETWEEN 3 AND 17
```

#### 3. `dbs_gaia` (Clase)
* **Propósito:** Proveedor de servicios y consultas al catálogo Gaia.
* **Método `lookup_objects(range_ra, range_dec, star_max_magnitude=12, time=2024)`:** Llama a `select_in_box` con los límites dados y empaqueta el resultado en la clase intermedia del sistema `StarData` tras calcular los vectores unitarios cartesianos tridimensionales de cada objeto.

---

## 4. Bibliografía y Referencias de Soporte

1. **Gaia Collaboration, et al. (Prusti, T., et al.) (2016).** *The Gaia mission*. Astronomy & Astrophysics, 595, A1.
   - [DOI: 10.1051/0004-6361/201629272](https://doi.org/10.1051/0004-6361/201629272)
   - *Establece las bases operacionales, el marco de referencia del satélite Gaia y las coordenadas de referencia del catálogo.*

2. **Gaia Collaboration, et al. (Vallenari, A., et al.) (2023).** *Gaia Data Release 3 - Summary of the content and properties of the release*. Astronomy & Astrophysics, 674, A1.
   - [DOI: 10.1051/0004-6361/202243940](https://doi.org/10.1051/0004-6361/202243940)
   - *Proporciona las precisiones nominales de la paralaje, movimientos propios y velocidades radiales del DR3.*

3. **International Virtual Observatory Alliance (IVOA) (2018).** *Astrometric Query Language (ADQL) Version 2.1*. IVOA Recommendation.
   - [Documento Técnico IVOA](http://www.ivoa.net/documents/ADQL/)
   - *Estándar oficial de sintaxis y extensiones espaciales (ej. funciones trigonométricas y lógicas en la esfera) en las que se basan las consultas asíncronas de este módulo.*

4. **Green, R. M. (1985).** *Spherical Astronomy*. Cambridge University Press.
   - *Contiene el desarrollo geométrico de la trigonometría esférica, la compresión de círculos máximos en la esfera celeste y la proyección de movimientos propios.*
