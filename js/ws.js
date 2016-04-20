var url = "https://slack.com/api/rtm.start?token=" + APItoken;
var app = angular.module('app', []);
app.controller('slack', function ($scope, $http) {
  $http.get(url)
          .then(function (response) {
            console.log(response);
            var ws = new WebSocket(response.data.url);
            ws.onopen = function () {
              console.log("Socket has been opened!");
            };
            ws.onmessage = function (message) {
              console.log(JSON.parse(message.data));
            };
          });
});
