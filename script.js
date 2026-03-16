/* ===================== */
/* DATA */
/* ===================== */

let dictionary = {}
let reverseDictionary = {}

let mode = "nl-flar"

const input = document.getElementById("input")
const output = document.getElementById("output")

/* ===================== */
/* LOAD DICTIONARY */
/* ===================== */

fetch("dictionary.json")
.then(res => res.json())
.then(data => {

dictionary = data

for(let key in dictionary){
reverseDictionary[dictionary[key]] = key
}

})

/* ===================== */
/* TRANSLATE */
/* ===================== */

function translate(){

let text = input.value

let parts = text.split(/(\s+)/)

let result = parts.map(part => {

let clean = part.toLowerCase().replace(/[.,!?]/g,"")

if(mode==="nl-flar" && dictionary[clean]){

return part.replace(clean, dictionary[clean])

}

if(mode==="flar-nl" && reverseDictionary[clean]){

return part.replace(clean, reverseDictionary[clean])

}

return part

})

output.value = result.join("")

}

input.addEventListener("input", translate)

/* ===================== */
/* SWITCH */
/* ===================== */

switchBtn.onclick = () => {

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

/* ===================== */
/* COPY BUTTON */
/* ===================== */

copyBtn.onclick = () => {

navigator.clipboard.writeText(output.value)

copyBtn.innerText="✅ Gekopieerd"
copyBtn.classList.add("copied")

setTimeout(()=>{

copyBtn.innerText="📋 Copy"
copyBtn.classList.remove("copied")

},1500)

}

/* ===================== */
/* DARK MODE */
/* ===================== */

const themeToggle = document.getElementById("themeToggle")

let savedTheme = localStorage.getItem("theme")

if(savedTheme){
document.documentElement.setAttribute("data-theme", savedTheme)
}

themeToggle.onclick = () => {

let current = document.documentElement.getAttribute("data-theme")

let newTheme = current==="dark" ? "light" : "dark"

document.documentElement.setAttribute("data-theme", newTheme)

localStorage.setItem("theme", newTheme)

}

/* ===================== */
/* VOICES */
/* ===================== */

let voices = []
let maleVoice = null
let femaleVoice = null
let fallbackVoice = null

function loadVoices(){

let allVoices = speechSynthesis.getVoices()

voices = allVoices.filter(v => v.lang.startsWith("nl"))

fallbackVoice = voices[0] || allVoices[0]

maleVoice = null
femaleVoice = null

voices.forEach(v => {

let name = v.name.toLowerCase()

if(!femaleVoice && (
name.includes("female") ||
name.includes("vrouw") ||
name.includes("zira") ||
name.includes("susan")
)){
femaleVoice = v
}

if(!maleVoice && (
name.includes("male") ||
name.includes("david") ||
name.includes("mark")
)){
maleVoice = v
}

})

if(!femaleVoice) femaleVoice = fallbackVoice
if(!maleVoice) maleVoice = fallbackVoice

}

speechSynthesis.onvoiceschanged = loadVoices
loadVoices()

/* ===================== */
/* SPEAK */
/* ===================== */

function speak(text){

if(!text) return

speechSynthesis.cancel()

let utter = new SpeechSynthesisUtterance(text)

let voiceType = document.getElementById("voiceSelect").value

if(voiceType === "male"){
utter.voice = maleVoice
}else{
utter.voice = femaleVoice
}

utter.lang = "nl-NL"
utter.rate = 0.9
utter.pitch = 1

speechSynthesis.speak(utter)

}

/* ===================== */
/* SPEAK BUTTONS */
/* ===================== */

speakInputBtn.onclick = () => speak(input.value)
speakOutputBtn.onclick = () => speak(output.value)
