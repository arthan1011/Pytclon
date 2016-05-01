package integration.gui;

import integration.config.Deployments;
import integration.gui.pages.LoginPage;
import integration.gui.pages.MainPage;
import integration.gui.pages.WebObject;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.container.test.api.RunAsClient;
import org.jboss.arquillian.drone.api.annotation.Drone;
import org.jboss.arquillian.graphene.page.InitialPage;
import org.jboss.arquillian.graphene.page.Page;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.junit.InSequence;
import org.jboss.arquillian.persistence.CleanupUsingScript;
import org.jboss.arquillian.persistence.ShouldMatchDataSet;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.openqa.selenium.WebDriver;

import java.util.List;

/**
 * Created by ashamsiev on 17.03.2016
 */
@RunWith(Arquillian.class)
public class UserTestIT {

    private static final String TEST_USR = "test_user";
    private static final String TEST_PASS = "test_pass";

    @Deployment(testable = true)
    public static WebArchive createDeployment() {
        return Deployments.createWarDeploymentTestJPAForE2E();
    }

    @Page
    private LoginPage loginPage;
    @Page
    private MainPage mainPage;
    @Drone
    private WebDriver browser;

    private void registerNewUser() {
        loginPage.enterSignUpMode();

        loginPage.setPassword(TEST_PASS);
        loginPage.setRepeatPassword(TEST_PASS);
        loginPage.setLogin(TEST_USR);

        loginPage.signUp();
    }

    // Should register new user and be able to sign-in
    @Test
    @InSequence(1)
    @RunAsClient
    public void should_register_new_user_and_signin(
            @InitialPage LoginPage page
    ) throws Exception {

        registerNewUser();

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

        registerNewUser();
    }

    @Test
    @InSequence(4)
    @ShouldMatchDataSet(value = "datasets/user_with_default_player_1.json")
    @CleanupUsingScript("scripts/delete_all_users.sql")
    public void check_new_user_with_default_player_created() throws Exception {
        // Empty on purpose
    }

    // Should register new user, sing-in and find default player in user settings

    @Test
    @InSequence(5)
    @RunAsClient
    public void should_register_new_user_and_find_default_player_in_user_settings(
            @InitialPage LoginPage page
    ) throws Exception {

        registerNewUser();

        loginPage.login(TEST_USR, TEST_PASS);

        mainPage.openUserSettings();
        mainPage.getUserSettingsDialog().selectPlayersTab();
        List<WebObject> players = mainPage.getUserSettingsDialog().getPlayersList();

        Assert.assertEquals("One default player should exist for new user", players.size(), 1);
        Assert.assertEquals("default player name should be \"default\"", players.get(0).prop("name"), "default");
    }

    @Test
    @InSequence(6)
    @CleanupUsingScript("scripts/delete_all_users.sql")
    public void cleanupDatabaseWorkaround_default_player_test() throws Exception {
        // Empty on purpose
    }
}
