document.addEventListener("DOMContentLoaded", function () {

    const weatherInfoC = document.getElementById("weather-info-c");
    const weatherInfoF = document.getElementById("weather-info-f");
    const weatherStatus = document.getElementById("weather-status");
    const weatherName = document.getElementById("weather-name");
    const weatherCountry = document.getElementById("weather-country");
    const weatherIcon = document.getElementById("weather-icon");
    const weatherLocalTime = document.getElementById("weather-localtime");
    const locationInput = document.getElementById("location-input");

    function fetchWeatherData(location) {
        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`;

        fetch(apiUrl)
        .then(response => {
            if (response.status === 400) {
                // 404 durumu, konumun bulunamadığını gösterir
                Swal.fire({
                    icon: 'error', // Bildirim türü (success, error, warning vb.)
                    title: 'Please enter a valid location.',
                    text: `The location you entered does not exist!`
                });
                throw new Error("Konum bulunamadı");
            }
            return response.json();
        })
            .then(data => {
                // API'den gelen verileri kullanarak hava durumu bilgilerini görüntüleme
                const temperatureC = data.current.temp_c;
                const condition = data.current.condition.text;
                const temperatureF = data.current.temp_f;
                const icon = data.current.condition.icon;
                const country = data.location.country;
                const name = data.location.name;
                const localtime = data.location.localtime;
                const dateTimeParts = localtime.split(' ');
                const datePart = dateTimeParts[0]; // Tarih kısmı
                const timePart = dateTimeParts[1]; // Saat kısmı
                // Tarihi "-" karakteri ile parçalara ayırın
                const dateParts = datePart.split('-');
                const year = parseInt(dateParts[0]);
                const month = parseInt(dateParts[1]);
                const day = parseInt(dateParts[2]);
                // Hangi gün olduğunu ve hangi ayın kaçıncı günü olduğunu belirleyin
                const date = new Date(year, month - 1, day);
                const dayOfWeek = date.toLocaleString('default', { weekday: 'long' }); // Hangi gün olduğu
                weatherLocalTime.innerHTML = `${dayOfWeek} ${datePart} ${timePart} `;
                weatherIcon.setAttribute("src", "https:" + icon);
                weatherCountry.innerHTML = country;
                weatherName.innerHTML = name;
                weatherStatus.textContent = condition;
                weatherInfoC.innerHTML = `Today weather is ${temperatureC}°C`;
                weatherInfoF.innerHTML = `Today weather is ${temperatureF}°F`;
            })
            .catch(error => {
                console.error("Hata:", error);
                // Hata durumunda kullanıcıya uygun bir hata mesajı gösterme
            
            });
    }
    document.getElementById("change-data").addEventListener("click", function () {
        const weatherInfoC = document.getElementById("weather-info-c");
        const weatherInfoF = document.getElementById("weather-info-f");
    
        // "c" öğesini görünmez yaparsa, "f" otomatik olarak görünür olur ve tersi
        if (weatherInfoC.style.display === "none") {
            weatherInfoC.style.display = "block";
            weatherInfoF.style.display ="none";
        } else {
            weatherInfoC.style.display = "none";
            weatherInfoF.style.display ="block";
        }
    });
    
    
    // Sayfa yüklendiğinde İstanbul hava durumu bilgilerini al
    fetchWeatherData("Istanbul");
   
    document.getElementById("search-button").addEventListener("click", function () {
        // Kullanıcının girdiği konumu al
        const locationInput = document.getElementById("location-input");
        const location = locationInput.value;
    
        if (!location) {
            // Kullanıcı bir konum girmeden arama düğmesine tıklarsa uyarı mesajı göster
            Swal.fire({
                icon: 'error', // Bildirim türü (success, error, warning vb.)
                title: 'Please enter a valid location.',
                text: `Please enter a location!`
            });
        } else {
            // API isteğini göndermek için location değerini kullan
            fetchWeatherData(location);
        }
    });
    
});
