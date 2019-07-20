

GUI = function(game) {

    this.game = game;
    this.start();
};

GUI.prototype = {

    start : function() {
        this.setupGUI();
    },

    setupGUI : function() {
        var UI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        UI.idealWidth = 768;
        UI.idelHeight = 1024;

        this.UI = UI;

        this.setupSideGUI(UI);
        this.setupMainGUI(UI);
        this.setupPuzzleGUI(UI);
        this.setupPuzzleStartGUI(UI);
    },

    setupSideGUI : function(UI) {

        var sideGUI = new BABYLON.GUI.Container("SideGUI");
        UI.addControl(sideGUI);
        this.sideGUI = sideGUI;

        //프레임
        {
            var topFrame1 = new BABYLON.GUI.Image("topFrame1", "Assets/gui/TopFrame.png");
            topFrame1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            topFrame1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            topFrame1.width = "100%";
            topFrame1.heightInPixels = 200;
            sideGUI.addControl(topFrame1);
            sideGUI.topFrame = topFrame1;
            topFrame1.isVisible = false;
        }

        //프로필 버튼
        {
            var profileButton = BABYLON.GUI.Button.CreateImageOnlyButton("ProfileButton", "Assets/gui/Boy_Face.png");
            profileButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            profileButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            profileButton.widthInPixels = 150;
            profileButton.heightInPixels = 150;
            profileButton.thickness = 0;        
            sideGUI.addControl(profileButton);  
            profileButton.onPointerDownObservable.add(function() {
                alert("Profile");
            });
        }

        //골드 정보 버튼
        {
            var goldInfoButton = new BABYLON.GUI.Button("GoldButton");
            goldInfoButton.leftInPixels = -250;
            goldInfoButton.topInPixels = 20;
            goldInfoButton.widthInPixels = 250;
            goldInfoButton.heightInPixels = 50;
            goldInfoButton.thickness = 0;
            goldInfoButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            goldInfoButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            sideGUI.addControl(goldInfoButton);

            var backImage = new BABYLON.GUI.Image("BackImage", "Assets/gui/UI_Common_Listbox_dark.png");
            backImage.widthInPixels = 200;
            backImage.heightInPixels = 50;                
            goldInfoButton.addControl(backImage); 

            var goldIcon = new BABYLON.GUI.Image("GoldIcon", "Assets/gui/UI_Icon_Goldcoin.png");
            goldIcon.widthInPixels = 55;
            goldIcon.heightInPixels = 55;
            goldIcon.leftInPixels = -100;
            goldInfoButton.addControl(goldIcon);

            var goldText = new BABYLON.GUI.TextBlock("GoldText", "000");
            goldText.widthInPixels = 200;
            goldText.heightInPixels = 50;
            goldText.textWrapping = true;
            goldText.color = "white";
            goldText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;            
            goldInfoButton.addControl(goldText);   

            goldInfoButton.onPointerDownObservable.add(function() {
                alert("Gold");
            });
        }

        //하트 표시
        {
            var HeartInfoButton = new BABYLON.GUI.Button("HeartInfoButton");
            HeartInfoButton.leftInPixels = 0;
            HeartInfoButton.topInPixels = 20;
            HeartInfoButton.widthInPixels = 250;
            HeartInfoButton.heightInPixels = 50;
            HeartInfoButton.thickness = 0;
            HeartInfoButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            HeartInfoButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            sideGUI.addControl(HeartInfoButton);

            var backImage = new BABYLON.GUI.Image("BackImage", "Assets/gui/UI_Common_Listbox_dark.png");
            backImage.widthInPixels = 200;
            backImage.heightInPixels = 50;                
            HeartInfoButton.addControl(backImage); 

            var heartIcon = new BABYLON.GUI.Image("HeartIcon", "Assets/gui/UI_Icon_Heart.png");
            heartIcon.widthInPixels = 55;
            heartIcon.heightInPixels = 55;
            heartIcon.leftInPixels = -100;
            HeartInfoButton.addControl(heartIcon);

            var heartText = new BABYLON.GUI.TextBlock("HeartText", "5/5");
            heartText.widthInPixels = 200;
            heartText.heightInPixels = 50;
            heartText.textWrapping = true;
            heartText.color = "white";
            heartText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;            
            HeartInfoButton.addControl(heartText);   

            HeartInfoButton.onPointerDownObservable.add(function() {
                alert("Heart");
            });
        }
    },

    setupMainGUI : function(UI) {

        var mainGUI = new BABYLON.GUI.Container("MainGUI");
        UI.addControl(mainGUI);
        this.mainGUI = mainGUI;

        var _this = this;

        //스테이지 버튼
        {
            var stageButton = BABYLON.GUI.Button.CreateImageWithCenterTextButton("StageButton", "Stage 1", "Assets/gui/UI_Button_Stage.png");
            stageButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            stageButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            stageButton.widthInPixels = 250;
            stageButton.heightInPixels = 250;
            stageButton.thickness = 0;
            stageButton.color = "black";//"white";
            mainGUI.addControl(stageButton);  
            var _this = this;
            stageButton.onPointerDownObservable.add(function() {
                //alert("Stage");
                _this.game.MainScene.onStageButtonClick();
            });
        }

        //배치 버튼
        {
            var deployButton = BABYLON.GUI.Button.CreateImageWithCenterTextButton("DeployButton", "Deploy", "Assets/gui/UI_Common_Button.png");
            deployButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            deployButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            deployButton.widthInPixels = 200;
            deployButton.heightInPixels = 200;
            deployButton.thickness = 0;
            deployButton.color = "black";//"white";
            mainGUI.addControl(deployButton);  
            deployButton.onPointerDownObservable.add(function() {
                alert("Not implemented");
            });
        }

        //소셜 버튼
        {
            var socialButton = BABYLON.GUI.Button.CreateImageWithCenterTextButton("SocialButton", "Social", "Assets/gui/UI_Common_Button.png");
            socialButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            socialButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            socialButton.widthInPixels = 200;
            socialButton.heightInPixels = 200;
            socialButton.thickness = 0;
            socialButton.color = "black";//"white";
            mainGUI.addControl(socialButton);  
            socialButton.onPointerDownObservable.add(function() {
                alert("Not implemented");
            });
        }
    },

    setupPuzzleImageButton : function(file) {
        if(this.puzzleGUI.completeImageButton != null)
        {
            this.puzzleGUI.removeControl(this.puzzleGUI.completeImageButton);
            this.puzzleGUI.completeImageButton = null;
        }

        var completeImageButton = BABYLON.GUI.Button.CreateImageOnlyButton("CompleteImage", "Assets/AssemblyObjs/" + file);
        completeImageButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        completeImageButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        completeImageButton.leftInPixels = 200;
        completeImageButton.topInPixels = 100;
        completeImageButton.widthInPixels = 100;
        completeImageButton.heightInPixels = 100;
        completeImageButton.thickness = 1;
        completeImageButton.color = "blue";//"white";
        this.puzzleGUI.addControl(completeImageButton);  
        completeImageButton.onPointerDownObservable.add(function() {

        });

        this.puzzleGUI.completeImageButton = completeImageButton;
    },

    setupPuzzleGUI : function(UI) {
        var puzzleGUI = new BABYLON.GUI.Container("PuzzleGUI");
        UI.addControl(puzzleGUI);
        this.puzzleGUI = puzzleGUI;

        //조립 진행상황 게이지
        {
            var assemblyGuageBG = new BABYLON.GUI.Image("assemblyGuageBG", "Assets/gui/UI_BI_Ga_03.png");
            assemblyGuageBG.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            assemblyGuageBG.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            assemblyGuageBG.leftInPixels = 320;
            assemblyGuageBG.topInPixels = 150;
            assemblyGuageBG.widthInPixels = 300;
            assemblyGuageBG.heightInPixels = 50;
            puzzleGUI.addControl(assemblyGuageBG);
            
            var progress1 = 0;
            var assemblyGuageFG = new BABYLON.GUI.Image("assemblyGuageBG", "Assets/gui/UI_BI_Ga_04.png");
            assemblyGuageFG.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            assemblyGuageFG.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            assemblyGuageFG.leftInPixels = 320;
            assemblyGuageFG.topInPixels = 150;
            assemblyGuageFG.widthInPixels = 300 * progress1;
            assemblyGuageFG.heightInPixels = 50;
            assemblyGuageFG.sourceWidth = 300 * progress1;
            puzzleGUI.addControl(assemblyGuageFG);           

            var assemblyText = new BABYLON.GUI.TextBlock("AssemblyText", "");
            assemblyText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            assemblyText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            assemblyText.leftInPixels = 320;
            assemblyText.topInPixels = 100;
            assemblyText.widthInPixels = 300;
            assemblyText.heightInPixels = 50;
            assemblyText.textWrapping = true;
            assemblyText.color = "black";
            puzzleGUI.addControl(assemblyText);

            var progressText = new BABYLON.GUI.TextBlock("ProgressText", "000/000");
            progressText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            progressText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            progressText.leftInPixels = 640;
            progressText.topInPixels = 100;
            progressText.widthInPixels = 120;
            progressText.heightInPixels = 50;
            progressText.textWrapping = true;
            progressText.color = "black";
            puzzleGUI.addControl(progressText);

            var percentText = new BABYLON.GUI.TextBlock("PercentText", "000%");
            percentText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            percentText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            percentText.leftInPixels = 640;
            percentText.topInPixels = 150;
            percentText.widthInPixels = 120;
            percentText.heightInPixels = 50;
            percentText.textWrapping = true;
            percentText.color = "black";
            puzzleGUI.addControl(percentText);

            puzzleGUI.assemblyGuage = assemblyGuageFG;
            puzzleGUI.assemblyName = assemblyText;
            puzzleGUI.progressText = progressText;
            puzzleGUI.percentText = percentText;
        }

        //메시지 팝업창
        {
            var msgFrame = new BABYLON.GUI.Image("msgFrame", "Assets/gui/TopFrame.png");
            msgFrame.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            msgFrame.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            msgFrame.widthInPixels = 500;
            msgFrame.heightInPixels = 150;
            msgFrame.alpha = 0.5;
            puzzleGUI.addControl(msgFrame);

            var msgText = new BABYLON.GUI.TextBlock("msgText", "");
            msgText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            msgText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            msgText.widthInPixels = 500;
            msgText.heightInPixels = 200;
            msgText.textWrapping = true;
            msgText.fontSize = 50;
            msgText.color = "white";
            msgText.shadowBlur = 1;
            msgText.shadowOffsetX = 5;
            msgText.shadowOffsetY = 5;
            puzzleGUI.addControl(msgText);

            msgFrame.isVisible = false;
            msgText.isVisible = false;

            puzzleGUI.msgFrame = msgFrame;
            puzzleGUI.msgText = msgText;
        }

        //타임 게이지
        {
            var timeGuageBG = new BABYLON.GUI.Image("timeGuageBG", "Assets/gui/UI_BI_Ga_03.png");
            timeGuageBG.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            timeGuageBG.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            timeGuageBG.leftInPixels = 0;
            timeGuageBG.topInPixels = -50;
            timeGuageBG.width = "100%"
            timeGuageBG.heightInPixels = 50;
            puzzleGUI.addControl(timeGuageBG);
            
            var timeGuageFG = new BABYLON.GUI.Image("timeGuageFG", "Assets/gui/UI_BI_Ga_05.png");
            timeGuageFG.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            timeGuageFG.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
            timeGuageFG.leftInPixels = 0;
            timeGuageFG.topInPixels = -50;
            timeGuageFG.widthInPixels = "0";
            timeGuageFG.heightInPixels = 50;
            timeGuageFG.sourceWidth = 0;
            puzzleGUI.addControl(timeGuageFG);

            puzzleGUI.timeGuageBG = timeGuageBG;
            puzzleGUI.timeGuage = timeGuageFG;
        }

        puzzleGUI.isEnabled = false;
        puzzleGUI.isVisible = false;
    },

    setupPuzzleStartGUI : function(UI) {
        var puzzleStartGUI = new BABYLON.GUI.Container("PuzzleStartGUI");
        UI.addControl(puzzleStartGUI);
        this.puzzleStartGUI = puzzleStartGUI;

        var _this = this;

        //팝업창 세팅
        {
            var popupBG = BABYLON.GUI.Button.CreateImageOnlyButton("PopupBG", "Assets/gui/Black.png");
            popupBG.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            popupBG.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            popupBG.width = "100%";
            popupBG.height = "100%";
            popupBG.alpha = 0.5;
            puzzleStartGUI.addControl(popupBG);
            popupBG.onPointerDownObservable.add(function() {
                puzzleStartGUI.isEnabled = false;
                puzzleStartGUI.isVisible = false;

                _this.mainGUI.isEnabled = true;
                _this.mainGUI.isVisible = true;
            });

            var frame = new BABYLON.GUI.Image("PopupFrame", "Assets/gui/UI_Button_Tap_G_Win.png");
            frame.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            frame.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            frame.widthInPixels = 700;
            frame.heightInPixels = 1000;
            frame.stretch = BABYLON.GUI.Image.STRETCH_NINE_PATCH;
            frame.sliceLeft = 60;
            frame.sliceRight = 77;
            frame.sliceTop = 55;
            frame.sliceBottom = 79;
            puzzleStartGUI.addControl(frame);

            var titleText = new BABYLON.GUI.TextBlock("TitleText", "Stage 0");
            titleText.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            titleText.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            titleText.topInPixels = "-400";
            titleText.widthInPixels = "500";
            titleText.heightInPixels = "80";
            titleText.textWrapping = true;
            titleText.fontSize = 70;
            titleText.color = "white";
            titleText.shadowBlur = 3;
            titleText.shadowOffsetX = 3;
            titleText.shadowOffsetY = 3;
            puzzleStartGUI.addControl(titleText);

            var stagePreview = new BABYLON.GUI.Image("StagePreview", "Assets/AssemblyObjs/Airplane.png");
            stagePreview.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            stagePreview.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            stagePreview.leftInPixels = 0;
            stagePreview.topInPixels = -50;
            stagePreview.widthInPixels = 600;
            stagePreview.heightInPixels = 600;
            puzzleStartGUI.addControl(stagePreview);

            var startButton = BABYLON.GUI.Button.CreateImageWithCenterTextButton("StartButton", "Start", "Assets/gui/UI_Common_Button_Y02.png");
            startButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            startButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            // startButton.image.stretch = BABYLON.GUI.Image.STRETCH_NINE_PATCH;
            // startButton.image.sliceLeft = 60;
            // startButton.image.sliceTop = 50;
            // startButton.image.sliceRight = 83;
            // startButton.image.sliceBottom = 79;
            startButton.textBlock.fontSize = 50;
            startButton.thickness = 0;
            startButton.topInPixels = 350;
            startButton.widthInPixels = 400;
            startButton.heightInPixels = 150;
            puzzleStartGUI.addControl(startButton);  
            var _this = this;
            startButton.onPointerDownObservable.add(function() {
                //alert("Stage");

                puzzleStartGUI.isEnabled = false;
                puzzleStartGUI.isVisible = false;

                _this.game.PuzzleScene.startStage(_this.game.curStageInfo);
            });

            puzzleStartGUI.titleText = titleText;
            puzzleStartGUI.stagePreview = stagePreview;
        }

        puzzleStartGUI.isEnabled = false;
        puzzleStartGUI.isVisible = false;
    },
};