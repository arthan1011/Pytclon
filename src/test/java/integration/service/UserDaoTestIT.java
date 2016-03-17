package integration.service;

import com.google.common.collect.Lists;
import integration.config.Deployments;
import org.arthan.pytclon.domain.control.UserDao;
import org.arthan.pytclon.domain.entity.User;
import org.jboss.arquillian.container.test.api.Deployment;
import org.jboss.arquillian.junit.Arquillian;
import org.jboss.arquillian.persistence.Cleanup;
import org.jboss.arquillian.persistence.CleanupStrategy;
import org.jboss.arquillian.persistence.ShouldMatchDataSet;
import org.jboss.shrinkwrap.api.spec.WebArchive;
import org.junit.Test;
import org.junit.runner.RunWith;

import javax.inject.Inject;

/**
 * Created by ashamsiev on 16.03.2016
 */

@RunWith(Arquillian.class)
public class UserDaoTestIT {

    @Inject
    UserDao userDao;

    @Deployment(testable = true)
    public static WebArchive createDeployment() {
        return Deployments.createWarDeploymentTestJPA_withoutSecurity();
    }

    @Test
    @ShouldMatchDataSet(value = "datasets/users.json" ,orderBy = "login")
    @Cleanup(strategy = CleanupStrategy.STRICT)
    public void should_create_new_user_in_database() throws Exception {
        System.out.println("Testing...");

        final User user = new User();
        user.setLogin("test_user");
        user.setPassword("pass");
        user.setRoles(Lists.newArrayList("client"));

        userDao.save(user);

    }
}
