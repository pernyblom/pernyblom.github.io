package {

    import flash.display.Sprite;

    public class Main extends Sprite {
        
        public var game:Game;
             
        public function Main() {            
            game = new Game();
            addChild(game);
            game.init();
        }
        
    }
}

import flash.events.TimerEvent;
import flash.utils.Timer;
import flash.geom.Vector3D;
import flash.geom.Rectangle;
import flash.ui.Keyboard;
import flash.events.MouseEvent;
import flash.utils.setTimeout;
import flash.text.TextFormat;
import flash.text.TextField;
import flash.display.Bitmap;
import flash.display.BitmapDataChannel;
import flash.display.BitmapData;
import flash.events.KeyboardEvent;
import flupie.textanim.*;
import net.wonderfl.utils.FontLoader;
import caurina.transitions.*;
import org.si.sion.events.*;
import org.si.sound.*;
import org.si.sound.patterns.*;
import org.si.sion.*;
import org.si.sion.sequencer.*;
import org.si.sound.synthesizers.*;
import org.si.sion.utils.*;
import flash.events.Event;
import flash.display.Sprite;
import flash.display.Stage;
import away3d.cameras.*;
import away3d.lights.*;
import away3d.containers.*;
import away3d.primitives.*;
import away3d.core.base.*;
import away3d.core.render.*;
import away3d.materials.*;


// Main Modes
var SHOWING_INTRO:int = 0;
var PLAYING:int = 1;

// Intro modes


// Play modes
var LEVEL_INTRO:int = 0;
var PLAYING_LEVEL:int = 1;

class PlayerData {
    public var healthLevel:int = 0;
    public var batteryLevel:int = 0;
    public var speedLevel:int = 0;
    public var fightLevel:int = 0;
    public var musicRadiusLevel:int = 0;
    public var musicStrengthLevel:int = 0;    
    
}


class Game extends Sprite {

    public var playerData:PlayerData = new PlayerData();

    public var sionPresets:SiONPresetVoice;
    
    
    public var mode:int = PLAYING;
    public var introMode:int = 0;
    public var playMode:int = LEVEL_INTRO;
    
    public var counter:int = 0;
    public var counter2:int = 0;
    public var counter3:int = 0;
    
    public var sionDriver:SiONDriver;
        
    public var mainCamera:Camera3D;
    public var view:View3D;
    public var scene:Scene3D;        
    
    public var keysDown:Object = {};
    public var rnd:Rndm = new Rndm(342);        
    public var fontsLoaded:Boolean = false;
    public var musicSequencer:MusicSequencer = null;
    
    public var worldParticles:Array = [];
    public var screenParticles:Array = [];
    public var movingObjects:Array = [];
    public var solidObjects:Array = [];
    
    public var globalActions:Array = [];
    public var actionQueues:Object = {};    
    
    public var currentLevel:Level;
 
    public var sfxPlayer:SfxPlayer = new SfxPlayer();
    
    
    public function Game() {
    }

    public function getGroundZ(x:Number, y:Number):Number {
        return currentLevel.groundMesh.getGroundZ(x, y);
    }


    public function reset():void {
        playerData = new PlayerData();
    }
    
    public function tickAll(arr:Array):void {
        for (var i:int = arr.length-1; i>= 0; i--) {
            var o:GameObject = arr[i];
            o.tick(this);
            if (o.removeMe) {
                o.removed(this);
                arr.splice(i, 1);                
            }
        }
    } 


    public function addFort(x:Number, y:Number, level:Level, spawner:ObstacleSpawner):void {
	
		
	
        var sketch:Array = [
        [1, 1, 0, 0, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1]
        ];
        
        var wallSize:Number = 20;
        var wallHeight:Number = 40;

        var fortRect:Rectangle = new Rectangle(x, y, wallSize * sketch[0].length, wallSize * sketch.length);
        spawner.noPlaceRectangles.push(fortRect);
		
        var fortCenterX:Number = fortRect.x + fortRect.width * 0.5;
        var fortCenterY:Number = fortRect.y + fortRect.height * 0.5;
        
        var modifier:CircularConstantHeightModifier = new CircularConstantHeightModifier();
        modifier.innerRadius = Math.max(fortRect.width / 2, fortRect.height / 2) + wallSize;
        modifier.outerRadius = modifier.innerRadius + 50;
        modifier.centerX = fortCenterX;
        modifier.centerY = fortCenterY;
        modifier.targetHeight = -20;
        
        level.groundMesh.heightModifiers.push(modifier);
        
        
        var boss:NPC = new NPC();
        boss.npcType = BOSS_1;
		boss.health = 0.5;
        boss.attackInterval = 30;
        boss.maxSpeed = 2;
        boss.position.x = fortCenterX;
        boss.position.y = fortCenterY;
        boss.modeWhenAlone = WAIT_MODE;
        boss.mode = WAIT_MODE;
        boss.resistsDance = true;
        level.movingObjects.push(boss);

		level.boss = boss;
 
		trace("Your mission is to kill the big bad boss");
		trace("He is very close, but doesn't dance...");
		trace("Make other dance with 'D' and fight with 'F'");
 
        for (var j:int = 0; j<sketch.length; j++) {
            var arr:Array = sketch[j];
            for (var i:int = 0; i<arr.length; i++) {
            
                var item:int = arr[i];
                if (item == 1) {
                    var wallX:Number = i * wallSize + x;
                    var wallY:Number = j * wallSize + y;
                    
                    var wall:Wall = new Wall();
                    wall.position.x = wallX;
                    wall.position.y = wallY;
                    wall.size = wallSize;
                    wall.height = wallHeight;
                    level.solidObjects.push(wall);
                }
            }
        }
        
    }
    
    // index 0 is the intro scene level
    public function loadLevel(index:int):void {
        var level:Level = new Level();

        if (index == 0) {
            // Intro scene with a slow camera moving towards the robot
            

            var robot:NPC = new NPC();
            robot.npcType = BOSS_1;
            robot.position.x = 0;
            robot.position.y = 0;
            robot.position.z = 0;

            level.cameraController = new SlowApproachCameraController(this, mainCamera, robot);
            
            level.movingObjects.push(robot);
            
        } else {
            level.groundMesh = new GroundMesh();
            level.player = new Player();
            level.player.position = new Vector3D(level.startX, level.startY, 0);
            level.cameraController = new InGameCameraController(this, mainCamera);
            
            var rnd:Rndm = new Rndm(3425);
            var spawner:ObstacleSpawner = new ObstacleSpawner();
            level.objectSpawners.push(spawner);
            
            addFort(0, 500, level, spawner);
        }
        currentLevel = level;
    }
    
    public function init():void {
        inittrace(stage);
       
        graphics.beginFill(0x333333);
        graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
        graphics.endFill();
       
        var fl:FontLoader = new FontLoader();
        fl.load( "Bebas" );
        fl.addEventListener( Event.COMPLETE, function(ev :Event) :void {
            fontsLoaded = true;
        });          
        
        sionDriver = new SiONDriver();
        sionDriver.play();
        
        sionPresets = new SiONPresetVoice();        

        
        mainCamera = new Camera3D();
        mainCamera.zoom = 4;
        mainCamera.focus = 200;
        
        // mainCamera.lookAt(new Vector3D(0.0, 0, 0), new Vector3D(0, 1, 0));
        
        scene = new Scene3D();
        
        view = new View3D({camera:mainCamera, x:250, y:200, scene: scene});
        // view.renderer = new QuadrantRenderer();
        addChild(view);
        
        stage.addEventListener(Event.ENTER_FRAME, onEnterFrame);
        stage.addEventListener(KeyboardEvent.KEY_DOWN, onKeyDown);
        stage.addEventListener(KeyboardEvent.KEY_UP, onKeyUp);
        stage.addEventListener(MouseEvent.MOUSE_DOWN, onMouseClicked);            
        stage.addEventListener(Event.RESIZE, onResize);
        
        loadLevel(1);
    }
    
    
    public function tick():void {
        try {
            tickAll(solidObjects);
            tickAll(movingObjects);
            tickAll(worldParticles);
            tickAll(screenParticles);
            for (var key:String in actionQueues) {
                tickAll(actionQueues[key]);
            }
            tickAll(globalActions);
        } catch (error:Error) {
            trace("Error global game tick " + error.name + " " + error.message);
        }
        try {
            if (currentLevel) {
                currentLevel.tick(this);
            }
        } catch (error:Error) {
            trace("Error level tick " + error.name + " " + error.message);
        }
        counter++;
    }
        
        
    public function onResize(e:Event):void {
    }

    public function onEnterFrame(e:Event):void {
        tick();
        view.render();
    }

    public function keyDown(key:int):Boolean {
        return keysDown[key];
    }

    public function onMouseClicked(event:MouseEvent):void {                   
//         trace("Mouse clicked " + stage.mouseX + ", " + stage.mouseY);
    }

    public function onKeyDown(event:KeyboardEvent):void {            
        keysDown[event.keyCode] = true;
    }

    public function onKeyUp(event:KeyboardEvent):void {            
        keysDown[event.keyCode] = false;
    }
    
}

class RectangularConstantHeightModifier implements HeightModifier {

    public var innerRectangle:Rectangle = new Rectangle(0, 0, 100, 100);
    public var outerBorder:Number = 20;
    
    public var targetHeight:Number = -50;

    private var outerRectangle:Rectangle = null;
    
    public function applicable(x:Number, y:Number):Boolean {
        if (!outerRectangle) {
            outerRectangle = new Rectangle(innerRectangle.x - outerBorder, innerRectangle.y - outerBorder, innerRectangle.width + outerBorder * 2, innerRectangle.height + outerBorder * 2);
            // trace("creating outer rectangle " + outerRectangle);
        }
        // if (Math.random() < 0.01) {
            // trace("Checking applicable " + x + ", " + y + " rect: " + outerRectangle);
        // }
        return outerRectangle.contains(x, y);
    }
    
    public function applyModifier(x:Number, y:Number, z:Number):Number {
        // trace("applying height modifier " + x + " " + y);
        if (innerRectangle.contains(x, y)) {
            // trace("returning height " + targetHeight);
            return targetHeight;
        } else {
            // var fractionX:Number = Math.max(0, (outerBorder - Math.min(Math.abs(innerRectangle.x - x), Math.abs(innerRectangle.x + innerRectangle.width - x))) / outerBorder);
            // var fractionY:Number = Math.max(0, (outerBorder - Math.min(Math.abs(innerRectangle.y - y), Math.abs(innerRectangle.y + innerRectangle.height - y))) / outerBorder);
            
            return z;
        }
    }

}


class CircularConstantHeightModifier implements HeightModifier {

    public var centerX:Number = 0;
    public var centerY:Number = 0;
    public var innerRadius:Number = 100;
    public var outerRadius:Number = 150;
    
    public var targetHeight:Number = -50;
    
    public function applicable(x:Number, y:Number):Boolean {
        
        // if (Math.random() < 0.01) {
            // trace("Checking applicable " + x + ", " + y + " rect: " + outerRectangle);
        // }
        return distanceBetween(x, y, centerX, centerY) < outerRadius;
    }
    
    public function applyModifier(x:Number, y:Number, z:Number):Number {
        // trace("applying height modifier " + x + " " + y);
        var dist:Number = distanceBetween(x, y, centerX, centerY);
        
        var fraction:Number = (dist - innerRadius) / (outerRadius - innerRadius);
        
        if (fraction <= 0) {
            return targetHeight;
        } else if (fraction <= 1) {
            return fraction * z + (1.0 - fraction) * targetHeight;
        } else {
            return z;
        }
    }

}



class GameObject {
    public var removeMe:Boolean = false;

    public var initialized:Boolean = false;
    
    public function initIfNecessary(game:Game):void {
        if (!initialized) {
            init(game);
            initialized = true;
        }
    }
    
    public function init(game:Game):void {
    }
    
    public function tick(game:Game):void {
        initIfNecessary(game);
    }
    
    public function removed(game:Game):void {
        // Remove yourself from the scene etc.
    }
}

class CameraController extends GameObject {
    public var game:Game;
    public var camera:Camera3D;
    
    public function CameraController(game:Game, camera:Camera3D):void {
        this.game = game;
        this.camera = camera;
    }
    override public function tick(game:Game):void {
        super.tick(game);
    }
}

class InGameCameraController extends CameraController {    
    public function InGameCameraController(game:Game, camera:Camera3D):void {
        super(game, camera);
    }
    
    override public function tick(game:Game):void {
        super.tick(game);
        var level:Level = game.currentLevel;
        if (level && level.player) {
            var playerPosition:Vector3D = level.player.position;
            camera.x = playerPosition.x;
            camera.y = playerPosition.y - 60;
            camera.z = playerPosition.z - 30;

            // Do some cross product magic to get a nice up.
            // We have the forward vector and need a vector that is perpendicular to forward and z-axis
            // Alas: forward x z-axis gives the right vector. The result is then forward x right
            camera.lookAt(new Vector3D(playerPosition.x, playerPosition.y, playerPosition.z), new Vector3D(0, 1, -1));
        }    
    }
}

class SlowApproachCameraController extends CameraController {    

    public var obj:PhysicalObject;

    public function SlowApproachCameraController(game:Game, camera:Camera3D, obj:PhysicalObject):void {
        super(game, camera);
        this.obj = obj;
    }
    
    
    
    override public function tick(game:Game):void {
        super.tick(game);

        var playerPosition:Vector3D = obj.position;
        camera.x = playerPosition.x;
        camera.y = playerPosition.y - 30;
        camera.z = playerPosition.z - 30;

        // Do some cross product magic to get a nice up.
        // We have the forward vector and need a vector that is perpendicular to forward and z-axis
        // Alas: forward x z-axis gives the right vector. The result is then forward x right
        camera.lookAt(new Vector3D(playerPosition.x, playerPosition.y, playerPosition.z), new Vector3D(0, 1, -1));
        
        obj.container.rotationZ = game.counter * 0.5;
        
        // trace("camera y " + camera.y);
    }
}

class GameAction extends GameObject {
    public var actionCounter:int = 0;
    public var actionDuration:int = 60;
    
    override public function tick(game:Game):void {
        super.tick(game);
        actionCounter++;
        if (actionCounter > actionDuration) {
            removeMe = true;
        }
    }
}

class SerialAction extends GameAction {

    public var actions:Vector.<GameAction> = new Vector.<GameAction>();
    
    public var actionIndex:int = 0;
    
    override public function removed(game:Game):void {
        for (var i:int = 0; i<actions.length; i++) {
            actions[i].removed(game);
        }
    }
    
    override public function tick(game:Game):void {
        // Remove me when the last action is done...
        if (actionIndex < actions.length) {
            var action:GameAction = actions[actionIndex];
            if (action.removeMe) {
                actionIndex++;
            } else {
                action.tick(game);
            }
        } else {
            removeMe = true;
        }
    }
    
}


 var CENTER_SCREEN_MESSAGE:int = 0;
 var SCREEN_INFO:int = 1;
 var WORLD_INFO:int = 2;


class TextEffectAction extends GameObject {

    public var x:Number = 0;
    public var y:Number = 0;
    
    public var sizeMultiplier:Number = 1.0;
        
    public var extraYStepLength:Number = 10;
    public var extraXStepLength:Number = 0;
    
    public var strings:Array = [];

    public var addedStuff:Array = [];
    
    public var type:int = CENTER_SCREEN_MESSAGE;

    override public function init(game:Game):void {    
        super.init(game);

        switch (type) {
            case CENTER_SCREEN_MESSAGE:
                for (var i:int=0; i<strings.length; i++) {
                    var tf:TextField = new TextField();
                    tf.embedFonts = true;
                    tf.defaultTextFormat = new TextFormat( "Bebas", 42, 0xFFCC00);
                    tf.text = strings[i];
                    game.stage.addChild(tf);
                    addedStuff.push(tf);
                }
                break;
        }
    }
    
    override public function removed(game:Game):void {
        for (var i:int=0; i<addedStuff.length; i++) {
            var tf:TextField = addedStuff[i];
            game.stage.removeChild(tf);
        }
    }
    
     override public function tick(game:Game):void {
         super.tick(game);
     }
    
    // public function testTextEffect(game:Game, s:String):void {
        // if (game.fontsLoaded) {
            // var tf :TextField = new TextField();
            // tf.embedFonts = true;
            // tf.defaultTextFormat = new TextFormat( "Bebas", 42, 0xFFCC00);
            // tf.text = s;
            // tf.x = Math.random() * game.stage.width;
            // tf.y = Math.random() * game.stage.height;
            // game.addChild(tf);        
            // var anim:TextAnim = new TextAnim(tf);                

            // anim.effects = function(block:TextAnimBlock):void {
                // block.scaleX = block.scaleY = 0;    
                // block.rotation = -120;    
                // Tweener.addTween(block, {rotation:0, scaleX:1, scaleY:1, time:.5, transition:"easeoutback"});
            // };
            
            // anim.blocksVisible = false;
            // anim.addEventListener(TextAnimEvent.COMPLETE, function():void {
                // setTimeout(function():void {
                    // anim.dispose();
                    // }, 1000);
            // });
            // anim.start();
        // }
    // }

}

class Level extends GameObject {
    public var startX:Number = 50;
    public var startY:Number = 50;

    
    public var worldParticles:Array = [];
    public var screenParticles:Array = [];
    public var movingObjects:Array = [];
    public var solidObjects:Array = [];
    public var projectiles:Array = [];
    public var objectSpawners:Array = [];
    
    public var globalActions:Array = [];
    public var actionQueues:Object = {};    

    public var cameraController:CameraController;
    public var player:Player;
	public var boss:NPC;
    public var groundMesh:GroundMesh;
    
    override public function tick(game:Game):void {
        try {
            if (player) {
                player.tick(game);
            }
        } catch (error:Error) {
            trace("Error player tick " + error.name + " " + error.message);
        }
        try {
            game.tickAll(objectSpawners);
        } catch (error:Error) {
            trace("Error object spawners tick " + error.name + " " + error.message);
        }

        game.tickAll(solidObjects);
        try {
            game.tickAll(movingObjects);
        } catch (error:Error) {
            trace("Error moving objects tick " + error.name + " " + error.message);
        }
        game.tickAll(worldParticles);
        game.tickAll(screenParticles);
        game.tickAll(projectiles);
        for (var key:String in actionQueues) {
            game.tickAll(actionQueues[key]);
        }
        game.tickAll(globalActions);

        try {
            if (cameraController) {
                cameraController.tick(game);
            }
        } catch (error:Error) {
            trace("Error cam control tick " + error.name + " " + error.message);
        }
        try {
            if (groundMesh) {
                groundMesh.tick(game);
            }
        } catch (error:Error) {
            trace("Error mesh tick " + error.name + " " + error.message);
        }

    }

    override public function removed(game:Game):void {
        super.removed(game);
    }

}


interface ObjectSpawner {
    function tick(game:Game):void;
    
    function objectRemoved(obj:PhysicalObject, spawnInfo:SpawnInfo):void;
}

class GridObjectSpawner extends GameObject implements ObjectSpawner {

    public var noPlaceRectangles:Vector.<Rectangle> = new Vector.<Rectangle>();
    
    public var spawnInfos:Vector.<SpawnInfo> = new Vector.<SpawnInfo>();

    public var seed:int = 343243;
    public var gridSize:Number = 300;
    public var subGridCells:int = 20; // Totals cells 20 * 20
    public var updatePeriod:int = 33;
    public var restrictRadius:Number = 10;
    
    public var spawnDistance:Number = 200;
    
    public function getPosition(si:SpawnInfo, rnd:Rndm):Vector3D {
        var subGridSize:Number = gridSize / subGridCells;
        return new Vector3D(si.gridX * gridSize + si.subGridX * subGridSize + rnd.random() * subGridSize, 
            si.gridY * gridSize + si.subGridY * subGridSize + rnd.random() * subGridSize, 0);
    }
    
    public function findSpawnInfo(gridX:int, gridY:int, subGridX:int, subGridY:int):SpawnInfo {
        for (var i:int = 0; i<spawnInfos.length; i++) {
            var si:SpawnInfo = spawnInfos[i];
            if (si.matchData(gridX, gridY, subGridX, subGridY)) {
                return si;
            }
        }
        return null;
    }
    
    public function getSpawnCount(gridX:int, gridY:int, game:Game):int {
        return 5;
    }
    
    override public function tick(game:Game):void {
        if ((game.counter % updatePeriod) == 0) {
            try {
                var distance:Number = spawnDistance;
                
                var pos:Vector3D = game.currentLevel.player.position;
                var minGridX:int = Math.floor((pos.x - distance) / gridSize);
                var minGridY:int = Math.floor((pos.y - distance) / gridSize);
                var maxGridX:int = Math.floor((pos.x + distance) / gridSize);
                var maxGridY:int = Math.floor((pos.y + distance) / gridSize);

                var subGridSize:Number = gridSize / subGridCells;
                
                for (var gridX:int = minGridX; gridX <= maxGridX; gridX++) {
                    for (var gridY:int = minGridY; gridY <= maxGridY; gridY++) {
                        var count:int = getSpawnCount(gridX, gridY, game);
                        
                        var newSeed:uint = Math.abs(seed + gridX + gridY * seed);
                        var rnd:Rndm = new Rndm(newSeed);
                        
                        // trace("grid " + gridX + ", " + gridY + " gives seed " + newSeed + " counter: " + game.counter);

                        for (var i:int = 0; i<count; i++) {
                            var subGridX:int = rnd.integer(0, subGridCells);
                            var subGridY:int = rnd.integer(0, subGridCells);                
                            
                            var theX:Number = gridX * gridSize + subGridX * subGridSize;
                            var theY:Number = gridY * gridSize + subGridY * subGridSize;
                            
                            
                            var okToPlace:Boolean = true;
                            for (var j:int = 0; j<noPlaceRectangles.length; j++) {
                                if (noPlaceRectangles[j].contains(theX, theY)) {
                                    okToPlace = false;
                                    break;
                                }
                            }
                            
                            if (okToPlace) {
                                var si:SpawnInfo = findSpawnInfo(gridX, gridY, subGridX, subGridY);
                                if (si) {
                                    // Object already exists and should not be spawned again
                                } else {
                                    si = new SpawnInfo(this, gridX, gridY, subGridX, subGridY);
                                    spawnObject(si, game);
                                    // trace("Not find spawninfo " + si + " i:" + i + " counter: " + game.counter);
                                    spawnInfos.push(si);
                                }
                            }
                        }
                    }
                }
                
            } catch (error:Error) {
                trace("Error grid spawner tick " + error.name + " " + error.message);
            }
        }
    }
    
    public function spawnObject(spawnInfo:SpawnInfo, game:Game):void {
    }
    
    public function objectRemoved(obj:PhysicalObject, spawnInfo:SpawnInfo):void {
        // trace("someone calling objectRemoved() " + spawnInfo);
        for (var i:int = spawnInfos.length-1; i>=0; i--) {
            var si:SpawnInfo = spawnInfos[i];
            if (si.matchData(spawnInfo.gridX, spawnInfo.gridY, spawnInfo.subGridX, spawnInfo.subGridY)) {
                spawnInfos.splice(i, 1);
            }
        }
    }

}


class ObstacleSpawner extends GridObjectSpawner {

    override public function spawnObject(spawnInfo:SpawnInfo, game:Game):void {
  
        var level:Level = game.currentLevel;
        var theSeed:uint = Math.abs(spawnInfo.gridX + spawnInfo.gridY * 47829 + spawnInfo.subGridX + spawnInfo.subGridY * 424353);
        var rnd:Rndm = new Rndm(theSeed);
        
        var rndVal:Number = rnd.random();
        
        if (rndVal < 0.3) {
            var npc:NPC = new NPC();
            npc.spawnInfo = spawnInfo;
            npc.containerPartOfScene = false;
            npc.position = spawnInfo.spawner.getPosition(spawnInfo, rnd);                
            level.movingObjects.push(npc);
            
        } else {        
            var tree:Tree = new Tree();
            tree.spawnInfo = spawnInfo;
            tree.containerPartOfScene = false;
            tree.type = rnd.random() < 0.5 ? 0 : 1;
            tree.sizeFactor = 0.6 + 0.8 * rnd.random();
            tree.position = spawnInfo.spawner.getPosition(spawnInfo, rnd);                
            level.solidObjects.push(tree);
        }
        // trace("Spawning object " + spawnInfo + " solids: " + + level.solidObjects.length);
    }

}


class SpawnInfo {

    public var gridX:int;
    public var gridY:int;
    public var subGridX:int;
    public var subGridY:int
    public var spawner:GridObjectSpawner;
    
    public function matchData(gx:int, gy:int, sgx:int, sgy:int):Boolean {
        return gx == gridX && gy == gridY && sgx == subGridX && sgy == subGridY;
    }
    
    
    public function toString():String {
        return "{" + [gridX, gridY, subGridX, subGridY].join(", ") + "}";
    }
    
    public function SpawnInfo(spawner:GridObjectSpawner, gx:int, gy:int, sgx:int, sgy:int) {
        this.spawner = spawner;
        gridX = gx;
        gridY = gy;
        subGridX = sgx;
        subGridY = sgy;
    }
}


class PhysicalObject extends GameObject {
    public var spawnInfo:SpawnInfo;

    public var position:Vector3D = new Vector3D();
    public var direction:Vector3D = new Vector3D(0, 1, 0);
    
    public var dimension:Vector3D = new Vector3D(1, 1, 1); // Sizes 
    
    public var container:ObjectContainer3D;

    public var containerPartOfScene:Boolean = true;
    public var containerCheckRemovePeriod:int = 30;
    public var containerCheckAddPeriod:int = 30;
    
    
    public function getRectangle():Rectangle {
        return new Rectangle(position.x - dimension.x * 0.5, position.y - dimension.y * 0.5, dimension.x, dimension.y);
    }

    public function getTestRectangle(stepX:Number, stepY:Number):Rectangle {
        return new Rectangle(position.x - dimension.x * 0.5 + stepX, position.y - dimension.y * 0.5 + stepY, dimension.x, dimension.y);
    }
    
    public function shouldRemoveContainer(game:Game):Boolean {
        return false;
    }

    public function shouldAddContainer(game:Game):Boolean {
        return false;
    }

    public function shouldRemoveCompletely(game:Game):Boolean {
        return false;
    }

    public function removeCompletely(game:Game):void {
        game.scene.removeChild(container);
       if (spawnInfo) {
            spawnInfo.spawner.objectRemoved(this, spawnInfo);
        }    
    }
    
    public function updateContainer(game:Game):void {
        if (container.x != position.x) {
            container.x = position.x;
        }
        if (container.y != position.y) {
            container.y = position.y;
        }
        if (container.z != position.z) {
            container.z = position.z;
        }

        try {
            if (!game.currentLevel.groundMesh) {
            } else {
                if (!removeMe) {
                    if (containerPartOfScene && ((game.counter % containerCheckRemovePeriod) == 0)) {
                        if (shouldRemoveContainer(game)) {

                            game.scene.removeChild(container);
                            containerPartOfScene = false;
                        }
                    }
                    if (!containerPartOfScene && ((game.counter % containerCheckAddPeriod) == 0)) {
                        if (shouldAddContainer(game)) {
                            game.scene.addChild(container);
                            containerPartOfScene = true;
                        }
                    }
                }
            }
         } catch (error:Error) {
            trace("Error physical object update container part 1" + error.name + " " + error.message);
        }
        
        try {
        if ((game.counter % containerCheckRemovePeriod) == 0) {
            if (shouldRemoveCompletely(game)) {
                removeCompletely(game);

                game.scene.removeChild(container);
                containerPartOfScene = false;
                removeMe = true;
            }
        }
         } catch (error:Error) {
            trace("Error physical object update container part 2" + error.name + " " + error.message);
        }
   }

    public function updateMovement(stepX:Number, stepY:Number, stepZ:Number, game:Game):Array {
        if (stepX != 0 || stepY != 0 || stepZ != 0) {
        
            var rect:Rectangle = getTestRectangle(stepX, stepY);
        
            var solids:Array = game.currentLevel.solidObjects;
            for (var i:int = 0; i<solids.length; i++) {
                var solid:PhysicalObject = solids[i];
                
                var solidRect:Rectangle = solid.getRectangle();
                if (rect.intersects(solidRect)) {
                    // Must set at least one of stepX, stepY to 0
                    rect = getTestRectangle(stepX, 0);
                    if (rect.intersects(solidRect)) {
                        stepX = 0;
                    }
                    rect = getTestRectangle(0, stepY);
                    if (rect.intersects(solidRect)) {
                        stepY = 0;
                    }
                }
                
            }
        
            position.x += stepX;
            position.y += stepY;
            position.z += stepZ;
            
        }
        if (isNaN(position.x) || isNaN(position.y) || isNaN(position.z)) {
            trace("Nan detected");
        }
        updateContainer(game);
        return [stepX, stepY, stepZ];
    }
    
    override public function tick(game:Game):void {
        super.tick(game);
    }

    override public function init(game:Game):void {
        super.init(game);
        container = new ObjectContainer3D();
        containerPartOfScene = false;
    }   

    override public function removed(game:Game):void {
        super.removed(game);

        game.scene.removeChild(container);
        if (spawnInfo) {
            spawnInfo.spawner.objectRemoved(this, spawnInfo);
        }
    }
    
}


// Removes and adds their geometry automatically
class SelfManagedPhysicalObject extends PhysicalObject {

    public var containerRemoveDistance:Number = 220;
    public var containerAddDistance:Number = 200;
    public var completeRemoveDistance:Number = 700;
    
    override public function shouldRemoveContainer(game:Game):Boolean {
        var pos:Vector3D = game.currentLevel.player.position;
        return Vector3D.distance(position, pos) > containerRemoveDistance;
    }

    override public function shouldAddContainer(game:Game):Boolean {
        var pos:Vector3D = game.currentLevel.player.position;
        return Vector3D.distance(position, pos) < containerAddDistance;
    }

    override public function shouldRemoveCompletely(game:Game):Boolean {
        if (spawnInfo) {
            var pos:Vector3D = game.currentLevel.player.position;
            return Vector3D.distance(position, pos) > completeRemoveDistance;
        } else {
            return false;
        }
    }

    
    override public function tick(game:Game):void {
        super.tick(game);
        updateContainer(game);
    }
}


class SelfManagedSolidObject extends SelfManagedPhysicalObject {
    override public function removeCompletely(game:Game):void {
        super.removeCompletely(game);
        var arr:Array = game.currentLevel.solidObjects;
        arr.splice(arr.indexOf(this), 1);
    }
}


var NORMAL_TREE:int = 0;
var PINE_TREE:int = 1;

class Tree extends SelfManagedSolidObject {
    
    public var type:int = NORMAL_TREE;
    public var sizeFactor:Number = 1.0;

    
    override public function init(game:Game):void {
        super.init(game);
        
        var groundZ:Number = game.getGroundZ(position.x, position.y);
        
        position.z = groundZ;
        
        var stemHeight:Number = 30;
        
        switch (type) {
            case NORMAL_TREE:
                break;
            case PINE_TREE:
                stemHeight = 15;
                break;
        }
        
        var stem:Cylinder = new Cylinder();
        stem.height = stemHeight * sizeFactor;
        stem.radius = 3 * sizeFactor;
        stem.z = -stem.height * 0.5;
        stem.yUp = false;
        stem.material = new WireColorMaterial(0x335500);
        
        container.addChild(stem);        
        if (type == NORMAL_TREE) {
            var upper:Sphere = new Sphere();
            upper.material = new WireColorMaterial(0x006700);
            upper.radius = 20 * sizeFactor;
            upper.yUp = false;
            upper.z = -stem.height * 1.5 - upper.radius * 0.8;
            container.addChild(upper);
        } else if (type == PINE_TREE) {
            var cone:Cone = new Cone();
            cone.material = new WireColorMaterial(0x006700);
            cone.radius = 10 * sizeFactor;
            cone.height = 35 * sizeFactor;
            cone.rotationY = 180;
            cone.yUp = false;
            cone.z = -stem.height * 1.5 - cone.height * 0.5;
            container.addChild(cone);            
        }

        dimension = new Vector3D(stem.radius * 2, stem.radius * 2, 10);
    }
}


class Wall extends SelfManagedSolidObject {
    
    public var size:Number = 30;
    public var height:Number = 40;
    
    override public function init(game:Game):void {
        super.init(game);
        
        var groundZ:Number = game.getGroundZ(position.x, position.y);        
        position.z = groundZ;
                
        var cube:Cube = new Cube();
        cube.height = size;
        cube.width = size;
        cube.depth = height;
        cube.z = -cube.height * 0.5;
        cube.material = new WireColorMaterial(0x333333);
        
        container.addChild(cube);        
        dimension = new Vector3D(size, size, size);
    }

}




function distanceBetween(x1:Number, y1:Number, x2:Number, y2:Number):Number {
    var diffX:Number = x1 - x2;
    var diffY:Number = y1 - y2;
    return Math.sqrt(diffX * diffX + diffY * diffY);
}

function clampUint(x:Number, lower:Number, upper:Number):uint {
    var result:uint = x < lower ? lower : (x > upper ? upper : x);
    return result;
}

interface HeightModifier {
    function applicable(x:Number, y:Number):Boolean;
    
    function applyModifier(x:Number, y:Number, z:Number):Number;
}

interface ColorModifier {
    function applicable(x:Number, y:Number):Boolean;
    
    function applyModifier(x:Number, y:Number, z:Number, colArr:Vector.<Number>):void;
}


class GroundMesh extends PhysicalObject {
    public var mesh:Mesh;
    public var groundNoise:ClassicalNoise;
    public var seed:int = 12345;
    public var amplitude:int = 30;
    public var frequency:Number = 0.01;
    public var metalLevel:Number = -0.4;
    
    // Stored in pairs of faces. Existing faces
    public var existingFacePairs:Object = {};
    
    public var heightModifiers:Vector.<HeightModifier> = new Vector.<HeightModifier>();
    public var colorModifiers:Vector.<ColorModifier> = new Vector.<ColorModifier>();

    public var faceCount:int = 0;
    
    public function GroundMesh():void {        
    }
    
    public function createNoiseIfNecessary():void {
        if (!groundNoise) {
            groundNoise = new ClassicalNoise(new Rndm(seed));
        }
    }
    
    
    public function getGroundColor(x:Number, y:Number, z:Number):uint {
    
        var height:Number = -z;
        var red:Number = 0;
        var green:Number = 0;
        var blue:Number = 0;
        
        if (height > metalLevel * amplitude) {
            green = ((height / amplitude) + 1.0) * 0.5;
        } else {
            red = 0.5;
            green = 0.5;
            blue = 0.5;
        }
        
        // trace("ground color " + [red, green, blue].join(",") + " " + [x, y, z].join(","));

        if (colorModifiers.length > 0) {
            var colArr:Vector.<Number> = new Vector.<Number>();
            for (var i:int =0; i<colorModifiers.length; i++) {
                var cm:ColorModifier = colorModifiers[i];
                if (cm.applicable(x, y)) {
                    cm.applyModifier(x, y, z, colArr);
                }
            }
            red = colArr[0];
            green = colArr[1];
            blue = colArr[2];
        }
        
        var redUint:uint = clampUint(red * 255, 0, 255);
        var greenUint:uint = clampUint(green * 255, 0, 255);
        var blueUint:uint = clampUint(blue * 255, 0, 255);
        
        return (redUint << 16) | (greenUint << 8) | blueUint;
    }
    
    public function getGroundZ(x:Number, y:Number):Number {
        var noiseScale:Number = frequency;
        var noiseAmp:Number = amplitude;
        createNoiseIfNecessary();
        var inputX:Number = noiseScale * x;
        var inputY:Number = noiseScale * y;
        var result:Number = noiseAmp * groundNoise.noise(inputX, inputY, 0);
        
        var height:Number = -result;
        if (height < metalLevel * noiseAmp) {
            result = -metalLevel * noiseAmp;
        }
        for (var i:int =0; i<heightModifiers.length; i++) {
            var hm:HeightModifier = heightModifiers[i];
            if (hm.applicable(x, y)) {
                result = hm.applyModifier(x, y, result);
            }
        }
        return result;
    }
    
    
    override public function removed(game:Game):void {
        super.removed(game);
    }
    
    private function createFaceIfNecessary(stepSize:int, gridX:int, gridY:int):void {
    
        var xMap:Object = existingFacePairs[gridX];
        if (!xMap) {
            xMap = {};
            existingFacePairs[gridX] = xMap;
        }
        
        var pair:Array = xMap[gridY];
        if (!pair) {
            pair = [];

            var x:Number = gridX * stepSize;
            var y:Number = gridY * stepSize;
            var z:Number = getGroundZ(x, y);
            var v0:Vertex = new Vertex(x, y, z);
            var v1:Vertex = new Vertex(x + stepSize, y, getGroundZ(x + stepSize, y));
            var v2:Vertex = new Vertex(x + stepSize, y + stepSize, getGroundZ(x + stepSize, y + stepSize));
            var v3:Vertex = new Vertex(x, y + stepSize, getGroundZ(x, y + stepSize));
            var f1:Face = new Face(v0, v1, v2);
            var f2:Face = new Face(v0, v2, v3);
            var groundColor:uint = getGroundColor(x, y, z);
            var mat:WireColorMaterial = new WireColorMaterial(groundColor);
            f1.material = mat;
            f2.material = mat;
            
            mesh.addFace(f1);           
            mesh.addFace(f2);
            faceCount += 2;
            pair[0] = f1;
            pair[1] = f2;
            
            xMap[gridY] = pair;
        }        
    }

    private function removeFacesIfNecessary(stepSize:int, distance:Number, testX:Number, testY:Number):void {
        var gridX:Number = Math.floor(testX);
        var gridY:Number = Math.floor(testY);
        for (var existingGridX:String in existingFacePairs) {
            var xMap:Object = existingFacePairs[existingGridX];
            var found:Boolean = false;
            for (var existingGridY:String in xMap) {
                found = true;
                var x:Number = parseInt(existingGridX) * stepSize;
                var y:Number = parseInt(existingGridY) * stepSize;
                if (distance < distanceBetween(x, y, testX, testY)) {
                    var pair:Array = xMap[existingGridY];
                    mesh.removeFace(pair[0]);
                    mesh.removeFace(pair[1]);
                    faceCount -= 2;
                    delete xMap[existingGridY];
                }
            }
            if (!found) {
                delete existingFacePairs[existingGridX];
            }
        }

        // if (Math.random() < 0.02) {        
            // trace("Face count: " + faceCount + " vertex count: " + mesh.vertices.length);
        // }
    }
    
    
    public function updateMesh(game:Game):void {
        if (!mesh) {
            mesh = new Mesh();
        }
        
        if ((game.counter % 11) == 0) {         
    
            if (mesh.vertices.length > faceCount * 5) {
                // trace("Removed mesh faceCount: " + faceCount + " vertexCount: " + mesh.vertices.length);
                faceCount = 0;
                container.removeChild(mesh);
                existingFacePairs = {};
                mesh = new Mesh();
                container.addChild(mesh);
            }
            
            var positiveYDistance:Number = 300;
            var negativeYDistance:Number = 100;
            var xDistance:Number = 150;
            // var faceDistanceSq:Number = faceDistance * faceDistance;
            
            var stepSize:int = 30;
            
            var playerPos:Vector3D = game.currentLevel.player.position;
            
            var playerGridMinX:Number = Math.floor((playerPos.x - xDistance) / stepSize);
            var playerGridMaxX:Number = Math.ceil((playerPos.x + xDistance) / stepSize);
            var playerGridMinY:Number = Math.floor((playerPos.y - negativeYDistance) / stepSize);
            var playerGridMaxY:Number = Math.ceil((playerPos.y + positiveYDistance) / stepSize);
            
            var i:int = 0;
            
            
            for (i = playerGridMinX; i<playerGridMaxX; i++) {
                for (var j:int = playerGridMinY; j<playerGridMaxY; j++) {
                    createFaceIfNecessary(stepSize, i, j);
                }
            }
            removeFacesIfNecessary(stepSize, positiveYDistance * 1.2, playerPos.x, playerPos.y);
            
        }
    }
    
    override public function init(game:Game):void {
        super.init(game);
        updateMesh(game);
        container.addChild(mesh);
        game.scene.addChild(container);
    }
    
    
    override public function tick(game:Game):void {
        super.tick(game);
        updateMesh(game);
    }
}


class MovingPhysicalObject extends PhysicalObject {

    public var velocity:Vector3D = new Vector3D();
    public var gravity:Vector3D = new Vector3D(0, 0, 0.05);

    public var collidesWithGround:Boolean = true;
    public var collidesWithObstacles:Boolean = true;
    
    public var inAir:Boolean = false;
    public var airAcceleration:Vector3D = new Vector3D();
    public var airResistanceFactor:Number = 0.1;

    
    override public function updateMovement(stepX:Number, stepY:Number, stepZ:Number, game:Game):Array {
        try {
            if (!inAir) {
                stepZ = 0.0;
                if (collidesWithGround) {
                    // The object follows the ground
                    try {
                        if (game.currentLevel.groundMesh) {
                            var futureX:Number = position.x + stepX;
                            var futureY:Number = position.y + stepY;
                            var groundZ:Number = game.currentLevel.groundMesh.getGroundZ(futureX, futureY);
                            position.z = groundZ;
                        }
                    } catch (error:Error) {
                        trace("Error moving update movement mesh stuff " + error.name + " " + error.message);
                    }

                }
            } else {
                // Flying freely in the air
                position.incrementBy(velocity);
                velocity.incrementBy(gravity);
                
                
                // trace("flying movement " + gravity.z + " " + velocity.z);
                
                if (game.currentLevel.groundMesh) {
                    var gZ:Number = game.currentLevel.groundMesh.getGroundZ(position.x, position.y);
                    if (position.z > gZ) {
                        hitsGround(game, gZ);
                    }
                }
                
                
            }
        } catch (error:Error) {
            trace("Error moving update movement " + error.name + " " + error.message);
        }
        return super.updateMovement(stepX, stepY, stepZ, game);
    }
    
    public function hitsGround(game:Game, groundZ:Number):void {
    }

    public function hitsPhysicalObject(game:Game, obj:PhysicalObject):void {
    }

    
    override public function tick(game:Game):void {
        super.tick(game);
    }
    
    

}

var FIRE_PARTICLE:int = 0;
var SMOKE_PARTICLE:int = 1;

class Particle extends MovingPhysicalObject {
    public var type:int = FIRE_PARTICLE;

    override public function tick(game:Game):void {
        super.tick(game);
    }

}

class Projectile extends MovingPhysicalObject {

    public var owner:GameObject;

    public function Projectile(owner:GameObject):void {
        this.owner = owner;
        inAir = true;
    }

    override public function tick(game:Game):void {
        try {
            super.tick(game);
            // if (Math.random() < 0.01) {
                // trace("proj position.z: " + position.z);
            // }
        } catch (error:Error) {
            trace("Error projectile tick " + error.name + " " + error.message);
        }
        try {
            super.updateMovement(0, 0, 0, game);
        } catch (error:Error) {
            trace("Error projectile update movement " + error.name + " " + error.message);
        }
    }

    override public function hitsGround(game:Game, groundZ:Number):void {
        super.hitsGround(game, groundZ);
    }

    public function hitsLivingObject(game:Game, obj:LivingObject):void {      
    }
    
    
}

class Axe extends Projectile {

    public var damage:Number = 0.1;

    public function Axe(owner:GameObject) {
        super(owner);
    }

    override public function tick(game:Game):void {
        super.tick(game);
        container.rotationY -= 15;
    }
    
    override public function init(game:Game):void {
        super.init(game);
        var cube:Cube = new Cube();
        cube.width = 10;
        cube.height = 2;
        cube.depth = 4;
        container.addChild(cube);
        // container.rotationZ = 
        
        container.rotationZ = 180 * Math.atan2(direction.y, direction.x) / Math.PI;        
        updateContainer(game);
        game.scene.addChild(container);
    }

    override public function hitsLivingObject(game:Game, obj:LivingObject):void {
        if (owner != obj && !removeMe) {
            removeMe = true;
            obj.doDamage(game, damage);
            // trace("Axe hit something living...");
			game.sfxPlayer.playAxeHitsLiving(game);
        }
    }
    
    override public function hitsGround(game:Game, groundZ:Number):void {
        super.hitsGround(game, groundZ);
        removeMe = true;        
        // trace("Removing axe " + groundZ + " " + position.z);
		game.sfxPlayer.playAxeHitsGround(game);
    }
    
}



class Stone extends PhysicalObject {
}


class Hole extends PhysicalObject {
    override public function tick(game:Game):void {
        super.tick(game);
    }

}

class Fire extends PhysicalObject {
    override public function tick(game:Game):void {
        super.tick(game);
    }

}
class Goal extends PhysicalObject {
    override public function tick(game:Game):void {
        super.tick(game);
    }

}


class Sign extends PhysicalObject {
    public var texts:Array = [];
    override public function tick(game:Game):void {
        super.tick(game);
    }

}
class Pickup extends PhysicalObject {
    override public function tick(game:Game):void {
        super.tick(game);
    }
}


class LivingObject extends MovingPhysicalObject {

    public var health:Number = 1.0;
    public var dead:Boolean = false;
    
    public function doDamage(game:Game, damage:Number):void {
        if (!dead) {
            health -= damage;
            if (health <= 0.0) {
                die(game);
                dead = true;
                health = 0.0;
            }
        }
    }
    
    public function die(game:Game):void {
		if (this == game.currentLevel.player) {
			trace("You died, but I feel generous. Kill the Boss!");
			game.sfxPlayer.playLoss(game);
		} else {
			if (this == game.currentLevel.boss) {
				trace("You killed the big bad boss! Great!");
				game.sfxPlayer.playVictory(game);
			}
			game.sfxPlayer.playDeath(game);
			removeMe = true;
			spawnInfo = null;
		}
    }
    
    override public function tick(game:Game):void {
        super.tick(game);
        
        var rect:Rectangle = getRectangle();
        
        var projectiles:Array = game.currentLevel.projectiles;
        for (var i:int = 0; i<projectiles.length; i++) {
            var proj:Projectile = Projectile(projectiles[i]);
            var pos:Vector3D = proj.position;
            if (rect.contains(pos.x, pos.y)) {
               proj.hitsLivingObject(game, this);
            }
        }
    }

}

var WALKING:int = 0;
var RUNNING:int = 1;
var DANCING:int = 2;
var STANDING:int = 4;

class Humanoid extends LivingObject {
    public var sizeFactor:Number = 1.0;

    public var legColor:uint = 0xff0000;
    public var armColor:uint = 0xffffff;
    public var bodyColor:uint = 0xffffff;
    public var headColor:uint = 0x345623;
    
    public var leftArm:Cylinder;
    public var rightArm:Cylinder;

    public var leftLeg:Cylinder;
    public var rightLeg:Cylinder;

    public var head:Sphere;
    public var body:Cylinder;
    
    public var animationState:int = STANDING;
    public var animateAttacking:Boolean = false;
    public var animateDancing:Boolean = false;
    
    
    public function createHumanoidGeometry(game:Game):void {
        var armLength:Number = 8 * sizeFactor;
        var armRadius:Number = 1.3 * sizeFactor;
        var legLength:Number = 10 * sizeFactor;
        var legRadius:Number = 1.5 * sizeFactor;
        var torsoLength:Number = 10 * sizeFactor;
        var torsoRadius:Number = 4 * sizeFactor;
        var headLength:Number = 6 * sizeFactor;

		var offset:Number = -5 * sizeFactor;
		
        body = new Cylinder();
        body.material = new WireColorMaterial(bodyColor);
        body.segmentsW = 5;
        body.height = torsoLength;
        body.radius = torsoRadius;
        body.z = -torsoLength - legLength - offset;
        body.yUp = false;
        container.addChild(body);        

        head = new Sphere();
        head.material = new WireColorMaterial(headColor);
        head.yUp = false;
        head.segmentsH = 5;
        head.segmentsW = 5;
        head.radius = headLength * 0.5;
        head.z = -legLength - torsoLength - armRadius - headLength- offset;
        container.addChild(head);
        
        leftArm = new Cylinder();
        leftArm.material = new WireColorMaterial(armColor);
        leftArm.yUp = false;
        leftArm.segmentsW = 5;
        leftArm.height = armLength;
        leftArm.radius = armRadius;
        leftArm.z = -legLength - torsoLength - armRadius- offset;
        leftArm.y = body.radius;
        leftArm.rotationX = 45;
        container.addChild(leftArm);

            
        rightArm = new Cylinder();
        rightArm.material = new WireColorMaterial(armColor);
        rightArm.yUp = true;
        rightArm.segmentsW = 5;
        rightArm.height = armLength;
        rightArm.radius = armRadius;
        rightArm.z = -legLength - torsoLength - armRadius- offset;
        rightArm.y = -body.radius;
        rightArm.rotationX = 45;
        container.addChild(rightArm);
        
        
        leftLeg = new Cylinder();
        leftLeg.material = new WireColorMaterial(legColor);
        leftLeg.yUp = false;
        leftLeg.segmentsW = 5;
        leftLeg.height = legLength;
        leftLeg.radius = legRadius;
        leftLeg.z = -legLength * 1.3- offset;
        leftLeg.y = body.radius * 0.5;
        leftLeg.rotationX = 10;
        container.addChild(leftLeg);

        rightLeg = new Cylinder();
        rightLeg.material = new WireColorMaterial(legColor);
        rightLeg.yUp = false;
        rightLeg.segmentsW = 5;
        rightLeg.height = legLength;
        rightLeg.radius = legRadius;
        rightLeg.z = -legLength * 1.3- offset;
        rightLeg.y = -body.radius * 0.5;
        rightLeg.rotationX = -10;
        container.addChild(rightLeg);
        
        
        dimension = new Vector3D(body.radius * 2, body.radius * 2, 10);
    }

    override public function init(game:Game):void {
        try {
            super.init(game);
        } catch (error:Error) {
            trace("Error humanoid super init " + error.name + " " + error.message);
        }
            // Adding the body of the player            
        try {        
            createHumanoidGeometry(game);            
        } catch (error:Error) {
            trace("Error humanoid create geometry" + error.name + " " + error.message);
        }
            
        try {
            updateContainer(game);
            game.scene.addChild(container);
            
        } catch (error:Error) {
            trace("Error humanoid init update container" + error.name + " " + error.message);
        }
    }

    override public function updateMovement(stepX:Number, stepY:Number, stepZ:Number, game:Game):Array {
        var result:Array = super.updateMovement(stepX, stepY, stepZ, game);

        var newStepX:Number = result[0];
        var newStepY:Number = result[1];
        if (newStepX != 0 || newStepY != 0) {
            if (Math.sqrt(newStepX * newStepX + newStepY * newStepY) > 2) {
                animationState = RUNNING;
            } else {
                animationState = WALKING;
            }
        } else if (newStepX == 0 && newStepY == 0) {
            animationState = STANDING;
        }
        
        return result;
    }
    
    override public function tick(game:Game):void {
        super.tick(game);
        container.rotationZ = 180 * Math.atan2(direction.y, direction.x) / Math.PI;
        
        switch (animationState) {
            case RUNNING:
                leftArm.rotationZ = 40 * Math.sin(game.counter * 0.6);
                rightArm.rotationZ = 40 * Math.sin(game.counter * 0.6);
                leftLeg.rotationY = 40 * Math.sin(game.counter * 0.6);
                rightLeg.rotationY = -40 * Math.sin(game.counter * 0.6);
                break;
            case WALKING:
                leftArm.rotationZ = 40 * Math.sin(game.counter * 0.3);
                rightArm.rotationZ = 40 * Math.sin(game.counter * 0.3);
                leftLeg.rotationY = 40 * Math.sin(game.counter * 0.3);
                rightLeg.rotationY = -40 * Math.sin(game.counter * 0.3);
                break;
            case STANDING:
                leftArm.rotationZ = 10;
                rightArm.rotationZ = 10;
                leftLeg.rotationY = 0;
                rightLeg.rotationY = 0;
                break;
        }
        if (animateDancing) {
			leftArm.rotationZ = 40 * Math.sin(game.counter * 0.8);
			rightArm.rotationZ = 40 * Math.sin(game.counter * 0.8);
            leftLeg.rotationY = 40 * Math.sin(game.counter * 0.8);
            rightLeg.rotationY = -40 * Math.sin(game.counter * 0.8);

			container.rotationZ = 50 * Math.sin(game.counter * 0.4);
            // rightArm.rotationZ = 180 + 40 * Math.sin(game.counter * 0.8);
        }
    }
    
    
}

class Player extends Humanoid {

    public var batteryLevel:Number = 100.0;

    public var dancers:Vector.<NPC> = new Vector.<NPC>();
    
    public var dancing:Boolean = false;
    public var fighting:Boolean = false;
    
    public var danceRadius:Number = 100;

    public var danceSpeed:Number = 1;
    public var maxSpeed:Number = 5;

    public var sceneLight:DirectionalLight3D;
    
	public var haveBall:Boolean = false;
	public var danceBall:ObjectContainer3D = null;
	public var sphere:Sphere;
	
    override public function init(game:Game):void {
        // Set colors and size here
        sizeFactor = 1.0;
        super.init(game);
    }
    
    override public function removed(game:Game):void {
    }
    
    override public function tick(game:Game):void {
        try {
            super.tick(game);
        } catch (error:Error) {
            trace("Error player super tick " + error.name + " " + error.message);
        }
        
        var stepX:Number = 0;
        var stepY:Number = 0;
        
        var speed:Number = maxSpeed;
        if (dancing) {
            speed = danceSpeed;
        }
        var wasDancing:Boolean = dancing;
		
        if (game.keysDown[Keyboard.UP]) {
            // trace("moving up");
            stepY += speed;
        }
        if (game.keysDown[Keyboard.DOWN]) {
            stepY += -speed;
        }
        if (game.keysDown[Keyboard.LEFT]) {
            stepX += -speed;
        }
        if (game.keysDown[Keyboard.RIGHT]) {
            stepX += speed;
        }
        
        // Reset all dancers
        for (var i:int = 0; i<dancers.length; i++) {
            var d:NPC = dancers[i];
            d.mode = d.modeWhenAlone;
        }
        dancers.length = 0;
        
        dancing = false;
        if (game.keysDown["68"]) {
            if (batteryLevel > 0.0) {
                dancing = true;
            }
        }
        if (!wasDancing && dancing) {
			game.sfxPlayer.playDancing(game);
		}		
		
        fighting = false;
        if (game.keysDown["70"]) {
            if (dancing) {
                // All dancers fight!
                fighting = true;
            }
        }
        
        if (dancing) {
            
            var movers:Array = game.currentLevel.movingObjects;

            var newMode:int = DANCE_MODE;
            if (fighting) {
                newMode = DANCE_FIGHT_MODE;
            }
            
            for (var k:int=0; k<movers.length; k++) {
                if (movers[k] is NPC) {
                    var mover:NPC = NPC(movers[k]);
                    if (!mover.resistsDance) {
                        var dVec:Vector3D = new Vector3D(mover.position.x - position.x, mover.position.y - position.y);
                    
                        var dist:Number = dVec.length;
                        if (dist < danceRadius) {
                            mover.mode = newMode;
                            mover.danceSpeed = danceSpeed;
                            dancers.push(mover);
                        }
                    }
                }
            }
			if (!haveBall) {
				if (danceBall == null) {
					danceBall = new ObjectContainer3D();
					sphere = new Sphere();
					sphere.radius = 10;
					danceBall.addChild(sphere);
				}
				game.scene.addChild(danceBall);
				haveBall = true;
			}
        } else {
			if (haveBall) {
				game.scene.removeChild(danceBall);
				haveBall = false;
			}
		}
		
		animateDancing = dancing;
    
		if (haveBall) {
			// Update ball
			danceBall.position = new Vector3D(position.x, position.y, position.z - 60);
			danceBall.rotationZ = game.counter * 2;
		}
        if (stepX != 0 && stepY != 0) {
            var sqrt2:Number = Math.sqrt(2.0);
            stepX /= sqrt2;
            stepY /= sqrt2;
        }        

        if (stepX != 0 || stepY != 0) {
            var temp:Vector3D = new Vector3D(stepX, stepY);
            temp.normalize();
            direction.x = temp.x;
            direction.y = temp.y;
        }
        var realSteps:Array;
        try {
            realSteps = super.updateMovement(stepX, stepY, 0, game);
        } catch (error:Error) {
            trace("Error player update movement " + error.name + " " + error.message);
        }
        
        // if (dancers.length > 0) {
            // trace("Dancers: " + dancers.length);
        // }
        for (var j:int = 0; j<dancers.length; j++) {
            var dancer:NPC = dancers[j];
            dancer.danceStepX = realSteps[0];
            dancer.danceStepY = realSteps[1];
        }
        
        // if (Math.random() < 0.05) {
            // trace("player is ticked...");
        // }
    }
}



// Removes and adds their geometry automatically
class SelfManagedHumanoid extends Humanoid {

    public var containerRemoveDistance:Number = 320;
    public var containerAddDistance:Number = 200;
    public var completeRemoveDistance:Number = 2000;

   override public function removeCompletely(game:Game):void {
        super.removeCompletely(game);
        var arr:Array = game.currentLevel.movingObjects;
        arr.splice(arr.indexOf(this), 1);
        
    }
    
    override public function shouldRemoveContainer(game:Game):Boolean {
        var pos:Vector3D = game.currentLevel.player.position;
        return Vector3D.distance(position, pos) > containerRemoveDistance;
    }

    override public function shouldAddContainer(game:Game):Boolean {
        var pos:Vector3D = game.currentLevel.player.position;
        return Vector3D.distance(position, pos) < containerAddDistance;
    }

    override public function shouldRemoveCompletely(game:Game):Boolean {
        // This is not good... but it works better without complete removal
        return false;
        // var pos:Vector3D = game.currentLevel.player.position;
        // return Vector3D.distance(position, pos) > completeRemoveDistance;
    }

    
    override public function tick(game:Game):void {
        super.tick(game);
        updateContainer(game);
    }
}



var MONSTER_1:int = 0;
var MONSTER_2:int = 1;
var MONSTER_3:int = 2;
var BOSS_1:int = 3;

var PATROL_MODE:int = 0;
var WAIT_MODE:int = 1;
var ATTACK_MODE:int = 2;
var FIGHT_MODE:int = 3;
var DANCE_MODE:int = 4;
var DANCE_FIGHT_MODE:int = 5;

var HITTING_ATTACK:int = 0;
var PROJECTILE_ATTACK:int = 1;

var MOVE_RIGHT:int = 0;
var MOVE_DOWN:int = 1;
var MOVE_LEFT:int = 2;
var MOVE_UP:int = 3;

class NPC extends SelfManagedHumanoid {
    public var npcType:int = MONSTER_1;

    public var resistsDance:Boolean = false;
    public var danceStepX:Number = 0;
    public var danceStepY:Number = 0;
    public var danceSpeed:Number = 1;
    
    public var maxSpeed:Number = 1;
    public var mode:int = PATROL_MODE;
    public var modeWhenAlone:int = PATROL_MODE;    
    public var attackType:int = PROJECTILE_ATTACK;
    
    public var modeUpdateInterval:int = 13;
    
    public var sightLength:Number = 80;
    public var leaveAloneLength:Number = 200;
    public var fightDistance:Number = 50;
    public var closestFightDistance:Number = 30;
    public var closestFriendDistance:Number = 20;
    
    public var attackCounter:int = 1000;
    public var attackInterval:int = 50;
    
    public var patrolDirection:Vector3D = new Vector3D(1, 0);
    public var patrolIndex:int = 0;
    public var patrolCounter:int = 0;
    public var patrolPattern:Vector.<int> = Vector.<int>([MOVE_RIGHT, MOVE_DOWN, MOVE_LEFT, MOVE_UP]);
    public var patrolStepsPattern:Vector.<int> = Vector.<int>([60, 120, 60, 120]);
    
    public var currentMovement:Vector3D = new Vector3D();
    public var currentDirection:Vector3D = new Vector3D(1, 0);

    public var projectileSpeed:Number = 3;
    
    override public function init(game:Game):void {
        // Set colors and size here
		health = 0.3;
        sizeFactor = 1.0;
        switch (npcType) {
            case MONSTER_1:
				headColor = 0xffffff;
				armColor = 0x444444;
				bodyColor = 0xff3333;
				legColor = 0x000000;
                break;
            case MONSTER_2:
                sizeFactor = 1.2;
                break;
            case MONSTER_3:
                sizeFactor = 1.4;
                break;
            case BOSS_1:
                sizeFactor = 1.7;
				headColor = 0xff0000;
				armColor = 0x222222;
				bodyColor = 0x33ff33;
				legColor = 0x0000ff;
                break;
        }
        try {
            super.init(game);
        } catch (error:Error) {
            trace("Error npc super init " + error.name + " " + error.message);
        }
    }

    
    public function updateMode(game:Game):void {
        
        var playerPos:Vector3D = game.currentLevel.player.position;
        
        var distanceToPlayer:Number = Vector3D.distance(playerPos, position);
        
        var playerVisible:Boolean = distanceToPlayer < sightLength;
        
        
        switch (mode) {
            case PATROL_MODE:
            case WAIT_MODE:
                if (playerVisible) {
                    mode = ATTACK_MODE;
                }
                break;
            case ATTACK_MODE:
                if (distanceToPlayer > leaveAloneLength) {
                    mode = modeWhenAlone;
                }
                if (distanceToPlayer <= fightDistance) {
                    mode = FIGHT_MODE;                 
                }
                break;
            case FIGHT_MODE:
                if (distanceToPlayer > fightDistance) {
                    mode = ATTACK_MODE;
                }
                break;
        }
    }    
    
    public function getWantedMovement(game:Game, movement:Vector3D, direction:Vector3D):void {
    
        var wantedDir:Vector3D = new Vector3D();

        var shouldStandStill:Boolean = false;
                
        switch (mode) {
            case PATROL_MODE:
                patrolCounter++;
                var patrolSteps:int = patrolStepsPattern[patrolIndex];
                if (patrolCounter > patrolSteps) {
                    patrolIndex = (patrolIndex + 1) % patrolPattern.length;    
                    patrolCounter = 0;
                }
                patrolSteps = patrolStepsPattern[patrolIndex];
                var intDir:int = patrolPattern[patrolIndex];
                switch (intDir) {
                    case MOVE_RIGHT:
                        patrolDirection.x = 1;
                        patrolDirection.y = 0;
                        break;
                    case MOVE_DOWN:
                        patrolDirection.x = 0;
                        patrolDirection.y = -1;
                        break;
                    case MOVE_LEFT:
                        patrolDirection.x = -1;
                        patrolDirection.y = 0;
                        break;
                    case MOVE_UP:
                        patrolDirection.x = 0;
                        patrolDirection.y = 1;
                        break;
                }
                wantedDir.x = patrolDirection.x;
                wantedDir.y = patrolDirection.y;
                break;
            case ATTACK_MODE:
            case FIGHT_MODE:
                var playerPos:Vector3D = game.currentLevel.player.position;
                
                var distanceToPlayer:Number = Vector3D.distance(playerPos, position);
                var diffVec:Vector3D = new Vector3D(playerPos.x - position.x, playerPos.y - position.y);
                var sign:Number = 1;
                if (distanceToPlayer < closestFightDistance) {
                    sign = -1;
                } else if (distanceToPlayer < fightDistance) {
                    shouldStandStill = true;
                }

                wantedDir.x = sign * diffVec.x;
                wantedDir.y = sign * diffVec.y;
                
                diffVec.normalize();
                direction.x = diffVec.x; // Face the player while possibly moving away from him
                direction.y = diffVec.y;
                break;
            case DANCE_MODE:
            case DANCE_FIGHT_MODE:
                wantedDir.x = danceStepX;
                wantedDir.y = danceStepY;
                if (danceStepX == 0 && danceStepY == 0) {
                    shouldStandStill = true;
                }
                break;
        }        

        
        
        if (wantedDir.length > 0.001) {
            var speed:Number = maxSpeed;
            if (mode == DANCE_MODE || mode == DANCE_FIGHT_MODE) {
                speed = danceSpeed;
            }
            wantedDir.normalize();
            movement.x = wantedDir.x * speed;
            movement.y = wantedDir.y * speed;
            
            if (mode != ATTACK_MODE && mode != FIGHT_MODE) {
                
                direction.x = wantedDir.x;
                direction.y = wantedDir.y;
            }
        }
        
        if (shouldStandStill) {
            movement.x = 0;
            movement.y = 0;         
        }

        var movers:Array = game.currentLevel.movingObjects;
        
        for (var i:int=0; i<movers.length; i++) {
            var mover:MovingPhysicalObject = MovingPhysicalObject(movers[i]);
            if (mover != this) {
                // Move away from other guys
                var dVec:Vector3D = new Vector3D(mover.position.x - position.x, mover.position.y - position.y);
                
                var dist:Number = dVec.length;
                if (dist < closestFriendDistance) {
                    dVec.normalize();
                    movement.x -= dVec.x;
                    movement.y -= dVec.y;
                }
            }
        }
        
        // movement.x += Math.random() * 0.2 - 0.1;
        // movement.y += Math.random() * 0.2 - 0.1;
    }

    public function getProjectile(game:Game):Projectile {
        var axe:Axe = new Axe(this);
        axe.direction = direction.clone();
        axe.direction.z -= 0.3;
        axe.direction.normalize();
        
        var pos:Vector3D = position.clone();
        pos.z -= 25 * sizeFactor;
        
        axe.position = pos;
        var velocity:Vector3D = axe.direction.clone();
        velocity.normalize();
        velocity.scaleBy(projectileSpeed);
        axe.velocity = velocity;
        game.sfxPlayer.playThrowAxe(game);
        return axe;
    }    
    
    public function performAttack(game:Game):void {
        switch (attackType) {
            case PROJECTILE_ATTACK:
                // Add projectile
                var projectile:Projectile = getProjectile(game);
                // trace("Throwing axe " + projectile.position);
                game.currentLevel.projectiles.push(projectile);
                break;
        }
    }
    
    public function updateAction(game:Game):void {
        animateAttacking = false;
        animateDancing = false;
        if (mode == FIGHT_MODE || mode == DANCE_FIGHT_MODE) {
            animateAttacking = true;
            if (attackCounter > attackInterval) {
                performAttack(game);
                attackCounter = 0;
            }
            attackCounter++;
        }
        if (mode == DANCE_FIGHT_MODE || mode == DANCE_MODE) {
            animateDancing = true;
        }
    }
    
    override public function tick(game:Game):void {
        try {
            super.tick(game);
        } catch (error:Error) {
            trace("Error npc super tick " + error.name + " " + error.message);
        }
       
        if (game.currentLevel.player) {
            if ((game.counter % modeUpdateInterval) == 0) {
                updateMode(game);
            }
            
            // var movement:Vector3D = new Vector3D();
            
            getWantedMovement(game, currentMovement, currentDirection);
                                
            direction.x = currentDirection.x;
            direction.y = currentDirection.y;
            
            updateAction(game);
        }
        
        try {
            super.updateMovement(currentMovement.x, currentMovement.y, 0, game);
        } catch (error:Error) {
            trace("Error player update movement " + error.name + " " + error.message);
        }
        // if (Math.random() < 0.02) {
             // trace("npc is ticked... " + game.currentLevel.movingObjects.length);
         // }

    }
}


class TestProvider implements SequenceDataProvider {    

    private var sionPresets:SiONPresetVoice;
    
    public function TestProvider():void {
            sionPresets = new SiONPresetVoice();        
    }    
       
    public function renderChordMotif(motifIndex:int, harmonyIndex:int):void {        
    }

    public function renderVoiceMotif(motifIndex:int, harmonyIndex:int):void {        
    }

    public function renderPercussion(percussionIndex:int, harmonyIndex:int):void {        
    }

    
    public function getSequenceData():SequenceData {
        var result:SequenceData = new SequenceData();

        var beatMillis:Number = result.length / result.beatCount;
        
// note:int = 60, velocity:int = 64, time:uint = 0, length:uint = 250, voice:SiONVoice = null, track:int = 0     

        var chordInfo:ChordInfo = new ChordInfo();
//        chordInfo.chordRoot = chordInfo.chordRoot + (Math.random() < 0.5 ? -4 : Math.random() < 0.5 ? -2 : 1);
//        chordInfo.chordRoot = positiveMod(chordInfo.chordRoot, 7);      

//        chordInfo.chordRoot = chordRoots[chordCounter];
//        chordCounter = (chordCounter + 1) % chordRoots.length;        
//        chordInfo.scaleBase = 65;
                // var voice:SiONVoice = voices[patternIndex];
                
                    // var note:int = chordInfo.getAbsoluteNoteFromChordRootIndex(index);
                    // // trace("index " + index + " gave note " + note);
                    // var noteMillis:uint = beatMillis * length / 4.0;
                    // if (restArr[i % restArr.length] == 0) {
                        // result.messages.push(new NoteOn(note, 64, currentPosition, length * beatMillis / 4.0, voice, 0));                
                    // }
                    // currentPosition += noteMillis;
        return result;        
    }

}


interface SequenceDataProvider {
   function getSequenceData():SequenceData;
}


class NoteOn {
    public var note:int = 60;
    public var velocity:int = 64;
    public var time:uint = 0;
    public var length:uint = 250;
    public var voice:SiONVoice = null;
    public var track:int = 0;

    public function NoteOn(note:int = 60, velocity:int = 64, time:uint = 0, length:uint = 250, voice:SiONVoice = null, track:int = 0) {
        this.note = note;
        this.velocity = velocity;
        this.time = time;
        this.length = length;
        this.voice = voice;
        this.track = track;
    }
    
    public function copy():NoteOn {
        return new NoteOn(note, velocity, time, length, voice, track);
    }

}

class SequenceData {
    public var messages:Vector.<NoteOn> = new Vector.<NoteOn>();
    public var length:uint = 8000;
    public var beatCount:uint = 16;        
    
    public function split(time:uint):Array {
        var result:SequenceData = new SequenceData();
        var rest:SequenceData = new SequenceData();
        for (var i:int=0; i<messages.length; i++) {
            var message:NoteOn = messages[i];
            if (message.time <= time) {
                result.messages.push(message);
            } else {
                rest.messages.push(message);
            }
        }
        
        return [result, rest];
    }

}


class MusicSequencer {
    
    private var sequenceData:SequenceData = null;
    private var sequenceTime:uint = 0;

    private var sionDriver:SiONDriver = null;    
    
    private var dataProvider:SequenceDataProvider = null;
    
    
    public function MusicSequencer(driver:SiONDriver, dataProvider:SequenceDataProvider):void {
        this.sionDriver = driver;
        this.dataProvider = dataProvider;
    }
    
    public function tick():void {
        var currentTime:uint = flash.utils.getTimer();
        
        var extraOffset:uint = 400;
        
        if (!sequenceData) {
            sequenceData = dataProvider.getSequenceData();
            sequenceTime = currentTime;
        }
        if (currentTime + extraOffset > sequenceTime + sequenceData.length) {
            // Time to get the next data
            sequenceTime = sequenceTime + sequenceData.length;
            sequenceData = dataProvider.getSequenceData()
        }
        var beatsPerSecond:Number = 1000 * (sequenceData.beatCount / sequenceData.length);
        
        sionDriver.bpm = beatsPerSecond * 60;
        
        var splitted:Array = sequenceData.split(currentTime - sequenceTime + extraOffset);        
        
        sequenceData = splitted[1];
        var toRender:SequenceData = splitted[0];
        
        var messages:Vector.<NoteOn> = toRender.messages;
        
        
        var millisPer16thBeat:Number = (toRender.length / toRender.beatCount) / 4.0;
        
        for (var i:int=0; i<messages.length; i++) {
            var m:NoteOn = messages[i];
            
            var length:Number = m.length / millisPer16thBeat;

            var delayMillis:Number = m.time + sequenceTime - currentTime;
            var delay:Number = Math.max(0, delayMillis / millisPer16thBeat);
            
            // trace(length + " " + sionDriver.bpm + " " + delay);
                 
            
            var track:SiMMLTrack = sionDriver.noteOn(m.note, m.voice, length, delay, 0, m.track);
            track.velocity = m.velocity;
            
        }

        
    }

}


class SfxPlayer {

	// sionDriver.noteOn(m.note, m.voice, length, delay, 0, m.track);

    public function playDancing(game:Game):void {
        var bass:SiONVoice = game.sionPresets["valsound.percus1"];
		var snare:SiONVoice = game.sionPresets["valsound.percus2"];
        game.sionDriver.noteOn(60, bass, 4, 0, 0, 0);
        game.sionDriver.noteOn(60, snare, 4, 2, 0, 0);
        game.sionDriver.noteOn(60, bass, 4, 4, 0, 0);
        game.sionDriver.noteOn(60, snare, 4, 6, 0, 0);
		game.sionDriver.noteOn(60, bass, 4, 8, 0, 0);
        game.sionDriver.noteOn(60, snare, 4, 10, 0, 0);
		game.sionDriver.noteOn(60, bass, 4, 12, 0, 0);
        game.sionDriver.noteOn(60, snare, 4, 14, 0, 0);
    }
	
	public function playVictory(game:Game):void {
		var guitar:SiONVoice = game.sionPresets["valsound.guitar1"];
        game.sionDriver.noteOn(60, guitar, 4, 0, 0, 0);
        game.sionDriver.noteOn(64, guitar, 4, 4, 0, 0);
        game.sionDriver.noteOn(67, guitar, 4, 8, 0, 0);
        game.sionDriver.noteOn(72, guitar, 4, 12, 0, 0);
	}

	public function playLoss(game:Game):void {
		var guitar:SiONVoice = game.sionPresets["valsound.guitar2"];
        game.sionDriver.noteOn(60, guitar, 4, 0, 0, 0);
        game.sionDriver.noteOn(63, guitar, 4, 4, 0, 0);
        game.sionDriver.noteOn(66, guitar, 4, 8, 0, 0);
	}

	public function playDeath(game:Game):void {
		var guitar:SiONVoice = game.sionPresets["valsound.guitar3"];
        game.sionDriver.noteOn(60, guitar, 2, 0, 0, 0);
        game.sionDriver.noteOn(64, guitar, 2, 0, 0, 0);
        game.sionDriver.noteOn(68, guitar, 2, 0, 0, 0);
	}
    
    public function playAxeHitsLiving(game:Game):void {
        var voice:SiONVoice = game.sionPresets["saw"];
        game.sionDriver.noteOn(10, voice, 1, 0, 0, 0);
    }

    public function playAxeHitsGround(game:Game):void {
        var voice:SiONVoice = game.sionPresets["snoise"];
        game.sionDriver.noteOn(10, voice, 1, 0, 0, 0);
    }
    
    
    public function playThrowAxe(game:Game):void {
        var voice:SiONVoice = game.sionPresets["noise"];
        game.sionDriver.noteOn(10, voice, 1, 0, 0, 0);
    }
    

}

function positiveMod(a:int, b:int):int { return a >= 0 ? a % b : (b + a % b) % b ; }
class ChordInfo { // Musical stuff
    public var beats:int = 4; public var scaleBase:int = 60; public var scale:Array = [0, 2, 4, 5, 7, 9, 11];
    public var chordRoot:int = 0; public var chordOffsets:Array = [0, 2, 4];    
    public function getChordRootPositionAbsoluteOffsets():Array {
        var result:Array = []; var scaleIndices:Array = getChordRootPositionScaleIndices();
        var first:int = scaleIndices[0]; var firstAbsolute:int = getAbsoluteNote(scaleBase, scale, first);
        var diff:int = firstAbsolute - scaleBase;
        for (var i:int=0; i<scaleIndices.length; i++) { result[i] = getAbsoluteNote(scaleBase, scale, scaleIndices[i]) - firstAbsolute + diff; }
        return result; }
    public function getChordRootPositionScaleIndices():Array { var result:Array = [];
        for (var i:int = 0; i<chordOffsets.length; i++) { result.push(chordRoot + chordOffsets[i]); }
        return result; }
    public function getAbsoluteNoteFromChordRootIndex(index:int):int {
        var chordOffsets:Array = getChordRootPositionAbsoluteOffsets(); var first:int = chordOffsets[0];
        for (var i:int=0; i<chordOffsets.length; i++) { chordOffsets[i] -= first; }
        return getAbsoluteNote(scaleBase + first, chordOffsets, index); }
    public function pitchClassDistance(c1:int, c2:int):int { return Math.min(Math.abs(c1 - c2), 12 - Math.abs(c1 - c2)); }
    public function getAbsoluteNote(absoluteBaseNote:int, offsets:Array, index:int):int { var offsetIndex:int = 0;
        var octaveOffset:int = 0; offsetIndex = positiveMod(index, offsets.length);
        if (index >= 0) { octaveOffset = Math.floor(index / offsets.length);
        } else { octaveOffset = -Math.floor((-index + offsets.length - 1) / offsets.length);
        } return absoluteBaseNote + 12 * octaveOffset + offsets[offsetIndex]; }
    public function getClosestNoteWithPitchClasses(absoluteNote:int, pitchClasses:Array):int {
        var notePitchClass:int = absoluteNote % 12; var minDistance:int = 99999;  var closestPitchClass:int = 0;
        for (var i:int = 0; i < pitchClasses.length; i++) { var distance:int = pitchClassDistance(notePitchClass, pitchClasses[i]);
            if (distance < minDistance) { minDistance = distance; closestPitchClass = pitchClasses[i]; } }
        if (((absoluteNote + minDistance) % 12) == closestPitchClass) { return absoluteNote + minDistance;
        } else if (((absoluteNote - minDistance) % 12) == closestPitchClass) { return absoluteNote - minDistance;
        } else { return Math.floor(absoluteNote / 12) * 12 + closestPitchClass; } }
    public function getAbsoluteNoteFromScaleIndex(index:int):int { return getAbsoluteNote(scaleBase, scale, index); }
    public function offsetScale(absoluteNote:int, offset:int):int { var result:int = absoluteNote; var indexChr:Array = getScaleIndexAndChromaticOffsetForAbsoluteNote(result);
        var scaleIndex:int = indexChr[0] + offset; var absNote:int = getAbsoluteNoteFromScaleIndex(scaleIndex);
        result = absNote; return result; }
    public function offsetChord(absoluteNote:int, offset:int):int { var result:int = absoluteNote;
        var indexChr:Array = getChordRootIndexAndChromaticOffsetForAbsoluteNote(result);
        result = getAbsoluteNoteFromChordRootIndex(indexChr[0] + offset); return result; }
    public function getChordRootIndexAndChromaticOffsetForAbsoluteNote(absoluteNote:int):Array { var increments:Array = getChordRootPositionAbsoluteOffsets();
        var firstInc:int = increments[0]; var baseNote:int = scaleBase + firstInc;
        for (var i:int=0; i<increments.length; i++) { increments[i] -= firstInc; }
        var result:Array = getScaleIndexAndChromaticOffsetForAbsoluteNoteStatic(absoluteNote, baseNote, increments);
        return result; } 
    public function getScaleIndexAndChromaticOffsetForAbsoluteNote(absoluteNote:int):Array { return getScaleIndexAndChromaticOffsetForAbsoluteNoteStatic(absoluteNote, scaleBase, scale); }
    public static function getScaleIndexAndChromaticOffsetForAbsoluteNoteStatic(absoluteNote:int, baseNote:int, increments:Array):Array {
        var chromaticOffset:int = 0; var resultIndex:int = 0;  var absDiff:int = absoluteNote - baseNote; var diffOctave:int = 0;    
        var normalizedNote:int = absDiff;  while (normalizedNote < 0) { normalizedNote += 12; diffOctave--; }
        while (normalizedNote > 11) { normalizedNote -= 12; diffOctave++; } var shortestAbsDistance:int = 9999999;
        for (var i:int = 0; i < increments.length; i++) {
            if (increments[i] == normalizedNote) { resultIndex = i + diffOctave * increments.length; chromaticOffset = 0; break;
            } else { var diff:int = normalizedNote - increments[i];
                if (Math.abs(diff) < shortestAbsDistance) { shortestAbsDistance = Math.abs(diff);
                    resultIndex = i + diffOctave * increments.length; chromaticOffset = diff; } } }
        return [resultIndex, chromaticOffset]; }
}

function inittrace(s:Stage):void { WTrace.initTrace(s);} var trace:Function;
class WTrace { // Mr trace
        private static var FONT:String = "Fixedsys";
        private static var SIZE:Number = 12;
        private static var TextFields:Array = [];
        private static var trace_stage:Stage;        
        public static function initTrace(stg:Stage):void { trace_stage = stg; trace = wtrace; }        
        private static function scrollup():void { if (TextFields.length > 30) { var removeme:TextField = TextFields.shift(); trace_stage.removeChild(removeme);
                removeme = null; } for(var x:Number=0;x<TextFields.length;x++) { (TextFields[x] as TextField).y -= SIZE*1.2;}}
    
        public static function wtrace(... args):void { var s:String=""; var tracefield:TextField; for (var i:int;i < args.length;i++) {
                if (i != 0) s+=" "; s+=args[i].toString(); } tracefield= new TextField(); tracefield.autoSize = "left"; tracefield.text = s;
            tracefield.y = trace_stage.stageHeight - 40; var tf:TextFormat = new TextFormat(FONT, SIZE);tracefield.setTextFormat(tf);
            trace_stage.addChild(tracefield); scrollup(); TextFields.push(tracefield); } }
            
class Rndm { // Mr uniform
    protected var _seed:uint=0;
    protected var _currentSeed:uint=0;
    public function Rndm(seed:uint=1) { _seed = _currentSeed = seed; }
    public function get seed():uint {return _seed;}
    public function set seed(value:uint):void {_seed = _currentSeed = value;}    
    public function get currentSeed():uint { return _currentSeed; }
    public function random():Number { return (_currentSeed = (_currentSeed * 16807) % 2147483647)/0x7FFFFFFF+0.000000000233; }    
    // float(50); // returns a number between 0-50 exclusive
    // float(20,50); // returns a number between 20-50 exclusive
    public function float(min:Number,max:Number=NaN):Number { if (isNaN(max)) { max = min; min=0; } return random()*(max-min)+min; }  
    // boolean(); // returns true or false (50% chance of true)
    // boolean(0.8); // returns true or false (80% chance of true)
    public function boolean(chance:Number=0.5):Boolean {return (random() < chance);    }            
    // integer(50); // returns an integer between 0-49 inclusive
    // integer(20,50); // returns an integer between 20-49 inclusive
    public function integer(min:Number,max:Number=NaN):int {if (isNaN(max)) { max = min; min=0; } return Math.floor(float(min,max));    }
    // reset(); // resets the number series, retaining the same seed
    public function reset():void {_seed = _currentSeed;}}

class ClassicalNoise { // Mr Perlin
    private var grad3:Array; private var perm:Array; private var p:Array;
 public function ClassicalNoise(r:Rndm):void { // Classic Perlin noise in 3D, for comparison 
    grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0], [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1], [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
    this.p = []; var i:int; for (i=0; i<256; i++) { p[i] = Math.floor(r.random()*256);}
    perm = []; for(i=0; i<512; i++) { perm[i]=p[i & 255]; } }
    public function dot(g:Array, x:Number, y:Number, z:Number):Number { return g[0]*x + g[1]*y + g[2]*z; }
    public function mix(a:Number, b:Number, t:Number):Number { return (1.0-t)*a + t*b; }
    public function fade(t:Number):Number { return t*t*t*(t*(t*6.0-15.0)+10.0); }
    public function noise(x:Number, y:Number, z:Number):Number { var X:Number = Math.floor(x);var Y:Number = Math.floor(y); var Z:Number = Math.floor(z);
        x = x - X; y = y - Y; z = z - Z; X = X & 255;Y = Y & 255; Z = Z & 255;
        var gi000:Number = this.perm[X+this.perm[Y+this.perm[Z]]] % 12; var gi001:Number = this.perm[X+this.perm[Y+this.perm[Z+1]]] % 12;
        var gi010:Number = this.perm[X+this.perm[Y+1+this.perm[Z]]] % 12; var gi011:Number = this.perm[X+this.perm[Y+1+this.perm[Z+1]]] % 12;
        var gi100:Number = this.perm[X+1+this.perm[Y+this.perm[Z]]] % 12; var gi101:Number = this.perm[X+1+this.perm[Y+this.perm[Z+1]]] % 12;
        var gi110:Number = this.perm[X+1+this.perm[Y+1+this.perm[Z]]] % 12; var gi111:Number = this.perm[X+1+this.perm[Y+1+this.perm[Z+1]]] % 12;
        var n000:Number= this.dot(this.grad3[gi000], x, y, z); var n100:Number= this.dot(this.grad3[gi100], x-1, y, z);
        var n010:Number= this.dot(this.grad3[gi010], x, y-1, z); var n110:Number= this.dot(this.grad3[gi110], x-1, y-1, z);
        var n001:Number= this.dot(this.grad3[gi001], x, y, z-1); var n101:Number= this.dot(this.grad3[gi101], x-1, y, z-1);
        var n011:Number= this.dot(this.grad3[gi011], x, y-1, z-1); var n111:Number= this.dot(this.grad3[gi111], x-1, y-1, z-1);
        var u:Number = this.fade(x); var v:Number = this.fade(y); var w:Number = this.fade(z);
        var nx00:Number = this.mix(n000, n100, u); var nx01:Number = this.mix(n001, n101, u); var nx10:Number = this.mix(n010, n110, u);
        var nx11:Number = this.mix(n011, n111, u); var nxy0:Number = this.mix(nx00, nx10, v); var nxy1:Number = this.mix(nx01, nx11, v);
        var nxyz:Number = this.mix(nxy0, nxy1, w); return nxyz; } }
        