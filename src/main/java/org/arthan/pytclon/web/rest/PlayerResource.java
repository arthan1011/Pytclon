package org.arthan.pytclon.web.rest;

import org.arthan.pytclon.domain.entity.Player;
import org.arthan.pytclon.service.PlayerService;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.util.List;

import static org.arthan.pytclon.web.util.WebUtils.createRange;

/**
 * Created by Arthur Shamsiev on 20.02.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@Path("/player")
public class PlayerResource {

    @Inject
    PlayerService playerService;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPlayersForCurrentUser(
            @Context SecurityContext securityContext
    ) {
        String currentUserName = securityContext.getUserPrincipal().getName();
        List<Player> userPlayers = playerService.findAllByUserName(currentUserName);

        return Response.ok(userPlayers).header("Content-Range", createRange(userPlayers)).build();
    }
}
