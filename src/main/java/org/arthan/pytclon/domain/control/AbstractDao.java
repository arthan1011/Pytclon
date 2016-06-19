package org.arthan.pytclon.domain.control;

import org.arthan.pytclon.domain.entity.DBEntity;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.CriteriaQuery;
import java.io.Serializable;
import java.util.List;

/**
 * Created by ashamsiev on 01.03.2016
 */

public abstract class AbstractDao<T extends Serializable & DBEntity> implements Serializable {

    @PersistenceContext(unitName = "primary")
    EntityManager em;

    private final Class<T> clazz;

    public AbstractDao(Class<T> clazz) {
        this.clazz = clazz;
    }

    public T byId(Object id) {
        T entity = em.find(clazz, id);
//        em.detach(entity);
        return entity;
    }

    public List<T> findAll() {
        CriteriaQuery<T> cQuery = em.getCriteriaBuilder().createQuery(clazz);
        cQuery.select(cQuery.from(clazz));
        return em.createQuery(cQuery).getResultList();
    }

    public T save(T entity) {
        return em.merge(entity);
    }

}
