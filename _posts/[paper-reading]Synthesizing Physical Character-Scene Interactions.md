# [paper-reading]Synthesizing Physical Character-Scene Interactions

## Problem to Slove

Preview works about physical character animation focus on the variaty and scalability of the motion. However, an advanced simulated charater should have the ability to interact with the environment and surroundings. Therefore, the authors proposed a method (system) that uses **adversarial imitaion learning and reinforcement learning** to train the model that perform scene interactions taks in a natural and life-like manner.

## Method

![image-20230820103238907](/Users/gaohaitao/Library/Application Support/typora-user-images/image-20230820103238907.png)

There are two components in the method: a **policy** and a **discriminator**. 

The discriminator’s role is to differentiate between the behaviors produced by the simulated character and the behaviors depicted in a motion dataset. The role of the policy 𝜋 is to control the movements of the character in order to maximize the expected accumulative reward 𝐽 (𝜋).

The agent's reward $r_t$ at each time step $t$ is :

$r_t=w^Gr^G(s_t,g_t.s_{t+1}+w^Sr^S(s_t,s_{t+1}))$

The task reward 𝑟𝐺 encourages the character to satisfy high-level objectives, such as sitting on a chair or moving an object to the desired location. The style reward 𝑟𝑆 encourages the character to imitate behaviors from a motion dataset as it performs the desired task. s𝑡 ∈ S is the state at time 𝑡. a𝑡 ∈ A are the actions sampled from the policy 𝜋 at time step 𝑡. g𝑡 ∈ G denotes the task-specific goal features at time 𝑡. 𝑤𝐺 and 𝑤𝑆 are weights.

The policy is trained to maximize the expected discount return $J(\pi)$

$J(\pi)=E_{p(\tau|\pi)}[\sum_{t=0}^{T-1}\gamma^t r_t]$

## Evaluation

- Success rate

![image-20230820104038525](/Users/gaohaitao/Library/Application Support/typora-user-images/image-20230820104038525.png)

- comparisons

The author compare our physics-based model to NSM [Starke et al. 2019] and SAMP [Hassan et al. 2021], which are both kinematic models.

![image-20230820104127219](/Users/gaohaitao/Library/Application Support/typora-user-images/image-20230820104127219.png)

## Limitation & Discussion

Limitaions:

1. Multi-task RL remains a difficult and open problem
2. add virtual eyes to the character
3. Zero or few shots learning