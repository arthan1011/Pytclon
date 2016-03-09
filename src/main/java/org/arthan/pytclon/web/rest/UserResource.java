package org.arthan.pytclon.web.rest;

import org.arthan.pytclon.domain.control.UserDao;
import org.arthan.pytclon.domain.entity.User;

import javax.inject.Inject;
import javax.print.attribute.standard.Media;
import javax.ws.rs.*;
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

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addUser(User user) {
        System.out.println(user);
    }
}
