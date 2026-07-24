# Informe Exaustivo: my_StarData.py — Matematica y Computacion

---

## Índice
1. Desarrollo Matematico (Seccion 2):
   - Coordenadas celestes y transformacion a vectores unitarios en R^3
   - Paralaje estelar, distancia y regularizacion
   - Movimiento propio y propagacion temporal
   - Epoca Juliana y escala TCB
   - Transformacion ICRS → AltAz con rotacion SVD (teorema de Kabsch)
   - Refraccion atmosferica
   - Deflexion gravitacional (efecto Einstein)
   - Coordenadas intermedias y transformacion inversa
   - Rotacion por angulos de Euler
   - Distorsion polinomial (bases monomial y Legendre)
2. Desarrollo Computacional (Secciones 3-6):
   - Arquitectura del modulo y flujo de datos
   - Analisis de cada metodo con complejidad O(N)
   - Bug detectado en __copy__ (linea 133: epch → epoch)
   - Analisis de robustez y errores
   - Patrones de uso en el pipeline MEE2024
   - Benchmark estimado
   - Diagrama de clases UML
   - Recomendaciones de mantenimiento

---

## 1. Introduccion y Contexto del Proyecto

`mymy_StarData.py` es un modulo del proyecto **MEE2024**, un sistema de astrometria digital para el analisis de placas fotograficas astronomicas. El modulo proporciona una abstraccion de datos estelares provenientes del catalogo **Gaia DR3** de la ESA, encapsulando posiciones celestes, movimientos propios, paralajes y magnitudes en un objeto `StarData` unificado.

El modulo actua como puente entre las consultas al archivo Gaia (`my_gaia_search.py`) y los modulos de correccion de refraccion (`my_refraction_correction.py`), ajuste de distorsion (`my_distortion_polynomial.py`) y barrido gravitacional (`my_gravity_sweep.py`).

---

## 2. Desarrollo Matematico

### 2.1. Coordenadas Celestes en el Sistema de la Esfera Celeste

Las posiciones de las estrellas se expresan en coordenadas ecuatoriales:
$$
(\alpha, \delta) \in [0, 2\pi) \times \left[-\frac{\pi}{2}, \frac{\pi}{2}\right]
$$
donde $\alpha$ es la **ascension recta** (Right Ascension, RA) y $\delta$ es la **declinacion** (Declination, DEC).

#### 2.1.1. Conversion a Vectores Unitarios en R^3

El metodo `_update_vectors()` (lineas 72-77) realiza la transformacion esferica a cartesiana:

$$
\vec{v}_i = \begin{pmatrix} \cos\alpha_i \cos\delta_i \\ \sin\alpha_i \cos\delta_i \\ \sin\delta_i \end{pmatrix}
$$

Esta transformacion mapea puntos de la esfera unitaria S^2 a vectores unitarios en R^3, preservando la metrica euclidiana. La norma del vector resultante es:

$$
\|\vec{v}_i\| = \sqrt{\cos^2\alpha_i \cos^2\delta_i + \sin^2\alpha_i \cos^2\delta_i + \sin^2\delta_i} = \sqrt{\cos^2\delta_i(\cos^2\alpha_i + \sin^2\alpha_i) + \sin^2\delta_i} = 1
$$

**Justificacion del uso de vectores:** Los vectores unitarios son preferibles a las coordenadas angulares porque:

1. Evitan singularidades en los polos (`delta = +/- pi/2`)
2. Permiten calcular distancias angulares con productos escalares: `theta = arccos(v1 . v2)`
3. Facilitan rotaciones ortogonales en el ajuste de distorsion

### 2.2. Paralaje Estelar y Distancia

#### 2.2.1. Relacion Paralaje-Distancia

La paralaje `p` (en milisegundos de arco, mas) se relaciona con la distancia `d` (en parsecs) mediante:

$$
d = \frac{1000}{p} \quad [\text{pc}]
$$

o equivalentemente:

$$
d = \frac{1}{p} \quad [\text{kpc}] \quad \text{(si p esta en mas)}
$$

#### 2.2.2. Regularizacion de Paralaje (regularize_parallax, lineas 13-17)

La funcion aplica la transformacion:

$$
\hat{p}_i = \begin{cases} 0 & \text{si } p_i = \text{NaN} \\ p_{\min} & \text{si } p_i < p_{\min} \\ p_i & \text{en otro caso} \end{cases}
$$

donde   $p_{min} = 1  mas$ (1 milisegundo de arco), lo que corresponde a una distancia maxima de $1000 pc = 1 kpc$.

**Fundamento fisico:** Las paralajes negativas son artefactos de error de medida en Gaia. Para estrellas a distancias superiores a 1 kpc, la paralaje es demasiado pequena para ser medida con precision, por lo que se fija un limite inferior. Las paralajes NaN se convierten en 0, que al pasar por el umbral minimo se convierte en $p_{min}$.

#### 2.2.3. Regularizacion de Movimiento Propio (regularize_pm, lineas 19-22)
$$
\widehat{\mu}_i = \begin{cases} 0 & \text{si } \mu_i = \text{NaN} \\ \mu_i & \text{en otro caso} \end{cases}
$$
Los NaN en movimientos propios se interpretan como "sin dato" y se establecen a cero (sin desplazamiento aparente).

### 2.3. Movimiento Propio y Propagacion Temporal

#### 2.3.1. Modelo de Movimiento Propio

El movimiento propio se descompone en dos componentes:
$$
\vec{\mu} = \begin{pmatrix} \mu_\alpha \cos\delta \\ \mu_\delta \end{pmatrix} \quad [\text{mas/yr}]
$$
La posicion de una estrella en la epoca `t` se obtiene por propagacion lineal:
$$
\alpha(t) = \alpha(t_0) + \mu_\alpha \cos\delta \cdot (t - t_0)
\delta(t) = \delta(t_0) + \mu_\delta \cdot (t - t_0)
$$
donde $t_0$ es la epoca de referencia del catalogo Gaia DR3 (J2016.0 = 2016.0).

#### 2.3.2. Propagacion en Astropy (update_epoch, lineas 97-103)

El metodo `apply_space_motion()` de Astropy implementa la propagacion completa del movimiento propio, que incluye:

1. **Movimiento propio lineal:** $\Delta_\alpha = \mu_\alpha * \Delta_t, \Delta_\delta = \mu_\delta * \Delta_t$
2. **Aberracion estelar:** Correccion por la velocidad de la Tierra
3. **Paralaje:** Variacion de posicion por el desplazamiento orbital terrestre

La propagacion se realiza en el marco de referencia **ICRS** (International Celestial Reference System) usando la escala de tiempo **TCB** (Barycentric Coordinate Time).

### 2.4. Epoca y Escala Temporal

#### 2.4.1. Formato Juliano (jyear)

La epoca se almacena como tiempo Juliano en formato de ano decimal:
$$
t_{\text{JY}} = \text{Time}(date, \text{format='jyear'}, \text{scale='tcb'})
$$
El ano Juliano se define como:
$$
1 \text{ JY} = 365.25 \text{ dias Juliano} = 31\,557\,600 \text{ segundos}
$$
#### 2.4.2. Escala TCB

**Barycentric Coordinate Time (TCB)** es la escala de tiempo usada para efemerides planetarias, corregida de los efectos relativistas del campo gravitatorio del Sistema Solar. Se relaciona con el Tiempo Terrestre (TT) mediante:

$$
\text{TCB} = \text{TT} + L_B \cdot (J_D - 2\,443\,144.5) \cdot 86\,400
$$

donde $L_B ~ 1.550505 x 10^-8$.

### 2.5. Transformacion ICRS a Coordenadas Locales (AltAz)

El modulo `my_refraction_correction.py` realiza la transformacion ICRS -> AltAz:

#### 2.5.1. Coordenadas Altitud-Azimut
$$
\text{Alt} = \arcsin(\hat{z}_{\text{local}}) \in \left[-\frac{\pi}{2}, \frac{\pi}{2}\right]
$$
$$
\text{Az} = \arctan2(\hat{y}_{\text{local}}, \hat{x}_{\text{local}}) \in [0, 2\pi)
$$
#### 2.5.2. Vector Unitario Local
$$
\vec{v}_{\text{local}} = \begin{pmatrix} \sin(\text{Alt}) \\ \cos(\text{Alt})\cos(\text{Az}) \\ \cos(\text{Alt})\sin(\text{Az}) \end{pmatrix}
$$
#### 2.5.3. Matriz de Rotacion de Minimos Cuadrados (SVD)

Para alinear los vectores locales con los vectores ICRS, se encuentra la matriz de rotacion `R en SO(3)` que minimiza:

$$
\min_R \| R \cdot \vec{V}_{\text{local}} - \vec{V}_{\text{ICRS}} \|_F
$$

donde `||.||_F` es la norma de Frobenius. La solucion se obtiene mediante **SVD** (Descomposicion en Valores Singulares):

H = \vec{V}_{\text{local}}^T \cdot \vec{V}_{\text{ICRS}}
H = U \Sigma V^T \quad \text{(SVD)}
R = U V^T

**Teorema (Kabsch, 1976/1978):** La rotacion que minimiza la suma de cuadrados de las distancias entre puntos correspondientes en dos nubes de puntos es `R = U V^T`, siempre que `det(H) > 0` (puntos no reflejados).

### 2.6. Correccion de Refraccion Atmosferica

La refraccion atmosferica desvia la trayectoria de la luz estelar. La elevacion aparente `epsilon` se relaciona con la elevacion verdadera `epsilon_0` mediante (aproximacion de primer orden):

\epsilon = \epsilon_0 - \frac{R_0}{\tan\epsilon_0}

donde `R_0` depende de la presion, temperatura y longitud de onda:

R_0 \approx \frac{P}{1010} \cdot \frac{283}{273 + T} \cdot \frac{0.5''}{1 + 0.00113 \cdot P/(273+T)}

La correccion completa implementada en Astropy (linea 70-72 de my_refraction_correction.py) incluye:

- Presion atmosferica (`P`, en hPa)
- Temperatura (`T`, en grados C)
- Humedad relativa
- Longitud de onda de observacion ($\lambda$, en um)

### 2.7. Deflexion Gravitacional de la Luz

La deflexion de la luz por campos gravitacionales (efecto Einstein) se modela como:
$$
\delta\theta = \frac{4GM}{c^2 b}
$$
donde `M` es la masa del objeto defectante y `b` es el parametro de impacto. En el modulo, la funcion `erfa.ld` de la libreria ERFA (Earth Rotation and Reference Systems Application) implementa este calculo.

El modulo permite:

1. **Desactivar** la deflexion gravitacional: `M = 0` (no_grav_ld)
2. **Escalar** la gravedad: `M -> M * g/g_Earth` (variable_ld), donde `g/g_Earth` es la gravedad relativa

### 2.8. Transformacion a Coordenadas Intermedias (i-coordinates)

#### 2.8.1. Coordenadas Rectilineas (icoord_to_vector, my_transforms.py)

Las coordenadas intermedias `(xi, eta)` se definen como proyecciones tangenciales sobre un plano:
$$
\vec{v} = \begin{pmatrix} \cos\eta \cos\xi \\ \sin\eta \cos\xi \\ \sin\xi \end{pmatrix}
$$
donde `xi` corresponde a la declinacion y `eta` a la ascension recta corregida por coseno de declinacion.

#### 2.8.2. Transformacion Inversa (detransform_vectors)

Dado un vector unitario `v = (vx, vy, vz)`, las coordenadas intermedias se obtienen como:
$$
\alpha^* = \arcsin(v_z)
\eta = \frac{\arcsin(v_y / \cos\alpha^*)}{\cos\alpha^*}
$$
La division por `cos(alpha*)` en el denominador compensa la convergencia de meridianos en la esfera.

### 2.9. Transformacion Lineal con Escala y Rotacion

La transformacion lineal completa tiene 4 grados de libertad:
$$
\vec{v}_{\text{salida}} = R(\alpha, \delta, \omega) \cdot \vec{v}_{\text{entrada}} \cdot s
$$
donde:

- $s$ es la **escala de placa** (radianes por pixel)
- $R(\alpha, \delta, \omega)$ es la matriz de rotacion con los angulos de Euler (secuencia $zyx$): $-\alpha$ (RA), $\delta$ (DEC), $-\omega$ (roll)

#### 2.9.1. Angulos de Euler

La rotacion se descompone en tres rotaciones elementales:
$$
R = R_z(-\alpha) \cdot R_y(\delta) \cdot R_x(-\omega)
$$
$$
R_z(\theta) = \begin{pmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{pmatrix}
$$
$$
R_y(\theta) = \begin{pmatrix} \cos\theta & 0 & \sin\theta \\ 0 & 1 & 0 \\ -\sin\theta & 0 & \cos\theta \end{pmatrix}
$$
$$
R_x(\theta) = \begin{pmatrix} 1 & 0 & 0 \\ 0 & \cos\theta & -\sin\theta \\ 0 & \sin\theta & \cos\theta \end{pmatrix}
$$
### 2.10. Distorsion Polinomial

El ajuste de distorsion usa polinomios de orden `n` en coordenadas normalizadas:
$$
x_{\text{dist}} = \sum_{k=1}^{n} \sum_{j=0}^{k} c_{k-j,j} \cdot \frac{\xi^j \eta^{k-j}}{w^k}
$$
donde $w = max(img_shape)/2$ es el factor de normalizacion.

La base de polinomios se construye en `get_basis()` (lineas 23-38):

| Orden | Terminos | Numero de coeficientes |
|-------|----------|----------------------|
| 0 (constante) | 1 | 1 |
| 1 (lineal) | x, y | 3 |
| 2 (cuadratico) | x^2, xy, y^2 | 6 |
| 3 (cubico) | x^3, x^2y, xy^2, y^3 | 10 |
| 4 (cuartico) | x^4, x^3y, x^2y^2, xy^3, y^4 | 15 |
| 5 (quintico) | x^5, ..., y^5 | 21 |

El numero total de terminos para orden `n` es:
$$
N = \frac{(n+1)(n+2)}{2}
$$
#### 2.10.1. Base de Legendre

Alternativamente, se pueden usar polinomios de Legendre $P_k(x)$:

$$
x_{\text{dist}} = \sum_{k=1}^{n} \sum_{j=0}^{k} c_{k-j,j} \cdot \frac{P_j(\xi) \cdot P_{k-j}(\eta)}{w^k}
$$

Los polinomios de Legendre tienen la propiedad de ortogonalidad en `[-1, 1]`:

$$
\int_{-1}^{1} P_m(x) P_n(x) \, dx = \frac{2}{2n+1} \delta_{mn}
$$
---

## 3. Desarrollo Computacional (Informatico)

### 3.1. Arquitectura del Modulo

```
my_StarData.py 
├── Funciones auxiliares
│   ├── regularize_parallax()    # Limpieza de paralajes
│   └── regularize_pm()          # Limpieza de movimientos propios
└── Clase StarData
    ├── __init__()               # Constructor principal
    ├── nstars()                 # Numero de estrellas
    ├── get_ra() / get_dec()     # Coordenadas angulares
    ├── get_ra_dec()             # Matriz (N,2) de coordenadas
    ├── get_vectors()            # Vectores unitarios (N,3)
    ├── get_mags()               # Magnitudes G
    ├── get_parallax()           # Paralajes
    ├── get_pmotion()            # Movimientos propios (N,2)
    ├── get_ids()                # Identificadores Gaia DR3
    ├── update_epoch()           # Propagacion temporal
    ├── select_indices()         # Subseleccion por indices
    ├── get_epoch_float()        # Epoca como float
    ├── _update_vectors()        # Recalculo de vectores
    └── __copy__()               # Copia superficial
```

### 3.2. Dependencias

| Paquete | Uso en StarData |
|---------|-----------------|
| numpy | Arrays numericos, operaciones vectorizadas |
| pandas | Importado pero no usado directamente (query results) |
| astropy.units | Unidades fisicas (mas, u/yr) |
| astropy.coordinates.SkyCoord | Coordenadas celestes |
| astropy.coordinates.Distance | Conversion paralaje-distancia |
| astropy.time.Time | Manejo de epocas temporales |

### 3.3. Flujo de Datos

```
Gaia DR3 Query (my_gaia_search.py)
        |
        v
   Astropy Table (r)
        |
        v
   StarData.__init__(r, date, has_pm)
        |
        +-- r['parallax'] --> regularize_parallax() --> self.parallax
        +-- r['pmra']     --> regularize_pm()       --> self.pm[:,0]
        +-- r['pmdec']    --> regularize_pm()       --> self.pm[:,1]
        +-- r['ra']       --> SkyCoord(ra=...)       --+
        +-- r['dec']      --> SkyCoord(dec=...)      --+
                                                       |
                                                       v
                                              self.c (SkyCoord)
                                                       |
                                                       v
                                              _update_vectors()
                                                       |
                                                       v
                                              self.vectors (N,3)
```

### 3.4. Implementacion Detallada

#### 3.4.1. Constructor __init__ (lineas 33-58)

```python
def __init__(self, r=None, date=None, has_pm=None):
    if r is None:
        return  # stardata vacio
    self.epoch = Time(date, format='jyear', scale='tcb')
    self.has_pm = has_pm
    self.mags = r['phot_g_mean_mag']     # Magnitudes G de Gaia
    self.ids = r['SOURCE_ID']            # Gaia SOURCE_ID (int64)
```

**Punto critico:** El constructor distingue dos modos:

1. **Con movimiento propio** (has_pm=True): Almacena parallax, pmra, pmdec y crea SkyCoord completo
2. **Sin movimiento propio** (has_pm=False): Solo almacena RA/DEC, sin distancia ni pm

#### 3.4.2. Regularizacion Vectorizada (regularize_parallax)

```python
def regularize_parallax(parallax, minimum=1):
    x = np.copy(parallax)        # No mutar el original
    x[np.isnan(x)] = 0           # NaN -> 0
    x[x < minimum] = minimum     # < minimum -> minimum
    return x
```

La operacion booleana `x[x < minimum]` crea una mascara que identifica todos los elementos que cumplen la condicion. NumPy aplica la asignacion solo a esos elementos, lo que constituye una operacion vectorizada O(N) sin bucles explicitos.

**Complejidad computacional:**

- `np.copy`: O(N) — copia el array completo
- `np.isnan` + indexacion booleana: O(N) — dos pasadas
- Segunda indexacion booleana: O(N) — una pasada
- **Total: O(N)** con constante ~4 (cuatro recorridos del array)

#### 3.4.3. Construccion de Vectores Unitarios (_update_vectors)

```python
def _update_vectors(self):
    self.vectors = np.zeros((self.ids.shape[0], 3))
    star_table = self.get_ra_dec()            # (N, 2)
    self.vectors[:, 0] = np.cos(star_table[:, 0]) * np.cos(star_table[:, 1])
    self.vectors[:, 1] = np.sin(star_table[:, 0]) * np.cos(star_table[:, 1])
    self.vectors[:, 2] = np.sin(star_table[:, 1])
```

**Analisis de rendimiento:**

- `get_ra_dec()`: llama a `self.c.ra.rad` y `self.c.dec.rad` — acceso a propiedades precomputadas de Astropy, O(N)
- `np.cos` y `np.sin`: operaciones ufunc de NumPy, O(N) cada una, ejecutadas en C
- Multiplicacion elemento a elemento: O(N)
- **Total: O(N)** con ~8 operaciones ufunc + 4 multiplicaciones

#### 3.4.4. Propagacion Temporal (update_epoch)

```python
def update_epoch(self, date):
    if not self.has_pm:
        raise Exception("cannot update epoch without pm")
    self.epoch = Time(date, format='jyear', scale='tcb')
    self.c = self.c.apply_space_motion(self.epoch)
    self._update_vectors()
```

**Cadena de llamadas:**

```
update_epoch()
  └─> Time()                         # Parsing temporal O(1)
  └─> SkyCoord.apply_space_motion()  # O(N) — propagacion por estrella
        └─> Movimiento propio lineal
        └─> Aberracion estelar
        └─> Paralaje
  └─> _update_vectors()              # O(N)
```

El metodo `apply_space_motion` es el computacionalmente mas costoso, ya que involucra transformaciones de coordenadas completas ICRS -> GCRS para cada estrella. La complejidad es **O(N)** pero con una constante significativamente mayor que las operaciones anteriores.

#### 3.4.5. Seleccion por Indices (select_indices)

```python
def select_indices(self, indices):
    self.mags = self.mags[indices]
    self.vectors = self.vectors[indices, :]
    self.ids = self.ids[indices]
    self.c = self.c[indices]
    self.pm = self.pm[indices, :]
    self.parallax = self.parallax[indices]
```

**Nota de implementacion:** Este metodo es un ejemplo de **indexacion fancy** de NumPy. La operacion `array[indices]` crea una copia del array, no una vista. Esto significa que `select_indices` es **destructivo** — modifica el objeto `StarData` in-place, eliminando las estrellas no seleccionadas.

**Precondicion:** `indices` debe ser un array booleano o de enteros con la longitud correcta. No hay validacion de entrada.

#### 3.4.6. Copia Superficial (__copy__)

```python
def __copy__(self):
    newone = type(self)()     # Crea StarData vacio
    newone.epch = self.epoch   # BUG: "epch" en lugar de "epoch"
    newone.mags = self.mags
    newone.vectors = self.vectors
    newone.ids = self.ids
    newone.c = self.c
    newone.pm = self.pm
    newone.parallax = self.parallax
    newone.has_pm = self.has_pm
    return newone
```

**Bug detectado (linea 133):** El atributo se asigna como `newone.epch` en lugar de `newone.epoch`. Esto significa que la copia no conserva correctamente la epoca.

**Nota sobre la copia:** El metodo realiza una **copia superficial** (shallow copy). Los arrays de NumPy son objetos mutables, pero como `__copy__` asigna las referencias directamente, las copias comparten los mismos datos. Sin embargo, como `select_indices` crea nuevas copas de los arrays, y `np.copy` se usa en las funciones de regularizacion, esto es generalmente seguro en la practica del pipeline.

### 3.5. Analisis de Errores y Robustez

#### 3.5.1. Paralajes NaN y Negativos

| Entrada | Salida regularize_parallax | Interpretacion |
|---------|---------------------------|----------------|
| NaN | 1 (p_min) | Sin dato -> distancia maxima (1 kpc) |
| -5.0 | 1 (p_min) | Error de medida -> distancia maxima (1 kpc) |
| 0.5 | 1 (p_min) | Muy lejano -> distancia maxima (1 kpc) |
| 50.0 | 50.0 | Estrella cercana (~20 pc) |
| 100.0 | 100.0 | Estrella muy cercana (~10 pc) |

#### 3.5.2. Movimientos Propios NaN

| Entrada | Salida regularize_pm | Interpretacion |
|---------|---------------------|----------------|
| NaN | 0 | Sin dato -> sin movimiento propio |
| 5.2 | 5.2 | Dato valido (mas/yr) |
| -3.1 | -3.1 | Dato valido (direccion negativa) |

#### 3.5.3. Errores Potenciales

1. **Sin validacion de entrada:** No se verifica que `r` tenga todas las columnas necesarias. Un `KeyError` se propagaria si falta una columna.
2. **Sin validacion de dimensiones:** `pm` se crea como `(N, 2)` pero no se verifica que `r['pmra']` y `r['pmdec']` tengan longitud `N`.
3. **Bug en __copy__:** `newone.epch` en lugar de `newone.epoch`.
4. **Copia compartida:** `__copy__` no crea copias profundas de los arrays.

### 3.6. Patrones de Uso en el Pipeline

#### 3.6.1. Flujo Tipico (my_distortion_fitter.py)

```python
# 1. Buscar estrellas en Gaia
stardata0 = dbs.lookup_objects(*get_bbox(corners), time=lookupdate)

# 2. Corregir refraccion
stardata, alt, az = astrocorrect.correct_ra_dec(stardata0, options)

# 3. Seleccionar estrellas candidatas
mask_select = candidate_stars[:, 1] < magnitude_limit
stardata.select_indices(mask_select)

# 4. Ajustar distorsion
result, plate2_corrected, ... = distortion_polynomial.do_cubic_fit(
    plate2, stardata, initial_guess, image_size, options)

# 5. Actualizar epoca si necesario
stardata.update_epoch(date_string_to_float(dateguess))
```

#### 3.6.2. Patron de Inmutabilidad Parcial

El modulo sigue un patron donde:

1. `StarData` se crea una vez con datos de Gaia
2. `correct_ra_dec` crea un **shallow copy** y modifica las coordenadas
3. `select_indices` modifica el objeto in-place (destructivo)
4. `update_epoch` modifica el objeto in-place

Esto permite un pipeline fluido pero requiere cuidado al preservar datos originales.

#### 3.6.3. Integracion con Gaia Search (my_gaia_search.py)

```python
# Consulta Gaia -> StarData (sin pm)
return my_StarData.StarData(results, 2016, False)

# Consulta Gaia con epoca -> StarData (con pm)
return my_StarData.StarData(results, time, True)
```

El segundo argumento (`date`) debe ser un ano Juliano. El tercer argumento (`has_pm`) determina si se almacenan las coordenadas completas o solo RA/DEC.

### 3.7. Benchmark Estimado

Para `N` estrellas:

| Operacion | Complejidad | Tiempo estimado (N=1000) |
|-----------|-------------|--------------------------|
| Constructor (sin pm) | O(N) | ~1 ms |
| Constructor (con pm) | O(N) | ~10 ms (SkyCoord creation) |
| _update_vectors | O(N) | ~0.1 ms |
| update_epoch | O(N) | ~50-100 ms (apply_space_motion) |
| select_indices | O(N) | ~0.05 ms |
| regularize_parallax | O(N) | ~0.05 ms |
| __copy__ | O(N) | ~0.1 ms |

---

## 4. Diagramas de Clases y Relaciones

### 4.1. Diagrama de Clases UML Simplificado

```
+-------------------+
|     StarData      |
+-------------------+
| - epoch: Time     |
| - has_pm: bool    |
| - mags: ndarray   |
| - ids: ndarray    |
| - pm: ndarray(N,2)|
| - parallax: ndarray|
| - c: SkyCoord     |
| - vectors: ndarray(N,3)|
+-------------------+
| + __init__(r,date,has_pm)
| + nstars() -> int |
| + get_ra() -> ndarray
| + get_dec() -> ndarray
| + get_ra_dec() -> ndarray(N,2)
| + get_vectors() -> ndarray(N,3)
| + get_mags() -> ndarray
| + get_parallax() -> ndarray
| + get_pmotion() -> ndarray(N,2)
| + get_ids() -> ndarray
| + update_epoch(date)
| + select_indices(idx)
| + get_epoch_float() -> float
| + _update_vectors()
| + __copy__() -> StarData
+-------------------+
         |
         | usa
         v
+-------------------+
|    SkyCoord       |
|  (astropy)        |
+-------------------+
| - ra: Angle       |
| - dec: Angle      |
| - distance: Distance
| - pm_ra_cosdec    |
| - pm_dec          |
+-------------------+
         |
         | contiene
         v
+-------------------+
|   Distance        |
|  (astropy)        |
+-------------------+
| valor en mas      |
| -> Conversion     |
|   paralaje-dist   |
+-------------------+
```

### 4.2. Relacion con Modulos Externos

```
my_gaia_search.py  ──crea──>  StarData
                                  |
                  ┌───────────────┼───────────────┐
                  v               v               v
my_refraction_correction.py  my_distortion_polynomial.py  my_gravity_sweep.py
  (transforma coords)         (ajusta distorsion)         (barrido gravitacional)
                  |               |               |
                  v               v               v
              StarData corregido para ajuste
```

---

## 5. Analisis de Complejidad y Rendimiento

### 5.1. Complejidad Espacial

Para `N` estrellas:

| Atributo | Tipo | Espacio |
|----------|------|---------|
| mags | float64[N] | 8N bytes |
| ids | int64[N] | 8N bytes |
| pm | float64[N,2] | 16N bytes |
| parallax | float64[N] | 8N bytes |
| vectors | float64[N,3] | 24N bytes |
| c (SkyCoord) | objetos Astropy | ~100N bytes (estimado) |
| **Total** | | **~164N bytes** |

Para N=1000 estrellas: ~164 KB
Para N=10000 estrellas: ~1.6 MB

### 5.2. Bottlenecks Identificados

1. **SkyCoord creation:** La creacion de objetos `SkyCoord` con parallax y proper motion es el paso mas costoso (~10ms para 1000 estrellas). Esto se debe a la validacion interna de Astropy y la conversion de unidades.

2. **apply_space_motion:** La propagacion temporal es O(N) pero con una constante alta (~50-100ms) debido a las transformaciones de coordenadas completas.

3. **Sin paralelizacion:** No se usa multiprocesamiento ni GPU. Todo el procesamiento es secuencial en un solo hilo.

### 5.3. Optimizaciones Posibles

1. **Cache de vectores:** Los vectores solo cambian cuando cambia la epoca. Se podria implementar un patron de invalidacion de cache.

2. **Procesamiento por lotes:** Para catalogos grandes, se podria dividir el procesamiento en chunks.

3. **Usar numpy directamente:** Para operaciones simples como `get_ra_dec`, se podria evitar la creacion de SkyCoord y trabajar directamente con arrays.

---

## 6. Conclusiones

### 6.1. Resumen Matematico

El modulo `my_StarData.py` implementa la cadena completa de transformaciones necesarias para convertir datos brutos de Gaia DR3 en representaciones utilizables para astrometria:

1. **Coordenadas angulares → vectores unitarios:** Transformacion esferica a cartesiana
2. **Regularizacion:** Manejo de datos faltantes y no fisicos
3. **Propagacion temporal:** Movimiento propio lineal mas correcciones relativistas
4. **Transformacion ICRS → AltAz:** Inclusion de refraccion, aberracion y paralaje
5. **Coordenadas intermedias:** Proyeccion para ajuste polinomial de distorsion

### 6.2. Resumen Computacional

El modulo es un contenedor de datos eficiente que:

- Usa **vectorizacion NumPy** para todas las operaciones O(N)
- **No muta** los datos de entrada (usa `np.copy`)
- Tiene **complejidad espacial O(N)** con constante ~164 bytes/estrella
- Tiene **complejidad temporal O(N)** en la mayoria de operaciones
- Contiene un **bug menor** en `__copy__` (`epch` vs `epoch`)
- **No valida** entradas de forma robusta

### 6.3. Notas de Mantenimiento

1. Corregir el bug en `__copy__` (linea 133): `newone.epch` → `newone.epoch`
2. Considerar agregar `__repr__` y `__str__` para depuracion
3. Agregar validacion de columnas en el constructor
4. Documentar la semantica de la copia superficial vs. seleccion destructiva
5. Evaluar si `pandas` es necesario como dependencia (no se usa directamente)

---

*Informe generado a partir del analisis de* `my_StarData.py` *(142 lineas)* *y modulos relacionados del proyecto MEE2024 v6.*
