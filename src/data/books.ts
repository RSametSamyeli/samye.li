/**
 * The reading list, by shelf: the one source for /reading/ and /tr/reading/,
 * their markdown mirrors and their JSON-LD (an ItemList of Books).
 *
 * `title.tr` is the title of the Turkish edition where there is a well-known
 * one; otherwise the original title is kept, never a made-up translation.
 * Notes say what a book is about, in a sentence, not what anyone took from it.
 */
import type { Locale } from '~/i18n'

type Text = Record<Locale, string>

export interface Book {
  title: Text
  /** the author, as written in each language when it differs (Epictetus, Epiktetos) */
  author: string | Text
  note: Text
}

export interface Shelf {
  id: string
  title: Text
  /** what the shelf is about, in a sentence */
  about: Text
  /** a photo for the shelf (public/images/reading/), 4:5 */
  image: string
  /** the photographer, credited under the photo (Unsplash) */
  credit: { name: string; url: string }
  books: Book[]
}

const same = (title: string): Text => ({ en: title, tr: title })

/** A book's author in the given language. */
export const authorOf = (book: Book, locale: Locale) =>
  typeof book.author === 'string' ? book.author : book.author[locale]

export const SHELVES: Shelf[] = [
  {
    id: 'stoics',
    title: { en: 'The Stoics', tr: 'Stoacılar' },
    about: {
      en: 'How to keep your own mind: duty, death, fear, and what is in our control.',
      tr: 'İnsanın kendi zihnine nasıl sahip çıkacağı: görev, ölüm, korku ve kontrolümüzde olan.',
    },
    image: '/images/reading/stoics.webp',
    credit: {
      name: 'Jameson Berrios',
      url: 'https://unsplash.com/photos/baYgBFHY7M8',
    },
    books: [
      {
        title: { en: 'Meditations', tr: 'Kendime Düşünceler' },
        author: 'Marcus Aurelius',
        note: {
          en: "A Roman emperor's private notes to himself on duty, death and keeping his own mind.",
          tr: 'Bir Roma imparatorunun görev, ölüm ve kendi zihnine sahip çıkmak üzerine kendine yazdığı notlar.',
        },
      },
      {
        title: { en: 'Letters from a Stoic', tr: 'Ahlak Mektupları' },
        author: 'Seneca',
        note: {
          en: 'Letters to a friend on time, fear, wealth, friendship and how to live.',
          tr: 'Bir dosta zaman, korku, servet, dostluk ve nasıl yaşanacağı üzerine mektuplar.',
        },
      },
      {
        title: {
          en: 'On the Shortness of Life',
          tr: 'Hayatın Kısalığı Üzerine',
        },
        author: 'Seneca',
        note: {
          en: 'Life is not short; we waste most of it.',
          tr: 'Hayat kısa değil; çoğunu biz harcıyoruz.',
        },
      },
      {
        title: { en: 'Enchiridion', tr: 'Enkheiridion' },
        author: { en: 'Epictetus', tr: 'Epiktetos' },
        note: {
          en: 'The handbook: what is up to us, and what is not.',
          tr: 'El kitabı: neyin bize bağlı olduğu, neyin olmadığı.',
        },
      },
      {
        title: { en: 'Discourses', tr: 'Söylevler' },
        author: { en: 'Epictetus', tr: 'Epiktetos' },
        note: {
          en: "A former slave's lessons on the freedom no one can take from you.",
          tr: 'Bir zamanlar köle olan bir öğretmenin, kimsenin elinizden alamayacağı özgürlük üzerine dersleri.',
        },
      },
      {
        title: { en: 'The Obstacle Is the Way', tr: 'Engel Yoldur' },
        author: 'Ryan Holiday',
        note: {
          en: 'Stoicism in practice: turning what stands in the way into the way.',
          tr: 'Uygulamada Stoacılık: önünüzde duran engeli yolun kendisine çevirmek.',
        },
      },
      {
        title: { en: 'Ego Is the Enemy', tr: 'Ego Düşmandır' },
        author: 'Ryan Holiday',
        note: {
          en: 'How ego gets in the way when you aspire, when you succeed and when you fail.',
          tr: 'Hedeflerken, başarırken ve başarısız olurken egonun nasıl yolunuzu kestiği.',
        },
      },
    ],
  },
  {
    id: 'strategy',
    title: { en: 'Strategy, power and war', tr: 'Strateji, güç ve savaş' },
    about: {
      en: 'Power, war and mastery: how people actually win, from Sun Tzu to Robert Greene.',
      tr: "Güç, savaş ve ustalık: Sun Tzu'dan Robert Greene'e, insanların gerçekte nasıl kazandığı.",
    },
    image: '/images/reading/strategy.webp',
    credit: {
      name: 'Hassan Pasha',
      url: 'https://unsplash.com/photos/WTZZomyqaoA',
    },
    books: [
      {
        title: { en: 'The Art of War', tr: 'Savaş Sanatı' },
        author: 'Sun Tzu',
        note: {
          en: 'Win before the battle: knowing yourself, the enemy and the ground.',
          tr: 'Savaşı başlamadan kazanmak: kendini, düşmanı ve araziyi tanımak.',
        },
      },
      {
        title: { en: 'The 48 Laws of Power', tr: 'İktidar' },
        author: 'Robert Greene',
        note: {
          en: 'Three thousand years of power, distilled into forty-eight laws and the stories behind them.',
          tr: 'Üç bin yıllık iktidar tarihi; kırk sekiz kural ve arkalarındaki hikâyeler.',
        },
      },
      {
        title: { en: 'The 33 Strategies of War', tr: 'Savaş' },
        author: 'Robert Greene',
        note: {
          en: 'Military strategy, from Napoleon to guerrilla warfare, read as a guide to everyday conflict.',
          tr: "Napolyon'dan gerilla savaşına askerî strateji, gündelik çatışmalar için bir rehber olarak.",
        },
      },
      {
        title: { en: 'Mastery', tr: 'Ustalık' },
        author: 'Robert Greene',
        note: {
          en: 'How masters in every field got there: apprenticeship, mentors, and years of deliberate work.',
          tr: 'Her alanda ustaların oraya nasıl vardığı: çıraklık, akıl hocaları ve yılların bilinçli emeği.',
        },
      },
      {
        title: {
          en: 'The Laws of Human Nature',
          tr: 'İnsan Doğasının Yasaları',
        },
        author: 'Robert Greene',
        note: {
          en: 'Reading people, and yourself: envy, grandiosity, the pull of the group.',
          tr: 'İnsanları ve kendinizi okumak: kıskançlık, büyüklenme, grubun çekim gücü.',
        },
      },
      {
        title: { en: 'The Prince', tr: 'Prens' },
        author: 'Niccolò Machiavelli',
        note: {
          en: 'How power is won and kept, as it is rather than as it should be.',
          tr: 'İktidarın olması gerektiği gibi değil, olduğu gibi nasıl kazanılıp korunduğu.',
        },
      },
      {
        title: same('The Book of Five Rings'),
        author: 'Miyamoto Musashi',
        note: {
          en: "A duellist's treatise on strategy, timing and mastering one way thoroughly.",
          tr: 'Bir düellocunun strateji, zamanlama ve tek bir yolda ustalaşmak üzerine incelemesi.',
        },
      },
      {
        title: { en: 'On War', tr: 'Savaş Üzerine' },
        author: 'Carl von Clausewitz',
        note: {
          en: 'War as the continuation of politics, and why plans meet friction.',
          tr: 'Siyasetin devamı olarak savaş ve planların neden sürtünmeye takıldığı.',
        },
      },
    ],
  },
  {
    id: 'mind',
    title: {
      en: 'Meaning, mind and decisions',
      tr: 'Anlam, zihin ve kararlar',
    },
    about: {
      en: 'How we think, decide and find meaning, and how to come out of chaos stronger.',
      tr: 'Nasıl düşündüğümüz, karar verdiğimiz ve anlam bulduğumuz; kaostan nasıl daha güçlü çıkıldığı.',
    },
    image: '/images/reading/mind.webp',
    credit: {
      name: 'Atharva Tulsi',
      url: 'https://unsplash.com/photos/Uv2BaNZjjvY',
    },
    books: [
      {
        title: { en: '12 Rules for Life', tr: 'Hayat İçin 12 Kural' },
        author: 'Jordan B. Peterson',
        note: {
          en: 'Order against chaos: responsibility as the source of meaning.',
          tr: 'Kaosa karşı düzen: anlamın kaynağı olarak sorumluluk.',
        },
      },
      {
        title: { en: 'Beyond Order', tr: 'Düzenin Ötesinde' },
        author: 'Jordan B. Peterson',
        note: {
          en: 'The companion: when order turns rigid, and how to bring life back into it.',
          tr: 'Devamı: düzen katılaştığında ona yeniden nasıl hayat verileceği.',
        },
      },
      {
        title: {
          en: "Man's Search for Meaning",
          tr: 'İnsanın Anlam Arayışı',
        },
        author: 'Viktor E. Frankl',
        note: {
          en: 'A psychiatrist who survived the camps, on meaning as what keeps a person going.',
          tr: 'Toplama kamplarından sağ çıkan bir psikiyatristin, insanı ayakta tutan şey olarak anlam üzerine yazdıkları.',
        },
      },
      {
        title: {
          en: 'Thinking, Fast and Slow',
          tr: 'Hızlı ve Yavaş Düşünme',
        },
        author: 'Daniel Kahneman',
        note: {
          en: 'The two systems of thought, and the biases between them.',
          tr: 'Düşüncenin iki sistemi ve aralarındaki yanılgılar.',
        },
      },
      {
        title: { en: 'Antifragile', tr: 'Antikırılgan' },
        author: 'Nassim Nicholas Taleb',
        note: {
          en: 'Things that gain from disorder, and how to build them.',
          tr: 'Düzensizlikten kazançlı çıkan şeyler ve onların nasıl kurulacağı.',
        },
      },
      {
        title: { en: 'The Black Swan', tr: 'Siyah Kuğu' },
        author: 'Nassim Nicholas Taleb',
        note: {
          en: 'Rare, unpredictable events that end up explaining most of history.',
          tr: 'Tarihin çoğunu açıklayan nadir ve öngörülemeyen olaylar.',
        },
      },
    ],
  },
  {
    id: 'companies',
    title: { en: 'Entrepreneurship', tr: 'Girişimcilik' },
    about: {
      en: 'How companies get built, run and kept alive, told by the people who built them.',
      tr: 'Şirketlerin nasıl kurulduğu, yönetildiği ve ayakta kaldığı; onları kuranların anlatımıyla.',
    },
    image: '/images/reading/companies.webp',
    credit: {
      name: 'Joey Kyber',
      url: 'https://unsplash.com/photos/aGVx6_UFkO0',
    },
    books: [
      {
        title: { en: 'Zero to One', tr: 'Sıfırdan Bire' },
        author: 'Peter Thiel',
        note: {
          en: 'Build something new instead of copying what exists; the case for the monopoly.',
          tr: 'Var olanı kopyalamak yerine yeni bir şey kurmak; tekel olmanın savunusu.',
        },
      },
      {
        title: {
          en: 'The Hard Thing About Hard Things',
          tr: 'Zor Şeylerin Zor Yanı',
        },
        author: 'Ben Horowitz',
        note: {
          en: 'Running a company when there is no recipe: layoffs, crises, the struggle.',
          tr: 'Tarif olmadığında şirket yönetmek: işten çıkarmalar, krizler, mücadele.',
        },
      },
      {
        title: { en: 'The Lean Startup', tr: 'Yalın Girişim' },
        author: 'Eric Ries',
        note: {
          en: 'Build, measure, learn: validated learning instead of long plans.',
          tr: 'Kur, ölç, öğren: uzun planlar yerine doğrulanmış öğrenme.',
        },
      },
      {
        title: same('High Output Management'),
        author: 'Andrew S. Grove',
        note: {
          en: 'Management as production: leverage, meetings, one-on-ones and output.',
          tr: 'Bir üretim işi olarak yönetim: kaldıraç, toplantılar, birebirler ve çıktı.',
        },
      },
      {
        title: {
          en: "The Innovator's Dilemma",
          tr: 'Yenilikçinin İkilemi',
        },
        author: 'Clayton M. Christensen',
        note: {
          en: 'Why well-run companies lose to cheaper, simpler newcomers.',
          tr: 'İyi yönetilen şirketlerin neden daha ucuz ve basit yeni gelenlere kaybettiği.',
        },
      },
      {
        title: { en: 'Good to Great', tr: 'İyiden Mükemmele' },
        author: 'Jim Collins',
        note: {
          en: 'What the companies that made the leap had in common.',
          tr: 'Sıçramayı başaran şirketlerin ortak noktaları.',
        },
      },
      {
        title: same('Shoe Dog'),
        author: 'Phil Knight',
        note: {
          en: "Nike's founder on the years when the company almost didn't make it.",
          tr: "Nike'ın kurucusundan, şirketin neredeyse batacağı yılların hikâyesi.",
        },
      },
      {
        title: same('Steve Jobs'),
        author: 'Walter Isaacson',
        note: {
          en: "The biography written with Jobs's cooperation, flaws included.",
          tr: "Jobs'un katkısıyla, kusurlarıyla birlikte yazılmış biyografisi.",
        },
      },
      {
        title: same('Elon Musk'),
        author: 'Walter Isaacson',
        note: {
          en: 'Two years alongside Musk, from Tesla and SpaceX to X.',
          tr: "Tesla ve SpaceX'ten X'e, Musk'ın yanında geçen iki yıl.",
        },
      },
    ],
  },
]

/** The list as JSON-LD: an ItemList of Books, in the page's language. */
export function readingListSchema(locale: Locale, pageUrl: string) {
  const books = SHELVES.flatMap((shelf) => shelf.books)
  return {
    '@type': 'ItemList',
    '@id': `${pageUrl}#books`,
    'name': locale === 'tr' ? 'Okuduklarım' : 'Reading list',
    'numberOfItems': books.length,
    'itemListElement': books.map((book, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'item': {
        '@type': 'Book',
        'name': book.title[locale],
        'author': { '@type': 'Person', 'name': authorOf(book, locale) },
      },
    })),
  }
}

/** The list as markdown, for the page's mirror and llms-full.txt. */
export function readingListMarkdown(locale: Locale) {
  return SHELVES.map(
    (shelf) =>
      `## ${shelf.title[locale]}\n\n${shelf.about[locale]}\n\n` +
      shelf.books
        .map(
          (b) =>
            `- **${b.title[locale]}**, ${authorOf(b, locale)}. ${b.note[locale]}`
        )
        .join('\n')
  ).join('\n\n')
}
