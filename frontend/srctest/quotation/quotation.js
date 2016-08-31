/********************************************************************************************************************
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
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
}])
