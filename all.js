const select = document.querySelector('select');
const btn = document.querySelector('.btn');
const title = document.querySelector('.administrative-title');
title.innerHTML = '全部地區';
const card = document.querySelector('.administrative-cards');
const pagination = document.querySelector('.pagination');


//串接
const jsonUrl = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json';
let jsonData = {};
fetch(jsonUrl, { method: 'get' })
    .then((response) => {
        return response.json();
    }).then((data) => {
        jsonData = data.result.records;
        renderSelect(jsonData);
        renderContent(jsonData, 1);
    })

//render選單
let renderSelect = (jsonData) => {
    let noRepeat = [];
    jsonData.forEach((items) => {
        if (noRepeat.indexOf(items.Zone) === -1) {
            noRepeat.push(items.Zone);
        }
    })
    let str = '';
    str = `<option value="" selected disabled hidden>- - 請選擇行政區 - -</option>`;
    noRepeat.forEach((item) => {
        str += `
        <option value="${item}">${item}</option>`
    })
    select.innerHTML = str;
}

//render內容
let renderContent = (jsonData, nowPage) => {
    const dataTotal = jsonData.length;
    const perPage = 6;
    const pageTotal = Math.ceil(dataTotal / perPage);
    let currentPage = nowPage;
    if (currentPage > pageTotal) {
        currentPage = pageTotal;
    }
    const minData = (currentPage * perPage) - perPage + 1;
    const maxData = (currentPage * perPage);
    const data = [];
    jsonData.forEach((item, index) => {
        const num = index + 1;
        if (num >= minData && num <= maxData) {
            data.push(item);
        }
    })
    const page = {
        pageTotal,
        currentPage,
        hasPage: currentPage > 1,
        hasNext: currentPage < pageTotal,
    }
    displayData(data);
    pageBtn(page);
}


//呈現
let displayData = (data) => {
    let str = '';
    data.forEach((item) => {
        console.log(item);
        
        str += `<div class="model-card" data-id="${item.Id}" data-px="${item.Px}" data-py="${item.Py}">
        <div class="card-top" style="background-image: url('${item.Picture1}');">
          <h3>${item.Name}</h3>
          <h5>${item.Zone}</h5>
        </div>
        <ul class="card-bottom">
          <li class="time">${item.Opentime}</li>
          <li class="location">${item.Add}</li>
          <li class="phoneTag">
            <div class="phone">${item.Tel}</div>
            ${(item.Ticketinfo ? '<div class="tag">' + item.Ticketinfo + '</div>' : '')}
          </li>
        </ul>
      </div>`;
    });
    card.innerHTML = str;
}

//分頁
let pageBtn = (page) => {
    let str = '';
    const total = page.pageTotal;

    if (page.hasPage) {
        str += `<li class="prev"><a href="#" data-page="${Number(page.currentPage) - 1}">Prev</a></li>`;
    } else {
        str += `<li class="disable">Prev</li>`;
    }


    for (let i = 1; i <= total; i++) {
        if (Number(page.currentPage) === i) {
            str += `<li class="active"><a href="#" data-page="${i}">${i}</a></li>`;
        } else {
            str += `<li><a href="#" data-page="${i}">${i}</a></li>`;
        }
    };


    if (page.hasNext) {
        str += `<li class="next"><a href="#" data-page="${Number(page.currentPage) + 1}">Next</a></li>`;
    } else {
        str += `<li class="disable">Next</li>`;
    }

    pagination.innerHTML = str;
}


//監聽選單
select.addEventListener('change', (e) => {
    let location = '';
    let selectItem = [];
    jsonData.forEach((item) => {
        if (e.target.value === item.Zone) {
            selectItem.push(item);
            location = item.Zone;
        }
    })
    title.innerHTML = location;
    renderContent(selectItem, 1);
});


//監聽熱門推薦
btn.addEventListener('click', (e) => {
    let location = '';
    let hotItem = [];
    jsonData.forEach((item) => {
        if (e.target.textContent === item.Zone) {
            hotItem.push(item);
            location = item.Zone;
        }
    })
    title.innerHTML = location;
    renderContent(hotItem, 1);
});

//監聽分頁
pagination.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.nodeName !== 'A') return;
    const page = e.target.dataset.page;
    renderContent(jsonData, page);
});

