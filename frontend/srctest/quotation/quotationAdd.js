/********************************************************************************************************************
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
        $alert({title: title, content: content, type: "info", show: true,duration:3});
    }
}])
