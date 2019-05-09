//控制层
app.controller('userController', function ($scope, $controller, $interval, userService) {

    //注册
    $scope.reg = function () {
        if ($scope.entity.password != $scope.password) {
            alert("两次输入的密码不一致，请重新输入");
            $scope.entity.password = "";
            $scope.password = "";
            return;
        }

        userService.add($scope.entity, $scope.smsCode).success(
            function (response) {
                alert(response.message);
            }
        );


    };


    /*$scope.sendCode=function () {
        //alert(2222);
        if($scope.entity.phone==null || $scope.entity.phone==""){
            alert("请输入手机号！");
            return;
        }

        userService.sendCode($scope.entity.phone).success(
            function (response) {
                alert(response.message);
            }
        );
    }*/


    $scope.btnMsg = "获取短信验证码";
    var active = true;
    var second = 60;
    var secondInterval;



    $scope.sendCode = function () {
        if ($scope.entity.phone == null || $scope.entity.phone == "") {
            alert("请输入手机号！");
            return;
        }

        if (active == false) {
            return;
        }

        //发送验证码 js实现
        userService.sendCode($scope.entity.phone).success(
            function (resonse) {
                if (resonse.message == "验证码发送成功") {
                    // 显示倒计时按钮，60秒后，允许重新发送
                    active = false;
                    secondInterval = setInterval(function () {
					    if(second<0){
                            // 倒计时结束，允许重新发送
                            $scope.btnMsg="重发验证码";
                            //强制更新视图
                            $scope.$digest();

                            active=true;
                            second=60;
                            //关闭定时器
                            clearInterval(secondInterval);
                            secondInterval=undefined;

                        }else{
					        //继续计时
					        $scope.btnMsg=second+"秒后重发";
                            // 强制更新视图
                            $scope.$digest();
					        second--;
                        }
                    }, 1000);

                } else {
                    alert(resonse.message);
                }


            }
        );

    };


    //发送验证码 angulajs 实现 需要引入引人服务
    $scope.sendCode2=function () {
        if ($scope.entity.phone == null || $scope.entity.phone == "") {
            alert("请输入手机号！");
            return;
        }

        if (active == false) {
            return;
        }

        userService.sendCode($scope.entity.phone).success(
            function (response) {
                if(response.message=="验证码发送成功"){
                    active=false;
                    secondInterval=$interval(function () {
                        if(second<0){
                            $scope.btnMsg="重发验证码";
                            active=true;
                            second=60;
                            $interval.cancel(secondInterval);
                            secondInterval=undefined;

                        }else{
                          $scope.btnMsg=second+"秒后重发";
                          second--;
                        }
                    },1000);

                }else{
                    response.message;
                }

            }
        );

    }


    //$controller('baseController',{$scope:$scope});//继承

    //读取列表数据绑定到表单中  
    /*$scope.findAll=function(){
        userService.findAll().success(
            function(response){
                $scope.list=response;
            }
        );
    }

    //分页
    $scope.findPage=function(page,rows){
        userService.findPage(page,rows).success(
            function(response){
                $scope.list=response.rows;
                $scope.paginationConf.totalItems=response.total;//更新总记录数
            }
        );
    }

    //查询实体
    $scope.findOne=function(id){
        userService.findOne(id).success(
            function(response){
                $scope.entity= response;
            }
        );
    }

    //保存
    $scope.save=function(){
        var serviceObject;//服务层对象
        if($scope.entity.id!=null){//如果有ID
            serviceObject=userService.update( $scope.entity ); //修改
        }else{
            serviceObject=userService.add( $scope.entity  );//增加
        }
        serviceObject.success(
            function(response){
                if(response.success){
                    //重新查询
                    $scope.reloadList();//重新加载
                }else{
                    alert(response.message);
                }
            }
        );
    }


    //批量删除
    $scope.dele=function(){
        //获取选中的复选框
        userService.dele( $scope.selectIds ).success(
            function(response){
                if(response.success){
                    $scope.reloadList();//刷新列表
                    $scope.selectIds=[];
                }
            }
        );
    }

    $scope.searchEntity={};//定义搜索对象

    //搜索
    $scope.search=function(page,rows){
        userService.search(page,rows,$scope.searchEntity).success(
            function(response){
                $scope.list=response.rows;
                $scope.paginationConf.totalItems=response.total;//更新总记录数
            }
        );
    }*/

});	
