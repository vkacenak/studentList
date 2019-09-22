"use strict";

let i;

let expelledStudents = [];
let studentListArr = [];
init();

function init() {

    // define fetch links
    const link1 = "https://petlatkea.dk/2019/hogwartsdata/students.json";
    const link2 = "https://petlatkea.dk/2019/hogwartsdata/families.json";

    JSONFetch(link1, link2);
    bodyEventListeners();
}

function bodyEventListeners() {

    const sortElements = document.querySelectorAll(".sort-element");
    sortElements.forEach(e => {
        e.addEventListener("click", sortStudents);
    });

    const filterElements = document.querySelectorAll(".filter-element");
    filterElements.forEach(e => {
        e.addEventListener("click", e => {

            filterStudents(e, studentListArr);
        });
    });
    // special case for displaying expelled students
    const expelledElement = document.querySelector(".expelled-element")
    expelledElement.addEventListener("click", () => {
        displayStudents(expelledStudents);
    });
}

function JSONFetch(link1, link2) {
    // Fetch request (is from stack overflow) for both student list and pure/half blood families
    // This probably may not be the smartest solution, I need to get back later to subject of fetching from multiple files
    let request = new XMLHttpRequest();
    request.open('GET', link1, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            let data = JSON.parse(request.responseText);

            // SECOND FETCH 
            let request2 = new XMLHttpRequest();
            request2.open('GET', link2, true);
            request2.onload = function () {
                if (request2.status >= 200 && request2.status < 400) {
                    // Success!
                    let blood = JSON.parse(request2.responseText);
                    // function call for creating Student Objects
                    createObjects(data, blood);
                }
            };
            request2.send();
            // END OF SECOND FETCH

        }
    };
    request.send();
}

function createObjects(data, blood) {

    console.log(blood);
    data.forEach(data => {
        const student = Object.create(Student);

        // BASIC POPULATION OF OBJECT
        student.fullName = data.fullname;
        student.house = data.house.trim();
        student.id = create_UUID();

        // COSMETIC CHANGES TO NAME
        formatNames(student);

        //BLOOD STATUS
        setBloodStatus(student, blood)

        //PUSH TO ARRAY
        studentListArr.push(student);

    });

    //INJECT HAGRID TO STUDENTS
    hackingTime();

    countStudents(studentListArr);
    displayStudents(studentListArr);
    displayEdit(studentListArr[0]);
    console.log(studentListArr);
}


function displayStudents(studentListArr) {
    const studentsTemplate = document.querySelector(".student-template").content;
    const studentsTable = document.querySelector(".list__table__wrapper");

    console.log(studentListArr);
    studentsTable.textContent = "";
    studentListArr.forEach(student => {
        let clone = studentsTemplate.cloneNode(true);
        clone.querySelector(".student-firstName").textContent = student.firstName;
        clone.querySelector(".student-lastName").textContent = student.lastName;
        clone.querySelector(".student-house").textContent = student.house;
        clone.querySelector(".list__table__student").id = student.id;
        clone.querySelector(".student-photo").src = "images/" + student.imageName;
        clone.querySelector(".student-photo").addEventListener("error", function () {

            this.src = 'images/no-image.png';
        });
        if (student.isPure == "yes") {
            clone.querySelector(".student-blood").style.opacity = 1;
        } else if (student.isPure == "half") {
            clone.querySelector(".student-blood").src = "icons/half-blood.png";
        } else {
            clone.querySelector(".student-blood").style.opacity = 0.15;
        }
        if (student.isPrefect == true) {
            clone.querySelector(".student-badge").style.opacity = 1;
        } else {
            clone.querySelector(".student-badge").style.opacity = 0.2;
        }
        if (student.isInquisitory == true) {
            clone.querySelector(".student-inquisitory").textContent = "YES";
        } else {
            clone.querySelector(".student-inquisitory").textContent = "NO";
        }

        // event listener for edit button on displaying student in modal on the right
        clone.querySelector(".list__table__student").addEventListener("mouseover", function () {
            this.querySelector(".student-edit").textContent = "Edit";
            this.querySelector(".student-edit").classList.add("student-edit-move");

        })
        clone.querySelector(".list__table__student").addEventListener("mouseout", function () {
            this.querySelector(".student-edit").textContent = "";
            this.querySelector(".student-edit").classList.remove("student-edit-move");
        })


        clone.querySelector(".student-edit").addEventListener("click", function () {
            let id = student.id;
            const studentDetail = findStudentByID(id, studentListArr);
            console.log(studentDetail);
            displayEdit(studentDetail);
        });


        studentsTable.appendChild(clone);
    });


}


function displayEdit(studentDetail) {
    const editTemplate = document.querySelector(".edit-template").content;
    const editWrapper = document.querySelector(".info__details__wrapper");

    editWrapper.innerHTML = "";

    let clone = editTemplate.cloneNode(true);

    clone.querySelector(".info__details__photo").src = "images/" + studentDetail.imageName;
    clone.querySelector(".info__details__photo").addEventListener("error", function () {
        this.src = 'images/no-image.png';
    });
    clone.querySelector(".info__details__body").id = studentDetail.id;

    let crestImage = "icons/" + studentDetail.house + ".png";
    clone.querySelector(".info__details__crest").src = crestImage;

    if (studentDetail.isPure == "yes") {
        clone.querySelector(".detail-blood").style.opacity = 1;
        clone.querySelector(".detail-blood").src = "icons/pure-blood.png";
    } else if (studentDetail.isPure == "half") {
        clone.querySelector(".detail-blood").style.opacity = 1;
        clone.querySelector(".detail-blood").src = "icons/half-blood.png";
    } else {
        clone.querySelector(".detail-blood").style.opacity = 0.15;
        clone.querySelector(".detail-blood").src = "icons/pure-blood.png";

    }
    if (studentDetail.isPrefect == true) {
        clone.querySelector(".detail-badge").style.opacity = 1;

    } else {
        clone.querySelector(".detail-badge").style.opacity = 0.2;
        clone.querySelector(".detail-badge").addEventListener("click", () => {
            updatePrefect(studentDetail);
        });
    }
    if (studentDetail.isInquisitory == true) {
        clone.querySelector(".detail-inquisitory").textContent = "YES";
    } else {
        clone.querySelector(".detail-inquisitory").textContent = "NO";
    }

    clone.querySelector(".detail-fullName").textContent = studentDetail.fullName;

    clone.querySelector(".detail-delete").addEventListener("click", () => {
        removeStudent(studentDetail);
    });

    clone.querySelector(".detail-inquisitory").addEventListener("click", () => {
        setInquisitory(studentDetail);
    });

    editWrapper.appendChild(clone);

}

function removeStudent(studentDetail) {
    // find studentobject in whole student list
    let index = studentListArr.indexOf(studentDetail);
    if (studentDetail.firstName == "Hagrid") {
        let deleteBtn = document.querySelector(".detail-delete");
        deleteBtn.style.position = "fixed";
        deleteBtn.style.top = (Math.random() * 100) + "%";
        deleteBtn.style.left = (Math.random() * 100) + "%";
        deleteBtn.addEventListener("mouseover", function () {

            deleteBtn.style.position = "fixed";
            deleteBtn.style.top = (Math.random() * 100) + "%";
            deleteBtn.style.left = (Math.random() * 100) + "%";

        })



    } else {
        expelledStudents.push(studentListArr[index]);
        studentListArr.splice(index, 1);

        studentNumbers.all -= 1;
        studentNumbers.expelled += 1;
        countStudents(studentListArr);

        document.querySelector(".expelled-img").style.display = "block";
        document.querySelector(".info__details__body").style.position = "relative";


        setTimeout(function () {
            displayStudents(studentListArr);
            displayEdit(studentListArr[0]);

        }, 2000)

    }

}

function setInquisitory(studentDetail) {
    // find student Object in studentArary
    let index = studentListArr.indexOf(studentDetail);
    // if he is worthy being Inquisitory, set him
    if (studentListArr[index].house == "Slytherin" || studentListArr[index].isPure == "yes") {
        console.log(index);
        studentListArr[index].isInquisitory = !studentListArr[index].isInquisitory;
        displayStudents(studentListArr);
        displayEdit(studentListArr[index]);

        // HACKING MODE: after setting him inquisitory, wait x seconds and remove his title again
        setTimeout(function () {
            studentListArr[index].isInquisitory = !studentListArr[index].isInquisitory;
            displayStudents(studentListArr);
        }, 7000);
    }
}

function updatePrefect(studentDetail) {
    // find student in studentList array
    // if there are not 2 prefects already, set him as prefect

    let house = studentDetail.house;
    let index = studentListArr.indexOf(studentDetail);
    console.log(Prefects);

    if (Prefects[house].length == 2) {
        // if there are 2 prefects already
        selectExPrefect();

    } else {
        makePrefect();
    }

    function selectExPrefect() {
        // make a clone of modal and display it
        const modal = document.querySelector(".modal-place");
        modal.innerHTML = "";
        const prefectTemplate = document.querySelector(".modal-template").content;
        console.log(prefectTemplate);
        let clone = prefectTemplate.cloneNode(true);
        console.log(clone);
        clone.querySelector(".close").addEventListener("click", function () {
            modal.innerHTML = "";
        });
        // find 2 prefects that are already in that house and display their names
        const OldPrefects = clone.querySelectorAll(".prefect-name");
        OldPrefects[0].textContent = Prefects[house][0].fullName;
        OldPrefects[0].id = Prefects[house][0].id;

        OldPrefects[1].textContent = Prefects[house][1].fullName;
        OldPrefects[1].id = Prefects[house][1].id;
        console.log(OldPrefects);

        // Create event listeners for each of old prefects, and wait for users to choose the Ex
        OldPrefects.forEach(OldPrefect => {
            OldPrefect.addEventListener("click", e => {
                let exPrefectId = e.target.id;
                let exPrefect = findStudentByID(exPrefectId, studentListArr);
                console.log(exPrefectId);
                let exPrefectIndex = studentListArr.indexOf(exPrefect);
                let inPrefectsIndex = Prefects[house].indexOf(exPrefect);
                Prefects[house].splice(inPrefectsIndex, 1);
                studentListArr[exPrefectIndex].isPrefect = false;
                console.log(studentListArr[exPrefectIndex]);
                modal.innerHTML = "";
                makePrefect();
            });
        });
        // append clone
        modal.appendChild(clone);

    }

    // set the new prefect
    function makePrefect() {
        studentListArr[index].isPrefect = true;
        Prefects[house].push(studentListArr[index]);

        displayEdit(studentListArr[index]);
        displayStudents(studentListArr);
    }
}

function findStudentByID(id, studentListArr) {
    // send the parameter (id) of a student and return the whole object of a student from StudentListArray with find() method
    function findStudent(obj) {
        if (obj.id == id) {
            return true;
        } else {
            return false;
        }

    }
    const found = studentListArr.find(findStudent);

    return found;
}

function sortStudents(elem) {
    // get target of sorting
    let sortBy = elem.target.dataset.value;

    // sort method on student list array
    studentListArr = studentListArr.sort((a, b) => {
        return a[sortBy].localeCompare(b[sortBy]);
    });
    displayStudents(studentListArr);
    console.log(studentListArr);
}

function filterStudents(elem, studentListArr) {
    // get target of sorting
    let filterBy = elem.target.dataset.value;

    // filter method on student list array
    studentListArr = studentListArr.filter(filterByHouse);

    function filterByHouse(student) {
        if (filterBy == "Attending") {
            return true;
        }
        if (student.house == filterBy) {
            return true;
        } else return false;
    }
    displayStudents(studentListArr);
    console.log(studentListArr);
}

function countStudents(studentListArr) {
    studentNumbers.all = studentListArr.length;

    // set all the values to zero
    studentNumbers.Gryffindor = 0;
    studentNumbers.Slytherin = 0;
    studentNumbers.Hufflepuff = 0;
    studentNumbers.Ravenclaw = 0;

    // loop with counters which check the student object properties with each of the houses
    for (i = 0; i < studentListArr.length; i++) {
        switch (studentListArr[i].house) {
            case "Gryffindor":
                studentNumbers.Gryffindor += 1;
                break;
            case "Slytherin":
                studentNumbers.Slytherin += 1;
                break;
            case "Hufflepuff":
                studentNumbers.Hufflepuff += 1;
                break;
            case "Ravenclaw":
                studentNumbers.Ravenclaw += 1;
                break;
        }
    }
    document.querySelector(".attending-value").textContent = studentNumbers.all;
    document.querySelector(".gryffindor-value").textContent = studentNumbers.Gryffindor;
    document.querySelector(".hufflepuff-value").textContent = studentNumbers.Hufflepuff;
    document.querySelector(".ravenclaw-value").textContent = studentNumbers.Ravenclaw;
    document.querySelector(".slytherin-value").textContent = studentNumbers.Slytherin;
    document.querySelector(".expelled-value").textContent = studentNumbers.expelled;
}

function create_UUID() {
    // function from the Internet, returning unique IDs
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

// name separation long boring function

function formatNames(student) {

    // get rid of spaces around strings
    student.fullName = student.fullName.trim();

    // get number of spaces in string
    let i, nSpaces = 0;
    for (i = 0; i < student.fullName.length; i++) {

        if (student.fullName[i] == " ") {
            nSpaces++;

        }
    }

    let spacePos;
    switch (nSpaces) {
        case 0:
            student.firstName = student.fullName;
            break;
        case 1:
            spacePos = student.fullName.indexOf(" ");
            student.lastName = student.fullName.substring(spacePos + 1);
            student.firstName = student.fullName.substring(0, spacePos);
            // capitalize formatted name
            capitalizeNames(student);
            // edit unformatted fullname to formatted
            student.fullName = student.firstName + " " + student.lastName;
            break;

        case 2:
            spacePos = student.fullName.indexOf(" ");
            let lastSpacePos = student.fullName.lastIndexOf(" ");
            student.firstName = student.fullName.substring(0, spacePos);
            if (student.fullName[spacePos + 1] == "\"") {
                student.nickname = student.fullName.substring(spacePos + 2, lastSpacePos - 1);
            } else {
                student.middleName = student.fullName.substring(spacePos + 1, lastSpacePos);
            }
            student.lastName = student.fullName.substring(lastSpacePos + 1);
            // capitalize formatted name
            capitalizeNames(student);
            // edit unformatted fullname to formatted
            student.fullName = student.firstName + " " + student.middleName + student.nickname + " " + student.lastName;
            break;
    }

    function capitalizeNames(student) {
        // set every string property in student object to have first letter capitalized and other lowercase
        for (let prop in student) {
            if (typeof student[prop] == "string") {
                //     if (prop != "isInquisitory" && prop != "isPure" && prop != "isPrefect") {
                student[prop] = student[prop].toLowerCase();
                student[prop] = student[prop].substring(0, 1).toUpperCase() + student[prop].slice(1);
            }

        }
    }
    student.imageName = (student.lastName + "_" + student.firstName[0] + ".png").toLowerCase();


}

function setBloodStatus(student, blood) {
    // check the pure part of the blood heritage and set the students if they are in the list
    for (i = 0; i < blood.pure.length; i++) {
        if (blood.pure[i] == student.lastName)
            student.isPure = "yes";
    }
    // check the half-blooded part of the blood heritage and set the students if they are in the list
    for (i = 0; i < blood.half.length; i++) {
        if (blood.half[i] == student.lastName)
            student.isPure = "half";

    }
    // if none of them are true then they are simply muggles
    for (i = 0; i < studentListArr.length; i++) {
        if (student.isPure !== "yes" && student.isPure !== "half")
            student.isPure = "no";
    }

    // HACKED BLOOD STATUS
    student.isPure = hackingBlood(student);

}


function hackingTime() {
    // create new Student object and populate it
    const hacker = Object.create(Student);
    hacker.id = create_UUID();
    hacker.firstName = "Hagrid";
    hacker.fullName = "Hagrid"
    hacker.lastName = "";
    hacker.house = "Gryffindor";
    hacker.isPure = "yes";

    studentListArr.push(hacker);
}

function hackingBlood(student) {
    // if student is pure then set random status to him
    if (student.isPure == "yes") {
        let random = Math.random();
        if (random > 0.5) {
            return "no"
        } else {
            return "half"
        }
        // if he is muggle, set him to be pure
    } else if (student.isPure == "no") {
        return "yes";
    }
}

// DEFAULT OBJECT STUDENT
const Student = {
    imageName: "",
    firstName: "",
    lastName: "",
    middleName: "",
    nickname: "",
    house: "",
    fullName: "",
    isPure: "no",
    isPrefect: false,
    isInquisitory: false
}

const studentNumbers = {
    all: 0,
    expelled: 0,
    Gryffindor: 0,
    Hufflepuff: 0,
    Slytherin: 0,
    Ravenclaw: 0
}

const Prefects = {
    Gryffindor: [],
    Hufflepuff: [],
    Slytherin: [],
    Ravenclaw: []
}
