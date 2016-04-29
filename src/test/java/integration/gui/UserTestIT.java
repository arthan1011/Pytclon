package integration.gui;

import integration.config.Deployments;
import integration.gui.pages.LoginPage;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.page.InitialPage;
import org.jboss.arquillian.graphene.page.Location;
import org.jboss.arquillian.graphene.page.Page;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.junit.InSequence;
import org.jboss.arquillian.persistence.CleanupUsingScript;
import org.jboss.arquillian.persistence.ShouldMatchDataSet;
import org.jboss.arquillian.test.api.ArquillianResource;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebDriver;

import java.net.URL;

/**
 * Created by ashamsiev on 17.03.2016
 */
@RunWith(Arquillian.class)
public class UserTestIT {

    @Deployment(testable = true)
    public static WebArchive createDeployment() {
        return Deployments.createWarDeploymentTestJPAForE2E();
    }

    @Page
    LoginPage loginPage;
    @Drone
    WebDriver browser;

    // Should register new user and be able to sign-in
    @Test
    @InSequence(1)
    @RunAsClient
    public void should_register_new_user_and_signin(
            @InitialPage LoginPage page
    ) throws Exception {
        final String TEST_USR = "test_usr";
        final String TEST_PASS = "test_pass";

        loginPage.enterSignUpMode();

        loginPage.setPassword(TEST_PASS);
        loginPage.setRepeatPassword(TEST_PASS);
        loginPage.setLogin(TEST_USR);

        loginPage.signUp();

        // sign-in as new user
        loginPage.login(TEST_USR, TEST_PASS);
        Assert.assertEquals("Should be on main page", "Main Page", browser.getTitle());

        loginPage.logout();
    }

    @Test
    @InSequence(2)
    @CleanupUsingScript("scripts/delete_all_users.sql")
    public void cleanupDatabaseWorkaround() throws Exception {
        // Empty on purpose
    }

    // Should register new user and create default player for him
    @Test
    @InSequence(3)
    @RunAsClient
    public void should_register_new_user_with_default_player(
            @InitialPage LoginPage page
    ) throws Exception {
        System.out.println("Current page is: " + browser.getCurrentUrl());

        final String TEST_USR = "test_user";
        final String TEST_PASS = "test_pass";

        loginPage.enterSignUpMode();

        loginPage.setPassword(TEST_PASS);
        loginPage.setRepeatPassword(TEST_PASS);
        loginPage.setLogin(TEST_USR);

        loginPage.signUp();
    }

    @Test
    @InSequence(4)
    @ShouldMatchDataSet(value = "datasets/user_with_default_player_1.json")
    @CleanupUsingScript("scripts/delete_all_users.sql")
    public void check_new_user_with_default_player_created() throws Exception {
        // Empty on purpose.
    }
}
