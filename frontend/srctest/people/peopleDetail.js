/********************************************************************************************************************
 *                                                      联系人列表页面
 ********************************************************************************************************************/

angular.module("peopleDetailMoudle", []).controller('PeopleDetailCtrl', 
    ['$scope', '$http', '$stateParams','customerData',
    function($scope, $http, $stateParams,customerData) {
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