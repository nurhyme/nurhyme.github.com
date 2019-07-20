
Game = function(canvasId) {

    var canvas          = document.getElementById(canvasId);
    this.engine         = new BABYLON.Engine(canvas, true);
    this.canvas = canvas;

    var _this = this;

    // Resize window event
    window.addEventListener("resize", function() {
        _this.engine.resize();
    });

    window.addEventListener("click", function() {
        _this.onClick();
    });

    window.addEventListener("pointerdown", function() {
        _this.onMouseDown();
    });

    window.addEventListener("pointerup", function() {
        _this.onMouseUp();
    });

    // Run the game
    this.start();
};

Game.prototype = {

    start : function() {

        this.curStageNum = 1;                

        var _this = this;

        //파트 데이터(Json) 로드
        this.partInfo = null;        
        this.readJson("Assets/PartInfo.json", function(text){
            _this.partInfo = JSON.parse(text);

            console.log("Json load complete");

            //씬 로드
            _this.loadScene(function() {
                console.log("Scene load complete");

                _this.GUI = new GUI(_this);
                _this.MainScene = new MainScene(_this);
                _this.PuzzleScene = new PuzzleScene(_this);
            });
        });

        this.readJson("Assets/StageInfo.json", function(text){
            _this.stageInfo = JSON.parse(text);

            _this.curStageInfo = _this.findStageInfo(_this.curStageNum);

            // console.log("stageInfo load complete.  length : " + _this.stageInfo.length);

            // for(var i = 0; i < _this.stageInfo.length; i++)
            // {
            //     var s = _this.stageInfo[i];
            //     console.log("stageInfo #" + i + " stageNum:" + s.stageNum + " name:" + s.name + " previewFile:" + s.previewFile + " dataFile:" + s.dataFile + " timeLimit:" + s.timeLimit + " blockPartCount:" + s.blockPartCount);
            // }
        });
    },

    onClick : function() {
        if(this.MainScene.active)
        {
            this.MainScene.onClick();
        }
        else if(this.PuzzleScene.active)
        {
            this.PuzzleScene.onClick();
        }
    },

    onMouseDown : function() {
        //console.log("onMouseDown x : " + this.scene.pointerX + " " + this.scene.pointerY);
        this.downPointerX = this.scene.pointerX;
        this.downPointerY = this.scene.pointerY;
    },

    onMouseUp : function() {
        //console.log("onMouseUp x : " + this.scene.pointerX + " " + this.scene.pointerY);
        if(this.PuzzleScene.active)
        {
            this.PuzzleScene.onPointerUp(this.downPointerX, this.downPointerY);
        }
    },

    readJson : function(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        };
        rawFile.send(null);
    },

    loadScene : function(callback) {
        var _this = this;
        BABYLON.SceneLoader.Load("Assets/scenes/", "MBT.babylon", this.engine, function (newScene) {
            // Wait for textures and shaders to be ready
            newScene.executeWhenReady(function () {
                // Attach camera to canvas inputs                
                newScene.cameras[0].attachControl(_this.engine.getRenderingCanvas());
                newScene.activeCamera = newScene.cameras[0];

                //newScene.debugLayer.show();

                _this.scene = newScene;

                var partsRoot = newScene.getNodeByName('PartsRoot');                
                partsRoot.setEnabled(false);

                var matRoot = newScene.getNodeByName("MatRoot");
                matRoot.setEnabled(false);

                //var water = newScene.getNodeByName("Water");
                //var waterTex = water.material.map;                

                newScene.registerBeforeRender(function() {                    
                    TWEEN.update( window.performance.now() );
                });

                var music = new BABYLON.Sound("Music", "Assets/Sound/bgmTitle.mp3", newScene, null, { loop: true, autoplay: true });
                // var music = new BABYLON.Sound("Music", "Assets/bgmTitle.mp3", newScene,
                // function () {  
                //     music.play();
                //  });

                // Once the scene is loaded, just register a render loop to render it
                _this.engine.runRenderLoop(function() {                   
                    newScene.render();
                });
                
                callback();
            });
        }, function (progress) {
            //console.log(progress);
        });
    },

    findStageInfo : function(stageNum) {
        for(var i = 0; i < this.stageInfo.length; i++)
        {
            var stageInfo = this.stageInfo[i];
            if(stageInfo.stageNum == stageNum)
            {
                return stageInfo;
            }
        }

        return null;
    },
};