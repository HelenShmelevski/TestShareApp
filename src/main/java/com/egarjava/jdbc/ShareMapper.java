package com.egarjava.jdbc;
import com.egarjava.entity.Share;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ShareMapper implements RowMapper{

        @Override
        public Share mapRow(ResultSet rs, int rowNum) throws SQLException {
            Share developer = new Share();
            developer.setId(rs.getInt("id"));
            developer.setDate(rs.getDate("date"));
            developer.setCompany(rs.getString("company"));
            developer.setCost(rs.getDouble("cost"));
            return developer;
        }
}


