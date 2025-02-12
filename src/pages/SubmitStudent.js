import { useState } from "react";
import { Link } from "react-router-dom";
import OutputContainer from "../components/OutputContainer";

function SubmitStudent() {
    const [output, setOutput] = useState({ nic: "", name: "", address: "", contact: "" });
    const [student, setStudent] = useState({ nic: "", name: "", address: "", contact: "" });
    const [errMessage, setErrMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [submittedStudents, setSubmittedStudents] = useState([]);  // To store submitted student data

    function handleChange(event) {
        const { name, value } = event.target;
        setResponseMessage("");
        setErrMessage("");
        setStudent((prevValue) => {
            return {
                ...prevValue,
                [name]: value
            };
        });
    }

    function handleCheckOut() {
        setErrMessage("");
        setResponseMessage("");
        if (!/^\d{9}[Vv]$/.test(student.nic)) {
            setErrMessage("Student NIC number is empty or invalid");
            document.getElementById("nic").focus();
            return;
        } else if (!/^[A-Za-z][A-Za-z ]+$/.test(student.name)) {
            setErrMessage("Student name is empty or invalid");
            document.getElementById("name").focus();
            return;
        } else if (!/^[A-Za-z\d][A-Za-z\d-|/# ,.:;\\]+$/.test(student.address)) {
            setErrMessage("Student address is empty or invalid");
            document.getElementById("address").focus();
            return;
        } else if (!/^\d{3}-\d{7}$/.test(student.contact)) {
            setErrMessage("Student contact is empty or invalid");
            document.getElementById("contact").focus();
            return;
        }
        setOutput({ nic: student.nic, name: student.name, address: student.address, contact: student.contact });
    }

    async function handleSubmit(event) {
        event.preventDefault(); 
        setErrMessage("");
        setResponseMessage("");
        if (!student.nic || !student.name || !student.address || !student.contact) {
            setErrMessage("All fields are required");
            return;
        }

      
        try {
            const response = await fetch('http://localhost:5000/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(student),
            });

            if (response.ok) {
                const newStudent = await response.json();
                setSubmittedStudents((prev) => [...prev, newStudent]); // Add new student to the list
                setResponseMessage("Student successfully submitted!");
            } else {
                setErrMessage("Failed to submit student data.");
            }
        } catch (error) {
            setErrMessage(`Error: ${error.message}`);
        }

       
        setStudent({ nic: "", name: "", address: "", contact: "" });
    }

    return (
        <div className={"centered-element"}>
            <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"120px"} alt={"user-logo"} />
            <div className="student-container">
                <h1>Submit Student</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <input onChange={handleChange} value={student.nic} id="nic" name="nic" placeholder="Enter NIC Number" />
                    <input onChange={handleChange} value={student.name} id="name" name="name" placeholder="Enter Name" />
                    <input onChange={handleChange} value={student.address} id="address" name="address" placeholder="Enter Address" />
                    <input onChange={handleChange} value={student.contact} id="contact" name="contact" placeholder="Enter Contact" />
                    <h5>{errMessage}&nbsp;</h5>
                    <br />
                    <button type={"submit"}>Submit Student</button>
                    <Link className={"back-link"} to='/dashboard'>Back</Link>
                </form>
                <br />
                <h4>{responseMessage}</h4>
                <br />
                <h2>Submitted Students</h2>
                {submittedStudents.length > 0 && (
                    <ul>
                        {submittedStudents.map((student, index) => (
                            <li key={index}>
                                <strong>{student.name}</strong> ({student.nic})
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default SubmitStudent;
