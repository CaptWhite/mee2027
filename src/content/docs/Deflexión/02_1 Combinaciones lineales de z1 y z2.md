La elección

$$
X=\mu_X+\sigma_X Z_1,
\qquad
Y=\mu_Y+\sigma_Y\left(\rho Z_1+\sqrt{1-\rho^2}\,Z_2\right),
$$

con $Z_1,Z_2\sim N(0,1)$ independientes, no es arbitraria. Es la forma más natural —y esencialmente única salvo signo— de construir dos variables normales con medias $\mu_X,\mu_Y$, desviaciones típicas $\sigma_X,\sigma_Y$ y correlación $\rho$. Además, es exactamente la descomposición de Cholesky de la matriz de correlación.

Vamos por partes.

---

## 1. Primero estandarizamos

Si queremos que $X$ tenga media $\mu_X$ y desviación típica $\sigma_X$, lo natural es escribir

$$
X=\mu_X+\sigma_X U,
$$

donde $U$ debe ser una normal estándar:

$$
U\sim N(0,1).
$$

Análogamente, para $Y$ queremos

$$
Y=\mu_Y+\sigma_Y V,
$$

con

$$
V\sim N(0,1).
$$

Además, la correlación entre $X$ e $Y$ es la misma que la correlación entre $U$ y $V$, porque trasladar y escalar no cambia la correlación:

$$
\operatorname{Corr}(X,Y)=\operatorname{Corr}(U,V).
$$

Por tanto, el problema se reduce a construir dos normales estándar $U,V$ con correlación $\rho$. Después ya pondremos las medias y las desviaciones típicas.

La elección

$$
U=Z_1
$$

es simplemente tomar como primera variable estándar una normal estándar independiente. No perdemos generalidad: $Z_1,Z_2$ son variables auxiliares que nosotros mismos introducimos.

Ahora hay que construir $V$ de forma que:

$$
V\sim N(0,1),
\qquad
\operatorname{Corr}(U,V)=\rho.
$$

---

## 2. ¿Por qué $V=\rho Z_1+\sqrt{1-\rho^2}\,Z_2$?

Supongamos que buscamos $V$ como combinación lineal de $Z_1$ y $Z_2$:
$$
V=aZ_1+bZ_2.
$$
Como $Z_1,Z_2$ son independientes y normales estándar, cualquier combinación lineal suya es normal. Queremos imponer dos condiciones:

1. Que $V$ tenga varianza 1.
2. Que $\operatorname{Cov}(Z_1,V)=\rho$.

Calculamos:

$$
\operatorname{Var}(V)
=
\operatorname{Var}(aZ_1+bZ_2)
=
a^2\operatorname{Var}(Z_1)+b^2\operatorname{Var}(Z_2)
=
a^2+b^2,
$$
porque $Z_1,Z_2$ son independientes y tienen varianza 1.

También,

$$
\operatorname{Cov}(Z_1,V)
=
\operatorname{Cov}(Z_1,aZ_1+bZ_2)
=
a\operatorname{Var}(Z_1)+b\operatorname{Cov}(Z_1,Z_2)
=
a.
$$

Como $Z_1$ y $V$ tienen varianza 1, su correlación es

$$
\operatorname{Corr}(Z_1,V)=\operatorname{Cov}(Z_1,V)=a.
$$

Queremos que esa correlación sea $\rho$. Por tanto,

$$
a=\rho
$$

Y como queremos $\operatorname{Var}(V)=1$,

$$
a^2+b^2=1
\quad\Longrightarrow\quad
\rho^2+b^2=1
\quad\Longrightarrow\quad
b^2=1-\rho^2.
$$

Si $|\rho|<1$, podemos tomar

$$
b=\sqrt{1-\rho^2} ~~~ o ~~~ b=-\sqrt{1-\rho^2}
$$

El signo solo cambia $Z_2$ por $-Z_2$, que tiene la misma distribución. Elegimos el signo positivo por comodidad. Así:

$$
V=\rho Z_1+\sqrt{1-\rho^2}\,Z_2.
$$

Por tanto,

$$
Y=\mu_Y+\sigma_Y V
=
\mu_Y+\sigma_Y\left(\rho Z_1+\sqrt{1-\rho^2}\,Z_2\right).
$$

Esto justifica exactamente los coeficientes. El $\rho$ delante de $Z_1$ es la parte de $Y$ que “comparte” con $X$. El factor $\sqrt{1-\rho^2}$ delante de $Z_2$ es la parte independiente que hay que añadir para que la varianza total de $Y$ siga siendo $\sigma_Y^2$. Si no pusieras ese factor, la varianza sería demasiado grande.

---

## 3. Comprobación de que produce los momentos deseados

Con

$$
X=\mu_X+\sigma_X Z_1,
\qquad
Y=\mu_Y+\sigma_Y\left(\rho Z_1+\sqrt{1-\rho^2}Z_2\right),
$$

tenemos:

$$
\mathbb E[X]=\mu_X,
\qquad
\mathbb E[Y]=\mu_Y.
$$

Las varianzas:

$$
\operatorname{Var}(X)=\sigma_X^2,
$$
y

$$
\operatorname{Var}(Y)
=
\sigma_Y^2\left(\rho^2+(\sqrt{1-\rho^2})^2\right)
=
\sigma_Y^2(\rho^2+1-\rho^2)
=
\sigma_Y^2.
$$

La covarianza:

$$
\operatorname{Cov}(X,Y)
=
\sigma_X\sigma_Y\operatorname{Cov}(Z_1,\rho Z_1+\sqrt{1-\rho^2}Z_2)
=
\sigma_X\sigma_Y\rho.
$$

Por tanto,

$$
\operatorname{Corr}(X,Y)
=
\frac{\rho\sigma_X\sigma_Y}{\sigma_X\sigma_Y}
=
\rho.
$$
Así queda justificado que la construcción produce exactamente los parámetros deseados.

---

## 4. ¿Por qué esto da una normal bivariada?

Porque $(X,Y)$ es una transformación lineal afín de $(Z_1,Z_2)$, y $(Z_1,Z_2)$ es una normal bidimensional estándar. Las transformaciones lineales afines de vectores normales siguen siendo normales. Matricialmente:

$$
\begin{pmatrix}X\\Y\end{pmatrix}
=
\begin{pmatrix}\mu_X\\\mu_Y\end{pmatrix}
+
\begin{pmatrix}\sigma_X&0\\0&\sigma_Y\end{pmatrix}
\begin{pmatrix}
1&0\\
\rho&\sqrt{1-\rho^2}
\end{pmatrix}
\begin{pmatrix}Z_1\\Z_2\end{pmatrix}.
$$

La matriz

$$
L=
\begin{pmatrix}
1&0\\
\rho&\sqrt{1-\rho^2}
\end{pmatrix}
$$

es la factorización de Cholesky de la matriz de correlación

$$
R=
\begin{pmatrix}
1&\rho\\
\rho&1
\end{pmatrix}.
$$

En efecto,

$$
LL^T=
\begin{pmatrix}
1&0\\
\rho&\sqrt{1-\rho^2}
\end{pmatrix}
\begin{pmatrix}
1&\rho\\
0&\sqrt{1-\rho^2}
\end{pmatrix}
=
\begin{pmatrix}
1&\rho\\
\rho&\rho^2+1-\rho^2
\end{pmatrix}
=
\begin{pmatrix}
1&\rho\\
\rho&1
\end{pmatrix}.
$$

Por eso la matriz de covarianzas de $(X,Y)$ es

$$
\Sigma=
\begin{pmatrix}
\sigma_X^2&\rho\sigma_X\sigma_Y\\
\rho\sigma_X\sigma_Y&\sigma_Y^2
\end{pmatrix}.
$$

Es decir, la expresión elegida no es más que aplicar la raíz de Cholesky de la matriz de correlación y después escalar por $\sigma_X,\sigma_Y$.

---

## 5. Interpretación geométrica

Otra forma de verlo: $Z_1$ y $Z_2$ son dos direcciones independientes y ortogonales. Queremos que la variable estandarizada $V$ tenga correlación $\rho$ con $Z_1$. Entonces descomponemos $V$ en:

- una parte proporcional a $Z_1$, que es $\rho Z_1$;
- una parte ortogonal a $Z_1$, que debe ser independiente de ella.

Como $V$ debe tener varianza 1,
$$
1=\rho^2+\text{(varianza de la parte ortogonal)}.
$$
Por tanto, la parte ortogonal debe tener varianza $1-\rho^2$, y su desviación típica es $\sqrt{1-\rho^2}$. Esa es exactamente la componente que multiplica a $Z_2$.

---

## 6. Casos límite

- Si $\rho=0$, entonces
  $$
  Y=\mu_Y+\sigma_Y Z_2,
  $$
  y $X,Y$ son independientes. La fórmula se factoriza.
- Si $\rho\to 1$, entonces $\sqrt{1-\rho^2}\to 0$, y $Y$ se acerca a
  $$
  \mu_Y+\sigma_Y Z_1,
  $$
  es decir, $Y$ queda casi perfectamente determinado por $X$.
- Si $\rho\to -1$, ocurre lo análogo con signo negativo.
- Si $\rho=\pm1$, la matriz de covarianzas es singular y ya no existe densidad normal bivariada no degenerada; la fórmula con $\sqrt{1-\rho^2}$ en el denominador dejaría de tener sentido.

---

## Resumen

La expresión
$$
X=\mu_X+\sigma_X Z_1,
\qquad
Y=\mu_Y+\sigma_Y\left(\rho Z_1+\sqrt{1-\rho^2}\,Z_2\right)
$$
se justifica porque:

1. $Z_1$ es la parte estandarizada de $X$.
2. Para que $Y$ tenga correlación $\rho$ con $X$, su componente sobre $Z_1$ debe ser $\rho Z_1$.
3. Para que $Y$ siga teniendo varianza $\sigma_Y^2$, la componente independiente debe tener varianza $1-\rho^2$, de ahí el factor $\sqrt{1-\rho^2}$.
4. Es una transformación lineal afín de dos normales estándar independientes, luego $(X,Y)$ es normal bivariada.
5. Matricialmente, es exactamente la descomposición de Cholesky de la matriz de correlación.

Dicho de forma breve: **el coeficiente $\rho$ introduce la correlación y el factor $\sqrt{1-\rho^2}$ corrige la varianza para que no se altere al introducir esa correlación**.