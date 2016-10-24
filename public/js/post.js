app.controller('post-page-body', function($scope, $http){
    //app.com/g/:groupId/p/:postId
    var path = window.location.pathname.split('/');
    $scope.groupId = path[2];
    $scope.postId = path[4];
    $scope.userId = null;
    $scope.post = null;

    function getPostDetails(postId){
        var req = {
            method: 'GET',
            url: '/getPostDetails?postId=' + postId,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        $http(req).then(function(response){
            console.log("Got post");
            console.log(response);
            $scope.post = response.data.data;
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

    $scope.createComment = function(parent) {
        var req = {
            method : 'POST',
            url : '/saveComment',
            data : $scope.comment
        };
        if(parent){
            req.data.parent = parent._id;
        } else {
            req.data.post = $scope.postId;
        }
        $http(req).then(function(response){
            console.log("Saved comment");
            console.log(response);
            $scope.post.comments.push(response.data.data);
        }, function(err){
            console.log(err);
        });
    };

    $scope.deleteComment = function(comment){
        var req = {
            method : 'POST',
            url : 'removeComment',
            data : {commentId : comment._id}
        };
        $http(req).then(function(response){
            console.log("Deleted comment");
            console.log(response);
            $scope.post.comments.splice($scope.post.comments.indexOf(comment));
        }, function(err){
            console.log(err);
        });
    };

    $scope.formatInterval = function(timestamp){
        return moment(timestamp).fromNow();
    };

    getUserId();
    getPostDetails($scope.postId);

});