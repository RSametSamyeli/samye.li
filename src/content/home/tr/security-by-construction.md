Çoğu yazılımın güvenliği sözlere dayanır: sırların asla loglanmadığını söyleyen bir politika, kimsenin `eval` eklemediğini kontrol eden bir kod incelemesi. Sözler, gece yarısı yapılan bir refactor'a kadar tutar. Yapısal güvenlik (security by construction), sistemi güvensiz şeyin hiç olamayacağı şekilde kurmak ve bunu her commit'te build'e kanıtlatmaktır.

[lodos.md](/tr/lodos/)'nin arkasındaki fikir bu. Aşağıdaki yazı dizisi bunun pratikte nasıl çalıştığını anlatıyor; yazılar lodos.md blogunda Türkçe olarak yayında.

## Yazı dizisi

1. **[n8n'in CVE'sine Sahip Olamayan Bir Workflow Motoru İnşa Ettik](https://lodos.md/tr/blog/n8n-cve-alamayan-workflow-motoru)** (1/5). n8n'in CVE-2025-68613 açığı, ifade değerlendirme (expression evaluation) üzerinden CVSS 9.9 puanlı bir uzaktan kod çalıştırmaydı. lodos'un workflow motorunda hiçbir yerde ifade değerlendirici yok; bu yüzden o sınıftan bir hata var olamaz, build'deki bir grep de bunu böyle tutuyor.
2. **[Mimari Körlük Olarak Zero-Knowledge](https://lodos.md/tr/blog/mimari-korluk-olarak-sifir-bilgi)** (2/5). Yapay zekâ Stripe canlı anahtarınızı göremez: hiçbir veritabanı sütunu, IPC metodu ya da araç gizli bir bilgiyi düz metin olarak döndürmez. "Göremez", bir söz değil, şemanın bir özelliğidir.
3. **[Savunma Hattınızı Yazılı Kurallara Emanet Etmeyin](https://lodos.md/tr/blog/savunma-hattinizi-yazili-kurallara-emanet-etmeyin)** (3/5). Her commit'te iki denetim çalışır: biri yasaklanan bir yetenek geri gelirse build'i, diğeri bir ders kaybolursa wiki'yi düşürür. İkisi de kurcalandığında fark edilen bir HMAC zinciriyle mühürlüdür.
4. **Sıradaki** (4/5): yalnızca öneren öğrenme döngüsü. Ajan kendi becerileri için değişiklik önerir; bir insan farkı onaylamadan hiçbir şey kalıcı hale gelmez.

## Çevresinde

- **[Sıfır-bilgi bir şirket işletim sistemini neden kurduk?](https://lodos.md/tr/blog/sifir-bilgi-sirket-os)**: lodos'un şirketin verisini neden şirketin kendi makinesinde tuttuğu ve bir baytını bile neden okuyamadığı.
- **[Yapay zekânız Stripe anahtarınızı görmeden onu nasıl kullanır?](https://lodos.md/tr/blog/sirlarinizi-goremeyen-yapay-zeka)**: kasanın arkasındaki çalışma anı gizli bilgi enjeksiyonu kalıbı.
- **[Yerel-öncelikli yazılım](https://lodos.md/tr/blog/yerel-oncelikli-yazilim)**: şirketinizin verisi neden kendi makinenizde durmalı.
- **[Kendini güncelleyen bir wiki](https://lodos.md/tr/blog/kendini-guncelleyen-wiki)**: Karpathy LLM-wiki kalıbı, lint ve denetim zinciriyle.

## İlkeler

Bu dizinin sürekli döndüğü kurallar [inandıklarım](/tr/beliefs/) sayfasında: kuralı bir politikaya değil, sisteme koyun; "yapamayız", "söz veriyoruz"dan güçlüdür; en güvenli açık, hiç olmayandır; güvenlik bir build adımıdır.
