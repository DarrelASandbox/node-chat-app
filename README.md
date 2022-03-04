## About The Project

- The Complete Node.js Developer Course (3rd Edition) on Udemy
- Tutorial for Chat App

## Installation

1. Install NPM packages

   ```sh
   npm install
   ```

## Notes

### Notes taken from Join Page comment section:

> Why do we use absolute path for everything in public folder?

> You're confusing the paths on the server with the paths on the client. The client can only access what we want them to and we set their "entry point" as the public folder (via the express.static middleware). Whenever a request comes in from the client, the path is always relative to the public folder so they can't access any of the other files unless we want them to on our server.
