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

/* switch */

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

themeToggle.onclick=()=>{

let current=document.documentElement.getAttribute("data-theme")

document.documentElement.setAttribute(
"data-theme",
current==="dark"?"light":"dark"
)

}

/* stemmen */

let voices=[]
let maleVoice=null
let femaleVoice=null

function loadVoices(){

voices=speechSynthesis.getVoices().filter(v=>v.lang.startsWith("nl"))

if(voices.length>0){

femaleVoice=voices[0]

maleVoice=voices.find(v=>v.name.toLowerCase().includes("male")) || voices[1] || voices[0]

}

}

speechSynthesis.onvoiceschanged=loadVoices
loadVoices()

function speak(text){

if(!text)return

speechSynthesis.cancel()

let utter=new SpeechSynthesisUtterance(text)

let voiceType=document.getElementById("voiceSelect").value

if(voiceType==="male"){
utter.voice=maleVoice
}else{
utter.voice=femaleVoice
}

utter.lang="nl-NL"
utter.rate=0.9

speechSynthesis.speak(utter)

}

speakInputBtn.onclick=()=>speak(input.value)
speakOutputBtn.onclick=()=>speak(output.value)
