This is the user-facing server for the GUI-Test Webapp.
This runs a server delivering the webapp, and it interfaces with the backend server.
npm init
git init

# Install node 16
curl -fsSL https://deb.nodesource.com/setup_17.x | sudo -E bash -
sudo apt-get install -y nodejs

Or.
nvm ls-remote
nvm install v16.13.1

# Install pm2 (globally)
# https://www.npmjs.com/package/pm2
npm install pm2 -g

# Install local project dependencies
# From within react-practice/frontend:
npm install

# Run with node (locally, testing)
npm start

# Run with pm2 (production)
pm2 start wherever/whatever.js


sudo apt-get install node-typescript
