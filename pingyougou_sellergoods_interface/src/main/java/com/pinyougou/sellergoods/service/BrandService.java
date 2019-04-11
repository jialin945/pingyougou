package com.pinyougou.sellergoods.service;

import com.pinyougou.pojo.TbBrand;
import entity.PageResult;

import java.util.List;

public interface BrandService {
    /**
     * 返回所有列表
     * @return
     */
    public List<TbBrand> findAll();

    /**
     * 分页列表
     * @param pageNum
     * @param PageSize
     * @return
     */
    public PageResult findPage(int pageNum,int PageSize);

    /**
     * 增加品牌
     * @param brand
     */
    public void add(TbBrand brand);



}
