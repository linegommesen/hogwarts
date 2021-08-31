let students;

const url = "https://petlatkea.dk/2021/hogwarts/students.json";

async function getJson() {
  const data = await fetch(url);
  students = await data.json();
  console.log(students);

  showStudents();
  //   spellRight();
}
function showStudents() {
  let temp = document.querySelector("template");
  let container = document.querySelector(".container");
  container.innerHTML = "";
  students.forEach((student) => {
    let clone = temp.cloneNode(true).content;
    clone.querySelector(".name").innerHTML = student.fullname.toLowerCase();
    clone.querySelector(".gender").textContent = student.gender.toLowerCase();
    clone.querySelector(".house").textContent = student.house.toLowerCase();
    // spellRight();
    // function spellRight() {
    //   const lowerCase = ".name".toLowerCase();
    //   const upperCase = ".name"[0].toUpperCase() + lowerCase.substring(1);
    //   console.log(upperCase);
    //   ".name".innerHTML = `${upperCase}`;
    // }

    container.appendChild(clone);
  });
}

getJson();
