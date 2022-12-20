import './App.css'; // Import CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { Button, Container, InputGroup, FormControl, Row, Card } from 'react-bootstrap'; // Import Bootstrap Components
import { useState, useEffect } from 'react'; // Import React Hooks

const CLIENT_ID = 'b9c5fae6d8a14ae98dc71f7395057e6b'; // Your client id
const CLIENT_SECRET = '58b476258832436e8bd7b1035b142506'; // Your secret

function App() { 
  const [searchInput, setSearchInput] = useState(''); // Search Input
  const [accessToken, setAccessToken] = useState(''); // Access Token
  const [albums, setAlbums] = useState([]); // Albums

  useEffect(() => {
    // API Access Token
    const authParameters = {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // Set content type to x-www-form-urlencoded
    },
    body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET // Set body to grant_type, client_id, and client_secret
  }
    fetch('http://accounts.spotify.com/api/token', authParameters) // Get request to get access token
       .then(response => response.json()) // Convert response to JSON
      .then(data => setAccessToken(data.access_token)) // Set access token
      
  }, [])

  // Search
  async function search() {
    console.log('searching for ' + searchInput); // Log search input to console
    // Get request using search to get Artist ID
    const artistParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json', // Set content type to application/json
        'Authorization': 'Bearer ' + accessToken // Set authorization to Bearer token
        
    }
  }
    const artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', artistParameters) // Get request to get artist ID
    .then(response => response.json()) // Convert response to JSON
    .then(data => { return data.artists.items[0].id }) // Return artist ID

    console.log("Artist ID is " + artistID); // Log artist ID to console
    
    
     const returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=10', artistParameters) // Get request to get albums
    .then(response => response.json()) // Convert response to JSON
    .then(data => { console.log(data.items) // Log albums to console
    setAlbums(data.items) }) // Set albums to data.items
    
    
    console.log(returnedAlbums); // Log returned albums to console
  }
  
  return (
    // Return App and Bootstrap Components
    <div className="App"> 
     <Container> 
      <InputGroup className="mb-3" size='lg'> 
        <FormControl
          placeholder="Search for Artist" // Placeholder
          type='input'
          onKeyPress={(e) => // On key press
            {
            if (e.key === 'Enter') // If enter is pressed
            {
              search() // Call search function
            }
          }}
          onChange={(e) => {
            setSearchInput(e.target.value); // Set search input to value
          }}
        />
        <Button onClick={() => {
          search() // Call search function
        }}>Search</Button>
      </InputGroup>
     </Container>
     <Container>
      <Row className='mx-2 row row-cols-4'>
        {albums.map((album, i) => {
          return(
            // The minimun card size is set to 300px
          <Card style={{minWidth: 300}}> 
          
            <Card.Img src={album.images[0].url} /> 
            <Card.Body>
            <Card.Title>{album.name}</Card.Title>
            </Card.Body> 
          </Card> // Return Card
          ) 
        })}
         
      </Row>
     </Container> 
    </div>
  );
}

export default App;
