/********************************************************************************************************************
 *                                                      新建产品页面
 ********************************************************************************************************************/

angular.module("productsAddMoudle", ['ngFileUpload']).controller('ProductsAddCtrl', function($scope, $http, $state) {
	/*产品分类*/
    $http({
        url:'data/productcate.json',
        method:'GET'
    }).success(function(data){
        $scope.cate=data.cates;
    })
    var date = new Date();
    $scope.product ={	
			"id":0,
            "isTop":true,
            "name":"",
            "model":"",
            "cate":"",
            "people":"",
            "editpeople":"",
            "description":"",
            "size":"",
            "quantity":"",
			"weight":"",
            "date":date
        }

    $scope.mulImages = [];

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
});