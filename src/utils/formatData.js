export const formatData = (dataPoints) => {
  const parsedData = {};

  dataPoints.forEach((data) => {
    const { district, attribute, value } = data;

    if (!parsedData[district]) {
      parsedData[district] = {};
    }

    parsedData[district][attribute] = value;
  });

  const formattedData = Object.keys(parsedData).map((district) => ({
    [district]: parsedData[district],
  }));

  return formattedData;
};
