/********************************************************************************************************************
 *                                                      报价单设置页面
 ********************************************************************************************************************/

angular.module("quotationSettingMoudle", ['ng-sortable'])
.controller('QuotationSettingCtrl', 
    ['$scope', '$http', '$state','$alert','quotationheadData','quotationfootData','businessData',
    function($scope, $http, $state, $alert,quotationheadData,quotationfootData,businessData) {
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
    /* 保存单条报价单头 信息 */
    $scope.saveHead = function(msg){
        quotationheadData.updateData(msg).then(function(data){
                $scope.changeAlert(data.msg);
            });
		$scope.headMsg = {};
        quotationheadData.getData().then(function(data){
            $scope.heads = data.quotationheads;
        })
    }
    /* 添加报价头头 信息 */
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
        quotationheadData.addData(msgadd).then(function(data){
                $scope.changeAlert(data.msg);
            })
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
                $scope.changeAlert(data.msg);
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
        quotationfootData.updateData(msg).then(function(data){
                $scope.changeAlert(data.msg);
            })
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
        quotationfootData.addData(msgadd).then(function(data){
                $scope.changeAlert(data.msg);
            });
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
                $scope.changeAlert(data.msg);
            })
            /* 更新数据value索引值 */
            $scope.foots.forEach( function(element, index) {
                element.value = index;
                quotationfootData.updateData(element);
            });
        }
    }
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:3});
    }
}])

