let dictionary={}
let reverseDictionary={}

let mode="nl-flar"

const input=document.getElementById("input")
const output=document.getElementById("output")

fetch("dictionary.json")
.then(res=>res.json())
.then(data=>{

dictionary=data

for(let key in dictionary){
reverseDictionary[dictionary[key]]=key
}

})

function normalize(text){

return text.toLowerCase().replace(/[.,!?]/g,"")

}

function translate(){

let words=normalize(input.value).split(/\s+/)

let result

if(mode==="nl-flar"){
result=words.map(w=>dictionary[w]||w)
}else{
result=words.map(w=>reverseDictionary[w]||w)
}

output.value=result.join(" ")

}

input.addEventListener("input",translate)

document.getElementById("switchBtn").onclick=()=>{

let btn=document.getElementById("switchBtn")

btn.classList.add("rotate")

setTimeout(()=>btn.classList.remove("rotate"),300)

if(mode==="nl-flar"){

mode="flar-nl"

langLeft.innerText="Flarbarissisch"
langRight.innerText="Nederlands"

}else{

mode="nl-flar"

langLeft.innerText="Nederlands"
langRight.innerText="Flarbarissisch"

}

translate()

}

/* copy animatie */

copyBtn.onclick=()=>{

navigator.clipboard.writeText(output.value)

copyBtn.innerText="✅ Gekopieerd"
copyBtn.classList.add("copied")

setTimeout(()=>{

copyBtn.innerText="📋 Copy"
copyBtn.classList.remove("copied")

},1500)

}

/* dark mode */

const themeToggle=document.getElementById("themeToggle")

themeToggle.onclick=()=>{

let current=document.documentElement.getAttribute("data-theme")

document.documentElement.setAttribute("data-theme",current==="dark"?"light":"dark")

}

/* flarbarissisch uitspraakregels */

function flarPronounce(text){

return text

.replace(/zl/g,"zul")
.replace(/fl/g,"fla")
.replace(/kr/g,"kru")

}

/* speech + highlight */

function speak(text){

if(!text)return

let words=text.split(" ")

let i=0

function speakWord(){

if(i>=words.length)return

let utter=new SpeechSynthesisUtterance(flarPronounce(words[i]))

utter.lang="nl-NL"

utter.onend=()=>{

i++
speakWord()

}

speechSynthesis.speak(utter)

}

speakWord()

}

document.getElementById("speakInputBtn").onclick=()=>{
speak(input.value)
}

document.getElementById("speakOutputBtn").onclick=()=>{
speak(output.value)
}
