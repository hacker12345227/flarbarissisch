let dictionary = {}
let reverseDictionary = {}

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

function applyGrammar(word){

// voorbeeld regels

// meervoud
if(word.endsWith("en")){
return word.slice(0,-2) + "or"
}

// verleden tijd
if(word.endsWith("de") || word.endsWith("te")){
return word.slice(0,-2) + "ar"
}

return word

}

function reorderSentence(words){

// simpele Flarbarissische structuur

if(words.length === 4){

return [
words[0],
words[3],
words[1],
words[2]
]

}

return words

}

function translateWordToFlar(word){

if(dictionary[word]){

return applyGrammar(dictionary[word])

}

return word

}

function translateWordToDutch(word){

if(reverseDictionary[word]){

return reverseDictionary[word]

}

return word

}

function translateToFlar(){

let input = normalize(document.getElementById("input").value)

let words = input.split(/\s+/)

words = reorderSentence(words)

let result = words.map(word => translateWordToFlar(word))

document.getElementById("output").value = result.join(" ")

}

function translateToDutch(){

let input = normalize(document.getElementById("input").value)

let words = input.split(/\s+/)

let result = words.map(word => translateWordToDutch(word))

document.getElementById("output").value = result.join(" ")

}
