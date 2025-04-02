let bar= document.querySelector('#hd2');
let display=0;
bar.style.display='none'
let btn= document.querySelector('#menu');
function display_navbar() {
  if(display==0){
    bar.style.display='block';
    display=1;
    btn.innerHTML='X';
    btn.style.zIndex=1;
    btn.style.backgroundColor='brown';
    btn.style.border='2px solid red'
  }
  else{
    bar.style.display='none';
    display=0;
    btn.innerHTML='Menu';
  }
}
// Code for Login Logout Block:

document.getElementById('register').style.display='none';
function Registration(){
  document.getElementById('register').style.display='flex';
  document.getElementById('login').style.display='none';
}
function Login(){
  document.getElementById('register').style.display='none';
  document.getElementById('login').style.display='flex';
}
// SetInterval time function
document.getElementById('main').style.display='none';
  function visibleLog() {
    document.getElementById('main').style.display='flex';
  }
 setTimeout(function(){visibleLog()},2000);
 // Login remove
 function remove() {
  document.getElementById('main').style.display='none';
 }
 function add(){
  document.getElementById('main').style.display='flex';
 }