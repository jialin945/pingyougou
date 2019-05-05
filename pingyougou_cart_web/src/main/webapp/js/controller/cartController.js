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


    //获取地址列表
    $scope.findAddressList=function () {
        cartService.findAddressList().success(
            function (response) {
                $scope.addressList=response;
                //设置默认地址
                for(var i = 0; i < $scope.addressList.length; i++) {
                  if($scope.addressList[i].isDefault=="1"){
                        $scope.address=$scope.addressList[i];
                        break;
                  }
                }
            }
        );
    };

    //选择地址
    $scope.selectAddress=function (address) {
        $scope.address=address;
    };

    //判断是否是当前选中地址
    $scope.isSelectAddress=function (address) {
        if(address==$scope.address){
            return true;
        }else{
            return false;
        }
    };


    //选中支付方法
    $scope.order={paymentType:"1"};//默认

    $scope.selectPayType=function (type) {
        $scope.order.paymentType=type;
    }



    
    
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