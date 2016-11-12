app.controller('discover-page-body', function($scope, $http){
    $scope.groups = [];

    function getUserId() {
        $http.get('/getUserId').then(function(res) {
            $scope.userId = res.data;
        }, function(res){
            console.log(res);
        });
    }

    function getPublicGroups(){
        var req = {
            method: 'GET',
            url: '/getAllGroups',
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

    $scope.joinGroup = function(group){
        var req = {
            method: 'POST',
            url: '/joinGroup',
            headers: {
                'Content-Type': 'application/json'
            },
            data : {
                groupId : group._id
            }
        };
        $http(req).then(function(response){
            console.log("Joined group");
            console.log(response);
            group.members.push($scope.userId);
            swal("Success!", "Successfully joined " + group.name, "success")
        }, function(err){
            console.log(err);
        });
    };

    $scope.isMember = function(group){
        return group.members.indexOf($scope.userId) != -1
    };

    $scope.isMemberOfAllGroups = function(){
        for(var i = 0; i < $scope.groups.length; i++){
            if(!$scope.isMember($scope.groups[i]))
                return false;
        }
        return true;
    };

    getUserId();
    getPublicGroups();
});