# Descripción Teórica y Matemática de `my_gravity_sweep.py`

Este documento proporciona una descripción formal, teórica y matemática del funcionamiento del módulo de barrido y optimización de la deflexión de la luz implementado en `my_gravity_sweep.py`.

---

## Índice
1. [Introducción y Contexto Histórico](#1-introducción-y-contexto-histórico)
2. [Fundamentos Físico-Matemáticos](#2-fundamentos-físico-matemáticos)
   - [2.1 Deflexión Relativista de la Luz (Lente Gravitacional)](#21-deflexión-relativista-de-la-luz-lente-gravitacional)
   - [2.2 Modificación de la Masa Solar en ERFA (SOFA)](#22-modificación-de-la-masa-solar-en-erfa-sofa)
   - [2.3 La Función de Costo de Residuos Astrométricos](#23-la-función-de-costo-de-residuos-astrométricos)
   - [2.4 Optimización Simplex No Lineal (Nelder-Mead)](#24-optimización-simplex-no-lineal-nelder-mead)
   - [2.5 Análisis de Incertidumbre y Errores](#25-análisis-de-incertidumbre-y-errores)
3. [Descripción de la API del Módulo](#3-descripción-de-la-api-del-módulo)
4. [Bibliografía y Referencias de Soporte](#4-bibliografía-y-referencias-de-soporte)

---

## 1. Introducción y Contexto Histórico

El script [my_gravity_sweep.py](file:///c:/Users/captw/workspaces/MEE2027/MEE2024.v6/Source/mee2024/_working3/my_gravity_sweep.py) implementa una metodología numérica avanzada para medir experimentalmente la constante de deflexión gravitacional de la luz solar (originalmente observada por Arthur Eddington durante el eclipse solar de 1919). 

La teoría de la Relatividad General de Albert Einstein predice que la luz de las estrellas de fondo se curva al pasar cerca de una masa masiva como la del Sol debido a la curvatura del espacio-tiempo. En el limbo solar, esta desviación alcanza teóricamente $1.7512$ segundos de arco. El propósito de este módulo es buscar el factor de escala de deflexión gravitacional $g$ que minimice la discrepancia geométrica (residuos astrométricos) de los centroides de estrellas observadas tras corregir la distorsión del sensor óptico.

---

## 2. Fundamentos Físico-Matemáticos

### 2.1 Deflexión Relativista de la Luz (Lente Gravitacional)

Para un rayo de luz que pasa a una distancia de impacto (mínima aproximación al centro de masa) $d$ de un cuerpo esférico no rotatorio de masa $M$, la Relatividad General predice un ángulo de deflexión total $\Delta\Phi$ en radianes de:

$$
\Delta\Phi = \frac{4 G M}{c^2 d}
$$

donde $G$ es la constante de gravitación universal y $c$ es la velocidad de la luz en el vacío.

En términos astronómicos observacionales, si $\theta$ es la distancia angular real entre la estrella y el centro del Sol, la distancia de impacto se aproxima mediante:

$$
d \approx R_\odot \sin\theta
$$

donde $R_\odot$ representa el radio físico del Sol.

Sustituyendo los valores físicos del Sol ($M_\odot \approx 1.989 \times 10^{30}\ \text{kg}$, $R_\odot \approx 6.963 \times 10^8\ \text{m}$), el ángulo de deflexión teórica de Einstein en el limbo solar ($d = R_\odot$) es:

$$
\alpha_{limbo} = \frac{4 G M_\odot}{c^2 R_\odot} \approx 8.49 \times 10^{-6}\ \text{rad} \approx 1.7512''
$$


Para una estrella con una separación angular $\Phi$ respecto al centro del Sol, la magnitud de la deflexión radial angular (hacia afuera del Sol) es:

$$
\Delta\Phi(\Phi) = \frac{1.7512''}{\sin\Phi}
$$


---

### 2.2 Modificación de la Masa Solar en ERFA (SOFA)

La biblioteca estándar de astrometría ERFA calcula el efecto de deflexión gravitacional utilizando la función `erfa.ld` (Light Deflection). Esta función requiere un parámetro físico de masa del cuerpo deflector denotado en el software como `bm`.

Para permitir una calibración experimental y estimar la deflexión real presente en las imágenes, `my_gravity_sweep.py` implementa un hackeo dinámico del puntero de ejecución de `erfa.ld`. Se redefine la función de cálculo del desplazamiento gravitacional de la siguiente manera:
```python
def variable_ld(relative_gravity):
    def f(bm, *args):
        return self.origin_ld(bm * relative_gravity, *args)
    return f
```
donde `relative_gravity` es una constante que escala la masa solar efectiva.

Si parametrizamos la masa efectiva a través de un coeficiente experimental $g$ que representa la deflexión del limbo solar en segundos de arco, la masa relativa se define como:

$$
\text{relative\_gravity} = \frac{g}{1.751}
$$


Esto resulta en una masa física efectiva de:

$$
M_{eff} = M_\odot \cdot \left(\frac{g}{1.751}\right)
$$


Al alimentar este valor a la ecuación de Einstein, la deflexión del limbo resultante calculada por la biblioteca de astrometría pasa a ser exactamente de $g$ segundos de arco:

$$
\alpha_{limbo}(g) = \frac{4 G M_{eff}}{c^2 R_\odot} = \frac{4 G M_\odot}{c^2 R_\odot} \left(\frac{g}{1.751}\right) \approx 1.751 \left(\frac{g}{1.751}\right) = g''
$$


---

### 2.3 La Función de Costo de Residuos Astrométricos

Para evaluar qué coeficiente de deflexión $g$ modela mejor las posiciones observadas en la imagen, el programa calcula los residuos de ajuste astrométrico.

Para cada valor candidato de $g$:
1. Las posiciones de catálogo originales se corrigen gravitacionalmente empleando el Sol de masa modificada $M_{eff}(g)$ a través de la clase `AstroCorrect`.
2. Las estrellas del catálogo resultantes se proyectan en el plano de la placa y se emparejan con los centroides de píxeles observados.
3. Se ejecuta el ajuste polinomial cúbico iterativo utilizando `do_cubic_fit`. Esto genera coordenadas de píxeles observadas corregidas de distorsión $\mathbf{x}_{corrected, i}$ y la solución de escala refinada.
4. Las coordenadas finales proyectadas en el cielo de la imagen se comparan con las coordenadas celestes corregidas en base a la norma de la diferencia de sus vectores de posición unitaria en 3D:

$$
e_i(g) = \|\mathbf{v}_{obs, i} - \mathbf{v}_{cata, i}(g)\|_2
$$

5. El error residual global a minimizar se define como el error cuadrático medio (RMS) convertido a segundos de arco:

$$
E_{RMS}(g) = \left( \sqrt{\frac{1}{N} \sum_{i=1}^N e_i^2(g)} \right) \times 3600 \times \frac{180}{\pi}
$$


---

### 2.4 Optimización Simplex No Lineal (Nelder-Mead)

El comportamiento de los residuos $E_{RMS}(g)$ con respecto al parámetro $g$ es no lineal debido a que la deflexión de la luz afecta la calibración WCS iterativa y la estimación de coeficientes de distorsión. El software utiliza el método simplex de Nelder-Mead implementado en `scipy.optimize.minimize` para resolver la optimización de un único parámetro:

$$
g_{opt} = \arg\min_g E_{RMS}(g)
$$

con un valor de inicialización inicial de $g_0 = 0$.

---

### 2.5 Análisis de Incertidumbre y Errores

#### 1. Estimación Ingenua del Error Estándar (Naive Uncertainty)
Para caracterizar la precisión de la medición del coeficiente de deflexión de la luz a partir de la distribución estocástica de los residuos estelares, el programa define una incertidumbre estándar aproximada basada en la variabilidad residual combinada con el número de muestras $N$:

$$
\sigma_{naive} = \frac{E_{RMS}(g_{opt})}{\sqrt{N}}
$$


Esta incertidumbre se expresa como un porcentaje relativo del valor teórico esperado de la Relatividad General ($1.751''$):

$$
\text{Incertidumbre Naive (\%)} = 100 \times \frac{\sigma_{naive}}{1.751}
$$


#### 2. Desviación Sistemática de la Relatividad General
La discrepancia final obtenida entre el resultado experimental del ajuste y la predicción relativista pura se evalúa mediante la relación:

$$
\text{Discrepancia (\%)} = 100 \times \frac{g_{opt} - 1.751}{1.751}
$$


---

## 3. Descripción de la API del Módulo

### Función Principal

#### `gravity_sweep(stardata0, plate2, initial_guess, image_size, mask_select, mask_select2, starttime, basename, options)`
* **Propósito:** Realiza un barrido lineal preliminar de 20 puntos de control para graficar los residuos y ejecuta la optimización fina por Nelder-Mead del parámetro $g$. Retorna el parámetro optimizado y recalcula el ajuste de distorsión final.
* **Entradas:**
  - `stardata0` (StarData): Conjunto de estrellas de catálogo Gaia sin corrección previa de deflexión gravitacional.
  - `plate2` (np.ndarray): Centroides de píxeles observados en el detector.
  - `initial_guess` (tuple): Solución WCS de inicialización del resolvedor de placas.
  - `image_size` (tuple): Dimensiones de la imagen en píxeles.
  - `mask_select` (np.ndarray): Máscara binaria que representa el primer emparejamiento con el catálogo.
  - `mask_select2` (np.ndarray): Máscara binaria que indica la exclusión de outliers y estrellas dobles.
  - `starttime` (str): Marca de tiempo del proceso.
  - `basename` (str): Nombre base del archivo de la imagen.
  - `options` (dict): Diccionario general con los parámetros de configuración.
* **Salidas:** Escribe un archivo gráfico (`ECLIPSE_L_SWEEP...png`) que ilustra la curva de los residuos de calibración y retorna:
  - `result1.x[0]`: El parámetro de deflexión optimizado $g_{opt}$ en segundos de arco.
  - `(result, plate2_corrected, coeff_x, coeff_y, platescale_stderror)`: El resultado de la calibración astrométrica final refinada con la masa solar optimizada.

---

## 4. Bibliografía y Referencias de Soporte

1. **Einstein, A. (1916).** *Die Grundlage der allgemeinen Relativitätstheorie*. Annalen der Physik, 354(7), 769-822.
   - *Artículo fundacional donde Einstein predice la desviación de la luz de $1.75$ segundos de arco en el limbo solar debido a la distorsión del espacio-tiempo.*

2. **Dyson, F. W., Eddington, A. S., & Davidson, C. (1920).** *A Determination of the Deflection of Light by the Sun's Gravitational Field, from Observations Made at the Total Eclipse of May 29, 1919*. Philosophical Transactions of the Royal Society of London. Series A, 220, 291-333.
   - [Enlace del Artículo](https://royalsocietypublishing.org/doi/10.1098/rsta.1920.0009)
   - *Reporte histórico de la expedición británica que validó experimentalmente la Relatividad General, estableciendo la base del método de comparación astrométrica.*

3. **ERFA Library (Essential Routines for Fundamental Astronomy) (2023).** *SOFA Software Collection & ERFA C-library implementation*.
   - [Página de ERFA en GitHub](https://github.com/liberfa/erfa)
   - *Especificaciones del algoritmo `ld` para calcular la refracción y deflexión gravitacional tridimensional de fotones en marcos astronómicos terrestres y celestes.*

4. **Nelder, J. A., & Mead, R. (1965).** *A simplex method for function minimization*. The Computer Journal, 7(4), 308-313.
   - [DOI: 10.1093/comjnl/7.4.308](https://doi.org/10.1093/comjnl/7.4.308)
   - *Describe el método simplex multidimensional utilizado para resolver optimizaciones no lineales sin derivadas directas.*
