package integration.service;

import com.google.common.collect.Lists;
import integration.config.Deployments;
import org.arthan.pytclon.domain.control.UserDao;
import org.arthan.pytclon.domain.entity.User;
import org.arthan.pytclon.service.UserService;
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
public class UserServiceTestIT {

    @Inject
    UserDao userDao;

    @Inject
    UserService userService;

    @Deployment(testable = true)
    public static WebArchive createDeployment() {
        return Deployments.createWarDeploymentTestJPA_withoutSecurity();
    }

    @Test
    @ShouldMatchDataSet(value = "datasets/users.json", orderBy = "login")
    @Cleanup(strategy = CleanupStrategy.STRICT)
    public void should_create_new_user_in_database() throws Exception {
        final User user = new User();
        user.setLogin("test_user");
        user.setPassword("pass");
        user.setRoles(Lists.newArrayList("client"));

        userDao.save(user);

    }

    @Test
    @ShouldMatchDataSet(value = "datasets/user_with_default_player.json")
    public void should_create_default_player_for_new_user_in_DB() throws Exception {
        final User user = new User();
        user.setLogin("test_user_with_player");
        user.setPassword("pass");
        user.setRoles(Lists.newArrayList("client"));

        userService.create(user);

    }
}
