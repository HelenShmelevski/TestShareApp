package com.egarjava.jdbc;
import com.egarjava.entity.Share;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Класс обрабатывающий отдельно каждую запись полученную из БД
 * и возврацает экземпляр сущности: Акция
 */
public class ShareMapper implements RowMapper{
    /**
     * Формирование экземпляра сущности: Акция
     * @param rs
     * @param rowNum
     * @return
     * @throws SQLException
     */
        @Override
        public Share mapRow(ResultSet rs, int rowNum) throws SQLException {
            Share share = new Share();
            share.setId(rs.getInt("id"));
            share.setDate(rs.getDate("date"));
            share.setCompany(rs.getString("company"));
            share.setCost(rs.getDouble("cost"));
            return share;
        }
}


