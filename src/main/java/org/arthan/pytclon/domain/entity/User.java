package org.arthan.pytclon.domain.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

/**
 * Created by ashamsiev on 01.03.2016
 */

@Entity
@Table(name = "users")
public class User implements Serializable {

    @Id
    @Column(name = "login")
    private String login;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    @Override
    public String toString() {
        return "User{" +
                "login='" + login + '\'' +
                '}';
    }
}
