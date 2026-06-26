# La Fórmula de Taylor: De una a Varias Dimensiones

La fórmula (o teorema) de Taylor es una de las herramientas más potentes del cálculo. Permite aproximar localmente funciones diferenciables mediante polinomios en las cercanías de un punto específico. 

Este documento presenta una guía paso a paso adaptada para nivel universitario, limitando el desarrollo a **segundo orden** (los primeros 2 niveles de descomposición: lineal y cuadrático) y demostrando cómo la versión multidimensional surge de forma directa y elegante de la versión unidimensional.

---

## 0. Regla de la cadena para funciones de varias variables

Esa es, precisamente, la **regla de la cadena** para funciones de varias variables.

Vamos a desglosar la igualdad paso a paso para que quede claro el porqué.


### Planteamiento

Tenemos una función de varias variables:
\[
f(\mathbf{x}) = f(x_1, x_2, \dots, x_n)
\]

Y un **camino rectilíneo** (una línea en el espacio) definido como:
\[\mathbf{x}(t) = \mathbf{x}_0 + t\mathbf{h}\]
donde:
*   \(\mathbf{x}_0 = (x_{0,1}, \dots, x_{0,n})\) es un vector constante (el punto inicial).
*   \(\mathbf{h} = (h_1, \dots, h_n)\) es un vector constante (la dirección y magnitud del paso).
*   \(t\) es un escalar real (el parámetro, que juega el papel de "tiempo").

Al escribir cada componente:
\[x_1(t) = x_{0,1} + t h_1 \\
x_2(t) = x_{0,2} + t h_2 \\
\vdots \\
x_n(t) = x_{0,n} + t h_n\]

Queremos derivar la función compuesta \( g(t) = f(\mathbf{x}(t)) \) respecto a \( t \).

---

### Por qué aparece la suma

La regla de la cadena multivariable nos dice que la derivada total de \( f \) respecto a \( t \) es la suma de las contribuciones de cómo cambia \( f \) respecto a cada variable \( x_i \), multiplicado por cómo cambia esa variable \( x_i \) respecto a \( t \).

Visualízalo así:
1.  Un pequeño cambio en \( t \) (\( \Delta t \)) provoca un pequeño cambio en \( x_1 \) (\( \Delta x_1 \)), en \( x_2 \) (\( \Delta x_2 \)), etc.
2.  El cambio en \( x_1 \) afecta a \( f \) (a través de \( \frac{\partial f}{\partial x_1} \)).
3.  El cambio en \( x_2 \) afecta a \( f \) (a través de \( \frac{\partial f}{\partial x_2} \)).
4.  El efecto total en \( f \) es la **suma** de todos estos efectos individuales.

Matemáticamente, el teorema de la regla de la cadena establece:
\[
\frac{d}{dt} f(x_1(t), \dots, x_n(t)) = \sum_{i=1}^n \frac{\partial f}{\partial x_i} \frac{d x_i}{dt} \tag{1}
\]

---

### 3. Aplicación al caso concreto (\( \mathbf{x}(t) = \mathbf{x}_0 + t\mathbf{h} \))

En nuestro caso particular, la derivada de cada componente \( x_i(t) \) respecto a \( t \) es muy sencilla. Como es una función lineal de \( t \):
\[
\frac{d x_i}{dt} = \frac{d}{dt}(x_{0,i} + t h_i) = h_i
\]

Al sustituir \( \frac{d x_i}{dt} \) por \( h_i \) en la suma, obtenemos exactamente la fórmula que preguntabas:
\[
g'(t) = \sum_{i=1}^n \frac{\partial f}{\partial x_i}(\mathbf{x}_0 + t\mathbf{h}) \cdot h_i
\]

### Resumen
La fórmula es una suma porque **el cambio total en \( f \) es la suma de los cambios provocados por cada variable independiente**. Es la extensión natural de la derivada de \( f(x(t)) \) en una dimensión, donde ahora hay \( n \) "caminos" que convergen en \( f \).


---

## 1. Taylor. El Caso Unidimensional (1D)

Dada una función suficientemente diferenciable $f: \mathbb{R} \to \mathbb{R}$, queremos aproximar su valor en un punto cercano a $x_0$. Definamos el incremento o perturbación como $h = x - x_0$.

La aproximación de Taylor de segundo orden alrededor de $x_0$ es:


$$
f(x_0 + h) = f(x_0) + f'(x_0)h + \frac{1}{2}f''(x_0)h^2 + R_2(h)
$$


Donde $R_2(h)$ es el término de error o residuo, que satisface $\lim_{h \to 0} \frac{R_2(h)}{h^2} = 0$.

### Desglose de Términos (1D):
1. **Nivel 0 (Constante):** $f(x_0)$  
   Aproximación de orden cero. Solo requiere que la aproximación coincida con la función en el punto exacto.
2. **Nivel 1 (Lineal):** $f'(x_0)h$  
   Ajusta la pendiente. La suma de los niveles 0 y 1 da la recta tangente: $T_1(x) = f(x_0) + f'(x_0)(x-x_0)$.
3. **Nivel 2 (Cuadrático):** $\frac{1}{2}f''(x_0)h^2$  
   Ajusta la concavidad/curvatura. Define la parábola de mejor ajuste local.

---

## 2. El Caso Multidimensional (N-D)

Consideremos ahora una función escalar de varias variables $f: \mathbb{R}^n \to \mathbb{R}$. Queremos aproximar el valor de la función en las cercanías de un punto vector $\mathbf{x}_0 \in \mathbb{R}^n$, aplicando un incremento vectorial $\mathbf{h} \in \mathbb{R}^n$ (es decir, evaluando en $\mathbf{x}_0 + \mathbf{h}$).

La fórmula de Taylor de segundo orden en varias variables se escribe como:


$$
f(\mathbf{x}_0 + \mathbf{h}) = f(\mathbf{x}_0) + \nabla f(\mathbf{x}_0)^T \mathbf{h} + \frac{1}{2} \mathbf{h}^T \mathbf{H}_f(\mathbf{x}_0) \mathbf{h} + R_2(\mathbf{h})
$$


Donde:
* $\nabla f(\mathbf{x}_0)$ es el **vector Gradiente** (derivadas de primer orden).
* $\mathbf{H}_f(\mathbf{x}_0)$ es la **matriz Hessiana** (derivadas de segundo orden).
* $\nabla f(\mathbf{x}_0)^T \mathbf{h}$ representa el producto escalar $\langle \nabla f(\mathbf{x}_0), \mathbf{h} \rangle$.
* $\mathbf{h}^T \mathbf{H}_f(\mathbf{x}_0) \mathbf{h}$ es una forma cuadrática.

### Desglose de Términos (N-D):
1. **Nivel 0 (Constante):** $f(\mathbf{x}_0)$
2. **Nivel 1 (Lineal / Plano Tangente):** $\nabla f(\mathbf{x}_0)^T \mathbf{h} = \sum_{i=1}^n \frac{\partial f}{\partial x_i}(\mathbf{x}_0) h_i$
3. **Nivel 2 (Cuadrático / Paraboloide):** $\frac{1}{2} \mathbf{h}^T \mathbf{H}_f(\mathbf{x}_0) \mathbf{h} = \frac{1}{2} \sum_{i=1}^n \sum_{j=1}^n \frac{\partial^2 f}{\partial x_i \partial x_j}(\mathbf{x}_0) h_i h_j$

---

## 3. Demostración Paso a Paso: El Puente de 1D a N-D

El método más elegante para demostrar la fórmula multidimensional consiste en **reducir el problema a una sola variable** utilizando una parametrización lineal.

### Paso 1: Definir la función auxiliar
Fijamos el punto base $\mathbf{x}_0$ y la dirección del incremento $\mathbf{h}$. Definimos una función de variable real $g: [0, 1] \to \mathbb{R}$ parametrizada por $t$:


$$
g(t) = f(\mathbf{x}_0 + t\mathbf{h})
$$


Observemos las siguientes propiedades clave de $g(t)$:
* Para $t = 0$: &nbsp;&nbsp; $g(0) = f(\mathbf{x}_0)$ (el punto inicial).
* Para $t = 1$: &nbsp;&nbsp; $g(1) = f(\mathbf{x}_0 + \mathbf{h})$ (el punto de destino aproximado).

### Paso 2: Aplicar Taylor 1D a la función auxiliar
Dado que $g(t)$ es una función de una sola variable ($t$), podemos expandirla alrededor de $t_0 = 0$ usando el teorema de Taylor unidimensional básico evaluado en $t = 1$:


$$
g(1) = g(0) + g'(0)(1 - 0) + \frac{1}{2}g''(0)(1 - 0)^2 + \text{Residuo}
$$


Simplificando:


$$
g(1) = g(0) + g'(0) + \frac{1}{2}g''(0) + R_2
$$


### Paso 3: Calcular las derivadas de $g(t)$ usando la Regla de la Cadena
Para obtener los valores de $g'(0)$ y $g''(0)$, debemos derivar $g(t) = f(\mathbf{x}_0 + t\mathbf{h})$ respecto a $t$. 

Sea $\mathbf{x}(t) = \mathbf{x}_0 + t\mathbf{h}$, \
&emsp;&emsp;&emsp; de modo que $x_i(t) = x_{0,i} + t h_i$.\
&emsp;&emsp;&emsp;  Su derivada es $\frac{d x_i}{dt} = h_i$.

#### Derivada Primera ($g'(t)$):
Por la regla de la cadena multivariable:


$$
g'(t) = \frac{d}{dt} f(\mathbf{x}(t)) = \sum_{i=1}^n \frac{\partial f}{\partial x_i}(\mathbf{x}(t)) \frac{d x_i}{dt} = \sum_{i=1}^n \frac{\partial f}{\partial x_i}(\mathbf{x}_0 + t\mathbf{h}) h_i
$$


Expresado en notación vectorial:


$$
g'(t) = \nabla f(\mathbf{x}_0 + t\mathbf{h}) \cdot \mathbf{h} = \nabla f(\mathbf{x}_0 + t\mathbf{h})^T \mathbf{h}
$$


Evaluando en $t = 0$:


$$
g'(0) = \nabla f(\mathbf{x}_0)^T \mathbf{h}
$$


> [!NOTE]
> Esto demuestra rigurosamente por qué el término lineal en varias variables es el producto del vector gradiente y el vector de desplazamiento.

#### Derivada Segunda ($g''(t)$):
Derivamos $g'(t)$ una vez más respecto a $t$:


$$
g''(t) = \frac{d}{dt} \left[ \sum_{i=1}^n \frac{\partial f}{\partial x_i}(\mathbf{x}_0 + t\mathbf{h}) h_i \right] = \sum_{i=1}^n h_i \frac{d}{dt} \left( \frac{\partial f}{\partial x_i}(\mathbf{x}_0 + t\mathbf{h}) \right)
$$


Aplicamos de nuevo la regla de la cadena al término dentro del paréntesis:


$$
\frac{d}{dt} \left( \frac{\partial f}{\partial x_i}(\mathbf{x}_0 + t\mathbf{h}) \right) = \sum_{j=1}^n \frac{\partial^2 f}{\partial x_j \partial x_i}(\mathbf{x}_0 + t\mathbf{h}) h_j
$$


Sustituyendo esto en la doble sumatoria:


$$
g''(t) = \sum_{i=1}^n \sum_{j=1}^n \frac{\partial^2 f}{\partial x_j \partial x_i}(\mathbf{x}_0 + t\mathbf{h}) h_i h_j
$$


Evaluando en $t = 0$:


$$
g''(0) = \sum_{i=1}^n \sum_{j=1}^n \frac{\partial^2 f}{\partial x_j \partial x_i}(\mathbf{x}_0) h_i h_j
$$


Utilizando el teorema de Clairaut (las derivadas parciales mixtas son iguales bajo continuidad), podemos escribir esta forma cuadrática en notación matricial empleando la matriz Hessiana $\mathbf{H}_f$:


$$
g''(0) = \mathbf{h}^T \mathbf{H}_f(\mathbf{x}_0) \mathbf{h}
$$


### Paso 4: Reconstruir la fórmula final
Sustituimos $g(0)$, $g'(0)$, y $g''(0)$ en la expansión de Taylor de $g(1)$:


$$
f(\mathbf{x}_0 + \mathbf{h}) = f(\mathbf{x}_0) + \nabla f(\mathbf{x}_0)^T \mathbf{h} + \frac{1}{2} \mathbf{h}^T \mathbf{H}_f(\mathbf{x}_0) \mathbf{h} + R_2(\mathbf{h})
$$


La demostración está completada. Q.E.D.

---

## 4. Tabla Comparativa de Semejanzas y Analogías

La estructura formal se mantiene idéntica entre dimensiones. La única diferencia radica en la naturaleza de los objetos matemáticos involucrados:

| Componente | Caso Unidimensional (1D) | Caso Multidimensional (N-D) | Relación / Analogía |
| :--- | :--- | :--- | :--- |
| **Punto Base** | Escalar: $x_0 \in \mathbb{R}$ | Vector: $\mathbf{x}_0 \in \mathbb{R}^n$ | Posición de referencia local. |
| **Perturbación** | Escalar: $h \in \mathbb{R}$ | Vector: $\mathbf{h} \in \mathbb{R}^n$ | Dirección y magnitud del paso. |
| **Nivel 0** | Valor: $f(x_0)$ | Valor: $f(\mathbf{x}_0)$ | Coincidencia exacta de altura. |
| **Nivel 1 (Operador)** | Derivada escalar: $f'(x_0)$ | Vector Gradiente: $\nabla f(\mathbf{x}_0)$ | Sensibilidad de primer orden. |
| **Nivel 1 (Término)** | Producto simple: $f'(x_0)h$ | Producto escalar: $\nabla f(\mathbf{x}_0)^T \mathbf{h}$ | Tasa de cambio linealizada $\times$ desplazamiento. |
| **Nivel 2 (Operador)** | Segunda derivada: $f''(x_0)$ | Matriz Hessiana: $\mathbf{H}_f(\mathbf{x}_0)$ | Curvatura de la función. |
| **Nivel 2 (Término)** | Cuadrático simple: $\frac{1}{2} f''(x_0)h^2$ | Forma cuadrática: $\frac{1}{2} \mathbf{h}^T \mathbf{H}_f(\mathbf{x}_0) \mathbf{h}$ | Ponderación cuadrática bidireccional del error de curvatura. |
| **Significado Geométrico** | Recta / Parábola tangente en $x_0$. | Hiperplano / Paraboloide tangente en $\mathbf{x}_0$. | Ajuste geométrico local óptimo. |

> [!TIP]
> **Regla nemotécnica:** Para pasar de 1D a N-D:
> * Reemplaza el producto de escalares por productos escalares o matriciales.
> * Las derivadas simples se convierten en vectores de derivadas (Gradiente) y matrices de derivadas segundas (Hessiana).

---

## 5. Ejemplo Práctico: Distancia Euclidiana (Paso 3)

Para ilustrar detalladamente el **Paso 3** (derivación por regla de la cadena multivariable en una dimensión ficticia $t$), consideremos la función de distancia Euclidiana de la solicitud:


$$
D_{i,j}(\mathbf{b}^*) = \| \mathbf{c}_{1,i} - \mathbf{c}_{2,j} - \mathbf{b}^* \|_2
$$


Definamos:
* El vector variable: $\mathbf{x} = \mathbf{b}^* \in \mathbb{R}^n$.
* El vector constante de referencia: $\mathbf{a} = \mathbf{c}_{1,i} - \mathbf{c}_{2,j} \in \mathbb{R}^n$.
* La función escalar a estudiar: $f(\mathbf{x}) = \| \mathbf{a} - \mathbf{x} \|_2 = \sqrt{(\mathbf{a} - \mathbf{x})^T(\mathbf{a} - \mathbf{x})}$.

Asumimos que $\mathbf{a} - \mathbf{x} \neq \mathbf{0}$ para garantizar la diferenciabilidad (la norma Euclidiana no es diferenciable en el origen).

### Paso A: Construir la función auxiliar $g(t)$
Dado un punto base $\mathbf{x}_0$ y una perturbación $\mathbf{h}$, definimos la parametrización unidimensional:


$$
g(t) = f(\mathbf{x}_0 + t\mathbf{h}) = \| \mathbf{a} - (\mathbf{x}_0 + t\mathbf{h}) \|_2
$$


Sea el vector diferencia constante en el punto base $\mathbf{v} = \mathbf{a} - \mathbf{x}_0$. Entonces:


$$
g(t) = \| \mathbf{v} - t\mathbf{h} \|_2 = \sqrt{(\mathbf{v} - t\mathbf{h})^T (\mathbf{v} - t\mathbf{h})}
$$


Para simplificar las derivadas, denotamos el radicando como $u(t)$ y lo expandimos aplicando las propiedades distributivas del producto matricial/vectorial:


$$
u(t) = (\mathbf{v} - t\mathbf{h})^T (\mathbf{v} - t\mathbf{h}) = \mathbf{v}^T\mathbf{v} - t\mathbf{v}^T\mathbf{h} - t\mathbf{h}^T\mathbf{v} + t^2\mathbf{h}^T\mathbf{h}
$$


Dado que el producto escalar de dos vectores es un escalar, se cumple que $\mathbf{h}^T\mathbf{v}$ es idéntico a su traspuesto: $\mathbf{h}^T\mathbf{v} = (\mathbf{h}^T\mathbf{v})^T = \mathbf{v}^T\mathbf{h}$ (propiedad conmutativa del producto escalar). Agrupando los dos términos centrales obtenemos la forma cuadrática simplificada en variable $t$:


$$
u(t) = \mathbf{v}^T\mathbf{v} - 2t\mathbf{v}^T\mathbf{h} + t^2\mathbf{h}^T\mathbf{h}
$$


De este modo, $g(t) = \sqrt{u(t)} = u(t)^{1/2}$.


---

### Paso B: Calcular la primera derivada $g'(t)$
Utilizando la regla de la cadena para funciones de una variable real $t$:


$$
g'(t) = \frac{d}{dt}\left(u(t)^{1/2}\right) = \frac{1}{2}u(t)^{-1/2} u'(t) = \frac{u'(t)}{2\sqrt{u(t)}}
$$


Derivamos $u(t)$ respecto a $t$:


$$
u'(t) = \frac{d}{dt} \left( \mathbf{v}^T\mathbf{v} - 2t\mathbf{v}^T\mathbf{h} + t^2\mathbf{h}^T\mathbf{h} \right) = -2\mathbf{v}^T\mathbf{h} + 2t\mathbf{h}^T\mathbf{h} = -2(\mathbf{v} - t\mathbf{h})^T\mathbf{h}
$$


Sustituyendo $u'(t)$ y $\sqrt{u(t)}$ en $g'(t)$:


$$
g'(t) = \frac{-2(\mathbf{v} - t\mathbf{h})^T\mathbf{h}}{2\|\mathbf{v} - t\mathbf{h}\|_2} = -\frac{(\mathbf{v} - t\mathbf{h})^T\mathbf{h}}{\|\mathbf{v} - t\mathbf{h}\|_2}
$$


#### Evaluar en $t=0$:
Sustituyendo $t=0$ y recordando que $\mathbf{v} = \mathbf{a} - \mathbf{x}_0$:


$$
g'(0) = -\frac{\mathbf{v}^T\mathbf{h}}{\|\mathbf{v}\|_2} = -\frac{(\mathbf{a} - \mathbf{x}_0)^T\mathbf{h}}{\|\mathbf{a} - \mathbf{x}_0\|_2}
$$


> **Conexión con el Gradiente:**
> Si calculamos el gradiente multidimensional de $f(\mathbf{x}) = \|\mathbf{a}-\mathbf{x}\|_2$, obtenemos $\nabla f(\mathbf{x}_0) = -\frac{\mathbf{a}-\mathbf{x}_0}{\|\mathbf{a}-\mathbf{x}_0\|_2}$.
> Al hacer el producto escalar $\nabla f(\mathbf{x}_0)^T \mathbf{h}$, obtenemos exactamente $g'(0)$. La correspondencia es perfecta.

---

### Paso C: Calcular la segunda derivada $g''(t)$
Derivamos ahora la expresión de $g'(t)$ respecto a $t$. Para facilitar el uso de la regla del producto, reescribamos $g'(t)$ de forma multiplicativa:


$$
g'(t) = - w(t) \cdot u(t)^{-1/2}
$$


Donde:
* El término del numerador es $w(t) = (\mathbf{v} - t\mathbf{h})^T\mathbf{h} = \mathbf{v}^T\mathbf{h} - t\mathbf{h}^T\mathbf{h}$.
* El término del denominador expresado con potencia negativa es $u(t)^{-1/2} = \frac{1}{\sqrt{u(t)}} = \frac{1}{\|\mathbf{v} - t\mathbf{h}\|_2}$ (recordemos que en el Paso A definimos el radicando $u(t) = \|\mathbf{v} - t\mathbf{h}\|_2^2$).

Sus respectivas derivadas respecto a $t$ son:
* $w'(t) = \frac{d}{dt} \left( \mathbf{v}^T\mathbf{h} - t\mathbf{h}^T\mathbf{h} \right) = -\mathbf{h}^T\mathbf{h} = -\|\mathbf{h}\|_2^2$
* $u'(t) = -2w(t)$ (calculado previamente en el Paso B)

Aplicando la regla del producto y la regla de la cadena:


$$
g''(t) = -\left[ w'(t) u(t)^{-1/2} + w(t) \left(-\frac{1}{2} u(t)^{-3/2} u'(t)\right) \right]
$$


Sustituimos $w'(t)$ y $u'(t)$:


$$
g''(t) = -\left[ -\|\mathbf{h}\|_2^2 u(t)^{-1/2} + w(t) \left(-\frac{1}{2} u(t)^{-3/2} (-2 w(t))\right) \right]
$$



$$
g''(t) = \frac{\|\mathbf{h}\|_2^2}{\sqrt{u(t)}} - \frac{w(t)^2}{u(t)^{3/2}} = \frac{\|\mathbf{h}\|_2^2}{\|\mathbf{v} - t\mathbf{h}\|_2} - \frac{\left( (\mathbf{v} - t\mathbf{h})^T\mathbf{h} \right)^2}{\|\mathbf{v} - t\mathbf{h}\|_2^3}
$$


#### Evaluar en $t=0$:
Sustituyamos $t=0$:


$$
g''(0) = \frac{\|\mathbf{h}\|_2^2}{\|\mathbf{v}\|_2} - \frac{(\mathbf{v}^T\mathbf{h})^2}{\|\mathbf{v}\|_2^3} = \frac{1}{\|\mathbf{v}\|_2} \left[ \mathbf{h}^T\mathbf{h} - \frac{\mathbf{h}^T(\mathbf{v}\mathbf{v}^T)\mathbf{h}}{\|\mathbf{v}\|_2^2} \right]
$$


Podemos factorizar vectorialmente el término multiplicando por $\mathbf{h}$ a ambos lados:


$$
g''(0) = \mathbf{h}^T \left[ \frac{1}{\|\mathbf{v}\|_2} \left( \mathbf{I} - \frac{\mathbf{v}\mathbf{v}^T}{\|\mathbf{v}\|_2^2} \right) \right] \mathbf{h}
$$


#### Conexión con la Matriz Hessiana:
Sustituyendo de vuelta $\mathbf{v} = \mathbf{a} - \mathbf{x}_0$, se obtiene exactamente la forma cuadrática $\mathbf{h}^T \mathbf{H}_f(\mathbf{x}_0) \mathbf{h}$, donde la Hessiana de la distancia Euclidiana es:


$$
\mathbf{H}_f(\mathbf{x}_0) = \frac{1}{\|\mathbf{a} - \mathbf{x}_0\|_2} \left( \mathbf{I} - \frac{(\mathbf{a} - \mathbf{x}_0)(\mathbf{a} - \mathbf{x}_0)^T}{\|\mathbf{a} - \mathbf{x}_0\|_2^2} \right)
$$


Esta matriz es simétrica y semi-definida positiva, representando la proyección sobre el plano ortogonal al vector de dirección, escalada inversamente por la distancia.

