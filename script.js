let dictionary = {}
let reverseDictionary = {}

let mode = "nl-flar"

const input = document.getElementById("input")
const output = document.getElementById("output")
const autocomplete = document.getElementById("autocomplete")

fetch("dictionary.json")
.then(res => res.json())
.then(data => {

dictionary = data

for(let key in dictionary){
reverseDictionary[dictionary[key]] = key
}

})

function normalize(text){

return text
.toLowerCase()
.replace(/[.,!?]/g,"")

}

function translate(){

let words = normalize(input.value).split(/\s+/)

let result

if(mode === "nl-flar"){
result = words.map(w => dictionary[w] || w)
}else{
result = words.map(w => reverseDictionary[w] || w)
}

output.value = result.join(" ")

showAutocomplete(words[words.length-1])

}

input.addEventListener("input",translate)

function showAutocomplete(part){

autocomplete.innerHTML=""

if(!part) return

let keys = Object.keys(dictionary)

let matches = keys.filter(w=>w.startsWith(part)).slice(0,6)

if(matches.length===0) return

autocomplete.classList.add("show")

matches.forEach(word=>{

let div=document.createElement("div")

div.className="autocomplete-item"

div.innerText=word

div.onclick=()=>{

let words=input.value.split(/\s+/)

words[words.length-1]=word

input.value=words.join(" ")

autocomplete.classList.remove("show")

translate()

}

autocomplete.appendChild(div)

})

}

document.addEventListener("click",e=>{

if(!autocomplete.contains(e.target) && e.target!==input){
autocomplete.classList.remove("show")
}

})

document.getElementById("switchBtn").addEventListener("click",()=>{

let btn=document.getElementById("switchBtn")

btn.classList.add("rotate")

setTimeout(()=>btn.classList.remove("rotate"),300)

if(mode==="nl-flar"){

mode="flar-nl"

document.getElementById("langLeft").innerText="Flarbarissisch"
document.getElementById("langRight").innerText="Nederlands"

}else{

mode="nl-flar"

document.getElementById("langLeft").innerText="Nederlands"
document.getElementById("langRight").innerText="Flarbarissisch"

}

translate()

})

document.getElementById("copyBtn").addEventListener("click",()=>{

let text=output.value

if(!text) return

if(navigator.clipboard){
navigator.clipboard.writeText(text)
}else{

let temp=document.createElement("textarea")
temp.value=text
document.body.appendChild(temp)
temp.select()
document.execCommand("copy")
document.body.removeChild(temp)

}

})

/* dark mode */

const themeToggle=document.getElementById("themeToggle")

function setTheme(theme){

document.documentElement.setAttribute("data-theme",theme)

localStorage.setItem("theme",theme)

themeToggle.innerText = theme==="dark" ? "☀️" : "🌙"

}

const savedTheme=localStorage.getItem("theme")

if(savedTheme){

setTheme(savedTheme)

}else{

const prefersDark=window.matchMedia("(prefers-color-scheme: dark)").matches

setTheme(prefersDark ? "dark" : "light")

}

themeToggle.addEventListener("click",()=>{

const current=document.documentElement.getAttribute("data-theme")

setTheme(current==="dark" ? "light" : "dark")

})


let voices = []

const voiceSelect = document.getElementById("voiceSelect")

function loadVoices(){

voices = speechSynthesis.getVoices()

voiceSelect.innerHTML = ""

voices.forEach((voice,i)=>{

let option = document.createElement("option")

option.value = i
option.textContent = voice.name + " (" + voice.lang + ")"

voiceSelect.appendChild(option)

})

}

speechSynthesis.onvoiceschanged = loadVoices

function speak(text){

if(!text) return

let utter = new SpeechSynthesisUtterance(text)

let voiceIndex = voiceSelect.value

if(voices[voiceIndex]){
utter.voice = voices[voiceIndex]
}

utter.rate = 0.9
utter.pitch = 1

speechSynthesis.speak(utter)

}

document.getElementById("speakInputBtn").addEventListener("click",()=>{

speak(document.getElementById("input").value)

})

document.getElementById("speakOutputBtn").addEventListener("click",()=>{

speak(document.getElementById("output").value)

})
