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

    @FindBy(id = "signInBtn")
    private WebElement loginSubmit;

    public void login(String username, String password) {
        loginInput.sendKeys(username);
        passwordInput.sendKeys(password);
        Graphene.waitGui().until().element(loginSubmit).attribute("disabled").is().not().present();
        Graphene.guardHttp(loginSubmit).submit();
    }
}
