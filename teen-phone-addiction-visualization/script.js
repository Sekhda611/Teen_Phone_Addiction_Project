// For bundlers such as Vite and Webpack omit https://esm.sh/
import {json } from 'https://esm.sh/d3-fetch';
import { select, selectAll } from 'https://esm.sh/d3-selection';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
// JSON dataset
const url = "https://raw.githubusercontent.com/Sekhda611/Teen_Phone_Addiction_Project/refs/heads/main/teen_phone_addiction_dataset.json";

const data = await d3.json(url);
console.log(data);

 // Convert Usage_hours and Addiciton_level decimal to integer
 data.forEach(d => {
    d.Daily_Usage_Hours = Math.floor(d.Daily_Usage_Hours);
    d.Addiction_Level = Math.floor(d.Addiction_Level);
  });

const width = 800, height = 500;
const margin = { top: 50, right: 40, bottom: 100, left: 60 };
// svg setup 
const svg = d3.select('svg')
            .style("background", "black")
            .style("border-radius", "10px")

 // Scales
const x = d3.scaleBand()
    .domain(data.map(d => d.Phone_Usage_Purpose))
    .range([margin.left, width - margin.right])
    .padding(0.2);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Daily_Usage_Hours)])
    .range([height - margin.bottom, margin.top]);

const color = d3.scaleSequential()
    .domain(d3.extent(data, d => d.Addiction_Level))
    .interpolator(d3.interpolatePlasma);

// Rectangles – Daily Usage Hours
svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", d => x(d.Phone_Usage_Purpose))
    .attr("y", d => y(d.Daily_Usage_Hours))
    .attr("width", x.bandwidth())
    .attr("height", d => height - margin.bottom - y(d.Daily_Usage_Hours))
    .attr("fill", "skyblue")
    .attr("opacity", 0.6);

// Tooltip 
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "grey")
    .style("color", "white")
    .style("padding", "6px 10px")
    .style("border-radius", "6px")
    .style("font-size", "12px")
    .style("pointer-events", "none");

// Circles – Addiction Level
svg.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => x(d.Phone_Usage_Purpose) + x.bandwidth() / 2)
    .attr("cy", d => y(d.Daily_Usage_Hours) - d.Addiction_Level * 2)
    .attr("r", d => 6 + d.Addiction_Level * 1.5)
    .attr("fill", d => color(d.Addiction_Level))
    .attr("opacity", 0.9)
    .on("mouseover", (event, d) => {
      tooltip.transition().duration(150).style("opacity", 1);
      tooltip.html(`
        <strong>${d.Phone_Usage_Purpose}</strong><br>
         Hours/Day: ${d.Daily_Usage_Hours}<br>
         Addiction Level: ${d.Addiction_Level}
      `);
    })
    .on("mousemove", event => {
      tooltip
        .style("left", (event.pageX + 12) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => {
      tooltip.transition().duration(200).style("opacity", 0);
    });

  // X-axis (this provides the labels — no need for manual text!)
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSize(0))
    .selectAll("text")
    .attr("transform", "rotate(-25)")
    .style("text-anchor", "end")
    .style("fill", "#ddd")
    .style("font-size", "12px");

  // Y-axis
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5))
    .attr("color", "#ddd");

  // Chart titles
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("fill", "#fff")
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .text("Phone Usage Purpose vs Daily Hours and Addiction Level");

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height - 40)
    .attr("text-anchor", "middle")
    .attr("fill", "#ccc")
    .text("Phone Usage Purpose");

  svg.append("text")
    .attr("x", -height / 2)
    .attr("y", 20)
    .attr("transform", "rotate(-90)")
    .attr("text-anchor", "middle")
    .attr("fill", "#ccc")
    .text("Daily Usage Hours");

