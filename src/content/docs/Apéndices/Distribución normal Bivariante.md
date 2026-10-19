# Interpretación matemática y física del gráfico: escala de placa y deflexión de la luz en el experimento de Eddington

<div style="display: flex; justify-content: center; margin: 50px 0;">
    <img src="assets/gráfico de contorno de confianza.webp" 
         alt="Haz clic para ampliar" 
         width="600">
</div>

El gráfico presenta un resultado del análisis astrométrico de la estación 1 de México, correspondiente a 2024, dentro de un ajuste conjunto (pooled fit). Su objetivo es estudiar la relación entre dos parámetros: la deflexión de la luz estelar cerca del Sol y la escala de placa de las imágenes astronómicas.

La idea fundamental es que la deflexión gravitatoria que se quiere medir y la calibración de la imagen están correlacionadas. Por ello, no basta con obtener un valor para la deflexión: hay que determinar también hasta qué punto la incertidumbre en la escala de placa afecta a ese resultado.

## 1. Qué representa cada eje

### Eje horizontal: $L$, deflexión de la luz en el limbo solar

Se expresa en segundos de arco. El valor de referencia indicado por la línea verde es:

$$
L_{\mathrm{Einstein}} = 1,751''
$$

Es la deflexión relativista predicha para un rayo rasante al Sol, es decir, para una estrella cuya luz pasa a una distancia del centro solar aproximadamente igual al radio solar.

### Eje vertical: escala de placa

Se expresa en segundos de arco por píxel:

$$
s \simeq 1{,}847363''/\mathrm{px}
$$

Indica cuánto ángulo del cielo corresponde a un píxel de la imagen. Si la escala está mal calibrada, las distancias angulares inferidas de las posiciones estelares también estarán sesgadas.

Es importante no confundir ambas magnitudes: $L$ es un parámetro físico que se pretende medir, mientras que $s$ es un parámetro de calibración instrumental.

## 2. El resultado numérico del ajuste

El recuadro del gráfico proporciona los siguientes valores:

| Magnitud                                      | Resultado                        |
| --------------------------------------------- | -------------------------------- |
| Deflexión ajustada $L$                    | $1{,}804''$                  |
| Incertidumbre estadística de $L$          | $0{,}084''$                  |
| Término atmosférico indicado                  | $0{,}11$                     |
| Incertidumbre adicional indicada para $L$ | $0{,}139''$                  |
| Escala de placa ajustada $s$              | $1{,}847363''/\mathrm{px}$   |
| Incertidumbre de la escala                    | $5,5 \times 10^6" \mathrm{px}$ |
| Correlación entre $L$ y $s$           | $-0{,}79$                    |
| Observaciones                                 | 639                              |
| Estrellas                                     | 192                              |
| Coordenadas medidas                           | 1278                             |

El término atmosférico aparece en el gráfico como «0.11», sin que se especifiquen allí sus unidades, su definición matemática ni cómo se combina con la incertidumbre estadística. Por tanto, conviene no interpretar ese número como una incertidumbre independiente sin consultar el método de ajuste.

### ¿Qué significa el valor de $L$?

El ajuste obtiene:

$$ 
L=1{,}804'' 
$$

frente al valor de Einstein:

$$
L_{\mathrm{Einstein}}=1{,}751'' 
$$

La diferencia es:

$$
\Delta L=1{,}804-1{,}751 =\boxed{0{,}053''} 
$$

Es decir, el valor central medido es aproximadamente un 3,0 % mayor que la predicción relativista.

Pero esto no implica que exista una discrepancia física significativa. Para saberlo hay que comparar la diferencia con la incertidumbre total pertinente, incluyendo las contribuciones estadísticas, atmosféricas y sistemáticas según el modelo utilizado.

## 3. Interpretación matemática de la elipse azul

La elipse es el elemento más importante del gráfico. Representa la región de incertidumbre conjunta de los dos parámetros ajustados, $L$ y $s$, para el método 2.

El signo $+$ azul marca la estimación central:

$$ 
(\hat L,\hat s)= (1{,}804'', ~ 1{,}8473625''/\mathrm{px}) 
$$

La línea verde vertical representa el valor teórico de $L$ predicho por Einstein. Su intersección con la elipse indica que el valor teórico es compatible con valores de la escala de placa que se encuentran dentro de la región conjunta de una sigma.

### ¿Por qué tiene esa inclinación?

La elipse está inclinada hacia abajo de izquierda a derecha. Esto se debe a que los dos parámetros están correlacionados negativamente.

El gráfico indica:

$$ 
\boxed{\rho_{L,s}=-0{,}79} 
$$

El coeficiente de correlación $\rho$ está comprendido entre $-1$ y $+1$:

- $\rho=0$: ausencia de correlación lineal.
- $\rho=+1$: correlación lineal positiva perfecta.
- $\rho=-1$: correlación lineal negativa perfecta.

El valor $-0{,}79$ indica una correlación negativa considerable.

### Cómo interpretar el movimiento sobre la elipse
    
<div style="display: flex; justify-content: center; margin: 50px 0;">
    <img src="assets/Distribución normal Bivariante_1.svg" 
         alt="Haz clic para ampliar" 
         width="600">
</div>


Esquema conceptual, no a escala. La inclinación representa la anticorrelación observada.

Si el ajuste aumenta el valor estimado de $L$, puede compensarlo reduciendo la escala de placa. Si disminuye $L$, puede compensarlo aumentando la escala.

Matemáticamente, la matriz de covarianza de los parámetros tiene la forma:

$$ 
\mathbf C= \begin{pmatrix} \sigma_L^2 & \rho ~\sigma_L\sigma_s\\\ \rho ~\sigma_L\sigma_s & \sigma_s^2 \end{pmatrix} 
$$

El término no diagonal es negativo porque $\rho=-0{,}79$. Es precisamente esa covarianza la que determina la inclinación de la elipse.

Consecuencia física: parte de la incertidumbre en la deflexión no puede analizarse independientemente de la calibración de la imagen. Si se fija la escala de placa en lugar de ajustarla, la incertidumbre resultante en $L$ puede cambiar.

## 4. ¿Qué significa la precisión de la escala de placa?

El resultado es:

$$ 
s=1{,}847363\pm0{,}0000055''/\mathrm{px} 
$$

La incertidumbre relativa es aproximadamente:

$$ 
\frac{\sigma_s}{s} =\frac{5{,}5\times10^{-6}}{1{,}847363} \approx2{,}98\times10^{-6} 
$$

Equivale a unas 3 partes por millón (ppm).

Es una precisión relativa muy alta para la escala de placa estimada. No obstante, hay una distinción esencial: esta es la incertidumbre del parámetro dentro del modelo de ajuste, no necesariamente la incertidumbre real absoluta de la calibración instrumental.

Para que represente la precisión física real, el modelo debe incorporar adecuadamente los posibles errores sistemáticos, como distorsión óptica, refracción atmosférica, cambios de configuración y errores en las posiciones estelares de referencia.

Además, la escala se ha obtenido ajustándola simultáneamente con $L$, como indica el texto «plate scale found by fitting $L$». Por tanto, no constituye una calibración completamente independiente de la medición de la deflexión.

## 5. Interpretación física: ¿qué está midiendo el experimento?

Según la relatividad general, la luz se desvía al pasar cerca de una masa. Para un rayo que pasa a una distancia $b$ del centro de una masa esférica, en la aproximación de campo débil:

$$ 
\alpha=\frac{4GM}{c^2b} 
$$

donde $G$ es la constante gravitatoria, $M$ la masa del Sol y $c$ la velocidad de la luz.

Para un rayo rasante al Sol, $b\approx R_\odot$, la predicción es aproximadamente $1{,}751$ segundos de arco.

El procedimiento experimental consiste, en esencia, en comparar las posiciones de las estrellas observadas cerca del Sol con posiciones de referencia, estimando cuánto desplazamiento angular corresponde a la deflexión gravitatoria. La escala de placa convierte las distancias medidas en píxeles a distancias angulares.

En este proceso pueden confundirse parcialmente tres efectos:

1. Deflexión gravitatoria: el desplazamiento angular que se pretende medir.
2. Calibración de la imagen: la conversión de píxeles a segundos de arco.
3. Atmósfera: la refracción y otros efectos atmosféricos que pueden alterar las posiciones aparentes de las estrellas.

La anticorrelación de la elipse muestra que el ajuste está identificando una combinación de estos parámetros, no dos magnitudes totalmente independientes.

## 6. ¿Qué nos dicen las incertidumbres sobre la predicción de Einstein?

El gráfico proporciona dos términos para $L$:

$$ 
L=1,804\pm0,084'' ~~ (\mathrm{estadístico}) 
$$

y una incertidumbre adicional indicada como $\pm0{,}139''$, asociada en el rótulo al término atmosférico 0,11.

Si, a modo de hipótesis, ambas incertidumbres fueran independientes y correspondieran al mismo nivel de confianza, se podrían combinar en cuadratura:

$$ 
\sigma\_{\mathrm{total}} =\sqrt{0{,}084^2+0{,}139^2} \approx0{,}162'' 
$$

La diferencia con la predicción de Einstein sería entonces:

$$ 
z=\frac{1{,}804-1{,}751}{0{,}162} \approx0{,}33 
$$

Es decir, aproximadamente $0{,}33\sigma$, una diferencia pequeña comparada con la incertidumbre combinada bajo esa hipótesis.

Esta operación es solo ilustrativa: el rótulo no permite confirmar que ambos términos sean independientes ni que deban combinarse de esa manera. Para establecer la significación estadística real habría que conocer la definición exacta del término atmosférico y el procedimiento de propagación de errores empleado.

La conclusión prudente es que el valor central obtenido es superior al de Einstein, pero el gráfico no muestra una discrepancia significativa evidente con la predicción relativista.

## 7. ¿Qué aportan las 639 observaciones y las 192 estrellas?

El ajuste utiliza:

- 639 observaciones.
- 192 estrellas.
- 1278 coordenadas medidas.

El número de coordenadas coincide con dos coordenadas por observación:

$$ 
1278=2\times639 
$$

Esto es coherente con la medición de dos coordenadas en el plano de imagen, normalmente $x$ e $y$.

El ajuste conjunto aprovecha toda esa información para estimar una escala de placa común y un valor de deflexión compartido. La ventaja potencial es que muchas medidas ayudan a reducir el ruido estadístico.

Sin embargo, 639 observaciones no equivalen necesariamente a 639 medidas independientes: varias pueden corresponder a la misma estrella, imagen, noche o condición atmosférica. Los errores comunes o correlacionados no desaparecen simplemente por acumular observaciones.

## 8. Valoración global del resultado

Resultado favorable: ajuste conjunto informativo

Se han estimado simultáneamente la deflexión y la escala de placa, y el gráfico cuantifica su correlación. Esto es más informativo que presentar únicamente un valor de $L$.

Limitación: degeneración entre parámetros

La correlación $-0{,}79$ indica que una parte importante de la variación permitida por el ajuste puede intercambiarse entre la deflexión y la escala de placa.

Punto crítico: efectos atmosféricos y sistemáticos

El tratamiento de la atmósfera y de otros errores sistemáticos puede ser determinante para saber si la precisión nominal representa la precisión física real.

Objetivo: contrastar la predicción relativista

El resultado central $1{,}804''$ supera los $1{,}751''$ de Einstein en $0{,}053''$. Para valorar la fuerza de la comprobación hay que considerar la incertidumbre total y la robustez del modelo.

Mi conclusión: el gráfico demuestra que el análisis está abordando correctamente una dificultad importante de la astrometría de precisión: la interacción entre la escala instrumental y el parámetro físico que se desea medir. No basta, sin embargo, con observar que la línea de Einstein cruza la elipse para afirmar que la relatividad general queda confirmada. El siguiente paso sería comprobar cómo cambia $L$ cuando se modifica el modelo atmosférico, se controla la escala mediante una calibración independiente y se analizan los posibles errores sistemáticos.

Si este gráfico forma parte del proyecto MEE2027, sería especialmente útil comparar este ajuste con otro en el que la escala de placa se determine independientemente de $L$. Esa comparación permitiría evaluar hasta qué punto la estimación de la deflexión depende de la correlación que muestra la elipse.

---

## Hay alguna relación entre la forma de la elipse y las curvas de Gaus correspondientes a las varianzas de L y s?

Sí. Existe una relación matemática directa entre la forma de la elipse y las curvas gaussianas asociadas a las incertidumbres de $L$ y $s$. De hecho, la elipse es una representación bidimensional de la distribución conjunta de probabilidad de ambos parámetros, si suponemos que sus errores siguen una distribución normal bivariante.

La clave es distinguir las distribuciones marginales de cada parámetro de su distribución conjunta.

## 1. Las dos curvas gaussianas marginales

Supongamos que el ajuste proporciona dos parámetros:

- $L$: deflexión de la luz en el limbo solar.
- $s$: escala de placa en segundos de arco por píxel.

Sus distribuciones marginales pueden representarse mediante dos gaussianas:

$$ 
p(L)=\frac{1}{\sqrt{2\pi}\sigma_L} \exp\left[-\frac{(L-\hat L)^2}{2\sigma_L^2}\right] 
$$

$$ 
p(s)=\frac{1}{\sqrt{2\pi}\sigma_s} \exp\left[-\frac{(s-\hat s)^2}{2\sigma_s^2}\right] 
$$

Aquí, $\hat L$ y $\hat s$ son los valores estimados, y $\sigma_L$ y $\sigma_s$ son sus desviaciones estándar marginales.

Si representamos cada gaussiana por separado, obtenemos una curva en forma de campana para $L$ y otra para $s$.

#### Distribución de $L$

Deflexión angular

Anchura: $\sigma_L$

<div style="display: flex; justify-content: left; margin: 50px 0;">
    <img src="assets/Distribución normal Bivariante_3.svg" 
         alt="Haz clic para ampliar" 
         width="200">
</div>


#### Distribución de $s$

Escala de placa

Anchura: $\sigma_s$

<div style="display: flex; justify-content: left; margin: 50px 0;">
    <img src="assets/Distribución normal Bivariante_4.svg" 
         alt="Haz clic para ampliar" 
         width="200">
</div>

Esquemas ilustrativos de las gaussianas marginales, no reconstrucciones de los datos del gráfico original.

La anchura de cada campana expresa la incertidumbre de su parámetro. Una gaussiana estrecha indica una incertidumbre pequeña; una ancha, una incertidumbre grande.

Pero estas dos curvas, por sí solas, no nos dicen si $L$ y $s$ están correlacionados.

## 2. Cómo aparece la elipse a partir de las gaussianas

Si los errores siguen una distribución normal bivariante, la distribución conjunta tiene la forma:

$$ 
p(L,s)=\frac{1}{2\pi\sigma_L\sigma_s\sqrt{1-\rho^2}} \exp\left(-\frac{Q}{2}\right) 
$$

donde

$$ 
Q=\frac{1}{1-\rho^2} \left[ \frac{(L-\hat L)^2}{\sigma_L^2} +\frac{(s-\hat s)^2}{\sigma_s^2} -\frac{2\rho(L-\hat L)(s-\hat s)} {\sigma_L\sigma_s} \right]. 
$$

El parámetro $\rho$ es el coeficiente de correlación entre ambos parámetros.

Si mantenemos constante la densidad de probabilidad conjunta, $Q$ es constante. Esa ecuación describe una elipse en el plano $(L,s)$.

Por tanto:

- Las gaussianas marginales describen las incertidumbres de $L$ y $s$ por separado.
- La elipse describe cómo se distribuyen conjuntamente los valores posibles de ambos parámetros.
- La inclinación de la elipse depende de la correlación $\rho$.
- La anchura de las gaussianas está relacionada con las proyecciones de la distribución conjunta sobre cada eje.

## 3. ¿Qué información adicional aporta la inclinación?

En tu gráfico, la correlación es:

$$ 
\rho=-0{,}79. 
$$

Esto produce una elipse inclinada negativamente. Si $L$ aumenta, los valores de $s$ compatibles con una probabilidad conjunta similar tienden a disminuir.

Podemos verlo mediante la distribución condicional:

$$ 
E[s\mid L]=\hat s+ \rho\frac{\sigma_s}{\sigma_L}(L-\hat L). 
$$

La pendiente de esta relación es:

$$ 
\boxed{\frac{ds}{dL}= \rho\frac{\sigma_s}{\sigma_L}} 
$$

Como $\rho$ es negativo, la pendiente también es negativa.

En cambio, si $\rho=0$, la elipse no estaría inclinada: sus ejes principales serían paralelos a los ejes $L$ y $s$. En ese caso, para una distribución normal bivariante, los dos parámetros serían estadísticamente independientes.

## 4. Una distinción importante: desviación estándar y elipse de una sigma

Hay un detalle matemático relevante para interpretar correctamente tu gráfico.

En una dimensión, el intervalo

$$ 
\hat L\pm\sigma_L 
$$

contiene aproximadamente el 68,27 % de la probabilidad marginal de una gaussiana.

En dos dimensiones, sin embargo, la región elíptica definida por

$$
 Q\leq 1 
 $$

contiene aproximadamente el 39,35 % de la probabilidad conjunta, no el 68,27 %.

Para que una elipse centrada en la estimación contenga el 68,27 % de la probabilidad conjunta, se necesita:

$$ 
Q\leq 2{,}30. 
$$

Por eso conviene comprobar cómo se ha definido exactamente la región etiquetada como $1\sigma$ en el gráfico: podría referirse a una convención de errores marginales o a una región de confianza conjunta.

## 5. Aplicación al gráfico de México 2024

La relación entre las gaussianas y la elipse se resume así:

| Propiedad            | Gaussiana de $L$        | Gaussiana de $s$        | Elipse conjunta                      |
| -------------------- | --------------------------- | --------------------------- | ------------------------------------ |
| Centro               | $\hat L$                | $\hat s$                | $(\hat L,\hat s)$                |
| Incertidumbre        | $\sigma_L$              | $\sigma_s$              | Ambas incertidumbres y su covarianza |
| Anchura              | $\sigma_L$              | $\sigma_s$              | Depende de las dos varianzas         |
| Correlación          | No la determina por sí sola | No la determina por sí sola | Determina la inclinación             |
| Información conjunta | No                          | No                          | Sí                                   |

Conclusión: la elipse es, en esencia, la extensión bidimensional de las gaussianas de incertidumbre. Las dos gaussianas marginales proporcionan las varianzas de $L$ y $s$; la elipse añade la covarianza, que en este caso es negativa y considerable.

Hay una salvedad importante para tu análisis: el gráfico no permite reconstruir por sí solo las dos gaussianas con sus anchuras exactas. Para ello necesitamos las desviaciones estándar marginales del ajuste, o directamente su matriz de covarianza. La incertidumbre estadística de $L$ que aparece en el recuadro no debe confundirse automáticamente con la anchura marginal de $L$ en la elipse, especialmente si hay otros términos de error o convenciones de representación.

---

## Tiene algún nombre por el que sea conocida esta elipse. Se puede hacer una representación tridimensional de estas magnitudes?

Sí. Esta elipse tiene varios nombres conocidos en estadística y en el análisis de errores, y se puede extender a una representación tridimensional que permite comprender mucho mejor la relación entre $L$ y $s$.

## 1. ¿Cómo se llama esta elipse?

Los nombres más habituales son los siguientes:

- Elipse de covarianza (covariance ellipse): destaca que su forma depende de las varianzas y de la covarianza entre los parámetros.
- Elipse de confianza (confidence ellipse): se utiliza cuando representa una región de confianza estadística con un nivel determinado.
- Elipse de error (error ellipse): habitual en astrometría, geodesia y ciencias experimentales.
- Elipse de equiprobabilidad: describe una curva de nivel de una distribución normal bivariante, en la que la densidad de probabilidad es constante.

En el contexto de tu experimento MEE2027, utilizaría preferentemente elipse de covarianza de los parámetros ajustados. Si se conoce el nivel de confianza y se ha construido de acuerdo con su definición estadística, también puede denominarse elipse de confianza.

## 2. ¿Cómo se construye matemáticamente?

La elipse viene determinada por la matriz de covarianza:

$$ 
\mathbf C= \begin{pmatrix} \sigma_L^2 & \operatorname{Cov}(L,s)\\\ \operatorname{Cov}(L,s) & \sigma_s^2 \end{pmatrix} 
$$

Sus elementos son:

- $\sigma_L^2$: varianza de la estimación de la deflexión.
- $\sigma_s^2$: varianza de la escala de placa.
- $\operatorname{Cov}(L,s)$: covarianza entre ambas estimaciones.

La correlación del gráfico, $\rho=-0{,}79$, se relaciona con la covarianza mediante:

$$ 
\operatorname{Cov}(L,s)=\rho,  ~~ \sigma_L\sigma_s. 
$$

Las dimensiones y la orientación de la elipse se obtienen a partir de esta matriz. En particular, sus autovectores determinan las direcciones de los ejes principales y sus autovalores determinan las varianzas en esas direcciones.

## 3. ¿Se puede representar en tres dimensiones?

Sí. Hay una representación especialmente útil: la superficie de densidad de probabilidad de una distribución normal bivariante.

Ejemplo conceptual de una superficie tridimensional de densidad de probabilidad gaussiana bivariante, con contornos elípticos inclinados.

<div style="display: flex; justify-content: center; margin: 50px 0;">
    <img src="assets/Distribución normal Bivariante_5.png" 
         alt="Haz clic para ampliar" 
         width="500">
</div>

[Operaciones algebraicas](https://www.kalmanfilter.net/background2.html?utm_source=chatgpt.com)

En lugar de representar solamente el contorno de la elipse, representamos la densidad de probabilidad conjunta como una altura.

Los tres ejes serían:


**Eje $X$: deflexión $L$**

En segundos de arco. El centro se sitúa en el valor estimado $\hat L$.

**Eje $Y$: escala de placa $s$**

En segundos de arco por píxel. El centro se sitúa en $\hat s$.

**Eje $Z$: densidad de probabilidad conjunta**

La superficie alcanza su máximo en la estimación central y disminuye al alejarnos de ella.

La función que describe la superficie es:

$$ 
p(L,s)= \frac{1}{2\pi\sigma_L\sigma_s\sqrt{1-\rho^2}} \exp\left(-\frac{Q(L,s)}{2}\right) 
$$

donde

$$ 
Q(L,s)=\frac{1}{1-\rho^2} \left[ \frac{(L-\hat L)^2}{\sigma_L^2} +\frac{(s-\hat s)^2}{\sigma_s^2} -\frac{2\rho(L-\hat L)(s-\hat s)} {\sigma_L\sigma_s} \right]. 
$$

El resultado es una especie de campana tridimensional inclinada. Si cortamos esa superficie a una altura constante, obtenemos una curva de nivel elíptica. Al proyectar esos contornos sobre el plano $L,s$, recuperamos la familia de elipses de covarianza.

## 4. ¿Qué ventaja tendría para el experimento de Eddington?

Visualizar la correlación
<div style="display: flex; justify-content: center; margin: 50px 0;">
    <img src="assets/Distribución normal Bivariante_6.png" 
         alt="Haz clic para ampliar" 
         width="300">
</div>

La inclinación de la campana haría visible la relación negativa entre $L$ y $s$. Se apreciaría que ciertos cambios en la deflexión pueden compensarse con cambios en la escala.

Relacionar la superficie con la elipse
<div style="display: flex; justify-content: center; margin: 50px 0;">
    <img src="assets/Distribución normal Bivariante_7.png" 
         alt="Haz clic para ampliar" 
         width="500">
</div>

Las curvas de nivel permitirían comparar las regiones de distinta densidad con la elipse bidimensional original y comprobar cómo cambia su tamaño.

Evaluar la compatibilidad con Einstein
<div style="display: flex; justify-content: center; margin: 50px 0;">
    <img src="assets/Distribución normal Bivariante_8.png" 
         alt="Haz clic para ampliar" 
         width="300">
</div>

Se podría dibujar el plano vertical $L=1,751''$, correspondiente a la predicción teórica. La intersección con la superficie mostraría qué valores de la escala de placa son compatibles con esa predicción dentro del modelo.

Hay que tener presente una distinción: la altura representa densidad de probabilidad, no probabilidad acumulada. Para obtener una probabilidad de que los parámetros estén dentro de una región hay que integrar la densidad sobre esa región.

## 5. ¿Podemos construirla con los datos de tu gráfico?

Sí, pero para construir una superficie cuantitativamente fiel necesitamos conocer las desviaciones estándar marginales $\sigma_L$ y $\sigma_s$, así como la correlación.

Del gráfico conocemos $\rho=-0,79$ y aparece una incertidumbre estadística de $L$ de $0,084''$. Sin embargo, todavía debemos confirmar si ese valor es la desviación estándar marginal representada por la elipse y cuál es la incertidumbre marginal exacta de la escala de placa. El valor de $5,5 \times 10^{-6}" ~ \mathrm{px}$ que aparece en el recuadro podría ser una incertidumbre condicional o una incertidumbre obtenida bajo una convención concreta del ajuste.

Mi recomendación: para presentar los resultados de MEE2027, construiría una figura con dos paneles: a la izquierda, la elipse de covarianza original con la línea vertical de Einstein; a la derecha, la superficie gaussiana tridimensional, con esa misma referencia teórica. Así se mostrarían tanto la incertidumbre estadística como la dependencia entre la calibración instrumental y la deflexión gravitatoria.