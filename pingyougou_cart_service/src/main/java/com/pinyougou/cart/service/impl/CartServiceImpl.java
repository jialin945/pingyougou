package com.pinyougou.cart.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.pinyougou.cart.service.CartService;
import com.pinyougou.mapper.TbItemMapper;

import com.pinyougou.pojo.TbItem;
import com.pinyougou.pojo.TbOrderItem;
import com.pinyougou.pojogroup.Cart;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * 购物车服务实现类
 */
@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private TbItemMapper itemMapper;


    /**
     * 添加商品到购物车
     *
     * @param cartList
     * @param itemId
     * @param num
     * @return
     */
    @Override
    public List<Cart> addGoodsToCartList(List<Cart> cartList, Long itemId, Integer num) {
        //1.根据商品的sku id查询sku商品信息
        TbItem item = itemMapper.selectByPrimaryKey(itemId);
        if (item == null) {
            throw new RuntimeException("商品不存在");
        }
        if (!item.getStatus().equals("1")) {
            throw new RuntimeException("商品状态无效");
        }
        //2.获取商家id
        String sellerId = item.getSellerId();
        //3.根据商家id判断购物车列表中是否存在该商家的购物车
        Cart cart = searchCartBySellerId(cartList, sellerId);
        if (cart == null) {
            //4.如果购物车列表中不存在该商家的购物车
            //4.1 新建购物车对象
            cart = new Cart();
            cart.setSellerId(sellerId);
            cart.setSellerName(item.getSeller());
            TbOrderItem orderItem = createOderItem(item, num);
            List orderItemList = new ArrayList();
            orderItemList.add(orderItem);
            cart.setOrderItemList(orderItemList);
            //4.2 将新建的购物车对象添加到购物车列表
            cartList.add(cart);

        } else {
            //5.如果购物车列表中存在该商家的购物车
            //查询购物车明细列表中是否存在该商品
            TbOrderItem orderItem = searchOderItemByItemId(cart.getOrderItemList(), itemId);

            if (orderItem == null) {
                //5.1 如果没有,新增购物车明细
                orderItem = createOderItem(item, num);
                cart.getOrderItemList().add(orderItem);
            }else{
                //5.2 如果有,在原有购物车明细上添加数量,更改金额
                orderItem.setNum(orderItem.getNum() + num);//更改数量后 再 计算金额
                orderItem.setPrice(new BigDecimal(orderItem.getPrice().doubleValue()*orderItem.getNum()));
                //如果数量操作后小于等于 0，则移除
                if(orderItem.getNum()<=0){
                    cart.getOrderItemList().remove(orderItem);//移除购物车明细
                }
                //如果移除后 cart 的明细数量为 0，则将 cart 移除
                if(cart.getOrderItemList().size()==0){
                    cartList.remove(cart);
                }
            }

        }


        return cartList;
    }

    /**
     * 根据商品明细 ID 查询
     *
     * @param orderItemList
     * @param itemId
     * @return
     */
    private TbOrderItem searchOderItemByItemId(List<TbOrderItem> orderItemList, Long itemId) {
        for (TbOrderItem orderItem : orderItemList) {
            //需要转换为基本数据类型 == 比较
            if (orderItem.getItemId().longValue() == itemId.longValue()) {
                return orderItem;
            }
        }

        return null;
    }

    /**
     * 创建订单明细
     *
     * @param item
     * @param num
     * @return
     */
    private TbOrderItem createOderItem(TbItem item, Integer num) {
        if (num <= 0) {
            throw new RuntimeException("数量非法");
        }

        TbOrderItem orderItem = new TbOrderItem();
        orderItem.setGoodsId(item.getGoodsId());
        orderItem.setItemId(item.getId());
        orderItem.setNum(num);
        orderItem.setPicPath(item.getImage());
        orderItem.setSellerId(item.getSellerId());
        orderItem.setTitle(item.getTitle());
        orderItem.setPrice(item.getPrice());
        orderItem.setTotalFee(new BigDecimal(item.getPrice().doubleValue() * num));
        return orderItem;
    }

    /**
     * 根据商家 ID 查询购物车对象
     *
     * @param cartList
     * @param sellerId
     * @return
     */
    private Cart searchCartBySellerId(List<Cart> cartList, String sellerId) {
        for (Cart cart : cartList) {
            if (cart.getSellerId().equals(sellerId)) {
                return cart;
            }
        }

        return null;
    }


}
