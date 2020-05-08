// Load the datasets and call the functions to make the visualizations
Promise.all([
  d3.csv('data/movieData.csv', d3.autoType)
]).then(([data]) => {
  vis1(data, d3.select('#vis1'));
});
