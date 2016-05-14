package org.arthan.pytclon.service;

import org.arthan.pytclon.domain.control.PlayerDao;
import org.arthan.pytclon.domain.control.UserDao;
import org.arthan.pytclon.domain.entity.Player;

import javax.ejb.Stateless;
import javax.inject.Inject;
import java.io.Serializable;
import java.util.List;

/**
 * Created by Arthur Shamsiev on 21.02.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@Stateless
public class PlayerService implements Serializable {

    private PlayerDao playerDao;
    private UserDao userDao;

    @Inject
    public PlayerService(
            PlayerDao playerDao,
            UserDao userDao
    ) {
        this.playerDao = playerDao;
        this.userDao = userDao;
    }

    public PlayerService() {

    }

    public List<Player> findAllByUserName(String userName) {
        Integer userId = userDao.findByLogin(userName).getId();
        return playerDao.findAllByUserId(userId);
    }
}
