"use strict";

window.addEventListener("load", start);

let studentArray = [];
let expelledStudentsArray = [];
// let bloodStatusArray = [];
let bloodData;

const Student = {
  firstname: "",
  lastname: "",
  middlename: "",
  nickname: "",
  house: "",
  gender: "",
  prefect: false,
  squad: false,
  expelled: false,
  image: "",
  bloodstatus: "",
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
  const bloodResponse = await fetch(`https://petlatkea.dk/2021/hogwarts/families.json`);
  bloodData = await bloodResponse.json();

  const response = await fetch(`https://petlatkea.dk/2021/hogwarts/students.json`);
  const jsonData = await response.json();

  addEventlisteners();

  prepareObjects(jsonData);
}

function addEventlisteners() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));

  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));

  document.querySelector("#search").addEventListener("input", searchField);
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
  student.image = getImage(student.firstname, student.lastname);
  student.bloodstatus = getBloodStatus(student.lastname);

  // console.log(student);
  return student;
}
function getNameParts(fullname) {
  const trimmedName = fullname.trim();

  const firstName = trimmedName.substring(0, trimmedName.indexOf(" ")).toLowerCase();
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
function getImage(firstname, lastname) {
  let imgName;
  if (lastname === "Patil") {
    if (firstname === "Padma") {
      imgName = "patil_padma.png";
    } else {
      imgName = "patil_parvati.png";
    }
    return imgName;
  } else {
    const firstnameLower = firstname.substring(1, 0).toLowerCase();
    const lastnameLower = lastname.toLowerCase();
    imgName = `${lastnameLower}_${firstnameLower}.png`;
    return imgName;
  }
}
function getBloodStatus(lastname) {
  // console.log(bloodData);
  let bloodstatus;
  if (bloodData.half.includes(`${lastname}`)) {
    bloodstatus = "Halfblood";
  } else if (bloodData.pure.includes(`${lastname}`)) {
    bloodstatus = "Pureblood";
  } else {
    bloodstatus = "Mudblood";
  }
  return bloodstatus;
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
  } else if (settings.filterBy === "Expelled") {
    filteredList = expelledStudentsArray;
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
//searchfield
function searchField() {
  const searchWord = document.querySelector("#search").value.toLowerCase();
  const filteredSearch = studentArray.filter((student) => {
    return student.firstname.toLowerCase().includes(searchWord) || student.lastname.toLowerCase().includes(searchWord);
  });
  displayList(filteredSearch);
}

//visual
function displayList(students) {
  document.querySelector("#list tbody").innerHTML = "";

  //Counters
  document.querySelector(".studentnumber").textContent = `Number of students: ${studentArray.length}`;
  document.querySelector(".displayednumber").textContent = `Currently displayed: ${students.length}`;
  document.querySelector(".expellednumber").textContent = `Expelled students: ${expelledStudentsArray.length}`;

  //Counters for houses
  document.querySelector(".gryffindornumber").textContent = "Gryffindor: " + studentArray.filter((student) => student.house === "Gryffindor").length;
  document.querySelector(".slytherinnumber").textContent = "Slytherin: " + studentArray.filter((student) => student.house === "Slytherin").length;
  document.querySelector(".hufflepuffnumber").textContent = "Huifflepuff: " + studentArray.filter((student) => student.house === "Hufflepuff").length;
  document.querySelector(".ravenclawnumber").textContent = "Ravenclaw: " + studentArray.filter((student) => student.house === "Ravenclaw").length;

  students.forEach(displayStudent);
}
function displayStudent(student) {
  const clone = document.querySelector("template").content.cloneNode(true);

  clone.querySelector("[data-field=firstname]").textContent = student.firstname;
  clone.querySelector("[data-field=lastname]").textContent = student.lastname;
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
  if (student.squad === true) {
    clone.querySelector("[data-field=squad] img").src = "squad/squad-03.png";
  } else {
    clone.querySelector("[data-field=squad] img").src = "squad/squad-02.png";
  }

  clone.querySelector("[data-field=squad]").addEventListener("click", clickSquad);
  function clickSquad() {
    if (student.squad === true) {
      student.squad = false;
    } else {
      student.squad = true;
    }
    buildList();
  }

  //Expell
  clone.querySelector("[data-field=expelled]").dataset.expelled = student.expelled;
  clone.querySelector("[data-field=expelled]").addEventListener("click", clickExpelled);
  function clickExpelled() {
    student.expelled = true;
    // clone.querySelector("[data-field=expelled] p").textContent = `Expelled`;

    //get index of clicked student
    const expelledStudent = studentArray.indexOf(student);

    //splice student from array
    studentArray.splice(expelledStudent, 1);

    //add student to expelled student array
    expelledStudentsArray.unshift(student);

    //show new list
    buildList();
  }

  //student pop-up
  clone.querySelector("[data-field=firstname]").addEventListener("click", clickStudent);
  clone.querySelector("[data-field=lastname]").addEventListener("click", clickStudent);
  function clickStudent() {
    document.querySelector("#student_popup").classList.remove("hide");

    //show the right styling according to house
    if (student.house === "Gryffindor") {
      document.querySelector(".student_dialog").classList.add("gryffindor_dialog");
    } else if (student.house === "Slytherin") {
      document.querySelector(".student_dialog").classList.add("slytherin_dialog");
    } else if (student.house === "Ravenclaw") {
      document.querySelector(".student_dialog").classList.add("ravenclaw_dialog");
    } else {
      document.querySelector(".student_dialog").classList.add("hufflepuff_dialog");
    }

    document.querySelector(".name").textContent = student.firstname + " " + student.lastname;
    document.querySelector(".middlename").textContent = `Middlename: ${student.middlename}`;
    document.querySelector(".bloodstatus").textContent = `Bloodstatus: ${student.bloodstatus}`;

    //show expelled status
    if (student.expelled === true) {
      document.querySelector(".expelled").textContent = `Expelled: True`;
    }

    //image
    document.querySelector(".image").src = `images/${student.image}`;

    //show squad status
    if (student.squad === true) {
      document.querySelector(".squad").src = "squad/squad-03.png";
    } else {
      document.querySelector(".squad").src = "squad/squad-02.png";
    }

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

      //remove the styling according to house
      document.querySelector(".student_dialog").classList.remove("gryffindor_dialog");
      document.querySelector(".student_dialog").classList.remove("slytherin_dialog");
      document.querySelector(".student_dialog").classList.remove("ravenclaw_dialog");
      document.querySelector(".student_dialog").classList.remove("hufflepuff_dialog");
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
