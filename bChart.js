const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
var parseDate = d3.timeParse("%Y");
var parseTime = d3.timeParse("%M:%S");
const formatTime = d3.timeFormat("%M:%S");
const formatYear = d3.timeFormat("%Y");
var color = d3.scaleOrdinal(d3.schemeCategory10);
d3.json(url).then((urlData)=>{
    dataset = [];
    console.log(urlData);
    dataset = urlData;
    dataset.forEach(d => {
        d.Year = parseDate(d.Year);
        var parsedTime = d.Time.split(':');
        d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });
    var width = 900, height = 500;
    var minTime = d3.min(dataset, (d)=>(d.Time))
    var maxTime = d3.max(dataset, (d)=>(d.Time));
    console.log(minTime, maxTime);

    var minDate = d3.min(dataset, (d)=>(d.Year));
    var maxDate = d3.max(dataset, (d)=>(d.Year));

    var myear = minDate.getFullYear();
    var mmonth = minDate.getMonth();
    var mday = minDate.getDate();
    var minDate = new Date(myear - 1, mmonth, mday);
    var myear = maxDate.getFullYear();
    var mmonth = maxDate.getMonth();
    var mday = maxDate.getDate();
    var maxDate = new Date(myear + 1, mmonth, mday);

    // console.log(minDate, maxDate);
    var x = d3.scaleTime()
              .domain([minDate, maxDate])
              .range([0, width]);
    var y = d3.scaleTime()
                  .domain(d3.extent(dataset, (d)=>d.Time))
                  .range([0, height]);

    var yAxis = d3.axisLeft(y).tickFormat(formatTime);
    var xAxis = d3.axisBottom(x);

    var svg = d3.select('body').append('svg')
                .attr("height", "100%").attr("width", "100%");
    //Margin
    var margin = {left:50, right:50, top:40, bottom:0};
    //Creating group with svg element
    var chartGroup = svg.append('g')
                        .attr("transform", "translate("+margin.left+","+margin.top+")");
    chartGroup.append("text")
               .attr("id", "title")
               .text("Doping in Professional Bicycle Racing")
               .attr("font-size", "30px")
               .attr("text-anchor","middle")
               .attr("x", width/2)
               .attr("y", margin.top/2)
    chartGroup.append("text")
              .text("35 Fastest times up Alpe d'Huez")
              .attr("font-size","20px")
              .attr("text-anchor","middle")
              .attr("x", width/2)
              .attr("y", margin.top/2+20)

    //Chaining axis calls
    chartGroup.append("g")
                .attr("id","x-axis").attr("transform","translate(0,"+height+")")
                .attr("class", "tick")
                .call(xAxis);
    chartGroup.append("g")
                .attr("id","y-axis")
                .attr("class", "tick")
                .call(yAxis);
    //Chart Logic
    chartGroup.selectAll('circle')
              .data(dataset)
              .enter()
              .append('circle')
              .attr("class", "dot")
              .attr("fill", (d)=>{
                  return color(d.Doping!="");
              })
              .attr("stroke","black")
              .attr("data-yvalue",(d)=>(d.Time))
              .attr("data-xvalue",(d)=>(d.Year))
              .attr("cx",(d)=>x(d.Year))
              .attr("cy",(d)=>y(d.Time))
              .attr("r", 6)
    
   var legendCon =  chartGroup.append('g')
              .attr("id","legend")
    var legend = legendCon.selectAll("#legend")
                  .data(color.domain())
                  .enter()
                  .append('g')
                  .attr("class","legendLabel")
                  .attr("transform",function (d, i) {
                    return 'translate(0,' + (height / 2 - i * 20) + ')';})
        legend.append('rect')
              .attr("x",width - 18)
              .attr("height", 18)
              .attr("width", 18)
              .attr("fill",color)
        legend.append('text')
              .attr('x', width - 24)
              .attr('y', 9)
              .style('text-anchor', 'end')
              .text(d=>{
                  return (d? "Riders with doping allegations":"No doping allegations");
              })
    //Axis Label
    chartGroup.append('text')
               .text("Time in Minutes")
               .attr("class", "yLabel")
               .attr("font-size", "16px")
               .attr("text-anchor", "end")
               .attr('x', -100)
               .attr('y', -36);

    //Tooltip Logic
    d3.select('body').append('div')
              .attr('id', 'tooltip');
    const tooltipDiv = document.querySelector('#tooltip');
    console.log(tooltipDiv);
    d3.selectAll('.dot').on("mousemove", function mouseover(e,d){
  
        const x = Number.parseInt(e.currentTarget.getAttribute('cx'), 10)+60;
        const y = Number.parseInt(e.currentTarget.getAttribute('cy'), 10)+20;
        
        
        tooltipDiv.innerHTML = `${d.Name}: ${d.Nationality}<br/>Year:${formatYear(d.Year)}, Time:${formatTime(d.Time)}<br/><br/>${d.Doping}`;
        tooltipDiv.style.top = `${y}px`;
        tooltipDiv.style.left = `${x}px`;
        tooltipDiv.style.visibility = 'visible';
        tooltipDiv.style.opacity = 0.9;
        tooltipDiv.setAttribute('data-year',d.Year);
    });
    d3.selectAll('.dot').on("mouseout", function mouseout(e){
        tooltipDiv.style.opacity = 0;
        tooltipDiv.style.visibility = "hidden";
    });



});
