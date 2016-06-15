var app = angular.module("enaproceApp", ["ngRoute","ngSanitize"]);
app.config(["$routeProvider",function ($routeProvider) {
    $routeProvider
    .when("/",
    {
        templateUrl: 'views/default.html',
        controller: "defaultCtrl"
    })
    .when("/default",
    {
        templateUrl: 'views/default.html',
        controller: "defaultCtrl"
    })
    .when("/minero",
    {
        templateUrl: 'views/minero.html',
        controller: "mineroCtrl"
    })
    .otherwise({
        redirectTo:"/"
    })

}])