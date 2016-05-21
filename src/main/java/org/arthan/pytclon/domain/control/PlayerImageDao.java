package org.arthan.pytclon.domain.control;

import org.arthan.pytclon.domain.entity.PlayerImage;

import javax.ejb.Stateless;
import java.io.Serializable;

/**
 * Created by arthan on 21.05.2016. Project pytclon
 */

@Stateless
public class PlayerImageDao extends AbstractDao<PlayerImage> implements Serializable {

    public PlayerImageDao() {
        super(PlayerImage.class);
    }
}
