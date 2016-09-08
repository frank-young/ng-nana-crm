/********************************************************************************************************************
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
    

    $scope.mulImages = [];

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
            "path":"",
            "img":""
        }
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

    $scope.upload = function () {
        if (!$scope.mulImages.length) {
            return; 
        }

        // var url = $scope.params.url;
        console.log($scope.mulImages[0][0])

        var files = $scope.mulImages;
        // if (!files.$error) {
            Upload.upload({
                url: '/product/upload',
                data: {
                    files: files
                }
            }).then(function (resp) {
                console.log('success')
            }, null, function (evt) {
                console.log('fail')
            });
        // }

    };

    $scope.saveProduct = function(value){
        productData.addData(value).then(function(data){
            $scope.changeAlert(data.msg);
            window.history.go(-1);
            localStorage.removeItem("product");
            clearInterval(time);
        });
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
}]);