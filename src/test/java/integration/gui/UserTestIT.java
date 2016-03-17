package integration.gui;

import integration.config.Deployments;
import integration.gui.pages.LoginPage;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.page.InitialPage;
import org.jboss.arquillian.graphene.page.Page;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.junit.InSequence;
import org.jboss.arquillian.persistence.CleanupUsingScript;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebDriver;

/**
 * Created by ashamsiev on 17.03.2016
 */
@RunWith(Arquillian.class)
@CleanupUsingScript("scripts/delete_all_users.sql")
public class UserTestIT {

    @Deployment(testable = true)
    public static WebArchive createDeployment() {
        return Deployments.createWarDeploymentTestJPAForE2E();
    }

    @Page
    LoginPage loginPage;
    @Drone
    WebDriver browser;

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
    }

    @Test
    @InSequence(2)
    public void cleanupDatabaseWorkaround() throws Exception {
        // Empty on purpose
    }
}
