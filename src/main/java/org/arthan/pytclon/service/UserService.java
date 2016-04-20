package org.arthan.pytclon.service;

import org.arthan.pytclon.domain.control.UserDao;
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

    @Inject
    private UserDao userDao;
    @Inject
    private PlayerDao playerDao;


    public void create(User user) {
        userDao.save(user);

        Player defaultPlayer = new Player();
        defaultPlayer.setName("default");
        playerDao.save(defaultPlayer);
    }
}
