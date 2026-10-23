Vamos a calcularlo paso a paso. Partimos de la transformación inversa, es decir, de expresar $(z_1,z_2)$ en función de $(x,y)$:

$$
z_1=\frac{x-\mu_X}{\sigma_X},
$$

$$
z_2=
\frac{
\dfrac{y-\mu_Y}{\sigma_Y}
-\rho\dfrac{x-\mu_X}{\sigma_X}
}{
\sqrt{1-\rho^2}
}.
$$

Escribamos

$$
s=\sqrt{1-\rho^2}>0,
$$

porque estamos suponiendo $|\rho|<1$. Entonces

$$
z_1=\frac{x-\mu_X}{\sigma_X},
\qquad
z_2=
\frac{1}{s}
\left(
\frac{y-\mu_Y}{\sigma_Y}
-\rho\frac{x-\mu_X}{\sigma_X}
\right).
$$

---

## 1. Derivadas parciales de $z_1$

$$
\frac{\partial z_1}{\partial x}
=
\frac{1}{\sigma_X},
\qquad
\frac{\partial z_1}{\partial y}=0.
$$

---

## 2. Derivadas parciales de $z_2$

Recordando que $\mu_X,\mu_Y,\sigma_X,\sigma_Y,\rho,s$ son constantes,

$$
\frac{\partial z_2}{\partial x}
=
\frac{1}{s}
\left(
0
-\rho\frac{1}{\sigma_X}
\right)
=
-\frac{\rho}{\sigma_X s}.
$$

Y

$$
\frac{\partial z_2}{\partial y}
=
\frac{1}{s}
\left(
\frac{1}{\sigma_Y}
-0
\right)
=
\frac{1}{\sigma_Y s}.
$$

---

## 3. Matriz jacobiana

El jacobiano del cambio $(x,y)\mapsto(z_1,z_2)$ es la matriz

$$
J=
\frac{\partial(z_1,z_2)}{\partial(x,y)}
=
\begin{pmatrix}
\dfrac{\partial z_1}{\partial x} & \dfrac{\partial z_1}{\partial y} \\[$1.2em]
\dfrac{\partial z_2}{\partial x} & \dfrac{\partial z_2}{\partial y}
\end{pmatrix}.
$$

Sustituyendo lo calculado:

$$
J=
\begin{pmatrix}
\dfrac{1}{\sigma_X} & 0\\[1.2em]
-\dfrac{\rho}{\sigma_X s} & \dfrac{1}{\sigma_Y s}
\end{pmatrix}.
$$

---

## 4. Determinante del jacobiano

Como la primera fila tiene un cero, el determinante es simplemente el producto de la diagonal:

$$
\det J
=
\frac{1}{\sigma_X}
\cdot
\frac{1}{\sigma_Y s}
-
0
\cdot
\left(-\frac{\rho}{\sigma_X s}\right).
$$

Por tanto,

$$
\det J
=
\frac{1}{\sigma_X\sigma_Y s}.
$$

Y como $s=\sqrt{1-\rho^2}$,

$$
\det J
=
\frac{1}{\sigma_X\sigma_Y\sqrt{1-\rho^2}}.
$$

Además, como $\sigma_X>0$, $\sigma_Y>0$ y $s>0$, este determinante es positivo. Por eso

$$
\left|\det J\right|
=
\left|
\frac{\partial(z_1,z_2)}{\partial(x,y)}
\right|
=
\frac{1}{\sigma_X\sigma_Y\sqrt{1-\rho^2}}.
$$

---

## 5. La otra forma de verlo: el jacobiano directo

También podríamos calcular el jacobiano de la transformación directa

$$
(x,y)\mapsto(z_1,z_2)
$$

al revés, es decir, de

$$
x=\mu_X+\sigma_X z_1,
$$

$$
y=\mu_Y+\sigma_Y\left(\rho z_1+\sqrt{1-\rho^2}\,z_2\right).
$$

Derivando $(x,y)$ respecto de $(z_1,z_2)$:

$$
\frac{\partial(x,y)}{\partial(z_1,z_2)}
=
\begin{pmatrix}
\sigma_X & 0\\
\sigma_Y\rho & \sigma_Y\sqrt{1-\rho^2}
\end{pmatrix}.
$$

Su determinante es

$$
\sigma_X\cdot \sigma_Y\sqrt{1-\rho^2}
=
\sigma_X\sigma_Y\sqrt{1-\rho^2}.
$$

El jacobiano que necesitamos para pasar de la densidad de $(Z_1,Z_2)$ a la de $(X,Y)$ es el recíproco del valor absoluto de este determinante:

$$
\left|\frac{\partial(z_1,z_2)}{\partial(x,y)}\right|
=
\frac{1}{\sigma_X\sigma_Y\sqrt{1-\rho^2}}.
$$

---

## Resumen

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

Ese es exactamente el factor que aparece multiplicando a la densidad normal estándar conjunta cuando hacemos el cambio de variables $(z_1,z_2)\mapsto(x,y)$.