// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    let result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (let key in result)
      PANEL.append("h6").text(`${key.toUpperCase()}: ${result[key]}`);
  });
}

function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;

    // Filter the samples for the object with the desired sample number
    let resultArraySample = samples.filter(sampleObj => sampleObj.id == sample);
    let result = resultArraySample[0]; // Extract the first object (should be the only object)

    if (result) {
      // Get the otu_ids, otu_labels, and sample_values
      let otu_ids = result.otu_ids;
      let otu_labels = result.otu_labels;
      let sample_values = result.sample_values;

      // Build the Bubble Chart
      let bubbleTrace = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: 'Earth'
        }
      };

      let bubbleLayout = {
        title: 'Bubble Chart of Sample Values',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Value' }
      };

      Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);

      // Prepare data for the Bar Chart
      let combinedData = otu_ids.map((id, index) => ({
        otu_id: id,
        otu_label: otu_labels[index],
        sample_value: sample_values[index]
      }));

      // Sort data by sample_value in descending order
      combinedData.sort((a, b) => b.sample_value - a.sample_value);

      // Slice to get the top 10
      let top10Data = combinedData.slice(0, 10);

      // Extract data for Bar Chart
      let barOtuIds = top10Data.map(data => data.otu_id);
      let barOtuLabels = top10Data.map(data => data.otu_label);
      let barSampleValues = top10Data.map(data => data.sample_value);

      // Build the Bar Chart
      let barTrace = {
        x: barSampleValues,
        y: barOtuIds.map(id => `OTU ${id}`),
        text: barOtuLabels,
        type: 'bar',
        orientation: 'h'
      };

      let barLayout = {
        title: 'Top 10 OTUs Found',
        xaxis: { title: 'Sample Value' },
        yaxis: { title: 'OTU ID' }
      };

      Plotly.newPlot('bar', [barTrace], barLayout);

    }
  });
}

// Function to update metadata
function updateMetadata(sample) {
  buildMetadata(sample);
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let samNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    samNames.forEach((sample) => {
      dropdown.append("option")
        .text(sample)
        .property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = samNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    updateMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  updateMetadata(newSample);
}

// Initialize the dashboard
init();



