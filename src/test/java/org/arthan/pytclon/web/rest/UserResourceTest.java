package org.arthan.pytclon.web.rest;

import com.google.common.collect.Lists;
import org.arthan.pytclon.domain.entity.User;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Created by ashamsiev on 18.03.2016
 */
public class UserResourceTest {

    @Test
    public void should_find_user_in_already_loaded_users() throws Exception {
        final UserResource userResource = new UserResource();

        final String REQUESTED_USER_ID = "requestedUser";
        userResource.setUsers(Lists.newArrayList(
                new User("someUser"),
                new User("anyUser"),
                new User(REQUESTED_USER_ID)
        ));

        assertEquals(
                "Should find requested user",
                REQUESTED_USER_ID,
                userResource.findUser(REQUESTED_USER_ID).get().getLogin());
    }
}