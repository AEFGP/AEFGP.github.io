let G = {} //cross-canvas global container

function setup() {
	//Stuff you can change
	G.t = createVector(1,0) //Iteration complex parameter's initial value
	G.pro = createVector(1,0.5) //Probabilities of regen and layer reselection
	G.rro = createVector(1,0) //Render Rotation
	G.ror = createVector(0,0) //Render Origin
	G.cro = createVector(1,0) //Colour Rotation
	G.cor = createVector(0,0) //Colour Origin

	G.mode = 0 // iteration mode
	G.col=1 // colour mode
	G.mem=1 // colour memory
	G.rech=1  // regen check
	G.shift=0 // exclusion mode shift toggle
	G.excn=0 // node exclusion
	G.excl=0 // layer exclusion
	G.errn=0 // classic node exclusion
	G.errl=0 // classic layer exclusion

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
	G.ITCAP = 20000 //Number of iterations until regen
	G.NORENS= 3 //Number of points that are not rendered after each regen

	G.IRML = 4 //Max number of layers in the I randomiser
	G.IRMN = 6 //Max number of nodes in any layer in the I randomiser
	G.IRMIN = 1 //Minimum number of excess (>1) nodes across all layers in the I randomiser

	G.RADI = 10 //Size of attractor nodes
	G.DR = 0.25 //Size of iterated point stamps
	G.gres = 1 //Graphics Resolution Multiplier

	G.AUTOM = 3 //Number of recharges for automatic randomisation
	G.auto=0 // automatic randomisation
	G.autor=1 // automatically clear render
	G.edit=0 // edit/render toggle

	G.INRAN=1 // radomise on input
	G.INREF=1 // clear render on input

	//Stuff you shouldn't change
	G.CR = 1
	createCanvas(windowWidth*G.CR,windowHeight*G.CR)
	G.graph=createGraphics(width*G.gres,height*G.gres)
	G.graph.colorMode(HSB,360)
	G.graph.background(0)
	G.graph.noStroke()
	colorMode(HSB,360)
	background(0)
	angleMode(RADIANS)
	smallestAspect = min(width,height)/(1080*G.CR)
	G.SCALI = 360
	G.RSPAN = 1.85 //Upper bound of magnitude of random vectors
	G.scal = G.SCALI*smallestAspect
	G.rad = G.RADI*smallestAspect
	G.x = width/2
	G.y = height/2
	G.MMODE = 14 // max iteration modes
	G.MMFIX = 9 // max number of mouse fix modes
	//Initialisation
	G.MCOL = 5 // max colour variations
	G.pnt = createVector(0,0)
	G.pit = createVector(0,0)
	G.trk = createVector(0,0)
	G.mfix=0 // mouse fix mode
	G.set=G.attrs[0]
	G.seti=0 // selected layer index
	G.addr=0 // selected node in layer
	G.ren=1 // render loop toggle
	G.itsr=0  // iterations since regen
	G.noren=0  // iterations to not render
	G.autoi=0 // iterations for randomisation
}

function windowResized() {
	//Event for when window is resized
	resizeCanvas(windowWidth*G.CR,windowHeight*G.CR)
	G.graph=createGraphics(width*G.gres,height*G.gres)
	G.graph.colorMode(HSB,360)
	G.graph.background(0)
	G.graph.noStroke()
	smallestAspect = min(width,height)/(1080*G.CR)
	G.scal = G.SCALI*smallestAspect
	G.rad = G.RADI*smallestAspect
	G.x = width/2
	G.y = height/2
}

function iran(){
	enodes=G.IRMIN
	layers=floor(random(G.IRML)+1)
	let attrs=[]
	for (let i=layers-1;i>=0;i--){
		let _set=[]
		let nodes=floor(random(G.IRMIN,G.IRMN)+1)
		if (nodes>1&&enodes>0){
			enodes-nodes+1
			if (enodes<0){
				enodes=0
			}
		}
		if (i==0){
			nodes+=enodes
		}
		for (let j=0;j<nodes;j++){
			let node=p5.Vector.random2D()
			node.setMag(random(G.RSPAN))
			_set.push(node)
		}
		attrs.push(_set)
	}
	G.attrs=attrs
	if (G.seti>=G.attrs.length){
		G.seti=G.attrs.length-1
		G.set=G.attrs[G.seti]
	}
	if (G.addr>=G.attrs.length){
		G.addr=G.attrs.length-1
	}
	if (G.excn>=G.set.length+2){
		G.excn=G.set.length+1
	}
	if (G.excl>=G.attrs.length+2){
		G.excl=G.attrs.length+1
	}
}

function oran(){
	//Randomise options
	G.t=p5.Vector.random2D()
	G.t.setMag(random(G.RSPAN))
	G.shift=round(random())
	G.errl=round(random(1+(1-G.shift)*G.attrs.length))
	G.errn=round(random(1+(1-G.shift)*G.set.length))
	G.excn=floor(random(G.set.length+2))
	G.excl=floor(random(G.attrs.length+2))
	//G.mode=floor(random(G.MMODE))
}

function pran(){
	//Randomise points
	for (let i=0;i<G.attrs.length;i++){
		_set=G.attrs[i]
		for (let j=0;j<_set.length;j++){
			_set[j]=p5.Vector.random2D()
			_set[j].setMag(random(G.RSPAN))
		}
	}
}

function cran(){
	//Randomise colours
	G.col=floor(random(G.MCOL-1)+1)
	G.cor=p5.Vector.random2D()
	G.cor.setMag(random(G.RSPAN))
	G.cro=p5.Vector.random2D()
	G.cro.setMag(random(G.RSPAN))
}

function vran(){
	//Randomise render vectors
	G.ror=p5.Vector.random2D()
	G.ror.setMag(random(G.RSPAN))
	G.rro=p5.Vector.random2D()
	G.rro.setMag(random(G.RSPAN))
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
	z= cLI(G.pnt,G.attr,cUD(cadd(G.attr,cpow(G.pnt,cscal(G.t,2)))))
}

function itEIB(){
	z = cLI(G.pit,G.attr,cUD(cadd(G.attr,cexp(cmul(createVector(0,G.pnt.mag()),cBE(G.t))))))
}

function itMP(){
	return cscal(cadd(G.pnt,G.attr),0.5)
}

function itPF(){
	c=G.polyCs[G.seti]
	n=c.length
	zp=zPows(n)
	z=createVector(0,0)
	for (i=0;i<n;i++){
		z.add(cmul(c[i],zp[i]))
	}
}

function itPD(){
	d=G.dpolyCs[G.seti]
	n=d.length
	zp=zPows(n)
	z=createVector(0,0)
	for (i=0;i<n;i++){
		z.add(cmul(d[i],zp[i]))
	}
}

function itPN(){
	c=G.polyCs[G.seti]
	d=G.dpolyCs[G.seti]
	n=c.length
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
		z=csub(cmul(G.pnt,G.t),cdiv(pc,pd))
	}
}

function itPFB(){
	c=G.polyCs[G.seti]
	n=c.length
	zp=zPowsB(n)
	z=createVector(0,0)
	for (i=0;i<n;i++){
		z.add(cmul(c[i],zp[i]))
	}
}

function itPNB(){
	c=G.polyCs[G.seti]
	d=G.dpolyCs[G.seti]
	n=c.length
	zp=zPowsB(n)
	pc=createVector(0,0)
	for (i=0;i<n;i++){
		pc.add(cmul(c[i],zp[i]))
	}
	if (n-1){
		pd=createVector(0,0)
		for (i=0;i<n-1;i++){
			pd.add(cmul(d[i],zp[i]))
		}
		z=csub(cmul(G.pnt,G.t),cdiv(pc,pd))
	}
}

function itPFBB(){
	c=G.polyCs[G.seti]
	n=c.length
	zp=zPowsBB(n)
	cx=c[0].x
	cy=c[0].y
	zx=zp[0].x
	zy=zp[0].y
	p=createVector(cx*zx-cy*zy,cx*zy+cy*zx)
	for (i=1;i<n;i++){
		cx=c[i].x
		cy=c[i].y
		zx=zp[i].x
		zy=zp[i].y
		p.add(createVector(cx*zx-cy*zy,cx*zy+cy*zx))
	}
	G.pnt=cmul(p,G.t)
	x1 = G.attr.x
	y1 = G.attr.y
	x2 = G.pnt.x
	y2 = G.pnt.y
	z = createVector((x1+x2)/2,(y1+y2)/2)
}

function itEI(){
	x0 = G.t.x*2
	y0 = G.t.y*2
	x1 = G.attr.x
	y1 = G.attr.y
	x2 = G.pnt.x
	y2 = G.pnt.y
	r = sqrt(x2*x2+y2*y2)
	t = atan2(y2,x2)
	x = x1+pow(r,x0)*exp(-y0*t)*cos(t*x0+y0*log(r))
	y = y1+pow(r,x0)*exp(-y0*t)*sin(t*x0+y0*log(r))
	z=createVector(x,y)
}

function itEItoCD(){
	x4 = G.t.x*2
	y4 = G.t.y*2
	x5 = G.attr.x
	y5 = G.attr.y
	x2 = G.pnt.x
	y2 = G.pnt.y
	r2 = sqrt(x2*x2+y2*y2)
	t = atan2(y2,x2)
	x6 = x5+pow(r2,x4)*exp(-y4*t)*cos(t*x4+y4*log(r2))
	y6 = y5+pow(r2,x4)*exp(-y4*t)*sin(t*x4+y4*log(r2))
	x0 = exp(x6)
	y0 = log(abs(y6)+1)*(y6<0 ? -1 : 1)
	x0 = exp(x6)
	y0 = log(abs(y6)+1)*(y6<0 ? -1 : 1)
	x1 = G.attr.x-G.pnt.x
	y1 = G.attr.y-G.pnt.y
	x2 = G.pnt.x
	y2 = G.pnt.y
	r = sqrt(x1*x1+y1*y1)
	x3 = x2+(x0*x1-y0*y1)/r
	y3 = y2+(x0*y1+x1*y0)/r
	z=createVector(x3,y3)
}

function itUp() {
	G.pnt.x=z.x
	G.pnt.y=z.y
}

function iterate() {
	if(G.rech){
		if(G.itsr>G.ITCAP){
			G.itsr=-1
			regen()
			if(G.auto){
				G.autoi++
				if(G.autoi>=G.AUTOM){
					G.autoi=0
					oran()
					pran()
					cran()
					vran()
					if(G.autor){
						G.graph.clear()
						G.graph.background(0)
					}
				}
			}
		}
		G.itsr++
	}
	z=createVector(0,0)
	G.pit=G.pnt.copy()
	switch (G.mode){
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
			itEI()
		break
		case 3:
			itEIB()
		break
		case 4:
			//Polynomial Function
			itPF()
		break
		case 5:
			//Polynomial Derivative
			itPD()
		break
		case 6:
			//Polynomial Newton's Method
			itPN()
		break
		case 7:
		//Polynomial Function (broken z)
			itPFB()
		break
		case 8:
		//Polynomial Newton's Method (broken z)
			itPNB()
		break
		case 9:
		//Polynomial Function (broken z + broken poly)
			itPFB()
		break
		case 10:
		//Polynomial Newton's Method (broken z + broken poly)
			itPNB()
		break
		case 11:
		//Polynomial Function (broken broken z + broken broken poly + broken function)
			itPFBB()
		break
		case 12:
		//Broken old exponential to constant distance
			itEItoCD()
		break
		case 13:
		//Old exponential
			itEI()
		break
		default:
		//Midpoint
			itMP()
	}
	itUp()
}

function updPolyCs(){
	if (G.mode>=4&&G.mode<=8){
		G.polyCs=[attrPolyCs(G.attrs[0])]
		for (let j=1;j<G.attrs.length;j++){
			G.polyCs.push(attrPolyCs(G.attrs[j]))
		}
	}
	else if (G.mode==9||G.mode==10){
		G.polyCs=[attrPolyCsB(G.attrs[0])]
		for (let j=1;j<G.attrs.length;j++){
			G.polyCs.push(attrPolyCsB(G.attrs[j]))
		}
	}
	if (G.mode==11){
		G.polyCs=[attrPolyCsBB(G.attrs[0])]
		for (j=1;j<G.attrs.length;j++){
			G.polyCs.push(attrPolyCsBB(G.attrs[j]))
		}
	}
	if (G.mode==5||G.mode==6||G.mode==8||G.mode==10){
		G.dpolyCs=[dPolyC(G.polyCs[0])]
		for (let j=1;j<G.attrs.length;j++){
			G.dpolyCs.push(dPolyC(G.polyCs[j]))
		}
	}
}

function attrPolyCs(set){
	cp=[createVector(1,0)]
	for (n=0;n<set.length;n++){
		cp.push(cp[n])
		r=cscal(set[n],-1)
		for (j=1;j<n;j++){
			cp[n-j]=cadd(cp[n-j-1],cmul(r,cp[n-j]))
		}
		cp[0]=cmul(r,cp[0])
	}
	return cp
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
	z=G.pnt // cmul(G.t,G.pnt)
	zp=[G.t]
	for (let i=1;i<n;i++){
		zp.push(cmul(zp[i-1],z))
	}
	return zp
}

function attrPolyCsB(set){
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

function zPowsB(n){
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

function zPowsBB(n){
	x=G.pnt.x
	y=G.pnt.y
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

function attrPolyCsBB(set){
	c=[createVector(G.t.x,G.t.y)]
	for (n=0;n<set.length;n++){
		c.push(createVector(0,0))
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

function shuffleNodes(){
	for (let i=0;i<G.attrs.length;i++){
		G.attrs[i]=shuffle(G.attrs[i])
	}
}

function shuffleLayers(){
	G.attrs = shuffle(G.attrs)
}

function mout(x,y,a){
	//Change variable point
	z=cmul(createVector(x-G.x,y-G.y),G.rro)
	switch(G.mfix){
		case 1:
			G.pnt.x=(x-G.x)/G.scal
			G.pnt.y=-(y-G.y)/G.scal
		break
		case 2:
			if (a==1){
				G.trk.x=x/G.scal
				G.trk.y=-y/G.scal
			}
			else{
				G.pnt.x+=(x-G.x)/G.scal
				G.pnt.y+=-(y-G.y)/G.scal
			}
		break
		case 3:
			G.qnt.x=(z.x)/G.scal
			G.qnt.y=-(z.y)/G.scal
		break
		case 4:
			G.pro.x=(1+(x-G.x)/G.scal)/2
			G.pro.y=(1+-(y-G.y)/G.scal)/2
		break
		case 5:
			G.ror.x=(x-G.x)/G.scal
			G.ror.y=-(y-G.y)/G.scal
		break
		case 6:
			G.rro.x=(x-G.x)/G.scal
			G.rro.y=-(y-G.y)/G.scal
		break
		case 7:
			G.cor.x=(x-G.x)/G.scal
			G.cor.y=-(y-G.y)/G.scal
		break
		case 8:
			G.cro.x=(x-G.x)/G.scal
			G.cro.y=-(y-G.y)/G.scal
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
			x=G.pnt.x*G.scal+G.x
			y=G.pnt.y*-G.scal+G.y
		break
		case 2:
			x=G.trk.x
			y=G.trk.y
		break
		case 3:
			x=G.qnt.x*G.scal+G.x
			y=G.qnt.y*-G.scal+G.y
			
		break
		case 4:
			x=(G.pro.x*2-1)*G.scal+G.x
			y=-(G.pro.y*-2+1)*G.scal+G.y
		break
		case 5:
			x=G.ror.x*G.scal+G.x
			y=G.ror.y*-G.scal+G.y
		break
		case 6:
			x=G.rro.x*G.scal+G.x
			y=G.rro.y*-G.scal+G.y
		break
		case 7:
			x=G.cor.x*G.scal+G.x
			y=G.cor.y*-G.scal+G.y
		break
		case 8:
			x=G.cro.x*G.scal+G.x
			y=G.cro.y*-G.scal+G.y
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
	G.qnt=tepnt[tepnt.length-1]
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
					tempos = cdiv(csub(createVector(mouseX-G.x,-mouseY+G.y).div(G.scal),G.ror),G.rro)
					if (G.scal*tempos.dist(attr)<G.rad) {
						if (attrs.length>1){ 
								brk.push([i,k])
								brek = 0
						}
					}
				}
				if(brek){
					fill(360*i/len,360,360)
					ren=cadd(cmul(attr,G.rro),G.ror)
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
			if(random()>G.pro.x){
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
			if (random(1)>G.pro.y){
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
			let cp=cdiv(G.pnt.copy().sub(createVector(G.cor.x,G.cor.y)),G.cro)
			let cph=cdiv(ph.sub(createVector(G.cor.x,G.cor.y)),G.cro)
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
					ren = cadd(cmul(G.pnt,G.rro),G.ror)
					G.graph.ellipse((ren.x*G.scal+G.x)*G.gres,(-ren.y*G.scal+G.y)*G.gres,G.DR,G.DR)
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
		G.INRAN = 0
		G.INREF = 0
		G.edit = !G.edit
		G.graph.clear()
		G.graph.background(0)
		regen()
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
	if (keyCode==56){
		//8
		G.mfix=7
	}
	if (keyCode==57){
		//9
		G.mfix=8
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
				updPolyCs()
			}
			break
			default:
		}
	}
	else{
		if (keyCode==13){
			//enter
			customSave()
		}
		if (keyCode==40){
			//down
			if (G.INREF){
				cDump()
				customSave()
			}
		}
		if (keyCode==66){
			//b
			G.col=(G.col+1)%G.MCOL
		}
		if (keyCode==67){
			//c
			cran()
		}
		if (keyCode==69){
			//e
			G.mode=(G.mode+1)%G.MMODE
		}
		if (keyCode==72){
			//h
			shuffleNodes()
		}
		if (keyCode==73){
			//i
			iran()
		}
		if (keyCode==75){
			//k
			shuffleLayers()
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
		if (keyCode==78){
			//n
			if(G.shift){
				G.errn=!G.errn
			}
			else{
				G.excn=(G.excn+1)%(G.set.length+2)
			}
		}
		if (keyCode==79){
			//o
			oran()
		}
		if (keyCode==80){
			//o
			pran()
		}
		if (keyCode==81){
			//q
			G.ren=!G.ren
		}
		if (keyCode==82){
			//r
			regen()
			G.graph.clear()
			G.graph.background(0)
			
		}
		if (keyCode==85){
			//u
			G.rech=!G.rech
		}
		if (keyCode==86){
			vran()
		}
		if (keyCode==186){
			//:;
			if(G.gres>1){
				G.gres--
				windowResized()
			}
		}
		if (keyCode==188&&G.mem){
			//<,
			G.mem--
		}
		if (keyCode==190){
			//>.
			G.mem++
		}
		if (keyCode==191){
			//?/
			cDump()
		}
		if (keyCode==222){
			//"'
			G.gres++
			windowResized()
		}		
	}
	updPolyCs()
	if (G.auto){
		G.auto=0
	}
	if (G.INRAN){
		oran()
		pran()
		cran()
		vran()
	}
	if (G.INREF){
		G.graph.clear()
		G.graph.background(0)
	}
}

function mouseClicked(){
	//Separate event for alt clicking in edit mode
	if (keyCode==18 && keyIsPressed && G.edit){
		G.attrs[G.addr].push(cdiv(csub(createVector(mouseX-G.x,G.y-mouseY).div(G.scal),G.ror),G.rro))
		updPolyCs()
	}
}

function cprint(u){
	return '{'+u.x+','+u.y+'}'
}

function ctprint(u){
	return '{'+floor(100*u.x)/100+','+floor(100*u.y)/100+'}'
}

function customSave(){
	let savStr="CIT ["
	savStr+=[G.mode,'{'+floor(10000*G.t.x)/10000+','+floor(10000*G.t.y)/10000+'}']+','
	savStr+=[G.shift,(G.shift) ? cprint(createVector(G.excn,G.excl)) : cprint(createVector(G.errn,G.errl))]
	savStr+=','+[G.col,G.mem,ctprint(G.cro),ctprint(G.cor),ctprint(G.rro),ctprint(G.ror),ctprint(G.pro)]
	savStr+=','+[cprint(createVector(width,height)),G.gres,G.DR]
	save(G.graph,savStr+"].png")
}

function cDump(){
	console.log("	Render Settings:")
	console.log("Resolution",cprint(createVector(width,height)))
	console.log("Resolution Multiplier",G.gres)
	console.log("Point Radius",G.DR)
	console.log("Repetitions",G.REPS)
	console.log("Iteration Cap",G.ITCAP)
	console.log("Ignored Iterations",G.NORENS)
	console.log("Regen Check",G.rech)
	console.log("Colour Memory",G.mem)
	console.log("Colour Mode",G.col)
	console.log("Colour Rotation",cprint(G.cro))
	console.log("Colour Offset",cprint(G.cor))
	console.log("Probabilities",cprint(G.pro))
	console.log("Render Rotation",cprint(G.rro))
	console.log("Render Offset",cprint(G.ror))
	console.log("	Shape Settings:")
	console.log("Iteration Mode",G.mode)
	console.log("Complex Parameter",cprint(G.t))
	console.log("Classic Exclusion",G.shift)
	console.log("Node/Layer Exclusion",(G.shift) ? cprint(createVector(G.excn,G.excl)) : cprint(createVector(G.errn,G.errl)))
	console.log("Layers",G.attrs.length)
	for (let i=0;i<G.attrs.length;i++){
		console.log("	Layer",i,"Nodes",G.attrs[i].length)
		for (let j=0;j<G.attrs[i].length;j++){
			console.log("		",j,cprint(G.attrs[i][j]))
		}
	}
}

//Hall of old functions

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
