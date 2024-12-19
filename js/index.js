// create loadCategories
const loadCategories = () => {
  // fetch data
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.error(error));
};

// create loadVideos
const loadVideos = (searchText = "") => {
  // fetch data
  fetch(
    `https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`
  )
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.error(error));
};

// get time function
function getTimeString(time) {
  const hour = parseInt(time / 3600);
  let remainingSecond = time % 3600;
  const minute = parseInt(remainingSecond / 60);
  remainingSecond = remainingSecond % 60;
  return `${hour} hrs ${minute} min ${remainingSecond} sec ago`;
}

const removeActiveClass = () => {
    const buttons = document.getElementsByClassName("category-btn")
    for (let btn of buttons) {
        btn.classList.remove("active");
    }
};

// load detail
const loadDetails = async (videoId) => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
    const res = await fetch(url);
    const data = await res.json();
    displayDetails(data.video);
}

// displayDetails
const displayDetails = (video) => {
    console.log(video);
    const detailsContainer = document.getElementById("modal-content");

    document.getElementById("customModal").showModal();

    detailsContainer.innerHTML = `
        <div class = "">
            <img class="h-[200px] w-full object-cover rounded-xl mb-5" src=${video.thumbnail}/>
            <h2 class="font-bold text-xl mb-2">${video.title}</h2>
            <p class="text-justify">${video.description}</p>
        </div>
    `;
}

// load Categories
const loadCategoryVideos = (id) => {
  // alert(id);
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
    .then((res) => res.json())
      .then((data) => {
          removeActiveClass();
          
      const activeBtn = document.getElementById(`btn-${id}`);
      activeBtn.classList.add("active");
      displayVideos(data.category);
    })
    .catch((error) => console.error(error));
};

// display Categories
const displayCategories = (categories) => {
  const categoryContainer = document.getElementById("categories");
  categories.forEach((item) => {
    // create a button
    const buttonContainer = document.createElement("div");
    buttonContainer.innerHTML = `
        <button id="btn-${item.category_id}" onclick="loadCategoryVideos(${item.category_id})" class="btn category-btn">
            ${item.category}
        </button>
      `;

    categoryContainer.appendChild(buttonContainer);
  });
};

// display Videos
const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videos");
  videoContainer.innerHTML = "";

  if (videos.length == 0) {
    videoContainer.classList.remove("grid");
    videoContainer.innerHTML = `
        <div class="flex flex-col justify-center items-center w-full min-h-[200px] text-center gap-5">
            <img src="./assets/Icon.png" alt="No content icon">
            <h2 class="font-bold text-3xl text-gray-800">Oops!! Sorry, There is <br>no content here</h2>
        </div>
      `;
    return;
  } else {
    videoContainer.classList.add("grid");
  }
  videos.forEach((video) => {
    //   console.log(video);

    const card = document.createElement("div");
    card.classList = "card card-compact";
    card.innerHTML = `
        <figure class="h-[200px] relative">
            <img
            src=${video.thumbnail}
            class="h-full w-full object-cover"
            alt="Video thumbnail"/>
            ${
              video.others.posted_date?.length == 0
                ? ""
                : `<span class="absolute right-2 bottom-2 bg-gray-900 text-gray-200 text-xs rounded-lg py-1 px-2">${getTimeString(
                    video.others.posted_date
                  )}</span>`
            }
        </figure>
        <div class="px-1 py-2">
            <div class="flex space-x-3">
                <div>
                    <img class="w-7 h-7 rounded-full object-cover" src=${
                      video.authors[0].profile_picture
                    } alt="author"/>
                </div>
                <div class="">
                    <h2 class="card-title">${video.title}</h2>
                    <div class="flex justify-start items-center gap-1">
                        <p>${video.authors[0].profile_name}</p>
                        ${
                          video.authors[0].verified === true
                            ? `<img class="h-5 w-5" src="https://img.icons8.com/?size=48&id=D9RtvkuOe31p&format=png" alt="verify batch"/>`
                            : ""
                        }
                        </div>
                        <p>${video.others.views}</p>
                        <p><button onclick="loadDetails ('${video.video_id}')" class="btn btn-sm btn-error text-white">Details</button></p>
                </div>
            </div>
        </div>
        `;
    videoContainer.appendChild(card);
  });
};

document.getElementById("search-input").addEventListener('keyup', (e) => {
    loadVideos(e.target.value);
});

loadCategories();
loadVideos();
