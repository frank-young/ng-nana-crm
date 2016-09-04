/********************************************************************************************************************
 *                                                      产品详情页面
 ********************************************************************************************************************/

angular.module("productsDetailMoudle", []).controller('ProductsDetailCtrl', 
    ['$scope', '$http', '$stateParams','$alert','productData','cateData',
    function($scope, $http, $stateParams,$alert,productData,cateData) {
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
        $scope.isEdit = !$scope.isEdit;
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
    $scope.upload = function () {
        if (!$scope.mulImages.length) {
            return;
        }
        var url = $scope.params.url;
        var data = angular.copy($scope.params.data || {});
        data.file = $scope.mulImages;

        Upload.upload({
            url: url,
            data: data
        }).success(function (data) {
            $scope.hide(data);
            $rootScope.alert('success');
        }).error(function () {
            $rootScope.alert('error');
        });

    };
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }

}]);