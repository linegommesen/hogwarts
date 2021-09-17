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
  prefect: false,
  squad: false,
};

const settings = {
  filterBy: "all",
  sortBy: "firstname",
  sortDir: "asc",
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
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}
function prepareObjects(jsonData) {
  studentArray = jsonData.map(prepareObject);
  buildList();
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
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  setFilter(filter);
}
function setFilter(filter) {
  settings.filterBy = filter;
  buildList(settings.filterBy);
}
function filterList(filteredList) {
  // let filteredList = studentArray;
  if (settings.filterBy === "Gryffindor") {
    filteredList = studentArray.filter(isGryffindor);
  } else if (settings.filterBy === "Slytherin") {
    filteredList = studentArray.filter(isSlytherin);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = studentArray.filter(isRavenclaw);
  } else if (settings.filterBy === "Hufflepuff") {
    filteredList = studentArray.filter(isHufflepuff);
  }
  return filteredList;
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

function selectSort(event) {
  const sortBy = event.target.dataset.sort;

  const sortDir = event.target.dataset.sortDirection;
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  setSort(sortBy, sortDir);
}
function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}

function sortList(sortedList) {
  //   let sortedList = studentArray;
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }
  sortedList = sortedList.sort(sortByClicked);

  function sortByClicked(studentA, studentB) {
    console.log(`sortBy is ${settings.sortBy}`);
    // console.log(studentA, studentB);
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }

  return sortedList;
}
function buildList() {
  const currentList = filterList(studentArray);
  const sortedList = sortList(currentList);

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

  //Prefect
  if (student.prefect === true) {
    if (student.house === "Gryffindor") {
      clone.querySelector("[data-field=prefect] img").src = "prefects/prefect_gryffindor.png";
    } else if (student.house === "Slytherin") {
      clone.querySelector("[data-field=prefect] img").src = "prefects/prefect_slytherin.png";
    } else if (student.house === "Ravenclaw") {
      clone.querySelector("[data-field=prefect] img").src = "prefects/prefect_ravenclaw.png";
    } else {
      clone.querySelector("[data-field=prefect] img").src = "prefects/prefect_hufflepuff.png";
    }
  } else {
    clone.querySelector("[data-field=prefect] img").src = "prefects/prefect.png";
  }
  clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);

  function clickPrefect() {
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      makeNewPrefect(student);
    }
    buildList();
  }

  //Squad
  clone.querySelector("[data-field=squad]").dataset.squad = student.squad;

  clone.querySelector("[data-field=squad]").addEventListener("click", clickSquad);
  function clickSquad() {
    if (student.squad === true) {
      student.squad = false;
    } else {
      student.squad = true;
    }
    buildList();
  }
  clone.querySelector("[data-field=name]").addEventListener("click", clickStudent);
  function clickStudent() {
    document.querySelector("#student_popup").classList.remove("hide");
    document.querySelector(".name").textContent = student.firstname + " " + student.lastname;
    document.querySelector(".squad").textContent = `Member of Inquisitorial squad: ${student.squad}`;
    //show prefect stauts
    if (student.prefect === true) {
      if (student.house === "Gryffindor") {
        document.querySelector(".prefect").src = "prefects/prefect_gryffindor.png";
      } else if (student.house === "Slytherin") {
        document.querySelector(".prefect").src = "prefects/prefect_slytherin.png";
      } else if (student.house === "Ravenclaw") {
        document.querySelector(".prefect").src = "prefects/prefect_ravenclaw.png";
      } else {
        document.querySelector(".prefect").src = "prefects/prefect_hufflepuff.png";
      }
    } else {
      document.querySelector(".prefect").src = "prefects/prefect.png";
    }
    //show house crest
    if (student.house === "Gryffindor") {
      document.querySelector(".crest").src = "crests/newgryffindor.png";
    } else if (student.house === "Slytherin") {
      document.querySelector(".crest").src = "crests/newslytherin.png";
    } else if (student.house === "Hufflepuff") {
      document.querySelector(".crest").src = "crests/newhufflepuff.png";
    } else {
      document.querySelector(".crest").src = "crests/newravenclaw.png";
    }
    // closing the student dialog
    document.querySelector("#student_popup .closebutton").addEventListener("click", closeStudentDialog);
    function closeStudentDialog() {
      document.querySelector("#student_popup").classList.add("hide");
      document.querySelector("#student_popup .closebutton").removeEventListener("click", closeStudentDialog);
    }
  }
  document.querySelector("#list tbody").appendChild(clone);
}

function makeNewPrefect(selectedStudent) {
  const prefects = studentArray.filter((student) => student.prefect);
  const otherPrefects = prefects.filter((student) => student.house === selectedStudent.house);

  //if there is another prefect from that house
  if (otherPrefects[1] !== undefined) {
    // console.log("There can only be two prefect student from each house!");
    console.log(otherPrefects);
    removePrefectAorPrefectB(otherPrefects[0], otherPrefects[1]);
  } else {
    makePrefect(selectedStudent);
  }
  //   //testing
  //   makePrefect(selectedStudent);

  function removePrefectAorPrefectB(prefectA, prefectB) {
    console.log(prefectA, prefectB);
    //ask the user to ignore or remove A or B
    document.querySelector("#remove_prefect").classList.remove("hide");

    //make names appear on buttons
    document.querySelector("#remove_prefect .removea").textContent = `Remove ${prefectA.firstname} ${prefectA.lastname}?`;
    document.querySelector("#remove_prefect .removeb").textContent = `Remove ${prefectB.firstname} ${prefectB.lastname}?`;

    //add eventlistners to buttons
    document.querySelector("#remove_prefect .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_prefect .removea").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_prefect .removeb").addEventListener("click", clickRemoveB);

    // if ignore - do nothing.
    function closeDialog() {
      document.querySelector("#remove_prefect").classList.add("hide");

      document.querySelector("#remove_prefect .closebutton").removeEventListener("click", closeDialog);
      document.querySelector("#remove_prefect .removea").removeEventListener("click", clickRemoveA);
      document.querySelector("#remove_prefect .removeb").removeEventListener("click", clickRemoveB);
    }
    //if removeA
    function clickRemoveA() {
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
    //else if removeB
    function clickRemoveB() {
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }
  function removePrefect(student) {
    student.prefect = false;
  }
  function makePrefect(student) {
    student.prefect = true;
  }
}
