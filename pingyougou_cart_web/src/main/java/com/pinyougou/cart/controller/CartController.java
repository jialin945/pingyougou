package com.pinyougou.cart.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;

import com.pinyougou.cart.service.CartService;
import com.pinyougou.pojogroup.Cart;
import entity.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import utils.CookieUtil;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {

    @Reference(timeout = 6000)
    private CartService cartService;

    @Autowired
    private HttpServletRequest request;

    @Autowired
    private HttpServletResponse response;


    /**
     * 购物车列表
     * @return
     */
    @RequestMapping("/findCartList")
    public List<Cart> findCartList(){
        //从cookie中获取
        String cartListStr = CookieUtil.getCookieValue(request, "cartList", "UTF-8");
        if(cartListStr==null || cartListStr.equals("")){
            cartListStr = "[]";//赋值一个空集合 以免报错
        }

        List<Cart> cartList_cookie = JSON.parseArray(cartListStr, Cart.class);

        return  cartList_cookie;
    }


    /**
     * 添加商品到购物车
     * @param itemId
     * @param num
     * @return
     */
    @RequestMapping("/addGoodsToCart")
    public Result addGoodsToCart(Long itemId,Integer num){

        try {
            List<Cart> cartList = findCartList();//获取购物车列表
            //重新赋值
            cartList=cartService.addGoodsToCartList(cartList, itemId, num);
            //添加到cookie
            String cartListStr = JSON.toJSONString(cartList);
            CookieUtil.setCookie(request, response, "cartList", cartListStr, 3600 * 24, "UTF-8");
            return new Result(true, "添加成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(true, "添加失败");
        }
    }


}
