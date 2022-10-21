// API 출처 명시하기
// https://app.newscatcherapi.com/dashboard

/* 변수 및 배열 정의 */
let articles = [];
let menus = document.querySelectorAll('#menu-list button');
let searchButton = document.getElementById('search-button');
let url; // url 지역변수로 사용하면 쓰이지 않기때문에 전역변수로 선언해야함
let page;
let totalPage = 1;

/* 이벤트 추가 */
menus.forEach((menu) =>
  menu.addEventListener('click', (event) => getNewsByTopic(event))
);

/* 함수정의 */
// getNews () - 겹치는 부분 묶어주기
const getNews = async () => {
  try {
    let header = new Headers({
      'x-api-key': '-t2HISawgRkhzwbfudh85HlApwhmwXT6slPP-jrFbWg',
    });
    url.searchParams.set('page', page);
    console.log(url);
    let response = await fetch(url, { headers: header }); //response 받아야 data 줄수 있기 때문에 await 필요
    let data = await response.json();
    if (response.status == 200) {
      news = data.articles;
      console.log(data);
      if (data.total_hits == 0) {
        throw new Error('검색된 결과가 없습니다.');
      }
      totalPage = data.total_pages;
      page = data.page;
      render();
      pagenation();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log('잡힌 에러는??', error.message);
    errorRender(error.message);
  }
};

// getLatestNews() - API를 불러냄
const getLatestNews = () => {
  page = 1;
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
  );
  getNews();
};
// json 객체 형태라 많이 씀, 텍스트 형태의 객체

// getNewsByTopic () -topic에 따라 뉴스 받음
const getNewsByTopic = (event) => {
  page = 1;
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`
  );
  console.log(url);
  getNews();
};
// async와 await 무조건 같이 써야함!

// getNewsByKeyword () - 키워드 검색으로 피드 가져오기
const getNewsByKeyword = () => {
  // 1. 검색 키워드 읽어오기
  // 2. 이거를 가지고 유알엘에 검색키워드 붙이기
  // 3. 헤더 준비
  // 4. 유알엘 부르기
  // 5. 데이터 가지고 오기
  // 6. 데이터 보여주기
  page = 1;
  let keyword = document.getElementById('search-input').value;
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=10`
  );
  getNews();
};

// render() - 뉴스정보를 보여줌
const render = () => {
  let newsHTML = '';
  newsHTML = news
    .map(
      (news) =>
        `        <div class="row news">
  <div class="col-lg-4">
    <img
      class="news-img-size"
      src="${
        news.media ||
        news.media ==
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU'
      }"
      alt="뉴스 이미지"
    />
  </div>
  <div class="col-lg-8">
    <h2><a href="${news.link}" target="_blank">${news.title}</a></h2>
    <p>'>${
      news.summary == null || news.summary == ''
        ? '내용없음'
        : news.summary.length > 200
        ? news.summary.substring(0, 200) + '...'
        : news.summary
    }</a></p>
    <div>${news.rights || 'No source'} * ${moment(
          news.published_date
        ).fromNow()}</div>
  </div>
</div>`
    )
    .join('');
  // console.log(newsHTML); map은 항상 배열을 반환하기때문에 ,까지 반환함 string 타입으로 변환해야함
  document.getElementById('news-board').innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`;
  document.getElementById('news-board').innerHTML = errorHTML;
};

const pagenation = () => {
  let pagenationHTML = ``;
  // 1. 토탈 페이지 수를 알아야한다. → getNews에서 data 콘솔창으로 보기
  // 2. 내가 현재 어떤 페이지를 보고있는지를 알아야한다. → getNews에서 data 콘솔창으로 보기
  // 3. 페이지 그룹을 찾아야한다.
  let pageGroup = Math.ceil(page / 5);
  // 4. 이 그룹을 베이스로 마지막 페이지가 뭔지 찾고, →
  let last = pageGroup * 5;
  if (last > totalPage) {
    last = totalPage;
  }
  // 5. 첫번째 페이지가 뭔지를 찾고, →
  let first = last - 4 <= 0 ? 1 : last - 4;
  // 6. 첫페이지부터 마지막까지 프린트, 출력해주기 →
  // <<, < 버튼
  if (first >= 6) {
    pagenationHTML += `<li class="page-item ">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1)">
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>
       <li class="page-item">
    <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${
      page - 1
    })">
      <span aria-hidden="true">&lt;</span>
    </a>
  </li>`;
  }
  // 페이지 번호
  for (let i = first; i <= last; i++) {
    pagenationHTML += `<li class="page-item ${
      page == i ? 'active' : ''
    }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }
  // >> , > 버튼
  if (last < totalPage) {
    pagenationHTML += `     <li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${
      page + 1
    })">
      <span aria-hidden="true">&gt;</span>
    </a>
  </li>
      <li class="page-item">
    <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${totalPage})">
      <span aria-hidden="true">&raquo;</span>
    </a>`;
  }
  document.querySelector('.pagination').innerHTML = pagenationHTML;
};

const moveToPage = (pageNumber) => {
  // 1. 우리가 이동하고 싶은 페이지를 알아야한다. 1인지 8인지 9인지 19인지...
  // 2. 이 페이지를 가지고, API를 호출해준다.
  page = pageNumber;
  console.log(pageNumber);
  getNews();
};

searchButton.addEventListener('click', getNewsByKeyword); // 호이스팅때문에 함수 정의 후 사용해야함(onclick사용해서 해결할수도 있음)
getLatestNews(); //초기화면
