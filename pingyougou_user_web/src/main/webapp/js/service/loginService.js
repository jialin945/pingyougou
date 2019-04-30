app.service("loginService", function ($http) {
    this.showName=function () {
        //读取列表数据绑定到表单中
        //return $http.get("../login/name.do");  //都可以
        return $http.get("login/name.do");
    }
});