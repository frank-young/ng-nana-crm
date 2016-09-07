/********************************************************************************************************************
 *                                                      添加潜在客户
 ********************************************************************************************************************/

angular.module("clueaddMoudle", ['ngSanitize']).controller('ClueAddCtrl', 
    ['$scope', '$http', 'clueData','$alert','groupData','tagData',
    function($scope, $http,clueData,$alert,groupData,tagData) {
    $scope.sexs = [
            {"value":"0","label":"男"},
            {"value":"1","label":"女"}
        ];

    /* 客户设置 */
    $http({
        url:'data/customerSet.json',
        method:'GET'
    }).success(function(data){
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
        $scope.colors = data.colors;

    })

    /* 年分－－生日使用 */
    $scope.birthday = {
        year:[],
        month:[],
        day:[]
    }

    var dateTool = {
        setYear:function (){
            var date = new Date(),
                year = date.getFullYear(),
                arr = [];
            
            for(var i = 1970;i<=year;i++){
                arr.push({value:i});

            } 
            console.log(arr)
            return arr;
        },
        setMonth:function (){
            var arr = [];
            
            for(var i = 1;i<=12;i++){
                if(i<10){
                    i = "0"+i
                }
                arr.push({value:i});
            } 
            return arr;
        },
        setDay:function (){
            var arr = [];
            
            for(var i = 1;i<=31;i++){
                if(i<10){
                    i = "0"+i
                }
                arr.push({value:i});
            } 
            return arr;
        } 
    }
    
    $scope.birthday.year = angular.copy(dateTool.setYear());
    $scope.birthday.month = angular.copy(dateTool.setMonth());
    $scope.birthday.day = angular.copy(dateTool.setDay());

    /* 分组 */
    groupData.getData().then(function (data) {
        $scope.groups = data.groups;

    });
    /* 客户标签*/
    tagData.getData().then(function (data) {
        $scope.tags = data.tags;

    });
    /* 客户详情对象 */
    if(localStorage.clue){
        $scope.customer = JSON.parse(localStorage.clue)
    }else{
        $http({
            url:'data/clueadd.json',
            method:'GET'
        }).success(function(data){
            $scope.customer=data;   
        })
    }

    /* 本地储存 */
    var time = setInterval(function(){
        localStorage.clue= JSON.stringify($scope.customer);
    }, 10000);

    $scope.saveData = function(value){
        clueData.addData(value).then(function (data) {
            $scope.changeAlert(data.msg);
            window.history.go(-1);
            localStorage.removeItem("clue");
            console.log(time)
            clearInterval(time);
        });
    }
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:3});
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
                customerData.updateData($scope.customer).then(function(){
            $scope.changeAlert("操作成功！");
        });
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
        clueData.updateData(value).then(function(){
            $scope.changeAlert("操作成功！");
        });
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
    /* 添加分组 */
    $scope.saveGroup = function(value){
         
        var val = $scope.groups.length;
        var msgadd = {
            "value":val,
            "label":value,
            "isEdit":true
        }

        groupData.addData(msgadd).then(function(data){
            $scope.changeAlert(data.msg);
        });
        groupData.getData().then(function (data) {
            $scope.groups = data.groups;

        });
    }
    /* 添加标签 */
    $scope.saveTag = function(value){
        color = "primary" || value.color;
        var val = $scope.tags.length;
        var msgadd = {
            "value":val,
            "text":value.text,
            "color":color,
            "isEdit":true
        }

        tagData.addData(msgadd).then(function(data){
            $scope.changeAlert(data.msg);
        });
        tagData.getData().then(function (data) {
            $scope.tags = data.tags;

        });
    }

}]);

