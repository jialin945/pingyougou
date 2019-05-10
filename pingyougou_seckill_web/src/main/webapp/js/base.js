var app=angular.module('pinyougou',[]);//定义品优购模板

//定义过滤器 相当于全局方法
/*$sce 服务写成过滤器*/
//'$sce' 模块加载进来 $sce 参数传递进去
app.filter('trustHtml',['$sce',function ($sce) {
    //data 传入参数被过滤的内容
    return function (data) {
        //返回的是过滤后的内容(信任HTML的转换)
        return $sce.trustAsHtml(data);
    };
}]);

