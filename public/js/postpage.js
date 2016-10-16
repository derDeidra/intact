app.controller('post-page-body', function($scope, $http){
    //app.com/g/:groupId/p/:postId
    var path = window.location.pathname.split('/');
    $scope.groupId = path[1];
    $scope.postId = path[3];
    $scope.comments = [];

    function getCommentsForPost(postId){
        var req = {
            method: 'GET',
            url: 'getCommentsForPost?postId' + postId,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http(req).then(function(response){
            console.log("Got post comments");
            console.log(response);
            $scope.comments = response.data.data;
        }, function(err){
            console.log(err);
        });
    }

    getCommentsForPost(postId);

});