package org.arthan.pytclon.service;

import javax.annotation.security.DeclareRoles;
import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;

/**
 * Created by ashamsiev on 26.02.2016
 */

@Stateless
public class ProtectedInfoService {

    @RolesAllowed("admin")
    public String getInfo() {
        return "Information";
    }
}
