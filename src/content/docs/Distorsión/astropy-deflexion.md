## Cuando astropy calcula la altura y azimut de una estrella tiene en cuenta la deflexión gravitacional?

Sí, **Astropy sí tiene en cuenta la deflexión gravitacional**, pero **solo en las transformaciones que pasan por marcos relativistas** (ICRS → GCRS → CIRS).  
Cuando finalmente conviertes a **AltAz**, la deflexión ya está incluida en la posición aparente.

**ICRS** -> (International Celestial Reference System): Es el Sistema de Referencia Celeste Internacional, el marco estándar adoptado por la Unión Astronómica Internacional para medir las posiciones de estrellas y objetos espaciales.

**GCRS** -> (Geocentric Celestial Reference System):  Es el Sistema de Referencia Celeste Geocéntrico, que es un sistema de coordenadas utilizado en astrodinámica para definir las posiciones de los objetos celestes respecto al centro de la Tierra. El GCRS se utiliza comúnmente en campos como la astronomía y la navegación por satélite para cálculos y posicionamientos precisos de naves espaciales.

**CIRS** -> (Celestial Intermediate Reference System): Es el sistema de coordenadas utilizado en astronomía y geodesia para describir las posiciones de los objetos celestes en relación con la Tierra. Tiene en cuenta la rotación y precesión de la Tierra, proporcionando una referencia estandarizada para observaciones precisas.

**AltAz** -> La conversión de coordenadas del sistema Celestial Intermediate Reference System (CIRS) al sistema local AltAz (Altitud/Azimut) requiere aplicar la latitud de observación, el momento exacto (Tiempo Universal/Sidéreo) y una rotación matricial para tener en cuenta la rotación de la Tierra.

##### Qué ocurre en cada paso


| Paso | Efectos aplicados |
| --- | --- |
| **ICRS → GCRS** | aberración + **deflexión gravitacional** + parallax |
| **GCRS → CIRS** | precesión + nutación  |
| **CIRS → AltAz** | rotación terrestre + refracción (si la activas) |



---

### Ejemplo de implementación 
Esta secuencia es la recomendada en la astronomía moderna (modelos IAU 2000/2006). El código realiza la transformación paso a paso: elimina el movimiento propio y el paralaje desde el espacio profundo (ICRS), aplica la aberración y deflexión gravitatoria hacia el centro de la Tierra (GCRS), añade la rotación del eje celeste (CIRS) y finalmente aplica la rotación terrestre y ubicación geográfica (AltAz).Código en Python (Astropy)

``` python
from astropy.coordinates import SkyCoord, EarthLocation, GCRS, CIRS, AltAz
from astropy.time import Time
import astropy.units as u

def transformar_coordenadas():
    # 1. Configuración del observador y el tiempo
    # (Parámetros necesarios a partir de la conversión a CIRS y AltAz)
    ubicacion = EarthLocation(lat=41.3879 * u.deg, lon=2.1699 * u.deg, height=100 * u.m)
    tiempo = Time('2026-07-09T22:00:00', scale='utc') # Usa hora UTC

    # 2. Definir la coordenada inicial en el sistema ICRS
    # (Sustituye ra y dec por los valores de tu objeto celeste)
    coordenada_icrs = SkyCoord(ra=192.8595 * u.deg, dec=27.1283 * u.deg, frame='icrs')
    print("--- 1. Coordenadas Originales (ICRS) ---")
    print(f"RA:  {coordenada_icrs.ra:.4f}")
    print(f"DEC: {coordenada_icrs.dec:.4f}\n")

    # 3. Paso de ICRS a GCRS (Sistema de Referencia Geocéntrico Celestial)
    # Requiere la época (tiempo) para calcular la posición de la Tierra
    marco_gcrs = GCRS(obstime=tiempo)
    coordenada_gcrs = coordenada_icrs.transform_to(marco_gcrs)
    print("--- 2. Transformado a GCRS ---")
    print(f"RA:  {coordenada_gcrs.ra:.4f}")
    print(f"DEC: {coordenada_gcrs.dec:.4f}\n")

    # 4. Paso de GCRS a CIRS (Sistema de Referencia Intermedio Celestial)
    # Introduce el origen intermedio celeste (CIO) y la nutación/precesión implícita
    marco_cirs = CIRS(obstime=tiempo)
    coordenada_cirs = coordenada_gcrs.transform_to(marco_cirs)
    print("--- 3. Transformado a CIRS ---")
    print(f"RA:  {coordenada_cirs.ra:.4f}")
    print(f"DEC: {coordenada_cirs.dec:.4f}\n")

    # 5. Paso de CIRS a AltAz (Horizontal Local)
    # Requiere tanto el tiempo exacto como la posición geográfica del observador
    marco_altaz = AltAz(location=ubicacion, obstime=tiempo)
    coordenada_altaz = coordenada_cirs.transform_to(marco_altaz)
    print("--- 4. Transformado a AltAz (Local) ---")
    print(f"Altitud: {coordenada_altaz.alt:.4f}")
    print(f"Azimut:  {coordenada_altaz.az:.4f}")

if __name__ == "__main__":
    transformar_coordenadas()

```

### Resumen
**Astropy usa ERFA (la versión libre de SOFA), y SOFA aplica la corrección de deflexión gravitacional por el Sol** cuando convierte coordenadas de catálogo (ICRS) a coordenadas aparentes.  
Esto ocurre **antes** de llegar al sistema AltAz.

### Qué son ERFA y SOFA 

SOFA y ERFA son los dos pilares de software sobre los que descansa la astronomía de posición moderna. Son las bibliotecas encargadas de realizar con precisión matemática los cálculos de conversión entre sistemas de coordenadas (como pasar de ICRS a AltAz), precesión, nutación y escalas de tiempo. [1, 2, 3, 4, 5] 
La relación entre ambas es íntima: ERFA es la versión de código abierto de SOFA. [3, 6] 

------------------------------
#### SOFA (Standards of Fundamental Astronomy)
Es un servicio oficial de la Unión Astronómica Internacional (IAU) creado en 1994. [4, 7] 


* Qué es: Es la colección definitiva de algoritmos estándar escritos en código fuente (ANSI C y Fortran) para astrometría. [1, 2] 
* Su propósito: Garantizar que todos los astrónomos e instituciones del mundo (como la NASA o el ESO) calculen las posiciones de las estrellas y planetas exactamente de la misma manera, usando los modelos oficiales de la IAU. [1, 2] 
* El problema: La licencia original de SOFA es muy restrictiva. Su código es "de solo lectura"; no se puede modificar, ni redistribuir libremente integrándolo en otros ecosistemas de software (como paquetes de Linux o grandes librerías de código abierto). [8, 9] 


#### ERFA (Essential Routines for Fundamental Astronomy)
Nació directamente de la comunidad astronómica (impulsado fuertemente por los desarrolladores de Astropy) para solucionar las trabas de licencia de SOFA. [5, 8, 10] 

* Qué es: Una réplica exacta de las funciones de SOFA escrita en lenguaje C, pero publicada bajo una licencia permisiva de código abierto (BSD de 3 cláusulas). [5, 6] 
* Su propósito: Permitir que los algoritmos de la IAU se puedan empaquetar libremente dentro de software moderno. Para cumplir con las condiciones legales de SOFA, lo único que hicieron fue cambiar el prefijo de las funciones (las funciones de SOFA empiezan por iau y las de ERFA empiezan por era). [8, 9] 
* Precisión: Al estar basada directamente en el código de SOFA, ofrece exactamente la misma precisión milimétrica en los cálculos astronómicos. [6, 9] 

------------------------------
### Cómo se conectan con el programa que acabamos de ver?
Cuando ejecutas un código en Python usando la librería Astropy (como el script del paso anterior para pasar de ICRS a AltAz), la magia ocurre tras bambalinas de la siguiente forma:

   1. Astropy no reinventa las matemáticas astronómicas.
   2. Utiliza un módulo llamado PyERFA, que es el "puente" (wrapper) oficial para usar la biblioteca ERFA en Python.
   3. ERFA ejecuta a velocidad de vértigo los algoritmos estándar en C.
   4. Esos algoritmos son idénticos a los estándares de SOFA de la Unión Astronómica Internacional. [3, 5, 6, 10] 

En resumen: SOFA dicta la norma científica, ERFA la libera para el software, y Astropy te la entrega de forma sencilla en Python. [11] 

[1] [https://ui.adsabs.harvard.edu](https://ui.adsabs.harvard.edu/abs/2014ascl.soft03026I/abstract) \
[2] [https://www.cosmosmataro.org](https://www.cosmosmataro.org/eines/usando-sofa-la-biblioteca-de-la-iau) \
[3] [https://www.cosmosmataro.org](https://www.cosmosmataro.org/eines/usando-sofa-la-biblioteca-de-la-iau/alternativas-a-sofa) \
[4] [https://www.scholarpedia.org](http://www.scholarpedia.org/article/Standards_of_Fundamental_Astronomy) \
[5] [https://www.freshports.org](https://www.freshports.org/astro/erfa) \
[6] [https://github.com](https://github.com/liberfa/erfa) \
[7] [https://www.scholarpedia.org](http://www.scholarpedia.org/article/Standards_of_Fundamental_Astronomy) \
[8] [https://www.iausofa.org](https://www.iausofa.org/other-implementations) \
[9] [https://github.com](https://github.com/liberfa/erfa/blob/master/LICENSE) \
[10] [https://pypi.org](https://pypi.org/project/pyerfa/2.0.0.1/) \
[11] [https://build.opensuse.org](https://build.opensuse.org/package/show/science/erfa)


### Cómo funciona ERFA?
Para ver cómo funciona ERFA a nivel interno sin las capas abstractas de Astropy, podemos llamar directamente a sus funciones matemáticas nativas escritas en C a través de la librería pyerfa. [1, 2] 
En el siguiente ejemplo calculamos el Tiempo Sidéreo Medio de Greenwich (GMST). Este cálculo mide el ángulo exacto de rotación de la Tierra respecto al equinoccio. Es el paso matemático intermedio y crucial que se ejecuta internamente para transformar coordenadas celestes fijas (como CIRS) a coordenadas locales del observador (como AltAz). [3] 
### Ejemplo con funciones nativas de ERFA
Para ejecutar este código necesitas tener instalado pyerfa: pip install pyerfa. [1, 4] 


``` python
import erfa
import numpy as np

# 1. Definir una fecha y hora: 9 de julio de 2026 a las 22:00:00 UTC
year, month, day = 2026, 7, 9
hour, minute, second = 22, 0, 0.0

# LLAMADA ERFA: 'eraDtf2d' descompone la fecha de calendario en dos partes de Fecha Juliana (JD)
# Esto se hace para mantener una precisión matemática extrema de nanosegundos.
status, jd1, jd2 = erfa.dtf2d("UTC", year, month, day, hour, minute, second)
print(f"Fecha Juliana calculada por ERFA: {jd1} + {jd2} días\n")

# 2. Calcular la rotación de la Tierra usando el modelo de la IAU 2006
# LLAMADA ERFA: 'eraGmst06' toma las dos partes de la Fecha Juliana 
# (Simplificación: asumimos UT1 ≈ UTC para el ejemplo)
gmst_rad = erfa.gmst06(jd1, jd2, jd1, jd2)

# 3. Convertir el resultado de radianes a formato legible de Horas, Minutos y Segundos
gmst_horas = np.degrees(gmst_rad) / 15.0  # 15 grados equivalen a 1 hora de rotación
horas = int(gmst_horas)
minutos = int((gmst_horas - horas) * 60)
segundos = ((gmst_horas - horas) * 60 - minutos) * 60

print("--- Cálculo nativo de ERFA ---")
print(f"Ángulo de rotación de la Tierra (GMST): {horas}h {minutos}m {segundos:.2f}s")


# Fecha Juliana calculada por ERFA: 2461230.5 + 0.9166666666666666 días
# --- Cálculo nativo de ERFA ---
# Ángulo de rotación de la Tierra (GMST): 17h 11m 24.41s
```

#### ¿Qué está pasando aquí?

* erfa.dtf2d: Es la rutina nativa de SOFA/ERFA que rompe el formato de calendario convencional y genera dos variables tipo double. Esto previene errores de redondeo de la CPU al procesar números muy grandes. [5, 6] 
* erfa.gmst06: Es el algoritmo oficial de la Unión Astronómica Internacional adaptado en 2006. Aplica cinemática pura para saber exactamente qué cara de la Tierra está mirando hacia el espacio en ese milisegundo específico.

Astropy es excelente para el trabajo diario porque nos ahorra tener que lidiar con radianes o conversiones de matrices de forma manual. Sin embargo, por debajo de su interfaz amigable, siempre está ERFA resolviendo estas ecuaciones complejas en microsegundos. [2, 3, 7] 

##### Ver cada paso “a mano” con `transform_to`

Puedes forzar tú mismo los pasos intermedios para ver qué está pasando:

```python


from astropy.coordinates import (
    SkyCoord, ICRS, GCRS, CIRS, AltAz, EarthLocation
)
from astropy.time import Time
from astropy import units as u

# --- 1. Coordenadas de Vega en ICRS ---
vega_icrs = SkyCoord("18h36m56.33635s", "+38d47m01.2802s", frame="icrs")

# --- 2. Tiempo de observación ---
t = Time("2025-01-01T00:00:00", scale="utc")

# --- 3. Ubicación: Barcelona ---
loc = EarthLocation(lat=41.3851*u.deg, lon=2.1734*u.deg, height=0*u.m)

# --- 4. Transformaciones paso a paso ---
vega_gcrs = vega_icrs.transform_to(GCRS(obstime=t))
vega_cirs = vega_gcrs.transform_to(CIRS(obstime=t))
vega_altaz = vega_cirs.transform_to(AltAz(obstime=t, location=loc))

# --- 5. Mostrar resultados ---
print("\n=== ICRS (catálogo) ===")
print(vega_icrs)

print("\n=== GCRS (aparente: aberración + deflexión gravitacional) ===")
print(vega_gcrs)

print("\n=== CIRS (precesión + nutación + rotación terrestre) ===")
print(vega_cirs)

print("\n=== AltAz (altura y azimut) ===")
print(vega_altaz)


#  === ICRS (catálogo) ===  
#    <SkyCoord (ICRS): (ra, dec) in deg
#    (279.23473479, 38.78368894)>
#
#  === GCRS (aparente: aberración + deflexión gravitacional) ===
#   <SkyCoord (GCRS: obstime=2025-01-01T00:00:00.000, : (ra, dec) in deg
#    (279.22732896, 38.7833344)>
#
#  === CIRS (precesión + nutación + rotación terrestre) ===
#   <SkyCoord (CIRS: obstime=2025-01-01T00:00:00.000, )
#    (279.11660645, 38.80357948, 1.)>

#  === AltAz (altura y azimut) ===
#  <SkyCoord (AltAz: obstime=2025-01-01T00:00:00.000, location=(4788976.70369061, 181747.36722855977, 4194606.303919401) m, pressure=0.0 hPa, temperature=0.0 deg_C, relative_humidity=0.0, obswl=1.0 micron): (az, alt) in deg
#      (2.87445408, -9.7428445)>

```

Así ves numéricamente cómo cambian las coordenadas en cada transformación.  
La **deflexión gravitacional** se aplica en el paso hacia GCRS (vía ERFA/SOFA), así que la diferencia entre ICRS y GCRS ya la incluye.

---

#### Comparar “con” y “sin” efectos aparentes

Si quieres jugar más fino, puedes comparar:

- **ICRS → GCRS** (aparente, con aberración + deflexión)
- Alguna versión “catálogo” sin esos efectos (por ejemplo, usando posiciones en otra época o ignorando la fecha).

Un truco sencillo:

```python
from astropy.coordinates import GCRS,  SkyCoord
from astropy.time import Time
import astropy.units as u

coord_icrs = SkyCoord(ra=10*u.deg, dec=20*u.deg, frame='icrs')

t1 = Time('2025-01-01T00:00:00', scale='utc')
t2 = Time('2025-06-01T00:00:00', scale='utc')

coord_gcrs_t1 = coord_icrs.transform_to(GCRS(obstime=t1))
coord_gcrs_t2 = coord_icrs.transform_to(GCRS(obstime=t2))

sep = coord_gcrs_t1.separation(coord_gcrs_t2)
print("Separación aparente entre fechas:", sep.to(u.mas))

#  Separación aparente entre fechas: 7.35798e-05 mas
```

Ahí estás viendo el efecto combinado de aberración, deflexión, etc., al cambiar la geometría Sol–Tierra–estrella.

---

[1] [https://github.com](https://github.com/liberfa/pyerfa) \
[2] [https://github.com](https://github.com/liberfa/pyerfa) \
[3] [https://medium.com](https://medium.com/@shankaravi6/astropy-essential-tools-part-1-every-python-space-developer-should-know-c1f8a1b555ef) \
[4] [https://pypi.org](https://pypi.org/project/pyerfa/) \
[5] [https://docs.astropy.org](https://docs.astropy.org/en/stable/time/index.html) \
[6] [https://docs.astropy.org](https://docs.astropy.org/en/stable/time/index.html) \
[7] [https://github.com](https://github.com/liberfa/pyerfa)


---

## ¿Dónde ocurre exactamente la deflexión?
La cadena típica es:

1. **ICRS** →  
2. **GCRS** (incluye aberración, deflexión gravitacional, parallax, etc.) →  
3. **CIRS** (incluye nutación, precesión, Earth rotation) →  
4. **AltAz** (incluye solo efectos atmosféricos si `pressure ≠ 0`)

La deflexión gravitacional se aplica en el paso **ICRS → GCRS**, usando las rutinas de ERFA:

- `eraLd()` — *light deflection by the Sun*  
- `eraLdn()` — *light deflection by multiple bodies*  

 [ld.c](https://github.com/liberfa/erfa/blob/master/src/ld.c), implementa exactamente esto.

---

### ¿Qué implica esto para tus cálculos de altura y azimut?
Cuando haces:

```python
coord = SkyCoord(...)
coord_altaz = coord.transform_to(AltAz(...))
```

Astropy ya ha aplicado:

- Precesión  
- Nutación  
- Aberración anual  
- Parallax  
- **Deflexión gravitacional por el Sol**  
- Rotación terrestre  
- (Opcional) **Refracción atmosférica** si `pressure > 0`

Por tanto, **sí**, la altura y el azimut que obtienes **incluyen la deflexión gravitacional**.

---

### Qué no incluye?
- Deflexión por planetas (solo se aplica si usas `eraLdn()` explícitamente; Astropy normalmente usa solo la solar).  
- Efectos relativistas de orden superior.  
- Modelos de refracción avanzados (solo el modelo rápido de ERFA).

---


## Programas como 'Stellarium o 'Cartes du ciel' tienen en cuenta la deflexión?

La respuesta corta es: Cartes du Ciel sí la tiene en cuenta, mientras que Stellarium no. [1, 2, 3] 
En la astronomía de posición, el término "deflexión" (o light deflection) se refiere específicamente a la deflexión relativista de la luz, provocada por la gravedad de un cuerpo masivo (principalmente el Sol) según la Teoría de la Relatividad General de Einstein. [4, 5] 
La forma en que ambos programas abordan esta corrección varía según sus objetivos de desarrollo:
###  Cartes du Ciel (SkyChart)
Este software está diseñado con un enfoque matemático y astrométrico riguroco, priorizando el control de telescopios y la precisión de las efemérides por encima de los gráficos en 3D. [6, 7] 

* Sí la incluye: Cartes du Ciel calcula internamente la precesión, la nutación, la aberración y la deflexión de la luz provocada por el Sol. [2, 8] 
* Cómo lo hace: En sus rutinas de cálculo (específicamente en su módulo u_projection.pas), aplica las correcciones estándar recomendadas por la Unión Astronómica Internacional (IAU) para entregar la posición aparente con una precisión interna típicamente mejor que 0.1 segundos de arco. [2] 
 

### Stellarium
Este programa prioriza el fotorrealismo, la inmersión visual y una interfaz fluida para la divulgación y la observación amateur visual. [6, 9] 

* No la incluye: Los desarrolladores principales de Stellarium han confirmado en sus bitácoras de desarrollo que no calculan la deflexión de la luz en los campos gravitatorios del Sol o de planetas masivos como Júpiter. Tampoco aplican otros efectos menores similares, como la aberración diurna. [1] 
* El motivo: Al ser un planetario visual, un desvío que en el peor de los casos (rozando el limbo solar) es de apenas 1.75 segundos de arco resulta completamente invisible e irrelevante en una pantalla a nivel de píxeles. [5] 

------------------------------
## ¿Por qué importa esto en tu cadena de conversión (ICRS ➔ GCRS ➔ CIRS ➔ AltAz)?
Si estás programando tu propio código (como vimos con Astropy/ERFA), tú sí la estás calculando. En el paso intermedio de ICRS a GCRS, los algoritmos nativos de ERFA aplican de forma obligatoria la deflexión relativista provocada por el Sol para poder determinar la posición exacta que ve un observador situado en la Tierra.
Si comparas los resultados de tus cálculos manuales de precisión con un software comercial:

* Las coordenadas de Cartes du Ciel coincidirán casi a la perfección con tu script.
* Las coordenadas de Stellarium mostrarán discrepancias de milisegundos o segundos de arco en objetos cercanos al plano de la eclíptica (cerca del Sol).


Si estás desarrollando un sistema de apuntado para un telescopio de alta gama o astrofotografía científica, te recomiendo tomar los datos de Cartes du Ciel (o mantener tu script con ERFA) para asegurar que ese desfase relativista esté corregido.

[1] [https://github.com](https://github.com/Stellarium/stellarium/discussions/3120) \
[2] [https://ftp.ast.cam.ac.uk](https://ftp.ast.cam.ac.uk/pub/rwa/outgoing/Downloads/doc_en.pdf)  \
[3] [https://www.researchgate.net](https://www.researchgate.net/publication/327807247_Comparison_of_astronomical_software_programs_for_archaeoastronomical_applications) \
[4] [https://technology.tresearch.ee](https://technology.tresearch.ee/index.php/JDIFP/article/download/9/8) \
[5] [https://www.researchgate.net](https://www.researchgate.net/publication/400786951_GRAVITATIONAL_LENSING_IN_GENERAL_RELATIVITY) \
[6] [https://www.astronomo.org](https://www.astronomo.org/foro/index.php?topic=32327.0) \
[7] [https://stargazerslounge.com](https://stargazerslounge.com/topic/232149-which-planetarium-software-you-like-and-why/) \
[8] [https://www.ap-i.net](http://www.ap-i.net/pub/skychart/doc/doc_en.pdf) \
[9] [https://www.astronomo.org](https://www.astronomo.org/foro/index.php?topic=32327.0) \



| Paso | Efectos aplicados |
| --- | --- |
| **ICRS → GCRS** | aberración + **deflexión gravitacional** + parallax |
| **GCRS → CIRS** | precesión + nutación + Earth rotation |
| **CIRS → AltAz** | rotación terrestre + refracción (si la activas) |