La fórmula de la densidad normal bivariada suele presentarse como algo “dado”, pero tiene una justificación muy natural: **una normal bivariada se construye a partir de dos normales estándar independientes mediante una transformación lineal afín**. Esa transformación introduce las medias, las desviaciones típicas y la correlación. El factor raro que aparece delante de la exponencial no es arbitrario: es exactamente el que hace que la integral total valga 1 y sale del jacobiano del cambio de variables.

Sea $(X,Y)$ un vector aleatorio continuo bidimensional. Decimos que sigue una distribución normal bivariada con parámetros
$$
\mu_X,\ \mu_Y,\ \sigma_X>0,\ \sigma_Y>0,\ \rho\in(-1,1),
$$
si su función de densidad conjunta es
$$
f_{X,Y}(x,y)=
\frac{1}{2\pi\sigma_X\sigma_Y\sqrt{1-\rho^2}}
\exp\left\{
-\frac{1}{2(1-\rho^2)}
\left[
\frac{(x-\mu_X)^2}{\sigma_X^2}
-2\rho\frac{(x-\mu_X)(y-\mu_Y)}{\sigma_X\sigma_Y}
+\frac{(y-\mu_Y)^2}{\sigma_Y^2}
\right]
\right\}.
$$
La idea es justificar de dónde sale esta expresión.

---

## 1. Punto de partida: dos normales estándar independientes

Sean $Z_1,Z_2$ dos  variables aleatorias independientes que siguen una distribución normal de media $0$ y varianza $1$

$$
Z_1,Z_2\sim N(0,1),\qquad \operatorname{Cov}(Z_1,Z_2)=0.
$$

Como son independientes, su densidad conjunta es el producto de las marginales:

$$
f_{Z_1,Z_2}(z_1,z_2)
=
\frac{1}{\sqrt{2\pi}}e^{-z_1^2/2}
\cdot
\frac{1}{\sqrt{2\pi}}e^{-z_2^2/2}
=
\frac{1}{2\pi}
e^{-(z_1^2+z_2^2)/2}.
$$

El factor $1/(2\pi)$ aparece porque

$$
\int_{\mathbb R^2} e^{-x^2} dx = \sqrt{\pi} \\
\int_{\mathbb R^2} e^{-x^2/2} dx = \sqrt{2 \pi} \\      \int_{\mathbb R^2} e^{-(z_1^2+z_2^2)/2}\,dz_1\,dz_2 = \int_{\mathbb R^2} e^{-(z_1^2/2)}\,dz_1 \int_{\mathbb R^2} e^{-(z_2^2/2)}\,dz_2
=\sqrt{2\pi} \sqrt{2\pi} = 2\pi.
$$

Ahora construimos $X$ e $Y$ como combinaciones lineales de $Z_1,Z_2$:

$$
X=\mu_X+\sigma_X Z_1,
$$

$$
Y=\mu_Y+\sigma_Y\left(\rho Z_1+\sqrt{1-\rho^2}\,Z_2\right).
$$

Aquí $|\rho|<1$, de modo que $\sqrt{1-\rho^2}$ es real y positivo.

Esta construcción es la clave. Veamos qué produce.

### Medias

$$
\mathbb E[X]=\mu_X+\sigma_X\mathbb E[Z_1]=\mu_X,
$$

$$
\mathbb E[Y]=\mu_Y+\sigma_Y\left(\rho\mathbb E[Z_1]+\sqrt{1-\rho^2}\mathbb E[Z_2]\right)=\mu_Y.
$$

### Varianzas

$$
\operatorname{Var}(X)=\sigma_X^2\operatorname{Var}(Z_1)=\sigma_X^2.
$$

Para $Y$,

$$
\operatorname{Var}(Y)
=
\sigma_Y^2\left(\rho^2\operatorname{Var}(Z_1)+(1-\rho^2)\operatorname{Var}(Z_2)\right)
=
\sigma_Y^2(\rho^2+1-\rho^2)
=
\sigma_Y^2.
$$

### Covarianza y correlación

$$
\operatorname{Cov}(X,Y)
=
\sigma_X\sigma_Y\operatorname{Cov}(Z_1,\rho Z_1+\sqrt{1-\rho^2}Z_2).
$$

Como $Z_1,Z_2$ son independientes,

$$
\operatorname{Cov}(Z_1,\rho Z_1+\sqrt{1-\rho^2}Z_2)
=
\rho\operatorname{Var}(Z_1)+0
=
\rho.
$$

Por tanto,

$$
\operatorname{Cov}(X,Y)=\rho\sigma_X\sigma_Y.
$$

Y como las desviaciones típicas son $\sigma_X$ y $\sigma_Y$,

$$
\operatorname{Corr}(X,Y)
=
\frac{\operatorname{Cov}(X,Y)}{\sigma_X\sigma_Y}
=
\rho.
$$
Así queda justificado el significado de $\rho$: es la correlación entre $X$ e $Y$.

---

## 2. Cambio de variables: de $(Z_1,Z_2)$ a $(X,Y)$

Tenemos

$$
X=\mu_X+\sigma_X Z_1,
$$

$$
Y=\mu_Y+\sigma_Y\left(\rho Z_1+\sqrt{1-\rho^2}Z_2\right).
$$

Despejamos $(Z_1,Z_2)$ en función de $(X,Y)$:
$$
Z_1=\frac{X-\mu_X}{\sigma_X},
$$

$$
Z_2=
\frac{
\dfrac{Y-\mu_Y}{\sigma_Y}
-\rho\dfrac{X-\mu_X}{\sigma_X}
}{
\sqrt{1-\rho^2}
}.
$$
Para pasar de la densidad de $(Z_1,Z_2)$ a la densidad de $(X,Y)$ hay que multiplicar por el valor absoluto del jacobiano del cambio de variables. Ese jacobiano mide cómo se deforman las áreas al pasar de las coordenadas $z$ a las coordenadas $x,y$.



El jacobiano se calcula a partir de la transformación inversa

$$
z_1=\frac{x-\mu_X}{\sigma_X},
\qquad
z_2=
\frac{
\dfrac{y-\mu_Y}{\sigma_Y}
-\rho\dfrac{x-\mu_X}{\sigma_X}
}{
\sqrt{1-\rho^2}
}.
$$

Su matriz jacobiana es

$$
J=
\frac{\partial(z_1,z_2)}{\partial(x,y)}
=
\begin{pmatrix}
\dfrac{\partial z_1}{\partial x} & \dfrac{\partial z_1}{\partial y}\\[1.2em]
\dfrac{\partial z_2}{\partial x} & \dfrac{\partial z_2}{\partial y}
\end{pmatrix}

=

\begin{pmatrix}
\dfrac{1}{\sigma_X} & 0\\[1em]
-\dfrac{\rho}{\sigma_X\sqrt{1-\rho^2}} & \dfrac{1}{\sigma_Y\sqrt{1-\rho^2}}
\end{pmatrix},
$$

y su determinante, en valor absoluto, es

$$
\boxed{
\left|\frac{\partial(z_1,z_2)}{\partial(x,y)}\right|
=
\frac{1}{\sigma_X\sigma_Y\sqrt{1-\rho^2}}.
}
$$

Por tanto,

$$
f_{X,Y}(x,y)
=
f_{Z_1,Z_2}(z_1(x,y),z_2(x,y))
\cdot
\frac{1}{\sigma_X\sigma_Y\sqrt{1-\rho^2}}.
$$

Sustituyendo la densidad de $Z_1,Z_2$,

$$
f_{X,Y}(x,y)
=
\frac{1}{2\pi}
e^{-(z_1^2+z_2^2)/2}
\cdot
\frac{1}{\sigma_X\sigma_Y\sqrt{1-\rho^2}}.
$$

Es decir,

$$
f_{X,Y}(x,y)
=
\frac{1}{2\pi\sigma_X\sigma_Y\sqrt{1-\rho^2}}
e^{-(z_1^2+z_2^2)/2}.
$$
Ahora solo queda simplificar el exponente.

---

## 3. Simplificación del exponente

Escribamos

$$
a=\frac{x-\mu_X}{\sigma_X},
\qquad
b=\frac{y-\mu_Y}{\sigma_Y}.
$$

Entonces

$$
z_1=a,
\qquad
z_2=\frac{b-\rho a}{\sqrt{1-\rho^2}}.
$$

Por tanto,

$$
z_1^2+z_2^2
=
a^2+\frac{(b-\rho a)^2}{1-\rho^2}.
$$

Poniendo denominador común $1-\rho^2$:

$$
z_1^2+z_2^2
=
\frac{a^2(1-\rho^2)+(b-\rho a)^2}{1-\rho^2}.
$$

Desarrollamos:

$$
a^2(1-\rho^2)+(b-\rho a)^2
=
a^2-a^2\rho^2+b^2-2\rho ab+\rho^2a^2
=
a^2+b^2-2\rho ab.
$$

Por tanto,

$$
z_1^2+z_2^2
=
\frac{a^2+b^2-2\rho ab}{1-\rho^2}.
$$

Volviendo a $a,b$:

$$
z_1^2+z_2^2
=
\frac{1}{1-\rho^2}
\left[
\frac{(x-\mu_X)^2}{\sigma_X^2}
-2\rho\frac{(x-\mu_X)(y-\mu_Y)}{\sigma_X\sigma_Y}
+\frac{(y-\mu_Y)^2}{\sigma_Y^2}
\right].
$$
Sustituyendo en la densidad obtenida antes, llegamos exactamente a
$$
f_{X,Y}(x,y)=
\frac{1}{2\pi\sigma_X\sigma_Y\sqrt{1-\rho^2}}
\exp\left\{
-\frac{1}{2(1-\rho^2)}
\left[
\frac{(x-\mu_X)^2}{\sigma_X^2}
-2\rho\frac{(x-\mu_X)(y-\mu_Y)}{\sigma_X\sigma_Y}
+\frac{(y-\mu_Y)^2}{\sigma_Y^2}
\right]
\right\}.
$$
Esa es la fórmula que queríamos justificar.

---

## 4. ¿Por qué la constante es precisamente esa?

La constante

$$
\frac{1}{2\pi\sigma_X\sigma_Y\sqrt{1-\rho^2}}
$$

no se elige “a ojo”. Su misión es que la densidad integre 1:

$$
\int_{\mathbb R^2} f_{X,Y}(x,y)\,dx\,dy=1.
$$

Pero esto ya está garantizado por la construcción. En efecto,

$$
\int_{\mathbb R^2} f_{X,Y}(x,y)\,dx\,dy
=
\int_{\mathbb R^2}
f_{Z_1,Z_2}(z_1,z_2)\,dz_1\,dz_2
=
1,
$$
porque el jacobiano es exactamente el factor que corrige el cambio de variables. El $2\pi$ viene de la normal bidimensional estándar; el producto $\sigma_X\sigma_Y$ viene de las escalas de $X$ e $Y$; y el factor $\sqrt{1-\rho^2}$ viene de la “inclinación” o mezcla lineal que introduce la correlación.

Equivalentemente, si se escribe la matriz de covarianzas

$$
\Sigma=
\begin{pmatrix}
\sigma_X^2 & \rho\sigma_X\sigma_Y\\
\rho\sigma_X\sigma_Y & \sigma_Y^2
\end{pmatrix},
$$

entonces

$$
\det(\Sigma)
=
\sigma_X^2\sigma_Y^2(1-\rho^2),
$$

y por tanto

$$
\sqrt{\det(\Sigma)}
=
\sigma_X\sigma_Y\sqrt{1-\rho^2}.
$$

La densidad normal bivariada se puede escribir de forma matricial como

$$
f_{\mathbf X}(\mathbf x)
=
\frac{1}{2\pi\sqrt{\det(\Sigma)}}
\exp\left(
-\frac12
(\mathbf x-\boldsymbol\mu)^T
\Sigma^{-1}
(\mathbf x-\boldsymbol\mu)
\right),
$$
donde
$$
\mathbf x=
\begin{pmatrix}x\\y\end{pmatrix},
\qquad
\boldsymbol\mu=
\begin{pmatrix}\mu_X\\\mu_Y\end{pmatrix}.
$$
La expresión larga con $\sigma_X,\sigma_Y,\rho$ es simplemente el desarrollo de esa fórmula matricial en dos dimensiones.

---

## 5. Interpretación de la fórmula

El exponente
$$
-\frac{1}{2(1-\rho^2)}
\left[
\frac{(x-\mu_X)^2}{\sigma_X^2}
-2\rho\frac{(x-\mu_X)(y-\mu_Y)}{\sigma_X\sigma_Y}
+\frac{(y-\mu_Y)^2}{\sigma_Y^2}
\right]
$$
es negativo y cuadrático. Por eso la densidad es máxima en el punto $(\mu_X,\mu_Y)$ y decrece al alejarnos de él. Las curvas de nivel
$$
f_{X,Y}(x,y)=\text{constante}
$$
son elipses centradas en $(\mu_X,\mu_Y)$. Esa es la imagen típica de una normal bivariada: una “campana” bidimensional con curvas de nivel elípticas.

- Si $\rho=0$, la fórmula se factoriza:

  $$
  f_{X,Y}(x,y)
  =
  \frac{1}{\sqrt{2\pi}\sigma_X}
  e^{-(x-\mu_X)^2/(2\sigma_X^2)}
  \cdot
  \frac{1}{\sqrt{2\pi}\sigma_Y}
  e^{-(y-\mu_Y)^2/(2\sigma_Y^2)},
  $$
  es decir, $X$ e $Y$ son independientes.
- Si $\rho>0$, las elipses se inclinan en sentido positivo: valores altos de $X$ tienden a acompañarse de valores altos de $Y$.
- Si $\rho<0$, la inclinación es negativa.
- Si $|\rho|$ se acerca a 1, el factor $1-\rho^2$ se hace pequeño y la densidad se concentra en torno a una dirección muy marcada: $X$ e $Y$ están muy correlacionadas.
- Si $\sigma_X=\sigma_Y$ y $\rho=0$, las curvas de nivel son circunferencias.

Además, por la propia construcción, las marginales son normales:

$$
X\sim N(\mu_X,\sigma_X^2),
\qquad
Y\sim N(\mu_Y,\sigma_Y^2).
$$

Y la distribución condicional también tiene una forma coherente:

$$
\mathbb E[Y\mid X=x]
=
\mu_Y+\rho\frac{\sigma_Y}{\sigma_X}(x-\mu_X),
$$
$$
\operatorname{Var}(Y\mid X=x)
=
\sigma_Y^2(1-\rho^2).
$$
Esto refuerza la interpretación de $\rho$: mide cuánto cambia, en media, $Y$ cuando cambia $X$, y cuánto reduce la incertidumbre de $Y$ el conocer $X$.

---

## Resumen de la justificación

1. Se parten de dos normales estándar independientes $Z_1,Z_2$, cuya densidad conjunta es conocida.
2. Se definen $X$ e $Y$ mediante una transformación lineal afín que introduce $\mu_X,\mu_Y,\sigma_X,\sigma_Y$ y la correlación $\rho$.
3. Se hace el cambio de variables $(z_1,z_2)\mapsto(x,y)$; el jacobiano aporta el factor
   $$
   \frac{1}{\sigma_X\sigma_Y\sqrt{1-\rho^2}}.
   $$
4. Se simplifica $z_1^2+z_2^2$ y se obtiene la forma cuadrática del exponente.
5. La constante final $1/(2\pi\sigma_X\sigma_Y\sqrt{1-\rho^2})$ es exactamente la necesaria para que la densidad integre 1 y coincide con $1/(2\pi\sqrt{\det\Sigma})$.

Así, la fórmula de la normal bivariada no es un objeto misterioso: es la densidad que resulta de deformar una normal bidimensional estándar mediante escalados, traslaciones y una mezcla lineal que produce la correlación $\rho$.