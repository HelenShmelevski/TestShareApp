package com.egarjava.jdbc;

import com.egarjava.entity.Share;
import javax.sql.DataSource;
import java.util.Date;
import java.util.List;

public interface ShareDao {

    public void setDataSource(DataSource dataSource);

    public void createShare(Date date, String company, double cost);

    public Share getShareById(int id);

    public List<Share> listShares();

    public void deleteShare(int id);

    public void updateShare(int id, Date date, String company, double cost);

}
