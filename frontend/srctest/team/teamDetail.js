/********************************************************************************************************************
 *                                                      成员详情页面
 ********************************************************************************************************************/

angular.module("teamDetailMoudle", []).controller('TeamDetailCtrl', 
    ['$scope', '$http', '$state','$alert',
    function($scope, $http, $state,$alert) {
    $scope.isEdit = false;


    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
}])


