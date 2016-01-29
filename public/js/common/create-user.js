/**
 * Created by vikashs on 24-01-2016.
 */

angular.module("myApp",[]).config(function(){

}).controller("CreateUser",function($scope,$http){
    $scope.name = "";
    $scope.age = "";
    $scope.submitForm = function(){
        $http({
            url:"/createUser?name="+
                $scope.name+
                "&email="+$scope.email +
                "&mobile="+$scope.mobile+
                "&password="+$scope.password,
            type:"GET"
        }).then(function(data){
            if(data.data.success == true){
                $scope.pageNo = 1;
                $scope.name = "";
                $scope.email = "";
                $scope.mobile = "";
                $scope.password = "";
                $scope.getAllRows();
            }
            else{
                alert("error");
            }

        })
    }
    $scope.data = {
        users:[]
    };
    $scope.pageNo = 1;
    $scope.next = function(){
        $scope.pageNo += 1;
        $scope.getAllRows()
    }
    $scope.pre = function(){
        $scope.pageNo -= 1;
        $scope.getAllRows()
    }
    $scope.getAllRows = function(){
        $http({
            url:"/users?pageNo="+$scope.pageNo,
            type:"GET"
        }).then(function(data){
            $scope.data.users = data.data.results;
        })
    }
    $scope.login = function(){
        $http({
            url:"/login",
            method:"post",
            data:{username:$scope.email,password:$scope.password}
        }).success(function(data){
            if(data == "success"){
                location.replace("/");
            }
        })
    }
    console.log("create App")
})
