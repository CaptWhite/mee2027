``` python
Módulo:  my_refraction_correction
Clase:  AstroCorrect
	Constructor
		self.origin_ld # rutina de la erfa para aplicar las correcciones (incluida la deflexión)
		self.no_ld     # rutina de la erfa modificada para que no haga el cálculo de la deflexión  (masa Sol=0)
		variable_ld(relative gravity) # define una función que ajusta la corrección de deflexión de la luz en función de la gravedad relativa.
	Métodos:
        # corrige las coordenadas de ascensión recta y declinación de un conjunto de datos estelares teniendo en cuenta la ubicación del observador, la fecha y hora de observación, y las condiciones atmosféricas. La función utiliza la biblioteca Astropy para realizar transformaciones de coordenadas y aplicar correcciones de aberración, paralaje, refracción y deflexión de la luz según las opciones proporcionadas. Devuelve los datos estelares corregidos junto con la altitud y azimut promedio de las estrellas observadas.
		correct_ra_dec(self, stardata, options, var_grav = None):   
            -> stardata    #  Datos corregidos 
            -> alt         #  Altura
            -Z Az          #  Azimut 

correct_ra_dec(self, stardata, options, var_grav = None):   
# define la ubicación del observador en la Tierra utilizando la latitud, longitud y altura proporcionadas en las opciones. Luego, crea un objeto de tiempo de observación combinando la fecha y hora especificadas. A continuación, obtiene los vectores de posición de las estrellas en el sistema de coordenadas ICRS (International Celestial Reference System) a partir de los datos estelares. Si se habilitan las correcciones de refracción, se crea un objeto AltAz (Altitud-Azimut) con las condiciones atmosféricas proporcionadas; de lo contrario, se crea un objeto AltAz sin correcciones atmosféricas. Luego, se transforman las coordenadas de las estrellas al sistema AltAz y se calculan los vectores unitarios correspondientes. Se encuentra la matriz de rotación que alinea los vectores locales con los vectores ICRS y se aplican las correcciones necesarias. Finalmente, se actualizan los datos estelares con las coordenadas corregidas y se devuelve el resultado junto con la altitud y azimut promedio. 
correct_ra_dec(self, stardata, options, var_grav = None):   
    
observing_location = EarthLocation(lat=options['observation_lat'], lon=options['observation_long'], height=options['observation_height']*u.m)  
observing_time = Time(options['observation_date'] + ' ' + options['observation_time'])
aa = AltAz(location=observing_location, obstime=observing_time,
               obswl=options['observation_wavelength']*u.micron, pressure=options['observation_pressure']*u.hPa,
               relative_humidity=options['observation_humidity']*u.m/u.m, temperature=options['observation_temp']*u.deg_C)

icrs_v = stardata.get_vectors()   # obtiene los vectores de posición de las estrellas en el sistema de coordenadas ICRS a partir de los datos estelares.
coord = stardata.c                # obtiene las coordenadas de las estrellas a partir de los datos estelares.
local = coord.transform_to(aa)    # transforma las coordenadas de las estrellas al sistema de coordenadas AltAz (Altitud-Azimut) utilizando la ubicación y el tiempo de observación especificados. Esto permite obtener la posición aparente de las estrellas en el cielo desde la perspectiva del observador.         

local_v = as_unit_vector(local)   # convierte un objeto de coordenadas AltAz en un vector unitario 3D.
rot = _find_rotation_matrix(local_v, icrs_v) # calcula la matriz de rotación de mínimos cuadrados entre dos conjuntos de vectores. Toma como entrada dos arrays de forma (N, 3) que representan los vectores de imagen y los vectores del catálogo, respectivamente. Devuelve la matriz de rotación que minimiza la diferencia entre los dos conjuntos de vectores. 
corrected = (rot.T @ local_v.T).T
delta = corrected - icrs_v
        print('rms diff of corrections (arcsec)', np.degrees(np.linalg.norm(delta)/delta.shape[0])*3600)
        ret = copy.copy(stardata) # note this is shallow copy
```