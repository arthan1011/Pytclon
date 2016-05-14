package org.arthan.pytclon.domain.control;

import org.arthan.pytclon.domain.entity.User;

import javax.ejb.Stateless;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

/**
 * Created by ashamsiev on 01.03.2016
 */

@Stateless
public class UserDao extends AbstractDao<User> {

    public UserDao() {
        super(User.class);
    }

    @Override
    public User save(User user) {

        user.setPassword(cypherPassword(user.getPassword()));

        return super.save(user);
    }

    private String cypherPassword(String password) {
        MessageDigest md;
        try {
            md = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        byte[] passBytes = password.getBytes();
        byte[] hash = md.digest(passBytes);
        return Base64.getEncoder().encodeToString(hash);
    }

    public User findByLogin(final String login) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<User> cq = cb.createQuery(User.class);
        Root<User> from = cq.from(User.class);
        cq.select(from);
        cq.where(cb.equal(from.get("login"), login));

        return em.createQuery(cq).getSingleResult();
    }
}
