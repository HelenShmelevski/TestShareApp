package com.egarjava.jdbc;

import com.egarjava.entity.Share;
import javax.sql.DataSource;
import java.util.Date;
import java.util.List;

/**
 * Интерфейс отвечающий за работу с данными сущности: Акция
 */
public interface ShareDao {
    /**
     * Установить источник данных
     * @param dataSource
     */
    public void setDataSource(DataSource dataSource);

    /**
     * Создать экземпляр сущности: Акция
     * @param date
     * @param company
     * @param cost
     */
    public void createShare(Date date, String company, double cost);

    /**
     * Получить экземпляр сущности: акция, по идентификатору
     * @param id
     * @return
     */
    public Share getShareById(int id);

    /**
     * Получить список всех экземпляров сущности: Акция
     * @return
     */
    public List<Share> listShares();

    /**
     * Удалить экземпляр сущности: Акция
     * @param id
     */
    public void deleteShare(int id);

    /**
     * Обновить экземпляр сущности: Акция
     * @param id
     * @param date
     * @param company
     * @param cost
     */
    public void updateShare(int id, Date date, String company, double cost);
}
