var cas = document.getElementById("cas");
var context = cas.getContext("2d");
var _w = cas.width,_h = cas.height;
var radius = 30;
var x1 = 0;
var y1 = 0;
var isMouseDown = false;
//表示鼠标的状态,是否按下,默认未按下false,按下true;

//deviice 保存设备类型,如果是移动端则为true,PC端为false
var device = (/android|webos|iPhone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
console.log(device);
//判断是pc端还是手机端
var clickEvtName = device?"touchstart":"mousedown";
var moveEvtName = device?"touchmove":"mousemove";
var upEvtName = device?"touchend":"mouseup";
//生成画布上的遮罩,默认为颜色#666
function drawMask(context){
	context.fillStyle = "#666";
	context.fillRect(0,0,_w,_h);
	context.globalCompositeOperation ="destination-out";
}
/*//在画布上画半径为30的圆
function drawPoint(context,posX,posY){
	context.save();
	context.beginPath();
	context.fillStyle = "red";
	context.arc(posX,posY,radius,0,2*Math.PI);
	context.fill();
	context.restore();
}
//画线
function drawLine(context,x1,y1,x2,y2){
	context.save();
	context.lineWidth = radius*2;
	context.lineCap = "round";
	context.beginPath();
	context.moveTo(x1,y1);
	context.lineTo(x2,y2 );
	context.stroke();
	context.restore();
}*/
function draw(context,x1,y1,x2,y2){
	if (arguments.length === 3) {
		context.save();
		context.beginPath();
		context.fillStyle = "red";
		context.arc(x1,y1,radius,0,2*Math.PI);
		context.fill();
		context.restore();
	}else if(arguments.length === 5){
		context.save();
		context.lineWidth = radius*2;
		context.lineCap = "round";
		context.beginPath();
		context.moveTo(x1,y1);
		context.lineTo(x2,y2 );
		context.stroke();
		context.restore();
	}else{
		return false;
	}
}
//手指点击
cas.addEventListener(clickEvtName,function(evt){
	isMouseDown = true;
	var event = evt || window.event;
	event.preventDefault();
	//获取手指在视口的坐标,传递参数到drawPoint
	x1 = device? event.touches[0].clientX : event.clientX;
	y1 = device? event.touches[0].clientY : event.clientY;
	draw(context,x1,y1);
});
//手指移动
cas.addEventListener(moveEvtName,function(evt){
	if(isMouseDown){
		var event = evt || window.event;
		event.preventDefault();
		var x2 = device? event.touches[0].clientX:event.clientX;
		var y2 = device? event.touches[0].clientY:event.clientY;
		draw(context,x1,y1,x2,y2);
		//每次的结束点编程下一次划线的开始
		x1 = x2;
		y1 = y2;
	}else{
		return false;
	}
},false);
//手指松开
cas.addEventListener(upEvtName,function(){
	isMouseDown = false;
	if(getTransparency(context)> 50){
		alert("超过了50%的面积");
		clearRech(context);
	}
});
/*// 在canvas画布上监听自定义事件"mousedown",调用drawPoint函数
cas.addEventListener("mousedown",function(evt){
	//鼠标按下去,变为真
	isMouseDown = true;
	var event = evt || window.event;
	//获取鼠标在视口的坐标,传递参数到drawPoint;
	posX= event.clientX;
	posY= event.clientY;
	drawPoint(context,posX,posY);
},false)*/
//增加一个mouseove,调用drasPoint函数
// cas.addEventListener("mousemove",fn1,false);
// cas.addEventListener("mouseup",function(){
// 	isMouseDown = false;
// 	if(getTransparency(context)> 50){
// 		alert("超过了50%的面积");
// 		clearRech(context);
// 	}
// },false);
function fn1(evt){
	if(isMouseDown){
		var event = evt || window.event;
		var x2 = event.clientX;
		var y2 = event.clientY;
		drawLine(context,posX,posY,x2,y2);
		//每次的结束点编程下一次划线的开始
		posX = x2;
		posY = y2;
	}else{
		return false;
	}
}
function getTransparency(context){
	var imgData = context.getImageData(0,0,_w,_h);
	var t = 0;
	for(var i=0;i<imgData.data.length; i+=4){
        // var i = (y*_w + x)*4;
       	if(imgData.data[i+3] ===0){
            t++;
       	}
    }
    var percent = (t/(_w*_h))*100;
    console.log("透明点的个数:"+t);
    console.log("占总面积"+Math.ceil(percent)+"%");
    //return percent.toFixed(2);//截取小数点俩位
    return Math.round(percent);

}	
function clearRech(context){
	context.clearRect(0,0,_w,_h);
}
window.onload = function(){
	drawMask(context);
	// drawPoint(context);
};







// timeout = setTimeout(function(){
//     var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
//     var dd = 0;
//     for(var x=0;x<imgData.width;x+=30){
//         for(var y=0;y<imgData.height;y+=30){
//             var i = (y*imgData.width + x)*4;
//             if(imgData.data[i+3] >0){
//                 dd++
//             }
//         }
//     }
//     if(dd/(imgData.width*imgData.height/900)<0.4){
//         canvas.className = "noOp";
//     }
// },100)