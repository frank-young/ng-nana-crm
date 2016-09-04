/********************************************************************************************************************
 *                                                      项目详情页
 ********************************************************************************************************************/

angular.module("businessdetialMoudle", []).controller('BusinessDetialCtrl', 
    ['$scope','$http', '$state','$alert','$stateParams','businessData','customerData',
    function($scope, $http, $state,$alert,$stateParams,businessData,customerData) {
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
        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;

        /* 推进状态*/
        $scope.status = data.status;
    })
    /* 客户详情对象 */
    businessData.getIdData($stateParams.id).then(function(data){
        $scope.customer=data.business;   
    })
    /* 自定义 -- 公司*/
    customerData.getData().then(function (data) {
        var company=[];
        for(var i in data.customers){
            company.push({
                value:i,
                id:data.customers[i]._id,
                label:data.customers[i].companyName,
                peoplename:data.customers[i].peoples[0].name,
                peopleemail:data.customers[i].peoples[0].email
            })
        }
        $scope.company = company;
        $scope.peoplename = company[$scope.customer.company].peoplename;
        $scope.peopleemail = company[$scope.customer.company].peopleemail;
    })
    
    $scope.saveData = function(value){
        if($scope.customer.isEdit === true){
            businessData.updateData(value).then(function(data){
                $scope.changeAlert(data.msg)
            })    
        }
        
        var id,
            cusdata;
        for(var i in $scope.company){
            if($scope.company[i].value == value.company){
                id = $scope.company[i].id
            }
        }
        customerData.getIdData(id).then(function(data){
            cusdata = data.customer
            var mark = 0;
            for(var x in cusdata.business){
                if (cusdata.business[i].id == value.id) {
                    mark = 1;
                    return ;
                }
            }
            if(mark == 0){
                console.log('不存在')
                cusdata.business.push(value)
                customerData.updateData(cusdata)
            }else{
                console.log('存在')
                for(var j in cusdata.business){
                    if (cusdata.business[i].id == value.id) {
                        cusdata.business[i] = value
                    }
                }
                customerData.updateData(cusdata)
            }
        })
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

    /* 选择项目状态*/
    $scope.checkStatus = function(value){
        $scope.customer.status = value;
        var date = new Date();
        var businessStatus = {
            "bname":$scope.customer.bname,
            "people":$scope.customer.people,
            "status":$scope.customer.status,
            "selectPerson":"0", 
            "time":date,
        }
        $scope.customer.business.push(businessStatus);
    }
    $scope.compareStatus = function(e){
        return e.value >$scope.customer.status;
    }

    /***************************** 以下是添加日程弹窗 *****************************/

    
    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":null,"untilDate":null,"remind":[{"date":null}]};     //初始空数据
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
        $scope.schedule = {"fromDate":null,"untilDate":null,"remind":[{"date":null}]};     //初始空数据
    }

    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
    
}]);