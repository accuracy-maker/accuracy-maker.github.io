---
title: Your Post Title Here
date: August 6, 2026
read: 5 min read
excerpt: One or two sentences shown under the title on the blog index page.
---

Write the post in plain Markdown. A blank line separates paragraphs — no HTML
tags anywhere, and no need to escape anything.

## A section heading

### A sub-heading

**bold**, *italic*, `inline code`, and a [link](https://example.com).

- a bullet
- another bullet

1. a numbered item
2. another one

Inline math like $\nabla_\theta J(\theta)$ works, and so does display math:

$$ J(\theta) = \mathbb{E}_{x \sim p_\theta}\big[ f(x) \big]. $$

Code blocks get syntax highlighting — put the language after the backticks
(`python`, `cpp`, `bash` are loaded; add more in posts/post.html):

```python
import torch

x = torch.randn(4, requires_grad=True)
(x ** 2).sum().backward()
```

> A blockquote, for a rule of thumb or an aside.

Theorem-style blocks are written with `:::`. The word after the colons picks
the style, anything after it on the same line becomes the block's name, and the
body is ordinary Markdown (math, lists, code all work inside):

:::definition Orthogonal group
The set of $A \in GL(n)$ with $AA^T = I$.
:::

:::theorem
Every $A \in O(n)$ satisfies $\det A = \pm 1$.
:::

:::proof
Take determinants of $AA^T = I$ to get $\det(A)^2 = 1$.
:::

:::example A planar rotation
$$ R(\theta) = \begin{pmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{pmatrix} $$
:::

To drop a standalone interactive page (a demo, an animated figure) into the
post, use `:::embed` with a path relative to this file. The frame sizes itself
to its content; add `height=520` to pin it instead. The caption line is
optional:

:::embed o2_two_circles.html
Drag to rotate. Optional caption, written in Markdown.
:::

Available callouts: `definition`, `theorem`, `lemma`, `proposition`, `corollary`,
`claim`, `example`, `exercise`, `remark`, `note`, `proof`. Each kind is
numbered automatically in order of appearance (`remark`, `note` and `proof`
are not numbered).

Images live next to the post or in ../thumbs/:

![alt text](../thumbs/example.png)

A horizontal rule:

---

And a table:

| Method        | Bias      | Variance |
| ------------- | --------- | -------- |
| REINFORCE     | unbiased  | high     |
| Reparam       | unbiased  | low      |
