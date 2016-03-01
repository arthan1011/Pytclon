package org.arthan.pytclon.web.rest;

import org.arthan.pytclon.domain.control.UserDao;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

/**
 * Created by ashamsiev on 01.03.2016
 */

@Path("/users")
public class UserResource {

    @Inject
    UserDao userDao;

    @GET
    public String getAllUsers() {
        return userDao.findAll().toString();
    }
}
