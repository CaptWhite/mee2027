``` python
C:\Users\captw\workspaces\MEE2027\MEE2024.v6\Source\mee2024\_working3\_documents\distortion\distortion_polynomial-do_cubic_fit-_cubic_helper.txt

MÓDULO:  distortion_polynomial
MÉTODO:  do_cubic_fit

ENTRADA:
plate:  Se devuelve un conjunto de datos de estrellas observadas y candidatas de other_stars_df que cumplen con los criterios de coincidencia   
     (18 x 2) [[-1310.30609148,  3087.33048147],  [ 3044.13362541,  2176.11842336], [ 3067.01171594,   488.91242919],  [ 1418.08128453,  4609.12628274], ...]

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

initial_guess:  [8.96647322e-06, 3.02608057e-01, 1.26090843e-01, 3.14446672e+00]),   --> resolución astrométrica expresada en radianes (platescale, ra, dec, roll)

image_size [6388, 9576]

result, plate2_corrected, _, _, _  = distortion_polynomial.do_cubic_fit(plate, stardata, initial_guess, image_size, dict(options, **{'flag_display2':True}))
# Se realiza un ajuste cúbico de la distorsión utilizando las coordenadas de las estrellas observadas y candidatas que cumplen con los criterios de coincidencia. Se obtienen los resultados del ajuste, las coordenadas corregidas de las estrellas observadas y los coeficientes de distorsión en x e y, así como el error estándar relativo de la escala de la placa. Esto permite obtener una estimación más precisa de la distorsión en la imagen.

return q_corrected, plate_corrected, coeff_x, coeff_y, platescale_stdrelerror
SALIDA:
q_corrected
plate2_corrected
coeff_x
coeff_y
platescale_stdrelerror

-----------------------------------------------

DESARROLLO DE LA RUTINA:
    
target = stardata.get_vectors()    
# obtiene los vectores de posición de las estrellas del catálogo estelar, que se utilizarán como referencia para la regresión lineal.

w = (max(img_shape)/2) 
# calcula la mitad del tamaño máximo de la imagen, que se utilizará como factor de escala para normalizar las coordenadas de las estrellas en el plano de la imagen.

m = 1
# comentario: establece un factor de escala m en 1, que se utilizará para normalizar los errores de posición de las estrellas en el plano de la imagen.

fix_coeff_x, fix_coeff_y, fix_platescale, combined_platescale_uncertainty = _open_distortion_files(options)
# abre los archivos de distorsión y obtiene los coeficientes fijos para las coordenadas x e y, así como la escala de placa fija y la incertidumbre combinada de la escala de placa. Estos valores se utilizarán para ajustar la regresión lineal y mejorar la precisión de la transformación de coordenadas. 
Si no hay ficheros de calibración:  fix_coeff_x={}  fix_coeff_y={}  fix_platescale=nan   combined_platescale_uncertainty=-1
     
order_total = mapping[options['distortionOrder']]               # 5
order_free = mapping[options['distortion_fixed_coefficients']]  # 5

if order_free == 0: # special case for only constant degree of freedom: use a linear fit, then discard the stretch/skew coefficients
# comentario: caso especial para solo un grado de libertad constante: utiliza un ajuste lineal, luego descarta los coeficientes de estiramiento/ sesgo

q_corrected = _cubic_helper(initial_guess, plate, target, w, m, fix_coeff_x, fix_coeff_y, options, weights=weights)[0]

# PRIMERA VEZ
# realiza la regresión lineal solicitada con un polinomio general en x e y del orden solicitado (1, 3 o 5). Toma como entrada una suposición inicial de (escala de placa, ascensión recta, declinación, rotación), las coordenadas (x, y) de las estrellas en el plano de la imagen y las posiciones verdaderas correspondientes (x', y', z') de las estrellas según el catálogo. Devuelve un platesolve (escala de placa, ascensión recta, declinación, rotación) más ajustado.

q_corrected = _cubic_helper(initial_guess, plate, target, w, m, fix_coeff_x, fix_coeff_y, options, weights=weights)[0]
# SEGUNDA VEZ
# realiza la regresión lineal solicitada con un polinomio general en x e y del orden solicitado (1, 3 o 5). Toma como entrada una suposición inicial de (escala de placa, ascensión recta, declinación, rotación), las coordenadas (x, y) de las estrellas en el plano de la imagen y las posiciones verdaderas correspondientes (x', y', z') de las estrellas según el catálogo. Devuelve un platesolve (escala de placa, ascensión recta, declinación, rotación) más ajustado.

q_corrected, plate_corrected, coeff_x, coeff_y, basis, errors, reg_x, reg_y, platescale_stdrelerror = _cubic_helper(initial_guess, plate, target, w, m, fix_coeff_x, fix_coeff_y, options, weights=weights)
# TERCERA VEZ
# realiza la regresión lineal solicitada con un polinomio general en x e y del orden solicitado (1, 3 o 5). Toma como entrada una suposición inicial de (escala de placa, ascensión recta, declinación, rotación), las coordenadas (x, y) de las estrellas en el plano de la imagen y las posiciones verdaderas correspondientes (x', y', z') de las estrellas según el catálogo. 
# Devuelve un platesolve (escala de placa, ascensión recta, declinación, rotación) más ajustado + el plete corregido + coeficientes 'x' e 'y' + ...

return q_corrected, plate_corrected, coeff_x, coeff_y, platescale_stdrelerror
# Devuelve 



------------------------------------------------------------------------------------------------------------

MÓDULO:  distortion_polynomial
MÉTODO:  _cubic_helper

ENTRADA:
initial_guess:  [8.96647322e-06, 3.02608057e-01, 1.26090843e-01, 3.14446672e+00]),   --> resolución astrométrica expresada en radianes (platescale, ra, dec, roll)

plate:  Se devuelve un conjunto de datos de estrellas observadas y candidatas de other_stars_df que cumplen con los criterios de coincidencia   
     (18 x 2) [[-1310.30609148,  3087.33048147],  [ 3044.13362541,  2176.11842336], [ 3067.01171594,   488.91242919],  [ 1418.08128453,  4609.12628274], ...]

target: (18 x 3)  los vectores de posición de las estrellas del catálogo estelar
    [[0.95341086, 0.26863306, 0.13727349],  [0.95552184, 0.27796182, 0.0985659 ], [0.9511993 , 0.29245642, 0.09843334], [0.95993765, 0.2564564 , 0.11291516],

w: 4788     mitad del tamaño máximo de la imagen

m:  1       factor de escala

fix_coeff_x: {}

fix_coeff_y: {}

weights: 1    ???????




q_corrected = _cubic_helper(initial_guess, plate, target, w, m, fix_coeff_x, fix_coeff_y, options, weights=weights)[0]
# realiza la regresión lineal solicitada con un polinomio general en x e y del orden solicitado (1, 3 o 5). Toma como entrada una suposición inicial de (escala de placa, ascensión recta, declinación, rotación), las coordenadas (x, y) de las estrellas en el plano de la imagen y las posiciones verdaderas correspondientes (x', y', z') de las estrellas según el catálogo. Además, se ha agregado una opción para centroides ponderados.

SALIDA:
    
-----------------------------------------------

DESARROLLO DE LA RUTINA:  
    
    
    
    
detransformed = transforms.detransform_vectors(q, target)    
# Convierte las coordenadas 3D de las estrellas de catalogo a pixeles con los valores del platesolve.
#  Esta función realiza la transformación inversa de coordenadas desde vectores 3D celestes a coordenadas intermedias similares a píxeles. Toma como entrada una tupla de 4 elementos que representa la escala de placa y las coordenadas (ascensión recta, declinación, rotación), así como un array de forma (n, 3) que contiene n vectores 3D de posiciones estelares. La salida es un array de forma (n, 2) que contiene n vectores 2D de coordenadas intermedias. Rotaciones de Euler)

errors = detransformed - plate
# Calcula los errores entre las coordenadas transformadas y las coordenadas de placa observadas. Luego, genera una base de funciones polinómicas (o de Legendre) según el orden especificado en las opciones. Esta base se utiliza para realizar la regresión lineal y ajustar los errores.

basis = get_basis(plate[:, 0], plate[:, 1], w, m, options, use_special)
# (18 x 20)  Está haciendo las coperaciones:  y^j * x^(i-j) para posteriormente determinar los coeficientes. 
# comentario: Esta función genera una base de funciones polinómicas (o de Legendre) según el orden especificado en las opciones. La base se utiliza para realizar la regresión lineal y ajustar los errores entre las coordenadas transformadas y las coordenadas de placa observadas. Toma como entrada las coordenadas y, x de las estrellas en el plano de la imagen, un factor de escala w, un factor de escala m, un diccionario de opciones y un indicador use_special que determina si se deben utilizar funciones especiales.

order_total = mapping[options['distortionOrder']]               # 5
order_free = mapping[options['distortion_fixed_coefficients']]  # 5
n_free = (order_free+2) * (order_free+1) // 2 - 1               # 20
n_total = (order_total+2) * (order_total+1) // 2 - 1            # 20

basis_free = basis[:, :n_free]    (18 x 20)
basis_fixed = basis[:, n_free:]   (18 x 0)

errors_fixed = np.copy(errors)
fixed_correction = np.zeros(plate.shape, plate.dtype)
coefficients_x = []
coefficients_y = []

# si hay términos libres, calcula los coeficientes correspondientes (if n_free < n_total:)
# obtiene los coeficientes correspondientes para los términos fijos en x e y. Esto permite aplicar correcciones a los errores utilizando los términos fijos durante la regresión lineal.
# calcula la corrección fija para los términos fijos
# aplica la correscción fija a los errores

ols_result_x = sm.OLS(errors_fixed[:, 1]*m, sm.add_constant(basis_free)).fit()
ols_result_y = sm.OLS(errors_fixed[:, 0]*m, sm.add_constant(basis_free)).fit()
# comentario: realiza la regresión lineal utilizando los errores corregidos y la base de funciones libres. Calcula los resultados de la regresión para x e y, obteniendo los coeficientes y errores estándar correspondientes.

plate_corrected = plate + np.array([ols_result_y.predict(sm.add_constant(basis_free)), ols_result_x.predict(sm.add_constant(basis_free))]).T / m + fixed_correction
# calcula la corrección de la placa utilizando los resultados de la regresión lineal y los términos fijos. La corrección se aplica a las coordenadas de la placa original, ajustando las posiciones de las estrellas según los errores estimados por la regresión.

coeff_x = list(ols_result_x.params) + list(coefficients_x)
coeff_y = list(ols_result_y.params) + list(coefficients_y)
# comentario: combina los coeficientes obtenidos de la regresión lineal con los coeficientes fijos para formar los conjuntos finales de coeficientes en x e y. Esto permite tener una representación completa de la corrección aplicada a la placa, incluyendo tanto los términos libres como los fijos.

```

