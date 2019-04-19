app.controller("brandController",function ($scope,$controller,brandService) {

    $controller("baseController",{$scope:$scope});


    //读取列表数据绑定到表单中
    $scope.findAll=function () {
        brandService.findAll().success(
            function (response) {
                $scope.list=response;
            });
    };

    //分页控件配置 currentPage:当前页 totalItems:总记录数 itemsPerPage:每页记录数
    //perPageOptions:分页选项 onChange:更改页码时触发事件
    /*$scope.paginationConf={
        currentPage:1,
        totalItems:10,
        itemsPerPage:10,
        perPageOptions:[10,20,30,40,50],
        onChange:function () {
            //$scope.findPage($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
            $scope.reloadList();
        }
    };*/

    //刷新列表
    /*$scope.reloadList=function () {
        $scope.search($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
        //$scope.findPage($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
    };*/

    //分页
    /*$scope.findPage=function (page,size) {
        brandService.findPage(page,size).success(
            function (response) {
                $scope.list=response.rows;
                $scope.paginationConf.totalItems=response.total;//更新总记录数
            }
        )
    };*/

    //新增
    $scope.save=function () {
        /*var methodName="add";//方法名称
        if($scope.entity.id!=null){//如果有id
            methodName = "update";//则执行修改方法
        }*/

        var serviceObject;////服务层对象
        if($scope.entity.id!=null){
            serviceObject=brandService.update($scope.entity);
        }else{
            serviceObject=brandService.add($scope.entity);
        }


        serviceObject.success(
            function (response) {
                if(response.success){
                    $scope.reloadList();//重新加载 重新查询
                }else{
                    alert(response.message);
                }
            }
        );
    };

    //查询实体
    $scope.findOne=function (id) {
        brandService.findOne(id).success(
            function (response) {
                $scope.entity=response;
            }
        )
    };


    /*$scope.selectIds=[];//用户勾选选中的id集合

    //用户勾选复选框
    $scope.updateSelection=function ($event, id) {
        if($event.target.checked){//如果是被选中,则增加到数组
            $scope.selectIds.push(id);
        }else{
            var idx = $scope.selectIds.indexOf(id);
            $scope.selectIds.splice(idx, 1);//删除 参数 1 为位置 ，参数2 位移除的个数

        }
    };*/

    //批量删除
    $scope.dele=function () {
        //获取选中的复选框
        if(confirm("确定要删除吗?")){
            brandService.dele($scope.selectIds).success(
                function (response) {
                    if (response.success) {
                        $scope.reloadList();//刷新列表
                    }else{
                        alert(response.message);
                    }
                }
            );

        }
    };


    $scope.searchEntity={};//定义搜索对象
    //条件查询
    $scope.search=function(page,size){

        brandService.search(page,size,$scope.searchEntity).success(
            function(response){
                $scope.list=response.rows;//显示当前页数据
                $scope.paginationConf.totalItems=response.total;//更新总记录数
            }
        );

    };


    /*$scope.search=function (page,size) {
        $http.post('../brand/search.do?page='+page+'&size='+size,$scope.searchEntity).success(
            function (response) {
                $scope.paginationConf.totalItems=response.total;//总记录数
                $scope.list=response.rows;//显示当前页数据
            }
        );
    };*/






});