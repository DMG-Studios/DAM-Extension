let date = new Date();
date.setHours(2, 0, 0, 0);
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

var food;
/*
xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        food = JSON.parse(xmlhttp.response);
    }



}
xmlhttp.open("GET", 'http://nugge.fi/foodGet.php', false);
xmlhttp.send();


/////
async function fetchFood() {
    let response = await fetch('http://nugge.fi/foodGet.php');

    console.log(response.status); // 200
    console.log(response.statusText); // OK

    if (response.status === 200) {
        let data = await response;
    }
}

fetchFood();


async function getText() {
    let myObject = await fetch('http://nugge.fi/foodGet.php');
    let myText = await myObject.text();
    console.log(myText);
  }
  


fetch('http://nugge.fi/foodGet.php').then((response)=>{
    console.log(response.text)});
*/
/*
fetch('http://nugge.fi/foodGet.php').then(r => food = r.json());
*/

fetch('http://nugge.fi/foodGet.php').then(r => r.json()).then(r => {showTest(r)})
var menus;
function showTest(r){
    food = r;
    menus = food.MenusForDays;
}

var menuList = [];

Object.keys(menus).forEach(function (k) {
    let menudate = new Date(menus[k].Date.substring(0, 10))
    if (menudate.toISOString() == date.toISOString()) {
        for (i = 0; i < menus[k].SetMenus.length; i++) {
            menuList[i] = menus[k].SetMenus[i].Components;
        }
    }
});

function showLuch() {
    if (this.id == "today") {
        content.style.display = 'none';
    } else if (content.style.display == 'block' && content.classList.contains(this.id)) {
        content.style.display = 'none'
        content.className = '';
    } else {
        if (this.id == 'veg') {
            content.classList.add('veg');
            content.textContent = menuList[0];
        } else if (this.id == 'met') {
            content.classList.add('met');
            content.textContent = menuList[1];
        } else if (this.id == 'soup') {
            content.classList.add('soup');
            content.textContent = menuList[2];
        } else if (this.id == 'dess') {
            content.classList.add('dess');
            content.textContent = menuList[3];
        } else if (content.style.display == 'block') {
            content.style.display = 'none';
        }
        content.style.display = 'block';
    }
}

attachClickEvent();