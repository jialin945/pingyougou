package com.pinyougou.cart.service;

import com.pinyougou.pojogroup.Cart;

import java.util.List;

/**
 * 购物车服务接口
 */
public interface CartService {

    /**
     * 添加商品到购物车
     * @param cartList
     * @param itemId
     * @param num
     * @return
     */
    public List<Cart> addGoodsToCartList(List<Cart> cartList, Long itemId, Integer num);


    /**
     * 从redis中查询购物车
     * 大key cartList  小key 用户名传递过去
     * @return
     */
    public List<Cart> findCartListFromRedis(String username);

    /**
     * 将购物车保存到 redis
     * @param username
     * @param cartList
     */
    public void saveCartListToRedis(String username,List<Cart> cartList);


    /**
     * 合并购物车
     * @param cartList1
     * @param cartList2
     * @return
     */
    public List<Cart> mergeCartList(List<Cart> cartList1, List<Cart> cartList2);


    /**
     * 保存需要支付购物车的订单到redis中
     * @param cartList
     */
    public void selectOrderItemListPayToRedis(String username,List<Cart> cartList);


    /**
     * 查询需要支付的订单购物车列表返回
     * @return
     */
    public List<Cart> findOrderItemListPayFromRedis(String username);

}
