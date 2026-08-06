---
title: Special Orthogonal Group
date: August 6, 2026
read: 20 min read
excerpt: Robotic Configuration Space I
---

## Introduction
Recently, my research is mainly about study non-Euclidean space in robotics. There are two sperate spaces in robotic manipulators: Configuration space $\mathcal{C}$ and Workspace $\mathcal{W}$. Fortunately, they are all groups which can be studied from mathematical prespectives. There are many important groups such as $SO(3)$ and $SE(3)$ in robotic motion planning. That introduced me diving into this group theory the whole year. So I decided to write some personal understanding and thoughts about this subject.

## Matrix Group
In rigid robotics, what we really studying is a set of coordinate transformations. We can provide a coordinate to anything we are interested and studying how one coordinate can be transformed to another coordinate. Formally, let's consider the set of transformations as a group in addition to a topological space. 

:::definition General Linear Group
The set of all nonsigular $n \times n$ real-valued matrices is called the general linear group, $GL(n)$ with respect to matrix multiplication.
:::

Each matrix $A \in GL(n)$, there is an inverse matrix $A^{-1} \in GL(n)$, $AA^{-1} = I$.

### Orthogonal Group
There are many interesting groups can be formed from one group $G_1$ by removing some elements to obtain a **subgroup**, $G_2$. One of important subgroup of $GL(n)$ for robotics is orthogonal group $O(N)$.

:::definition Orthogonal Group
The set of matrices that $A \in GL(n) \quad AA^T = I$. And $\text{det} A = |1|$.
:::

There are many interesting and non-trivial things about this simple group $O(n)$. First of all is about the dimension of this group. For $O(n)$, there are $n^2$ algebraic equations that has to satisfy (think about $AA^T = I$). There are $\binom{n}{2}$ ways to take the inner product of pairs of columns. There are $n$ equations that require the magnitude is 1 (think about there are $n$ entries in the diagnal). Therefore, there are $n(n+1)/2$ independent equations in which each drops one dimention. The resulting dimention is $n^2 - n(n+1)/2 = n(n-1)/2 = \binom{n}{2}$.

Secondly, $O(2)$ in particular is two disjoint circles which are never touched, i.e. $\mathbb{S}^1 \cup \mathbb{S}^1$ where $\cup$ means the union of disjoint elements. I demonstrate this by going through an example.

:::example 2-D Orthogonal Group $O(2)$.
Consider $n=2$, the set of $2 \times 2$ matrices is:
$$
\left\{
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}

\mid 

a,b,c,d \in \mathbb{R}
\right\}
$$
which is homomorphic to $\mathbb{R}^4$.  $GL(2)$ is formed from the set of all $2 \times 2$ nonsigular matrices with real-valued entries. The set of singular matrices form a 3-D manifold with boundary in $\mathbb{R}^4$ but all other elements of $\mathbb{R}^4$ in $GL(2)$ that implies that $GL(2)$ is 4-D manifold.

Now, we add the constraint $AA^T = I$, that is
$$
\begin{pmatrix}
a & b \\
c & d 
\end{pmatrix}

\begin{pmatrix}
a & c \\
b & d 
\end{pmatrix}

= 

\begin{pmatrix}
1 & 0 \\
0 & 1 
\end{pmatrix}
$$
This multiplcation is equivalent to a set of algebraic equations,
$$
\begin{align}
    a^2 + b^2 = 1 \\
    ac + bd = 0 \\
    ca + db = 0 \\
    c^2 + d^2 = 1
\end{align}
$$
we note that equation (3) is redundant with equation (2). Therefore, there are three independent equations (1), (2) and (4). The resulting dimension is $ 4 - 3 = 1 = \binom{2}{2}$, which matches the theory we talked about before. 

Even more interesting is the geometric structure of $O(2)$. What is that in a $\mathbb{R}^4$ space? We start from the constraint
$$
a^2 + b^2 = 1
$$
which is a circle $\mathbb{S}^1$. With contraints of equation (2) and (4), the values of $c$ and $d$ are $(c=a, d=-b)$ or $(c = -a, d = b)$. It appears two circles now and they are never gonna connect with each other. Therefore, the mainfold is $\mathbb{S}^1 \cup \mathbb{S}^1$, i.e. two never connected circles. I tried to visualise this non-trivial manifold in 3-D space. So I drooped last coordinate $d$ and repackage the first three as
$$
x = a, \quad y = \frac{b-c}{2}, \quad z=\frac{b+c}{2}  
$$
where $d = \cos{\theta}$ in circle A and $d = -\cos{\theta}$ in circle B. Below is an visualisation of this manifold in $\mathbb{R}^3$ space. We can think about $d$ as the timeline. That means when two points on the sphere overlap, the time is different. When the time is same, two points are not overlapped, which means they are never overlapped. 

Final step, we add one more constraint that: $\text{det} A = ad - bc = 1$ to obtain $SO(2)$, that is the set of all 2-D rotation matrices (We throw away one circle with this constraint). Therefore, $SO(2)$ is homomorphic to $\mathbb{S}^1$ which can be parameterised by polar coordinates,
$$
R =
\begin{pmatrix}
 \cos(\theta) & -\sin(\theta) \\
 \sin(\theta) & \cos(\theta)
\end{pmatrix}
$$
:::

Since I have introduced $SO(2)$ by accident in the example. A definiton of special orthogonal group $SO(n)$ is given by

:::definition special orthogonal group
A set of matrix $A \in GL(n) \quad AA^T = I \quad \text{det}A = 1$.
:::
we can easily obtain the inequality such that
$$
SO(N) \leq O(N) \leq GL(N)
$$
where $\leq$ means "subgroup".

## Implication
When I first went into the robotic field, I didn't realise that how close robotic kinematics to geometry and algebraic geometry. In last century, many mathematicians studied kinematics and many kinematists are mathematicians. Back to this topic, rotation is very important in robots like many robotic components just can rotate (revolute manipulators). Understanding basic group theory is essential to learning robotic theory (However, many people argue that robotics doesn't have its own theory).

## Reference
LaValle, S.M., 2006. Planning algorithms (Vol. 1). Cambridge, UK: Cambridge university press. (This blog is almost my learning notes of Chapter 4 in this book)

:::embed o2_two_circles.html
Drag to rotate. The two components of $O(2)$ never touch.
:::