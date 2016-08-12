/********************************************************************************************************************
 *                                                      客户设置页面
 ********************************************************************************************************************/

angular.module("customerSettingMoudle", ['ng-sortable']).controller('CustomerSettingCtrl', function($scope, $http, $state) {
    /* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            }
        }
    }  
    /****************************** 客户设置************************************/
    $http({
        url:'data/customerSet.json',
        method:'GET'
    }).success(function(data){
        /* 分组 */
        $scope.groups = data.groups;
        /* 客户来源 */
        $scope.origins = data.origins;
        /* 项目状态 */
        $scope.status =data.status;
        /* 客户标签 */
        $scope.tags = data.tags;
        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;
        /* 客户标签*/
        $scope.tags = data.tags;
        /* 客户标签 颜色*/
        $scope.colors = data.colors;

    })
    /****************************** 客户分组 ************************************/
    /* 添加分组信息 */
    $scope.addGroup = function(){
        var value = $scope.groups.length
        $scope.groups.push({"value":value,"isEdit":false});
    }
    /* 保存单条分组信息 */
    $scope.saveGroup = function(value){
        if(value.isEdit == true){
            console.log('保存成功！')
        }
    }
    /* 删除单条分组信息 */
    $scope.deleteGroup = function(value){
        var deleteConfirm = confirm('您确定要删除这个分组吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.groups);
            $scope.groups.splice(index,1);   //删除
        }
    }
    /* 监听items ，发送数据 */
    $scope.$watch('groups', function(newVal, oldVal) {
        if (newVal !== oldVal) {
           //向服务器发请求，顺序已改变
           console.log(newVal)
        }
    }, true);

    /****************************** 客户标签 ************************************/

    /* 添加标签信息 */
    $scope.addTag = function(){
        var value = $scope.tags.length
        $scope.tags.push({"value":value,"isEdit":false,"color":"primary"});
    }
    /* 保存单条标签信息 */
    $scope.saveTag = function(value){
        if(value.isEdit == true){
            console.log('保存成功！')
        }
    }
    /* 删除单条标签信息 */
    $scope.deleteTag = function(value){
        var deleteConfirm = confirm('您确定要删除这个标签吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.tags);
            $scope.tags.splice(index,1);   //删除
        }
    }
    /* 监听items ，发送数据 */
    $scope.$watch('tags', function(newVal, oldVal) {
        if (newVal !== oldVal) {
           //向服务器发请求，顺序已改变
           console.log(newVal)
        }
    }, true);
});