function init() {
  // Grab a reference to the dropdown select element
    var selector = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;

    sampleNames.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    buildMetadata(newSample);
    buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

    });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
        // 3. Create a variable that holds the samples array. 
        var samples = data.samples;
        var metadata = data.metadata;
        console.log(metadata)
        // 4. Create a variable that filters the samples for the object with the desired sample number.
        var resultArray = samples.filter(sampleObj => parseInt(sampleObj.id) == sample);
        //  5. Create a variable that holds the first sample in the array.
        var result = resultArray[0];
        // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        var ids = result.otu_ids;
        var labels = result.otu_labels;
        var values = result.sample_values;

        // 7. Create the yticks for the bar chart.
        // Hint: Get the the top 10 otu_ids and map them in descending order  
        //  so the otu_ids with the most bacteria are last. 
        var yticks = ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    // 8. Create the trace for the bar chart. 
        var barData = {
            x: values,
            y: yticks,
            type: "bar",
            orientation: "h" 
        };
        var data = [barData];
        // 9. Create the layout for the bar chart. 
        var layout = {
            title: "Top 10 Bacteria Cultures Found",
        };
        // 10. Use Plotly to plot the data with the layout. 
        Plotly.newPlot("bar", data, layout);

        // 1. Create the trace for the bubble chart.
        var bubbleData = {
            x: ids,
            y: values,
            text: labels,
            mode: 'markers',
                marker: {
                size: values,
                sizeref: 1.25,
                color: ids,
                colorscale: 'Earth'
            }
        };
        var bubble = [bubbleData];

            // 2. Create the layout for the bubble chart.
        var bubbleLayout = {
            title: 'Bacteria Cultures Per Sample',
            showlegend: false,
            height: 500,
            width: 800,
            hovermode: "closest",
            yaxis: {
                automargin: true
                },
            xaxis: {
                title: "OTU ID",
                automargin: true,
            }
    };
      // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubble, bubbleLayout); 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
        var metaFirst = resultArray[0];

    // 3. Create a variable that holds the washing frequency.
    var washFreq = parseFloat(metaFirst.wfreq);
    // Create the yticks for the bar chart.

    // 4. Create the trace for the gauge chart.
    var gaugeData = {
        domain: { x: [0, 1], y: [0, 1] },
		value: washFreq,
		title: { text: "Belly Button Washing Frequency</br></br> Scrubs per Weeks"},
		type: "indicator",
		mode: "gauge+number",
        gauge: {
            axis: { range: [null, 10] },
            bar: { color: "black"},
            bgcolor: "white",
            steps: [
                { range: [0, 2], color: "red" },
                { range: [2, 4], color: "orange" },
                { range: [4, 6], color: "yellow" },
                { range: [6, 8], color: "limegreen" },
                { range: [8, 10], color: "green" }
            ],
            threshold: {
                line: { color: "black", width: 4 },
                thickness: 0.75,
                value: washFreq}
        }
    };
    var gauge = [gaugeData];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
        width: 500, 
        height: 350, 
        margin: { t: 0, b: 0 },
        plot_bgcolor: "lavender",
        paper_bgcolor: "lavender",
        font: { color: "black", family: "Arial" }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gauge, gaugeLayout);
    });
}
