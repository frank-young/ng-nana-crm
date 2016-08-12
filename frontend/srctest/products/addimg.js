/********************************************************************************************************************
 *                                                      添加图片
 ********************************************************************************************************************/


angular.module("addImgMoudle", ['ngFileUpload']).controller('AddImgCtrl', function($scope, $http) {
     $scope.files = [];
    $scope.capture = 'camera';
    $scope.pattern = 'image/*';
    $scope.acceptSelect = 'image/*';
    $scope.modelOptions = '{debounce:100}';
    $scope.dragOverClass = '{accept:\'dragover\', reject:\'dragover-err\', pattern:\'image/*,audio/*,video/*,text/*\'}';
    $scope.multiple =  true;
    $scope.allowDir =  true;
    $scope.validate = '{size: {max: \'2MB\', min: \'10B\'}, height: {max: 12000}, width: {max: 12000}, duration: {max: \'5m\'}}';
    $scope.keep = true;
    $scope.keepDistinct = true;
    $scope.orientation = false;
    $scope.resize = '{width: 1000, height: 1000, centerCrop: true}';
    $scope.resizeIf = "$width > 5000 || $height > 5000";
    $scope.dimensions = "$width < 12000 || $height < 12000";
    $scope.duration = "$duration < 10000";

    $scope.id = "123";

})
