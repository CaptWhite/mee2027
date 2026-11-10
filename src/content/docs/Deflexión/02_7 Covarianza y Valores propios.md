## Que relación existe entre matriz de covarianzas y valores y vectores propios

La relación entre la **matriz de covarianzas** y los **valores y vectores propios** es fundamental en estadística multivariante, análisis de componentes principales (PCA) y geometría de datos. Aquí te la explico de forma clara:

## 1. Definición previa
- **Matriz de covarianzas** $ \Sigma $: matriz simétrica y semidefinida positiva que recoge las varianzas en la diagonal y las covarianzas entre pares de variables fuera de la diagonal.
- **Valores propios** $ \lambda_i $: escalares que indican cuánto "estira" la matriz en ciertas direcciones.
- **Vectores propios** $ v_i $: direcciones (no nulas) que no cambian al aplicar la matriz, solo se escalan:  
  $$
  \Sigma v_i = \lambda_i v_i
  $$


## 2. Relación geométrica
La matriz de covarianzas define un **elipsoide de dispersión** de los datos (centrado en la media). Los **vectores propios** son los **ejes principales** de ese elipsoide, y los **valores propios** son las **varianzas** a lo largo de esos ejes.

- El vector propio asociado al **mayor valor propio** apunta en la dirección de **máxima varianza** de los datos.
- El segundo vector propio (ortogonal al primero) apunta en la dirección de la siguiente mayor varianza, y así sucesivamente.

## 3. Propiedades clave
- Como $ \Sigma $ es **simétrica**, sus vectores propios son **ortogonales** (o se pueden ortogonalizar) y forman una base del espacio.
- Los valores propios son **reales y no negativos** (semidefinida positiva). Si hay valores propios nulos, indica redundancia lineal entre variables.
- La **traza** de $ \Sigma $ (suma de varianzas) es igual a la **suma de los valores propios**:  
  $$
  \text{tr}(\Sigma) = \sum_i \lambda_i = \text{varianza total}
  $$
- El **determinante** de $ \Sigma $ es el producto de los valores propios:  
  $$
  \det(\Sigma) = \prod_i \lambda_i
  $$
  (relacionado con el volumen del elipsoide de dispersión).

## 4. Aplicación directa: PCA
En el **Análisis de Componentes Principales**, se calculan los vectores y valores propios de la matriz de covarianzas (o de correlaciones). Los vectores propios son las **componentes principales** (nuevas direcciones), y los valores propios indican **cuánta varianza explica** cada componente. La primera componente explica $ \lambda_1 / \sum \lambda_i $ de la varianza total.

## 5. Interpretación práctica
- **Direcciones de mayor variabilidad** → vectores propios con valores propios grandes.
- **Direcciones de baja variabilidad o ruido** → valores propios pequeños (posible reducción de dimensionalidad).
- **Variables redundantes** → valores propios cercanos a cero.

En resumen: los **vectores propios** de la matriz de covarianzas dan las **direcciones principales** de variación de los datos, y los **valores propios** cuantifican la **magnitud de la varianza** en esas direcciones. Es la base matemática de PCA, análisis factorial y muchas técnicas de reducción de dimensionalidad.

---

## Por qué los vectores propios son los ejes principales de ese elipsoide, y los valores propios son las varianzas a lo largo de esos ejes.

La razón es matemática y viene de cómo se mide la **varianza en una dirección** y de cómo se diagonaliza una matriz simétrica.

## 1. Varianza de una proyección
Sea $X$ un vector aleatorio centrado con matriz de covarianzas $\Sigma$. Para una dirección unitaria $u$, la proyección de los datos sobre esa dirección es $u^T X$. Su varianza es:

$$
\operatorname{Var}(u^T X)=u^T \Sigma u.
$$

> **Qué es $X$** \
Imagina que tenemos un **vector aleatorio** de $p$ variables: $
X=\begin{pmatrix}X_1\\ X_2\\ \vdots\\ X_p\end{pmatrix}.$ \
Cada observación de nuestro conjunto de datos es una realización de $X$, es decir, un punto en $\mathbb{R}^p$. Por ejemplo, si $p=2$, cada observación es un punto $(x_1,x_2)$ en el plano.
Suponemos que $X$ está **centrado**, es decir, $E[X]=0$. Si no lo está, se le resta la media y se trabaja con $X-\mu$. Esto simplifica la covarianza.

> **2. Qué es $u$** \
$u$ es un **vector unitario** en $\mathbb{R}^p$: $
u=\begin{pmatrix}u_1\\ u_2\\ \vdots\\ u_p\end{pmatrix},
\qquad \|u\|=1 \quad\text{es decir,}\quad u^T u=1. $ \
Geométricamente, $u$ define una **dirección** en el espacio. Al ser unitario, su longitud es 1, así que solo indica hacia dónde apunta.

> **3. Qué es $u^T X$** \
El producto $u^T X$ es el **producto escalar** entre $u$ y $X$: $\qquad u^T X = u_1 X_1 + u_2 X_2 + \cdots + u_p X_p.$
Esto es un **escalar** (un número), no un vector. ¿Qué representa? \
Geométricamente, $u^T X$ es la **proyección escalar de $X$ sobre la dirección $u$**. Es decir, si dibujas el vector $X$ y lo proyectas perpendicularmente sobre la recta que pasa por el origen en la dirección $u$, la longitud de esa sombra (con signo) es exactamente $u^T X$.    
¬ Si $X$ apunta en la misma dirección que $u$, $u^T X$ es grande y positivo. \
¬ Si $X$ es perpendicular a $u$, $u^T X=0$. \
¬ Si $X$ apunta en dirección opuesta, $u^T X$ es negativo. \
Para cada observación $x$ de los datos, $u^T x$ es un número: la coordenada de esa observación a lo largo de la dirección $u$.
  
> **Por qué su varianza es $u^T \Sigma u$** \
Ahora consideramos la variable aleatoria escalar $Y = u^T X$.  
Nos preguntamos: ¿cuánto varía $Y$ cuando $X$ varía según su distribución? \
Por definición de varianza (con $X$ centrado):  $
\qquad \qquad \qquad \qquad \operatorname{Var}(Y) = E[Y^2] = E[(u^T X)^2].$ \
Usando propiedades del producto escalar y de la esperanza: $\qquad 
E[(u^T X)^2]
= E[u^T X X^T u]
= u^T E[X X^T] u.
$ \
Pero $E[X X^T]$ es exactamente la **matriz de covarianzas** $\Sigma$ (porque $X$ está centrado). 
Por tanto: $\operatorname{Var}(u^T X) = u^T \Sigma u. $ \
Esta expresión $u^T \Sigma u$ se llama **forma cuadrática** asociada a $\Sigma$. Es un número que depende de la dirección $u$.

> **Interpretación intuitiva** \
¬ $u^T X$ es "cuánto de $X$ cae en la dirección $u$". \
¬ Al variar las observaciones, esa proyección fluctúa. \
¬ La magnitud de esa fluctuación es $u^T \Sigma u$. \
¬ Si eliges $u$ en una dirección donde los datos se dispersan mucho, $u^T \Sigma u$ es grande. \
¬ Si eliges $u$ en una dirección donde los datos están muy concentrados, $u^T \Sigma u$ es pequeño.

> **Ejemplo sencillo en 2D** \
Supón que $\Sigma=\begin{pmatrix}4 & 0\\0 & 1\end{pmatrix}$.  
Los datos se dispersan mucho en el eje $x_1$ (varianza 4) y poco en $x_2$ (varianza 1). \
¬ Si $u=(1,0)^T$ (dirección del eje $x_1$):
\
$\qquad u^T \Sigma u = (1,0)\begin{pmatrix}4&0\\0&1\end{pmatrix}\begin{pmatrix}1\\0\end{pmatrix}=4. $ \
$\qquad$La proyección sobre el eje $x_1$ tiene varianza 4.\
$\qquad$  
¬ Si $u=(0,1)^T$ (dirección del eje $x_2$):
\
$\qquad u^T \Sigma u = (0,1)\begin{pmatrix}4&0\\0&1\end{pmatrix}\begin{pmatrix}0\\1\end{pmatrix}=1. $ \
$\qquad$La proyección sobre el eje $x_2$ tiene varianza 1.\
$\qquad$ \
¬ Si $u=\left(\frac{1}{\sqrt2},\frac{1}{\sqrt2}\right)^T$ (dirección diagonal):
\
$ \qquad
u^T \Sigma u = \frac{4+1}{2}=2.5. 
$ \
$\qquad$ La proyección sobre la diagonal tiene varianza 2.5, intermedia entre 1 y 4.  \

> **En resumen**
La frase significa: **si tomas tus datos multivariantes $X$ y los proyectas sobre una dirección unitaria $u$, obtienes una variable escalar $u^T X$; la varianza de esa variable escalar es $u^T \Sigma u$.** Esa cantidad mide cuánta dispersión de los datos se captura al mirarlos desde la dirección $u$. Maximizar $u^T \Sigma u$ es lo que conduce a los vectores y valores propios de $\Sigma$.






Entonces, buscar la dirección de **máxima varianza** equivale a maximizar $u^T \Sigma u$ sujeto a que $u$ sea unitario, $u^T u=1$.
<div>
<iframe 
  src="https://docs.google.com/spreadsheets/d/16fmUa3OPM8mvkaybbUKBkkbhDLlwexedoZKeO-e2vb8/edit?usp=sharing&ouid=107942841804039600728&rtpof=true&sd=true&widget=true&headers=false"
  width="100%" 
  height="800"
  frameborder="0">
</iframe>
</div>


## 2. Por qué aparecen los vectores propios
Planteamos el problema con un multiplicador de Lagrange:

$$
\mathcal L(u,\lambda)=u^T \Sigma u-\lambda(u^T u-1).
$$
Derivando e igualando a cero:

$$
\frac{\partial \mathcal L}{\partial u}=2\Sigma u-2\lambda u=0
$$
$$
\Sigma u=\lambda u.
$$
Es decir, las direcciones que hacen estacionaria la varianza son exactamente los **vectores propios** de $\Sigma$. El valor propio asociado cumple:

$$
\lambda = u^T \Sigma u,
$$

que es precisamente la **varianza de los datos a lo largo de esa dirección**, si $u$ es unitario.

Por eso:
- los **vectores propios** dan las direcciones principales de variación;
- los **valores propios** dan la varianza en esas direcciones.

## 3. Por qué son ejes ortogonales
Como $\Sigma$ es simétrica, sus vectores propios asociados a valores propios distintos son ortogonales. Además, si $v_i$ y $v_j$ son vectores propios:

$$
\operatorname{Cov}(v_i^T X,\; v_j^T X)
= v_i^T \Sigma v_j
= \lambda_j v_i^T v_j
=0.
$$

Es decir, al proyectar sobre los ejes propios, las nuevas variables quedan **incorrelacionadas**. Por eso forman un sistema de ejes naturales para describir la dispersión.

## 4. El elipsoide de dispersión
La matriz de covarianzas define un elipsoide centrado en la media:

$$
(x-\mu)^T \Sigma^{-1}(x-\mu)=c.
$$

Si cambiamos a la base de vectores propios, $\Sigma$ se vuelve diagonal:

$$
\Sigma = V \Lambda V^T,
\qquad
\Lambda=\operatorname{diag}(\lambda_1,\dots,\lambda_p).
$$

En esa base, la ecuación del elipsoide queda:

$$
\sum_{i=1}^p \frac{y_i^2}{\lambda_i}=c.
$$

Por tanto:
- los **ejes del elipsoide** son los vectores propios $v_i$;
- la **longitud del semieje** en la dirección $v_i$ es proporcional a $\sqrt{\lambda_i}$;
- la **varianza** a lo largo de ese eje es $\lambda_i$.

## Matiz importante
Los valores propios **son las varianzas** a lo largo de los ejes principales, pero las **longitudes de los semiejes** del elipsoide son proporcionales a $\sqrt{\lambda_i}$, no a $\lambda_i$. Por ejemplo, para el elipsoide de una desviación típica:

$$
(x-\mu)^T \Sigma^{-1}(x-\mu)=1,
$$

el semieje en la dirección $v_i$ mide $\sqrt{\lambda_i}$.

## Resumen
Los vectores propios son los ejes principales porque son las direcciones en las que la varianza $u^T\Sigma u$ se hace estacionaria. Los valores propios son esas varianzas porque, al evaluar en un vector propio unitario $v_i$:

$$
\operatorname{Var}(v_i^T X)=v_i^T \Sigma v_i
= v_i^T(\lambda_i v_i)
= \lambda_i.
$$

Así, $\Sigma$ queda diagonal en la base de sus vectores propios: cada eje principal concentra una varianza igual a su valor propio, y los ejes son ortogonales entre sí.


# Apéndice: Multiplicador de Lagrange

## 1. El problema que queremos resolver

El método de los multiplicadores de Lagrange permite optimizar una función $f(x)$ sujeta a una restricción de igualdad $g(x)=0$. La idea es transformar el problema restringido en uno sin restricciones mediante la introducción de un parámetro adicional: el multiplicador de Lagrange λ.

Por ejemplo: Tenemos como función objetivo: $f(x,y)=0.1x^2+0.1 x y^2$ sujeta a la restricción $x^2+y^2 = 1$. Cuando los vectores gradiente de $f$ y $g$ son paralelos nos encontramos con un máximo o un mínimo.

<div>
  <iframe src="https://www.geogebra.org/calculator/h8muftzt?embed" 
      width="1000" 
      height="800" 
      allowfullscreen 
      showAlgebraInput="false"
      style="border: 1px solid #e4e4e4;border-radius: 4px;" 
      frameborder="0">
  </iframe>
</div>

---

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


---

# Apéndice:  Significado y valor de $\operatorname{Cov}(v_i^T X,\; v_j^T X)$

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

Tomamos $A = v_i^T X$ y $B = v_j^T X$. \
Como $X$ está centrado ($E[X]=0$), \
también $E[v_i^T X]=v_i^T E[X]=0$ y $E[v_j^T X]=0$. \
Entonces:

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
= (v_i v_j^T) E\big[X^T X\big].
$$

Aquí conviene reordenar usando la linealidad de la traza, o directamente sacar la matriz constante:

$$
M E[X^T X] = M E[\operatorname{tr}(X^T X)] = M E[\operatorname{tr}(X X^T)] = M \operatorname{tr}(E[X X^T]).
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

---

# Apéndice:  Generación del fichero geogebra multiplicador-lagrange.ggb




En Codex o Chatgpt-work:

``` bash
Crea un fichero multiplicador-lagrange.ggb que:
	- represente la función f(x,y) =0.1 x^2 + 0.1 x y^2
	- represente la función g(x,y) como un cilindro vertical de base (x^2 + y^2 = 16) 
	- dibuje la intersección de ambas funciones
	- representa los máximos y mínimos, tanto locales como globales.
	- dibuja la representación del vector gradiente de g, que dinámicamente se vaya moviendo entorno a la curva intersección (deslizador)
	- dibuja otro vector sobre el mismo punto que recorre la curva que sea el gradiente de la función f

Algunas consideraciones:
	- función f:   color #66CCFF,  opacidad 20%   trazo oculto: invisible
	- función g:   color #FFD700,  opacidad 20%   trazo oculto: invisible
	- el vector gradiente de g debe dividirse por 5
	- Deslizador 0.1x
	- gradientes ->  Etiqueta: nombre
	- Máximos y mínimos ->  Etiqueta: nombre
```
