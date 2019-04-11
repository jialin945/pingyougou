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

    public PageResult findPage(int pageNum,int PageSize);


}
