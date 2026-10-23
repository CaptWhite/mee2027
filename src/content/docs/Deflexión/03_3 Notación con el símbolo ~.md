La notación

$$
Z_1,Z_2\sim N(0,1)
$$

se lee así:

> “$Z_1$ y $Z_2$ son variables aleatorias que siguen una distribución normal de media $0$ y varianza $1$”.

Es decir, cada una es una **normal estándar**.

---

## 1. Significado de cada símbolo

- $Z_1,Z_2$: dos variables aleatorias.
- $\sim$: se lee “se distribuye como” o “tiene distribución”.
- $N$: distribución normal.
- $N(0,1)$: normal con media $0$ y varianza $1$.

En la convención habitual,

$$
N(\mu,\sigma^2)
$$

significa una normal con media $\mu$ y varianza $\sigma^2$. Por tanto,

$$
N(0,1)
$$

significa:

$$
\mathbb E[Z_i]=0,
\qquad
\operatorname{Var}(Z_i)=1,
\qquad
\sigma_{Z_i}=1.
$$

Su función de densidad es

$$
\varphi(z)=\frac{1}{\sqrt{2\pi}}e^{-z^2/2}.
$$

---

## 2. ¿Implica que son independientes?

Aquí hay un matiz importante.

La notación

$$
Z_1,Z_2\sim N(0,1)
$$

por sí sola suele significar simplemente que **cada una** tiene distribución normal estándar. No siempre afirma automáticamente que sean independientes. Para decir que además son independientes, conviene escribir algo como

$$
Z_1,Z_2\sim N(0,1)\ \text{independientes},
$$

o

$$
Z_1,Z_2\stackrel{\text{i.i.d.}}{\sim} N(0,1),
$$

donde “i.i.d.” significa “independientes e idénticamente distribuidas”.

En el contexto de la construcción de la normal bivariada, cuando escribimos

$$
Z_1,Z_2\sim N(0,1)
$$

y añadimos que son independientes, lo que queremos decir es:

$$
Z_1\sim N(0,1),\qquad Z_2\sim N(0,1),
$$

y además $Z_1$ y $Z_2$ son independientes.

Entonces su densidad conjunta es el producto de las marginales:

$$
f_{Z_1,Z_2}(z_1,z_2)
=
\frac{1}{\sqrt{2\pi}}e^{-z_1^2/2}
\cdot
\frac{1}{\sqrt{2\pi}}e^{-z_2^2/2}
=
\frac{1}{2\pi}e^{-(z_1^2+z_2^2)/2}.
$$

---

## 3. Qué significa cada parámetro

Para una variable $Z\sim N(\mu,\sigma^2)$:

- $\mu$ es la media:
  $$
  \mathbb E[Z]=\mu.
  $$
- $\sigma^2$ es la varianza:
  $$
  \operatorname{Var}(Z)=\sigma^2.
  $$
- $\sigma$ es la desviación típica:
  $$
  \sigma=\sqrt{\operatorname{Var}(Z)}.
  $$

Por tanto, en $N(0,1)$:

$$
\mu=0,\qquad \sigma^2=1,\qquad \sigma=1.
$$

---

## 4. Por qué se llama “estándar”

Porque tiene media cero y varianza uno. Es la normal “básica” a partir de la cual se obtienen las demás:

Si

$$
Z\sim N(0,1),
$$

entonces

$$
X=\mu+\sigma Z
$$

tiene distribución

$$
X\sim N(\mu,\sigma^2).
$$

Eso es exactamente lo que usamos al escribir

$$
X=\mu_X+\sigma_X Z_1.
$$

$Z_1$ es una normal estándar, y al multiplicarla por $\sigma_X$ y sumarle $\mu_X$, obtenemos una normal con media $\mu_X$ y desviación típica $\sigma_X$.

---

## 5. Resumen

La notación

$$
Z_1,Z_2\sim N(0,1)
$$

significa que $Z_1$ y $Z_2$ son variables normales estándar, es decir, cada una tiene media $0$ y varianza $1$. Si además se dice que son independientes, entonces su densidad conjunta es el producto de dos densidades normales estándar:

$$
f_{Z_1,Z_2}(z_1,z_2)
=
\frac{1}{2\pi}e^{-(z_1^2+z_2^2)/2}.
$$

En el contexto de la normal bivariada, esa independencia es esencial: $Z_1$ y $Z_2$ son las dos piezas independientes a partir de las cuales construimos $X$ e $Y$.