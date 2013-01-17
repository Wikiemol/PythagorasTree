var Main = function(){
window.addEventListener('load',onWindowLoaded,false);

var canvas 	= null;
var cxt		= null;
var angle 	= null;
var size	= null;
var age		= null;
var height	= null;
var decrease	= null;
var grow	= null;
var interval	= null;
var a		= null;
var s		= null;
var h		= null;
var g		= null;
var max		= null;
var flip	= null;
function onWindowLoaded(e){
	canvas 		= document.getElementById("theCanvas");
	cxt		= canvas.getContext('2d');
	resetValues();
	
	grow.addEventListener("click",submitForm,false);
	drawCanvas();
}
function drawCanvas(){
	
	
	canvas.style.position 	= "absolute";
	canvas.style.left	= window.innerWidth/2 - canvas.width/2
	
	cxt.clearRect(0,0,canvas.width,canvas.height);
	var tree = new PTreePine(age,canvas.width/2,canvas.height,cxt);
	tree.setAngle(angle*Math.PI/180);
	tree.setSize(size);
	tree.setHeight(height);
	tree.setDecrease(decrease);
	if(flip){
		tree.flip();
	}
	
	tree.draw();
	
	cxt.strokeRect(0,0,canvas.width,canvas.height);
	 
	if(angle < a){
		angle++;
	}
	if(size < s){
		size++;
	}
	if(height < h){
		height++;
	}
	if(age < g){
		age++;
	}
	if(angle >= a  && height >= h && size >= s && age >= g){
		window.clearInterval(interval);
	}
}

function submitForm(e){
	resetValues();
	drawCanvas();
}
function resetValues(){
	
	a		= document.getElementById('angle').value;
	s		= document.getElementById('size').value;
	h		= document.getElementById('height').value;
	g		= document.getElementById('age').value;
	flip 		= document.getElementById('flip').checked;
	interval 	= window.setInterval(drawCanvas,33);
	angle 		= 0;
	size 		= 0;
	age		= 0;
	height		= 0;
	decrease	= document.getElementById('decrease').value;
	grow		= document.getElementById('grow');
	
}
}()


var PTreePine = function(){
	
	return function(i,x,y,cxt){
		/*private*/ var size 		= 30;
		/*private*/ var angle 		= 55*Math.PI/180;
		/*private*/ var d		= .70;
		/*private*/ var iterations 	= i-1;
		/*private*/ var points		= new Array();
		/*private*/ var count		= 0;
		/*private*/ var height		= 50;
		/*private*/ var flip		= false;
		
		/*********Privileged functions**********/
		this.draw = /*public*/ function(){
			cxt.save();
			cxt.translate(x,y);
			cxt.fillRect(-size/2,-height,size,height);
			cxt.restore();
			

			if(iterations < 0){
				return;
			}
			var branch = new PBranch(getP1(),getP2(),cxt);
			branch.setAngle(angle);
			branch.setDecrease(d);
			if(flip){
				branch.flip();
			}
			branch.draw();
			points.push(branch.getP1());
			points.push(branch.getP2());
			points.push(branch.getP3());
			points.push(branch.getP4());
			for(var j = 0, len = points.length; j < len; j++){
				console.log(points[j]);
			}
			
			drawTree();
		}

		this.setSize = /*public*/ function(s){
			size = s;
		}
		this.setAngle = /*public*/ function(a){
			angle = a;
		}
		this.setDecrease = /*public*/ function(decrease){
			d = decrease;
		}
		this.setHeight = /*public*/ function(h){
			height = h;
		}
		this.flip = /*public*/ function(){
			flip = true;
		}

		/*********Private functions**********/

		/*private*/ function drawTree(){
			
			var plen = points.length;
			if(iterations == 0){
				return;
			}
			var tpoints = new Array();
			for(var j = count; j < plen; j++){
				tpoints.push(points[j]);
			}
			var tlen = tpoints.length;
			for(var j = count; j < tlen; j+=2){
				var branch = new PBranch(points[j],points[j+1],cxt);
				branch.setAngle(angle);
				branch.setDecrease(d);
				if(flip){
					branch.flip();
				}
				
				branch.draw();
				
				points.push(branch.getP1());
				points.push(branch.getP2());
				points.push(branch.getP3());
				points.push(branch.getP4());
				
				
			}
			count = tlen - 2;
			iterations--;
			
			drawTree();
			
		}
		
		/*private*/ function getP1(){
			var p1 = new Point((x - size/2),(y - height));
			return p1;
		}
		
		/*private*/ function getP2(){
			var p2 = new Point((x + size/2),(y - height));
			return p2;
		}
	}
	
	
}()


//takes arguments p1,p2,angle,percentage of branch size, and context

/*Interface Branch{
	setContext
	draw
	setColor
	setAngle
	setDecrease
	getAngle
	getLength
	flip
	getP1
	getP2
	getP3
	getP4
	private getPoint1
	private getPoint2
	private getPoint3
	private getPoint4
}*/

var PBranch = function(){
	
	
	return function(p1,p2,context){ //Branch constructor implements Branch
		/*private*/ var angle	= Math.PI/6;
		/*private*/ var p	= 0.6;
		/*private*/ var cxt 	= context;	
		/*private*/ var length	= getLength()	
		/*private*/ var side1	= length*p;
		/*private*/ var side2	= Math.sqrt(side1*side1 + length*length - 2*side1*length*Math.cos(angle));
		/*private*/ var angle2	= Math.PI*2 - (Math.asin((Math.sin(angle)*side1)/side2) - getAngle());
		/*private*/ var pnt4	= getPoint4();
		/*private*/ var pnt3	= getPoint3();
		
		/*private*/ var pnt1	= getPoint1();
		/*private*/ var pnt2	= getPoint2();
		
		
		getAngle();
		
		/*********Privileged functions**********/
		
		
		this.setContext = /*public*/ function(c){
			cxt = c;
		}
		
		this.setAngle = function(a){
			angle = a;
			reset();
		}
		this.setDecrease = function(d){
			if(d >= 1){
				throw new Error("Percent decrease of the branch must be less than one");
			}
			p = d;
			reset();
		}
		this.draw = /*public*/ function(){
			
			drawBranch();
		}
		this.getP1 = /*public*/ function(){
			return pnt1;
		}
		this.getP2 = /*public*/ function(){
			return pnt2;
		}
		this.getP3 = /*public*/ function(){
			return pnt3;
			 
		}
		this.getP4 = /*public*/ function(){
			return pnt4;
		}
		this.flip = /*public*/ function(){
			var temp = angle;
			angle = Math.PI*2 - angle2 + getAngle();
			angle2 = - temp + getAngle();
			temp = side1;
			side1 = side2;
			side2 = temp;
			pnt1 = getPoint1();
			pnt2 = getPoint2();
			pnt4 = getPoint4();
			pnt3 = getPoint3();
		}
		/*********Private functions**********/

		/*private*/ function getLength(){ //returns length between the two given points
			var disX 	= Math.abs(p2['x'] - p1['x']);
			var disY 	= Math.abs(p2['y'] - p1['y']);
			var dis		= Math.sqrt(disX*disX + disY*disY);
			
			return dis;
		}
		
		/*private*/ function getAngle(){ //returns the angle of the line created by the two points when compared to horizontal axis

			var disX 	= Math.abs(p1['x'] - p2['x']);
			var disY 	= Math.abs(p1['y'] - p2['y']);
			var dis		= Math.sqrt(disX*disX + disY*disY);

			if(p1['y'] > p2['y'] && p1['x'] < p2['x']){
				
				var angle = (360*Math.PI/180) - Math.asin(disY/dis);
				return angle;
			
			}else if(p1['y'] < p2['y'] && p1['x'] < p2['x']){
				
				var angle = Math.asin(disY/dis);
				return angle;
				
			}else if(p1['y'] > p2['y'] && p1['x'] > p2['x']){

				var angle = Math.PI + Math.asin(disY/dis);
				return angle;

			}else if(p1['y'] < p2['y'] && p1['x'] > p2['x']){

				var angle = Math.PI/2 + Math.asin(disX/dis);
				return angle;
				
			}else if(p1['y'] == p2['y'] && p1['x'] < p2['x']){
				
				return 0;

			}else if(p1['y'] == p2['y'] && p1['x'] > p2['x']){

				return Math.PI;

			}else if(p1['y'] > p2['y'] && p1['x'] == p2['x']){
					
				return 270*(Math.PI/180);

			}else if(p1['y'] < p2['y'] && p1['x'] == p2['x']){

				return Math.PI/2;

			}else{
				//throw new Error("The two points passed into the Branch constructor must form a line");
				return null;
			}
		}
		
		
		/*private*/ function drawBranch(){
			cxt.save(); //right most square
			cxt.translate(p2['x'],p2['y']);
			cxt.rotate(angle + getAngle()); // origin at bottom right
			cxt.fillRect(-side1,-side1,side1,side1);
			cxt.restore();

			cxt.save(); // left most square
			cxt.translate(p1['x'],p1['y']);
			cxt.rotate(angle2);
			cxt.fillRect(0,-side2,side2,side2); //origin at bottom left
			cxt.restore();
			
		}
		
		/*private*/ function getPoint4(){
			var a 		= Math.PI + (angle + Math.PI/2) + getAngle();
			var sidex 	= Math.cos(a)*side1;
			var sidey 	= Math.sin(a)*side1;
			var x 		= sidex + p2['x'];
			var y 		= sidey + p2['y'];
			
			var point4 	= new Point(x,y);
			
			return point4;
		}
		/*private*/ function getPoint3(){
			var a 		= angle + getAngle();
			var sidex 	= Math.cos(a)*side1;
			var sidey 	= Math.sin(a)*side1;
			var point4 	= pnt4;
			 
			var x		= point4['x'] - sidex;
			var y		= point4['y'] - sidey;
			
			var point3	= new Point(x,y);
			
			return point3;
		}
		/*private*/ function getPoint2(){
			var a		= angle2;
			var sidex	= Math.cos(a)*side2;
			var sidey	= Math.sin(a)*side2;
			var point1	= pnt1;
			
			var x 		= pnt1['x'] + sidex;
			var y		= pnt1['y'] + sidey;
			
			var point2	= new Point(x,y);
			
			return point2;
		}
		/*private*/ function getPoint1(){
			var a 		= Math.PI*2 - angle2;
			var sidex	= Math.sin(a)*side2;
			var sidey	= Math.cos(a)*side2;
			var x		= p1['x'] - sidex;
			var y		= p1['y'] - sidey;
			
			var point1	= new Point(x,y);
			
			
			return point1;
		}
		/*private*/ function reset(){		
			side1	= length*p;
			side2	= Math.sqrt(side1*side1 + length*length - 2*side1*length*Math.cos(angle));
			angle2	= Math.PI*2 - (Math.asin((Math.sin(angle)*side1)/side2) - getAngle());
			pnt4	= getPoint4();
			pnt3	= getPoint3();
		
			pnt1	= getPoint1();
			pnt2	= getPoint2();
		}

	}

	
	

}()

var Point = function(x,y){
	var p = new Array();
	p['x'] = x;
	p['y'] = y;
	return p;
}