(function () {
    "use strict";
    angular.module('tubeShow', [])
        .controller('TubeController', function ($scope, $http) {
            $scope.init = function () {
                $scope.stage = new Kinetic.Stage({
                    container: 'myCanvas',
                    width: 1200,
                    height: 768
                });

                $http.get("/data/categories.json")
                    .then(function(results){
                        //Success
                        $scope.categories = results.data;
                        console.log("Passed: " + results.data);        
                    }, function(results){
                        //error
                        console.log("Error: " + results.data + "; "+ results.status);
                    });

                $http.get("/data/tube.json")
                    .then(function(results){
                        //Success
                        $scope.tubes = results.data;
                        console.log("Passed: " + results.data);        
                    }, function(results){
                        //error
                        console.log("Error: " + results.data + "; "+ results.status);
                    });

                $http.get("/data/hotspots.json")
                    .then(function(results){
                        //Success
                        $scope.hotSpots = results.data;
                        console.log("Passed: " + results.data);        
                    }, function(results){
                        //error
                        console.log("Error: " + results.data + "; "+ results.status);
                    });
            };  //init ends

            $scope.loadTube = function (tube) {
                var ind = $scope.tryRemovingTube(tube);
                if (ind) {
                    $scope.stage.draw();
                    return;
                }
                var layer = new Kinetic.Layer();
                var imageObj = new Image();
                imageObj.src = $scope.tubes[tube]['ipath'];
                var tubeImage = new Kinetic.Image({
                    x: $scope.tubes[tube]["xoff"], 
                    y: $scope.tubes[tube]["yoff"],
                    image:imageObj,
                    width: $scope.tubes[tube]["xsiz"],
                    height: $scope.tubes[tube]["ysiz"],
                    name:tube
                });
                var idStr = "layer-" + tube;
                layer.setAttr("id",idStr);
                layer.add(tubeImage);
                $scope.stage.add(layer);
                console.log(idStr + " added");
                //Now add hot spots for the tube
                var layer2 = new Kinetic.Layer();
                layer2.setAttr("id","HSlayer-" + tube);
                $scope.showHotSpots(layer2, tube);
                $scope.stage.add(layer2);

                layer.moveToBottom();
                $scope.stage.batchDraw();
            };
                /*
                * A tab represents a category of tubes. Each category is a JSON array of tubes.
                */
                $scope.loadTab = function(tab) {
                    var tubes = null;
                    for (var i=0; i < $scope.categories.length; i++) {
                        var name = $scope.categories[i]["name"];
                        if (name == tab) {
                            tubes = $scope.categories[i]["tubes"];     //returns array of tubes
                            break;
                        }
                    }
                    if (tubes == null) {
                        return;
                    }
                    $scope.stage.clear();
                    $scope.init();
                    for (var i=0; i<tubes.length; i++) {    //load each tube
                        var tube = tubes[i];
                        //$scope.tryRemovingTube(tube);
                        $scope.loadTube(tube);
                        console.log(tube);
                    }
                    $scope.stage.batchDraw();
                };
                $scope.showHotSpots = function (layer,tube) {
                if ($scope.hotSpots[tube]) {
                    for (var i=0; i<$scope.hotSpots[tube].length; i++) {
                        var hotSpot = $scope.hotSpots[tube][i];
                        var uniqName = tube+hotSpot["link"]["to"];   //add tube if the combo is to be unique
                        var hs=null;

                        if (hotSpot["hotspot"]["shape"] == "circle") {
                            hs = new Kinetic.Circle({
                                x:hotSpot["x"], 
                                y:hotSpot["y"], 
                                radius:hotSpot["hotspot"]["radius"], 
                                fill:'grey', 
                                opacity:0.0
                            });
                        }
                        if (hotSpot["hotspot"]["shape"] == "rect") {
                            hs = new Kinetic.Rect({
                                x:hotSpot["x"], 
                                y:hotSpot["y"], 
                                height:hotSpot["hotspot"]["height"], 
                                width:hotSpot["hotspot"]["width"],
                                fill:'grey',
                                opacity:0.0
                            });
                        }

                        hs.setAttr("id",uniqName);
                        hs.setAttr("tube",tube);
                        hs.setAttr("linkto",hotSpot["link"]["to"]);
                        hs.setAttr("linktype",hotSpot["link"]["type"]); 
                        //hs.strokeEnabled(true);
                        hs.strokeWidth(10);

                        hs.on('mouseover', function(e) {
                            e.target.opacity(0.2);
                            document.body.style.cursor = 'pointer';
                            //console.log('HS ID:' + e.target.getAttr("id"));
                            layer.batchDraw();
                        });
                        hs.on('mouseout', function(e) {
                            document.body.style.cursor = 'default';
                            e.target.opacity(0.0);
                            //console.log('HS ID:' + e.target.getAttr("id"));
                            layer.batchDraw();
                        });                                                
                        hs.on('click', function(e) {
                            //console.log(e.target);
                            $scope.showThis(e.target);
                            layer.batchDraw();
                        });
                        layer.add(hs);
                        hs.moveToTop();
                        layer.batchDraw();    
                    }
                }
                $scope.stage.draw();
            };
            $scope.tryRemovingTube = function (tube) {
                var idStr = "#layer-" + tube;
                var ind = false;

                var layers = $scope.stage.find(idStr);
                layers.each(function(layer,idx) {
                    console.log("Destroyed " + layer.getAttr("id"));
                    layer.destroy();
                    ind = true;
                });
                idStr = "#HSlayer-" + tube;
                var layers = $scope.stage.find(idStr);
                layers.each(function(layer,idx) {
                    console.log("Destroyed " + layer.getAttr("id"));
                    layer.destroy();
                });

                $scope.stage.draw();
                //this.ind = ind;
                return (ind);
            };
            /*
            event handling for url, internal link types. 
            */
            $scope.showThis = function (t) {
                if (t.getAttr("linktype") == "internal") { 
                    //console.log("GETATTR=" + t.getAttr("linkto"));
                    var tube = t.getAttr("linkto");
                    var ind = $scope.tryRemovingTube(tube);
                    if (ind == false) {
                        $scope.loadTube(t.getAttr("linkto"));
                        $scope.stage.draw();
                    } else {
                        $scope.stage.draw();
                    }
                } else {
                    if (t.getAttr("linktype") == "url") { 
                        var linkto = t.getAttr("linkto");
                        window.open(linkto);
                    }
                }
                $scope.stage.draw();
            };
        })
        /*
        * Controller for tabs on the page
        */
        .controller("TabController",function($scope) {
            this.startWith = function() {
                //this.tab = "SDLC";
                this.setTab($scope.categories[0]["name"]);
            };
            this.setTab = function(tab){
                this.tab = tab;
                $scope.loadTab(tab);
                $scope.stage.batchDraw();
                console.log("Loading tab " + tab);
            };

            this.isSet = function(tab){
              return (this.tab === tab);
            };
        });
})();