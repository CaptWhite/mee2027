``` python
## Rutina:  _find_rotation_matrix(image_vectors, catalog_vectors):

Calcula la matriz de rotación de mínimos cuadrados entre dos conjuntos de vectores. Toma como entrada dos arrays de forma (N, 3) que representan los vectores de imagen y los vectores del catálogo, respectivamente. Devuelve la matriz de rotación que minimiza la diferencia entre los dos conjuntos de vectores.


``` python
_find_rotation_matrix(image_vectors, catalog_vectors):
    # find the covariance matrix H between the image and catalog vectors
    H = np.dot(image_vectors.T, catalog_vectors)
    # use singular value decomposition to find the rotation matrix
    (U, S, V) = np.linalg.svd(H)
    return np.dot(U, V)
```

Este fragmento de código implementa la solución matemática al **Problema de Procrustes Ortogonal** (específicamente mediante el **Algoritmo de Kabsch**). Su objetivo es encontrar la matriz de rotación óptima $R$ que alinea un conjunto de vectores (las posiciones en la imagen) con otro conjunto de vectores de referencia (el catálogo), minimizando el error cuadrático medio entre ellos.

Aquí tienes el desglose matemático paso a paso de lo que hace cada instrucción:

---

### 1. La matriz de covarianza cruzada ($H$)

```python
H = np.dot(image_vectors.T, catalog_vectors)

```

Matemáticamente, si representamos los vectores de la imagen como una matriz $A$ y los del catálogo como una matriz $B$ (donde cada fila es un vector de posición, por ejemplo, en 2D o 3D), la operación calcula:

$$
H = A^T B
$$

**Explicación matemática:**

* $H$ es la **matriz de covarianza cruzada** entre ambos sistemas de coordenadas.
* Multiplicar la transpuesta de los vectores de la imagen por los del catálogo acumula la correlación de las componentes espaciales. Si los vectores están alineados, los elementos de la diagonal de $H$ serán máximos.
* Esta matriz condensa toda la información geométrica sobre cómo están orientados los dos conjuntos de puntos entre sí.

---

### 2. Descomposición en Valores Singulares (SVD)

```python
(U, S, V) = np.linalg.svd(H)

```

La SVD es una técnica de álgebra lineal que factoriza la matriz $H$ en tres matrices:

$$
H = U \Sigma V^T
$$

*(Nota: En NumPy, `np.linalg.svd` devuelve $V$ ya transpuesta, es decir, el objeto `V` del código equivale matemáticamente a $V^T$).*

**Explicación matemática:**

* **$U$ y $V^T$** son matrices ortogonales ($U^T U = I$ y $V V^T = I$). Representan rotaciones puras (o reflexiones) en los espacios de la imagen y del catálogo.
* **$\Sigma$ (representada por `S`)** es una matriz diagonal con los *valores singulares*, que miden la escala o la fuerza de la correlación en cada eje geométrico.

El teorema matemático de Procrustes demuestra que para maximizar la correlación (y por tanto, minimizar la distancia entre los puntos de la imagen y el catálogo), debemos eliminar el factor de escala $\Sigma$ y quedarnos solo con las direcciones de rotación puras que aportan $U$ y $V$.

---

### 3. Construcción de la matriz de rotación ($R$)

```python
return np.dot(U, V)

```

Sabiendo que $H = U \Sigma V^T$, la teoría matemática subyacente demuestra que la matriz de rotación óptima $R$ que mejor mapea el sistema de la imagen al catálogo se obtiene "cancelando" la parte de la escala e interceptando las bases ortogonales:

$$
R = U V^T
$$

Como en la implementación de NumPy `V` ya es algebraicamente $V^T$, el producto de matrices `np.dot(U, V)` se traduce exactamente en:

$$
R = U V^T
$$

#### El "pequeño" detalle de la reflexión:

Existe un caso particular en esta matemática: si el determinante de esta matriz resultante es $-1$ ($\det(R) = -1$), significa que el algoritmo ha encontrado una **reflexión** (un efecto espejo) en lugar de una rotación pura.

En aplicaciones astronómicas o cartográficas (como el *plate solving*), las reflexiones no suelen ser deseadas a menos que la imagen esté invertida por el espejo del telescopio. Si en algún momento notas que el algoritmo "refleja" los datos en lugar de rotarlos, la solución matemática estándar consiste en verificar el determinante y corregir la última columna de $U$ multiplicándola por $-1$ antes del producto final.
```