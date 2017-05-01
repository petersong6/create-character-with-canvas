// http://www.williammalone.com/articles/create-html5-canvas-javascript-game-character/1/

$(document).ready(function() {
	char_res.init();
});

var char_res={
	'imgs': ['leftArm','legs','torso','rightArm','head','hair'],
	'images': {},
	'numResourcesLoaded': 0,	//已載入的圖片的數量

	'fps': 30,				//設定 FPS
	'curFPS': 0,			//秒數
	'numFramesDrawn': 0,	//繪製的 frame 數

	'breathDir': 1,			//目前的呼吸方向; 1: breath in 吸入, -1: breath out 呼出
	'breathAmt': 0,			//目前呼吸的圖形的改變量

	'maxEyeHeight': 14,		//最大的眼睛的高度
	'curEyeHeight': 14,		//目前的眼睛的高度
	'timeBtwBlinks': 2000,	//多久眨一次眼睛(ms)

	'init': function(){
		$(this.imgs).each(function(idx,ele){
			// Load images
			var obj_img = new Image();
			obj_img.src = 'images/' + ele + '.png';
			obj_img.onload = function() {
				char_res.resourceLoaded(490, 220);
			}
			char_res.images[ele] = obj_img;
		});
	},
	'resourceLoaded': function(canvas_width, canvas_height){
		char_res.numResourcesLoaded += 1;
		if(char_res.numResourcesLoaded === char_res.imgs.length) {
			$('<canvas></canvas>').attr({'width':canvas_width,'height':canvas_height,'id':'canvas'}).appendTo($('#canvasDiv'));

			// 依 fps 設定值，重繪角色
			setInterval("char_res.redraw(245, 185)", 1000 / char_res.fps);

			//眨眼睛
			char_res.curEyeHeight=char_res.maxEyeHeight;
			setTimeout("char_res.updateBlink()", char_res.timeBtwBlinks);	// 執行「眨眼睛」的動作
		}
	},
	'updateBreath': function(){	//更新「呼吸」的效果資料
		var breathInc = 0.1;	//每次呼吸時，圖形的改變量
		var breathMax = 2;		//最大的圖形的改變量

		if (char_res.breathDir === 1) {  // breath in
			char_res.breathAmt -= breathInc;
			if (char_res.breathAmt < -breathMax) char_res.breathDir = -1;
		} else {  // breath out
			char_res.breathAmt += breathInc;
			if(char_res.breathAmt > breathMax) char_res.breathDir = 1;
		}
	},
	'updateBlink': function(){	//更新「眨眼睛」的效果資料
		char_res.curEyeHeight -= 1;
		if (char_res.curEyeHeight <= 0) {
			char_res.curEyeHeight = char_res.maxEyeHeight;
			setTimeout("char_res.updateBlink()", char_res.timeBtwBlinks);	// 執行「眨眼睛」的動作
		} else {
			setTimeout("char_res.updateBlink()", 10);
		}
	},
	'redraw': function(x, y){
		var canvas = $('#canvas').get(0);
		var context = canvas.getContext('2d');

		canvas.width = canvas.width; // clears the canvas

		// We create the shadow with one oval at our characters feet.
		this.drawEllipse(context, x + 40, y + 29, 160, 6);

		context.drawImage(this.images['leftArm'], x + 40, y - 42 - char_res.breathAmt);
		context.drawImage(this.images['legs'], x, y);
		context.drawImage(this.images['torso'], x, y -50);
		context.drawImage(this.images['rightArm'], x - 15, y - 42 - char_res.breathAmt);
		context.drawImage(this.images['head'], x - 10, y - 125 - char_res.breathAmt);
		context.drawImage(this.images['hair'], x - 37, y - 138 - char_res.breathAmt);

		this.drawEllipse(context, x + 47, y - 68 - char_res.breathAmt, 8, char_res.curEyeHeight); // Left Eye
		this.drawEllipse(context, x + 58, y - 68 - char_res.breathAmt, 8, char_res.curEyeHeight); // Right Eye

		//show fps data
		context.font = "bold 12px sans-serif";
		context.fillText("fps: " + char_res.curFPS + "/" + char_res.fps + "(" + char_res.numFramesDrawn + ")", 40, 200);
		char_res.numFramesDrawn++;
		if(char_res.numFramesDrawn > char_res.fps){
			char_res.curFPS = ((++char_res.curFPS) % char_res.fps);
			char_res.numFramesDrawn = 0;
		}
		this.updateBreath();
	},
	//劃出橢圓形
	'drawEllipse': function(context, centerX, centerY, width, height) {
		context.beginPath();

		context.moveTo(centerX, centerY - height/2);

		context.bezierCurveTo(
			centerX + width/2, centerY - height/2, centerX + width/2, centerY + height/2,
			centerX, centerY + height/2);

		context.bezierCurveTo(
			centerX - width/2, centerY + height/2, centerX - width/2, centerY - height/2,
			centerX, centerY - height/2);

		context.fillStyle = 'black';
		context.fill();
		context.closePath();
	}
};