function init() {
    // define links

    // run Fetch Function

    // set up Event Listeners

}

function bodyEventListeners() {
    //event listener for sorting with parameters

    // for filtering with parameters

    // special case for displaying expelled students
}


function JSONFetch(link1, link2) {
    // Fetch request for student list and then pure/half blood families
    // function call for creating Student Objects
}


function createObjects(data, blood) {

    // basic population for each of the student objects with the data from JSON

    // unique ID for each student

    // function for formatting properties in the object

    // finding the blood status according to blood status data from JSON

    // push each object to StudentList Array

    // Inject our hacker to the Array

    // Count the Students

    // Display the list of students

    // Display our modal on the right

}


function displayStudents(studentListArr) {
    // set container to be empty

    // make clone from template

    // populate clone with data from objects in array

    // event listener for edit button on displaying student in modal on the right

    // append to the DOM

}


function displayEdit(studentDetail) {

    // set container to be empty

    // make clone from template

    // populate clone with data from StudentObject

    // Event listener for updating prefect status

    // Event listener for updating inquisitory status

    // Event listener for expelling student

    // append modal
}

function removeStudent(studentDetail) {
    // find studentobject in whole student list

    // check if it isnt the hacker, if it is, dont do anything

    // if its not the hacker
    // make animation of deleting
    //push the student to expelled array
    // remove him from student list
    // update count numbers
    // display count numbers


    //display list again
    //display edit again

}

function setInquisitory(studentDetail) {
    // find student Object in studentArary

    // if he is worthy being Inquisitory, set him


    // HACKING MODE: after setting him inquisitory, wait x seconds and remove his title again
}

function updatePrefect(studentDetail) {
    // find student in studentList array
    // if there are not 2 prefects already, set him as prefect

    // if there are 2 prefects 
    // make a clone of modal and display it
    // find 2 prefects that are already in that house and display their names
    // append clone
    // wait for user to click on one of the names, which removes that student from prefects


}

function findStudentByID(id) {
    // input the id of a student and return the whole object of a student from StudentListArray with find() method
}

function sortStudents(elem) {
    // get target of sorting
    // sort method on student list array
    // display students
}

function filterStudents(elem, studentListArr) {
    //get target of filtering
    // filter method on student list array
    // if target is "attending" then always return true
    // if target is same as student's house, then return true
    // display student array
}

function countStudents(studentListArr) {
    // set all the values to zero
    // loop with counters which check the student object properties with each of the houses

    // appending to DOM
}

function create_UUID() {
  // function from the Internet, returning unique IDs
}

// NAME SEPARATION BORING FUNCTION

function formatNames(student) {
    // getting rid of the first space if there is one

    // check number of spaces in full name

    // if there is zero, thats his full name
    
    // if there is one, divide it between first name and second name, and run function for right casing

    // if there are two, find out whether the middle word is nickname or middle name, divide them and run function for right casing
    
    // for every string property in the student object run the Capitalization of the first letter and lowercasing of other letters in the words

    // make the imagename string
    //NOTE: I KNOW HOW TO MAKE THE EXCEPTION FOR PADMA TWINS, BUT I HAVE DECIDED TO MAKE THE SOLUTION UNIVERSAL AND RATHER CREATE A FALLBACK IMAGE IF THE IMAGE WITH PROPER NAME IS NOT FOUND.

}

function setBloodStatus(student, blood) {
    // check the pure part of the blood heritage and set the students if they are in the list
    // check the half-blooded part of the blood heritage and set the students if they are in the list
   // if none of them are true then they are simply muggles

   // HACK IT

}


function hackingTime() {
   // create new Student object and populate it
}

function hackingBlood(student) {
  // if student is pure then set random status to him

    // if he is muggle, set him to be pure
}

