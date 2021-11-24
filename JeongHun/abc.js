var a = 10;

function p() {
  setTimeout(()=>{
    console.log('호출'+a);
  },100);
}
function f1() {
  setTimeout(()=>{
    a = a +10;
  },100);
}

function f2() {
  setTimeout(p,100);
}

f1();
f2();