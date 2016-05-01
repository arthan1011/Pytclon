package integration.gui.pages;

import org.jboss.arquillian.graphene.Graphene;
import org.jboss.arquillian.graphene.page.Location;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by Arthur Shamsiev on 23.02.16.
 * Using IntelliJ IDEA
 * Project - Pytclon
 */

@Location("index.jsp")
public class MainPage {


    @FindBy(id = "userSettingsBtn")
    private WebElement userSettingsButton;
    @FindBy(id = "userSettingsDialog")
    private WebElement userSettingsDialog;

    private UserSettingsDialog userDialog = new UserSettingsDialog();

    public void openUserSettings() {
        userSettingsButton.click();
        Graphene.waitGui().until().element(userSettingsDialog).is().visible();
    }

    public UserSettingsDialog getUserSettingsDialog() {
        return userDialog;
    }


    public class UserSettingsDialog {

        public void selectPlayersTab() {
            WebElement playersTab = userSettingsDialog.findElement(By.id("playersTab"));
            playersTab.click();
            WebElement playersPanel = userSettingsDialog.findElement(By.id("playersPanel"));
            Graphene.waitGui().until().element(playersPanel).is().visible();
        }

        public List<WebObject> getPlayersList() {
            List<WebElement> playerList = userSettingsDialog.findElements(By.className("players-list-element"));
            return playerList.stream()
                    .map(webElement -> {
                        WebObject webObject = new WebObject();
                        String playerName = webElement.findElement(By.className("player-name")).getText();
                        webObject.prop("name", playerName);
                        return webObject;
                    })
                    .collect(Collectors.toList());
        }
    }
}
