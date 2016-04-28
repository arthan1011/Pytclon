package org.arthan.pytclon.web.rest;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Joiner;
import org.arthan.pytclon.domain.control.UserDao;
import org.arthan.pytclon.domain.entity.User;
import org.arthan.pytclon.service.UserService;

import javax.annotation.PostConstruct;
import javax.enterprise.context.SessionScoped;
import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.io.Serializable;
import java.net.URI;
import java.nio.file.attribute.UserPrincipal;
import java.security.Principal;
import java.text.MessageFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

/**
 * Created by ashamsiev on 01.03.2016
 */

@Path("/users")
@SessionScoped
public class UserResource implements Serializable {

    private UserService userService;

    private List<User> users;

    @Inject
    @PostConstruct
    public void init(
           UserService userService
    ) {
        this.userService = userService;
        loadUsers();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllUsers() {
        List<User> allUsers = userService.findAll();

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
    public Response addUser(User user) {
        if (!users.contains(user)) {
            userService.create(user);
            users.add(user);
            return Response.created(URI.create(user.getLogin())).build();
        } else {
            return Response
                    .status(Response.Status.CONFLICT)
                    .entity("User with name " + user.getLogin() + " already exists!")
                    .build();
        }
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    @Path("/{login}")
    public Response getUserInfo(@PathParam("login") String userLogin) {
        Optional<User> foundUser = findUser(userLogin);

        Response response;
        if (foundUser.isPresent()) {
            User user = foundUser.get();
            user.setPassword(null);
            response = Response.ok(foundUser).build();
        } else {
            response =  Response
                    .noContent()
                    .entity("User with name " + userLogin + " not found")
                    .build();
        }
        return response;

    }

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    @Path("/get/current")
    public Response getCurrentUser(@Context SecurityContext context) {
        String name = context.getUserPrincipal().getName();
        return Response.ok().entity(name).build();
    }

    @VisibleForTesting
    Optional<User> findUser(String id) {
        Optional<User> foundUser = users.stream()
                .filter(user -> user.getLogin().equals(id))
                .findFirst();
        return foundUser;
    }

    private void loadUsers() {
        users = userService.findAll();
    }

    @VisibleForTesting
    void setUsers(List<User> users) {
        this.users = users;
    }
}
