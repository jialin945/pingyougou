package com.pinyougou.page.service;

/**
 * 商品详情页 接口
 */
public interface ItemPageService {

    /**
     * 生成商品详细页
     * @param goodsId
     * @return
     */
    public  boolean genItemHtml(Long goodsId);


}
