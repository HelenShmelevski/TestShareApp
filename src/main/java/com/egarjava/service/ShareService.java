package com.egarjava.service;

import com.egarjava.entity.Share;

import java.util.Date;
import java.util.List;

/**
 * Сервис отвечает за бизнес логику приложения в работе с сущностью: Акция
 */
public interface ShareService {
    /**
     * Возвращает список экземпляров сущности:Акция
     * @return
     */
    List<Share> getShareList();

    /**
     * Обновляет экземпляр сущности: Акция
     * @param id
     * @param newShare
     */
    void updateShare(int id, Share newShare);

    /**
     * Удаляет экземпляр сущности: Акция
     * @param id
     */
    void deleteShare(int id);

    /**
     * Создает экземпляр сущности: Акция
     * @param date
     * @param company
     * @param cost
     */
    void createShare(Date date, String company, double cost);
}
