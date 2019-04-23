//控制层
////商品控制层（商家后台）
app.controller('goodsController', function ($scope, $controller, $location, goodsService, uploadService, itemCatService, typeTemplateService) {

    $controller('baseController', {$scope: $scope});//继承

    //读取列表数据绑定到表单中  
    $scope.findAll = function () {
        goodsService.findAll().success(
            function (response) {
                $scope.list = response;
            }
        );
    }

    //分页
    $scope.findPage = function (page, rows) {
        goodsService.findPage(page, rows).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    };


    //查询实体
    $scope.findOne = function () {
        //#?id=id&url=url
        var id = $location.search()['id'];//获取参数值
        if (id == null) {
            return null;
        }
        goodsService.findOne(id).success(
            function (response) {
                $scope.entity = response;
                //向富文本编辑器添加商品介绍
                editor.html($scope.entity.goodsDesc.introduction);
                //显示图片列表 字符串转为json对象
                $scope.entity.goodsDesc.itemImages = JSON.parse($scope.entity.goodsDesc.itemImages);
                //显示扩展信息
                //$scope.entity.goodsDesc.customAtrributeItems = JSON.parse($scope.entity.goodsDesc.customAttributeItems);
                $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.entity.goodsDesc.customAttributeItems);
                //规格
                $scope.entity.goodsDesc.specificationItems = JSON.parse($scope.entity.goodsDesc.specificationItems);

                //[spec:{"机身内存":"16G","网络":"电信3G"}] 数组  spec是列名
                //SKU 列表规格列转换
                for (var i = 0; i < $scope.entity.itemList.length; i++) {
                    $scope.entity.itemList[i].spec = JSON.parse($scope.entity.itemList[i].spec);
                }


            }
        );


    };


    //根据规格名称和选项名称返回是否被勾选


    //查询实体1
    $scope.findOne1 = function (id) {
        goodsService.findOne(id).success(
            function (response) {
                $scope.entity = response;
            }
        );
    }

    //保存
    $scope.save = function () {
        var serviceObject;//服务层对象
        if ($scope.entity.goods.id != null) {//如果有ID
            serviceObject = goodsService.update($scope.entity); //修改
        } else {
            //debugger;
            serviceObject = goodsService.add($scope.entity);//增加
        }

        //提取文本编辑器的值
        $scope.entity.goodsDesc.introduction = editor.html();

        serviceObject.success(
            function (response) {

                if (response.success) {

                    //跳转到商品列表页
                    location.href = "goods.html";

                    //重新查询
                    //$scope.reloadList();//重新加载
                    /*alert("新增成功");
                    $scope.entity = {};*/
                    //editor.html("");//清空富文本编辑器

                } else {
                    alert("1111111111");
                    alert(response.message);

                }
            }
        );
    }


    //批量删除
    $scope.dele = function () {
        //获取选中的复选框
        goodsService.dele($scope.selectIds).success(
            function (response) {
                if (response.success) {
                    $scope.reloadList();//刷新列表
                    $scope.selectIds = [];
                }
            }
        );
    }

    $scope.searchEntity = {};//定义搜索对象

    //搜索
    $scope.search = function (page, rows) {
        goodsService.search(page, rows, $scope.searchEntity).success(
            function (response) {
                $scope.list = response.rows;
                $scope.paginationConf.totalItems = response.total;//更新总记录数
            }
        );
    };


    //上传图片
    //$scope.image_entity={};
    $scope.uploadFile = function () {
        uploadService.uploadFile().success(
            function (response) {
                if (response.success) {//如果上传成功，取出 url
                    //debugger;
                    alert("上传成功");
                    $scope.image_entity.url = response.message;//设置文件地址
                } else {
                    //message 注意 message
                    alert(response.message);
                }
            }
        );
    };

    //定义页面实体结构
    $scope.entity = {goods: {}, goodsDesc: {itemImages: [], specificationItems: []}};

    //添加图片列表
    $scope.add_image_entity = function () {
        $scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    }

    //列表中移除图片
    $scope.remove_image_entity = function (index) {
        $scope.entity.goodsDesc.itemImages.splice(index, 1);
    };


    //读取一级分类
    $scope.selectItemCat1List = function () {
        itemCatService.findByParentId(0).success(
            function (response) {
                $scope.itemCat1List = response;
            }
        );
    };


    //读取二级分类
    //$watch 方法用于监控某个变量的值，当被监控的值发生变化，就自动执行相应的函数。
    $scope.$watch('entity.goods.category1Id', function (newValue, oldValue) {
        //alert(newValue);
        //根据选择的值，查询二级分类
        itemCatService.findByParentId(newValue).success(
            function (response) {
                $scope.itemCat2List = response;
            }
        );
    });

    //根据选择的值，查询3级分类
    $scope.$watch('entity.goods.category2Id', function (newValue, oldValue) {
        itemCatService.findByParentId(newValue).success(
            function (response) {
                $scope.itemCat3List = response;
            }
        );
    });


    //三级分类选择后 读取模板 ID
    $scope.$watch('entity.goods.category3Id', function (newValue, oldValue) {
        itemCatService.findOne(newValue).success(
            function (response) {
                //更新模板ID
                $scope.entity.goods.typeTemplateId = response.typeId;
            }
        );
    });


    //模板 ID 选择后 更新品牌列表
    $scope.$watch('entity.goods.typeTemplateId', function (newValue, oldValue) {
        typeTemplateService.findOne(newValue).success(
            function (response) {
                //获取类型模板
                $scope.typeTemplate = response;
                alert($scope.typeTemplate.brandIds);
                //获取品牌列表
                $scope.typeTemplate.brandIds = JSON.parse($scope.typeTemplate.brandIds);

                //扩展属性 在用户更新模板 ID 时，读取模板中的扩展属性赋给商品的扩展属
                //性
                if ($location.search()['id'] == null) {//如果是增加商品

                    $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.typeTemplate.customAttributeItems);
                }

            }
        );

        //查询规格列表  是 map集合
        typeTemplateService.findSpecList(newValue).success(
            function (response) {
                $scope.specList = response;
            }
        );

        //前面变量已经声明
        //$scope.entity={goodsDesc:{itemImages:[],specificationItems:[]}};
        //entity.goodsDesc.specificationItems=[{“attributeName”:”规格名称”,”attributeValue”:[“规格选项 1”,“规格选项 2”.... ] } , .... ]

        $scope.updateSpecAttribute = function ($event, name, value) {
            var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems, "attributeName", name);
            if (object != null) {//对象存在
                if ($event.target.checked) {//是勾选状态
                    object.attributeValue.push(value);
                } else {//取消勾选
                    object.attributeValue.splice(object.attributeValue.indexOf(value), 1);
                    //如果选项都取消了，将此条记录移除
                    if (object.attributeValue.length == 0) {
                        $scope.entity.goodsDesc.specificationItems.splice($scope.entity.goodsDesc.specificationItems.indexOf(object), 1);
                    }
                }

            } else {//对象不存在
                //$scope.entity.goodsDesc.specificationItems=[{'attributeName':name,'attributeValue':value}];
                $scope.entity.goodsDesc.specificationItems.push({'attributeName': name, 'attributeValue': [value]});
            }
        };


        $scope.updateSpecAttribute1 = function ($event, name, value) {
            //调用方法查询是否有这个对象
            var object = $scope.searchObjectByKey(entity.goodsDesc.specificationItems, 'attributeName', name);
            if (object != null) {
                if ($event.target.checked) {//勾选状态
                    object.attributeValue.push(value);
                } else {//没有勾选
                    object.attributeValue.splice(object.attributeValue.indexOf(value), 1);
                    if (object.attributeValue.length == 0) {//直接将这个对象移除
                        $scope.entity.goodsDesc.specificationItems.splice($scope.entity.goodsDesc.specificationItems.indexOf(object), 1);
                    }
                }
            } else {
                $scope.entity.goodsDesc.specificationItems.push({'attributeName': name, 'attributeValue': value});
            }
        };



        //创建 SKU 列表
        $scope.createItemList = function () {
            //初始化集合
            $scope.entity.itemList = [{spec: {}, price: 0, num: 99999, status: '0', isDefault: '0'}];
            var items = $scope.entity.goodsDesc.specificationItems;
            for (var i = 0; i < items.length; i++) {
                //调用addColumn方法 将结果赋值给entity.itemList,
                $scope.entity.itemList = addColumn($scope.entity.itemList, items[i].attributeName, items[i].attributeValue);
            }
        };

        //添加列值
        addColumn = function (list, columnName, columnValues) {
            var newList = [];
            for (var i = 0; i < list.length; i++) {
                var oldRow = list[i];
                for (var j = 0; j < columnValues.length; j++) {
                    //深克隆
                    var newRow = JSON.parse(JSON.stringify(oldRow));
                    newRow.spec[columnName] = columnValues[j];
                    //newRow.spec['username'] = 'zhangsan';
                    newList.push(newRow);
                }
            }
            return newList;
        };


        addColumn1=function (list, columnName, columnValues) {
            var newList;
            for(var i = 0; i < list.length; i++) {
                var oldRow = list[i];
                for(var j = 0; j < columnValues.length; j++) {
                    var newRow = JSON.parse(JSON.stringify(oldRow));
                    newRow.spec[columnName] = columnValues[j];
                    newList.push(newRow);
                }
            }
            return newList;
        };


    });

    //商品状态
    $scope.status = ['未审核', '已审核', '审核通过', '关闭'];//0,1,2,3 下标



    //定义商品分类列表
    $scope.itemCatList = [];
    //加载商品分类列表
    $scope.findItemCatList = function () {
        itemCatService.findAll().success(
            function (response) {
                for (var i = 0; i < response.length; i++) {
                    //因为我们需要根据分类 ID 得到分类名称，所以我们将返回的分页结果以数组形式再次封装
                    $scope.itemCatList[response[i].id] = response[i].name;
                }
            }
        );
    };


    //根据规格名称和选项名称返回是否被勾选
    //tb_good_desc 表 列 specification_items
    //[{"attributeName":"网络制式","attributeValue":["移动3G","移动4G"]},{"attributeName":"屏幕尺寸","attributeValue":["6寸","5.5寸"]}]
    $scope.checkAttributeValue = function (specName, optionValue) {
        var items = $scope.entity.goodsDesc.specificationItems;
        var object = $scope.searchObjectByKey(items, 'attributeName', specName);

        if (object != null) {
            //索引位置从0开始
            if (object.attributeValue.indexOf(optionValue) >= 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }

    };

    //上架状态
    $scope.marketable = ['下架', '上架'];
    $scope.updateMarketable=function (mark) {
        //var mark=$location.search()['isMarketable'];
        goodsService.updateMarketable($scope.selectIds,mark).success(
            function (response) {
                if(response.success){

                    alert(response.message);

                    window.location.reload();
                }else{
                    alert(response.message)
                }
            }
        );
    };


});
