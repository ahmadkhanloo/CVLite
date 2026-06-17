# بررسی محصول CVLite

تاریخ: 2026-06-17

## خلاصه اجرایی

CVLite الان در وضعیت یک MVP/بتای قوی است: مسئله‌ی واقعی را حل می‌کند، سریع است، آفلاین کار می‌کند، فارسی/انگلیسی و RTL دارد، چند قالب رزومه دارد، و پیام «حریم خصوصی اول» آن قابل فهم و قابل دفاع است.

بهترین جایگاه فعلی محصول:

- یک رزومه‌ساز متن‌باز و عمومی برای کسانی که رزومه‌شان را محلی و خصوصی می‌خواهند.
- یک پروژه‌ی پرتفولیوی قوی که توان frontend، offline-first storage، export/PDF و UX دوزبانه را نشان می‌دهد.
- پایه‌ی خوبی برای یک نسخه‌ی hosted/private، اما هنوز خودش SaaS کامل نیست.

تصمیم اصلی محصول این است: CVLite باید «بدون حساب، خصوصی و محلی» بماند یا به «محصول loginدار، syncدار، محدودشونده و قابل monetization» تبدیل شود. معماری فعلی عمداً local-first است؛ بنابراین هر محدودیت قابل‌اجرا مثل «هر کاربر فقط یک رزومه بسازد» به backend نیاز دارد.

## وضعیت فعلی محصول

### نقاط قوت

- داده‌های رزومه در IndexedDB ذخیره می‌شوند و سمت سرور نمی‌روند.
- جریان اصلی محصول کامل است: ساخت رزومه، ویرایش، پیش‌نمایش، import، export، duplicate و delete.
- پشتیبانی فارسی/انگلیسی و RTL مزیت واقعی برای بازار فارسی‌زبان است.
- تعداد قالب‌ها برای نسخه‌ی عمومی اولیه کافی است.
- Deploy روی Cloudflare راه افتاده و هزینه‌ی نگهداری پایین است.
- اگر PDF server روی هاست فعال نباشد، fallback چاپ مرورگر همچنان خروجی PDF را ممکن می‌کند.

### محدودیت‌ها

- حساب کاربری وجود ندارد؛ داده‌ها فقط روی همان دستگاه می‌مانند.
- sync بین دستگاه‌ها و backup ابری نداریم.
- محدودیت پلن مثل «فقط یک رزومه» در معماری فعلی قابل enforce نیست.
- AI فعلاً با API key شخصی کاربر از داخل مرورگر کار می‌کند. این برای مدل متن‌باز/BYOK خوب است، اما برای محصول تجاری hosted ایده‌آل نیست.
- لینک GitHub الان در topbar و footer صفحه‌ی خوشامد دیده می‌شود.
- بعضی آیکون‌ها هنوز به‌صورت متن، arrow یا emoji هستند. برای نسخه‌ی polish بهتر است icon system یکپارچه داشته باشیم.
- `DEPLOY.md` آپدیت شده و دیگر نباید از `_redirects` catch-all استفاده کند.

## مسیر UX پیشنهادی

هدف UX باید «مینیمال، روان، مدرن و کاری» باشد. این محصول ابزار تولید رزومه است، نه landing page تبلیغاتی. کاربر باید خیلی سریع به ساخت رزومه برسد.

پیشنهادها:

- صفحه‌ی اول باید سریع سه چیز را نشان دهد: ساخت رزومه، رزومه‌های من، GitHub.
- متن‌های معرفی کوتاه و دقیق بمانند؛ پیام اصلی: خصوصی، آفلاین، بدون حساب.
- اکشن‌ها icon system یکپارچه داشته باشند: ساخت، import، export، PDF، theme، language، GitHub، delete، duplicate، preview.
- editor باید dense و قابل scan باشد؛ اینجا وضوح از تزئین مهم‌تر است.
- وضعیت save بهتر دیده شود: `Saved`، `Saving...`، `Offline`.
- یک دکمه‌ی «نمونه رزومه» در first-run اضافه شود تا کاربر قبل از وارد کردن اطلاعات، خروجی را ببیند.
- در موبایل بهتر است editor و preview به شکل دو mode تمام‌عرض جابه‌جا شوند.

## لینک GitHub

انجام شد: لینک GitHub از footer به topbar صفحه‌ی خوشامد هم اضافه شد.

دلیل:

- برای پروژه‌ی متن‌باز، GitHub باید در first viewport دیده شود.
- برای ابزار privacy-first اعتماد می‌سازد.
- کاربران فنی سریع‌تر می‌توانند سورس را بررسی کنند.

بهبود بعدی:

- به‌جای متن `GitHub` از آیکون رسمی GitHub همراه tooltip استفاده شود.
- اگر UI شلوغ نشود، یک لینک سبک مثل `Star on GitHub` می‌تواند اضافه شود.

## آیکون‌ها و ظاهر مدرن

وضعیت فعلی برای MVP قابل قبول است، اما برای حس محصولی مدرن بهتر است آیکون‌ها یکدست شوند.

پیشنهاد فنی:

- اضافه کردن `lucide-react` برای آیکون‌های عمومی UI.
- استفاده از GitHub mark برای لینک GitHub.
- آیکون‌های مناسب: `FileText`، `Download`، `Upload`، `Palette`، `Sparkles`، `Lock`، `Globe2`، `Printer`، `Trash2`، `Copy`، `Search`، `Moon`، `Sun`.
- برای اکشن‌های اصلی مثل `PDF` و `New resume` متن کنار آیکون بماند.
- برای دکمه‌های icon-only حتماً tooltip و `aria-label` اضافه شود.

## متن‌باز یا محصول خصوصی؟

### اگر CVLite متن‌باز بماند

معماری فعلی بهترین گزینه است:

- static/Worker deployment روی Cloudflare
- ذخیره‌ی محلی در IndexedDB
- import/export/backup توسط خود کاربر
- AI با مدل BYOK، یعنی کاربر کلید OpenAI/Anthropic خودش را وارد می‌کند

مزیت این مسیر:

- ساده است.
- اعتماد حریم خصوصی بالاست.
- مسئولیت نگهداری داده‌ی حساس رزومه روی سرور شما نیست.
- هزینه‌ی زیرساخت نزدیک به صفر می‌ماند.

کارهای پیشنهادی:

- README با screenshot و GIF بهتر.
- privacy page یا modal کوتاه: دقیقاً چه چیزی کجا ذخیره می‌شود.
- چند sample resume برای personaهای مختلف.
- issue/discussion link در GitHub.
- تکمیل deploy docs و حذف اشاره‌های قدیمی به `_redirects`.

### اگر CVLite خصوصی یا SaaS شود

در این حالت نمی‌شود به محدودیت client-side اعتماد کرد. اگر قرار است کاربر login کند و فقط یک رزومه داشته باشد، backend باید این قانون را enforce کند.

حداقل زیرساخت لازم:

- Authentication: magic link، OAuth یا passkey.
- Database سمت سرور: users، resumes، plan limits.
- API layer: ساخت/ویرایش/حذف رزومه از مسیر server endpoint.
- Session management: secure cookie یا session provider.
- Access control: هر رزومه باید owner داشته باشد.

پیشنهاد Cloudflare-native:

- Cloudflare Workers یا Pages Functions برای API.
- Cloudflare D1 برای users و resumes.
- Cloudflare KV برای session/cache/preferenceهای سبک، اگر لازم شد.
- Cloudflare R2 فقط اگر عکس، PDF آماده، یا فایل‌های بزرگ ذخیره می‌کنی.

منابع رسمی:

- Cloudflare D1: https://developers.cloudflare.com/d1/
- Workers KV: https://developers.cloudflare.com/kv/
- Pages Functions bindings: https://developers.cloudflare.com/pages/functions/bindings/
- Cloudflare Access apps: https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/

## مدل «هر کاربر فقط یک رزومه»

هدف: کاربر وارد شود و فقط بتواند یک رزومه cloud بسازد.

رفتار پیشنهادی:

- کاربر anonymous همچنان بتواند محلی و بدون حساب تست کند.
- کاربر logged-in بتواند cloud save/sync داشته باشد.
- پلن رایگان فقط یک cloud resume داشته باشد.
- UI بعد از ساخت رزومه‌ی اول دکمه‌ی `New resume` را disable یا hide کند.
- API همچنان محدودیت را enforce کند، چون UI امنیت نیست.

اسکیمای حداقلی:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE resumes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  resume_json TEXT NOT NULL,
  template_id TEXT NOT NULL,
  page_size TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE UNIQUE INDEX one_resume_per_user ON resumes(user_id);
```

مهم‌ترین بخش همین unique index است. این باعث می‌شود حتی اگر کسی API را مستقیم صدا بزند، نتواند رزومه‌ی دوم بسازد.

## گزینه‌های ورود کاربر

### گزینه ۱: بدون login و فقط local

بهترین گزینه برای نسخه‌ی متن‌باز و privacy-first.

مزایا:

- ساده‌ترین معماری.
- بدون دیتابیس.
- بدون ریسک نگهداری داده‌ی حساس.
- پیام محصول بسیار شفاف است.

معایب:

- sync ندارد.
- محدودیت قابل enforce ندارد.
- monetization سخت‌تر است.

### گزینه ۲: Cloudflare Access

مناسب برای دسترسی خصوصی/داخلی، نه SaaS عمومی.

مزایا:

- سریع‌ترین راه برای گذاشتن login جلوی کل اپ.
- مناسب اگر فقط می‌خواهی افراد دعوت‌شده بتوانند از اپ استفاده کنند.

معایب:

- UX اکانت عمومی و consumer-grade نمی‌دهد.
- خودش user/resume/plan limit نمی‌سازد.

### گزینه ۳: Auth اختصاصی + D1

بهترین گزینه برای محصول hosted واقعی.

مزایا:

- محدودیت یک رزومه، پلن پولی، sync، backup و ownership را ممکن می‌کند.
- همچنان تا حد زیادی در اکوسیستم Cloudflare می‌مانی.

معایب:

- API و backend واقعی لازم دارد.
- تصمیم‌های امنیتی و privacy بیشتر می‌شود.
- نگهداری محصول جدی‌تر می‌شود.

### گزینه ۴: سرویس بیرونی Auth/Backend

نمونه‌ها: Clerk، Supabase، Firebase.

مزایا:

- راه‌اندازی سریع login.
- کد auth کمتر.

معایب:

- وابستگی به vendor.
- ممکن است برای دسترسی از ایران، billing یا محدودیت‌های provider مسئله‌ساز شود.
- پیام privacy-first کمتر ساده می‌شود.

## پیشنهاد برای AI

مدل فعلی BYOK با نسخه‌ی متن‌باز هماهنگ است: کاربر کلید خودش را می‌دهد و CVLite هزینه‌ی AI نمی‌دهد.

برای نسخه‌ی SaaS:

- BYOK را برای کاربران privacy-focused نگه دار.
- برای کاربران paid، AI proxy سمت Worker اضافه کن.
- API keyهای shared فقط در Cloudflare secrets باشند، نه داخل frontend.
- قبل از AI hosted، rate limit و usage accounting لازم است.

هیچ‌وقت shared AI key را داخل bundle فرانت‌اند نگذار؛ bundle مرورگر قابل inspect است.

## Roadmap پیشنهادی

### فوری

- لینک GitHub در topbar. انجام شد.
- آپدیت `DEPLOY.md` برای Worker و حذف `_redirects`. انجام شد.
- نگه داشتن build diagnostics تا وقتی deploy کاملاً پایدار شود.
- ignore کردن `graphify-out/`. انجام شده.
- یکپارچه‌سازی iconها.

### کوتاه‌مدت

- اضافه کردن sample resume برای چند persona.
- بهتر کردن preview/editor در موبایل.
- اضافه کردن privacy controls: export all data و delete local data.
- اضافه کردن privacy page کوتاه.
- بهتر کردن onboarding و empty state.

### میان‌مدت

- تصمیم قطعی: CVLite Cloud می‌خواهیم یا نه؟
- اگر بله، اول schema و API boundary طراحی شود.
- بعد auth، cloud storage و one-resume enforcement اضافه شود.
- مسیر migration از رزومه‌ی local به cloud طراحی شود.

### بعدتر

- پلن پولی فقط بعد از پایدار شدن account/cloud save.
- AI hosted فقط بعد از rate limit و usage accounting.
- marketplace یا premium templates اگر جامعه‌ی کاربری رشد کرد.

## جمع‌بندی پیشنهادی

برای release بعدی، CVLite را همچنان open-source و privacy-first نگه دار. UI را polish کن، GitHub را واضح نگه دار، onboarding را بهتر کن، و مستندات deploy/privacy را تمیز کن.

اگر واقعاً محصول loginدار با محدودیت «یک رزومه برای هر کاربر» می‌خواهی، آن را به‌عنوان مسیر جداگانه‌ی `CVLite Cloud` ببین، نه یک تغییر کوچک در همین اپ. کم‌هزینه‌ترین زیرساخت جدی برای آن روی همین stack: Cloudflare Worker/Pages Functions + D1 + auth است.
