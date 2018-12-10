let g = {}

function setup() {
	//Stuff you can change
	g.t = createVector(1,0)
	g.attrs = [[
			createVector(0,2/sqrt(3)),
			createVector(1,-1/sqrt(3)),
			createVector(-1,-1/sqrt(3)),
		],
		[
			createVector(0,-2/sqrt(3)),
			createVector(1,1/sqrt(3)),
			createVector(-1,1/sqrt(3)),
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
	g.addr=0
	g.edit=1
	g.e = 0
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

function iterate() {
	switch (g.e){
		case 0:
			R0 = sqrt(g.t.x*g.t.x+g.t.y*g.t.y)
			R1 = (1-1/(R0+1))/R0
			x0 = g.t.x*R1
			y0 = g.t.y*R1
			x1 = g.attr.x
			y1 = g.attr.y
			x2 = g.pnt.x
			y2 = g.pnt.y
			x3 = (1-x0)*x1+y0*y1+x0*x2-y0*y2
			y3 = (1-x0)*y1-y0*x1+x0*y2+y0*x2
		break
		case 1:
			x0 = exp(g.t.x)
			y0 = log(abs(g.t.y)+1)*(g.t.y<0 ? -1 : 1)
			x0 = exp(g.t.x)
			y0 = log(abs(g.t.y)+1)*(g.t.y<0 ? -1 : 1)
			x1 = g.attr.x-g.pnt.x
			y1 = g.attr.y-g.pnt.y
			x2 = g.pnt.x
			y2 = g.pnt.y
			R = sqrt(x1*x1+y1*y1)
			x3 = x2+(x0*x1-y0*y1)/R
			y3 = y2+(x0*y1+x1*y0)/R
		break
		case 2:
			x0 = g.t.x*2
			y0 = g.t.y*2
			x1 = g.attr.x
			y1 = g.attr.y
			x2 = g.pnt.x
			y2 = g.pnt.y
			R = sqrt(x2*x2+y2*y2)
			T = atan2(y2,x2)
			x3 = x1+pow(R,x0)*exp(-y0*T)*cos(T*x0+y0*log(R))
			y3 = y1+pow(R,x0)*exp(-y0*T)*sin(T*x0+y0*log(R))
		break
		default:
			x1 = g.attr.x
			y1 = g.attr.y
			x2 = g.pnt.x
			y2 = g.pnt.y
			x3 = (x1+x2)/2
			y3 = (y1+y2)/2
	}
	g.pnt.x=x3
	g.pnt.y=y3
}

function mod(a,b){
	return a-b*int(a/b)
}

function mout(x,y,a){
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
	}
} 

function mget(){
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
	background(0)
	translate(g.x,g.y)
	let tepnt=g.attrs[g.addr]
	g.epnt=tepnt[tepnt.length-1]
	if (g.edit) {
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
					g.set = random(_set)
				}
				else{
					g.set = random(g.attrs)
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
	g.pnt.x = 2*random()-1
	g.pnt.y = 2*random()-1
}

function keyPressed() {
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
			g.e=mod(g.e+1,3)
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
}

function mouseClicked(){
	if (keyCode==18 && keyIsPressed && g.edit){
		g.attrs[g.addr].push(createVector(mouseX-g.x,g.y-mouseY).div(g.scal))
	}
}