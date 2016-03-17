package integration.gui;

import integration.config.Deployments;
import integration.gui.pages.LoginPage;
import integration.gui.pages.MainPage;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.page.InitialPage;
import org.jboss.arquillian.graphene.page.Page;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.persistence.ApplyScriptAfter;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebDriver;

/**
 * Created by ashamsiev on 17.03.2016
 */
@RunWith(Arquillian.class)
public class UserTestIT {

    @Deployment(testable = false)
    public static WebArchive createDeployment() {
        return Deployments.createWarDeploymentTestJPA();
    }

    @Drone
    WebDriver browser;
    @Page
    LoginPage loginPage;

    @Test
//    @ApplyScriptAfter("scripts/delete_all_users.sql")
    public void should_register_new_user_and_signin(@InitialPage MainPage mainPage) throws Exception {
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
}
