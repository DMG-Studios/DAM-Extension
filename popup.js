let date = new Date();
let options = { weekday: 'long' }
let today = date.toLocaleDateString('en-us', options);
let element = document.getElementById('today');
element.textContent = today;


let vegFood = "Cucumbers with aspargus";
let metFood = "Beef with haggis";
let soupFood = "Warm bird water";
let dessFood = "Sugar infused water";

var divList = document.getElementsByClassName('lunchbutton');
var content = document.getElementById('content');

function attachClickEvent() {
    var listLength = divList.length;
    var i = 0;

    for (; i < listLength; i++) {
        divList[i].addEventListener("click", showLuch);
    }
}

function showLuch() {
    if (content.style.display == 'block' && content.classList.contains(this.id)) {
        content.style.display = 'none'
        content.className = '';
    } else {
        if (this.id == 'veg') {
            content.classList.add('veg');
            content.textContent = vegFood;
        } else if (this.id == 'met') {
            content.classList.add('met');
            content.textContent = metFood;
        } else if (this.id == 'soup') {
            content.classList.add('soup');
            content.textContent = soupFood;
        } else if (this.id == 'dess') {
            content.classList.add('dess');
            content.textContent = dessFood;
        } else if (content.style.display == 'block') {
            content.style.display = 'none';
        }
        content.style.display = 'block';
    }
}

attachClickEvent();

