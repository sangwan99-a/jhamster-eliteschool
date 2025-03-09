package com.elite.school.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.springframework.data.domain.Persistable;

/**
 * A Authority.
 */
@Entity
@Table(name = "jhi_authority")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@JsonIgnoreProperties(value = { "new", "id" })
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Authority implements Serializable, Persistable<String> {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Size(max = 50)
    @Id
    @Column(name = "name", length = 50, nullable = false)
    private String name;

    @org.springframework.data.annotation.Transient
    @Transient
    private boolean isPersisted;

    public Authority() {}

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Authority name(String name) {
        this.setName(name);
        return this;
    }

    @PostLoad
    @PostPersist
    public void updateEntityState() {
        this.setIsPersisted();
    }

    @Override
    public String getId() {
        return this.name;
    }

    @org.springframework.data.annotation.Transient
    @Transient
    @Override
    public boolean isNew() {
        return !this.isPersisted;
    }

    public Authority setIsPersisted() {
        this.isPersisted = true;
        return this;
    }

    public @NotNull @Size(max = 50) String getName() {
        return this.name;
    }

    public boolean isPersisted() {
        return this.isPersisted;
    }

    public void setName(@NotNull @Size(max = 50) String name) {
        this.name = name;
    }

    public void setPersisted(boolean isPersisted) {
        this.isPersisted = isPersisted;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof Authority)) return false;
        final Authority other = (Authority) o;
        if (!other.canEqual((Object) this)) return false;
        final Object this$name = this.getName();
        final Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        if (this.isPersisted() != other.isPersisted()) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof Authority;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        result = result * PRIME + (this.isPersisted() ? 79 : 97);
        return result;
    }

    public String toString() {
        return "Authority(name=" + this.getName() + ", isPersisted=" + this.isPersisted() + ")";
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

}
