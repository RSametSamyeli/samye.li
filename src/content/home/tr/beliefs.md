Bunlar, yazılım ve şirket kurarken dayandığım fikirler. Her biri yaptığım bir işten geliyor ve hakkında yazdığım yere bağlanıyor. Yazıların çoğu İngilizce.

## Mimari ve güvenlik

1. **Kuralı bir politikaya değil, sisteme koyun.** Bir belgede duran kural baskı altında unutulur. Bir şey asla olmamalıysa, sistemi onu reddedecek şekilde kurun. ([Stop Defending Your Moat with Policy](https://medium.com/@sametsamyeli/stop-defending-your-moat-with-policy-3-5-dc288b4b61d4))
2. **"Yapamayız", "söz veriyoruz"dan güçlüdür.** Sıfır bilgi (zero-knowledge) bir gizlilik politikası değil, mimaridir: operatöre bakmama sözü verdirmek yerine şemayı, göremeyeceği şeyi göremeyeceği şekilde tasarlayın. ([Zero-Knowledge as Architectural Blindness](https://medium.com/@sametsamyeli/zero-knowledge-as-architectural-blindness-2-5-23581de51e25))
3. **En güvenli açık, hiç olmayandır.** Tehlikeli bir yeteneği daha iyi kilitlemek, o yeteneğe hiç sahip olmamaktan zayıftır. ([We Built a Workflow Engine That Can't Have n8n's CVE](https://medium.com/@sametsamyeli/we-built-a-workflow-engine-that-cant-have-n8n-s-cve-4fc3c33dde6b))
4. **Güvenlik bir build adımıdır.** lodos.md'de her build'de 175 güvenlik kuralı çalışır; biri bozulursa sürüm yayınlanmaz. ([lodos.md](/tr/lodos/))

## Performans

5. **Tahmin etmeyin, ölçün.** Neyin yavaş olduğuna dair ilk sezgi genelde yanlıştır. NFS World'ü tarayıcıda çalıştırırken darboğaz GPU değil, oyunun kendi iş parçacığıydı. ([NFS World in the Browser](/blog/nfs-world-in-the-browser-performance/))
6. **Çıtayı sayıyla koyun ve neyden vazgeçmeyeceğinizi söyleyin.** "Asla 60 fps'in altına düşme, 144'ü hedefle" ve grafikler orijinalle birebir: ölçülebilir bir hedef ve ona ulaşmak için feda edilmeyecek bir kısıt. ([NFS World in the Browser](/blog/nfs-world-in-the-browser-performance/))

## Yapay zekâ ve şirketler

7. **İşi yapay zekâ yürütmeli, yönü kurucu belirlemeli.** Küçük bir şirketin büyümesi, kurucusunun daha çok saat çalışmasına bağlı olmamalı. ([lodos.md](/tr/lodos/))
8. **Bazı kararlar asla yapay zekâya bırakılmaz.** Yetki vermek, kendi özerkliğini artırmak ve bir işi "bitti" ilan etmek insanlarda kalır. ([lodos.md](/tr/lodos/))
9. **Okuyabildiğiniz hafıza, güvenmek zorunda olduğunuz hafızadan iyidir.** Bir yapay zekânın şirket hakkında bildikleri gizli bir özet değil, bir insanın okuyup düzeltebildiği sayfalar olmalı. ([lodos.md](/tr/lodos/))
10. **Verileriniz sizin kalır.** Önce yerelde, uçtan uca şifreli ve telemetrisiz; böylece biz dahil hiçbir sağlayıcı onları göremez. ([lodos.md](/tr/lodos/))
