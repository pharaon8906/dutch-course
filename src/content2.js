const LEVELS=[
 {id:"A0",n:"A0 · Старт",d:"Перші слова, привітання, числа, про себе",e:"🌱"},
 {id:"A1",n:"A1 · Базовий",d:"Магазин, місто, лікар, теперішній час",e:"🌷"},
 {id:"A2",n:"A2 · Впевнений",d:"Робота, минулий час, складніші речення",e:"🌳"}
];
const CATLEVEL={"Привітання і фрази":"A0","Числа":"A0","Сім'я та люди":"A0","Їжа":"A0","Напої":"A0","Займенники":"A0","Одяг і кольори":"A0","Розмовні вирази":"A1",
"Час і дні":"A1","Кафе і магазин":"A1","Дім":"A1","Місто і транспорт":"A1","Тіло і здоров'я":"A1","Погода":"A1","Дієслова":"A1","Прикметники":"A1","Питання і зв'язки":"A1","Прийменники":"A1",
"Робота і навчання":"A2","Хобі і дозвілля":"A2","Подорожі":"A2"};
const DLEVEL=["A0","A0","A1","A1","A1","A2","A1","A2","A2"];

const EXPR_RAW=`even kijken|зараз подивлюся|even = на хвилинку. Голландці кажуть even майже в кожному реченні
geen probleem|без проблем
maakt niet uit|неважливо, все одно
dat klopt|саме так, правильно
klopt dat?|це правда? так?
precies|точно, саме так
echt?|справді?
zeker|звісно, напевно
jammer|шкода|«Wat jammer!» = як шкода!
geen idee|гадки не маю
ik weet het niet|я не знаю
hoe bedoel je?|що ти маєш на увазі?
doe maar|давай, роби (згода)|«Doe maar een koffie» = мені каву, будь ласка
lekker!|смачно! / класно!
kom op!|давай! (підбадьорити)
ik ben zo terug|я зараз повернуся
momentje|хвилинку
wacht even|зачекай хвилинку
pas op!|обережно!
let op|зверніть увагу
het maakt me niet uit|мені все одно
geen zin|немає бажання|«Ik heb geen zin» = мені не хочеться
ik heb zin in...|мені хочеться...
goed idee!|гарна ідея!
fijne dag!|гарного дня!
fijn weekend!|гарних вихідних!
tot zo|до зустрічі (скоро)
hoe heet je?|як тебе звати?
ik heet...|мене звати...
waar kom je vandaan?|звідки ти?
leuk je te ontmoeten|приємно познайомитися
hoe zeg je dat in het Nederlands?|як це сказати нідерландською?
nog een keer, alsjeblieft|ще раз, будь ласка
mag ik even langs?|можна пройти?
is deze plek vrij?|це місце вільне?
ik heb een vraag|у мене питання
het spijt me|мені шкода, вибачте
geen dank|нема за що
dat is aardig van je|це мило з твого боку
ik ben het ermee eens|я згоден`;

const NEW_DIALOGS=[
{t:"Bij de bakker",uk:"У пекарні",lv:"A0",e:"🥖",lines:[
["A","Goedemorgen! Zegt u het maar.","Доброго ранку! Слухаю вас."],
["B","Goedemorgen. Een bruin brood, alstublieft.","Доброго ранку. Темний хліб, будь ласка."],
["A","Heel of half?","Цілий чи половину?"],
["B","Heel, graag. En vier krentenbollen.","Цілий, будь ласка. І чотири булочки з родзинками."],
["A","Anders nog iets?","Ще щось?"],
["B","Nee, dank u. Dat is alles.","Ні, дякую. Це все."],
["A","Dat wordt vijf euro tachtig.","З вас п'ять євро вісімдесят."],
["B","Alstublieft. Fijne dag!","Ось, будь ласка. Гарного дня!"]],
tip:"«Zegt u het maar» — стандартна фраза продавця: «Кажіть, що бажаєте»."},
{t:"In de apotheek",uk:"В аптеці",lv:"A1",e:"💊",lines:[
["A","Goedemiddag, kan ik u helpen?","Добрий день, чим можу допомогти?"],
["B","Ja, ik heb een recept van de huisarts.","Так, у мене рецепт від сімейного лікаря."],
["A","Dank u. Wat is uw geboortedatum?","Дякую. Яка ваша дата народження?"],
["B","Twaalf maart negentienhonderdnegentig.","Дванадцяте березня тисяча дев'ятсот дев'яностого."],
["A","Hier zijn uw tabletten. Neem er twee per dag, na het eten.","Ось ваші таблетки. Приймайте по дві на день, після їжі."],
["B","Mag ik er alcohol bij drinken?","Можна з ними пити алкоголь?"],
["A","Nee, liever niet.","Ні, краще не треба."],
["B","Oké, bedankt voor de uitleg.","Добре, дякую за пояснення."]],
tip:"В аптеці завжди питають geboortedatum (дату народження) — підготуй її нідерландською."},
{t:"Een pakketje ophalen",uk:"Забрати посилку",lv:"A1",e:"📦",lines:[
["A","Hallo, ik kom een pakketje ophalen.","Добрий день, я прийшла забрати посилку."],
["B","Heeft u de code of het briefje?","У вас є код або повідомлення?"],
["A","Ja, hier op mijn telefoon.","Так, ось у телефоні."],
["B","Mag ik ook uw identiteitsbewijs zien?","Можна також ваше посвідчення особи?"],
["A","Natuurlijk, alstublieft.","Звичайно, будь ласка."],
["B","Momentje, ik ga even kijken.","Хвилинку, зараз подивлюся."],
["B","Alstublieft, dit is uw pakketje. Wilt u hier tekenen?","Ось ваша посилка. Підпишіть тут, будь ласка."],
["A","Ja, hoor. Dank u wel!","Так, звісно. Дякую!"]],
tip:"Посилки часто лишають у сусідньому магазині (afhaalpunt). Потрібен код і документ."},
{t:"De buurvrouw",uk:"Сусідка",lv:"A1",e:"🏘️",lines:[
["A","Hoi! Jij bent de nieuwe buurvrouw, toch?","Привіт! Ти нова сусідка, так?"],
["B","Ja, ik woon sinds vorige week op nummer twaalf.","Так, я живу з минулого тижня в номері дванадцять."],
["A","Welkom! Ik ben Marieke. Bevalt het huis?","Ласкаво просимо! Я Маріке. Подобається будинок?"],
["B","Ja, heel goed. Maar ik weet niet wanneer de vuilnisbak buiten moet.","Так, дуже. Але я не знаю, коли виставляти смітник."],
["A","Op dinsdag. De groene bak elke week, de blauwe om de week.","У вівторок. Зелений бак щотижня, синій — через тиждень."],
["B","Wat handig, dank je wel!","Як зручно, дякую!"],
["A","Graag gedaan. Kom gerust een keer koffie drinken.","Нема за що. Заходь якось на каву."]],
tip:"Сортування сміття — важлива тема з сусідами. groen = органіка, blauw = папір."},
{t:"Bij de kapper",uk:"У перукарні",lv:"A2",e:"💇",lines:[
["A","Goedemiddag! Wat had je in gedachten?","Добрий день! Що ти задумала?"],
["B","Ik wil graag mijn haar laten knippen. Niet te kort, alleen de punten.","Я хочу підстригтися. Не дуже коротко, тільки кінчики."],
["A","Ongeveer twee centimeter eraf?","Приблизно два сантиметри?"],
["B","Ja, dat is goed. En kun je het ook föhnen?","Так, добре. А можеш ще посушити феном?"],
["A","Natuurlijk. Wil je eerst je haar laten wassen?","Звичайно. Спершу помити голову?"],
["B","Graag. Hoeveel kost dat samen?","Так, будь ласка. Скільки це разом?"],
["A","Knippen en föhnen is vijfendertig euro.","Стрижка і укладка — тридцять п'ять євро."]],
tip:"«laten + інфінітив» = зробити щось руками іншого: Ik laat mijn haar knippen — мене підстригають."},
{t:"Een kamer huren",uk:"Орендувати кімнату",lv:"A2",e:"🔑",lines:[
["A","Goedenavond, ik bel over de kamer in de advertentie.","Добрий вечір, я дзвоню щодо кімнати з оголошення."],
["B","Ja, die is nog vrij. Wat wilt u weten?","Так, вона ще вільна. Що ви хочете знати?"],
["A","Wat is de huur per maand?","Яка оренда на місяць?"],
["B","Zeshonderd euro, inclusief gas, water en licht.","Шістсот євро, разом із газом, водою і світлом."],
["A","Is de kamer gemeubileerd?","Кімната мебльована?"],
["B","Ja, er staan een bed, een bureau en een kast.","Так, там ліжко, письмовий стіл і шафа."],
["A","Mag ik me op dit adres inschrijven bij de gemeente?","Чи можу я зареєструватися за цією адресою в муніципалітеті?"],
["B","Ja, dat mag. Wilt u de kamer komen bekijken?","Так, можна. Хочете прийти подивитися?"],
["A","Graag. Kan het morgen na zes uur?","Так. Можна завтра після шостої?"]],
tip:"Завжди питай про inschrijven (реєстрацію) — без неї не отримаєш BSN і пільги."},
{t:"Bij de gemeente",uk:"У муніципалітеті",lv:"A2",e:"🏛️",lines:[
["A","Goedemorgen, ik heb om tien uur een afspraak.","Доброго ранку, у мене запис на десяту."],
["B","Wat is uw naam?","Як ваше прізвище?"],
["A","Kovalenko. Ik wil me inschrijven op een nieuw adres.","Коваленко. Я хочу зареєструватися за новою адресою."],
["B","Heeft u uw paspoort en het huurcontract meegenomen?","Ви взяли паспорт і договір оренди?"],
["A","Ja, hier zijn ze.","Так, ось вони."],
["B","Dank u. U krijgt binnen twee weken een brief thuis.","Дякую. Протягом двох тижнів ви отримаєте лист додому."],
["A","Moet ik verder nog iets doen?","Мені ще щось треба зробити?"],
["B","Nee, dat was het. Een fijne dag nog!","Ні, це все. Гарного дня!"]],
tip:"Перед візитом до gemeente завжди записуйся (afspraak maken) онлайн або телефоном."}
];

const ALPHABET=[["A","а"],["B","бе"],["C","се"],["D","де"],["E","е"],["F","еф"],["G","хе"],["H","ха"],["I","і"],["J","йе"],["K","ка"],["L","ел"],["M","ем"],["N","ен"],["O","о"],["P","пе"],["Q","кю"],["R","ер"],["S","ес"],["T","те"],["U","ю"],["V","ве"],["W","ве"],["X","ікс"],["Y","ей / ігрек"],["Z","зет"]];

const PHONICS=[
{g:"Короткі голосні",e:"🔹",d:"У закритому складі (після голосного — приголосний) голосний короткий.",items:[
 {w:"a",r:"коротке «а»",ex:[["man","чоловік"],["kat","кіт"],["tas","сумка"]]},
 {w:"e",r:"коротке «е»",ex:[["bed","ліжко"],["pen","ручка"],["wet","закон"]]},
 {w:"i",r:"коротке «і», ближче до «и»",ex:[["vis","риба"],["kind","дитина"],["wit","білий"]]},
 {w:"o",r:"коротке «о»",ex:[["bos","ліс"],["pot","горщик"],["rok","спідниця"]]},
 {w:"u",r:"короткий звук між «у» і «е»",ex:[["bus","автобус"],["kus","поцілунок"],["dun","тонкий"]],tip:"Не кажи «у»! Скажи «е» з трохи округленими губами."}]},
{g:"Довгі голосні",e:"🔷",d:"Подвоєна літера або одна літера в кінці складу = довгий звук.",items:[
 {w:"aa",r:"довге «а-а»",ex:[["maan","місяць"],["straat","вулиця"],["kaas","сир"]],tip:"man (чоловік) ↔ maan (місяць): довжина змінює значення!"},
 {w:"ee",r:"довге «ей» (як «е-і»)",ex:[["been","нога"],["twee","два"],["thee","чай"]]},
 {w:"oo",r:"довге «оу»",ex:[["boom","дерево"],["rood","червоний"],["brood","хліб"]]},
 {w:"uu",r:"довге «ю» з губами трубочкою",ex:[["vuur","вогонь"],["muur","стіна"],["duur","дорогий"]]},
 {w:"ie",r:"довге «і»",ex:[["drie","три"],["bier","пиво"],["fiets","велосипед"]]},
 {w:"eu",r:"як нім. ö: «е» з губами «о»",ex:[["neus","ніс"],["deur","двері"],["leuk","класний"]]},
 {w:"oe",r:"звичайне «у»",ex:[["boek","книжка"],["goed","добре"],["moeder","мати"]]},
 {w:"a / e / o / u в кінці складу",r:"теж довгі",ex:[["ma-ken","робити"],["le-ren","вчити"],["wo-nen","жити"]],tip:"Правило відкритого складу: maken пишеться з однією a, але читається довго."}]},
{g:"Дифтонги",e:"🌀",d:"Два звуки, що зливаються в один.",items:[
 {w:"ij / ei",r:"«ей», ближче до «ай»",ex:[["mijn","мій"],["wijn","вино"],["klein","маленький"],["trein","потяг"]],tip:"ij і ei звучать однаково. Пишеться по-різному — запам'ятовуй зі словом."},
 {w:"ui",r:"«ау» + «ей» з округленими губами — немає в українській",ex:[["huis","будинок"],["tuin","сад"],["uit","з, вихід"]],tip:"Скажи «а», округли губи і плавно перейди до «ю»."},
 {w:"ou / au",r:"«ау»",ex:[["oud","старий"],["koud","холодний"],["blauw","синій"]]},
 {w:"aai",r:"«аай»",ex:[["saai","нудний"],["draaien","крутити"]]},
 {w:"ooi",r:"«оуй»",ex:[["mooi","гарний"],["nooit","ніколи"]]},
 {w:"oei",r:"«уй»",ex:[["groei","ріст"],["moeilijk","важкий"]]},
 {w:"ieuw / eeuw",r:"«іу» / «еу»",ex:[["nieuw","новий"],["sneeuw","сніг"],["leeuw","лев"]]}]},
{g:"Приголосні",e:"🔸",d:"Більшість приголосних як в українській. Ось ті, що відрізняються.",items:[
 {w:"g / ch",r:"горлове «х» (як у «хліб», але глибше)",ex:[["goed","добре"],["acht","вісім"],["morgen","завтра"]],tip:"Ніколи не «ґ»! Gouda читається «хауда»."},
 {w:"sch",r:"«сх»",ex:[["school","школа"],["schoon","чистий"],["schrijven","писати"]]},
 {w:"-isch в кінці",r:"«іс»",ex:[["praktisch","практичний"],["logisch","логічно"]]},
 {w:"j",r:"«й»",ex:[["ja","так"],["jas","куртка"],["jong","молодий"]]},
 {w:"w",r:"між «в» і англ. w",ex:[["water","вода"],["wit","білий"],["werk","робота"]]},
 {w:"v",r:"«в», часто ближче до «ф»",ex:[["vader","батько"],["vier","чотири"],["vis","риба"]]},
 {w:"z",r:"«з», часто ближче до «с»",ex:[["zon","сонце"],["zes","шість"],["zee","море"]]},
 {w:"r",r:"«р» (горлове або язиком)",ex:[["rood","червоний"],["raam","вікно"],["vier","чотири"]]},
 {w:"ng",r:"носове «нг» без «г»",ex:[["lang","довгий"],["zingen","співати"],["jongen","хлопець"]]},
 {w:"nk",r:"«нк» (носове)",ex:[["bank","диван, банк"],["drinken","пити"]]},
 {w:"sj / tj",r:"«ш» / «ч»",ex:[["sjaal","шарф"],["meisje","дівчинка"],["katje","кошеня"]]},
 {w:"c",r:"«к» (перед a, o, u) або «с» (перед e, i)",ex:[["café","кафе"],["centrum","центр"]]},
 {w:"d / b в кінці",r:"оглушуються: «т» / «п»",ex:[["hond","собака"],["goed","добре"],["web","мережа"]]}]},
{g:"Закінчення",e:"🔚",d:"Як читаються часті закінчення.",items:[
 {w:"-e / -en",r:"слабке «е» (ə); n часто не чути",ex:[["lopen","іти"],["kinderen","діти"],["grote","великі"]]},
 {w:"-ig",r:"«ех»",ex:[["gezellig","затишний"],["twintig","двадцять"],["prettig","приємний"]]},
 {w:"-lijk",r:"«лек»",ex:[["makkelijk","легкий"],["moeilijk","важкий"],["natuurlijk","звичайно"]]},
 {w:"-tie",r:"«-(т)сі»",ex:[["informatie","інформація"],["politie","поліція"],["vakantie","відпустка"]]},
 {w:"-je / -tje",r:"«-є» / «-тє»",ex:[["huisje","будиночок"],["broodje","булочка"],["kopje","чашечка"]]},
 {w:"-heid",r:"«-хейт»",ex:[["gezondheid","здоров'я"],["vrijheid","свобода"]]}]}
];

const GRAMMAR2=[
{lv:"A0",e:"🙋",t:"Я, ти, він: займенники і дієслово zijn (бути)",
simple:"В українській ми часто кажемо «Я студент» без дієслова. У нідерландській дієслово «бути» обов'язкове: Ik <b>ben</b> student.",
rules:`<table class="gt"><tr><th>Хто</th><th>zijn (бути)</th><th>hebben (мати)</th></tr><tr><td>ik — я</td><td>ben</td><td>heb</td></tr><tr><td>jij / je — ти</td><td>bent</td><td>hebt</td></tr><tr><td>u — ви (ввічливо)</td><td>bent</td><td>hebt</td></tr><tr><td>hij / zij — він / вона</td><td>is</td><td>heeft</td></tr><tr><td>wij — ми</td><td>zijn</td><td>hebben</td></tr><tr><td>jullie — ви</td><td>zijn</td><td>hebben</td></tr><tr><td>zij — вони</td><td>zijn</td><td>hebben</td></tr></table>`,
ex:[["Ik ben Olena.","Я Олена."],["Hij is moe.","Він утомлений."],["Wij hebben een kat.","У нас є кіт."]],
mistake:["Ik student.","Ik ben student.","Без дієслова речення неправильне."],
tip:"Вік кажуть через zijn: «Ik ben dertig» (мені 30), а не через hebben, як у деяких мовах.",
q:[{q:"Hij ___ uit Oekraïne. (zijn)",o:["ben","is","zijn"],a:1},{q:"Wij ___ twee kinderen. (hebben)",o:["hebben","heeft","heb"],a:0}]},
{lv:"A0",e:"🎨",t:"De, het і een: артиклі",
simple:"Перед іменником майже завжди стоїть маленьке слово. <b>een</b> — «якийсь, один». <b>de</b> або <b>het</b> — «той самий, конкретний».",
rules:`<ul><li><b>een</b> — для будь-якого слова в однині: een huis, een man.</li><li><b>de</b> — приблизно 2/3 слів і <b>всі слова в множині</b>: de man, de huizen.</li><li><b>het</b> — середній рід: het huis, het kind, а також усі слова на <b>-je</b>: het meisje.</li></ul>`,
ex:[["een huis — het huis","дім (якийсь) — дім (той)"],["het kind — de kinderen","дитина — діти"],["de stad","місто"]],
mistake:["het kinderen","de kinderen","У множині завжди de."],
tip:"Вчи кожне слово з артиклем: не «huis», а «het huis». У курсі de — синім, het — рожевим.",
q:[{q:"___ meisje",o:["de","het"],a:1},{q:"___ huizen (множина)",o:["de","het"],a:0}]},
{lv:"A0",e:"2️⃣",t:"Порядок слів: дієслово на 2-му місці",
simple:"Найважливіше правило: у звичайному реченні <b>дієслово завжди стоїть другим</b>. Якщо на першому місці не «я/ти/він», а час чи місце, то «я/ти/він» переходить <b>після</b> дієслова.",
rules:`<table class="gt"><tr><th>1</th><th>2 (дієслово)</th><th>решта</th></tr><tr><td>Ik</td><td>werk</td><td>morgen.</td></tr><tr><td>Morgen</td><td>werk</td><td>ik.</td></tr><tr><td>In Utrecht</td><td>woon</td><td>ik.</td></tr></table>`,
ex:[["Ik drink koffie.","Я п'ю каву."],["Vandaag drink ik thee.","Сьогодні я п'ю чай."],["Om acht uur begin ik.","О восьмій я починаю."]],
mistake:["Vandaag ik drink thee.","Vandaag drink ik thee.","Дієслово мусить бути другим."],
tip:"Уяви дієслово як стовпчик на 2-му місці: все інше обертається навколо нього.",
q:[{q:"Як правильно?",o:["Morgen ik ga naar school.","Morgen ga ik naar school."],a:1}]},
{lv:"A0",e:"❓",t:"Як поставити питання",
simple:"Два типи питань. «Так/ні»: дієслово йде <b>на початок</b>. З питальним словом: <b>питальне слово + дієслово + хто</b>.",
rules:`<ul><li>Werk jij? — Ти працюєш?</li><li>Waar werk jij? — Де ти працюєш?</li><li>Питальні слова: wie (хто), wat (що), waar (де), wanneer (коли), waarom (чому), hoe (як), hoeveel (скільки).</li><li>Увага: jij werk<b>t</b> → werk jij? (у питанні з jij закінчення -t зникає).</li></ul>`,
ex:[["Spreek jij Nederlands?","Ти говориш нідерландською?"],["Waar woon je?","Де ти живеш?"],["Hoeveel kost dit?","Скільки це коштує?"]],
mistake:["Woont jij hier?","Woon jij hier?","Коли jij стоїть після дієслова, -t не пишемо."],
tip:"Порядок як у «Чи ти...?»: просто переставляєш дієслово вперед.",
q:[{q:"___ jij koffie? (drinken)",o:["Drinkt","Drink"],a:1},{q:"___ woon je? (де)",o:["Wie","Waar","Wat"],a:1}]},
{lv:"A0",e:"🚫",t:"Заперечення: niet і geen",
simple:"Є два «не». <b>geen</b> — коли заперечуємо іменник, перед яким було б <b>een</b> або нічого. <b>niet</b> — у всіх інших випадках.",
rules:`<ul><li>Ik heb een auto → Ik heb <b>geen</b> auto.</li><li>Ik drink koffie → Ik drink <b>geen</b> koffie.</li><li>Ik werk → Ik werk <b>niet</b>.</li><li>Het is duur → Het is <b>niet</b> duur.</li></ul>`,
ex:[["Ik heb geen tijd.","У мене немає часу."],["Ik begrijp het niet.","Я цього не розумію."],["Dat is niet goed.","Це недобре."]],
mistake:["Ik heb niet een auto.","Ik heb geen auto.","Замість «niet een» кажуть geen."],
tip:"Перевірка: якщо можна сказати een + слово, став geen.",
q:[{q:"Ik heb ___ kinderen.",o:["niet","geen"],a:1},{q:"Hij komt ___.",o:["niet","geen"],a:0}]},
{lv:"A0",e:"👥",t:"Множина",
simple:"Щоб сказати «багато», найчастіше додаємо <b>-en</b>. Деякі слова отримують <b>-s</b>.",
rules:`<ul><li><b>+en</b>: de fiets → de fietsen, het boek → de boeken</li><li><b>+s</b>: слова на -el, -er, -em, -en, -je і багато запозичень: de tafel → tafels, het meisje → meisjes, de auto → auto's</li><li>Довгий голосний пишеться однією літерою, коли склад відкритий: de straat → de stra-ten, het jaar → de ja-ren.</li><li>Винятки: het kind → de kinderen, het ei → de eieren.</li></ul>`,
ex:[["de appel → de appels","яблуко → яблука"],["het huis → de huizen","дім → доми (s → z)"],["de dag → de dagen","день → дні"]],
mistake:["de tafelen","de tafels","Слова на -el отримують -s."],
tip:"Якщо слово закінчується на -s або -f, у множині часто z або v: huis → huizen, brief → brieven.",
q:[{q:"de tafel → ?",o:["tafelen","tafels"],a:1},{q:"het kind → ?",o:["kinds","kinderen"],a:1}]},
{lv:"A1",e:"⏱️",t:"Теперішній час: як змінюється дієслово",
simple:"Беремо дієслово, відкидаємо <b>-en</b> — отримуємо «основу». Далі все просто: ik + основа, jij/hij + основа + t, ми/ви/вони + повне слово.",
rules:`<table class="gt"><tr><th></th><th>werken</th><th>wonen</th><th>maken</th></tr><tr><td>ik</td><td>werk</td><td>woon</td><td>maak</td></tr><tr><td>jij / u / hij</td><td>werkt</td><td>woont</td><td>maakt</td></tr><tr><td>wij / jullie / zij</td><td>werken</td><td>wonen</td><td>maken</td></tr></table><ul><li>Довгий звук зберігаємо подвоєнням: maken → ik maak.</li><li>Подвоєний приголосний скорочуємо: zitten → ik zit.</li><li>v → f, z → s: leven → ik leef, lezen → ik lees.</li></ul>`,
ex:[["Ik woon in Delft.","Я живу в Делфті."],["Zij werkt in een winkel.","Вона працює в магазині."],["Wij leren Nederlands.","Ми вчимо нідерландську."]],
mistake:["Hij werken.","Hij werkt.","Після hij/zij — основа + t."],
tip:"Якщо основа вже закінчується на -t (zitten → zit), друге t не додаємо: hij zit.",
q:[{q:"Hij ___ (wonen) in Gent.",o:["woon","woont","wonen"],a:1},{q:"Ik ___ (lezen) een boek.",o:["lees","leez","lezen"],a:0}]},
{lv:"A1",e:"💪",t:"Модальні дієслова: kunnen, willen, moeten, mogen",
simple:"Ці дієслова кажуть, <b>чи можеш, хочеш, мусиш</b>. Модальне дієслово стоїть на 2-му місці, а головне дієслово йде <b>в кінець</b> у повній формі.",
rules:`<table class="gt"><tr><th></th><th>kunnen<br>могти</th><th>willen<br>хотіти</th><th>moeten<br>мусити</th><th>mogen<br>можна</th></tr><tr><td>ik</td><td>kan</td><td>wil</td><td>moet</td><td>mag</td></tr><tr><td>jij</td><td>kunt / kan</td><td>wilt</td><td>moet</td><td>mag</td></tr><tr><td>hij</td><td>kan</td><td>wil</td><td>moet</td><td>mag</td></tr><tr><td>wij</td><td>kunnen</td><td>willen</td><td>moeten</td><td>mogen</td></tr></table>`,
ex:[["Ik kan goed koken.","Я добре вмію готувати."],["Wij moeten morgen werken.","Ми мусимо завтра працювати."],["Mag ik hier zitten?","Можна мені тут сісти?"]],
mistake:["Ik wil koop een fiets.","Ik wil een fiets kopen.","Головне дієслово — в кінці, повна форма."],
tip:"Модальне дієслово і головне — як «рамка» навколо решти: Ik <b>wil</b> morgen een fiets <b>kopen</b>.",
q:[{q:"Ik wil een kaartje ___.",o:["koop","kopen","koopt"],a:1},{q:"___ ik binnenkomen? (дозвіл)",o:["Mag","Moet"],a:0}]},
{lv:"A1",e:"✂️",t:"Дієслова, що розпадаються (opstaan, meenemen)",
simple:"Деякі дієслова мають «хвостик»-префікс: <b>op</b>staan, <b>mee</b>nemen, <b>af</b>spreken. У реченні цей хвостик відривається і їде <b>в самий кінець</b>.",
rules:`<ul><li>opstaan → Ik <b>sta</b> om 7 uur <b>op</b>.</li><li>meenemen → <b>Neem</b> je paraplu <b>mee</b>!</li><li>uitgaan → Wij <b>gaan</b> vanavond <b>uit</b>.</li><li>З модальним дієсловом не розпадається: Ik wil morgen <b>uitgaan</b>.</li></ul>`,
ex:[["Ik sta vroeg op.","Я рано встаю."],["De trein komt om drie uur aan.","Потяг прибуває о третій."],["Bel je me morgen op?","Ти подзвониш мені завтра?"]],
mistake:["Ik opsta om zeven uur.","Ik sta om zeven uur op.","Префікс іде в кінець речення."],
tip:"Наголос на префіксі (ÓPstaan) — знак, що він відривається.",
q:[{q:"Ik ___ morgen vroeg ___. (opstaan)",o:["opsta … —","sta … op"],a:1}]},
{lv:"A1",e:"🏠",t:"Мій, твій, його: присвійні слова",
simple:"Ці слова кажуть, <b>чиє</b> щось. Вони не змінюються за родом, як в українській (мій/моя/моє — завжди mijn).",
rules:`<table class="gt"><tr><th>Хто</th><th>Чий</th></tr><tr><td>ik</td><td>mijn — мій, моя</td></tr><tr><td>jij</td><td>jouw / je — твій</td></tr><tr><td>u</td><td>uw — ваш</td></tr><tr><td>hij</td><td>zijn — його</td></tr><tr><td>zij</td><td>haar — її</td></tr><tr><td>wij</td><td>ons (het-слова) / onze (de-слова і множина)</td></tr><tr><td>jullie</td><td>jullie — ваш</td></tr><tr><td>zij (мн.)</td><td>hun — їхній</td></tr></table>`,
ex:[["Mijn moeder woont in Kyiv.","Моя мама живе в Києві."],["Is dit jouw jas?","Це твоя куртка?"],["Ons huis is klein, onze tuin is groot.","Наш дім маленький, наш сад великий."]],
mistake:["Anna en zijn man","Anna en haar man","Про жінку — haar (її), про чоловіка — zijn (його)."],
tip:"ons / onze — єдина пара, що змінюється: ons huis (het), onze stad (de).",
q:[{q:"Dat is ___ huis. (наш, het huis)",o:["ons","onze"],a:0},{q:"Anna en ___ man (її)",o:["zijn","haar"],a:1}]},
{lv:"A1",e:"🌈",t:"Прикметник: коли додавати -e",
simple:"Коли прикметник стоїть <b>перед</b> іменником, він майже завжди отримує <b>-e</b>. Є лише один виняток.",
rules:`<ul><li>de mooi<b>e</b> stad, het mooi<b>e</b> huis, mooi<b>e</b> huizen — з -e</li><li><b>Виняток:</b> het-слово в однині з een або без артикля: <b>een mooi huis</b> — без -e</li><li>Після іменника — ніколи: Het huis is mooi.</li></ul>`,
ex:[["een grote stad","велике місто (de stad)"],["een groot huis","великий дім (het huis)"],["De koffie is warm.","Кава гаряча."]],
mistake:["een kleine kind","een klein kind","het kind + een → без -e."],
tip:"Вивчи напам'ять одну пару: «een groot huis — de grote stad». Решта за аналогією.",
q:[{q:"een ___ kind (klein)",o:["klein","kleine"],a:0},{q:"de ___ fiets (nieuw)",o:["nieuw","nieuwe"],a:1}]},
{lv:"A1",e:"🐣",t:"Зменшувальні слова на -je",
simple:"Нідерландці дуже люблять зменшувальні. Вони означають не лише «маленьке», а й «миле, дружнє». Такі слова <b>завжди мають het</b>.",
rules:`<ul><li>+je: het huis → het huis<b>je</b></li><li>+tje після голосного або l, n, r: de stoel → het stoel<b>tje</b></li><li>+pje після m: de boom → het boom<b>pje</b></li><li>+etje після короткого голосного + l, m, n, r, ng: de bal → het ball<b>etje</b></li></ul>`,
ex:[["een kopje koffie","чашечка кави"],["een broodje kaas","булочка з сиром"],["een biertje","пивко"]],
mistake:["de broodje","het broodje","Усі слова на -je — het."],
tip:"Зменшувальне робить прохання м'якшим: «Heb je even een minuutje?»",
q:[{q:"___ kopje",o:["de","het"],a:1}]},
{lv:"A1",e:"🕐",t:"Котра година",
simple:"Головна пастка: <b>half drie</b> — це <b>2:30</b>, а не 3:30! Думай: «пів до трьох».",
rules:`<ul><li>3:00 — drie uur</li><li>3:15 — kwart over drie</li><li>3:30 — half vier</li><li>3:45 — kwart voor vier</li><li>3:10 — tien over drie; 3:20 — tien voor half vier; 3:40 — tien over half vier</li></ul>`,
ex:[["Hoe laat is het?","Котра година?"],["Het is half acht.","Зараз 7:30."],["Ik begin om kwart over negen.","Я починаю о 9:15."]],
mistake:["half drie = 3:30","half drie = 2:30","half рахується до наступної години."],
tip:"Половина — завжди до наступної години, як у німецькій та польській.",
q:[{q:"half zes = ?",o:["5:30","6:30"],a:0},{q:"kwart voor twee = ?",o:["1:45","2:15"],a:0}]},
{lv:"A2",e:"⏪",t:"Минулий час perfectum (я зробив)",
simple:"У розмові минуле майже завжди кажуть так: <b>hebben або zijn</b> (на 2-му місці) + <b>форма на ge-…-t/d</b> (у кінці).",
rules:`<ul><li>Утворення: <b>ge + основа + t/d</b>: werken → <b>ge</b>werk<b>t</b>, wonen → <b>ge</b>woon<b>d</b>.</li><li>Правило <b>'t kofschip</b>: якщо основа закінчується на t, k, f, s, ch, p — пишемо <b>-t</b>, інакше <b>-d</b>.</li><li>Більшість дієслів — з <b>hebben</b>: Ik heb gekookt.</li><li>Рух і зміна стану — з <b>zijn</b>: gaan, komen, blijven, worden: Ik ben gegaan.</li><li>Неправильні треба вчити: zien → gezien, eten → gegeten, drinken → gedronken, gaan → gegaan.</li></ul>`,
ex:[["Ik heb gisteren gewerkt.","Я вчора працював."],["Wij zijn naar Amsterdam gegaan.","Ми поїхали до Амстердама."],["Heb je de film gezien?","Ти бачив фільм?"]],
mistake:["Ik heb naar huis gegaan.","Ik ben naar huis gegaan.","gaan — рух, тому zijn."],
tip:"«'t kofschip» = «кавовий корабель». Уяви корабель із кавою: усі приголосні з нього дають -t.",
q:[{q:"Wij hebben ___ (fietsen).",o:["gefietsd","gefietst"],a:1},{q:"Zij ___ thuis gebleven.",o:["heeft","is"],a:1}]},
{lv:"A2",e:"📜",t:"Простий минулий час (imperfectum): was, had",
simple:"У розповідях і текстах використовують простий минулий: <b>ik was</b> (я був), <b>ik had</b> (я мав), <b>ik woonde</b> (я жив).",
rules:`<ul><li>zijn → was / waren (мн.); hebben → had / hadden</li><li>Правильні: основа + <b>-te</b> ('t kofschip) або <b>-de</b>: werken → werk<b>te</b>, wonen → woon<b>de</b>. Множина: werkten, woonden.</li><li>Часті неправильні: gaan → ging, komen → kwam, zien → zag, doen → deed, krijgen → kreeg, vinden → vond.</li></ul>`,
ex:[["Vroeger woonde ik in Lviv.","Раніше я жила у Львові."],["Het was koud.","Було холодно."],["We hadden geen tijd.","У нас не було часу."]],
mistake:["Ik werkde.","Ik werkte.","k — з 't kofschip, тому -te."],
tip:"Для розмови вистачає perfectum, а was і had вчи одразу — вони найчастіші.",
q:[{q:"Gisteren ___ ik ziek. (zijn)",o:["ben","was"],a:1},{q:"wonen → ik ___",o:["woonte","woonde"],a:1}]},
{lv:"A2",e:"🔮",t:"Майбутнє: gaan + дієслово",
simple:"Найпростіше майбутнє — як «я збираюся»: <b>gaan</b> на 2-му місці + дієслово в кінці. Часто просто теперішній час + слово «morgen».",
rules:`<ul><li>Ik <b>ga</b> morgen <b>koken</b>. — Завтра я готуватиму.</li><li>Morgen <b>werk</b> ik thuis. — Завтра я працюю вдома (теперішній час).</li><li><b>zullen</b> — обіцянка або пропозиція: Ik zal je helpen. Zullen we gaan?</li></ul>`,
ex:[["We gaan volgend jaar verhuizen.","Ми наступного року переїжджаємо."],["Ik zal het morgen doen.","Я зроблю це завтра (обіцяю)."],["Zullen we koffie drinken?","Може, вип'ємо кави?"]],
mistake:["Ik ga morgen koken ik.","Ik ga morgen koken.","Підмет не повторюємо."],
tip:"«Zullen we...?» = «А давай...?» — найприродніша пропозиція.",
q:[{q:"Ik ___ morgen sporten.",o:["ga","gaan"],a:0}]},
{lv:"A2",e:"🔗",t:"Складні речення: omdat, dat, als (дієслово в кінець)",
simple:"Після слів <b>omdat</b> (тому що), <b>dat</b> (що), <b>als</b> (якщо), <b>wanneer</b>, <b>terwijl</b> дієслово переїжджає <b>в самий кінець</b> частини речення.",
rules:`<ul><li>Ik blijf thuis, <b>omdat</b> ik ziek <b>ben</b>.</li><li>Ik denk <b>dat</b> hij morgen <b>komt</b>.</li><li><b>Als</b> het <b>regent</b>, neem ik de bus.</li><li>Але <b>want</b> (бо) — звичайний порядок: Ik blijf thuis, want ik ben ziek.</li></ul>`,
ex:[["Ik leer Nederlands, omdat ik hier woon.","Я вчу нідерландську, бо я тут живу."],["Ik weet dat het moeilijk is.","Я знаю, що це важко."],["Als je tijd hebt, bel me.","Якщо будеш мати час, подзвони."]],
mistake:["..., omdat ik ben ziek.","..., omdat ik ziek ben.","Після omdat дієслово — в кінці."],
tip:"omdat і want означають одне й те саме. Не впевнений — кажи want, там порядок звичайний.",
q:[{q:"Ik kom niet, omdat ik ___ .",o:["ben moe","moe ben"],a:1},{q:"Ik kom niet, want ik ___ .",o:["ben moe","moe ben"],a:0}]},
{lv:"A2",e:"📊",t:"Порівняння: groter, het grootst",
simple:"Більше: <b>+er</b>. Найбільше: <b>het + -st</b>. Порівнюємо словом <b>dan</b> (ніж).",
rules:`<ul><li>klein → klein<b>er</b> → het klein<b>st</b></li><li>groot → grot<b>er</b> → het groot<b>st</b></li><li>Після r додаємо -der: duur → duur<b>der</b></li><li>Неправильні: goed → beter → het best; veel → meer → het meest; graag → liever → het liefst</li></ul>`,
ex:[["Amsterdam is groter dan Utrecht.","Амстердам більший за Утрехт."],["Dit is het beste restaurant.","Це найкращий ресторан."],["Ik drink liever thee.","Я краще питиму чай."]],
mistake:["meer groot","groter","Не «meer + прикметник», а -er."],
tip:"«liever» — щоб сказати, що тобі більше подобається: Ik fiets liever dan ik loop.",
q:[{q:"goed → ?",o:["goeder","beter"],a:1},{q:"Hij is ___ dan ik. (oud)",o:["ouder","meer oud"],a:0}]},
{lv:"A2",e:"📢",t:"Наказовий спосіб: Kom! Wacht!",
simple:"Щоб попросити чи наказати, беремо <b>основу дієслова</b> і ставимо на початок. Ввічливіше — додати even, maar або alsjeblieft.",
rules:`<ul><li>komen → <b>Kom</b> hier!</li><li>wachten → <b>Wacht</b> even.</li><li>Ввічливо: <b>Kunt u</b> even wachten? / <b>Wilt u</b> hier tekenen?</li><li>zijn → <b>Wees</b> stil! (будь тихим)</li></ul>`,
ex:[["Kom binnen!","Заходь!"],["Doe de deur dicht, alsjeblieft.","Зачини двері, будь ласка."],["Neem maar een stoel.","Бери стілець."]],
mistake:["Komt binnen!","Kom binnen!","Без -t."],
tip:"«maar» і «even» роблять наказ м'якшим: «Kom maar» = «заходь, не соромся».",
q:[{q:"(wachten) ___ even!",o:["Wacht","Wachten"],a:0}]}
];
