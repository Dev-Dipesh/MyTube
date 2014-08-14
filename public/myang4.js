(function () {
    "use strict";
    angular.module('tubeShow', [])
        .controller('TubeController', function ($scope) {
            $scope.init = function () {
                $scope.stage = new Kinetic.Stage({
                    container: 'myCanvas',
                    width: 1200,
                    height: 768
                });

                $scope.categories = [
                    {"id" : 1, "name": "SDLC",      "showName": "Development",  "tubes": ["Dev", "Test", "Arch", "Tool"]},
                    {"id" : 2, "name": "DATA",      "showName": "Data",         "tubes": ["Dev", "BigD", "Data"]},
                    {"id" : 3, "name": "TESTING",   "showName": "Testing",      "tubes": ["Dev", "Test", "Mobi"]},
                    {"id" : 4, "name": "ORA",   "showName": "ORA",      "tubes": ["Dev", "Test", "Mobi"]},
                ];

                $scope.tubes = {
                    "Dev":  {"ipath" : "images/Ind-Dev.png", "xoff": 90, "yoff": 10, "xsiz": "", "ysiz": ""},
                    "Test": {"ipath" : "images/Ind-Test.png", "xoff": 600, "yoff": 120, "xsiz": "", "ysiz": ""},
                    "Arch": {"ipath" : "images/Ind-Arch.png", "xoff": 160, "yoff": 400, "xsiz": "", "ysiz": ""},
                    "Mobi": {"ipath" : "images/Ind-Mobility.png", "xoff": 285, "yoff": 80, "xsiz": "", "ysiz": ""},
                    "Mtnc": {"ipath" : "images/Ind-Maint.png", "xoff": 560, "yoff": 447, "xsiz": "", "ysiz": ""},
                    "Data": {"ipath" : "images/Ind-DataRef.png", "xoff": 0, "yoff": 130, "xsiz": "", "ysiz": ""},
                    "BigD": {"ipath" : "images/Ind-BigD.png", "xoff": 345, "yoff": 118, "xsiz": "", "ysiz": ""},
                    "Tool": {"ipath" : "images/Ind-ToolsFr.png", "xoff": 128, "yoff": 68, "xsiz": "", "ysiz": ""}
                };
                /*
                * Hotspots are a list of areas where hyper links are to be provided for each image (if any)
                * Suitable SVG shapes (circle/ rect) are drawn out dynamically. 
                * LHS key is source and Target (to) is within RHS (value) JSON. Required Source+Target to be Unique. 
                * Internal link means overlaying another image (tube map) at a predefined location.
                * URL means a local file or a web link or a presentation / media about the offering
                * All information is the form JSON
                */
                $scope.hotSpots = {
                    "Dev": [
                        {"x": 240, "y": 40,  "link": {"type": "internal", "to": "Test"}, "hotspot": {"shape": "circle", "radius": 30}},
                        {"x": 232, "y": 699, "link": {"type": "internal", "to": "Arch"}, "hotspot": {"shape": "circle", "radius": 30}},
                        {"x": 575, "y": 543, "link": {"type": "internal", "to": "Mtnc"}, "hotspot": {"shape": "circle", "radius": 30}},
                        {"x": 117, "y": 455, "link": {"type": "internal", "to": "Tool"}, "hotspot": {"shape": "circle", "radius": 20}},
                        {"x": 465, "y": 700, "link": {"type": "url", "to": "http://www.genisys-group.com/consulting.html"},
                            "hotspot": {"shape": "circle", "radius": 30}},
                        {"x": 418, "y": 33, "link": {"type": "url", "to": "resources/SoftwareServicesGenisys.pdf"},
                            "hotspot": {"shape": "rect", "height": 30, "width": 160}}
                    ],
                    "Test": [
                        {"x": 895, "y": 393, "link": {"type": "internal", "to": "Mobi"}, "hotspot": {"shape": "circle", "radius": 20}},
                        {"x": 625, "y": 255, "link": {"type": "url", "to": "http://www.genisys-group.com/itapp_assurance_services.html"},
                                "hotspot": {"shape": "rect", "height": 20, "width": 60}}
                    ],
                    "Mobi": [
                        {"x": 675, "y": 335, "link": {"type": "url", "to": "http://www.genisys-group.com/mobility"},
                            "hotspot": {"shape": "rect", "height": 20, "width": 60}}
                    ],
                    "Mtnc": [
                        {"x": 692, "y": 488, "link": {"type": "url", "to": "http://www.genisys-group.com/application_management.html"},
                            "hotspot": {"shape": "rect", "height": 20, "width": 150}}
                    ],
                    "Arch": [
                        {"x": 255, "y": 467, "link": {"type": "internal", "to": "Tool"}, "hotspot": {"shape": "rect", "height": 20, "width": 100}},
                        {"x": 230, "y": 472, "link": {"type": "internal", "to": "Data"}, "hotspot": {"shape": "circle", "radius": 20}}
                    ],
                    "Data": [
                        {"x": 246, "y": 283, "link": {"type": "internal", "to": "BigD"}, "hotspot": {"shape": "circle", "radius": 15}},
                        {"x": 255, "y": 467, "link": {"type": "internal", "to": "Tool"}, "hotspot": {"shape": "rect", "height": 20, "width": 100}}
                    ],
                    "Tool": [
                        {"x": 685, "y": 207, "link": {"type": "internal", "to": "Test"}, "hotspot": {"shape": "circle", "radius": 15}}
                    ]
                };
                    //$scope.loadTube('Dev');
                    //$scope.stage.batchDraw();
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