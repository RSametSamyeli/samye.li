Bunlar, yazılım ve şirket kurarken dayandığım fikirler. Her biri yaptığım bir işten geliyor ve hakkında yazdığım yere bağlanıyor.

## Mimari ve güvenlik

1. **Kuralı bir politikaya değil, sisteme koyun.** Bir belgede duran kural baskı altında unutulur. Bir şey asla olmamalıysa, sistemi onu reddedecek şekilde kurun. ([Savunma Hattınızı Yazılı Kurallara Emanet Etmeyin](https://lodos.md/tr/blog/savunma-hattinizi-yazili-kurallara-emanet-etmeyin))
2. **"Yapamayız", "söz veriyoruz"dan güçlüdür.** Sıfır bilgi (zero-knowledge) bir gizlilik politikası değil, mimaridir: operatöre bakmama sözü verdirmek yerine şemayı, göremeyeceği şeyi göremeyeceği şekilde tasarlayın. ([Mimari Körlük Olarak Zero-Knowledge](https://lodos.md/tr/blog/mimari-korluk-olarak-sifir-bilgi))
3. **En güvenli açık, hiç olmayandır.** Tehlikeli bir yeteneği daha iyi kilitlemek, o yeteneğe hiç sahip olmamaktan zayıftır. ([n8n'in CVE'sine Sahip Olamayan Bir Workflow Motoru](https://lodos.md/tr/blog/n8n-cve-alamayan-workflow-motoru))
4. **Güvenlik bir build adımıdır.** lodos.md'de her build'de 175 güvenlik kuralı çalışır; biri bozulursa sürüm yayınlanmaz. ([lodos.md](/tr/lodos/))

## Performans

5. **Tahmin etmeyin, ölçün.** Neyin yavaş olduğuna dair ilk sezgi genelde yanlıştır. NFS World'ü tarayıcıda çalıştırırken darboğaz GPU değil, oyunun kendi iş parçacığıydı. ([NFS World in the Browser](/blog/nfs-world-in-the-browser-performance/))
6. **Çıtayı sayıyla koyun ve neyden vazgeçmeyeceğinizi söyleyin.** "Asla 60 fps'in altına düşme, 144'ü hedefle" ve grafikler orijinalle birebir: ölçülebilir bir hedef ve ona ulaşmak için feda edilmeyecek bir kısıt. ([NFS World in the Browser](/blog/nfs-world-in-the-browser-performance/))

## Yapay zekâ ve şirketler

7. **İşi yapay zekâ yürütmeli, yönü kurucu belirlemeli.** Küçük bir şirketin büyümesi, kurucusunun daha çok saat çalışmasına bağlı olmamalı. ([lodos.md](/tr/lodos/))
8. **Bazı kararlar asla yapay zekâya bırakılmaz.** Yetki vermek, kendi özerkliğini artırmak ve bir işi "bitti" ilan etmek insanlarda kalır. ([lodos.md](/tr/lodos/))
9. **Okuyabildiğiniz hafıza, güvenmek zorunda olduğunuz hafızadan iyidir.** Bir yapay zekânın şirket hakkında bildikleri gizli bir özet değil, bir insanın okuyup düzeltebildiği sayfalar olmalı. ([lodos.md](/tr/lodos/))
10. **Verileriniz sizin kalır.** Önce yerelde, uçtan uca şifreli ve telemetrisiz; böylece biz dahil hiçbir sağlayıcı onları göremez. ([lodos.md](/tr/lodos/))
