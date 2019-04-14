package com.pinyougou.sellergoods.service;

import com.pinyougou.pojo.TbBrand;
import entity.PageResult;

import java.util.List;
import java.util.Map;

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


    /**
     * 修改
     * @param brand
     */
    public void update(TbBrand brand);


    /**
     * 根据id获取实体
     * @param id
     * @return
     */
    public TbBrand findOne(Long id);


    /**
     * 批量删除
     * @param ids
     */
    public void delete(Long [] ids);


    /**
     * 分页
     * @param brand 品牌
     * @param pageNum 当前页码
     * @param pageSize 每页显示的记录数
     * @return
     */
    public PageResult findPage(TbBrand brand, int pageNum,int pageSize);


    /**
     * 品牌下拉框数据
     * @return
     */
    List<Map> selectOptionList();



}
