Esa frase significa que, si queremos construir una variable aleatoria $X$ que tenga:

- media $\mu_X$,
- desviación típica $\sigma_X$,

lo más natural es escribirla como una **transformación afín** de una variable auxiliar $U$:

$$
X=\mu_X+\sigma_X U.
$$

Es decir: primero tomamos una variable $U$, después la multiplicamos por $\sigma_X$ y finalmente le sumamos $\mu_X$. Veamos por qué esto produce exactamente la media y la desviación típica deseadas.

---

## 1. Qué papel juega cada término

En la expresión

$$
X=\mu_X+\sigma_X U,
$$

tenemos:

- $\mu_X$: es un desplazamiento. Sumar $\mu_X$ mueve toda la distribución de $U$ hacia la derecha o hacia la izquierda.
- $\sigma_X$: es un factor de escala. Multiplicar por $\sigma_X$ estira o encoge la distribución.
- $U$: es una variable auxiliar que, en el contexto normal, tomaremos como una normal estándar:
  $$
  U\sim N(0,1).
  $$

La idea es que $U$ ya tiene una forma “básica” —la normal estándar— y mediante $\mu_X$ y $\sigma_X$ la adaptamos para que tenga la media y la dispersión que queremos.

---

## 2. Cálculo de la media

Por las propiedades de la esperanza,

$$
\mathbb E[X]
=
\mathbb E[\mu_X+\sigma_X U]
=
\mu_X+\sigma_X\mathbb E[U].
$$

Si $U\sim N(0,1)$, entonces

$$
\mathbb E[U]=0.
$$

Por tanto,

$$
\mathbb E[X]=\mu_X+\sigma_X\cdot 0=\mu_X.
$$

Así, $X$ tiene media $\mu_X$, exactamente como queríamos.

---

## 3. Cálculo de la varianza

Por las propiedades de la varianza, si $a$ y $b$ son constantes,

$$
\operatorname{Var}(a+bU)=b^2\operatorname{Var}(U).
$$

Aplicado a nuestro caso:

$$
\operatorname{Var}(X)
=
\operatorname{Var}(\mu_X+\sigma_X U)
=
\sigma_X^2\operatorname{Var}(U).
$$

Si $U\sim N(0,1)$, entonces

$$
\operatorname{Var}(U)=1.
$$

Por tanto,

$$
\operatorname{Var}(X)=\sigma_X^2.
$$

Y como la desviación típica es la raíz cuadrada de la varianza,

$$
\sigma_X=\sqrt{\operatorname{Var}(X)}.
$$

Así, $X$ tiene desviación típica $\sigma_X$, exactamente como queríamos.

---

## 4. La interpretación inversa: estandarizar

La igualdad

$$
X=\mu_X+\sigma_X U
$$

se puede invertir:

$$
U=\frac{X-\mu_X}{\sigma_X}.
$$

Esto es muy importante. Si $X$ tiene media $\mu_X$ y desviación típica $\sigma_X$, entonces

$$
\frac{X-\mu_X}{\sigma_X}
$$

es una variable **estandarizada**: tiene media $0$ y desviación típica $1$.

Por eso, si $X\sim N(\mu_X,\sigma_X^2)$, entonces

$$
\frac{X-\mu_X}{\sigma_X}\sim N(0,1).
$$

Es decir, $U$ es la versión estandarizada de $X$. Recíprocamente, si $U\sim N(0,1)$, entonces

$$
X=\mu_X+\sigma_X U\sim N(\mu_X,\sigma_X^2).
$$

---

## 5. Por qué es “lo natural”

Es natural porque describe la relación entre una variable normal general y la normal estándar:

1. Restar la media centra la variable en $0$.
2. Dividir por la desviación típica la escala para que tenga dispersión $1$.
3. Al revés, multiplicar por $\sigma_X$ y sumar $\mu_X$ devuelve la escala y la posición originales.

Geométricamente:

- $\mu_X$ traslada la distribución.
- $\sigma_X$ la estira o la comprime.
- $U$ es la forma básica de la distribución.

Si $U$ es normal estándar, entonces $X=\mu_X+\sigma_X U$ sigue siendo normal, pero con media $\mu_X$ y desviación típica $\sigma_X$.

---

## 6. Matiz importante

La expresión

$$
X=\mu_X+\sigma_X U
$$

por sí sola solo garantiza que

$$
\mathbb E[X]=\mu_X,
\qquad
\operatorname{Var}(X)=\sigma_X^2,
$$

si $U$ tiene media $0$ y varianza $1$. No garantiza que $X$ sea normal, salvo que $U$ sea normal o que impongamos esa hipótesis.

En el contexto de la normal bivariada, tomamos

$$
U=Z_1\sim N(0,1),
$$

y por eso escribimos

$$
X=\mu_X+\sigma_X Z_1,
$$

que es una normal con media $\mu_X$ y desviación típica $\sigma_X$.

---

## Resumen

Escribir

$$
X=\mu_X+\sigma_X U
$$

significa:

- tomar una variable auxiliar $U$,
- multiplicarla por $\sigma_X$ para darle la dispersión deseada,
- sumarle $\mu_X$ para darle la media deseada.

Si $U\sim N(0,1)$, entonces:

$$
\mathbb E[X]=\mu_X,
\qquad
\operatorname{Var}(X)=\sigma_X^2,
\qquad
X\sim N(\mu_X,\sigma_X^2).
$$

Equivalentemente,

$$
U=\frac{X-\mu_X}{\sigma_X}\sim N(0,1).
$$

Es decir, $X$ es una normal estándar trasladada y escalada.