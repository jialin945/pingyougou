app.service("cartService",function ($http) {
    //查询购物车列表
    this.findCartList=function () {
        return $http.get("cart/findCartList.do");
    }

    //添加商品到购物车
    this.addGoodsToCartList=function (itemId,num) {
        return $http.get("cart/addGoodsToCartList.do?itemId="+itemId+"&num="+num);
    }


    //求合计
    this.num=function (cartList) {
        var totalValue = {totalNum: 0, totalMoney: 0.00};//合计实体
        
        for(var i = 0; i < cartList.length; i++) {
            var cart = cartList[i];//购物车对象
            for(var j = 0; j < cart.orderItemList.length; j++) {
                var orderItem = cart.orderItemList[j];//购物车明细
                totalValue.totalNum+=orderItem.num;//累加数量
                totalValue.totalMoney+=orderItem.totalFee;//累加金额
            }
        }

        return totalValue;
        
    };
    
    
    //获取地址列表
    this.findAddressList=function () {
        return $http.get('address/findListByLoginUser.do');
    }

    //保存订单
    this.submitOrder=function (order) {
        return $http.post("order/add.do", order);
    }


    //增加
    this.add=function(entity){
        return  $http.post('address/add.do',entity );
    }

    //修改
    this.update=function(entity){
        return  $http.post('address/update.do',entity );
    }

    //异步保存到redis中 选中的订单结算
    this.selectOrderItemListPay=function (selectOrderItemList) {
        return $http.post('cart/selectOrderItemListPayToRedis.do',selectOrderItemList);
    }

    //查询出来需要支付的结算订单
    this.findOrderItemListPay=function () {
       return $http.get('findOrderItemListPayFromRedis.do');
    }
    

});