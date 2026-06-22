## OPCIONES DE TRABAJO DE LA PANTALLA DE APILADO

El archivo `C:\Users\captw\AppData\Local\MEE2024\MEE2024\MEE_config.txt` almacena los parámetros del programa, incluyendo los directorios de entrada y salida. Se actualiza automáticamente cada vez que se ejecuta el programa, y ​​también se puede editar manualmente.


---

### 1. Remove big bright object (blob) - `delete_saturated_blob`
* **Efecto Algorítmico:** Actúa como un interruptor booleano (`True` o `False`) para activar o desactivar la rutina de supresión de manchas saturadas.
* **Impacto:**
  * Si es `False`, la función aborta inmediatamente al inicio (líneas 124-125) devolviendo la imagen original sin alteraciones y dos máscaras vacías (`zeros`).
  * Si es `True`, se ejecuta todo el procesamiento de detección por submuestreo, etiquetado de regiones conexas y enmascaramiento convexo.

> [!NOTE]
> La opción "Eliminar objetos brillantes grandes" es útil cuando las imágenes contienen el Sol o la Luna. Puede mantenerse activada para campos estelares sin Sol ni Luna.

---

### 2. saturation level (%) - `blob_saturation_level` 
* **Efecto Algorítmico:** Establece el umbral de intensidad para considerar que un píxel está "saturado", calculado como un porcentaje del brillo máximo de la imagen:

$$
\text{sat\_val} = I_{\text{máx}} \times \left( \frac{\text{blob\_saturation\_level}}{100} \right)
$$

* **Impacto:** 
  * Permite flexibilizar la detección de regiones quemadas. Por ejemplo, si se configura en `90`, cualquier píxel cuyo valor sea mayor o igual al $90\%$ del píxel más brillante de la imagen será catalogado como parte del "blob" saturado.
  * Esto es fundamental porque muchas cámaras astronómicas no llegan al valor digital máximo absoluto (como 65535) debido al ajuste de ganancia u offset, pero aun así presentan zonas de sobredestello que deben ser eliminadas.

---

### 3. blob_radius_extra - `blob_radius_extra` 
* **Efecto Algorítmico:** Determina el tamaño en píxeles (con respecto a la imagen original) de la **máscara de eliminación** (`mask_1`) a partir del límite de la envolvente convexa del blob saturado.
* **Impacto:**
  * Los píxeles contenidos dentro del área delimitada por esta máscara expandida se sobreescriben con el percentil 5 del fondo de la imagen, eliminándolos visualmente:

$$
I(y, x) \leftarrow P_5(I) \quad \forall (y, x) \in \text{mask\_1}
$$

  * Un radio mayor asegura que se elimine no solo la zona saturada central, sino también los halos de difracción, resplandores ópticos y la dispersión atmosférica circundante de estrellas masivas.

> [!NOTE]
> El parámetro `blob_radius_extra_` determina la zona de exclusión adicional fuera de la región saturada. La distancia "extra" se mide en píxeles.

---

### 4. centroid_gap_blob - `centroid_gap_blob` 
* **Efecto Algorítmico:** Define el ancho del "anillo protector" de seguridad alrededor de la zona eliminada. Genera una segunda máscara más amplia (`mask_2` o `radius2`) donde:

$$
\text{radius2} = \text{blob\_radius\_extra} + \text{centroid\_gap\_blob}
$$

* **Impacto:**
  * Los píxeles en esta zona de seguridad no se oscurecen (la imagen permanece intacta allí), pero se emplean en `get_centroids_blur` para **bloquear la detección de centroides estelares** (se fuerza la señal a cero en `sub[mask2] = 0` y `passed[mask2_expand] = 0`).
  * Evita la aparición de centroides espurios (estrellas fantasmas) en la periferia de la estrella gigante eliminada, donde el degradado de intensidad o la transición abrupta de la zona parcheada podría engañar al detector de centro de masas de SciPy.

> [!NOTE]
> El parámetro `centroid_gap_blob_` determina qué centroides fuera de la zona de exclusión adicional deben ignorarse. La distancia "gap" se mide en píxeles.
> Los parámetros predeterminados son (100, 30), pero ninguno es particularmente sensible.
---

Las opciones `centroid_gaussian_subtract` y `sensitive_mode_stack` controlan qué algoritmos de extracción de centroides estelares se utilizan en las diferentes etapas del procesamiento:

### 5. Sensitive stacking mode  - `centroid_gaussian_subtract`
* **Efecto en imágenes individuales (alineación):**
  Controla el algoritmo de detección de estrellas utilizado en cada una de las imágenes de luz (*lights*) individuales para calcular su alineación y desplazamiento relativo.
  * **Si es `True`:** El detector utiliza el **algoritmo avanzado/sensible** (`get_centroids_blur`). Este realiza una sustracción adaptativa del fondo (con desenfoque gaussiano o caja), calcula la varianza del ruido de fondo local para normalizar la señal en base a la significancia estadística (SNR local) y aplica filtros rigurosos de perfil estelar (*sanity check* de monotonicidad radial).
  * **Si es `False`:** El detector de imágenes individuales realiza un **procesamiento rápido y simplificado** (`simple_get_centroids`). Este utiliza un fondo de caja uniforme plano y un umbral global basado en el ruido RMS general de la imagen (método clásico estilo *Tetra*).

> [!NOTE]
> El "modo de apilamiento sensible" solo debe usarse si las imágenes contienen el Sol o la Luna o si se toman en un cielo brillante (por ejemplo, al anochecer).
> Para campos estelares en cielos oscuros, este modo tardará demasiado y no se recomienda.
---

### 6. Use sensitive mode on stacked result -  `sensitive_mode_stack`
* **Efecto en la imagen apilada final:**
  Controla específicamente la detección de centroides sobre el resultado final del apilamiento (`stacked`), el cual se utilizará para realizar el *platesolving* e identificación final de estrellas.
* **Mapeo Lógico en el Código:**
  Al procesar la imagen final acumulada, el script inyecta dinámicamente un valor al parámetro interno del detector mediante la siguiente lógica:
  ```python
  'centroid_gaussian_subtract': options['centroid_gaussian_subtract'] or options['sensitive_mode_stack']
  ```
* **Impacto:**
  * **Permite un flujo híbrido:** Habilita el uso del algoritmo avanzado de detección de estrellas (`get_centroids_blur`) **exclusivamente sobre la imagen final acumulada (`stacked`)**, incluso si las imágenes individuales de entrada se alinearon de forma rápida mediante el detector simple (`simple_get_centroids` con `centroid_gaussian_subtract=False`).
  * Esto es sumamente eficiente: permite realizar una alineación inicial veloz con el método simplificado y luego explotar la profundidad e incremento de SNR del stack final utilizando la detección ultra-sensible para identificar estrellas extremadamente tenues para el *platesolving*.

> [!NOTE]
> La opción "Usar modo sensible en el resultado apilado" puede dejarse activada para la mayoría de las imágenes que requieren una detección precisa del centroide, pero los parámetros de sensibilidad deben ajustarse en consecuencia.

---

En la rutina `get_centroids_blur`, las opciones `sigma_subtract`, `centroid_gaussian_thresh` y `min_area` regulan la sensibilidad, el filtrado de ruido y el tamaño mínimo de detección de las estrellas. Sus efectos son los siguientes:


### 7. sigma_subtract -  `sigma_subtract`
* **Efecto Algorítmico:** Actúa como una barrera de supresión de ruido de fondo (umbral de corte estadístico) tras normalizar la señal por el ruido local:

$$
\text{data} = \max\left( \frac{I - \text{Blur}}{\sqrt{\sigma^2_{\text{local}}}} - \text{sigma\_subtract}, 0 \right)
$$

* **Impacto:**
  * Al restar este valor (por ejemplo, `3`), se reducen a cero todas las fluctuaciones estocásticas de intensidad de baja significancia (que están cerca del nivel de ruido promedio local del cielo).
  * Limpia el fondo de la imagen, aislando los picos donde realmente residen las estrellas y previniendo la binarización de parches gigantescos de ruido en zonas oscuras.

> [!NOTE]
> Un valor de _sigma_subtract_ mayor aumentará el umbral de fondo, eliminando así más ruido y reduciendo el número de centroides detectados (entre 0 y _sigma_thresh_ -2 son valores típicos). Para buenas imágenes de cielo oscuro, (5.0, 4, 3.0) son valores razonables.

---

### 8. sigma_thresh [sensitive-mode] - `centroid_gaussian_thresh`
* **Efecto Algorítmico:** Es el **umbral definitivo de binarización** para decidir si un píxel (que ya ha sido normalizado y limpiado por `sigma_subtract`) es parte de una estrella candidata:

$$
\text{passed} = \text{data} > \text{centroid\_gaussian\_thresh}
$$

* **Impacto:**
  * Define la máscara booleana `passed` sobre la cual se buscarán las estrellas conectadas.
  * Si el valor se configura muy bajo, el algoritmo se vuelve extremadamente sensible, permitiendo capturar estrellas sumamente tenues a costa de admitir falsos positivos (picos de ruido aleatorio).
  * Si se configura muy alto, solo las estrellas muy brillantes e inequívocas serán detectadas, asegurando una alineación limpia pero reduciendo la cantidad de estrellas disponibles en campos estelares poco densos.

> [!NOTE]
> Un valor de _sigma_thresh_ menor aumentará la sensibilidad (entre 4 y 7 son valores típicos).
---

### 9. min_area (pixels) [sensitive-mode]  - `min_area`
* **Efecto Algorítmico:** Define el **área mínima en píxeles** (número de píxeles contiguos en la máscara binarizada `passed`) que debe cubrir un objeto para ser aceptado como una estrella real.
* **Impacto:**
  * Filtra y descarta automáticamente los centroides cuyo tamaño sea inferior a este umbral (típicamente configurado entre `3` y `5` píxeles).
  * Su objetivo es purgar del catálogo de centroides cualquier falsa estrella generada por ruido impulsivo del sensor de un solo píxel (como píxeles calientes, ruido de lectura aleatorio o el impacto de rayos cósmicos), que de otro modo generarían problemas en el algoritmo de alineación.

> [!NOTE]
> Un valor de _min_area_ menor implicará la detección de centroides de menor tamaño de píxel (entre 1 y 4 son valores típicos).
---

Las opciones `background_subtraction_mode` y `remove_edgy_centroids` tienen los siguientes efectos sobre el modelado del fondo de la imagen y la limpieza de centroides espurios:

### 10. - background subtraction mode - `background_subtraction_mode`
* **Efecto Algorítmico:** Determina el filtro matemático que se utiliza para estimar y modelar el fondo de luz de la imagen (el cual luego es sustraído para que las estrellas resalten sobre un fondo negro plano).
* **Impacto:**
  * **Si es `'Gaussian'`:** Utiliza un filtro de desenfoque gaussiano de tamaño de núcleo configurable (`ksize`, ej. 17). Proporciona un suavizado estadísticamente óptimo con una curva de ponderación normal, ideal para campos estelares limpios.
  * **Si es `'Box'` (u otra opción por defecto):** Aplica un algoritmo de **doble desenfoque de caja** (*double box blur*), restando un filtro de caja pequeño interno (de tamaño 3) de un filtro de caja grande externo (de tamaño `ksize`) ponderados por sus áreas. Este método actúa de forma similar a un filtro de tipo *Top-Hat*, siendo muy eficiente para eliminar gradientes térmicos locales, contaminación lumínica o viñeteo óptico severo sin erosionar el núcleo puntual de las estrellas débiles.

---

### 11. Remove centroids near edges  - `remove_edgy_centroids`
* **Efecto Algorítmico:** Es un interruptor booleano (`True` o `False`) que activa o desactiva la remoción inteligente de estrellas candidatas que se localizan en los márgenes exteriores de la imagen apilada final.
* **Impacto:**
  * Si es `True`, el programa ejecuta la función `filter_edgy_centroids` sobre los centroides del stack. Esta rutina analiza la distribución de gradientes de intensidad direccionales y su mediana alrededor de cada candidato de borde. 
  * Si la distribución de gradientes es asimétrica o presenta discontinuidades (lo que delata un corte brusco del sensor o un artefacto óptico periférico y no una estrella física real), el centroide es eliminado de la lista.
  * Evita introducir falsas estrellas artificiales en los bordes del apilado (generadas por los desplazamientos de las tomas individuales) en el solucionador astrométrico (*platesolve*), incrementando la probabilidad de que la calibración de coordenadas celestes sea exitosa.

> [!NOTE]
> La opción "Eliminar centroides cerca de los bordes" eliminará los centroides extraños asociados con los efectos de borde cerca de la Luna o la corona solar.
> Esta función puede dejarse activada, al igual que "Eliminar objetos brillantes grandes", incluso al procesar campos estelares normales.
