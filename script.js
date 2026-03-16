let dictionary={}
let reverseDictionary={}

let mode="nl-flar"

const input=document.getElementById("input")
const output=document.getElementById("output")
const autocomplete=document.getElementById("autocomplete")
const copyBtn=document.getElementById("copyBtn")

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

const themeToggle=document.getElementById("themeToggle")

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

/* flarbarissisch uitspraak */

function flarPronounce(word){

return word
.replace(/zl/g,"zul")
.replace(/fl/g,"fla")
.replace(/kr/g,"kru")

}

/* stemmen */

let voices=[]
let maleVoice=null
let femaleVoice=null

function loadVoices(){

voices=speechSynthesis.getVoices().filter(v=>v.lang.startsWith("nl"))

voices.forEach(v=>{

let name=v.name.toLowerCase()

if(!femaleVoice && name.includes("female")) femaleVoice=v
if(!maleVoice && name.includes("male")) maleVoice=v

})

if(!femaleVoice && voices[0]) femaleVoice=voices[0]
if(!maleVoice && voices[1]) maleVoice=voices[1]

}

speechSynthesis.onvoiceschanged=loadVoices

loadVoices()

function speak(text){

let words=text.split(" ")

let i=0

function speakWord(){

if(i>=words.length) return

let word=flarPronounce(words[i])

let utter=new SpeechSynthesisUtterance(word)

let voiceType=document.getElementById("voiceSelect").value

if(voiceType==="male") utter.voice=maleVoice
else utter.voice=femaleVoice

utter.lang="nl-NL"

utter.onend=()=>{

i++
speakWord()

}

speechSynthesis.speak(utter)

}

speakWord()

}

speakInputBtn.onclick=()=>speak(input.value)
speakOutputBtn.onclick=()=>speak(output.value)
