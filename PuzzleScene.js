

PuzzleScene = function(game) {

    this.game = game;
    this.active = false;
    this.start();
};

PuzzleScene.prototype = {

    start : function() {       

    },

    startStage : function(stageInfo) {

        var _this = this;

        this.game.MainScene.active = false;
        this.active = true;
        this.playing = true;

        var GUI = this.game.GUI;
        var scene = this.game.scene;

        GUI.sideGUI.topFrame.isVisible = true;
        GUI.puzzleGUI.isEnabled = true;
        GUI.puzzleGUI.isVisible = true;

        this.inputEnable = false;

        this.curStageInfo = stageInfo;


        var townNode = scene.getNodeByName("Town");        
        if(townNode != null)
        {
            townNode.setEnabled(false);
        }

        var gridRoot = scene.getNodeByName("GridRoot");
        if(gridRoot == null)
        {
            gridRoot = new BABYLON.TransformNode("GridRoot", scene);
            scene.addTransformNode(gridRoot);

            var gridObj = scene.getNodeByName("#GridObj");            
            if(gridObj != null)
            {
                var centerGridSize = 20;
                var smallGridSize = 10;

                var newGridCenter = gridObj.clone("GridCenter", gridRoot, false);
                newGridCenter.scaling = new BABYLON.Vector3(centerGridSize, 0.01, centerGridSize);
                newGridCenter.material = gridObj.material.clone("GridMaterial");

                var min = -centerGridSize * 0.05 - smallGridSize * 0.05;
                var max = centerGridSize * 0.05 + smallGridSize * 0.05;
                var smallSize = smallGridSize * 0.1;

                var partGridPos = [
                    new BABYLON.Vector3(min, 0, min),
                    new BABYLON.Vector3(min, 0, min + smallSize * 3),
                    new BABYLON.Vector3(max, 0, min),
                    new BABYLON.Vector3(max, 0, min + smallSize * 3)
                ];


                this.partGridObjs = [];

                for(var i = 0; i < partGridPos.length; i++)
                {
                    var newGridSmall = gridObj.clone("GridSmall_" + i, gridRoot, false);
                    newGridSmall.material = gridObj.material.clone("GridMaterial");
                    newGridSmall.scaling = new BABYLON.Vector3(smallGridSize, 0.01, smallGridSize);
                    newGridSmall.position = partGridPos[i];                    
                    this.partGridObjs.push(newGridSmall);
                }

                this.partGridPos = partGridPos;
            }
        }

        this.gridRoot = gridRoot;

        var assemblyRoot = scene.getNodeByName("AssemblyRoot");
        if(assemblyRoot == null)
        {
            assemblyRoot = new BABYLON.TransformNode("AssemblyRoot", scene);
            scene.addTransformNode(assemblyRoot);
        }
        this.assemblyRoot = assemblyRoot;

        var guideBlockRoot = scene.getNodeByName("GuideBlockRoot");
        if(guideBlockRoot == null)
        {
            guideBlockRoot = new BABYLON.TransformNode("GuideBlockRoot", scene);
            scene.addTransformNode(guideBlockRoot);
        }

        this.guideBlockRoot = guideBlockRoot;

        var assemblyBlockRoot = scene.getNodeByName("AssemblyBlockRoot");
        if(assemblyBlockRoot == null)
        {
            assemblyBlockRoot = new BABYLON.TransformNode("AssemblyBlockRoot", scene);
            scene.addTransformNode(assemblyBlockRoot);
        }

        this.assemblyBlockRoot = assemblyBlockRoot;

        var strMatID = "#mat_1";
        this.guideMaterial = scene.getNodeByName(strMatID);

        var partList = [];
        this.loadAssemblyData(this.curStageInfo, assemblyRoot, partList, function(tasks) {            
            //console.log("AssemblyData load complete. partList.length:" + partList.length);

            _this.partList = partList;

            _this.beginPuzzle();
        });

        //하이라이트 세팅
        if(this.highlight == null)
        {
            this.highlight = new BABYLON.HighlightLayer("Highlight", scene);
            this.highlight.blurHorizontalSize = 1;
            this.highlight.blurVerticalSize = 1;
            this.highlight.innerGlow = true;
            this.highlight.outerGlow = true;
        }

        //카메라 세팅
        scene.cameras[0].detachControl(this.game.engine.getRenderingCanvas());
        
        var puzzleCam = null;

        if(scene.cameras.length == 1)
        {
            var alpha = 0.5;
            var beta = 10;
            var camTarget = new BABYLON.Vector3(0, 0, 0);
            puzzleCam = new BABYLON.ArcRotateCamera("PuzzleCamera", 0, alpha, beta, camTarget, scene);
            puzzleCam.allowUpsideDown = false;
            puzzleCam.lowerBetaLimit = alpha - 0.5;
            puzzleCam.upperBetaLimit = alpha + 0.5;
            puzzleCam.lowerRadiusLimit = beta-5;
            puzzleCam.upperRadiusLimit = beta;
            scene.addCamera(puzzleCam);
        }
        else
        {
            puzzleCam = scene.cameras[1];
        }
        
        puzzleCam.attachControl(this.game.engine.getRenderingCanvas());
        scene.activeCamera = puzzleCam;

        //사운드 세팅
        if(this.Sound == null)
        {
            this.Sound = {};
            this.Sound.wrong = new BABYLON.Sound("wrong", "Assets/Sound/Wrong.wav", scene);
            this.Sound.stageClear = new BABYLON.Sound("stageClear", "Assets/Sound/StageSucceed.mp3", scene);
            this.Sound.assembleSucceed = new BABYLON.Sound("assembleSucceed", "Assets/Sound/AssembleSucceed.mp3", scene);
            this.Sound.stageFail = new BABYLON.Sound("stageFail", "Assets/Sound/StageFail.mp3", scene);
        }

        setInterval(function() {
            _this.updatePerSec();
        }, 1000);
    },

    beginPuzzle : function() {

        //GUI세팅
        var puzzleGUI = this.game.GUI.puzzleGUI;
        this.game.GUI.setupPuzzleImageButton(this.curStageInfo.previewFile);
        puzzleGUI.assemblyGuage.widthInPixels = 0;
        puzzleGUI.assemblyGuage.sourceWidth = 0;
        puzzleGUI.assemblyName.text = this.curStageInfo.name;
        puzzleGUI.progressText.text = "0/" + this.partList.length;
        puzzleGUI.percentText.text = "0%";        
        puzzleGUI.timeGuage.width = "100%";
        puzzleGUI.timeGuage.sourceWidth = 652;

        this.timeLeft = this.curStageInfo.timeLimit;

        this.partList.sort(this.sortPartAscending);
        this.nextPart = 0;
        this.assembledCount = 0;
        this.guideBlockList = [];
        this.assemblyBlockList = [];

        this.createGuideBlocks();

        this.inputEnable = true;
    },

    updatePerSec : function() {
        if(this.playing == false)
        {
            return;
        }

        this.timeLeft--;

        if(this.timeLeft < 0)
        {
            this.timeLeft = 0;
        }
      
        this.updateTimeGuage();

        if(this.timeLeft == 0)
        {
            this.playing = false;
            this.showMessagePopup("Stage Fail!!", 3000);
        }
    },

    updateTimeGuage : function() {
        var percent = this.timeLeft / this.curStageInfo.timeLimit;
        var puzzleGUI = this.game.GUI.puzzleGUI;        
        puzzleGUI.timeGuage.width = Math.floor(percent * 100).toString() + "%";        
        puzzleGUI.timeGuage.sourceWidth = 652 * percent;
    },

    createGuideBlocks : function() {
        for(var i = 0; i < this.partGridPos.length; i++)
        {
            var guideBlock = this.createGuideBlock(this.partGridPos[i], i);
            if(i > 0)
            {
                guideBlock.setEnabled(false);
            }
            else
            {
                var _this = this;
                guideBlock.getChildMeshes(false, function(node){
                    //node.renderOutline = true;
                    //node.outlineWidth = 0.05;
                    //node.outlineColor = BABYLON.Color3.Blue();
                    _this.highlight.addMesh(node, BABYLON.Color3.Blue());
                    return false;
                });
            }
        }
    },

    onClick : function() {
        //console.log("PuzzleScene.onClick");
    
    },

    onPointerUp : function(downPointerX, downPointerY) {

        if(this.inputEnable == false)
        {
            return;
        }

        var scene = this.game.scene;

        if(Math.abs(scene.pointerX - downPointerX) > 10 || Math.abs(scene.pointerY - downPointerY) > 10)
        {
            return;
        }        

        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if(pickResult.hit)
        {
            //console.log("pickedMesh : " + pickResult.pickedMesh.name);

            var assemblyBlock = this.getPickedAssemblyBlock(pickResult.pickedMesh);
            if(assemblyBlock != null)
            {
                //console.log("picked AssemblyBlock : " + assemblyBlock.name);
                this.onAssemblyBlockClick(assemblyBlock);
                this.flickerPartGrid(this.partGridObjs[assemblyBlock.gridPosIndex]);
            }
            else
            {
                var partGrid = this.getPickedPartGrid(pickResult.pickedMesh);
                if(partGrid != null && partGrid.assemblyBlock != null)
                {
                    //console.log("picked Grid : " + partGrid.name + " assemblyBlock : " + partGrid.assemblyBlock.name);
                    this.onAssemblyBlockClick(partGrid.assemblyBlock);
                    this.flickerPartGrid(partGrid);
                }
            }
        }
    },

    flickerPartGrid : function(partGrid) {

        var mat = partGrid.material;
        var objState = { r: mat.diffuseColor.r, g: mat.diffuseColor.g, b: mat.diffuseColor.b };
        var targetTween = new TWEEN.Tween( mat.diffuseColor ).to( new BABYLON.Color3(1, 0, 0), 200 ).onUpdate( function() {
            mat.diffuseColor = this;
        }).onComplete(function(){
            new TWEEN.Tween( mat.diffuseColor ).to( new BABYLON.Color3(1, 1, 1), 200).onUpdate( function() {
                mat.diffuseColor = this;
            }).start();
        });

        targetTween.start();
    },

    onAssemblyBlockClick : function(assemblyBlock) {
        //console.log("assemblyBlock : " + assemblyBlock.name);

        if(this.guideBlockList.length == 0)
        {
            return;
        }

        var curGuideBlock = this.guideBlockList[0];

        if(this.isSameRefParts(assemblyBlock, curGuideBlock))
        {
            this.inputEnable = false;
            
            this.Sound.assembleSucceed.play();

            var _this = this;
            var animObj = { x: assemblyBlock.position.x, y: assemblyBlock.position.y, z : assemblyBlock.position.z };
            var tween = new TWEEN.Tween( animObj ).to( { x:0, y:0, z:0 }, 500).onUpdate( function() {
                assemblyBlock.position = new BABYLON.Vector3(this.x, this.y, this.z);
            }).easing(TWEEN.Easing.Quadratic.Out).onComplete( function() {
                _this.assembleObj(curGuideBlock, assemblyBlock);
                _this.inputEnable = true;
            });

            tween.start();
        }
        else
        {
            //실패 처리
            console.log("Fail!!");

            this.Sound.wrong.play();

            this.timeLeft = Math.max(0, this.timeLeft-1);
            this.updateTimeGuage();

            this.showMessagePopup("Wrong! Time -1", 500);
        }
    },

    assembleObj : function(curGuideBlock, assemblyBlock) {
        
        var gridPosIndex = assemblyBlock.gridPosIndex;
        var assemblyBlockPos = this.partGridPos[gridPosIndex];

        this.removeGuideBlock(curGuideBlock);
        this.removeAssemblyBlock(assemblyBlock);

        var _this = this;
        curGuideBlock.getChildMeshes(false, function(node){
            _this.highlight.removeMesh(node);
            return false;
        });

        curGuideBlock.refParts.forEach(function(element) {
            _this.assembledCount++;
            element.setEnabled(true);
        });

        curGuideBlock.dispose();

        assemblyBlock.dispose();

        //빈 PartGrid에 새로운 AssemblyBlock 배치
        var newGuideBlock = this.createGuideBlock(assemblyBlockPos, gridPosIndex);
        if(newGuideBlock != null)
        {
            newGuideBlock.setEnabled(false);
        }

        var puzzleGUI = this.game.GUI.puzzleGUI;
        var percent = this.assembledCount / this.partList.length;
        puzzleGUI.assemblyGuage.widthInPixels = 300 * percent;
        puzzleGUI.assemblyGuage.sourceWidth = 652 * percent;
        puzzleGUI.progressText.text = this.assembledCount + "/" + this.partList.length;
        puzzleGUI.percentText.text = Math.floor(percent * 100).toString() + "%";

        if(this.guideBlockList.length > 0)
        {
            this.guideBlockList[0].setEnabled(true);
            this.guideBlockList[0].getChildMeshes(false, function(node){
                //node.renderOutline = true;
                //node.outlineWidth = 0.05;
                //node.outlineColor = BABYLON.Color3.Blue();
                _this.highlight.addMesh(node, BABYLON.Color3.Blue());
                return false;
            });

            this.shuffleAssemblyBlocks();
        }
        else
        {
            this.Sound.stageClear.play();
            this.showMessagePopup("Stage Clear!", 2000);

            this.inputEnable = false;
            var animObj1 = this.gridRoot;
            var animObj2 = this.assemblyRoot;
            var targetTween = new TWEEN.Tween( animObj1.rotation ).to( new BABYLON.Vector3(0, Math.PI*2, 0), 3000 ).onUpdate( function() {
                animObj1.rotation = this;
                animObj2.rotation = this;
            }).onComplete(function(){
                animObj2.rotation = animObj1.rotation = new BABYLON.Vector3(0, 0, 0);
                _this.inputEnable = true;
            });
    
            targetTween.start();
        }
    },

    shuffleAssemblyBlocks : function() {        

        //assemblyBlockList를 랜덤으로 섞는다.
        this.assemblyBlockList.sort(function() {        
            return 0.5 - Math.random();
        });
        
        for(var i = 0; i < this.partGridObjs.length; i++)
        {
            this.partGridObjs[i].assemblyBlock = null;
        }

        //assemblyBlockList의 각 item들의 index에 따라 그 index에 맞는 gridPos로 옮긴다.
        for(var i = 0; i < this.assemblyBlockList.length; i++)
        {
            var assemblyBlock1 = this.assemblyBlockList[i];
            assemblyBlock1.gridPosIndex = i;
            assemblyBlock1.position = this.partGridPos[i];
            this.partGridObjs[i].assemblyBlock = assemblyBlock1;            
        }
    },

    isSameRefParts : function(assemblyBlock, guideBlock) {
        if(assemblyBlock.refParts == null || guideBlock.refParts == null)
        {
            return false;
        }
        
        if(assemblyBlock.refParts.length != guideBlock.refParts.length)
        {
            return false;
        }

        for(var i = 0; i < assemblyBlock.refParts.length; i++)
        {
            var part1 = assemblyBlock.refParts[i];
            var part2 = guideBlock.refParts[i];
            
            if(part1.name != part2.name)
            {
                return false;
            }

            var localPos1 = part1.getPositionExpressedInLocalSpace();
            var localPos2 = part2.getPositionExpressedInLocalSpace();
            var offset = localPos1.subtract(localPos2);

            //console.log("part1 : " + part1.name + ", part2 : " + part2.name + " lengthSqr : " + offset.lengthSquared());

            if(offset.lengthSquared() > 0.00001)
            {
                return false;
            }
        }

        return true;
    },

    getPickedGuideBlock : function(pickedMesh) {

        var node = pickedMesh;

        while(node != null)
        {
            if(node.parent == this.guideBlockRoot)
            {
                return node;
            }

            node = node.parent;
        }

        return null;
    },

    getPickedPartGrid : function(pickedMesh) {
        var node = pickedMesh;

        while(node != null)
        {
            if(node.parent == this.gridRoot)
            {
                return node;
            }

            node = node.parent;
        }

        return null;
    },
    
    getPickedAssemblyBlock : function(pickedMesh) {

        var node = pickedMesh;

        while(node != null)
        {
            if(node.parent == this.assemblyBlockRoot)
            {
                return node;
            }

            node = node.parent;
        }

        return null;
    },

    removeGuideBlock : function(guideBlock) {
        var idx = this.guideBlockList.indexOf(guideBlock);
        if(idx > -1)
        {
            this.guideBlockList.splice(idx, 1);
            //console.log("guideBlock removed.  length : " + this.guideBlockList.length);
        }
    },

    removeAssemblyBlock : function(assemblyBlock) {
        var idx = this.assemblyBlockList.indexOf(assemblyBlock);
        if(idx > -1)
        {
            this.assemblyBlockList.splice(idx, 1);
            //console.log("assemblyBlock removed.  length : " + this.assemblyBlockList.length);
        }
    },

    createGuideBlock : function(assemblyBlockPos, gridPosIndex) {

        if(this.nextPart >= this.partList.length)
        {
            return;
        }

        var count = 4;
        var scene = this.game.scene;

        var guideBlock = new BABYLON.TransformNode("GuideBlock", scene);
        guideBlock.parent = this.guideBlockRoot;
        guideBlock.refParts = [];      

        this.guideBlockList.push(guideBlock);

        var assemblyBlock = new BABYLON.TransformNode("AssemblyBlock", scene);
        assemblyBlock.parent = this.assemblyBlockRoot;
        assemblyBlock.gridPosIndex = gridPosIndex;
        assemblyBlock.refParts = [];
        this.partGridObjs[gridPosIndex].assemblyBlock = assemblyBlock;

        this.assemblyBlockList.push(assemblyBlock);

        guideBlock.refAssemblyBlock = guideBlock;

        var lastPart = null;

        for(var i = 0; i < count; i++)
        {
            if(this.nextPart >= this.partList.length)
            {
                break;
            }

            var part1 = this.partList[this.nextPart];

            // if(lastPart != null)
            // {
            //     var offset = part1.position.subtract(lastPart.position);
            //     //console.log("offset.lengthSq : " + offset.lengthSquared());
            //     if(offset.lengthSquared() >= 0.49)
            //     {
            //         break;
            //     }                
            // }            
            

            //조립 블럭 생성
            var assemblyPart1 = part1.clone(part1.name, assemblyBlock, false);
            assemblyPart1.setEnabled(true);
            assemblyPart1.material = part1.material.clone(part1.material.name);
            assemblyBlock.refParts.push(assemblyPart1);            

            //가이드 블럭 생성
            var guidePart1 = part1.clone(part1.name, guideBlock, false);
            guidePart1.setEnabled(true);            
            guidePart1.material = part1.material.clone(part1.material.name);
            guideBlock.refParts.push(part1);            

            lastPart = part1;
            this.nextPart++;
        }

        assemblyBlock.setAbsolutePosition(assemblyBlockPos);

        return guideBlock;
    },

    showMessagePopup : function(text, duration) {
        var GUI = this.game.GUI;
        var puzzleGUI = GUI.puzzleGUI;
        puzzleGUI.msgFrame.isVisible = true;
        puzzleGUI.msgText.text = text;
        puzzleGUI.msgText.isVisible = true;

        puzzleGUI.msgFrame.scaleX = 0;
        puzzleGUI.msgFrame.scaleY = 0;
        var scale = { x: 0, y: 0 };
        //스케일업
        var tween = new TWEEN.Tween( scale ).to( { x:1, y:1 }, 200).onUpdate( function() {
            puzzleGUI.msgText.scaleX = puzzleGUI.msgFrame.scaleX = this.x;
            puzzleGUI.msgText.scaleY = puzzleGUI.msgFrame.scaleY = this.y;
        }).easing(TWEEN.Easing.Quadratic.Out).onComplete( function() {

            //스케일 유지
            scale = { x: 1, y: 1 };
            var tween1 = new TWEEN.Tween( scale ).to( {x:1.1, y:1.1 }, duration).onUpdate( function() {
                puzzleGUI.msgText.scaleX = puzzleGUI.msgFrame.scaleX = this.x;
                puzzleGUI.msgText.scaleY = puzzleGUI.msgFrame.scaleY = this.y;
            }).easing(TWEEN.Easing.Quadratic.Out).onComplete( function() {

                //스케일다운
                scale = { x: 1.1, y: 1.1 };
                var tween2 = new TWEEN.Tween( scale ).to( {x:0, y:0 }, 200).onUpdate( function() {
                    puzzleGUI.msgText.scaleX = puzzleGUI.msgFrame.scaleX = this.x;
                    puzzleGUI.msgText.scaleY = puzzleGUI.msgFrame.scaleY = this.y;
                }).easing(TWEEN.Easing.Quadratic.Out).onComplete( function() {

                    puzzleGUI.msgFrame.isVisible = false;
                    puzzleGUI.msgText.isVisible = false;
                });

                tween2.start();

            });

            tween1.start();
        });

        tween.start();
    },

    loadAssemblyData : function(stageInfo, parentNode1, partList, callback) {
        var assetsManager = new BABYLON.AssetsManager(this.game.scene);        
        this.addLoadPartTask(assetsManager, "Assets/AssemblyObjs/" + stageInfo.dataFile, parentNode1, partList);
        assetsManager.load();
        assetsManager.onFinish = callback;
    },

    addLoadPartTask : function(assetsManager, filename, parentNode1, partList) {
        var binaryTask = assetsManager.addBinaryFileTask("binary task", filename);
        
        var _this = this;

        binaryTask.onSuccess = function (task) {
            var dataView = new DataView(task.data);
            var version = dataView.getInt32(0, true);
            var partCount = dataView.getInt32(4, true);

            console.log("version : " + version);
            console.log("PartCount : " + partCount);

            dataView.loadPart_Ver12 = function(dataView, offset, parentNode, scene, partList1) {
                var partID = dataView.getInt16(offset, true);
                offset += 2;
        
                var paintID = dataView.getUint8(offset, true);
                offset += 1;
        
                var r = dataView.getUint8(offset, true);
                offset += 1;
                var g = dataView.getUint8(offset, true);
                offset += 1;
                var b = dataView.getUint8(offset, true);
                offset += 1;
        
                var localPosX = dataView.getFloat32(offset, true);
                offset += 4;
                var localPosY = dataView.getFloat32(offset, true);
                offset += 4;
                var localPosZ = dataView.getFloat32(offset, true);
                offset += 4;

                var rot = dataView.getInt32(offset, true);
                offset += 4;
        
                var rotation = new BABYLON.Vector3(0, 0, 0);
                rotation.x = (rot & 0x3FF00000) >> 20;
                rotation.y = (rot & 0xFFC00) >> 10;
                rotation.z = rot & 0x3FF;
                
                var rotationRad = new BABYLON.Vector3(0, 0, 0);
                rotationRad.x = rotation.x * Math.PI / 180.0;
                rotationRad.y = rotation.y * Math.PI / 180.0;
                rotationRad.z = rotation.z * Math.PI / 180.0;


                var childCount = dataView.getInt32(offset, true);
                offset += 4;

                //console.log("PartID : " + partID + " paintID : " + paintID + " r: " + r + " g: " + g + " b: " + b + " posX:" + localPosX + " posY:" + localPosY + " posZ:" + localPosZ  + " rot: " + rot + " childCount: " + childCount);
        
                var strPartID = "#part_" + partID;
                var foundPart = scene.getNodeByName(strPartID);
                if(foundPart != null)
                {
                    var newTMNode = foundPart.clone("Clone_" + partID, parentNode, false);                        
                    newTMNode.position = new BABYLON.Vector3(localPosX, localPosY, localPosZ);                    
                    newTMNode.rotation = rotationRad;

                    var strMatID = "#mat_" + paintID;
                    var foundMaterialObj = scene.getNodeByName(strMatID);
                    if(foundMaterialObj != null)
                    {
                        var mat = foundMaterialObj.material;
                        if(mat != null)
                        {
                            
                            var newMat = mat.clone(mat.name);
                            newMat.diffuseColor = new BABYLON.Color3(r / 255.0, g / 255.0, b / 255.0);
                            newTMNode.material = newMat;

                            newTMNode.getChildMeshes(false, function(node){
                                node.material = newMat;
                                return false;
                            });
                        }
                        else
                        {
                            console.log("foundMaterialObj.material is null : " + strMatID + " matName : " + mat.name);
                        }
                    }
                    else
                    {
                        console.log("Cannot found material : " + strMatID);
                    }

                    if(partList1 != null)
                    {
                        partList1.push(newTMNode);
                    }
                    newTMNode.setEnabled(false);
                }
                else
                {
                    console.log("Cannot found part : " + partID);;
                }

                if(childCount > 0)
                {
                    for(var i = 0; i < childCount; i++)
                    {
                        offset = this.loadPart_Ver12(dataView, offset, parentNode, scene, partList1);
                    }
                }

                return offset;
            };

            var offset1 = 8;

            if(version == 12)
            {
                for(var i = 0; i < partCount; i++)
                {
                    offset1 = dataView.loadPart_Ver12(dataView, offset1, parentNode1, _this.game.scene, partList);
                }
            }
        };
    },

    sortPartAscending : function(a, b) {
        if(a.position.y > b.position.y)
        {
            return 1;
        }
        else if(b.position.y > a.position.y)
        {
            return -1;
        }
        else if(a.position.x > b.position.x)
        {
            return 1;
        }
        else if(b.position.x > a.position.x)
        {
            return -1;
        }
        else if(a.position.z > b.position.z)
        {
            return 1;
        }
        else if(b.position.z > a.position.z)
        {
            return -1;
        }
        else
        {
            return 0;
        }
    },
};