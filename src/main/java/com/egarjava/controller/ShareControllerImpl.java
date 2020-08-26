package com.egarjava.controller;

import com.egarjava.entity.Share;
import com.egarjava.service.ShareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/share")
@CrossOrigin("*")
public class ShareControllerImpl{
    private final ShareService shareService;

    @Autowired
    public ShareControllerImpl(ShareService shareService) {
        this.shareService = shareService;
    }

    @GetMapping("/get")
    public List<Share> get() {
        return shareService.getShareList();
    }

    @PatchMapping("/update/{id}")
    public void update(@PathVariable int id, @RequestBody Share newShare) {
        shareService.updateShare(id, newShare);
    }

    @PostMapping("/create")
    public void createShare(@RequestBody Share newShare){
        shareService.createShare(newShare.getDate(),newShare.getCompany(),newShare.getCost());
    }

    @DeleteMapping("/delete/{id}")
    public void deleteShare(@PathVariable int id){
        shareService.deleteShare(id);
    }

}
