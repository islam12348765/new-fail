// ! CRUD
const api = "http://localhost:8000/products";

let searchValue = "";

// ! Create
let inpName = $(".inp-name");
let inpDesc = $(".inp-desc");
let inpPrice = $(".inp-price");
let inpImage = $(".inp-image");
let selectMemory = $(".select-memory");
let selectColor = $(".select-color");
let addForm = $(".add-form");

addForm.on("submit", async (event) => {
  event.preventDefault();
  let name = inpName.val().trim();
  let desc = inpDesc.val().trim();
  let price = parseInt(inpPrice.val().trim());
  let image = inpImage.val().trim();
  let memory = selectMemory.val();
  let color = selectColor.val();
  let newPhone = {
    name: name,
    desc: desc,
    price: price,
    image: image,
    memory: memory,
    color: color,
  };
  for (let key in newPhone) {
    if (!newPhone[key]) {
      alert("Заполните все поля");
      return;
    }
  }
  const response = await fetch(api, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newPhone),
  });
  inpName.val("");
  inpDesc.val("");
  inpPrice.val("");
  inpImage.val("");
  selectMemory.val("");
  selectColor.val("");
  Toastify({
    text: "Успешно добавлено",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "green",
    },
  }).showToast();
  getProducts();
});

// ! READ
let productsList = $(".products-list");

async function getProducts() {
  const response = await fetch(`${api}?q=${searchValue}`);
  const data = await response.json();

  // ! pagination start
  let first = currentPage * postsPerPage - postsPerPage;
  let last = currentPage * postsPerPage;
  const currentProducts = data.slice(first, last);
  lastPage = Math.ceil(data.length / postsPerPage);

  // ! Делаем визульно нерабочими кнопки
  if (currentPage === 1) {
    prevBtn.addClass("disabled");
  } else {
    prevBtn.removeClass("disabled");
  }

  if (currentPage === lastPage) {
    nextBtn.addClass("disabled");
  } else {
    nextBtn.removeClass("disabled");
  }
  // ! pagination end

  productsList.html("");
  currentProducts.forEach((item) => {
    productsList.append(`
    <div class="card m-3" style="width: 320px">
      <img src="${item.image}" class="card-img-top card-image">
      <div class="card-body">
        <h5 class="card-title">${item.name}</h5>
        <p class="card-text card-description">${item.desc}</p>
        <h6>Память: ${item.memory}</h6>
        <h6>Цена: ${item.price} сом</h6>
        <button class="btn-delete" id="${item.id}">
          <img src="https://cdn-icons-png.flaticon.com/512/3221/3221897.png">
        </button>
        <button id="${item.id}" class="btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal"
        >
        <img src="https://cdn-icons.flaticon.com/png/512/738/premium/738880.png?token=exp=1648129071~hmac=4d9c522fee725cca71d3b648477a7e70">
        </button>
      </div>
    </div>
    `);
  });
}
getProducts();

// ! Delete

$(document).on("click", ".btn-delete", async (event) => {
  let id = event.currentTarget.id;
  await fetch(`${api}/${id}`, {
    method: "DELETE",
  });
  getProducts();
  Toastify({
    text: "Успешно удалено",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "green",
    },
  }).showToast();
});

// ! UPDATE
let editInpName = $(".edit-inp-name");
let editInpDesc = $(".edit-inp-desc");
let editInpPrice = $(".edit-inp-price");
let editInpImage = $(".edit-inp-image");
let editSelectMemory = $(".edit-select-memory");
let editSelectColor = $(".edit-select-color");
let editForm = $(".edit-form");
let editModal = $(".modal");

$(document).on("click", ".btn-edit", async (event) => {
  let id = event.currentTarget.id;
  editForm.attr("id", id);
  const response = await fetch(`${api}/${id}`);
  const data = await response.json();
  editInpName.val(data.name);
  editInpDesc.val(data.desc);
  editInpPrice.val(data.price);
  editInpImage.val(data.image);
  editSelectMemory.val(data.memory);
  editSelectColor.val(data.color);
});
editForm.on("submit", async (event) => {
  event.preventDefault();
  let name = editInpName.val().trim();
  let desc = editInpDesc.val().trim();
  let price = editInpPrice.val().trim();
  let image = editInpImage.val().trim();
  let memory = editSelectMemory.val();
  let color = editSelectColor.val();
  let editedPhone = {
    name: name,
    desc: desc,
    price: price,
    image: image,
    memory: memory,
    color: color,
  };
  let id = event.currentTarget.id;
  await fetch(`${api}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedPhone),
  });
  getProducts();
  editModal.modal("hide");
  Toastify({
    text: "Успешно изменено",
    duration: 3000,
    newWindow: true,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "left", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    style: {
      background: "green",
    },
  }).showToast();
});

// ! Pagination
let prevBtn = $(".prev-btn");
let nextBtn = $(".next-btn");

let postsPerPage = 4;
let currentPage = 1;
let lastPage = 1;

nextBtn.on("click", () => {
  if (lastPage === currentPage) {
    return;
  }
  currentPage++;
  getProducts();
  window.scrollTo(0, 0);
});

prevBtn.on("click", () => {
  if (currentPage === 1) {
    return;
  }
  currentPage--;
  getProducts();
  window.scrollTo(0, 0);
});

// ! live search
let searchInp = $(".inp-search");

searchInp.on("input", (event) => {
  searchValue = event.target.value;
  currentPage = 1;
  getProducts();
});
