app.controller('createpost-page-body', function($scope, $http){
    //app.com/g/:groupName/
    $scope.groupName = window.location.pathname.split('/')[2];

    function getGroupInfo(){
        var req = {
            method : 'GET',
            url : '/getGroupDetails?groupName=' + $scope.groupName
        };
        $http(req).then(function(response){
            console.log(response);
            console.log("Got group info");
            $scope.group = response.data.data;
        }, function(response){
            console.log(response);
        });
    }

    $scope.savePost = function(){
        $scope.post.groupName = $scope.groupName;
        var req = {
            method: 'POST',
            url: '/savePost',
            headers: {
                'Content-Type': 'application/json'
            },
            data: $scope.post
        };
        $http(req).then(function(response){
            console.log("Post successfully created");
            console.log(response);
            window.location = '/g/' + $scope.groupName;
        }, function(err){
            console.log(err);
        });
    };

    getGroupInfo();
});