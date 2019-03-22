# Rainfall heatmap

Bootstrapped with [Create React App](https://github.com/facebook/create-react-app) --typescript.

The application displays rainfall data (Finnish Meteorological Institute, 2015-2018) from Tampere as a heatmap adapted from Mike Bostock's [Calendar View](https://observablehq.com/@d3/calendar-view) drawn with [D3.js](https://github.com/d3/d3).

The data is stored locally as a JSON file, but local data can easily be changed to data fetched from an online source.

## Use

After cloning the repository, cd [project folder] and install dependencies with 'npm install'.

`npm start` runs a development server at localhost:3000.

`npm run build` builds the app for production to the 'build' folder.

## Documentation

The source code is documented in accordance with the [Microsoft TSDoc](https://github.com/Microsoft/tsdoc) standard, [typedoc](https://github.com/TypeStrong/typedoc) is used for building HTML documentation.

`npm run createdoc` builds documentation to the 'docs' folder.

`npm run docs` opens documentation in browser.

#### [Live demo on Heroku](https://rainfall-heatmap.herokuapp.com/)
