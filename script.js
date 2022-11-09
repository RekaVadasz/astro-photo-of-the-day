// -----------create a global variable to get current date as string (yyyy-mm-dd)------------

const currentDate = function (){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
       dd = '0' + dd;
    }
    if (mm < 10) {
       mm = '0' + mm;
    } 
    return yyyy + '-' + mm + '-' + dd;
}

// -----------create a global variable to get current date minus 3 days (for gallery)------------

const dateMinus3Days = function (date = new Date()) { // this function creates the date of 3 days previous of the date given as argument (returns a string: yyyy-mm-dd)
    const minus3 = new Date(date.getTime());
    minus3.setDate(date.getDate() - 3); //3 days previous
    //now turn this into a string again
    let dd = minus3.getDate();
    let mm = minus3.getMonth() + 1; //January is 0!
    let yyyy = minus3.getFullYear();
    if (dd < 10) {
       dd = '0' + dd;
    }
    if (mm < 10) {
       mm = '0' + mm;
    } 
    return yyyy + '-' + mm + '-' + dd;
  }
  
const todayMinus3Days = dateMinus3Days(new Date(currentDate())); //this is way too complicated but we need a string for the API
//console.log(todayMinus3Days);

//----------creating main components of DOM------------------

const headerComponent = function (dateInput){    //date min: first photo of the API, max: today's date as there aro no future pics in the API
    //console.log(currentDate());
    return `
    <header>  
        <div class="header-container">
            <a href="#"><img src="./images/logo.png"/>
            <ul>
                <li>PHOTO OF THE DAY</a></li>
                <li><a href="#about">ABOUT</a></li>
                <li><a href="https://api.nasa.gov/" target="_blank">NASA APIs</a></li>
                <li><a href="#gallery">GALLERY</a></li>
            </ul>
        </div>
    </header>    
    `
}

const alertComponent = function (){
    return `
    <p id="alert"></p>
    `
}

const photoContainerComponent = function (dateInput) {
    return `
        <section class="apod">
            <form>
                <label for="date">
                    <input type="date" id="date" value=${dateInput} min="1995-06-16" max=${currentDate()}></input>
                </label>
            </form>
            <div id="container"></div>
        </section>
    `
};

const noResultComponent = function (){
    return `
    <div id="no-result">
        <img src="images/sad-star.jpg">
        <p>Sorry, here you can find only a black hole :( </p>
    </div>
    `
}

const photoCardComponent = function (title, url, explanation){
    return`
    <div id="photo-card">
        <div>
            <h2>${title}</h2>
            <p>${explanation}</p>
        </div>
        <div class="apod-img">
            <img src="${url}">
        </div>
    </div>
    `
}

const videoCardComponent = function (title, url, explanation){
    return`
    <div id="video-card">
        <h2>${title}</h2>
        <iframe src="${url}"></iframe>
        <p>${explanation}</p>
    </div>
    `
}

const aboutComponent = function () {
    return`
    <div class="about" id="about">
        <div>
            <img src="./images/pelican_nebula.jpg" alt="stars"/>
        </div>
        <div>
            <h3>NASA Astronomy Picture of the Day</h3>
            <h2>About</h2>
            <p>One of the most popular websites at NASA is the <a href="https://apod.nasa.gov/apod/">Astronomy Picture of the Day</a>. In fact, this website is one of the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video. This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds; but generally help with discoverability of relevant imagery.</br>
            The full documentation for this API can be found in the <a href="https://github.com/nasa/apod-api">APOD API Github repository</>.</p>
        </div>
    </div>
    `
}

const galleryComponent = function (date1, src1, date2, src2, date3, src3) {
    return`
    <div id="gallery">
        <h2>Photos from previous days</h2>
        <div id="photo-container">
            <div id="gallery-item-1">
                <p>${date1}</p>
                <img src="${src1}" />
            </div>
            <div id="gallery-item-2">
                <p>${date2}</p>
                <img src="${src2}" />
            </div>
            <div id="gallery-item-3">
                <p>${date3}</p>
                <img src="${src3}" />
            </div>
        </div>
    </div>
    `
}

const photoModal = function (title, url, explanation) {
    return `
    <div class="modal">
        <h1>${title}</h1>
        <img src="${url}">
        <p>${explanation}</p>
        <button id="close">Close[X]</button>
    </div>
    `
}

//----------LOAD EVENT----------
const loadEvent = function (){

    //---------adding main components to DOM-----------
    const rootElement = document.getElementById("root"); 
    
    rootElement.insertAdjacentHTML("beforeend", headerComponent(`${currentDate()}`)); // load page with current date as default input
    rootElement.insertAdjacentHTML("beforeend", alertComponent());
    rootElement.insertAdjacentHTML("beforeend", photoContainerComponent(`${currentDate()}`));
    rootElement.insertAdjacentHTML("beforeend", aboutComponent());

    // ----------create variables for DOM components----------
    const dateSearch = document.getElementById("date");
    const alertElement = document.getElementById("alert");
    const dailyContainerElement = document.getElementById("container");

    //----------fetching data for the daily card ------------

    //date format for search query: &date=2014-10-01 (to insert at the end of URL)
    const APIKey = "bblTutkP9AzxKQaVYIQ3oO3jQQg6Ad5b27oGmMC4";
    
    const getData = async function (dateValue) {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${APIKey}&date=${dateValue}`);
        const responseJson = await response.json();

        if (responseJson.media_type === "video") {
            dailyContainerElement.innerHTML = videoCardComponent(
                `${responseJson.title}`,
                `${responseJson.url}`,
                `${responseJson.explanation}`
            );
        } else {
            dailyContainerElement.innerHTML = photoCardComponent(
                `${responseJson.title}`,
                `${responseJson.url}`,
                `${responseJson.explanation}`
            );
        }
    }    
    
    getData(currentDate()); // load page with current photo/video of the day as default

    // ---------change photo content when date input is changed ------------------
    const udpateDateValue = function(event) {
        if(dateSearch.checkValidity()){ //only fetch data if new date input is valid (within given date range)
            getData(event.target.value); 
            alertElement.innerHTML = "";
        } else { //if not, alert user and show "not found" screen
            alertElement.innerHTML = "Please choose a date between 1995-06-16 and today";
            dailyContainerElement.innerHTML = noResultComponent();
        }
    }
    dateSearch.addEventListener("change", udpateDateValue); //update the fetched data id user changes the value of date input
    
    //----------function for fetching data for gallery ------------
    const getPhotos = async function () {
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=bblTutkP9AzxKQaVYIQ3oO3jQQg6Ad5b27oGmMC4&start_date=${todayMinus3Days}`);
        const responseJson = await response.json();
        //console.log(responseJson);

        rootElement.insertAdjacentHTML("beforeend", galleryComponent(  //this is also not sustainable solution - TO DO: do it with for loop
            `${responseJson[0].date}`,
            `${responseJson[0].url}`,
            `${responseJson[1].date}`,
            `${responseJson[1].url}`,
            `${responseJson[2].date}`,
            `${responseJson[2].url}`
            ));
            
        //---------remove img tag and replace with iframe tag in gallery, if input is video--------------
        for (let index = 0; index < responseJson.length; index++) {
            if (responseJson[index].media_type === "video") {
                console.log("video!!!")
                document.querySelector(`#gallery-item-${index+1} img`).remove();
                document.getElementById(`gallery-item-${index+1}`).insertAdjacentHTML("beforeend", `<iframe src="${responseJson[index].url}"></iframe>`);
            }
        }

        // ------ add click event to images: show them in modal-------------
        //remove modal element when Close button is clicked
        const removeModalOnclick = function (){
            let modal = document.querySelector(".modal")
            const closeButtonElement = document.getElementById("close");
            closeButtonElement.addEventListener("click", () => {
                //remove modal
                modal.remove();
            })
        }
        // these are NOT sustainable solutions... would need to refactor code to use it for gallery with several items
        //TO DO: create gallery with for-of loop, iterate through json array, create div for each item, insertAdjacentHTML etc etc
        //image 1
        const imageDiv1 = document.getElementById("gallery-item-1"); 
        imageDiv1.addEventListener("click", (event) => {
            rootElement.insertAdjacentHTML("afterend", photoModal(
                `${responseJson[0].title}`,
                `${responseJson[0].url}`,
                `${responseJson[0].explanation}`
            ));
            console.log(event.target) //why does this give img element???
            removeModalOnclick();
        });
            
        //image2
        const imageDiv2 = document.getElementById("gallery-item-2"); 
        imageDiv2.addEventListener("click", () => {
            rootElement.insertAdjacentHTML("afterend", photoModal(
                `${responseJson[1].title}`,
                `${responseJson[1].url}`,
                `${responseJson[1].explanation}`
            ));
            removeModalOnclick();
        });

        //image3
        const imageDiv3 = document.getElementById("gallery-item-3"); 
        imageDiv3.addEventListener("click", () => {
            rootElement.insertAdjacentHTML("afterend", photoModal(
                `${responseJson[2].title}`,
                `${responseJson[2].url}`,
                `${responseJson[2].explanation}`

            ));
            removeModalOnclick();
        });
    }    

    getPhotos(); //call function to create gallery at load
    
    const header = document.querySelector("header");
    
    window.addEventListener("scroll", function() {
        header.classList.toggle("sticky", window.scrollY > 0);
    })
}

window.addEventListener("load", loadEvent);