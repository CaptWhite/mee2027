# Descripción Teórica y Matemática de `my_database_cache.py`

Este documento describe detalladamente el diseño matemático, algorítmico e informático del módulo `my_database_cache.py`, encargado de la gestión de memoria cacheada para catálogos estelares y bases de datos geométricas de triángulos utilizadas en el proceso de resolución de placas astronómicas (*platesolving*).

---

## Índice

1. [Introducción y Propósito del Módulo](#1-introducción-y-propósito-del-módulo)
2. [Fundamentos Algorítmicos y Matemáticos](#2-fundamentos-algorítmicos-y-matemáticos)
3. [Arquitectura del Mecanismo de Caché](#3-arquitectura-del-mecanismo-de-caché)
4. [Descripción Informática del Módulo (API)](#4-descripción-informática-del-módulo-api)

---

## 1. Introducción y Propósito del Módulo

El módulo `my_database_cache.py` actúa como una capa de persistencia intermedia en memoria (Caché Singleton) que gestiona dos tipos de datos:
1. **Catálogos estelares tradicionales:** Representados por instancias de la clase `database_searcher` de `my_database_lookup2`.
2. **Bases de datos de patrones de estrellas (Triángulos):** Utilizadas para la identificación instantánea del campo de estrellas mediante algoritmos basados en KD-Trees multidimensionales.

El principal objetivo del módulo es evitar el reanálisis y la recarga computacionalmente costosa de archivos en disco (archivos `.dat` o archivos comprimidos `.npz`) durante consultas repetitivas de placas.

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
    A[Llamada open_catalogue path] --> B{¿Está en _cache.catalogue_cache?}
    B -- Sí --> C[Retornar objeto en caché]
    B -- No --> D{¿Qué tipo de path es?}
    D -- get_triangle_db_path --> E[Cargar datos de triángulos y KDTree]
    D -- Otro path .npz / .dat --> F[Instanciar database_searcher]
    E --> G[Almacenar en caché y retornar]
    F --> G
```

</div>
---

## 2. Fundamentos Algorítmicos y Matemáticos

El corazón matemático de este módulo reside en la clase `TriangleData` y su indexación mediante un **Árbol K-Dimensional (KD-Tree)** con restricciones de periodicidad.

### 2.1. Representación Geométrica de Patrones (Triángulos)
En el algoritmo de platesolving, un patrón estelar se descompone en combinaciones de triángulos formados por una estrella central ("ancla") y sus vecinas. Para cada triángulo, se calculan características invariantes ante traslaciones, rotaciones y escalas de la imagen:
1. **Relación de radios (Ratio):** Razón entre las longitudes de los lados del triángulo.
2. **Separación angular ($\phi$):** El ángulo formado entre las estrellas del triángulo en la esfera celeste.

La matriz `self.triangles` posee dimensiones $(n \times T \times 2)$, donde:
* $n$ es el número de patrones estelares (estrellas de anclaje).
* $T$ es el número de combinaciones de triángulos formadas por las $N$ estrellas vecinas del patrón:

$$
T = \frac{N(N - 1)}{2}
$$

* El último eje de dimensión $2$ contiene el par ordenado $\mathbf{p} = (\text{ratio}, \phi)$.

### 2.2. KD-Tree Bidimensional con Topología Toroidal
Para realizar búsquedas ultrarrápidas de correspondencias en tiempo $O(\log M)$ (donde $M = n \times T$), las propiedades del triángulo se aplanan en una matriz bidimensional de forma $(M \times 2)$ mediante un redimensionamiento:


$$
\text{Puntos} = \text{reshape}(\text{self.triangles}, (-1, 2))
$$


Se construye un KD-Tree de SciPy (`scipy.spatial.KDTree`) configurando condiciones de contorno periódicas:


$$
\text{kd\_tree} = \text{KDTree}(\text{Puntos}, \text{boxsize}=[9999999, 2\pi])
$$


#### Explicación matemática del parámetro `boxsize`:
La métrica ordinaria de distancia euclidiana en 2D entre dos puntos de características $p_1 = (r_1, \theta_1)$ y $p_2 = (r_2, \theta_2)$ es:


$$
d(p_1, p_2) = \sqrt{(r_1 - r_2)^2 + (\theta_1 - \theta_2)^2}
$$


Sin embargo, el ángulo polar celeste $\theta$ es periódico con periodo $2\pi$ radianes. Bajo la métrica euclidiana plana, un ángulo de $0.01\text{ rad}$ y un ángulo de $2\pi - 0.01\text{ rad}$ estarían a una distancia aproximada de $2\pi \approx 6.28$, cuando geométricamente están separados únicamente por $0.02\text{ rad}$.

Para corregir esto, el parámetro `boxsize` implementa una topología toroidal:
* **Dimensión 1 (Ratio $r$):** Se establece un límite de periodicidad de $9\,999\,999$, un valor infinitamente superior al rango real de ratios de lados. Esto hace que el eje geométrico del ratio actúe como un espacio euclidiano plano estándar.
* **Dimensión 2 (Ángulo $\theta$):** Se establece un límite de periodicidad de $2\pi$ ($360^\circ$). La distancia periódica en este eje se redefine internamente como:


$$
d_{\text{periódica}}(\theta_1, \theta_2) = \min\left(|\theta_1 - \theta_2|, 2\pi - |\theta_1 - \theta_2|\right)
$$


La distancia total sobre el toro de búsqueda es, por tanto:


$$
D_{\text{toro}}(p_1, p_2) = \sqrt{(r_1 - r_2)^2 + d_{\text{periódica}}(\theta_1, \theta_2)^2}
$$


---

## 3. Arquitectura del Mecanismo de Caché

El módulo encapsula el almacenamiento de datos en la clase estática `_cache`, y define métodos auxiliares para poblar de forma síncrona el almacenamiento.

### 3.1. Carga Dinámica y Fallo de Caché (*Cache Miss*)
Cuando se invoca la función de carga para el catálogo de triángulos y no se localizan los datos físicos en la ruta predeterminada de la aplicación (`TripleTrianglePlatesolveDatabase`), se produce un fallo crítico de datos. 

Para resolverlo sin interrumpir el flujo, el módulo se acopla dinámicamente con `my_platesolve_new`:
1. Captura la excepción de carga faltante (`Exception`).
2. Invoca el generador de base de datos astronómica: `my_platesolve_new.generate()`.
3. Una vez creado el catálogo geométrico en disco, vuelve a intentar la lectura y carga definitiva de las estructuras.

---

## 4. Descripción Informática del Módulo (API)

### 4.1. Clase Interna `_cache`

Actúa como un contenedor estático para las referencias a las estructuras cacheadas en memoria.

#### **Atributos de Clase**
* **`database_cache` (dict):** Diccionario destinado a almacenar objetos de bases de datos astronómicas generales (actualmente en desuso).
* **`catalogue_cache` (dict):** Diccionario asociativo donde las claves (`keys`) corresponden a las rutas de archivos de catálogos y los valores (`values`) contienen los objetos cargados en memoria (`database_searcher` o `TriangleData`).

---

### 4.2. Clase `TriangleData`

```python
class TriangleData:
```

#### **Descripción**
Clase envolvente que estructura las matrices de patrones de astros y genera el árbol espacial indexado para la resolución de placas.

#### **Constructor: `__init__`**
```python
def __init__(self, cata_data):
```
* **Parámetros de Entrada:**
  * `cata_data` (dict o `numpy.lib.npyio.NpzFile`): Archivo cargado comprimido con las siguientes llaves internas:
    * `'triangles'`: Arreglo de dimensiones $(n \times T \times 2)$.
    * `'anchors'`: Representación vectorial de las estrellas de anclaje.
    * `'pattern_data'`: Arreglo de dimensiones $(n \times N \times 5)$.
    * `'pattern_ind'`: Arreglo de dimensiones $(n \times N)$ con los índices enteros de las estrellas vecinas.
* **Atributos Creados:**
  * `self.triangles` (numpy.ndarray)
  * `self.anchors` (numpy.ndarray)
  * `self.pattern_data` (numpy.ndarray)
  * `self.pattern_ind` (numpy.ndarray)
  * `self.kd_tree` (scipy.spatial.KDTree) - Inicializado con topología toroidal.

---

### 4.3. Funciones del Módulo

#### **Función: `work`**
```python
def work()
```
* **Descripción:** Realiza la carga de datos del catálogo de patrones de triángulos. Intenta leer la ruta específica de la aplicación local de MEE2024. Si falla por ausencia de archivo, delega en `my_platesolve_new.generate()` para crearlo antes de cargarlo definitivamente.
* **Entradas:** Ninguna.
* **Salida:** `None`.

#### **Función: `prepare_triangles`**
```python
def prepare_triangles()
```
* **Descripción:** Función de inicialización pública de la base de datos de triángulos. Invoca de manera síncrona a `work()`.
* **Entradas:** Ninguna.
* **Salida:** `None`.


#### **Función: `open_catalogue`**
```python
def open_catalogue(path, debug_folder=None, **kwaargs)
```
* **Descripción:** Abre un catálogo estelar y devuelve su instancia en caché. 
  * Si el catálogo no existe en `_cache.catalogue_cache`, lo crea y lo almacena antes de retornarlo.
  * Si el catálogo ya está en caché. lo devuelve inmediatamentee
* **Parámetros de Entrada:**
  * `path` (str): Ruta del catálogo. Si coincide con `get_triangle_db_path()`, se inicia la lógica de sincronización.
  * `debug_folder` (str o Path, opcional): Ruta para archivos de depuración.
  * `**kwaargs`: Argumentos variables adicionales.
* **Parámetros de Salida / Retorno:**
  * Instancia de `database_searcher` o `TriangleData` recuperada de la memoria caché.

---

## Bibliografía

- Bentley, J. L. (1975). Multidimensional binary search trees used for associative searching. *Communications of the ACM*, 18(9), 509–517. https://doi.org/10.1145/361002.361007

- Friedman, J. H., Bentley, J. L., & Finkel, R. A. (1977). An algorithm for finding best matches in logarithmic expected time. *ACM Transactions on Mathematical Software*, 3(3), 209–226. https://doi.org/10.1145/355744.355745

- Virtanen, P., Gommers, R., Oliphant, T. E., Haberland, M., Reddy, T., Cournapeau, D., Burovski, E., Peterson, P., Weckesser, W., Bright, J., van der Walt, S. J., Brett, M., Wilson, J., Millman, K. J., Mayorov, N., Nelson, A. R. J., Jones, E., Kern, R., Larson, E., ... & Carey, V. J. (2020). SciPy 1.0: fundamental algorithms for scientific computing in Python. *Nature Methods*, 17(3), 261–272. https://doi.org/10.1038/s41592-019-0686-2

- NumPy Documentation. (2024). *NumPy Reference*. Recuperado de https://numpy.org/doc/stable/reference/

- Astropy Collaboration. (2018). The Astropy Project: Sustaining and Growing a Community-driven Open-source Project. *The Astrophysical Journal*, 881(1), 67. https://doi.org/10.3847/1538-4357/aabb2f

- Høg, E., Fabricius, C., Makarov, V. V., Urban, S., Corbin, T., Wycoff, G., Bastian, U., Schwekendiek, P., & Wicenec, A. (2000). The Tycho-2 catalogue of the 2.5 million brightest stars. *Astronomy and Astrophysics*, 355, L27–L30.

- Irani, M., & Anandan, J. (1998). Periodic motion segmentatio and its application to astronomical image sequences. *IEEE Transactions on Pattern Analysis and Machine Intelligence*, 20(4), 407–417. https://doi.org/10.1109/34.677259

- Lang, D., Hogg, D. W., Mierle, K., & Blanton, M. (2010). Astrometry.net: Blind astrometric calibration of arbitrary astronomical images. *The Astronomical Journal*, 139(5), 1782–1800. https://doi.org/10.1088/0004-6256/139/5/1782

