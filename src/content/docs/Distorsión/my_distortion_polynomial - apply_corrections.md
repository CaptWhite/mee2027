# Descripción Teórica y Matemática de la Rutina `apply_corrections`

Este documento proporciona una descripción teórica y matemática detallada del funcionamiento de la función `apply_corrections` del módulo [my_distortion_polynomial.py](file:///c:/Users/captw/workspaces/MEE2027/MEE2024.v6/Source/mee2024/_working3/my_distortion_polynomial.py).

---

## Índice
- [Descripción Teórica y Matemática de la Rutina `apply_corrections`](#descripción-teórica-y-matemática-de-la-rutina-apply_corrections)
  - [Índice](#índice)
  - [1. Introducción y Propósito](#1-introducción-y-propósito)
  - [2. Evaluación de la Base de Diseño en Coordenadas de Entrada](#2-evaluación-de-la-base-de-diseño-en-coordenadas-de-entrada)
  - [3. Contracción Tensorial y Exclusión del Término Constante](#3-contracción-tensorial-y-exclusión-del-término-constante)
  - [4. Ecuaciones Finales de Corrección de Coordenadas](#4-ecuaciones-finales-de-corrección-de-coordenadas)
  - [5. Bibliografía y Referencias de Soporte](#5-bibliografía-y-referencias-de-soporte)

---

## 1. Introducción y Propósito

La función `apply_corrections` es la rutina predictiva del modelo de distorsión astrométrica. A diferencia de las funciones de entrenamiento (`_cubic_helper` o `do_cubic_fit`), esta rutina no realiza ninguna regresión o ajuste de parámetros por mínimos cuadrados. En su lugar, toma una serie de posiciones de estrellas en píxeles observadas, evalúa la base polinomial (o de Legendre) de calibración e inyecta las correcciones calculadas para obtener coordenadas rectificadas libres de distorsión geométrica instrumental.

---

## 2. Evaluación de la Base de Diseño en Coordenadas de Entrada

Para un conjunto de $N$ estrellas de entrada con coordenadas observadas centradas en el sensor:

$$
\mathbf{p}_j = \begin{pmatrix} y_{obs, j} \\ x_{obs, j} \end{pmatrix} \quad \text{donde } j \in [1, N]
$$


Se calcula el factor de escala espacial de la imagen para la normalización polinomial:

$$
w = \frac{\max(\text{img\_shape})}{2}
$$


La función invoca a `get_basis` para evaluar la base binomial o de Legendre en cada punto, generando una matriz de diseño $\mathbf{B}$ de dimensión $N \times M$:

$$
\mathbf{B} = \text{get\_basis}(\mathbf{y}_{obs}, \mathbf{x}_{obs}, w, 1, \text{options}) \in \mathbb{R}^{N \times M}
$$

donde $M$ es el número de términos no constantes de la base según el grado polinomial especificado. La fila $j$-ésima de la matriz $\mathbf{B}$ contiene el vector de características geométricas evaluado para la estrella $j$:

$$
\mathbf{B}_{j, \cdot} = [B_1(x_{obs, j}, y_{obs, j}), \dots, B_M(x_{obs, j}, y_{obs, j})]^T
$$


---

## 3. Contracción Tensorial y Exclusión del Término Constante

Los vectores completos de coeficientes de calibración cargados en el sistema poseen una dimensión de $M+1$ elementos debido a la inclusión del término de intercepto constante en el índice 0:

$$
\mathbf{c}_x = [c_{x, 0}, c_{x, 1}, \dots, c_{x, M}]^T \in \mathbb{R}^{M+1}
$$

$$\mathbf{c}_y = [c_{y, 0}, c_{y, 1}, \dots, c_{y, M}]^T \in \mathbb{R}^{M+1}$$

Sin embargo, los términos constantes $c_{x, 0}$ y $c_{y, 0}$ representan desplazamientos traslacionales uniformes de todo el sensor en los ejes $X$ e $Y$. Durante las fases previas de calibración y absorción (WCS Absorption), **estos desplazamientos traslacionales ya han sido absorbidos en su totalidad** al desplazar las coordenadas celestes centrales $(\alpha_0, \delta_0)$ del vector de estado global $\mathbf{q}$.

Para evitar una doble corrección sistemática de la posición del campo (que sesgaría la astrometría), **se debe omitir el término constante** de los vectores de distorsión. El software implementa esto omitiendo el índice cero (`coeff_x[1:]` y `coeff_y[1:]`):

$$
\mathbf{c}^*_x = [c_{x, 1}, \dots, c_{x, M}]^T \in \mathbb{R}^M
$$

$$\mathbf{c}^*_y = [c_{y, 1}, \dots, c_{y, M}]^T \in \mathbb{R}^M$$

La evaluación de la distorsión del sensor en píxeles se realiza mediante contracción tensorial utilizando la notación de Einstein (`einsum`):

$$
\Delta x_j = \sum_{i=1}^M B_{j, i} \cdot c_{x, i}^*
$$

$$\Delta y_j = \sum_{i=1}^M B_{j, i} \cdot c_{y, i}^*$$

Esta contracción es equivalente a la multiplicación de matriz por vector:

$$
\mathbf{\Delta x} = \mathbf{B} \mathbf{c}^*_x
$$

$$\mathbf{\Delta y} = \mathbf{B} \mathbf{c}^*_y$$

---

## 4. Ecuaciones Finales de Corrección de Coordenadas

Los desplazamientos de distorsión instrumental $\mathbf{\Delta x}$ y $\mathbf{\Delta y}$ se suman vectorialmente a las posiciones de píxeles observadas originales:

$$
y_{corrected, j} = y_{obs, j} + \Delta y_j
$$

$$x_{corrected, j} = x_{obs, j} + \Delta x_j$$

La función retorna las coordenadas corregidas acumuladas en forma de una matriz de tamaño $N \times 2$:

$$
\mathbf{P}_{corrected} = \begin{pmatrix} y_{corrected, 1} & x_{corrected, 1} \\ \vdots & \vdots \\ y_{corrected, N} & x_{corrected, N} \end{pmatrix}
$$


Estas posiciones corregidas representan las coordenadas ideales sin distorsión geométrica, listas para ser mapeadas linealmente mediante los parámetros intrínsecos de WCS al cielo.

---

## 5. Bibliografía y Referencias de Soporte

1. **Calabretta, M. R., & Greisen, E. W. (2002).** *Representations of celestial coordinates in FITS*. Astronomy & Astrophysics, 395(3), 1077-1122.
   - *Explica el estándar para las representaciones de coordenadas celestes lineales y la aplicación de coeficientes de distorsión.*

2. **Shupe, D. L., et al. (2005).** *The SIP Convention for Representing Distortion in FITS Image Headers*. ASP Conference Series, Vol. 347.
   - *Establece las fórmulas matemáticas de la convención de distorsión geométrica SIP en el formato FITS, donde se aplican correcciones de alto orden omitiendo la traslación lineal en los píxeles.*

3. **Einstein, A. (1916).** *Annalen der Physik, 354(7)*.
   - *Referencia de la notación de contracción tensorial de índices de Einstein utilizada por `numpy.einsum` para optimizar la multiplicación de matrices en cómputo científico.*
