const c=document.getElementById("puzzle"),x=c.getContext("2d")
c.width=innerWidth;c.height=innerHeight

const COLS=25,ROWS=20,SNAP=25
let W,H,scale=.7,panX=0,panY=0

const pieces=[],grid=new Map()
let active=null,ox=0,oy=0

let explode=true,et=0,ev=[]
const HIGHLIGHT="rgba(255,220,120,.35)"

const img=new Image()
img.src="image.jpg"

class P{
constructor(i,j){
this.i=i;this.j=j
this.cx=i*W;this.cy=j*H
this.x=0;this.y=0
this.r=0
this.g={p:[this]}
grid.set(i+","+j,this)
}}

img.onload=()=>{

W=img.width/COLS
H=img.height/ROWS

for(let j=0;j<ROWS;j++)
for(let i=0;i<COLS;i++)
pieces.push(new P(i,j))

explodeStart()
load()

requestAnimationFrame(loop)

}

function explodeStart(){

const cx=c.width/2,cy=c.height/2

pieces.forEach(p=>{
p.x=cx;p.y=cy
const a=Math.random()*Math.PI*2
const s=300+Math.random()*600
ev.push({p,vx:Math.cos(a)*s,vy:Math.sin(a)*s})
})

}

function nearSnap(p1){

for(const d of[[1,0],[-1,0],[0,1],[0,-1]]){

const p2=grid.get((p1.i+d[0])+","+(p1.j+d[1]))
if(!p2||p1.g===p2.g)continue

const dx=p2.cx-p1.cx,dy=p2.cy-p1.cy
const ax=(p2.x-p1.x)-dx,ay=(p2.y-p1.y)-dy

if(Math.abs(ax)<SNAP&&Math.abs(ay)<SNAP)return true

}}

function draw(p){

x.save()
x.translate(p.x,p.y)
x.rotate(p.r)

x.shadowColor="rgba(0,0,0,.35)"
x.shadowBlur=10
x.shadowOffsetX=4
x.shadowOffsetY=4

x.drawImage(img,p.cx,p.cy,W,H,0,0,W,H)

x.strokeStyle="rgba(0,0,0,.2)"
x.strokeRect(0,0,W,H)

if(nearSnap(p)){
x.fillStyle=HIGHLIGHT
x.fillRect(0,0,W,H)
}

x.restore()

}

let last=0
function loop(t=0){

const dt=(t-last)/1000;last=t

if(explode){

et+=dt

ev.forEach(e=>{
const k=1-Math.pow(1-et/1.2,3)
e.p.x+=e.vx*dt*k
e.p.y+=e.vy*dt*k
})

if(et>1.2){explode=false;ev=[]}

}

x.setTransform(scale,0,0,scale,panX,panY)

x.clearRect(-panX/scale,-panY/scale,c.width/scale,c.height/scale)

x.fillStyle="rgba(255,255,255,.04)"
x.fillRect(-500,-500,250,4000)

pieces.forEach(draw)

requestAnimationFrame(loop)

}

function pos(e){
if(e.touches)e=e.touches[0]
return{x:(e.clientX-panX)/scale,y:(e.clientY-panY)/scale}
}

function hit(px,py){
for(let i=pieces.length-1;i>=0;i--){
const p=pieces[i]
if(px>p.x&&px<p.x+W&&py>p.y&&py<p.y+H)return p
}}

function start(e){

const p=pos(e),h=hit(p.x,p.y)

if(h){active=h.g;ox=p.x-h.x;oy=p.y-h.y}
else{active="pan";ox=e.clientX-panX;oy=e.clientY-panY}

}

function move(e){

if(!active)return

if(active==="pan"){
panX=e.clientX-ox
panY=e.clientY-oy
return
}

const p=pos(e),lead=active.p[0]

const dx=p.x-ox-lead.x
const dy=p.y-oy-lead.y

active.p.forEach(k=>{k.x+=dx;k.y+=dy})

}

function end(){

if(active&&active!=="pan"){snap(active);save()}
active=null

}

function snap(g){

g.p.forEach(p1=>{

[[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>{

const p2=grid.get((p1.i+d[0])+","+(p1.j+d[1]))
if(!p2||p1.g===p2.g)return

const dx=p2.cx-p1.cx,dy=p2.cy-p1.cy
const ax=(p2.x-p1.x)-dx,ay=(p2.y-p1.y)-dy

if(Math.abs(ax)<SNAP&&Math.abs(ay)<SNAP){

p2.g.p.forEach(p=>{p.x-=ax;p.y-=ay})
merge(p1.g,p2.g)

}

})

})

}

function merge(a,b){
b.p.forEach(p=>{p.g=a;a.p.push(p)})
}

function save(){
localStorage.setItem("pz",
JSON.stringify(pieces.map(p=>[p.x,p.y,p.r])))
}

function load(){

const d=localStorage.getItem("pz")
if(!d)return

JSON.parse(d).forEach((v,i)=>{
pieces[i].x=v[0]
pieces[i].y=v[1]
pieces[i].r=v[2]
})

}

c.onmousedown=start
c.onmousemove=move
c.onmouseup=end

c.ontouchstart=start
c.ontouchmove=move
c.ontouchend=end

c.onwheel=e=>{
scale+=e.deltaY*-0.001
scale=Math.min(Math.max(.3,scale),3)
}

c.ondblclick=e=>{
const p=pos(e),h=hit(p.x,p.y)
if(h)h.r+=Math.PI/2
}