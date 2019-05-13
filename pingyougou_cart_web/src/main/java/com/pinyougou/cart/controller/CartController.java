package com.pinyougou.cart.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.alibaba.fastjson.JSON;

import com.pinyougou.cart.service.CartService;
import com.pinyougou.pojogroup.Cart;
import entity.Result;
import org.opensaml.xml.encryption.Public;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
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
     *
     * @return
     */
    @RequestMapping("/findCartList")
    public List<Cart> findCartList() {
        //合并购物车  进入购物车每次都需要走给方法 索引在这里合并购物车
        // 登陆后 将cookie的值合并到redis中 并且清空 cookie里面的值

        //得到登陆人账号,判断当前是否有人登陆
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("当前登陆人:" + username);

        //读取本地购物车 cookie里面获取
        String cartListString = CookieUtil.getCookieValue(request, "cartList", "UTF-8");
        if (cartListString == null || cartListString.equals("")) {
            cartListString = "[]";//赋值一个空集合 以免报错
        }

        List<Cart> cartList_cookie = JSON.parseArray(cartListString, Cart.class);

        if (username.equals("anonymousUser")) {//匿名用户 没有登陆
            return cartList_cookie;
        } else {//已登录

            //从redis中获取
            List<Cart> cartList_redis = cartService.findCartListFromRedis(username);

            if (cartList_cookie.size() > 0) {//如果本地存在购物车
                cartList_redis = cartService.mergeCartList(cartList_redis, cartList_cookie);
                //清除本地cookie
                CookieUtil.deleteCookie(request, response, "cartList");
                //将合并后的数据存入redis
                cartService.saveCartListToRedis(username, cartList_redis);
                System.out.println("执行了合并购物车逻辑");
            }

            return cartList_redis;
        }


        //从cookie中获取
        /*String cartListStr = CookieUtil.getCookieValue(request, "cartList", "UTF-8");
        if(cartListStr==null || cartListStr.equals("")){
            cartListStr = "[]";//赋值一个空集合 以免报错
        }

        List<Cart> cartList_cookie = JSON.parseArray(cartListStr, Cart.class);*/


    }


    /**
     * 添加商品到购物车
     *
     * @param itemId
     * @param num
     * @return
     */
    @RequestMapping("/addGoodsToCartList")
    @CrossOrigin(origins = "http://localhost:9105", allowCredentials = "true")
    public Result addGoodsToCartList(Long itemId, Integer num) {

        //response.setHeader("Access-Control-Allow-Origin", "http://localhost:9105");//可以访问的域(当此方法不需要操作cookie)
        //response.setHeader("Access-Control-Allow-Credentials", "true");//如果操作cookie 必须加上这句话

        //得到登陆人账号,判断当前是否有人登陆
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("当前登陆用户:" + username);

        try {
            List<Cart> cartList = findCartList();//获取购物车列表
            cartList = cartService.addGoodsToCartList(cartList, itemId, num);

            if (username.equals("anonymousUser")) {//匿名用户 如果是未登录，保存到 cookie
                CookieUtil.setCookie(request, response, "cartList", JSON.toJSONString(cartList), 3600 * 24, "UTF-8");
                System.out.println("向 cookie 存入数据");

            } else {//已登录  保存到 redis
                cartService.saveCartListToRedis(username, cartList);
            }

            return new Result(true, "添加成功");
        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "添加失败");
        }






        /*try {
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
        }*/
    }


    @RequestMapping("/selectOrderItemListPayToRedis")
    public Result selectOrderItemListPayToRedis(@RequestBody List<Cart> selectOrderItemList) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            //保存到redis
            cartService.selectOrderItemListPayToRedis(username, selectOrderItemList);
            return new Result(true, "保存成功");

        } catch (Exception e) {
            e.printStackTrace();
            return new Result(false, "保存失败");

        }
    }


    @RequestMapping("/findOrderItemListPayFromRedis")
    public List<Cart> findOrderItemListPayFromRedis() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!username.equals("anonymousUser")) {
            return cartService.findOrderItemListPayFromRedis(username);
        }

        return null;

    }


}
