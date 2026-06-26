MODULO: my_stacker_implementation    RUTINA: attempt_align

c1
0 = array([1884.29337612, 7875.78798887])
1 = array([2515.92302717, 2672.28264902])
2 = array([6239.01989923, 6964.55030384])
3 = array([3645.34142549, 2204.0528332 ])
4 = array([6261.22905099, 5277.10058431])
5 = array([4612.52091215, 9397.97791749])
6 = array([2510.43442636, 2660.9931441 ])

c2
0 = array([1884.28864239, 7875.79464705])
1 = array([2515.93854207, 2671.84685441])
2 = array([6238.48659953, 6964.42978035])
3 = array([6261.79552419, 5277.47722017])
4 = array([4612.68515972, 9397.3525274 ])
5 = array([3645.37919431, 2203.46694929])
6 = array([2509.66882299, 2660.5728706 ])


m = min(min(c1.shape[0], c2.shape[0]), options['m'])  
7    # c1.shape[0] = 7, c2.shape[0] = 7 , options['m']= 30

c1 = c1.reshape((c1.shape[0], -1)) # Deja igual la matriz. Reconvierte la matriz a ootra de dos dimensiones en la que la mantiene el numero de filas y readapata las columnas.
c1 = c2.reshape((c2.shape[0], -1))

c1a = c1[:m, :]  #  Recorta el numero de filas. Como en nuestro caso m=7 y m<30, deja igual la matriz.
c2a = c2[:m, :] 

a = np.ones((m, m, 2)) # para crear una matriz de 'unos' de la forma (m, m, 2) 
def loss_fxn(b):
        d = c1a*a - np.swapaxes(c2a*a, 0, 1) - b  # para calcular la matriz de diferencias entre cada par de centroids de las dos imágenes, se multiplica la matriz a por las coordenadas de los centroids de la primera imagen (c1a) para crear una matriz donde cada fila contiene las coordenadas de un centroid de la primera imagen, y luego se resta la matriz transpuesta de a multiplicada por las coordenadas de los centroids de la segunda imagen (c2a) para obtener una matriz donde cada elemento representa la diferencia entre un centroid de la primera imagen y un centroid de la segunda imagen, ajustada por el vector de alineación b que se está optimizando, lo que permite evaluar qué tan bien se alinean los centroids entre las dos imágenes para encontrar el mejor ajuste
c1a*a:
    # Al hacer c2a * a, estás realizando una multiplicación elemento a elemento (no matricial) utilizando las reglas de broadcasting (transmisión) de NumPy.
    # El resultado final será una nueva matriz con forma (7, 7, 2).
    # ¿Cómo funciona el Broadcasting paso a paso en este caso?
    # NumPy compara las dimensiones de ambas matrices de derecha a izquierda para alinearlas: 
    # Alineación de dimensiones:Matriz a: (7,  7,  2)
    #                           Matriz c2a: (7,  2)
    # Eje de la derecha (Eje 2): Ambos miden 2. Son compatibles y se multiplican directamente.
    # Eje central (Eje 1): a mide 7 y c2a mide 7. Son compatibles y se multiplican directamente.
    # Eje de la izquierda (Eje 0): a mide 7, pero c2a no tiene esta dimensión. NumPy expande automáticamente la estructura de c2a de forma virtual, repitiendo sus datos 7 veces a lo largo de este nuevo eje para que coincida con a.
    # El significado matemático / geométricoEstás multiplicando cada una de las 7 "capas" o "rebanadas" de la matriz a por la misma matriz c2a.
array([[[1884.29337612, 7875.78798887],
        [2515.92302717, 2672.28264902],
        [6239.01989923, 6964.55030384],
        [3645.34142549, 2204.0528332 ],
        [6261.22905099, 5277.10058431],
        [4612.52091215, 9397.97791749],
        [2510.43442636, 2660.9931441 ]],

       [[1884.29337612, 7875.78798887],
        [2515.92302717, 2672.28264902],
        [6239.01989923, 6964.55030384],
        [3645.34142549, 2204.0528332 ],
        [6261.22905099, 5277.10058431],
        [4612.52091215, 9397.97791749],
        [2510.43442636, 2660.9931441 ]],
       Hasta 7 veces  )

c2a*a
        array([[[1884.28864239, 7875.79464705],
        [2515.93854207, 2671.84685441],
        [6238.48659953, 6964.42978035],
        [6261.79552419, 5277.47722017],
        [4612.68515972, 9397.3525274 ],
        [3645.37919431, 2203.46694929],
        [2509.66882299, 2660.5728706 ]],

       [[1884.28864239, 7875.79464705],
        [2515.93854207, 2671.84685441],
        [6238.48659953, 6964.42978035],
        [6261.79552419, 5277.47722017],
        [4612.68515972, 9397.3525274 ],
        [3645.37919431, 2203.46694929],
        [2509.66882299, 2660.5728706 ]],
       Hasta 7 veces  ])


np.swapaxes(c2a*a, 0, 1)  #  equivale a transponer
array([[[1884.28864239, 7875.79464705],
        [1884.28864239, 7875.79464705],
        [1884.28864239, 7875.79464705],
        [1884.28864239, 7875.79464705],
        [1884.28864239, 7875.79464705],
        [1884.28864239, 7875.79464705],
        [1884.28864239, 7875.79464705]],

       [[2515.93854207, 2671.84685441],
        [2515.93854207, 2671.84685441],
        [2515.93854207, 2671.84685441],
        [2515.93854207, 2671.84685441],
        [2515.93854207, 2671.84685441],
        [2515.93854207, 2671.84685441],
        [2515.93854207, 2671.84685441]],
       Hasta 7 veces  )

d = c1a - np.swapaxes(c2a*a, 0, 1) - b
array([[[ 4.73373395e-03, -6.65818420e-03],
        [ 6.31634385e+02, -5.20351200e+03],
        [ 4.35473126e+03, -9.11244343e+02],
        [ 1.76105278e+03, -5.67174181e+03],
        [ 4.37694041e+03, -2.59869406e+03],
        [ 2.72823227e+03,  1.52218327e+03],
        [ 6.26145784e+02, -5.21480150e+03]],

       [[-6.31645166e+02,  5.20394113e+03],
        [-1.55148992e-02,  4.35794613e-01],
        [ 3.72308136e+03,  4.29270345e+03],
        [ 1.12940288e+03, -4.67794021e+02],
        [ 3.74529051e+03,  2.60525373e+03],
        [ 2.09658237e+03,  6.72613106e+03],
        [-5.50411571e+00, -1.08537103e+01]],
        Hasta 7 veces   ])

norms = np.minimum(np.linalg.norm(d, axis=2)**1.5, options['cutoff']) # para calcular la matriz de normas (distancias) entre cada par de centroids de las dos imágenes, se toma la norma L2 de la matriz de diferencias d a lo largo del eje 2 (que representa las coordenadas y, x), se eleva a la potencia de 1.5 para dar más peso a las correspondencias más cercanas y reducir el impacto de las correspondencias más lejanas, y luego se aplica un recorte (cutoff) para limitar el valor máximo de las normas y evitar que correspondencias muy lejanas afecten demasiado la optimización, lo que ayuda a encontrar un vector de alineación que maximice el número de correspondencias cercanas entre los centroids de las dos imágenes


np.linalg.norm(d, axis=2)
        # 1. Estructura original (7, 7, 2): 
        #    Tienes una cuadrícula bidimensional de tamaño 7 x 7. En cada una de esas 49 posiciones, hay un par de números [x1, x2] en el eje 
        # 2. Operación en el eje axis=2: 
        #    Para cada una de las 49 posiciones de la cuadrícula, NumPy toma de forma aislada sus dos valores numéricos, eleva cada uno al cuadrado, los suma y calcula su raíz cuadrada.
        # 3. Dimensión del resultado (7, 7): 
        # Como el eje 2 se colapsa tras resolver la operación matemática, la última dimensión desaparece. El resultado es una matriz plana de 7 filas por 7 columnas, donde cada elemento es un escalar con la magnitud resultante.
array([[8.16943413e-03, 5.24170765e+03, 4.44905052e+03, 5.93885192e+03, 5.09026700e+03, 3.12414680e+03, 5.25225792e+03],
       [5.24213496e+03, 4.36070702e-01, 5.68230919e+03, 1.22244923e+03, 4.56229635e+03, 7.04531736e+03, 1.21695652e+01],
       [4.44854722e+03, 5.68154966e+03, 5.46749012e-01, 5.42084777e+03, 1.68748245e+03, 2.92675946e+03, 5.69367543e+03],
       [5.09055438e+03, 4.56274035e+03, 1.68722681e+03, 4.03630642e+03, 6.80254697e-01, 4.43831418e+03, 4.57369643e+03],
       [3.12398469e+03, 7.04435776e+03, 2.92634437e+03, 7.25805169e+03, 4.43781174e+03, 6.46598811e-01, 7.05676951e+03],
       [5.93941489e+03, 1.22288977e+03, 5.42170516e+03, 5.87100023e-01, 4.03607411e+03, 7.25922525e+03, 1.22369516e+03],
       [5.25257681e+03, 1.32753147e+01, 5.69493470e+03, 1.22399461e+03, 4.57388472e+03, 7.05794685e+03, 8.73371815e-01]])
  
np.linalg.norm(d, axis=2)**1.5
array([[7.38393667e-04, 3.79497739e+05, 2.96757024e+05, 4.57671369e+05, 3.63170735e+05, 1.74621273e+05, 3.80644069e+05],
       [3.79544145e+05, 2.87962121e-01, 4.28338677e+05, 4.27411543e+04, 3.08159271e+05, 5.91358497e+05, 4.24534113e+01],
       [2.96706669e+05, 4.28252799e+05, 4.04279770e-01, 3.99117543e+05, 6.93200551e+04, 1.58336320e+05, 4.29624520e+05],
       [3.63201490e+05, 3.08204257e+05, 6.93043034e+04, 2.56434346e+05, 5.61057437e-01, 2.95683481e+05, 3.09315016e+05],
       [1.74607682e+05, 5.91237684e+05, 1.58302636e+05, 6.18343907e+05, 2.95633273e+05, 5.19938950e-01, 5.92800961e+05],
       [4.57736448e+05, 4.27642607e+04, 3.99212236e+05, 4.49850437e-01, 2.56412208e+05, 6.18493883e+05, 4.28065142e+04],
       [3.80678736e+05, 4.83690144e+01, 4.29767057e+05, 4.28222278e+04, 3.09334117e+05, 5.92949319e+05, 8.16204075e-01]])

norms = np.minimum(np.linalg.norm(d, axis=2)**1.5, options['cutoff'])
array([[7.38393667e-04, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02],
       [1.00000000e+02, 2.87962121e-01, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 4.24534113e+01],
       [1.00000000e+02, 1.00000000e+02, 4.04279770e-01, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02],
       [1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 5.61057437e-01, 1.00000000e+02, 1.00000000e+02],
       [1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 5.19938950e-01, 1.00000000e+02],
       [1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 4.49850437e-01, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02],
       [1.00000000e+02, 4.83690144e+01, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 1.00000000e+02, 8.16204075e-01]])

return np.sum(np.min(norms, axis = 0)) / c1.shape[0] # para evaluar la función de pérdida que se va a minimizar durante la optimización del vector de alineación b, se toma la suma de las normas mínimas (distancias) para cada centroid de la primera imagen (c1a) al centroid más cercano de la segunda imagen (c2a) después de ajustar por el vector de alineación b, y luego se normaliza por el número total de centroids en la primera imagen para obtener una medida promedio de qué tan bien se alinean los centroids entre las dos imágenes, lo que permite encontrar el vector de alineación que minimice esta pérdida y maximice la correspondencia entre los centroids de las dos imágenes          
np.min(norms, axis = 0)        
array([7.38393667e-04, 2.87962121e-01, 4.04279770e-01, 4.49850437e-01, 5.61057437e-01, 5.19938950e-01, 8.16204075e-01])        

np.sum(np.min(norms, axis = 0)) / c1.shape[0]       
np.float64(0.43429016904303336)

*********************** M I N I M I Z A C I O N ********************************

result = minimize(loss_fxn, guess) # para encontrar el vector de alineación óptimo b que minimice la función de pérdida definida por loss_fxn, se utiliza la función minimize de scipy.optimize, que realiza una optimización numérica iterativa para ajustar el vector b y encontrar el valor que minimiza la pérdida, lo que permite determinar el mejor ajuste entre los centroids de las dos imágenes para alinear correctamente las estrellas entre ellas
    
[0. 0.]              -> [7.38393667e-04 2.87962121e-01 4.04279770e-01 4.49850437e-01 5.61057437e-01 5.19938950e-01 8.16204075e-01]      -> 0.43429016904303336
[1.49011612e-08 0.000000] -> [7.38392497e-04 2.87962121e-01 4.04279754e-01 4.49850438e-01 5.61057453e-01 5.19938954e-01 8.16204057e-01] -> 0.43429016703466944
[0.00000 1.49011612e-08]  -> [7.38395314e-04 2.87962106e-01 4.04279767e-01 4.49850419e-01 5.61057447e-01 5.19938932e-01 8.16204065e-01] -> 0.4342901617477349
[0.13477902 0.48957919]                  -> [0.36742526 0.06377683 0.40030362 0.08784028 1.17655711 0.1882131 0.50555767]              -> 0.39852483856217663
[0.13477904 0.48957919]                  -> [0.36742526 0.06377684 0.40030361 0.08784029 1.17655712 0.18821311 0.50555766]             -> 0.3985248411145566
[0.13477902 0.48957921]                  -> [0.36742527 0.06377683 0.40030363 0.08784028 1.17655713 0.18821309 0.50555767]             -> 0.39852484425262663
[0.06387908 0.33219529]                  -> [0.20174055 0.04715524 0.36951479 0.14287221 0.92385598 0.22642324 0.59475941]             -> 0.3580459189984504
[0.06387909 0.33219529]                  -> [0.20174056 0.04715525 0.36951478 0.14287221 0.923856   0.22642325 0.59475939]             -> 0.3580459191515848
[0.06387908 0.33219531]                  -> [0.20174057 0.04715524 0.3695148  0.1428722  0.923856   0.22642323 0.59475941]             -> 0.3580459197734959
[0.06624298 0.30401684]                  -> [0.17823105 0.06107067 0.35547335 0.16468292 0.8958622  0.24870895 0.59693932]             -> 0.35728120752062403
[0.06624299 0.30401684]                  -> [0.17823105 0.06107067 0.35547333 0.16468292 0.89586221 0.24870896 0.5969393 ]             -> 0.3572812076470567
[0.06624298 0.30401686]                  -> [0.17823106 0.06107066 0.35547335 0.16468291 0.89586221 0.24870894 0.59693932]             -> 0.35728120758186793
[0.05917593 0.30228221]                  -> [0.17570058 0.05983723 0.36182582 0.16408147 0.88709434 0.24621234 0.60612708]             -> 0.35726840920279074
[0.05917594 0.30228221]                  -> [0.17570059 0.05983723 0.36182581 0.16408148 0.88709435 0.24621235 0.60612706]             -> 0.35726840911581764
[0.05917593 0.30228223]                  -> [0.1757006  0.05983722 0.36182583 0.16408146 0.88709435 0.24621233 0.60612708]             -> 0.35726840919935027
[0.06215901 0.30203493]                  -> [0.17594287 0.06083275 0.35875905 0.16507726 0.88975152 0.24800718 0.6024479 ]             -> 0.3572597918171101
[0.06215902 0.30203493]                  -> [0.17594287 0.06083276 0.35875904 0.16507727 0.88975153 0.24800719 0.60244788]             -> 0.3572597918175653
[0.06215901 0.30203494]                  -> [0.17594288 0.06083274 0.35875906 0.16507725 0.88975154 0.24800717 0.6024479 ]             -> 0.357259791816334
[0.06214024 0.30206905]                  -> [0.17596818 0.06080979 0.35879079 0.16504565 0.88976924 0.2479707 0.60246418]              -> 0.3572597906636627
[0.06214026 0.30206905]                  -> [0.17596819 0.06080979 0.35879078 0.16504566 0.88976925 0.24797071 0.60246416]             -> 0.35725979066366614
[0.06214024 0.30206906]                  -> [0.1759682  0.06080978 0.3587908  0.16504564 0.88976926 0.24797069 0.60246418]             -> 0.35725979066368374
  message: Optimization terminated successfully.
  success: True
   status: 0
      fun: 0.3572597906636627
        x: [ 6.214e-02  3.021e-01]
      nit: 6
      jac: [ 2.310e-07  1.412e-06]
 hess_inv: [[ 5.103e-01 -6.102e-02]
            [-6.102e-02  6.194e-01]]
     nfev: 21
     njev: 7

1. El Resultado (Lo más importante)
        success: True: El optimizador cumplió con sus criterios de convergencia y terminó con éxito SciPy Documentation. No hubo errores ni bloqueos.
        status: 0: Código de estado numérico. El 0 significa "Terminado con éxito sin problemas" SciPy Documentation.
        fun: 0.357259...: Es el valor mínimo alcanzado por tu función loss_fxn SciPy Documentation. En este punto, tu pérdida es aproximadamente 0.357.
        x: [0.06214, 0.3021]: Las coordenadas óptimas que minimizan la función SciPy Documentation. Estos son los parámetros finales que buscabas (los valores óptimos para guess).
2. Información del Gradiente y la Curvatura 
        jac: [2.310e-07, 1.412e-06]: El Jacobiano (gradiente/derivada) en el punto óptimo SciPy Documentation. Al estar tan cerca de cero (notación científica e-07 y e-06), confirma matemáticamente que estás en un "valle" plano o punto mínimo (la pendiente es casi cero).
        hess_inv: [[...], [...]]: La inversa de la matriz Hessiana estimada SciPy Documentation. Indica la curvatura de la función alrededor del mínimo. Se utiliza para aproximar la varianza y la sensibilidad de los parámetros x.
3. Rendimiento y Coste Computacionalnit: 
        nit: 6: Número de iteraciones principales que realizó el algoritmo para moverse por el espacio matemático hasta encontrar el mínimo SciPy Documentation.
        nfev: 21: (Number of Function Evaluations) Cuántas veces el algoritmo tuvo que evaluar o ejecutar tu código de loss_fxn SciPy Documentation. Es mayor que las iteraciones porque el algoritmo prueba varios pasos intermedios.
        njev: 7: (Number of Jacobian Evaluations) Cuántas veces calculó el gradiente (el Jacobiano) para saber hacia qué dirección seguir descendiendo SciPy Documentation.
ResumenTu optimización funcionó de manera impecable y muy rápida (solo 6 iteraciones). Encontró que configurando tus variables como [0.06214, 0.3021], tu pérdida se reduce al mínimo posible, que es 0.357


================================================================================================================================================
Con la rutina de minimalizar obtengo la distancia desplazada entre las dos imágenes (fun) y el punto de alineación óptimo(x,y) donde se produce este mínimo.
A continuación se busca matriz de diferencias ajustada al vector de alineación b, la matriz de normas (distancias) entre cada par de centroides 
La instrucción np.reshape(c1, (c1.shape[0], 1, -1)) - np.swapaxes(np.reshape(c2, (c2.shape[0], 1, -1)), 0, 1) - b hace la resta de todos los centroides de cº contra todos los crentroides de c2. Además le resta b.
matches1 contiene la correspondencia entre cada centroide de c1 y el correspondiente a c2 por proximidad
matches2 contiene la correspondencia entre cada centroide de c2 y el correspondiente a c1 por proximidad
vac1 es un array de vectores de coordenadas de c1 

c1    shape=(7,2)
array([[1884.29337612, 7875.78798887],
       [2515.92302717, 2672.28264902],
       [6239.01989923, 6964.55030384],
       [3645.34142549, 2204.0528332 ],
       [6261.22905099, 5277.10058431],
       [4612.52091215, 9397.97791749],
       [2510.43442636, 2660.9931441 ]])
       
np.reshape(c1,(7,1,-1))   shape=(7,1,2)
array([[[1884.29337612, 7875.78798887]],
       [[2515.92302717, 2672.28264902]],
       [[6239.01989923, 6964.55030384]],
       [[3645.34142549, 2204.0528332 ]],
       [[6261.22905099, 5277.10058431]],
       [[4612.52091215, 9397.97791749]],
       [[2510.43442636, 2660.9931441 ]]])

c2    shape=7,2
array([[1884.28864239, 7875.79464705],
       [2515.93854207, 2671.84685441],
       [6238.48659953, 6964.42978035],
       [6261.79552419, 5277.47722017],
       [4612.68515972, 9397.3525274 ],
       [3645.37919431, 2203.46694929],
       [2509.66882299, 2660.5728706 ]])
np.reshape(c2,(7,1,-1))                    shape=(7,1,2)
array([[[1884.28864239, 7875.79464705]],
       [[2515.93854207, 2671.84685441]],
       [[6238.48659953, 6964.42978035]],
       [[6261.79552419, 5277.47722017]],
       [[4612.68515972, 9397.3525274 ]],
       [[3645.37919431, 2203.46694929]],
       [[2509.66882299, 2660.5728706 ]]])
np.swapaxes(np.reshape(c2,(7,1,-1)),0,1)   shape=(1,7,2)
array([[[1884.28864239, 7875.79464705],
        [2515.93854207, 2671.84685441],
        [6238.48659953, 6964.42978035],
        [6261.79552419, 5277.47722017],
        [4612.68515972, 9397.3525274 ],
        [3645.37919431, 2203.46694929],
        [2509.66882299, 2660.5728706 ]]])
 b   shape(2)

d = np.reshape(c1, (c1.shape[0], 1, -1)) - np.swapaxes(np.reshape(c2, (c2.shape[0], 1, -1)), 0, 1) - b 
d = array([[[-5.74065096e-02, -3.08727233e-01],   (7,7,2)
        [-6.31707306e+02,  5.20363907e+03],
        [-4.35425536e+03,  9.11056139e+02],
        [-4.37756429e+03,  2.59800870e+03],
        [-2.72845392e+03, -1.52186661e+03],
        [-1.76114796e+03,  5.67201897e+03],
        [-6.25437587e+02,  5.21491305e+03]],

       [[ 6.31572245e+02, -5.20381407e+03],
        [-7.76551428e-02,  1.33725564e-01],
        [-3.72262571e+03, -4.29244920e+03],
        [-3.74593464e+03, -2.60549664e+03],
        [-2.09682427e+03, -6.72537195e+03],
        [-1.12951831e+03,  4.68513631e+02],
        [ 6.19206393e+00,  1.14077094e+01]],

        5 vesces mas                      b])
        
norms = np.linalg.norm(d, axis=2)
array([[3.14019127e-01, 5.24184258e+03, 4.44854617e+03, 5.09045364e+03, 3.12418610e+03, 5.93914483e+03, 5.25228429e+03],
       [5.24200003e+03, 1.54637795e-01, 5.68181858e+03, 4.56296384e+03, 7.04466464e+03, 1.22283140e+03, 1.29798879e+01],
       [4.44905158e+03, 5.68204028e+03, 5.04925757e-01, 1.68692561e+03, 2.92656096e+03, 5.42141017e+03, 5.69466572e+03],
       [5.93912198e+03, 1.22250745e+03, 5.42114276e+03, 4.03657671e+03, 7.25835935e+03, 3.00886516e-01, 1.22404966e+03],
       [5.09036779e+03, 4.56207285e+03, 1.68778366e+03, 9.25092000e-01, 4.43806911e+03, 4.03580380e+03, 4.57366095e+03],
       [3.12394537e+03, 7.04501048e+03, 2.92654283e+03, 4.43805683e+03, 3.94699802e-01, 7.25891759e+03, 7.05763998e+03],
       [5.25255043e+03, 1.24673421e+01, 5.69394443e+03, 4.57392020e+03, 7.05707637e+03, 1.22363989e+03, 7.13325072e-01]])

ind = np.unravel_index(np.argmin(norms), norms.shape)
(1,1) ->  fila 2  columna 2  contine el valor mínimo  
array([[3.14019127e-01, 9.99999000e+05, 4.44854617e+03, 5.09045364e+03, 3.12418610e+03, 5.93914483e+03, 5.25228429e+03],
       [9.99999000e+05, 9.99999000e+05, 9.99999000e+05, 9.99999000e+05, 9.99999000e+05, 9.99999000e+05, 9.99999000e+05],
       [4.44905158e+03, 9.99999000e+05, 5.04925757e-01, 1.68692561e+03, 2.92656096e+03, 5.42141017e+03, 5.69466572e+03],
       [5.93912198e+03, 9.99999000e+05, 5.42114276e+03, 4.03657671e+03, 7.25835935e+03, 3.00886516e-01, 1.22404966e+03],
       [5.09036779e+03, 9.99999000e+05, 1.68778366e+03, 9.25092000e-01, 4.43806911e+03, 4.03580380e+03, 4.57366095e+03],
       [3.12394537e+03, 9.99999000e+05, 2.92654283e+03, 4.43805683e+03, 3.94699802e-01, 7.25891759e+03, 7.05763998e+03],
       [5.25255043e+03, 9.99999000e+05, 5.69394443e+03, 4.57392020e+03, 7.05707637e+03, 1.22363989e+03, 7.13325072e-01]])

matches1:       
{np.int64(1): np.int64(1), np.int64(3): np.int64(5), np.int64(0): np.int64(0), np.int64(5): np.int64(4), np.int64(2): np.int64(2), np.int64(6): np.int64(6), np.int64(4): np.int64(3)}
matches2:
{np.int64(1): np.int64(1), np.int64(5): np.int64(3), np.int64(0): np.int64(0), np.int64(4): np.int64(5), np.int64(2): np.int64(2), np.int64(6): np.int64(6), np.int64(3): np.int64(4)}

vec1:
    array([[2515.92302717, 2672.28264902],
       [3645.34142549, 2204.0528332 ],
       [1884.29337612, 7875.78798887],
       [4612.52091215, 9397.97791749],
       [6239.01989923, 6964.55030384],
       [2510.43442636, 2660.9931441 ],
       [6261.22905099, 5277.10058431]])
vec2: 
    array([[2515.93854207, 2671.84685441],
       [3645.37919431, 2203.46694929],
       [1884.28864239, 7875.79464705],
       [4612.68515972, 9397.3525274 ],
       [6238.48659953, 6964.42978035],
       [2509.66882299, 2660.5728706 ],
       [6261.79552419, 5277.47722017]])
       
*********************** M I N I M I Z A C I O N   2****************************

    result2 = minimize(loss_fxn2, guess) # para encontrar el vector de alineación óptimo b que minimice la función de pérdida definida por loss_fxn, se utiliza la función minimize de scipy.optimize, que realiza una optimización numérica iterativa para ajustar el vector b y encontrar el valor que minimiza la pérdida, lo que permite determinar el mejor ajuste entre los centroids de las dos imágenes para alinear correctamente las estrellas entre ellas
loss2 [0. 0.]                           2.477460118328482
loss2 [1.49011612e-08 0.00000000e+00]   2.4774601028422336
loss2 [0.00000000e+00 1.49011612e-08]   2.4774600645480596
loss2 [0.27947681 0.97056309]           5.824808664381481
loss2 [0.27947683 0.97056309]           5.824808707198639
loss2 [0.27947681 0.9705631 ]           5.824808813076298
loss2 [0.07423318 0.25779594]           1.9736749413443677
loss2 [0.0742332  0.25779594]           1.9736749413443684
loss2 [0.07423318 0.25779595]           1.9736749413443697
  message: Optimization terminated successfully.
  success: True
   status: 0
      fun: 1.9736749413443677
        x: [ 7.423e-02  2.578e-01]
      nit: 1
      jac: [ 4.470e-08  1.341e-07]
 hess_inv: [[1 0]
            [0 1]]
     nfev: 9
     njev: 3

1. El Resultado (Lo más importante)
        success: True: El optimizador cumplió con sus criterios de convergencia y terminó con éxito SciPy Documentation. No hubo errores ni bloqueos.
        status: 0: Código de estado numérico. El 0 significa "Terminado con éxito sin problemas" SciPy Documentation.
        fun: 1.9736749413443677: Es el valor mínimo alcanzado por tu función loss_fxn SciPy Documentation. En este punto, tu pérdida es aproximadamente 1.973.
        x: [7.423e-02  2.578e-01]: Las coordenadas óptimas que minimizan la función SciPy Documentation. Estos son los parámetros finales que buscabas (los valores óptimos para guess).
2. Información del Gradiente y la Curvaturajac: 
        jac: [4.470e-08  1.341e-07]: El Jacobiano (gradiente/derivada) en el punto óptimo SciPy Documentation. Al estar tan cerca de cero (notación científica e-07 y e-06), confirma matemáticamente que estás en un "valle" plano o punto mínimo (la pendiente es casi cero).
        hess_inv: [[...], [...]]: La inversa de la matriz Hessiana estimada SciPy Documentation. Indica la curvatura de la función alrededor del mínimo. Se utiliza para aproximar la varianza y la sensibilidad de los parámetros x.
3. Rendimiento y Coste Computacionalnit: 
        nit: 1: Número de iteraciones principales que realizó el algoritmo para moverse por el espacio matemático hasta encontrar el mínimo SciPy Documentation.
        nfev: 9: (Number of Function Evaluations) Cuántas veces el algoritmo tuvo que evaluar o ejecutar tu código de loss_fxn SciPy Documentation. Es mayor que las iteraciones porque el algoritmo prueba varios pasos intermedios.
        njev: 3: (Number of Jacobian Evaluations) Cuántas veces calculó el gradiente (el Jacobiano) para saber hacia qué dirección seguir descendiendo SciPy Documentation.
ResumenTu optimización funcionó de manera impecable y muy rápida (solo 1 iteraciones). Encontró que configurando tus variables como [7.423e-02  2.578e-01], tu pérdida se reduce al mínimo posible, que es 1.9736

================================================================================================================================================
Retorno de la función:
    - (result.x) - vector de alineación encontrado en el primer paso de optimización 
    - (matches1) - diccionarios de correspondencias entre los centroids de las dos imágenes c1 y c2
    - (matches2) - diccionarios de correspondencias entre los centroids de las dos imágenes c2 y c1
    - (result2.x) - el vector de alineación refinado encontrado en el segundo paso de optimización (result2.x), y la raíz cuadrada del error promedio por centroid después del refinamiento (calculado como la función de pérdida result2.fun dividida por el número de centroids emparejados vec1.shape[0]), lo que proporciona información sobre la calidad de la alineación y las correspondencias entre las estrellas en las dos imágenes

================================================================================================================================================
TEXT                                        OPTIONS
Show the brightest stars in stack       ->  d
Remove big bright object (blob)             delete_saturated_blob
saturation level (%)                        blob_saturation_level
blob_radius_extra                           blob_radius_extra
centroid_gap_blob                           centroid_gap_blob
Sensitive stacking mode                     centroid_gaussian_subtract
Use sensitive mode on stacked result        sensitive_mode_stack 
sigma_thresh [sensitive-mode]               centroid_gaussian_thresh
min_area (pixels) [sensitive-mode]          min_area
sigma_subtract                              sigma_subtract
background subtraction mode                 background_subtraction_mode
Remove centroids near edges                 remove_edgy_centroids              