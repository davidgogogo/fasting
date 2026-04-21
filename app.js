const GOAL = 16;
const FATBURN = 12;
const CIRC = 597;

let start = localStorage.getItem("fastStart");
let dark = localStorage.getItem("dark") === "1";

if(dark) document.body.classList.add("dark");

function save(key,val){
localStorage.setItem(key,val);
}

function startFast(){
if(start) return;
start = new Date().toISOString();
save("fastStart",start);
}

function endFast(){
localStorage.removeItem("fastStart");
start = null;
}

function toggleDark(){
document.body.classList.toggle("dark");
save("dark",document.body.classList.contains("dark") ? "1":"0");
}

function saveWeight(){
let w=document.getElementById("weightInput").value;
if(!w) return;

let data=JSON.parse(localStorage.getItem("weights")||"[]");

data.push({
date:new Date().toLocaleDateString(),
weight:parseFloat(w)
});

save("weights",JSON.stringify(data));
drawChart();
document.getElementById("weightInput").value="";
}

function drawChart(){
let data=JSON.parse(localStorage.getItem("weights")||"[]").slice(-7);

new Chart(document.getElementById("chart"),{
type:"line",
data:{
labels:data.map(x=>x.date),
datasets:[{
label:"kg",
data:data.map(x=>x.weight),
tension:.3
}]
},
options:{
responsive:true,
plugins:{legend:{display:false}}
}
});
}

function tick(){

if(!start){
document.getElementById("hours").innerText="0h";
document.getElementById("status").innerText="尚未開始";
document.getElementById("progress").style.strokeDashoffset=CIRC;
document.getElementById("fatburn").innerText="";
return;
}

let diff=(new Date()-new Date(start))/1000/3600;
let h=diff.toFixed(1);

document.getElementById("hours").innerText=h+"h";
document.getElementById("status").innerText="禁食中";

let pct=Math.min(diff/GOAL,1);
document.getElementById("progress").style.strokeDashoffset=CIRC-(CIRC*pct);

if(diff>=GOAL){
document.getElementById("fatburn").innerText="🔥 已完成16小時";
}
else if(diff>=FATBURN){
document.getElementById("fatburn").innerText="🔥 已進入燃脂區";
}
else{
document.getElementById("fatburn").innerText="";
}

}

drawChart();
tick();
setInterval(tick,1000);