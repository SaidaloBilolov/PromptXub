# ===================================================================
# STAGE 1: Build the Maven application with Java 21
# ===================================================================
FROM maven:3.9.8-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Cache dependencies first
COPY promptxub-backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source code and build executable jar
COPY promptxub-backend/src ./src
RUN mvn clean package -DskipTests -B

# ===================================================================
# STAGE 2: Lightweight Production Runtime Container (Java 21 JRE)
# ===================================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create a non-root system group and user for security
RUN addgroup -S promptxub && adduser -S promptxub -G promptxub

# Copy the built jar from the builder stage
COPY --from=builder /build/target/promptxub-backend-*.jar app.jar

# Ownership transfer
RUN chown -R promptxub:promptxub /app

USER promptxub

# Optimized JVM memory flags for Render.com free tier (512MB RAM limit)
ENV JAVA_OPTS="-XX:MaxRAMPercentage=75.0 -XX:InitialRAMPercentage=40.0 -XX:+UseG1GC -XX:+ExitOnOutOfMemoryError"
ENV PORT=8080

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-8080}/api/v1/health || exit 1

# Run Spring Boot application binding to Render's dynamic PORT
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
