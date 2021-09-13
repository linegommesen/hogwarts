"use strict";

window.addEventListener("load", loadJson);

let studentArray = [];
const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  house: "",
};
function loadJson() {
  fetch(`https://petlatkea.dk/2021/hogwarts/students.json`)
    .then((response) => response.json())
    .then((data) => convertToArray(data));
}
function convertToArray(data) {
  let list = document.querySelector(".list");
  data.forEach((element) => {
    const student = Object.create(Student);

    const name = getNameParts(element.fullname);
    console.log(name);
    student.firstname = name.firstNameUppercase;
    student.middlename = name.middleNameUppercase;
    student.lastname = name.lastNameUppercase;
    studentArray.push(student);
  });
}
console.log("studentArray", studentArray);

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
