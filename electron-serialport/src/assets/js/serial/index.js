// Gerekli modüller ve değişkenlerin tanımlanması
const { SerialPort, SerialPortMock } = require("serialport");
const path = require("path");
const { ReadlineParser } = require("@serialport/parser-readline");

let comPort = document.getElementById("comPort"); // Seri port seçimini içeren HTML elementi
let connectBtn = document.getElementById("connectBtn"); // Bağlanma butonu
let disconnectBtn = document.getElementById("disconnectBtn"); // Bağlantıyı kesme butonu
let newPort; // Seçilen seri portun değeri
let controlPort; // Kontrol edilen seri port
let oldData = ""; // Eski veri

// Kullanılabilir seri portları listeleme fonksiyonu
async function listSerialPorts() {

  try {
    const ports = await SerialPort.list(); // Seri portları listele
    comPort.innerHTML = ""; // Önceki listedeki portları temizle

    if (ports.length !== 0) {
      // Eğer mevcut seri port varsa
      ports.forEach((element) => {
        if (element["manufacturer"] === "Arduino LLC (www.arduino.cc)") {
          // Yalnızca Arduino'ya ait olan portları listele
          let selecAddPort = document.createElement("option");
          selecAddPort.text = element.path;
          selecAddPort.value = element.path;
          comPort.add(selecAddPort); // Listeye ekle
        }
      });
      newPort = comPort.value; // Seçilen seri portun değerini güncelle
    } else {
      // Seri port bulunamazsa bilgilendirici bir seçenek ekle
      let selecAddPort = document.createElement("option");
      selecAddPort.text = "Arduino bağlantısı mevcut değildir";
      selecAddPort.value = 0;
      comPort.add(selecAddPort);
    }
  } catch (err) {
    console.error("Hata:", err); // Hata durumunda konsola yazdır
  }
}

// Seri portları periyodik olarak listeleme fonksiyonu
function listPorts() {
  listSerialPorts(); // Seri portları listele
  setTimeout(listPorts, 2000); // 2 saniyede bir listeleme işlemini tekrarla
}

listPorts(); // Listeleme işlemini başlat

// Seri portlardan gelen veriyi işleme fonksiyonu
function processData(data) {
  let newData = data; // Yeni veri
  if (oldData !== newData) {
    // Eğer eski veri yeni veriden farklıysa
    oldData = newData; // Eski veriyi güncelle
    console.log("Yeni veri:", newData); // Konsola yeni veriyi yazdır
    // Burada yapmak istediğiniz işlemleri gerçekleştirin
  }
}

// Seçilen seri porta bağlanma fonksiyonu
function connectPort() {
  if (!newPort || newPort === "0") {
    console.error("Lütfen bir port seçin."); // Eğer seri port seçilmemişse hata ver
    return;
  }

  const port = new SerialPort({
    path: newPort,
    baudRate: 9600,
  }); // Yeni bir seri port oluştur ve bağlan

  try {
    port.on("open", () => {
      console.log("Seri port açıldı"); // Bağlantı başarılı olduğunda konsola yazdır
      connectBtn.classList.add("deactiveBtn"); // Bağlanma butonunu etkisizleştir
      connectBtn.classList.remove("activeBtn");
      disconnectBtn.classList.add("activeBtn"); // Bağlantıyı kesme butonunu etkinleştir
    });
  } catch {
    port.on("error", (err) => {
      console.error("Seri port hatası:", err); // Bağlantı hatası durumunda konsola yazdır
    });
  }

  const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" })); // Veri akışını işlemek için parser oluştur
  parser.on("data", (data) => {
    processData(data); // Gelen veriyi işleme fonksiyonuna gönder
  });
  controlPort = port; // Kontrol edilen portu güncelle
}

// Seri port bağlantısını kapatma fonksiyonu
function closePort() {
  controlPort.close((error) => {
    if (error) {
      console.error("Hata oluştu:", error); // Bağlantı kapatma hatası durumunda konsola yazdır
    } else {
      console.log("Kapatma başarılı."); // Bağlantı kapatma başarılı olduğunda konsola yazdır
      disconnectBtn.classList.add("deactiveBtn"); // Bağlantıyı kesme butonunu etkisizleştir
      disconnectBtn.classList.remove("activeBtn");
      connectBtn.classList.add("activeBtn"); // Bağlanma butonunu etkinleştir
    }
  });
}

// Kontrol fonksiyonu (Herhangi bir sıkıntı çıktığında bağlantıyı kesmek için)
function kontrol() {
  controlPort.close((error) => {
    if (error) {
      console.error("Hata oluştu:", error); // Bağlantı kapatma hatası durumunda konsola yazdır
    } else {
      console.log("Kapatma başarılı."); // Bağlantı kapatma başarılı olduğunda konsola yazdır
      disconnectBtn.classList.add("deactiveBtn"); // Bağlantıyı kesme butonunu etkisizleştir
      disconnectBtn.classList.remove("activeBtn");
      connectBtn.classList.add("activeBtn"); // Bağlanma butonunu etkinleştir
    }
  });
}
$("p").click(function () {
  alert("The paragraph was clicked.");
});