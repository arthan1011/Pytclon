package org.arthan.pytclon.domain.entity;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by arthan on 21.05.2016. Project pytclon
 */
@Entity
@Table(name="player_image")
public class PlayerImage implements Serializable, DBEntity {

    public PlayerImage() {
    }

    public PlayerImage(byte[] content) {
        this.content = content;
    }

    @Id
    @SequenceGenerator(
            name = "player_image_id_seq",
            sequenceName = "player_image_id_seq",
            allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "player_image_id_seq")
    @Column(name = "id")
    private Integer id;

    @Column(name = "content")
    private byte[] content;

    public Integer getId() {
        return id;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }
}
