package com.egarjava.controller;

import com.egarjava.entity.Share;
import com.egarjava.service.ShareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class ShareControllerImpl implements ShareController {

    private final ShareService someService;

    @Autowired
    public ShareControllerImpl(ShareService shareService) {
        this.someService = shareService;
    }

    @GetMapping("/get")
    public List<Share> get() {
        List<Share> t = someService.getShareList();
        return t;
    }

    @PatchMapping("/update/{id}")
    public void update(@PathVariable int id, @RequestBody Share newShare) {
        someService.updateShare(id, newShare);
    }

    @PostMapping("/create")
    public void createShare(@RequestBody Share newShare){
        someService.createShare(newShare.getDate(),newShare.getCompany(),newShare.getCost());
    }

    @DeleteMapping("/delete/{id}")
    public void deleteShare(@PathVariable int id){
        someService.deleteShare(id);
    }

}
