<div style="display: flex; justify-content: center; margin: 50px 0;">
    <img src="assets/gráfico de contorno de confianza.webp" 
         alt="Haz clic para ampliar" 
         width="600">
</div>

Este gráfico es un **gráfico de contorno de confianza (o región de credibilidad) de 1 sigma (68%)** que muestra los resultados de una medición científica, específicamente relacionada con la astrofísica y la **Teoría de la Relatividad General de Einstein**.

Aquí tienes una interpretación detallada por partes:

### 1. ¿Qué se está midiendo?
El objetivo es medir la **deflexión de la luz por la gravedad del Sol** (el efecto de lente gravitacional). Esto se hace típicamente durante un eclipse solar total.
*   **Eje X (L):** Representa la deflexión de la luz en el limbo solar, medida en segundos de arco ("). Es el parámetro físico que queremos encontrar.
*   **Eje Y (Escala de placa):** Representa la escala de la imagen (arcosegundos por píxel). Es un parámetro de calibración necesario para convertir los píxeles de la cámara en medidas angulares reales.

### 2. El gráfico y la elipse azul
*   **La cruz azul (+):** Es el "mejor ajuste". Indica los valores más probables para la deflexión (L) y la escala de placa según los datos.
*   **La elipse azul:** Representa el **error de 1 sigma (68% de confianza)**. El hecho de que sea una elipse inclinada hacia abajo indica una **correlación negativa**.
    *   **Interpretación física:** Existe una compensación entre los dos parámetros. Si la escala de la placa es ligeramente mayor, la deflexión calculada (L) debe ser menor para que los datos sigan coincidiendo. Por eso la elipse está inclinada.

### 3. La línea verde (El punto clave)
*   **"Einstein 1.751''":** Esta línea vertical verde marca la predicción teórica de la Relatividad General para la deflexión de la luz en el limbo solar (aproximadamente 1.75 segundos de arco).
*   **Interpretación:** La línea verde cruza la elipse azul. Esto significa que **el resultado experimental es consistente con la teoría de Einstein**. La medición no descarta la teoría; de hecho, el valor central (la cruz) está muy cerca de la línea verde.

### 4. El cuadro de texto (Datos numéricos)
Aquí están los resultados específicos de este análisis ("Pooled Method 2"):
*   **L = 1.804 ± 0.084" (stat):** El valor medido de la deflexión es 1.804. El error estadístico es pequeño. Este valor es cercano a 1.751 (Einstein), aunque ligeramente superior.
*   **± 0.139" (with the atmosphere term 0.11):** Este es el error total (sistemático + estadístico). El error aumenta considerablemente (de 0.084 a 0.139) debido a la incertidumbre en la "atmósfera" (el término 0.11). Esto sugiere que los efectos atmosféricos (refracción, turbulencia) son la mayor fuente de error en este experimento.
*   **Correlación L vs plate scale = -0.79:** Confirma matemáticamente lo que vemos en la elipse. Es una correlación fuerte y negativa.
*   **Datos usados:** Se usaron 639 observaciones de 192 estrellas.

### Conclusión
El gráfico muestra una medición exitosa de la deflexión gravitacional de la luz. **El resultado es compatible con la Relatividad General (línea verde)**, pero la precisión está limitada principalmente por el error atmosférico (el término de 0.11"), lo que hace que el margen de error sea relativamente grande en comparación con la precisión estadística pura.

---

### Significado de la frase: Correlación L vs plate scale = -0.79: Confirma matemáticamente lo que vemos en la elipse. Es una correlación fuerte y negativa.
Claro, vamos a desglosar esa frase en detalle. Para entenderla, hay que dividirla en tres partes: qué significa "Correlación", qué significa "-0.79" y cómo se relaciona con la "elipse" del gráfico.

### 1. ¿Qué es la correlación en este contexto?
En estadística, la correlación mide cómo cambian dos variables juntas. En este caso, las variables son:
*   **L:** La deflexión de la luz (eje X).
*   **Plate Scale:** La escala de la placa (eje Y).

El valor de la correlación siempre va de **-1 a +1**.
*   **+1 (Positiva perfecta):** Si una sube, la otra sube exactamente en la misma proporción.
*   **0 (Nula):** No hay relación; si una sube, la otra hace lo que quiere.
*   **-1 (Negativa perfecta):** Si una sube, la otra baja exactamente en la misma proporción.

### 2. ¿Qué significa el valor "-0.79"?
*   **Es negativa:** Significa que van en **direcciones opuestas**. Si la escala de la placa (Y) aumenta, la deflexión calculada (L, en X) disminuye. Y viceversa.
*   **Es fuerte (cercana a -1):** Un valor de -0.79 es una correlación muy fuerte. No es perfecta (-1.0), pero es lo suficientemente alta como para decir que el comportamiento de una variable está fuertemente ligado al de la otra.

### 3. ¿Cómo se ve esto matemáticamente en la elipse?
Imagina que la elipse azul fuera un círculo perfecto. Eso significaría que no hay correlación (correlación = 0). Podrías cambiar L sin que afecte a la escala de la placa.

Sin embargo, la elipse está **inclinada** (va desde arriba a la izquierda hacia abajo a la derecha). Esa inclinación *es* la representación visual de la correlación negativa.
*   **Matemáticamente:** La fórmula de la elipse de error incluye un término de covarianza. Un valor de -0.79 "aplasta" y "gira" la elipse.
*   **Visualmente:** Si miras la elipse, verás que su eje mayor es diagonal. Esto significa que los datos permiten dos escenarios principales:
    1.  **Escenario A:** Una escala de placa un poco más grande (arriba en el eje Y) y una L un poco más pequeña (izquierda en el eje X).
    2.  **Escenario B:** Una escala de placa un poco más pequeña (abajo en el eje Y) y una L un poco más grande (derecha en el eje X).

### 4. ¿Por qué ocurre esto físicamente? (La interpretación profunda)
Esta es la parte más interesante y la razón por la que el gráfico existe.

En astrofísica, cuando mides la posición de las estrellas durante un eclipse, tienes una **ambigüedad fundamental**:
*   Si asumes que la **escala de la placa es mayor** (es decir, cada píxel cubre más cielo), entonces el desplazamiento aparente de las estrellas (en píxeles) se traduce en un ángulo *menor* (L más pequeña).
*   Si asumes que la **escala de la placa es menor** (cada píxel cubre menos cielo), el mismo desplazamiento en píxeles se traduce en un ángulo *mayor* (L más grande).

**En resumen:** No puedes determinar con precisión absoluta L y la Escala de la Placa al mismo tiempo sin una referencia externa muy precisa. Los datos te dicen: *"O la escala es esta y L es aquella, o la escala es esta otra y L es esta otra"*. Esa incertidumbre combinada es lo que dibuja la elipse inclinada.

**Conclusión de la frase:**
El valor -0.79 confirma matemáticamente que **no son variables independientes**. El gráfico (la elipse) y el número (-0.79) cuentan la misma historia: existe un "tira y afloja" entre la calibración de la imagen y el resultado físico de la deflexión de la luz.

---

### Explica qué es un "gráfico de contorno de confianza (o región de credibilidad) de 1 sigma (68%)"

Para entender esta frase, hay que desglosar tres conceptos estadísticos que son el pan de cada día en la física y la astronomía. Te lo explico de forma sencilla, usando analogías.

### 1. ¿Qué es una "Región de Credibilidad" o "Contorno de Confianza"?
Imagina que estás buscando un tesoro en un mapa. No sabes exactamente dónde está, pero tienes pistas. En lugar de señalar un solo punto exacto (que probablemente sería erróneo), dibujas un **círculo o elipse** en el mapa y dices: *"Creo que el tesoro está dentro de esta área"*.

En ciencia, cuando medimos algo (como la deflexión de la luz, **L**, y la escala de la placa), nunca obtenemos un valor único y perfecto. Obtenemos una **distribución de probabilidad**. 
*   La **cruz azul (+)** de tu gráfico es el "mejor punto" (el centro de la zona más probable).
*   La **elipse azul** es esa "región de credibilidad": es el área del mapa donde es más probable que se encuentre el valor verdadero.
*   El término "contorno" viene de la cartografía: es como una línea de nivel en un mapa topográfico que encierra una "montaña" de probabilidad.

### 2. ¿Qué significa "1 sigma"?
En estadística, cuando los errores se distribuyen de forma normal (la clásica campana de Gauss), usamos la "desviación estándar", representada por la letra griega **sigma (σ)**.
*   **1 sigma (1σ):** Es el rango de valores que están a una distancia de la media tal que abarcan la mayor parte de los casos. 
*   En una distribución normal, **el 68% de los resultados caerán dentro de 1 sigma**.
*   2 sigma abarcaría el 95% de los casos.
*   3 sigma abarcaría el 99.7% (aquí ya hablamos de descubrimientos casi seguros).

### 3. ¿Qué significa "68%"?
Es la traducción de "1 sigma" a porcentaje. 

Cuando ves la elipse azul en tu gráfico, esa línea azul es la **frontera del 68%**. 

**¿Qué te está diciendo eso realmente?**
Significa que, según los datos y el modelo estadístico utilizado, **hay un 68% de probabilidad de que los valores verdaderos de L y la Escala de la Placa estén dentro de esa elipse azul**. 
Hay un 32% de probabilidad de que estén fuera (en los bordes del gráfico).

### 4. ¿Cómo se conecta todo esto en tu gráfico?
*   **El centro (la cruz):** Es el valor más probable (L=1.804, Escala=1.847363).
*   **La elipse azul (1σ / 68%):** Es la zona de "confianza". Si repitieras este experimento 100 veces, en 68 de esas ocasiones, el resultado caería dentro de esa elipse.
*   **La línea verde (Einstein 1.751'):** Cruza la elipse azul. Esto es clave. Significa que el valor teórico de Einstein **cae dentro del rango de valores que consideramos estadísticamente probables (el 68%)**. Por eso decimos que el experimento "confirma" o es "consistente" con la teoría de Einstein. Si la línea verde hubiera quedado muy lejos de la elipse, habría sido evidencia en contra de la teoría.

### Resumen práctico
Un "gráfico de contorno de confianza de 1 sigma (68%)" es una herramienta visual que responde a la pregunta: **"No solo me digas cuál es el valor más probable, dime también cuál es el rango de valores que son razonablemente posibles dado el ruido de mis datos"**. La elipse es ese rango, y el 68% es la probabilidad asociada a él.

---
### Explica qué es un "gráfico de contorno de confianza (o región de credibilidad) de 1 sigma (68%)"

Para entender esta frase, hay que desglosar tres conceptos estadísticos que son el pan de cada día en la física y la astronomía. Te lo explico de forma sencilla, usando analogías.

### 1. ¿Qué es una "Región de Credibilidad" o "Contorno de Confianza"?
Imagina que estás buscando un tesoro en un mapa. No sabes exactamente dónde está, pero tienes pistas. En lugar de señalar un solo punto exacto (que probablemente sería erróneo), dibujas un **círculo o elipse** en el mapa y dices: *"Creo que el tesoro está dentro de esta área"*.

En ciencia, cuando medimos algo (como la deflexión de la luz, **L**, y la escala de la placa), nunca obtenemos un valor único y perfecto. Obtenemos una **distribución de probabilidad**. 
*   La **cruz azul (+)** de tu gráfico es el "mejor punto" (el centro de la zona más probable).
*   La **elipse azul** es esa "región de credibilidad": es el área del mapa donde es más probable que se encuentre el valor verdadero.
*   El término "contorno" viene de la cartografía: es como una línea de nivel en un mapa topográfico que encierra una "montaña" de probabilidad.

### 2. ¿Qué significa "1 sigma"?
En estadística, cuando los errores se distribuyen de forma normal (la clásica campana de Gauss), usamos la "desviación estándar", representada por la letra griega **sigma (σ)**.
*   **1 sigma (1σ):** Es el rango de valores que están a una distancia de la media tal que abarcan la mayor parte de los casos. 
*   En una distribución normal, **el 68% de los resultados caerán dentro de 1 sigma**.
*   2 sigma abarcaría el 95% de los casos.
*   3 sigma abarcaría el 99.7% (aquí ya hablamos de descubrimientos casi seguros).

### 3. ¿Qué significa "68%"?
Es la traducción de "1 sigma" a porcentaje. 

Cuando ves la elipse azul en tu gráfico, esa línea azul es la **frontera del 68%**. 

**¿Qué te está diciendo eso realmente?**
Significa que, según los datos y el modelo estadístico utilizado, **hay un 68% de probabilidad de que los valores verdaderos de L y la Escala de la Placa estén dentro de esa elipse azul**. 
Hay un 32% de probabilidad de que estén fuera (en los bordes del gráfico).

### 4. ¿Cómo se conecta todo esto en tu gráfico?
*   **El centro (la cruz):** Es el valor más probable (L=1.804, Escala=1.847363).
*   **La elipse azul (1σ / 68%):** Es la zona de "confianza". Si repitieras este experimento 100 veces, en 68 de esas ocasiones, el resultado caería dentro de esa elipse.
*   **La línea verde (Einstein 1.751'):** Cruza la elipse azul. Esto es clave. Significa que el valor teórico de Einstein **cae dentro del rango de valores que consideramos estadísticamente probables (el 68%)**. Por eso decimos que el experimento "confirma" o es "consistente" con la teoría de Einstein. Si la línea verde hubiera quedado muy lejos de la elipse, habría sido evidencia en contra de la teoría.

### Resumen práctico
Un "gráfico de contorno de confianza de 1 sigma (68%)" es una herramienta visual que responde a la pregunta: **"No solo me digas cuál es el valor más probable, dime también cuál es el rango de valores que son razonablemente posibles dado el ruido de mis datos"**. La elipse es ese rango, y el 68% es la probabilidad asociada a él.

---

### Por qué correlación 0 daría una circunferencia?

Es una excelente pregunta. La afirmación que hice antes ("correlación 0 daría una circunferencia") es una simplificación visual muy común, pero requiere un matiz matemático importante para entenderse del todo. Vamos a desglosarlo.

### 1. La intuición visual: La nube de puntos
Imagina que en lugar de una elipse, dibujamos cada una de las 639 observaciones como un puntito en el gráfico (un diagrama de dispersión).

*   **Si hay correlación (como -0.79):** Los puntos forman una nube alargada y diagonal. Si sabes que un punto está muy a la derecha (L alta), sabes que probablemente estará abajo (Escala baja). La nube está "inclinada".
*   **Si la correlación es 0:** Los puntos forman una nube **redonda** (o cuadrada). Si sabes que un punto está a la derecha, no tienes ni idea de si estará arriba, abajo o en el medio. La posición en X no te dice nada sobre la posición en Y.

Cuando calculas la región de confianza (la elipse) de una nube de puntos redonda, el resultado es un círculo (o una elipse perfectamente alineada con los ejes).

### 2. La explicación matemática: La matriz de covarianza
Para dibujar esa elipse, los estadísticos calculan algo llamado **Matriz de Covarianza**. Esta matriz es como una "receta" que dice cómo se estiran los datos. Se ve así:

$$
\begin{pmatrix} Varianza_X & Covarianza_{XY} \\ Covarianza_{XY} & Varianza_Y \end{pmatrix}
$$

*   **La diagonal (Varianza):** Te dice cuánto se estira la elipse en horizontal (X) y en vertical (Y). Es el "grosor" y la "altura".
*   **Fuera de la diagonal (Covarianza):** Es el término que **gira** la elipse. Aquí es donde entra la correlación.
    *   La correlación es simplemente la Covarianza dividida por el producto de las desviaciones estándar.
    *   **Si la correlación es 0, la Covarianza es 0.** Ese término fuera de la diagonal desaparece.
    *   Cuando ese término es cero, la ecuación matemática de la elipse pierde su término "xy" (el que la inclina). La elipse queda perfectamente alineada con los ejes X e Y (como una cruz, no como una diagonal).

### 3. El matiz importante (por qué dije "circunferencia" y no "elipse recta")
Aquí está la corrección fina: **Correlación 0 no garantiza una circunferencia perfecta, garantiza una elipse "recta" (sin inclinación).**

Para que sea un **círculo perfecto**, deben cumplirse *dos* condiciones:
1.  Que la correlación sea 0 (no esté inclinada).
2.  Que la varianza en X sea **exactamente igual** a la varianza en Y (el error en L sea del mismo tamaño que el error en la escala de la placa).

Si la correlación es 0, pero el error en L es enorme (varianza X grande) y el error en la escala de placa es minúsculo (varianza Y pequeña), obtendrías una elipse muy achatada, pero perfectamente horizontal. No sería un círculo, sino un "puro" alargado.

### 4. Aplicado a tu gráfico
En tu gráfico, la elipse está **inclinada hacia la derecha-abajo**. Eso ocurre *exclusivamente* porque la covarianza es negativa (correlación -0.79).

Si la correlación fuera 0, esa elipse se enderezaría. Se convertiría en una elipse con su eje mayor perfectamente horizontal y su eje menor perfectamente vertical (o viceversa, dependiendo de cuál error sea mayor). Si además los errores fueran iguales, sería un círculo. 

**En resumen:** La correlación es el "ángulo de giro" de la elipse. Si es 0, el ángulo de giro es 0 (está recta). Por eso, en las explicaciones rápidas, se dice que "correlación 0 = círculo", asumiendo que los errores en ambos ejes son similares.

---

### Referencias
Aquí tienes una selección de referencias en PDF, organizadas por temas, que cubren los conceptos estadísticos que hemos estado discutiendo: **regiones de confianza, elipses de error, covarianza y correlación**.

#### 📚 Fundamentos de Elipses de Confianza y Covarianza

*   **"Combination of Multivariate Gaussian Distributions through Error Ellipses"** (Erten & Deutsch, University of Alberta): Un documento muy didáctico que explica paso a paso cómo construir una elipse de confianza para una distribución gaussiana bivariada, incluyendo la derivación de sus ecuaciones.
*   **"How to draw a covariance error ellipse?"** (University of Utah): Una guía práctica y concisa que muestra cómo dibujar una elipse de error a partir de una matriz de covarianza, con ejemplos de código y explicaciones sobre el efecto de la covarianza en la orientación de la elipse.
*   **"Statistics Gaussian I"** (M.A. Thomson, indico.global): Un documento técnico que deriva las ecuaciones de la elipse de error general con correlaciones, mostrando la relación matemática entre el ángulo de rotación de la elipse y el coeficiente de correlación.
*   **"Correlations and Contours"** (University of Utah): Explica de forma intuitiva cómo la forma y rotación de las elipses de confianza (contornos de chi-cuadrado) se relacionan directamente con el grado de correlación entre dos parámetros.

#### 🔬 Aplicaciones en Astrofísica y Física de Partículas

*   **"Review of Particle Physics: Statistics"** (Particle Data Group, pdg.lbl.gov): Un capítulo de referencia fundamental en física de partículas. Explica la construcción de regiones de confianza multivariantes usando la matriz de covarianza completa y cómo se visualizan como elipses de error estándar.
*   **"Approximate confidence intervals/regions from the likelihood function"** (G. Cowan, TAE 2017): Una presentación que cubre el uso de la función de verosimilitud para obtener intervalos y regiones de confianza aproximadas, incluyendo el caso específico para un nivel de confianza del 68.3% (1 sigma).

#### 🇪🇸 Recursos en Español

*   **"Proyección de elipses para el cálculo de intervalos de confianza individuales..."** (Universidad Carlos III de Madrid): Un capítulo de tesis que trata sobre regiones de confianza para variables correlacionadas, explicando que su forma es una elipse cuya inclinación depende de la correlación existente.
*   **"Elipse de confiança"** (Universidade Federal de Itajubá, Brasil): Una disertación que define la elipse de confianza como una representación gráfica de la incertidumbre en análisis multivariados, mostrando la ecuación que relaciona la matriz de varianza-covarianza con la forma de la elipse.

#### 📖 Conceptos Estadísticos Básicos

*   **"Stat04-Normal"** (CSULB): Un documento introductorio que explica la distribución normal y el significado del intervalo de confianza del 68% (1 sigma), un concepto fundamental para entender las regiones de credibilidad.

Espero que este material te sea de gran ayuda. Si te surge alguna otra duda, no dudes en consultarme.