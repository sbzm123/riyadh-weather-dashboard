window.addEventListener("DOMContentLoaded", function () {
    let temprature, disc, icon, rainChance, windDir;
    fetch("https://api.weatherapi.com/v1/forecast.json?key=e1d4e4a2feff447da2e145248251307&q=Riyadh&days=2&aqi=yes&alerts=yes")
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            temprature = data.current.temp_c
            disc = data.current.condition.text
            icon = data.current.condition.icon
            rainChance = data.forecast.forecastday[0].day.daily_chance_of_rain
            windDir = data.current.wind_dir
            console.log(`Temperature: ${temprature}°C`);
            console.log(`Weather Condition: ${disc}`);
            console.log(`Icon URL: ${icon}`);
            console.log(`Rain Chance: ${rainChance}%`);
            console.log(`Wind Direction: ${windDir}`);
            // Update the HTML elements with the fetched data
            let iconv = document.getElementById("weather-icon")
            const sun = seeSunIfSettingOrRising(riyadhHour);
            if (sun == "sunrise") {
                iconv.src = "assets/icons/sunrise.png";
                iconv.alt = "Sunrise";
                document.getElementById("weather-icon-div").classList.add("sunrise", "notSun");
            } else if (sun == "sunset") {
                iconv.src = "assets/icons/sunset.png";
                iconv.alt = "Sunset";
                document.getElementById("weather-icon-div").classList.add("sunset", "notSun");
            } else {
                iconv.src = "https:" + icon
                iconv.alt = disc
            }
            let tempv = document.getElementById("temp")
            tempv.innerHTML = temprature + "°C"
            let discv = document.getElementById("weather-desc")
            discv.innerHTML = disc
            let rcv = document.getElementById("rain-chance")
            rcv.innerHTML = rainChance + "%"
            let wdv = document.getElementById("wind-dir")
            wdv.innerHTML = windDir
            let humv = document.getElementById("humidity")
            humv.innerHTML = data.current.humidity + "%"
            document.querySelectorAll('.loading').forEach(el => el.style.display = 'none');
        })

        .catch((error) => { console.error("Error fetching weather data:", error) });
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        hour12: false, // Use 24-hour format
        timeZone: 'Asia/Riyadh'
    });

    const riyadhHour = parseInt(formatter.format(now).split(':')[0], 10);

    function getTime(hour) {
        if (riyadhHour > 24 || riyadhHour < 0) {
            throw new Error("Invalid time");
        } else if (riyadhHour >= 5 && riyadhHour <= 11) {
            return "morning";
        } else if (riyadhHour >= 12 && riyadhHour <= 16) {
            return "afternoon";
        } else if (riyadhHour >= 17 && riyadhHour <= 19) {
            return "evening";
        } else {
            return "night";
        }
    }
    function seeSunIfSettingOrRising(hour) {
        if (hour >= 5 && hour <= 7) {
            return "sunrise";
        } else if (hour >= 17 && hour <= 19) {
            return "sunset";
        }
    }
    const timeSetOfDay = getTime(riyadhHour);
    document.body.classList.add(timeSetOfDay);
    document.title = `Weather in Riyadh - ${timeSetOfDay.charAt(0).toUpperCase() + timeSetOfDay.slice(1)}`;
    const rainKeywords = ["rain", "shower", "drizzle", "downpour"];
    const isRaining = disc
        ? rainKeywords.some(keyword => disc.toLowerCase().includes(keyword))
        : false;


    const rainAudio = document.getElementById("rain-sound");

    if (isRaining) {
        rainAudio.play().catch((e) => {
            console.warn("User interaction needed to play sound.");
        });
        const rainContainer = document.getElementById("rain-container");
        const numberOfDrops = 50; // Adjust the number of raindrops as needed
        for (let i = 0; i < numberOfDrops; i++) {
            const drop = document.createElement("div");
            drop.className = "raindrop";
            drop.style.left = Math.random() * 100 + "vw"; // Random horizontal position
            drop.style.animationDuration = Math.random() * 2 + 1 + "s"; // Random duration between 1s and 3s
            drop.style.opacity = Math.random(); // Random opacity for each drop
            rainContainer.appendChild(drop);
        }
    } else {
        rainAudio.pause();
        rainAudio.currentTime = 0; // Reset sound
    }
});
