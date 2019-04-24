app.controller("searchController", function ($scope, searchService) {
    //搜索
    $scope.search = function () {
        searchService.search($scope.searchMap).success(
            function (response) {
                $scope.resultMap = response;//搜索返回的结果

            }
        );
    };

    //resultMap是搜索返回回来的结果 searchMap是js里面定义的数据结构
    //搜索对象          关键字         分类商品        品牌       规格
    $scope.searchMap = {'keywords': '', 'category': '', 'brand': '', 'spec': {}};

    //添加搜索项
    $scope.addSearchItem = function (key, value) {
        //如果点击的是分类或者是品牌
        if (key == 'category' || key == 'brand') {
            $scope.searchMap[key] = value;
        } else {
            $scope.searchMap.spec[key] = value;
        }

        //执行搜索
        $scope.search()

    };


    //移除复合搜索条件
    $scope.removeSearchItem = function (key) {
        //如果是分类或品牌
        if (key == 'category' || key == 'brand') {
            $scope.searchMap[key] = '';
        } else {//否则是规格
            delete $scope.searchMap.spec[key];//移除此属性
        }
        //执行搜索
        $scope.search()
    };



});