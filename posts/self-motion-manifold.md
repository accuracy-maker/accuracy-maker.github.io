---
title: Self-motion Manifold
date: August 6, 2026
read: 20 min read
excerpt: Robotic Configuration Space II
---

## Introduction
I knew "self-motion manifold" when I accidently read a old paper "On the inverse kinematics of redundant manipulators: characterization of the self-motion manifolds" by Prof. Joel Burdick. This paper changed the way how I understand robotics. Before that, living in the AI era, robotics is equivalent to Vision Language Action models (VLA), imitation learning, reinforcement learning and so on. This paper opened a new window for me like "oh, there is another perspective to understand robotics: geometry, configuration space". Right now, I knew that there is the third angle: robotics is a polynomial system. But anyway, let's go into the self-motion manifold world.

## Self-motion Manifold
Self-motion manifold (SMM) appears in redundent manipulators. Redundent manipulators means the dimension of configuration space $\mathcal{C} \subset \mathbb{R}^m$ is higher than workspace $\mathcal{W} \subset \mathbb{R}^n$, which leads to redundant dimension $r = m - n > 0$.  

