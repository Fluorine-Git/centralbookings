import { useState } from 'react'
import './App.css'

{/* "data" */}
const activities = [
  {
    id: 1,
    title: 'Wordsmithing and Writing in the Modern Era',
    organizer: 'Smith Publishing',
    location: 'Pridehall Theater',
    date: '2024-10-15',
    start: '13:00',
    end: '15:00',
    participants: 175,
    capacity: 200
  },
  {
    id: 2,
    title: '"Blast from the Past": A History of Pop Music',
    organizer: 'Collegium of Music',
    location: 'Room 107, Convergence Center',
    date: '2027-10-15',
    start: '15:30',
    end: '18:00',
    participants: 35,
    capacity: 35
  },
  {
    id: 3,
    title: 'Fanfiction to Classics: Literature and Context Analysis',
    organizer: 'Smith Publishing',
    location: 'Innovatech Lecture Hall',
    date: '2027-10-17',
    start: '09:00',
    end: '11:00',
    participants: 259,
    capacity: 260
  },
  {
    id: 4,
    title: "Beginner's Guide to Commuting in the Metro",
    organizer: 'Metro Commuters Organization',
    location: 'Room 107, Convergence Center',
    date: '2027-10-17',
    start: '10:00',
    end: '12:30',
    participants: 38,
    capacity: 40
  },
]

{/* for dropdowns */}
const locations = Array.from(new Set(activities.map((a) => a.location)))
const organizers = Array.from(new Set(activities.map((a) => a.organizer)))

{/* for past and available activities */}
function hasStarted(a) {
  const now = new Date()
  const dateNow = now.toLocaleDateString('en-CA')
  const timeNow = now.toTimeString().slice(0,5)
  return a.date < dateNow || (a.date === dateNow && a.start < timeNow)
}

{/* for available activities */}
function isFull(a) {
  return a.capacity === a.participants
}

{/* for more readable dates */}
function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

function App() {
  const [location, selectLocation] = useState('all')
  const [organizer, selectOrganizer] = useState('all')
  const [timeFilter, selectTimeFilter] = useState('all')
  const [alphabetical, selectAlphabetical] = useState(false)

  {/* handles filtering activities */}
  let qualified = activities.filter((a) => {
    const matchedLocation = location === 'all' || a.location === location
    const matchedOrganizer = organizer === 'all' || a.organizer === organizer 
    const matchedTimeFilter = timeFilter === 'all' || 
      (timeFilter === 'available' && !hasStarted(a) && !isFull(a)) || 
      (timeFilter === 'past' && hasStarted(a))
    return matchedLocation && matchedOrganizer && matchedTimeFilter
  })

  {/* sorts filtered activities alphabetically */}
  if (alphabetical) {
    qualified = (Array.from(qualified)).sort((a,b) => a.title.localeCompare(b.title))
  }

  return (
    <div className='layout'>
      <header className='header'>
        <h1>Central Bookings</h1>
      </header>

      {/* filters */}
      <div className='sidebar'>
        <select 
          id='location-dropdown' value={location} 
          onChange={(l) => selectLocation(l.target.value)}>
          <option value='all'>All Locations</option>
          {locations.map((l) => (<option key={l}>{l}</option>))}
        </select>
        <select 
          id='organizer-dropdown' value={organizer} 
          onChange={(o) => selectOrganizer(o.target.value)}>
          <option value='all'>All Organizations</option>
          {organizers.map((o) => (<option key={o}>{o}</option>))}
        </select>
        
        <button 
          className={timeFilter === 'available' ? 'filter-button active' : 'filter-button'} 
          onClick={() => selectTimeFilter (timeFilter === 'available' ? 'all' : 'available')}>
          Available
        </button>
        <button 
          className={timeFilter === 'past' ? 'filter-button active' : 'filter-button'} 
          onClick={() => selectTimeFilter (timeFilter === 'past' ? 'all' : 'past')}>
          Past Activities
        </button>
        <button 
          className={alphabetical ? 'filter-button active' : 'filter-button'} 
          onClick={() => selectAlphabetical(!alphabetical)}>
          Alphabetical
        </button>
      </div>

      {/* le activities */}
      <div className='activites'>
        {qualified.map((a) => (
          <button className='activity-button' key={a.id}>
            <div className='activity-organizer'><i>organized by {a.organizer}</i></div>
            <div className='activity-title'>{a.title}</div>
            <div className='activity-setting'>{formatDate(a.date)} ({a.start}-{a.end}) <br/> {a.location}</div>
            <div className='activity-participants'>{a.participants}/{a.capacity} Participants</div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
