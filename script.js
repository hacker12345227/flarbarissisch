let dictionary = {};
let reverseDictionary = {};
let mode = "nl-flar";

const inputEl = document.getElementById("input");
const outputEl = document.getElementById("output");
const autocompleteEl = document.getElementById("autocomplete");
const switchBtn = document.getElementById("switchBtn");
const copyBtn = document.getElementById("copyBtn");
const langLeft = document.getElementById("langLeft");
const langRight = document.getElementById("langRight");

fetch("dictionary.json")
  .then((res) => res.json())
  .then((data) => {
    dictionary = data;

    for (const key in dictionary) {
      reverseDictionary[dictionary[key]] = key;
    }

    translate();
  })
  .catch((err) => {
    console.error("Kon dictionary.json niet laden:", err);
  });

function normalize(text) {
  return text.toLowerCase().replace(/[.,!?;:()"'`]/g, "");
}

function getActiveDictionary() {
  return mode === "nl-flar" ? dictionary : reverseDictionary;
}

function translateWords(words) {
  const activeDictionary = getActiveDictionary();
  return words.map((word) => activeDictionary[word] || word);
}

function translate() {
  const rawInput = inputEl.value;
  const cleaned = normalize(rawInput).trim();

  if (!cleaned) {
    outputEl.value = "";
    hideAutocomplete();
    return;
  }

  const words = cleaned.split(/\s+/);
  const translated = translateWords(words);
  outputEl.value = translated.join(" ");

  const currentPartial = getCurrentPartial(rawInput);
  showAutocomplete(currentPartial);
}

function getCurrentPartial(text) {
  const match = text.toLowerCase().match(/([^\s]+)$/);
  if (!match) return "";
  return match[1].replace(/[.,!?;:()"'`]/g, "");
}

function showAutocomplete(partial) {
  const activeDictionary = getActiveDictionary();
  autocompleteEl.innerHTML = "";

  if (!partial || partial.length < 1) {
    hideAutocomplete();
    return;
  }

  const keys = Object.keys(activeDictionary)
    .filter((word) => word.startsWith(partial))
    .slice(0, 6);

  if (keys.length === 0) {
    hideAutocomplete();
    return;
  }

  keys.forEach((word) => {
    const item = document.createElement("div");
    item.className = "autocomplete-item";
    item.textContent = word;

    item.addEventListener("click", () => {
      applySuggestion(word);
    });

    autocompleteEl.appendChild(item);
  });

  autocompleteEl.classList.add("show");
}

function hideAutocomplete() {
  autocompleteEl.classList.remove("show");
  autocompleteEl.innerHTML = "";
}

function applySuggestion(selectedWord) {
  const current = inputEl.value;
  const replaced = current.replace(/([^\s]*)$/, selectedWord);
  inputEl.value = replaced.endsWith(" ") ? replaced : replaced + " ";
  inputEl.focus();
  hideAutocomplete();
  translate();
}

inputEl.addEventListener("input", translate);

inputEl.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideAutocomplete();
  }
});

document.addEventListener("click", (event) => {
  const clickedInsideInput = event.target === inputEl;
  const clickedInsideAutocomplete = autocompleteEl.contains(event.target);

  if (!clickedInsideInput && !clickedInsideAutocomplete) {
    hideAutocomplete();
  }
});

switchBtn.addEventListener("click", () => {
  switchBtn.classList.add("rotating");
  setTimeout(() => switchBtn.classList.remove("rotating"), 350);

  const oldInput = inputEl.value;
  const oldOutput = outputEl.value;

  if (mode === "nl-flar") {
    mode = "flar-nl";
    langLeft.textContent = "Flarbarissisch";
    langRight.textContent = "Nederlands";
  } else {
    mode = "nl-flar";
    langLeft.textContent = "Nederlands";
    langRight.textContent = "Flarbarissisch";
  }

  inputEl.value = oldOutput;
  outputEl.value = oldInput ? normalize(oldInput) : "";
  translate();
});

copyBtn.addEventListener("click", async () => {
  const text = outputEl.value;

  if (!text) return;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      fallbackCopyText(text);
    }

    const original = copyBtn.textContent;
    copyBtn.textContent = "✅ Gekopieerd";
    copyBtn.classList.add("copied");

    setTimeout(() => {
      copyBtn.textContent = original;
      copyBtn.classList.remove("copied");
    }, 1400);
  } catch (error) {
    console.error("Kopiëren mislukt:", error);
    alert("Kopiëren lukte niet.");
  }
});

function fallbackCopyText(text) {
  const temp = document.createElement("textarea");
  temp.value = text;
  temp.setAttribute("readonly", "");
  temp.style.position = "absolute";
  temp.style.left = "-9999px";
  document.body.appendChild(temp);
  temp.select();
  document.execCommand("copy");
  document.body.removeChild(temp);
}
