package org.arthan.pytclon.web.rest;

import org.arthan.pytclon.domain.control.UserDao;
import org.arthan.pytclon.domain.entity.User;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.List;

/**
 * Created by ashamsiev on 01.03.2016
 */

@Path("/users")
public class UserResource {

    @Inject
    UserDao userDao;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<User> getAllUsers() {
        return userDao.findAll();
    }
}
