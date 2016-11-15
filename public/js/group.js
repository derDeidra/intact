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
            $scope.groupId = response.data.data._id;
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

    $scope.leaveGroup = function(){
        var req = {
            method: 'POST',
            url: '/leaveGroup',
            headers: {
                'Content-Type': 'application/json'
            },
            data : {
                groupId : $scope.groupId
            }
        };
        $http(req).then(function(response){
            console.log("Left the group");
            console.log(response);
            window.location = '/';
        }, function(err){
            console.log(err);
        });
    };

    getUserId();
    getUserGroups();
    getPostsForGroup($scope.groupName);
});