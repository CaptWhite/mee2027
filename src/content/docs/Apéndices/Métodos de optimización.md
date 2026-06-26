**Los algoritmos de optimización numérica iterativos están diseñados específicamente para encontrar los mínimos locales de funciones continuas y diferenciables. Estos métodos se clasifican según el uso que hacen de las derivadas de la función (gradiente y matriz Hessiana) para determinar la dirección y el tamaño del paso hacia el punto mínimo.**

Aquí tienes la clasificación y el funcionamiento de los principales sistemas de optimización:
## 1. Métodos basados en el Gradiente (Primer Orden)
Estos algoritmos solo utilizan las primeras derivadas (el gradiente ∇ f(x)) para conocer la dirección de máxima pendiente.

* Descenso de Gradiente (Gradient Descent): Avanza en dirección opuesta al gradiente. Es el método más simple, pero puede ser muy lento en funciones con valles estrechos o formas elípticas alargadas.

## 2. Método de Newton (Segundo Orden)
Este sistema utiliza tanto el gradiente como las segundas derivadas, las cuales se organizan en una estructura matemática llamada matriz Hessiana (H).

* Método de Newton: Utiliza la inversa de la matriz Hessiana (H⁻¹) para calcular de forma exacta la curvatura del terreno matemático.
* Ventaja: Su convergencia es cuadrática, lo que significa que llega al mínimo en muy pocos pasos si empieza cerca de él.
* Desventaja: Calcular y almacenar la matriz Hessiana en cada iteración es extremadamente costoso y lento para problemas con muchas variables.

## 3. Métodos Cuasi-Newton (Aproximación del Segundo Orden)
Para resolver la lentitud del método de Newton, estos sistemas aproximan la matriz Hessiana iteración a iteración utilizando únicamente información del gradiente, evitando el costoso cálculo de las segundas derivadas.

* BFGS (Broyden-Fletcher-Goldfarb-Shanno): Es el algoritmo Cuasi-Newton más popular y eficiente del mundo. Actualiza una aproximación de la Hessiana inversa en cada paso, logrando una convergencia casi tan rápida como Newton pero con un coste computacional mucho menor.
* L-BFGS (Limited-memory BFGS): Una variante optimizada para "Big Data" y aprendizaje automático. No almacena la matriz de aproximación completa, sino solo los vectores de los últimos pasos, ahorrando enormes cantidades de memoria RAM.

## 4. Métodos de Región de Confianza y Gradiente Conjugado
Diseñados para mejorar la estabilidad cuando las aproximaciones fallan o las dimensiones son gigantescas.

* Gradiente Conjugado (CG): Ideal para sistemas de ecuaciones lineales gigantescos. Encuentra el mínimo moviéndose en direcciones "ortogonales" (conjugadas) sin necesidad de almacenar ninguna matriz.
* Levenberg-Marquardt: Un sistema híbrido que oscila entre el Descenso de Gradiente (cuando está lejos del mínimo) y el Método de Newton (cuando está muy cerca), ampliamente usado en problemas de ajuste de curvas por mínimos cuadrados.

------------------------------
## Resumen de Diferencias Clave

| Sistema / Algoritmo | Información utilizada | Coste por iteración | Velocidad de convergencia | Ideal para... |
|---|---|---|---|---|
| Descenso de Gradiente | Solo Gradiente (1º orden) | Muy Bajo | Lenta | Redes neuronales profundas |
| Método de Newton | Gradiente e Hessiana (2º orden) | Muy Alto | Muy Rápida (Cuadrática) | Pocas variables, alta precisión |
| BFGS | Gradiente (Aproxima Hessiana) | Medio | Rápida (Superlineal) | Optimización general de tamaño medio |
| L-BFGS | Gradiente (Memoria limitada) | Bajo | Rápida (Superlineal) | Modelos con miles de variables |

