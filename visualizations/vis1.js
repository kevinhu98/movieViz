/*
todo
2. click to sort by budget, revenue
3. check boxes to filter on type of movie
4. on hover for more specific data
5. consider scaling svg by nValue
6. on click bar, filter out data point
*/

function vis1(data, div) {
  const margin = {top: 40, right: 200, bottom: 40, left: 300};
  const visWidth = 1600 - margin.left - margin.right;
  const visHeight = 800 - margin.top - margin.bottom;
  var sortMethod = "budget";
  var filteredMovies = [];
  //append svg
  const svg = div.append('svg')
    .attr('width', visWidth + margin.left + margin.right)
    .attr('height', visHeight + margin.top + margin.bottom);
  
  //append main g
  const g = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var div = d3.select("vis1").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);

  //append title
  g.append("text")
    .attr("x", visWidth / 2)
    .attr("y", -margin.top + 5)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "hanging")
    .attr("font-family", "Comic Sans MS")
    .attr("font-size", "30px")
    .text("movie stuff");

  //create empty x-axis
  const xAxisGroup = g.append("g")
  .attr("transform", `translate(0, ${visHeight})`);

  //add x-axis title
  xAxisGroup.append("text")
    .attr("x", visWidth / 2)
    .attr("y", 40)
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .text("Amount in USD");
  
  //create empty y-axis
  const yAxisGroup = g.append("g");

  //create legend
  var legend = d3.scaleOrdinal()
  .domain(["Revenue", "Budget"])
  .range([ "steelblue", "red"]);

  svg.append("g")
  .attr("class", "legendOrdinal")
  .attr("transform", "translate(1400,20)");

  var legendOrdinal = d3.legendColor()
    .shape("path", d3.symbol().type(d3.symbolSquare).size(300)())
    .shapePadding(10)
    .scale(legend);

  legend = svg.select(".legendOrdinal")
    .call(legendOrdinal);

  legend.on("click", function(d){
    console.log(legendOrdinal);
  });

  function update(nValue) {
    //filter data by type and user input
    console.log(filteredMovies);
    if (sortMethod == "budget"){
      filteredData = data.slice()
        .filter(d => !filteredMovies.includes(d.title))
        .sort((a, b) => d3.descending(a.budget, b.budget))
        .slice(0, nValue);
    }
    else if (sortMethod == "revenue"){
      filteredData = data.slice()
        .filter(d => !filteredMovies.includes(d.title))
        .sort((a, b) => d3.descending(a.revenue, b.revenue))
        .slice(0, nValue);
    }
    else{
      filteredData = data.slice()
      .filter(d => !filteredMovies.includes(d.title))
      .sort((a, b) => d3.descending(a.ratio, b.ratio))
      .slice(0, nValue);
    }

    var x = d3.scaleLinear()
      .domain([-d3.max(filteredData, d => d.budget), d3.max(filteredData, d => d.revenue)]).nice()
      .range([0, visWidth]);

    var xAxis = d3.axisBottom(x);
    
    xAxisGroup
      .transition().duration(1000)
      .call(xAxis)
      .call(g => g.selectAll(".domain").remove());

    var y = d3.scaleBand()
      .domain(filteredData.map(d => d.title))
      .range([0, visHeight])
      .padding(0.2)
    
    
    if (filteredData.map(d => d.title).length < 80){
      var yAxis = d3.axisLeft(y);
      yAxisGroup
        .transition().duration(300)
        .call(yAxis)
        .call(g => g.selectAll(".domain").remove());
    }
    else{
      var yAxis = d3.axisLeft(d3.scaleBand()); //empty y axis to call, should find better way
      yAxisGroup
        .transition().duration(300)
        .call(yAxis)
        .call(g => g.selectAll(".domain").remove());
    }
    //draw revenue bars
    g.selectAll(".revenue-bars")
      .data(filteredData)
      .join("rect")
      .attr("class", "revenue-bars")
      .attr("x", d => x(0)) //start graph at amount = 0
      .attr("y", d => y(d.title))
      .attr("width", d => (x(d.revenue) - x(0))) // change width so it assumes we start at 0
      .attr("height", d => y.bandwidth())
      .attr("fill", "steelblue");
  
    // draw budget bars
    g.selectAll(".budget-bars")
      .data(filteredData)
      .join("rect")
      .attr("class", "budget-bars")
      .attr("x", d => x(-d.budget)) //start rect at amount donated left
      .attr("y", d => y(d.title))
      .attr("width", d => (x(0) - x(-d.budget))) // change width so rect ends at 0 
      .attr("height", d => y.bandwidth())
      .attr("fill", "red")
      .on("mouseover", function(d) {		
        });					
  }

  function addBarClickPropertiesAndUpdate(){
    update(nValue.value)
    g.selectAll(".budget-bars").on("click", function(d) {
      filteredMovies.push(d.title);
      update(nValue.value)
    });
    g.selectAll(".revenue-bars").on("click", function(d) {
      filteredMovies.push(d.title);
      update(nValue.value)
    });
  }

  function updateSortFilter(){
    form = document.getElementById("dimensions")
    for (var i=0; i<form.length; i++){
      if (form[i].checked){
        sortMethod = form[i].id;
        addBarClickPropertiesAndUpdate()
      }
    }
  }

  
  //update when text field number changes
  d3.select("#nValue").on("input", function() {
    addBarClickPropertiesAndUpdate()
    
  });
  
  d3.select("#dimensions").on("change", updateSortFilter);
  
  // load initial data
  addBarClickPropertiesAndUpdate()
  
}
