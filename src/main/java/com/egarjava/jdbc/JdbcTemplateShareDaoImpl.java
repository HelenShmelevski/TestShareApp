package com.egarjava.jdbc;

import com.egarjava.entity.Share;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;

@Repository
public class JdbcTemplateShareDaoImpl implements ShareDao {
    private DataSource dataSource;
    private JdbcTemplate jdbcTemplate;

    @Autowired
    public JdbcTemplateShareDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public void createShare(Date date, String company, double cost) {
        //int id = getMaxId()+1;
        String SQL = "INSERT INTO SHARE_TABLE (date, company, cost) VALUES (?,?,?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
       // jdbcTemplate.update(SQL, id, date, company, cost);
        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection
                    .prepareStatement(SQL);
            ps.setDate(1,new java.sql.Date(date.getTime()));
            ps.setString(2, company);
            ps.setDouble(3, cost);
            return ps;
        }, keyHolder);
    }

    @Override
    public Share getShareById(int id) {
        String SQL = "SELECT * FROM SHARE_TABLE WHERE id = ?";
        Share share = (Share) jdbcTemplate.queryForObject(SQL, new Object[]{id}, new ShareMapper());
        return share;
    }

    @Override
    public List<Share> listShares() {
        return jdbcTemplate.query("select * from Share_table", (resultSet, i) -> {
            return toPerson(resultSet);
        });
    }

    @Override
    public void deleteShare(int id) {
        String SQL = "DELETE FROM SHARE_TABLE WHERE id = ?";
        jdbcTemplate.update(SQL, id);
    }

    @Override
    public void updateShare(int id, Date date, String company, double cost) {
        String SQL = "UPDATE SHARE_TABLE SET date = ?, company = ?, cost = ? WHERE id = ?";
        jdbcTemplate.update(SQL, date, company, cost, id);



    }

    private int getMaxId() {
        try {
            String SQL = "SELECT MAX(id) FROM SHARE_TABLE";
            int maxId = jdbcTemplate.queryForObject(SQL, int.class);
            return maxId;
        } catch (Exception ex) {
            return 0;
        }
    }

    private Share toPerson(ResultSet resultSet) throws SQLException {
        Share share = new Share();
        share.setId(resultSet.getInt("ID"));
        share.setDate(resultSet.getDate("DATE"));
        share.setCompany(resultSet.getString("COMPANY"));
        share.setCost(resultSet.getDouble("COST"));
        return share;
    }
}
