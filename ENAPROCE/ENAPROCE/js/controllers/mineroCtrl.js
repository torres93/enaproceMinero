var app = angular.module("enaproceApp");
app.controller("mineroCtrl", ["$scope", "$http", "$compile", function ($scope, $http, $compile) {
    $scope.domMapp = ['A', 'B', 'C', 'D', 'E', 'F'];
    $scope.titles = ["Empresas:", "Consulta por:"];
    $scope.headers = ["Capitulo","Tema"]
    $scope.dominioCollection = [];
    $scope.dominio = [];
    $scope.contenido = [];
    $scope.tabVariable = [];
    $scope.tabDominio = [];
    var Ajax = $http;

    Ajax.get("http://10.1.30.121/sistemas/difenaproce/API/api/enaproceController/getDominio")
    .success(function (d) {
        $scope.dominio = d;
        $scope.filterDominio({ clasificador: 'A', idDominioCompuesta: '', desglose: '1' }, 'A');
    });

    $scope.fillCollectionAll = function (a, b, c, d, e) {
        var newJson = [];

        e.forEach(function (x) {
            if (x[a] >= b && x[c].indexOf(d) == 0)
                newJson.push(x);
        })

        return newJson;
    }

    $scope.refactorCollection = function (a, b) {
        var remove = false;
        for (i = 0 ; i < b.length; i++) {
            if (b[i].group == a) {
                remove = true;
            }

            if (remove) {
                b.splice(i, 1);
                i--;
            }
        }
    }

    $scope.createJsonNode = function (obj, propa, valuea, propb, valueb, objArray) {
        var json = {};
        json.objSelected = ""
        json.group = valuea;
        json.title = $scope.titles[$scope.domMapp.indexOf(valuea)] || $scope.headers[valuea]||"";
        json.collection = $scope.fillCollection(propa, valuea, propb, valueb, objArray);
        return json
    }

    $scope.showChild = function (nextGroup, id,objArray,attr,idattr) {
        for (i = 0; i < objArray.length; i++) {
            if (objArray[i][attr] == nextGroup && objArray[i][idattr].indexOf(id) == 0) {
                if ($scope.dominio[i].desglose == '1')
                    return true;
                else
                    return false;
            }
        }
    }

    $scope.giveMeID = function (objArray, ID) {
        var IDArray = [];
        objArray.forEach(function (x) {
            IDArray.push(x[ID]);
        })
        return IDArray;
    }

    $scope.filterDominio = function (obj, group) {
        $scope.content = [];
        $scope.tabDominio = [];
        $scope.ribbonTitle = "";
        var nextGroup = $scope.domMapp[$scope.domMapp.indexOf(group) + 1];
        if (obj != null && obj != undefined) {
            try {
                $scope.dominioCollection[$scope.domMapping.indexOf(obj)].objSelected = obj;
            }
            catch (e) {
                
            }
            if (obj.desglose == '1' && $scope.showChild(nextGroup, obj.idDominioCompuesta,$scope.dominio,"clasificador","idDominioCompuesta")) {
                $scope.refactorCollection(nextGroup, $scope.dominioCollection);
                $scope.variableCollection = [];
                if ($scope.dominioCollection.length == 0)
                    var json = $scope.createJsonNode(obj, "clasificador", group, "idDominioCompuesta", obj.idDominioCompuesta, $scope.dominio);
                else
                    var json = $scope.createJsonNode(obj, "clasificador", nextGroup, "idDominioCompuesta", obj.idDominioCompuesta, $scope.dominio);
                $scope.dominioCollection.push(json);
            }
            else {
                $scope.refactorCollection(nextGroup, $scope.dominioCollection);
                $scope.content = $scope.fillCollectionAll("clasificador", nextGroup, "idDominioCompuesta", obj.idDominioCompuesta, $scope.dominio);
                $scope.ribbonTitle = obj.descripcion;
                if ($scope.content.length == 0)
                    $scope.tabDominio = [obj.idDominioCompuesta];
                else
                    $scope.tabDominio = $scope.giveMeID($scope.content, "idDominioCompuesta");

                $http.post("http://localhost:49515/api/EnaproceController/getVariable", '"' + $scope.tabDominio[0] + '"')
                .success(function (v) {
                    $scope.variable = v;
                    $scope.filterVariable({ nivelDesglose: '0', idVariableCompuesta: '', desglose: '1' }, '0');
                })
            }
        }
        else {
            $scope.refactorCollection(nextGroup, $scope.dominioCollection);
            $scope.variableCollection = [];
        }
    }


    $scope.filterVariable = function (obj, group) {
        $scope.tabVariable = [];
        var nextGroup = parseInt(group) + 1;
        if (obj != null && obj != undefined) {
            try {
                $scope.variableCollection[parseInt(group)].objSelected = obj;
            }
            catch (e) {
               
            }
            if (obj.desglose == '1' && parseInt(obj.nivelDesglose)<1) {
                $scope.refactorCollection(nextGroup, $scope.variableCollection);
                if ($scope.variableCollection.length == 0)
                    var json = $scope.createJsonNode(obj, "nivelDesglose", group, "idVariableCompuesta", obj.idVariableCompuesta, $scope.variable);
                else
                    var json = $scope.createJsonNode(obj, "nivelDesglose", nextGroup, "idVariableCompuesta", obj.idVariableCompuesta, $scope.variable);
                $scope.variableCollection.push(json);
            }
            else {
                $scope.refactorCollection(nextGroup, $scope.variableCollection);
                $scope.tabVariable = $scope.fillCollectionAll("nivelDesglose", group, "idVariableCompuesta", obj.idVariableCompuesta, $scope.variable);
                if ($scope.tabVariable.length == 0)
                    $scope.tabVariable = [obj.idVariableCompuesta];
                else
                    $scope.tabVariable = $scope.giveMeID($scope.tabVariable, "idVariableCompuesta");
  
            }
        }
        else {
            $scope.refactorCollection(nextGroup, $scope.variableCollection);
            
        }
    }




    //$scope.refactorCollection = function (a) {
    //    var remove = false;
    //    for (i = 0 ; i < $scope.dominioCollection.length; i++) {
    //        if ($scope.dominioCollection[i].domGroup == a) {
    //            remove = true;
    //        }

    //        if (remove) {
    //            $scope.dominioCollection.splice(i, 1);
    //            i--;
    //        }
    //    }
    //}

    //$scope.createDomJson = function (a, b) {
    //    var json = {};
    //    json.domSelected = "";
    //    json.domGroup = a;
    //    json.domCollection = $scope.fillCollection('clasificador', a, 'idDominioCompuesta', b, $scope.dominio)
    //    $scope.dominioCollection.push(json);
    //}

    //$scope.filterDominio = function (a) {
    //    var d = $scope.dominio;
    //    if (a == null && b == null) {
    //        $scope.createDomJson('A', '');
    //    }
    //    else {
    //        var nextGroup = $scope.domMapping[$scope.domMapping.indexOf(a) + 1];
    //        if (b != null) {
    //            $scope.dominioCollection[$scope.domMapping.indexOf(a)].domSelected = b;
    //            if (b.desglose == '1') {
    //                $scope.refactorCollection(nextGroup);
    //                $scope.variableCollection = [];
    //                $scope.createDomJson(nextGroup, b.idDominioCompuesta);
    //            }
    //            else {
    //                $http.post("http://localhost:49515/api/EnaproceController/getVariable",'"'+b.idDominioCompuesta+'"')
    //                .success(function (v) {
    //                    $scope.variable = v;
    //                    $scope.filterVariable(null, null);
    //                })
    //            }
    //        }
    //        else {
    //            $scope.refactorCollection(nextGroup);
    //            $scope.variableCollection = [];
    //        }
    //    }

    //};



    //$scope.refactorvarCollection = function (a) {
    //    var remove = false;
    //    for (i = 0 ; i < $scope.variableCollection.length; i++) {
    //        if ($scope.variableCollection[i].varGroup == a) {
    //            remove = true;
    //        }

    //        if (remove) {
    //            $scope.dominioCollection.splice(i, 1);
    //            i--;
    //        }
    //    }
    //}

    $scope.fillCollection = function (a, b, c, d, e) {
        var newJson = [];

        e.forEach(function (x) {
            if (x[a] == b && x[c].indexOf(d) == 0)
                newJson.push(x);
        })

        return newJson;
    }

    


    //*********************************Variables
    $scope.variableCollection = [];
    $scope.variable = [];

    $scope.createVarJson = function (a, b) {
        var json = {};
        json.varSelected = "";
        json.varGroup = a;
        json.varCollection = $scope.fillCollection('nivelDesglose', a, 'idVariableCompuesta', b, $scope.variable)
        $scope.variableCollection.push(json);
    }

    //$scope.filterVariable = function (a, b) {
    //    var v = $scope.variable;
    //    console.log(a, b);
    //    if (a == null && b == null) {
    //        $scope.createVarJson('0', '');
    //    }
    //    else {
    //        var nextGroup = parseInt(a) + 1;
    //        if (b != null) {
    //            $scope.variableCollection[parseInt(a)].varSelected = b;
    //            if (b.desglose == '1') {
    //                $scope.refactorvarCollection(nextGroup);
    //                $scope.createVarJson(nextGroup, b.idVariableCompuesta);
    //            }
    //            else {
    //                //codigo para variables
    //            }
    //        }
    //        else {
    //            $scope.refactorvarCollection(nextGroup);
    //        }
    //    }

    //};



    //############################################################################################
    //Minero Consulta ///////////

    $scope.getConsulta = function () {
        var doms = JSON.stringify($scope.tabDominio).replace("[", "").replace("]", "").replace(/"/g,"'");
        var varis = JSON.stringify($scope.tabVariable).replace("[", "").replace("]", "").replace(/"/g,"'");
        var dats = JSON.stringify({variables:varis,dominios:doms});
        $http.post('http://localhost:49515/api/EnaproceController/getConsulta', dats).success(function (response) {
            $scope.tabla = response;
            $scope.tablahds = [];
            for (key in $scope.tabla[0]) {
                $scope.tablahds.push(key);
            }
         
            
        }).error(function (err) {
            console.log(err);
        });
    }

    $scope.exportToExcel = function (tableId, nombre) {
       
        var tab_text = document.getElementById(tableId).outerHTML;
        var sa;
        
        
        var ua = navigator.userAgent.toLowerCase();

        var msie = ua.indexOf("msie");
        var msieF = ua.indexOf("firefox");
        var msieG = ua.indexOf("chrome");

        if (msieF > 0) {
            sa = 'data:application/vnd.ms-excel,' + encodeURIComponent(tab_text);
            window.open(sa);

        } else if (msieG > 0) {

            var blob = new Blob([tab_text], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            });
            url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = nombre;
            a.click();
            window.URL.revokeObjectURL(url);
        }
        else {
            if (document.execCommand) {
                var oWin = window.open("about:blank", "_blank");
                oWin.document.write(tab_text);
                oWin.document.close();
                var success = oWin.document.execCommand('SaveAs', true, nombre)
                oWin.close();

            }
        }

    }

}]);