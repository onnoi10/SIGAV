// Initialize AOS animations
AOS.init({ once: true, duration: 800 });

// ============================================
// CHATBOT MODULE
// ============================================
const Chatbot = {
  elements: {
    input: null,
    chatBox: null
  },

  init() {
    this.elements.input = document.getElementById("user-input");
    this.elements.chatBox = document.getElementById("chat-box");
    
    // Add enter key support
    if (this.elements.input) {
      this.elements.input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
    }
  },

  sendMessage() {
    const { input, chatBox } = this.elements;
    if (!input || !chatBox) return;

    const message = input.value.trim();
    if (!message) return;

    // Add user message
    this.addMessage(message, 'user-msg');
    input.value = "";

    // Generate bot response with delay
    setTimeout(() => {
      const reply = this.generateReply(message);
      this.addMessage(reply, 'bot-msg');
    }, 800);
  },

  addMessage(text, className) {
    const { chatBox } = this.elements;
    const msgDiv = document.createElement('div');
    msgDiv.className = `msg ${className}`;
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  },

  generateReply(text) {
    const lowerText = text.toLowerCase();
    
    const responses = {
      yellow: "🟡 Likely nutrient deficiency (Nitrogen/Iron). Remedy: Apply balanced NPK fertilizer and ensure proper drainage.",
      spots: "🧫 Possible fungal infection detected. Actions: Improve airflow, prune affected leaves, and apply bio-fungicide.",
      humidity: "🌬 High humidity detected. Solution: Increase ventilation and adjust airflow systems.",
      moisture: "💧 Monitor soil moisture levels. Ensure consistent irrigation schedule.",
      temperature: "🌡 Temperature fluctuations detected. Maintain optimal range for your crop type.",
      pests: "🪲 Pest activity noted. Implement integrated pest management strategies.",
      nutrients: "🌱 Nutrient management tip: Regular soil testing ensures optimal fertilization."
    };

    for (const [keyword, response] of Object.entries(responses)) {
      if (lowerText.includes(keyword)) return response;
    }

    return "🌿 General advice: Maintain regular irrigation schedule, monitor sensor data daily, and keep detailed crop logs.";
  }
};

// ============================================
// DASHBOARD CHARTS MODULE
// ============================================
const Dashboard = {
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    soilMoisture: [48, 47, 46, 44, 43, 42, 41],
    pH: [6.5, 6.4, 6.3, 6.2, 6.0, 5.9, 6.0],
    humidity: [70, 75, 80, 85, 88, 82, 78],
    co2: [800, 850, 950, 1100, 1200, 1150, 1000],
    discoloredLeaves: [10, 12, 14, 16, 18, 20, 22],
    pestSpots: [5, 6, 7, 9, 10, 12, 13]
  },

  thresholds: {
    minSoilMoisture: 45,
    minPH: 6.2,
    maxHumidity: 85,
    maxCO2: 1100,
    maxLeafDiscoloration: 20,
    maxPestSpots: 10
  },

  charts: {},

  init() {
    if (!document.getElementById('soilChart')) return;
    
    this.createCharts();
    this.analyzeData();
  },

  createCharts() {
    // Soil & pH Chart
    this.charts.soil = new Chart(document.getElementById('soilChart'), {
      type: 'line',
      data: {
        labels: this.data.labels,
        datasets: [
          {
            label: 'Soil Moisture (%)',
            data: this.data.soilMoisture,
            borderColor: '#00ff88',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'pH',
            data: this.data.pH,
            borderColor: '#66ffcc',
            backgroundColor: 'rgba(102, 255, 204, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: this.getLineChartOptions('Soil Conditions')
    });

    // Air Quality Chart
    this.charts.air = new Chart(document.getElementById('airChart'), {
      type: 'line',
      data: {
        labels: this.data.labels,
        datasets: [
          {
            label: 'Humidity (%)',
            data: this.data.humidity,
            borderColor: '#3399ff',
            backgroundColor: 'rgba(51, 153, 255, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'CO₂ (ppm)',
            data: this.data.co2,
            borderColor: '#ff9933',
            backgroundColor: 'rgba(255, 153, 51, 0.1)',
            fill: true,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: this.getAirChartOptions()
    });

    // Visual Analysis Chart
    this.charts.visual = new Chart(document.getElementById('visualChart'), {
      type: 'bar',
      data: {
        labels: this.data.labels,
        datasets: [
          {
            label: 'Discolored Leaves (%)',
            data: this.data.discoloredLeaves,
            backgroundColor: '#00cc66',
            borderRadius: 5
          },
          {
            label: 'Pest Spots (%)',
            data: this.data.pestSpots,
            backgroundColor: '#ff3333',
            borderRadius: 5
          }
        ]
      },
      options: this.getBarChartOptions('Plant Health Indicators')
    });

    // Suggestion Radar Chart
    this.charts.suggestion = new Chart(document.getElementById('suggChart'), {
      type: 'radar',
      data: {
        labels: ['Irrigation', 'Humidity', 'Nutrients', 'Pest Control', 'Airflow'],
        datasets: [
          {
            label: 'Current Performance',
            data: [70, 85, 65, 60, 75],
            borderColor: '#2c974b',
            backgroundColor: 'rgba(44, 151, 75, 0.3)',
            fill: true,
            pointBackgroundColor: '#2c974b',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#2c974b'
          },
          {
            label: 'Optimal Target',
            data: [90, 70, 80, 85, 90],
            borderColor: '#339999',
            backgroundColor: 'rgba(51, 153, 153, 0.3)',
            fill: true,
            pointBackgroundColor: '#339999',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#339999'
          }
        ]
      },
      options: this.getRadarChartOptions()
    });
  },

  getLineChartOptions(title) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 16 }
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
      }
    };
  },

  getAirChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Air Quality Metrics',
          font: { size: 16 }
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: { display: true, text: 'Humidity (%)' },
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { display: true, text: 'CO₂ (ppm)' },
          grid: { drawOnChartArea: false }
        },
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
      }
    };
  },

  getBarChartOptions(title) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: { size: 16 }
        },
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        },
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.1)' }
        }
      }
    };
  },

  getRadarChartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Performance vs Optimal',
          font: { size: 16 }
        }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { stepSize: 20 }
        }
      }
    };
  },

  analyzeData() {
    const advice = [];
    const { data, thresholds } = this;

    // Get latest values (last day)
    const latest = {
      soilMoisture: data.soilMoisture[data.soilMoisture.length - 1],
      pH: data.pH[data.pH.length - 1],
      humidity: data.humidity[data.humidity.length - 1],
      co2: data.co2[data.co2.length - 1],
      leaves: data.discoloredLeaves[data.discoloredLeaves.length - 1],
      pests: data.pestSpots[data.pestSpots.length - 1]
    };

    // Analyze soil moisture trend
    if (latest.soilMoisture < thresholds.minSoilMoisture) {
      const trend = this.getTrend(data.soilMoisture);
      advice.push(`💧 <strong>Critical:</strong> Soil moisture at ${latest.soilMoisture}% (trending ${trend}) → Increase irrigation immediately.`);
    }

    // Analyze pH
    if (latest.pH < thresholds.minPH) {
      advice.push(`⚗️ <strong>Alert:</strong> Soil pH at ${latest.pH} (below optimal 6.2-7.0) → Apply lime amendment to raise pH.`);
    }

    // Analyze humidity
    if (data.humidity.some(h => h > thresholds.maxHumidity)) {
      advice.push(`🌬 <strong>Warning:</strong> Humidity exceeded ${thresholds.maxHumidity}% → Increase ventilation and improve air circulation.`);
    }

    // Analyze CO2
    const maxCO2 = Math.max(...data.co2);
    if (maxCO2 > thresholds.maxCO2) {
      advice.push(`⬆️ <strong>Notice:</strong> CO₂ peaked at ${maxCO2} ppm (above ${thresholds.maxCO2}) → Adjust CO₂ supply or ventilation.`);
    }

    // Analyze leaf health
    if (latest.leaves > thresholds.maxLeafDiscoloration) {
      const change = latest.leaves - data.discoloredLeaves[0];
      advice.push(`🍂 <strong>Concern:</strong> Leaf discoloration at ${latest.leaves}% (+${change}% this week) → Provide foliar feed and check for deficiencies.`);
    }

    // Analyze pest pressure
    if (latest.pests > thresholds.maxPestSpots) {
      const change = latest.pests - data.pestSpots[0];
      advice.push(`🪲 <strong>Action needed:</strong> Pest population at ${latest.pests}% (+${change}% this week) → Implement biological controls immediately.`);
    }

    // General recommendations
    advice.push("💡 <strong>Best practices:</strong> Maintain consistent airflow, follow fertigation schedule, prune canopy regularly, and document all interventions.");

    // Display advice
    const summaryElement = document.getElementById("summary-text");
    if (summaryElement) {
      summaryElement.innerHTML = advice.join("<br><br>");
    }
  },

  getTrend(dataArray) {
    const recent = dataArray.slice(-3);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const firstVal = recent[0];
    return avg < firstVal ? "down" : avg > firstVal ? "up" : "stable";
  }
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  Chatbot.init();
  Dashboard.init();
});

// Export for global access if needed
window.sendMessage = () => Chatbot.sendMessage();