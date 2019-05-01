//购物车控制层
app.controller("cartController",function ($scope, cartService) {
    //查询购物车列表
    $scope.findCartList=function () {
        cartService.findCartList().success(
            function (response) {
                $scope.cartList=response;
                $scope.totalValue=cartService.num($scope.cartList);//求合计数
            }
        );
    };


    //添加商品到购物车
    $scope.addGoodsToCartList=function (itemId,num) {
        cartService.addGoodsToCartList(itemId,num).success(
            function (response) {
                if(response.success){
                    $scope.findCartList()//刷新列表
                }else{
                   alert(response.message);//弹出错误提示
                }
            }
        );
    };
    
    
    //求合计
    /*sum=function () {
        $scope.totalNum=0;//总数量
        $scope.totalMoney=0;//总金额

        for(var i = 0; i < $scope.cartList.length; i++) {
            var cart = $scope.cartList[i];//购物车对象
            for(var j = 0; j < cart.orderItemList.length; j++) {
                var orderItem = cart.orderItemList[j];//购物车明细
                $scope.totalNum+=orderItem.num;//累加数量
                $scope.totalMoney+=orderItem.totalFee;//累加金额
            }
        }

    }*/









});