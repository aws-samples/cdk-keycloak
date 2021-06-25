#!/bin/bash -e

WS=$1

# Install Git
microdnf install -y git

# Install Maven
cd /opt/jboss 
curl https://apache.uib.no/maven/maven-3/3.5.4/binaries/apache-maven-3.5.4-bin.tar.gz | tar xz
mv apache-maven-3.5.4 /opt/jboss/maven
export M2_HOME=/opt/jboss/maven

# Clone repository
export GIT_REPO="https://github.com/keycloak/keycloak-benchmark.git"
export GIT_BRANCH="main"
git clone --depth 1 $GIT_REPO -b $GIT_BRANCH $WS

# Build
cd $WS
sed -i "s/<keycloak.version>.*<\/keycloak.version>/<keycloak.version>$KEYCLOAK_VERSION<\/keycloak.version>/" pom.xml
$M2_HOME/bin/mvn clean install