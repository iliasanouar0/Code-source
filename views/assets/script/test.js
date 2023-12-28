let s = "hha@gmail.com;here.hha@gmail.com;hha@gmail.com;     here.hha@gmail.com;"

let sp = s.split(';')

console.log(sp);

if (sp[sp.length - 1] == '') {
    sp.pop()
}

let k = sp.map((e)=>{return e.trim()}).join(';')

console.log(k);