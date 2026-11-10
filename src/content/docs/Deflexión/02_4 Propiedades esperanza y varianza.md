Aquí tienes las propiedades principales de la esperanza y la varianza, suponiendo que las esperanzas y varianzas que aparecen existen y son finitas. Usaremos la notación
$$
\mu_X=\mathbb E[X],\qquad \operatorname{Var}(X)=\mathbb E[(X-\mu_X)^2].
$$

---

# 1. Propiedades de la esperanza

La esperanza es, esencialmente, un operador **lineal**. Es la propiedad más importante y la que más se usa.

## 1.1. Esperanza de una constante

Si $c\in\mathbb R$ es una constante,

$$
\mathbb E[c]=c.
$$

Una constante no es aleatoria: su media es ella misma.

## 1.2. Sacar constantes multiplicando

Si $c\in\mathbb R$,

$$
\mathbb E[cX]=c\,\mathbb E[X].
$$

Es decir, las constantes multiplicativas salen fuera de la esperanza.

## 1.3. Sumar una constante

$$
\mathbb E[X+c]=\mathbb E[X]+c.
$$

Sumar una constante desplaza la media exactamente en esa constante.

## 1.4. Linealidad general

Para cualesquiera constantes $a,b\in\mathbb R$,

$$
\mathbb E[aX+bY]=a\mathbb E[X]+b\mathbb E[Y].
$$

Y, en general, para $X_1,\dots,X_n$ y constantes $a_1,\dots,a_n$,

$$
\mathbb E\left[\sum_{i=1}^n a_iX_i\right]
=
\sum_{i=1}^n a_i\mathbb E[X_i].
$$

**Importante:** esta linealidad es siempre cierta, **no hace falta que las variables sean independientes**.

## 1.5. Esperanza de una suma

$$
\mathbb E[X+Y]=\mathbb E[X]+\mathbb E[Y].
$$
No importa si $X$ e $Y$ están correlacionadas o no: la esperanza de la suma siempre es la suma de las esperanzas.

## 1.6. Esperanza del producto: cuidado con la independencia

En general,
$$
\mathbb E[XY]\neq \mathbb E[X]\mathbb E[Y].
$$
La igualdad
$$
\mathbb E[XY]=\mathbb E[X]\mathbb E[Y]
$$
es cierta si $X$ e $Y$ son independientes.

De hecho, siempre se tiene
$$
\mathbb E[XY]=\operatorname{Cov}(X,Y)+\mathbb E[X]\mathbb E[Y].
$$
Por tanto, si $\operatorname{Cov}(X,Y)=0$, entonces $\mathbb E[XY]=\mathbb E[X]\mathbb E[Y]$. Pero atención: covarianza cero no implica independencia en general; sí lo implica, por ejemplo, en el caso normal bivariado.

## 1.7. Esperanza de una función de una variable

Si $X$ es una variable aleatoria y $g$ es una función,
$$
\mathbb E[g(X)]
$$
no se calcula necesariamente como $g(\mathbb E[X])$. En general,
$$
g(\mathbb E[X])\neq \mathbb E[g(X)].
$$
Por ejemplo, en general
$$
\mathbb E[X^2]\neq (\mathbb E[X])^2,
$$
y de hecho
$$
\operatorname{Var}(X)=\mathbb E[X^2]-(\mathbb E[X])^2.
$$

Para calcular $\mathbb E[g(X)]$ se usa la distribución de $X$:
- Caso discreto:
  $$
  \mathbb E[g(X)]=\sum_k g(x_k)\mathbb P(X=x_k).
  $$
- Caso continuo:
  $$
  \mathbb E[g(X)]=\int_{-\infty}^{\infty}g(x)f_X(x)\,dx.
  $$

## 1.8. Monotonía

Si $X\le Y$ siempre, entonces
$$
\mathbb E[X]\le \mathbb E[Y].
$$
En particular, si $X\ge 0$, entonces
$$
\mathbb E[X]\ge 0.
$$

## 1.9. Desigualdad básica del valor absoluto

$$
|\mathbb E[X]|\le \mathbb E[|X|].
$$

## 1.10. Esperanza y transformaciones afines

Si
$$
Y=aX+b,
$$
entonces
$$
\mathbb E[Y]=a\mathbb E[X]+b.
$$
Esto es la linealidad aplicada a una transformación afín.

---

# 2. Propiedades de la varianza

La varianza mide la dispersión alrededor de la media:
$$
\operatorname{Var}(X)=\mathbb E[(X-\mathbb E[X])^2].
$$
También se usa mucho la fórmula equivalente
$$
\boxed{\operatorname{Var}(X)=\mathbb E[X^2]-(\mathbb E[X])^2.}
$$

## 2.1. La varianza es no negativa

$$
\operatorname{Var}(X)\ge 0.
$$
Además,
$$
\operatorname{Var}(X)=0
$$
si y solo si $X$ es constante casi seguro, es decir, $X=c$ con probabilidad 1.

## 2.2. Varianza de una constante

Si $c\in\mathbb R$,
$$
\operatorname{Var}(c)=0.
$$
Una constante no tiene dispersión.

## 2.3. Sumar una constante no cambia la varianza

$$
\operatorname{Var}(X+c)=\operatorname{Var}(X).
$$
Desplazar toda la distribución no altera su dispersión.

## 2.4. Multiplicar por una constante

Si $a\in\mathbb R$,
$$
\operatorname{Var}(aX)=a^2\operatorname{Var}(X).
$$
Y si además sumamos una constante,
$$
\operatorname{Var}(aX+b)=a^2\operatorname{Var}(X).
$$
Fíjate en que aparece $a^2$, no $a$. Esto se debe a que la varianza está en unidades al cuadrado.

## 2.5. La desviación típica escala de forma lineal

Si
$$
\sigma_X=\sqrt{\operatorname{Var}(X)},
$$
entonces
$$
\sigma_{aX+b}=|a|\sigma_X.
$$
La desviación típica sí escala de forma lineal, pero con valor absoluto.

## 2.6. Fórmula de la varianza

$$
\operatorname{Var}(X)=\mathbb E[X^2]-(\mathbb E[X])^2.
$$
Equivalentemente,
$$
\mathbb E[X^2]=\operatorname{Var}(X)+(\mathbb E[X])^2.
$$
Esta fórmula es una de las más usadas en la práctica.

## 2.7. Varianza de una suma: aparece la covarianza

En general,

$$
\operatorname{Var}(X+Y)
=
\operatorname{Var}(X)+\operatorname{Var}(Y)+2\operatorname{Cov}(X,Y).
$$
Por tanto, **la varianza no es lineal**:
$$
\operatorname{Var}(X+Y)\neq \operatorname{Var}(X)+\operatorname{Var}(Y)
$$
salvo que $\operatorname{Cov}(X,Y)=0$.

También,

$$
\operatorname{Var}(X-Y)
=
\operatorname{Var}(X)+\operatorname{Var}(Y)-2\operatorname{Cov}(X,Y).
$$

## 2.8. Varianza de una combinación lineal

Para constantes $a,b\in\mathbb R$,

$$
\operatorname{Var}(aX+bY)
=
a^2\operatorname{Var}(X)+b^2\operatorname{Var}(Y)+2ab\operatorname{Cov}(X,Y).
$$

En general, para $X_1,\dots,X_n$ y constantes $a_1,\dots,a_n$,

$$
\operatorname{Var}\left(\sum_{i=1}^n a_iX_i\right)
=
\sum_{i=1}^n a_i^2\operatorname{Var}(X_i)
+
2\sum_{1\le i<j\le n}a_ia_j\operatorname{Cov}(X_i,X_j).
$$

## 2.9. Si las variables son independientes

Si $X$ e $Y$ son independientes, entonces

$$
\operatorname{Cov}(X,Y)=0.
$$

Por tanto,

$$
\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y),
$$

y también

$$
\operatorname{Var}(X-Y)=\operatorname{Var}(X)+\operatorname{Var}(Y).
$$

Más generalmente, si $X_1,\dots,X_n$ son independientes,

$$
\operatorname{Var}\left(\sum_{i=1}^n a_iX_i\right)
=
\sum_{i=1}^n a_i^2\operatorname{Var}(X_i).
$$

**Matiz importante:** independencia implica covarianza cero, pero covarianza cero no implica independencia en general. Sin embargo, si $(X,Y)$ es normal bivariada, entonces
$$
\operatorname{Cov}(X,Y)=0
\iff X\text{ e }Y\text{ son independientes}.
$$
Eso es una propiedad especial de la normal bivariada.

## 2.10. Varianza y estandarización

Si $X$ tiene media $\mu_X$ y desviación típica $\sigma_X>0$, entonces
$$
Z=\frac{X-\mu_X}{\sigma_X}
$$
tiene media $0$ y varianza $1$:
$$
\mathbb E[Z]=0,
\qquad
\operatorname{Var}(Z)=1.
$$
Es decir, $Z$ es la versión estandarizada de $X$.

Recíprocamente, si $Z$ tiene media $0$ y varianza $1$, entonces
$$
X=\mu_X+\sigma_X Z
$$
tiene media $\mu_X$ y varianza $\sigma_X^2$.

---

# 3. Propiedades básicas de la covarianza

Como la varianza de una suma involucra la covarianza, conviene recordar las principales propiedades de
$$
\operatorname{Cov}(X,Y)=\mathbb E[(X-\mathbb E[X])(Y-\mathbb E[Y])].
$$

## 3.1. Fórmula alternativa

$$
\operatorname{Cov}(X,Y)=\mathbb E[XY]-\mathbb E[X]\mathbb E[Y].
$$

## 3.2. Covarianza consigo misma

$$
\operatorname{Cov}(X,X)=\operatorname{Var}(X).
$$

## 3.3. Simetría

$$
\operatorname{Cov}(X,Y)=\operatorname{Cov}(Y,X).
$$

## 3.4. Bilinealidad

Para constantes $a,b,c,d\in\mathbb R$,

$$
\operatorname{Cov}(aX+b,cY+d)=ac\,\operatorname{Cov}(X,Y).
$$

Y

$$
\operatorname{Cov}(X+Y,Z)
=
\operatorname{Cov}(X,Z)+\operatorname{Cov}(Y,Z).
$$

## 3.5. Independencia implica covarianza cero

Si $X$ e $Y$ son independientes, entonces
$$
\operatorname{Cov}(X,Y)=0.
$$
El recíproco no es cierto en general, salvo en casos especiales como la normal bivariada.

## 3.6. Correlación

La correlación es

$$
\operatorname{Corr}(X,Y)
=
\frac{\operatorname{Cov}(X,Y)}
{\sqrt{\operatorname{Var}(X)\operatorname{Var}(Y)}}.
$$
Siempre que las varianzas sean positivas, se cumple
$$
-1\le \operatorname{Corr}(X,Y)\le 1.
$$

---

# 4. Resumen rápido

## Esperanza

$$
\mathbb E[c]=c,
$$
$$
\mathbb E[cX]=c\mathbb E[X],
$$
$$
\mathbb E[X+c]=\mathbb E[X]+c,
$$
$$
\mathbb E[aX+bY]=a\mathbb E[X]+b\mathbb E[Y],
$$
$$
\mathbb E\left[\sum_i a_iX_i\right]=\sum_i a_i\mathbb E[X_i].
$$

La linealidad de la esperanza es **siempre** válida.

$$
\mathbb E[XY]=\mathbb E[X]\mathbb E[Y]
$$
solo si $X$ e $Y$ son independientes, o más generalmente si $\operatorname{Cov}(X,Y)=0$.

## Varianza

$$
\operatorname{Var}(X)\ge 0,
$$
$$
\operatorname{Var}(c)=0,
$$
$$
\operatorname{Var}(X+c)=\operatorname{Var}(X),
$$
$$
\operatorname{Var}(aX+b)=a^2\operatorname{Var}(X),
$$
$$
\operatorname{Var}(X)=\mathbb E[X^2]-(\mathbb E[X])^2,
$$
$$
\operatorname{Var}(X+Y)
=
\operatorname{Var}(X)+\operatorname{Var}(Y)+2\operatorname{Cov}(X,Y).
$$

Si $X$ e $Y$ son independientes,
$$
\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y).
$$

La idea clave es:

- **La esperanza es lineal.**
- **La varianza no es lineal**: al multiplicar por $a$, aparece $a^2$; al sumar, aparece la covarianza.
- **La independencia simplifica mucho**: permite factorizar esperanzas de productos y sumar varianzas sin términos cruzados.