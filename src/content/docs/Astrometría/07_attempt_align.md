# Análisis Riguroso de la Rutina `attempt_align`

La rutina `attempt_align`, ubicada en el módulo `mee2024\_working2\my_stacker_implementation.py`, implementa un algoritmo de **alineación de nubes de puntos por traslación rígida** con una **función de pérdida robusta**.

## 1. Definición del Problema
El objetivo es encontrar el vector de traslación óptimo $\mathbf{b} = (b_y, b_x) \in \mathbb{R}^2$ que minimice la discrepancia entre dos conjuntos de centroides de estrellas:
- $C_1 = \{\mathbf{c}_{1,i} \}_{i=1}^{n_1}$ (Centroides de la imagen de referencia).
- $C_2 = \{\mathbf{c}_{2,j} \}_{j=1}^{n_2}$ (Centroides de la imagen a alinear).

La transformación asumida es puramente traslacional: $\mathbf{c}_{1} \approx \mathbf{c}_{2} + \mathbf{b}$.

## 2. Formulación de la Función de Pérdida ($Loss\ Function$)
La función `loss_fxn(b)` utiliza una métrica diseñada para ser robusta frente a **valores atípicos** (estrellas que aparecen en una imagen pero no en la otra, o detecciones falsas).

Para un vector de traslación propuesto $\mathbf{b}$, la pérdida $L(\mathbf{b})$ se define como:

$$
L(\mathbf{b}) = \frac{1}{n_1} \sum_{i=1}^{m} \min_{j=1}^{m} \rho\left( \| \mathbf{c}_{1,i} - (\mathbf{c}_{2,j} + \mathbf{b}) \|_2 \right)
$$


Donde:
- **Métrica de distancia**: $\| \cdot \|_2$ es la norma Euclídea.
- **Kernel Robusto**: $\rho(r) = \min(r^{1.5}, \text{cutoff})$. 
    - El exponente $1.5$ es un compromiso entre la norma L1 (robusta pero con derivadas discontinuas en el origen) y la L2 (sensible a outliers).
    - El `cutoff` (umbral de truncamiento) ignora cualquier "emparejamiento" cuya distancia supere un límite, evitando que estrellas sin correspondencia desvíen el resultado global.
- **Submuestreo**: Solo se utilizan los primeros $m$ centroides para acelerar el cálculo.

## 3. Optimización Numérica
La rutina utiliza `scipy.optimize.minimize` para resolver:

$$
\mathbf{b}^* = \arg \min_{\mathbf{b}} L(\mathbf{b})
$$

Partiendo de una estimación inicial `guess` (por defecto $(0,0)$).

## 4. Correspondencia Final ($Matching$)
Una vez hallado el $\mathbf{b}^*$ óptimo, la función `enumerate_matches` realiza un **emparejamiento codicioso (greedy)**:

1. Calcula la matriz de distancias residuales: $D_{i,j} = \| \mathbf{c}_{1,i} - \mathbf{c}_{2,j} - \mathbf{b}^* \|_2$.
2. Busca el par $(i, j)$ con la distancia mínima en toda la matriz.
3. Si $D_{i,j} < \epsilon$ (donde $\epsilon$ es `pxl_tol`):
   - Registra el emparejamiento $i \leftrightarrow j$.
   - Elimina la fila $i$ y la columna $j$ de futuras búsquedas.
4. Repite hasta que no queden pares con distancia inferior al umbral.

## Resumen
El enfoque es un híbrido entre **Robust Point Matching** y una versión simplificada de la métrica de **Distancia de Hausdorff**. La robustez viene dada por el truncamiento de la pérdida, permitiendo que el algoritmo ignore el "ruido" de estrellas no compartidas entre los encuadres.
