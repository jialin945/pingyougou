app.controller("searchController", function ($scope, $location, searchService) {
    //搜索
    $scope.search = function () {
        //修改 search 方法, 在执行查询前，转换为 int 类型，否则提交到后端有可能变成字符串
        $scope.searchMap.pageNo = parseInt($scope.searchMap.pageNo);
        searchService.search($scope.searchMap).success(
            function (response) {

                $scope.resultMap = response;//搜索返回的结果

                buildPageLabel();//调用 分页
            }
        );
    };

    //resultMap是搜索返回回来的结果 searchMap是js里面定义的数据结构  //搜索条件封装对象
    //搜索对象          关键字         分类商品        品牌       规格
    $scope.searchMap = {
        'keywords': '',
        'category': '',
        'brand': '',
        'spec': {},
        'price': '',
        'pageNo': 1,
        'pageSize': 40,
        'sortField': '',
        'sort': ''
    };

    //添加搜索项
    $scope.addSearchItem = function (key, value) {
        //如果点击的是分类或者是品牌 价钱
        if (key == 'category' || key == 'brand' || key == 'price') {
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
        if (key == 'category' || key == 'brand' || key == 'price') {
            $scope.searchMap[key] = '';
        } else {//否则是规格
            delete $scope.searchMap.spec[key];//移除此属性
        }
        //执行搜索
        $scope.search()
    };


    //构建分页标签(totalPages 为总页数)
    buildPageLabel = function () {
        //新增分页栏属性
        $scope.pageLabel = [];

        var maxPageNo = $scope.resultMap.totalPages;//得到最后页码

        //设置初始值 共5个页码 前2 后2
        var firstPage = 1;//开始页码
        var lastPage = 5;//循环截止页码 前2 后2
        //定义变量 前后 ...
        $scope.firstDot = true;//前面有点
        $scope.lastDot = true;//后边有点

        if ($scope.resultMap.totalPages <= 5) {//总页数小于5 后台查询出来的
            firstPage = 1;
            lastPage = maxPageNo;
            $scope.firstDot = false;
            $scope.lastDot = false;
        } else {//大于5页
            firstPage = $scope.searchMap.pageNo - 2;
            lastPage = $scope.searchMap.pageNo + 2;
            $scope.firstDot = true;
            $scope.lastDot = true;

            if (firstPage <= 1) {//前5页
                firstPage = 1;
                lastPage = 5;
                $scope.firstDot = false;
            }

            if (lastPage >= maxPageNo) {
                lastPage = maxPageNo;
                firstPage = maxPageNo - 4;//后5页
                $scope.lastDot = false;
            }

        }

        //循环产生页码标签
        for (var i = firstPage; i <= lastPage; i++) {
            $scope.pageLabel.push(i);
        }
    };

    buildPageLabel3 = function () {
        $scope.pageLabel = [];//新增分页栏属性
        var maxPageNo = $scope.resultMap.totalPages;//得到最后页码
        var firstPage = 1;//开始页码
        var lastPage = maxPageNo;//截止页码
        if ($scope.resultMap.totalPages > 5) {//如果总页数大于 5 页,显示部分页码
            if ($scope.searchMap.pageNo <= 3) {//如果当前页小于等于 3
                lastPage = 5;//前 5 页
            } else if ($scope.searchMap.pageNo >= lastPage - 2) {//如果当前页大于等于最大页码-2
                firstPage = lastPage - 4;
            } else { //显示当前页为中心的 5 页
                firstPage = $scope.searchMap.pageNo - 2;
                lastPage = $scope.searchMap.pageNo + 2;
            }
        }

        //循环产生页码标签
        for (var i = firstPage; i <= lastPage; i++) {
            $scope.pageLabel.push(i);
        }
    };


    //根据页码查询
    $scope.queryByPage = function (pageNo) {
        //页码验证
        if (pageNo < 1 || pageNo > $scope.resultMap.totalPages) {
            return;
        }

        $scope.searchMap.pageNo = pageNo;
        $scope.search();

    }


    //判断当前页为第一页
    $scope.isTopPage = function () {
        if ($scope.searchMap.pageNo == 1) {
            return true;
        } else {
            return false;
        }
    };

    //判断当前页是否未最后一页
    $scope.isEndPage = function () {
        if ($scope.searchMap.pageNo == $scope.resultMap.totalPages) {
            return true;
        } else {
            return false;
        }
    };


    //设置排序规则
    $scope.sortSearch = function (sortField, sort) {
        $scope.searchMap.sortField = sortField;
        $scope.searchMap.sort = sort;
        $scope.search()
    }


    //判断关键字是不是品牌
    $scope.keywordsIsBrand = function () {
        //循环遍历品牌判断
        for (var i = 0; i < $scope.resultMap.brandList.length; i++) {
            //判断关键字是否包含品牌
            if ($scope.searchMap.keywords.indexOf($scope.resultMap.brandList[i].text) >= 0) {
                return true;
            }
        }
        return false;
    };


    //加载查询字符串
    $scope.loadKeywords = function () {
        $scope.searchMap.keywords = $location.search()['keywords'];
        if (!$scope.searchMap.keywords == null && !$scope.searchMap.keywords == "") {
            $scope.search();
        }

    }


});