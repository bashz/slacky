function mapObjectById(arrayOfObjects){
    var mappedObjects = [];
    arrayOfObjects.forEach(function(object){
        if(object.id){
            mappedObjects[object.id] = object;
        }else{
            console.log(object);
            console.log('Object above do not have id');
        }
    })
    return mappedObjects;
}

function formatDateToToday(datetime){
    
}

var app = angular.module('app', []);
app.controller('slack', function ($scope, $http) {
    $http.get("config.json").then(function (r) {
        // this is insecure
        var url = "https://slack.com/api/rtm.start?token=" + r.data.token;
        $http.get(url)
                .then(function (response) {
                    $scope.users = mapObjectById(response.data.users);
                    $scope.team = response.data.team;
                    $scope.channels = mapObjectById(response.data.channels);
                    $scope.ims = mapObjectById(response.data.ims);
                    $scope.msgs = [];
                    console.log(response);
                    var ws = new WebSocket(response.data.url);
                    ws.onopen = function () {
                        console.log("Connected to slack");
                    };
                    ws.onmessage = function (message) {
                        var msg = JSON.parse(message.data);
                        console.log(msg);
                        if (msg.type === "message") {
                            $scope.msgs.push({
                                team: $scope.team.name,
                                from: $scope.users[msg.user].name,
                                on: function() {
                                    if($scope.ims[msg.channel]){
                                        return $scope.ims[msg.channel].name;
                                    }else if($scope.channels[msg.channel]){
                                        return $scope.channels[msg.channel].name;
                                    }else{
                                        return "default";
                                    }
                                },
                                at: new Date(Math.round(msg.ts * 1000)),
                                body: msg.text
                            });
                            $scope.$apply();
                        }
                    };
                });
    });
});