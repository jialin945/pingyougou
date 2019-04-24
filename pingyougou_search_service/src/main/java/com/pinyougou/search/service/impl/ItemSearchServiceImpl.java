package com.pinyougou.search.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.alibaba.dubbo.container.page.Page;
import com.pinyougou.pojo.TbItem;
import com.pinyougou.search.service.ItemSearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.*;
import org.springframework.data.solr.core.query.result.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service(timeout = 5000)
public class ItemSearchServiceImpl implements ItemSearchService {

    @Autowired
    private SolrTemplate solrTemplate;

    @Autowired
    private RedisTemplate redisTemplate;

    @Override
    public Map<String, Object> search(Map searchMap){
        Map map = new HashMap();
        //1.查询列表  按关键字查询（高亮显示）
        Map map1 = searchList(searchMap);
        map.putAll(map1);

        //2.根据关键字查询商品分类 分组查询
        List<String> categoryList = searchCategoryList(searchMap);
        map.put("categoryList", categoryList);

        //3.查询品牌和规格列表

        if(categoryList.size()>0){
            map.putAll(searchBrandAndSpecList(categoryList.get(0)));
        }

        System.out.println(map);
        return map;
    }


    /**
     * 查询品牌和规格列表
     * @param category 分类名称
     * @return
     */
    private Map searchBrandAndSpecList(String category){
        Map map = new HashMap();
        //根据分类名称从缓存中获取模板id
        Long typeId = (Long) redisTemplate.boundHashOps("itemCat").get(category);

        if (typeId != null) {
            //根据模板 ID 查询品牌列表
            List brandList = (List) redisTemplate.boundHashOps("brandList").get(typeId);
            //返回值添加品牌列表
            map.put("brandList", brandList);

            //根据模板 ID 查询规格列表
            List specList = (List) redisTemplate.boundHashOps("specList").get(typeId);
            map.put("specList", specList);

        }


        return map;
    }


    /**
     * 根据关键字查询商品分类
     * @param searchMap
     * @return
     */
    private List searchCategoryList(Map searchMap){
        List list = new ArrayList();


        Query query=new SimpleQuery("*:*");//2

        //按照关键字查询  3  1 添加条件 2 创建条件对象 并指定是那个域 3 设置关键字是什么
        Criteria criteria = new Criteria("item_keywords");//where..
        criteria.is(searchMap.get("keywords"));
        query.addCriteria(criteria);

        //设置分组选项 4 先创建分组对象 添加根据那个域的字段分组
        GroupOptions groupOptions = new GroupOptions();
        groupOptions.addGroupByField("item_category");//group by.. 可以多个分组页
        query.setGroupOptions(groupOptions);


        //得到分组页 一个分组页包含多个分组结果 包含和被包含的关系
        GroupPage<TbItem> page = solrTemplate.queryForGroupPage(query, TbItem.class);//1
        //page.getContent();  //注意中国返回的是一个空集合 因为它是Page的子接口 所以有这个方法 而且他是返回后的分组结果 用不到这个集合

        //根据列得到分组结果集 必须和分组对象添加的要一样
        GroupResult<TbItem> groupResult = page.getGroupResult("item_category");

        //得到分组结果入口页
        org.springframework.data.domain.Page<GroupEntry<TbItem>> groupEntries = groupResult.getGroupEntries();

        //得到分组入口集合
        List<GroupEntry<TbItem>> content = groupEntries.getContent();
        for (GroupEntry<TbItem> entry : content) {
            //将分组结果的名称封装到返回值中
            list.add(entry.getGroupValue());
        }

        return list;
    }



    /**
     * 按关键字查询（高亮显示）
     * @param searchMap
     * @return
     */
    private Map searchList(Map searchMap){
        Map map = new HashMap();

        HighlightQuery query = new SimpleHighlightQuery();//2
        //添加条件  3 1先创建条件对象 2设置条件的值  3再添加
        Criteria criteria = new Criteria("item_keywords");
        criteria.is(searchMap.get("keywords"));
        query.addCriteria(criteria);

        //设置高亮选项 4  1先创建高亮对象 2添加需要高亮显示的域 可以多个 设置前缀 和后缀
        HighlightOptions highlightOptions=new HighlightOptions();
        highlightOptions.addField("item_title");
        highlightOptions.setSimplePrefix("<em style='color:red'>");
        highlightOptions.setSimplePostfix("</em>");
        query.setHighlightOptions(highlightOptions);

        //高亮页对象
        HighlightPage<TbItem> page = solrTemplate.queryForHighlightPage(query, TbItem.class);//1

        //获取高亮入口对象 5 循环遍历
        List<HighlightEntry<TbItem>> entryList = page.getHighlighted();
        for (HighlightEntry<TbItem> entry : entryList) {
            //获取实体 引用
            TbItem item = entry.getEntity();
            //获取高亮列表 (高亮域的个数)
            List<HighlightEntry.Highlight> highlights = entry.getHighlights();
            //判断后 设置高亮显示结果 也就是搜索的关键字进行高亮显示
            if(highlights.size()>0 && highlights.get(0).getSnipplets().size()>0){

                item.setTitle(highlights.get(0).getSnipplets().get(0));
            }

            //-----------------------
            for (HighlightEntry.Highlight highlight : highlights) {
                //每一个域有可能存储多个值
                List<String> strings = highlight.getSnipplets();
                //System.out.println(strings);
            }
            //--------------------------
        }
        //获取的是原来实体内容  没有高亮内容  高亮内容需要高亮入口获取
        List<TbItem> list = page.getContent();
        map.put("rows", list);

        return map;
    }








    public Map<String, Object> search2(Map searchMap) {
        //item_keywords 复制域

        Map<String, Object> map = new HashMap<>();
        //表示查询所有
        Query query = new SimpleQuery("*:*");
        //添加查询条件
        Criteria criteria = new Criteria("item_keywords");
        criteria.is(searchMap.get("keywords"));
        query.addCriteria(criteria);
        ScoredPage<TbItem> page = solrTemplate.queryForPage(query, TbItem.class);
        List<TbItem> list = page.getContent();
        map.put("rows", list);

        return map;
    }


    /**
     * 根据关键字搜索列表
     * @param searchMap
     * @return
     */

    public Map<String, Object> search3(Map searchMap) {
        Map<String, Object> map = new HashMap<>();//0

        HighlightQuery query=new SimpleHighlightQuery();//2

        //设置高亮选项对象
        HighlightOptions highlightOptions = new HighlightOptions();//4
        //添加高亮的域
        highlightOptions.addField("item_title");//5
        //高亮前缀
        highlightOptions.setSimplePrefix("<em style='color:red'>");//6
        //高亮后缀
        highlightOptions.setSimplePostfix("</em>");//7
        //设置高亮选项
        query.setHighlightOptions(highlightOptions);//3

        //按照关键字查询  复制域
        Criteria criteria=new Criteria("item_keywords");
        criteria.is(searchMap.get("keywords"));
        query.addCriteria(criteria);

        //高亮页对象
        HighlightPage<TbItem> page = solrTemplate.queryForHighlightPage(query, TbItem.class);//1

        List<HighlightEntry<TbItem>> entryList = page.getHighlighted();
        //循环高亮入口

        /*for (HighlightEntry<TbItem> entry : entryList) {
            //获取高亮列表
            List<HighlightEntry.Highlight> highlights = entry.getHighlights();
            //获取高亮列表(高亮域的个数)
            for (HighlightEntry.Highlight highlight : highlights) {
                //每一个域有可能存储多个值
                List<String> strings = highlight.getSnipplets();
                System.out.println(strings);
            }
        }*/
        //循环高亮入口(每条记录的高亮入口)  高亮内容需要高亮入口获取
        for (HighlightEntry<TbItem> entry : entryList) {
            //获取原实体类
            TbItem item = entry.getEntity();
            //高亮列表(高亮域的个数)
            List<HighlightEntry.Highlight> highlights = entry.getHighlights();
            //判断
            if(highlights.size()>0 && highlights.get(0).getSnipplets().size()>0){
                //设置高亮的结果
                item.setTitle(highlights.get(0).getSnipplets().get(0));
            }
        }
        //获取的是原来实体内容  没有高亮内容  高亮内容需要高亮入口获取
        map.put("rows", page.getContent());

        return map;
    }



}
