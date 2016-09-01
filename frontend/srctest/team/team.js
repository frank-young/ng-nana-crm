/********************************************************************************************************************
 *                                                      成员列表页面
 ********************************************************************************************************************/

angular.module("teamMoudle", []).controller('TeamCtrl', 
    ['$scope', '$http', '$state','$alert','settingData',
    function($scope, $http, $state,$alert,settingData) {

    /* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            } 
        }
    }

    settingData.getData().then(function(data){
    	$scope.user = data.users
    })

    /*分页*/
    $scope.itemsPerPage = 5;
    // $scope.totalItems = 6;
    $scope.currentPage = 1;

    /***************************** 以下是顶部导航栏批量操作 **************************************/
    /* 多选框选择 */
    $scope.checkArr = [];
    $scope.isChecked = function(value){
        if(value.isChecked){        //通过判断是否选中
            $scope.checkArr.push(value);
        }else{
            var index = findIndex(value,$scope.checkArr);
            // var index = $scope.checkArr.indexOf(value);
            if(index != -1){
                $scope.checkArr.splice(index,1);
            }
        }
        
    }
    /* 删除成员 */
    $scope.deleteTeam = function(value){
        var deleteConfirm = confirm('您确定要删除这位成员吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.team);
            $scope.team.splice(index,1);   //删除
            customerData.updateData(value);
        }
    }
    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.team){
            $scope.team[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.team){
                $scope.checkArr.push($scope.team[i]);
                $scope.team[i].isChecked = true;
            }
    }
    /* 删除栏目 ----批量操作 */
    $scope.deleteTeam = function(value){
        var deleteConfirm = confirm('您确定要删除这位成员吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.team);
                $scope.team[index].isChecked = false;  //去掉标记位
                $scope.team.splice(index,1);   //删除
                customerData.updateData(value[i]);
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        }
    }
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
}])


