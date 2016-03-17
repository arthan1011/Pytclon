package integration.config;

import org.jboss.shrinkwrap.api.ShrinkWrap;
import org.jboss.shrinkwrap.api.importer.ZipImporter;
import org.jboss.shrinkwrap.api.spec.WebArchive;

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
        archive.addAsResource("test-schema.sql", "/META-INF/create_schema.xml");
        archive.addAsWebInfResource("test-web.xml", "web.xml");
        return archive;
    }
}
