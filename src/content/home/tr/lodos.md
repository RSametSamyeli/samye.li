Şirketinizi öğrenen ve her departmanda çalışan bir yapay zekâ ekibi: müşteriler, satış, pazarlama, operasyon, finans. İş, sizin kendi araçlarınızda yapılır. Para, yayın ve kritik kararlar size gelir. Verilerinizi ise biz dahil kimse göremez.

[lodos.md →](https://lodos.md/)

## Sorun

Küçük bir şirketin işi sekiz farklı yerde durur ve bağlamı yalnızca kurucu taşır. Her yapay zekâ aracı tek bir departmanı bilir; hiçbiri şirketi bilmez. Tek bir iade kararı için bile müşteri, sipariş, stok, politika ve para bilgisinin hepsi bir arada gerekir.

Lodos.md olmadan sıradan bir sabah **43 bildirim** demektir. Lodos.md ile **3 karar**: iadeyi onayla, tedarikçi siparişini gönder, reklam bütçesini başlat. Gerisini ekip halleder.

## Üç şey, bir arada

Bir şirketi uçtan uca yönetmek üç şey ister. Piyasada her biri tek başına var; üçü bir arada yok.

- **Şirketi bilen bir beyin**: kararlar, politikalar, müşteriler, siparişler, geçmiş. Satır satır sürümlenir; kurucu okuyabilir ve düzeltebilir.
- **Gerçek sistemlerde çalışan eller**: iadeler, stok senkronizasyonu, müşteri yanıtları, yayınlar, pull request'ler. Her işlem kaynağında doğrulanır ve geri alınabilir.
- **Kimin neyi yapabileceğini bilen bir yönetişim**: hangi yapay zekâ, hangi hesapta, hangi işi, ne kadar özerklikle yapıyor. Kritik adımlar onay bekler; her şey kayıt altına alınır.

## Lodos Brain

Hafıza bir wiki'dir: gizli bir özet yerine kurucunun okuyup düzenleyebildiği sayfalar ve bağlantılar. Her notun bir tarihi ve bağlamı vardır, her konuşma ona yeni bir şey öğretir ve eskimiş bilgi güncel gerçeklerden ayrı tutulur. Dış içeriklere gizlenmiş talimatlar ona yazamaz. Sizin cihazınızda yaşar ve her modelle çalışır. Modeller değişir; beyin kalır.

## Tek uygulama, sekiz araç, tek beyin

- **Integrations**: Shopify, Amazon ve ajanların işi gerçekten yaptığı 129 sistem
- **Vault**: 1Password gibi şifreli bir kasa; yapay zekâ bir anahtarı, değerini hiç görmeden kullanır
- **Chat**: yapay zekâ kurucu ortağınız ve ajan ekibiyle bir grup sohbeti
- **Kanban**: ajanların üstlendiği ve GitHub üzerinden kapanan görevler
- **Calendar**: eksiksiz bir takvim ve 20'den fazla sosyal platformda yayın
- **Wiki**: Lodos Brain'in yaşadığı yer; Obsidian gibi bağlantılı ve kendini güncelleyen
- **Workflows**: Zapier ya da n8n gibi otomasyonlar; sohbette tarif ederek kurulur
- **Engage**: WhatsApp, Instagram ve Gmail tek bir gelen kutusunda; yanıtları siparişi bilen bir yapay zekâ verir

## Özerkliği siz belirlersiniz

Her ajanın bir seviyesi vardır (gözlemci, hazırlayıcı, uygulayıcı, özerk). Her işlem türü (okuma, müşteriye yanıt verme, yayınlama, para, silme) kapalı olabilir, önce size sorabilir ya da sormadan çalışabilir. Üç şey asla yapay zekâya bırakılmaz: yetki vermek, kendi özerkliğini artırmak ve bir işi "bitti" ilan etmek.

## Biz bile göremeyiz

Anahtarlarınız sizde kalır. Gizli bilgiyi siz görürsünüz; yapay zekâ yalnızca adını görür (`{{secrets.stripe.key}}`); Lodos.md ise yalnızca şifreli baytları görür. Önce yerelde çalışır (local-first), bulut yedeği isteğe bağlıdır ve uçtan uca şifrelidir, telemetri sıfırdır. Her build'de 175 güvenlik kuralı denetlenir; biri bozulursa sürüm yayınlanmaz. Her işlem imzalı bir kayda yazılır, böylece kurcalama fark edilir.

Ekipler de aynı modeli kullanır: her üye için Signal tarzı uçtan uca şifreleme. Bir ajan, bağlı olduğu üyenin göremediği hiçbir şeyi göremez.

## Neden yapıyorum

Küçük bir şirketin büyümesi, kurucusunun daha çok saat çalışmasına bağlı olmamalı. İşi yapay zekâ yürütmeli; kurucu yönü belirlemeli ve kontrolü elinde tutmalı.

gazla.co'yu 50.000'den fazla kişilik bir topluluğa büyütürken hep aynı duvara çarptım: mesajlar, etkinlikler, içerik ve iş ortakları ayrı sistemlerdeydi ve bağlamı bir arada tutan tek kişi bendim. Şubat 2026'da ABD'deki işimden ayrıldım, gazla.co'ya ara verdim ve dış yatırım almadan tüm zamanımı bu probleme ayırdım.

Arkasındaki mimariyi İngilizce olarak yazdım: [Workflow Engine Without n8n's CVE](https://medium.com/@sametsamyeli/we-built-a-workflow-engine-that-cant-have-n8n-s-cve-4fc3c33dde6b), [Zero-Knowledge as Architectural Blindness](https://medium.com/@sametsamyeli/zero-knowledge-as-architectural-blindness-2-5-23581de51e25) ve [Stop Defending Your Moat with Policy](https://medium.com/@sametsamyeli/stop-defending-your-moat-with-policy-3-5-dc288b4b61d4).

## Şu an nerede

Tek bir kurucu tarafından, Lodos.md'nin kendi yapay zekâsıyla beş ayda geliştirildi. Yaklaşık 5.000 otomatik test, 129 entegrasyon ve bekleme listesinde 1.200'den fazla kişi. Şu anda kapalı beta aşamasında; tasarım ortaklarıyla birlikte canlı doğrulama sürüyor.

[lodos.md'de bekleme listesine katılın →](https://lodos.md/)
