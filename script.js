
const dictionary = {

"ik":"zlu",
"jij":"flar",
"ben":"bar",
"bent":"bar",
"persoon":"rissa",
"vriend":"krub",
"beste":"krubba",
"hallo":"plub",
"doei":"drub",
"favoriete":"blor",
"favoriet":"blor",
"leuk":"blo",
"speciaal":"flor",
"blij":"zor",
"grappig":"snor",
"mijn":"mi"

}


function toFlar(){

let input = document.getElementById("inputText").value.toLowerCase()
let words = input.split(" ")

let translated = words.map(word => dictionary[word] || word)

document.getElementById("outputText").value = translated.join(" ")

}


function toDutch(){

let reverse = {}

for (let key in dictionary){

reverse[dictionary[key]] = key

}

let input = document.getElementById("inputText").value.toLowerCase()
let words = input.split(" ")

let translated = words.map(word => reverse[word] || word)

document.getElementById("outputText").value = translated.join(" ")

}
