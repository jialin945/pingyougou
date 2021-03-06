app.controller('payController', function ($scope, $location, payService) {
    //生成本地二维码
    $scope.createNative = function () {
        payService.createNative().success(
            function (response) {
                $scope.money = (response.total_fee / 100).toFixed(2);
                $scope.out_trade_no = response.out_trade_no//订单号
                //二维码
                var qr = new QRious({
                    element: document.getElementById("qrious"),
                    size: 250,
                    level: 'h',
                    value: response.code_url
                });

                //查询支付状态
                queryPayStatus();

            }
        );
    };


    //获取金额
    $scope.getMoney = function () {
        return $location.search()["money"];
    }


    //调用查询
    queryPayStatus = function () {
        payService.queryPayStatus($scope.out_trade_no).success(
            function (response) {
                if (response.success) {
                    location.href = "paysuccess.html#?money=" + $scope.money;
                } else {

                    if (response.message == "二维码超时") {
                        //$scope.createNative();//重新生成二维码
                        alert("二维码超时");
                    } else {

                        location.href = "payfail.html";
                    }

                }

            }
        );
    }


});