import Link from "next/link";
import { Icon, type IconName } from "@/components/Icon";
import { Logo } from "@/components/Logo";
import { Watch } from "@/components/Watch";
import { ContactForm } from "./ContactForm";
import { pricing } from "@/lib/mock-data";
import { som } from "@/lib/format";
import "./landing.css";

const problems = [
  { p: "Shifokor qoʻlda yozgan retseptni bemor tushunmaydi.", s: "Elektron retsept: dori, doza, vaqt va kun soni aniq koʻrinadi." },
  { p: "Bemor dorini qachon ichishni bilmaydi yoki unutadi.", s: "Har qabul vaqtida eslatma, “Ichdim” tugmasi va shifokorga hisobot." },
  { p: "Operatsiyadan keyin shifokor bemor holatini kuzata olmaydi.", s: "Bilaguzuk va kunlik soʻrovnoma maʼlumotlari shifokor panelida." },
  { p: "Kerakli dori uyga yaqin aptekada boʻlmaydi.", s: "Retseptdagi dorilarni yaqin aptekalardan narx boʻyicha solishtirish." },
  { p: "Xavfli holatda tez yordamni aniq manzilga chaqirish qiyin.", s: "SOS: GPS, uy raqami va tashxis 103 ga 5 soniyada yetadi." },
  { p: "Shifokor va klinika haqida ishonchli maʼlumot yoʻq.", s: "Litsenziyasi tekshirilgan shifokorlar, reyting va sharhlar." },
];

const flow = [
  { h: "Retsept yoziladi", p: "Shifokor dorini MNN roʻyxatidan tanlaydi, bemor uni 10 soniyada ilovada koʻradi." },
  { h: "Eslatma keladi", p: "Har qabul vaqtida push-bildirishnoma. Internet boʻlmasa ham ishlaydi." },
  { h: "Holat kuzatiladi", p: "Puls, harorat, SpO₂ va kunlik soʻrovnoma shifokor chegaralari bilan solishtiriladi." },
  { h: "Signal yetadi", p: "Chegaradan oshsa shifokor 30 soniyada push va SMS oladi, bir bosishda chora koʻradi." },
];

const roles: { icon: IconName; title: string; platform: string; text: string; href?: string; cta?: string }[] = [
  { icon: "heart", title: "Bemor", platform: "Mobil ilova", text: "Tibbiy karta, retseptlar, eslatmalar, dori buyurtmasi, navbat va SOS.", href: "/bemor", cta: "Demo ilovani ochish →" },
  { icon: "stethoscope", title: "Shifokor", platform: "Veb-panel + mobil", text: "Bemorlarni kuzatish, elektron retsept, signallar, navbat, reels va profil.", href: "/shifokor" },
  { icon: "building", title: "Klinika", platform: "Veb-panel", text: "Shifokorlar, ish jadvali, umumiy navbat, klinika profili va statistika.", href: "/klinika" },
  { icon: "pill", title: "Apteka", platform: "Veb-panel", text: "Narx va qoldiq, buyurtmalarni qabul qilish, retsept tekshiruvi.", href: "/apteka" },
  { icon: "truck", title: "Kuryer", platform: "Mobil ilova", text: "Yaqin buyurtmalar, yoʻnalish va SMS kod bilan topshirish." },
  { icon: "megaphone", title: "Reklama beruvchi", platform: "Veb-kabinet", text: "Sogʻliqqa mos reklama, byudjet va koʻrishlar statistikasi.", href: "/reklama" },
  { icon: "shield", title: "Platforma admini", platform: "Veb-panel", text: "Tasdiqlash, moderatsiya, narxlar, toʻlovlar va SOS jurnali.", href: "/admin" },
];

const prices = [
  { name: "Bemor ilovasi va navbat", amt: "Bepul", who: "Har bir bemor uchun", free: true },
  { name: "Shifokor oddiy hisobi", amt: "Bepul", who: "Retsept, nazorat, reels", free: true },
  { name: "Apteka va davlat klinikasi", amt: "Bepul", who: "Ulanish va komissiyasiz", free: true },
  { name: "Operatsiyadan keyingi nazorat", amt: som(pricing.monitoring), per: "/oy", who: "Bemor toʻlaydi" },
  { name: "Shifokor Premium", amt: som(pricing.doctorPremium), per: "/oy", who: "Tasdiqlangan belgi, qidiruvda yuqorida" },
  { name: "Xususiy klinika Pro", amt: som(pricing.clinicPro), per: "/oy", who: "Kengaytirilgan statistika va boshqaruv" },
];

export default function Home() {
  return (
    <>
      <header className="site-head">
        <div className="wrap">
          <Logo size={40} />
          <nav className="site-nav" aria-label="Asosiy">
            <a className="link hide-sm" href="#qanday">Qanday ishlaydi</a>
            <a className="link hide-sm" href="#bilaguzuk">Bilaguzuk</a>
            <a className="link hide-sm" href="#rollar">Kimlar uchun</a>
            <a className="link" href="#narxlar">Narxlar</a>
            <a className="link hide-sm" href="#aloqa">Aloqa</a>
            <Link href="/kirish" className="btn sm">Kirish</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap">
            <div>
              <span className="eyebrow">Davolanishdan keyingi nazorat</span>
              <h1>Shifoxonadan chiqqandan keyin ham <em>shifokor nazoratida</em></h1>
              <p className="lead">
                MEDIS bemor, shifokor, klinika, apteka va kuryerni bitta platformada birlashtiradi: elektron retsept,
                dori eslatmalari, masofaviy kuzatuv va bir tugmali SOS.
              </p>
              <div className="actions">
                <Link href="/kirish?rol=shifokor" className="btn">Shifokor sifatida boshlash</Link>
                <a href="#rollar" className="btn ghost">Klinika yoki apteka ulash</a>
              </div>
              <div className="trust">
                <span><Icon name="lock" size={16} />Maʼlumotlar Oʻzbekistonda saqlanadi</span>
                <span><Icon name="shield" size={16} />Litsenziyasi tekshirilgan shifokorlar</span>
                <span><Icon name="user" size={16} />OneID (MED-ID) orqali kirish</span>
              </div>
            </div>

            <div className="monitor" aria-label="Shifokor panelidan namuna">
              <div className="spread">
                <div>
                  <b>Rustam Qodirov, 58</b>
                  <div className="muted small">Appendektomiya · 6-kun</div>
                </div>
                <span className="badge danger">Xavf</span>
              </div>
              <div className="vitals">
                <div className="vital alert"><small>Harorat</small><b>38,6 °C</b></div>
                <div className="vital"><small>Puls</small><b>98</b></div>
                <div className="vital"><small>SpO₂</small><b>96%</b></div>
                <div className="vital"><small>Dori ichish</small><b>92%</b></div>
              </div>
              <svg className="ecg" viewBox="0 0 300 56" aria-hidden="true">
                <path d="M0 30h60l8-14 8 28 8-40 8 26h50l8-14 8 28 8-40 8 26h118" />
              </svg>
              <div className="sig">
                <Icon name="bell" />
                Harorat chegaradan oshdi · shifokorga 08:42 da yuborildi
              </div>
            </div>
          </div>
        </section>

        <section className="block alt" id="muammo">
          <div className="wrap">
            <span className="eyebrow">Nimani hal qilamiz</span>
            <h2>Davolanish shifoxona eshigida tugamasligi kerak</h2>
            <p className="intro">Bugun bemor uyga qaytgach shifokor bilan aloqa uziladi. MEDIS shu boʻshliqni yopadi.</p>
            <div className="problems">
              {problems.map((x) => (
                <div className="problem" key={x.p}>
                  <p className="p">{x.p}</p>
                  <p className="s"><Icon name="check" size={18} />{x.s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="block" id="qanday">
          <div className="wrap">
            <span className="eyebrow">Qanday ishlaydi</span>
            <h2>Retseptdan signalgacha bitta zanjir</h2>
            <p className="intro">Har bir bosqich oʻlchanadigan vaqt talabi bilan quriladi.</p>
            <div className="flow">
              {flow.map((f) => (
                <div className="step" key={f.h}>
                  <h3>{f.h}</h3>
                  <p>{f.p}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="block alt" id="bilaguzuk">
          <div className="wrap band">
            <div>
              <span className="eyebrow">MEDIS bilaguzugi</span>
              <h2>Holat 24/7 nazoratda — bemor hech narsa bosmasa ham</h2>
              <p className="intro" style={{ marginBottom: 0 }}>
                Bilaguzuk puls, harorat, qondagi kislorod (SpO₂), harakat va uyquni oʻlchaydi. Maʼlumot bemor telefoni orqali shifokorga yetadi:
                chegaradan oshsa — shifokorga signal, yiqilish yoki SpO₂ keskin tushsa — 10 soniyalik taymerdan keyin avtomatik SOS.
              </p>
              <div className="band-metrics">
                {["Puls", "Harorat", "SpO₂", "Yiqilish", "Qadam va uyqu"].map((m) => <span key={m} className="badge teal">{m}</span>)}
              </div>
              <div className="band-steps">
                <div className="band-step"><div><h3>Aqlli soat ishlab chiqaruvchisi bilan hamkorlik</h3><p>Tajribali aqlli soat brendi bilan birga “MEDIS × hamkor” qoʻshma modelini loyihalaymiz: kerakli datchiklar — puls, SpO₂, harorat, yiqilish — va MEDIS ilovasiga mos dasturiy taʼminot.</p></div></div>
                <div className="band-step"><div><h3>Buyurtma asosida ishlab chiqariladi</h3><p>Soat bizning buyurtmamiz boʻyicha hamkor zavodida chiqariladi: korpusi va ekranida MEDIS logotipi, maʼlumot toʻgʻridan-toʻgʻri MEDIS ga uzatiladi. Zavod va sertifikatlash — hamkor tomonida.</p></div></div>
                <div className="band-step"><div><h3>Ilova bilan birga sotamiz</h3><p>Qutidan chiqqanda MEDIS ilovasiga ulangan: koʻrsatkichlar shifokor paneliga, xavf — SOS ga. Bemorga, klinikaga va sugʻurta hamkorlariga sotamiz.</p></div></div>
              </div>
              <p className="band-note">Shunday qilib, zavod qurish va qurilmani noldan sertifikatlash shart emas — soat esa oddiy fitnes-soat emas, aynan MEDIS ilovasi va shifokor nazorati uchun moslab chiqariladi.</p>
            </div>
            <div className="band-visual"><Watch /><span className="band-cap">MEDIS × hamkor · qoʻshma model</span></div>
          </div>
        </section>

        <section className="block" id="rollar">
          <div className="wrap">
            <span className="eyebrow">Kimlar uchun</span>
            <h2>7 ta rol, har biri faqat oʻziga tegishli maʼlumotni koʻradi</h2>
            <p className="intro">Apteka va kuryer tashxisni koʻrmaydi. Shifokor bemor kartasini faqat bemor ruxsati bilan ochadi.</p>
            <div className="roles">
              {roles.map((r) => {
                const body = (
                  <>
                    <span className="ic"><Icon name={r.icon} /></span>
                    <span className="platform">{r.platform}</span>
                    <h3>{r.title}</h3>
                    <p>{r.text}</p>
                    <span className="go">{r.cta ?? (r.href ? "Panelni ochish →" : "Mobil ilovada")}</span>
                  </>
                );
                return r.href ? (
                  <Link key={r.title} href={r.href} className="role">{body}</Link>
                ) : (
                  <div key={r.title} className="role">{body}</div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="block alt" id="sos">
          <div className="wrap sos">
            <div className="sos-btn" aria-hidden="true">SOS</div>
            <div>
              <span className="eyebrow">Tez yordam</span>
              <h2>Bir bosishda — aniq manzilga</h2>
              <p className="intro">SOS moduli boshqa modullardan ajratilgan: buyurtma yoki reels ishlamay qolsa ham u ishlaydi.</p>
              <ol className="timeline">
                <li><span className="t">0 s</span><span>Bemor tugmani bosadi yoki bilaguzuk SpO₂ pasayishi, yiqilishni aniqlaydi.</span></li>
                <li><span className="t">0–10 s</span><span>Bekor qilish taymeri: yolgʻon signallar tez yordamni band qilmaydi.</span></li>
                <li><span className="t">&lt; 5 s</span><span>GPS, uy raqami, ism, tashxis va oxirgi koʻrsatkichlar 103 ga yuboriladi.</span></li>
                <li><span className="t">bir vaqtda</span><span>Davolovchi shifokor va yaqinlarga push va SMS. Internet yoʻq boʻlsa 103 ga qoʻngʻiroq ochiladi.</span></li>
              </ol>
            </div>
          </div>
        </section>

        <section className="block" id="narxlar">
          <div className="wrap">
            <span className="eyebrow">Narxlar</span>
            <h2>Asosiy xizmatlar bepul</h2>
            <p className="intro">
              Dori yetkazish {som(pricing.deliveryMin)}–{som(pricing.deliveryMax)} (masofaga qarab) + {som(pricing.serviceFee)} servis.
              Reklama: 1 000 koʻrish uchun {som(pricing.adCpm)}.
            </p>
            <div className="pricing">
              {prices.map((p) => (
                <div className={`price-card${p.free ? " free" : ""}`} key={p.name}>
                  <b>{p.name}</b>
                  <div className="amt">{p.amt}{p.per ? <small> {p.per}</small> : null}</div>
                  <div className="who">{p.who}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="block alt" id="reja">
          <div className="wrap">
            <span className="eyebrow">Yoʻl xaritasi</span>
            <h2>MVP 4 oyda, pilotdan keyin kengayish</h2>
            <div className="roadmap" style={{ marginTop: 28 }}>
              <div className="phase now"><b>MVP ishlab chiqish</b><span className="muted small">1–4 oy</span><ul><li>Bemor ilovasi</li><li>Shifokor paneli</li><li>Retsept, eslatma, SOS</li><li>Apteka va toʻlov</li></ul></div>
              <div className="phase"><b>Pilot</b><span className="muted small">5–6 oy</span><ul><li>2 ta klinika</li><li>300 ta bemor</li><li>Natijani oʻlchash</li></ul></div>
              <div className="phase"><b>Kengayish</b><span className="muted small">7–12 oy</span><ul><li>Toshkent: 20 klinika</li><li>Reels va reklama</li><li>Premium, Klinika Pro</li><li>MED-ID integratsiyasi</li></ul></div>
              <div className="phase"><b>2-yil</b><span className="muted small">13–24 oy</span><ul><li>“MEDIS × hamkor” aqlli soati</li><li>103 bilan integratsiya</li><li>Viloyatlar</li><li>Sugʻurta hamkorligi</li></ul></div>
            </div>
          </div>
        </section>

        <section className="block" id="aloqa">
          <div className="wrap contact">
            <div className="contact-info">
              <span className="eyebrow">Aloqa</span>
              <h2>Klinikangizni yoki aptekangizni ulang</h2>
              <p className="intro" style={{ marginBottom: 8 }}>Pilotga qoʻshilish, hamkorlik yoki investitsiya boʻyicha yozing — bir ish kuni ichida javob beramiz.</p>
              <a className="contact-line" href="tel:+998977977967"><span className="ic"><Icon name="phone" /></span>+998 (97) 797 79 67</a>
              <a className="contact-line" href="https://medis.tayyorr.uz"><span className="ic"><Icon name="pin" /></span>medis.tayyorr.uz</a>
            </div>
            <ContactForm />
          </div>
        </section>

        <section className="wrap">
          <div className="cta">
            <div>
              <h2 style={{ fontSize: "clamp(24px,3vw,32px)" }}>Pilotga qoʻshiling</h2>
              <p>Klinikangiz yoki aptekangizni ulang — ulanish bepul, oʻqitishni oʻzimiz oʻtkazamiz.</p>
            </div>
            <div className="row">
              <Link href="/kirish?rol=klinika" className="btn">Klinikani ulash</Link>
              <Link href="/kirish?rol=apteka" className="btn ghost">Aptekani ulash</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-foot">
        <div className="wrap">
          <span>© 2026 MEDIS. Shaxsga doir maʼlumotlar Oʻzbekiston hududida saqlanadi.</span>
          <span><a href="tel:+998977977967">+998 (97) 797 79 67</a> · <Link href="/mobile">Bemor ilovasi</Link> · <Link href="/taqdimot">Startup taqdimoti</Link> · Tez yordam: <b>103</b></span>
        </div>
      </footer>
    </>
  );
}
