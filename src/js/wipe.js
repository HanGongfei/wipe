var cas = document.getElementById("cas");
var context = cas.getContext("2d");
var _w = cas.width,_h = cas.height;
var radius = 30;
var posX = 0;
var posY = 0;
var isMouseDown = false;
//表示鼠标的状态,是否按下,默认未按下false,按下true;


//生成画布上的遮罩,默认为颜色#666
function drawMask(context){
	context.fillStyle = "#666";
	context.fillRect(0,0,_w,_h);
	context.globalCompositeOperation ="destination-out";
}
//在画布上画半径为30的圆
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
}
// 在canvas画布上监听自定义事件"mousedown",调用drawPoint函数
cas.addEventListener("mousedown",function(evt){
	//鼠标按下去,变为真
	isMouseDown = true;
	var event = evt || window.event;
	//获取鼠标在视口的坐标,传递参数到drawPoint;
	posX= event.clientX;
	posY= event.clientY;
	drawPoint(context,posX,posY);
},false);
//增加一个mouseove,调用drasPoint函数
cas.addEventListener("mousemove",fn1,false);
cas.addEventListener("mouseup",function(){
	isMouseDown = false;
	if(getTransparency(context)> 50){
		alert("超过了50%的面积");
	}
},false);
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