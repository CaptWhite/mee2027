# Descripción Teórica y Matemática de `my_refraction_correction.py`

Este documento proporciona una descripción formal, teórica y matemática del funcionamiento del módulo de correcciones físico-astrométricas y refracción atmosférica implementado en `my_refraction_correction.py`.

---

## Índice
1. [Introducción y Contexto](#1-introducción-y-contexto)
2. [Fundamentos Físico-Matemáticos](#2-fundamentos-físico-matemáticos)
   - [2.1 Refracción Atmosférica y el Sistema Horizontal (AltAz)](#21-refracción-atmosférica-y-el-sistema-horizontal-altaz)
   - [2.2 El Problema de Procrustes Ortogonal y la Orientación Terrestre](#22-el-problema-de-procrustes-ortogonal-y-la-orientación-terrestre)
   - [2.3 Re-proyección a Coordenadas Celestes Aparentes](#23-re-proyección-a-coordenadas-celestes-aparentes)
   - [2.4 Hackeo Dinámico de la Masa para Deflexión Gravitacional](#24-hackeo-dinámico-de-la-masa-para-deflexión-gravitacional)
3. [Estructura de la API del Módulo](#3-estructura-de-la-api-del-módulo)
4. [Bibliografía y Referencias de Soporte](#4-bibliografía-y-referencias-de-soporte)

---

## 1. Introducción y Contexto

El script [my_refraction_correction.py](file:///c:/Users/captw/workspaces/MEE2027/MEE2024.v6/Source/mee2024/_working3/my_refraction_correction.py) implementa la clase `AstroCorrect`, cuya función principal es transformar las coordenadas de catálogo ideales (ICRS) de las estrellas en coordenadas aparentes (refractadas y desviadas físicamente) tal como se observarían desde la superficie terrestre.

Este proceso aplica correcciones combinadas de:
1. **Aberración Anual de la Luz:** Modificación angular por la velocidad orbital terrestre.
2. **Paralaje Diurno:** Desplazamiento perspectivo basado en la posición geográfica del observador.
3. **Refracción Atmosférica:** Desplazamiento vertical hacia el cenit debido a la densidad del aire.
4. **Deflexión Gravitacional:** Curvatura relativista producida por masas del sistema solar.

---

## 2. Fundamentos Físico-Matemáticos

### 2.1 Refracción Atmosférica y el Sistema Horizontal (AltAz)

La luz proveniente del espacio exterior entra a la atmósfera terrestre y sufre una desviación continua (hacia la vertical local o cenit) gobernada por la ley de refracción de Snell. En un modelo simplificado de atmósfera plana, el ángulo de refracción $\Delta R$ se expresa como:

$$
\Delta R = R_0 \tan z_c
$$

donde $z_c$ es la distancia cenital geométrica ($z_c = 90^\circ - a$, siendo $a$ la altitud sobre el horizonte) y $R_0$ es la constante de refracción nominal.

En el software, la refracción se calcula mediante la biblioteca `astropy.coordinates` (que a su vez utiliza los estándares de la IAU implementados en la biblioteca `erfa`), utilizando un modelo avanzado de capas esféricas. La refracción depende de los parámetros ambientales medidos por el observador en el instante de la toma de datos:
- Presión barométrica local $P$ (en hPa/mbar).
- Temperatura del aire $T$ (en °C).
- Humedad relativa $H_r$ (expresada en fracción decimal $[0.0, 1.0]$).
- Longitud de onda de observación $\lambda$ (en micrómetros, típicamente $\lambda \approx 0.65\ \mu\text{m}$).

#### Conversión al Marco Horizontal local
Para cada estrella en el catálogo, se transforman sus coordenadas celestes a coordenadas del sistema horizontal local $(\text{Alt}, \text{Az})$:

$$
\text{coord}_{ICRS} \xrightarrow{\text{AltAz}(P, T, H_r, \lambda)} (\text{Alt}, \text{Az})
$$


A partir de la altitud refractada $a$ y el azimut $A$ (medido desde el Norte hacia el Este), se construye un vector unitario horizontal tridimensional $\mathbf{v}_{local}$ utilizando la convención del script:

$$
\mathbf{v}_{local} = \begin{pmatrix} v_{x, local} \\ v_{y, local} \\ v_{z, local} \end{pmatrix} = \begin{pmatrix} \sin a \\ \cos a \cos A \\ \cos a \sin A \end{pmatrix}
$$


---

### 2.2 El Problema de Procrustes Ortogonal y la Orientación Terrestre

La transformación rigurosa desde un sistema local terrestre de coordenadas horizontales ($\text{Alt}, \text{Az}$) a un sistema celeste inercial de coordenadas celestes (ICRS) requiere conocer la matriz de orientación de la Tierra en el espacio. Dicha orientación es extremadamente compleja y cambia segundo a segundo debido a:
- La rotación sidérea diaria de la Tierra.
- La precesión de los equinoccios (periodo de $\sim 26,000$ años).
- La nutación del eje terrestre (oscilación periódica).
- El movimiento del polo geográfico.

En lugar de calcular analíticamente cada uno de estos fenómenos (lo cual requeriría la descarga y cómputo de complejos coeficientes y boletines del IERS), **el software resuelve este problema de manera elegante mediante mínimos cuadrados**. Dado que la transformación entre el sistema cartesiano local $\mathbf{v}_{local}$ y el sistema cartesiano celeste inercial $\mathbf{v}_{ICRS}$ (sin atmósfera) es una rotación pura de cuerpo rígido tridimensional, el problema se formula como el **Problema de Procrustes Ortogonal**.

#### Formulación del Problema
Sean $\mathbf{P} \in \mathbb{R}^{N \times 3}$ la matriz que contiene los $N$ vectores unitarios en el sistema local horizontal $\mathbf{v}_{local}$ y $\mathbf{Q} \in \mathbb{R}^{N \times 3}$ la matriz que contiene los correspondientes $N$ vectores celestes de catálogo $\mathbf{v}_{ICRS}$. Buscamos una matriz de rotación ortogonal $R \in \mathbb{R}^{3 \times 3}$ (perteneciente al grupo de rotación especial $SO(3)$) que minimice el error de mínimos cuadrados de correspondencia:

$$
\min_{R \in SO(3)} \|\mathbf{P} R - \mathbf{Q}\|_F^2
$$

donde $\|\cdot\|_F$ representa la norma de Frobenius.

Expandiendo el término de costo:

$$
\|\mathbf{P} R - \mathbf{Q}\|_F^2 = \text{Tr}\left( (\mathbf{P} R - \mathbf{Q})^T (\mathbf{P} R - \mathbf{Q}) \right) = \text{Tr}(\mathbf{P}^T \mathbf{P}) + \text{Tr}(\mathbf{Q}^T \mathbf{Q}) - 2 \text{Tr}(R^T \mathbf{P}^T \mathbf{Q})
$$


Dado que los dos primeros términos son constantes, minimizar el error equivale a maximizar la traza de la matriz de covarianza cruzada rotada:

$$
\max_{R} \text{Tr}(R^T H)
$$

donde $H$ es la matriz de covarianza cruzada de dimensiones $3 \times 3$ entre ambos sistemas vectoriales:

$$
H = \mathbf{P}^T \mathbf{Q} = \sum_{i=1}^N \mathbf{v}_{local, i} \mathbf{v}_{ICRS, i}^T
$$


#### Solución Mediante Descomposición en Valores Singulares (SVD)
Calculamos la descomposición SVD de la matriz de covarianza cruzada $H$:

$$
H = U \Sigma V^T
$$

donde $U, V$ son matrices ortogonales de $3 \times 3$ y $\Sigma$ es la matriz diagonal de valores singulares.

La matriz de rotación óptima de mínimos cuadrados $R$ que representa la orientación instantánea de la Tierra está dada por:

$$
R = U V^T
$$


Una vez obtenida la matriz $R$, podemos proyectar cualquier vector local horizontal de vuelta al sistema de coordenadas celestes inercial manteniendo la distorsión por refracción implícita:

$$
\mathbf{v}_{corrected, i} = R^T \mathbf{v}_{local, i}
$$


Este es un método de gran robustez matemática que calcula implícitamente el tiempo sidéreo y la precesión-nutación instantánea a partir de las correspondencias estelares.

---

### 2.3 Re-proyección a Coordenadas Celestes Aparentes

Una vez que los vectores locales horizontales con refracción se proyectan al marco celeste inercial como $\mathbf{v}_{corrected, i} = (v'_{x, i}, v'_{y, i}, v'_{z, i})^T$, se recalculan las coordenadas celestes esféricas aparentes $(\alpha_{app}, \delta_{app})$ mediante relaciones trigonométricas:

$$
\alpha_{app} = \arctan2(v'_{y, i}, v'_{x, i})
$$

$$\delta_{app} = \arctan\left( \frac{v'_{z, i}}{\sqrt{(v'_{x, i})^2 + (v'_{y, i})^2}} \right)$$

Se normaliza el ángulo de Ascensión Recta para asegurar que $\alpha_{app} \in [0, 2\pi)$. Estas coordenadas celestes refractadas se empaquetan en el objeto de salida `SkyCoord` para el resolvedor astrométrico.

---

### 2.4 Hackeo Dinámico de la Masa para Deflexión Gravitacional

El módulo `AstroCorrect` manipula dinámicamente el comportamiento interno de la biblioteca `erfa` para controlar el cómputo de la deflexión de la luz relativista:
1. **Deshabilitar Deflexión:** La función `no_grav_ld` intercepta las llamadas a `erfa.ld` y reemplaza el parámetro de masa deflectora `bm` por `0`:

$$
\text{erfa.ld}(bm, \dots) \to \text{erfa.ld}(0, \dots)
$$

2. **Deflexión Variable (Escalada):** Multiplica la masa por la gravedad relativa deseada $g/1.751$ (ver descripción de `my_gravity_sweep.py`).
3. **Restablecer Estado:** Al finalizar la consulta, devuelve la función original de ERFA al espacio de nombres del sistema para evitar efectos colaterales en otros módulos.

---

## 3. Estructura de la API del Módulo

### `AstroCorrect` (Clase)

#### 1. `__init__(self)`
* **Propósito:** Inicializa el interceptor de la biblioteca ERFA. Almacena la función original `erfa.ld` en la variable `self.origin_ld` y define los métodos de hackeo de masa nula y variable.

#### 2. `correct_ra_dec(self, stardata, options, var_grav = None)`
* **Propósito:** Aplica las correcciones físicas (aberración, paralaje, refracción local y deflexión gravitacional modificada) a las estrellas de catálogo.
* **Entradas:**
  - `stardata` (StarData): Estrellas de catálogo Gaia de entrada.
  - `options` (dict): Opciones de configuración del observador. Requiere:
    * `observation_lat`, `observation_long`, `observation_height` (Ubicación).
    * `observation_date`, `observation_time` (Fecha/Hora UTC).
    * `observation_wavelength`, `observation_pressure`, `observation_temp`, `observation_humidity` (Parámetros de refracción).
    * `enable_corrections_ref` (bool, si se calcula o no la refracción).
    * `enable_gravitational_def` (bool, si se calcula la deflexión estándar).
  - `var_grav` (float, opcional): Factor de escala gravitacional personalizado.
* **Salidas:** Retorna `(ret, mean_alt, mean_az)` donde `ret` es un objeto `StarData` con las coordenadas esféricas celestes aparentes corregidas y sus correspondientes vectores unitarios tridimensionales actualizados.

---

## 4. Bibliografía y Referencias de Soporte

1. **Green, R. M. (1985).** *Spherical Astronomy*. Cambridge University Press.
   - *Explica los modelos matemáticos de la refracción atmosférica, los sistemas de coordenadas locales y las correcciones espaciales.*

2. **Gower, J. C., & Dijksterhuis, G. B. (2004).** *Procrustes Problems*. Oxford University Press.
   - [DOI: 10.1093/acprof:oso/9780198510581.001.0001](https://doi.org/10.1093/acprof:oso/9780198510581.001.0001)
   - *Monografía formal que detalla el desarrollo algebraico del Problema de Procrustes Ortogonal y su resolución óptima mediante la descomposición SVD.*

3. **Hohenkerk, C. Y., & Sinclair, A. T. (1985).** *The Computation of Angular Atmospheric Refraction*. HM Nautical Almanac Office, Royal Greenwich Observatory.
   - *Establece las bases físicas del cálculo de la refracción angular integradas en los algoritmos estándar de la biblioteca ERFA.*

4. **Kabsch, W. (1976).** *A solution for the best rotation to relate two sets of vectors*. Acta Crystallographica Section A, 32(5), 922-923.
   - *El algoritmo Kabsch es el nombre formal en computación científica para resolver el problema de Procrustes ortogonal utilizando SVD en física aplicada y visión artificial.*
