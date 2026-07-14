## Clase NearestNeighbors 
La clase NearestNeighbors (común en librerías como **scikit-learn** en Python) se utiliza para aprender y calcular la proximidad entre diferentes puntos de datos en un espacio multidimensional. Sirve como base para el algoritmo de aprendizaje automático KNN (K-Nearest Neighbors)

``` python
class NearestNeighbors(KNeighborsMixin, RadiusNeighborsMixin, NeighborsBase):
    """Modelo de aprendizaje no supervisado para implementar búsquedas de vecinos.

    Lea más en la :ref:`Guía de usuario <unsupervised_neighbors>`.

    Parámetros
    ----------
    n_neighbors : int, por defecto=5
        Número de vecinos a utilizar por defecto para las consultas :meth:`kneighbors`.

    radius : float, por defecto=1.0
        Rango del espacio de parámetros a utilizar por defecto para las consultas :meth:`radius_neighbors`.

    algorithm : {'auto', 'ball_tree', 'kd_tree', 'brute'}, por defecto='auto'
        Algoritmo utilizado para calcular los vecinos más cercanos:

        - 'ball_tree' utilizará :class:`BallTree`
        - 'kd_tree' utilizará :class:`KDTree`
        - 'brute' utilizará una búsqueda por fuerza bruta.
        - 'auto' intentará decidir el algoritmo más apropiado
          basándose en los valores pasados al método :meth:`fit`.

        Nota: el ajuste (fitting) sobre una entrada dispersa (sparse) anulará la configuración de este parámetro y utilizará fuerza bruta.

    leaf_size : int, por defecto=30
        Tamaño de hoja pasado a BallTree o KDTree. Esto puede afectar la velocidad de construcción y de consulta, así como la memoria
        requerida para almacenar el árbol. El valor óptimo depende de la naturaleza del problema.

    metric : str o ejecutable (callable), por defecto='minkowski'
        Métrica a utilizar para el cálculo de distancias. Por defecto es "minkowski", lo que da como resultado la distancia euclidiana estándar cuando p = 2. Ver la documentación de `scipy.spatial.distance
        <https://docs.scipy.org/doc/scipy/reference/spatial.distance.html>`_ y
        las métricas enumeradas en:  class:`~sklearn.metrics.pairwise.distance_metrics` para valores de métrica válidos.

        Si la métrica es "precomputed", se asume que X es una matriz de distancia y debe ser cuadrada durante el ajuste (fit). X puede ser un :term:`grafo disperso`, en cuyo caso solo los elementos "no cero" pueden ser considerados vecinos.

        Si la métrica es una función ejecutable (callable), toma como entrada dos arreglos 
        que representan vectores 1D y debe devolver un único valor que indique la distancia 
        entre esos vectores. Esto funciona para las métricas de Scipy, pero es menos 
        eficiente que pasar el nombre de la métrica como una cadena de texto (string).

    p : float (positivo), por defecto=2
        Parámetro para la métrica de Minkowski de sklearn.metrics.pairwise.pairwise_distances. Cuando p = 1, esto es
        equivalente a usar la distancia de Manhattan (l1), y la distancia euclidiana (l2) para p = 2. Para un valor de p arbitrario, se utiliza la distancia de Minkowski (l_p).

    metric_params : dict, por defecto=None
        Argumentos de palabras clave (keyword arguments) adicionales para la función de métrica.

    n_jobs : int, por defecto=None
        El número de tareas paralelas a ejecutar para la búsqueda de vecinos.
        ``None`` significa 1 a menos que se esté en un contexto de :obj:`joblib.parallel_backend`.
        ``-1`` significa utilizar todos los procesadores. Ver el :term:`Glosario <n_jobs>`
        para más detalles.

    Atributos
    ----------
    effective_metric_ : str
        Métrica utilizada para calcular las distancias a los vecinos.

    effective_metric_params_ : dict
        Parámetros para la métrica utilizada para calcular las distancias a los vecinos.

    n_features_in_ : int
        Número de características (features) vistas durante el ajuste (:term:`fit`).

        .. versionadded:: 0.24

    feature_names_in_ : ndarray de forma (`n_features_in_`,)
        Nombres de las características (features) vistas durante el ajuste (:term:`fit`). 
        Se define solo cuando `X` tiene nombres de características que son todos cadenas de texto.

        .. versionadded:: 1.0

    n_samples_fit_ : int
        Número de muestras en los datos ajustados.
    """

```
##  neigh = NearestNeighbors(n_neighbors=2)
Esta línea de código inicializa un objeto de la clase NearestNeighbors configurado para buscar los 2 vecinos más cercanos de cualquier punto que le consultes más adelante.
Aquí tienes el desglose exacto de lo que hace y cómo funciona paso a paso:
### 1. ¿Qué se está creando?
* NearestNeighbors(...): Es un modelo de aprendizaje no supervisado de la librería scikit-learn. No predice etiquetas ni clasifica; solo aprende la estructura geométrica de tus datos para medir distancias.
* n_neighbors=2: Le estás indicando explícitamente que, por defecto, cada vez que hagas una pregunta sobre un punto, quieres que encuentre únicamente los 2 puntos más cercanos a él dentro de todo tu conjunto de datos.

### 2. El proceso completo en el código
Normalmente, esta línea nunca va sola. Forma parte de un proceso de tres pasos:

from sklearn.neighbors import NearestNeighbors
**Paso 1**: Configurar el buscador (aquí se define tu línea)neigh = NearestNeighbors(n_neighbors=2)
**Paso 2**: Entrenar / Indexar los datos# Aquí el algoritmo construye el árbol espacial ('kd_tree' o 'ball_tree')
```python
neigh.fit(TUS_DATOS)
```
**Paso 3**: Consultar los vecinos# Preguntas por los 2 vecinos más cercanos de un punto "X"
``` python
distancias, indices = neigh.kneighbors(NUEVO_PUNTO)
```

##### 3. ¿Qué te devolverá cuando lo uses?
Cuando ejecutes la consulta (kneighbors), el objeto neigh te entregará dos matrices:

   1. Las distancias: Los valores numéricos exactos de la distancia física desde tu punto de consulta hasta sus 2 vecinos.
   2. Los índices: Las posiciones (filas) de esos 2 vecinos dentro de tu matriz de datos original (TUS_DATOS), para que puedas saber exactamente qué registros son.

### Un detalle importante sobre el "primer" vecino
Si utilizas un punto de consulta que ya existía dentro de tu conjunto de datos de entrenamiento, el vecino más cercano (n_neighbors=1) será el propio punto, con una distancia de 0.0. Por eso, en la práctica, se suele configurar n_neighbors=2 para poder descubrir cuál es el segundo punto más cercano (es decir, el vecino real más próximo que no sea él mismo).


---

### neigh.fit(candidate_stars)
La línea neigh.fit(candidate_stars) realiza la fase de indexación o entrenamiento del algoritmo.
En esta etapa, el objeto neigh toma tu matriz o catálogo de estrellas (candidate_stars) y organiza sus posiciones en la memoria de la computadora utilizando una estructura geométrica eficiente (como un árbol de esferas ball_tree o un árbol k-dimensional kd_tree).
Esto es lo que sucede de forma precisa:

##### 1. No calcula distancias todavía
A diferencia de otros algoritmos de aprendizaje automático, aquí el método .fit() no realiza predicciones ni busca vecinos en este momento. Su único objetivo es "mapear" y estructurar el espacio donde se encuentran tus estrellas candidatas para que las futuras búsquedas sean instantáneas.

##### 2. El proceso interno
Si candidate_stars contiene las coordenadas de miles de estrellas, el algoritmo:
* Analiza cómo están distribuidas en el espacio bidimensional (por ejemplo, Ascensión Recta y Declinación) o tridimensional (coordenadas cartesianas X, Y, Z).
* Divide el cielo en regiones, cajas o hiperesferas anidadas.
* Construye un árbol de búsqueda espacial.

##### 3. ¿Para qué sirve esto?
Prepara el terreno para que, cuando uses comandos como neigh.kneighbors(), el programa no tenga que calcular la distancia de tu estrella de interés contra todas las estrellas del catálogo (lo cual sería una búsqueda por fuerza bruta muy lenta). En su lugar, el árbol le permite descartar inmediatamente regiones enteras del cielo y dirigirse directamente a la zona donde están las estrellas más cercanas.


### Ejemplo visual de lo que sigue en tu código:

##### 1. Preparas el catálogo de estrellas (ej. 10,000 estrellas)
neigh.fit(candidate_stars)  # <--- Aquí se construye el árbol espacial en milisegundos

##### 2. Ahora ya puedes buscar de forma ultra rápida
¿Cuáles son las 2 estrellas del catálogo más cercanas a una nueva coordenada?distancias, indices = neigh.kneighbors([[ra_nueva, dec_nueva]])


---

###  distances, indices = neigh.kneighbors(transformed_all)

Esta línea de código realiza la búsqueda real y efectiva de los vecinos más cercanos.
El algoritmo toma el conjunto de datos de consulta (transformed_all) y, utilizando el árbol espacial que construyó previamente en el método .fit(), encuentra cuáles son las 2 estrellas más cercanas (definido por el n_neighbors=2 anterior) para cada uno de los puntos de esta nueva lista.
El método ejecuta la búsqueda y desempaqueta el resultado simultáneamente en dos matrices (distances e indices):
##### 1. distances (Matriz de Distancias)
Contiene los valores numéricos de las distancias geométricas (por defecto en línea recta o Euclidiana).

* Estructura: Es una matriz de dos dimensiones de tamaño (N, 2), donde N es el número de puntos que tiene transformed_all.
* Contenido: Para cada fila (punto de consulta), tendrás dos valores: [distancia_al_1er_vecino, distancia_al_2do_vecino]. Las distancias siempre vienen ordenadas de menor a mayor.

##### 2. indices (Matriz de Índices)
Contiene las posiciones o "punteros" que identifican a los vecinos encontrados.

* Estructura: Al igual que las distancias, es una matriz de tamaño (N, 2).
* Contenido: No te devuelve las coordenadas de los vecinos, sino sus números de fila correspondientes dentro del catálogo original (candidate_stars). Por ejemplo, si en la primera fila obtienes [42, 105], significa que la estrella más cercana a tu primer objeto de consulta es la que se encuentra en la posición 42 de candidate_stars, y la segunda más cercana es la de la posición 105.

------------------------------
### Ejemplo práctico de cómo usar estas dos variables:
Una vez ejecutada esa línea, es habitual extraer la información real del catálogo indexado de la siguiente manera:

Suponiendo que quieres analizar los resultados del primer objeto de 'transformed_all' (índice 0)primer_objeto_distancias = distances[0]  # Ejemplo: [0.0012, 0.0045]primer_objeto_indices = indices[0]        # Ejemplo: [42, 105]

Acceder a los datos reales de la estrella más cercana en tu catálogo originalestrella_mas_cercana = candidate_stars[primer_objeto_indices[0]]distancia_a_ella = primer_objeto_distancias[0]

``` python
print(f"La estrella más cercana está en la fila {primer_objeto_indices[0]} del catálogo.")
print(f"La distancia geométrica calculada es de: {distancia_a_ella}")
```

### Una advertencia crítica en Astronomía
Si transformed_all y candidate_stars son matrices con coordenadas celestes directas en grados (es decir, una columna es Ascensión Recta de 0 a 360 y otra es Declinación de -90 a 90), la distancia que calculará por defecto (minkowski / Euclidiana) asume que el cielo es plano como una hoja de papel.
Esto funciona bien cerca del ecuador celeste (Dec = 0°), pero produce errores graves cerca de los polos celestes (Dec cercano a 90° o -90°), donde las líneas de RA convergen. 

