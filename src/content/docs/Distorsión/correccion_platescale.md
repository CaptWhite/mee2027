## Corregir el platescale con las nuevas correcciones

Esta rutina se encarga de **aplicar formalmente todas las correcciones calculadas al vector de estado del telescopio (`q`)**, generando una nueva tupla actualizada llamada `corrected_q`.

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
---


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



#### Conclusión del bloque de código

Con esta asignación, el script cierra formalmente el bucle de calibración astrométrica. Reúne las correcciones de escala (multiplicativa), de posición esférica (aditivas) y de orientación (sustractiva) en una sola estructura lineal, dejando el sistema listo para que cualquier cálculo o apuntado posterior coincida exactamente con la realidad física del cielo nocturno.