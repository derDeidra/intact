app.controller('createpost-page-body', function($scope, $http){
    //app.com/g/:groupName/
    var path = window.location.pathname.split('/');
    $scope.groupName = path[2];
    $scope.navHeader = $scope.groupName;
    $scope.navHeaderLink = '/g/' + $scope.groupName;
    if(path.length == 6){
        getPostDetails(path[4]);
    }

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

    $scope.savePost = function(){
        var fData = new FormData();
        if($scope.post._id)
            fData.append('_id', $scope.post._id);
        fData.append('title', $scope.post.title);
        fData.append('body', $scope.post.body);
        fData.append('pFile', $scope.pFile);
        fData.append('groupName', $scope.groupName);
        $http.post('/savePost', fData, {
            headers: {'Content-Type': undefined },
            transformRequest: angular.identity
        }).then(function(response){
            console.log("Post successfully created");
            console.log(response);
            window.location = '/g/' + $scope.groupName;
        }, function(err){
            console.log(err);
        });
    };

    getGroupInfo();
});

app.directive('fileInput', () => {
    return function( scope, element, attributes ) {
        element.on('change', function( event ) {
            scope.$apply(function() {
                scope[ element[0].name ] = event.target.files[0];
            });
        });
    };
});