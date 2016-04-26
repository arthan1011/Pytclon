package org.arthan.pytclon.service;

import mockit.Expectations;
import mockit.Injectable;
import mockit.Mocked;
import org.arthan.pytclon.domain.control.PlayerDao;
import org.arthan.pytclon.domain.control.UserDao;
import org.arthan.pytclon.domain.entity.Player;
import org.arthan.pytclon.domain.entity.User;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by Arthur Shamsiev on 12.04.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */
public class UserServiceTest {

    @Test
    public void shouldCreateDefaultPlayerForNewUser(
            @Mocked final UserDao userDao,
            @Mocked final PlayerDao playerDao,
            @Injectable final User user,
            @Mocked final Player player) throws Exception {

        Integer TEST_USER_ID = 101;

        new Expectations() {{
            user.getId(); result = TEST_USER_ID;
            player.setName("default");
            player.setUserId(TEST_USER_ID);
        }};

        UserService userService = new UserService(userDao, playerDao);
        userService.create(user);
    }
}