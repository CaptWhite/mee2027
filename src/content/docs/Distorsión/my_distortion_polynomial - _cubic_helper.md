# Descripción Teórica y Matemática de la Rutina `_cubic_helper`

Este documento proporciona una descripción teórica y matemática detallada del funcionamiento de la subrutina `_cubic_helper` del módulo [my_distortion_polynomial.py](file:///c:/Users/captw/workspaces/MEE2027/MEE2024.v6/Source/mee2024/_working3/my_distortion_polynomial.py).

---

## Índice
- [Descripción Teórica y Matemática de la Rutina `_cubic_helper`](#descripción-teórica-y-matemática-de-la-rutina-_cubic_helper)
  - [Índice](#índice)
  - [1. Introducción y Propósito](#1-introducción-y-propósito)
  - [2. Cálculo de los Residuos en el Plano del Detector](#2-cálculo-de-los-residuos-en-el-plano-del-detector)
  - [3. Partición de la Base de Diseño (Libres vs. Fijos)](#3-partición-de-la-base-de-diseño-libres-vs-fijos)
  - [4. Sustracción de la Distorsión Fija (Correction Step)](#4-sustracción-de-la-distorsión-fija-correction-step)
  - [5. Ajuste por Mínimos Cuadrados Ordinarios (OLS)](#5-ajuste-por-mínimos-cuadrados-ordinarios-ols)
  - [6. Cálculo Robustecido de la Incertidumbre de Escala de Placa (HC0)](#6-cálculo-robustecido-de-la-incertidumbre-de-escala-de-placa-hc0)
  - [7. Bibliografía y Referencias de Soporte](#7-bibliografía-y-referencias-de-soporte)

---

## 1. Introducción y Propósito

La función interna `_cubic_helper` constituye el núcleo matemático donde se realiza la regresión por mínimos cuadrados de los coeficientes de distorsión geométrica. Es llamada iterativamente para:
1. Calcular los errores residuales en píxeles a partir de la detransformación WCS.
2. Restar la distorsión ya conocida proveniente de archivos de calibración previos (términos fijos).
3. Estimar mediante mínimos cuadrados ordinarios (OLS) los coeficientes geométricos restantes (términos libres).
4. Calcular la covarianza robusta frente a heterocedasticidad (HC0) para estimar la incertidumbre estándar del factor de escala.
5. Invocar el método de absorción para corregir el vector astrométrico global.

---

## 2. Cálculo de los Residuos en el Plano del Detector

Para un conjunto de $N$ estrellas con coordenadas celestes de catálogo dadas como vectores unitarios 3D $\mathbf{v}_{cata, i} \in \mathbb{R}^3$, se proyectan a la placa utilizando el vector de placa astrométrico actual $\mathbf{q} = (s, \alpha_0, \delta_0, \theta)^T$:

$$
\mathbf{x}_{detransformed, i} = \text{detransform\_vectors}(\mathbf{q}, \mathbf{v}_{cata, i}) \in \mathbb{R}^2
$$


Los errores brutos residuales en píxeles $\mathbf{e}_i = (e_{y, i}, e_{x, i})^T$ para cada estrella en el detector se evalúan mediante la diferencia vectorial con respecto a las posiciones observadas centradas $\mathbf{x}_{obs, i} = (y_{obs, i}, x_{obs, i})^T$:

$$
\mathbf{e}_i = \mathbf{x}_{detransformed, i} - \mathbf{x}_{obs, i}
$$


---

## 3. Partición de la Base de Diseño (Libres vs. Fijos)

El software permite realizar calibraciones parciales donde solo un subconjunto de coeficientes de distorsión de bajo orden está libre para ser estimado, mientras que los coeficientes de alto orden están congelados en valores de referencia precalibrados.

Sean:
- $d_{total}$ el grado máximo total del ajuste polinomial (`options['distortionOrder']`).
- $d_{free}$ el grado máximo de los coeficientes libres ajustables (`options['distortion_fixed_coefficients']`).
- $n_{free} = \frac{(d_{free}+2)(d_{free}+1)}{2} - 1$ el número de términos libres.
- $n_{total} = \frac{(d_{total}+2)(d_{total}+1)}{2} - 1$ el número de términos totales de la base.

La matriz de diseño general $\mathbf{B}$ de dimensión $N \times n_{total}$ construida a partir de las posiciones de píxeles observadas se particiona horizontalmente en dos submatrices:

$$
\mathbf{B} = \left[ \mathbf{B}_{free} \ \Big| \ \mathbf{B}_{fixed} \right]
$$

donde:
- $\mathbf{B}_{free}$ es la matriz de dimensión $N \times n_{free}$ que contiene las columnas de la base que se ajustarán libremente.
- $\mathbf{B}_{fixed}$ es la matriz de dimensión $N \times (n_{total} - n_{free})$ que contiene las columnas asociadas a los coeficientes fijos.

---

## 4. Sustracción de la Distorsión Fija (Correction Step)

Si se especifica un grado de calibración fija ($d_{free} < d_{total}$), se extraen del diccionario de calibración los coeficientes fijos de orden superior $\mathbf{c}_{x, fixed}$ y $\mathbf{c}_{y, fixed}$ de dimensión $(n_{total} - n_{free})$. 

La distorsión fija proyectada en píxeles para cada estrella se calcula mediante el producto tensorial `einsum` (multiplicando la submatriz $\mathbf{B}_{fixed}$ por los coeficientes fijos):

$$
\Delta x_{fixed, i} = \sum_{k=1}^{n_{total}-n_{free}} B_{fixed, i, k} \cdot c_{x, fixed, k}
$$

$$
\Delta y_{fixed, i} = \sum_{k=1}^{n_{total}-n_{free}} B_{fixed, i, k} \cdot c_{y, fixed, k}
$$

Estos valores se restan a los errores brutos para aislar la componente residual que será modelada por el ajuste de mínimos cuadrados libres:

$$
e'_{x, i} = e_{x, i} - \frac{\Delta x_{fixed, i}}{m}
$$

$$e'_{y, i} = e_{y, i} - \frac{\Delta y_{fixed, i}}{m}$$
donde $m$ es el multiplicador de escala astrométrica.

---

## 5. Ajuste por Mínimos Cuadrados Ordinarios (OLS)

La matriz de diseño para la regresión libre se construye agregando una columna de unos (que representa la constante o intercepto) a la submatriz de diseño libre $\mathbf{B}_{free}$:

$$
\mathbf{X} = \left[ \mathbf{1} \ \Big| \ \mathbf{B}_{free} \right] \in \mathbb{R}^{N \times (n_{free}+1)}
$$


El modelo de mínimos cuadrados ordinarios lineal para cada eje se formula como:

$$
\mathbf{e}'_{x} \cdot m = \mathbf{X} \mathbf{a} + \mathbf{\epsilon}_x
$$

$$
\mathbf{e}'_{y} \cdot m = \mathbf{X} \mathbf{b} + \mathbf{\epsilon}_y
$$
donde:
- $\mathbf{a} \in \mathbb{R}^{n_{free}+1}$ es el vector que contiene el intercepto constante de regresión en $X$ ($a_0$) y los $n_{free}$ coeficientes de distorsión libres en $X$.
- $\mathbf{b} \in \mathbb{R}^{n_{free}+1}$ es el vector que contiene el intercepto constante de regresión en $Y$ ($b_0$) y los $n_{free}$ coeficientes de distorsión libres en $Y$.

Las soluciones óptimas se obtienen resolviendo mediante la pseudoinversa:

$$
\mathbf{a} = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T (\mathbf{e}^*_x \cdot m)
$$

$$
\mathbf{b} = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T (\mathbf{e}^*_y \cdot m)
$$

---

## 6. Cálculo Robustecido de la Incertidumbre de Escala de Placa (HC0)

Dado que las estrellas brillantes tienen centroides medidos de manera mucho más precisa que las estrellas débiles, los residuos estelares sufren de varianza no constante (heterocedasticidad). Para evitar estimaciones sesgadas u optimistas de la incertidumbre de la escala de placa, se utiliza la varianza consistente con heterocedasticidad (HC0) de White.

La matriz de covarianza robusta de los coeficientes de regresión estimados se evalúa como:

$$
\text{Cov}(\mathbf{a}) = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \text{diag}(\hat{\epsilon}_{x, i}^2) \mathbf{X} (\mathbf{X}^T \mathbf{X})^{-1}
$$

$$
\text{Cov}(\mathbf{b}) = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \text{diag}(\hat{\epsilon}_{y, i}^2) \mathbf{X} (\mathbf{X}^T \mathbf{X})^{-1}
$$
donde $\hat{\epsilon}_{x, i}$ y $\hat{\epsilon}_{y, i}$ son los residuos finales del ajuste.

Sean:
- $\sigma_{a_x}$ el error estándar del parámetro lineal de $x/w$ en el ajuste de $X$ (correspondiente al valor robusto `ols_result_x.HC0_se[1]`).
- $\sigma_{b_y}$ el error estándar del parámetro lineal de $y/w$ en el ajuste de $Y$ (correspondiente a `ols_result_y.HC0_se[2]`).

La desviación estándar relativa combinada del factor de escala de placa se calcula como:

$$
\sigma_{scale} = \frac{\sqrt{\sigma_{a_x}^2 + \sigma_{b_y}^2}}{w}
$$

donde $w$ es el factor de escala de normalización espacial de la base.

---

## 7. Bibliografía y Referencias de Soporte

1. **White, H. (1980).** *A Heteroskedasticity-Consistent Covariance Matrix Estimator and a Direct Test for Heteroskedasticity*. Econometrica, 48(4), 817-838.
   - [DOI: 10.2307/1912934](https://doi.org/10.2307/1912934)
   - *Artículo clásico que introduce el estimador consistente con heterocedasticidad (HC0) empleado para calcular la varianza robusta de la escala de la placa.*

2. **Seber, G. A. F., & Lee, A. J. (2003).** *Linear Regression Analysis*. John Wiley & Sons.
   - *Referencia matemática exhaustiva sobre mínimos cuadrados ordinarios, matrices de diseño particionadas, inversión de matrices y estimación de parámetros libres y fijos.*

3. **Shupe, D. L., et al. (2005).** *The SIP Convention for Representing Distortion in FITS Image Headers*. ASP Conference Series, Vol. 347.
   - *Describe la aplicación física de los polinomios de distorsión geométrica en píxeles y sus correcciones algebraicas directas.*
