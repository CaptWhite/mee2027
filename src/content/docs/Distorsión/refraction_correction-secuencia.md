# Módulo:  my_refraction_correction
### Clase:  AstroCorrect
#####	Constructor
``` python
		self.origin_ld # rutina de la erfa para aplicar las correcciones (incluida la deflexión)
		self.no_ld     # rutina de la erfa modificada para que no haga el cálculo de la deflexión  (masa Sol=0)
		variable_ld(relative gravity) # define una función que ajusta la corrección de deflexión de la luz en función de la gravedad relativa.
	Métodos:
        correct_ra_dec(self, stardata, options, var_grav = None)
        # Devuelve:
            -> stardata    #  Datos corregidos 
            -> alt         #  Altura
            -Z Az          #  Azimut  
```

### correct_ra_dec(self, stardata, options, var_grav = None)
Corrige las coordenadas de ascensión recta y declinación de un conjunto de datos estelares teniendo en cuenta la ubicación del observador, la fecha y hora de observación, y las condiciones atmosféricas. La función utiliza la biblioteca Astropy para realizar transformaciones de coordenadas y aplicar correcciones de aberración, paralaje, refracción y deflexión de la luz según las opciones proporcionadas. Devuelve los datos estelares corregidos junto con la altitud y azimut promedio de las estrellas observadas.

Este método define la ubicación del observador en la Tierra utilizando la latitud, longitud y altura proporcionadas en las opciones. Luego, crea un objeto de tiempo de observación combinando la fecha y hora especificadas. A continuación, obtiene los vectores de posición de las estrellas en el sistema de coordenadas ICRS (International Celestial Reference System) a partir de los datos estelares. Si se habilitan las correcciones de refracción, se crea un objeto AltAz (Altitud-Azimut) con las condiciones atmosféricas proporcionadas; de lo contrario, se crea un objeto AltAz sin correcciones atmosféricas. Luego, se transforman las coordenadas de las estrellas al sistema AltAz y se calculan los vectores unitarios correspondientes. Se encuentra la matriz de rotación que alinea los vectores locales con los vectores ICRS y se aplican las correcciones necesarias. Finalmente, se actualizan los datos estelares con las coordenadas corregidas y se devuelve el resultado junto con la altitud y azimut promedio. 

---

``` python    
observing_location = EarthLocation(lat=options['observation_lat'], lon=options['observation_long'], height=options['observation_height']*u.m)  
observing_time = Time(options['observation_date'] + ' ' + options['observation_time'])
aa = AltAz(location=observing_location, obstime=observing_time,
               obswl=options['observation_wavelength']*u.micron, pressure=options['observation_pressure']*u.hPa,
               relative_humidity=options['observation_humidity']*u.m/u.m, temperature=options['observation_temp']*u.deg_C)
``` 

Se define la ubicación del observador en la Tierra utilizando la latitud, longitud y altura proporcionadas en las opciones. Luego, crea un objeto de tiempo de observación combinando la fecha y hora especificadas.

---

``` python 
icrs_v = stardata.get_vectors()   
``` 

obtiene los vectores de posición de las estrellas en el sistema de coordenadas ICRS a partir de los datos estelares.

--- 

``` python 
coord = stardata.c
```
obtiene las coordenadas de las estrellas a partir de los datos estelares.

---

``` python 
local = coord.transform_to(aa)    
```
Transforma las coordenadas de las estrellas al sistema de coordenadas AltAz (Altitud-Azimut) utilizando la ubicación y el tiempo de observación especificados. Esto permite obtener la posición aparente de las estrellas en el cielo desde la perspectiva del observador.         

---
``` python 
local_v = as_unit_vector(local)   
```
Convierte el objeto de coordenadas AltAz en un vector unitario 3D.

---
``` python 
rot = _find_rotation_matrix(local_v, icrs_v) # 
```
**Ver modulo _find_rotation_matrix**
Calcula la matriz de rotación de mínimos cuadrados entre dos conjuntos de vectores. Toma como entrada dos arrays de forma (N, 3) que representan los vectores de imagen y los vectores del catálogo, respectivamente. Devuelve la matriz de rotación que minimiza la diferencia entre los dos conjuntos de vectores. 

---

```python
corrected = (rot.T @ local_v.T).T
```
aplica la matriz de rotación calculada a los vectores locales para obtener los vectores corregidos en el sistema de coordenadas ICRS. Esto alinea las posiciones aparentes de las estrellas con sus posiciones reales en el cielo, teniendo en cuenta las correcciones aplicadas.

--- 

```python
delta = corrected - icrs_v
```
calcula la diferencia entre los vectores corregidos y los vectores originales en el sistema de coordenadas ICRS. Esto permite evaluar la magnitud de las correcciones aplicadas a las posiciones de las estrellas.

--- 
``` python 
print('rms diff of corrections (arcsec)', np.degrees(np.linalg.norm(delta)/delta.shape[0])*3600)
```
calcula la raíz cuadrada del promedio de los cuadrados de las diferencias entre los vectores corregidos y los vectores originales, y luego convierte el resultado a segundos de arco. Esto proporciona una medida de la precisión de las correcciones aplicadas a las posiciones de las estrellas, indicando cuánto se han ajustado en promedio en términos de ángulo en el cielo.

---  
``` python  
ret = copy.copy(stardata) # note this is shallow copy
```
---

``` python  
app_ra = np.arctan2(corrected[:, 1], corrected[:, 0]) # RA
app_ra += (app_ra < 0) * 2 * np.pi # 0 to 2pi convention
app_dec = np.arctan(corrected[:, 2] / np.sqrt(corrected[:, 0]**2 + corrected[:, 1]**2)) # DEC
c_app = SkyCoord(ra=app_ra * u.rad, dec=app_dec * u.rad, obstime=observing_time)
```

calcula la ascensión recta y declinación aparentes de las estrellas a partir de los vectores corregidos. La ascensión recta se obtiene utilizando la función arctan2 para calcular el ángulo entre los componentes y, si es necesario, se ajusta para que esté en el rango de 0 a 2π. La declinación se calcula utilizando la función arctan para obtener el ángulo entre el componente z y la magnitud del vector proyectado en el plano xy. Luego, se crea un objeto SkyCoord con las coordenadas aparentes calculadas y se actualizan los datos estelares con estas coordenadas corregidas.

---
``` python  
ret.epoch = observing_time  
ret.haspm = False 
ret.c = c_app
ret._update_vectors() 
erfa.ld = self.origin_ld # revert erfa to normal once we are done with it
return ret, np.mean(local.alt.degree), np.mean(local.az.degree)
```
- Actualiza la época de los datos estelares con el tiempo de observación especificado.
- Indica que los datos estelares no tienen información de movimiento propio (proper motion).
- Actualiza las coordenadas de los datos estelares con las coordenadas aparentes calculadas (c_app), que reflejan las posiciones corregidas de las estrellas teniendo en cuenta las correcciones aplicadas.
- Llama al método interno _update_vectors() de los datos estelares para actualizar los vectores de posición internos basados en las coordenadas corregidas. Esto asegura que los vectores reflejen las posiciones ajustadas de las estrellas después de aplicar las correcciones.
- Revierte la rutina de erfa al estado normal una vez utilizada.
- Devuelve los datos estelares corregidos (ret) junto con la altitud promedio y el azimut promedio de las estrellas observadas en grados. Esto proporciona información sobre la posición aparente de las estrellas en el cielo desde la perspectiva del observador después de aplicar las correcciones.

---