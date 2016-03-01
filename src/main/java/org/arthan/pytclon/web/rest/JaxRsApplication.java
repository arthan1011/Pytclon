package org.arthan.pytclon.web.rest;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by Arthur Shamsiev on 20.02.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@ApplicationPath("/rest")
public class JaxRsApplication extends Application {

    @Override
    public Map<String, Object> getProperties() {
        Map<String, Object> props = new HashMap<>();
        props.put("resteasy.scan", true);
        return props;
    }
}
