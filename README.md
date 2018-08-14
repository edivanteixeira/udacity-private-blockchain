# Blockchain Data

Blockchain has the potential to change the way that the world approaches data. Develop Blockchain skills by understanding the data model behind Blockchain by developing your own simplified private blockchain.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Requirements
* [Node.js](https://nodejs.org)
* [NPM](https://www.npmjs.com)
* [LevelDB](https://github.com/google/leveldb)
* [ExpressJS](https://expressjs.com/)

### Running soluction

- Use NPM to initialize your project and create package.json to store project dependencies.
```
npm init
```
- Install all dependency that have in our package.json file
```
npm install 
```
- Running app in port 8000
```
npm start
```
- Before this, open a browser in [http://localhost:8000](http://localhost:8000) and enjoy :)

#### Create Block
```
curl -X POST \
  http://localhost:8000/block \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'body=teste!'
```

#### Get block by height
```
curl -X GET \
  http://localhost:8000/block/0
```
