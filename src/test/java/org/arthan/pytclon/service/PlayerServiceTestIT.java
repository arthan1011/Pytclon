package org.arthan.pytclon.service;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.shrinkwrap.api.Assignable;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.asset.EmptyAsset;
import org.jboss.shrinkwrap.api.importer.ZipImporter;
import org.jboss.shrinkwrap.api.spec.JavaArchive;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.ejb.EJB;
import java.io.File;
import java.util.logging.Logger;

import static org.junit.Assert.assertEquals;

/**
 * Created by Arthur Shamsiev on 21.02.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@RunWith(Arquillian.class)
public class PlayerServiceTestIT {

    private static Logger logger = Logger.getLogger(PlayerServiceTestIT.class.getName());

    @Deployment
    public static JavaArchive createDeployment() {
        JavaArchive jar = ShrinkWrap.create(JavaArchive.class)
                .addClass(PlayerService.class)
                .addAsManifestResource(EmptyAsset.INSTANCE, "beans.xml");

        logger.info("Artifact: " + jar.toString(true));
        return jar;

    }

    @EJB
    PlayerService playerService;

    @Test
    public void should_create_greeting() throws Exception {
        System.out.println(playerService != null);
        assertEquals("Hello, Earthlings.", playerService.createGreeting("Earthlings"));
        playerService.greet(System.out, "Earthlings");
    }
}