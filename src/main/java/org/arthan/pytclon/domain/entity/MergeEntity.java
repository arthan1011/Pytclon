package org.arthan.pytclon.domain.entity;

/**
 * Created by arthan on 19.06.2016. Project pytclon
 */
public interface MergeEntity {
    /**
     * set no null fields from entity to object
     * @param entity object which fields is used to update another object
     */
    void merge(MergeEntity entity);
}
