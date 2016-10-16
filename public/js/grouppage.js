app.controller('group-page-body', function($scope, $http){
    //app.com/g/:groupId/
    $scope.groupId = window.location.pathname.split('/')[1];
    $scope.posts = [];
    $scope.groups = [];

    function getUserGroups(){
        var req = {
            method: 'GET',
            url: 'getUserGroups',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http(req).then(function(response){
            console.log("Got user groups");
            console.log(response);
            $scope.groups = response.data.data;
        }, function(err){
            console.log(err);
        });
    }

    function getPostsForGroup(groupId){
        var req = {
            method: 'GET',
            url: 'getPostsForGroup?groupId=' + groupId,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http(req).then(function(response){
            console.log("Got group posts");
            console.log(response);
            $scope.posts = response.data.data;
        }, function(err){
            console.log(err);
        });
    }

    getUserGroups();
    getPostsForGroup(groupId);
});