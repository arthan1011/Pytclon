package org.arthan.pytclon.domain.control;

import org.arthan.pytclon.domain.entity.User;

import javax.ejb.Stateless;

/**
 * Created by ashamsiev on 01.03.2016
 */

@Stateless
public class UserDao extends AbstractDao<User> {

    public UserDao() {
        super(User.class);
    }
}
