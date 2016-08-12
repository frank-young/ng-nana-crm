/********************************************************************************************************************
 *                                                      报价单详情页面
 ********************************************************************************************************************/

angular.module("quotationDetailMoudle", ['cfp.loadingBar'])
.controller('QuotationDetailCtrl', function($scope, $http, $state,cfpLoadingBar) {
    cfpLoadingBar.start();  //进度条开始
	$scope.isEdit = true; 
    $scope.quotation = {	
			"id":0,
            "isTop":true,
            "isChecked":false,
            "name":"传奇贸易公司订单",
            "company":"1",
            "amount":"20万人民币",
            "phase":"1",
            "people":"杨军",
            "date":2141231198432,
            "units":"0",
            "company":"1",
            "head":"0",
            "foot":"0",
            "products":[]
        }
    /* 货币计量单位 */
    $http({
        url:'data/units.json',
        method:'GET',
        ignoreLoadingBar: true
    }).success(function(data){
        $scope.units = data.units;
    })
    /* 客户信息 */
    $http({
        url:'data/company.json',
        method:'GET'
    }).success(function(data){
        $scope.company = data.company;
    })
    /* 报价单头部 */
    $http({
        url:'data/quotationhead.json',
        method:'GET'
    }).success(function(data){
        $scope.heads = data.heads;
    })
    $scope.selectHead = function(selected){
    	$scope.quotation.head = selected
    }

    /* 报价单尾部*/
    $http({
        url:'data/quotationfoot.json',
        method:'GET'
    }).success(function(data){
        $scope.foots = data.foots;
    })
    $scope.selectFoot = function(selected){
    	$scope.quotation.foot = selected
    }
    /* 报价详情 */
    //产品分类
    $http({
        url:'data/productcate.json',
        method:'GET'
    }).success(function(data){
        $scope.cates=data.cates;
    })
    //产品信息 
    $http({
        url:'data/products.json',
        method:'GET'
    }).success(function(data){
        $scope.products=data.products;
        cfpLoadingBar.complete();    //进度条结束
    })
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
        for(var i in $scope.quotation.products){    //判断product中的id是否包含在quitation.products.value中,
            if($scope.quotation.products[i].value == value.id){
                mark = true;        //只是做标记
                return;
            }else{
                mark = false;
            }
        }
        if(!mark){
            $scope.quotation.products.push({
                    "value":value.id,
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
                    $scope.totalPrice += parseFloat(value.toFixed(2));
                });
            }
        }
    }, true);
})
