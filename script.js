let dictionary = {}

fetch("dictionary.json")
.then(res => res.json())
.then(data => dictionary = data)

function generateFlarWord(word){

let syllables = ["fl","bl","kr","sn","pl","zl","dr","gl"]

let s1 = syllables[Math.floor(Math.random()*syllables.length)]
let s2 = syllables[Math.floor(Math.random()*syllables.length)]

return s1 + word.slice(0,3) + s2

}

function translateToFlar(){

let input = document.getElementById("input").value.toLowerCase()
let words = input.split(" ")

let result = words.map(word => {

if(dictionary[word]) return dictionary[word]

return generateFlarWord(word)

})

document.getElementById("output").value = result.join(" ")

}

function translateToDutch(){

let reverse = {}

for(let key in dictionary){

reverse[dictionary[key]] = key

}

let input = document.getElementById("input").value.toLowerCase()
let words = input.split(" ")

let result = words.map(word => reverse[word] || word)

document.getElementById("output").value = result.join(" ")

}
