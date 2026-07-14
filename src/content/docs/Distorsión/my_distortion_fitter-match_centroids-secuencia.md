``` python
Módulo: my_distortion_fitter
METODO: MATCH_CENTRIODS

# se realiza la coincidencia de las estrellas observadas con las estrellas de la base de datos, obteniendo las coordenadas de las 
# estrellas observadas y candidatas que cumplen con los criterios de coincidencia, junto con una máscara booleana que indica 
# qué coincidencias se han seleccionado


ENTRADA
other_stars_df = other_stars_df.astype({'px':float, 'py':float})
    Unnamed: 0           px           py  area (pixels)  flux (noise-normed)
0            0  7875.330481  1883.693909           39.0          1869.038048
1            1  6964.118423  6238.133625           24.0           636.596233
2            2  5276.912429  6261.011716           22.0           620.799667
3            3  9397.126283  4612.081285           25.0           607.147149
4            4  2671.409749  2515.478228           21.0           547.813398
5            5  2203.273740  3644.866164           22.0           540.125289
6            6  6095.890539   978.911577           15.0           201.714850
7            7  8616.601647   788.164904           17.0           191.547868
8            8  1792.834206  3720.411170           14.0           191.250055
9            9  2660.317028  2509.834167           13.0           188.394970
10          10   807.687161  5805.385521           14.0           169.243022
11          11  7481.687551  4077.605236           12.0           168.533266
12          12  8077.708546    70.347735           12.0           159.960696
13          13  8272.872642  1782.914794           12.0           150.902063
14          14  6650.489299  5433.251732           10.0           130.918122
15          15  6685.430646  1030.623374           11.0           119.160181
16          16  8501.053259  3018.094216           10.0           115.214109
17          17   154.827081  2794.473906            9.0           100.636123
18          18  6967.809114  3534.109099            7.0            83.814716
19          19  7937.623768  2641.774347            5.0            68.308462
20          20  8714.459015  1598.873093            5.0            65.644262
21          21  6060.750406  4276.113203            5.0            56.048742
22          22  3196.400401  4427.860289            4.0            40.473367

initial_guess:  array([8.96647322e-06, 3.02608057e-01, 1.26090843e-01, 3.14446672e+00]),   --> resolución astrométrica expresada en radianes (platescale, ra, dec, roll)
dbs:  puntero base datos de Gaia
corners: array([[ 8.86572928, 19.822932], [ 5.57039083, 14.87196171], [ 8.85154165, 14.84445949], [ 5.5844759 , 19.81442432]])
image_size: [6388, 9576]
lookupdate: '2024-04-08'
options

stardata0, stardata, plate2, alt, az, mask_select = match_centroids(other_stars_df, initial_guess, dbs, corners, image_size, lookupdate, options)

stardata0:    Datos obtenidos de Gaia de las estrellas dentro del marco de la forografía 
stardata0.epoch:    2024.2833205563466
stardata0.has_pm:   True
stardata0.mags:     (439)     [11.723646, 9.568968, 10.562395, 10.3436165, 10.392679,  ...]
stardata0.ids:      (439)     [np.int64(2576292873595208960), np.int64(2576298787765722624), np.int64(2576376990530486272), np.int64(2576411075390509312),  ...]
stardata0.pm:       (439 x 2) [[ 1.14057981e+01, -2.20350278e+01], [-1.70122455e+01, -2.27628845e+01], [ 9.07173302e-01, -1.05941101e+01], [-6.46823232e-01, -4.46286882e+00] ...]
stardata0.parallax: (439)     [ 1.95006438,  3.29823581,  1.,  2.74720121,  3.95893598, ...]
stardata0.vectors:  (439 x 3) [[0.95091491, 0.29130219, 0.10442156], [0.94931749, 0.29596118, 0.10584561], [0.95400234, 0.28249305, 0.1003853 ], ...]
stardata0.c  (439 x 3)
    <SkyCoord (ICRS): (ra, dec, distance) in (deg, deg, pc)
        [(17.03186195, 5.99384127,  512.80358256), (17.31549762, 6.07588768,  303.19239058), (16.49473704, 5.76135825, 1000.), (15.83597229, 5.726643  ,  364.00682894), ...]] 
     
stardata:    Datos obtenidos de Gaia de las estrellas dentro del marco de la forografía y posteriormente corregidos
stardata.epoch:    2460409.2586805555
stardata.has_pm:   True
stardata.mags:     (18)     [11.723646,   9.568968, 10.562395, 10.3436165, ... ]
stardata.ids:      (18)     [np.int64(2576292873595208960), np.int64(2576298787765722624), np.int64(2576376990530486272), np.int64(2576411075390509312),  ...]
stardata.pm:       (18 x 2) [[ 1.14057981e+01, -2.20350278e+01], [-1.70122455e+01, -2.27628845e+01], [ 9.07173302e-01, -1.05941101e+01], [-6.46823232e-01, -4.46286882e+00] ...]
stardata.parallax: (18)     [ 1.95006438,  3.29823581,  1.,  2.74720121,  3.95893598, ...]
stardata.vectors:  (18 x 3) [[0.95091441, 0.29130198, 0.10442675],  [0.94931739, 0.29595985, 0.10585017], [0.95400099, 0.28249521, 0.10039208], ...]
stardata.c  (18 x 2)
    <SkyCoord (ICRS): (ra, dec) in deg
       [(17.03185908, 5.99414008), (17.31542598, 6.07615069), (16.49487826, 5.76174886), (15.83630152, 5.72705805), (16.53938877, 6.83354893), (18.91582031, 7.29292744), ...]

plate2:  Se devuelve un conjunto de datos de estrellas observadas y candidatas de other_stars_df que cumplen con los criterios de coincidencia   
     (18 x 2) [[-1310.30609148,  3087.33048147],  [ 3044.13362541,  2176.11842336], [ 3067.01171594,   488.91242919],  [ 1418.08128453,  4609.12628274], ...]
alt: 69.7668456109223
az:  142.77264717350687
mask_select:  Correspondencia de las estrellas candidato con stardata.c  
    (18)  [ 34,  64, 340, 224, 328, 284, 161, 366, 378, 127,  45, 272, 421, 92, 315, 387, 422,  48]
    
    
DESARROLLO DE LA RUTINA

stardata0 = dbs.lookup_objects(*get_bbox(corners), star_max_magnitude=options['max_star_mag_dist'], time=date_string_to_float(lookupdate))
# busca las estrellas en la base de datos Gaia dentro del área de la imagen y con magnitud menor que el límite especificado, en la fecha especificada
# query a Gaia:
# SELECT source_id, phot_g_mean_mag, COORD1(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec, radial_velocity, ref_epoch, 2024.2833205563466)),
#        COORD2(ESDC_EPOCH_PROP_POS(ra, dec, parallax, pmra, pmdec, radial_velocity, ref_epoch, 2024.2833205563466)), parallax, pmra, pmdec, ref_epoch 
# FROM gaiadr3.gaia_source 
# WHERE ra BETWEEN 14.844459491962114 AND 19.822931998699936 AND dec BETWEEN 5.570390832259767 AND 8.86572928281877 AND phot_g_mean_mag BETWEEN 3 AND 12.0

astrocorrect = refraction_correction.AstroCorrect()
stardata, alt, az = astrocorrect.correct_ra_dec(stardata0, options)
# Se crea una instancia de la clase AstroCorrect para aplicar correcciones de aberración y paralaje a las coordenadas RA y DEC de las estrellas observadas. Esto permite obtener coordenadas más precisas de las estrellas, considerando los efectos de la aberración y la paralaje.
# Se corrigen las coordenadas RA y DEC de las estrellas observadas utilizando la instancia de AstroCorrect, aplicando las correcciones de aberración y paralaje. Se devuelven las coordenadas corregidas de las estrellas, así como la altitud y azimut correspondientes. Esto permite obtener coordenadas más precisas de las estrellas, considerando los efectos de la aberración y la paralaje.

all_star_plate = np.array([other_stars_df['py'], other_stars_df['px']]).T - np.array([image_size[0]/2, image_size[1]/2])
# convierte las coordenadas de píxeles a coordenadas centradas en el centro de la imagen

transformed_all = transforms.to_polar(transforms.linear_transform(rough_platesolve_x, all_star_plate)) 
# transforma las coordenadas de píxeles a coordenadas polares utilizando la transformación lineal aproximada obtenida del platesolve

candidate_stars = np.zeros((stardata.nstars(), 2))
candidate_stars[:, 0] = np.degrees(stardata.get_dec())
candidate_stars[:, 1] = np.degrees(stardata.get_ra())
# crea una matriz de estrellas candidatas a partir de los datos de Gaia, con las coordenadas RA y DEC en grados 

neigh = NearestNeighbors(n_neighbors=2)
# encuentra los dos vecinos más cercanos para cada estrella observada en el conjunto de estrellas candidatas

neigh.fit(candidate_stars)
distances, indices = neigh.kneighbors(transformed_all)
# ajusta el modelo de vecinos más cercanos con las coordenadas de las estrellas candidatas y luego obtiene las distancias y los índices de los dos vecinos más cercanos para cada estrella observada

neigh_bar = NearestNeighbors(n_neighbors=1)   
# Se realiza una búsqueda de vecinos más cercanos para cada estrella observada en el conjunto de estrellas candidatas, utilizando la clase NearestNeighbors de sklearn. Se ajusta el modelo con las coordenadas de las estrellas candidatas y luego se obtienen las distancias y los índices de los dos vecinos más cercanos para cada estrella observada. Esto permite identificar qué estrellas candidatas están más cerca de cada estrella observada, lo cual es útil para emparejar las observaciones con los datos de la base de datos Gaia. 

neigh_bar.fit(transformed_all)
distances_bar, indices_bar = neigh_bar.kneighbors(candidate_stars)
# Se ajusta el modelo de vecinos más cercanos con las coordenadas de todas las estrellas candidatas y luego se obtienen las distancias y los índices del vecino más cercano para cada estrella observada. Esto permite identificar qué estrella candidata está más cerca de cada estrella observada, lo cual es útil para emparejar las observaciones con los datos de la base de datos Gaia. 

match_threshhold = options['rough_match_threshhold'] / 33600 # in degrees -> arcsec
confusion_ratio = 2 # closest match must be 2x closer than second place
# Se define un umbral de coincidencia y una relación de confusión para determinar qué coincidencias son válidas. Se filtran las coincidencias basándose en estas condiciones, asegurando que la relación de vecino más cercano sea reflexiva y eliminando coincidencias ambiguas.

keep = np.logical_and(distances[:, 0] < match_threshhold, distances[:, 1] / distances[:, 0] > confusion_ratio)  # note: this distance metric is not perfect (doesn't take into account meridian etc.)
keep = np.logical_and(keep, indices_bar[indices[:, 0]].flatten() == np.arange(indices.shape[0])) # is the nearest-neighbour relation reflexive? [this eliminates 1-to-many matching]
# Se crea una máscara booleana para identificar qué coincidencias cumplen con los criterios de distancia y relación de confusión. Además, se asegura que la relación de vecino más cercano sea reflexiva, eliminando coincidencias ambiguas. Esto permite seleccionar solo las coincidencias más confiables entre las estrellas observadas y las candidatas.

keep_i = np.nonzero(keep)
obs_matched = transformed_all[keep_i, :][0]
cata_matched = candidate_stars[indices[keep_i, 0], :][0]
# Se obtienen las estrellas observadas y las estrellas candidatas que cumplen con los criterios de coincidencia, utilizando la máscara booleana creada anteriormente. Esto permite trabajar solo con las coincidencias más confiables para el ajuste de distorsión.

DIBUJA UNA IMAGEN DE ESTRELLAS COINCIDENTES EN PLACA Y CATÁLOGO

mask_select = indices[keep_i, 0].flatten()
stardata.select_indices(mask_select)
plate2 = all_star_plate[keep_i, :][0]
# Se filtran las estrellas observadas y candidatas que cumplen con los criterios de coincidencia, eliminando aquellas que no cumplen con los criterios de distancia y relación de confusión. Esto permite obtener un conjunto de datos más confiable para el ajuste de distorsión.
```