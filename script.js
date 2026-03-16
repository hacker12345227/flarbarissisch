let dictionary = {}
let reverseDictionary = {}

let mode = "nl-flar"

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

let input = normalize(document.getElementById("input").value)

let words = input.split(/\s+/)

let result

if(mode === "nl-flar"){
result = words.map(word => dictionary[word] || word)
}
else{
result = words.map(word => reverseDictionary[word] || word)
}

document.getElementById("output").value = result.join(" ")

autocomplete(words[words.length-1])

}

document.getElementById("input").addEventListener("input", translate)

function autocomplete(part){

let list = document.getElementById("autocomplete")

list.innerHTML = ""

if(!part) return

let keys = Object.keys(dictionary)

let matches = keys.filter(w => w.startsWith(part)).slice(0,5)

matches.forEach(word => {

let div = document.createElement("div")
div.className = "autocomplete-item"
div.innerText = word

div.onclick = () => {

let input = document.getElementById("input")
let words = input.value.split(/\s+/)

words[words.length-1] = word

input.value = words.join(" ")

list.innerHTML = ""

translate()

}

list.appendChild(div)

})

}

document.getElementById("switchBtn").addEventListener("click", () => {

let btn = document.getElementById("switchBtn")

btn.classList.add("switching")

setTimeout(() => btn.classList.remove("switching"),400)

if(mode === "nl-flar"){

mode = "flar-nl"

document.getElementById("langLeft").innerText = "Flarbarissisch"
document.getElementById("langRight").innerText = "Nederlands"

}
else{

mode = "nl-flar"

document.getElementById("langLeft").innerText = "Nederlands"
document.getElementById("langRight").innerText = "Flarbarissisch"

}

translate()

})

document.getElementById("copyBtn").addEventListener("click", () => {

let text = document.getElementById("output")

navigator.clipboard.writeText(text.value)

})
