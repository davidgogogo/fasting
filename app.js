const HEIGHT=1.73;
const SEX="M";

let start=localStorage.getItem("fastStart");

function save(k,v){
localStorage.setItem(k,v);
}

function startFast(){
start=new Date().toISOString();
save("fastStart",start);
}

function eatNow(){
if(start){
let logs=JSON.parse(localStorage.getItem("fastLogs")||"[]");

let hrs=((new Date()-new Date(start))/3600000).toFixed(1);

logs.unshift({
date:new Date().toLocaleDateString(),
hours:hrs
});

save("fastLogs",JSON.stringify(logs));
localStorage.removeItem("fastStart");
start=null;
renderHistory();
}
}

function hunger(){
let logs=JSON.parse(localStorage.getItem("hunger")||"[]");

logs.unshift({
time:new Date().toLocaleString()
});

save("hunger",JSON.stringify(logs));

alert("已記錄饑餓感來襲");
}

function saveWeight(){
let w=parseFloat(document.getElementById("weight").value);
if(!w)return;

save("weight",w);

let bmi=(w/(HEIGHT*HEIGHT)).toFixed(1);

let fat=(1.20*bmi+0.23*35-16.2).toFixed(1);

document.getElementById("bmi").innerText="BMI："+bmi;
document.getElementById("fat").innerText="體脂估計："+fat+"%";
}

function renderHistory(){
let logs=JSON.parse(localStorage.getItem("fastLogs")||"[]");
let html="";

logs.slice(0,14).forEach(x=>{
html+=`<div>${x.date}｜${x.hours}h</div>`;
});

document.getElementById("history").innerHTML=html;
}

function tick(){

if(!start){
document.getElementById("clock").innerText="0.0h";
document.getElementById("status").innerText="尚未開始";
document.getElementById("tip").innerText="";
return;
}

let h=((new Date()-new Date(start))/3600000).toFixed(1);

document.getElementById("clock").innerText=h+"h";
document.getElementById("status").innerText="禁食中";

if(h>=16)
document.getElementById("tip").innerText="🔥 今日完成16小時";
else if(h>=12)
document.getElementById("tip").innerText="🔥 進入燃脂區";
else
document.getElementById("tip").innerText="";
}

if("serviceWorker" in navigator){
navigator.serviceWorker.register("service-worker.js");
}

renderHistory();
tick();
setInterval(tick,1000);