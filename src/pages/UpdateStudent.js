import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function UpdateStudent() {
    const [student, setStudent] = useState({ nic: "", name: "", address: "", contact: "" });
    const [output, setOutput] = useState({ nic: "", name: "", address: "", contact: "" });
    const [errMessage, setErrMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    
    function handleChange(event) {
        const { name, value } = event.target;
        setResponseMessage("");
        setErrMessage("");
        setStudent(prevState => ({
            ...prevState,
            [name]: value
        }));
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
        setOutput(student);
    }

   
    async function handleSubmit(event) {
        event.preventDefault();
        setErrMessage("");
        setResponseMessage("");
        if (!student.nic) {
            setErrMessage("NIC is required to update the student");
            return;
        }

        try {
         
            const response = await fetch(`http://localhost:5000/students?nic=${student.nic}`);
            const data = await response.json();

            if (data.length > 0) {
    
                const updatedStudent = data[0];
                updatedStudent.name = student.name;
                updatedStudent.address = student.address;
                updatedStudent.contact = student.contact;

              
                const updateResponse = await fetch(`http://localhost:5000/students/${updatedStudent.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedStudent),
                });

                if (updateResponse.ok) {
                    setResponseMessage("Student successfully updated!");
                    setOutput(updatedStudent);
                } else {
                    setErrMessage("Failed to update student data.");
                }
            } else {
                setErrMessage("Student not found.");
            }
        } catch (error) {
            setErrMessage(`Error: ${error.message}`);
        }
    }

    return (
        <div className={"centered-element"}>
            <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"120px"} alt={"user-logo"} />
            <div className="student-container">
                <h1>Update Student Details</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <input
                        onChange={handleChange}
                        value={student.nic}
                        id="nic"
                        name="nic"
                        placeholder="Enter NIC Number"
                    />
                    <input
                        onChange={handleChange}
                        value={student.name}
                        id="name"
                        name="name"
                        placeholder="Enter Name"
                    />
                    <input
                        onChange={handleChange}
                        value={student.address}
                        id="address"
                        name="address"
                        placeholder="Enter Address"
                    />
                    <input
                        onChange={handleChange}
                        value={student.contact}
                        id="contact"
                        name="contact"
                        placeholder="Enter Contact"
                    />
                    <h5>{errMessage}&nbsp;</h5>
                    <br />
                    <button type="button" onClick={handleCheckOut}>Check Out</button>
                    <button type="submit">Update Student Details</button>
                    <Link className={"back-link"} to='/dashboard'>Back</Link>
                </form>
                <br />
                <h4>{responseMessage}</h4>
                <br />
                <h2>Updated Student</h2>
                {output.nic && (
                    <div>
                        <p><strong>NIC:</strong> {output.nic}</p>
                        <p><strong>Name:</strong> {output.name}</p>
                        <p><strong>Address:</strong> {output.address}</p>
                        <p><strong>Contact:</strong> {output.contact}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UpdateStudent;
