# NestJS Backend – Kod Kuralları ve Sürdürülebilirlik

Bu dosya proje standartlarının özetidir. Cursor için detaylı kural: `.cursor/rules/nestjs-standards.mdc`.

---

## 1. Ortak (Common) Modül

- Birden fazla modülde kullanılacak **yardımcı fonksiyonlar**, **guard'lar**, **pipe'lar**, **decorator'lar** ve **sabitler** `src/common/` altında toplanmalı.
- Örnek yapı: `src/common/utils/`, `src/common/guards/`, `src/common/decorators/`, `src/common/constants/`.
- Sadece gerçekten paylaşılan kod common'da olmalı; modüle özel mantık buraya taşınmamalı.

## 2. Controller / Service Ayrımı

- **Controller** sadece HTTP ile ilgilenir: isteği alır, service'i çağırır, yanıtı döner. İş mantığı içermemeli.
- **Tüm iş mantığı** (validasyon, hesaplama, harici servis çağrıları, veri dönüşümü) **service** katmanında olmalı.
- Controller metodları ince kalmalı; karmaşık if/else veya döngüler service'e taşınmalı.

```typescript
// ❌ Kötü: mantık controller'da
@Get()
find() {
  const filtered = this.items.filter(x => x.active && x.tenantId === this.tenant);
  return filtered.map(x => ({ id: x.id, name: x.name }));
}

// ✅ İyi: controller sadece delegasyon
@Get()
find() {
  return this.itemsService.findActiveByTenant(this.tenant);
}
```

## 3. DTO ve Entity Yapısı

- **Entity**: Veritabanı şemasına karşılık gelir; API yanıtında doğrudan entity dönmeyin.
- **DTO**: Gelen istek (CreateDto, UpdateDto) ve giden yanıt (ResponseDto) için ayrı DTO'lar kullanın. Entity → DTO dönüşümü service veya mapper'da yapılsın.
- DTO validasyonu için `class-validator` / `class-transformer` ve controller'da `ValidationPipe` kullanın.

## 4. Dosya ve Modül Bölme

- **Service** veya **module** dosyası uzadıysa (~150–200+ satır) veya farklı sorumluluk alanlarına giriyorsa dosyayı bölün.
- Örnek: `UserService` → `UserService` (temel CRUD) + `UserAuthService` veya `UserProfileService`. Hepsi ilgili modülün `providers`'ında olabilir.
- Her modül kendi klasöründe: `users/` içinde `users.module.ts`, `users.controller.ts`, `users.service.ts`, `dto/`, `entities/`.

## 5. Yetkilendirme (Roller) Tek Yerden

- Endpoint yetkileri **tek bir yerden** yönetilmeli: guard + decorator + tek config/map.
- Rol kontrolü guard üzerinden yapılsın; controller metodlarında tekrarlı `if (user.role !== ...)` yazılmamalı.
- Örnek: `@Roles('admin', 'manager')` decorator'ı + `RolesGuard`; rol listesi sadece bu yapıda tutulsun.

## 6. Test ile Birlikte Özellik

- Her **yeni özellik** yazılırken ilgili **test de yazılmalı**; özellik merge edilmeden testler yeşil olmalı.
- **Nasıl çalıştırılacağı** test dosyası veya ilgili script’in üstünde yorum satırı olarak belirtilebilir. Örnek:

```text
Çalıştırma:
  Tüm testler:    npm run test
  Watch modu:     npm run test:watch
  Tek dosya:      npm run test -- app.service
  Coverage:       npm run test:cov
```

- Unit testler öncelikle service’lere; E2E testler kritik akışlar için yazılsın.

## 7. Service vs Global (Ortak) Mantık

- **Service** içinde sadece **o modüle ait iş mantığı** (domain kuralları, modüle özel validasyon/hesaplama) olmalı.
- **Genel ve her yerde aynı** kullanılacak fonksiyonlar **global (common)** yazılmalı, service’ler bunları import edip kullanmalı. Örnekler:
  - Para birimi dönüşümü
  - Saat / timezone dönüşümü
  - Şifreleme, hash, token üretimi
  - Slug üretimi, metin formatlama
- Örnek konumlar: `src/common/utils/currency.util.ts`, `src/common/utils/date.util.ts`, `src/common/utils/crypto.util.ts`.

## 8. Diğer Öneriler

- **Hata yönetimi**: Ortak `ExceptionFilter` veya tutarlı `HttpException`; hassas detaylar production’da sadece log’da.
- **Config**: `ConfigModule` ile ortam değişkenleri tek yerden; `.env` `.gitignore`’da kalsın.
- **İsimlendirme**: Controller HTTP ile uyumlu (get, create, update, delete); service domain dilinde (`findActiveByTenant`, `registerUser`).
- **Modül sınırları**: Modüller az bağımlı; paylaşım `CommonModule` veya ortak interface üzerinden.
- **Loglama**: Yapısal log (Logger/Pino); isteğe request id, kullanıcı, modül eklenebilir.
- **API sürümü**: Breaking change planlanıyorsa `/v1/...` veya header ile sürümleme tek yerden.
- **Rate limiting**: Kritik endpoint’lerde rate limit **varsayılan** uygulanır. Hangi endpoint’lerin kritik olduğu ve limit değerleri **tek bir dosyada** (örn. `src/common/config/rate-limit.config.ts`) belirtilir; değiştirmek istediğimizde sadece bu dosyayı düzenleriz. Tek guard/middleware kullanılır.
- **Health check**: `/health` veya `/ready` deployment/load balancer için tek yerde.
- **Swagger**: API'leri kontrol etmek ve dokümante etmek için Swagger kullanılır. `main.ts` içinde tek noktadan ayarlanır (path: `/api`). Her controller'da `@ApiTags('ModülAdı')`, endpoint'lerde `@ApiOperation({ summary: '...' })` ve DTO'larda `@ApiProperty()` ile açıklama eklenir; Swagger UI güncel kalır ve API'ler tek yerden test edilebilir.
- **İdempotency**: Yan etki olmaması gereken isteklerde (ödeme, kayıt, tek seferlik işlemler) **idempotency key** kullanılır. Strateji tektir: client `Idempotency-Key` header gönderir, guard + cache (veya DB) ile aynı key’in tekrar işlenmesi engellenir; değiştirmek istersek tek yerde (guard + config) düzenlenir.
