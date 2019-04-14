app.controller('baseController',function ($scope) {
    //分页控件配置 currentPage:当前页 totalItems:总记录数 itemsPerPage:每页记录数
    //perPageOptions:分页选项 onChange:更改页码时触发事件
    $scope.paginationConf={
        currentPage:1,
        totalItems:10,
        itemsPerPage:10,
        perPageOptions:[10,20,30,40,50],
        onChange:function () {
            //$scope.findPage($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
            $scope.reloadList();
        }
    };

    //刷新列表
    $scope.reloadList=function () {
        $scope.search($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
        //$scope.findPage($scope.paginationConf.currentPage,$scope.paginationConf.itemsPerPage);
    };

    //分页
    $scope.findPage=function (page,size) {
        brandService.findPage(page,size).success(
            function (response) {
                $scope.list=response.rows;
                $scope.paginationConf.totalItems=response.total;//更新总记录数
            }
        )
    };


    $scope.selectIds=[];//用户勾选选中的id集合

    //用户勾选复选框
    $scope.updateSelection=function ($event, id) {
        if($event.target.checked){//如果是被选中,则增加到数组
            $scope.selectIds.push(id);
        }else{
            var idx = $scope.selectIds.indexOf(id);
            $scope.selectIds.splice(idx, 1);//删除 参数 1 为位置 ，参数2 位移除的个数

        }
    };

    //提取 json 字符串数据中某个属性，返回拼接字符串 逗号分隔
    $scope.jsonToString=function (jsonString,key){
        //将 json 字符串转换为 json 对象
        var json = JSON.parse(jsonString);

        var value = "";
        for(var i = 0; i < json.length; i++) {
            if(i>0){
                value += ",";
            }
            value += json[i][key];
        }

        return value;
    }






});