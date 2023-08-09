# [paper reading]--SuperTrack: Motion Tracking for Physically Simulated Characters using Supervised Learning

## Abstract

In this paper, the authors propose a novel method which uses **supervised learning** and optimizes a policy directly via **back-propagation**. To achieve this, they use **world model** to simulate the environment's transition function, which makes the method **effective** and not sensitive to the the rate of experience gathering, dataset size, and distribution.

## Introduction

PPO is not suitable for the area like video games, since it is notorious sample inefficient. They propose two main network in this work - one to predict the dynamics of the world, and another which attempts to produce the optimal actions which minimize the tracking losses.

The contributions made by this work are:

- the reward or loss function is simple and differentiable
- the transition function of these two individual character states is partially separable
- transition function is the result of a deterministic physics simulation
- directly via back-propagation

The core networks are:

- the world model: to predict the next simulated character state given the previous simulated character state and the provided PD targets
- the policy: to produce PD offsets given the simulated and kinematic character states, with the objective that the resulting simulated character state, when passed through the world model, should match the target kinematic character state.

## Important Concepts

1. **Model-based Learning**: it utilizes an underlying model of the physical system to achieve motion control. 
2. **Learned World Models**: models are trained to approximate the transition function of the environment.
3. **Model-free Learning**: As with the training of world models, it is often easier to make measurements of a complicated system’s dynamics than it is to design an accurate, flexible model which can be exploited efficiently to build a policy that can achieve the desired behaviors. Model-free reinforcement learning exploits this fact and uses measurements of the response of various states of the environment to various actions to optimize a policy without any knowledge of the underlying dynamics.

## Methodology

### Train the world model

<img src="/Users/gaohaitao/Library/Application Support/typora-user-images/image-20230809163123115.png" alt="image-20230809163123115" style="zoom:60%;" />

<img src="/Users/gaohaitao/Library/Application Support/typora-user-images/image-20230809163819134.png" alt="image-20230809163819134" style="zoom:50%;" />

There are a number of pre-processing steps are required to prepare the network inputs:

- Convert the rigid body coordinates into **the character space** by multiplying by the inverse of the root rigid body transform.
- Convert quatenions into the two-axis rotation matrix format commonly used in neural network based methods.
- Append to the representation the heights of all the rigid bodies from the ground as well as the up direction (in our case +Z), local to the root rigid body. This gives the network the direction of gravity and the distance of each limb to the floor, which can be used to infer contact information



### Train the policy model

<img src="/Users/gaohaitao/Library/Application Support/typora-user-images/image-20230809163950029.png" alt="image-20230809163950029" style="zoom:50%;" />

<img src="/Users/gaohaitao/Library/Application Support/typora-user-images/image-20230809164036863.png" alt="image-20230809164036863" style="zoom:50%;" />

## Result Analysis

### Survival Rate

To measure the success of the method, they compute the **Suvival Rate** which is defined as the percentage of the episodes that last longer thatn a given time without the character reaching a failed state.

<img src="/Users/gaohaitao/Library/Application Support/typora-user-images/image-20230809164759550.png" alt="image-20230809164759550" style="zoom:50%;" />

the figure shows that the ST-Survival Rate is higher than the PPO method.

### Rough Terrain

They extend their method to tracking animations navigating Rough Terrain.

<img src="/Users/gaohaitao/Library/Application Support/typora-user-images/image-20230809165235912.png" alt="image-20230809165235912" style="zoom:50%;" />

However, there are not further figures and explainations to analyze it.

## Evaluation

There are plenty of comparison in the paper

### PPO

<img src="/Users/gaohaitao/Library/Application Support/typora-user-images/image-20230809170228401.png" alt="image-20230809170228401" style="zoom:50%;" />

**Note:** There is not the complete figures about comparison to PPO

### Generalization & Transfer Learning

<img src="/Users/gaohaitao/Library/Application Support/typora-user-images/image-20230809170555412.png" alt="image-20230809170555412" style="zoom:50%;" />

## Limitations

- sensitive to the learning rate too high or low, or having window sizes(which can be seen in the training process. It really hard to train!!)
- ONLY in motion tracking
- not suitable for long-term prediction & new skills

## To work deeper

I am a beginner of RL and focued on the psysical character aimation field just two weeks ago. I think that the world model (model-based RL) is a good method to motion track. While there are many disadvantages such as hard to find the new skills and sensitive to some arguments of the network, it is still worthwile to work deeper like using the LLM or some large model to replace the world model to strength the ability.

