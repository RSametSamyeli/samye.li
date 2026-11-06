samye.li statik bir site; Markdown dosyalarından ve birkaç TypeScript dosyasından üretiliyor. Kaynak kodu [GitHub'da](https://github.com/RSametSamyeli/samye.li).

## Teknoloji

- Markdown ve MDX içerik koleksiyonlarıyla **[Astro](https://astro.build)**, **UnoCSS**, **Inter** ve **DM Mono** yazı tipleri.
- Stephanie Lin'in [AntfuStyle](https://github.com/lin-stephanie/astro-antfustyle-theme) temasından başladı, sonra sadeleştirilip yeniden kuruldu.
- Docker'da derlenip **Coolify** (Hetzner) üzerinde nginx ile, **Cloudflare** arkasından sunuluyor. `main` dalına yapılan her push yayına çıkıyor.

## Tasarım

- Varsayılan olarak koyu; açık tema bir tık uzakta.
- İşaret, yani samye**.**li'deki vurgulu noktayla birlikte bir "s", kodla çiziliyor. Favicon, uygulama ikonları ve her paylaşım kartı build sırasında Satori ile bundan üretiliyor.
- İkincil metinler, iki temada da kontrastı ölçülmüş bir renk kullanıyor (WCAG AA); her sayfa türü axe ile denetleniyor.

## Makineler için

- Her sayfanın sade bir Markdown kopyası var; `text/markdown` isteyen istemcilere sayfanın kendi adresinde de dönüyor. [llms.txt](/llms.txt) ve [llms-full.txt](/llms-full.txt) tüm siteyi anlatıyor.
- Birbirine bağlı JSON-LD (Person, ProfilePage, BlogPosting, breadcrumb), hreflang ile eşleştirilmiş İngilizce ve Türkçe sayfalar, son değişiklik tarihli bir sitemap ve her yayından sonra IndexNow bildirimi.
- robots.txt arama motorlarına, yapay zekâ cevap motorlarına ve model eğitimine açık.

## Denetimler

- CI; format, lint, tip kontrolü ve build'i çalıştırıyor, ardından derlenmiş siteyi okuyan bir betik başlıkları, açıklamaları, canonical adresleri, paylaşım görsellerini, yapısal veriyi, iç bağlantıları, hreflang eşleşmelerini, sitemap'i ve yazım kurallarını denetliyor.
- Her yanıtta bir İçerik Güvenlik Politikası (CSP) ve diğer güvenlik başlıkları; güvenlik açığı bildirmek için bir [security.txt](/.well-known/security.txt).

## Gizlilik

- Çerez yok, üçüncü taraf takip aracı yok.
