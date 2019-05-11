package com.pinyougou.task;

import com.pinyougou.mapper.TbSeckillGoodsMapper;
import com.pinyougou.pojo.TbSeckillGoods;
import com.pinyougou.pojo.TbSeckillGoodsExample;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Component
public class SeckillTask {

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private TbSeckillGoodsMapper seckillGoodsMapper;


    /**
     * 刷新秒杀商品
     */
    @Scheduled(cron = "* * * * * ?")
    public void refreshSeckillGoods() {
        System.out.println("执行了任务调度" + new Date());

        //查询所有的秒杀商品键集合
        Set seckillGoods = redisTemplate.boundHashOps("seckillGoods").keys();

        List goodsIdList = new ArrayList(seckillGoods);
        System.out.println(goodsIdList);
        //查询正在秒杀的商品列表

        TbSeckillGoodsExample example = new TbSeckillGoodsExample();
        TbSeckillGoodsExample.Criteria criteria = example.createCriteria();
        criteria.andStatusEqualTo("1");
        criteria.andStockCountGreaterThan(0);
        criteria.andStartTimeLessThanOrEqualTo(new Date());
        criteria.andEndTimeGreaterThanOrEqualTo(new Date());

        if (goodsIdList.size() > 0) {
            criteria.andIdNotIn(goodsIdList);//排除缓存中已经存在的商品集合
        }

        List<TbSeckillGoods> seckillGoodsList = seckillGoodsMapper.selectByExample(example);

        //将列表数据存入缓存
        for (TbSeckillGoods tbSeckillGoods : seckillGoodsList) {
            redisTemplate.boundHashOps("seckillGoods").put(tbSeckillGoods.getId(), tbSeckillGoods);
            System.out.println("增量更新秒杀商品id"+tbSeckillGoods.getId());
        }

        System.out.println("将"+seckillGoodsList.size()+"条商品装入缓存");
        System.out.println("------------end-------------");


    }


    /**
     * 移除秒杀商品
     */
    @Scheduled(cron = "* * * * * ?")
    public void removeSeckillGoods(){
        System.out.println("移除秒杀商品任务在执行");
        //扫描缓存中秒杀商品列表，发现过期的移除
        List<TbSeckillGoods> seckillGoods = redisTemplate.boundHashOps("seckillGoods").values();
        for (TbSeckillGoods seckillGood : seckillGoods) {
            //如果结束日期小于当前日期 表示已过期
            if(seckillGood.getEndTime().getTime()<new Date().getTime()){
                //向数据库保存记录
                seckillGoodsMapper.updateByPrimaryKey(seckillGood);
                //移除缓存数据
                redisTemplate.boundHashOps("seckillGoods").delete(seckillGood.getId());
                System.out.println("移除秒杀商品"+seckillGood.getId());
            }
        }

        System.out.println("移除秒杀商品任务结束");

    }










}
