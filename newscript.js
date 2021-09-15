"use strict";

window.addEventListener("load", start);

let studentArray = [];

const Student = {
  firstname: "",
  lastname: "",
  middlename: "",
  nickname: "",
  house: "",
  gender: "",
};
function start() {
  console.log("ready");
  loadJson();
}
async function loadJson() {
  const response = await fetch(`https://petlatkea.dk/2021/hogwarts/students.json`);
  const jsonData = await response.json();
  //   console.log(jsonData);

  addEventlisteners();
  prepareObjects(jsonData);
}
function addEventlisteners() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", setFilter));

  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", setSort));
}
function prepareObjects(jsonData) {
  studentArray = jsonData.map(prepareObject);

  displayList(studentArray);
}
function prepareObject(jsonObject) {
  const student = Object.create(Student);

  const name = getNameParts(jsonObject.fullname);
  const cleanedHouse = getHouse(jsonObject.house);
  student.firstname = name.firstNameUppercase;
  student.middlename = name.middleNameUppercase;
  student.lastname = name.lastNameUppercase;
  student.house = cleanedHouse;
  student.gender = jsonObject.gender;

  //   console.log(student);
  return student;
}
function getNameParts(fullname) {
  const trimmedName = fullname.trim();

  const firstName = trimmedName.substring(0, trimmedName.indexOf(" "));
  const firstNameUppercase = firstName.substring(0, 1).toUpperCase() + firstName.substring(1);

  const lastName = trimmedName.substring(trimmedName.lastIndexOf(" ") + 1).toLowerCase();
  const lastNameUppercase = lastName.substring(0, 1).toUpperCase() + lastName.substring(1);

  const middleName = trimmedName.substring(trimmedName.indexOf(" ") + 1, trimmedName.lastIndexOf(" ")).toLowerCase();
  let middleNameUppercase = middleName.substring(1, 0).toUpperCase() + middleName.substring(1);
  if (middleNameUppercase === " ") {
    middleNameUppercase = undefined;
  } else if (middleNameUppercase === "") {
    middleNameUppercase = undefined;
  }

  return {
    firstNameUppercase,
    middleNameUppercase,
    lastNameUppercase,
  };
}
function getHouse(house) {
  const trimmedHouse = house.trim();
  // const lowerCase = trimmedHouse.toLowerCase();
  const cleanedHouse = trimmedHouse[0].toUpperCase() + trimmedHouse.substring(1).toLowerCase();
  return cleanedHouse;
}
//filtering
function setFilter(event) {
  const filter = event.target.dataset.filter;
  filterList(filter);
}
function filterList(studentHouse) {
  let filteredList = studentArray;
  if (studentHouse === "Gryffindor") {
    filteredList = studentArray.filter(isGryffindor);
  } else if (studentHouse === "Slytherin") {
    filteredList = studentArray.filter(isSlytherin);
  } else if (studentHouse === "Ravenclaw") {
    filteredList = studentArray.filter(isRavenclaw);
  } else if (studentHouse === "Hufflepuff") {
    filteredList = studentArray.filter(isHufflepuff);
  }
  displayList(filteredList);
}
function isGryffindor(student) {
  return student.house === "Gryffindor";
}
function isSlytherin(student) {
  return student.house === "Slytherin";
}
function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}
function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}
//sorting
function setSort(event) {
  const sortBy = event.target.dataset.sort;

  const sortDir = event.target.dataset.sortDirection;
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  sortList(sortBy, sortDir);
}

function sortList(sortBy, sortDir) {
  let sortedList = studentArray;
  let direction = 1;
  if (sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortByClicked);

  function sortByClicked(studentA, studentB) {
    console.log(`sortBy is ${sortBy}`);
    // console.log(studentA, studentB);
    if (studentA[sortBy] < studentB[sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  displayList(sortedList);
}
//visual
function displayList(students) {
  document.querySelector("#list tbody").innerHTML = "";

  students.forEach(displayStudent);
}
function displayStudent(student) {
  const clone = document.querySelector("template").content.cloneNode(true);

  clone.querySelector("[data-field=name]").textContent = student.firstname + " " + student.lastname;
  clone.querySelector("[data-field=house]").textContent = student.house;
  //   clone.querySelector(".gender").textContent = student.gender;

  document.querySelector("#list tbody").appendChild(clone);
}
