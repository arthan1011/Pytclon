package integration.gui.pages;

import org.jboss.arquillian.graphene.Graphene;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

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

    public void login(String username, String password) {
        loginInput.sendKeys(username);
        passwordInput.sendKeys(password);
        Graphene.waitGui().until().element(loginSubmit).attribute("disabled").is().not().present();
        Graphene.guardHttp(loginSubmit).submit();
    }

    public boolean isSubmitButtonDisabled() {
        return !loginSubmit.isEnabled();
    }

    public void setLogin(String username) {
        loginInput.sendKeys(username);
    }

    public void setPassword(String password) {
        passwordInput.sendKeys(password);
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
}
