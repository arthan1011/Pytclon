package org.arthan.pytclon.web.rest;

import com.google.common.base.Joiner;
import org.arthan.pytclon.domain.control.UserDao;
import org.arthan.pytclon.domain.entity.User;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Created by ashamsiev on 01.03.2016
 */

@Path("/users")
public class UserResource {

    @Inject
    UserDao userDao;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers() {
        List<User> allUsers = userDao.findAll();

        AtomicInteger count = new AtomicInteger(1);
        List<Map<String, Object>> resultList = allUsers.stream()
                .map(user -> {
                    HashMap<String, Object> userMap = new HashMap<>();
                    userMap.put("id", count.getAndIncrement());
                    userMap.put("login", user.getLogin());
                    userMap.put("roles", Joiner.on(", ").join(user.getRoles()));
                    return userMap;
                }).collect(Collectors.toList());
        return Response.ok(resultList).header("Content-Range", createRange(resultList)).build();
    }

    private String createRange(List<Map<String, Object>> list) {
        return MessageFormat.format("items 0-{0}/{1}", list.size() - 1, list.size());
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public void addUser(User user) {
        userDao.save(user);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{login}")
    public Response getUserInfo(@PathParam("login") String userLogin) {
        User user = userDao.byId(userLogin);

        Response response;
        if (user != null) {
            user.setPassword(null);
            response = Response.ok(user).build();
        } else {
            response =  Response.noContent().build();
        }
        return response;

    }
}
