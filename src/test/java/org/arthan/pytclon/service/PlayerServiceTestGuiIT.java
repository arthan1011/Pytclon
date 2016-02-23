package org.arthan.pytclon.service;

import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.Graphene;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ZipImporter;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.io.File;
import java.net.URL;
import java.util.logging.Logger;

/**
 * Created by Arthur Shamsiev on 21.02.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@RunWith(Arquillian.class)
public class PlayerServiceTestGuiIT {

    private static Logger logger = Logger.getLogger(PlayerServiceTestGuiIT.class.getName());

    @Deployment(testable = false)
    public static WebArchive createDeployment() {
        WebArchive war = ShrinkWrap.create(ZipImporter.class, "pytclon_test.war")
                .importFrom(new File("target/pytclon.war"))
                .as(WebArchive.class);

        logger.info("Artifact: " + war.toString(true));
        return war;

    }

    @Drone
    WebDriver browser;
    @ArquillianResource
    URL deploymentUrl;

    @FindBy(id = "username")
    private WebElement loginInput;
    @FindBy(id = "password")
    private WebElement passwordInput;
    @FindBy(id = "loginSubmit")
    private WebElement loginSubmit;

    @Test
    public void should_access_main_page() throws Exception {
        browser.get(deploymentUrl.toExternalForm());

        String pageTitle = browser.getTitle();
        Assert.assertEquals("Should be on login page", "Login Page", pageTitle);

        loginInput.sendKeys("python");
        Assert.assertTrue(loginInput.getAttribute("value").contains("python"));
        passwordInput.sendKeys("letmein");
        Graphene.guardHttp(loginSubmit).click();

        pageTitle = browser.getTitle();
        Assert.assertEquals("Should be on main page", "Main Page", pageTitle);
    }

    @Test
    public void should_get_error_page_on_failed_login() throws Exception {
        browser.get(deploymentUrl.toExternalForm());

        String pageTitle = browser.getTitle();
        Assert.assertEquals("Should be on login page", "Login Page", pageTitle);

        loginInput.sendKeys("python");
        Assert.assertTrue(loginInput.getAttribute("value").contains("python"));
        passwordInput.sendKeys("wrong_password");
        Graphene.guardHttp(loginSubmit).click();

        pageTitle = browser.getTitle();
        Assert.assertEquals("Should be on main page", "Error Page", pageTitle);
    }
}