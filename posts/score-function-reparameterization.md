---
title: The Score Function and the Reparameterization Trick
date: July 17, 2026
read: 6 min read
excerpt: Two ways to differentiate through an expectation over a parameter-dependent distribution — REINFORCE vs. the reparameterization trick — and when to prefer each.
---

Many problems in reinforcement learning and generative modeling reduce to
optimizing an expectation of the form

$$ J(\theta) = \mathbb{E}_{x \sim p_\theta(x)}\big[ f(x) \big], $$

where the distribution $p_\theta$ itself depends on the parameters $\theta$ we
are optimizing. The difficulty is that the gradient $\nabla_\theta J$ cannot be
pushed inside the expectation directly, because the measure changes with $\theta$.

## The score-function estimator

Using the identity $\nabla_\theta p_\theta(x) = p_\theta(x)\,\nabla_\theta \log p_\theta(x)$,
we obtain the *REINFORCE* estimator:

$$ \nabla_\theta J(\theta)
   = \mathbb{E}_{x \sim p_\theta}\!\left[ f(x)\, \nabla_\theta \log p_\theta(x) \right]. $$

This is unbiased but often high variance, since it does not use any information
about how $f$ changes with $x$.

## The reparameterization trick

When $x$ can be written as a deterministic transform of a parameter-free noise
variable $\epsilon \sim q(\epsilon)$, say $x = g_\theta(\epsilon)$, the gradient
passes through $f$ directly:

$$ \nabla_\theta J(\theta)
   = \mathbb{E}_{\epsilon \sim q}\!\left[ \nabla_\theta f\big(g_\theta(\epsilon)\big) \right]. $$

For a Gaussian $x \sim \mathcal{N}(\mu_\theta, \sigma_\theta^2)$ this is simply
$x = \mu_\theta + \sigma_\theta\,\epsilon$ with $\epsilon \sim \mathcal{N}(0,1)$.
A minimal implementation:

```python
import torch

def reparam_sample(mu, log_sigma):
    # x = mu + sigma * eps, eps ~ N(0, 1)
    eps = torch.randn_like(mu)
    return mu + torch.exp(log_sigma) * eps

mu = torch.zeros(4, requires_grad=True)
log_sigma = torch.zeros(4, requires_grad=True)

x = reparam_sample(mu, log_sigma)
loss = (x ** 2).sum()      # some differentiable f(x)
loss.backward()            # gradients flow through mu and log_sigma
```

> Rule of thumb: prefer the reparameterization estimator when $f$ is differentiable
> and $x$ is continuous; fall back to the score function for discrete variables.

In a later post I'll connect this to the variational lower bound and show why the
reparameterized ELBO gradient tends to converge faster in practice.
