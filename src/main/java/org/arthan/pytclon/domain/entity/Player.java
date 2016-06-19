package org.arthan.pytclon.domain.entity;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by Arthur Shamsiev on 12.04.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@Entity
@Table(name = "players")
public class Player implements Serializable, MergeEntity, DBEntity {

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

    @Column(name = "player_image_id")
    private Integer playerImageId;

    public Player(String name, int imageId) {
        this.name = name;
        this.playerImageId = imageId;
    }

    public Player() {
        // empty on purpose
    }

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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getPlayerImageId() {
        return playerImageId;
    }

    public void setPlayerImageId(Integer playerImageId) {
        this.playerImageId = playerImageId;
    }

    @Override
    public void merge(MergeEntity entity) {
        Player newPlayerData = (Player) entity;
        if (newPlayerData.getName() != null) {
            setName(newPlayerData.getName());
        }
        if (newPlayerData.getUserId() != null) {
            setUserId(newPlayerData.getUserId());
        }
        if (newPlayerData.getPlayerImageId() != null) {
            setPlayerImageId(newPlayerData.getPlayerImageId());
        }
    }
}
