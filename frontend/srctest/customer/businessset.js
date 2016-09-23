/********************************************************************************************************************
 *                                                      客户设置页面
 ********************************************************************************************************************/

angular.module("customerSettingMoudle", ['ng-sortable'])
.controller('CustomerSettingCtrl', 
    ['$scope', '$http', '$state','groupData','tagData','$alert',
    function($scope, $http, $state,groupData,tagData,$alert) {
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
        /* 客户标签 颜色*/
        $scope.colors = data.colors;

    })

    /* 分组 */
    groupData.getData().then(function (data) {
        $scope.groups = data.groups;

    });

    /* 客户标签 */
    tagData.getData().then(function (data) {
        $scope.tags = data.tags;

    });

    /****************************** 客户分组 ************************************/
    /* 添加分组信息 */
    
    $scope.addGroup = function(){
        var value = $scope.groups.length;
        groupData.addData({"value":value,"isEdit":true,"label":'分组名称'}).then(function(data){
                $scope.changeAlert(data.msg);
            })
        groupData.getData().then(function (data) {
            $scope.groups = data.groups;

        });
    }
    /* 保存单条分组信息 */
    $scope.saveGroup = function(value){

        if(value.isEdit == true){
            groupData.updateData(value).then(function (data) {
                $scope.changeAlert(data.msg);
            });
        }
    }
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
    /* 删除单条分组信息 */
    $scope.deleteGroup = function(value){
        var deleteConfirm = confirm('您确定要删除这个分组吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.groups);
            $scope.groups.splice(index,1);   //删除
            groupData.deleteData(value).then(function(data){
                $scope.changeAlert(data.msg);
            })
            /* 更新数据value索引值 */
            $scope.groups.forEach( function(element, index) {
                element.value = index;
                groupData.updateData(element);
            });
        }
    }
    // /* 监听items ，发送数据 */
    // $scope.$watch('groups', function(newVal, oldVal) {
    //     if (newVal !== oldVal) {
    //        //向服务器发请求，顺序已改变
    //        // console.log(newVal)
    //     }
    // }, true);

    /****************************** 客户标签 ************************************/

    /* 添加标签信息 */
    $scope.addTag = function(){
        var value = $scope.tags.length;

        tagData.addData({"value":value,"isEdit":true,"text":"标签名称","color":"primary"}).then(function(data){
                $scope.changeAlert(data.msg);
            })
        tagData.getData().then(function (data) {
            $scope.tags = data.tags;
        });
    }
    /* 保存单条标签信息 */
    $scope.saveTag = function(value){
        if(value.isEdit == true){
            tagData.updateData(value).then(function (data) {
                $scope.changeAlert(data.msg);
            });
        } 
    }
    /* 删除单条标签信息 */
    $scope.deleteTag = function(value){
        var deleteConfirm = confirm('您确定要删除这个标签吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.tags);
            $scope.tags.splice(index,1);   //删除
            tagData.deleteData(value).then(function(data){
                $scope.changeAlert(data.msg);
            })
            /* 更新数据value索引值 */
            $scope.tags.forEach( function(element, index) {
                element.value = index;
                tagData.updateData(element);
            });
        }
    }

}]);