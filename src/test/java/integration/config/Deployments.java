package integration.config;

import integration.gui.pages.LoginPage;
import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ZipImporter;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.openqa.selenium.WebDriver;

import java.io.File;

/**
 * Created by ashamsiev on 16.03.2016
 */
public class Deployments {

    public static WebArchive createWarDeployment() {
        return ShrinkWrap.create(ZipImporter.class, "pytclon_test.war")
                .importFrom(new File("target/pytclon.war"))
                .as(WebArchive.class);
    }

    public static WebArchive createWarDeploymentTestJPA_withoutSecurity() {
        final WebArchive archive = ShrinkWrap.create(ZipImporter.class, "pytclon_test.war")
                .importFrom(new File("target/pytclon.war"))
                .as(WebArchive.class);
        archive.addAsResource("test-persistence.xml", "/META-INF/persistence.xml");
        archive.addAsWebInfResource("test-web.xml", "web.xml");
        archive.addAsResource("test-schema.sql", "/META-INF/create_schema.xml");
        return archive;
    }

    public static WebArchive createWarDeploymentTestJPAForE2E() {
        final WebArchive archive = ShrinkWrap.create(ZipImporter.class, "pytclon_test.war")
                .importFrom(new File("target/pytclon.war"))
                .as(WebArchive.class);
        archive.addAsResource("test-persistence.xml", "/META-INF/persistence.xml");
        archive.addAsResource("test-schema.sql", "/META-INF/create_schema.xml");
        archive.addAsWebInfResource("test-jboss-web.xml", "jboss-web.xml");
        archive.addAsWebInfResource("test-web-security.xml", "web.xml");
        archive.addPackage(LoginPage.class.getPackage());
        archive.addPackage("org.openqa.selenium");
        return archive;
    }
}
