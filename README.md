![banner](readme_files/rmbanner.png?raw=true "banner")

## Overview

Nostalgiify is a full-stack web application that allows users to create personalized Spotify playlists based on historical music charts. The application seamlessly integrates a frontend user interface with a backend API to deliver a smooth and engaging user experience.

Here's an overview of how Nostalgiify works:

1. User Authentication: Users securely log in using the frontend interface, authenticating with their Spotify credentials.

2. Date Selection: Once logged in, users can select a specific date using the frontend calendar feature. This date serves as the basis for retrieving the top 100 songs from the Billboard Hot 100 tracks of that particular day.

3. Web Scraping: When a date is chosen, the frontend sends a request to the backend API, including the selected date and user credentials. The backend utilizes Playwright, a powerful web scraping tool, to extract the top 100 songs from the Billboard website corresponding to the chosen date.

4. Playlist Generation: With the list of songs obtained from the web scraping process, the backend API proceeds to create a Spotify playlist using the Spotify API integration. It adds all the fetched songs to the playlist, generating a unique link for easy access.

5. Frontend Display: The frontend interface of Nostalgiify displays the recently generated playlist, allowing users to conveniently access and listen to their personalized playlist.

You can see the [React frontend project here.](https://github.com/roadieroundup/Nostalgiify-Frontend)\
\
![demo](readme_files/demo.gif?raw=true "Demo")

## Motivation

Nostalgiify was born out of my passion for exploring the possibilities offered by the Spotify API and my fascination with the world of web scraping. By creating this project, I aimed to combine these interests and provide users with a unique experience of discovering new music. Nostalgiify allows users to travel back in time, reliving the top songs of specific dates and generating personalized playlists. This project represents my dedication to leveraging technology to create innovative and engaging applications in the realm of music and data extraction.

## Tech Stack

The project utilizes the following relevant technologies and dependencies:
- Express 4.18.2: Web framework for Node.
- Playwright 1.34.3: Powerful library, used for web scraping in this project.
- Browserless API: For running Playwright in the cloud.
- Axios 1.4: Promise-based HTTP client for making API requests.
- Express Validator 7.0.1: Middleware for validation handling in Express.
- Cors 2.8.5: Middleware for enabling Cross-Origin Resource Sharing (CORS) in Express.
- Dotenv 16.0.3: Loads environment variables from a .env.

## API Endpoints

- The scope of the API is to provide the frontend with the necessary data to generate a playlist. The API has the following endpoints:

  - ### GET /api/nostalgiify/start

    - It initiate the process and redirect the user to the Spotify login page. After that it redirects the user to the frontend with the authorization code to get the access token.
  

  - ### POST /api/nostalgiify/callback

    - Receives the authorization code from Spotify after the user grants permission and exchanges it for an access token.

      - Request Body: 
        - code (string, required): The authorization code received from Spotify.

      - Response: 
        - Status Code: 200 (OK) if successful

      - Body: 
        - ok (boolean): Indicates whether the operation was successful.
        - id (string): The spotify user ID.
        - access_token (string): The access token obtained from Spotify.
        - refresh_token (string): The refresh token obtained from Spotify.
        - message (string): A message indicating the success status.

  - ### POST /api/nostalgiify/createplaylist
  
    - Creates a playlist on Spotify with the specified parameters.
      - Request Body:
        - access_token (string, required): The access token obtained from Spotify.
        - user_id (string, required): The ID of the user who owns the playlist.
        - year (string, required): The year for the playlist.
        - month (string, required): The month for the playlist.
        - day (string, required): The day for the playlist.
      
      - Response:
        - Status Code: 200 (OK) if successful
        - Body:
          - ok (boolean): Indicates whether the operation was successful.
          - message (string): A message indicating the success status.
          - id (string): The ID of the created playlist.
          - url (string): The URL of the created playlist on Spotify.
      
  - Error Responses:
    - Status Code: 400 (Bad Request)
    - Body:
      - ok (boolean): Indicates whether the operation was successful.
      - message (string): A message indicating the error.

## Live site

Check out the live version of the application at https://roadieroundup.github.io/Nostalgiify-Frontend/

## Possible future updates

- [ ]  Better handling of Spotify search API, it should create a 100 song playlist but it only add 60 to 90 songs.

Feel free to explore the project and provide any feedback or suggestions for further improvements.