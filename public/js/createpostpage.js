app.controller('createpost-page-body', function($scope, $http){
    //app.com/g/:groupName/
    $scope.groupName = window.location.pathname.split('/')[2];

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
        }, function(err){
            console.log(err);
        });
    }

});