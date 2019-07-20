

MainScene = function(game) {

    this.game = game;
    this.active = true;
    this.start();
};

MainScene.prototype = {

    start : function() {       

    },

    onClick : function() {
        //console.log("MainScene.onClick");
    },

    onStageButtonClick : function() {
        var mainGUI = this.game.GUI.mainGUI;
        mainGUI.isEnabled = false;
        mainGUI.isVisible = false;

        var puzzleStartGUI = this.game.GUI.puzzleStartGUI;

        puzzleStartGUI.titleText.text = "Stage " + this.game.curStageNum;
        puzzleStartGUI.stagePreview.source = "Assets/AssemblyObjs/" + this.game.curStageInfo.previewFile;

        puzzleStartGUI.isEnabled = true;
        puzzleStartGUI.isVisible = true;
        
        //this.game.PuzzleScene.startStage(this.game.curStageInfo);
    },
};