package org.arthan.pytclon.domain.entity;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlRootElement;
import java.io.Serializable;

/**
 * Created by Arthur Shamsiev on 12.04.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@Entity
@Table(name = "players")
public class Player implements Serializable {

    @Id
    @SequenceGenerator(
            name = "players_id_seq",
            sequenceName = "players_id_seq",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "players_id_seq")
    @Column(name = "id", updatable = false, columnDefinition = "serial")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "user_id")
    private Integer userId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
