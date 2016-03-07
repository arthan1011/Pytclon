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

    @Id
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
}
