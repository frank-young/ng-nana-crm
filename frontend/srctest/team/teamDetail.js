/********************************************************************************************************************
 *                                                      成员详情页面
 ********************************************************************************************************************/

angular.module("teamDetailMoudle", []).controller('TeamDetailCtrl', 
    ['$scope','$window', '$http', '$stateParams','$alert','settingData',
    function($scope,$window, $http, $stateParams,$alert,settingData) {
    $window.document.title = "团队成员详情-呐呐CRM";
    $scope.isEdit = true;
    $scope.sexs = [
        {"value":"0","label":"男"},
        {"value":"1","label":"女"}
    ];
    settingData.getIdData($stateParams.id).then(function (data) {
       $scope.user=data.user; 
    });

    $scope.saveUser = function(value){
    	settingData.updatecopyData(value).then(function(data){
			$scope.changeAlert(data.msg)
        });
    }
    /*提示框*/
    $scope.changeAlert = function(title,content){
        $alert({title: title, content: content, type: "info", show: true,duration:5});
    }
}])


