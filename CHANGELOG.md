# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.25](https://github.com/pahud/cdk-keycloak/compare/v0.0.24...v0.0.25) (2021-02-01)

### [0.0.24](https://github.com/pahud/cdk-keycloak/compare/v0.0.23...v0.0.24) (2021-02-01)

### [0.0.23](https://github.com/pahud/cdk-keycloak/compare/v0.0.21...v0.0.23) (2021-02-01)


### Features

* expose database instanceType property ([38c1393](https://github.com/pahud/cdk-keycloak/commit/38c1393d13302911f63bbe389c2524f9cf8bad24))
* support aurora serverless ([2dae269](https://github.com/pahud/cdk-keycloak/commit/2dae269820847a8e158469eb17f1f76e0cc0d75e))


### Bug Fixes

* raise error when reion is unresolved ([#37](https://github.com/pahud/cdk-keycloak/issues/37)) ([b5ce2ca](https://github.com/pahud/cdk-keycloak/commit/b5ce2ca2d2900c541ce985cbd936856f84e9296f))

### [0.0.22](https://github.com/pahud/cdk-keycloak/compare/v0.0.21...v0.0.22) (2021-02-01)


### Features

* expose database instanceType property ([38c1393](https://github.com/pahud/cdk-keycloak/commit/38c1393d13302911f63bbe389c2524f9cf8bad24))
* support aurora serverless ([2dae269](https://github.com/pahud/cdk-keycloak/commit/2dae269820847a8e158469eb17f1f76e0cc0d75e))


### Bug Fixes

* raise error when reion is unresolved ([#37](https://github.com/pahud/cdk-keycloak/issues/37)) ([b5ce2ca](https://github.com/pahud/cdk-keycloak/commit/b5ce2ca2d2900c541ce985cbd936856f84e9296f))

### [0.0.21](https://github.com/pahud/cdk-keycloak/compare/v0.0.20...v0.0.21) (2021-02-01)


### Features

* **database:** Aurora serverless support ([#34](https://github.com/pahud/cdk-keycloak/issues/34)) ([3a3bddd](https://github.com/pahud/cdk-keycloak/commit/3a3bddd2ed9e0996aad33d61fc421c1da04a090d)), closes [#33](https://github.com/pahud/cdk-keycloak/issues/33)

### [0.0.20](https://github.com/pahud/cdk-keycloak/compare/v0.0.19...v0.0.20) (2021-02-01)

### [0.0.19](https://github.com/pahud/cdk-keycloak/compare/v0.0.18...v0.0.19) (2021-01-31)


### Features

* expose database instanceType property ([#31](https://github.com/pahud/cdk-keycloak/issues/31)) ([96526fa](https://github.com/pahud/cdk-keycloak/commit/96526fafe8cdf1c4d6c1792804fe8a5c69ffc618)), closes [#30](https://github.com/pahud/cdk-keycloak/issues/30)

### [0.0.18](https://github.com/pahud/cdk-keycloak/compare/v0.0.16...v0.0.18) (2021-01-30)


### Features

* set default nodeCount to 2 ([9576800](https://github.com/pahud/cdk-keycloak/commit/957680063051d3487e968eabe61cd37973a22bc9))
* support VpcSubnets ([f815f5e](https://github.com/pahud/cdk-keycloak/commit/f815f5ee66458ac6ff4f50db5208e0e8f8550da3))


### Bug Fixes

* ALB port mapping should go to 8443. Closes [#22](https://github.com/pahud/cdk-keycloak/issues/22) ([6393c61](https://github.com/pahud/cdk-keycloak/commit/6393c6177fbf6b85a3d6b7d70ddce1d11ebca26a))
* default nodeCount should be 2 ([#27](https://github.com/pahud/cdk-keycloak/issues/27)) ([7533d3f](https://github.com/pahud/cdk-keycloak/commit/7533d3f692b3854c85358a656072f94cfc2d2911)), closes [#26](https://github.com/pahud/cdk-keycloak/issues/26)
* missing KEYCLOAK_USER in the env var. Closes [#21](https://github.com/pahud/cdk-keycloak/issues/21) ([9e45c12](https://github.com/pahud/cdk-keycloak/commit/9e45c126eb97f9a2382367fce7ff249f782e57a3))

### [0.0.17](https://github.com/pahud/cdk-keycloak/compare/v0.0.16...v0.0.17) (2021-01-29)


### Features

* set default nodeCount to 2 ([9576800](https://github.com/pahud/cdk-keycloak/commit/957680063051d3487e968eabe61cd37973a22bc9))
* support VpcSubnets ([f815f5e](https://github.com/pahud/cdk-keycloak/commit/f815f5ee66458ac6ff4f50db5208e0e8f8550da3))


### Bug Fixes

* ALB port mapping should go to 8443. Closes [#22](https://github.com/pahud/cdk-keycloak/issues/22) ([6393c61](https://github.com/pahud/cdk-keycloak/commit/6393c6177fbf6b85a3d6b7d70ddce1d11ebca26a))
* default nodeCount should be 2 ([#27](https://github.com/pahud/cdk-keycloak/issues/27)) ([7533d3f](https://github.com/pahud/cdk-keycloak/commit/7533d3f692b3854c85358a656072f94cfc2d2911)), closes [#26](https://github.com/pahud/cdk-keycloak/issues/26)
* missing KEYCLOAK_USER in the env var. Closes [#21](https://github.com/pahud/cdk-keycloak/issues/21) ([9e45c12](https://github.com/pahud/cdk-keycloak/commit/9e45c126eb97f9a2382367fce7ff249f782e57a3))

### [0.0.16](https://github.com/pahud/cdk-keycloak/compare/v0.0.15...v0.0.16) (2021-01-29)


### Bug Fixes

* remove port 8080 ([#25](https://github.com/pahud/cdk-keycloak/issues/25)) ([cd13e4f](https://github.com/pahud/cdk-keycloak/commit/cd13e4f339eac4032d7f7f2394ec949fbc39aa61)), closes [/github.com/pahud/cdk-keycloak/pull/24#pullrequestreview-578994559](https://github.com/pahud//github.com/pahud/cdk-keycloak/pull/24/issues/pullrequestreview-578994559)

### [0.0.15](https://github.com/pahud/cdk-keycloak/compare/v0.0.14...v0.0.15) (2021-01-29)


### Bug Fixes

* KEYCLOAK_USER and Https port mapping ([#24](https://github.com/pahud/cdk-keycloak/issues/24)) ([cc190d9](https://github.com/pahud/cdk-keycloak/commit/cc190d940ee3921a2ab18e3667b6c87f16546c93)), closes [#21](https://github.com/pahud/cdk-keycloak/issues/21) [#22](https://github.com/pahud/cdk-keycloak/issues/22)

### [0.0.14](https://github.com/pahud/cdk-keycloak/compare/v0.0.13...v0.0.14) (2021-01-29)

### [0.0.13](https://github.com/pahud/cdk-keycloak/compare/v0.0.12...v0.0.13) (2021-01-28)


### Features

* support VpcSubnets ([#19](https://github.com/pahud/cdk-keycloak/issues/19)) ([eec51b2](https://github.com/pahud/cdk-keycloak/commit/eec51b26ff65ae2acff5c7e7fb247f2b9b0d7234)), closes [#18](https://github.com/pahud/cdk-keycloak/issues/18)

### [0.0.12](https://github.com/pahud/cdk-keycloak/compare/v0.0.11...v0.0.12) (2021-01-28)

### [0.0.11](https://github.com/pahud/cdk-keycloak/compare/v0.0.10...v0.0.11) (2021-01-28)


### Features

* make circuit breaker optional ([cdf31d8](https://github.com/pahud/cdk-keycloak/commit/cdf31d806dfaf43139f3f60ec92d77f4596f4ed6))
* optional node number ([43fa306](https://github.com/pahud/cdk-keycloak/commit/43fa306f0fd92ebb9849b4497f9426a9bc5583b0))
* support slow start and sticky session ([8571453](https://github.com/pahud/cdk-keycloak/commit/8571453c203a38aa8f4eb65d2306b40063b7b496))

### [0.0.10](https://github.com/pahud/cdk-keycloak/compare/v0.0.9...v0.0.10) (2021-01-28)

### [0.0.9](https://github.com/pahud/cdk-keycloak/compare/v0.0.7...v0.0.9) (2021-01-27)


### Features

* bootstrap container support ([#9](https://github.com/pahud/cdk-keycloak/issues/9)) ([b5cf701](https://github.com/pahud/cdk-keycloak/commit/b5cf70180dfb2f3d3dd2840f125af03ba320e67b)), closes [#8](https://github.com/pahud/cdk-keycloak/issues/8)

### [0.0.8](https://github.com/pahud/cdk-keycloak/compare/v0.0.7...v0.0.8) (2021-01-27)


### Features

* bootstrap container support ([#9](https://github.com/pahud/cdk-keycloak/issues/9)) ([b5cf701](https://github.com/pahud/cdk-keycloak/commit/b5cf70180dfb2f3d3dd2840f125af03ba320e67b)), closes [#8](https://github.com/pahud/cdk-keycloak/issues/8)

### [0.0.7](https://github.com/pahud/cdk-keycloak/compare/v0.0.6...v0.0.7) (2021-01-27)

### [0.0.6](https://github.com/pahud/cdk-keycloak/compare/v0.0.5...v0.0.6) (2021-01-26)

### [0.0.5](https://github.com/pahud/cdk-keycloak/compare/v0.0.4...v0.0.5) (2021-01-26)


### Features

* support ALB. Closes [#1](https://github.com/pahud/cdk-keycloak/issues/1) ([4f9c5d1](https://github.com/pahud/cdk-keycloak/commit/4f9c5d120bf2bf353b6a4aa72481c31701b86fb3))

### [0.0.4](https://github.com/pahud/cdk-keycloak/compare/v0.0.3...v0.0.4) (2021-01-25)

### [0.0.3](https://github.com/pahud/cdk-keycloak/compare/v0.0.2...v0.0.3) (2021-01-25)


### Features

* support AwsLogs. Closes: [#2](https://github.com/pahud/cdk-keycloak/issues/2) ([45d5327](https://github.com/pahud/cdk-keycloak/commit/45d53273f929070decdef11e2c5f00ff76d007b5))
* support ecs task role. Closes [#3](https://github.com/pahud/cdk-keycloak/issues/3) ([cd43c2e](https://github.com/pahud/cdk-keycloak/commit/cd43c2ea9c167f4cf1c4f0b6bafce51153d934c3))

### [0.0.2](https://github.com/pahud/cdk-keycloak/compare/v0.0.1...v0.0.2) (2021-01-25)

### 0.0.1 (2021-01-25)
