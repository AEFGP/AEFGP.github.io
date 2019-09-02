let g = {}

function setup() {
	//Stuff you can change
	g.t = createVector(1,0)
	g.attrs = [[
			createVector(0,4/sqrt(3)/3),
			createVector(2/3,-2/sqrt(3)/3),
			createVector(-2/3,-2/sqrt(3)/3),
		],
		[
			createVector(0,-4/sqrt(3)/3),
			createVector(2/3,2/sqrt(3)/3),
			createVector(-2/3,2/sqrt(3)/3),
		]
	]
	g.reps = 500
	g.prob = 0.5
	g.regen = 1
	//Stuff you shouldn't change
	g.cr = 1
	g.radi = 10
	g.scali = 360
	g.pnt = createVector(0,0)
	g.trk = createVector(0,0)
	createCanvas(windowWidth*g.cr,windowHeight*g.cr)
	g.g = createGraphics(width,height)
	t = min(width,height)/(1080*g.cr)
	g.scal = g.scali*t
	g.rad = g.radi*t
	g.x = width/2
	g.y = height/2
	background(0)
	g.g.noStroke()
	colorMode(HSB,360)
	g.g.colorMode(HSB,360)
	angleMode(DEGREES)
	textSize(20*t)
	textFont('Consolas')
	g.set=g.attrs[0]
	g.seti=0
	g.addr=0
	g.edit=1
	g.e = 0
	g.me = 4
	g.col=1
	g.excl=0
	g.excn=0
	g.mem=1
	g.mfix=0
	g.ren=1
	g.errn=0
	g.errl=0
	g.shift=0
}

//Iteration Modes
function itLI() {
	r0 = sqrt(g.t.x*g.t.x+g.t.y*g.t.y)
	r1 = (1-1/(r0+1))/r0
	x0 = g.t.x*r1
	y0 = g.t.y*r1
	x1 = g.attr.x
	y1 = g.attr.y
	x2 = g.pnt.x
	y2 = g.pnt.y
	x3 = (1-x0)*x1+y0*y1+x0*x2-y0*y2
	y3 = (1-x0)*y1-y0*x1+x0*y2+y0*x2
}

function itCD() {
	x0 = exp(g.t.x)
	y0 = log(abs(g.t.y)+1)*(g.t.y<0 ? -1 : 1)
	x0 = exp(g.t.x)
	y0 = log(abs(g.t.y)+1)*(g.t.y<0 ? -1 : 1)
	x1 = g.attr.x-g.pnt.x
	y1 = g.attr.y-g.pnt.y
	x2 = g.pnt.x
	y2 = g.pnt.y
	r = sqrt(x1*x1+y1*y1)
	x3 = x2+(x0*x1-y0*y1)/r
	y3 = y2+(x0*y1+x1*y0)/r
}

function itEItoLI() {
	x4 = g.t.x*2
	y4 = g.t.y*2
	x1 = g.attr.x
	y1 = g.attr.y
	x2 = g.pnt.x
	y2 = g.pnt.y
	r2 = sqrt(x2*x2+y2*y2)
	t = atan2(y2,x2)
	x5 = x1+pow(r2,x4)*exp(-y4*t)*cos(t*x4+y4*log(r2))
	y5 = y1+pow(r2,x4)*exp(-y4*t)*sin(t*x4+y4*log(r2))
	r0 = sqrt(x5*x5+y5*y5)
	r1 = (1-1/(r0+1))/r0
	x0 = x5*r1
	y0 = y5*r1
	x3 = (1-x0)*x1+y0*y1+x0*x2-y0*y2
	y3 = (1-x0)*y1-y0*x1+x0*y2+y0*x2
}

function itEItoCD(){
	x4 = g.t.x*2
	y4 = g.t.y*2
	x5 = g.attr.x
	y5 = g.attr.y
	x2 = g.pnt.x
	y2 = g.pnt.y
	r2 = sqrt(x2*x2+y2*y2)
	t = atan2(y2,x2)
	x6 = x5+pow(r2,x4)*exp(-y4*t)*cos(t*x4+y4*log(r2))
	y6 = y5+pow(r2,x4)*exp(-y4*t)*sin(t*x4+y4*log(r2))
	x0 = exp(x6)
	y0 = log(abs(y6)+1)*(y6<0 ? -1 : 1)
	x0 = exp(x6)
	y0 = log(abs(y6)+1)*(y6<0 ? -1 : 1)
	x1 = g.attr.x-g.pnt.x
	y1 = g.attr.y-g.pnt.y
	x2 = g.pnt.x
	y2 = g.pnt.y
	r = sqrt(x1*x1+y1*y1)
	x3 = x2+(x0*x1-y0*y1)/r
	y3 = y2+(x0*y1+x1*y0)/r
}

function itEI(){
	x0 = g.t.x*2
	y0 = g.t.y*2
	x1 = g.attr.x
	y1 = g.attr.y
	x2 = g.pnt.x
	y2 = g.pnt.y
	r = sqrt(x2*x2+y2*y2)
	t = atan2(y2,x2)
	x3 = x1+pow(r,x0)*exp(-y0*t)*cos(t*x0+y0*log(r))
	y3 = y1+pow(r,x0)*exp(-y0*t)*sin(t*x0+y0*log(r))
}

function itMP(){
	x1 = g.attr.x
	y1 = g.attr.y
	x2 = g.pnt.x
	y2 = g.pnt.y
	x3 = (x1+x2)/2
	y3 = (y1+y2)/2
}

function itPF(){
	n=g.set.length
	c=g.polyCs[g.seti]
	z=zPows(n)
	cx=c[0].x
	cy=c[0].y
	zx=z[0].x
	zy=z[0].y
	p=createVector(cx*zx-cy*zy,cx*zy+cy*zx)
	for (i=1;i<n;i++){
		cx=c[i].x
		cy=c[i].y
		zx=z[i].x
		zy=z[i].y
		p.add(createVector(cx*zx-cy*zy,cx*zy+cy*zx))
	}
	x3=p.x
	y3=p.y
	//g.pnt=p
}

function iterate() {
	x3=0
	y3=0
	switch (g.e){
		//Choose iteration algorithm
		case 0:
		//Linear Interpolation
			itLI()
		break
		case 1:
		//Constant Distance
			itCD()
		break
		case 2:
		//Exponential Iteration -> Linear Interpolation
			itEItoLI()
		break
		case 3:
		//Polynomial Function
			itPF()
		break
		default:
		//Midpoint
			itMP()
	}
	g.pnt.x=x3
	g.pnt.y=y3
}

function mod(a,b){
	//Float modulo function
	return a-b*int(a/b)
}

function updPolyCs(){
	if (g.e==3){
		g.polyCs=[attrPolyCs(g.attrs[0])]
		for (j=1;j<g.attrs.length;j++){
			g.polyCs.push(attrPolyCs(g.attrs[j]))
		}
	}
}

function attrPolyCs(set){
	c=[createVector(g.t.x,g.t.y)]
	for (n=0;n<set.length;n++){
		c.push(0)
		sr=set[n].x
		si=set[n].y
		for (i=n;i>0;i--){
			cr=c[i].x
			ci=c[i].y
			cl=c[i-1].copy()
			c[i]=cl.sub(createVector(sr*cr-si*cr,sr*ci+si*cr))
		}
		cr=c[0].x
		ci=c[0].y
		c[0]=createVector(-sr*cr-si*ci,-sr*ci-si*cr)
	}
	return c
}

function zPows(n){
	x=g.pnt.x
	y=g.pnt.y
	zp=[createVector(1,0)]
	if (n>0){
		zp.push(createVector(x,y))
	}
	xp=x
	yp=y
	for (i=2;i<n;i++){
		zp.push(createVector(xp*x-yp*y,xp*y+yp*x))
	}
	return zp
}

function mout(x,y,a){
	//Change variable point
	switch(g.mfix){
		case 1:
			g.colx=(x-g.x)/g.scal
			g.coly=-(y-g.y)/g.scal
		break
		case 2:
			g.pnt.x=(x-g.x)/g.scal
			g.pnt.y=-(y-g.y)/g.scal
		break
		case 3:
			if (a==1){
				g.trk.x=x/g.scal
				g.trk.y=-y/g.scal
			}
			else{
				g.pnt.x+=(x-g.x)/g.scal
				g.pnt.y+=-(y-g.y)/g.scal
			}
		break
		case 4:
			g.regen=(1+(x-g.x)/g.scal)/2
			g.prob=(1+-(y-g.y)/g.scal)/2
		break
		case 5:
			g.epnt.x=(x-g.x)/g.scal
			g.epnt.y=-(y-g.y)/g.scal
		break
		default:
			g.t.x=(x-g.x)/g.scal
			g.t.y=-(y-g.y)/g.scal
			updPolyCs()
	}
} 

function mget(){
	//Get point data to vary
	let x=0.0
	let y=0.0
	switch(g.mfix){
		case 1:
			x=g.colx*g.scal+g.x
			y=g.coly*-g.scal+g.y
		break
		case 2:
			x=g.pnt.x*g.scal+g.x
			y=g.pnt.y*-g.scal+g.y
		break
		case 3:
			x=g.trk.x
			y=g.trk.y
		break
		case 4:
			x=(g.regen*2-1)*g.scal+g.x
			y=-(g.prob*-2+1)*g.scal+g.y
		break
		case 5:
			x=g.epnt.x*g.scal+g.x
			y=g.epnt.y*-g.scal+g.y
		break
		default:
			x=g.t.x*g.scal+g.x
			y=g.t.y*-g.scal+g.y
	}
	return createVector(x,y)
}

function draw() {
	//Main Draw loop
	background(0)
	translate(g.x,g.y)
	let tepnt=g.attrs[g.addr]
	g.epnt=tepnt[tepnt.length-1]
	if (g.edit) {
		//Edit mode
		len = g.attrs.length
		brk = []
		brek = 1
		for (let i=0;i<len;i++) {
			attrs = g.attrs[i]
			len2 = attrs.length
			for (let k=0;k<len2;k++) {
				attr = attrs[k]
				brek = 1
				if(mouseIsPressed){
					tempos = createVector(mouseX-g.x,-mouseY+g.y).div(g.scal)
					if (g.scal*tempos.dist(attr)<g.rad) {
						if (attrs.length>1){ 
								brk.push([i,k])
								brek = 0
						}
					}
				}
				if(brek){
					fill(360*i/len,360,360)
					ellipse(attr.x*g.scal,-attr.y*g.scal,g.rad,g.rad)
				}
			}
		}
		for (let i = 0; i<brk.length;i++){
		g.attrs[brk[i][0]].splice(brk[i][1],1)
		}
	}
	else { 
		//Render mode
		for (let i = 0;i<g.reps/(g.mem+(g.mem==0));i++){
			if(random()>g.regen){
				regen()
			}
			g.ph=g.pnt.copy()
			ph = g.pnt.copy()
			if(mouseIsPressed){
				mout(mouseX,mouseY,0)
			}
			g.pnt.add(g.trk) 
			if(g.ren){
			for(let m=0;m<(g.mem+(g.mem==0));m++){
			if (random(1)>g.prob){
				if((g.excl!=0) && g.attrs.length>1){
					_set = []
					ind = g.attrs.length
					for (let k=0;k<g.attrs.length;k++){
						a=g.attrs[k]
						if(a==g.set){
						ind = k
						}
					}
					for (let k=0;k<g.attrs.length;k++){
						a=g.attrs[k]
						if(k!=mod(ind+g.excl-1,g.attrs.length+g.errl+(g.excl==1))){
							_set.push(g.attrs[k])
						}
					}
					g.seti = floor(random(0,_set.length))
					g.set = _set[g.seti]
				}
				else{
					g.seti = floor(random(0,g.attrs.length))
					g.set = g.attrs[g.seti]
				}
			}
			if((g.excn!=0) && g.set.length>1){
				_set = []
				ind = g.set.length
				for (let k=0;k<g.set.length;k++){
					a=g.set[k]
					if(a==g.attr){
					ind = k
					}
				}
				for (let k=0;k<g.set.length;k++){
					a=g.set[k]
					if(k!=mod(ind+g.excn-1,g.set.length+g.errn+(g.excn==1))){
					_set.push(g.set[k])
					}
				}
				g.attr = random(_set)
			}
			else{
				g.attr = random(g.set)
			}
			iterate()
		    }
			if(g.mem==0){
				ph=g.pnt.copy()
			}
			g.ph=g.pnt.copy()
			let cp=g.pnt.copy().sub(createVector(g.colx,g.coly))
			let cph=ph.sub(createVector(g.colx,g.coly))
			switch(g.col){
				//Choose colour
				case 1:
					h = cph.heading()
					if (h<0){
						h+=360
					}
					g.g.fill(h,360,360)
					break
				case 2:
					h = 180*cph.mag()
					if (h<0){
						h+=360
					}
					if (h>360){
						h-=360
					}
					g.g.fill(h,360,360)
					break
				case 3:
					h = cp.heading()-cph.heading()
					if (h<0){
						h+=360
					}
					g.g.fill(h,360,360)
					break
				case 4:
					h = 180*(cp.mag()-cph.mag())
					if (h<0){
						h+=360
					}
					if (h>360){
						h-=360
					}
					g.g.fill(h,360,360)
					break
				default:
					g.g.fill(360)
				}
			g.g.ellipse(g.pnt.x*g.scal+g.x,-g.pnt.y*g.scal+g.y,0.25,0.25)
			}
		}
		image(g.g,-g.x,-g.y,width,height)
	}
}

function windowResized() {
	//Event for when window is resized
	resizeCanvas(windowWidth*g.cr,windowHeight*g.cr)
	t = min(width,height)/(1080*g.cr)
	g.g = createGraphics(width,height)
	g.scal = g.scali*t
	g.rad = g.radi*t
	g.x = width/2
	g.y = height/2
	textSize(20*t) 
	g.g.colorMode(HSB,360)
	g.g.noStroke()
}

function regen() {
	//Reset iterated point to a random value
	g.pnt.x = 2*random()-1
	g.pnt.y = 2*random()-1
}

function keyPressed() {
	//Event for handling keypresses
	print(keyCode)
	if (keyCode==32){
		//space
		g.edit = !g.edit
		regen()
		g.g.clear()
	}
	let l=mget()
	if (keyCode==87){
		//w
		mout(l.x,l.y-g.scal/20,1)
	}
	if (keyCode==65){
		//a
		mout(l.x-g.scal/20,l.y,1)
	}
	if (keyCode==83){
		//s
		mout(l.x,l.y+g.scal/20,1)
	}
	if (keyCode==68){
		//d
		mout(l.x+g.scal/20,l.y,1)
	}
	if (keyCode==192){
		//`
		g.mfix=mod(g.mfix+1,6)
	}
	if (keyCode==49){
		//1
		g.mfix=0
	}
	if (keyCode==50){
		//2
		g.mfix=1
	}
	if (keyCode==51){
		//3
		g.mfix=2
	}
	if (keyCode==52){
		//4
		g.mfix=3
	}
	if (keyCode==53){
		//5
		g.mfix=4
	}
	if (keyCode==54){
		//6
		g.mfix=5
	}
	if (keyCode==16){
		//shift
		g.shift=!g.shift
	}
	if (g.edit){
		switch (keyCode){
			case 37:
			//left
			if (g.addr){
				g.addr--
			}
			break
			case 38:
			//up
			g.attrs.push([])
			break
			case 39:
			//right
			if (g.addr<g.attrs.length-1){
				g.addr++
			}
			break
			case 40:
			//down
			if (g.attrs.length>1){
				g.attrs.pop()
				if (g.addr>=g.attrs.length){
					g.addr=g.attrs.length-1
				}
			}
			break
			default:
			
		}
	}
	else{
		if (keyCode==82){
			//r
			regen()
			g.g.clear()
			
		}
		if (keyCode==13){
			//enter
			saveCanvas('compiterator.png')
		}
		if (keyCode==81){
			//q
			g.ren=!g.ren
		}
		if (keyCode==66){
			//b
			g.col++
			if(g.col>=5){
			g.col=0
			}
			g.g.clear()
		}
		if (keyCode==69){
			//e
			g.e=mod(g.e+1,g.me)
		}
		if (keyCode==72){
			//h
			for (let i=0;i<g.attrs.length;i++){
				g.attrs[i]=shuffle(g.attrs[i])
			}
		}
		if (keyCode==75){
			//k
			g.attrs = shuffle(g.attrs)
		}
		if (keyCode==78){
			//n
			if(g.shift){
				g.errn=!g.errn
			}
			else{
				g.excn=mod(g.excn+1,g.set.length+2)
			}
		}
		if (keyCode==77){
			//m
			if(g.shift){
				g.errl=!g.errl
			}
			else{
				g.excl=mod(g.excl+1,g.attrs.length+2)
			}
		}
		if (keyCode==188&&g.mem){
			//<,
			g.mem--
		}
		if (keyCode==190){
			//>.
			g.mem++
		}
	}
	updPolyCs()
}

function mouseClicked(){
	//Separate event for alt clicking in edit mode
	if (keyCode==18 && keyIsPressed && g.edit){
		g.attrs[g.addr].push(createVector(mouseX-g.x,g.y-mouseY).div(g.scal))
		updPolyCs()
	}
}