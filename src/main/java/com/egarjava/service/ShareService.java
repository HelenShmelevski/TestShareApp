package com.egarjava.service;

import com.egarjava.entity.Share;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

public interface ShareService {

    List<Share> getShareList();
    void updateShare(int id, Share newShare);
    void deleteShare(int id);
    void createShare(Date date, String company, double cost);
}
