import * as d3 from 'd3';
import React, { useRef, useEffect } from 'react';

function BarChart({ width, height, data }){
    const ref = useRef();

    var margin = ({top: 20, right: 120, bottom: 30, left: 120})
    var font = 'OpenSans'


    useEffect(() => {
        draw();
    });

    const draw = () => {
        
        const svg = d3.select(ref.current)
                    .attr("width", width)
                    .attr("height", height);

        var scaleArtistY = d3.scaleBand()
            .domain(data.map((d)=>d.artist))
            .range([margin.top, height-margin.bottom])
            .padding(.1)

        var scaleAmountX = d3.scaleLinear()
            .domain([0, d3.max(data, (d,i) => d.total_time)])
            .range([margin.left, width-margin.right])
            .nice();
            //nice rounds off values

        var scaleArtistColor = 
            d3.scaleOrdinal(d3.quantize(d3.interpolateWarm, 26))

        var yAxis = d3.axisLeft(scaleArtistY)

        var xAxis = d3.axisBottom(scaleAmountX)
            .tickFormat(val => val + " hrs")
            .ticks(4);

        svg.append('g')
            .style("font-family", font)
            .style("font-size", "0.8vw")
            .attr('class', 'y axis')
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxis);
        
        svg.append("g")
            .style("font-family", font)
            .style("font-size", "1vw")
            .attr('class', 'x axis')
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxis);

        var barg = svg.append("g");

        var rects = barg
            .selectAll("rect")
            .data(data);
        
        var newRects = rects.enter();
        
        var texts = barg
            .selectAll("text")
            .data(data)
        
        var newTexts = texts.enter();

        newRects
            .append("rect")
                .attr("class", "rect")
                .attr("id", (d,i) => i)
                .attr("x", margin.left + 2)
                .attr("y", (d,i) => scaleArtistY(d.artist))
                .attr("width", 0)
                .attr("height", (d,i) => scaleArtistY.bandwidth())
                .attr("fill", (d,i) => scaleArtistColor(d.total_time))
                .attr("opacity", 1)

        barg.selectAll("rect")
            .transition()
            .duration(1000)
            .attr("width", (d,i) => scaleAmountX(d.total_time) - margin.left)

        newTexts
            .append("text")
                .attr("text-anchor", "end")
                .attr("y", (d,i) => scaleArtistY(d.artist) + scaleArtistY.bandwidth()/2.0 +5)
                .attr("x", (d,i) => scaleAmountX(d.total_time))
                .text((d,i) => d3.format(".1f")(d.total_time))
                .attr("fill", "white")
                .style("font-family", font)

        // var selection = svg.selectAll("rect").data(data);
        // var yScale = d3.scaleLinear()
        //                     .domain([0, d3.max(data)])
        //                     .range([0, height-100]);
        
        // selection
        //     .transition().duration(300)
        //         .attr("height", (d) => yScale(d))
        //         .attr("y", (d) => height - yScale(d))

        // selection
        //     .enter()
        //     .append("rect")
        //     .attr("x", (d, i) => i * 45)
        //     .attr("y", (d) => height)
        //     .attr("width", 40)
        //     .attr("height", 0)
        //     .attr("fill", "orange")
        //     .transition().duration(300)
        //         .attr("height", (d) => yScale(d))
        //         .attr("y", (d) => height - yScale(d))
        
        // selection
        //     .exit()
        //     .transition().duration(300)
        //         .attr("y", (d) => height)
        //         .attr("height", 0)
        //     .remove()
    }


    return (
        <div className="chart">
            <svg ref={ref}>
            </svg>
        </div>
        
    )

}

export default BarChart;