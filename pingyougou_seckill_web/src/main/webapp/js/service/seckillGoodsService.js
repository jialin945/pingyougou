//服务处
app.service("seckillGoodsService",function ($http) {

    //读取列表数据绑定到表单中
    this.findList=function () {
        return $http.get('seckillGoods/findList.do');
    }

    //查询实体
    this.findOneFromRedis=function (id) {
        return $http.get('seckillGoods/findOneFromRedis.do?id='+id);
    }

    //提交订单
    this.submitOrder=function (seckillId) {
        return $http.get('seckillOrder/submitOrder.do?seckillId='+seckillId);
    }
    
});