``` python
MODULO: my_distortion_fitter    RUTINA: match_and_fit_distortion

# Se realiza un platesolve utilizando las coordenadas de las estrellas observadas y la información de la imagen, obteniendo 
# una estimación inicial de la distorsión. Si el resultado del platesolve indica que la imagen está reflejada, 
# se intercambian las coordenadas x e y de las estrellas observadas y se ajusta el tamaño de la imagen en consecuencia.
plate_solve_result = platesolve_triangle.platesolve(np.c_[other_stars_df['py'], other_stars_df['px']], image_size, dict(options, **{'flag_display':False})) 
# la estimación inicial de la distorsión es el resultado del platesolve initial_guess = plate_solve_result['x']


# Se convierten las coordenadas de los bordes de la imagen a coordenadas polares para buscar en la base de datos de Gaia las estrellas que se encuentran 
# dentro del área de la imagen. Esto permite obtener un conjunto de estrellas candidatas que pueden coincidir con las estrellas observadas en la imagen.
corners = transforms.to_polar(transforms.linear_transform(plate_solve_result['x'], np.array([[0,0], [image_size[0]-1., image_size[1]-1.], 
                                                                [0, image_size[1]-1.], [image_size[0]-1., 0]]) - np.array([image_size[0]/2, image_size[1]/2])))


# se realiza la coincidencia de las estrellas observadas con las estrellas de la base de datos, obteniendo las coordenadas de las estrellas observadas y 
# candidatas que cumplen con los criterios de coincidencia, junto con una máscara booleana que indica qué coincidencias se han seleccionado
stardata0, stardata, plate2, alt, az, mask_select = match_centroids(other_stars_df, initial_guess, dbs, corners, image_size, lookupdate, options)


# Se realiza un ajuste cúbico de la distorsión utilizando las coordenadas de las estrellas observadas y candidatas que cumplen con los criterios de 
# coincidencia. Se obtienen los resultados del ajuste, las coordenadas corregidas de las estrellas observadas y los coeficientes de distorsión en x e y, 
# así como el error estándar relativo de la escala de la placa. Esto permite obtener una estimación más precisa de la distorsión en la imagen.
result, plate2_corrected, _, _, _  = distortion_polynomial.do_cubic_fit(plate2, stardata, initial_guess, image_size, dict(options, **{'flag_display2':True}))

# Se calculan las banderas para identificar estrellas dobles, aquellas con movimiento propio faltante y outliers no explicados.
flag_is_double = np.zeros(stardata.ids.shape[0], int)
neigh_all = my_gaia_search.lookup_nearby(stardata, options['double_star_cutoff'], options['double_star_mag'])
neigh = NearestNeighbors(n_neighbors=2)
neigh_all_data_extra2 = np.r_[neigh_all.get_ra_dec(), np.array([[-99999,-99999], [-99999, -99999]])] # ensure at least 2 "pseudo-neighbours"


# Se ajusta el modelo de vecinos más cercanos con las coordenadas de todas las estrellas candidatas y luego se obtienen las distancias y los índices 
# de los dos vecinos más cercanos para cada estrella observada. Esto permite identificar qué estrellas candidatas están más cerca de cada estrella observada, 
# lo cual es útil para emparejar las observaciones con los datos de la base de datos Gaia. 
neigh.fit(neigh_all_data_extra2)
distances, indices = neigh.kneighbors(stardata.get_ra_dec())

# Se filtran las estrellas observadas y candidatas que cumplen con los criterios de coincidencia, eliminando aquellas que son outliers no explicados, 
# estrellas dobles o aquellas con movimiento propio faltante. Esto permite obtener un conjunto de datos más confiable para el ajuste final de la distorsión.
    
# Se crean copias de las coordenadas de las estrellas observadas y candidatas antes de filtrar los outliers, para poder comparar 
# los resultados finales con los datos originales. Esto permite evaluar la calidad del ajuste final de la distorsión y la efectividad del filtrado de outliers.
    
# Se realiza un ajuste cúbico de la distorsión utilizando las coordenadas de las estrellas observadas y candidatas que cumplen con 
# los criterios de coincidencia, junto con la estimación inicial de la distorsión. Se obtienen los resultados del ajuste, las coordenadas corregidas 
# de las estrellas observadas y los coeficientes de distorsión en x e y, así como el error estándar relativo de la escala de la placa. 
# Esto permite obtener una estimación más precisa de la distorsión en la imagen.
result, plate2_corrected, coeff_x, coeff_y, platescale_stderror = distortion_polynomial.do_cubic_fit(plate2, stardata, initial_guess, image_size, options)

# Se transforman las coordenadas de las estrellas observadas utilizando la estimación final de la distorsión y se calculan los errores de magnitud 
# en arcosegundos. Esto permite evaluar la calidad del ajuste final de la distorsión y la efectividad del filtrado de outliers.
transformed_final = transforms.linear_transform(result, plate2_corrected, image_size)
mag_errors = np.linalg.norm(transformed_final - stardata.get_vectors(), axis=1)
errors_arcseconds = np.degrees(mag_errors)*3600 

# Se calculan los errores de posición en píxeles comparando las coordenadas corregidas de las estrellas observadas con las coordenadas originales 
# de las estrellas, utilizando la estimación final de la distorsión. Esto permite evaluar la calidad del ajuste final de la distorsión y la efectividad 
# del filtrado de outliers. 
detransformed = transforms.detransform_vectors(result, stardata.get_vectors())
px_errors = plate2_corrected-detransformed
nn_corr, nn_r = get_nn_correlation_error(plate2, px_errors, options)
coeff_names = distortion_polynomial.get_coeff_names(options)

# Se guardan los resultados del ajuste final de la distorsión en un archivo JSON, incluyendo información sobre la versión del software, 
# el error RMS final, el número de estrellas utilizadas, la fecha de observación, los coeficientes de distorsión y otras configuraciones relevantes. 
# Esto permite documentar y analizar los resultados del ajuste de distorsión para futuras referencias.


# Se aplican las correcciones de distorsión a las coordenadas de las estrellas observadas antes de filtrar los outliers, utilizando 
# los coeficientes de distorsión obtenidos del ajuste final. Esto permite evaluar la calidad del ajuste final de la distorsión y 
# la efectividad del filtrado de outliers, comparando las coordenadas corregidas con las coordenadas originales.
plate2_unfiltered_corrected = distortion_polynomial.apply_corrections(result, plate2_unfiltered, coeff_x, coeff_y, image_size, options)
transformed_final = transforms.linear_transform(result, plate2_unfiltered_corrected, image_size)
mag_errors = np.linalg.norm(transformed_final - stardata_unfiltered.get_vectors(), axis=1)
errors_arcseconds = np.degrees(mag_errors)*3600


# Comentario: Se guardan los resultados de la identificación de las estrellas observadas y candidatas en un archivo CSV, incluyendo información 
# sobre las coordenadas originales y corregidas, los identificadores de Gaia, las magnitudes y las banderas de outliers, estrellas dobles 
# y movimiento propio faltante. Esto permite documentar y analizar los resultados del ajuste de distorsión para futuras referencias. 

#############################################################################################################################################


RUTINA: match_centroids
# se realiza la coincidencia de las estrellas observadas con las estrellas de la base de datos, obteniendo las coordenadas de las estrellas observadas y candidatas 
# que cumplen con los criterios de coincidencia, junto con una máscara booleana que indica qué coincidencias se han seleccionado
stardata0, stardata, plate2, alt, az, mask_select = match_centroids(other_stars_df, initial_guess, dbs, corners, image_size, lookupdate, options)

# busca las estrellas en la base de datos Gaia dentro del área de la imagen y con magnitud menor que el límite especificado, en la fecha especificada
stardata0 = dbs.lookup_objects(*get_bbox(corners), star_max_magnitude=options['max_star_mag_dist'], time=date_string_to_float(lookupdate)) 

# Se crea una instancia de la clase AstroCorrect para aplicar correcciones de aberración y paralaje a las coordenadas RA y DEC de las estrellas observadas. 
# Esto permite obtener coordenadas más precisas de las estrellas, considerando los efectos de la aberración y la paralaje.
astrocorrect = refraction_correction.AstroCorrect()

# Se corrigen las coordenadas RA y DEC de las estrellas observadas utilizando la instancia de AstroCorrect, aplicando las correcciones de aberración y paralaje. 
# Se devuelven las coordenadas corregidas de las estrellas, así como la altitud y azimut correspondientes. Esto permite obtener coordenadas más precisas de las estrellas,
# considerando los efectos de la aberración y la paralaje.
stardata, alt, az = astrocorrect.correct_ra_dec(stardata0, options) 

# convierte las coordenadas de píxeles a coordenadas centradas en el centro de la imagen
all_star_plate = np.array([other_stars_df['py'], other_stars_df['px']]).T - np.array([image_size[0]/2, image_size[1]/2])

# convierte las coordenadas de píxeles a coordenadas centradas en el centro de la imagen 
all_star_plate = np.array([other_stars_df['py'], other_stars_df['px']]).T   -   np.array([image_size[0]/2, image_size[1]/2])  

# transforma las coordenadas de píxeles a coordenadas polares utilizando la transformación lineal aproximada obtenida del platesolve
# input: cartesian 3-unit-vectors,  output: 2-vectors of polar coordinates in degrees
transformed_all = transforms.to_polar(transforms.linear_transform(rough_platesolve_x, all_star_plate)) 

# crea una matriz de estrellas candidatas a partir de los datos de Gaia, con las coordenadas RA y DEC en grados 
candidate_stars = np.zeros((stardata.nstars(), 2))
candidate_stars[:, 0] = np.degrees(stardata.get_dec())
candidate_stars[:, 1] = np.degrees(stardata.get_ra())

# encuentra los dos vecinos más cercanos para cada estrella observada en el conjunto de estrellas candidatas
neigh = NearestNeighbors(n_neighbors=2)
neigh.fit(candidate_stars)
distances, indices = neigh.kneighbors(transformed_all)

# Se realiza una búsqueda de vecinos más cercanos para cada estrella observada en el conjunto de estrellas candidatas, utilizando la clase NearestNeighbors de sklearn. 
# Se ajusta el modelo con las coordenadas de las estrellas candidatas y luego se obtienen las distancias y los índices de los dos vecinos más cercanos para cada estrella 
# observada. Esto permite identificar qué estrellas candidatas están más cerca de cada estrella observada, lo cual es útil para emparejar las observaciones con los datos 
# de la base de datos Gaia.
neigh_bar = NearestNeighbors(n_neighbors=1)
# Se ajusta el modelo de vecinos más cercanos con las coordenadas de todas las estrellas candidatas y luego se obtienen las distancias y los índices del vecino más cercano 
# para cada estrella observada. Esto permite identificar qué estrella candidata está más cerca de cada estrella observada, lo cual es útil para emparejar las observaciones 
# con los datos de la base de datos Gaia. 
neigh_bar.fit(transformed_all)
distances_bar, indices_bar = neigh_bar.kneighbors(candidate_stars)

# Se devuelve un conjunto de datos de estrellas observadas y candidatas que cumplen con los criterios de coincidencia, junto con las coordenadas de las estrellas 
# observadas en el plano de la imagen y una máscara booleana que indica qué coincidencias se han seleccionado. Esto permite realizar un ajuste de distorsión 
# más preciso utilizando solo las coincidencias más confiables.
mask_select = indices[keep_i, 0].flatten()
stardata.select_indices(mask_select)
plate2 = all_star_plate[keep_i, :][0]
return stardata0, stardata, plate2, alt, az, mask_select

###########################################################################################################################################

MODULO: distortion_polynomial
RUTINA: do_cubic_fit

# Se realiza un ajuste cúbico de la distorsión utilizando las coordenadas de las estrellas observadas y candidatas que cumplen con los criterios de coincidencia. 
# Se obtienen los resultados del ajuste, las coordenadas corregidas de las estrellas observadas y los coeficientes de distorsión en x e y, así como 
# el error estándar relativo de la escala de la placa. 
# Esto permite obtener una estimación más precisa de la distorsión en la imagen.

target = stardata.get_vectors()  # target is the true positions of the stars in 3D space, obtained from the stardata object. 
w = (max(img_shape)/2)           # computes the half-width of the image in pixels, which is used to normalize the polynomial basis functions.
m = 1 #result.x[0]               # for astrometrica convention

# open distortion reference files and get fixed coefficients and platescale 
# if platescale_uncertainties is empty, then combined_platescale_uncertainty is set to -1, indicating that no uncertainty could be calculated. 
# If there are at least 3 platescales but no uncertainties, the standard deviation of the platescales is used as an estimate of uncertainty. Otherwise, a warning is printed and -1 is returned.
fix_coeff_x, fix_coeff_y, fix_platescale, combined_platescale_uncertainty = _open_distortion_files(options)

# compute the total order and free order of the distortion polynomial based on the options provided. The total order is determined by the 'distortionOrder' option, 
# while the free order is determined by the 'distortion_fixed_coefficients' option. If 'distortion_fixed_coefficients' is set to 'None', the free order is set 
# to be equal to the total order.
order_total = mapping[options['distortionOrder']]
order_free = mapping[options['distortion_fixed_coefficients']] if not options['distortion_fixed_coefficients'] == 'None' else order_total

if order_free == 0: # special case for only constant degree of freedom: use a linear fit, then discard the stretch/skew coefficients
        q_corrected = _cubic_helper(initial_guess, plate, target, w, m, fix_coeff_x, fix_coeff_y, dict(options, **{'distortion_fixed_coefficients':'linear'}))[0]
        q_corrected = _cubic_helper(q_corrected, plate, target, w, m, fix_coeff_x, fix_coeff_y, dict(options, **{'distortion_fixed_coefficients':'linear'}))[0]
        q_corrected = tuple([np.radians(fix_platescale/3600)]+list(q_corrected[1:4]))
        plate_corrected = apply_corrections(q_corrected, plate, list(fix_coeff_x.values()), list(fix_coeff_y.values()), img_shape, options)
        detransformed = transforms.detransform_vectors(q_corrected, target)
        errors = detransformed - plate_corrected
        mean_error = np.mean(errors, axis=0)


```