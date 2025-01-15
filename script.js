document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-upload");
  
    // Clear file input on page refresh
    fileInput.value = "";
  
    fileInput.addEventListener("change", function () {
      const file = this.files[0];
  
      if (file) {
        const reader = new FileReader();
  
        reader.onload = function (event) {
          const csvContent = event.target.result;
  
          //CSV content Parsing
          const rows = csvContent.split("\n").map(row => row.split(","));
          
          if (rows.length > 1) {
            const headers = rows[0].map(header => header.trim());
            const rowsData = rows.slice(1).filter(row => row.length === headers.length);
            
            //Constants from the data
            const DATES = rowsData.map(row => row[0].trim());
            const CITIES = rowsData.map(row => row[1].trim());
            const METEORS = rowsData.map(row => parseInt(row[2].trim(), 10));
  
            //Object constant
            const cityData = {};
  
            //Loop by city
            rowsData.forEach((row, i) => {
              const city = CITIES[i];
              const date = DATES[i];
              const meteors = METEORS[i];
  
              if (!cityData[city]) {
                cityData[city] = [];
              }
  
              cityData[city].push({ date: date, meteors: meteors });
            });

            //Table constant
            const tableBody = document.querySelector("#zeroCount tbody");
            tableBody.innerHTML = "";
  
            //Loop through each city
            Object.keys(cityData).forEach(city => {
                let followingZeroCount = 0;
                let maxZeroCount = 0;
                let currentZeroStartDate = null;
                let zeroCounts = [];
                let streakStartDates = [];
                let streakEndDates = [];
  
                cityData[city].forEach(entry => {
                    if (entry.meteors === 0) {
                        //Calculate zeros
                        if (followingZeroCount === 0) {
                            currentZeroStartDate = entry.date;
                        }
                        followingZeroCount++; 
                    } else {
                        //Reset calculation when it's not zero
                        if (followingZeroCount > 0) {
                            zeroCounts.push(followingZeroCount);
                            streakStartDates.push(currentZeroStartDate);
                            streakEndDates.push(entry.date);
                            followingZeroCount = 0;
                        }
                    }
                });
                
                //Zeros at the end
                if (followingZeroCount > 0) {
                    zeroCounts.push(followingZeroCount);
                    streakStartDates.push(currentZeroStartDate);
                    streakEndDates.push(cityData[city][cityData[city].length - 1].date);
                }
                
                //Maximum zero count
                maxZeroCount = Math.max(...zeroCounts);
                let maxZeroIndex = zeroCounts.indexOf(maxZeroCount);
                
                //Start and end dates
                let maxZeroStartDate = streakStartDates[maxZeroIndex];
                let maxZeroEndDate = streakEndDates[maxZeroIndex];

                //Log results
                console.log(`Data for ${city}:`);
                console.log(`Zero count array: ${zeroCounts}`);
                console.log(`Maximum following zeros: ${maxZeroCount}`);
                console.log(`Maximum zero start date: ${maxZeroStartDate}`);
                console.log(`Maximum zero end date: ${maxZeroEndDate}`);
  
                //Populate the table
                const row = document.createElement("tr");
                row.innerHTML = `
                  <td>${city}</td>
                  <td>${maxZeroCount}</td>
                  <td>${maxZeroStartDate} - ${maxZeroEndDate}</td>
                `;
                tableBody.appendChild(row);
            });
  
          } else {
            console.error("CSV file is empty or invalid!");
          }
        };
  
        reader.onerror = function () {
          console.error("Couldn't read the file!");
        };
  
        reader.readAsText(file);
      }
    });
});
