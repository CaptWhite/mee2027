
## 1) Conjuntos y datos iniciales

Sea:
* $\{\mathbf{v}_i\}_{i=1}^d \subset \mathbb{R}^3$:  vectores unitarios (estrellas)
* $K \subset \{1,\dots,d\}$:  índices con `kept = True` (anchors)
* $K_2 \subset \{1,\dots,d\}$:  índices con `kept2 = True` (legs), con ( K \subseteq K_2 )

Entonces:
$$
\mathbf{v}^{(2)}_j = \mathbf{v}_{k_j}, \quad k_j \in K_2
$$

es decir, `vectors2` es el subconjunto de vectores con índices en $K_2$.

---

## 2) Mapeo de índices
El código construye una función de correspondencia:

$$
f: K_2 \to \{1,\dots,|K_2|\}
$$


tal que:

$$
f(i) = i - \sum_{m=1}^i \mathbf{1}_{{m \notin K_2}}
$$


Esto es exactamente lo que implementa:
```python
cumsum = np.cumsum(np.logical_not(kept2).astype(int))
```

y permite pasar de índice global (i) a índice en `vectors2`.

---

## 3) Para cada anchor
Para cada $i \in \{1,\dots,n_{\text{kept}}\}$, con:
$$
\mathbf{a} = \mathbf{v}_{k_i}
$$
(donde $k_i \in K$), se hace:

---

### 3.1) Vecinos en la esfera
Se define el conjunto de vecinos:
$$
\mathcal{N}_i = \{ j \in K_2 :  d(\mathbf{v}_j, \mathbf{a}) \le \theta*{\text{pat}} \}
$$

donde la distancia es angular (aunque KDTree usa euclídea equivalente en esfera unitaria).

Se elimina el propio punto:
$$
\mathcal{N}_i \leftarrow \mathcal{N}_i \setminus \{k_i\}
$$

---

### 3.2) Vectores relativos
Para cada vecino $j \in \mathcal{N}_i$:
$$
\Delta_j = \mathbf{v}_j - \mathbf{a}
$$

---

### 3.3) Distancia angular
Se calcula:
$$
\theta_j = 2 \arcsin\left( \frac{|\Delta_j|}{2} \right)
$$

Esto es la distancia angular real en la esfera.

---

### 3.4) Base tangente local
Se define:

* vector polo:
  $$
  \mathbf{z} = (0,0,1)
  $$
* dirección azimutal:
$$
\hat{\boldsymbol{\phi}} = \frac{\mathbf{z} \times \mathbf{a}}{|\mathbf{z} \times \mathbf{a}|}
$$
* dirección polar:
$$
\hat{\boldsymbol{\theta}} = \frac{\hat{\boldsymbol{\phi}} \times \mathbf{a}}{|\hat{\boldsymbol{\phi}} \times \mathbf{a}|}
$$

Esto define una base ortonormal en el plano tangente a la esfera en $\mathbf{a}$.

---

### 3.5) Coordenadas locales
Se proyectan los vectores:
$$
x_j = \hat{\boldsymbol{\theta}} \cdot \Delta_j
$$
$$
y_j = \hat{\boldsymbol{\phi}} \cdot \Delta_j
$$
y se obtiene el ángulo:
$$
\phi_j = \operatorname{atan2}(y_j, x_j)
$$

---

## 4) Selección de estrellas del patrón
Se seleccionan dos subconjuntos:
---

### 4.1) (c) vecinos más cercanos
$$
C_i = \text{los } c \text{ índices con menor } \theta_j
$$
---

### 4.2) (e) estrellas más brillantes restantes
Como el índice original está ordenado por brillo:

$$
E_i = \text{los primeros } e \text{ elementos de } \mathcal{N}_i \setminus C_i
$$

(según orden creciente de índice → más brillantes)

---

### 4.3) Patrón final
$$
P_i = C_i \cup E_i  \quad \text{con } |P_i| = c+e
$$

---

## 5) Datos almacenados

Para cada anchor $i$ y cada $j \in P_i$:

### Índices
$$
\text{pattern\_ind}[i, k] = j
$$
---

### Datos geométricos
$$
\text{pattern\_data}[i,k,0] = \theta_j
$$
$$
\text{pattern\_data}[i,k,1] = \phi_j
$$
$$
\text{pattern\_data}[i,k,2:5] = \mathbf{v}_j
$$


---

## 6) Interpretación global

El algoritmo construye, para cada estrella ancla $\mathbf{a}$:

* un conjunto de $c+e$ estrellas vecinas
* descritas en coordenadas polares locales $(\theta, \phi)$
* más sus coordenadas cartesianas

Es decir, cada patrón es:
$$
\{ (\theta_j, \phi_j, \mathbf{v}*j) \}_{j \in P_i}
$$

---

## 7) Idea geométrica final

Esto es básicamente:

👉 construir una **firma geométrica local** alrededor de cada estrella
👉 usando distancias angulares + distribución angular en el plano tangente

Muy típico en:

* matching de catálogos estelares
* reconocimiento de patrones en el cielo
* algoritmos tipo astrometry / star identification

---

# Documentación en internet

👉 **star pattern recognition / star identification algorithms**

👉 (muy usados en *star trackers* y en *astrometry*)

---

## 🧭 1) La idea general sí está documentada

Hay muchísima literatura sobre esto. La idea base es siempre:

> Representar grupos de estrellas mediante **invariantes geométricos locales** para poder hacer matching robusto.

Por ejemplo:

* algoritmos basados en triángulos
* patrones radiales
* configuraciones locales alrededor de una estrella

👉 Todos buscan lo mismo que tu código:
**describir la geometría relativa de estrellas vecinas de forma robusta**
---

## 📚 2) Ejemplos DIRECTAMENTE relacionados
### 🔺 Asterismos (triángulos, quads, etc.)

En librerías modernas:
* Astroalign usa triángulos para identificar patrones
> “matches 3-point asterisms (triangles)” ([arXiv][1])

Y en herramientas tipo catálogo:
* se construyen invariantes geométricos (ratios de lados, etc.)
* se indexan con estructuras tipo KD-tree ([PyPI][2])

👉 Esto es MUY parecido a lo que haces tú, pero con triángulos en vez de coordenadas polares.
---

### 📡 Star trackers (muy cercano a tu código)
Muchos papers usan exactamente esta idea:

* elegir una estrella “reference”
* mirar vecinas
* usar **distancias angulares y relaciones geométricas**

Por ejemplo:
* patrones radiales + distancias angulares ([Springer Nature][3])
* matching basado en ángulos entre estrellas ([ScienceDirect][4])

👉 Esto es esencialmente lo mismo que tu ((\theta, \phi))
---

### 🔺 Algoritmos triangulares clásicos
Muy conocidos en navegación espacial:
* “triangular-based star identification algorithms” ([ScienceDirect][5])

Ventajas:
* robustos a ruido
* funcionan con pocas estrellas

---

## 🧠 3) Dónde encaja TU algoritmo exactamente
Tu código es una variante de:
### 👉 “local reference star + neighbors descriptor”

Más concretamente:

* eliges un **anchor**
* construyes un sistema de coordenadas local (plano tangente)
* representas vecinos como:

$$
(\theta, \phi)
$$

👉 Esto es equivalente a:
* un **descriptor polar local**
* similar a descriptores en visión artificial (tipo SIFT, pero en esfera)

---

## 🔍 4) Qué tiene de especial tu enfoque
Tu implementación combina varias ideas conocidas:
#### ✔ Geometría local
* distancias angulares → estándar en astrometría
#### ✔ Coordenadas en plano tangente
* muy típico en astronomía (proyección local)
#### ✔ Selección híbrida (`c` + `e`)
* mezcla:
  * proximidad geométrica
  * brillo (robustez)

👉 Esta mezcla concreta es más “ingeniería propia”
(no es un paper estándar tal cual)

---

## 📖 5) Cómo buscar más info (keywords útiles)

Si quieres profundizar, busca:
* “star pattern recognition algorithm”
* “lost-in-space star identification”
* “star tracker pattern matching”
* “asterism matching astronomy”
* “geometric invariants star patterns”

---

## 🧾 6) Traducción conceptual final
Tu código implementa:
$$
\textbf{Descriptor local polar de vecindad estelar}

$$

que es una variante de:
* **geometric invariant descriptors**
* usados en:
  * star trackers
  * astrometry solvers
  * image registration astronómico

---

## ⚠️ Conclusión importante

👉 No vas a encontrar un paper que diga exactamente:

> “usar KDTree + plano tangente + (c cercanas + e brillantes)”

Pero sí encontrarás:

* todas las piezas por separado ✔
* y muchas variantes muy similares ✔

Tu código es básicamente:

👉 una **implementación práctica moderna** de ideas estándar en reconocimiento de patrones estelares

---


Ahí ya entramos en nivel “paper-level” serio 👍

[1]: https://arxiv.org/abs/1909.02946?utm_source=chatgpt.com "Astroalign: A Python module for astronomical image registration"
[2]: https://pypi.org/project/starcatalogquery/?utm_source=chatgpt.com "starcatalogquery · PyPI"
[3]: https://link.springer.com/article/10.1186/s13634-024-01174-8?utm_source=chatgpt.com "Maximum radial pattern matching for minimum star map identification | Journal on Advances in Signal Processing | Springer Nature Link"
[4]: https://www.sciencedirect.com/science/article/abs/pii/S0094576509003634?utm_source=chatgpt.com "An analytical approach to star identification reliability - ScienceDirect"
[5]: https://www.sciencedirect.com/science/article/pii/S1319157818310954?utm_source=chatgpt.com "Improved triangular-based star pattern recognition algorithm for low-cost star trackers - ScienceDirect"
