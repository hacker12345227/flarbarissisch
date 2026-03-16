let dictionary = {}
let reverseDictionary = {}

let mode = "nl-flar"

fetch("dictionary.json")
.then(res => res.json())
.then(data => {

dictionary = data

for (let key in dictionary){
reverseDictionary[dictionary[key]] = key
}

})

function normalize(text){

return text
.toLowerCase()
.replace(/[.,!?]/g,"")

}

function translateNLtoFlar(words){

return words.map(word => dictionary[word] || word)

}

function translateFlartoNL(words){

return words.map(word => reverseDictionary[word] || word)

}

function translate(){

let input = normalize(document.getElementById("input").value)

if(input.trim() === ""){
document.getElementById("liveOutput").innerText = ""
return
}

let words = input.split(/\s+/)

let result

if(mode === "nl-flar"){
result = translateNLtoFlar(words)
}
else{
result = translateFlartoNL(words)
}

document.getElementById("liveOutput").innerText = result.join(" ")

}

document.getElementById("input").addEventListener("input", translate)

document.getElementById("switchBtn").addEventListener("click", () => {

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
