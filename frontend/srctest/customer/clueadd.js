/********************************************************************************************************************
 *                                                      添加潜在客户
 ********************************************************************************************************************/

angular.module("clueaddMoudle", ['ngSanitize']).controller('ClueAddCtrl', 
    ['$scope', '$http', 'clueData','$alert',
    function($scope, $http,clueData,$alert) {
    $scope.sexs = [
            {"value":"0","label":"男"},
            {"value":"1","label":"女"}
        ];

    /* 客户设置 */
    $http({
        url:'data/customerSet.json',
        method:'GET'
    }).success(function(data){
        /* 分组 */
        $scope.groups = data.groups;
        /* 客户来源 */
        $scope.origins = data.origins;
        /* 国家/地区 */
        $scope.states = data.states;
        /* 国家/地区 */
        $scope.sts =data.sts;
        /* 客户标签 */
        $scope.tags = data.tags;
        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;
        /* 客户标签*/
        $scope.tags = data.tags;

        /* 客户标签*/
        $scope.tags = data.tags;

    })

    /* 客户详情对象 */
    $http({
        url:'data/clueadd.json',
        method:'GET'
    }).success(function(data){
        $scope.customer=data;   
    })
    $scope.saveData = function(value){
        clueData.addData(value).then(function (data) {
            $scope.changeAlert('保存成功！','');
            window.history.go(-1)
        });
    }
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
    /* 添加联系人 */
    $scope.cusadd = function(){
        $scope.customer.peoples.push({sex:'0',isImportant:false,isEdit:false});     //默认未收藏联系人，可编辑状态
    }
    /* 删除联系人 */
    $scope.cusdel = function(index){
        if ($scope.customer.peoples.length >1){
            var deleteConfirm = confirm('您确定要删除此联系人？');
            if(deleteConfirm){
                $scope.customer.peoples.splice(index,1);
            }
        }
    }
    /* 添加日程 */
    $scope.scheadd = function(){
        $scope.customer.schedule.unshift({remind:[{date:''}]});
        $scope.openSchedule(0);
    }
    /* 删除日程 */
    $scope.schedel = function(index,value){
        var deleteConfirm = confirm('您确定要删除此日程？');
        if(deleteConfirm){
            $scope.customer[value].splice(index,1);
        }
    }
    /* 完成日程 */
    $scope.schecomp = function(index,value){
        var now_date = new Date();
        var completeData = $scope.customer[value][index];
        completeData.nowDate = now_date.getTime();
        $scope.customer.schedule_complete.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }
    /* 撤销日程 */
    $scope.schereply = function(index,value){
        $scope.customer.schedule.unshift($scope.customer[value][index]);
        $scope.customer[value].splice(index,1);
    }

    /***************************** 以下是添加日程弹窗 *****************************/

    
    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":null,"untilDate":null,"remind":[{"date":null,}]};     //初始空数据
    /* 客户设置 */
    $http({
        url:'data/person.json',
        method:'GET'
    }).success(function(data){
        /*  添加日程 --联系人 */
        $scope.person = data.person;
    })
    /* 保存数据，并且添加到原始数据里 */
    $scope.saveSchedule = function(value){
        value.schedule.unshift($scope.schedule);
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleSchedule = function(){  
        $scope.schedule = {"fromDate":null,"untilDate":null,"remind":[{"date":null}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.schedule.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.schedule.remind.length >1){
            $scope.schedule.remind.splice(index,1);
        }
    }

    /***************************** 以下是修改日程弹窗 *****************************/

    /*日程单条数据 */
    var editIndex;
    $scope.editSchedule = function(value){
        $scope.scheduleModal = angular.copy(value);
        editIndex = $scope.customer.schedule.indexOf(value)
    }
    $scope.saveEditSchedule = function(value){
        value.schedule[editIndex] = $scope.scheduleModal;
        /* 发送数据到服务器 */
        $http({
                method: 'POST',
                url: 'http://localhost/angularcode/src/',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data: value
            }).success(function(data){
               
            })
            
        $scope.cancleEditSchedule();    
    }
    /* 添加日程提醒 */
    $scope.remindaddModal = function(){
        $scope.scheduleModal.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddelModal = function(index){
        if ($scope.scheduleModal.remind.length >1){
            $scope.scheduleModal.remind.splice(index,1);
        }
    }
    /* 清空日程弹出框数据 */
    $scope.cancleEditSchedule = function(){  
        $scope.schedule = {"fromDate":null,"untilDate":null,"remind":[{"date":null,}]};     //初始空数据
    }

    
}]);