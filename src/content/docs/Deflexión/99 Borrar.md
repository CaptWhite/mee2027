Vamos a desglosar qué significa exactamente $\operatorname{Cov}(v_i^T X,\; v_j^T X)$ y por qué es una cantidad relevante.

## 1. Qué hay dentro de la covarianza

Tenemos dos **variables aleatorias escalares**:

$$
Y_i = v_i^T X, \qquad Y_j = v_j^T X.
$$

- $X$ es el vector aleatorio de $p$ variables (cada observación es un punto en $\mathbb{R}^p$).
- $v_i$ y $v_j$ son dos vectores fijos (en nuestro contexto, vectores propios de $\Sigma$).
- $v_i^T X$ es un **número**: la proyección escalar de $X$ sobre la dirección $v_i$.
- $v_j^T X$ es otro número: la proyección de $X$ sobre la dirección $v_j$.

Así que $Y_i$ e $Y_j$ son **dos variables escalares** construidas a partir de los mismos datos $X$, mirándolos desde dos direcciones distintas.

## 2. Qué mide la covarianza entre ellas

$$
\operatorname{Cov}(Y_i, Y_j) = E[(Y_i - E[Y_i])(Y_j - E[Y_j])].
$$

Mide **cómo varían conjuntamente** $Y_i$ e $Y_j$:

- Si $\operatorname{Cov} > 0$: cuando $Y_i$ está por encima de su media, $Y_j$ tiende a estar también por encima de su media (y viceversa). Van "en la misma dirección".
- Si $\operatorname{Cov} < 0$: cuando $Y_i$ sube, $Y_j$ tiende a bajar. Van en direcciones opuestas.
- Si $\operatorname{Cov} = 0$: no hay relación lineal entre ellas; se dice que están **incorrelacionadas**.

Es la misma idea que la covarianza entre dos columnas de una tabla de datos, pero aquí las "columnas" son las proyecciones de $X$ sobre dos direcciones $v_i$ y $v_j$.

## 3. Por qué esta cantidad concreta es importante

En el contexto de la matriz de covarianzas y PCA, lo relevante es que:

$$
\operatorname{Cov}(v_i^T X,\; v_j^T X) = v_i^T \Sigma v_j.
$$

Es decir, la covarianza entre las proyecciones sobre $v_i$ y $v_j$ se calcula con la **misma matriz $\Sigma$** y los mismos vectores. Esta fórmula es la que permite demostrar que:

- Si $v_i$ y $v_j$ son vectores propios de $\Sigma$ con $i \neq j$, entonces $\operatorname{Cov}(v_i^T X,\; v_j^T X)=0$.
- Es decir, **las proyecciones sobre distintos ejes principales están incorrelacionadas**.

Eso es precisamente lo que hace útil a PCA: cambia las coordenadas originales (que pueden estar correlacionadas) por unas nuevas $Y_i = v_i^T X$ que son incorrelacionadas entre sí, con varianzas $\lambda_i$.

## 4. Ejemplo intuitivo en 2D

Imagina datos en forma de elipse inclinada. Los ejes de la elipse son $v_1$ (eje mayor) y $v_2$ (eje menor).

- $Y_1 = v_1^T X$: coordenada de cada punto a lo largo del eje mayor.
- $Y_2 = v_2^T X$: coordenada a lo largo del eje menor.

Si la elipse está "bien alineada" con $v_1$ y $v_2$, entonces saber cuánto vale $Y_1$ no te dice nada sobre $Y_2$: están incorrelacionadas, $\operatorname{Cov}(Y_1,Y_2)=0$. Eso es lo que garantizan los vectores propios.

## En resumen

$\operatorname{Cov}(v_i^T X,\; v_j^T X)$ significa: **la covarianza entre dos variables escalares que resultan de proyectar los datos $X$ sobre dos direcciones $v_i$ y $v_j$**. Mide si esas dos proyecciones varían de forma conjunta o no. En el contexto de $\Sigma$, vale $v_i^T \Sigma v_j$, y si $v_i, v_j$ son vectores propios distintos, vale 0: las proyecciones sobre ejes principales distintos no están correlacionadas.


## Cálculo:
Vamos a justificar cada paso de la cadena de igualdades. La clave está en la **bilinealidad de la covarianza** y en que $v_j$ es vector propio de $\Sigma$.

## Paso 1: $\operatorname{Cov}(v_i^T X,\; v_j^T X) = v_i^T \Sigma v_j$

Partimos de la definición de covarianza entre dos variables aleatorias escalares $A$ y $B$:

$$
\operatorname{Cov}(A,B) = E[(A - E[A])(B - E[B])].
$$

Tomamos $A = v_i^T X$ y $B = v_j^T X$. Como $X$ está centrado ($E[X]=0$), también $E[v_i^T X]=v_i^T E[X]=0$ y $E[v_j^T X]=0$. Entonces:

$$
\operatorname{Cov}(v_i^T X,\; v_j^T X) = E[(v_i^T X)(v_j^T X)].
$$

Ahora usamos que $v_i^T X$ es un escalar, así que coincide con su traspuesta: $v_i^T X = X^T v_i$. Por tanto:

$$
(v_i^T X)(v_j^T X) = (X^T v_i)(v_j^T X) = X^T v_i v_j^T X.
$$

Tomando esperanza y usando linealidad:

$$
E[X^T v_i v_j^T X] = E\big[X^T (v_i v_j^T) X\big].
$$

Como $v_i v_j^T$ es una matriz constante (no aleatoria), sale de la esperanza:

$$
= E\big[X^T (v_i v_j^T) X\big].
$$

Aquí conviene reordenar usando la linealidad de la traza, o directamente sacar la matriz constante:

$$
E[X^T M X] = E[\operatorname{tr}(X^T M X)] = E[\operatorname{tr}(M X X^T)] = \operatorname{tr}(M\, E[X X^T]).
$$

Con $M = v_i v_j^T$ y $E[X X^T] = \Sigma$:

$$
= \operatorname{tr}(v_i v_j^T \Sigma) = \operatorname{tr}(v_j^T \Sigma\, v_i) = v_j^T \Sigma\, v_i.
$$

Como $\Sigma$ es simétrica, $v_j^T \Sigma v_i = v_i^T \Sigma v_j$. Y como es un escalar, su traza es él mismo. Así llegamos a:

$$
\boxed{\operatorname{Cov}(v_i^T X,\; v_j^T X) = v_i^T \Sigma v_j.}
$$

## Paso 2: $v_i^T \Sigma v_j = \lambda_j\, v_i^T v_j$

Por definición de vector propio de $\Sigma$:

$$
\Sigma v_j = \lambda_j v_j.
$$

Sustituyendo en la expresión anterior:

$$
v_i^T \Sigma v_j = v_i^T (\lambda_j v_j) = \lambda_j\, (v_i^T v_j).
$$

El escalar $\lambda_j$ sale del producto. Esto es válido para cualquier $i,j$.

## Paso 3: $\lambda_j\, v_i^T v_j = 0$ cuando $i \neq j$

Aquí hay que distinguir dos casos:

**Caso A: $\lambda_i \neq \lambda_j$.** Como $\Sigma$ es simétrica, vectores propios asociados a valores propios distintos son **ortogonales**. Demostración rápida:

$$
\lambda_i\, v_i^T v_j = (\Sigma v_i)^T v_j = v_i^T \Sigma^T v_j = v_i^T \Sigma v_j = v_i^T (\lambda_j v_j) = \lambda_j\, v_i^T v_j.
$$

Es decir, $(\lambda_i - \lambda_j)\, v_i^T v_j = 0$. Si $\lambda_i \neq \lambda_j$, entonces $v_i^T v_j = 0$, y por tanto $\lambda_j\, v_i^T v_j = 0$.

**Caso B: $\lambda_i = \lambda_j$ (valor propio repetido).** En este caso los vectores propios podrían no ser ortogonales si se eligen arbitrariamente. Pero como $\Sigma$ es simétrica, **siempre se puede elegir una base ortonormal de vectores propios** (teorema espectral). Si tomamos esa base, entonces $v_i^T v_j = 0$ para $i \neq j$ también en este caso, y la igualdad se cumple.

Por tanto, para $i \neq j$:

$$
\operatorname{Cov}(v_i^T X,\; v_j^T X) = \lambda_j\, v_i^T v_j = 0.
$$

## Interpretación

Esta cadena demuestra que **las proyecciones de $X$ sobre distintos vectores propios de $\Sigma$ están incorrelacionadas**. Es decir, si defines las nuevas variables $Y_i = v_i^T X$ (las componentes principales), entonces:

$$
\operatorname{Cov}(Y_i, Y_j) = 0 \quad (i \neq j),
\qquad
\operatorname{Var}(Y_i) = v_i^T \Sigma v_i = \lambda_i.
$$

En la base de vectores propios, la matriz de covarianzas de $Y = V^T X$ es diagonal:

$$
\operatorname{Cov}(Y) = V^T \Sigma V = \Lambda = \operatorname{diag}(\lambda_1,\dots,\lambda_p).
$$

Eso es exactamente lo que hace PCA: rotar los datos a una base donde las coordenadas quedan incorrelacionadas, con varianzas iguales a los valores propios.