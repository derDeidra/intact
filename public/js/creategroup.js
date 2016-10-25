app.controller('creategroup-page-body', function($scope, $http){

    $scope.saveGroup = function(){
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

    $scope.group = {};
    $scope.group.rules = [];
});