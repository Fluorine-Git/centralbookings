import { useState } from 'react'
import "./Form.css";

function Form() {
    
    const[values, setValues] = useState({
        organizer: '',
        activity_name: '',
        description: '',
        expected_participants: '',
        schedule_date: '',
        start_time: '',
        end_time: '',
        location: ''
    })

    const handleChanges = (e) => {
        setValues({...values, [e.target.name]:[e.target.value]})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(values)
    }

    return (
        <div className='layout'>
            <header className='header'>
                <h1>Central Bookings</h1>
                <h1>Activity Creation</h1>
            </header>
            <div className='sidebar'></div>

            <div className="form">
                <h1>Activity Creation Form</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="organizer">Organizer*</label>
                    <input type="text" placeholder="Enter Your Organization Name" name="organizer" 
                    onChange={(e) => handleChanges(e)} required/>
                    
                    <label htmlFor="activity_name">Activity Name*</label>
                    <input type="text" placeholder="Enter Activity Name" name="activity_name" 
                    onChange={(e) => handleChanges(e)} required/>

                    <label htmlFor="description">Activity Description*</label>
                    <textarea name="description" id="description" cols="30" rows="10" 
                    onChange={(e) => handleChanges(e)} required placeholder="Enter description"></textarea>

                    <label htmlFor="expected_participants">Expected Participants*</label>
                    <input type="number" placeholder="Enter # of Expected Participants" name="expected_participants" 
                    onChange={(e) => handleChanges(e)} required/>

                    <label htmlFor="schedule_date">Date of the Event*</label>
                    <input type="date" name="schedule_date" 
                    onChange={(e) => handleChanges(e)} required/>

                    <label htmlFor="start_time">Start Time of the Event*</label>
                    <input type="time" name="start_time" 
                    onChange={(e) => handleChanges(e)} required/>

                    <label htmlFor="end_time">End Time of the Event*</label>
                    <input type="time" name="end_time" 
                    onChange={(e) => handleChanges(e)} required/>

                    <label htmlFor="location">Location*</label>
                    <select name="location" id="location" onChange={(e) => handleChanges(e)} required>
                        <option value="" disabled selected hidden>Select a Location</option>
                        <option value="pridehall_theater">Pridehall Theater</option>
                        <option value="convergence_center_107">Room 107, Convergence Center</option>
                        <option value="innovatech_hall">Innovatech Lecture Hall</option>
                    </select>

                    <button type="button">Reset</button>
                    <button type="submit">Submit</button>
                </form> 
            </div>
        </div>
    );
}

export default Form;