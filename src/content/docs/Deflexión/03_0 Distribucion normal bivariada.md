> Obtención de la eclipse de la distribución normal bivariada entre escala 's' y deflexión 'L', y su coeficiente de correlación dentro del módulo `./mee2024/eclipse_analysis.py`


En `eclipse_analysis.py` la elipse no se obtiene directamente de una nube de puntos de estrellas. Se obtiene de la matriz de covarianza de los dos parámetros ajustados:

- `L`: constante de deflexión gravitatoria.
- `s`: escala de placa, llamada `platescale` en el código.

La matriz final tiene esta forma:

$$
\Sigma =
\begin{pmatrix}
\sigma_L^2 & \operatorname{cov}(L,s) \\
\operatorname{cov}(L,s) & \sigma_s^2
\end{pmatrix}
$$

donde:

- `Σ[0,0]` es la varianza de `L`.
- `Σ[1,1]` es la varianza de `s`.
- `Σ[0,1]` y `Σ[1,0]` son la covarianza entre ambos parámetros.

## 1. Distancia radial de cada estrella

El programa lee del archivo comprimido:

- Posiciones observadas.
- Posiciones del catálogo.
- Fecha y lugar de observación.
- Escala de placa inicial.
- Incertidumbre relativa de la escala de placa.

Después convierte las coordenadas de las estrellas a vectores unitarios celestes.

La distancia angular de cada estrella al centro del eclipse se calcula en: `radial_distances_catalog`

```python
radial_distances_catalog = (
    np.arcsin(np.linalg.norm(stars_cata_v - reference_v, axis=1) / 2) * 2
)
```

Después se convierte a radios solares:

```python
rad_dist = (
    np.degrees(radial_distances_catalog)
    / sun_apparent_angular_radius
)
```

Por tanto, `rad_dist` es la distancia angular de la estrella expresada en radios solares:

$$
r_i =
\frac{\theta_i}{\theta_{\odot}}
$$

## 2. Modelo de deflexión

El modelo físico utilizado inicialmente es:

$$
d(r) = \frac{L}{r}
$$

donde:

- `d(r)` es la deflexión angular en segundos de arco.
- `r` es la distancia radial en radios solares.
- `L` es la deflexión extrapolada al radio solar.

La función está definida en: `error_function1`

```python
deflection = np.radians(deflection_const / rad_dist / 3600)
```

El valor `deflection_const` es precisamente `L`.

El programa compara las posiciones observadas con las posiciones catalogadas corregidas por una deflexión radial y por una rotación global. La rotación global permite absorber la orientación relativa entre la fotografía y el catálogo.

Después optimiza `L` mediante:

```python
result1 = scipy.optimize.minimize(
    error_function1,
    0,
    method="Nelder-Mead",
)
```

El resultado:

```python
result1.x[0]
```

es la estimación inicial de `L`.

## 3. Deflexión observada usada en la regresión

Una vez encontrada la rotación óptima, el programa calcula las distancias radiales observadas: `radial_distances_obs`

```python
radial_distances_obs = (
    np.arcsin(np.linalg.norm(obs_rot - reference_v, axis=1) / 2) * 2
)
```

La diferencia entre la distancia observada y la catalogada se transforma a segundos de arco:

```python
deflection_obs = (
    np.degrees(radial_distances_obs - radial_distances_catalog)
    * 3600
)
```

Así se obtiene un valor de deflexión para cada estrella:

$$
d_i =
\left(
\theta_{i,\mathrm{obs}}
-
\theta_{i,\mathrm{cat}}
\right)
\cdot 3600
$$

La escala inicial se obtiene del archivo de resultados:

```python
platescale0 = data["platescale (arcseconds/pixel)"]
```

Ese valor corresponde al `s` inicial.

## 4. Método 1: escala de placa fija
En `analysis_mode_1`:

se ajusta solamente `L` mediante mínimos cuadrados ordinarios:

```python
x = np.c_[1 / rad_dist.reshape(-1, 1)]
model = sm.OLS(deflection_obs, x)
results = model.fit()
```

El modelo matemático es:

$$
d_i = L \frac{1}{r_i} + \epsilon_i
$$

No hay término independiente. La recta pasa por el origen en el espacio transformado `1/r`.

La estimación de `L` es:

```python
mu = results.params
```

y la varianza estadística inicial de `L` procede de:

```python
cov = results.cov_params()
```

En este punto `cov` es solamente una matriz `1×1`, porque el ajuste estadístico solo tiene un parámetro libre: `L`.

## 5. Incorporación de la incertidumbre de escala

El método 1 considera que la escala de placa no se ajusta con los datos, pero sí tiene una incertidumbre externa:

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

convierte una variación de escala de placa en una variación equivalente de deflexión. Conceptualmente representa cuántos píxeles corresponden aproximadamente a un radio solar.

El programa calcula:

```python
plate_covariance2 = (
    np.dot(1 / rad_dist, rad_dist)
    / np.dot(1 / rad_dist, 1 / rad_dist)
    * platescale_relative_uncertainty
    * factor
)
```

Matemáticamente:

$$
C_{Ls}^{(\mathrm{equiv})}
=
\frac{\sum_i (1/r_i)r_i}
{\sum_i (1/r_i)^2}
\,
u_s
\,
F
$$

donde:

- `u_s` es la incertidumbre relativa de la escala.
- `F` es el factor de conversión.
- El resultado expresa el efecto de la incertidumbre de escala como incertidumbre equivalente sobre `L`.

Después crea explícitamente una matriz de covarianza `2×2`:

```python
cov2 = np.zeros((2, 2), dtype=np.float64)
cov2[0, 0] = cov[0, 0] + plate_covariance2**2
cov2[1, 1] = (
    platescale_relative_uncertainty * platescale0
) ** 2
cov2[1, 0] = (
    -plate_covariance2
    * platescale_relative_uncertainty
    * platescale0
)
cov2[0, 1] = cov2[1, 0]
```

Por tanto:

$$
\sigma_L^2 =
\sigma_{L,\mathrm{reg}}^2
+
\sigma_{L,\mathrm{escala}}^2
$$

$$
\sigma_s =
u_s s_0
$$

y la covarianza se fuerza a ser negativa:

$$
\operatorname{cov}(L,s)
=
-
C_{Ls}^{(\mathrm{equiv})}
\sigma_s
$$

El vector medio final es:

```python
mu2 = [mu[0], platescale0]
```

Es decir:

$$
\mu_1 =
\begin{pmatrix}
L \\
s_0
\end{pmatrix}
$$

El método 1 devuelve:

```python
return mu2, cov2, rms
```

## 6. Método 2: escala de placa libre

El método 2 permite que la escala de placa sea estimada por los propios datos: `analysis_mode_2`


```python
x = np.c_[
    1 / rad_dist.reshape(-1, 1),
    rad_dist.reshape(-1, 1),
]
model = sm.OLS(deflection_obs, x)
results = model.fit()
```

El modelo es:

$$
d_i =
\frac{A}{r_i}
+
B r_i
+
\epsilon_i
$$

Aquí hay dos parámetros de regresión:

- `A`: término de deflexión, que se convierte en `L`.
- `B`: término proporcional a la distancia radial, utilizado para corregir la escala de placa.

Inicialmente:

```python
mu = results.params
cov = results.cov_params()
```

contiene:

$$
\mu =
\begin{pmatrix}
A \\
B
\end{pmatrix}
$$

y su matriz de covarianza estadística es:

$$
\Sigma_{A,B}
$$

El segundo parámetro `B` todavía no está expresado en unidades de escala de placa. Por eso se transforma:

```python
mu[1] /= factor
cov[:, 1] /= factor
cov[1, :] /= factor
```

Esto aplica la transformación:

$$
s_{\mathrm{corrección}} =
\frac{B}{F}
$$

y sobre la covarianza:

$$
\operatorname{cov}(A,s)
=
\frac{\operatorname{cov}(A,B)}{F}
$$

$$
\operatorname{var}(s)
=
\frac{\operatorname{var}(B)}{F^2}
$$

Después se añade la escala inicial:

```python
mu[1] += platescale0
```

Por tanto, el vector final del método 2 es:

$$
\mu_2 =
\begin{pmatrix}
L \\
s_0 + B/F
\end{pmatrix}
$$

La matriz `cov` ya queda convertida a la matriz de covarianza de:

$$
(L,s)
$$

Este método obtiene la correlación directamente de la covarianza de la regresión de dos parámetros.

## 7. Cálculo del coeficiente de correlación

El coeficiente de Pearson se calcula dentro de `confidence_ellipse`:
`'coeficiente Pearson`

```python
pearson = cov[0, 1] / np.sqrt(
    cov[0, 0] * cov[1, 1]
)
```

La fórmula es:

$$
\rho_{L,s}
=
\frac{\operatorname{cov}(L,s)}
{\sigma_L \sigma_s}
$$

con:

$$
\sigma_L = \sqrt{\Sigma_{00}}
$$

$$
\sigma_s = \sqrt{\Sigma_{11}}
$$

Por tanto:

- `ρ = 0`: no hay correlación lineal.
- `ρ < 0`: aumentar `L` tiende a compensarse con disminuir `s`.
- `ρ > 0`: ambos parámetros tienden a aumentar juntos.
- `|ρ|` cercano a `1`: fuerte degeneración entre los parámetros.

En el método 1, la covarianza se establece explícitamente con signo negativo, por lo que normalmente la elipse estará inclinada indicando que una escala de placa mayor produce una estimación menor de `L`, o viceversa.

## 8. Cómo se construye geométricamente la elipse

La función: confidence_ellipse
recibe:

```python
confidence_ellipse(cov, mu, ax, n_std=1)
```

El centro de la elipse es:

```python
mu
```

Por tanto:

- Coordenada horizontal: `mu[0] = L`.
- Coordenada vertical: `mu[1] = s`.

Primero calcula las desviaciones estándar:

```python
scale_x = np.sqrt(cov[0, 0]) * n_std
scale_y = np.sqrt(cov[1, 1]) * n_std
```

Después construye una elipse normalizada utilizando el coeficiente de correlación:

```python
ell_radius_x = np.sqrt(1 + pearson)
ell_radius_y = np.sqrt(1 - pearson)
```

La elipse se crea inicialmente centrada en el origen:

```python
ellipse = Ellipse(
    (0, 0),
    width=ell_radius_x * 2,
    height=ell_radius_y * 2,
)
```

Y finalmente se aplica una transformación:

```python
transf = (
    transforms.Affine2D()
    .rotate_deg(45)
    .scale(scale_x, scale_y)
    .translate(mean_x, mean_y)
)
```

La transformación hace tres cosas:

1. Gira la elipse según la correlación.
2. La escala de acuerdo con las incertidumbres de `L` y `s`.
3. La traslada al valor medio de los parámetros.

## 9. Elipses que dibuja el programa

La función `plot_confidence_ellipse`:

dibuja dos elipses por método:

```python
confidence_ellipse(cov, mu, ax_nstd, n_std=1)
confidence_ellipse(cov, mu, ax_nstd, n_std=2)
```

Por tanto, genera:

- Elipse `1σ`.
- Elipse `2σ`.

El gráfico se configura con:

```python
ax_nstd.set_xlabel("L (arcsec / solar radius)")
ax_nstd.set_ylabel("Plate Scale (arcsec / pixel)")
```

Finalmente, dependiendo de la configuración, se dibujan las elipses del método 1, del método 2 o de ambos:

```python
plot_confidence_ellipse(
    cov1,
    mu1,
    edgecolor="firebrick",
    labelx=" (method 1)",
)
```

```python
plot_confidence_ellipse(
    cov2,
    mu2,
    edgecolor="fuchsia",
    labelx=" (method 2)",
)
```

La imagen se guarda como:

```python
ECLIPSE_confidence_ellipse<timestamp>.png
```

## 10. Interpretación importante

El programa no calcula una normal bivariada directamente sobre los `N` centroides. Lo que hace es:

1. Ajustar un modelo físico de deflexión.
2. Obtener una estimación conjunta de `L` y `s`.
3. Obtener o construir la matriz de covarianza de esos parámetros.
4. Representar esa covarianza mediante una elipse.

Por eso la elipse representa la incertidumbre conjunta de los parámetros, no la distribución espacial de las estrellas.

También hay una precisión estadística importante: las etiquetas `1σ` y `2σ` se refieren al radio de Mahalanobis usado para escalar la elipse. En dos dimensiones no equivalen exactamente a coberturas conjuntas del 68,3 % y 95,4 %:

- Radio 1: cobertura aproximada del 39,3 %.
- Radio 2: cobertura aproximada del 86,5 %.

Para coberturas conjuntas aproximadas de una normal bivariada serían necesarios radios basados en la distribución chi-cuadrado:

- 68,3 %: `sqrt(2.30) ≈ 1.52`.
- 95 %: `sqrt(5.99) ≈ 2.45`.
- 99,7 %: `sqrt(11.83) ≈ 3.44`.

Por tanto, el código dibuja correctamente elipses de desviación estándar en el sentido habitual de parámetros, pero las etiquetas no deben interpretarse literalmente como intervalos conjuntos del 68 % y 95 %.
