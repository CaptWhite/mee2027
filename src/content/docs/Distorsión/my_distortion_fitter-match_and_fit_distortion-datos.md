
``` python
MODULO: my_distortion_fitter    RUTINA: match_and_fit_distortion

# Archivo data/STACKED_CENTROIDS_DATA.csv procedente de la pestaña-1
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


plate_solve_result = platesolve_triangle.platesolve(np.c_[other_stars_df['py'], other_stars_df['px']], image_size, dict(options, **{'flag_display':False}))
plate_solve_result:
{'success': True, 
 'x': array([8.96647322e-06, 3.02608057e-01, 1.26090843e-01, 3.14446672e+00]),   --> resolución astrométrica expresada en radianes (platescale, ra, dec, roll)
 'platescale/arcsec': np.float64(1.8494678609247899), 
 'ra': np.float64(17.338164511271), 
 'dec': np.float64(7.2244731492490555), 
 'roll': np.float64(0.16467183101349292), 
 'matched_centroids': array([           shape(23,2)
       [1883.69390852, 7875.33048147],
       [6238.13362541, 6964.11842336],
       [6261.01171594, 5276.91242919],
       [4612.08128453, 9397.12628274],
        ...
       [4276.11320268, 6060.75040631],
       [4427.86028921, 3196.40040051]]), 
 'matched_stars': array([           shape(23,2)
       [0.2746323 , 0.13771157, 0.9534125 , 0.2686256 , 0.13727671, 4.28      ],
       [0.28308356, 0.09871847, 0.9555238 , 0.2779579 , 0.09855821,  6.02      ],
       [0.2982926 , 0.09858866, 0.9511982 , 0.2924615 , 0.09842903,  5.51      ],
       [0.26105133, 0.11315284, 0.95994085, 0.25644588, 0.11291154,  6.16      ],
       ...
       [0.29115802, 0.11635609, 0.95143497, 0.28512067, 0.11609372, 8.68      ],
       [0.31700587, 0.11506616, 0.9438897 , 0.30966166, 0.1148124 , 8.55      ]], dtype=float32), 
 'mirror': False}
 
# la estimación inicial de la distorsión es el resultado del platesolve
initial_guess = plate_solve_result['x']
array([8.96647322e-06, 3.02608057e-01, 1.26090843e-01, 3.14446672e+00])

# convierte las coordenadas de los bordes de la imagen a coordenadas polares para buscar en la base de datos
corners = transforms.to_polar(transforms.linear_transform(plate_solve_result['x'], np.array([[0,0], [image_size[0]-1., image_size[1]-1.], [0, image_size[1]-1.], [image_size[0]-1., 0]]) - np.array([image_size[0]/2, image_size[1]/2])))
array([[ 8.86572928, 19.822932  ],
       [ 5.57039083, 14.87196171],
       [ 8.85154165, 14.84445949],
       [ 5.5844759 , 19.81442432]])

# abre la base de datos de Gaia
dbs = database_cache.open_catalogue(path_catalogue, gaia_limit=options['safety_limit_mag'])

obtener fecha de observación
lookupdate = options['DEFAULT_DATE'] if options['guess_date'] else options['observation_date']
'2024-04-08'

# se realiza la coincidencia de las estrellas observadas con las estrellas de la base de datos, obteniendo las coordenadas 
# de las estrellas observadas y candidatas que cumplen con los criterios de coincidencia, junto con una máscara booleana 
# que indica qué coincidencias se han seleccionado
stardata0, stardata, plate2, alt, az, mask_select = match_centroids(other_stars_df, initial_guess, dbs, corners, image_size, lookupdate, options)
stardata0 <SkyCoord (ICRS): (ra, dec, distance) in (deg, deg, pc)   shape(439) 
    [(17.03186195, 5.99384127,  512.80358256),
     (17.31549762, 6.07588768,  303.19239058),
     (16.49473704, 5.76135825, 1000.        ),
      ...
     (18.03160398, 8.30892287,  517.06155071),
     (17.2964168 , 8.29627747,  913.19701484),
     (18.86533372, 8.46430616,  896.90250215)]
stardata
<SkyCoord (ICRS): (ra, dec) in deg      shape(18)
    [(15.73571379, 7.89010542), (16.21974175, 5.65659454),
     (17.09060676, 5.64896264), (14.95777296, 6.48338936),
     (18.43364315, 7.57492919), (18.67622055, 6.995021  ),
     (16.65652182, 8.35949244), (15.34668833, 8.45019195),
     (18.88886982, 6.95624659), (18.43986276, 7.57796257),
     (19.39802964, 5.88448356), (15.62372868, 8.82095684),
     (15.52907567, 7.9405317 ), (15.41543041, 7.3052608 ),
     (19.73853869, 7.43038689), (15.70617777, 7.50059685),
     (15.29919332, 8.03345111), (18.16257001, 6.59287901)]>     
plate2
array([[-1310.30609148,  3087.33048147],    shape(18,2)
       [ 3044.13362541,  2176.11842336],
       [ 3067.01171594,   488.91242919],
       [ 1418.08128453,  4609.12628274],
       [ -678.52177207, -2116.59025125],
       [  450.8661642 , -2584.72625983],
       [-2215.08842315,  1307.89053855],
       [-2405.83509575,  3828.60164693],
       [  526.41117001, -2995.16579352],
       [ -684.16583336, -2127.68297172],
       [ 2611.38552072, -3980.31283921],
       [-3123.65226483,  3289.70854554],
       [-1411.08520617,  3484.87264179],
       [ -175.90578367,  3713.05325856],
       [ -399.52609361, -4633.17291891],
       [ -552.22565315,  3149.62376805],
       [-1595.12690697,  3926.45901515],
       [ 1233.86028921, -1591.59959949]])
alt : np.float64(69.7668456109223)       
az  : np.float64(142.77264717350687)
mask_select:array([ 87, 237, 129, 287, 406, 429, 226, 155, 372, 169,  49, 128, 343, 40, 204, 381, 344,  52])  shape(18)


result, plate2_corrected, _, _, _  = distortion_polynomial.do_cubic_fit(plate2, stardata, initial_guess, image_size, dict(options, **{'flag_display2':True}))
result: (np.float64(8.8992780858673e-06), np.float64(0.3021359095544024), np.float64(0.12596190467727156), np.float64(3.1581889137533166))    shape(4)
plate2_corrected: array([[-1375.8059002 ,  3037.99123946],    shape(18,2)
       [ 3022.10865069,  2180.41525751],
       [ 3067.72841134,   481.31423217],
       [ 1350.82056978,  4608.89483841],
       [ -668.18231926, -2193.6842918 ],
       [  475.56454334, -2649.7904785 ],
       [-2262.1675177 ,  1232.7732024 ],
       [-2489.47332354,  3769.97362835],
       [  557.13326859, -3062.68812974],
       [ -673.96003746, -2205.85780723],
       [ 2671.37836531, -4027.48933732],
       [-3205.40036061,  3217.38068059],
       [-1482.81657842,  3437.2624194 ],
       [ -241.7436578 ,  3684.10942252],
       [ -352.52214778, -4727.17115089],
       [ -613.20872376,  3110.90193218],
       [-1674.27212189,  3879.76983678],
       [ 1250.00082908, -1638.31889844]])
    
    
transformed_final = transforms.linear_transform(result, plate2_corrected, image_size)
transformed_final : array([[0.95341086, 0.26863313, 0.13727338],   shape(18,3)
       [0.9555218 , 0.27796197, 0.09856592],
       [0.95119927, 0.29245653, 0.09843341],
       [0.95993761, 0.25645657, 0.11291508],
       [0.94041159, 0.31344667, 0.13182269],
       [0.94029194, 0.31783633, 0.12178317],
       [0.94786146, 0.28358823, 0.1453835 ],
       [0.95387317, 0.26178587, 0.14694943],
       [0.9391836 , 0.32135056, 0.12111145],
       [0.94037094, 0.31354654, 0.13187517],
       [0.93826381, 0.33037857, 0.10252332],
       [0.95166051, 0.26613331, 0.15334713],
       [0.95425671, 0.26516045, 0.13814509],
       [0.95619863, 0.26365817, 0.12715558],
       [0.93333972, 0.33489234, 0.12932162],
       [0.95442553, 0.26838805, 0.13053643],
       [0.95509555, 0.26127021, 0.13975109],
       [0.9438924 , 0.30965292, 0.11481376]])
       
       
mag_errors = np.linalg.norm(transformed_final - stardata.get_vectors(), axis=1)
mag_errors:  array([1.30836178e-07, 1.57448772e-07, 1.31113416e-07, 1.93918374e-07,   shape(18)
       5.91802368e-08, 8.23551905e-08, 8.91149252e-08, 1.68730255e-07,
       9.69604027e-08, 5.96327689e-08, 1.67024655e-07, 1.64694692e-07,
       1.45511692e-07, 1.50098914e-07, 1.48802197e-07, 1.29595595e-07,
       1.62433081e-07, 7.28806475e-08])
       
neigh_all = my_gaia_search.lookup_nearby(stardata, options['double_star_cutoff'], options['double_star_mag'])
neight_all : <SkyCoord (ICRS): (ra, dec) in deg        shape(13)
    [(18.88924797, 6.95617874), (15.70576372, 7.50071869),
     (18.67657431, 6.99503322), (17.09128442, 5.64899035),
     (18.43918672, 7.5780068 ), (18.43972482, 7.57814955),
     (16.21945564, 5.65619851), (19.73923727, 7.43041628),
     (19.39850121, 5.88415387), (18.16277286, 6.59297226),
     (15.41499568, 7.30529425), (14.95712379, 6.48320393),
     (18.43349812, 7.57512416)]>       
     
 neigh = NearestNeighbors(n_neighbors=2)
 neigh : 
     
     
neigh_all_data_extra2 = np.r_[neigh_all.get_ra_dec(), np.array([[-99999,-99999], [-99999, -99999]])]     
neigh_all_data_extra2 : array([[ 3.29679570e-01,  1.21408222e-01],     shape(15, 2)
       [ 2.74117288e-01,  1.30912237e-01],
       [ 3.25967715e-01,  1.22086361e-01],
       [ 2.98299187e-01,  9.85934810e-02],
       [ 3.21824520e-01,  1.32261169e-01],
       [ 3.21833911e-01,  1.32263661e-01],
       [ 2.83082904e-01,  9.87192872e-02],
       [ 3.44514682e-01,  1.29685229e-01],
       [ 3.38567716e-01,  1.02697859e-01],
       [ 3.17000188e-01,  1.15069073e-01],
       [ 2.69042429e-01,  1.27501437e-01],
       [ 2.61051057e-01,  1.13153255e-01],
       [ 3.21725235e-01,  1.32210858e-01],
       [-9.99990000e+04, -9.99990000e+04],
       [-9.99990000e+04, -9.99990000e+04]]) 
       
distances, indices = neigh.kneighbors(stardata.get_ra_dec())       
distances : array([[6.81615386e-03, 1.16410218e-02],     shape(18.2)
       [8.52708118e-06, 1.52118682e-02],
       [1.18372898e-05, 1.52049798e-02],
       [1.17832568e-05, 1.64151929e-02],
       [4.24110666e-06, 1.10663866e-04],
       [6.17798575e-06, 3.77932918e-03],
       [2.23608851e-02, 2.84264845e-02],
       [1.77168938e-02, 2.00177672e-02],
       [6.70536993e-06, 3.76658819e-03],
       [4.05527548e-06, 1.18242176e-05],
       [1.00425919e-05, 2.07054416e-02],
       [2.30869428e-02, 2.67029818e-02],
       [8.27245835e-03, 1.12643510e-02],
       [7.61001519e-06, 6.10858292e-03],
       [1.22032130e-05, 1.69770223e-02],
       [7.53294721e-06, 6.11936714e-03],
       [1.16963538e-02, 1.28684464e-02],
       [3.89658598e-06, 1.13905759e-02]])

flag_is_double = distances[:, 1] < np.radians(options['double_star_cutoff']/3600)
flag_is_double : array([False, False, False, False, False, False, False, False, False,
        True, False, False, False, False, False, False, False, False])

flag_missing_pm = np.isnan(stardata.get_pmotion()[:, 0])
flag_missing_pm : array([False, False, False, False, False, False, False, False, False,
       False, False, False, False, False, False, False, False, False])

flag_is_outlier = errors_arcseconds >= options['distortion_fit_tol']
flag_is_outlier : array([False, False, False, False, False, False, False, False, False,
       False, False, False, False, False, False, False, False, False])

keep_j = np.logical_and(np.logical_and(errors_arcseconds < options['distortion_fit_tol'], ~flag_is_double), ~flag_missing_pm)
keep_j : array([ True,  True,  True,  True,  True,  True,  True,  True,  True,
       False,  True,  True,  True,  True,  True,  True,  True,  True])
       
plate2_unfiltered = plate2
plate2_unfiltered : array([[-1310.30609148,  3087.33048147],    shape(18,2)
       [ 3044.13362541,  2176.11842336],
       [ 3067.01171594,   488.91242919],
       [ 1418.08128453,  4609.12628274],
       [ -678.52177207, -2116.59025125],
       [  450.8661642 , -2584.72625983],
       [-2215.08842315,  1307.89053855],
       [-2405.83509575,  3828.60164693],
       [  526.41117001, -2995.16579352],
       [ -684.16583336, -2127.68297172],
       [ 2611.38552072, -3980.31283921],
       [-3123.65226483,  3289.70854554],
       [-1411.08520617,  3484.87264179],
       [ -175.90578367,  3713.05325856],
       [ -399.52609361, -4633.17291891],
       [ -552.22565315,  3149.62376805],
       [-1595.12690697,  3926.45901515],
       [ 1233.86028921, -1591.59959949]])

stardata_unfiltered = copy(stardata)

plate2 = plate2[keep_j, :]
plate2 : array([[-1310.30609148,  3087.33048147],
       [ 3044.13362541,  2176.11842336],
       [ 3067.01171594,   488.91242919],
       [ 1418.08128453,  4609.12628274],
       [ -678.52177207, -2116.59025125],
       [  450.8661642 , -2584.72625983],
       [-2215.08842315,  1307.89053855],
       [-2405.83509575,  3828.60164693],
       [  526.41117001, -2995.16579352],
       [ 2611.38552072, -3980.31283921],
       [-3123.65226483,  3289.70854554],
       [-1411.08520617,  3484.87264179],
       [ -175.90578367,  3713.05325856],
       [ -399.52609361, -4633.17291891],
       [ -552.22565315,  3149.62376805],
       [-1595.12690697,  3926.45901515],
       [ 1233.86028921, -1591.59959949]])
       
stardata.select_indices(keep_j)
       
       
result, plate2_corrected, coeff_x, coeff_y, platescale_stderror = distortion_polynomial.do_cubic_fit(plate2, stardata, initial_guess, image_size, options)
result: (np.float64(8.95622669318838e-06), np.float64(0.30261118235528106), np.float64(0.12609029177009767), np.float64(3.1446257647996436))
plate2_corrected : array([[-1312.01778767,  3089.55711777],     shape(17,2)
       [ 3046.05545553,  2178.48911643],
       [ 3068.58468182,   489.73637657],
       [ 1418.08716752,  4613.73604067],
       [ -679.12986266, -2117.88703623],
       [  451.12590206, -2586.39850769],
       [-2216.87212099,  1307.85314293],
       [-2408.68508792,  3831.76125209],
       [  526.63030593, -2997.72976301],
       [ 2614.29178318, -3984.70368469],
       [-3127.39871282,  3292.32175376],
       [-1412.98540135,  3487.691753  ],
       [ -176.60805486,  3716.29629255],
       [ -399.48266058, -4639.27294737],
       [ -553.36156134,  3151.76777919],
       [-1597.27403722,  3929.91747406],
       [ 1234.13700001, -1591.83844571]])
coeff_x: result: (np.float64(8.95622669318838e-06), np.float64(0.30261118235528106), np.float64(0.12609029177009767), np.float64(3.1446257647996436))
plate2_corrected: array([[-1312.01778767,  3089.55711777],
       [ 3046.05545553,  2178.48911643],
       [ 3068.58468182,   489.73637657],
       [ 1418.08716752,  4613.73604067],
       [ -679.12986266, -2117.88703623],
       [  451.12590206, -2586.39850769],
       [-2216.87212099,  1307.85314293],
       [-2408.68508792,  3831.76125209],
       [  526.63030593, -2997.72976301],
       [ 2614.29178318, -3984.70368469],
       [-3127.39871282,  3292.32175376],
       [-1412.98540135,  3487.691753  ],
       [ -176.60805486,  3716.29629255],
       [ -399.48266058, -4639.27294737],
       [ -553.36156134,  3151.76777919],
       [-1597.27403722,  3929.91747406],
       [ 1234.13700001, -1591.83844571]])
coeff_x: [np.float64(-6.526459207206596e-06), np.float64(0.12517430729794204), np.float64(-0.0006771551149775452),     shape(21)
        np.float64(-0.9689749197025272), np.float64(-5.258085362238971), np.float64(-1.5474508329612766), np.float64(9.487749342874993), 
        np.float64(2.1402554568896295), np.float64(14.78936757259292), np.float64(11.354565093696714), np.float64(0.035776476881452246), 
        np.float64(13.520562889407108), np.float64(10.134041796677538), np.float64(-10.789686197998742), np.float64(-13.256935121434513), 
        np.float64(-2.5324872937793415), np.float64(-9.97513582581232), np.float64(-37.94237179100848), np.float64(-7.46529435233996), 
        np.float64(19.51364575816531), np.float64(3.18419347294595)]
coeff_y: [np.float64(-4.2198719812589753e-05), np.float64(-1.749807323523398), np.float64(-0.1258422074309253),         shape(21)
        np.float64(-1.9615124752961148), np.float64(-2.3439123266642348), np.float64(-6.448252430320062), np.float64(4.740187320997482), 
        np.float64(15.965917346271466), np.float64(15.14833063819255), np.float64(6.81125572346499), np.float64(2.106568709761579), 
        np.float64(3.5282744464468334), np.float64(-0.3499187763771546), np.float64(-15.21163853771313), np.float64(2.5464659030568098), 
        np.float64(-3.4279569610799836), np.float64(-12.711217116390575), np.float64(-17.87117833120899), np.float64(-9.266381025939173), 
        np.float64(0.556180505551194), np.float64(19.641280613741124)]
        
transformed_final = transforms.linear_transform(result, plate2_corrected, image_size)
transformed_final : array([[0.95341086, 0.26863306, 0.13727349],     shape(17,3)
       [0.95552184, 0.27796182, 0.0985659 ],
       [0.9511993 , 0.29245643, 0.09843335],
       [0.95993764, 0.2564564 , 0.11291516],
       [0.94041158, 0.31344671, 0.13182266],
       [0.94029194, 0.31783636, 0.12178309],
       [0.94786145, 0.28358823, 0.14538358],
       [0.95387316, 0.2617858 , 0.14694958],
       [0.9391836 , 0.3213506 , 0.12111136],
       [0.93826382, 0.33037858, 0.10252316],
       [0.95166049, 0.26613328, 0.15334728],
       [0.95425671, 0.26516038, 0.1381452 ],
       [0.95619865, 0.26365806, 0.12715568],
       [0.9333397 , 0.33489244, 0.12932152],
       [0.95442554, 0.26838797, 0.13053652],
       [0.95509555, 0.26127012, 0.13975122],
       [0.94389242, 0.3096529 , 0.11481369]])
       
mag_errors = np.linalg.norm(transformed_final - stardata.get_vectors(), axis=1)
mag_errors : array([4.37219332e-09, 5.30538058e-09, 4.57381368e-09, 6.59523564e-09,    shape(17)
       3.38835485e-09, 4.06053998e-09, 3.29396785e-09, 6.01673818e-09,
       4.65137022e-09, 7.11933183e-09, 6.04164746e-09, 4.94816115e-09,
       4.94073377e-09, 6.87808416e-09, 4.18082380e-09, 5.62518118e-09,
       3.22958838e-09])
       
errors_arcseconds = np.degrees(mag_errors)*3600                 
errors_arcseconds : array([0.00090183, 0.00109431, 0.00094342, 0.00136037, 0.0006989 ,     shape(17)
       0.00083755, 0.00067943, 0.00124104, 0.00095941, 0.00146847,
       0.00124618, 0.00102063, 0.0010191 , 0.00141871, 0.00086236,
       0.00116028, 0.00066615])

detransformed = transforms.detransform_vectors(result, stardata.get_vectors())
detransformed :  array([[-1312.01827439,  3089.55715521],     shape(17, 2)
       [ 3046.05540302,  2178.4897065 ],
       [ 3068.58486981,   489.73685137],
       [ 1418.08665667,  4613.73657131],
       [ -679.12956854, -2117.88727422],
       [  451.12634165, -2586.39861863],
       [-2216.87241919,  1307.85292758],
       [-2408.68575654,  3831.76118634],
       [  526.63080896, -2997.72989209],
       [ 2614.2925722 , -3984.7035875 ],
       [-3127.39935561,  3292.32154859],
       [-1412.98595145,  3487.69180405],
       [ -176.60855058,  3716.29653456],
       [ -399.48199044, -4639.27332256],
       [ -553.36200366,  3151.76792833],
       [-1597.27466277,  3929.91753   ],
       [ 1234.13735386, -1591.83837619]])   

px_errors = plate2_corrected - detransformed       
px_errors : array([[ 4.86723250e-04, -3.74439355e-05],       shape(17, 2)
       [ 5.25180249e-05, -5.90063126e-04],
       [-1.87986323e-04, -4.74804319e-04],
       [ 5.10852210e-04, -5.30639351e-04],
       [-2.94120903e-04,  2.37987480e-04],
       [-4.39584298e-04,  1.10934631e-04],
       [ 2.98194848e-04,  2.15350121e-04],
       [ 6.68617098e-04,  6.57498072e-05],
       [-5.03032652e-04,  1.29076631e-04],
       [-7.89020456e-04, -9.71869681e-05],
       [ 6.42785802e-04,  2.05172100e-04],
       [ 5.50099559e-04, -5.10437326e-05],
       [ 4.95720586e-04, -2.42012489e-04],
       [-6.70132392e-04,  3.75193582e-04],
       [ 4.42319670e-04, -1.49141030e-04],
       [ 6.25550997e-04, -5.59346768e-05],
       [-3.53843674e-04, -6.95168767e-05]])
       
nn_corr, nn_r = get_nn_correlation_error(plate2, px_errors, options)
nn_corr : np.float64(0.9495657713623731)
    

coeff_names = distortion_polynomial.get_coeff_names(options)
coeff_names : ['1', 'x', 'y', 'x^2', 'x * y', 'y^2', 'x^3', 'x^2 * y', 'x * y^2', 'y^3', 'x^4', 'x^3 * y', 'x^2 * y^2', 'x * y^3', 'y^4', 'x^5', 'x^4 * y', 'x^3 * y^2', 'x^2 * y^3', 'x * y^4', 'y^5']


plate2_unfiltered_corrected = distortion_polynomial.apply_corrections(result, plate2_unfiltered, coeff_x, coeff_y, image_size, options)
plate2_unfiltered_corrected : array([[-1312.01774547,  3089.55712429],     shape(18,2)
       [ 3046.05549773,  2178.48912296],
       [ 3068.58472402,   489.7363831 ],
       [ 1418.08720972,  4613.7360472 ],
       [ -679.12982046, -2117.8870297 ],
       [  451.12594426, -2586.39850117],
       [-2216.87207879,  1307.85314945],
       [-2408.68504572,  3831.76125861],
       [  526.63034813, -2997.72975649],
       [ -684.78927448, -2128.99537814],
       [ 2614.29182538, -3984.70367816],
       [-3127.39867063,  3292.32176029],
       [-1412.98535916,  3487.69175953],
       [ -176.60801266,  3716.29629907],
       [ -399.48261838, -4639.27294084],
       [ -553.36151914,  3151.76778572],
       [-1597.27399502,  3929.91748059],
       [ 1234.13704221, -1591.83843918]])
       
transformed_final = transforms.linear_transform(result, plate2_unfiltered_corrected, image_size)
transformed_final : array([[0.95341086, 0.26863306, 0.13727349],         shape(18,2)
       [0.95552184, 0.27796182, 0.0985659 ],
       [0.9511993 , 0.29245643, 0.09843335],
       [0.95993764, 0.2564564 , 0.11291516],
       [0.94041158, 0.31344671, 0.13182266],
       [0.94029194, 0.31783636, 0.12178309],
       [0.94786145, 0.28358823, 0.14538358],
       [0.95387316, 0.2617858 , 0.14694958],
       [0.9391836 , 0.3213506 , 0.12111136],
       [0.94037378, 0.31353896, 0.13187296],
       [0.93826382, 0.33037858, 0.10252316],
       [0.95166049, 0.26613328, 0.15334728],
       [0.95425671, 0.26516038, 0.1381452 ],
       [0.95619865, 0.26365806, 0.12715568],
       [0.9333397 , 0.33489244, 0.12932152],
       [0.95442554, 0.26838797, 0.13053652],
       [0.95509555, 0.26127012, 0.13975122],
       [0.94389242, 0.3096529 , 0.11481369]])
       
mag_errors = np.linalg.norm(transformed_final - stardata_unfiltered.get_vectors(), axis=1)
mag:errors : array([4.74532135e-09, 5.29423958e-09, 4.39270405e-09, 6.82236109e-09,      shape(18)
       3.14410297e-09, 3.71139317e-09, 3.63871852e-09, 6.39857798e-09,
       4.30245740e-09, 8.43343945e-06, 6.73713809e-09, 6.41968940e-09,
       5.31987763e-09, 5.25925149e-09, 6.58108772e-09, 4.52370426e-09,
       5.99708967e-09, 2.84751936e-09])
       
errors_arcseconds = np.degrees(mag_errors)*3600
errors_arcseconds : array([9.78792789e-04, 1.09201530e-03, 9.06060251e-04, 1.40721299e-03,
       6.48517789e-04, 7.65529793e-04, 7.50539570e-04, 1.31980145e-03,
       8.87445541e-04, 1.73952175e+00, 1.38963448e-03, 1.32415599e-03,
       1.09730353e-03, 1.08479849e-03, 1.35744678e-03, 9.33080982e-04,
       1.23698854e-03, 5.87343030e-04])
       
       
*****************************************************************************************************************
*****************************************************************************************************************   
match_centroids(other_stars_df, rough_platesolve_x, dbs, corners, image_size, lookupdate, options):
# comentario: Se devuelve un conjunto de datos de estrellas observadas y candidatas que cumplen con los criterios de coincidencia, 
# junto con las coordenadas de las estrellas observadas en el plano de la imagen y una máscara booleana que indica qué coincidencias se han seleccionado. 
# Esto permite realizar un ajuste de distorsión más preciso utilizando solo las coincidencias más confiables.
return stardata0, stardata, plate2, alt, az, mask_select    

*********** ENTRADA *************
other_stars_df
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
rough_platesolve_x: array([8.96647322e-06, 3.02608057e-01, 1.26090843e-01, 3.14446672e+00])
dbs: conexión base datos
corners: array([[ 8.86572928, 19.822932 ], [ 5.57039083, 14.87196171], [ 8.85154165, 14.84445949], [ 5.5844759 , 19.81442432]]) 
image_size: [6388, 9576]
lookupdate: '2024-04-08'
options

# busca las estrellas en la base de datos Gaia dentro del área de la imagen y con magnitud menor que el límite especificado, en la fecha especificada
stardata0 = dbs.lookup_objects(*get_bbox(corners), star_max_magnitude=options['max_star_mag_dist'], time=date_string_to_float(lookupdate))  
stardata0 : <SkyCoord (ICRS): (ra, dec, distance) in (deg, deg, pc)   shape(439)
    [(18.29918345, 6.28957297, 1000.        ),
     (15.72678509, 6.8405821 ,  592.1544735 ),
     (16.61149789, 7.10842101,  392.66768255),
     (15.06186186, 6.84605331,  448.98276178),
      ...
     (19.23237186, 8.49294823,  173.29309037),
     (18.25203839, 8.48758526,  395.00497876),
     (15.34615891, 8.45055988,  487.85674088)]

    # Se corrigen las coordenadas RA y DEC de las estrellas observadas utilizando la clase AstroCorrect, que aplica correcciones de aberración y paralaje. 
    # Se devuelven las coordenadas corregidas de las estrellas, así como la altitud y azimut correspondientes. 
    # Si no se habilitan las correcciones, se utilizan las coordenadas originales de las estrellas observadas.
astrocorrect = refraction_correction.AstroCorrect()   # Al instanciar la clase AstroCorrect se pone la masa del Sol a 0 para evitar que Astropy calcule la deflexión   
stardata, alt, az = astrocorrect.correct_ra_dec(stardata0, options)
<SkyCoord (ICRS): (ra, dec) in deg            shape(439)
    [(18.29889786, 6.28978882), (15.72715176, 6.84066616),
     (16.61155911, 7.10840675), (15.06243628, 6.84614215),
     (15.23580042, 7.77889429), (15.96129719, 7.98416018),
      ...
     (16.54098153, 8.42216675), (16.23273685, 8.84858731),
     (19.45999584, 7.55331498), (19.51916294, 7.7998251 ),
     (19.23187684, 8.49262814), (18.25182994, 8.48730463),
     (15.34668833, 8.45019195)]
     
# convierte las coordenadas de píxeles a coordenadas centradas en el centro de la imagen
all_star_plate = np.array([other_stars_df['py'], other_stars_df['px']]).T - np.array([image_size[0]/2, image_size[1]/2])
all_star_plate :       shape(23, 2) 
    array([[-1310.30609148,  3087.33048147],
       [ 3044.13362541,  2176.11842336],
       [ 3067.01171594,   488.91242919],
       [ 1418.08128453,  4609.12628274],
       [ -678.52177207, -2116.59025125],
       [  450.8661642 , -2584.72625983],
       [-2215.08842315,  1307.89053855],
       [-2405.83509575,  3828.60164693],
       [  526.41117001, -2995.16579352],
       [ -684.16583336, -2127.68297172],
       [ 2611.38552072, -3980.31283921],
       [  883.60523568,  2693.68755147],
       [-3123.65226483,  3289.70854554],
       [-1411.08520617,  3484.87264179],
       [ 2239.25173173,  1862.48929915],
       [-2163.3766258 ,  1897.43064588],
       [ -175.90578367,  3713.05325856],
       [ -399.52609361, -4633.17291891],
       [  340.10909937,  2179.80911364],
       [ -552.22565315,  3149.62376805],
       [-1595.12690697,  3926.45901515],
       [ 1082.11320268,  1272.75040631],
       [ 1233.86028921, -1591.59959949]])
       
# transforma las coordenadas de píxeles a coordenadas polares utilizando la transformación lineal aproximada obtenida del platesolve
transformed_all = transforms.to_polar(transforms.linear_transform(rough_platesolve_x, all_star_plate))
transformed_all:       shape(23,2)
array([[ 7.89027619, 15.73496547],    
       [ 5.65600133, 16.21925475],
       [ 5.6480405 , 17.09031589],
       [ 6.48296394, 14.95713826],
       [ 7.57487469, 18.43410225],
       [ 6.99471028, 18.6766687 ],
       [ 8.36001312, 16.65572768],
       [ 8.45048275, 15.34607256],
       [ 6.95583698, 18.88909329],
       [ 7.57777691, 18.43985021],
       [ 5.88414876, 19.39771988],
       [ 6.76444134, 15.94592378],
       [ 8.82116599, 15.62320894],
       [ 7.94069765, 15.52840689],
       [ 6.07032827, 16.37926055],
       [ 8.33202099, 16.34975221],
       [ 7.30533472, 15.41474561],
       [ 7.43029802, 19.73797856],
       [ 7.04514205, 16.21029726],
       [ 7.50062217, 15.70528889],
       [ 8.03363479, 15.29860891],
       [ 6.66620006, 16.68146093],
       [ 6.59219922, 18.16310775]])    

# crea una matriz de estrellas candidatas a partir de los datos de Gaia, con las coordenadas RA y DEC en grados 
candidate_stars = np.zeros((stardata.nstars(), 2))
candidate_stars[:, 0] = np.degrees(stardata.get_dec())
candidate_stars[:, 1] = np.degrees(stardata.get_ra())
candidate_stars:       shape(439, 2)
    array([[ 6.28978882, 18.29889786],
       [ 6.84066616, 15.72715176],
       [ 7.10840675, 16.61155911],
       [ 6.84614215, 15.06243628],
        ...
       [ 8.49262814, 19.23187684],
       [ 8.48730463, 18.25182994],
       [ 8.45019195, 15.34668833]])
       
# encuentra los dos vecinos más cercanos para cada estrella observada en el conjunto de estrellas candidatas
neigh = NearestNeighbors(n_neighbors=2)
    
# ajusta el modelo de vecinos más cercanos con las coordenadas de las estrellas candidatas y luego obtiene las distancias y los índices de los dos vecinos más cercanos para cada estrella observada
neigh.fit(candidate_stars)
neigh : 
array([[ 6.28978882, 18.29889786],
       [ 6.84066616, 15.72715176],
       [ 7.10840675, 16.61155911],
        ...
       [ 8.49262814, 19.23187684],
       [ 8.48730463, 18.25182994],
       [ 8.45019195, 15.34668833]])

distances, indices = neigh.kneighbors(transformed_all)
distances:
array([[0.00076756, 0.11308352],
       [0.00076751, 0.06586224],
       [0.00096694, 0.04927742],
       [0.00076409, 0.10261007],
       [0.00046232, 0.00598829],
       [0.00054533, 0.14991382],
       [0.00094961, 0.06964171],
       [0.00068099, 0.06250296],
       [0.0004666 , 0.11439535],
       [0.00018609, 0.00052962],
       [0.00045611, 0.10651565],
       [0.00050881, 0.0010057 ],
       [0.00056024, 0.11054209],
       [0.00068906, 0.16115871],
       [0.00107691, 0.0839205 ],
       [0.00112814, 0.11724485],
       [0.00068878, 0.11637705],
       [0.00056714, 0.02285684],
       [0.00110979, 0.02407206],
       [0.00088924, 0.06166676],
       [0.00061259, 0.07257789],
       [0.00107456, 0.15446514],
       [0.00086676, 0.066304  ]])
       
# Se realiza una búsqueda de vecinos más cercanos para cada estrella observada en el conjunto de estrellas candidatas, utilizando la clase NearestNeighbors de sklearn.
# Se ajusta el modelo con las coordenadas de las estrellas candidatas y luego se obtienen las distancias y los índices de los dos vecinos más cercanos 
# para cada estrella observada. Esto permite identificar qué estrellas candidatas están más cerca de cada estrella observada, lo cual es útil para emparejar 
# las observaciones con los datos de la base de datos Gaia.
neigh_bar = NearestNeighbors(n_neighbors=1)

# Se ajusta el modelo de vecinos más cercanos con las coordenadas de todas las estrellas candidatas y luego se obtienen las distancias y los índices del 
# vecino más cercano para cada estrella observada. Esto permite identificar qué estrella candidata está más cerca de cada estrella observada, 
# lo cual es útil para emparejar las observaciones con los datos de la base de datos Gaia. 
neigh_bar.fit(transformed_all)
neigh_bar:     shape(23,2)
array([[ 7.89027619, 15.73496547],
       [ 5.65600133, 16.21925475],
       [ 5.6480405 , 17.09031589],
       [ 6.48296394, 14.95713826],
       [ 7.57487469, 18.43410225],
       [ 6.99471028, 18.6766687 ],
       [ 8.36001312, 16.65572768],
       [ 8.45048275, 15.34607256],
       [ 6.95583698, 18.88909329],
       [ 7.57777691, 18.43985021],
       [ 5.88414876, 19.39771988],
       [ 6.76444134, 15.94592378],
       [ 8.82116599, 15.62320894],
       [ 7.94069765, 15.52840689],
       [ 6.07032827, 16.37926055],
       [ 8.33202099, 16.34975221],
       [ 7.30533472, 15.41474561],
       [ 7.43029802, 19.73797856],
       [ 7.04514205, 16.21029726],
       [ 7.50062217, 15.70528889],
       [ 8.03363479, 15.29860891],
       [ 6.66620006, 16.68146093],
       [ 6.59219922, 18.16310775]])    
distances_bar, indices_bar = neigh_bar.kneighbors(candidate_stars)
indices_bar:   shape(439)
    array([[22], [11], [18], ... [17], [ 9], [ 7]])
    
###   3.3 Criterio de Lowe para Ambigüedad (Lowe's Ratio Test)  y   3.4 Criterio de Reflexividad Bidireccional (Mutual Matching)    
# comentario: Se define un umbral de coincidencia y una relación de confusión para determinar qué coincidencias son válidas. Se filtran las coincidencias 
# basándose en estas condiciones, asegurando que la relación de vecino más cercano sea reflexiva y eliminando coincidencias ambiguas.
match_threshhold = options['rough_match_threshhold'] / 33600 # in degrees -> arcsec
confusion_ratio = 2 # closest match must be 2x closer than second place

# Se crea una máscara booleana para identificar qué coincidencias cumplen con los criterios de distancia y relación de confusión. 
# Además, se asegura que la relación de vecino más cercano sea reflexiva, eliminando coincidencias ambiguas. 
# Esto permite seleccionar solo las coincidencias más confiables entre las estrellas observadas y las candidatas.
keep = np.logical_and(distances[:, 0] < match_threshhold, distances[:, 1] / distances[:, 0] > confusion_ratio) # note: this distance metric is not perfect (doesn't take into account meridian etc.)
keep = np.logical_and(keep, indices_bar[indices[:, 0]].flatten() == np.arange(indices.shape[0])) # is the nearest-neighbour relation reflexive? [this eliminates 1-to-many matching]

###    4. Filtrado Geométrico de Borde (Crop Circle)
if options['crop_circle']:
   radial_dist = 2 * np.linalg.norm(all_star_plate, axis=1) / np.linalg.norm(list(image_size))
   within_circle = radial_dist < options['crop_circle_thresh']
   circle_removed = np.logical_and(keep, ~within_circle)
   keep = np.logical_and(keep, within_circle)
keep:     shape(23)
    array([ True,  True,  True,  True,  True,  True,  True,  True,  True, True,  True, False,  True,  True, False, False,  True,  True,
       False,  True,  True, False,  True])
       
# Se obtienen las estrellas observadas y las estrellas candidatas que cumplen con los criterios de coincidencia, utilizando la máscara booleana creada anteriormente. Esto permite trabajar solo con las coincidencias más confiables para el ajuste de distorsión.
keep_i = np.nonzero(keep)
obs_matched = transformed_all[keep_i, :][0]
obs_matched:     shape(18, 2)
  array([[ 7.89027619, 15.73496547],
       [ 5.65600133, 16.21925475],
       [ 5.6480405 , 17.09031589],
       [ 6.48296394, 14.95713826],
       [ 7.57487469, 18.43410225],
       [ 6.99471028, 18.6766687 ],
       [ 8.36001312, 16.65572768],
       [ 8.45048275, 15.34607256],
       [ 6.95583698, 18.88909329],
       [ 7.57777691, 18.43985021],
       [ 5.88414876, 19.39771988],
       [ 8.82116599, 15.62320894],
       [ 7.94069765, 15.52840689],
       [ 7.30533472, 15.41474561],
       [ 7.43029802, 19.73797856],
       [ 7.50062217, 15.70528889],
       [ 8.03363479, 15.29860891],
       [ 6.59219922, 18.16310775]])  
cata_matched = candidate_stars[indices[keep_i, 0], :][0]       
cata_matched:
    array([[ 7.89010542, 15.73571379],
       [ 5.65659454, 16.21974175],
       [ 5.64896264, 17.09060676],
       [ 6.48338936, 14.95777296],
       [ 7.57492919, 18.43364315],
       [ 6.995021  , 18.67622055],
       [ 8.35949244, 16.65652182],
       [ 8.45019195, 15.34668833],
       [ 6.95624659, 18.88886982],
       [ 7.57796257, 18.43986276],
       [ 5.88448356, 19.39802964],
       [ 8.82095684, 15.62372868],
       [ 7.9405317 , 15.52907567],
       [ 7.3052608 , 15.41543041],
       [ 7.43038689, 19.73853869],
       [ 7.50059685, 15.70617777],
       [ 8.03345111, 15.29919332],
       [ 6.59287901, 18.16257001]])
       
mask_select = indices[keep_i, 0].flatten()
stardata.select_indices(mask_select)
plate2 = all_star_plate[keep_i, :][0]

# comentario: Se devuelve un conjunto de datos de estrellas observadas y candidatas que cumplen con los criterios de coincidencia, 
# junto con las coordenadas de las estrellas observadas en el plano de la imagen y una máscara booleana que indica qué coincidencias se han seleccionado. 
# Esto permite realizar un ajuste de distorsión más preciso utilizando solo las coincidencias más confiables.
return stardata0, stardata, plate2, alt, az, mask_select
stardata0:       shape(439)  
    <SkyCoord (ICRS): (ra, dec, distance) in (deg, deg, pc)
    [(18.29918345, 6.28957297, 1000.        ),
     (15.72678509, 6.8405821 ,  592.1544735 ),
     (16.61149789, 7.10842101,  392.66768255),
     (15.06186186, 6.84605331,  448.98276178),
      ...
     (19.23237186, 8.49294823,  173.29309037),
     (18.25203839, 8.48758526,  395.00497876),
     (15.34615891, 8.45055988,  487.85674088)]
stardata:
    <SkyCoord (ICRS): (ra, dec) in deg    shape(439)
    [(18.29889786, 6.28978882), (15.72715176, 6.84066616),
     (16.61155911, 7.10840675), (15.06243628, 6.84614215),
     (15.23580042, 7.77889429), (15.96129719, 7.98416018),
      ...
     (19.45999584, 7.55331498), (19.51916294, 7.7998251 ),
     (19.23187684, 8.49262814), (18.25182994, 8.48730463),
     (15.34668833, 8.45019195)]>
     
---------------------------------------------------------

 plate2:   shape(18)
     array([[-1310.30609148,  3087.33048147],
       [ 3044.13362541,  2176.11842336],
       [ 3067.01171594,   488.91242919],
       [ 1418.08128453,  4609.12628274],
       [ -678.52177207, -2116.59025125],
       [  450.8661642 , -2584.72625983],
       [-2215.08842315,  1307.89053855],
       [-2405.83509575,  3828.60164693],
       [  526.41117001, -2995.16579352],
       [ -684.16583336, -2127.68297172],
       [ 2611.38552072, -3980.31283921],
       [-3123.65226483,  3289.70854554],
       [-1411.08520617,  3484.87264179],
       [ -175.90578367,  3713.05325856],
       [ -399.52609361, -4633.17291891],
       [ -552.22565315,  3149.62376805],
       [-1595.12690697,  3926.45901515],
       [ 1233.86028921, -1591.59959949]])
alt: np.float64(69.7668456109223)
az:  np.float64(142.7726471735069)
mask_select:
    array([ 19,  30, 412, 229, 182, 402, 108, 438, 266,  74, 348, 133, 309, 339, 215, 275, 310, 351])
```