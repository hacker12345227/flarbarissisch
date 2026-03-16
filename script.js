let dictionary={}
let reverseDictionary={}

let mode="nl-flar"

const input=document.getElementById("input")
const output=document.getElementById("output")

const switchBtn=document.getElementById("switchBtn")
const langLeft=document.getElementById("langLeft")
const langRight=document.getElementById("langRight")

const copyBtn=document.getElementById("copyBtn")

const themeToggle=document.getElementById("themeToggle")

const speakInputBtn=document.getElementById("speakInputBtn")
const speakOutputBtn=document.getElementById("speakOutputBtn")

fetch("dictionary.json")
.then(res=>res.json())
.then(data=>{

dictionary=data

for(let key in dictionary){
reverseDictionary[dictionary[key]]=key
}

})

function translateToken(token){

let match=token.match(/^([^A-Za-z0-9]*)([A-Za-z0-9]+)([^A-Za-z0-9]*)$/)

if(!match)return token

let start=match[1]
let word=match[2]
let end=match[3]

let lookup=word.toLowerCase()

let translated=word

if(mode==="nl-flar" && dictionary[lookup]){
translated=dictionary[lookup]
}

if(mode==="flar-nl" && reverseDictionary[lookup]){
translated=reverseDictionary[lookup]
}

return start+translated+end

}

function translate(){

let parts=input.value.split(/(\s+)/)

let result=parts.map(p=>{

if(/\s+/.test(p))return p

return translateToken(p)

})

output.value=result.join("")

}

input.addEventListener("input",translate)

switchBtn.onclick=()=>{

switchBtn.classList.add("rotate")

setTimeout(()=>switchBtn.classList.remove("rotate"),300)

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

copyBtn.onclick=()=>{

navigator.clipboard.writeText(output.value)

copyBtn.innerText="✅ Gekopieerd"

copyBtn.classList.add("copied")

setTimeout(()=>{

copyBtn.innerText="📋 Copy"

copyBtn.classList.remove("copied")

},1500)

}

let savedTheme=localStorage.getItem("theme")

if(savedTheme){
document.documentElement.setAttribute("data-theme",savedTheme)
}

themeToggle.onclick=()=>{

let current=document.documentElement.getAttribute("data-theme")

let newTheme=current==="dark"?"light":"dark"

document.documentElement.setAttribute("data-theme",newTheme)

localStorage.setItem("theme",newTheme)

}

function speak(text){

if(!text)return

speechSynthesis.cancel()

let utter=new SpeechSynthesisUtterance(text)

utter.lang="nl-NL"

utter.rate=0.9

speechSynthesis.speak(utter)

}

speakInputBtn.onclick=()=>speak(input.value)
speakOutputBtn.onclick=()=>speak(output.value)
