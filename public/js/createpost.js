app.controller('createpost-page-body', function($scope, $http){
    //app.com/g/:groupName/
    $scope.groupName = window.location.pathname.split('/')[2];
    $scope.navHeader = $scope.groupName;
    $scope.navHeaderLink = '/g/' + $scope.groupName;

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
        var fData = new FormData();
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