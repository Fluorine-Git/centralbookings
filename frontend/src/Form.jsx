import "./Form.css";

function Form() {
    
    return (
        <div className='layout'>
            <header className='header'>
                <h1>Central Bookings</h1>
                <h1>Activity Creation</h1>
            </header>
            <div className='sidebar'></div>

            <div className="form">
                <h1>Activity Creation Form</h1>
                <form>
                    <label htmlFor="activity-name">Activity Name*</label>
                    <input type="text" placeholder="Enter Activity Name" name="activity-name" />

                    <label htmlFor="expected-participants">Expected Participants*</label>
                    <input type="text" placeholder="Enter # of Expected Participants" name="expected-participants" />

                    <label htmlFor="location">Location*</label>
                    <select name="location" id="location">
                        <option value="pridehall-theater">Pridehall Theater</option>
                        <option value="convergence-center-107">Room 107, Convergence Center</option>
                        <option value="innovatech-hall">Innovatech Lecture Hall</option>
                    </select>

                    <label htmlFor="description">Activity Description</label>
                    <textarea name="description" id="description" cols="30" rows="10" placeholder="Enter description"></textarea>

                    <button type="button">Reset</button>
                    <button type="submit">Submit</button>
                </form> 
            </div>
        </div>
    );
}

export default Form;