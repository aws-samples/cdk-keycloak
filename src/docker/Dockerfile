FROM jboss/keycloak:12.0.2 as builder

USER root

ADD ./build-benchmark.sh /opt/jboss/tools

RUN /opt/jboss/tools/build-benchmark.sh /opt/jboss/keycloak-benchmark

FROM jboss/keycloak:12.0.2

COPY --from=builder /opt/jboss/keycloak-benchmark/dataset/target/keycloak-benchmark-dataset-*.jar ${JBOSS_HOME}/standalone/deployments/
