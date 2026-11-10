const RAW = {
"Привітання і фрази": `hallo|привіт
goedemorgen|доброго ранку|goed = добрий, morgen = ранок
goedemiddag|добрий день
goedenavond|добрий вечір
dag|привіт / бувай|Універсальне: і при зустрічі, і при прощанні
tot ziens|до побачення|Дослівно «до бачення»
tot straks|до скорого
tot morgen|до завтра
alsjeblieft|будь ласка (на «ти»)|Також кажуть, коли щось подають: «ось, тримай»
alstublieft|будь ласка (ввічливо)
dank je wel|дякую (на «ти»)
dank u wel|дякую (ввічливо)
graag gedaan|нема за що|graag = охоче
sorry|вибачте
ja|так
nee|ні
natuurlijk|звичайно
prima|чудово, гаразд
hoe gaat het?|як справи?
het gaat goed|все добре
ik begrijp het niet|я не розумію
kunt u dat herhalen?|можете повторити?
spreekt u Engels?|ви говорите англійською?
eet smakelijk|смачного
gezondheid|будь здоров (коли чхнули)
proost|будьмо! (тост)`,
"Числа": `nul|нуль
een|один|Читається «ейн» (часто пишуть één)
twee|два
drie|три
vier|чотири
vijf|п'ять
zes|шість
zeven|сім
acht|вісім
negen|дев'ять
tien|десять
elf|одинадцять
twaalf|дванадцять
twintig|двадцять
eenentwintig|двадцять один|Як у німецькій: «один-і-двадцять»
dertig|тридцять
honderd|сто
duizend|тисяча
eerste|перший
tweede|другий`,
"Час і дні": `de dag|день
de week|тиждень
de maand|місяць
het jaar|рік
het uur|година
vandaag|сьогодні
morgen|завтра (і «ранок»)
gisteren|вчора
nu|зараз
straks|невдовзі, пізніше сьогодні
vroeg|рано
laat|пізно
altijd|завжди
vaak|часто
soms|іноді
nooit|ніколи
maandag|понеділок|maan = місяць (Луна)
dinsdag|вівторок
woensdag|середа
donderdag|четвер|donder = грім (день Тора)
vrijdag|п'ятниця
zaterdag|субота
zondag|неділя|zon = сонце
de avond|вечір
de nacht|ніч
januari|січень
februari|лютий
maart|березень
april|квітень
mei|травень
juni|червень
juli|липень
augustus|серпень
september|вересень
oktober|жовтень
november|листопад
december|грудень
de lente|весна
de zomer|літо
de herfst|осінь
de winter|зима
hoe laat is het?|котра година?
half drie|пів на третю (2:30)|Пастка! half drie = 2:30, а не 3:30. Думай «пів до трьох»`,
"Сім'я та люди": `de familie|родина (рідні)
het gezin|сім'я (батьки й діти)
de vader|батько
de moeder|мати
de ouders|батьки
het kind|дитина
de kinderen|діти
de zoon|син
de dochter|донька
de broer|брат
de zus|сестра
de opa|дідусь
de oma|бабуся
de man|чоловік
de vrouw|жінка; дружина
de jongen|хлопець
het meisje|дівчинка|Усі слова на -je мають артикль het
de vriend|друг; хлопець (партнер)
de vriendin|подруга; дівчина (партнерка)
de buurman|сусід
de collega|колега
de mensen|люди
de naam|ім'я`,
"Їжа": `het eten|їжа
het ontbijt|сніданок
de lunch|обід
het avondeten|вечеря
het brood|хліб
de boter|масло
de kaas|сир|Gouda, Edam — нідерландська гордість
het ei|яйце
de melk|молоко
het vlees|м'ясо
de kip|курка
de vis|риба
de groente|овочі
de aardappel|картопля|aard + appel = «земляне яблуко»
de ui|цибуля
de wortel|морква|Також «корінь»
de appel|яблуко
de sinaasappel|апельсин|«китайське яблуко»
de aardbei|полуниця|«земляна ягода»
de rijst|рис
de suiker|цукор
het zout|сіль
het broodje|булочка, бутерброд
de hagelslag|шоколадна посипка (на хліб)|Голландці їдять її на сніданок на хлібі з маслом
de stroopwafel|вафля з сиропом
de patat|картопля фрі
de pindakaas|арахісова паста|«арахісовий сир», хоча це не сир`,
"Напої": `het water|вода
de koffie|кава
de thee|чай
het sap|сік
het bier|пиво
de wijn|вино
de frisdrank|газована вода
ik heb honger|я голодний
ik heb dorst|я хочу пити`,
"Кафе і магазин": `het restaurant|ресторан
het café|кафе, бар
de kaart|меню; карта; квиток
de rekening|рахунок
de ober|офіціант
bestellen|замовляти
betalen|платити
pinnen|платити карткою|Від PIN-коду. «Kan ik pinnen?» — можна карткою?
contant|готівкою
de winkel|магазин
de supermarkt|супермаркет
de bakker|пекарня, пекар
de apotheek|аптека
de prijs|ціна
duur|дорогий
goedkoop|дешевий
de korting|знижка
het geld|гроші
kopen|купувати
hoeveel kost het?|скільки коштує?
ik wil graag...|я б хотів...|Найввічливіший спосіб замовити
mag ik...?|можна мені...?
de kassa|каса
open|відчинено
dicht|зачинено`,
"Дім": `het huis|дім
het appartement|квартира
de kamer|кімната
de keuken|кухня
de badkamer|ванна кімната
de slaapkamer|спальня|slapen = спати
de woonkamer|вітальня|wonen = жити
het toilet|туалет
de tuin|сад
de deur|двері
het raam|вікно
de tafel|стіл
de stoel|стілець
de bank|диван; банк|Пастка: «op de bank» = на дивані
het bed|ліжко
de kast|шафа
de douche|душ
de koelkast|холодильник|koel = прохолодний + kast = шафа
het mes|ніж
de vork|виделка
de lepel|ложка
de sleutel|ключ
de verwarming|опалення`,
"Місто і транспорт": `de stad|місто
het dorp|село
de straat|вулиця
de weg|дорога|«de weg vragen» = питати дорогу
de gracht|канал (у місті)
het centrum|центр
het station|вокзал
de trein|потяг
de bus|автобус
de tram|трамвай
de fiets|велосипед|У Нідерландах велосипедів більше, ніж людей
de auto|автомобіль
het vliegtuig|літак|vliegen = літати
het vliegveld|аеропорт
de halte|зупинка
het kaartje|квиток
de ingang|вхід
de uitgang|вихід|Шукай табличку UITGANG
links|ліворуч
rechts|праворуч
rechtdoor|прямо
dichtbij|близько
ver|далеко
het ziekenhuis|лікарня|ziek = хворий + huis = дім
de school|школа
het gemeentehuis|мерія, ратуша|Тут реєструють адресу (BSN)`,
"Тіло і здоров'я": `het lichaam|тіло
het hoofd|голова
het haar|волосся
het oog|око
het oor|вухо
de neus|ніс
de mond|рот
de tand|зуб
de arm|рука (від плеча)
de hand|кисть руки
de buik|живіт
het been|нога
de voet|стопа
de huisarts|сімейний лікар|До спеціаліста — тільки через huisarts
de dokter|лікар
het medicijn|ліки
de pijn|біль
ziek|хворий
gezond|здоровий
moe|втомлений
de koorts|температура (жар)
verkouden|застуджений
ik heb hoofdpijn|у мене болить голова
de afspraak|запис, зустріч|afspreken = домовлятися`,
"Одяг і кольори": `de kleren|одяг
de broek|штани
het shirt|футболка
de trui|светр
de jas|куртка, пальто
de jurk|сукня
de rok|спідниця|Пастка: не «рок», а спідниця
de schoen|черевик
de bril|окуляри
de paraplu|парасолька|Найважливіша річ у Нідерландах
passen|приміряти; пасувати
de kleur|колір
rood|червоний
oranje|помаранчевий|Колір королівської родини
geel|жовтий
groen|зелений
blauw|синій
bruin|коричневий
zwart|чорний
wit|білий`,
"Погода": `het weer|погода
de zon|сонце
de regen|дощ
de wind|вітер
de sneeuw|сніг
de wolk|хмара
het regent|йде дощ
het waait|дме вітер
warm|теплий, жаркий
koud|холодний
lekker weer|гарна погода
nat|мокрий
droog|сухий
de graad|градус
de lucht|небо; повітря`,
"Робота і навчання": `het werk|робота
werken|працювати
de baan|посада, робоче місце
het kantoor|офіс
de baas|начальник|Звідси англ. boss
het salaris|зарплата
de vergadering|нарада
de leraar|вчитель
de les|урок
de taal|мова
het woord|слово
de zin|речення; бажання|«Ik heb zin in koffie» = хочу кави
het boek|книга
de computer|комп'ютер
de telefoon|телефон
leren|вчити; вчитися
studeren|навчатися (в універі)
lezen|читати
schrijven|писати
het huiswerk|домашнє завдання
het formulier|бланк, анкета
de vakantie|відпустка, канікули
vrij|вільний, вихідний
druk|зайнятий; людно|«Het is druk» = людно, багато справ`,
"Хобі і дозвілля": `de hobby|хобі
sporten|займатися спортом
zwemmen|плавати
fietsen|їздити на велосипеді
wandelen|гуляти
koken|готувати їжу
dansen|танцювати
zingen|співати
de muziek|музика
de film|фільм
het spel|гра
de vrije tijd|вільний час
het feest|свято, вечірка
de verjaardag|день народження
het cadeau|подарунок
uitgaan|ходити розважатися
reizen|подорожувати`,
"Дієслова": `zijn|бути|ik ben, jij bent, hij is
hebben|мати|ik heb, jij hebt, hij heeft
gaan|йти, їхати
komen|приходити
doen|робити
maken|робити, виготовляти
zeggen|казати
spreken|говорити (мовою)
praten|розмовляти
vragen|питати
antwoorden|відповідати
weten|знати (факт)|Ik weet het = я знаю це
kennen|знати (людину, місце)|Ik ken hem = я його знаю
denken|думати
zien|бачити
kijken|дивитися
horen|чути
luisteren|слухати
eten|їсти
drinken|пити
slapen|спати
wonen|жити (мешкати)|Ik woon in Utrecht
wachten|чекати
zoeken|шукати
vinden|знаходити; вважати|Ik vind het leuk = мені подобається
geven|давати
nemen|брати
brengen|приносити
beginnen|починати
stoppen|зупиняти(ся)
helpen|допомагати
bellen|дзвонити|Пастка: не «белькотіти» :)
staan|стояти
zitten|сидіти
liggen|лежати
lopen|іти пішки|Не «бігти»! Бігти = rennen
rijden|їхати (за кермом)
blijven|залишатися
worden|ставати
kunnen|могти
willen|хотіти
moeten|мусити
mogen|мати дозвіл
houden van|любити|Ik hou van jou = я тебе кохаю
wassen|мити, прати
opstaan|вставати|Відокремлюване: ik sta om 7 uur op
meenemen|брати з собою
afspreken|домовлятися
proberen|пробувати
gebruiken|використовувати
begrijpen|розуміти
vergeten|забувати
betekenen|означати|Wat betekent dit? = що це означає?
krijgen|отримувати
openen|відкривати
sluiten|закривати`,
"Прикметники": `groot|великий
klein|маленький
lang|довгий; високий (людина)
kort|короткий
nieuw|новий
oud|старий
jong|молодий
mooi|гарний
goed|добрий
slecht|поганий
leuk|класний, приємний|Найчастіше слово в розмові: «Leuk!»
saai|нудний
makkelijk|легкий (простий)
moeilijk|важкий (складний)
snel|швидкий
langzaam|повільний
blij|радий
verdrietig|сумний
boos|злий, сердитий
bang|наляканий|Ik ben bang voor honden = боюся собак
aardig|милий, привітний
vriendelijk|дружній
gezellig|затишний, приємний (з людьми)|Найголландське слово — затишок, тепло, компанія
lekker|смачний; приємний
vol|повний
leeg|порожній
schoon|чистий
vies|брудний; гидкий
hoog|високий
zwaar|важкий (вагою)
licht|легкий; світлий
sterk|сильний
belangrijk|важливий
klaar|готовий|Ben je klaar? = ти готовий?
rustig|спокійний
stil|тихий
zeker|впевнений; звісно
fijn|приємний, гарний
raar|дивний
slim|розумний|Пастка: не «худий»!`,
"Питання і зв'язки": `wie|хто
wat|що
waar|де
wanneer|коли
waarom|чому
hoe|як
hoeveel|скільки
welke|який (з)
en|і
of|або
maar|але
want|бо
omdat|тому що|Після omdat дієслово йде в кінець!
dus|отже
als|якщо; коли
dan|тоді; ніж
ook|також
nog|ще
al|вже
heel|дуже; цілий
erg|дуже; жахливий
te|занадто
zo|так
veel|багато
weinig|мало
meer|більше
alleen|сам; лише
samen|разом
misschien|можливо
niet|не|Заперечує дієслово, прикметник
geen|жодного, ні|Заперечує іменник: ik heb geen auto`,
"Прийменники": `in|в
op|на
onder|під
naast|поруч
achter|позаду
voor|перед; для
tussen|між
bij|біля, у (когось)|Ik ben bij de dokter = я у лікаря
met|з
zonder|без
naar|до (напрямок)
van|від; з (кого)
uit|з (звідки)
door|через
over|про; над
tegen|проти
om|о (годині); навколо|om 8 uur = о 8-й
na|після`,
"Займенники": `ik|я
jij / je|ти
u|ви (ввічливо)
hij|він
zij / ze|вона
wij / we|ми
jullie|ви (множина)
zij / ze (мн.)|вони
mijn|мій
jouw / je|твій
uw|ваш (ввічливо)
zijn (zijn boek)|його
haar|її
ons / onze|наш
hun|їхній
mij / me|мене, мені
hem|його, йому`,
"Подорожі": `de reis|подорож
het hotel|готель
de koffer|валіза
het paspoort|паспорт
het land|країна
Nederland|Нідерланди
België|Бельгія
Oekraïne|Україна
het Nederlands|нідерландська мова
de zee|море
het strand|пляж
het bos|ліс
het meer|озеро|Також «більше»
de molen|млин
de tulp|тюльпан
boeken|бронювати`
};
