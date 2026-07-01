# Análisis por Reingeniería Inversa: `database_searcher`

Este informe analiza la lógica de búsqueda y filtrado espacial implementada en la clase `database_searcher` (dentro de `my_database_lookup2.py`), que permite localizar estrellas en regiones específicas del cielo a partir de un catálogo masivo.

## 1. Funcionamiento del Motor de Búsqueda

El sistema no utiliza una base de datos SQL tradicional; en su lugar, emplea una búsqueda lineal sobre un array de NumPy altamente optimizado. Esto es posible gracias a que los datos están cargados en memoria y se aprovecha la vectorización de CPU.

### Flujo de Trabajo:
1.  **Carga y Normalización**: Al iniciar, el buscador precarga las coordenadas (RA, Dec) y las convierte a radianes.
2.  **Filtrado por Rango**: Se aplican máscaras booleanas sucesivas para reducir el conjunto de estrellas.
3.  **Ordenación por Brillo**: El catálogo se pre-ordena por magnitud, permitiendo que las primeras $N$ estrellas encontradas sean siempre las más brillantes.

## 2. Desarrollo Matemático: Gestión de la Esfera Celeste

La búsqueda de objetos astronómicos presenta un reto matemático: la **discontinuidad del origen de coordenadas** (meridiano 0/360).

### A. Lógica de Rango RA (Ascensión Recta)
La RA se mide de 0 a 360 grados. Si un usuario busca una región que cruza el meridiano cero (ej. de 350° a 10°), una comparación simple `RA > min AND RA < max` fallaría. El buscador implementa la siguiente lógica:

Sea $RA_{min}$ y $RA_{max}$ los límites de búsqueda:

1.  **Caso Normal ($RA_{min} < RA_{max}$)**:
    $$S = \{star \mid RA_{min} < RA_{star} < RA_{max}\}$$
2.  **Caso de Cruce ($RA_{min} > RA_{max}$)**:
    $$S = \{star \mid RA_{star} > RA_{min} \lor RA_{star} < RA_{max}\}$$

Esta lógica asegura que el "corte" de la esfera no deje huecos en la base de datos.

### B. Transformación a Versores (Direction Vectors)
Para evitar el uso constante de funciones trigonométricas costosas (`cos`, `sin`) durante búsquedas espaciales complejas, el módulo pre-calcula la representación de cada estrella como un vector unitario $\mathbf{V}$ en $\mathbb{R}^3$:

$$\mathbf{V} = \begin{bmatrix} 
\cos \alpha \cdot \cos \delta \\ 
\sin \alpha \cdot \cos \delta \\ 
\sin \delta 
\end{bmatrix}$$

Esto permite que cálculos posteriores, como la distancia angular $\theta$ entre dos estrellas $\mathbf{V_1}$ y $\mathbf{V_2}$, se realicen mediante un simple producto escalar:
$$\theta = \arccos(\mathbf{V_1} \cdot \mathbf{V_2})$$

## 3. Optimización de Memoria y Tipos de Datos

El buscador utiliza tipos de datos específicos para balancear precisión y rendimiento:
- **`float32`**: Para coordenadas y vectores. Ofrece precisión suficiente para astrometría de campo amplio (FOV > 0.5°) mientras reduce el uso de memoria a la mitad comparado con `float64`.
- **`uint16`**: Para los identificadores de catálogo (TYC), permitiendo representar números hasta 65,535 en un espacio mínimo.

## 4. Capacidades de Consulta (`lookup_objects`)

El método principal de búsqueda permite filtrar simultáneamente por:
1.  **Ventana Espacial**: Rango de RA y Dec.
2.  **Corte de Magnitud**: Excluye estrellas más débiles que un valor `star_max_magnitude`.
3.  **Memoria Dinámica**: El método devuelve una vista (`view`) o copia filtrada del array original, manteniendo la integridad de la base de datos principal.
