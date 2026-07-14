# Informe Exaustivo: my_gaia_search.py -- Matematica y Computacion

---

## 1. Introduccion y Contexto

my_gaia_search.py es un modulo del proyecto **MEE2024** que proporciona una interfaz de acceso al catalogo estelar **Gaia DR3** (Data Release 3) de la Agencia Espacial Europea (ESA) a traves del servicio **TAP** (Table Access Protocol) via la libreria astroquery. A diferencia de my_database_lookup2.py que opera con datos locales, este modulo realiza consultas en linea ADQL (Astronomical Data Query Language) al archivo Gaia, obteniendo posiciones, movimientos propios, paralajes y magnitudes con la precision del catalogo oficial.

El modulo es utilizado por:

- my_database_cache.py: Cache de catalogos (crea instancias dbs_gaia)
- my_distortion_fitter.py: Busqueda de estrellas cercanas para deteccion de dobles
- my_StarData.py: Creacion de objetos StarData con datos Gaia completos

---

## 2. Desarrollo Matematico

### 2.1. Consulta ADQL: Funcion ESDC_EPOCH_PROP_POS

#### 2.1.1. Propagacion de Epoca en Gaia

La funcion ESDC_EPOCH_PROP_POS es una funcion server-side de Gaia que implementa la propagacion del movimiento propio desde la epoca de referencia del catalogo (ref_epoch, tipicamente J2016.0) hasta una epoca objetivo T1:

`COORD1(alpha, delta, pi, mu_alpha, mu_delta, v_r, t0, t1) = alpha(t1)`
`COORD2(alpha, delta, pi, mu_alpha, mu_delta, v_r, t0, t1) = delta(t1)`

donde:

- `alpha, delta`: posicion en la epoca de referencia t0
- `pi`: paralaje (mas)
- `mu_alpha`: movimiento propio en ascension recta (mas/yr), pre-multiplicado por cos(delta)
- `mu_delta`: movimiento propio en declinacion (mas/yr)
- `v_r`: velocidad radial (km/s)
- `t0`: epoca de referencia del catalogo (J2016.0)
- `t1`: epoca objetivo

#### 2.1.2. Modelo de Propagacion Completo

La propagacion en Gaia incluye:

1. **Movimiento propio lineal:**

$$
\alpha(t) = \alpha_0 + \mu_{\alpha} * (t - t_0)
$$
$$
\delta(t) = \delta_0 + \mu_{\delta} * (t - t_0)
$$
2. **Paralaje (movimiento orbital terrestre):**

$$
D_{\alpha} = (pi / cos(\delta)) * (X_{sun}(t) - X_{sun}(t_0))
$$
$$
D_{\delta} = pi * (Y_{sun}(t) - Y_{sun}(t_0))
$$

donde $(X_{sun}, Y_{sun})$ son las coordenadas del Sol en el sistema de referencia del observador.

3. **Aberracion estelar:**

$$
D_{\theta} = (v_{Earth} / c) * sin(\theta)
$$

donde $v_{Earth}$ es la velocidad orbital de la Tierra (~30 km/s) y $c$ es la velocidad de la luz.

4. **Velocidad radial:**

$$
D_d = v_r * (t - t_0)
$$

donde $D_d$ es el cambio en distancia, que afecta la paralaje y la aberracion.

#### 2.1.3. Propagacion en el Servidor Gaia

La propagacion se realiza en el servidor Gaia usando el modelo **Barycentric Astrometric Reference System** (BARS), que incluye:

- Correcciones relativistas (efecto de Lense-Thirring)
- Aberracion estelar de segundo orden
- Paralaje dinamica (no solo posicion instantanea)
- Precesion y nutacion de la epoca

**Nota importante:** La funcion ESDC_EPOCH_PROP_POS es mas precisa que la propagacion lineal implementada en my_database_lookup2.py, ya que incluye todos estos efectos fisicos.

### 2.2. Funcion get_prop_pos: Propagacion Puntual (lineas 34-44)

#### 2.2.1. Consulta

```sql
SELECT COORD1(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec,
       radial_velocity, ref_epoch, T1)),
       COORD2(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec,
       radial_velocity, T1, ref_epoch)),
       pmra, pmdec
FROM gaiadr3.gaia_source
WHERE source_id = 5853498713190525696
```

**Error detectado (linea 36):** Los argumentos de COORD2 tienen T1 y ref_epoch invertidos en comparacion con COORD1. Esto podria producir resultados incorrectos.

#### 2.2.2. Salida

La funcion retorna una tupla `(ra, dec)` en grados para una estrella especifica en la epoca T1.

### 2.3. Funcion select_in_box: Busqueda Rectangular (lineas 46-59)

#### 2.3.1. Consulta ADQL

```sql
SELECT source_id, phot_g_mean_mag,
       COORD1(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec,
              radial_velocity, ref_epoch, T1)),
       COORD2(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec,
              radial_velocity, ref_epoch, T1)),
       parallax, pmra, pmdec, ref_epoch
FROM gaiadr3.gaia_source
WHERE ra BETWEEN ra_min AND ra_max
  AND dec BETWEEN dec_min AND dec_max
  AND phot_g_mean_mag BETWEEN 3 AND max_mag
```

#### 2.3.2. Rangos de Busqueda

El filtro espacial se define como un rectangulo en coordenadas ecuatoriales:

$$
\alpha ∈ [\alpha_{min}, \alpha_{max}]
$$
$$
\delta ∈ [\delta_{min}, \delta_{max}]
$$

**Nota:** Este filtro no maneja la discontinuidad de 360 grados en RA. Si el rango cruza 0/360, se deben hacer dos consultas separadas.

#### 2.3.3. Filtro de Magnitud

$$
m_G ∈ [3, m_{max}]
$$

El limite inferior de 3 magnitudes evita estrellas extremadamente brillantes que pueden estar saturadas en Gaia. El limite superior es configurable.

#### 2.3.4. Campos Obtenidos

| Campo | Descripcion | Unidad |
|-------|-------------|--------|
| source_id | Identificador unico Gaia DR3 | int64 |
| phot_g_mean_mag | Magnitud G media | mag |
| COORD1(...) | RA propagada a epoca T1 | grados |
| COORD2(...) | DEC propagada a epoca T1 | grados |
| parallax | Paralaje | mas |
| pmra | Movimiento propio en RA (x cos(dec)) | mas/yr |
| pmdec | Movimiento propio en DEC | mas/yr |
| ref_epoch | Epoca de referencia del catalogo | anos |

### 2.4. Funcion lookup_nearby: Busqueda de Estrellas Cercanas (lineas 61-88)

#### 2.4.1. Construccion de la Consulta

Para cada estrella en `startable`, se construye una region rectangular de busqueda:

```
alpha in [alpha_i - d/(3600 * cos(delta_i)), alpha_i + d/(3600 * cos(delta_i))]
delta in [delta_i - d/3600, delta_i + d/3600]
```

donde `d` es la distancia de busqueda en **arcsec** y los factores 3600 convierten arcsec a grados.

#### 2.4.2. Correccion por Convergencia de Meridianos

El termino `cos(delta_i)` en el denominador compensa la convergencia de los meridianos de ascension recta cerca de los polos:

```
D_alpha = d / (3600 * cos(delta))    [grados]
```

**Ejemplo numerico:**

Si `d = 10 arcsec` y `delta = 0 grados`:

```
D_alpha = 10 / (3600 * 1) = 0.00278 grados
```

Si `d = 10 arcsec` y `delta = 60 grados`:

```
D_alpha = 10 / (3600 * 0.5) = 0.00556 grados
```

**Problema polar:** Si `delta -> +/-90 grados`, entonces `cos(delta) -> 0` y `D_alpha -> infinito`. La consulta SQL cubriria toda la banda de RA, lo cual es correcto geometricamente pero ineficiente.

#### 2.4.3. Combinacion de Consultas con OR

Las consultas individuales se combinan con operador OR:

```sql
WHERE (condicion_estrella_1) OR (condicion_estrella_2) OR ... OR (condicion_estrella_N)
  AND phot_g_mean_mag BETWEEN 3 AND max_mag
```

**Nota sobre precedencia SQL:** La precedencia de operadores en SQL es AND antes que OR. Sin embargo, en la construccion de la cadena (linea 72), las condiciones se envuelven con parentesis explicitos `'(' + ' OR '.join(p) + ')'`, lo que garantiza la correcta evaluacion.

#### 2.4.4. Construccion de star_table (lineas 79-86)

```python
star_table = np.zeros((len(results), 9), dtype=float)
star_table[:, 0] = np.radians(results['ra'])       # RA en radianes
star_table[:, 1] = np.radians(results['dec'])      # DEC en radianes
star_table[:, 5] = results['phot_g_mean_mag']      # Magnitud G
star_table[:, 2] = np.cos(RA) * np.cos(DEC)        # vec_x
star_table[:, 3] = np.sin(RA) * np.cos(DEC)        # vec_y
star_table[:, 4] = np.sin(DEC)                     # vec_z
```

**Nota:** Las columnas 6, 7, 8 no se rellenan en esta funcion (a diferencia de dbs_gaia.lookup_objects). Esto significa que `lookup_nearby` no retorna parallax ni movimiento propio en el `star_table`. Ademas, el `star_table` se calcula pero no se usa en el retorno -- la funcion retorna directamente un objeto `StarData`.

#### 2.4.5. Retorno

```python
return my_StarData.StarData(results, 2016, False)
```

El tercer argumento `False` indica que **no** se debe usar movimiento propio. La epoca se fija a 2016 (J2016.0, epoca del catalogo Gaia DR3).

**Inconsistencia:** La consulta no propaga las coordenadas a una epoca dada por el usuario, sino que usa las coordenadas crudas del catalogo en la epoca de referencia. Esto es correcto si `startable` tambien esta en la epoca J2016.0, pero podria ser incorrecto si `startable` esta en otra epoca.

### 2.5. Clase dbs_gaia: Busqueda Principal (lineas 90-115)

#### 2.5.1. Constructor

```python
class dbs_gaia:
    def __init__(self, gaia_limit=13):
        self.gaia_limit = gaia_limit
```

El parametro `gaia_limit` establece el limite de seguridad de magnitud. Gaia DR3 tiene completitud hasta ~21 magnitudes, pero para aplicaciones de astrometria de placas fotograficas, un limite de 13 es razonable.

#### 2.5.2. Metodo lookup_objects

```python
def lookup_objects(self, range_ra, range_dec, star_max_magnitude=12, time=2024):
    if star_max_magnitude > self.gaia_limit:
        star_max_magnitude = self.gaia_limit
    results = select_in_box(time, range_ra, range_dec, star_max_magnitude)
```

**Flujo:**

1. Validacion de magnitud contra el limite de seguridad
2. Llamada a `select_in_box` con la epoca `time`
3. Construccion de `star_table` con 9 columnas
4. Retorno de objeto `StarData` con movimiento propio habilitado

#### 2.5.3. Estructura de star_table (lineas 102-113)

```python
star_table[:, 0] = np.radians(results['COORD1'])   # RA propagada (rad)
star_table[:, 1] = np.radians(results['COORD2'])   # DEC propagada (rad)
star_table[:, 5] = results['phot_g_mean_mag']       # Magnitud G
star_table[:, 6] = results['parallax']               # Paralaje (mas)
star_table[:, 2] = np.cos(RA) * np.cos(DEC)         # vec_x
star_table[:, 3] = np.sin(RA) * np.cos(DEC)         # vec_y
star_table[:, 4] = np.sin(DEC)                      # vec_z
star_table[:, 7] = results['pmra']                   # PM en RA (mas/yr)
star_table[:, 8] = results['pmdec']                  # PM en DEC (mas/yr)
```

**Comparacion con lookup_nearby:**

| Columna | dbs_gaia.lookup_objects | lookup_nearby |
|---------|------------------------|---------------|
| 0 (RA) | Propagada a T1 | Cruda (J2016.0) |
| 1 (DEC) | Propagada a T1 | Cruda (J2016.0) |
| 2-4 (xyz) | Calculados | Calculados |
| 5 (mag) | G magnitude | G magnitude |
| 6 (parallax) | Si | No |
| 7 (pmra) | Si | No |
| 8 (pmdec) | Si | No |

#### 2.5.4. Retorno

```python
return my_StarData.StarData(results, time, True)
```

El tercer argumento `True` indica que **si** se debe usar movimiento propio. La `StarData` resultante contiene:

- Coordenadas propagadas a la epoca `time`
- Parallax para calculo de distancia
- Movimiento propio para propagacion temporal futura

### 2.6. Funcion select_bright: Estrellas Brillantes (lineas 117-128)

#### 2.6.1. Consulta

```sql
SELECT SOURCE_ID, phot_g_mean_mag,
       COORD1(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec,
              radial_velocity, ref_epoch, T1)),
       COORD2(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec,
              radial_velocity, ref_epoch, T1))
FROM gaiadr3.gaia_source
WHERE phot_g_mean_mag BETWEEN -2 AND max_mag
```

**Diferencia con select_in_box:** No hay filtro espacial. Se buscan todas las estrellas brillantes (mag < max_mag) en todo el cielo.

**Rango de magnitud:** `[-2, max_mag]`. La magnitud -2 cubre las estrellas mas brillantes (Sirius: -1.46, Canopus: -0.74).

### 2.7. Transformacion de Coordenadas: Degrees a Radians a Vectores

#### 2.7.1. Cadena de Transformacion

```
Gaia DR3 (grados) --> np.radians() --> (rad) --> np.cos/np.sin() --> vectores (x,y,z)
```

#### 2.7.2. Formula de Conversion

Para cada estrella `i`:

```
alpha_rad = (pi / 180) * alpha_deg
delta_rad = (pi / 180) * delta_deg

x_i = cos(alpha_rad) * cos(delta_rad)
y_i = sin(alpha_rad) * cos(delta_rad)
z_i = sin(delta_rad)
```

#### 2.7.3. Propiedades de los Vectores

Los vectores son unitarios:

```
||v_i|| = sqrt(x_i^2 + y_i^2 + z_i^2) = 1
```

La distancia angular entre dos estrellas `i` y `j` es:

```
theta_ij = arccos(v_i . v_j)
```

---

## 3. Desarrollo Computacional (Informatico)

### 3.1. Arquitectura del Modulo

```
my_gaia_search.py
+-- Funciones auxiliares
|   +-- get_prop_pos(T1)           # Propagacion puntual
|   +-- select_in_box(T1, ra, dec, mag)  # Busqueda rectangular
|   +-- lookup_nearby(stable, dist, mag) # Busqueda cercana
|   +-- select_bright(T1, mag)     # Estrellas brillantes globales
+-- Clase dbs_gaia
|   +-- __init__(gaia_limit)
|   +-- lookup_objects(ra, dec, mag, time)
+-- Bloque __main__ (pruebas)
```

### 3.2. Dependencias

| Paquete | Uso |
|---------|-----|
| astroquery.gaia | Consultas TAP al servidor Gaia |
| astropy.units | Unidades fisicas (grados, mag) |
| matplotlib.pyplot | Graficas (bloque __main__) |
| numpy | Arrays numericos |
| my_StarData | Creacion de objetos StarData |

### 3.3. Flujo de Datos: Consulta Gaia

```
Usuario / Pipeline
        |
        v
my_gaia_search.py (consulta ADQL)
        |
        v
Servidor Gaia TAP (gaiacs.esac.esa.int)
        |
        v
Resultado: Astropy Table
        |
        +---> Propagacion server-side (ESDC_EPOCH_PROP_POS)
        |       +-- Movimiento propio
        |       +-- Paralaje
        |       +-- Aberracion
        |       +-- Velocidad radial
        |
        v
Construccion de star_table (N, 9)
        |
        v
my_StarData.StarData(results, epoch, has_pm)
        |
        v
Objeto StarData listo para uso
```

### 3.4. Implementacion Detallada

#### 3.4.1. Funcion get_prop_pos (lineas 34-44)

```python
def get_prop_pos(T1):
    query = f"SELECT COORD1(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec,
           radial_velocity, ref_epoch, {T1})),
           COORD2(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec,
           radial_velocity, T1, ref_epoch)), pmra, pmdec
    FROM gaiadr3.gaia_source
    WHERE source_id = 5853498713190525696"
    job = Gaia.launch_job_async(query)
    results = job.get_results()
    return results[0][0], results[0][1]
```

**Bug detectado:** En la linea del COORD2, los argumentos estan `radial_velocity, T1, ref_epoch` cuando deberian ser `radial_velocity, ref_epoch, T1` (igual que en COORD1). Esto puede producir resultados incorrectos.

**Complejidad:** O(1) -- consulta a una sola estrella.

**Tiempo estimado:** ~5-15 segundos (latencia de red + procesamiento server-side).

#### 3.4.2. Funcion select_in_box (lineas 46-59)

```python
def select_in_box(T1, ra_range, dec_range, max_mag):
    query = f"SELECT source_id, phot_g_mean_mag,
           COORD1(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec,
                  radial_velocity, ref_epoch, {T1})),
           COORD2(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec,
                  radial_velocity, ref_epoch, {T1})),
           parallax, pmra, pmdec, ref_epoch
    FROM gaiadr3.gaia_source
    WHERE ra BETWEEN {ra_range[0]} AND {ra_range[1]}
      AND dec BETWEEN {dec_range[0]} AND {dec_range[1]}
      AND phot_g_mean_mag BETWEEN 3 AND {max_mag}"
    job = Gaia.launch_job_async(query)
    results = job.get_results()
    return results
```

**Complejidad:** O(N) donde N es el numero de estrellas que satisfacen los filtros.

**Tiempo estimado:** ~10-30 segundos dependiendo del tamano del area consultada.

#### 3.4.3. Funcion lookup_nearby (lineas 61-88)

```python
def lookup_nearby(startable, distance, max_mag_neighbours):
    query = "SELECT source_id, phot_g_mean_mag, ra, dec, ref_epoch FROM gaiadr3.gaia_source WHERE "

    def helper(ra, dec):
        return f"(ra BETWEEN {ra - distance/3600/np.cos(dec):.5f} AND {ra + distance / 3600 / np.cos(dec):.5f} AND dec BETWEEN {dec - distance/3600:.5f} AND {dec + distance / 3600:.5f})"

    p = [helper(ra, dec) for (ra, dec) in zip(np.degrees(startable.get_ra()), np.degrees(startable.get_dec()))]
    query += '(' + ' OR '.join(p) + ')'
    query += f' AND phot_g_mean_mag BETWEEN 3 AND {max_mag_neighbours}'
    job = Gaia.launch_job_async(query)
    results = job.get_results()
    # ... construccion de star_table ...
    return my_StarData.StarData(results, 2016, False)
```

**Complejidad:**

- Construccion de la consulta: O(M) donde M es el numero de estrellas en `startable`
- Consulta SQL: O(N) donde N es el numero de resultados
- Total: O(M + N)

**Problema de rendimiento:** Para M estrellas grandes (M > 100), la consulta SQL se vuelve muy larga y puede exceder los limites del servidor TAP.

**Tiempo estimado:** ~10-60 segundos dependiendo de M y la densidad estelar.

#### 3.4.4. Clase dbs_gaia (lineas 90-115)

```python
class dbs_gaia:
    def __init__(self, gaia_limit=13):
        self.gaia_limit = gaia_limit

    def lookup_objects(self, range_ra, range_dec, star_max_magnitude=12, time=2024):
        if star_max_magnitude > self.gaia_limit:
            star_max_magnitude = self.gaia_limit
        results = select_in_box(time, range_ra, range_dec, star_max_magnitude)
        # ... construccion de star_table ...
        return my_StarData.StarData(results, time, True)
```

**Complejidad:** O(N) dominada por la consulta SQL.

**Tiempo estimado:** ~10-30 segundos.

### 3.5. Estructura de Datos: star_table

#### 3.5.1. Formato Completo (dbs_gaia, 9 columnas)

```
star_table: np.ndarray, shape (N, 9), dtype float64
+------+------+------+------+------+------+------+------+------+
| Col0 | Col1 | Col2 | Col3 | Col4 | Col5 | Col6 | Col7 | Col8 |
| RA   | DEC  | vecx | vecy | vecz | mag  | plx  | pmra | pmdec|
| (rad)|(rad) |      |      |      | (G)  |(mas) |(mas/y)|(mas/y)|
+------+------+------+------+------+------+------+------+------+
```

**Uso de memoria por estrella:** 9 x 8 bytes = **72 bytes** (float64).

#### 3.5.2. Formato Parcial (lookup_nearby, 6 columnas efectivas)

```
star_table: np.ndarray, shape (N, 9), dtype float64
+------+------+------+------+------+------+
| Col0 | Col1 | Col2 | Col3 | Col4 | Col5 |
| RA   | DEC  | vecx | vecy | vecz | mag  |
+------+------+------+------+------+------+
| Col6 | Col7 | Col8 = 0 (no usados)      |
+------+------+------------------------------+
```

**Nota:** Aunque star_table tiene 9 columnas, las columnas 6-8 no se rellenan en `lookup_nearby`.

### 3.6. Comparacion: Gaia Search vs Database Lookup

| Caracteristica | my_gaia_search.py | my_database_lookup2.py |
|----------------|-------------------|------------------------|
| Fuente de datos | Gaia DR3 (online) | Tycho-2 / NPZ (local) |
| Propagacion | Server-side completa | Lineal simple |
| Paralaje | Si | No |
| Velocidad radial | Si (en query) | No |
| Aberracion | Si (server-side) | No |
| Latencia de red | Si (~10-30 s) | No |
| Sin conexion | No | Si |
| Precision | Gaia DR3 (~mas) | Tycho-2 (~100 mas) |
| Limite de magnitud | ~21 G | ~12 VT |
| Tamano maximo consulta | ~50K estrellas | ~2.5M (local) |

### 3.7. Integracion con el Pipeline MEE2024

#### 3.7.1. Via my_database_cache.py

```python
# my_database_cache.py
_cache.catalogue_cache[path] = gaia_search.dbs_gaia(**kwaargs)
```

El cache crea una instancia `dbs_gaia` con el limite de magnitud especificado.

#### 3.7.2. Uso en my_distortion_fitter.py

```python
# Busqueda de estrellas cercanas para deteccion de dobles
neigh_all = my_gaia_search.lookup_nearby(stardata,
    options['double_star_cutoff'],
    options['double_star_mag'])
```

Esta funcion busca estrellas vecinas para identificar posibles estrellas dobles que podrian afectar el ajuste de distorsion.

### 3.8. Analisis de Errores y Bugs

#### 3.8.1. Bug en get_prop_pos (linea 36)

En la consulta SQL de `get_prop_pos`, los argumentos de `COORD2` estan invertidos:

```python
# Actual (INCORRECTO):
COORD2(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec,
       radial_velocity, T1, ref_epoch))

# Deberia ser:
COORD2(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec,
       radial_velocity, ref_epoch, T1))
```

#### 3.8.2. Inconsistencia en Epoca de lookup_nearby

`lookup_nearby` retorna `StarData(results, 2016, False)` con epoca fija a 2016. Si el `startable` de entrada esta en una epoca diferente, las coordenadas de las estrellas vecinas no seran consistentes.

#### 3.8.3. star_table No Usado en lookup_nearby

La funcion `lookup_nearby` construye un `star_table` completo (lineas 79-86) pero nunca lo retorna. El retorno es directamente `StarData(results, 2016, False)`. Esto es codigo muerto que desperdicia CPU.

#### 3.8.4. Duplicacion de Imports

```python
import numpy as np  # linea 5
import numpy as np  # linea 10 (duplicado)
```

#### 3.8.5. Variable No Definida en __main__

```python
ghjk = ghj  # linea 140 -- NameError: 'ghj' is not defined
```

Esta linea esta dentro de un bloque `if 0:` por lo que no se ejecuta, pero indica codigo de depuracion abandonado.

### 3.9. Rendimiento y Benchmarks Estimados

| Operacion | Tiempo estimado | Notas |
|-----------|----------------|-------|
| get_prop_pos (1 estrella) | ~5-15 s | Latencia de red dominante |
| select_in_box (area pequena) | ~10-20 s | ~100-1000 estrellas |
| select_in_box (area grande) | ~20-60 s | ~10K-50K estrellas |
| select_bright (todo el cielo) | ~30-120 s | ~100K+ estrellas |
| lookup_nearby (10 estrellas) | ~10-30 s | 10 condiciones OR |
| lookup_nearby (100 estrellas) | ~30-120 s | 100 condiciones OR |
| Construccion StarData | ~0.01-0.1 s | O(N), local |

### 3.10. Seguridad y Limites

#### 3.10.1. Limite de Magnitud

```python
if star_max_magnitude > self.gaia_limit:
    star_max_magnitude = self.gaia_limit
```

Esto previene consultas excesivamente grandes que podrian sobrecargar el servidor Gaia.

#### 3.10.2. Limites del Servidor Gaia

- Maximo de filas por consulta: ~50,000 (tipico)
- Timeout de consulta: ~300 segundos
- Maximo de caracteres en consulta ADQL: ~10,000

#### 3.10.3. Politica de Uso

El uso del servidor Gaia esta sujeto a las politicas de uso justo. No se recomienda hacer consultas masivas frecuentes.

---

## 4. Diagramas

### 4.1. Diagrama de Clases UML

```
+-------------------+
|     dbs_gaia      |
+-------------------+
| - gaia_limit: int |
+-------------------+
| + __init__(limit) |
| + lookup_objects( |
|   ra, dec, mag,   |
|   time) -> StarData|
+-------------------+
         |
         | usa
         v
+-------------------+     +------------------+
|   select_in_box   | --> | Gaia TAP Server  |
|   (funcion)       |     | (astroquery)     |
+-------------------+     +------------------+
         |                        |
         v                        v
+-------------------+     +------------------+
| Astropy Table     | --> | my_StarData      |
| (resultados)      |     | .StarData()      |
+-------------------+     +------------------+
```

### 4.2. Diagrama de Flujo: lookup_objects

```
dbs_gaia.lookup_objects(range_ra, range_dec, mag, time)
    |
    v
[mag > gaia_limit?] --Si--> Reducir a gaia_limit
    |
    v
select_in_box(time, ra_range, dec_range, mag)
    |
    v
[Construir consulta ADQL]
    |
    v
[Gaia.launch_job_async(query)]
    |
    v
[Esperar resultado (~10-30 s)]
    |
    v
[Construir star_table (N, 9)]
    |
    v
[my_StarData.StarData(results, time, True)]
    |
    v
[Retornar StarData con PM habilitado]
```

### 4.3. Diagrama de Flujo: lookup_nearby

```
lookup_nearby(startable, distance, max_mag)
    |
    v
[Para cada estrella en startable]
    |
    v
[Calcular bbox: RA +/- d/(3600*cos(dec))]
    |                    [DEC +/- d/3600]
    v
[Construir condicion SQL para cada estrella]
    |
    v
[Combinar con OR]
    |
    v
[Agregar filtro de magnitud con AND]
    |
    v
[Gaia.launch_job_async(query)]
    |
    v
[Resultados]
    |
    v
[Construir star_table (no usado)]
    |
    v
[my_StarData.StarData(results, 2016, False)]
    |
    v
[Retornar StarData sin PM]
```

---

## 5. Conclusiones

### 5.1. Resumen Matematico

El modulo implementa:

1. **Propagacion server-side completa:** ESDC_EPOCH_PROP_POS incluye movimiento propio, paralaje, aberracion y velocidad radial
2. **Busqueda espacial rectangular:** Filtros RA/DEC con compensacion por convergencia de meridianos
3. **Busqueda de vecinos:** Construccion de consultas OR para multiples regiones
4. **Transformacion de coordenadas:** Grados -> radianes -> vectores unitarios

### 5.2. Resumen Computacional

- **Complejidad:** O(N) dominada por la latencia de red y el procesamiento server-side
- **Uso de memoria:** ~72 bytes/estrella (float64, 9 columnas)
- **Latencia:** ~5-120 segundos dependiendo de la consulta
- **Bugs detectados:**
  1. Argumentos invertidos en `get_prop_pos` (linea 36)
  2. Codigo muerto en `lookup_nearby` (star_table no usado)
  3. Inconsistencia de epoca en `lookup_nearby`
  4. Import duplicado de numpy
  5. Variable no definida en bloque __main__

### 5.3. Recomendaciones

1. Corregir el bug en `get_prop_pos` (invertir argumentos de COORD2)
2. Eliminar el `star_table` muerto en `lookup_nearby`
3. Parametrizar la epoca en `lookup_nearby` en lugar de fijar 2016
4. Eliminar el import duplicado de numpy
5. Agregar manejo de errores para consultas fallidas (timeout, servidor no disponible)
6. Agregar caching de resultados para evitar consultas repetidas
7. Documentar los limites del servidor Gaia y politicas de uso

---

*Informe generado a partir del analisis de* `my_gaia_search.py` *(153 lineas)* *y modulos relacionados del proyecto MEE2024 v6.*
