package org.arthan.pytclon.domain.control;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaQuery;
import java.io.Serializable;
import java.util.List;

/**
 * Created by ashamsiev on 01.03.2016
 */

public abstract class AbstractDao<T extends Serializable> {

    @PersistenceContext(unitName = "primary")
    EntityManager em;

    private final Class<T> clazz;

    public AbstractDao(Class<T> clazz) {
        this.clazz = clazz;
    }

    public T byId(Object id) {
        return em.find(clazz, id);
    }

    public List<T> findAll() {
        CriteriaQuery<T> cQuery = em.getCriteriaBuilder().createQuery(clazz);
        cQuery.select(cQuery.from(clazz));
        return em.createQuery(cQuery).getResultList();
    }

}
