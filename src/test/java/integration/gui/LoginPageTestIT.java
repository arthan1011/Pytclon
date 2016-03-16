package integration.gui;

import integration.gui.pages.LoginPage;
import integration.gui.pages.MainPage;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.page.InitialPage;
import org.jboss.arquillian.graphene.page.Page;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ZipImporter;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.net.URL;
import java.util.logging.Logger;

/**
 * Created by Arthur Shamsiev on 21.02.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@RunWith(Arquillian.class)
public class LoginPageTestIT {

    private static Logger logger = Logger.getLogger(LoginPageTestIT.class.getName());

    @Deployment(testable = false)
    public static WebArchive createDeployment() {
        return ShrinkWrap.create(ZipImporter.class, "pytclon_test.war")
                .importFrom(new File("target/pytclon.war"))
                .as(WebArchive.class);

    }

    @Drone
    WebDriver browser;
    @ArquillianResource
    URL deploymentUrl;

    @Page
    LoginPage loginPage;

    @Test
    public void should_access_main_page(@InitialPage MainPage mainPage) throws Exception {
        loginPage.login("python", "letmein");

        Assert.assertEquals("Should be on main page", "Main Page", browser.getTitle());
    }

    @Test
    public void should_get_error_page_on_failed_login(@InitialPage MainPage mainPage) throws Exception {
        loginPage.login("python", "wrong_password");

        Assert.assertEquals("Should be on error page", "Error Page", browser.getTitle());
    }
}