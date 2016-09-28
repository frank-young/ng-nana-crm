/********************************************************************************************************************
 *                                                      新建产品页面
 ********************************************************************************************************************/

angular.module("productsAddMoudle", ['ngFileUpload']).controller('ProductsAddCtrl', 
    ['$scope','$window', '$http', '$state','$alert','productData','cateData','Upload',
    function($scope,$window, $http, $state,$alert,productData,cateData,Upload) {
	$window.document.title = "添加产品-呐呐CRM";
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
}]);