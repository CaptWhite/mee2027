## 1. El problema que queremos resolver

Queremos **maximizar** una función sujeta a una **restricción**. En nuestro caso:

$$
\max_{u} \; u^T \Sigma u \qquad \text{sujeto a} \qquad u^T u = 1.
$$

Es decir: buscamos la dirección $u$ que hace máxima la varianza $u^T \Sigma u$, pero solo consideramos direcciones **unitarias** (longitud 1). Sin la restricción, la función crecería indefinidamente multiplicando $u$ por escalares grandes, así que la restricción es imprescindible.

El **multiplicador de Lagrange** es una técnica para resolver este tipo de problemas: optimizar con restricciones de igualdad.

## 2. La idea geométrica central

Piensa en las **curvas de nivel** de la función objetivo $f(u)=u^T \Sigma u$: son el conjunto de puntos donde $f$ toma un valor constante.

Y piensa en la **restricción** $g(u)=u^T u-1=0$: es una superficie (en 2D, una circunferencia; en 3D, una esfera; en $p$ dimensiones, una esfera de radio 1).

Queremos movernos **solo sobre la esfera** y encontrar el punto donde $f$ es máxima.

**Observación clave:** en el óptimo, la curva de nivel de $f$ es **tangente** a la superficie de la restricción. Si no fueran tangentes, podríamos deslizarnos un poco sobre la restricción y aumentar $f$. Por tanto, en el óptimo, el **gradiente de $f$** (que es perpendicular a la curva de nivel de $f$) debe ser **paralelo** al **gradiente de $g$** (que es perpendicular a la superficie de restricción):

$$
\nabla f(u) = \lambda \, \nabla g(u).
$$

El escalar $\lambda$ que aparece ahí es el **multiplicador de Lagrange**. Es justamente el factor de proporcionalidad entre los dos gradientes.

## 3. La función lagrangiana

Para convertir el problema con restricción en un problema sin restricción, construimos la **lagrangiana**:

$$
\mathcal{L}(u,\lambda) = f(u) - \lambda\, g(u).
$$

En nuestro caso concreto:

$$
\mathcal{L}(u,\lambda) = u^T \Sigma u - \lambda\,(u^T u - 1).
$$

La idea es: si la restricción se cumple ($g(u)=0$), entonces $\mathcal{L}(u,\lambda)=f(u)$, y maximizar $\mathcal{L}$ es lo mismo que maximizar $f$. El término $-\lambda g(u)$ "penaliza" las violaciones de la restricción, y $\lambda$ ajusta cuánto.

## 4. Condiciones de primer orden

Ahora tratamos $\mathcal{L}$ como una función de $u$ y $\lambda$, y buscamos sus puntos críticos: derivamos respecto a **cada variable** e igualamos a cero.

**Respecto a $u$** (usando que $\Sigma$ es simétrica):

$$
\frac{\partial \mathcal{L}}{\partial u} = 2\Sigma u - 2\lambda u = 0
\quad\Longrightarrow\quad
\Sigma u = \lambda u.
$$

¡Esta es exactamente la **ecuación de vectores propios**! El óptimo debe ser un vector propio de $\Sigma$, y $\lambda$ es su valor propio.

**Respecto a $\lambda$:**

$$
\frac{\partial \mathcal{L}}{\partial \lambda} = -(u^T u - 1) = 0
\quad\Longrightarrow\quad
u^T u = 1.
$$

Esto simplemente recupera la restricción: el vector debe ser unitario.

Así, el método de Lagrange **produce automáticamente** la ecuación de autovalores. No es casualidad: la definición de vector propio es precisamente la condición de estacionariedad de una forma cuadrática sobre la esfera unitaria.

## 5. ¿Y cuál es el máximo?

La ecuación $\Sigma u = \lambda u$ nos da $p$ soluciones (los $p$ vectores propios). ¿Cuál de ellas maximiza $u^T \Sigma u$? Evaluamos la función objetivo en cada una:

$$
u_i^T \Sigma u_i = u_i^T (\lambda_i u_i) = \lambda_i (u_i^T u_i) = \lambda_i.
$$

Por tanto:
- El **máximo** se alcanza en el vector propio asociado al **mayor** valor propio $\lambda_1$.
- El **mínimo** se alcanza en el vector propio del **menor** valor propio.
- Los demás vectores propios dan valores intermedios (puntos de silla o extremos locales en subespacios).

## 6. ¿Qué significa $\lambda$? (interpretación del multiplicador)

El multiplicador de Lagrange tiene una interpretación general muy útil: mide **cuánto cambia el óptimo de la función objetivo cuando relajas la restricción en una unidad**.

En general, si el problema es

$$
\max f(u) \quad \text{sujeto a} \quad g(u)=c,
$$

entonces en el óptimo:

$$
\frac{df^*}{dc} = \lambda,
$$

donde $f^*$ es el valor óptimo. Es decir, $\lambda$ es la **sensibilidad** del óptimo frente al nivel de la restricción.

En nuestro caso, la restricción es $u^T u = 1$, y resulta que $\lambda$ coincide con el valor propio, que es la varianza en esa dirección. Esto tiene sentido: si permites vectores de longitud mayor que 1, la varianza máxima crece proporcionalmente a $\lambda_1$.

## 7. Ejemplo numérico sencillo

Tomemos

$$
\Sigma = \begin{pmatrix} 4 & 0 \\ 0 & 1 \end{pmatrix}.
$$

Queremos maximizar $f(u)=4u_1^2 + u_2^2$ sujeto a $u_1^2+u_2^2=1$.

Lagrangiana:

$$
\mathcal{L} = 4u_1^2 + u_2^2 - \lambda(u_1^2+u_2^2-1).
$$

Derivadas:

$$
\frac{\partial \mathcal{L}}{\partial u_1} = 8u_1 - 2\lambda u_1 = 0 \;\Rightarrow\; u_1(4-\lambda)=0,
$$

$$
\frac{\partial \mathcal{L}}{\partial u_2} = 2u_2 - 2\lambda u_2 = 0 \;\Rightarrow\; u_2(1-\lambda)=0.
$$

Soluciones:
- Si $u=(1,0)$: $\lambda=4$, $f=4$ (máximo).
- Si $u=(0,1)$: $\lambda=1$, $f=1$ (mínimo).

El multiplicador $\lambda$ es justamente el valor de $f$ en el óptimo, y coincide con el valor propio.

## 8. Resumen intuitivo

- **Problema:** maximizar $f$ sobre una superficie de restricción $g=0$.
- **Idea:** en el óptimo, los gradientes de $f$ y $g$ son paralelos: $\nabla f = \lambda \nabla g$.
- **Herramienta:** construir $\mathcal{L}=f-\lambda g$ y anular sus derivadas.
- **Resultado en nuestro caso:** $\Sigma u = \lambda u$, es decir, los óptimos son los vectores propios, y $\lambda$ es el valor propio (la varianza en esa dirección).
- **Interpretación de $\lambda$:** factor de proporcionalidad entre gradientes y, a la vez, sensibilidad del óptimo ante cambios en la restricción.

En definitiva, el multiplicador de Lagrange es el puente que convierte un problema de **optimización con restricciones** en un problema de **ecuaciones algebraicas** (aquí, la ecuación de autovalores).