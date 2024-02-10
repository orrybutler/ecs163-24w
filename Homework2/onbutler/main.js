//used code from homework2 template throughout the assignment
const width = window.innerWidth;
const height = window.innerHeight;

let scatterLeft = 0, scatterTop = 0;
let scatterMargin = {top: 50, right: 30, bottom: 30, left: 60},
    scatterWidth = 400 - scatterMargin.left - scatterMargin.right,
    scatterHeight = 400- scatterMargin.top - scatterMargin.bottom;

let TypeLeft = 600, TypeTop = 0;
let TypeMargin = {top: 50, right: 30, bottom: 30, left: 60},
    TypeWidth = width - 600 - TypeMargin.left - TypeMargin.right,
    TypeHeight = 400 - TypeMargin.top - TypeMargin.bottom;

let parLeft = 0, parTop = 400;
let parMargin = {top: 10, right: 30, bottom: 30, left: 60},
    parWidth = width - parMargin.left - parMargin.right,
    parheight = height - 450 - parMargin.top - parMargin.bottom;
    


d3.csv("pokemon_alopez247.csv").then(rawData =>{
    rawData = rawData.map(d=>{
                          return {
                              "Total": Number(d.Total),
                              "Catch_Rate": Number(d.Catch_Rate),
                              "Legendary":d.isLegendary,
                              "Type": d.Type_1,
                              "HP": Number(d.HP),
                              "Attack": Number(d.Attack),
                              "Defense": Number(d.Defense),
                              "Sp_Atk": Number(d.Sp_Atk),
                              "Sp_Def": Number(d.Sp_Def),
                              "Speed": Number(d.Speed),
                              "Generation": d.Generation
                          };
    });

    const scatterColorScale = d3.scaleOrdinal().domain(['False', 'True']).range(['gray', 'red'])

    const svg = d3.select("svg")

    svg.selectAll("legend_colors").data(['False', 'True']).enter().append("circle").attr("cx", scatterWidth + 40).attr("cy", function(d, i){return 60 + 25*i}).attr("r", 4).attr("fill", d => scatterColorScale(d))
    svg.selectAll("lengend_text").data(['Not Legendary', 'Legendary']).enter().append("text").attr("x", scatterWidth + 50).attr("y", function(d,i) {return 65+25*i}).attr("font-size", '15px')
    .attr("text_anchor", "middle").text(d => d)

    const g1 = svg.append("g")
                .attr("width", scatterWidth + scatterMargin.left + scatterMargin.right)
                .attr("height", scatterHeight + scatterMargin.top + scatterMargin.bottom)
                .attr("transform", `translate(${scatterMargin.left}, ${scatterMargin.top})`)

    // X label
    g1.append("text")
    .attr("x", scatterWidth / 2)
    .attr("y", scatterHeight + 50)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Catch Rate")
    
    g1.append("text")
    .attr("x", scatterWidth/2)
    .attr("y", -20)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Pokemon Strength vs. Catch Rate")
    

    // Y label
    g1.append("text")
    .attr("x", -(scatterHeight / 2))
    .attr("y", -40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Total")

    // X ticks
    const x1 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.Catch_Rate)])
    .range([0, scatterWidth])

    const xAxisCall = d3.axisBottom(x1)
                        .ticks(7)
    g1.append("g")
    .attr("transform", `translate(0, ${scatterHeight})`)
    .call(xAxisCall)
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "7")
        .attr("text-anchor", "end")

    // Y ticks
    const y1 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.Total)])
    .range([scatterHeight, 0])

    const yAxisCall = d3.axisLeft(y1)
                        .ticks(13)
    g1.append("g").call(yAxisCall)

    const rects = g1.selectAll("circle").data(rawData)

    rects.enter().append("circle")
         .attr("cx", function(d){
             return x1(d.Catch_Rate);
         })
         .attr("cy", function(d){
             return y1(d.Total);
         })
         .attr("r", 3)
         .attr("fill", function(d) {
            return scatterColorScale(d.Legendary)
         })


    const barColorScale = d3.scaleOrdinal().domain([ "Fire", "Water", "Grass"])
    .range(["#EE8130", "#6390F0", "#7AC74C"])

    q = rawData.reduce((s, { Type }) => (s[Type] = (s[Type] || 0) + 1, s), {});
    r = Object.keys(q).map((key) => ({ Type: key, count: q[key] }));


    svg.selectAll("bar_legend_colors").data(['Fire', 'Water', 'Grass']).enter().append("circle").attr("cx", 500 + TypeWidth + 5).attr("cy", function(d, i){return 70 + 25*i}).attr("r", 4).attr("fill", d => barColorScale(d))
    svg.selectAll("bar_lengend_text").data(['Fire', 'Water', "Grass"]).enter().append("text").attr("x", 500 + TypeWidth + 15).attr("y", function(d,i) {return 75+25*i}).attr("font-size", '15px')
    .attr("text_anchor", "middle").text(d => d)
    svg.append("text").attr("x", 500 + TypeWidth).attr("y", 55).attr("font-size", '15px').attr("text_anchor", "middle").text("Starter Types")


           
    const g2 = svg.append("g")
                .attr("width", TypeWidth + TypeMargin.left + TypeMargin.right)
                .attr("height", TypeHeight + TypeMargin.top + TypeMargin.bottom)
                .attr("transform", `translate(${TypeLeft}, ${TypeMargin.top})`)

    // X label
    g2.append("text")
    .attr("x", TypeWidth / 2)
    .attr("y", TypeHeight + 60)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Types")
    

    // Y label
    g2.append("text")
    .attr("x", -(TypeHeight / 2))
    .attr("y", -40)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Number of Pokemon")

    // X ticks
    const x2 = d3.scaleBand()
    .domain(r.map(d => d.Type))
    .range([0, TypeWidth])
    .padding(0.2)

    const xAxisCall2 = d3.axisBottom(x2)
    g2.append("g")
    .attr("transform", `translate(0, ${TypeHeight})`)
    .call(xAxisCall2)
    .selectAll("text")
        .attr("y", "10")
        .attr("x", "-5")
        .attr("font-size", "12px")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-45)")
        .attr("fill", "black")

    // Y ticks
    const y2 = d3.scaleLinear()
    .domain([0, d3.max(r, d => d.count)])
    .range([TypeHeight, 0])

    const yAxisCall2 = d3.axisLeft(y2)
                        .ticks(20)
    g2.append("g").call(yAxisCall2)

    const rects2 = g2.selectAll("rect").data(r)

    rects2.enter().append("rect")
    .attr("y", d => y2(d.count))
    .attr("x", (d) => x2(d.Type))
    .attr("width", x2.bandwidth)
    .attr("height", d => TypeHeight - y2(d.count))
    .attr("fill", function(d) {
        if (d.Type == "Fire" || d.Type == "Water" || d.Type == "Grass") {
            return barColorScale(d.Type)
        } else {
            return "gray"
        }
    })

    const generationsColorScale = d3.scaleOrdinal().domain(["1", "2", "3", "4", "5", "6", "7", "8", "9"])
    .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#17becf", "#e377c2", "#7f7f7f"]);

    const g3 = svg.append("g")
    .attr("width", TypeWidth + TypeMargin.left + TypeMargin.right)
    .attr("height", TypeHeight + TypeMargin.top + TypeMargin.bottom)
    .attr("transform", `translate(${TypeLeft}, ${TypeMargin.top})`)

    const y3 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.HP)])
    .range([parheight, 0])



    const yAxisCall3 = d3.axisLeft(y3).ticks(10)
    g3.append("g")
    .attr("transform", `translate(${-545}, ${420})`)
    .call(yAxisCall3)
    .selectAll("text")
        .attr("y", "0")
        .attr("x", "-10")
        .attr("text-anchor", "end")
    
    const HP_map = rawData.map(d => {
        return {
            "HP": d.HP,
            "Attack": d.Attack,
            "Generation": d.Generation
        }
    })
    
    const y4 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.Attack)])
    .range([parheight, 0])

    const yAxisCall4 = d3.axisLeft(y4).ticks(12)
    let adder = parWidth/7
    g3.append("g")
    .attr("transform", `translate(${-545 + adder}, ${420})`)
    .call(yAxisCall4)
    .selectAll("text")
        .attr("y", "0")
        .attr("x", "-10")
        .attr("text-anchor", "end")
    
    ;
    
    g3.selectAll("lines").data(HP_map).enter().append("line")
    .style("stroke-width",1)
    .attr("x1", -545)
    .attr("y1", function(d) {
        return parTop + parMargin.top + y3(d.HP) + 10
    })
    .attr("x2", -545+adder)
    .attr("y2", function(d) {
        return parTop + parMargin.top + y4(d.Attack) + 10
    })
    .attr("opacity", 0.3)
    .attr("stroke", function(d) {
        return generationsColorScale(d.Generation)
    });
    
    const y6 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.Defense)])
    .range([parheight, 0])

    const Attack_map = rawData.map(d => {
        return {
            "Attack": d.Attack,
            "Defense": d.Defense,
            "Generation": d.Generation
        }
    })

    g3.selectAll("lines").data(Attack_map).enter().append("line")
    .style("stroke-width",1)
    .attr("x1", -545 + adder)
    .attr("y1", function(d) {
        return parTop + parMargin.top + y4(d.Attack) + 10
    })
    .attr("x2", -545+2*adder)
    .attr("y2", function(d) {
        return parTop + parMargin.top + y6(d.Defense) + 10
    })
    .attr("opacity", 0.3)
    .attr("stroke", function(d) {
        return generationsColorScale(d.Generation)
    });
    

    const yAxisCall6 = d3.axisLeft(y6).ticks(10)
    g3.append("g")
    .attr("transform", `translate(${-545 + 2*adder}, ${420})`)
    .call(yAxisCall6)
    .selectAll("text")
        .attr("y", "0")
        .attr("x", "-10")
        .attr("text-anchor", "end")

    const Defense_map = rawData.map(d => {
        return {
            "Defense": d.Defense,
            "Sp_Atk": d.Sp_Atk,
            "Generation": d.Generation,
        }
    })
    
    
    const y7 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.Sp_Atk)])
    .range([parheight, 0])

    const yAxisCall7 = d3.axisLeft(y7).ticks(12)
    g3.append("g")
    .attr("transform", `translate(${-545 + 3*adder}, ${420})`)
    .call(yAxisCall7)
    .selectAll("text")
        .attr("y", "0")
        .attr("x", "-10")
        .attr("text-anchor", "end")
    
      g3.selectAll("lines").data(Defense_map).enter().append("line")
    .style("stroke-width",1)
    .attr("x1", -545 + 2*adder)
    .attr("y1", function(d) {
        return parTop + parMargin.top + y6(d.Defense) + 10
    })
    .attr("x2", -545+3*adder)
    .attr("y2", function(d) {
        return parTop + parMargin.top + y7(d.Sp_Atk) + 10
    })
    .attr("opacity", 0.3)
    .attr("stroke", function(d) {
        return generationsColorScale(d.Generation)
    });
    
    const y8 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.Sp_Def)])
    .range([parheight, 0])

    const yAxisCall8 = d3.axisLeft(y8).ticks(10)
    g3.append("g")
    .attr("transform", `translate(${-545 + 4*adder }, ${420})`)
    .call(yAxisCall8)
    .selectAll("text")
        .attr("y", "0")
        .attr("x", "-10")
        .attr("text-anchor", "end")
    
    const Sp_Atk_map = rawData.map(d => {
        return {
            "Sp_Atk": d.Sp_Atk,
            "Sp_Def": d.Sp_Def,
            "Generation": d.Generation
        }
    })
    
    
    g3.selectAll("lines").data(Sp_Atk_map).enter().append("line")
    .style("stroke-width",1)
    .attr("x1", -545 + 3*adder)
    .attr("y1", function(d) {
        return parTop + parMargin.top + y7(d.Sp_Atk) + 10
    })
    .attr("x2", -545+4*adder)
    .attr("y2", function(d) {
        return parTop + parMargin.top + y8(d.Sp_Def) + 10
    })
    .attr("opacity", 0.3)
    .attr("stroke", function(d) {
        return generationsColorScale(d.Generation)
    });

    const y9 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.Speed)])
    .range([parheight, 0])

    const yAxisCall9 = d3.axisLeft(y9).ticks(12)
    g3.append("g")
    .attr("transform", `translate(${-545 + 5*adder}, ${420})`)
    .call(yAxisCall9)
    .selectAll("text")
        .attr("y", "0")
        .attr("x", "-10")
        .attr("text-anchor", "end")
        
    const Sp_Def_map = rawData.map(d => {
        return {
            "Sp_Def": d.Sp_Def,
            "Speed": d.Speed,
            "Generation": d.Generation
        }
    })
    
    
    g3.selectAll("lines").data(Sp_Def_map).enter().append("line")
    .style("stroke-width",1)
    .attr("x1", -545 + 4*adder)
    .attr("y1", function(d) {
        return parTop + parMargin.top + y8(d.Sp_Def) + 10
    })
    .attr("x2", -545+5*adder)
    .attr("y2", function(d) {
        return parTop + parMargin.top + y9(d.Speed) + 10
    })
    .attr("opacity", 0.3)
    .attr("stroke", function(d) {
        return generationsColorScale(d.Generation)
    });

    
    const y10 = d3.scaleLinear()
    .domain([0, d3.max(rawData, d => d.Total)])
    .range([parheight, 0])

    const yAxisCall10 = d3.axisLeft(y10).ticks(30)
    g3.append("g")
    .attr("transform", `translate(${-545 + 6*adder}, ${420})`)
    .call(yAxisCall10)
    .selectAll("text")
        .attr("y", "0")
        .attr("x", "-10")
        .attr("text-anchor", "end")

    const Speed_map = rawData.map(d => {
        return {
            "Speed": d.Speed,
            "Total": d.Total,
            "Generation": d.Generation
        }
    })
    
    
    g3.selectAll("lines").data(Speed_map).enter().append("line")
    .style("stroke-width",1)
    .attr("x1", -545 + 5*adder)
    .attr("y1", function(d) {
        console.log(y9(d.Speed), y10(d.Total))
        return parTop + parMargin.top + y9(d.Speed) + 10
    })
    .attr("x2", -545+6*adder)
    .attr("y2", function(d) {
        return parTop + parMargin.top +y10(d.Total) + 10
    })
    .attr("opacity", 0.3)
    .attr("stroke", function(d) {
        return generationsColorScale(d.Generation)
    });

    // g3.append('line')
    // .style("stroke", "lightgreen")
    // .style("stroke-width", 2)
    // .attr("x1", -545 + 5*adder)
    // .attr("y1", parTop + parMargin.top + 461.8125 + 10)
    // .attr("x2", -545 + 6*adder)
    // .attr("y2", parTop + parMargin.top + 136.83333333333333 + 10);
    
    g3.append("text")
    .attr("x", -545)
    .attr("y", parTop)
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .text("Total HP")
    g2.append("text")
    .attr("x", -545 + adder)
    .attr("y", parTop)
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .text("Attack Rating")
    g2.append("text")
    .attr("x", -545 + 2*adder)
    .attr("y", parTop)
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .text("Defense Rating")
    g2.append("text")
    .attr("x", -545 + 3*adder)
    .attr("y", parTop)
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .text("Speed Attack")
    g2.append("text")
    .attr("x", -545 + 4*adder)
    .attr("y", parTop)
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .text("Speed Defense")
    g2.append("text")
    .attr("x", -545 + 5*adder)
    .attr("y", parTop)
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .text("Speed")
    g2.append("text")
    .attr("x", -545 + 6*adder)
    .attr("y", parTop)
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .text("Total Rating")

    svg.selectAll("legend_paralel").data(["1", "2", "3", "4", "5", "6", "7", "8", "9"]).enter().append("circle").attr("cx", parWidth - 70).attr("cy", function(d, i){return parheight + 25*i}).attr("r", 4).attr("fill", d => generationsColorScale(d))
    svg.selectAll("lengend_par_text").data(['Generation 1', 'Generation 2', 'Generation 3', 'Generation 4', 'Generation 5', 'Generation 6', 'Generation 7', "Generation 8", "Generation 9"]).enter().append("text").attr("x", parWidth - 60).attr("y", function(d,i) {return parheight +25*i +5}).attr("font-size", '15px')
    .attr("text_anchor", "middle").text(d => d)
    
    
    
  
  






    





































}).catch(function(error){
    console.log(error);
});

