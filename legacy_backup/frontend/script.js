/*
    JavaScript file for Human Digital Twin

    This file handles:

    1. Opening dashboard sections
    2. Showing input fields
    3. Saving information
    4. Sending data to backend
*/


// ====================================================
// CURRENT SECTION
// ====================================================

// This variable stores which section
// the user is currently viewing.
// Store the currently selected person's name
let currentUserName = localStorage.getItem("userName") || "";

let currentSection = "";


// ====================================================
// OPEN SECTION
// ====================================================

// This function runs when a dashboard
// card is clicked.

function openSection(section) {


    // Store selected section
    currentSection = section;


    // Hide dashboard
    document.getElementById("dashboardPage")
        .classList.add("hidden");


    // Show detail page
    document.getElementById("detailPage")
        .classList.remove("hidden");


    // Create the required form
    createForm(section);

}


// ====================================================
// SHOW DASHBOARD
// ====================================================

function showDashboard() {


    // Show dashboard
    document.getElementById("dashboardPage")
        .classList.remove("hidden");


    // Hide detail page
    document.getElementById("detailPage")
        .classList.add("hidden");

}


// ====================================================
// CREATE FORM
// ====================================================

// This function creates the form depending
// on which dashboard card was selected.

function createForm(section) {


    // Variable for form content
    let content = "";

    // Variable for title
    let title = "";


    // =================================================
    // PERSONAL DETAILS
    // =================================================

    if (section === "personal") {

        title = "Personal Details";

        content = `

            <h2>Personal Details</h2>

            <label>Name</label>

            <input type="text"
                   id="name"
                   placeholder="Enter your name">


            <label>Age</label>

            <input type="number"
                   id="age"
                   placeholder="Enter your age">


            <label>Gender</label>

            <select id="gender">

                <option value="">
                    Select Gender
                </option>

                <option value="Male">
                    Male
                </option>

                <option value="Female">
                    Female
                </option>

                <option value="Other">
                    Other
                </option>

            </select>


            <label>Height (cm)</label>

            <input type="number"
                   id="height"
                   placeholder="Enter height">


            <label>Weight (kg)</label>

            <input type="number"
                   id="weight"
                   placeholder="Enter weight">


            <label>Blood Group</label>

            <input type="text"
                   id="bloodGroup"
                   placeholder="Example: O+">


            <label>Date of Birth</label>

            <input type="date"
                   id="dob">


            <label>Occupation</label>

            <input type="text"
                   id="occupation"
                   placeholder="Example: Student">


            <label>Education</label>

            <input type="text"
                   id="education"
                   placeholder="Example: B.Tech CSE">


            <label>Emergency Contact</label>

            <input type="text"
                   id="emergencyContact"
                   placeholder="Enter contact">

        `;

    }


    // =================================================
    // PHYSICAL HEALTH
    // =================================================

    else if (section === "physical") {

        title = "Physical Health";

        content = `

            <h2>Physical Health</h2>

            <label>Heart Rate (BPM)</label>

            <input type="number"
                   id="heartRate"
                   placeholder="Example: 72">


            <label>Blood Pressure</label>

            <input type="text"
                   id="bloodPressure"
                   placeholder="Example: 120/80">


            <label>Oxygen Level (%)</label>

            <input type="number"
                   id="oxygenLevel"
                   placeholder="Example: 98">


            <label>Blood Sugar</label>

            <input type="number"
                   id="bloodSugar">


            <label>Cholesterol</label>

            <input type="number"
                   id="cholesterol">


            <label>Height (cm)</label>

            <input type="number"
                   id="height"
                   placeholder="Enter height">


            <label>Weight (kg)</label>

            <input type="number"
                   id="weight"
                   placeholder="Enter weight">

        `;

    }


    // =================================================
    // FITNESS
    // =================================================

    else if (section === "fitness") {

        title = "Fitness & Lifestyle";

        content = `

            <h2>Fitness & Lifestyle</h2>

            <label>Daily Steps</label>

            <input type="number"
                   id="steps"
                   placeholder="Example: 7000">


            <label>Walking Distance (km)</label>

            <input type="number"
                   id="walkingDistance">


            <label>Active Calories</label>

            <input type="number"
                   id="activeCalories">


            <label>Inactive Time (hours)</label>

            <input type="number"
                   id="inactiveTime">


            <label>Water Intake (litres)</label>

            <input type="number"
                   id="waterIntake">


            <label>Nutrition</label>

            <textarea id="nutrition"
                      placeholder="Enter your diet information">
            </textarea>

        `;

    }


    // =================================================
    // MENTAL HEALTH
    // =================================================

    else if (section === "mental") {

        title = "Mental Health";

        content = `

            <h2>Mental Health</h2>

            <label>Stress Level (%)</label>

            <input type="number"
                   id="stress"
                   min="0"
                   max="100">


            <label>Anxiety Level (%)</label>

            <input type="number"
                   id="anxiety"
                   min="0"
                   max="100">


            <label>Burnout Level (%)</label>

            <input type="number"
                   id="burnout"
                   min="0"
                   max="100">


            <label>Mindfulness (%)</label>

            <input type="number"
                   id="mindfulness"
                   min="0"
                   max="100">

        `;

    }


    // =================================================
    // EMOTIONAL HEALTH
    // =================================================

    else if (section === "emotional") {

        title = "Emotional Health";

        content = `

            <h2>Emotional Health</h2>

            <label>Happiness (%)</label>

            <input type="number"
                   id="happiness"
                   min="0"
                   max="100">


            <label>Anger (%)</label>

            <input type="number"
                   id="anger"
                   min="0"
                   max="100">


            <label>Fear (%)</label>

            <input type="number"
                   id="fear"
                   min="0"
                   max="100">


            <label>Confidence (%)</label>

            <input type="number"
                   id="confidence"
                   min="0"
                   max="100">


            <label>Motivation (%)</label>

            <input type="number"
                   id="motivation"
                   min="0"
                   max="100">

        `;

    }


    // =================================================
    // PERSONALITY
    // =================================================

    else if (section === "personality") {

        title = "Personality";

        content = `

            <h2>Personality</h2>

            <label>Personality Type</label>

            <select id="personality">

                <option value="">
                    Select Type
                </option>

                <option value="Introvert">
                    Introvert
                </option>

                <option value="Extrovert">
                    Extrovert
                </option>

                <option value="Ambivert">
                    Ambivert
                </option>

            </select>


            <label>Communication (%)</label>

            <input type="number"
                   id="communication"
                   min="0"
                   max="100">


            <label>Leadership (%)</label>

            <input type="number"
                   id="leadership"
                   min="0"
                   max="100">


            <label>Teamwork (%)</label>

            <input type="number"
                   id="teamwork"
                   min="0"
                   max="100">


            <label>Adaptability (%)</label>

            <input type="number"
                   id="adaptability"
                   min="0"
                   max="100">

        `;

    }


    // =================================================
    // EDUCATION AND CAREER
    // =================================================

    else if (section === "education") {

        title = "Education & Career";

        content = `

            <h2>Education & Career</h2>

            <label>Learning Progress (%)</label>

            <input type="number"
                   id="learningProgress"
                   min="0"
                   max="100">


            <label>Skill Development (%)</label>

            <input type="number"
                   id="skillDevelopment"
                   min="0"
                   max="100">


            <label>Study Time (hours)</label>

            <input type="number"
                   id="studyTime">


            <label>Technical Skills</label>

            <textarea id="technicalSkills"
                      placeholder="Example: Python, Java, C++">
            </textarea>


            <label>Coding Skills</label>

            <textarea id="codingSkills">
            </textarea>


            <label>Project Experience</label>

            <textarea id="projectExperience">
            </textarea>

        `;

    }


    // =================================================
    // FINANCIAL
    // =================================================

    else if (section === "financial") {

        title = "Financial Information";

        content = `

            <h2>Financial Information</h2>

            <label>Monthly Income</label>

            <input type="number"
                   id="income">


            <label>Monthly Expenses</label>

            <input type="number"
                   id="expenses">


            <label>Monthly Savings</label>

            <input type="number"
                   id="savings">


            <label>Monthly Budget</label>

            <input type="number"
                   id="budget">


            <label>Investments</label>

            <textarea id="investments"
                      placeholder="Enter investment details">
            </textarea>

        `;

    }


    // Put title on page

    document.getElementById("detailTitle")
        .innerText = title;


    // Put form on page

    document.getElementById("detailContent")
        .innerHTML = content;

}


// ====================================================
// SAVE SECTION
// ====================================================

async function saveSection() {

    // Create object for current section
    let data = {};


    // Get all input fields
    const inputs =
        document.querySelectorAll(
            "#detailContent input, " +
            "#detailContent select, " +
            "#detailContent textarea"
        );


    // Read every input
    inputs.forEach(function(input) {

        data[input.id] = input.value;

    });


    // If Personal Details is being saved,
    // get the person's name
    if (currentSection === "personal") {

        currentUserName =
            document.getElementById("name").value;


        localStorage.setItem(
            "userName",
            currentUserName
        );

    }


    // Add name to every request
    data.name = currentUserName;


    // Send data to backend
    try {

        const response = await fetch(
            "/api/user",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(data)

            }
        );


        const result =
            await response.json();


        document.getElementById("saveMessage")
            .innerText =
            result.message;


    } catch (error) {

        console.log(error);

        document.getElementById("saveMessage")
            .innerText =
            "Unable to save details.";

    }

}
// ====================================================
// SHOW USER NAME ON DASHBOARD
// ====================================================

function showUserName() {

    // Get stored name
    const name =
        localStorage.getItem("userName");


    // If name exists
    if (name) {

        document.getElementById("dashboardUser")
            .innerText =
            `Welcome, ${name}. This is your Digital Twin.`;

    }

}


// Run when website loads
showUserName();