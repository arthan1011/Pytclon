package org.arthan.pytclon.domain.control;

import org.arthan.pytclon.domain.entity.Player;

import javax.ejb.Stateless;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.List;

/**
 * Created by ashamsiev on 26.04.2016
 */

@Stateless
public class PlayerDao extends AbstractDao<Player>{

    public PlayerDao() {
        super(Player.class);
    }

    public List<Player> findAllByUserId(final Integer userId) {

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Player> cq = cb.createQuery(Player.class);
        Root<Player> from = cq.from(Player.class);
        cq.select(from);
        cq.where(cb.equal(from.get("userId"), userId));

        return em.createQuery(cq).getResultList();
    }
}
