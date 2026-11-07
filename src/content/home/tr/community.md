En gurur duyduğum işlerin bir kısmı hiçbir zaman bir ürün olmadı. Çoğu birbirini tanımayan insanların, o hafta var olması gerektiği için bir araya gelip kurduğu şeylerdi.

## Açık Yazılım Ağı (AYA)

6 Şubat 2023'te Türkiye'nin güneyini saatler arayla 7,7 ve 7,6 büyüklüğünde iki deprem vurdu; on il yıkıldı. Enkaz altından yardım çağrıları, adresleri, isimleri ve kat numaralarıyla, kimsenin okuyamayacağı bir hızla sosyal medyaya akmaya başladı. Her şey Twitter'da başladı. Arkadaşlarım [Eser Özvataf](https://eser.dev/) ve [Furkan Kılıç](https://x.com/benfurkankilic) o gece yazılımcılara çağrı yaptı; tweetlerini görünce doğrudan Discord sunucusuna girdim ve işe koyuldum. Arkadaşım [Eray Gündoğmuş](https://eraygundogmus.com/) da öyle, binlerce kişi de öyle. Birkaç gün içinde o sunucu **Açık Yazılım Ağı (AYA)** olmuştu ve ben de kurucularından biri oldum: her disiplin için bir kanal, her projenin bir sorumlusu, bir şeyi yayına çıkarmanın bir yolu. Ağ **25.000'den fazla gönüllü geliştiriciye** ulaştı.

### AfetHarita: bir tweetten haritadaki bir noktaya

Twitter'daki bir yardım çağrısı bir cümleydi: bir isim, bir sokak, bir kat, "sesler geliyor". Binlercesi vardı ve retweetlerin, ekran görüntülerinin altında kayboluyordu. **[AfetHarita](https://afetharita.com)** bunları okudu, adresi ayıkladı (ekran görüntüleri için OCR, metin için bir dil modeli) ve her birini haritada, bir kurtarma ekibinin gidebileceği bir nokta olarak gösterdi. İlk depremden yaklaşık **30 saat sonra** yayındaydı. **AFAD** da kullandı.

<figure>
<img src="/images/community/afetharita-map.webp" width="1400" height="694" loading="lazy" decoding="async" alt="AfetHarita'nın işaretlerle dolu Türkiye haritası: yardım çağrıları numaralı kümeler ve deprem bölgesinin üzerinde bir ısı haritası olarak, hastaneler, barınma ve sıcak yemek noktaları simgelerle; bir filtre paneli ve üstte 'Alanı Tara' düğmesi.">
<figcaption>Şubat 2023'te AfetHarita: yardım çağrıları kümeler ve ısı haritası olarak, üstünde hastane, barınma ve sıcak yemek noktaları.</figcaption>
</figure>

Kullanıldığı koşullar için yapıldı:

- **Çöken şebekede telefonlar.** Önce mobil, 2G ve 3G için ayarlı. Harita, ağır bir harita SDK'sı yerine 42 KB'lık açık kaynak [Leaflet](https://leafletjs.com/). Yakın noktalar numaralı kümelere birleşiyor, yoğun bölgeler ısı haritasına dönüşüyor; telefon on bin işaret çizmek zorunda kalmıyor.
- **Yardım çağrılarından fazlası.** Kurumlar verilerini gönderdi, veriler katman oldu: Ahbap noktaları, hastaneler, sıcak yemek noktaları. Ardından uydu ve arazi görünümleri, kaynağa ve zamana göre filtreler ve İngilizce.
- **Çökmeyen bir backend.** İlk sürüm Go ile yeniden yazıldı; konteynerlerde, birden fazla bulutta yayına alındı.
- **Baskı altında, bir ürün gibi yayına çıktı.** Ayrı main, sürüm adayı ve geliştirme dalları, her pull request için bir önizleme, issue ve PR şablonları, ve her bildirimi içeri almadan önce kontrol eden bir triyaj ekibi.

<figure>
<img src="/images/community/afetharita-traffic.webp" width="960" height="800" loading="lazy" decoding="async" alt="17 Ocak ile 16 Şubat 2023 arası Cloudflare istatistikleri: bütün çizgiler 6 Şubat'a kadar düz, sonra sıçrıyor. 627.120 tekil ziyaretçi, 34,24 milyon istek, 2 TB veri.">
<figcaption>Trafikte bir ay: önce hiçbir şey, sonra 627.000 kişi.</figcaption>
</figure>

Site ilk ayında **627.000 tekil ziyaretçiye ve 34 milyon isteğe** ulaştı. [AKUT](https://www.akut.org.tr/) verileri kendi olay yönetimine aldı. Yayına çıkış duyurusu 4,2 milyon kez görüntülendi. Haritanın kopyaları yurt dışındakilerin peşinden Berlin'e, Londra'ya ve Hollanda'ya gitti, bağışların nereye bırakılabileceğini gösterdi; haber siteleri haritayı kendi sayfalarına gömdü. [TIME](https://time.com/6254500/turkey-earthquake-twitter-musk-rescue/) ve [NBC San Diego](https://www.nbcsandiego.com/video/news/local/rancho-penasquitos-man-working-with-thousands-online-to-help-turkey-earthquake-victims/3170373/) dışında Wired, Euronews ve Yahoo da haber yaptı.

Acil durum bitince veri de gitti: kişisel veriler KVKK kapsamında silindi, adres artık [afet.org](https://afet.org)'a yönleniyor. Kod [github.com/acikyazilimagi](https://github.com/acikyazilimagi) adresinde açık; bir sonraki afette kimse sıfırdan başlamasın diye.

AfetHarita'nın frontend ekibini yöneten Eray, ilk commit'ten son deploy'a kadar bütün hikâyeyi yazdı: [afetharita.com binlerce depremzedeye nasıl yardım etti?](https://gundogmuseray.medium.com/afetharita-com-binlerce-depremzedeye-nas%C4%B1l-yard%C4%B1m-etti-f3ec0cd4adbe)

### deprem.io

Aynı ağın geliştirdiği **[deprem.io](https://deprem.io)**, yardımı koordine etti: kimin neye ihtiyacı olduğu ve kimin getirebileceği.

### Bana öğrettiği

Bir kriz anında darboğaz nadiren koddur. Darboğaz koordinasyondur: kimin neden sorumlu olduğunu bilmek, hızlı karar vermek ve gelecek hafta mükemmel olacak bir şey yerine, ihtiyacı olanlara bugün çalışan bir şey ulaştırmak.

## gazla.co

**[gazla.co](https://gazla.co)**'yu girişimcilerin birbirini bulabileceği bir yer olarak kurdum. Hiç dış yatırım almadan **50.000'den fazla kişiye ve 280'i aşkın girişime** ulaştı.

Onu yürütmek; etkinlikler, mesajlar, içerik ve iş ortakları için bir düzine farklı araç demekti ve bütün bağlam tek bir kafadaydı: benimkinde. O sorun, bugün [lodos.md](/tr/lodos/)'nin çözdüğü sorun. lodos.md'yi geliştirirken gazla.co'ya ara verdim; topluluk yerinde duruyor.

## Açık kaynak

- **[OHIF](https://ohif.org/)**: hastanelerin üzerine sistem kurduğu açık kaynak tıbbi görüntüleme yazılımına, görüntü alanına göre çalışan bir gri tonlama aracı.
- **[Need for Speed Underground 2 tarayıcıda](https://github.com/th0mk/nfsu2-web)**, [nfsu2.xyz](https://nfsu2.xyz) adresinde yayında: düzenli katkı veriyor, repoyu takip ediyorum. Türkçe çeviri benim, oyundaki 3.918 metnin tamamı elle; oyunun tarayıcının dilinde açılmasını sağlayan değişiklik de.
- **[Bu site](https://github.com/RSametSamyeli/samye.li)**: build denetimlerinden markdown kopyalarına kadar kaynak kodu açık. Nasıl yapıldığı [künye](/tr/colophon/) sayfasında.

Bir topluluk ya da gönüllü bir çalışma yürütüyorsanız ve yardımcı olabileceğimi düşünüyorsanız [sam@samye.li](mailto:sam@samye.li) adresine yazın.
