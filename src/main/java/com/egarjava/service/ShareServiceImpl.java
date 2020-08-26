package com.egarjava.service;


import com.egarjava.entity.Share;
import com.egarjava.jdbc.ShareDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.List;


@Service
public class ShareServiceImpl implements ShareService {
    private final ShareDao shareDao;

    @Autowired
    public ShareServiceImpl(ShareDao shareDao) {
        this.shareDao = shareDao;
    }

    @Override
    public List<Share> getShareList() {
        return shareDao.listShares();
    }

    @Override
    public void updateShare(int id, Share newShare){
        shareDao.updateShare(id, newShare.getDate(), newShare.getCompany(), newShare.getCost());
    }

    @Override
    public void createShare(Date date, String company, double cost){
        shareDao.createShare(date, company, cost);
    }

    @Override
    public void deleteShare(int id) {
        shareDao.deleteShare(id);
    }
}
