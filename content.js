
/// Content JS for Calendar next up and News API Connections // 

let nextCalendar = document.getElementById("nextCal");
let nextCalendarTime = document.getElementById("nextTime");
let nextCalendarComment = document.getElementById("nextComment");
let nextCalendarLink = document.getElementById("nextLink");

let arbsHash;
let fetchLink;

// Get arbs hash set in options // 

function GetHash() {

    function setCurrentChoice(result) {
        arbsHash = result.arbs || "default";
        call();
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    /*let getting = chrome.storage.local.get("arbs");
    getting.then(setCurrentChoice, onError);
*/
    chrome.storage.sync.get(['arbs'], function (result) {
        setCurrentChoice(result);
    });
}

// Call Get hash //

GetHash();

// Set Fetch link composed of api address and your ARBS link // 
function call() {
    console.log(arbsHash);
    fetchLink = 'https://api.cornern.tlk.fi/dam-api/calendar?link=' + arbsHash;
    GetNextEvent();
    GetNews();
}



// Options for showing time without seconds // 

let dOpt = {
    hour: '2-digit',
    minute: '2-digit',
}

// Function to fetch and parse response from calendar api // 

function GetNextEvent() {
    let calendarEvents;
    // Sub function for fetching // 
    function getCalendar() {
        fetch(fetchLink)
            .then((r) => r.json())
            .then((r) => {
                callCalendar(r);
            });
    }
    function callCalendar(r) {
        calendarEvents = r;
        fillCalendar();
    }

    getCalendar();

    function fillCalendar() {
        // Check that CalendarEvents have been fetched before populating, else proceed with error message // 
        if (calendarEvents) {

            let nextEventName = calendarEvents[0].name;
            let nextEventComment = calendarEvents[0].comment;
            let nextEventStart = calendarEvents[0].startTime;
            let nextEventEnd = calendarEvents[0].endTime;
            let nextEventRoom = calendarEvents[0].room;

            // Regexp incomming comment for a http/s link to append to Link to lecture // 

            let nextLink = nextEventComment.split(/(https?:\/\/[^\s]+)/g);

            // Variables to split comment into link and commentEntry // 

            let link;
            let comment;

            // Forloop to assing link and comment // 
            nextLink.forEach(element => {
                if (element.includes('http')) {
                    link = element;
                } else if (element.length > 1) {
                    comment = element;
                }
            });

            // If no room is booked assign to online // 

            if (nextEventRoom == "") {
                nextEventRoom = "Online";
            }

            // Assign event name and room to Calendar frame header //
            nextCalendar.textContent = nextEventName + " @ " + nextEventRoom;

            // Assign time, comment and link to calendar frame // 
            nextCalendarTime.textContent = new Date(nextEventStart).toLocaleDateString('fi-FI',) + " " + new Date(nextEventStart).toLocaleTimeString('fi-FI', dOpt) + " - " + new Date(nextEventEnd).toLocaleTimeString('fi-FI', dOpt);            nextCalendarComment.textContent = comment;
            nextCalendarLink.href = link;

            // if there wasn't a response assign error message // 
        } else {
            nextCalendarComment.textContent = "Something wen't horribly wrong. Atleast 5 highly trained tölks have been assigned to fix this"
            nextCalendarLink.href = "www.dinmamma.fi"
            nextCalendarLink.textContent = "DMG Studios Appologizes"
        }
    }
}
// Get news from api //

function GetNews() {
    let news;
    let latest = document.getElementById('latest');
    let newsBody = document.getElementById('newsBody');
    let newsLink = document.getElementById('newsLink');
    function getNewsArticle() {
        fetch('https://api.cornern.tlk.fi/dam-api/news')
            .then((r) => r.json())
            .then((r) => {
                callNews(r);
            });
    }
    function callNews(r) {
        news = r;
        // fillNews();
        updateNews(news[0]);
        loopNews();
    }

    getNewsArticle();

    var x = 0

    // Function to loop news indefinetly // 
    function loopNews() {

        if (news) {
            setInterval(() => {
                updateNews(news[x]);
                x = x < Object.keys(news).length - 1 ? x + 1 : 0;
            }, 7000);
        } else {
            latest.textContent = "Couldn't fetch news, we are sorry and working on a fix";
        }
    }

    function updateNews(newsItem) {
        latest.textContent = newsItem.heading;
        newsBody.textContent = newsItem.body.substr(0, 150).substr(0, newsItem.body.substr(0, 150).lastIndexOf(" ")) + "\u2026";
        newsLink.href = newsItem.link;
    }

}