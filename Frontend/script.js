AOS.init({ once:true });

// Chatbot
function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  if (!input || !chatBox) return;
  if (!input.value.trim()) return;

  chatBox.innerHTML += `<div class="msg user-msg">${input.value}</div>`;

  setTimeout(() => {
    let reply = "🌿 General advice: maintain irrigation schedule and check sensors daily.";
    const text = input.value.toLowerCase();
    if (text.includes("yellow")) reply = "🟡 Likely nutrient issue (N/Fe). Remedy: balanced NPK & better drainage.";
    if (text.includes("spots")) reply = "🧫 Possible fungal infection. Improve airflow, prune leaves, and apply bio-fungicide.";
    if (text.includes("humidity")) reply = "🌬 High humidity detected. Increase ventilation & adjust airflow.";
    chatBox.innerHTML += `<div class="msg bot-msg">${reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 800);

  input.value = "";
}

// Dashboard Charts
if (document.getElementById('soilChart')) {
  const soilData = [48,47,46,44,43,42,41];
  const pHData   = [6.5,6.4,6.3,6.2,6.0,5.9,6.0];
  const humidity = [70,75,80,85,88,82,78];
  const co2      = [800,850,950,1100,1200,1150,1000];
  const leaves   = [10,12,14,16,18,20,22];
  const pests    = [5,6,7,9,10,12,13];

  new Chart(document.getElementById('soilChart'), {
    type:'line',
    data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets:[
        {label:'Soil Moisture (%)',data:soilData,borderColor:'#00ff88',fill:false},
        {label:'pH',data:pHData,borderColor:'#66ffcc',fill:false}
      ]}
  });

  new Chart(document.getElementById('airChart'), {
    type:'line',
    data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets:[
        {label:'Humidity (%)',data:humidity,borderColor:'#3399ff',fill:false},
        {label:'CO₂ (ppm)',data:co2,borderColor:'#ff9933',fill:false}
      ]}
  });

  new Chart(document.getElementById('visualChart'), {
    type:'bar',
    data:{labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets:[
        {label:'Discolored Leaves (%)',data:leaves,backgroundColor:'#00cc66'},
        {label:'Pest Spots (%)',data:pests,backgroundColor:'#ff3333'}
      ]}
  });

  new Chart(document.getElementById('suggChart'), {
    type:'radar',
    data:{
      labels:['Irrigation','Humidity','Nutrients','Pest Control','Airflow'],
      datasets:[
        {label:'Current',data:[70,85,65,60,75],borderColor:'#2c974b',backgroundColor:'rgba(44,151,75,0.3)',fill:true},
        {label:'Optimal',data:[90,70,80,85,90],borderColor:'#339999',backgroundColor:'rgba(51,153,153,0.3)',fill:true}
      ]
    }
  });

  function analyzeData() {
    let advice = [];
    if (soilData[6] < 45) advice.push("💧 Soil moisture decreasing → Increase irrigation.");
    if (pHData[6] < 6.2) advice.push("⚗️ Soil pH low → Apply lime amendment.");
    if (humidity.some(h => h > 85)) advice.push("🌬 Humidity >85% detected → Ventilation needed.");
    if (Math.max(...co2) > 1100) advice.push("⬆️ CO₂ peaked above 1100 ppm → Adjust CO₂ supply.");
    if (leaves[6] > 20) advice.push("🍂 Leaf discoloration rising → Provide foliar feed.");
    if (pests[6] > 10) advice.push("🪲 Pest population increasing → Use biological controls.");
    advice.push("💡 General: Keep airflow good, schedule fertigation, prune canopy.");
    document.getElementById("summary-text").innerHTML = advice.join("<br>");
  }
  analyzeData();
}