import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container, InputGroup, FormControl, Row, Card } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const CLIENT_ID = 'a73563a8d98a446cbcfdb55197fd076b';
const CLIENT_SECRET = 'acbc2e6f09f0431dba1a3d3a35882081';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    // API Access Token
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
  }
    fetch('http://accounts.spotify.com/api/token', authParameters)
      .then(response => response.json())
      .then(data => setAccessToken(data.access_token))
      
  }, [])

  // Search
  async function search() {
    console.log('searching for ' + searchInput);
    // Get request using search to get Artist ID
    const artistParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
    }
  }
    const artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', artistParameters)
    .then(response => response.json())
    .then(data => { return data.artists.items[0].id })

    console.log("Artist ID is " + artistID);
    
    // Get request using Artist ID to get Artist Albums

    const returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=10', artistParameters)
    .then(response => response.json())
    .then(data => { console.log(data.items)
    setAlbums(data.items) })
    
    // Display Albums to the user
  }
  console.log(albums);
  return (
    <div className="App">
     <Container>
      <InputGroup className="mb-3" size='lg'>
        <FormControl
          placeholder="Search for Artist"
          type='input'
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              search()
            }
          }}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
        <Button onClick={() => {
          search()
        }}>Search</Button>
      </InputGroup>
     </Container>
     <Container>
      <Row className='mx-2 row row-cols-4'>
        {albums.map((album, i) => {
          return(
          <Card>
            <Card.Img src={album.images[0].url} />
            <Card.Body>
            <Card.Title>{album.name}</Card.Title>
            </Card.Body>
          </Card> 
          )
        })}
         
      </Row>
     </Container>
    </div>
  );
}

export default App;
