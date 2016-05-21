package org.arthan.pytclon.web.rest;

import com.google.common.io.ByteStreams;
import org.arthan.pytclon.domain.entity.Player;
import org.arthan.pytclon.service.PlayerService;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import static org.arthan.pytclon.web.util.WebUtils.createRange;

/**
 * Created by Arthur Shamsiev on 20.02.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@Path("/player")
public class PlayerResource {

    private static final String UPLOADED_FILES_KEY = "uploadedfiles[]";

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

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Path("/images")
    public Response uploadFile(MultipartFormDataInput input) {
        Map<String, List<InputPart>> dataMap = input.getFormDataMap();
        List<InputPart> inputParts = dataMap.get(UPLOADED_FILES_KEY);

        for (InputPart inputPart : inputParts) {
            try {
                InputStream stream = inputPart.getBody(InputStream.class, null);
                byte[] bytes = ByteStreams.toByteArray(stream);
                System.out.println("done");
            } catch (IOException e) {
                return Response.status(Response.Status.BAD_REQUEST).entity("Invalid file!").build();
            }
        }
        return Response.ok("{\"response\": \"success\"}").build();
    }
}
