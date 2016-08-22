/********************************************************************************************************************
 *                                                      项目列表页
 ********************************************************************************************************************/
angular.module("businessMoudle", []).controller('BusinessCtrl', 
    ['$scope', '$http', '$modal','businessData',
    function($scope, $http, $modal,businessData) {
    /* 顶部固定按钮 */
    $scope.pinShow = false;
    /* 栏目按钮显示隐藏 */
    $scope.show = false;
    $scope.allShow = false;
    $scope.pinShowFunc = function(){
        $scope.pinShow = !$scope.pinShow;
    }
    /* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            }
        }
    }    
    /*分页*/
    $scope.itemsPerPage = 5;
    // $scope.totalItems = 6;
    $scope.currentPage = 1;

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

        $scope.status = data.status;
    })
    $http({
        url:'data/company.json',
        method:'GET'
    }).success(function(data){
        $scope.company = data.company;
    })

    $http({
        url:'data/person.json',
        method:'GET'
    }).success(function(data){
        /*  添加日程 --联系人 */
        $scope.person = data.person;
    })
    
    /*项目*/
    businessData.getData().then(function(data){
        $scope.business=data.businesss;
    })
    
    /* 固定/取消固定 位置  ----栏目位置*/
    $scope.pinItem = function(value){
        value.isTop = !value.isTop;
        businessData.updateData(value)
    } 
    /* 选择查看固定位置 */
    $scope.pinSortFunc = function(value){
        $scope.pinSort = value;
    }
    /* 删除栏目 */
    $scope.deleteBusines = function(value){
        var deleteConfirm = confirm('您确定要删除项目信息吗？');
        if(deleteConfirm){
                var index = findIndex(value,$scope.business);
                $scope.business.splice(index,1);   //删除
                businessData.deleteData(value)
        }
    }

    /* 选择项目状态*/
    $scope.checkStatus = function(index,value){
        value.status = index;
        var date = new Date();
        var businessStatus = {
            "bname":value.bname,
            "people":value.people,
            "status":value.status,
            "selectPerson":"0", 
            "time":date,
        }
        value.business.push(businessStatus);
        businessData.updateData(value)
    }

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

    /***************************** 以下是顶部导航栏批量操作 **************************************/

    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.business){
            $scope.business[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.business){
                $scope.checkArr.push($scope.business[i]);
                $scope.business[i].isChecked = true;
            }
    }
    /* 固定 ----批量操作*/
    $scope.surePin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.business);
            $scope.business[index].isTop = true;      //固定
            $scope.business[index].isChecked = false;  //去掉标记位，也就是去掉勾
            businessData.updateData(value[i])
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 取消固定 ----批量操作*/
    $scope.cancelPin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.business);
            $scope.business[index].isTop = false;      //取消固定
            $scope.business[index].isChecked = false;  //去掉标记位，也就是去掉勾
            businessData.updateData(value[i])
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }

    /* 删除栏目 ----批量操作 */
    $scope.deleteBusiness = function(value){
        var deleteConfirm = confirm('您确定要删除项目信息吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.business);
                $scope.business[index].isChecked = false;  //去掉标记位
                $scope.business.splice(index,1);   //删除
                businessData.deleteData(value[i])
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        }
    }

    /***************************** 以下是添加日程弹窗 *****************************/

    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":null,"untilDate":null,"remind":[{"date":null}]};     //初始空数据
    /* 保存数据，并且添加到原始数据里 */
    $scope.saveSchedule = function(value){
        value.schedule.unshift($scope.schedule);
        /* 发送数据到服务器 */
        businessData.updateData(value)
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

}])