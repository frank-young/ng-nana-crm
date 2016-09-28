/********************************************************************************************************************
 *                                                      产品详情页面
 ********************************************************************************************************************/

angular.module("productsDetailMoudle", []).controller('ProductsDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','productData','cateData','Upload',
    function($scope,$window, $http, $stateParams,$alert,productData,cateData, Upload) {
	$window.document.title = "产品详情-呐呐CRM";
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

}]);