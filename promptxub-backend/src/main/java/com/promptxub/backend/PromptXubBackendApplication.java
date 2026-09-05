package com.promptxub.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class PromptXubBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(PromptXubBackendApplication.class, args);
    }
}
