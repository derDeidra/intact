app.controller('creategroup-page-body', function($scope, $http){

    $scope.navHeader = 'IntactInsider';
    $scope.navHeaderLink = '/';
    $scope.group = {};
    $scope.group.rules = [];
    $scope.group.members = [];

    //app.com/g/:groupName/edit
    var path = window.location.pathname.split('/');
    if(path.length === 4){
        getPostsForGroup((path[2]));
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
            console.log("Got group data");
            console.log(response);
            $scope.group = response.data.data;
        }, function(err){
            console.log(err);
        });
    }

    function getUsers(){
        var req = {
            method: 'GET',
            url: '/getUsers',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http(req).then(function(response){
            console.log("Got users");
            console.log(response);
            $scope.users = response.data.data;
            console.log($scope.users);
        }, function(err){
            console.log(err);
        });
    }

    $scope.saveGroup = function(){
        if($scope.group.private === undefined)
            $scope.group.private = false;
        var req = {
            method: 'POST',
            url: '/saveGroup',
            headers: {
                'Content-Type': 'application/json'
            },
            data: $scope.group
        };
        $http(req).then(function(response){
            console.log("Group successfully created");
            console.log(response);
            window.location = '/g/' + $scope.group.name.split(' ').join('');
        }, function(err){
            console.log(err);
        });
    };

    $scope.addRule = function(){
        $scope.group.rules.push($scope.group.temprule);
        $scope.group.temprule = ''
    };

    $scope.removeRule = function(guideline) {
        $scope.group.rules.splice($scope.group.rules.indexOf(guideline), 1);
    };

    $scope.addUser = function(user){
        if(user){
            $scope.group.members.push(user._id);
        }
    };

    $scope.removeUser = function(userid) {
        $scope.group.members.splice($scope.group.members.indexOf(userid), 1);
    };

    $scope.resolveNameFromId = function(id){
        if($scope.users){
            for(var i = 0; i < $scope.users.length; i++){
                if($scope.users[i]._id === id){
                    return $scope.users[i].name;
                }
            }
        }
        return "undefined"
    };

    getUsers();

    setTimeout(function(){
        $scope.$digest();
    },5000);
});
