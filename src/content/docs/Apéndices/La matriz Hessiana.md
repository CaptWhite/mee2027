Para obtener la matriz Hessiana, necesitamos calcular las segundas derivadas parciales de la función. A continuación, te presento el desarrollo para la versión clásica de dos variables y la extensión a tres variables.

---

## 1. Matriz Hessiana de la Función de Rosenbrock (2 variables)

La función estándar es $f(x, y) = (a - x)^2 + b(y - x^2)^2$.
Si tomamos los valores usuales $a=1$ y $b=100$, la función es 
$$
f(x, y) = (1 - x)^2 + 100(y - x^2)^2
$$

### Gradiente (Primeras derivadas):

* $\frac{\partial f}{\partial x} = -2(1 - x) - 400 (xy - x^3)$
* $\frac{\partial f}{\partial y} = 200(y - x^2)$

$$
G(x, y) = \begin{bmatrix}
\frac{\partial f}{\partial x} \\
\frac{\partial f}{\partial y} 
\end{bmatrix} =
\begin{bmatrix}
-2(1 - x) - 400 (xy - x^3) \\
200(y - x^2)
\end{bmatrix}
$$

### Minimos (gradiente = 0):
$$
G(x, y) = \begin{bmatrix} -2(1 - x) - 400 (xy - x^3) \\ 200(y - x^2) \end{bmatrix} = 
\begin{bmatrix} 0 \\ 0 \end{bmatrix}
$$

* $200(y - x^2) = 0 \Rightarrow  y = x^2 $
* $-2(1 - x) - 400 (xy - x^3) = -2(1 - x) - 400 (x^3 - x^3) = -2(1 - x) = 0  \Rightarrow x=1,  y=1 $

### Hessiana (Segundas derivadas):

Calculando las derivadas de segundo orden, obtenemos la matriz:
* $\frac{\partial^2 f}{\partial x^2} = 2 + 1200x^2 - 400y$
* $\frac{\partial^2 f}{\partial x \partial y} = \frac{\partial^2 f}{\partial y \partial x} = -400x$
* $\frac{\partial^2 f}{\partial y^2} = 200$

$$
H(x, y) = \begin{bmatrix}
\frac{\partial^2 f}{\partial x^2} & \frac{\partial^2 f}{\partial x \partial y} \\
\frac{\partial^2 f}{\partial y \partial x} & \frac{\partial^2 f}{\partial y^2}
\end{bmatrix} =
\begin{bmatrix}
1200x^2 - 400y + 2 & -400x \\
-400x & 200
\end{bmatrix}
$$

> **Dato clave:** En el mínimo global $(1, 1)$, la Hessiana se convierte en $\begin{bmatrix} 802 & -400 \\ -400 & 200 \end{bmatrix}$. Su determinante es positivo, lo que confirma que es un mínimo.

---

## 2. Matriz Hessiana de la Función de Rosenbrock (3 variables)

La fórmula general para $N$ dimensiones es:
$$
f(\mathbf{x}) = \sum_{i=1}^{N-1} [100(x_{i+1} - x_i^2)^2 + (1 - x_i)^2]
$$

---

Para tres variables ($x, y, z$), la función se define como la suma de dos estructuras de Rosenbrock encadenadas:


$$
f(x, y, z) = [100(y - x^2)^2 + (1 - x)^2] + [100(z - y^2)^2 + (1 - y)^2]
$$

En este caso, la matriz es de **$3 \times 3$**. Debido al encadenamiento, cada variable central ($y$) se ve afectada por la anterior y la siguiente.

### Componentes de la matriz $H(x, y, z)$:

$$
H = \begin{bmatrix}
\frac{\partial^2 f}{\partial x^2} & \frac{\partial^2 f}{\partial x \partial y} & \frac{\partial^2 f}{\partial x \partial z} \\
\frac{\partial^2 f}{\partial y \partial x} & \frac{\partial^2 f}{\partial y^2} & \frac{\partial^2 f}{\partial y \partial z} \\
\frac{\partial^2 f}{\partial z \partial x} & \frac{\partial^2 f}{\partial z \partial y} & \frac{\partial^2 f}{\partial z^2}
\end{bmatrix}
$$

Los valores específicos son:

* $H_{1,1} = 1200x^2 - 400y + 2$
* $H_{1,2} = H_{2,1} = -400x$
* $H_{2,2} = 200 + 1200y^2 - 400z + 2$ (Nota cómo aquí se suman componentes de ambos términos)
* $H_{2,3} = H_{3,2} = -400y$
* $H_{3,3} = 200$
* $H_{1,3} = H_{3,1} = 0$ (Porque $x$ y $z$ no están directamente relacionadas en la fórmula)

### Matriz Resultante:

$$
H(x, y, z) = \begin{bmatrix}
1200x^2 - 400y + 2 & -400x & 0 \\
-400x & 1200y^2 - 400z + 202 & -400y \\
0 & -400y & 200
\end{bmatrix}
$$

---

### ## ¿Qué nos dice esto?

Como puedes ver, la matriz es **tridiagonal** (solo tiene valores en la diagonal principal y las dos contiguas). Esto refleja el "encadenamiento" que mencionamos antes: cada variable solo "siente" la curvatura de sus vecinas inmediatas, lo que crea ese largo y estrecho pasillo multidimensional tan difícil de optimizar.