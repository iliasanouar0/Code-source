let s = "hha@gmail.com;here.hha@gmail.comhha@gmail.com here.hha@gmail.com"

let sp = s.split(/[.com]/)

console.log(sp);

if (sp[sp.length - 1] == '') {
    sp.pop()
}

console.log(sp.length);



let k = sp.map((e)=>{return e.trim()}).join('.com;')

console.log(k);