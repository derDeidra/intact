app.controller('group-page-body', function($scope, $http){
    //app.com/g/:groupName/
    $scope.groupName = window.location.pathname.split('/')[2];
    $scope.navHeader = $scope.groupName;
    $scope.navHeaderLink = '/g/' + $scope.groupName;
    $scope.posts = [];
    $scope.groups = [];
    $scope.userId = null;


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
            for(var i = 0; i < $scope.groups.length; i++){
                if($scope.groups[i].name == $scope.groupName){
                    $scope.groupDesc = $scope.groups[i].description;
                    break;
                }
            }
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
            $scope.posts = response.data.data.posts;
            $scope.owner = response.data.data.owner;
        }, function(err){
            console.log(err);
        });
    }

    function getUserId() {
        $http.get('/getUserId').then(function(res) {
            $scope.userId = res.data;
        }, function(res){
            console.log(res);
        });
    }

    $scope.formatInterval = function(timestamp){
        return moment(timestamp).fromNow();
    };

    getUserId();
    getUserGroups();
    getPostsForGroup($scope.groupName);
});