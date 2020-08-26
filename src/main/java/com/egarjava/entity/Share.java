package com.egarjava.entity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "share_table")
/**
 * Класс сущности: Акция
 */
public class Share {

    /**
     *  Уникальный идентификатор
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /**
     * Дата совершения покупки
     */
    @Column
    private Date date;

    /**
     * Наименование компании
     */
    @Column
    private String company;

    /**
     *  Стоимость пакета акций
     */
    @Column
    private Double cost;

    public Integer getId() {
        return id;
    }

    public Date getDate() {
        return date;
    }

    public String getCompany() {
        return company;
    }

    public Double getCost() {
        return cost;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    @Override
    public String toString() {
        return "Share{" +
                "id=" + id +
                ", date=" + date +
                ", company='" + company + '\'' +
                ", cost=" + cost +
                '}';
    }
}
