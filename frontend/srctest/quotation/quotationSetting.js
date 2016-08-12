/********************************************************************************************************************
 *                                                      报价单设置页面
 ********************************************************************************************************************/

angular.module("quotationSettingMoudle", ['ng-sortable'])
.controller('QuotationSettingCtrl', function($scope, $http, $state) {
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
    $scope.phase = [
    	{"value":"0","label":"已创建"},
        {"value":"1","label":"已发送"},
        {"value":"2","label":"尚有谈判余地"},
        {"value":"0","label":"已接受"},
        {"value":"1","label":"已拒绝"}
    ]


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
    $http({
        url:'data/quotationhead.json',
        method:'GET'
    }).success(function(data){
        $scope.heads = data.heads;
    })
    /* 项目选择设置 */
    $http({
        url:'data/businesssample.json',
        method:'GET'
    }).success(function(data){
        $scope.business = data.business;
    })

    /******** 报价单弹窗 ********/
    /* 修改信息*/
    $scope.headMsg = {};
    $scope.editHead = function(value){
    	$scope.headMsg = angular.copy(value);
    }
    /* 保存单条报价单尾信息 */
    $scope.saveHead = function(msg){
        $scope.heads.forEach(function(value,key){
			if(value.value == msg.value){
				delete $scope.heads[key]
				$scope.heads.splice(key,1,msg);
			}
		})
		$scope.headMsg = {};
    }
    /* 添加报价单尾信息 */
    $scope.saveHeadAdd = function(value){
        var val = $scope.heads.length;
        var msgadd = {
        	"value":val,
        	"text":value.text,
        	"content":value.content,
        	"isEdit":false
        }
        $scope.heads.push(msgadd);
    }
    

    /* 删除单条报价单尾信息 */
    $scope.deleteHead = function(value){
        var deleteConfirm = confirm('您确定要删除这条报价单头部信息吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.heads);
            $scope.heads.splice(index,1);   //删除
        }
    }

    /************************************* 报价单尾 ********************************/
    /* 报价单尾 */
    $http({
        url:'data/quotationfoot.json',
        method:'GET'
    }).success(function(data){
        $scope.foots = data.foots;
    })
    /******** 报价单弹窗 ********/
    /* 修改信息*/
    $scope.footMsg = {};
    $scope.editFoot = function(value){
    	$scope.footMsg = angular.copy(value);
    }
    /* 保存单条报价单尾信息 */
    $scope.saveFoot = function(msg){
        $scope.foots.forEach(function(value,key){
			if(value.value == msg.value){
				delete $scope.foots[key]
				$scope.foots.splice(key,1,msg);
			}
		})
		$scope.footMsg = {};
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
        $scope.foots.push(msgadd);

    }
    
    /* 删除单条报价单尾信息 */
    $scope.deleteFoot = function(value){
        var deleteConfirm = confirm('您确定要删除这条报价单尾部信息吗？');
        if(deleteConfirm){
            var index = findIndex(value,$scope.foots);
            $scope.foots.splice(index,1);   //删除
        }
    }
})

