/**
 * Created by vikashs on 28-01-2016.
 */

angular.module("myApp",['ngMaterial']).config(function(){

}).controller("NominateUser",function($scope,$http){
    $scope.nominationTypes = [{
        label:"Nominate for Friendly",
        value:"",
        id:"Friendly",
        selectedUsers:[]
    }]
    $scope.searchText = "";
    $scope.allUsers = "";
    $scope.searchUser = function(item){
        $http({
            url:"/users?searchTerm="+item.value,
            type:"GET"
        }).success(function(data){
            $scope.allUsers = data;
        })
    };

    $scope.onSelectItem = function(obj,item){
        if(item && obj.selectedUsers.length < 2){
            obj.selectedUsers.push(item);
        }
        obj.value = "";
    }

    $scope.submitForm = function(){
        var ids = [];
        for(var i=0;i<$scope.allUsers.length;i++){
            if($scope.allUsers[i].isChecked){
                ids.push($scope.allUsers[i].id)
            }
        }
        var data = JSON.stringify({ friendly:ids});
        if(ids.length > 0){
            $http({
                url:"/savepoint",
                method:"post",
                data:{friendly:ids}
            }).success(function(data){
                $scope.allUsers = data;
            })
        }
        else{
            alert("please select");
        }
    }
});

/*
{
    label:"Nominate for Resourceful",
        value:"",
    id:"Resourceful"
},
{
    label:"Nominate for Enthusiastic",
        value:"",
    id:"Enthusiastic"
},
{
    label:"Nominate for Dependable",
        value:"",
    id:"Dependable"
}*/
