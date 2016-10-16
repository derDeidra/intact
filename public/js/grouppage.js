app.controller('group-page-body', function($scope, $http){
    //app.com/g/:groupName/
    $scope.groupName = window.location.pathname.split('/')[2];
    $scope.posts = [];
    $scope.groups = [];

    function getUserGroups(){
        var req = {
            method: 'GET',
            url: '/getUserGroups',
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

    function getPostsForGroup(groupName){
        var req = {
            method: 'GET',
            url: '/getPostsForGroup?groupName=' + groupName,
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
    getPostsForGroup($scope.groupName);
});