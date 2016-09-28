/********************************************************************************************************************
 *                                                      联系人列表页面
 ********************************************************************************************************************/

angular.module("peopleDetailMoudle", []).controller('PeopleDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','customerData',
    function($scope,$window, $http, $stateParams,customerData) {
    $window.document.title = "联系人详情-呐呐CRM";
    $scope.sexs = [
        {"value":"0","label":"男"},
        {"value":"1","label":"女"}
    ]; 
    customerData.getIdData($stateParams.id).then(function (data) {
       $scope.customer=data.customer; 
    });

    $scope.isImportant = true;
    $scope.isEdit = true;

    $scope.savePeople = function(value){
        customerData.updateData(value).then(function(data){
            $scope.changeAlert(data.msg);
        });
        customerData.getIdData($stateParams.id).then(function (data) {
           $scope.customer=data.customer; 
        });
    }
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
}]);