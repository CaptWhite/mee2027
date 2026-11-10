## 1. Objetivo físico del módulo

El módulo [eclipse_analysis.py](<C:/Users/captw/workspaces/MEE2027/MEE%20v1.3.9/MEE2024/mee2024/eclipse_analysis.py>) intenta medir la desviación gravitatoria de la luz producida por el Sol durante un eclipse.

Los dos parámetros principales son:

- `L`: constante de deflexión gravitatoria.
- `s`: escala de placa, llamada `platescale` en el código.

La escala de placa indica cuántos segundos de arco representa cada píxel:

$$
s =
\frac{\text{segundos de arco}}{\text{píxel}}
$$

La deflexión se modela aproximadamente como:

$$
d(r) = \frac{L}{r}
$$

donde:

- $d(r)$ es la deflexión angular de una estrella.
- $r$ es su distancia al centro del Sol expresada en radios solares.
- $L$ es la deflexión extrapolada al borde solar, es decir, para $r=1$.

Si $L=1{,}75$ segundos de arco, una estrella a dos radios solares tendría aproximadamente:

$$
d(2)=\frac{1{,}75}{2}=0{,}875\ \text{arcsec}
$$

---

## 2. Lectura y preparación de los datos

La función principal es:

[eclipse_analysis](<C:/Users/captw/workspaces/MEE2027/MEE%20v1.3.9/MEE2024/mee2024/eclipse_analysis.py:86>)

Recibe:

```python
eclipse_analysis(path_data, options)
```

`path_data` es un archivo comprimido que contiene, entre otros:

- `distortion_results.txt`
- `CATALOGUE_MATCHED_ERRORS.csv`

Del fichero CSV se leen:

- Coordenadas observadas: `RA(obs)`, `DEC(obs)`.
- Coordenadas del catálogo: `RA(catalog)`, `DEC(catalog)`.
- Magnitud de las estrellas.
- Información sobre estrellas dobles.

El módulo filtra las estrellas según:

```python
df = df.loc[df["magV"] <= options["eclipse_limiting_mag"]]
```

También puede eliminar estrellas dobles:

```python
if options["remove_double_stars_eclipse"]:
    df = df.loc[~df["flag_is_double"]]
```

Esto es importante porque una estrella doble puede producir un centroide desplazado o una posición ambigua.

---

## 3. Posición del Sol, la Luna y el centro del campo

El programa utiliza `Astropy` para calcular las posiciones aparentes del Sol y la Luna en la fecha, hora y lugar de observación.

Construye:

```python
observing_location = EarthLocation(...)
observing_time = Time(...)
sun = get_body("sun", observing_time, observing_location)
moon = get_body("moon", observing_time, observing_location)
```

La posición de referencia puede ser:

```python
reference_v = moon_v if options["object_centre_moon"] else sun_v
```

Por tanto, el centro del sistema puede ser:

- El Sol.
- La Luna.

Normalmente, para medir la deflexión gravitatoria, el centro físico relevante es el Sol, pero durante un eclipse la Luna puede resultar útil como referencia geométrica de la posición del eclipse.

El radio angular aparente del Sol se calcula aproximadamente mediante:

$$
\theta_\odot \simeq \frac{R_\odot}{D_\odot}
$$

donde:

- $R_\odot$ es el radio solar.
- $D_\odot$ es la distancia Tierra-Sol.

El código lo convierte a grados:

```python
sun_apparent_angular_radius = np.degrees(
    (astropy.constants.R_sun / sun.distance)
    .to(u.dimensionless_unscaled)
    .value
)
```

Para ángulos pequeños se utiliza la aproximación:

$$
\theta \simeq \frac{R}{D}
$$

con $\theta$ expresado en radianes.

---

## 4. Conversión de ascensión recta y declinación a vectores

Las estrellas vienen descritas mediante:

- Ascensión recta: $\alpha$.
- Declinación: $\delta$.

El módulo transforma cada posición celeste en un vector unitario tridimensional:

[as_unit_vector](<C:/Users/captw/workspaces/MEE2027/MEE%20v1.3.9/MEE2024/mee2024/eclipse_analysis.py:83>)

$$
\mathbf{u}
=
\begin{pmatrix}
\cos\delta\cos\alpha \\
\cos\delta\sin\alpha \\
\sin\delta
\end{pmatrix}
$$

El código es:

```python
return np.array([
    np.cos(dec) * np.cos(ra),
    np.cos(dec) * np.sin(ra),
    np.sin(dec)
]).T
```

Esto permite trabajar con geometría vectorial sobre la esfera celeste en lugar de restar directamente ángulos de ascensión recta y declinación.

Se crean cuatro tipos de vectores:

```python
stars_obs_v
stars_cata_v
sun_v
moon_v
```

donde:

- `stars_obs_v`: posiciones observadas en la fotografía.
- `stars_cata_v`: posiciones esperadas según el catálogo.
- `sun_v`: dirección del Sol.
- `moon_v`: dirección de la Luna.

---

## 5. Distancia angular al centro del eclipse

El módulo calcula la diferencia entre el vector de cada estrella y el vector del centro:

```python
delta_vectors = stars_cata_v - reference_v
```

Para dos vectores unitarios $\mathbf{u}$ y $\mathbf{v}$, la distancia euclídea entre ellos es:

$$
\|\mathbf{u}-\mathbf{v}\|
=
2\sin\left(\frac{\theta}{2}\right)
$$

Despejando el ángulo:

$$
\theta =
2\arcsin\left(
\frac{\|\mathbf{u}-\mathbf{v}\|}{2}
\right)
$$

Esto aparece en:

```python
radial_distances_catalog = (
    np.arcsin(
        np.linalg.norm(stars_cata_v - reference_v, axis=1) / 2
    ) * 2
)
```

Después se convierte a grados y se divide por el radio angular del Sol:

```python
rad_dist = (
    np.degrees(radial_distances_catalog)
    / sun_apparent_angular_radius
)
```

Así se obtiene:

$$
r_i =
\frac{\theta_i}{\theta_\odot}
$$

Por ejemplo:

- $r=1$: estrella situada a un radio solar del centro.
- $r=2$: estrella situada a dos radios solares.
- $r=5$: estrella situada a cinco radios solares.

`rad_dist` es, por tanto, una distancia adimensional en radios solares.

---

## 6. Dirección radial de la deflexión

La deflexión gravitatoria apunta aproximadamente radialmente hacia fuera del Sol.

El código obtiene la dirección radial mediante:

```python
delta_vectors_unit = (
    delta_vectors
    / np.linalg.norm(delta_vectors, axis=1).reshape(
        delta_vectors.shape[0],
        1,
    )
)
```

Matemáticamente:

$$
\widehat{\mathbf{e}}_i =
\frac{\mathbf{u}_{i,\mathrm{cat}}-\mathbf{u}_{\mathrm{centro}}}
{\left\|
\mathbf{u}_{i,\mathrm{cat}}-\mathbf{u}_{\mathrm{centro}}
\right\|}
$$

Después desplaza la posición catalogada en esa dirección:

```python
cata_vectors_corrected = (
    stars_cata_v
    + deflection.reshape(delta_vectors.shape[0], 1)
    * delta_vectors_unit
)
```

Como la deflexión es muy pequeña, esta suma vectorial es una aproximación lineal.

Después normaliza otra vez:

```python
cata_vectors_corrected = (
    cata_vectors_corrected
    / np.linalg.norm(
        cata_vectors_corrected,
        axis=1,
    ).reshape(
        cata_vectors_corrected.shape[0],
        1,
    )
)
```

La normalización es necesaria porque la suma de dos vectores ya no tiene exactamente módulo uno.

### Aproximación utilizada

La operación:

$$
\mathbf{u}_{\mathrm{corregida}}
=
\mathbf{u}_{\mathrm{cat}}
+
\delta\widehat{\mathbf{e}}
$$

no es una rotación exacta sobre la esfera. Es una aproximación válida cuando:

$$
\delta \ll 1
$$

en radianes, que es precisamente el caso de la deflexión de la luz, de alrededor de unos pocos segundos de arco.

---

## 7. Ajuste de la rotación entre catálogo y fotografía

La fotografía y el catálogo pueden tener una orientación relativa distinta debido a:

- Rotación de la cámara.
- Orientación del telescopio.
- Errores de alineamiento.
- Diferencias en los sistemas de coordenadas.

El módulo obtiene una matriz de rotación mediante:

```python
rot = _find_rotation_matrix(
    stars_obs_v,
    cata_vectors_corrected,
)
```

Esta función pertenece a:

```python
mee2024.refraction_correction
```

Conceptualmente, busca una matriz $R$ que minimice:

$$
\sum_i
\left\|
R\mathbf{u}_{i,\mathrm{obs}}
-
\mathbf{u}_{i,\mathrm{cat,corr}}
\right\|^2
$$

La rotación se aplica mediante:

```python
corrected = (rot.T @ stars_obs_v.T).T
```

El objetivo es poner las observaciones y el catálogo corregido en la misma orientación.

---

## 8. Función de error física

La primera función de error está en:

[error_function1](<C:/Users/captw/workspaces/MEE2027/MEE%20v1.3.9/MEE2024/mee2024/eclipse_analysis.py:196>)

Implementa:

$$
d(r)=\frac{L}{r}
$$

El valor de `L` se recibe como `deflection_const`.

El código convierte segundos de arco a radianes:

```python
deflection = np.radians(
    deflection_const / rad_dist / 3600
)
```

La conversión es:

$$
\delta_{\mathrm{rad}}
=
\frac{\delta_{\mathrm{arcsec}}}{3600}
\frac{\pi}{180}
$$

Después se corrigen las posiciones catalogadas, se calcula la rotación y se devuelve un RMS:

```python
rms = np.degrees(
    np.sqrt(
        np.linalg.norm(corrected - cata_vectors_corrected) ** 2
        / stars_cata_v.shape[0]
    )
) * 3600
```

En forma matemática:

$$
\mathrm{RMS}
=
3600
\sqrt{
\frac{
\sum_i
\left\|
\mathbf{u}_{i,\mathrm{obs}}
-
\mathbf{u}_{i,\mathrm{modelo}}
\right\|^2
}{N}
}
$$

El módulo de NumPy utilizado aquí es la norma de Frobenius de toda la matriz. Para pequeñas separaciones angulares, la diferencia entre vectores unitarios es aproximadamente igual al ángulo en radianes:

$$
\|\mathbf{u}_1-\mathbf{u}_2\|
\simeq \Delta\theta
$$

Por eso el RMS vectorial puede interpretarse aproximadamente como un RMS angular.

---

## 9. Optimización de $L$

El módulo minimiza la función anterior usando Nelder-Mead:

```python
result1 = scipy.optimize.minimize(
    error_function1,
    0,
    method="Nelder-Mead",
)
```

El algoritmo busca el valor de $L$ que produce el menor RMS.

El resultado principal es:

```python
result1.x[0]
```

La comparación con el valor aceptado de 1,751 segundos de arco aparece aquí:

```python
difference vs. accepted value:
100 * (result1.x[0] - 1.751) / 1.751
```

El módulo también define otros dos modelos físicos:

### Modelo de potencia

[error_function2](<C:/Users/captw/workspaces/MEE2027/MEE%20v1.3.9/MEE2024/mee2024/eclipse_analysis.py:209>)

$$
d(r)=\frac{A}{r^B}
$$

Aquí:

- $A$ es una amplitud.
- $B$ es el exponente.

Para la relatividad general ideal se esperaría aproximadamente:

$$
B \simeq 1
$$

### Modelo con término creciente

[error_function3](<C:/Users/captw/workspaces/MEE2027/MEE%20v1.3.9/MEE2024/mee2024/eclipse_analysis.py:222>)

$$
d(r)=\frac{A}{r}+Br
$$

El término $Br$ puede representar una tendencia sistemática que crece con la distancia radial, por ejemplo un efecto de escala de placa incorrecta.

Estos tres resultados se imprimen, pero la elipse final de incertidumbres no se construye directamente a partir de `result2` o `result3`.

---

## 10. Cálculo de la deflexión observada

Una vez obtenido el mejor valor de $L$, el programa vuelve a calcular la rotación óptima:

```python
rms, rot = error_function1(
    result1.x[0],
    return_rotation=True,
)
```

Después rota las posiciones observadas:

```python
obs_rot = (rot.T @ stars_obs_v.T).T
```

Calcula la distancia radial observada:

```python
radial_distances_obs = (
    np.arcsin(
        np.linalg.norm(obs_rot - reference_v, axis=1) / 2
    ) * 2
)
```

Y obtiene la deflexión observada de cada estrella:

```python
deflection_obs = (
    np.degrees(
        radial_distances_obs
        - radial_distances_catalog
    )
    * 3600
)
```

Es decir:

$$
d_i =
\left(
\theta_{i,\mathrm{obs}}
-
\theta_{i,\mathrm{cat}}
\right)
\cdot 3600
$$

Estos valores son los que se utilizan posteriormente en los ajustes lineales de `L` y escala de placa.

---

# 11. Método 1: escala de placa fijada

La primera forma de obtener la covarianza de $L$ y $s$ está en:

[analysis_mode_1](<C:/Users/captw/workspaces/MEE2027/MEE%20v1.3.9/MEE2024/mee2024/eclipse_analysis.py:307>)

Se ajusta el modelo:

$$
d_i =
L\frac{1}{r_i}
+
\epsilon_i
$$

El código es:

```python
x = np.c_[1 / rad_dist.reshape(-1, 1)]
model = sm.OLS(deflection_obs, x)
results = model.fit()
```

Es una regresión lineal sin término independiente.

El estimador obtenido es:

```python
mu = results.params
```

y su varianza inicial:

```python
cov = results.cov_params()
```

Como solo se ajusta `L`, la covarianza inicial es `1×1`.

## Incertidumbre de la escala

La escala inicial procede del archivo:

```python
platescale0 = data["platescale (arcseconds/pixel)"]
```

La incertidumbre relativa procede de:

```python
data["platescale_relative_uncertainty"]
```

El factor:

```python
factor = (
    3600
    / platescale0
    * sun_apparent_angular_radius
)
```

tiene aproximadamente unidades de píxeles por radio solar:

$$
F =
\frac{
3600\ \mathrm{arcsec/degree}
\cdot
\theta_\odot\ \mathrm{degree}
}{
s\ \mathrm{arcsec/pixel}
}
$$

Por tanto:

$$
F
\sim
\frac{\mathrm{pixel}}{R_\odot}
$$

El módulo estima cuánto error equivalente en $L$ produce la incertidumbre de escala:

```python
plate_covariance2 = (
    np.dot(1 / rad_dist, rad_dist)
    / np.dot(1 / rad_dist, 1 / rad_dist)
    * platescale_relative_uncertainty
    * factor
)
```

Después construye:

```python
cov2[0, 0] = cov[0, 0] + plate_covariance2**2
cov2[1, 1] = (
    platescale_relative_uncertainty * platescale0
) ** 2
cov2[0, 1] = (
    -plate_covariance2
    * platescale_relative_uncertainty
    * platescale0
)
cov2[1, 0] = cov2[0, 1]
```

La matriz representa:

$$
\Sigma_1 =
\begin{pmatrix}
\sigma_L^2 & \operatorname{cov}(L,s) \\
\operatorname{cov}(L,s) & \sigma_s^2
\end{pmatrix}
$$

El vector medio es:

```python
mu2 = [mu[0], platescale0]
```

Por tanto:

$$
\boldsymbol{\mu}_1 =
\begin{pmatrix}
L \\
s_0
\end{pmatrix}
$$

### Interpretación del signo negativo

La covarianza se fija negativa:

$$
\operatorname{cov}(L,s)<0
$$

Esto representa una compensación física:

- Si la escala de placa aumenta, las posiciones expresadas angularmente cambian.
- El ajuste puede compensarlo estimando un valor diferente de $L$.
- Por tanto, ambos parámetros tienden a desplazarse en sentidos opuestos.

En este método la correlación no se obtiene directamente de una nube de medidas independientes. Se construye mediante propagación de incertidumbres y una hipótesis de anticorrelación.

---

# 12. Método 2: escala de placa libre

La segunda forma está en:

[analysis_mode_2](<C:/Users/captw/workspaces/MEE2027/MEE%20v1.3.9/MEE2024/mee2024/eclipse_analysis.py:335>)

Se ajusta:

$$
d_i =
\frac{A}{r_i}
+
B r_i
+
\epsilon_i
$$

El diseño de la regresión es:

```python
x = np.c_[
    1 / rad_dist.reshape(-1, 1),
    rad_dist.reshape(-1, 1),
]
```

La primera columna es:

$$
x_{i1}=\frac{1}{r_i}
$$

La segunda columna es:

$$
x_{i2}=r_i
$$

El resultado es:

```python
mu = results.params
cov = results.cov_params()
```

Inicialmente:

$$
\boldsymbol{\mu}
=
\begin{pmatrix}
A \\
B
\end{pmatrix}
$$

El parámetro $A$ se interpreta como la constante de deflexión $L$.

El término $B r$ representa un error que crece con la distancia. Una escala de placa incorrecta puede producir precisamente un desplazamiento proporcional a la distancia radial, por eso el término $B$ se utiliza para estimar la corrección de escala.

## Conversión de $B$ a escala de placa

El código transforma el segundo parámetro:

```python
mu[1] /= factor
```

Así:

$$
\Delta s =
\frac{B}{F}
$$

Después suma la escala inicial:

```python
mu[1] += platescale0
```

Por tanto:

$$
s =
s_0+\frac{B}{F}
$$

La matriz de covarianza se transforma de la misma manera:

```python
cov[:, 1] /= factor
cov[1, :] /= factor
```

Esto equivale a:

$$
\operatorname{cov}(L,s)
=
\frac{\operatorname{cov}(A,B)}{F}
$$

$$
\operatorname{var}(s)
=
\frac{\operatorname{var}(B)}{F^2}
$$

El desplazamiento $+s_0$ modifica la media, pero no modifica la covarianza.

---

# 13. Coeficiente de correlación

La función que dibuja la elipse es:

[confidence_ellipse](<C:/Users/captw/workspaces/MEE2027/MEE%20v1.3.9/MEE2024/mee2024/eclipse_analysis.py:29>)

El coeficiente de correlación de Pearson se calcula como:

```python
pearson = (
    cov[0, 1]
    / np.sqrt(cov[0, 0] * cov[1, 1])
)
```

Matemáticamente:

$$
\rho_{L,s}
=
\frac{\operatorname{cov}(L,s)}
{\sigma_L\sigma_s}
$$

donde:

$$
\sigma_L=\sqrt{\Sigma_{00}}
$$

$$
\sigma_s=\sqrt{\Sigma_{11}}
$$

Interpretación:

- $\rho=0$: los parámetros son linealmente independientes.
- $\rho<0$: cuando aumenta uno, el otro tiende a disminuir.
- $\rho>0$: ambos tienden a aumentar juntos.
- $|\rho|\simeq1$: existe una degeneración muy fuerte.

En el método 1, la correlación suele ser negativa porque el código introduce explícitamente una covarianza negativa.

En el método 2, la correlación procede de la regresión. Las funciones $1/r$ y $r$ no son perfectamente independientes, especialmente si el rango de distancias radiales es limitado. Esto produce una correlación estadística entre los coeficientes $A$ y $B$.

---

# 14. Construcción matemática de la elipse

Para una distribución normal bivariada:

$$
\mathbf{x}
=
\begin{pmatrix}
L\\s
\end{pmatrix}
$$

la densidad es:

$$
p(\mathbf{x})
=
\frac{1}{2\pi\sqrt{|\Sigma|}}
\exp\left[
-\frac12
(\mathbf{x}-\boldsymbol{\mu})^T
\Sigma^{-1}
(\mathbf{x}-\boldsymbol{\mu})
\right]
$$

Las curvas de densidad constante cumplen:

$$
(\mathbf{x}-\boldsymbol{\mu})^T
\Sigma^{-1}
(\mathbf{x}-\boldsymbol{\mu})
=
k^2
$$

Estas curvas son elipses.

La elipse tiene:

- Centro en $\boldsymbol{\mu}$.
- Orientación determinada por la covarianza.
- Anchura dependiente de $\sigma_L$.
- Altura dependiente de $\sigma_s$.
- Inclinación dependiente de $\rho$.

El módulo usa una fórmula especial para dos dimensiones:

```python
ell_radius_x = np.sqrt(1 + pearson)
ell_radius_y = np.sqrt(1 - pearson)
```

y después escala ambos radios por:

```python
scale_x = np.sqrt(cov[0, 0]) * n_std
scale_y = np.sqrt(cov[1, 1]) * n_std
```

Finalmente gira la elipse 45 grados y la traslada a la media:

```python
transf = (
    transforms.Affine2D()
    .rotate_deg(45)
    .scale(scale_x, scale_y)
    .translate(mean_x, mean_y)
)
```

La función `plot_confidence_ellipse` dibuja:

```python
confidence_ellipse(cov, mu, ax_nstd, n_std=1)
confidence_ellipse(cov, mu, ax_nstd, n_std=2)
```

Es decir:

- Una elipse de radio $1\sigma$.
- Una elipse de radio $2\sigma$.

La elipse de $3\sigma$ está comentada en el código.

---

# 15. Qué representa físicamente la figura

La figura tiene:

- Eje horizontal: $L$, en arcsec por radio solar.
- Eje vertical: $s$, en arcsec por píxel.
- Cruz: valores medios estimados.
- Elipse: incertidumbre conjunta de ambos parámetros.
- Color rojo: método 1.
- Color fucsia: método 2.

Una elipse muy alargada significa que existe una degeneración fuerte: hay muchas combinaciones de $L$ y $s$ que explican casi igual los datos.

Una elipse estrecha significa que los parámetros están mejor determinados.

Una elipse inclinada hacia abajo indica correlación negativa:

$$
L \uparrow
\quad\Longleftrightarrow\quad
s \downarrow
$$

Una elipse inclinada hacia arriba indica correlación positiva.

---

# 16. Precisión estadística importante

El código etiqueta las curvas como `1σ` y `2σ`, pero en dos dimensiones estas etiquetas no equivalen exactamente a una cobertura conjunta del 68 % y 95 %.

Para una normal bidimensional, una elipse de radio de Mahalanobis $k$ contiene aproximadamente:

$$
P = 1-e^{-k^2/2}
$$

Por tanto:

| Radio de la elipse | Cobertura conjunta aproximada |
|---:|---:|
| $1\sigma$ | 39,3 % |
| $2\sigma$ | 86,5 % |
| $2,45\sigma$ | 95 % |
| $3,44\sigma$ | 99,7 % |

Así que las elipses del código son elipses de desviación estándar en el sentido habitual, pero no son exactamente intervalos de confianza conjuntos del 68 % y 95 %.

---

## Resumen

El flujo completo es:

$$
\text{RA/DEC}
\rightarrow
\text{vectores unitarios}
\rightarrow
\text{distancias en radios solares}
\rightarrow
\text{modelo } L/r
\rightarrow
\text{rotación óptima}
\rightarrow
\text{deflexiones observadas}
\rightarrow
\text{regresión}
\rightarrow
(L,s,\Sigma)
\rightarrow
\text{elipse de covarianza}
$$

La idea central es que el módulo no dibuja una elipse de posiciones estelares, sino una elipse de incertidumbre en el espacio de parámetros:

$$
(L,\text{escala de placa})
$$

La correlación muestra hasta qué punto ambos parámetros se compensan mutuamente durante el ajuste.