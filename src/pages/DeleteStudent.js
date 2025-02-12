import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function DeleteStudent() {
    const [nic, setNic] = useState("");
    const [errMessage, setErrMessage] = useState("");
    const [responseMessage, setResponseMessage] = useState("");

    const API_URL = "http://localhost:5000/students"; 


    function handleChange(event) {
        setResponseMessage("");
        setErrMessage("");
        const newNic = event.target.value;
        setNic(newNic);
    }


    async function handleSubmit(event) {
        event.preventDefault();
        setErrMessage("");
        setResponseMessage("");

   
        if (!/^\d{9}[Vv]$/.test(nic)) {
            setErrMessage("Student NIC number is empty or invalid");
            document.getElementById("nic").focus();
            return;
        }

        try {
        
            const studentResponse = await axios.get(`${API_URL}?nic=${nic}`);
            if (studentResponse.data.length === 0) {
                setErrMessage("Student not found");
                return;
            }

            await axios.delete(`${API_URL}/${studentResponse.data[0].id}`);
            setResponseMessage("Student successfully deleted from the database");
        } catch (err) {
      
            if (err.response) {
                setResponseMessage(err.response.data.message);
            } else {
                setResponseMessage(`Error: ${err.message}`);
            }
        }

       
        setNic("");
    }

    return (
        <div className={"centered-element"}>
            <img className="student-img" src={"https://cdn-icons-png.flaticon.com/512/5349/5349022.png"} width={"120px"} alt={"user-logo"} />
            <div className="student-container">
                <h1>Delete Student</h1>
                <br />
                <form onSubmit={handleSubmit}>
                    <input
                        onChange={handleChange}
                        value={nic}
                        id="nic"
                        name="nic"
                        placeholder="Enter NIC Number"
                    />
                    <h5>{errMessage}&nbsp;</h5>
                    <br />
                    <button type={"submit"}>Delete Student</button>
                    <Link className={"back-link"} to='/dashboard'>Back</Link>
                </form>
                <h4>{responseMessage}</h4>
            </div>
        </div>
    );
}

export default DeleteStudent;
