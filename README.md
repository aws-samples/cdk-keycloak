[![NPM version](https://badge.fury.io/js/cdk-keycloak.svg)](https://badge.fury.io/js/cdk-keycloak)
[![PyPI version](https://badge.fury.io/py/cdk-keycloak.svg)](https://badge.fury.io/py/cdk-keycloak)
![Release](https://github.com/pahud/cdk-keycloak/workflows/Release/badge.svg?branch=main)

# `cdk-keycloak`

CDK construct library that allows you to create KeyCloak service on AWS in TypeScript or Python

# Sample

```ts
import { KeyCloak } from 'cdk-keycloak';

const app = new cdk.App();

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account: process.env.CDK_DEFAULT_ACCOUNT,
};

const stack = new cdk.Stack(app, 'keycloak-demo', { env });
new KeyCloak(stack, 'KeyCloak', {
  certificateArn: 'arn:aws:acm:us-east-1:123456789012:certificate/293cf875-ca98-4c2e-a797-e1cf6df2553c'
});
```

DB_ADDR='keycloak-demo-keycloakdatabase85520bad-97d390hnsmhc.cluster-cmpnlckegndo.ap-northeast-1.rds.amazonaws.com'
KEYCLOAK_PASSWORD='{hv%N`v^Yx1vM4sSaI)~_6dN.b|FZe_X'
KEYCLOAK_USER='keycloak'
DB_PASSWORD='aFhLGZY1C7BzH7F3kYwaeXOwQZxR,I'
IMAGE='jboss/keycloak:10.0.0'

docker rm -f keycloak
docker run -p 8080:8080 --name keycloak \
-e KEYCLOAK_USER=${KEYCLOAK_USER} \
-e KEYCLOAK_PASSWORD=${KEYCLOAK_PASSWORD} \
-e DB_VENDOR=mysql \
-e DB_USER=admin \
-e DB_PASSWORD=${DB_PASSWORD} \
-e DB_ADDR=${DB_ADDR} \
-e DB_PORT=3306 \
-e DB_DATABASE=keycloak \
-e JDBC_PARAMS="useSSL=false" $IMAGE


docker run -p 8080:8080 --name keycloak \
-e KEYCLOAK_USER=${KEYCLOAK_USER} \
-e KEYCLOAK_PASSWORD=${KEYCLOAK_PASSWORD} \
-e DB_VENDOR=mysql \
-e DB_USER=admin \
-e DB_PASSWORD=${DB_PASSWORD} \
-e DB_ADDR=${DB_ADDR} \
-e DB_PORT=3306 \
-e DB_DATABASE=keycloak $IMAGE




docker run -p 8080:8080 --name keycloak \
-e MYSQL_PASSWORD=password \
-e MYSQL_ROOT_PASSWORD=root_password \
-e MYSQL_DATABASE=keycloak \
-e MYSQL_USER=keycloak \
jboss/keycloak


docker run -p 8080:8080 --name keycloak \
-e DB_VENDOR=mysql \
-e MYSQL_ADDR=127.0.0.1 \
-e MYSQL_PASSWORD=password \
-e MYSQL_ROOT_PASSWORD=root_password \
-e MYSQL_DATABASE=keycloak \
-e MYSQL_USER=keycloak \
-e JDBC_PARAMS="useSSL=false" \
jboss/keycloak


docker run -p 8080:8080 --name keycloak \
-e MYSQL_ADDR=${DB_ADDR} \
-e MYSQL_PASSWORD=${DB_PASSWORD} \
-e MYSQL_ROOT_PASSWORD=${DB_PASSWORD} \
-e MYSQL_DATABASE=keycloak \
-e MYSQL_USER=admin \
jboss/keycloak


# start mysql server
docker run --name mysql \
-p 3306:3306 \
-e MYSQL_DATABASE=keycloak \
-e MYSQL_USER=keycloak \
-e MYSQL_PASSWORD=password \
-e MYSQL_ROOT_PASSWORD=root_password mysql





DB_ADDR='keycloak-demo-keycloakdatabase85520bad-97d390hnsmhc.cluster-cmpnlckegndo.ap-northeast-1.rds.amazonaws.com'
KEYCLOAK_PASSWORD='{hv%N`v^Yx1vM4sSaI)~_6dN.b|FZe_X'
KEYCLOAK_USER='keycloak'
DB_PASSWORD='aFhLGZY1C7BzH7F3kYwaeXOwQZxR,I'
IMAGE='jboss/keycloak:10.0.0'

docker run -p 0.0.0.0:80:8080 --name keycloak \
-e KEYCLOAK_USER=keycloak \
-e KEYCLOAK_PASSWORD=keycloak \
-e DB_VENDOR=mysql \
-e DB_USER=admin \
-e DB_PASSWORD=${DB_PASSWORD} \
-e DB_ADDR=${DB_ADDR} \
-e DB_PORT=3306 \
-e DB_DATABASE=keycloak \
-e JDBC_PARAMS="useSSL=false" $IMAGE


048912060910.dkr.ecr.cn-northwest-1.amazonaws.com.cn/dockerhub/jboss/keycloak:10.0.0



# ZHY KeyCloak v1.0


DB_ADDR='keycloakonaws.clvbzt7zy5yd.rds.cn-northwest-1.amazonaws.com.cn'
KEYCLOAK_PASSWORD='QI,k7B^esHyoOM-b0UfNM52PUMJxji'
KEYCLOAK_USER='keycloak'
DB_PASSWORD='adminadmin'
IMAGE='jboss/keycloak:10.0.0'

docker run -p 0.0.0.0:80:8080 --name keycloak \
-e KEYCLOAK_USER=keycloak \
-e KEYCLOAK_PASSWORD=keycloak \
-e DB_VENDOR=mysql \
-e DB_USER=admin \
-e DB_PASSWORD=adminadmin \
-e DB_ADDR='keycloakonaws.clvbzt7zy5yd.rds.cn-northwest-1.amazonaws.com.cn' \
-e DB_PORT=3306 \
-e JDBC_PARAMS="useSSL=false" \
jboss/keycloak:12.0.2

# JP


DB_ADDR='kk1bx64rhjdrsx5.cmpnlckegndo.ap-northeast-1.rds.amazonaws.com'
KEYCLOAK_PASSWORD='sjWm5y1l0sAm'
KEYCLOAK_USER='keycloak'
DB_PASSWORD='Y.ecSq1T.gip69.=-qKEU2yrlyehOb'
IMAGE='jboss/keycloak:12.0.2'


docker rm -f keycloak; docker run -p 0.0.0.0:80:8080 --name keycloak \
-e KEYCLOAK_USER=keycloak \
-e KEYCLOAK_PASSWORD=keycloak \
-e DB_VENDOR=mysql \
-e DB_USER=admin \
-e DB_PASSWORD=$DB_PASSWORD \
-e DB_ADDR=$DB_ADDR \
-e DB_PORT=3306 \
-e DB_DATABASE=keycloak \
-e JDBC_PARAMS="useSSL=false" \
jboss/keycloak:12.0.2

