const ctx = document.getElementById("timeChart").getContext("2d");

let config = {
  type: "line",
  data: {
    labels: ["5분전", "4분전", "3분전", "2분전", "현재"],
    datasets: [
      {
        label: "온도",
        backgroundColor: "rgba(000, 153, 255, 1)",
        borderColor: "rgba(000, 153, 255, 1)",
        fill: false,
        data: [],
      },
      {
        label: "습도",
        backgroundColor: "rgba(153, 255, 102, 1)",
        borderColor: "rgba(153, 255, 102, 1)",
        fill: false,
        data: [],
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    title: {
      display: true,
      text: "온도 및 습도 변화",
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "값",
        },
      },
    },
  },
};

const myChart = new Chart(ctx, config);

async function fetchData() {
  try {
    const response = await fetch("http://localhost:8080/api");
    const result = await response.json();
    const data = result.data;

    if (data && data.length > 0) {
      // HTML 요소 업데이트
      document.getElementById("temperature").textContent =
        data[data.length - 1].Temperature;
      document.getElementById("humidity").textContent =
        data[data.length - 1].Humidity;

      // 차트 업데이트
      updateCharts(data);
    }
  } catch (error) {
    console.error("Error fetching sensor data:", error);
  }
}

function updateCharts(sensorData) {
  if (sensorData.length >= 5) {
    const recentData = sensorData.slice(-5); // 최신 5개 데이터
    config.data.datasets[0].data = recentData.map((item) => item.Temperature);
    config.data.datasets[1].data = recentData.map((item) => item.Humidity);
    myChart.update();
  } else {
    console.error("Not enough data to update the chart");
  }
}

// 5초마다 데이터 갱신
setInterval(() => {
  fetchData();
}, 5000);

fetchData();
