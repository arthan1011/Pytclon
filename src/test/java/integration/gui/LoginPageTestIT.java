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

    private static final String SOME_LOGIN = "some_login";
    private static final String SOME_PASSWORD = "some_pass";
    private static final String ALREADY_TAKEN_LOGIN = "python";
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

    @Test
    public void should_disable_signin_button_until_mandatory_fields_are_filled_in_singin_mode(
            @InitialPage MainPage mainPage
    ) throws Exception {
        Assert.assertTrue("Submit button should be disabled on login page load", loginPage.isSubmitButtonDisabled());

        loginPage.setLogin(SOME_LOGIN);
        Assert.assertTrue("Submit button should be disabled if password field is not specified", loginPage.isSubmitButtonDisabled());

        loginPage.setPassword(SOME_PASSWORD);
        Assert.assertFalse("Submit button should be enabled after login and password are specified", loginPage.isSubmitButtonDisabled());
    }

    @Test
    public void should_show_repeat_password_field_after_entering_signup_mode(
            @InitialPage MainPage mainPage
    ) throws Exception {
        Assert.assertFalse("Repeat password field should not be shown on login page load", loginPage.isRepeatPasswordFieldVisible());

        loginPage.enterSignUpMode();
        Assert.assertTrue("Repeat password field should not be shown on login page load", loginPage.isRepeatPasswordFieldVisible());
    }

    @Test
    public void should_show_error_message_if_typed_login_is_already_taken_in_signup_mode(
            @InitialPage MainPage mainPage
    ) throws Exception {
        final String LOGIN_ALREADY_TAKEN_MESSAGE = "User with login \"" + ALREADY_TAKEN_LOGIN + "\" already exists";

        loginPage.enterSignUpMode();
        Assert.assertFalse("Should not show error login message after entering sing-up mode", loginPage.isLoginErrorMessageVisible());

        loginPage.setLogin(ALREADY_TAKEN_LOGIN);
        String loginErrorMessage = loginPage.getLoginErrorMessage();
        Assert.assertEquals(
                "Should show login already taken message",
                LOGIN_ALREADY_TAKEN_MESSAGE,
                loginErrorMessage);
    }
}