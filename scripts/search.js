"use strict";
const apiKey = "95f68fcd0940490f8ff659b21218517e";

const newsContainer = document.getElementById("news-container");

const searchInput = document.getElementById("input-query");
const searchButton = document.getElementById("btn-submit");

const pageNumElement = document.getElementById("page-num");
const prevButton = document.getElementById("btn-prev");
const nextButton = document.getElementById("btn-next");

// Khai báo
let currentPage = 1;

const currentUser = getFromStorage("CURRENT_USER");
const pageSize = currentUser.settings.pageSize;

// Function
// Hiển thị danh sách bài viết lên trang News
function displayArticles(articles) {
  newsContainer.innerHTML = "";

  articles.forEach((article) => {
    const articleCard = document.createElement("div");

    articleCard.className = "card flex-row flex-wrap mb-3";

    articleCard.innerHTML = `
      <div class="card mb-3" style="">
        <div class="row no-gutters">
          <div class="col-md-4">
            <img src="${article.urlToImage}" class="card-img" style="height:100%" alt="${article.title}">
          </div>
          <div class="col-md-8">
            <div class="card-body">
              <h5 class="card-title">${article.title}</h5>
              <p class="card-text">${article.description}</p>
              <a href="${article.url} ttarget="_blank" class="btn btn-primary">View</a>
            </div>
          </div>
        </div>
      </div>
    `;
    newsContainer.appendChild(articleCard);
  });
}

// cập nhật trạng thái của nút "Previous" và "Next"
function updatePaginationButtons(totalResults) {
  const maxPages = Math.ceil(totalResults / pageSize);
  console.log(">>> updatePaginationButtons invoked");
  console.log("totalResults", totalResults);
  console.log("pageSize", pageSize);
  console.log("maxPages", maxPages);

  if (currentPage === 1) {
    prevButton.classList.add("hidden");
  } else {
    prevButton.classList.remove("hidden");
  }

  if (currentPage === maxPages) {
    nextButton.classList.add("hidden");
  } else {
    nextButton.classList.remove("hidden");
  }
}

// Chuyển đổi một chuỗi thành một chuỗi kí tự tìm kiếm theo định cung cấp:
function convertToSearchString(inputString) {
  // Loại bỏ khoảng trắng đầu và cuối chuỗi và thay thế khoảng trắng trong chuỗi bằng dấu cộng (+)
  const cleanedString = inputString.trim().replace(/ /g, "+");

  return cleanedString;
}

//Gọi API và lấy dữ liệu bài viết theo keyword được search
async function searchNewsArticles(keyword) {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${keyword}&pageSize=${pageSize}&page=${currentPage}&apiKey=${apiKey}`
    );
    const data = await response.json();
    // console.log(data);
    console.log(">>> searchNewsArticles data:", data);
    const { articles, totalResults, ...rest } = data;

    return data;
  } catch (error) {
    console.error("Error searching news articles:", error);
    return [];
  }
}

// Xử lý sự kiện khi nhấn nút Search
async function searchHandler() {
  const searchKeyword = searchInput.value.trim();
  const encodedKeyword = convertToSearchString(searchKeyword);
  console.log(encodedKeyword);

  if (searchKeyword !== "") {
    currentPage = 1;
    const searchData = await searchNewsArticles(encodedKeyword);
    const searchArticles = searchData.articles;
    const totalResults = searchData.totalResults;

    displayArticles(searchArticles);
    pageNumElement.textContent = currentPage;
    updatePaginationButtons(totalResults);

    displayArticles(searchArticles);
  }
}

// Xử lý sự kiện khi nhấn nút Previous
async function prevButtonHandler() {
  const searchKeyword = searchInput.value.trim();
  const encodedKeyword = convertToSearchString(searchKeyword);
  if (searchKeyword !== "") {
    currentPage--;

    const searchData = await searchNewsArticles(encodedKeyword);
    const searchArticles = searchData.articles;
    const totalResults = searchData.totalResults;

    displayArticles(searchArticles);
    pageNumElement.textContent = currentPage;
    updatePaginationButtons(totalResults);

    displayArticles(searchArticles);
  }
}

// Xử lý sự kiện khi nhấn nút Next
async function nextButtonHandler() {
  const searchKeyword = searchInput.value.trim();
  const encodedKeyword = convertToSearchString(searchKeyword);

  currentPage++;

  const searchData = await searchNewsArticles(encodedKeyword);
  const searchArticles = searchData.articles;
  const totalResults = searchData.totalResults;

  displayArticles(searchArticles);
  pageNumElement.textContent = currentPage;
  updatePaginationButtons(totalResults);

  displayArticles(searchArticles);
}

// Xử lý sự kiện DOMContentLoaded
async function searchLoadedHandler() {
  searchButton.addEventListener("click", searchHandler);
  prevButton.addEventListener("click", prevButtonHandler);
  nextButton.addEventListener("click", nextButtonHandler);
}

// Tìm kiếm bài viết theo từ khóa
document.addEventListener("DOMContentLoaded", searchLoadedHandler);
