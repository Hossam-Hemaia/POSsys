//sidenav dropdown menu
const sidenavElemnts = document.getElementById("cats");
sidenavElemnts.addEventListener("click", () => {
  let dropdownElements = document.querySelector(".dropdown-container");
  dropdownElements.classList.toggle("dropdown-container_active");
});

// controlling dashboard forms and tables
function closeModal(elem, backdrop) {
  if (elem) {
    elem.classList.remove("open");
  }
  backdrop.classList.remove("open");
  setTimeout(function () {
    backdrop.style.display = "none";
  }, 200);
}

const categoriesLnk = document.getElementById("catsLnk");
const categoriesSec = document.querySelector(".categories-display");

if (categoriesLnk) {
  categoriesLnk.addEventListener("click", (e) => {
    const openedSections = document.querySelectorAll(".open-section");
    for (let section of openedSections) {
      section.classList.remove("open-section");
    }
    categoriesSec.classList.add("open-section");
  });
}
const itemsLnk = document.getElementById("itemsLnk");
const itemsSec = document.querySelector(".items-display");
if (itemsLnk) {
  itemsLnk.addEventListener("click", () => {
    const openedSections = document.querySelectorAll(".open-section");
    for (let section of openedSections) {
      section.classList.remove("open-section");
    }
    itemsSec.classList.add("open-section");
  });
}

const branchLnk = document.getElementById("branchLnk");
const branchSec = document.querySelector(".branches-display");
if (branchLnk) {
  branchLnk.addEventListener("click", () => {
    const openedSections = document.querySelectorAll(".open-section");
    for (let section of openedSections) {
      section.classList.remove("open-section");
    }
    branchSec.classList.add("open-section");
  });
}

const userLnk = document.getElementById("userLnk");
const userSec = document.querySelector(".users-display");
if (userLnk) {
  userLnk.addEventListener("click", () => {
    const openedSections = document.querySelectorAll(".open-section");
    for (let section of openedSections) {
      section.classList.remove("open-section");
    }
    userSec.classList.add("open-section");
  });
}

const roleLnk = document.getElementById("roleLnk");
const roleSec = document.querySelector(".roles-display");
if (roleLnk) {
  roleLnk.addEventListener("click", () => {
    const openedSections = document.querySelectorAll(".open-section");
    for (let section of openedSections) {
      section.classList.remove("open-section");
    }
    roleSec.classList.add("open-section");
  });
}
// modal and backdrop styling code for Categories
const addCategoryBtn = document.getElementById("catBtn");
const catBackdrop = document.getElementById("catBackDrop");
const catModal = document.getElementById("catModal");

if (addCategoryBtn) {
  addCategoryBtn.addEventListener("click", () => {
    catModal.classList.add("open");
    catBackdrop.style.display = "block";
    setTimeout(function () {
      catBackdrop.classList.add("open");
    }, 10);
  });
}

catBackdrop.addEventListener("click", () => {
  closeModal(catModal, catBackdrop);
});
//////////////////////////////////////////////////////////
const addItemBtn = document.getElementById("itemBtn");
const itemBackdrop = document.getElementById("itemBackDrop");
const itemModal = document.getElementById("itemModal");

if (addItemBtn) {
  addItemBtn.addEventListener("click", () => {
    itemModal.classList.add("open");
    itemBackdrop.style.display = "block";
    setTimeout(function () {
      itemBackdrop.classList.add("open");
    }, 10);
  });
}

itemBackdrop.addEventListener("click", () => {
  closeModal(itemModal, itemBackdrop);
});
////////////////////////////////////////////////////////
const addBranchBtn = document.getElementById("branchBtn");
const branchBackdrop = document.getElementById("branchBackDrop");
const branchModal = document.getElementById("branchModal");

if (addBranchBtn) {
  addBranchBtn.addEventListener("click", () => {
    branchModal.classList.add("open");
    branchBackdrop.style.display = "block";
    setTimeout(function () {
      branchBackdrop.classList.add("open");
    }, 10);
  });
}

branchBackdrop.addEventListener("click", () => {
  closeModal(branchModal, branchBackdrop);
});
//////////////////////////////////////////////////////////
const addUserBtn = document.getElementById("userBtn");
const userBackdrop = document.getElementById("userBackDrop");
const userModal = document.getElementById("userModal");

if (addUserBtn) {
  addUserBtn.addEventListener("click", () => {
    userModal.classList.add("open");
    userBackdrop.style.display = "block";
    setTimeout(function () {
      userBackdrop.classList.add("open");
    }, 10);
  });
}

userBackdrop.addEventListener("click", () => {
  closeModal(userModal, userBackdrop);
});
//////////////////////////////////////////////////////////
const addRoleBtn = document.getElementById("roleBtn");
const roleBackdrop = document.getElementById("roleBackDrop");
const roleModal = document.getElementById("roleModal");

if (addRoleBtn) {
  addRoleBtn.addEventListener("click", () => {
    roleModal.classList.add("open");
    roleBackdrop.style.display = "block";
    setTimeout(function () {
      roleBackdrop.classList.add("open");
    }, 10);
  });
}

roleBackdrop.addEventListener("click", () => {
  closeModal(roleModal, roleBackdrop);
});

// action and cancel buttons behaviour
const submitBtns = document.querySelectorAll(".submit-btn");
const cancelBtns = document.querySelectorAll(".cancel-btn");
for (let i = 0; i < submitBtns.length; ++i) {
  submitBtns[i].addEventListener("click", () => {
    closeModal(roleModal, roleBackdrop);
    closeModal(userModal, userBackdrop);
    closeModal(branchModal, branchBackdrop);
  });
}
