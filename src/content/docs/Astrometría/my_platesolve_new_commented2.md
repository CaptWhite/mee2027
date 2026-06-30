
# **VISIÓN GENERAL ASTRONÓMICA DEL ALGORITMO PLATE SOLVE**

La función construye una **base de datos geométrica** que permite reconocer el cielo mediante patrones de estrellas.
En astronomía esto se usa en **star trackers** a bordo de satélites, telescopios robóticos o sistemas de astrometría.

El objetivo es:
**identificar la actitud (orientación) de la cámara comparando triángulos de estrellas observadas con una base de datos precomputada.**

Esto se logra construyendo, para cada estrella brillante:

* un conjunto de estrellas cercanas en el cielo,
* los ángulos relativos entre ellas,
* una colección de triángulos “canónicos” que describen la geometría local.

---

# **IDEA MATEMÁTICA CENTRAL**

Todo ocurre sobre la **esfera celeste**, que matemáticamente es:
$$S^2 = \{ x \in \mathbb{R}^3 , | , |x| = 1 \}$$
Cada estrella es un vector unitario $v \in \mathbb{R}^3$.

El algoritmo usa:

* **Distancias angulares** entre estrellas
  $\theta = \arccos(v_1 \cdot v_2)$

* **Vectores tangentes locales** para definir ángulos "de giro" locales $φ$.

* **Relaciones invariantes de triángulos**, como cocientes de distancias angulares para ser robustos a escalas.

---
# PASO 0 — Definición de parámetros

   **a =  80000**    *número de estrellas más brillantes* \
   **b = 120000**    *número de estrellas adicionales consideradas para anclajes, pero solo si están suficientemente separadas de las más brillantes* \
    **c = 0**        *número de estrellas más cercanas al anclaje dentro del campo de visión que se seleccionan para formar patrones (en este caso, se seleccionan 0, lo que significa que solo se seleccionarán las e estrellas más brillantes dentro del campo de visión que no han sido seleccionadas como las c estrellas más cercanas)* \
    **d = 700000**    *número total de estrellas consideradas para formar patrones (deben ser al menos a+b)* \
    **e = 18**        *número de estrellas adicionales consideradas para formar patrones, pero solo si están dentro del FOV y no han sido seleccionadas como anclajes* \
    **theta_sep** = (0.65)         *separación mínima entre anclajes (en grados)* \
    **theta_double_star** = (0.01) *separación mínima para excluir estrellas dobles (en grados)* \
    **theta_pat** = (1.7)          *campo de visión (FOV) máximo para resolver patrones (en grados)* \

---

# PASO 1 — Selección de anclas

Se eligen estrellas brillantes que están suficientemente separadas entre sí según una distancia angular mínima:
$$\theta_{\text{sep}} = 0.65^\circ$$

Esto garantiza un conjunto de estrellas **bien distribuidas**, evitando agrupamientos o regiones densas como el plano galáctico.

El criterio angular asegura:
$$\theta(v_i, v_j) > \theta_{\text{sep}}$$
para cualquier par de anclas.

Se descartan estrellas dobles usando un umbral mucho más pequeño:
$$\theta_{\text{double}} = 0.01^\circ$$

Matemáticamente, se está obteniendo un **subconjunto “pseudouniforme” de puntos sobre la esfera**.

---

# PASO 2 — Selección de estrellas dentro del campo de visión

Para cada ancla $a_i$, se buscan estrellas dentro de un **cap (casquete esférico)**:
$$\theta < \theta_{\text{FOV}} = 1.7^\circ$$

Es decir, todas las estrellas en un vecindario angular definido por:
$$\text{vecindad}(a_i) = \{ v \in S^2 : \theta(a_i, v) < \theta_{\text{FOV}}\}$$
Esto modela el campo de visión real de un sensor estelar.

Luego se calculan:
1. **Distancias angulares** exactas usando la identidad:
$$d\theta = 2\arcsin\left(\frac{||v - a_i||}{2}\right)$$
esta fórmula proviene de la relación entre cuerdas y arcos en la esfera.

2. **Ángulo de posición relativo φ**
   Para ello se define una **base ortonormal en el plano tangente** en la estrella ancla.

Sea:

* $z = (0, 0, 1)$
* $\phi_{hat} = \frac{z \times a_i}{|z \times a_i|}$
* $\theta_{hat} = \phi_{hat} \times a_i$

Entonces cualquier estrella $s$ produce un vector:
$$\Delta = s - a_i$$

Y se calcula:
$$x = \theta_{\text{hat}} \cdot \Delta$$
$$y = \phi_{\text{hat}} \cdot \Delta$$
$$\phi = \arctan2(y, x)$$

Esto da el **ángulo azimutal relativo** entre el ancla y cada estrella.

Matemáticamente, es una proyección a coordenadas locales de la esfera (como un sistema de coordenadas cartesiano en la tangente).

---

# PASO 3 — Construcción de triángulos invariantes

Cada estrella ancla define un conjunto de estrellas vecinas.
El algoritmo toma **todas las combinaciones** de pares.
Si hay $N = c + e$ estrellas:
$$
\binom{N}{2} = \frac{N(N-1)}{2}
$$

En el caso típico $N=18$, son 153 triángulos por ancla.

Para cada triángulo formado por:
* ancla A
* estrellas B y C

Se computa:
### 1. **La razón entre distancias angulares**
$$
R = \frac{\theta(A,C)}{\theta(A,B)}
$$

Y se fuerza:
$$
R \le 1,\quad \text{(si no, se invierte)}
$$

Esto es importante porque **define una representación única e invariante del triángulo**.

### 2. **La diferencia de ángulos locales:**
$$
\Delta\phi = \phi_C - \phi_B \quad\text{mod}(2\pi)
$$

Esto define la **orientación del triángulo** alrededor del ancla.

---

# 📚 ¿POR QUÉ FUNCIONA ESTO EN ASTRONOMÍA?

Los *star trackers* no pueden usar posiciones absolutas porque:

* la cámara tiene rotación desconocida,
* la escala angular depende de la óptica,
* las estrellas se ven proyectadas en 2D.

Pero los **triángulos angulares son invariantes a rotaciones y escalas**.

Ejemplo:

* Si la cámara rota → las distancias angulares no cambian.
* Si el sensor está ligeramente distorsionado → la proporción R es estable.
* La posición relativa Δφ permite diferenciar triángulos simétricos.

Así se genera una **huella única** por región del cielo.

Durante el reconocimiento:

1. Se extraen triángulos de la imagen.
2. Se compara (R, Δφ) con la base precomputada.
3. Se identifica el ancla.
4. Se determina la orientación del sensor.

---

# **Resumen completamente matemático/astronómico**

El algoritmo:

* Construye una discretización de ( S^2 ) usando estrellas brillantes y bien separadas.
* Para cada punto de esta discretización, define un sistema de coordenadas tangente.
* Expresa estrellas vecinas en este marco local.
* Calcula invariantes geométricos (ratio de distancias, diferencia angular).
* Genera una base de datos de triángulos que cubre el cielo de forma redundante y robusta a ruido.

---
---
---
---
---
---
---

# ✅ **RESUMEN GENERAL DEL CÓDIGO**

La función **genera una base de datos de patrones triangulares** para reconocimiento estelar (por ejemplo, para resolver la orientación de una cámara de un satélite).
Para ello:

1. **Carga un catálogo de estrellas (Tycho)**.
2. **Selecciona estrellas especiales llamadas “anclas”**, garantizando que:

   * son de las más brillantes,
   * no están demasiado cerca unas de otras,
   * no forman estrellas dobles.
3. **Selecciona otras estrellas ("legs")** alrededor de cada ancla dentro de un campo de visión.
4. **Para cada ancla**, calcula:

   * sus estrellas cercanas,
   * sus estrellas brillantes dentro del FOV,
   * sus ángulos relativos (dtheta, phi),
   * los triángulos formados.
5. **Guarda una base de datos comprimida** con todos los patrones triangulares.

---

# **DETALLE DEL PROCESO POR ETAPAS**

---

## **Paso 1 — Selección de anclas ("anchors")**

El código recorre las primeras `d` estrellas más brillantes y decide si cada una será:

* **Ancla (kept)**
* **Candidata para formar patrones (kept2)**

Criterios:

### *Para ser ancla (kept)*:

Una estrella se selecciona si:

* Está entre las **a** más brillantes aunque tenga vecinos cercanos *pero no estrellas dobles*, o
* Está entre **a+b** y **no tiene otra ancla dentro de θ_sep**.

### *Para ser leg (kept2)*:

Es menos estricto:

* Se marca salvo que tenga una estrella doble muy cercana (θ_double_star).

Resultado típico:

* ~80k anclas,
* ~700k legs.

---

## **Paso 2 — Para cada ancla, buscar estrellas alrededor**

Para cada estrella ancla:

1. Se buscan todas las estrellas-leg dentro de un campo de visión `theta_pat`.
2. Se eliminan casos en que haya menos de `c+e` estrellas disponibles.
3. Se calculan:

   * distancias angulares **dtheta**,
   * ángulos relativos **phi** usando vectores tangentes.

Se selecciona:

* **c** estrellas más cercanas (por distancia angular).
* **e** estrellas más brillantes dentro del FOV **no incluidas en c**.

Se guardan:

* índices globales de estas estrellas,
* dtheta,
* phi,
* coordenadas cartesianas.

---

## **Paso 3 — Generación de triángulos**

Para cada ancla:

* Toma las `c+e` estrellas seleccionadas.
* Genera **todas las combinaciones posibles de pares** →
  `(c+e)*(c+e−1)/2` triángulos (p. ej. 153 cuando c+e = 18).
* Para cada triángulo, se calcula:

  * **ratio = dθ₂ / dθ₁**, asegurando que ratio ≤ 1.
  * **dphi**, la diferencia angular entre estrellas.

Estos dos valores forman la **descripción única del triángulo**.

---

## **Paso final — Guardar la base de datos**

Se guarda un archivo `.npz` comprimido con:

* Coordenadas de anclas
* Índices y datos de estrellas del patrón
* Lista de triángulos
* Ratio y dphi por triángulo

Este archivo se usará posteriormente para la identificación estelar.

---

# **RESUMEN ULTRACORTO (3 líneas)**

* El código selecciona estrellas ancla y estrellas secundarias (“legs”) evitando cercanas y dobles.
* Para cada ancla calcula estrellas dentro del FOV y sus ángulos relativos.
* Forma todos los triángulos posibles y los guarda en una base de datos para reconocimiento estelar.

---
---
---
---
---
---
---

Aquí tienes un **diagrama de flujo claro y estructurado**, representado en texto para que puedas copiarlo, revisarlo o convertirlo a una herramienta visual.

---

# 🧩 **DIAGRAMA DE FLUJO DE LA FUNCIÓN `generate()`**

```
 ┌──────────────────────────────┐
 │   Iniciar función generate()  │
 └───────────────┬──────────────┘
                 │
                 ▼
     ┌──────────────────────────────┐
     │ Cargar catálogo de estrellas │
     │ (Tycho .npz)                 │
     └───────────────┬──────────────┘
                     │
                     ▼
        ┌───────────────────────────┐
        │ Convertir coords a XYZ    │
        │ Crear KDTree1             │
        └───────────────┬──────────┘
                        │
                        ▼
         ┌──────────────────────────┐
         │ Inicializar kept y kept2 │
         │ (anclas y legs)          │
         └───────────────┬──────────┘
                         │
                         ▼
        ┌───────────────────────────────────┐
        │ Bucle i = 0 → d-1                 │
        │ - Buscar vecinos con θ_sep        │
        │ - Buscar "dobles" con θ_double    │
        │ - ¿Es suficientemente brillante?  │
        │ - ¿Tiene vecinos ancla cercanos?  │
        │ - Actualizar kept / kept2         │
        └──────────────────┬────────────────┘
                           │
                           ▼
        ┌──────────────────────────────┐
        │ Extraer vectores de anclas   │
        │ Calcular índices             │
        └───────────────┬──────────────┘
                        │
                        ▼
       ┌────────────────────────────────┐
       │ Construir KDTree2 con kept2    │
       └────────────────┬───────────────┘
                        │
                        ▼
     ┌────────────────────────────────────────┐
     │ Bucle por cada ancla i                 │
     │ - Buscar vecinos dentro de θ_pat       │
     │ - Quitar la estrella ancla             │
     │ - ¿Hay ≥ c+e vecinos? NO → error       │
     │ - Calcular dtheta y phi                │
     │ - Elegir c más cercanas                │
     │ - Elegir e más brillantes no usadas    │
     │ - Guardar pattern_ind y pattern_data   │
     └──────────────────┬─────────────────────┘
                        │
                        ▼
    ┌─────────────────────────────────────────┐
    │ Crear matriz para triángulos            │
    │ Bucle por cada ancla i                  │
    │   - Tomar todas las combinaciones       │
    │     de 2 estrellas (153 típicamente)    │
    │   - Calcular ratio = dθ2 / dθ1          │
    │   - Calcular dphi normalizado           │
    │   - Guardar en matriz triangles         │
    └──────────────────┬──────────────────────┘
                       │
                       ▼
         ┌─────────────────────────────────┐
         │ Guardar archivo .npz comprimido │
         │ (anchors, patrones, triángulos) │
         └──────────────────┬──────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │  Fin de generate()      │
              └─────────────────────────┘
```

---





