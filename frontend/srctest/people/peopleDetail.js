/********************************************************************************************************************
 *                                                      联系人列表页面
 ********************************************************************************************************************/

angular.module("peopleDetailMoudle", []).controller('PeopleDetailCtrl', function($scope, $http, $state) {
    $scope.sexs = [
        {"value":"0","label":"男"},
        {"value":"1","label":"女"}
    ];
    $scope.people = {
            "name":"杨军12",
            "email":"yangjunalns@qq.com",
            "sex":"0",   
            "birthed":809846400000,
            "phone":"1860816004",
            "position":"采购经理",
            "remark":"这是一个重要客户",
            "isImportant":true,
            "isEdit":true
        }

    $scope.isImportant = true;
});