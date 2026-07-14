## Modelo de regresión lineal sm.OLS (Ordinary Least Squares)

 **OLS** es un método de la librería de Python statsmodels utilizado para estimar los parámetros de una regresión lineal. Minimiza la suma de los residuos al cuadrado entre los valores observados y predichos. Proporciona estadísticas detalladas (coeficientes, p-valores, R²) para el análisis de modelos

La instrucción `sm.OLS(...)` corresponde a la librería **statsmodels** de Python (usualmente importada como `import statsmodels.api as sm`) y sirve matemáticamente para ajustar un modelo de **Regresión Lineal Múltiple** mediante el método de **Mínimos Cuadrados Ordinarios** (en inglés, *Ordinary Least Squares*, de ahí las siglas OLS).

En el contexto del código astronómico que estamos analizando, se suele utilizar para encontrar relaciones lineales adicionales, estimar factores de escala o ajustar coeficientes de distorsión óptica residuales en la imagen.

Aquí tienes la explicación matemática de lo que hace:

---

#### 1. El Modelo Matemático

Cuando ejecutas este comando, estás planteando que tu variable dependiente ($y$) se puede explicar como una combinación lineal de una o más variables independientes ($X$), más un término de error o ruido ($\epsilon$):

$$
y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_k x_k + \epsilon
$$

O expresado en forma de matrices para todos tus datos a la vez:


$$
\mathbf{y} = \mathbf{X}\boldsymbol{\beta} + \boldsymbol{\epsilon}
$$

Donde:

* $\mathbf{y}$ es el vector con los datos observados (por ejemplo, las posiciones reales de las estrellas).
* $\mathbf{X}$ es la **matriz de diseño** que contiene las variables predictoras (por ejemplo, las posiciones teóricas o coordenadas de los píxeles).
* $\boldsymbol{\beta}$ es el vector de **parámetros o coeficientes** ocultos que el algoritmo debe descubrir.
* $\boldsymbol{\epsilon}$ es el vector de residuos o errores aleatorios.

---

#### 2. El Criterio de Optimización (Mínimos Cuadrados)

El objetivo de `sm.OLS` es encontrar el valor óptimo de los coeficientes (llamémoslo $\hat{\boldsymbol{\beta}}$) que haga que las predicciones del modelo estén lo más cerca posible de los datos reales.

Para lograrlo, **minimiza la suma de los cuadrados de los residuos** (la distancia vertical entre los puntos reales y la línea/plano ajustado):

$$
S(\boldsymbol{\beta}) = \sum_{i=1}^{n} \epsilon_i^2 = \sum_{i=1}^{n} (y_i - \mathbf{x}_i^T \boldsymbol{\beta})^2
$$

---

#### 3. La Solución Analítica

A diferencia de los algoritmos de aprendizaje profundo que usan aproximaciones por descenso de gradiente, `sm.OLS` resuelve este problema de forma exacta mediante álgebra lineal pura utilizando la **Ecuación Normal**:

$$
\hat{\boldsymbol{\beta}} = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y}
$$

1. Multiplica la transpuesta de tus predictores por sí misma ($\mathbf{X}^T \mathbf{X}$) para obtener una matriz de covarianza.
2. Calcula su inversa $(\mathbf{X}^T \mathbf{X})^{-1}$.
3. Multiplica el resultado por la proyección de los datos ($\mathbf{X}^T \mathbf{y}$) para aislar y resolver los coeficientes $\hat{\boldsymbol{\beta}}$.

---

#### ¿Cómo se usa típicamente en Python?

La sintaxis estándar consta de dos pasos obligatorios:

```python
# 1. Se define el modelo pasando la variable dependiente (y) y las independientes (X)
modelo = sm.OLS(y, X)

# 2. Se ejecuta la matemática (la ecuación normal) para encontrar los coeficientes
resultados = modelo.fit()

```

> **Un detalle importante:** Por defecto, `sm.OLS` **no** incluye automáticamente la ordenada al origen ($\beta_0$, la constante donde la línea cruza el eje Y). Si en la matemática de tu modelo necesitas esa constante, en el código verás que antes se aplica la instrucción `X = sm.add_constant(X)`, lo cual añade matemáticamente una columna llena de `1`s a la matriz $\mathbf{X}$.
>
 ---


###  Explicación de la Instrucción: 

**plate_corrected = plate + np.array([ols_result_y.predict(sm.add_constant(basis_free)), ols_result_x.predict(sm.add_constant(basis_free))]).T / m + fixed_correction**

Esta línea de código se encarga de corregir las coordenadas de los píxeles de la imagen (la placa o *plate*) utilizando los residuos predichos por el modelo de regresión lineal (OLS) y deshaciendo los cambios de escala previos.

Matemáticamente, está aplicando un ajuste fino (como un mapa de distorsión residual o una corrección de desplazamiento) sobre las coordenadas de las estrellas en el plano de la imagen.

Vamos a desglosarlo matemáticamente pieza por pieza:


##### 1. El término central: `ols_result_y.predict(...)` y `ols_result_x.predict(...)`

En la línea previa definiste el modelo para el eje $X$ como:


$$
\text{Error}_x \cdot m = \beta_0 + \beta_1 \cdot \text{basis\_free}_1 + \dots + \epsilon
$$

Cuando ejecutas `.predict(sm.add_constant(basis_free))`, el modelo OLS toma los coeficientes óptimos $\hat{\boldsymbol{\beta}}$ ya calculados por la ecuación normal y evalúa la función lineal para cada estrella:

$$
\widehat{\Delta x}_i \cdot m = \mathbf{x}_i^T \hat{\boldsymbol{\beta}}_x
$$

$$
\widehat{\Delta y}_i \cdot m = \mathbf{x}_i^T \hat{\boldsymbol{\beta}}_y
$$

Esto nos da el **error sistemático estimado** (o la distorsión del modelo) para cada estrella en los ejes $X$ e $Y$.


##### 2. Estructuración y Transposición: `np.array([...]).T`

El código agrupa las predicciones de ambos ejes en una lista de dos vectores fila:


$$
\begin{bmatrix} [\widehat{\Delta y}_1 \cdot m, & \widehat{\Delta y}_2 \cdot m, & \dots] \\ [\widehat{\Delta x}_1 \cdot m, & \widehat{\Delta x}_2 \cdot m, & \dots] \end{bmatrix}
$$

Al aplicar la transpuesta (`.T`), esta matriz se reordena para que cada **fila** corresponda a una estrella y cada **columna** a un eje geométrico, quedando en formato $(N, 2)$:

$$
\begin{bmatrix} \widehat{\Delta y}_1 \cdot m & \widehat{\Delta x}_1 \cdot m \\ \widehat{\Delta y}_2 \cdot m & \widehat{\Delta x}_2 \cdot m \\ \vdots & \vdots \end{bmatrix}
$$

*(Nota curiosa: El código coloca primero el resultado de $Y$ y luego el de $X$. Esto suele ocurrir si en las estructuras de datos de la imagen o del catálogo las coordenadas están indexadas en formato de matriz `[fila, columna]`, que equivale a `[y, x]`).*


##### 3. Cambio de escala inverso: `/ m`

Dado que en el paso de `sm.OLS` multiplicaste los errores originales por un factor de escala $m$ (`errors_fixed[:, 1] * m`), la predicción resultante está amplificada por ese mismo factor.

Al dividir matemáticamente entre $m$, **cancelas esa escala** y devuelves las predicciones a las unidades físicas originales de la placa (por ejemplo, píxeles o milímetros):

$$
\frac{\widehat{\Delta}_i \cdot m}{m} = \widehat{\Delta}_i
$$


##### 4. La combinación lineal final: `plate + (...) + fixed_correction`

Finalmente, se realiza una suma vectorial para cada punto $i$ de la placa:

$$
\mathbf{P}_{\text{corregido}, i} = \mathbf{P}_{\text{original}, i} + \widehat{\mathbf{\Delta}}_i + \mathbf{C}_{\text{fija}}
$$

Donde:

* $\mathbf{P}_{\text{original}, i}$: Es el vector de posición original en el plano de la imagen (`plate`).
* $\widehat{\mathbf{\Delta}}_i$: Es el desplazamiento sistemático (el error estimado por la regresión OLS que acabamos de desglosar). Al sumarlo, estás contrarrestando la tendencia de distorsión lineal que el modelo detectó en el campo.
* $\mathbf{C}_{\text{fija}}$ (`fixed_correction`): Es una corrección constante adicional (probablemente un vector de traslación global o un *offset* promedio que se calculó previamente en el programa).

#### Resumen del proceso

Matemáticamente, esta instrucción agarra las coordenadas base de la imagen, les aplica un mapa de deformación continuo calculado mediante mínimos cuadrados (que corrige rotaciones residuales, flexiones o escalas remanentes en el plano) y añade un desplazamiento fijo para obtener la **posición exacta, calibrada y libre de distorsiones lineales** de las estrellas sobre el detector.

---

### Explicación de la función:
**ols_result_y.predict(sm.add_constant(basis_free))**


Matemáticamente, esta línea realiza una **multiplicación de matrices** para evaluar el modelo de regresión lineal estimado. Su objetivo es calcular el **valor esperado o predicho** de la variable dependiente (en este caso, el error estimado en el eje $Y$) para cada una de las observaciones, basándose en las variables independientes proporcionadas.

Aquí tienes el desglose matemático exacto de lo que ocurre dentro de esa instrucción:

##### 1. La Matriz de Diseño: `sm.add_constant(basis_free)`

Supongamos que tus variables predictoras en `basis_free` forman una matriz con $N$ filas (una por cada estrella) y $k$ columnas (las variables o componentes geométricas usadas).

Al aplicar `sm.add_constant`, matemáticamente estás creando la **Matriz de Diseño** ($\mathbf{X}$), añadiendo una columna de unos ($1$) al principio. Esto es indispensable para activar el intercepto u ordenada al origen ($\beta_0$):

$$
\mathbf{X} = \begin{bmatrix} 1 & x_{1,1} & x_{1,2} & \dots & x_{1,k} \\ 1 & x_{2,1} & x_{2,2} & \dots & x_{2,k} \\ \vdots & \vdots & \vdots & \ddots & \vdots \\ 1 & x_{N,1} & x_{N,2} & \dots & x_{N,k} \end{bmatrix}
$$

##### 2. El Vector de Parámetros Ajustados: `ols_result_y`

El objeto `ols_result_y` ya contiene internamente los coeficientes óptimos calculados previamente durante el `.fit()`. Estos coeficientes forman el vector $\hat{\boldsymbol{\beta}}_y$:

$$
\hat{\boldsymbol{\beta}}_y = \begin{bmatrix} \hat{\beta}_0 \\ \hat{\beta}_1 \\ \vdots \\ \hat{\beta}_k \end{bmatrix}
$$



##### 3. La Predicción Matemáticamente: `.predict(...)`

Cuando ejecutas `.predict(\mathbf{X})`, el algoritmo realiza el producto punto matricial entre la matriz de diseño y el vector de coeficientes:

$$
\hat{\mathbf{y}} = \mathbf{X} \hat{\boldsymbol{\beta}}_y
$$

Si desglosamos esta multiplicación fila por fila (es decir, para cada estrella $i$), la instrucción está resolviendo la ecuación lineal:

$$
\hat{y}_i = \hat{\beta}_0 \cdot 1 + \hat{\beta}_1 \cdot x_{i,1} + \hat{\beta}_2 \cdot x_{i,2} + \dots + \hat{\beta}_k \cdot x_{i,k}
$$

##### ¿Qué obtienes como resultado?

El output de esta instrucción es un vector columna $\hat{\mathbf{y}}$ de tamaño $(N, 1)$. Cada elemento de este vector es la cantidad de "distorsión o error en Y" que el modelo matemático predice para esa estrella en específico, permitiendo usarlo (como viste en el paso anterior) para limpiar y corregir la posición de la placa.

---

### Explicación de la función:
**ols_result_x.params**

La instrucción `ols_result_x.params` devuelve matemáticamente el **vector de coeficientes óptimos** ($\hat{\boldsymbol{\beta}}_x$) estimados por el modelo de mínimos cuadrados ordinarios para el eje $X$.

Es decir, no ejecuta ninguna operación nueva; simplemente te da acceso a los "pesos" o valores numéricos finales de la ecuación que el algoritmo encontró tras resolver la ecuación normal:

$$
\hat{\boldsymbol{\beta}}_x = (\mathbf{X}^T \mathbf{X})^{-1} \mathbf{X}^T \mathbf{y}
$$

##### ¿Qué contiene exactamente este vector?

Si aplicaste `sm.add_constant(basis_free)`, el resultado de `ols_result_x.params` será un arreglo de NumPy (o una serie de Pandas) con la siguiente estructura matemática:

$$
\hat{\boldsymbol{\beta}}_x = \begin{bmatrix} \hat{\beta}_0 \\ \hat{\beta}_1 \\ \hat{\beta}_2 \\ \vdots \end{bmatrix}
$$

Su significado geométrico depende directamente de qué variables hayas metido dentro de `basis_free`:

* **$\hat{\beta}_0$ (el intercepto / `const`):** Es el término constante. Representa el **desplazamiento (traslación) global** fijo en el eje $X$ de la placa. Si todas tus variables de base fueran cero, la placa seguiría desfasada por este valor de píxeles.
* **$\hat{\beta}_1, \hat{\beta}_2, \dots$ (los coeficientes de las variables):** Representan la **sensibilidad o tasa de cambio** del error en $X$ respecto a cada función base.

##### El caso típico en Astrometría (Platesolving)

Si tu matriz `basis_free` contenía las posiciones lineales de los píxeles $(x, y)$, la ecuación que OLS resolvió para el eje X fue:

$$
\text{Error}_x \cdot m = \hat{\beta}_0 + \hat{\beta}_1 x + \hat{\beta}_2 y
$$

En este escenario físico real:

* **$\hat{\beta}_0$** es la traslación pura en X.
* **$\hat{\beta}_1$** y **$\hat{\beta}_2$** está directamente relacionados con el **factor de escala residual** de la imagen (si la cámara encogió o estiró los píxeles en ese eje) y  el **ángulo de rotación residual o el acoplamiento (cizallamiento / *shear*)** entre los ejes $X$ e $Y$.

En resumen, `.params` te muestra la "receta analítica" exacta que describe cómo se deforma tu imagen en el eje $X$.


---   

##### Explicación de la instrucción: 
**platescale_stdrelerror = (ols_result_x.HC0_se[1]^2 + ols_result_y.HC0_se[2]^2)\^0.5 / w**

Esta línea de código calcula matemáticamente el **error estándar relativo de la escala de la placa (plate scale)** empleando la técnica de **propagación de errores robusta ante heterocedasticidad** (variabilidad no constante del ruido en la imagen).

Para entender bien qué significa, vamos a conectar esta instrucción con la conversación anterior sobre cómo interactúan los coeficientes $\beta_1$ y $\beta_2$.

---

##### 1. El contexto de los coeficientes involucrados

Recordemos que cuando el script ajusta los modelos para ambos ejes, las variables de la placa suelen ser las posiciones en píxeles $(x, y)$. En la matriz de diseño (`sm.add_constant`), el índice `[0]` corresponde a la constante (traslación). Por ende:

* `ols_result_x` evalúa el eje X, donde el índice `[1]` de sus parámetros corresponde matemáticamente a la componente $\beta_{1x}$ (asociada a la variable $x$).
* `ols_result_y` evalúa el eje Y, donde el índice `[2]` de sus parámetros corresponde matemáticamente a la componente $\beta_{2y}$ (asociada a la variable $y$).

En un diseño astrométrico simétrico ideal, la escala de la placa (vamos a llamarla $w$) se estima promediando o combinando estas dos componentes ortogonales debido a las ecuaciones de proyección:


$$
w \approx \frac{\beta_{1x} + \beta_{2y}}{2} \quad \text{o bien} \quad w = \sqrt{\beta_{1x}^2 + \beta_{2y}^2}
$$

---

##### 2. ¿Qué es `HC0_se`?

En `statsmodels`, `HC0_se` significa **Heteroskedasticity-Robust Standard Errors** (Errores Estándar Robustos a la Heterocedasticidad de White, 1980).

* **El problema físico:** En las imágenes astronómicas, el error de medición no es el mismo para todas las estrellas (las estrellas brillantes tienen menos ruido de fotones que las débiles, y las estrellas en los bordes de la imagen sufren más distorsiones ópticas). Esto viola el principio clásico de OLS que asume que el ruido es idéntico en todos lados (homocedasticidad).
* **La solución matemática:** `HC0_se` calcula la incertidumbre real de los coeficientes utilizando una matriz sándwich que pondera los residuos al cuadrado individuales ($e_i^2$):

$$
\text{SE}_{\text{robusto}} = \sqrt{\operatorname{diag}\left((\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}^T \operatorname{diag}(e_i^2) \mathbf{X}(\mathbf{X}^T\mathbf{X})^{-1}\right)}
$$



Por tanto, `ols_result_x.HC0_se[1]` es la **incertidumbre matemática pura** del coeficiente $\beta_{1x}$, y `ols_result_y.HC0_se[2]` es la incertidumbre del coeficiente $\beta_{2y}$.

---

##### 3. La fórmula paso a paso

Si reescribimos el código como una ecuación matemática formal, la instrucción ejecuta lo siguiente:

$$
\text{Error Relativo} = \frac{\sqrt{(\sigma_{\beta_{1x}})^2 + (\sigma_{\beta_{2y}})^2}}{w}
$$

Donde:

1. **Elevación al cuadrado (`2`)**: Prepara las incertidumbres individuales convirtiéndolas en varianzas ($\sigma^2$).
2. **Suma y Raíz Cuadrada (`0.5`)**: Aplica el teorema de **propagación de errores lineales** para variables independientes. La incertidumbre combinada de sumar o combinar linealmente ambos coeficientes es la raíz cuadrada de la suma de sus varianzas. Esto nos da el *error estándar absoluto* de la escala del campo.
3. **División por la escala (`/ w`)**: Al dividir el error absoluto entre el valor estimado de la escala de la placa ($w$), transformas la métrica en un **error relativo** (adimensional).

##### Significado práctico:

Esta instrucción te dice **qué tan confiable es la escala de tu telescopio** (en una proporción o porcentaje). Por ejemplo, si el resultado final de esta operación es `0.0001`, matemáticamente significa que el cálculo de la escala de la placa de tu cámara tiene una incertidumbre del `0.01%`, blindada estadísticamente contra el hecho de que algunas estrellas de la muestra tengan mucho más ruido que otras.

----

### Corregir el platescale con las nuevas correcciones

Esta fase se encarga de **aplicar formalmente todas las correcciones calculadas al vector de estado del telescopio (`q`)**, generando una nueva tupla actualizada llamada `corrected_q`.

Matemáticamente, lo que está ocurriendo aquí es una **actualización de estado mediante una suma vectorial** de la base previa más las desviaciones infinitesimales descubiertas por la regresión:

$$
\mathbf{q}_{\text{corregido}} = \mathbf{q}_{\text{actual}} + \mathbf{\Delta q}
$$

Si desglosamos la tupla elemento por elemento de izquierda a derecha, vemos cómo se aplica la física y la geometría que calculamos en los pasos anteriores:

---

#### Corrector de escala
```
    platescale_multiplier = ((1 + reg_x.params[1] / w) * (1 + reg_y.params[2] / w))**0.5
    new_platescale = q[0] * platescale_multiplier
theta = q[3]
    shiftRA_DEC = q[0] * np.array([[1/np.cos(q[2]), 0], [0, 1]]) @ np.array([[np.cos(theta), -np.sin(theta)], [np.sin(theta),  np.cos(theta)]]) @ np.array([reg_x.params[0], reg_y.params[0]])
    shift_roll_angle = reg_x.params[2] / w # small angle appromixation
    corrected_q = (new_platescale, q[1] + shiftRA_DEC[0], q[2] + shiftRA_DEC[1], q[3]-shift_roll_angle)
```

Estas tres instrucciones calculan los ajustes finales que deben aplicarse a los parámetros globales del telescopio (su escala de placa, su apuntado en el cielo y su ángulo de rotación o *roll*).

Aquí el código asume que el telescopio ya tiene una solución base guardada en un vector `q` (donde `q[0]` es la escala de placa actual, `q[2]` es la Declinación central y `q[3]` es el ángulo de rotación actual).

Este es el significado matemático detallado de cada cálculo:

---

#### 1. `platescale_multiplier` y `new_platescale`

Este bloque calcula el nuevo factor de escala de la placa fotográfica aplicando una **corrección geométrica promedio (media geométrica)**.

$$
\text{multiplier} = \sqrt{\left(1 + \frac{\beta_{1[x]}}{w}\right) \left(1 + \frac{\beta_{2[y]}}{w}\right)}
$$

$$
\text{escala}_{\text{nueva}} = \text{escala}_{\text{base}} \times \text{multiplier}
$$

**La matemática detrás:**

* Como descubrimos antes, los parámetros $\beta_{1[x]}$ (`reg_x.params[1]`) y $\beta_{2[y]}$ (`reg_y.params[2]`) absorben las variaciones de escala en las direcciones $X$ e $Y$. Dividirlos por $w$ (la escala aproximada) normaliza esa variación, convirtiéndola en una tasa de cambio porcentual (un "estiramiento" relativo).
* Sumarles $1$ genera los factores de multiplicación individuales para cada eje: $(1 + \Delta s_x)$ y $(1 + \Delta s_y)$.
* Al multiplicar ambos términos y aplicar la raíz cuadrada, el código calcula la **media geométrica** del cambio de escala bidimensional. Esto compensa de manera uniforme cualquier encogimiento o expansión de la imagen debido a cambios ópticos o térmicos en el telescopio, aplicándolo directamente sobre la escala base `q[0]`.

---

#### 2. `shiftRA_DEC`

Esta es la instrucción matemáticamente más compleja del bloque. Aplica una **transformación lineal compuesta (multiplicación de matrices)** para convertir el error de desplazamiento medido en la pantalla (píxeles) en un desplazamiento físico real en la esfera celeste (Ascensión Recta y Declinación).

Si traducimos el código a una ecuación matricial limpia, se ejecuta lo siguiente:

$$
\begin{bmatrix} \Delta \text{RA} \\ \Delta \text{DEC} \end{bmatrix} = \text{escala}_{\text{base}} \begin{bmatrix} \frac{1}{\cos(\delta)} & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix} \begin{bmatrix} \beta_{0x} \\ \beta_{0y} \end{bmatrix}
$$

El cálculo opera de derecha a izquierda:

1. **El vector de error original:** $\begin{bmatrix} \beta_{0[x]} \\ \beta_{0[y]} \end{bmatrix}$ representa los interceptos (`params[0]`) hallados por OLS. Son el desfase constante (en píxeles) de la imagen.
2. **Matriz de Rotación (centro):** Rota los desplazamientos del sensor usando el ángulo actual del telescopio ($\theta =$ `q[3]`). Esto es necesario porque los ejes de la cámara ($X, Y$) casi nunca están perfectamente alineados con los ejes del cielo (Norte, Este). Esta matriz proyecta los píxeles de error directamente sobre las direcciones celestes locales.
3. **Matriz de Proyección Esférica (izquierda):** Multiplica el resultado por la escala `q[0]` para pasar de píxeles a grados de arco. Notarás que el eje Y (Declinación) se multiplica simplemente por 1, pero el eje X (Ascensión Recta) se divide entre **$\cos(\delta)$** (`np.cos(q[2])`).
> **Razón astrométrica:** En la esfera celeste, las líneas de Ascensión Recta se van juntando a medida que te acercas a los polos (un efecto idéntico a los meridianos de la Tierra). Para calcular el desplazamiento real en el cielo a una Declinación $\delta$, es matemáticamente obligatorio corregir la distancia dividiendo por el coseno de dicha Declinación (factor de convergencia de meridianos).


#### 3. `shift_roll_angle = reg_x.params[2] / w`

Esta línea calcula el pequeño desfase angular o error de rotación (*roll*) del telescopio usando la **aproximación de ángulo pequeño**.

$$
\Delta \theta \approx \frac{\beta_{2x}}{w}
$$

**La matemática detrás:**
Anteriormente dedujimos que el coeficiente que acompaña a la variable $Y$ en la ecuación de $X$ es $\beta_{2x} = -s \sin\theta$.
Si asumimos que el telescopio ya está bastante bien alineado y el error de rotación remanente ($\theta$) es extremadamente cercano a cero, el cálculo se simplifica drásticamente gracias al desarrollo de Taylor:

* La escala residual es casi perfecta ($s \approx 1$).
* Para ángulos muy pequeños medidos en radianes, el seno de un ángulo es aproximadamente igual al ángulo mismo: $\sin\theta \approx \theta$.

Sustituyendo estos valores en la identidad, obtenemos que $\beta_{2x} \approx -\theta$. Al dividir este coeficiente entre la escala $w$, el código aísla directamente el **ángulo de rotación residual en radianes**, el cual nos dice cuántas fracciones de radián debe girar físicamente el plano de la cámara para quedar perfectamente nivelado con el norte celeste.



---
### Definir el nuevo platescale

**corrected_q = (new_platescale, q[1] + shiftRA_DEC[0], q[2] + shiftRA_DEC[1], q[3]-shift_roll_angle)**


Podemos modelar este paso como la transición del estado actual del sistema al estado corregido:

$$
\mathbf{q}_{\text{actual}} \longrightarrow \mathbf{q}_{\text{corregido}}
$$

Donde el vector de parámetros está definido en el espacio de configuración del telescopio como $\mathbf{q} = (\text{Escala}, \text{RA}, \text{DEC}, \text{Rotación})$.

#### La matemática detrás de cada componente

Si desglosamos la tupla elemento por elemento de izquierda a derecha, la lógica algebraica y física aplicada es la siguiente:

###### 1. `new_platescale` (Escala de Placa)

* **Operación:** Sustitución por escala multiplicativa.
* **La matemática detrás:** A diferencia de las coordenadas de posición, la escala de la placa fotográfica no se corrige sumando un diferencial. Como determinamos en los pasos previos, la distorsión geométrica en los ejes del sensor actúa como un factor adimensional de estiramiento o compresión. Por lo tanto, el nuevo estado absorbe directamente el cálculo multiplicativo:

$$
\text{Escala}_{\text{nueva}} = \text{Escala}_{\text{base}} \times \text{multiplier}
$$



###### 2. `q[1] + shiftRA_DEC[0]` (Ascensión Recta - RA)

* **Operación:** Corrección aditiva lineal en el eje horizontal celeste.
* **La matemática detrás:** Se aplica una traslación lineal sumando el diferencial $\Delta\text{RA}$ (almacenado en `shiftRA_DEC[0]`) a la coordenada de centro actual en RA (`q[1]`). En este punto, `shiftRA_DEC[0]` ya ha sido corregido algebraicamente mediante la división por $\cos(\delta)$ para contrarrestar la convergencia de los meridianos en la esfera celeste. La operación matemática es:

$$
\alpha_{\text{corregida}} = \alpha_{\text{actual}} + \Delta\alpha
$$


###### 3. `q[2] + shiftRA_DEC[1]` (Declinación - DEC)

* **Operación:** Corrección aditiva lineal en el eje vertical celeste.
* **La matemática detrás:** De manera homóloga al paso anterior, se realiza una traslación en el eje de las latitudes celestes sumando el diferencial $\Delta\text{DEC}$ (`shiftRA_DEC[1]`) a la declinación base (`q[2]`). Al ser arcos de círculo máximo, esta componente no requería correcciones por proyección esférica y se acopla directamente:

$$
\delta_{\text{corregida}} = \delta_{\text{actual}} + \Delta\delta
$$



###### 4. `q[3] - shift_roll_angle` (Ángulo de Rotación / *Roll*)

* **Operación:** Corrección sustractiva (Retroalimentación Negativa).
* **La matemática detrás:** Aquí ocurre un cambio de signo crítico. El valor `shift_roll_angle` ($\Delta\theta$) representa el error de giro detectado en las estrellas de la imagen. En física y teoría de control, para cancelar un error observado y devolver el sistema a su orientación ideal, se debe aplicar una acción en el sentido opuesto. Por lo tanto, el algoritmo resta algebraicamente el desvío:

$$
\theta_{\text{corregido}} = \theta_{\text{actual}} - \Delta\theta
$$



### Conclusión del bloque de código

Con esta asignación, el script cierra formalmente el bucle de calibración astrométrica. Reúne las correcciones de escala (multiplicativa), de posición esférica (aditivas) y de orientación (sustractiva) en una sola estructura lineal, dejando el sistema listo para que cualquier cálculo o apuntado posterior coincida exactamente con la realidad física del cielo nocturno.