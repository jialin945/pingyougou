package com.pinyougou.shop.controller;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/login")
public class LoginController {

    @RequestMapping("/name")
    public Map name(){
        Map map = new HashMap();
        //System.out.println("11111111");
        String name = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(name);
        map.put("loginName", name);

        return map;
    }
}
