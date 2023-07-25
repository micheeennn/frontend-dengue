export const parseData = (input_data) => {
  const parsedData = {};

  input_data.forEach((item) => {
    const kecamatan = item.district;
    const attributeName = item.attribute;
    const value = item.value;

    if (!parsedData[kecamatan]) {
      // Create a new entry for the kecamatan if it doesn't exist
      parsedData[kecamatan] = { Kecamatan: kecamatan };
    }

    // Assign the value to the corresponding attribute (cases or rainfall)
    if (attributeName === "cases") {
      parsedData[kecamatan].cases = value;
    } else if (attributeName === "rainfall") {
      parsedData[kecamatan].rainfall = value;
    }
  });

  // Convert the parsedData object into an array of values
  const data = Object.values(parsedData);
  return data;
};
