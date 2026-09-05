package com.promptxub.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 30, unique = true, nullable = false)
    private ERole name;

    public Role() {
    }

    public Role(Long id, ERole name) {
        this.id = id;
        this.name = name;
    }

    public static Builder builder() {
        return new Builder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ERole getName() {
        return name;
    }

    public void setName(ERole name) {
        this.name = name;
    }

    public static class Builder {
        private Long id;
        private ERole name;

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder name(ERole name) {
            this.name = name;
            return this;
        }

        public Role build() {
            return new Role(id, name);
        }
    }
}
