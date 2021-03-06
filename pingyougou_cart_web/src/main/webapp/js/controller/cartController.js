//购物车控制层
app.controller("cartController", function ($scope, cartService) {
    //查询购物车列表
    $scope.findCartList = function () {
        cartService.findCartList().success(
            function (response) {
                $scope.cartList = response;
                $scope.totalValue = cartService.num($scope.cartList);//求合计数
            }
        );
    };


    //添加商品到购物车
    $scope.addGoodsToCartList = function (itemId, num) {
        cartService.addGoodsToCartList(itemId, num).success(
            function (response) {
                if (response.success) {
                    $scope.findCartList()//刷新列表
                } else {
                    alert(response.message);//弹出错误提示
                }
            }
        );
    };


    //获取地址列表
    $scope.findAddressList = function () {
        cartService.findAddressList().success(
            function (response) {
                $scope.addressList = response;
                //设置默认地址
                for (var i = 0; i < $scope.addressList.length; i++) {
                    if ($scope.addressList[i].isDefault == "1") {
                        $scope.address = $scope.addressList[i];
                        break;
                    }
                }
            }
        );
    };

    //选择地址
    $scope.selectAddress = function (address) {
        $scope.address = address;
    };

    //判断是否是当前选中地址
    $scope.isSelectAddress = function (address) {
        if (address == $scope.address) {
            return true;
        } else {
            return false;
        }
    };


    //选中支付方法
    $scope.order = {paymentType: "1"};//默认

    $scope.selectPayType = function (type) {
        $scope.order.paymentType = type;
    };


    //保存订单
    $scope.submitOrder = function () {
        $scope.order.receiverAreaName = $scope.address.address;//地址
        $scope.order.receiverMobile = $scope.address.mobile;//手机
        $scope.order.receiver = $scope.address.contact;//联系人

        cartService.submitOrder($scope.order).success(
            function (response) {
                if (response.success) {
                    //页面跳转
                    if ($scope.order.paymentType == "1") {//如果是微信支付，跳转到支付页面
                        location.href = "pay.html";
                    } else {//如果货到付款，跳转到提示页面
                        location.href = "paysuccess.html";
                    }
                } else {
                    alert(response.message);//也可以跳转到提示页面
                }

            }
        );
    };



    //保存地址
    $scope.save=function () {
        cartService.add( $scope.entity  ).success(
            function(response){
                if(response.success){
                    alert("新增成功");
                    findAddressList();
                    //重新查询
                    //$scope.reloadList();//重新加载
                }else{
                    alert(response.message);
                }
            }
        );

        /*addressService.add( $scope.entity  ).success(
            function(response){
                if(response.success){
                    alert("新增成功");
                    findAddressList();
                    //重新查询
                    //$scope.reloadList();//重新加载
                }else{
                    alert(response.message);
                }
            }
        );*/

    };


    //提交选中的订单 付款
    $scope.selectOrderItemList=[];
    $scope.selectOrderItem=function ($event,orderItem) {
        //alert("1111111111");
        if($event.target.checked){
            //选中状态添加到集合
            $scope.selectOrderItemList.push(orderItem);
        }else{
            //取消选中 移除
            $scope.selectOrderItemList.splice($scope.selectOrderItemList.indexOf(orderItem), 1);
        }
    };


    //提交选中的订单结算
    $scope.selectOrderItemListPay=function () {
        cartService.selectOrderItemListPay($scope.selectOrderItemList).success(
            function (response) {
                if(response.success){
                    alert("请确认订单信息");
                }else{
                    alert("订单错误");
                }
            }
        );
    };


    //查询出来需要支付的结算订单
    $scope.findOrderItemListPay=function () {
        cartService.findOrderItemListPay().success(
            function (response) {
                $scope.cartList = response;
                $scope.totalValue = cartService.num($scope.cartList);//求合计数
            }
        );
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