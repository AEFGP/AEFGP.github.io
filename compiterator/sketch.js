let G = {} //cross-canvas global container

function setup() {
	//Stuff you can change
	G.t = createVector(1,0) //Iteration complex parameter's initial value
	G.rot = createVector(1,0) //Screen rotation complex parameter's initial value
	G.e = 0 // iteration mode
	G.col=1 // colour mode
	G.mem=1 // colour memory
	G.rech=1  // regen check
	G.shift=0 // exclusion mode shift toggle
	G.excl=0 // 
	G.excn=0 // 
	G.errn=0 //
	G.errl=0 // 

	G.attrs = [[ //Layers of Attractor Nodes initial state
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

	G.REPS = 500 //Number of iteration repetitions per frame
	G.prob = 0.5 //Probability of layer reselect
	G.regen = 1 //Probability of not regen
	G.ITCAP = 20000 //Number of iterations until regen
	G.ZEROR = 0 // Distance to attractor threshold for regen
	G.NORENS= 3 //Number of points that are not rendered after each regen

	//Stuff you shouldn't change
	G.CR = 1
	createCanvas(windowWidth*G.CR,windowHeight*G.CR)
	G.graph=createGraphics(width,height)
	G.graph.noStroke()
	G.graph.colorMode(HSB,360)
	colorMode(HSB,360)
	background(0)
	angleMode(RADIANS)
	smallestAspect = min(width,height)/(1080*G.CR)
	G.SCALI = 360
	G.RADI = 10 //Size of attractor nodes
	G.DR = 0.25 //Size of iterated point stamps
	G.scal = G.SCALI*smallestAspect
	G.rad = G.RADI*smallestAspect
	G.x = width/2
	G.y = height/2
	G.pnt = createVector(0,0)
	G.pit = createVector(0,0)
	G.trk = createVector(0,0)
	G.set=G.attrs[0]
	G.seti=0 // selected layer index
	G.addr=0 // selected node in layer
	G.edit=1 // edit/render toggle
	G.ME = 6 // max iteration modes
	G.mfix=0 // mouse fix mode
	G.MMFIX=7 // max number of mouse fix modes
	G.ren=1 // render loop toggle
	G.itsr=0  // iterations since regen
	G.noren=0  // iterations to not render
}

function windowResized() {
	//Event for when window is resized
	resizeCanvas(windowWidth*G.CR,windowHeight*G.CR)
	G.graph=createGraphics(width,height)
	G.graph.colorMode(HSB,360)
	G.graph.noStroke()
	smallestAspect = min(width,height)/(1080*G.CR)
	G.scal = G.SCALI*smallestAspect
	G.rad = G.RADI*smallestAspect
	G.x = width/2
	G.y = height/2
}

// Complex functions
function cscal(u,s){
	return createVector(u.x*s,u.y*s)
}
function cinv(u){
	d=u.x*u.x+u.y*u.y
	if (d){
		return createVector(u.x/d,-u.y/d)
	}
	return createVector(0,0)
}
function cexp(u){
	return cscal(createVector(cos(u.y),sin(u.y)),exp(u.x))
}
function clog(u){
	return createVector(log(u.mag()),atan2(u.y,u.x))
}

function cadd(u,v){
	return createVector(u.x+v.x,u.y+v.y)
}
function csub(u,v){
	return createVector(u.x-v.x,u.y-v.y)
}

function ccmul(u,v){
	return createVector(u.x*v.x,u.y*v.y)
}

function cmul(u,v){
	return createVector(u.x*v.x-u.y*v.y,u.x*v.y+u.y*v.x)
}
function cdiv(u,v){
	return cmul(u,cinv(v))
}
function cpow(u,v){
	return cexp(cmul(clog(u),v))
}

function cUD(u){
	//map to unit disk
	r = u.mag()
	return cscal(u,(1-1/(r+1))/r)
}
function cBL(u){
	//special exp-log branch
	return createVector(exp(u.x),log(abs(u.y)+1)*(u.y<0 ? -1 : 1))
}

function cBE(u){
	//special exp-linear branch
	return createVector(exp(2*abs(u.x)-1)*2*u.x,4*u.y)
}

function cLI(u,v,t){
	return cadd(cmul(cadd(createVector(1,0),cscal(t,-1)),v),cmul(t,u))
}
function cCD(u,v,t){
	w = csub(v,u)
	m = w.mag()
	if (m){
		return cadd(u,cmul(t,cscal(w,1/m)))
	}
	return u
}

//Iteration Modes
function itLI() {
	z = cLI(G.pnt,G.attr,cUD(G.t))
}

function itCD() {
	z = cCD(G.pnt,G.attr,cBL(G.t))
}

function itEI(){
	angleMode(DEGREES)
	z=cLI(G.pnt,G.attr,cUD(cadd(G.attr,cpow(G.pnt,cscal(G.t,2)))))
	angleMode(RADIANS)
}

function itEIB(){
	angleMode(DEGREES)
	z = cLI(G.pit,G.attr,cUD(cadd(G.attr,cexp(cmul(createVector(0,G.pnt.mag()),cBE(G.t))))))
	angleMode(RADIANS)
}

function itMP(){
	return cscal(cadd(G.pnt,G.attr),0.5)
}

function itPF(){
	n=G.set.length
	c=G.polyCs[G.seti]
	zp=zPows(n)
	z=createVector(0,0)
	for (i=0;i<n;i++){
		z.add(cmul(c[i],zp[i]))
	}
}

function itPN(){
	n=G.set.length
	c=G.polyCs[G.seti]
	d=G.dpolyCs[G.seti]
	z=zPows(n)
	zp=zPows(n)
	pc=createVector(0,0)
	for (i=0;i<n;i++){
		pc.add(cmul(c[i],zp[i]))
	}
	if (n-1){
		pd=createVector(0,0)
		for (i=0;i<n-1;i++){
			pd.add(cmul(d[i],zp[i]))
		}
		z=csub(G.pnt,cdiv(pc,pd))
	}
}

function itUp() {
	G.pnt.x=z.x
	G.pnt.y=z.y
}

function iterate() {
	if(G.rech){
		if((G.pnt.dist(G.attr)<=G.ZEROR)||(G.itsr>G.ITCAP)){
			G.itsr=-1
			regen()
		}
		G.itsr++
	}
	z=createVector(0,0)
	G.pit=G.pnt.copy()
	switch (G.e){
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
		//Polynomial Function
			itPF()
		break
		case 3:
			itPN()
		break
		case 4:
			itEI()
		break
		case 5:
			itEIB()
		break
		default:
		//Midpoint
			itMP()
	}
	itUp()
}

function updPolyCs(){
	if (G.e==2||G.e==3){
		G.polyCs=[attrPolyCs(G.attrs[0])]
		for (let j=1;j<G.attrs.length;j++){
			G.polyCs.push(attrPolyCs(G.attrs[j]))
		}
	}
	if (G.e==3){
		G.dpolyCs=[dPolyC(G.polyCs[0])]
		for (let j=1;j<G.attrs.length;j++){
			G.dpolyCs.push(dPolyC(G.polyCs[j]))
		}
	}
}

function attrPolyCs(set){
	c=[]
	cd=createVector(1,0)
	for (n=0;n<set.length;n++){
		c.push(cd)
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

function dPolyC(pc){
	let dpc=[];
	for (i=0;i<pc.length-1;i++){
		c=pc[i+1]
		dpc.push(cscal(c,i+1))
	}
	return dpc
}

function zPows(n){
	xt = G.t.x
	yt = G.t.y
	r = sqrt(xt*xt+yt*yt)
	t = atan2(yt,xt)
	tx = xt+pow(r,xt)*exp(-yt*t)*cos(t*xt+yt*log(r))
	ty = yt+pow(r,xt)*exp(-yt*t)*sin(t*xt+yt*log(r))
	x=G.pnt.x*tx-G.pnt.y*ty
	y=G.pnt.y*tx+G.pnt.x*ty
	zp=[createVector(1,0)]
	if (n>0){
		zp.push(createVector(x,y))
	}
	xp=x*G.t.x-y*G.t.y
	yp=y*G.t.x+x*G.t.y
	for (i=2;i<n;i++){
		zp.push(createVector(xp*x-yp*y,xp*y+yp*x))
	}
	return zp
}

function mout(x,y,a){
	//Change variable point
	z=cmul(createVector(x-G.x,y-G.y),G.rot)
	switch(G.mfix){
		case 1:
			G.colx=(x-G.x)/G.scal
			G.coly=-(y-G.y)/G.scal
		break
		case 2:
			G.pnt.x=(x-G.x)/G.scal
			G.pnt.y=-(y-G.y)/G.scal
		break
		case 3:
			if (a==1){
				G.trk.x=x/G.scal
				G.trk.y=-y/G.scal
			}
			else{
				G.pnt.x+=(x-G.x)/G.scal
				G.pnt.y+=-(y-G.y)/G.scal
			}
		break
		case 4:
			G.regen=(1+(x-G.x)/G.scal)/2
			G.prob=(1+-(y-G.y)/G.scal)/2
		break
		case 5:
			G.epnt.x=(z.x)/G.scal
			G.epnt.y=-(z.y)/G.scal
		break
		case 6:
			G.rot.x=(x-G.x)/G.scal
			G.rot.y=-(y-G.y)/G.scal
		break
		default:
			G.t.x=(x-G.x)/G.scal
			G.t.y=-(y-G.y)/G.scal
	}
} 

function mget(){
	//Get point data to vary
	let x=0.0
	let y=0.0
	switch(G.mfix){
		case 1:
			x=G.colx*G.scal+G.x
			y=G.coly*-G.scal+G.y
		break
		case 2:
			x=G.pnt.x*G.scal+G.x
			y=G.pnt.y*-G.scal+G.y
		break
		case 3:
			x=G.trk.x
			y=G.trk.y
		break
		case 4:
			x=(G.regen*2-1)*G.scal+G.x
			y=-(G.prob*-2+1)*G.scal+G.y
		break
		case 5:
			x=G.epnt.x*G.scal+G.x
			y=G.epnt.y*-G.scal+G.y
		break
		case 6:
			x=G.rot.x*G.scal+G.x
			y=G.rot.y*-G.scal+G.y
		break
		default:
			x=G.t.x*G.scal+G.x
			y=G.t.y*-G.scal+G.y
	}
	return createVector(x,y)
}

function draw() {
	//Main Draw loop
	background(0)
	translate(G.x,G.y)
	let tepnt=G.attrs[G.addr]
	G.epnt=tepnt[tepnt.length-1]
	if (G.edit) {
		//Edit mode
		len = G.attrs.length
		brk = []
		brek = 1
		for (let i=0;i<len;i++) {
			attrs = G.attrs[i]
			len2 = attrs.length
			for (let k=0;k<len2;k++) {
				attr = attrs[k]
				brek = 1
				if(mouseIsPressed){
					tempos = cdiv(createVector(mouseX-G.x,-mouseY+G.y).div(G.scal),G.rot)
					if (G.scal*tempos.dist(attr)<G.rad) {
						if (attrs.length>1){ 
								brk.push([i,k])
								brek = 0
						}
					}
				}
				if(brek){
					fill(360*i/len,360,360)
					ren=cmul(attr,G.rot)
					ellipse(ren.x*G.scal,-ren.y*G.scal,G.rad,G.rad)
				}
			}
		}
		for (let i = 0; i<brk.length;i++){
		G.attrs[brk[i][0]].splice(brk[i][1],1)
		}
	}
	else { 
		//Render mode
		for (let i = 0;i<G.REPS/(G.mem+(G.mem==0));i++){
			if(random()>G.regen){
				regen()
			}
			G.ph = G.pnt.copy()
			ph = G.pnt.copy()
			if(mouseIsPressed){
				mout(mouseX,mouseY,0)
			}
			G.pnt.add(G.trk) 
			if(G.ren){
			for(let m=0;m<(G.mem+(G.mem==0));m++){
			if (random(1)>G.prob){
				if((G.excl!=0) && G.attrs.length>1){
					let _set = []
					ind = G.attrs.length
					for (let k=0;k<G.attrs.length;k++){
						a=G.attrs[k]
						if(a==G.set){
						ind = k
						}
					}
					for (let k=0;k<G.attrs.length;k++){
						a=G.attrs[k]
						if(k!=(ind+G.excl-1)%(G.attrs.length+G.errl+(G.excl==1))){
							_set.push(G.attrs[k])
						}
					}
					G.seti = floor(random(0,_set.length))
					G.set = _set[G.seti]
				}
				else{
					G.seti = floor(random(0,G.attrs.length))
					G.set = G.attrs[G.seti]
				}
			}
			if((G.excn!=0) && G.set.length>1){
				let _set = []
				ind = G.set.length
				for (let k=0;k<G.set.length;k++){
					a=G.set[k]
					if(a==G.attr){
					ind = k
					}
				}
				for (let k=0;k<G.set.length;k++){
					a=G.set[k]
					if(k!=(ind+G.excn-1)%(G.set.length+G.errn+(G.excn==1))){
					_set.push(G.set[k])
					}
				}
				G.attr = random(_set)
			}
			else{
				G.attr = random(G.set)
			}
			iterate()
		    }
			if(G.mem==0){
				ph=G.pnt.copy()
			}
			G.ph=G.pnt.copy()
			let cp=G.pnt.copy().sub(createVector(G.colx,G.coly))
			let cph=ph.sub(createVector(G.colx,G.coly))
			switch(G.col){
				//Choose colour
				case 1:
					h = degrees(cph.heading())
					if (h<0){
						h+=360
					}
					G.graph.fill(h,360,360)
					break
				case 2:
					h = 180*cph.mag()
					if (h<0){
						h+=360
					}
					if (h>360){
						h-=360
					}
					G.graph.fill(h,360,360)
					break
				case 3:
					h = degrees(cp.heading()-cph.heading())
					if (h<0){
						h+=360
					}
					G.graph.fill(h,360,360)
					break
				case 4:
					h = 180*(cp.mag()-cph.mag())
					if (h<0){
						h+=360
					}
					if (h>360){
						h-=360
					}
					G.graph.fill(h,360,360)
					break
				default:
					G.graph.fill(360)
				}
				if(G.noren){
					G.noren--
				}
				else{
					ren = cmul(G.pnt,G.rot)
					G.graph.ellipse(ren.x*G.scal+G.x,-ren.y*G.scal+G.y,G.DR,G.DR)
				}
			}
		}
		image(G.graph,-G.x,-G.y,width,height)
	}
}

function regen() {
	//Reset iterated point to a random value
	G.pnt.x = 2*random()-1
	G.pnt.y = 2*random()-1
	G.noren=G.NORENS
}

function keyPressed() {
	//Event for handling keypresses
	print(keyCode)
	if (keyCode==32){
		//space
		G.edit = !G.edit
		regen()
		G.graph.clear()
	}
	let l=mget()
	if (keyCode==87){
		//w
		mout(l.x,l.y-G.scal/20,1)
	}
	if (keyCode==65){
		//a
		mout(l.x-G.scal/20,l.y,1)
	}
	if (keyCode==83){
		//s
		mout(l.x,l.y+G.scal/20,1)
	}
	if (keyCode==68){
		//d
		mout(l.x+G.scal/20,l.y,1)
	}
	if (keyCode==192){
		//`
		G.mfix=(G.mfix+1)%G.MMFIX
	}
	if (keyCode==49){
		//1
		G.mfix=0
	}
	if (keyCode==50){
		//2
		G.mfix=1
	}
	if (keyCode==51){
		//3
		G.mfix=2
	}
	if (keyCode==52){
		//4
		G.mfix=3
	}
	if (keyCode==53){
		//5
		G.mfix=4
	}
	if (keyCode==54){
		//6
		G.mfix=5
	}
	if (keyCode==55){
		//7
		G.mfix=6
	}
	if (keyCode==16){
		//shift
		G.shift=!G.shift
	}
	if (G.edit){
		switch (keyCode){
			case 37:
			//left
			if (G.addr){
				G.addr--
			}
			break
			case 38:
			//up
			G.attrs.push([createVector(0,0)])
			break
			case 39:
			//right
			if (G.addr<G.attrs.length-1){
				G.addr++
			}
			break
			case 40:
			//down
			if (G.attrs.length>1){
				G.attrs.pop()
				if (G.addr>=G.attrs.length){
					G.addr=G.attrs.length-1
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
			G.graph.clear()
			
		}
		if (keyCode==13){
			//enter
			customSave()
		}
		if (keyCode==81){
			//q
			G.ren=!G.ren
		}
		if (keyCode==66){
			//b
			G.col++
			if(G.col>=5){
			G.col=0
			}
			G.graph.clear()
		}
		if (keyCode==69){
			//e
			G.e=(G.e+1)%G.ME
		}
		if (keyCode==72){
			//h
			for (let i=0;i<G.attrs.length;i++){
				G.attrs[i]=shuffle(G.attrs[i])
			}
		}
		if (keyCode==75){
			//k
			G.attrs = shuffle(G.attrs)
		}
		if (keyCode==78){
			//n
			if(G.shift){
				G.errn=!G.errn
			}
			else{
				G.excn=(G.excn+1)%(G.set.length+2)
			}
		}
		if (keyCode==77){
			//m
			if(G.shift){
				G.errl=!G.errl
			}
			else{
				G.excl=(G.excl+1)%(G.attrs.length+2)
			}
		}
		if (keyCode==85){
			//u
			G.rech=!G.rech
		}
		if (keyCode==188&&G.mem){
			//<,
			G.mem--
		}
		if (keyCode==190){
			//>.
			G.mem++
		}
	}
	updPolyCs()
}

function mouseClicked(){
	//Separate event for alt clicking in edit mode
	if (keyCode==18 && keyIsPressed && G.edit){
		G.attrs[G.addr].push(cdiv(createVector(mouseX-G.x,G.y-mouseY).div(G.scal),G.rot))
		updPolyCs()
	}
}

function cprint(u){
	return '{'+u.x+','+u.y+'}'
}

function customSave(){
	let savStr="CIT ["
	savStr+=[G.e,cprint(G.t),cprint(G.rot),G.col,G.mem,G.rech]+','
	savStr+=[G.shift,(G.shift) ? cprint(createVector(G.excn,G.excl)) : cprint(createVector(G.errn,G.errl))]
	saveCanvas(savStr+"].png")
}

//Hall of old functions

//function itEI(){
	//x0 = G.t.x*2
	//y0 = G.t.y*2
	//x1 = G.attr.x
	//y1 = G.attr.y
	//x2 = G.pnt.x
	//y2 = G.pnt.y
	//r = sqrt(x2*x2+y2*y2)
	//t = atan2(y2,x2)
	//x = x1+pow(r,x0)*exp(-y0*t)*cos(t*x0+y0*log(r))
	//y = y1+pow(r,x0)*exp(-y0*t)*sin(t*x0+y0*log(r))
//}

//function itPD(){
//	n=G.set.length
//	d=G.dpolyCs[G.seti]
//	z=zPows(n)
//	zx=z[0].x
//	zy=z[0].y
//	if (n-1){
//		dx=d[0].x
//		dy=d[0].y
//		p=createVector(dx*zx-dy*zy,dx*zy+dy*zx)
//		for (i=1;i<n-1;i++){
//			dx=d[i].x
//			dy=d[i].y
//			zx=z[i].x
//			zy=z[i].y
//			p.add(createVector(dx*zx-dy*zy,dx*zy+dy*zx))
//		}
//		x=p.x
//		y=p.y
//	}
//	else{
//		x=G.pnt.x
//		y=G.pnt.y
//	}
//}