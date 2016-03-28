package org.arthan.pytclon.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.google.common.base.Joiner;
import com.google.common.collect.Lists;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

/**
 * Created by ashamsiev on 01.03.2016
 */

@Entity
@Table(name = "users")
@SecondaryTable(name = "user_roles", pkJoinColumns = {@PrimaryKeyJoinColumn(name = "login") })
public class User implements Serializable {

    public User() {
    }

    public User(String login) {
        this.login = login;
    }

    @Id
    @SequenceGenerator(
            name = "users_id_seq",
            sequenceName = "users_id_seq",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_id_seq")
    @Column(name = "id", updatable = false)
    private String id;

    @Column(name = "login")
    private String login;

    @Column(name = "passwd")
    private String password;

    @Column(table = "user_roles", name = "role")
    private String roles;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<String> getRoles() {
        String[] roles = this.roles.split(",\\s*");
        return Lists.newArrayList(roles);
    }

    public void setRoles(List<String> roles) {
        this.roles = Joiner.on(", ").join(roles);
    }

    @Override
    public String toString() {
        return "User{" +
                "login='" + login + '\'' +
                ", password='" + password + '\'' +
                ", roles='" + roles + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        return login.equals(user.login);

    }

    @Override
    public int hashCode() {
        return login.hashCode();
    }
}
