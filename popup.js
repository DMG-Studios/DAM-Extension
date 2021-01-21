let date = new Date();
let options = { weekday: 'long'}
let today = date.toLocaleDateString('en-us',options);
let element = document.getElementById('today');

element.innerHTML = today;