package integration.gui.pages;

import org.jboss.arquillian.graphene.Graphene;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.concurrent.TimeUnit;

/**
 * Created by Arthur Shamsiev on 23.02.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@Location("login.jsp")
public class LoginPage {

    @FindBy(name = "j_username")
    private WebElement loginInput;

    @FindBy(name = "j_password")
    private WebElement passwordInput;

    @FindBy(name = "j_password_repeat")
    private WebElement passwordRepeatInput;

    @FindBy(id = "signInBtn")
    private WebElement loginSubmit;
    @FindBy(id = "signUpBtn")
    private WebElement signUpButton;

    @FindBy(id = "userMsg")
    private WebElement loginErrorMessage;
    @FindBy(id = "passRepMsg")
    private WebElement passwordRepeatErrorMessage;
    @FindBy(id = "passMsg")
    private WebElement passwordErrorMessage;

    @FindBy(id = "logoutBtn")
    private WebElement logoutButton;

    public void login(String username, String password) {
        loginInput.sendKeys(username);
        passwordInput.sendKeys(password);
        Graphene.waitGui().until().element(loginSubmit).is().enabled();
        Graphene.guardHttp(loginSubmit).submit();
    }

    public boolean isSubmitButtonDisabled() {
        return !loginSubmit.isEnabled();
    }

    public void setLogin(String username) {
        typeTo(loginInput, username);
    }

    public void setPassword(String password) {
        typeTo(passwordInput, password);
    }

    public void setRepeatPassword(String repeatedPassword) {
        typeTo(passwordRepeatInput, repeatedPassword);
    }

    public boolean isRepeatPasswordFieldVisible() {
        return passwordRepeatInput.isDisplayed();
    }

    public void enterSignUpMode() {
        signUpButton.click();
    }

    public boolean isLoginErrorMessageVisible() {
        return loginErrorMessage.isDisplayed();
    }

    public String getLoginErrorMessage() {
        Graphene.waitAjax().until().element(loginErrorMessage).is().visible();
        return loginErrorMessage.getText();
    }

    public void signUp() {
        Graphene.waitAjax().until().element(signUpButton).is().enabled();
        signUpButton.click();
        Graphene.waitModel().until().element(loginSubmit).is().visible();
    }

    public String getRepeatPasswordMessage() {
        Graphene.waitAjax().until().element(passwordRepeatErrorMessage).is().visible();
        return passwordRepeatErrorMessage.getText();
    }

    public String getPasswordMessage() {
        Graphene.waitAjax().until().element(passwordErrorMessage).is().visible();
        return passwordErrorMessage.getText();
    }

    /**
     * Delay typing of last symbol of input
     * @param inputField
     * @param inputValue
     */
    private void typeTo(WebElement inputField, String inputValue) {
        inputField.sendKeys(inputValue.substring(0, inputValue.length() - 1));
        Graphene.waitGui().withTimeout(800, TimeUnit.MILLISECONDS);
        inputField.sendKeys(inputValue.substring(inputValue.length() - 1));
    }

    public void logout() {
        logoutButton.click();
        Graphene.waitModel().withTimeout(5, TimeUnit.SECONDS);
    }
}
