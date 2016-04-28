package org.arthan.pytclon.service;

import org.arthan.pytclon.domain.control.PlayerDao;
import org.arthan.pytclon.domain.control.UserDao;
import org.arthan.pytclon.domain.entity.Player;
import org.arthan.pytclon.domain.entity.User;

import javax.ejb.Stateless;
import javax.inject.Inject;

/**
 * Created by Arthur Shamsiev on 12.04.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@Stateless
public class UserService {

    private UserDao userDao;
    private PlayerDao playerDao;

    public UserService() {
    }

    @Inject
    public UserService(
            UserDao userDao,
            PlayerDao playerDao) {
        this.userDao = userDao;
        this.playerDao = playerDao;
    }

    public void create(User user) {
        User createdUser = userDao.save(user);
        Integer newUserId = createdUser.getId();

        Player defaultPlayer = new Player();
        defaultPlayer.setName("default");
        defaultPlayer.setUserId(newUserId);
        playerDao.save(defaultPlayer);
    }
}
