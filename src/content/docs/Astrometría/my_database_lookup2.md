# Descripción Teórica y Matemática de `my_database_lookup2.py`

Este documento describe en detalle los fundamentos teóricos, formulaciones matemáticas y la lógica algorítmica implementada en el módulo `my_database_lookup2.py`. El objetivo principal de este programa es la carga, preprocesamiento astronómico, filtrado y almacenamiento optimizado de catálogos estelares (específicamente el catálogo **Tycho-2**).

---

## Índice

1. [Introducción y Arquitectura del Programa](#1-introducción-y-arquitectura-del-programa)
2. [Fundamentos Astronómicos](#2-fundamentos-astronómicos)
3. [Formulación Matemática](#3-formulación-matemática)
4. [Algoritmos de Búsqueda y Filtrado (`lookup_objects`)](#4-algoritmos-de-búsqueda-y-filtrado-lookup_objects)
5. [Estructura de Datos y Eficiencia Numérica](#5-estructura-de-datos-y-eficiencia-numérica)
6. [Descripción Informática del Módulo (API)](#6-descripción-informática-del-módulo-api)

---

## 1. Introducción y Arquitectura del Programa

El script `my_database_lookup2.py` está diseñado para resolver eficientemente la indexación espacial y la consulta rápida de estrellas para aplicaciones como la resolución de placas (*platesolving*) u orientación astronómica. 

El flujo lógico consta de dos fases principales:
1. **Carga y Reducción Astronómica:** Lee el catálogo en formato de texto plano (`.dat.txt`), aplica correcciones por movimiento propio para una época objetivo (por ejemplo, el año 2026), filtra estrellas por su brillo (magnitud límite) y proyecta las coordenadas celestes en un espacio cartesiano tridimensional (vectores directores).
2. **Persistencia y Búsqueda:** Almacena los datos procesados en un archivo binario comprimido de NumPy (`.npz`) para permitir cargas instantáneas en ejecuciones futuras, y proporciona una función de búsqueda por rangos de Ascensión Recta ($\alpha$) y Declinación ($\delta$) con manejo de discontinuidades geométricas.



<div style="display: flex; justify-content: center; width: 100%;">

``` mermaid
   %%{init: {"theme":"base","themeVariables":{
    "background":"#000000",
    "primaryColor":"#000000",
    "primaryTextColor":"#ffffff",
    "textColor":"#ffffff",
    "lineColor":"#ffffff",
    "edgeColor":"#ffffff"
}}}%%
graph TD
    A[Catálogo Tycho-2 .dat.txt] --> B{¿Existe archivo .npz?}
    B -- Sí (Carga Rápida) --> C[Cargar matrices NumPy directas]
    B -- No (Procesar) --> D[Leer línea por línea]
    D --> E[Filtrar estrellas incompletas o tenues]
    E --> F[Calcular corrección por Movimiento Propio]
    F --> G[Propagar RA/DEC a época objetivo]
    G --> H[Convertir a Radianes]
    H --> I[Eliminar entradas nulas]
    I --> J[Ordenar por brillo de mayor a menor]
    J --> K[Calcular Cosenos Directores X, Y, Z]
    K --> L[Guardar en .npz comprimido]
    C --> M[Listo para lookup_objects]
    L --> M

    %% Forzar color de las flechas/links (índices 0..6)
    linkStyle 0,1,2,3,4,5,6 stroke:#ffffff,stroke-width:2px     
```
</div>

---

## 2. Fundamentos Astronómicos

### 2.1. Sistema de Coordenadas Ecuatoriales Celestes
El cielo se modela como una esfera unitaria (Esfera Celeste). La posición de cualquier astro se define mediante dos coordenadas angulares en el sistema de coordenadas ecuatoriales:
* **Ascensión Recta ($\alpha$ o RA):** Ángulo medido sobre el ecuador celeste desde el punto Aries (equinoccio vernal) hacia el Este. Varía habitualmente en el rango $[0, 360^\circ)$ o $[0, 24\text{h})$.
* **Declinación ($\delta$ o DEC):** Distancia angular medida perpendicularmente al ecuador celeste hacia el Norte (positiva) o hacia el Sur (negativa). Su rango es $[-90^\circ, +90^\circ]$.

### 2.2. Movimiento Propio (Proper Motion)
Las estrellas no están fijas en el espacio; poseen un movimiento intrínseco relativo al Sol denominado **movimiento propio**. Este movimiento se proyecta en la esfera celeste como dos velocidades angulares:
* $\mu_\alpha^* = \mu_\alpha \cos\delta$: Movimiento propio en la dirección de la Ascensión Recta (corregido por el efecto de convergencia de los meridianos en los polos).
* $\mu_\delta$: Movimiento propio en la dirección de la Declinación.

En el catálogo Tycho-2, estas componentes se expresan en **miliarcosegundos por año** ($\text{mas/año}$) y están referenciadas a la época media de observación del catálogo:

$$
t_0 = 1991.25
$$


El equinoccio y ecuador de referencia utilizados para el catálogo Tycho-2 corresponden al estándar internacional J2000.0 (época J2000).

---

## 3. Formulación Matemática

El procesamiento matemático del script se divide en tres etapas secuenciales: conversión de unidades, propagación temporal y proyección cartesiana.

### 3.1. Conversión de Unidades de Movimiento Propio
Las variables correspondientes a los movimientos propios en el catálogo Tycho-2 se encuentran en la columna 12 ($\text{pmRA} = \mu_\alpha^*$) y en la columna 13 ($\text{pmDEC} = \mu_\delta$) en $\text{mas/año}$. El script convierte estas velocidades angulares a **grados por año** ($^\circ\text{/año}$):


$$
\mu_\alpha^* \, [^\circ\text{/año}] = \frac{\text{pmRA}}{1000 \cdot 3600}
$$



$$
\mu_\delta \, [^\circ\text{/año}] = \frac{\text{pmDEC}}{1000 \cdot 3600}
$$


*Justificación:* Hay $1000\text{ mas}$ en 1 arcosegundo ($''$), y $3600''$ en 1 grado ($^\circ$). Por tanto, $1^\circ = 3.6 \times 10^6\text{ mas}$.

### 3.2. Corrección Geométrica por Declinación y Regularización Polar
Dado que $\text{pmRA}$ es la componente tangencial sobre el paralelo local ($\mu_\alpha^* = \mu_\alpha \cos\delta$), para obtener la velocidad real de cambio en la coordenada de Ascensión Recta ($\mu_\alpha$) debemos dividir por el coseno de la declinación:


$$
\mu_\alpha = \frac{\mu_\alpha^*}{\cos\delta}
$$


#### El problema de la singularidad polar:
Cuando la declinación de una estrella se aproxima a los polos celestes ($\delta \to \pm 90^\circ$), el término $\cos\delta \to 0$. Esto causa que $\mu_\alpha \to \infty$, introduciendo inestabilidad numérica extrema en la división.

Para mitigar esto, el código implementa un umbral de regularización:
* Si $\cos\delta > 0.1$ (lo cual equivale a un límite en declinación de $|\delta| < \arccos(0.1) \approx 84.26^\circ$):
  Se calcula $\mu_\alpha$ de manera ordinaria.
* Si $\cos\delta \le 0.1$ (zona polar con $|\delta| \ge 84.26^\circ$):
  Se descarta el movimiento propio asignando valores nulos a ambos componentes:

$$
\mu_\alpha = 0, \quad \mu_\delta = 0
$$


### 3.3. Propagación Temporal a la Época Objetivo
Dada una época de destino $t$ (por ejemplo, el año actual $t = 2026$), el diferencial de tiempo transcurrido desde la época de observación es:


$$
\Delta t = t - t_0 = t - 1991.25
$$


Las nuevas coordenadas celestes en grados se calculan aplicando una aproximación lineal de primer orden:


$$
\alpha(t) = \alpha(t_0) + \mu_\alpha \cdot \Delta t
$$



$$
\delta(t) = \delta(t_0) + \mu_\delta \cdot \Delta t
$$


Posteriormente, se realiza la conversión a radianes:


$$
\alpha_{\text{rad}} = \alpha(t) \cdot \frac{\pi}{180^\circ}
$$



$$
\delta_{\text{rad}} = \delta(t) \cdot \frac{\pi}{180^\circ}
$$


### 3.4. Proyección a Coordenadas Cartesianas (Cosenos Directores)
Para optimizar los cálculos geométricos tridimensionales posteriores, la posición esférica $(\alpha_{\text{rad}}, \delta_{\text{rad}})$ en la esfera celeste unitaria se proyecta a un vector director cartesiano tridimensional $\mathbf{v} = (x, y, z)^T$:


$$
x = \cos(\alpha_{\text{rad}}) \cos(\delta_{\text{rad}})
$$



$$
y = \sin(\alpha_{\text{rad}}) \cos(\delta_{\text{rad}})
$$



$$
z = \sin(\delta_{\text{rad}})
$$


Donde:
* $\mathbf{v}$ representa un vector unitario, verificándose que:

$$
\|\mathbf{v}\| = \sqrt{x^2 + y^2 + z^2} = \sqrt{\cos^2\delta(\cos^2\alpha + \sin^2\alpha) + \sin^2\delta} = \sqrt{\cos^2\delta (1) + \sin^2\delta} = 1
$$


---

## 4. Algoritmos de Búsqueda y Filtrado (`lookup_objects`)

El método `lookup_objects` implementa un filtro rápido sobre el catálogo precargado utilizando tres criterios: rango de Ascensión Recta, rango de Declinación y Magnitud Máxima.

### 4.1. Filtrado por Magnitud
Dado un límite de magnitud aparente $m_{\text{máx}}$, se seleccionan únicamente las estrellas cuyo brillo cumpla con:


$$
m_{\text{estrella}} < m_{\text{máx}}
$$


> [!NOTE]
> Recuerde que en la escala de magnitudes astronómicas, a menor valor numérico, mayor es el brillo intrínseco del objeto.

### 4.2. Filtrado por Ascensión Recta con Discontinuidad de $360^\circ$
Dado un intervalo de consulta en Ascensión Recta $[\alpha_{\text{mín}}, \alpha_{\text{máx}}]$, el algoritmo maneja la naturaleza periódica del ángulo (donde $360^\circ \equiv 0^\circ$):

1. **Caso Estándar ($\alpha_{\text{mín}} < \alpha_{\text{máx}}$):**
   El intervalo no cruza el origen. La condición de filtrado es lógica de conjunción:

$$
\alpha_{\text{mín}} < \alpha < \alpha_{\text{máx}}
$$


2. **Caso de Discontinuidad ($\alpha_{\text{mín}} \ge \alpha_{\text{máx}}$):**
   El intervalo cruza el límite de la discontinuidad (por ejemplo, una búsqueda de $350^\circ$ a $10^\circ$). La condición de filtrado se convierte en una disyunción lógica:

$$
\alpha > \alpha_{\text{mín}} \quad \lor \quad \alpha < \alpha_{\text{máx}}
$$


### 4.3. Filtrado por Declinación
El filtrado en declinación opera de forma similar al de ascensión recta en el intervalo $[\delta_{\text{mín}}, \delta_{\text{máx}}]$. Aunque la declinación físicamente está acotada entre $[-90^\circ, 90^\circ]$ y no presenta periodicidad natural del mismo tipo, el código incluye una estructura análoga:

* **Caso Estándar ($\delta_{\text{mín}} < \delta_{\text{máx}}$):**

$$
\delta_{\text{mín}} < \delta < \delta_{\text{máx}}
$$

* **Caso de Discontinuidad teórica ($\delta_{\text{mín}} \ge \delta_{\text{máx}}$):**

$$
\delta > \delta_{\text{mín}} \quad \lor \quad \delta < \delta_{\text{máx}}
$$


---

## 5. Estructura de Datos y Eficiencia Numérica

### 5.1. Organización de Matrices
Para cada estrella cargada en memoria, se asignan valores en dos matrices NumPy altamente eficientes:

1. **`star_table` (tipo `float32`, dimensiones $N \times 6$):**
   Almacena las propiedades físicas y geométricas.

$$
\text{Fila } i = \begin{bmatrix} \alpha_{\text{rad}} & \delta_{\text{rad}} & x & y & z & \text{mag} \end{bmatrix}
$$

2. **`star_catID` (tipo `uint16`, dimensiones $N \times 3$):**
   Almacena el identificador único del catálogo Tycho-2, compuesto por tres números enteros:
   * **TYC1:** Número de región astronómica.
   * **TYC2:** Número de estrella dentro de la región.
   * **TYC3:** Número de componente (generalmente 1 para estrellas individuales, o más en sistemas múltiples).

### 5.2. Clasificación por Brillo (Sorting)
Durante la inicialización, se calcula un arreglo de índices ordenados `brightness_ii` a partir del vector de magnitudes (columna 5 de `star_table`):


$$
\text{brightness\_ii} = \text{argsort}(\text{star\_table}[:, 5])
$$


Ambas matrices (`star_table` y `star_catID`) son reordenadas utilizando estos índices. Esto asegura que:


$$
\text{star\_table}[i, 5] \le \text{star\_table}[i+1, 5] \quad \forall i \in [0, N-2]
$$


*Ventaja:* Al buscar estrellas brillantes, se garantiza que los primeros elementos recuperados corresponden siempre a las estrellas de mayor brillo aparente en el cielo, permitiendo truncar las búsquedas eficientemente si se requiere.


---

## 6. Descripción Informática del Módulo (API)

A continuación, se detalla la estructura lógica del módulo, describiendo la clase, sus atributos, constructores y métodos con sus respectivas firmas de entrada y salida.

### 6.1. Clase `database_searcher`

Clase principal encargada de la ingestión de catálogos estelares (crudos o comprimidos), la corrección espacial de las posiciones estelares y el procesamiento de consultas de región celeste.

#### **Atributos de la Clase**
* **`self.num_entries` (int):** Número total de registros de estrellas cargados válidamente en memoria.
* **`self.star_table` (numpy.ndarray):** Matriz de tipo `float32` y dimensiones $N \times 6$. Cada fila representa una estrella con las siguientes columnas indexadas:
  * `[0]`: Ascensión Recta ($\alpha$) en radianes.
  * `[1]`: Declinación ($\delta$) en radianes.
  * `[2]`: Componente cartesiano $x$ del vector director unitario.
  * `[3]`: Componente cartesiano $y$ del vector director unitario.
  * `[4]`: Componente cartesiano $z$ del vector director unitario.
  * `[5]`: Magnitud aparente ($mag$).
* **`self.star_catID` (numpy.ndarray):** Matriz de tipo `uint16` y dimensiones $N \times 3$. Guarda el identificador jerárquico Tycho-2 `[TYC1, TYC2, TYC3]`. Si la carga se realiza desde un archivo `.npz`, esta matriz se inicializa con ceros.
* **`self.brightness_ii` (numpy.ndarray):** Arreglo unidimensional de enteros (`int`) con los índices resultantes de la ordenación de menor a mayor magnitud (mayor a menor brillo).
* **`self.epoch_equinox` (float):** Constante estática `2000` que define la época del equinoccio del catálogo de referencia (J2000.0).
* **`self.pm_origin` (float):** Constante estática `1991.25` que define la época astronómica base de las mediciones de posición del catálogo Tycho-2.

---

### 6.2. Constructor: `__init__`

```python
def __init__(self, catalogue_path, star_max_magnitude=12, epoch_proper_motion='now', debug_folder=None):
```

#### **Descripción**
Inicializa la base de datos de búsqueda. Si la ruta provista termina con la extensión `.npz`, realiza una carga binaria directa y ultrarrápida. En caso contrario (catálogo `.dat.txt` en texto plano), realiza el análisis de parseo línea por línea mediante CSV, aplica la física de movimiento propio y las transformaciones geométricas.

#### **Parámetros de Entrada**
| Parámetro | Tipo | Descripción | Por Defecto |
| :--- | :--- | :--- | :--- |
| `catalogue_path` | `str` o `pathlib.Path` | Ruta del archivo de catálogo estelar (`.npz` o `.dat.txt`). | *Requerido* |
| `star_max_magnitude` | `float` o `int` | Magnitud aparente máxima permitida al importar del archivo de texto. | `12` |
| `epoch_proper_motion` | `int`, `float`, `str` o `None` | Año de destino para aplicar el movimiento propio. Puede ser un número entero/flotante (ej. `2026`), la cadena `'now'` (calcula el año UTC actual) o `None` (ignora movimientos propios). | `'now'` |
| `debug_folder` | `str` o `pathlib.Path` | Directorio de volcado para el registro detallado (`database_lookupDEBUG.txt`). | `None` |

#### **Parámetros de Salida / Retorno**
* **`None`** (Inicializa los atributos internos del objeto creado).

---

### 6.3. Método: `lookup_objects`

```python
def lookup_objects(self, range_ra, range_dec, star_max_magnitude=12):
```

#### **Descripción**
Filtra y devuelve las estrellas que se encuentren dentro del sector celeste delimitado por los rangos espaciales provistos y que cumplan el umbral de magnitud especificado.

#### **Parámetros de Entrada**
| Parámetro | Tipo | Descripción | Por Defecto |
| :--- | :--- | :--- | :--- |
| `range_ra` | `tuple` de 2 flotantes, o `None` | Rango de Ascensión Recta en grados `(ra_min, ra_max)`. Si es `None`, se omite este filtro. | *Requerido* |
| `range_dec` | `tuple` de 2 flotantes, o `None` | Rango de Declinación en grados `(dec_min, dec_max)`. Si es `None`, se omite este filtro. | *Requerido* |
| `star_max_magnitude` | `float` o `int` | Magnitud límite de filtrado de brillo (las estrellas devueltas serán más brillantes que este límite). | `12` |

#### **Parámetros de Salida / Retorno**
Devuelve una tupla de dos arreglos NumPy:
* **`star_table` (numpy.ndarray):** Submatriz de dimensiones $M \times 6$ con los datos de las estrellas válidas que cumplen los filtros, ordenadas de mayor a menor brillo.
* **`star_catID` (numpy.ndarray):** Submatriz de dimensiones $M \times 3$ con los identificadores Tycho-2 asociados a dichas estrellas.

---

### 6.4. Método: `save_npz`

```python
def save_npz(self, file):
```

#### **Descripción**
Guarda y exporta el catálogo estelar preprocesado y propagado en memoria en un formato de compresión binario optimizado para NumPy. Esto evita tener que releer y calcular el movimiento propio a partir del catálogo crudo en futuras ejecuciones.

#### **Parámetros de Entrada**
| Parámetro | Tipo | Descripción | Por Defecto |
| :--- | :--- | :--- | :--- |
| `file` | `str` o `pathlib.Path` | Ruta de salida donde se guardará el archivo comprimido `.npz`. | *Requerido* |

#### **Parámetros de Salida / Retorno**
* **`None`** (Guarda el archivo en el sistema de almacenamiento secundario).

---

## Bibliografía

- Høg, E., Fabricius, C., Makarov, V. V., Urban, S., Corbin, T., Wycoff, G., Bastian, U., Schwekendiek, P., & Wicenec, A. (2000). The Tycho-2 catalogue of the 2.5 million brightest stars. *Astronomy and Astrophysics*, 355, L27–L30.

- Hipparcos and Tycho Catalogues (ESA SP-1200). (1997). *ESA Special Publication*, Vol. 1-6. Noordwijk: ESA Publications Division.

- The International Celestial Reference System (ICRS). (1997). *IAU Resolution B2*. Adopted by the 23rd General Assembly of the IAU, Kyoto, 1997.

- Capitaine, N., Chapront, J., Lambert, S., & Wallace, P. (2003). Expressions for IAU 2000 precession quantities. *Astronomy and Astrophysics*, 412(2), 567–586. https://doi.org/10.1051/0004-6361:20031540

- Harris, P., & Zarnecki, A. F. (2022). The Tycho-2 proper motion catalogue: accuracy and stability. *Astronomy and Astrophysics*, 658, A125.

- NumPy Documentation. (2024). *NumPy Reference*. Recuperado de https://numpy.org/doc/stable/reference/

- Virtanen, P., Gommers, R., Oliphant, T. E., Haberland, M., Reddy, T., Cournapeau, D., Burovski, E., Peterson, P., Weckesser, W., Bright, J., van der Walt, S. J., Brett, M., Wilson, J., Millman, K. J., Mayorov, N., Nelson, A. R. J., Jones, E., Kern, R., Larson, E., ... & Carey, V. J. (2020). SciPy 1.0: fundamental algorithms for scientific computing in Python. *Nature Methods*, 17(3), 261–272. https://doi.org/10.1038/s41592-019-0686-2

- Astropy Collaboration. (2018). The Astropy Project: Sustaining and Growing a Community-driven Open-source Project. *The Astrophysical Journal*, 881(1), 67. https://doi.org/10.3847/1538-4357/aabb2f

- Urban, S. E., & Seidelmann, P. K. (2013). *Explanatory Supplement to the Astronomical Almanac* (3rd ed.). University Science Books.

- Greisen, E. W., & Allen, M. S. (1986). FITS Astronomical Image Processing System (AIPS). In D. A. Bohlender (Ed.), *Astronomical Data Analysis Software and Systems III* (ASP Conference Series, Vol. 52, pp. 195–199).
