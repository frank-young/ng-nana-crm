/**
 * 左侧 menu 菜单
 */

angular.module('navleftMoudle',[]).controller('NavleftCtrl', 
	['$scope', '$http','settingData',
	function ($scope, $http,settingData) {
		var menus = [
		{
			icon:'fa fa-paper-plane-o',
			title:'圈内信',
			role:0,
			subs:[
				{
					text:'圈内信',
					link:''
				}
			]
		},
		{
			icon:'fa fa-users',
			title:'客户管理',
			role:0,
			subs:[
				{
					text:'潜在客户',
					link:'web.clue'
				},
				{
					text:'客户',
					link:'web.customer'
				},
				{
					text:'项目',
					link:'web.business'
				},
				{
					text:'客户设置',
					link:'web.customerSetting'
				},

			]
		},
		{
			icon:'fa fa-diamond',
			title:'产品管理',
			role:0,
			subs:[
				{
					text:'全部产品',
					link:'web.products'
				},
				{
					text:'产品分类',
					link:'web.productsCate'
				},
				{
					text:'新建产品',
					link:'web.productsAdd'
				},

			]
		},
		{
			icon:'fa fa-file-pdf-o',
			title:'报价单',
			role:0,
			subs:[
				{
					text:'报价单总览',
					link:'web.quotation'
				},
				{
					text:'新建报价单',
					link:'web.quotationAdd'
				},
				{
					text:'报价单设置',
					link:'web.quotationSetting'
				}
			]
		},
		{
			icon:'fa fa-phone',
			title:'通讯录',
			role:0,
			subs:[
				{
					text:'全部联系人',
					link:'web.people'
				}
			]
		},
		{
			icon:'fa fa-meh-o',
			title:'团队成员',
			role:10,
			subs:[
				{
					text:'成员列表',
					link:'web.team'
				},
				{
					text:'新建成员',
					link:'web.teamAdd'
				}
			]
		},

	]

	settingData.getRbac().then(function(data){
		$scope.role = data.rbac
		$scope.menus = [];
		menus.map(function (menu) {
			if(menu.role <= $scope.role){
				$scope.menus.push(menu)
			}
		 	return $scope.menu; 
		});
	})

}]);;/**
 * 顶部导航
 * 
 */

angular.module('navtopMoudle',[]).controller('NavtopCtrl', function ($scope) {


});;/********************************************************************************************************************
 *                                                      项目列表页
 ********************************************************************************************************************/
angular.module("businessMoudle", []).controller('BusinessCtrl', 
    ['$scope', '$http', '$modal','businessData','groupData','tagData','customerData',
    function($scope, $http, $modal,businessData,groupData,tagData,customerData) {
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
        /* 客户来源 */
        $scope.origins = data.origins;
        /* 客户标签 */
        $scope.tags = data.tags;
        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;

        $scope.status = data.status;
    })
    /* 自定义 -- 公司*/
    customerData.getData().then(function (data) {
        var company=[];
        for(var i in data.customers){
            company.push({
                value:i,
                id:data.customers[i]._id,
                label:data.customers[i].companyName
            })
        }
        $scope.company = company
    })

    /* 分组 */
    groupData.getData().then(function (data) {
        $scope.groups = data.groups;

    });
    /* 客户标签*/
    tagData.getData().then(function (data) {
        $scope.tags = data.tags;

    });
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

}]);/********************************************************************************************************************
 *                                                      添加项目页
 ********************************************************************************************************************/

angular.module("businessaddMoudle", []).controller('BusinessAddCtrl', 
    ['$scope','$http', '$state', '$stateParams','businessData','$alert','groupData','tagData','customerData',
    function($scope, $http, $state, $stateParams,businessData,$alert,groupData,tagData,customerData) {
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
        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;
        /* 推进状态*/
        $scope.status = data.status;
    })
    // $http({
    //     url:'data/person.json',
    //     method:'GET'
    // }).success(function(data){
    //     /*  添加日程 --联系人 */
    //     $scope.person = data.person;
    // })

    /* 自定义 -- 公司*/
    customerData.getData().then(function (data) {
        var company=[];
        for(var i in data.customers){
            company.push({
                value:i,
                id:data.customers[i]._id,
                label:data.customers[i].companyName
            })
        }
        $scope.company = company
    })

    /* 初始化项目 -- 带本地储存*/
    if(localStorage.business){
        $scope.customer = JSON.parse(localStorage.business)
    }else{
        $http({
            url:'data/businessadd.json',
            method:'GET'
        }).success(function(data){
            $scope.customer=data;
        })
    }

    /* 本地储存 */
    var time = setInterval(function(){
        localStorage.business= JSON.stringify($scope.customer);
    },6000);

    /* 分组 */
    groupData.getData().then(function (data) {
        $scope.groups = data.groups;

    });
    /* 客户标签*/
    tagData.getData().then(function (data) {
        $scope.tags = data.tags;

    });
    $scope.saveData = function(value){
        businessData.addData(value).then(function (data) {
            $scope.changeAlert(data.msg);
            window.history.go(-1)
            localStorage.removeItem("business");
            clearInterval(time);
            
        })
    }
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
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
    }
    $scope.compareStatus = function(e){
        return e.value >$scope.customer.status;
    }

    /***************************** 以下是添加日程弹窗 *****************************/

    
    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
    /* 保存数据，并且添加到原始数据里 */
    $scope.saveSchedule = function(value){
        value.schedule.unshift($scope.schedule);  
        $scope.cancleSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleSchedule = function(){  
        $scope.schedule = {"fromDate":today,"untilDate":today,"remind":[{"date":today,}]};     //初始空数据
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
    
}]);;/********************************************************************************************************************
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
    
}]);;/********************************************************************************************************************
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
        groupData.addData({"value":value,"isEdit":true,"label":'分组名称'});
        groupData.getData().then(function (data) {
            $scope.groups = data.groups;
            $scope.changeAlert(data.msg);
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
                console.log($scope.groups);
            })
            /* 更新数据value索引值 */
            $scope.groups.forEach( function(element, index) {
                element.value = index;
                groupData.updateData(element);
            });
        }
    }
    /* 监听items ，发送数据 */
    $scope.$watch('groups', function(newVal, oldVal) {
        if (newVal !== oldVal) {
           //向服务器发请求，顺序已改变
           // console.log(newVal)
        }
    }, true);

    /****************************** 客户标签 ************************************/

    /* 添加标签信息 */
    $scope.addTag = function(){
        var value = $scope.tags.length;

        tagData.addData({"value":value,"isEdit":true,"text":"标签名称","color":"primary"});
        tagData.getData().then(function (data) {
            $scope.tags = data.tags;
        });
    }
    /* 保存单条标签信息 */
    $scope.saveTag = function(value){
        if(value.isEdit == true){
            tagData.updateData(value).then(function (data) {
                $scope.changeAlert('操作成功！','');
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
                $scope.changeAlert('删除成功！');
            })
            /* 更新数据value索引值 */
            $scope.tags.forEach( function(element, index) {
                element.value = index;
                tagData.updateData(element);
            });
        }
    }
    /* 监听items ，发送数据 */
    $scope.$watch('tags', function(newVal, oldVal) {
        if (newVal !== oldVal) {
           //向服务器发请求，顺序已改变
           console.log(newVal)
        }
    }, true);
}]);;/********************************************************************************************************************
 *                                                      潜在客户列表页
 ********************************************************************************************************************/
angular.module('clueMoudle',[]).controller('ClueCtrl',
    ['$scope','$http','$alert','clueData','customerData','groupData','tagData',
    function ($scope,$http,$alert,clueData,customerData,groupData,tagData) {
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
        /*客户状态*/
        $scope.progress = data.progress;

    })
    /* 分组 */
    groupData.getData().then(function (data) {
        $scope.groups = data.groups;

    });
    /* 客户标签*/
    tagData.getData().then(function (data) {
        $scope.tags = data.tags;

    });
    /* 潜在客户 */
    clueData.getData().then(function (data) {
       $scope.clues=data.clues; 
    });

    /* 固定/取消固定 位置  ----栏目位置*/
    $scope.pinItem = function(value){
        value.isTop = !value.isTop;
        clueData.updateData(value)
    }
    /* 选择查看固定位置 */
    $scope.pinSortFunc = function(value){
        $scope.pinSort = value;
    }
    /*标签过滤*/
    $scope.tagSortFuc = function(value){
        $scope.tagSort = value;
    }
    /*选择客户状态*/
    $scope.selectProgress = function(value,progress){
        value.progress = progress.value;
        clueData.updateData(value)

    }
    /* 客户星级别*/
    $scope.rateFunc = function(value) {
      clueData.updateData(value)
    };
    /*转化为客户*/
    $scope.changeCustomer = function(value){
        var index = findIndex(value,$scope.clues);
        // var index = $scope.clues.indexOf(value);
        $scope.clues.splice(index,1);
        customerData.addData(value);
        clueData.deleteData(value).then(function(data){
            $scope.changeAlert('转化为客户成功！','请至<a ui-sref="web.customer" href="#/web/customer">我的客户</a>页面查看');
        })
    }
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
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
        for(var i in $scope.clues){
            $scope.clues[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.clues){
                $scope.checkArr.push($scope.clues[i]);
                $scope.clues[i].isChecked = true;
            }
    }
    /* 固定 ----批量操作*/
    $scope.surePin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.clues);
            $scope.clues[index].isTop = true;      //固定
            $scope.clues[index].isChecked = false;  //去掉标记位，也就是去掉勾
            clueData.updateData(value[i])
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 取消固定 ----批量操作*/
    $scope.cancelPin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.clues);
            $scope.clues[index].isTop = false;      //取消固定
            $scope.clues[index].isChecked = false;  //去掉标记位，也就是去掉勾
            clueData.updateData(value[i])
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 移动分组 ----批量操作 */
    $scope.moveGroup = function(value,selected){
        for(var i in value){
            var index = findIndex(value[i],$scope.clues);
            $scope.clues[index].group = selected.value;
            $scope.clues[index].isChecked = false;  //去掉标记位
            clueData.updateData(value[i])
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //关闭顶部导航栏
    }
    /* 删除栏目 ----批量操作 */
    $scope.deleteClue = function(value){
        var deleteConfirm = confirm('您确定要删除来之不易的线索信息吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.clues);
                $scope.clues[index].isChecked = false;  //去掉标记位
                $scope.clues.splice(index,1);   //删除
                clueData.deleteData(value[i])
                 
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        }
    }
    /*转化为客户 ----批量操作*/
    $scope.changeCustomerAll = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.clues);   //在clues中的索引
            $scope.clues.splice(index,1);   //删除掉这条记录            
            $scope.clues[index].isChecked = false;  //去掉标记位
        }
        /* 服务器发请求 */
        customerData.addData(value[i]);
        clueData.deleteData(value[i]).then(function(data){
            $scope.changeAlert('转化为客户成功！','请至<a ui-sref="web.customer" href="#/web/customer">我的客户</a>页面查看');
        })
        $scope.checkArr.splice(0,$scope.checkArr.length); 
        console.log($scope.checkArr)
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
        clueData.updateData(value)
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
    /* google  地理数据*/
    // $scope.getAddress = function(viewValue) {
    //     var params = {address: viewValue, sensor: false};
    //     return $http.get('http://maps.googleapis.com/maps/api/geocode/json', {params: params})
    //     .then(function(res) {
    //       return res.data.results;
    //     });
    // };

    
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
}]);





;/********************************************************************************************************************
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
    /* 客户详情对象 -- 带本地储存*/
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
    }, 6000);

    $scope.saveData = function(value){
        clueData.addData(value).then(function (data) {
            $scope.changeAlert(data.msg);
            window.history.go(-1);
            localStorage.removeItem("clue");
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

;/********************************************************************************************************************
 *                                                      潜在客户详情页
 ********************************************************************************************************************/

angular.module("cluedetialMoudle", ['ngSanitize']).controller('ClueDetialCtrl', 
    ['$scope', '$http','$state','$alert','$stateParams','clueData','groupData','tagData',
    function($scope, $http, $state,$alert,$stateParams,clueData,groupData,tagData) {
    $scope.isEdit = true;
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

        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;
        $scope.colors = data.colors;

    })
    /* 分组 */
    groupData.getData().then(function (data) {
        $scope.groups = data.groups;
    });
    /* 客户标签*/
    tagData.getData().then(function (data) {
        $scope.tags = data.tags;

    });
    /* 客户详情对象 */
    clueData.getIdData($stateParams.id).then(function(data){
        $scope.customer=data.clue;
    })
    
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
                customerData.updateData($scope.customer).then(function(data){
                    $scope.changeAlert(data.msg);
                });
            }
        }
    }
    $scope.editCustomer = function(value){
        clueData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        });
        clueData.getIdData($stateParams.id).then(function (data) {
            $scope.customer=data.clue; 
        });
    }
    /* 添加日程 */
    $scope.scheadd = function(){
        $scope.customer.schedule.unshift({remind:[{date:''}]});
        $scope.openSchedule(0);
    }
    /* 删除日程 */
    $scope.schedel = function(index,type,value){
        var deleteConfirm = confirm('您确定要删除此日程？');
        if(deleteConfirm){
            $scope.customer[type].splice(index,1);
            clueData.updateData(value).then(function(data){
                $scope.changeAlert(data.msg);
            });
        }

    }
    /* 完成日程 */
    $scope.schecomp = function(index,type,value){
        var now_date = new Date();
        var completeData = $scope.customer[type][index];
        completeData.nowDate = now_date.getTime();
        $scope.customer.schedule_complete.unshift($scope.customer[type][index]);
        $scope.customer[type].splice(index,1);
        clueData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        });
    }
    /* 撤销日程 */
    $scope.schereply = function(index,type,value){
        $scope.customer.schedule.unshift($scope.customer[type][index]);
        $scope.customer[type].splice(index,1);
        clueData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        });
    }


    /***************************** 以下是添加日程弹窗 *****************************/

    
    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":null,"untilDate":null,"remind":[{"date":null}]};     //初始空数据
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
        clueData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        });
            
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
        clueData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
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
        $scope.schedule = {"fromDate":null,"untilDate":null,"remind":[{"date":null}]};     //初始空数据
    }
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
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


}]);;/********************************************************************************************************************
 *                                                      客户列表页
 ********************************************************************************************************************/

angular.module('customerlistMoudle',[]).controller('CustomerCtrl', 
    ['$scope','$http','$alert','customerData','groupData','tagData',
    function ($scope,$http,$alert,customerData,groupData,tagData) {

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
        /*客户状态*/
        $scope.progress = data.progress;
    })
    /* 分组 */
    groupData.getData().then(function (data) {
        $scope.groups = data.groups;

    });
    /* 客户标签*/
    tagData.getData().then(function (data) {
        $scope.tags = data.tags;

    });
    /* 客户 */
    customerData.getData().then(function (data) {
       $scope.customers=data.customers; 
    });

    /* 固定/取消固定 位置  ----栏目位置*/
    $scope.pinItem = function(value){
        value.isTop = !value.isTop;
        customerData.updateData(value)
        
    }
    /* 选择查看固定位置 */
    $scope.pinSortFunc = function(value){
        $scope.pinSort = value;
    }
    /*标签过滤*/
    $scope.tagSortFuc = function(value){
        $scope.tagSort = value;
    }
    /* 客户星级别*/
    $scope.rateFunc = function(value) {
      customerData.updateData(value)
    };
    /*选择客户状态*/
    $scope.selectProgress = function(value,progress){
        value.progress = progress.value;
        customerData.updateData(value)

    }
    /* 单个移动分组*/
    $scope.perMoveGroup = function(value,selected){
        var index = findIndex(value,$scope.customers);
        $scope.customers[index].group = selected.value;
        customerData.updateData(value)
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
        for(var i in $scope.customers){
            $scope.customers[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.customers){
                $scope.checkArr.push($scope.customers[i]);
                $scope.customers[i].isChecked = true;
            }
    }
    /* 固定 ----批量操作*/
    $scope.surePin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.customers);
            $scope.customers[index].isTop = true;      //固定
            $scope.customers[index].isChecked = false;  //去掉标记位，也就是去掉勾
            customerData.updateData(value[i]).then(function (data) {  //异步发送请求给服务器
                console.log(data)
            });
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 取消固定 ----批量操作*/
    $scope.cancelPin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.customers);
            $scope.customers[index].isTop = false;      //取消固定
            $scope.customers[index].isChecked = false;  //去掉标记位，也就是去掉勾
            customerData.updateData(value[i]).then(function (data) {  //异步发送请求给服务器
                console.log(data)
            });
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 移动分组 ----批量操作 */
    $scope.moveGroup = function(value,selected){
        for(var i in value){
            var index = findIndex(value[i],$scope.customers);
            $scope.customers[index].group = selected.value;
            $scope.customers[index].isChecked = false;  //去掉标记位
            customerData.updateData(value[i]).then(function (data) {  //异步发送请求给服务器
                console.log(data)
            });
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //关闭顶部导航栏
    }
    /* 删除栏目 ----批量操作 */
    $scope.deleteClue = function(value){
        var deleteConfirm = confirm('您确定要删除来之不易的客户信息吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.customers);
                console.log(index)
                $scope.customers[index].isChecked = false;  //去掉标记位
                $scope.customers.splice(index,1);   //删除
                customerData.deleteData(value[i]).then(function (data) {  //异步发送请求给服务器
                    console.log(data)
                });
                
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
        customerData.updateData(value).then(function (data) {  //异步发送请求给服务器
            console.log(data)
        });
            
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

}]);;/********************************************************************************************************************
 *                                                      添加客户页面
 ********************************************************************************************************************/
angular.module("customeraddMoudle", ['ngSanitize']).controller('CustomerAddCtrl', 
    ['$scope', '$http','$alert', '$state', '$stateParams','customerData','groupData','tagData',
    function($scope, $http,$alert, $state, $stateParams,customerData,groupData,tagData) {

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

        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;
        $scope.colors = data.colors;
    })

    /* 客户详情对象 -- 带本地储存*/
    if(localStorage.customer){
        $scope.customer = JSON.parse(localStorage.customer)
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
        localStorage.customer= JSON.stringify($scope.customer);
    }, 6000);


    /* 分组 */
    groupData.getData().then(function (data) {
        $scope.groups = data.groups;

    });
    /* 客户标签*/
    tagData.getData().then(function (data) {
        $scope.tags = data.tags;

    });
    $scope.saveData = function(value){
        customerData.addData(value).then(function (data) {
            $scope.changeAlert(data.msg);
            window.history.go(-1)
            localStorage.removeItem("customer");
            clearInterval(time);
        });
    }

    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
    /* 添加联系人 */
    $scope.cusadd = function(){
        $scope.customer.peoples.push({sex:'0',isImportant:false,isEdit:false,isTop:false});     //默认未收藏联系人，可编辑状态
    }
    /* 删除联系人 */
    $scope.cusdel = function(index){
        if ($scope.customer.peoples.length >1){
            var deleteConfirm = confirm('您确定要删除此联系人？');
            if(deleteConfirm){
                $scope.customer.peoples.splice(index,1);
                customerData.updateData($scope.customer);
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
    $scope.schedule = {"fromDate":null,"untilDate":null,"remind":[{"date":null}]};     //初始空数据
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
    /* 清空日程弹出框数据 */
    $scope.cancleEditSchedule = function(){  
        $scope.scheduleModal = {"fromDate":null,"untilDate":null,"remind":[{"date":null}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.scheduleModal.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.scheduleModal.remind.length >1){
            $scope.scheduleModal.remind.splice(index,1);
        }
    }
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
}]);;/********************************************************************************************************************
 *                                                      客户详情页
 ********************************************************************************************************************/
angular.module("detialMoudle", ['ngSanitize']).controller('CustomerDetialCtrl',
    ['$scope','$http','$alert','$state', '$stateParams','customerData','groupData','tagData',
    function($scope, $http, $alert, $state, $stateParams,customerData,groupData,tagData) {
        $scope.isEdit = true;
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
        /*客户状态*/
        $scope.progress = data.progress;
        /*客户类型*/
        $scope.class = data.class;

        /* 项目状态 */
        $scope.status = data.status;
        $scope.colors = data.colors;
    })

    /* 客户详情请求 */
    customerData.getIdData($stateParams.id).then(function (data) {
       $scope.customer=data.customer; 
    });
    /* 分组 */
    groupData.getData().then(function (data) {
        $scope.groups = data.groups;

    });
    /* 客户标签*/
    tagData.getData().then(function (data) {
        $scope.tags = data.tags;

    });
    /* 编辑客户信息 */
    $scope.editCustomer = function(value){

        customerData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        });
        customerData.getIdData($stateParams.id).then(function (data) {
            $scope.customer=data.customer;
        });

    }
    /* 添加联系人 */
    $scope.cusadd = function(){
        $scope.customer.peoples.push({sex:'0',isImportant:false,isEdit:false,isTop:false});     //默认未收藏联系人，可编辑状态  
    }
    /* 删除联系人 */
    $scope.cusdel = function(index){
        if ($scope.customer.peoples.length >1){
            var deleteConfirm = confirm('您确定要删除此联系人？');
            if(deleteConfirm){
                $scope.customer.peoples.splice(index,1);
                customerData.updateData($scope.customer);
            }
        }
    }
    /* 添加日程 */
    $scope.scheadd = function(){
        $scope.customer.schedule.unshift({remind:[{date:''}]});
        $scope.openSchedule(0);
    }
    /* 删除日程 */
    $scope.schedel = function(index,type,value){
        var deleteConfirm = confirm('您确定要删除此日程？');
        if(deleteConfirm){
            $scope.customer[type].splice(index,1);
            // customerData.updateData(value)
            console.log(value)
        }
    }
    /* 完成日程 */
    $scope.schecomp = function(index,type,value){
        var now_date = new Date();
        var completeData = $scope.customer[type][index];
        completeData.nowDate = now_date.getTime();
        $scope.customer.schedule_complete.unshift($scope.customer[type][index]);
        $scope.customer[type].splice(index,1);
        customerData.updateData(value)
    }
    /* 撤销日程 */
    $scope.schereply = function(index,type,value){
        $scope.customer.schedule.unshift($scope.customer[type][index]);
        $scope.customer[type].splice(index,1);
        customerData.updateData(value)
    }
    /* 推进项目 */
    $scope.pushBusiness = function(value){
        //每操作一步都要向服务器发一次请求，通知记录business的变化
        var id= value.id;
        var date = new Date();
        var data = {
            "bname":value.bname,
            "people":value.people,
            "status":value.status,
            "selectPerson":value.selectPerson, 
            "time":date,
        };
        switch (value.status) {
            case "0":
                value.status="1"
                break;
            case "1":
                value.status="2"
                break;
            case "2":
                value.status="3"
                break;
            case "3":
                alert('项目已完成！')
                break;
        }
    }
    $scope.delBusiness = function(index){
        var deleteConfirm = confirm('您确定要删除此项目吗？');
        if(deleteConfirm){
            $scope.customer.business.splice(index,1);
            customerData.updateData($scope.customer);
        }
    }
    
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }

    /***************************** 以下是添加日程弹窗 *****************************/
    
    /*日程单条数据 */
    var date =  new Date();
    today = date.getTime();
    $scope.schedule = {"fromDate":null,"untilDate":null,"remind":[{"date":null}]};     //初始空数据
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
        customerData.updateData(value)
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
        customerData.updateData(value)
        $scope.cancleEditSchedule();    
    }
    /* 清空日程弹出框数据 */
    $scope.cancleEditSchedule = function(){  
        $scope.scheduleModal = {"fromDate":null,"untilDate":null,"remind":[{"date":null}]};     //初始空数据
    }
    /* 添加日程提醒 */
    $scope.remindadd = function(){
        $scope.scheduleModal.remind.push({});
    }
    /* 删除日程提醒 */
    $scope.reminddel = function(index){
        if ($scope.scheduleModal.remind.length >1){
            $scope.scheduleModal.remind.splice(index,1);
        }
    }

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
;/********************************************************************************************************************
 *                                                     首页
 ********************************************************************************************************************/

angular.module("homeMoudle", []).controller('HomeCtrl', function($scope, $http, $state) {
	$scope.home = "home "
})
;/********************************************************************************************************************
 *                                                      联系人列表页面
 ********************************************************************************************************************/

angular.module("peopleMoudle", []).controller('PeopleCtrl', 
    ['$scope', '$http', '$state','$alert','customerData',
    function($scope, $http, $state,$alert,customerData) {
    /* 顶部固定按钮 */
    $scope.pinShow = false;
    /* 栏目按钮显示隐藏 */
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
    /*联系人*/
    customerData.getData().then(function(data){
        var people=[];

        data.customers.forEach( function(ele, i) {
            ele.peoples.forEach( function(element, index) {
                element.company = ele.companyName;
                element.origin = ele.origin;
                element.people = ele.charge;
                element.date = ele.meta.createAt;
                element.id = ele._id;
                people.push(element);

            });
        });

        $scope.people = people
    })
    /* 自定义 -- 公司*/
    customerData.getData().then(function (data) {
        var company=[];
        for(var i in data.customers){
            company.push({
                value:i,
                id:data.customers[i]._id,
                label:data.customers[i].companyName
            })
        }
        $scope.company = company
    })

    /* 客户 */
    $http({
        url:'data/customerSet.json',
        method:'GET'
    }).success(function(data){
        $scope.origins=data.origins;
    })
    // /* 固定/取消固定 位置  ----栏目位置*/
    // $scope.pinItem = function(value){
    //     value.isTop = !value.isTop;
    //     customerData.updateData(value);
    // }
    /* 选择查看固定位置 */
    $scope.pinSortFunc = function(value){
        $scope.pinSort = value;
    }

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
    // /* 删除联系人 */
    // $scope.deletePeople = function(value){
    //     var deleteConfirm = confirm('您确定要删除这位联系人吗？');
    //     if(deleteConfirm){
    //         var index = findIndex(value,$scope.people);
    //         $scope.people.splice(index,1);   //删除
    //         customerData.updateData(value);
    //     }
    // }
    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.people){
            $scope.people[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.people){
                $scope.checkArr.push($scope.people[i]);
                $scope.people[i].isChecked = true;
            }
    }
    // /* 固定 ----批量操作*/
    // $scope.surePin = function(value){
    //     for(var i in value){
    //         var index = findIndex(value[i],$scope.people);
    //         $scope.people[index].isTop = true;      //固定
    //         $scope.people[index].isChecked = false;  //去掉标记位，也就是去掉勾
    //         customerData.updateData(value[i]);
    //     }
    //     $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    // }
    // /* 取消固定 ----批量操作*/
    // $scope.cancelPin = function(value){
    //     for(var i in value){
    //         var index = findIndex(value[i],$scope.people);
    //         $scope.people[index].isTop = false;      //取消固定
    //         $scope.people[index].isChecked = false;  //去掉标记位，也就是去掉勾
    //         customerData.updateData(value[i]);
    //     }
    //     $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    // }
    // /* 删除栏目 ----批量操作 */
    // $scope.deletePeople = function(value){
    //     var deleteConfirm = confirm('您确定要删除这位联系人吗？');
    //     if(deleteConfirm){
    //         for(var i in value){
    //             var index = findIndex(value[i],$scope.people);
    //             $scope.people[index].isChecked = false;  //去掉标记位
    //             $scope.people.splice(index,1);   //删除
    //             customerData.updateData(value[i]);
    //         }
    //         $scope.checkArr.splice(0,$scope.checkArr.length);   
    //     }
    // }
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
}])


;/********************************************************************************************************************
 *                                                      联系人列表页面
 ********************************************************************************************************************/

angular.module("peopleDetailMoudle", []).controller('PeopleDetailCtrl', 
    ['$scope', '$http', '$stateParams','customerData',
    function($scope, $http, $stateParams,customerData) {
    $scope.sexs = [
        {"value":"0","label":"男"},
        {"value":"1","label":"女"}
    ]; 
    customerData.getIdData($stateParams.id).then(function (data) {
       $scope.customer=data.customer; 
    });

    $scope.isImportant = true;
    $scope.isEdit = true;

    $scope.savePeople = function(value){
        customerData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        });
        customerData.getIdData($stateParams.id).then(function (data) {
           $scope.customer=data.customer; 
        });
    }
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
}]);;/********************************************************************************************************************
 *                                                      添加图片
 ********************************************************************************************************************/


angular.module("addImgMoudle", ['ngFileUpload']).controller('AddImgCtrl', function($scope, $http) {
     $scope.files = [];
    $scope.capture = 'camera';
    $scope.pattern = 'image/*';
    $scope.acceptSelect = 'image/*';
    $scope.modelOptions = '{debounce:100}';
    $scope.dragOverClass = '{accept:\'dragover\', reject:\'dragover-err\', pattern:\'image/*,audio/*,video/*,text/*\'}';
    $scope.multiple =  true;
    $scope.allowDir =  true;
    $scope.validate = '{size: {max: \'2MB\', min: \'10B\'}, height: {max: 12000}, width: {max: 12000}, duration: {max: \'5m\'}}';
    $scope.keep = true;
    $scope.keepDistinct = true;
    $scope.orientation = false;
    $scope.resize = '{width: 1000, height: 1000, centerCrop: true}';
    $scope.resizeIf = "$width > 5000 || $height > 5000";
    $scope.dimensions = "$width < 12000 || $height < 12000";
    $scope.duration = "$duration < 10000";

    $scope.id = "123";

})
;    /********************************************************************************************************************
 *                                                      全部产品页面
 ********************************************************************************************************************/

angular.module("productsMoudle", []).controller('ProductsCtrl', 
    ['$scope', '$http', '$state','$alert','productData','cateData',
    function($scope, $http, $state,$alert,productData,cateData) {
	/* 顶部固定按钮 */
    $scope.pinShow = false;
    /* 栏目按钮显示隐藏 */
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
    /*产品*/
    productData.getData().then(function(data){
        $scope.products=data.products;
    })
    /*产品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    })
    /* 固定/取消固定 位置  ----栏目位置*/
    $scope.pinItem = function(value){
        value.isTop = !value.isTop;
        productData.updateData(value);
        
    }
    /* 选择查看固定位置 */
    $scope.pinSortFunc = function(value){
        $scope.pinSort = value;
    }

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
    /* 删除单件产品 */
    $scope.deleteProduct = function(value){
        var deleteConfirm = confirm('您确定要删除这件产品吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.products);
            $scope.products.splice(index,1);   //删除
            productData.deleteData(value);
        }
    }
    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.products){
            $scope.products[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.products){
                $scope.checkArr.push($scope.products[i]);
                $scope.products[i].isChecked = true;
            }
    }
    /* 固定 ----批量操作*/
    $scope.surePin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.products);
            $scope.products[index].isTop = true;      //固定
            $scope.products[index].isChecked = false;  //去掉标记位，也就是去掉勾
            productData.updateData(value[i]);
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 取消固定 ----批量操作*/
    $scope.cancelPin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.products);
            $scope.products[index].isTop = false;      //取消固定
            $scope.products[index].isChecked = false;  //去掉标记位，也就是去掉勾
            productData.updateData(value[i]);
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 删除栏目 ----批量操作 */
    $scope.deleteProducts = function(value){
        var deleteConfirm = confirm('您确定要删除这件产品吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.products);
                $scope.products[index].isChecked = false;  //去掉标记位
                $scope.products.splice(index,1);   //删除
                productData.deleteData(value[i]);
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        }
    }
}]);;/********************************************************************************************************************
 *                                                      新建产品页面
 ********************************************************************************************************************/

angular.module("productsAddMoudle", ['ngFileUpload']).controller('ProductsAddCtrl', 
    ['$scope', '$http', '$state','$alert','productData','cateData','Upload',
    function($scope, $http, $state,$alert,productData,cateData,Upload) {
	/*产品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    })
    var date = new Date();
    if(localStorage.product){
        $scope.product = JSON.parse(localStorage.product)
    }else{
        $scope.product ={   
            "isTop":false,
            "name":"",
            "model":"",
            "cate":"",
            "people":"",
            "editpeople":"",
            "description":"",
            "size":"",
            "quantity":"",
            "weight":"",
            "path":[],
            "img":""
        }
    }
    $scope.product.path = [];
    $scope.mulImages = [];
    if(localStorage.showImages){
        $scope.product.path = JSON.parse(localStorage.showImages)
    }

    /* 本地储存 */
    var time = setInterval(function(){
        localStorage.product= JSON.stringify($scope.product);
    }, 6000);

    $scope.$watch('files', function () {
        $scope.selectImage($scope.files);
    });
    //根据选择的图片来判断 是否为一下子选择了多张
    //一下子选择多张的数据格式为一个数组中有多个对象，而一次只选择一张的数据格式为一个数组中有一个对象
    $scope.selectImage = function (files) {
        if (!files || !files.length) {
            return;
        }
        if (files.length > 1) {
            angular.forEach(files, function (item) {
                var image = [];
                image.push(item);
                $scope.mulImages.push(image);
            })
        } else {
            $scope.mulImages.push(files);
        }
    };
    $scope.deteleImage = function(value){
        var delconfirm = confirm('是否要删除这张图片？');
        if(delconfirm){
            var index = $scope.mulImages.indexOf(value);
            $scope.mulImages.splice(index,1);
        }

    }
    $scope.deteleShowImage = function(value){
        var delconfirm = confirm('是否要删除这张图片？');
        if(delconfirm){
            var index = $scope.product.path.indexOf(value);
            productData.deleteImgData(value).then(function(data){
                $scope.changeAlert(data.msg);
                $scope.product.path.splice(index,1);
                localStorage.showImages = JSON.stringify($scope.product.path)
            })
        }

    } 

    $scope.upload = function () {
        if (!$scope.mulImages.length) {
            return; 
        }

        var files = $scope.mulImages;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
                Upload.upload({
                url: '/product/upload',   
                // fields: {'username': $scope.username},
                file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    $scope.mulImages = [];
                    $scope.changeAlert(data.msg);
                    $scope.product.path.push(data.path)
                    localStorage.showImages = JSON.stringify($scope.product.path)
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
            })
        }
    }

    $scope.saveProduct = function(value){
        if(value.path!=[]){
            value.img = value.path[0]
        }
        productData.addData(value).then(function(data){
            $scope.changeAlert(data.msg);
            window.history.go(-1);
            localStorage.removeItem("product");
            clearInterval(time);
            localStorage.removeItem('showImages')
        });
    }

    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:3});
    }

    /* 添加分類 */
    $scope.saveCate = function(value){
         
        var val = $scope.cate.length;
        var msgadd = {
            "value":val,
            "label":value,
            "isEdit":true
        }

        cateData.addData(msgadd).then(function(data){
            $scope.changeAlert(data.msg);
        });
        cateData.getData().then(function (data) {
            $scope.cate = data.cates;

        });
    }
}]);;/********************************************************************************************************************
 *                                                      产品分类页面
 ********************************************************************************************************************/

angular.module("productsCateMoudle", ['ng-sortable']).controller('ProductsCateCtrl', 
    ['$scope', '$http', '$alert','$state','cateData',
    function($scope, $http,$alert, $state,cateData) {
	/* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            }
        }
    } 
    /*产品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    })
    /* 添加分类信息 */
    $scope.addCate= function(){
        var value = $scope.cate.length;
        cateData.addData({"value":value,"isEdit":true,"label":'默认分类'});
        cateData.getData().then(function (data) {
            $scope.cate = data.cates;
        })
    }
    /* 保存单条分类信息 */
    $scope.saveCate= function(value){
        if(value.isEdit == true){
            cateData.updateData(value).then(function (data) {
                $scope.changeAlert(data.msg);
            });
        } 
    }
    /* 删除单条分类信息 */
    $scope.deleteCate= function(value){
        var deleteConfirm = confirm('您确定要删除这个分类吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.cate);
            $scope.cate.splice(index,1);   //删除
            cateData.deleteData(value).then(function(data){
                $scope.changeAlert(data.msg);
            })
            /* 更新数据value索引值 */
            $scope.cate.forEach( function(element, index) {
                element.value = index;
                cateData.updateData(element);
            });
        }
    }
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
    /* 监听items ，发送数据 */
    $scope.$watch('cate', function(newVal, oldVal) {
        if (newVal !== oldVal) {
           //向服务器发请求，顺序已改变
           console.log(newVal)
        }
    }, true);
}]);;/********************************************************************************************************************
 *                                                      产品详情页面
 ********************************************************************************************************************/

angular.module("productsDetailMoudle", []).controller('ProductsDetailCtrl', 
    ['$scope', '$http', '$stateParams','$alert','productData','cateData','Upload',
    function($scope, $http, $stateParams,$alert,productData,cateData, Upload) {
	/* 是否可编辑 */
	$scope.isEdit = true;
	/*产品分类*/
    cateData.getData().then(function(data){
        $scope.cate=data.cates;
    })
    var date = new Date();
    /* 产品详情请求 */
    productData.getIdData($stateParams.id).then(function (data) {
       $scope.product=data.product; 

    });
    $scope.mulImages = [];
    $scope.$watch('files', function () {
        $scope.selectImage($scope.files);
    });

    $scope.saveProduct = function(value){
        productData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        });
    }

    //根据选择的图片来判断 是否为一下子选择了多张
    //一下子选择多张的数据格式为一个数组中有多个对象，而一次只选择一张的数据格式为一个数组中有一个对象
    $scope.selectImage = function (files) {
        if (!files || !files.length) {
            return;
        }
        if (files.length > 1) {
            angular.forEach(files, function (item) {
                var image = [];
                image.push(item);
                $scope.mulImages.push(image);
            })
        } else {
            $scope.mulImages.push(files);
        }
    };
    $scope.deteleImage = function(value){
        var delconfirm = confirm('是否要删除这张图片？');
        if(delconfirm){
            var index = $scope.mulImages.indexOf(value);
            $scope.mulImages.splice(index,1);

        } 

    }
    $scope.deteleShowImage = function(value){
        var delconfirm = confirm('是否要删除这张图片？');
        if(delconfirm){
            var index = $scope.product.path.indexOf(value);

            productData.deleteImgData(value).then(function(data){
                $scope.product.path.splice(index,1);
            })
        }

    } 
    $scope.upload = function () {
        if (!$scope.mulImages.length) {
            return; 
        }

        var files = $scope.mulImages;
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
                Upload.upload({
                url: '/product/upload',   
                file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                    $scope.mulImages = [];
                    $scope.changeAlert(data.msg);
                    $scope.product.path.push(data.path)
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
            })
        }
    }
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
      /* 添加分類 */
    $scope.saveCate = function(value){
         
        var val = $scope.cate.length;
        var msgadd = {
            "value":val,
            "label":value,
            "isEdit":true
        }

        cateData.addData(msgadd).then(function(data){
            $scope.changeAlert(data.msg);
        });
        cateData.getData().then(function (data) {
            $scope.cate = data.cates;

        });
    }

    $scope.clone = function(){
        localStorage.product= JSON.stringify($scope.product);
        localStorage.showImages= JSON.stringify($scope.product.path);
    }

}]);;/********************************************************************************************************************
 *                                                      报价单列表页面
 ********************************************************************************************************************/

angular.module("quotationMoudle", []).controller('QuotationCtrl', 
    ['$scope', '$http', '$state','$alert','quotationData','customerData',
    function($scope, $http, $state,$alert,quotationData,customerData) {
	/* 顶部固定按钮 */
    $scope.pinShow = false;
    /* 栏目按钮显示隐藏 */
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
    /* 报价单 */
    quotationData.getData().then(function(data){
        $scope.quotation=data.quotations;
    })
    /* 自定义 -- 公司*/
    customerData.getData().then(function (data) {
        var company=[];
        for(var i in data.customers){
            company.push({
                value:i,
                id:data.customers[i]._id,
                label:data.customers[i].companyName
            })
        }
        $scope.company = company
    })

    /* 报价阶段 */
    $http({
        url:'data/phase.json',
        method:'GET'
    }).success(function(data){
        $scope.phase = data.phase;

    })
    /* 固定/取消固定 位置  ----栏目位置*/
    $scope.pinItem = function(value){
        value.isTop = !value.isTop;
        quotationData.updateData(value);
        
    }
    /* 选择查看固定位置 */
    $scope.pinSortFunc = function(value){
        $scope.pinSort = value;
    }
    /* 删除单件报价单 */
    $scope.deleteQuotation = function(value){
        var deleteConfirm = confirm('您确定要删除这条报价单吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.quotation);
            $scope.quotation.splice(index,1);   //删除
            quotationData.deleteData(value).then(function(data){
                $scope.changeAlert('操作成功！');
            })
        }
    }
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
    
    /* 返回按钮，也就是清空整个数组，并且将选框的标记位设为false */
    $scope.isCheckedNo = function(){
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组
        for(var i in $scope.quotation){
            $scope.quotation[i].isChecked = false;      //去掉标记位
        }
    }
    /* 全选操作 */
    $scope.isCheckedAll = function(cur,per){
        $scope.checkArr.splice(0,$scope.checkArr.length);
            for(var i in $scope.quotation){
                $scope.checkArr.push($scope.quotation[i]);
                $scope.quotation[i].isChecked = true;
            }
    }
    /* 固定 ----批量操作*/
    $scope.surePin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.quotation);
            $scope.quotation[index].isTop = true;      //固定
            $scope.quotation[index].isChecked = false;  //去掉标记位，也就是去掉勾
            quotationData.updateData(value[i]);
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 取消固定 ----批量操作*/
    $scope.cancelPin = function(value){
        for(var i in value){
            var index = findIndex(value[i],$scope.quotation);
            $scope.quotation[index].isTop = false;      //取消固定
            $scope.quotation[index].isChecked = false;  //去掉标记位，也就是去掉勾
            quotationData.updateData(value[i]);
        }
        $scope.checkArr.splice(0,$scope.checkArr.length);   //清空数组，也就是关闭顶部选框
    }
    /* 删除栏目 ----批量操作 */
    $scope.deleteQuotations = function(value){
        var deleteConfirm = confirm('您确定要删除这些报价单吗？');
        if(deleteConfirm){
            for(var i in value){
                var index = findIndex(value[i],$scope.quotation);
                $scope.quotation[index].isChecked = false;  //去掉标记位
                $scope.quotation.splice(index,1);   //删除
                quotationData.deleteData(value[i]);
            }
            $scope.checkArr.splice(0,$scope.checkArr.length);   
        }
    }
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:3});
    }
}])
;/********************************************************************************************************************
 *                                                      添加报价单页面
 ********************************************************************************************************************/

angular.module("quotationAddMoudle", []).controller('QuotationAddCtrl', 
    ['$scope', '$http', '$state','$alert','quotationData','customerData','productData','cateData','quotationheadData','quotationfootData',
    function($scope, $http, $state,$alert,quotationData,customerData, productData,cateData,quotationheadData,quotationfootData) {
	
    if(localStorage.quotation){
        $scope.quotation = JSON.parse(localStorage.quotation)
    }else{
        $scope.quotation = {    
            "id":0,
            "isTop":false,
            "isChecked":false,
            "name":"",
            "company":"",
            "amount":"",
            "phase":"0",
            "people":"",
            "units":"0",
            "head":"0",
            "foot":"0",
            "products":[]
        }
    }

    
    /* 货币计量单位 */
    $http({
        url:'data/units.json',
        method:'GET'
    }).success(function(data){
        $scope.units = data.units;
    })
    /* 报价阶段 */
    $http({
        url:'data/phase.json',
        method:'GET'
    }).success(function(data){
        $scope.phase = data.phase;

    })
    /* 自定义 -- 公司*/
    customerData.getData().then(function (data) {
        var company=[];
        for(var i in data.customers){
            company.push({
                value:i,
                id:data.customers[i]._id,
                label:data.customers[i].companyName
            })
        }
        $scope.company = company
    })

    /* 报价单头部 */
    quotationheadData.getData().then(function(data){
        $scope.heads = data.quotationheads;
    })
    $scope.selectHead = function(selected){
    	$scope.quotation.head = selected;
    }

    /* 报价单尾部*/
    quotationfootData.getData().then(function(data){
        $scope.foots = data.quotationfoots;
    })
    $scope.selectFoot = function(selected){
    	$scope.quotation.foot = selected
    }

    /* 本地储存 */
    var time = setInterval(function(){
        localStorage.quotation= JSON.stringify($scope.quotation);
    }, 6000);

    /* 报价详情 */
    //产品分类
    cateData.getData().then(function(data){
        $scope.cates=data.cates;
    })
    //产品信息 
    productData.getData().then(function(data){
        $scope.products=data.products;
    })

    $scope.saveQuotation = function(value){
        quotationData.addData(value).then(function(data){
            $scope.changeAlert('添加成功！');
            window.history.go(-1);
            localStorage.removeItem("quotation");
            clearInterval(time);
        });
    }

    /* 删除产品 */
    $scope.deleteProduct = function(value){
    	var delconfirm = confirm("您确定要删除这件产品吗？");
    	if(delconfirm){
    		var index = $scope.quotation.products.indexOf(value);
    		$scope.quotation.products.splice(index, 1);
    	}
    }

    /* 选择产品 */
    $scope.selectProduct = function(value){
        mark = false;
        for(var i in $scope.quotation.products){    
            //判断product中的id是否包含在quitation.products.value中,
            if($scope.quotation.products[i].value == value._id){
                mark = true;        //只是做标记
                return;
            }else{
                mark = false;
            }
        }
        if(!mark){
            $scope.quotation.products.push({
                "value":value._id,
                "name":value.name,
                "num":0,
                "price":"",
                "total":""
            })
        }            
    }
    /* 总数量和总计 */   
    $scope.$watch('quotation.products', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            var numArray = [],
                priceArray = [];
            for(var j in $scope.quotation.products){
                numArray.push($scope.quotation.products[j].num);
                priceArray.push($scope.quotation.products[j].total);
      
                $scope.totalNum = 0;
                numArray.forEach(function(value){
                    $scope.totalNum += parseInt(value);
                });

                $scope.totalPrice = 0;
                priceArray.forEach(function(value){
                    $scope.totalPrice += parseFloat(value);

                });
                $scope.quotation.amount = angular.copy($scope.totalPrice)+" "+ $scope.units[$scope.quotation.units].label;
            }
        }
    }, true);
    $scope.$watch('quotation', function(newVal, oldVal) {
        $scope.quotation.amount = angular.copy($scope.totalPrice)+" "+ $scope.units[$scope.quotation.units].label;
    }, true);
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
}])
;/********************************************************************************************************************
 *                                                      报价单详情页面
 ********************************************************************************************************************/

angular.module("quotationDetailMoudle", [])
.controller('QuotationDetailCtrl', 
    ['$scope', '$http', '$stateParams','$alert','quotationData','customerData','productData','cateData','quotationheadData','quotationfootData',
    function($scope, $http, $stateParams,$alert,quotationData,customerData, productData,cateData,quotationheadData,quotationfootData) {
    // cfpLoadingBar.start();  //进度条开始
	$scope.isEdit = true; 
    quotationData.getIdData($stateParams.id).then(function (data) {
       $scope.quotation=data.quotation; 
    });
    /* 货币计量单位 */
    $http({
        url:'data/units.json',
        method:'GET',
        ignoreLoadingBar: true
    }).success(function(data){
        $scope.units = data.units;
    })
    /* 报价阶段 */
    $http({
        url:'data/phase.json',
        method:'GET'
    }).success(function(data){
        $scope.phase = data.phase;

    })
    /* 自定义 -- 公司*/
    customerData.getData().then(function (data) {
        var company=[];
        for(var i in data.customers){
            company.push({
                value:i,
                id:data.customers[i]._id,
                label:data.customers[i].companyName
            })
        }
        $scope.company = company
    })

    /* 报价单头部 */
    quotationheadData.getData().then(function(data){
        $scope.heads = data.quotationheads;
    })
    $scope.selectHead = function(selected){
    	$scope.quotation.head = selected
    }

    /* 报价单尾部*/
    quotationfootData.getData().then(function(data){
        $scope.foots = data.quotationfoots;
    })
    $scope.selectFoot = function(selected){
    	$scope.quotation.foot = selected
    }
    /* 报价详情 */
    //产品分类
    cateData.getData().then(function(data){
        $scope.cates=data.cates;
    })
    //产品信息 
    productData.getData().then(function(data){
        $scope.products=data.products;
        // cfpLoadingBar.complete();    //进度条结束
    })
    /* 删除产品 */
    $scope.deleteProduct = function(value){
    	var delconfirm = confirm("您确定要删除这件产品吗？");
    	if(delconfirm){
    		var index = $scope.quotation.products.indexOf(value);
    		$scope.quotation.products.splice(index, 1);
    	}
    }
    $scope.saveQuotation = function(value){
        $scope.isEdit = !$scope.isEdit;
        quotationData.updateData(value).then(function(data){
            $scope.changeAlert('操作成功！');
        });
    }
    /* 选择产品 */
    $scope.selectProduct = function(value){
        mark = false;
        for(var i in $scope.quotation.products){    //判断product中的id是否包含在quitation.products.value中,
            if($scope.quotation.products[i].value == value._id){
                mark = true;        //只是做标记
                return;
            }else{
                mark = false;
            }
        }
        if(!mark){
            $scope.quotation.products.push({
                "value":value._id,
                "name":value.name,
                "num":0,
                "price":"",
                "total":""
            })
        }            
    }
    /* 总数量和总计 */   
    $scope.$watch('quotation.products', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            var numArray = [],
                priceArray = [];


            for(var j in $scope.quotation.products){
                numArray.push($scope.quotation.products[j].num);
                priceArray.push($scope.quotation.products[j].total);
      
                $scope.totalNum = 0;
                numArray.forEach(function(value){
                    $scope.totalNum += parseInt(value);
                });

                $scope.totalPrice = 0;
                priceArray.forEach(function(value){
                    $scope.totalPrice += parseFloat(value);     //toFixed(2)
                });
                $scope.quotation.amount = angular.copy($scope.totalPrice)+" "+ $scope.units[$scope.quotation.units].label;

            }
        }
    }, true);

    $scope.$watch('quotation', function(newVal, oldVal) {
        $scope.quotation.amount = angular.copy($scope.totalPrice)+" "+ $scope.units[$scope.quotation.units].label;
    }, true);
    
    /*提示框*/
    $scope.changeAlert = function(title,content){
        if (newVal !== oldVal) {
            $alert({title: title, content: content, type: "info", show: true,duration:5});
        }
    }
}])
;/********************************************************************************************************************
 *                                                      报价单设置页面
 ********************************************************************************************************************/

angular.module("quotationSettingMoudle", ['ng-sortable'])
.controller('QuotationSettingCtrl', 
    ['$scope', '$http', '$state','quotationheadData','quotationfootData','businessData',
    function($scope, $http, $state,quotationheadData,quotationfootData,businessData) {
	/* 根据数组值找到索引*/
    function findIndex(current, obj){
        for(var i in obj){
            if (obj[i] == current) {
                return i;
            }
        }
    } 
    
    /************************************* 报价单标签 ********************************/
    
    /* 报价单标签 */
	$scope.tags = [
            {"value":"0","text":"大客户","color":"primary","isEdit":true},
            {"value":"1","text":"新客户","color":"danger","isEdit":true},
            {"value":"2","text":"老客户","color":"success","isEdit":true}
        ];
    /* 报价单标签颜色 */
    $scope.colors = [
        {"value":"primary","label":"<span class='set-tag label-primary'></span>"},
        {"value":"success","label":"<span class='set-tag label-success'></span>"},
        {"value":"danger","label":"<span class='set-tag label-danger'></span>"},
        {"value":"info","label":"<span class='set-tag label-info'></span>"},
        {"value":"warning","label":"<span class='set-tag label-warning'></span>"}
    ];

    /* 报价阶段 */
    $http({
        url:'data/phase.json',
        method:'GET'
    }).success(function(data){
        $scope.phase = data.phase;

    })

    /* 添加标签信息 */
    $scope.addTag = function(){
        var value = $scope.tags.length;
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

    /************************************* 报价单头 ********************************/
    /* 报价单头 */
    quotationheadData.getData().then(function(data){
        $scope.heads = data.quotationheads;
    })
    /* 项目选择设置 */
    /* 自定义 -- 公司*/
    businessData.getData().then(function (data) {
        var business=[];
        for(var i in data.businesss){
            business.push({
                value:i,
                id:data.businesss[i]._id,
                label:data.businesss[i].bname
            })
        }
        $scope.business = business
    })

    /******** 报价单弹窗 ********/
    /* 修改信息*/
    $scope.headMsg = {};
    $scope.editHead = function(value){
    	$scope.headMsg = angular.copy(value);
    }
    /* 保存单条报价单尾信息 */
    $scope.saveHead = function(msg){
        quotationheadData.updateData(msg);
		$scope.headMsg = {};
        quotationheadData.getData().then(function(data){
            $scope.heads = data.quotationheads;
        })
    }
    /* 添加报价头尾信息 */
    $scope.saveHeadAdd = function(value){
        var val = $scope.heads.length;
        var msgadd = {
        	"value":val,
            "isEdit":false,
        	"text":value.text,
            "company":value.company,
            "cname":value.cname,
            "address":value.address,
            "phone":value.phone,
            "email":value.email,
            "people":value.people,
            "mobile":value.mobile,
            "fromDate":value.fromDate,
            "untilDate":value.untilDate,
            "logo":value.logo
        }
        quotationheadData.addData(msgadd)
        quotationheadData.getData().then(function(data){
            $scope.heads = data.quotationheads;
        })
    }
    

    /* 删除单条报价单尾信息 */
    $scope.deleteHead = function(value){
        var deleteConfirm = confirm('您确定要删除这条报价单头部信息吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.heads);
            $scope.heads.splice(index,1);   //删除
            quotationheadData.deleteData(value).then(function(data){
                $scope.changeAlert('删除成功！');
            })
            /* 更新数据value索引值 */
            $scope.heads.forEach( function(element, index) {
                element.value = index;
                quotationheadData.updateData(element);
            });
        }
    }

    /************************************* 报价单尾 ********************************/
    /* 报价单尾 */
    quotationfootData.getData().then(function(data){
        $scope.foots = data.quotationfoots;
    })
    /******** 报价单弹窗 ********/
    /* 修改信息*/
    $scope.footMsg = {};
    $scope.editFoot = function(value){
    	$scope.footMsg = angular.copy(value);
    }
    /* 保存单条报价单尾信息 */
    $scope.saveFoot = function(msg){
        quotationfootData.updateData(msg);
        $scope.footMsg = {};
        quotationfootData.getData().then(function(data){
            $scope.foots = data.quotationfoots;
        })
    }
    /* 添加报价单尾信息 */
    $scope.saveFootAdd = function(value){ 
        var val = $scope.foots.length;
        var msgadd = {
        	"value":val,
        	"text":value.text,
        	"content":value.content,
        	"isEdit":false
        }
        quotationfootData.addData(msgadd);
        quotationfootData.getData().then(function(data){
            $scope.foots = data.quotationfoots;
        })

    }
    
    /* 删除单条报价单尾信息 */
    $scope.deleteFoot = function(value){
        var deleteConfirm = confirm('您确定要删除这条报价单尾部信息吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.foots);
            $scope.foots.splice(index,1);   //删除
            quotationfootData.deleteData(value).then(function(data){
                $scope.changeAlert('删除成功！');
            })
            /* 更新数据value索引值 */
            $scope.foots.forEach( function(element, index) {
                element.value = index;
                quotationfootData.updateData(element);
            });
        }
    }
}])

;/********************************************************************************************************************
 *                                                      个人设置
 ********************************************************************************************************************/

angular.module("settingMoudle", []).controller('SettingCtrl', 
	['$scope', '$http', '$state','$alert','settingData',
	function($scope, $http, $state,$alert,settingData) {
	$scope.isEdit = true;
	$scope.sexs = [
        {"value":"0","label":"男"},
        {"value":"1","label":"女"}
    ];
	settingData.getData().then(function(data){
		$scope.user = data.user
	})
	$scope.saveSetting = function(value){
		settingData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        });
	}
	
	/*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
}])
;/********************************************************************************************************************
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

    settingData.getListData().then(function(data){
    	$scope.user = data.users
        // $scope.changeAlert(data.msg);
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


;/********************************************************************************************************************
 *                                                      添加成员页面
 ********************************************************************************************************************/

angular.module("teamAddMoudle", []).controller('TeamAddCtrl', 
    ['$scope', '$http', '$state','$alert','settingData',
    function($scope, $http, $state,$alert,settingData) {
    $scope.sexs = [
        {"value":"0","label":"男"},
        {"value":"1","label":"女"}
    ];
    $scope.user = {
					name:"",
					email:"",
					password:"",
					section:"",
					position:"",
					tel:"",
					phone:"",
					fax:"",
					sex:"0",
					class:"0",
                    domain:"",
                    birthday:0
				}
    $scope.saveUser = function(value){
    	settingData.addData(value).then(function(data){
                $scope.changeAlert(data.msg)
                window.history.go(-1);
        });
    }

    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:3});
    }
}])


;/********************************************************************************************************************
 *                                                      成员详情页面
 ********************************************************************************************************************/

angular.module("teamDetailMoudle", []).controller('TeamDetailCtrl', 
    ['$scope', '$http', '$stateParams','$alert','settingData',
    function($scope, $http, $stateParams,$alert,settingData) {
    $scope.isEdit = true;
    $scope.sexs = [
        {"value":"0","label":"男"},
        {"value":"1","label":"女"}
    ];
    settingData.getIdData($stateParams.id).then(function (data) {
       $scope.user=data.user; 
    });

    $scope.saveUser = function(value){
    	settingData.updatecopyData(value).then(function(data){
			$scope.changeAlert(data.msg)
        });
    }
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
}])


