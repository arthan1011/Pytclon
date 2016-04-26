package org.arthan.pytclon.domain.control;

import org.arthan.pytclon.domain.entity.Player;

import javax.ejb.Stateless;

/**
 * Created by ashamsiev on 26.04.2016
 */

@Stateless
public class PlayerDao extends AbstractDao<Player>{

    public PlayerDao() {
        super(Player.class);
    }
}
