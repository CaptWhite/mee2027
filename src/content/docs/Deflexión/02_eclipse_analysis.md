# Análisis de Ingeniería Inversa: `mee2024/eclipse_analysis.py`

El módulo `eclipse_analysis.py` está diseñado para realizar el análisis científico de imágenes capturadas durante un eclipse solar, específicamente para medir la deflexión gravitacional de la luz de las estrellas (el efecto Einstein). Utiliza datos de astrometría procesados previamente para comparar las posiciones observadas de las estrellas con sus posiciones de catálogo.

## Funciones de Utilidad y Visualización

### `confidence_ellipse(cov, mu, ax, n_std=3.0, facecolor='none', **kwargs)`
Genera una elipse de confianza basada en una matriz de covarianza `cov` y un vector de medias `mu`.
- Calcula el coeficiente de correlación de Pearson.
- Determina los radios y la rotación de la elipse para representar desviaciones estándar (1σ, 2σ, etc.).
- Se utiliza para visualizar la incertidumbre conjunta entre la constante de deflexión y la escala de placa.

### `as_unit_vector(dec, ra)`
Convierte coordenadas celestes (Declinación y Ascensión Recta) en un vector unitario en coordenadas cartesianas 3D.

## Procesamiento Principal: `eclipse_analysis(path_data, options)`

Esta es la función central que orquesta todo el análisis. Sus pasos principales son:

1.  **Carga de Datos**: Extrae `distortion_results.txt` y `CATALOGUE_MATCHED_ERRORS.csv` de un archivo ZIP. Filtra las estrellas por magnitud y opcionalmente elimina estrellas dobles.
2.  **Cálculo de Efemérides**: Utiliza `astropy` para obtener la posición precisa del Sol y la Luna en el momento y lugar de la observación. Calcula sus radios angulares aparentes.
3.  **Geometría de Deflexión**:
    - Calcula la distancia radial de cada estrella al centro del Sol (o Luna).
    - Expresa estas distancias en unidades de radios solares.
4.  **Modelos de Error (Funciones Internas)**:
    - Define tres funciones de error (`error_function1`, `2`, `3`) que simulan la deflexión teórica y calculan el RMS (Root Mean Square) entre las posiciones observadas (rotadas) y las del catálogo corregidas.
    - `error_function1`: Modelo clásico $d = A/r$.
    - `error_function2`: Modelo de potencia $d = A/r^B$.
    - `error_function3`: Modelo lineal-inverso $d = A/r + B \cdot r$.
5.  **Optimización**: Utiliza el método 'Nelder-Mead' de `scipy.optimize` para encontrar la constante de deflexión $A$ que minimiza el error RMS.
6.  **Análisis Estadístico Avanzado**:
    - **Método 1**: Ajuste de mínimos cuadrados ordinarios (OLS) para $1/r$ con escala de placa fija, incorporando incertidumbre externa.
    - **Método 2**: Ajuste OLS que permite que la escala de placa sea un grado de libertad adicional ($A/r + B \cdot r$, donde el término $B \cdot r$ captura variaciones en la escala de placa).
7.  **Visualización y Salida**:
    - Genera diagramas de dispersión de las estrellas en el campo.
    - Crea gráficos de elipses de confianza para mostrar la correlación entre la deflexión medida y la escala de placa.
    - Produce un gráfico de deflexión radial vs. distancia al Sol.
    - Guarda un informe detallado en un archivo de texto (`ECLIPSE_OUTPUT...txt`).

## Modelos Matemáticos Implementados
- **Deflexión Gravitacional**: El objetivo es medir la constante $L$ (teóricamente 1.751 arcosegundos en el limbo solar).
- **Corrección de Rotación**: Utiliza `_find_rotation_matrix` de `refraction_correction.py` para alinear el sistema de coordenadas observado con el de catálogo tras aplicar el modelo de deflexión.

## Dependencias Clave
- `astropy`: Para cálculos astronómicos precisos (posiciones de cuerpos celestes, transformaciones de coordenadas).
- `scipy.optimize`: Para la minimización de errores.
- `statsmodels`: Para regresiones lineales y cálculo de matrices de covarianza.
- `matplotlib`: Para la generación de gráficos científicos de alta calidad.



--------------------------------------------------


--------------------------------------------------


En el contexto del módulo eclipse_analysis.py (y como se detalla en la documentación del proyecto), las constantes A y B se utilizan en modelos matemáticos para ajustar la deflexión de la luz observada
  durante el eclipse. Dependiendo del modelo seleccionado, representan lo siguiente:


  1. Modelo de Potencia ($d = A/r^B$)
  Este modelo se implementa en la función error_function2:
   * A: Es la constante de deflexión gravitacional en el limbo solar (expresada en arcosegundos). El valor teórico según la Relatividad General de Einstein es aproximadamente 1.751".
   * B: Es el exponente de la caída de la deflexión con la distancia radial $r$. Según la teoría de Einstein, este valor debería ser exactamente 1.


  2. Modelo Lineal-Inverso ($d = A/r + B \cdot r$)
  Este modelo se implementa en la función error_function3:
   * A: Sigue representando la constante de deflexión ($1.751/r$).
   * B: Representa un término de corrección de la escala de placa (plate scale). Este término captura variaciones lineales que dependen de la distancia al centro (como errores en el enfoque o distorsión óptica
     residual) que podrían confundirse con la deflexión gravitacional.


  En resumen: A es siempre la magnitud del efecto de lente gravitatoria que se intenta medir, mientras que B es un parámetro adicional para verificar la forma de esa caída (en el modelo 2) o para absorber errores sistemáticos de escala (en el modelo 3).
