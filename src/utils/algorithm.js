// Fungsi untuk menghitung jarak Euclidean antara dua titik
const euclideanDistance = (point1, point2) => {
  const diffCases = point1.cases - point2.cases;
  const diffRainfall = point1.rainfall - point2.rainfall;
  return Math.sqrt(diffCases * diffCases + diffRainfall * diffRainfall);
};

// Fungsi untuk melakukan alokasi data ke kelompok berdasarkan centroid yang terdekat
export const assignToClusters = (data, centroids) => {
  const clusters = new Array(centroids.length).fill().map(() => []);
  data.forEach((point) => {
    let minDistance = Number.MAX_VALUE;
    let assignedCluster = 0;
    centroids.forEach((centroid, index) => {
      const distance = euclideanDistance(point, centroid);
      if (distance < minDistance) {
        minDistance = distance;
        assignedCluster = index;
      }
    });
    clusters[assignedCluster].push(point);
  });
  return clusters;
};

// Fungsi untuk menghitung centroid baru dari setiap kelompok
export const calculateNewCentroids = (clusters) => {
  return clusters.map((cluster) => {
    const centroid = {
      cases: 0,
      rainfall: 0,
    };
    cluster.forEach((point) => {
      centroid.cases += point.cases;
      centroid.rainfall += point.rainfall;
    });
    const clusterSize = cluster.length || 1; // Menghindari pembagian dengan nol
    centroid.cases /= clusterSize;
    centroid.rainfall /= clusterSize;
    return centroid;
  });
};

// Data awal
const data = [
  { Kecamatan: "Bunaken", cases: 25, rainfall: 228.9 },
  { Kecamatan: "Bunaken Kepulauan", cases: 0, rainfall: 374.1 },
  { Kecamatan: "Malalayang", cases: 98, rainfall: 316.8 },
  { Kecamatan: "Mapanget", cases: 74, rainfall: 287.1 },
  { Kecamatan: "Paal 2", cases: 66, rainfall: 287.5 },
  { Kecamatan: "Sario", cases: 30, rainfall: 267.9 },
  { Kecamatan: "Singkil", cases: 46, rainfall: 240.8 },
  { Kecamatan: "Tikala", cases: 47, rainfall: 287.5 },
  { Kecamatan: "Tuminting", cases: 68, rainfall: 240.8 },
  { Kecamatan: "Wanea", cases: 101, rainfall: 316.8 },
  { Kecamatan: "Wenang", cases: 43, rainfall: 326.8 },
];

// Jumlah kelompok yang diinginkan (K)
const K = 3;

// Inisialisasi centroid awal
let centroids = data
  .slice(0, K)
  .map((point) => ({ cases: point.cases, rainfall: point.rainfall }));

// Proses iterasi K-means
const maxIterations = 100; // Jumlah maksimum iterasi yang diizinkan
let iterations = 0;
let oldCentroids;

while (iterations < maxIterations) {
  // Simpan centroid lama untuk mengecek kondisi berhenti
  oldCentroids = JSON.parse(JSON.stringify(centroids));

  // Alokasi data ke kelompok berdasarkan centroid terdekat
  const clusters = assignToClusters(data, centroids);

  // Hitung centroid baru untuk setiap kelompok
  centroids = calculateNewCentroids(clusters);

  // Cek kondisi berhenti: jika centroid tidak berubah, hentikan iterasi
  if (JSON.stringify(centroids) === JSON.stringify(oldCentroids)) {
    break;
  }

  iterations++;
}
