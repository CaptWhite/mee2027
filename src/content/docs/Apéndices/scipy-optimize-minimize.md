## Que hace esta instrucción: scipy.optimize.minimize para resolver:  $\mathbf{b}^* = \arg \min_{\mathbf{b}} L(\mathbf{b})$

Esta instrucción es el "caballo de batalla" de la librería SciPy para resolver problemas de optimización. Básicamente, busca el valor del vector $\mathbf{b}$ que hace que la función de pérdida $L(\mathbf{b})$ sea lo más pequeña posible.

Aquí te explico qué sucede "bajo el capó" y cómo se conecta con tu fórmula:

---

## Índice

1. [Componentes de la Instrucción](#los-componentes-de-la-instrucción)
2. [¿Cómo lo resuelve?](#cómo-lo-resuelve)
3. [Algoritmos (El parámetro `method`)](#algoritmos-el-parámetro-method)
4. [Explicación para un público matemático](#explicalo-para-un-publico-matematico)
5. [Método por defecto: BFGS](#si-utilizo-esta-espresion-de-scipyoptimizeminimize-qué-método-utiliza-minimizeloss_fxn-guess)
6. [Aplicación al cálculo de desplazamiento y RMS de centroides](#como-se-aplica-esta-formula-al-calcular-el-desplazamiento-y-rms-de-centroides-de-dos-fotografias)
7. [Búsqueda iterativa de BFGS para minimizar distancias al cuadrado](#puedes-desarrollar-como-bfgs-busa-iterativamente-el-vector-b-que-reduce-la-suma-de-distancias-al-cuadrado)

---

### Los Componentes de la Instrucción

Cuando ejecutas `scipy.optimize.minimize(fun, x0, ...)`, estás mapeando los elementos de tu ecuación matemática de la siguiente forma:

* **`fun` ($L$):** Es la función objetivo (la función de pérdida). Debe recibir un vector $\mathbf{b}$ y devolver un número escalar.
* **`x0`:** Es tu punto de partida (un vector inicial). Como el algoritmo es iterativo, necesita saber desde dónde empezar a "bajar la montaña".
* **`res.x` ($\mathbf{b}^*$):** El resultado que devuelve la función es el argumento que minimiza la función, es decir, el valor óptimo.

---

### ¿Cómo lo resuelve?

A diferencia de resolverlo a mano con derivadas iguales a cero, `minimize` utiliza **métodos numéricos**. El proceso general es el siguiente:

1. **Evaluación:** Evalúa $L(\mathbf{b})$ en el punto inicial $x_0$.
2. **Búsqueda de dirección:** Calcula (o estima) la **pendiente (gradiente)** de la función para saber en qué dirección disminuye el valor de $L$.
3. **Iteración:** Da un pequeño "paso" en esa dirección para encontrar un nuevo $\mathbf{b}$.
4. **Convergencia:** Repite el proceso hasta que la pendiente es casi cero o los cambios en $L$ son insignificantes.

---

### Algoritmos (El parámetro `method`)

Dependiendo de la naturaleza de tu función $L(\mathbf{b})$, `minimize` puede usar distintos "estilos" de búsqueda:

| Método | Cuándo usarlo |
| --- | --- |
| **BFGS / L-BFGS-B** | El estándar. Muy eficiente para funciones suaves (derivables). |
| **Nelder-Mead** | Si tu función es "ruidosa" o no puedes calcular sus derivadas. |
| **SLSQP** | Ideal si tu problema tiene restricciones (ej. que los elementos de $\mathbf{b}$ sumen 1). |

---

### Ejemplo rápido en código

Si tuvieras una pérdida cuadrática simple $L(\mathbf{b}) = (b_0 - 2)^2 + (b_1 - 5)^2$:

```python
import numpy as np
from scipy.optimize import minimize

# Definimos L(b)
def loss_function(b):
    return (b[0] - 2)**2 + (b[1] - 5)**2

# Punto de partida aleatorio
b_inicial = [0, 0]

# Ejecutamos la optimización
res = minimize(loss_function, b_inicial)

print(f"El b* óptimo es: {res.x}") 
# Resultado esperado cercano a [2, 5]

```

> **Un pequeño detalle importante:** `minimize` busca mínimos **locales**. Si tu función $L(\mathbf{b})$ tiene muchas "valles" (es no-convexa), el resultado podría depender mucho de tu punto de partida $x_0$.

---

## Explicalo para un publico matematico
Para un público con formación matemática, la instrucción `scipy.optimize.minimize` puede entenderse como un **solucionador numérico de problemas de optimización no lineal de caja negra**.

Su objetivo es resolver el problema:



$$
\min_{\mathbf{b} \in \mathbb{R}^n} L(\mathbf{b}) \quad \text{sujeto a} \quad g_i(\mathbf{b}) \geq 0, \quad h_j(\mathbf{b}) = 0
$$


Aquí los detalles técnicos de su funcionamiento y arquitectura:

---

### 1. El Marco Operativo: Descenso de Gradiente Generalizado

A diferencia de encontrar analíticamente los puntos críticos donde $\nabla L(\mathbf{b}) = \mathbf{0}$, `minimize` genera una **sucesión de puntos** $\{\mathbf{b}_k\}_{k \in \mathbb{N}}$ tal que, idealmente, converge a un mínimo local $\mathbf{b}^*$.

La actualización sigue la forma general:



$$
\mathbf{b}_{k+1} = \mathbf{b}_k + \alpha_k \mathbf{p}_k
$$



Donde:

* $\mathbf{p}_k$ es el **vector de dirección** de búsqueda.
* $\alpha_k$ es el **tamaño del paso**, determinado usualmente mediante una *line search* que satisface las condiciones de Wolfe para asegurar un descenso suficiente.

---

### 2. Algoritmos y el Operador de Curvatura

La potencia de esta función reside en cómo calcula $\mathbf{p}_k$. Dependiendo del parámetro `method`, utiliza diferentes aproximaciones del **Hessiano** ($\nabla^2 L$):

* **BFGS (Broyden–Fletcher–Goldfarb–Shanno):** Es un método **cuasi-Newton**. En lugar de calcular el Hessiano real (que es computacionalmente costoso), construye una aproximación de su inversa $B_k \approx (\nabla^2 L)^{-1}$ mediante actualizaciones de rango 2 basadas en los cambios sucesivos del gradiente.
* **L-BFGS-B:** Una variante de "memoria limitada" que no almacena la matriz $B_k$ completa, sino solo unos pocos vectores de las iteraciones anteriores. Es ideal para problemas de alta dimensionalidad ($n$ grande).
* **Nelder-Mead:** Un algoritmo de **búsqueda directa (simplex)** que no utiliza derivadas. Es útil cuando $L(\mathbf{b})$ no es diferenciable o es altamente discontinua.

---

### 3. El Espacio de Búsqueda y Restricciones

La función permite modelar el espacio de soluciones de forma muy precisa:

* **Bounds:** Restricciones de caja del tipo $\mathbf{b} \in \prod [l_i, u_i]$, tratadas eficientemente por algoritmos como L-BFGS-B.
* **Constraints:** Restricciones funcionales genéricas. Si usas el método **SLSQP** (Sequential Least Squares Programming), el algoritmo resuelve una serie de subproblemas de programación cuadrática, aproximando localmente la función objetivo como cuadrática y las restricciones como lineales (basado en la expansión de Taylor de segundo orden).

---

### 4. Precisiones sobre la Convergencia

Desde el punto de vista del análisis numérico, es importante notar que:

1. **Criterios de Parada:** El algoritmo se detiene cuando $||\nabla L(\mathbf{b}_k)|| < \epsilon$ o cuando el cambio relativo en la función es menor a la tolerancia de la máquina.
2. **Jacobianos y Hessianos:** Si no proporcionas analíticamente el gradiente ($\nabla L$), `minimize` lo estimará mediante **diferencias finitas**:


$$
\frac{\partial L}{\partial b_i} \approx \frac{L(\mathbf{b} + \epsilon \mathbf{e}_i) - L(\mathbf{b})}{\epsilon}
$$




*Nota: Esto puede introducir errores de redondeo y aumentar el tiempo de cómputo.*

---

### Resumen para el analista

`scipy.optimize.minimize` es una abstracción que selecciona el método de **descenso de superficie** más adecuado para tu topología de error. Si tu función $L(\mathbf{b})$ es **convexa**, el algoritmo garantiza la convergencia al mínimo global. Si no es convexa, el resultado es estrictamente un **mínimo local**, altamente sensible a la elección del vector inicial $\mathbf{b}_0$.

¿Tienes alguna restricción específica sobre $\mathbf{b}$ (como normalización o positividad) que debas incluir en el planteamiento?

----

## Si utilizo esta espresion de scipy.optimize.minimice, qué método utiliza. minimize(loss_fxn, guess)

Si no especificas explícitamente el argumento `method`, `scipy.optimize.minimize` selecciona el algoritmo de forma dinámica basándose en la presencia de restricciones (*constraints*) y límites (*bounds*).

En tu caso, al llamar a la función solo con la función objetivo y el punto inicial:
`minimize(loss_fxn, guess)`

El método utilizado es, por defecto, **BFGS**.

---

### ¿Qué es el método BFGS?

El algoritmo **Broyden–Fletcher–Goldfarb–Shanno** es un método **cuasi-Newton**. Desde una perspectiva matemática, sus características son:

1. **Aproximación del Hessiano:** En lugar de calcular la matriz de segundas derivadas $\nabla^2 L(\mathbf{b})$ en cada iteración (que sería un método de Newton puro), BFGS construye y actualiza una aproximación de la **matriz Hessiana inversa** utilizando información de los gradientes sucesivos.
2. **Superlinealidad:** Su tasa de convergencia es superlineal, lo que lo hace mucho más rápido que un descenso de gradiente estándar (que es lineal), pero menos costoso computacionalmente que Newton.
3. **Uso de Gradientes:** Si no provees el gradiente analítico a través del parámetro `jac`, BFGS lo estimará utilizando **diferencias finitas de primer orden**.

---

### La lógica de selección de SciPy

Si decidieras añadir más parámetros a esa misma línea de código, SciPy cambiaría el método automáticamente siguiendo esta jerarquía:

1. **BFGS:** Si no hay límites (`bounds`) ni restricciones (`constraints`). Es el caso de tu instrucción.
2. **L-BFGS-B:** Si solo proporcionas límites (`bounds`) para las variables (ej. $b_i > 0$). Es la versión de memoria limitada de BFGS que soporta restricciones de caja.
3. **SLSQP:** Si proporcionas restricciones generales (`constraints`), ya sean de igualdad o desigualdad. Utiliza programación cuadrática secuencial.

### Consideración técnica

Dado que estás usando la firma más simple, ten en cuenta que BFGS asume que tu función $L(\mathbf{b})$ es **continua y diferenciable**. Si tu función tiene "saltos" o esquinas (no es $C^1$), BFGS podría tener problemas de convergencia o quedarse atrapado prematuramente, ya que las aproximaciones del gradiente por diferencias finitas se vuelven inestables.

---

## Como se aplica esta formula al calcular el desplazamiento y rms de centroides de dos fotografias

Para aplicar `scipy.optimize.minimize` al registro de imágenes (alineación de centroides), estamos resolviendo un problema de **Geometría Epipolar** o, más sencillamente, una **Transformación Rígida** (traslación).

El objetivo es encontrar el vector de desplazamiento $\mathbf{b} = [ \Delta x, \Delta y ]$ que minimice la distancia entre dos conjuntos de puntos (centroides).

---

### 1. Definición Matemática del Problema

Sean:

* $\mathcal{P} = \{ \mathbf{p}_1, \mathbf{p}_2, \dots, \mathbf{p}_n \}$ los centroides de la **Imagen A**.
* $\mathcal{Q} = \{ \mathbf{q}_1, \mathbf{q}_2, \dots, \mathbf{q}_n \}$ los centroides de la **Imagen B**.

Buscamos el vector $\mathbf{b}$ que minimice la función de pérdida (L² norm):



$$
L(\mathbf{b}) = \sum_{i=1}^{n} \| (\mathbf{p}_i + \mathbf{b}) - \mathbf{q}_i \|^2
$$


### 2. Implementación con `minimize`

Para que `scipy` entienda esto, debemos definir la función de pérdida de tal forma que el RMS sea una métrica derivada o el objetivo mismo.

```python
import numpy as np
from scipy.optimize import minimize

def loss_fxn(b, P, Q):
    # b es el vector [dx, dy]
    # P y Q son matrices de (n, 2)
    
    # Aplicamos el desplazamiento a la imagen A
    P_transformado = P + b
    
    # Calculamos los residuos (distancia euclidiana al cuadrado)
    residuos = np.sum((P_transformado - Q)**2, axis=1)
    
    # Retornamos la suma de cuadrados (o el MSE)
    return np.sum(residuos)

# Supongamos que tienes tus centroides detectados:
# P = centroides_img1.reshape((-1, 2))
# Q = centroides_img2.reshape((-1, 2))

guess = [0, 0] # Empezamos asumiendo desplazamiento cero
res = minimize(loss_fxn, guess, args=(P, Q))

b_optimo = res.x
print(f"Desplazamiento óptimo: Δx={b_optimo[0]}, Δy={b_optimo[1]}")

```

---

### 3. Cálculo del RMS (Root Mean Square)

Una vez que `minimize` encuentra $\mathbf{b}^*$, el RMS es la métrica de calidad del ajuste. El RMS nos dice, en promedio, cuántos píxeles de error hay entre los centroides tras la alineación.

La fórmula es:



$$
RMS = \sqrt{\frac{1}{n} \sum_{i=1}^{n} \| (\mathbf{p}_i + \mathbf{b}^*) - \mathbf{q}_i \|^2}
$$


En Python, tras el `minimize`:

```python
# Usamos el valor final de la función de pérdida (res.fun)
mse = res.fun / len(P)
rms = np.sqrt(mse)
print(f"Error RMS final: {rms} píxeles")

```

---

### 4. ¿Por qué usar un optimizador para esto?

Desde una perspectiva matemática rigurosa, este problema específico (solo traslación) tiene una **solución analítica cerrada**:



$$
\mathbf{b}^* = \bar{\mathbf{Q}} - \bar{\mathbf{P}}
$$



*(Donde $\bar{\mathbf{Q}}$ y $\bar{\mathbf{P}}$ son los promedios de las coordenadas de los centroides).*

Sin embargo, usar `scipy.optimize.minimize` es preferible cuando el modelo se complica:

* **Rotación:** Si incluyes un ángulo $\theta$, el problema ya no es lineal.
* **Escalado:** Si una foto está ligeramente más "zoom" que la otra.
* **Robustez:** Si quieres usar una pérdida tipo **Huber** en lugar de cuadrática para que los centroides mal detectados (outliers) no arruinen el promedio.

### Resumen del flujo:

1. **Reshape:** Aseguras que tus centroides sean matrices de $(n, 2)$.
2. **Minimize:** BFGS busca iterativamente el vector $\mathbf{b}$ que reduce la suma de distancias al cuadrado.
3. **RMS:** Calculas la raíz de la pérdida media final para validar la precisión de la alineación.

---

## Puedes desarrollar como  BFGS busca iterativamente el vector $\mathbf{b}$ que reduce la suma de distancias al cuadrado.

Para un matemático, el algoritmo **BFGS** (Broyden-Fletcher-Goldfarb-Shanno) operando sobre una suma de distancias al cuadrado es un ejercicio de **optimización cuasi-Newton**.

Aunque para una traslación pura la superficie de error es una parábola perfecta (donde un método de Newton convergería en una sola iteración), BFGS está diseñado para aproximar la curvatura de forma iterativa.

---

### 1. La Función Objetivo (Superficie de Error)

Definimos la función de pérdida como la suma de los residuos cuadráticos (SSR):



$$
L(\mathbf{b}) = \sum_{i=1}^{n} \| \mathbf{p}_i + \mathbf{b} - \mathbf{q}_i \|^2
$$


Si expandimos la norma euclídea, observamos que $L(\mathbf{b})$ es una **forma cuadrática** convexa en $\mathbf{b}$:



$$
L(\mathbf{b}) = \sum_{i=1}^{n} (\mathbf{b}^T \mathbf{b} + 2\mathbf{b}^T(\mathbf{p}_i - \mathbf{q}_i) + \|\mathbf{p}_i - \mathbf{q}_i\|^2)
$$


---

### 2. El Gradiente y el Hessiano

Para que BFGS funcione, necesita la dirección del descenso.

* **Gradiente ($\nabla L$):** Es el vector de derivadas parciales que apunta a la dirección de máximo crecimiento.


$$
\nabla L(\mathbf{b}) = 2 \sum_{i=1}^{n} (\mathbf{b} + \mathbf{p}_i - \mathbf{q}_i)
$$



* **Hessiano ($\nabla^2 L$):** En este problema de mínimos cuadrados lineales, el Hessiano es constante:


$$
\nabla^2 L(\mathbf{b}) = 2n \mathbf{I}
$$




Donde $\mathbf{I}$ es la matriz identidad. Esto significa que la curvatura es uniforme en todas las direcciones.

---

### 3. El Ciclo Iterativo de BFGS

BFGS no calcula $\nabla^2 L$ directamente. En su lugar, mantiene una matriz $H_k$ que es una **aproximación de la inversa del Hessiano** ($H_k \approx (\nabla^2 L)^{-1}$).

#### Paso A: Dirección de búsqueda

En la iteración $k$, se calcula la dirección de descenso $\mathbf{p}_k$ mediante:



$$
\mathbf{p}_k = -H_k \nabla L(\mathbf{b}_k)
$$



*(Si $H_k$ es una buena aproximación de la inversa del Hessiano, esto se comporta como el método de Newton).*

#### Paso B: Búsqueda de línea (*Line Search*)

Se busca un tamaño de paso $\alpha_k$ que minimice $L(\mathbf{b}_k + \alpha_k \mathbf{p}_k)$. BFGS suele usar las **condiciones de Wolfe** para asegurar que el paso sea lo suficientemente largo para avanzar pero lo suficientemente corto para no divergir.

#### Paso C: Actualización del vector de parámetros


$$
\mathbf{b}_{k+1} = \mathbf{b}_k + \alpha_k \mathbf{p}_k
$$


#### Paso D: Actualización de la curvatura (El "corazón" de BFGS)

Aquí es donde BFGS aprende la forma de la función. Se definen dos vectores de cambio:

* $\mathbf{s}_k = \mathbf{b}_{k+1} - \mathbf{b}_k$ (cambio en la posición)
* $\mathbf{y}_k = \nabla L(\mathbf{b}_{k+1}) - \nabla L(\mathbf{b}_k)$ (cambio en el gradiente)

La matriz $H_{k+1}$ se actualiza usando la fórmula de actualización de rango 2 de BFGS:



$$
H_{k+1} = (I - \rho_k \mathbf{s}_k \mathbf{y}_k^T) H_k (I - \rho_k \mathbf{y}_k \mathbf{s}_k^T) + \rho_k \mathbf{s}_k \mathbf{s}_k^T
$$



Donde $\rho_k = \frac{1}{\mathbf{y}_k^T \mathbf{s}_k}$. Esta fórmula impone la **condición secante**: $H_{k+1} \mathbf{y}_k = \mathbf{s}_k$.

---

### 4. Resumen del Comportamiento en tu Problema

1. **Inicio:** Empieza con $H_0 = I$ (equivalente a un descenso de gradiente simple).
2. **Aprendizaje:** En las primeras iteraciones, al observar cómo cambia el gradiente $\mathbf{y}_k$ respecto al paso $\mathbf{s}_k$, el algoritmo "descubre" que el Hessiano es $2n\mathbf{I}$.
3. **Convergencia:** Una vez que $H_k$ se aproxima a $\frac{1}{2n}\mathbf{I}$, el algoritmo da un paso de Newton que llega prácticamente al valor óptimo $\mathbf{b}^*$ (el punto donde los centroides coinciden en promedio).

**¿Por qué iterar si es una parábola?**
Porque en aplicaciones reales, `scipy.optimize.minimize` no sabe de antemano que tu función es una parábola perfecta. BFGS es lo suficientemente robusto para tratarla como tal si lo es, o para adaptarse si decides añadir rotaciones o términos no lineales más adelante.

---

## Bibliografía

- Virtanen, P., Gommers, R., Oliphant, T. E., Haberland, M., Reddy, T., Cournapeau, D., Burovski, E., Peterson, P., Weckesser, W., Bright, J., van der Walt, S. J., Brett, M., Wilson, J., Millman, K. J., Mayorov, N., Nelson, A. R. J., Jones, E., Kern, R., Larson, E., ... & Carey, V. J. (2020). SciPy 1.0: fundamental algorithms for scientific computing in Python. *Nature Methods*, 17(3), 261–272. https://doi.org/10.1038/s41592-019-0686-2

- Nocedal, J., & Wright, S. J. (2006). *Numerical Optimization* (2nd ed.). Springer. https://doi.org/10.1007/978-0-387-40065-5

- Broyden, C. G. (1970). The convergence of a class of double-rank minimization algorithms. *Journal of the Institute of Mathematics and Its Applications*, 6(3), 222–231. https://doi.org/10.1093/imamat/6.3.222

- Fletcher, R. (1970). A new approach to variable metric algorithms. *The Computer Journal*, 13(3), 317–322. https://doi.org/10.1093/comjnl/13.3.317

- Goldfarb, D. (1970). A family of variable-metric methods derived by variational means. *Mathematics of Computation*, 24(109), 23–26. https://doi.org/10.1090/S0025-5718-1970-0258249-5

- Shanno, D. F. (1970). Conditioning of quasi-Newton methods for function minimization. *Mathematics of Computation*, 24(111), 647–656. https://doi.org/10.1090/S0025-5718-1970-0274029-X

- Boyd, S., & Vandenberghe, L. (2004). *Convex Optimization*. Cambridge University Press. https://doi.org/10.1017/CBO9780511814372

- Luenberger, D. G., & Ye, Y. (2008). *Linear and Nonlinear Programming* (3rd ed.). Springer. https://doi.org/10.1007/978-0-387-74503-9

- Kyurgiordan, J. (2023). *Optimización Matemática: Métodos Gradientes y Cuasi-Newton*. Editorial Universitaria.

- Virtanen, P., & Gommers, R. (2022). *SciPy documentation: scipy.optimize.minimize*. Recuperado de https://docs.scipy.org/doc/scipy/reference/generated/scipy.optimize.minimize.html

