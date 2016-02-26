package org.arthan.pytclon.rest;

import org.arthan.pytclon.service.ProtectedInfoService;

import javax.ejb.EJBAccessException;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;

/**
 * Created by Arthur Shamsiev on 20.02.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@Path("/player")
public class PlayerResource {

    @Inject
    ProtectedInfoService infoService;
    @Context
    SecurityContext securityContext;

    @Path("/test")
    @GET
    public String test() {
        String result;
        try {
            result = "Player " + infoService.getInfo();
        } catch (EJBAccessException e) {
            result = "Access Denied!";
        }
        return result;
    }
}
