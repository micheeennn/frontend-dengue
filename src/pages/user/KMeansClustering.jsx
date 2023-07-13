import React, { useEffect } from "react";
import { kmeans } from "ml-kmeans";
import { data } from "../../utils/dataKMeans";
import { formatData } from "../../utils/formatData";

const k = 3; // Change this value according to your needs

const KMeansClustering = () => {
  useEffect(() => {
    // Extract the numeric features from the data
    const features = data.map((entry) => [
      parseFloat(entry[Object.keys(entry)]["airHumidity"]),
      parseFloat(entry[Object.keys(entry)]["cases"]),
      parseFloat(entry[Object.keys(entry)]["rainfall"]),
    ]);

    // Train the model on the data
    const { clusters } = kmeans(features, k);

    // Display the clustered data in the console
    clusters.forEach((cluster, index) => {
      console.log(`Cluster ${index + 1}:`);
      cluster.forEach((pointIndex) => {
        console.log(data[pointIndex]);
      });
      console.log();
    });
  }, []);

  return (
    <div>
      <h1>K-Means Clustering</h1>
      {/* Add your JSX code here */}
    </div>
  );
};

export default KMeansClustering;
