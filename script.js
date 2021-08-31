let students;

const url = "https://petlatkea.dk/2021/hogwarts/students.json";

async function getJson() {
  const data = await fetch(url);
  students = await data.json();
  console.log(students);

  showStudents();
}
function showStudents() {
  let temp = document.querySelector("template");
  let container = document.querySelector(".container");
  container.innerHTML = "";
  students.forEach((student) => {
    let clone = temp.cloneNode(true).content;
    clone.querySelector(".name").innerHTML = student.fullname;
    clone.querySelector(".gender").textContent = student.gender;
    clone.querySelector(".house").textContent = student.house;

    container.appendChild(clone);
  });
}
getJson();
