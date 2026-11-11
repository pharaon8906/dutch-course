const LEVELS=[
 {id:"A0",n:"A0 · Старт",d:"Перші слова, привітання, числа, про себе",e:"🌱"},
 {id:"A1",n:"A1 · Базовий",d:"Магазин, місто, лікар, теперішній і минулий час",e:"🗽"},
 {id:"A2",n:"A2 · Впевнений",d:"Робота, Present Perfect, складніші речення",e:"🌳"}
];
const CATLEVEL={"Привітання і фрази":"A0","Числа":"A0","Сім'я та люди":"A0","Їжа":"A0","Напої":"A0","Займенники":"A0","Одяг і кольори":"A0","Розмовні вирази":"A1",
"Час і дні":"A1","Кафе і магазин":"A1","Дім":"A1","Місто і транспорт":"A1","Тіло і здоров'я":"A1","Погода":"A1","Дієслова":"A1","Прикметники":"A1","Питання і зв'язки":"A1","Прийменники":"A1",
"Робота і навчання":"A2","Хобі і дозвілля":"A2","Подорожі":"A2"};
const DLEVEL=["A0","A0","A1","A1","A1","A2","A1","A2","A2"];

const EXPR_RAW=`no problem|без проблем
no worries|не переймайся, все гаразд
it doesn't matter|неважливо
that's right|саме так
really?|справді?
exactly|точно
sure|звісно
that's too bad|шкода
I have no idea|гадки не маю
I don't know|я не знаю
what do you mean?|що ти маєш на увазі?
go ahead|давай, прошу
awesome!|чудово!
come on!|давай! (підбадьорити)
I'll be right back|я зараз повернуся
just a moment|хвилинку
hold on|зачекай
watch out!|обережно!
I don't mind|я не проти
I'm not in the mood|я не в настрої
I feel like...|мені хочеться...|I feel like pizza = мені хочеться піци
good idea!|гарна ідея!
have a nice day!|гарного дня!
have a good weekend!|гарних вихідних!
see you soon|до зустрічі
what's your name?|як тебе звати?
my name is...|мене звати...
where are you from?|звідки ти?
nice to meet you|приємно познайомитися
how do you say that in English?|як це сказати англійською?
one more time, please|ще раз, будь ласка
can I get through?|можна пройти?
is this seat taken?|це місце зайняте?
I have a question|у мене питання
I'm sorry to hear that|мені шкода це чути
my pleasure|з радістю, нема за що
that's very kind of you|це дуже мило з вашого боку
I agree|я згоден
what's up?|як справи? що нового?
take care|бережи себе`;

const NEW_DIALOGS=[
{t:"At the bakery",uk:"У пекарні",lv:"A0",e:"🥐",lines:[
["A","Good morning! What can I get you?","Доброго ранку! Що вам дати?"],
["B","Good morning. A loaf of whole wheat bread, please.","Доброго ранку. Буханець цільнозернового хліба, будь ласка."],
["A","Sliced or unsliced?","Нарізати чи цілий?"],
["B","Sliced, please. And four croissants.","Нарізати, будь ласка. І чотири круасани."],
["A","Anything else?","Ще щось?"],
["B","No, thank you. That's all.","Ні, дякую. Це все."],
["A","That'll be eight forty.","З вас вісім сорок."],
["B","Here you go. Have a nice day!","Ось, тримайте. Гарного дня!"]],
tip:"«Here you go» — так кажуть, коли щось подають: «ось, тримайте»."},
{t:"At the pharmacy",uk:"В аптеці",lv:"A1",e:"💊",lines:[
["A","Hi, can I help you?","Добрий день, чим можу допомогти?"],
["B","Yes, I have a prescription from my doctor.","Так, у мене рецепт від лікаря."],
["A","Thank you. What's your date of birth?","Дякую. Яка ваша дата народження?"],
["B","March twelfth, nineteen ninety.","Дванадцяте березня тисяча дев'ятсот дев'яностого."],
["A","Here are your pills. Take two a day, after meals.","Ось ваші таблетки. По дві на день, після їжі."],
["B","Can I drink alcohol with them?","Можна з ними пити алкоголь?"],
["A","No, better not.","Ні, краще не треба."],
["B","Okay, thanks for explaining.","Добре, дякую за пояснення."]],
tip:"Дати в США: спочатку місяць, потім число — March 12 (3/12)."},
{t:"Picking up a package",uk:"Забрати посилку",lv:"A1",e:"📦",lines:[
["A","Hi, I'm here to pick up a package.","Добрий день, я прийшла забрати посилку."],
["B","Do you have the tracking number?","У вас є номер відстеження?"],
["A","Yes, it's here on my phone.","Так, ось у телефоні."],
["B","Can I also see your ID, please?","Можна також ваше посвідчення особи?"],
["A","Of course, here you go.","Звісно, ось."],
["B","Just a moment, I'll go and check.","Хвилинку, зараз подивлюся."],
["B","Here's your package. Can you sign here, please?","Ось ваша посилка. Підпишіть тут, будь ласка."],
["A","Sure. Thank you very much!","Звісно. Дуже дякую!"]],
tip:"ID — будь-який документ з фото: паспорт, водійські права."},
{t:"The new neighbor",uk:"Нова сусідка",lv:"A1",e:"🏘️",lines:[
["A","Hi! You're the new neighbor, right?","Привіт! Ти нова сусідка, так?"],
["B","Yes, I moved into number twelve last week.","Так, я переїхала в номер дванадцять минулого тижня."],
["A","Welcome! I'm Jessica. How do you like the house?","Ласкаво просимо! Я Джессіка. Як тобі будинок?"],
["B","I love it. But I don't know when to put the trash out.","Дуже подобається. Але я не знаю, коли виставляти сміття."],
["A","On Tuesdays. Trash every week, recycling every other week.","По вівторках. Сміття щотижня, вторсировина — через тиждень."],
["B","That's really helpful, thank you!","Це дуже корисно, дякую!"],
["A","No problem. Come over for coffee sometime.","Нема за що. Заходь якось на каву."]],
tip:"Trash — сміття (брит. rubbish), recycling — вторсировина."},
{t:"At the hair salon",uk:"У перукарні",lv:"A2",e:"💇",lines:[
["A","Hi! What are we doing today?","Привіт! Що робимо сьогодні?"],
["B","I'd like a haircut. Not too short, just a trim.","Я б хотіла підстригтися. Не дуже коротко, тільки підрівняти."],
["A","About an inch off?","Приблизно дюйм зрізати?"],
["B","Yes, that's fine. Can you also blow-dry it?","Так, добре. А ще можете висушити феном?"],
["A","Of course. Would you like me to wash it first?","Звісно. Спершу помити?"],
["B","Yes, please. How much is that altogether?","Так, будь ласка. Скільки це разом?"],
["A","A cut and blow-dry is forty-five dollars.","Стрижка й укладка — сорок п'ять доларів."]],
tip:"У США в перукарні прийнято давати чайові (tip) — 15–20%."},
{t:"Renting a room",uk:"Орендувати кімнату",lv:"A2",e:"🔑",lines:[
["A","Good evening, I'm calling about the room in the ad.","Добрий вечір, я дзвоню щодо кімнати з оголошення."],
["B","Yes, it's still available. What would you like to know?","Так, вона ще вільна. Що ви хочете знати?"],
["A","How much is the rent per month?","Яка оренда на місяць?"],
["B","Nine hundred dollars, utilities included.","Дев'ятсот доларів, з комунальними."],
["A","Is the room furnished?","Кімната мебльована?"],
["B","Yes, there's a bed, a desk and a closet.","Так, там ліжко, стіл і шафа."],
["A","Is there a security deposit?","Потрібен заставний депозит?"],
["B","Yes, one month's rent. Would you like to come and see it?","Так, оренда за один місяць. Хочете прийти подивитися?"],
["A","Yes, please. Can I come tomorrow after six?","Так. Можна завтра після шостої?"]],
tip:"Utilities — комунальні послуги. Security deposit — застава, яку повертають при виїзді."},
{t:"At the bank",uk:"У банку",lv:"A2",e:"🏦",lines:[
["A","Good morning. I'd like to open a bank account.","Доброго ранку. Я хотіла б відкрити рахунок."],
["B","Sure. Do you want a checking or a savings account?","Звісно. Вам поточний чи ощадний рахунок?"],
["A","A checking account, please. I need it for my salary.","Поточний, будь ласка. Мені для зарплати."],
["B","Can I see your passport and proof of address?","Можна ваш паспорт і підтвердження адреси?"],
["A","Here's my passport and a letter from my landlord.","Ось паспорт і лист від орендодавця."],
["B","Thank you. Your debit card will arrive in about a week.","Дякую. Ваша картка прийде приблизно за тиждень."],
["A","Do I have to pay a monthly fee?","Мені треба платити щомісячну комісію?"],
["B","Not if you keep at least five hundred dollars in the account.","Ні, якщо на рахунку буде щонайменше п'ятсот доларів."]],
tip:"Checking account — поточний рахунок, savings account — ощадний."}
];

const ALPHABET=[["A","ей"],["B","бі"],["C","сі"],["D","ді"],["E","і"],["F","еф"],["G","джі"],["H","ейч"],["I","ай"],["J","джей"],["K","кей"],["L","ел"],["M","ем"],["N","ен"],["O","оу"],["P","пі"],["Q","к'ю"],["R","ар"],["S","ес"],["T","ті"],["U","ю"],["V","ві"],["W","дабл-ю"],["X","екс"],["Y","вай"],["Z","зі (брит. зед)"]];

const PHONICS=[
{g:"Короткі голосні",e:"🔹",d:"У закритому складі (голосний між приголосними) голосний звучить коротко.",items:[
 {w:"a",r:"широке «е», ближче до «а» (рот широко)",ex:[["cat","кіт"],["bag","сумка"],["hat","капелюх"]],tip:"Скажи «е», але відкрий рот, як для «а». Звук [æ]."},
 {w:"e",r:"коротке «е»",ex:[["bed","ліжко"],["pen","ручка"],["red","червоний"]]},
 {w:"i",r:"коротке «і», ближче до «и»",ex:[["sit","сидіти"],["big","великий"],["fish","риба"]]},
 {w:"o",r:"«а» з відкритим ротом (американське)",ex:[["hot","спекотний"],["dog","собака"],["stop","зупинитися"]],tip:"В американській hot звучить майже «хат»."},
 {w:"u",r:"коротке «а» (не «у»!)",ex:[["cup","чашка"],["bus","автобус"],["sun","сонце"]],tip:"Пастка: cup = «кап», bus = «бас», а не «буc»."}]},
{g:"Довгі голосні і «магічна e»",e:"🔷",d:"Німа e в кінці слова змушує голосний читатися як назва букви.",items:[
 {w:"a_e",r:"«ей»",ex:[["cake","торт"],["name","ім'я"],["late","пізно"]],tip:"cap → cape: німа e перетворює «е» на «ей»."},
 {w:"i_e",r:"«ай»",ex:[["bike","велосипед"],["time","час"],["nice","приємний"]]},
 {w:"o_e",r:"«оу»",ex:[["home","дім"],["note","записка"],["phone","телефон"]]},
 {w:"u_e",r:"«ю»",ex:[["cute","милий"],["use","використовувати"],["huge","величезний"]]},
 {w:"ee / ea",r:"довге «і»",ex:[["see","бачити"],["tree","дерево"],["eat","їсти"],["tea","чай"]]},
 {w:"oo",r:"довге «у» або коротке «у»",ex:[["food","їжа"],["moon","місяць"],["book","книга"],["good","добрий"]],tip:"food, moon — довге «уу»; book, good — коротке «у»."}]},
{g:"Дифтонги",e:"🌀",d:"Два звуки, що зливаються в один.",items:[
 {w:"ai / ay",r:"«ей»",ex:[["rain","дощ"],["day","день"],["play","грати"]]},
 {w:"oa / ow",r:"«оу»",ex:[["boat","човен"],["road","дорога"],["snow","сніг"]]},
 {w:"ou / ow",r:"«ау»",ex:[["house","будинок"],["out","назовні"],["now","зараз"],["cow","корова"]],tip:"ow буває «оу» (snow) і «ау» (now) — вчи зі словом."},
 {w:"oi / oy",r:"«ой»",ex:[["coin","монета"],["boy","хлопчик"],["toy","іграшка"]]},
 {w:"igh / y",r:"«ай»",ex:[["night","ніч"],["light","світло"],["my","мій"],["fly","літати"]],tip:"gh у середині слова не читається: night = «найт»."}]},
{g:"Голосні з r (американська вимова)",e:"🗽",d:"В американській англійській r після голосного чітко вимовляється: кінчик язика загинається назад.",items:[
 {w:"ar",r:"«ар»",ex:[["car","машина"],["park","парк"],["star","зірка"]]},
 {w:"er / ir / ur",r:"один звук «ер» (як ö + r)",ex:[["her","її"],["bird","птах"],["nurse","медсестра"],["work","робота"]],tip:"her, bird, nurse — усі звучать однаково, «ер»."},
 {w:"or",r:"«ор»",ex:[["for","для"],["short","короткий"],["morning","ранок"]]},
 {w:"air / are",r:"«еар»",ex:[["hair","волосся"],["chair","стілець"],["care","турбота"]]}]},
{g:"Приголосні",e:"🔸",d:"Звуки, яких немає в українській або які вимовляються інакше.",items:[
 {w:"th (глухий)",r:"кінчик язика між зубами, видих: не «с» і не «ф»",ex:[["think","думати"],["three","три"],["thank you","дякую"]],tip:"Покажи кінчик язика між зубами й видихни. Найважливіший звук англійської!"},
 {w:"th (дзвінкий)",r:"те саме, але з голосом: не «з» і не «д»",ex:[["this","цей"],["the","означений артикль"],["mother","мати"]]},
 {w:"w",r:"губи трубочкою, як коротке «у»",ex:[["water","вода"],["we","ми"],["window","вікно"]],tip:"w — не «в»! Губи не торкаються зубів: wine ≠ vine."},
 {w:"v",r:"«в» (верхні зуби торкаються губи)",ex:[["very","дуже"],["van","фургон"],["love","любов"]]},
 {w:"h",r:"легкий видих, не «х»",ex:[["hello","привіт"],["house","будинок"],["happy","щасливий"]],tip:"Немов дихаєш на скло, щоб воно запітніло."},
 {w:"r",r:"язик не вібрує, кінчик загнутий назад",ex:[["red","червоний"],["right","правильно"],["very","дуже"]]},
 {w:"ng",r:"носове «н» без «г»",ex:[["sing","співати"],["long","довгий"],["morning","ранок"]]},
 {w:"sh / ch / j",r:"«ш» / «ч» / «дж»",ex:[["she","вона"],["chair","стілець"],["job","робота"]]},
 {w:"-tion",r:"«-шн»",ex:[["station","станція"],["vacation","відпустка"],["question","питання"]]},
 {w:"t між голосними (амер.)",r:"швидке м'яке «д»",ex:[["water","вода"],["better","краще"],["city","місто"]],tip:"В американській water звучить майже «вадер»."}]},
{g:"Німі букви",e:"🤫",d:"Букви, які пишуться, але не читаються.",items:[
 {w:"kn-",r:"k не читається",ex:[["know","знати"],["knife","ніж"],["knee","коліно"]]},
 {w:"wr-",r:"w не читається",ex:[["write","писати"],["wrong","неправильний"]]},
 {w:"-mb",r:"b не читається",ex:[["climb","лізти"],["thumb","великий палець"]]},
 {w:"gh",r:"не читається або «ф»",ex:[["night","ніч"],["daughter","донька"],["laugh","сміятися"],["enough","досить"]]},
 {w:"h на початку",r:"іноді німа",ex:[["hour","година"],["honest","чесний"]],tip:"Тому кажуть an hour, а не a hour."}]},
{g:"Закінчення",e:"🔚",d:"Як читаються закінчення -ed і -s.",items:[
 {w:"-ed після t, d",r:"«-ід»",ex:[["wanted","хотів"],["needed","потребував"],["started","почав"]]},
 {w:"-ed після глухих (k, p, s, sh, ch, f)",r:"«-т»",ex:[["worked","працював"],["stopped","зупинився"],["watched","дивився"]],tip:"worked = «воркт», а не «воркед»!"},
 {w:"-ed після дзвінких",r:"«-д»",ex:[["played","грав"],["lived","жив"],["called","дзвонив"]]},
 {w:"-s після глухих",r:"«-с»",ex:[["books","книги"],["cats","коти"],["works","працює"]]},
 {w:"-s після дзвінких",r:"«-з»",ex:[["dogs","собаки"],["plays","грає"],["friends","друзі"]]},
 {w:"-es після s, sh, ch, x",r:"«-із»",ex:[["buses","автобуси"],["watches","годинники"],["boxes","коробки"]]}]}
];

const GRAMMAR2=[
{lv:"A0",e:"🙋",t:"Я, ти, він: займенники і дієслово to be (бути)",
simple:"В українській ми кажемо «Я студент» без дієслова. В англійській дієслово «бути» обов'язкове: I <b>am</b> a student.",
rules:`<table class="gt"><tr><th>Хто</th><th>to be</th><th>коротко</th></tr><tr><td>I — я</td><td>am</td><td>I'm</td></tr><tr><td>you — ти, ви</td><td>are</td><td>you're</td></tr><tr><td>he / she / it</td><td>is</td><td>he's, she's, it's</td></tr><tr><td>we — ми</td><td>are</td><td>we're</td></tr><tr><td>they — вони</td><td>are</td><td>they're</td></tr></table><ul><li>Заперечення: I'm <b>not</b>, he <b>isn't</b>, they <b>aren't</b>.</li><li>Питання: <b>Are</b> you tired? <b>Is</b> she at home?</li></ul>`,
ex:[["I am Olena.","Я Олена."],["He is tired.","Він утомлений."],["We are from Ukraine.","Ми з України."]],
mistake:["I student.","I am a student.","Без am речення неправильне, і перед професією потрібен a."],
tip:"Вік кажуть через to be: «I am thirty» (мені 30), а не «I have thirty».",
q:[{q:"She ___ a teacher.",o:["am","is","are"],a:1},{q:"They ___ at home.",o:["is","are","am"],a:1}]},
{lv:"A0",e:"🎨",t:"A, an і the: артиклі",
simple:"Перед іменником в однині майже завжди стоїть маленьке слово. <b>a / an</b> — «якийсь, один». <b>the</b> — «той самий, конкретний».",
rules:`<ul><li><b>a</b> — перед приголосним звуком: a cat, a house, a university (звук «ю»).</li><li><b>an</b> — перед голосним звуком: an apple, an egg, an hour (h німа).</li><li><b>the</b> — конкретний предмет, про який обоє знаємо: Close the door.</li><li>Без артикля: множина загалом (I like cats), незлічувані (I drink water), імена, міста, країни.</li></ul>`,
ex:[["I have a dog. The dog is black.","У мене є собака. Собака чорна."],["She eats an apple every day.","Вона щодня їсть яблуко."],["The sun is hot.","Сонце гаряче."]],
mistake:["I am teacher.","I am a teacher.","Перед професією в однині потрібен a."],
tip:"Обирай a/an за звуком, а не за буквою: an hour, але a university.",
q:[{q:"___ orange",o:["a","an"],a:1},{q:"___ university",o:["a","an"],a:0}]},
{lv:"A0",e:"2️⃣",t:"Порядок слів: хто — що робить — що",
simple:"В англійській порядок слів <b>майже завжди однаковий</b>: підмет → дієслово → додаток → місце → час. Переставляти слова, як в українській, не можна.",
rules:`<table class="gt"><tr><th>хто</th><th>дія</th><th>що</th><th>де</th><th>коли</th></tr><tr><td>I</td><td>drink</td><td>coffee</td><td>at work</td><td>every day.</td></tr><tr><td>She</td><td>plays</td><td>tennis</td><td>in the park</td><td>on Sundays.</td></tr></table>`,
ex:[["I drink coffee.","Я п'ю каву."],["Tom reads books at night.","Том читає книжки вночі."],["We watch TV in the evening.","Ми дивимося телевізор увечері."]],
mistake:["Coffee I drink every day.","I drink coffee every day.","Спершу хто, потім дія."],
tip:"Запам'ятай формулу «Хто? Що робить? Що? Де? Коли?» — вона працює в 90% речень.",
q:[{q:"Як правильно?",o:["Every day I coffee drink.","I drink coffee every day."],a:1}]},
{lv:"A0",e:"❓",t:"Як поставити питання з to be",
simple:"З дієсловом <b>to be</b> питання дуже просте: переставляємо am/is/are <b>на початок</b>.",
rules:`<ul><li>You are tired. → <b>Are</b> you tired?</li><li>She is at home. → <b>Is</b> she at home?</li><li>З питальним словом: <b>Where</b> are you? <b>What</b> is this? <b>How old</b> are you?</li><li>Питальні слова: who, what, where, when, why, how, how much, how many.</li></ul>`,
ex:[["Are you from Ukraine?","Ти з України?"],["Where is the station?","Де вокзал?"],["How old are you?","Скільки тобі років?"]],
mistake:["You are hungry?","Are you hungry?","У питанні are стоїть першим."],
tip:"Коротка відповідь: Yes, I am. / No, I'm not. Не просто «Yes».",
q:[{q:"___ he your brother?",o:["Is","Are","Does"],a:0},{q:"Where ___ you?",o:["is","are","do"],a:1}]},
{lv:"A0",e:"🚫",t:"Заперечення: not",
simple:"Щоб сказати «не», додаємо <b>not</b> після am/is/are або використовуємо <b>don't / doesn't</b> з іншими дієсловами.",
rules:`<ul><li>I am <b>not</b> hungry. / He is<b>n't</b> here. / They are<b>n't</b> ready.</li><li>I <b>don't</b> like coffee. (I, you, we, they)</li><li>She <b>doesn't</b> work on Sundays. (he, she, it)</li><li>Після doesn't дієслово без -s: she doesn't work<b>s</b> ✗</li></ul>`,
ex:[["I don't understand.","Я не розумію."],["She isn't at home.","Її немає вдома."],["He doesn't eat meat.","Він не їсть м'яса."]],
mistake:["I no like coffee.","I don't like coffee.","«no» тут не працює, потрібне don't."],
tip:"В англійській немає подвійного заперечення: I don't have <b>any</b> money, а не «no money».",
q:[{q:"I ___ speak French.",o:["don't","doesn't","not"],a:0},{q:"He ___ like fish.",o:["don't","doesn't"],a:1}]},
{lv:"A0",e:"👥",t:"Множина",
simple:"Щоб сказати «багато», найчастіше додаємо <b>-s</b>. Але є кілька хитрощів.",
rules:`<ul><li><b>+s</b>: a book → books, a car → cars</li><li><b>+es</b> після s, sh, ch, x: a bus → buses, a box → boxes</li><li>приголосний + y → <b>ies</b>: a city → cities, a baby → babies</li><li>-f / -fe → <b>ves</b>: a knife → knives, a wife → wives</li><li>Неправильні: man → <b>men</b>, woman → <b>women</b>, child → <b>children</b>, foot → <b>feet</b>, tooth → <b>teeth</b>, person → <b>people</b></li></ul>`,
ex:[["two cats","два коти"],["three children","троє дітей"],["many people","багато людей"]],
mistake:["two childs","two children","child має неправильну множину."],
tip:"people — це вже множина: People <b>are</b> nice, а не «is».",
q:[{q:"a city → ?",o:["citys","cities"],a:1},{q:"a man → ?",o:["mans","men"],a:1}]},
{lv:"A1",e:"⏱️",t:"Present Simple: звичайні дії",
simple:"Для того, що ти робиш <b>зазвичай, щодня, завжди</b>, — Present Simple. Головне правило: з <b>he / she / it</b> до дієслова додається <b>-s</b>.",
rules:`<table class="gt"><tr><th></th><th>+</th><th>–</th><th>?</th></tr><tr><td>I / you / we / they</td><td>work</td><td>don't work</td><td>Do you work?</td></tr><tr><td>he / she / it</td><td>work<b>s</b></td><td>doesn't work</td><td>Does she work?</td></tr></table><ul><li>Слова-підказки: always, usually, often, sometimes, never, every day.</li><li>he go → goes, he watch → watches, he study → studies, he have → <b>has</b></li></ul>`,
ex:[["I work in an office.","Я працюю в офісі."],["She lives in Boston.","Вона живе в Бостоні."],["Do you like pizza?","Ти любиш піцу?"]],
mistake:["He work every day.","He works every day.","З he/she/it додаємо -s."],
tip:"Згадай «-s для третьої особи»: he/she/it = s-s-s, як змійка.",
q:[{q:"She ___ (live) in London.",o:["live","lives","living"],a:1},{q:"___ he speak English?",o:["Do","Does","Is"],a:1}]},
{lv:"A1",e:"🏃",t:"Present Continuous: що відбувається зараз",
simple:"Для того, що відбувається <b>прямо зараз</b>, — <b>am / is / are + дієслово з -ing</b>.",
rules:`<ul><li>I <b>am working</b>. She <b>is reading</b>. They <b>are playing</b>.</li><li>Питання: <b>Are</b> you listening? Заперечення: He <b>isn't</b> sleeping.</li><li>Слова-підказки: now, right now, at the moment, look!</li><li>Правопис: make → making, swim → swimming, lie → lying.</li></ul>`,
ex:[["I'm cooking dinner now.","Я зараз готую вечерю."],["Look! It's raining.","Дивись! Іде дощ."],["What are you doing?","Що ти робиш?"]],
mistake:["I cooking now.","I'm cooking now.","Без am не можна."],
tip:"Порівняй: I work every day (завжди) — I'm working now (зараз).",
q:[{q:"She ___ TV now.",o:["watches","is watching"],a:1},{q:"They ___ every Sunday.",o:["play","are playing"],a:0}]},
{lv:"A1",e:"💪",t:"Can, must, should: модальні дієслова",
simple:"Ці слова кажуть, <b>можеш, мусиш чи варто</b>. Після них — дієслово в простій формі, без to і без -s.",
rules:`<ul><li><b>can</b> — можу, вмію: I can swim. Can you help me?</li><li><b>can't</b> — не можу: I can't come.</li><li><b>must</b> — мушу (сильно): You must stop at a red light.</li><li><b>have to</b> — мушу (обставини): I have to work tomorrow.</li><li><b>should</b> — варто, слід (порада): You should see a doctor.</li><li>Без -s: she can<b>s</b> ✗ → she can ✓</li></ul>`,
ex:[["I can speak a little English.","Я трохи говорю англійською."],["You should drink more water.","Тобі варто пити більше води."],["We have to leave now.","Нам треба йти зараз."]],
mistake:["She cans swim.","She can swim.","Після модального дієслова без -s і без to."],
tip:"Can I...? — найввічливіший спосіб попросити: Can I have the check, please?",
q:[{q:"He ___ play the guitar.",o:["can","cans","can to"],a:0},{q:"You ___ see a doctor. (порада)",o:["should","can"],a:0}]},
{lv:"A1",e:"⏪",t:"Past Simple: минулий час",
simple:"Для того, що сталося й закінчилося в минулому (yesterday, last week, in 2020), — Past Simple. Правильні дієслова: <b>+ed</b>.",
rules:`<ul><li>work → work<b>ed</b>, play → play<b>ed</b>, live → live<b>d</b>, study → stud<b>ied</b></li><li>Неправильні треба вчити: go → <b>went</b>, see → <b>saw</b>, have → <b>had</b> (таблиця в темі A2).</li><li>Питання: <b>Did</b> you work? Заперечення: I <b>didn't</b> work.</li><li>Після did / didn't — проста форма: Did you <b>go</b>? (не went)</li></ul>`,
ex:[["I worked yesterday.","Я вчора працював."],["We went to the beach.","Ми їздили на пляж."],["Did you see the movie?","Ти бачив фільм?"]],
mistake:["Did you went?","Did you go?","Після did — проста форма."],
tip:"was / were — минулий від to be: I was tired, they were at home.",
q:[{q:"Yesterday I ___ (watch) TV.",o:["watch","watched"],a:1},{q:"___ you call her?",o:["Did","Do","Were"],a:0}]},
{lv:"A1",e:"🏠",t:"Мій, твій, його: присвійні слова",
simple:"Ці слова кажуть, <b>чиє</b> щось. Вони не змінюються за родом і числом: my = мій, моя, моє, мої.",
rules:`<table class="gt"><tr><th>Хто</th><th>Чий</th></tr><tr><td>I</td><td>my</td></tr><tr><td>you</td><td>your</td></tr><tr><td>he</td><td>his</td></tr><tr><td>she</td><td>her</td></tr><tr><td>it</td><td>its</td></tr><tr><td>we</td><td>our</td></tr><tr><td>they</td><td>their</td></tr></table><ul><li><b>'s</b> для людей: Anna<b>'s</b> car — машина Анни.</li></ul>`,
ex:[["My mother lives in Kyiv.","Моя мама живе в Києві."],["Is this your jacket?","Це твоя куртка?"],["That's Tom's phone.","Це телефон Тома."]],
mistake:["Anna and his husband","Anna and her husband","Про жінку — her (її), про чоловіка — his."],
tip:"its (його, про річ) пишеться без апострофа. it's = it is.",
q:[{q:"Mark and ___ wife (його)",o:["his","her"],a:0},{q:"This is ___ house. (наш)",o:["our","us"],a:0}]},
{lv:"A1",e:"🌈",t:"Прикметник завжди перед іменником",
simple:"Прикметник в англійській <b>не змінюється</b> (ні за родом, ні за числом) і стоїть <b>перед</b> іменником.",
rules:`<ul><li>a <b>big</b> house, <b>big</b> houses — без змін</li><li>Порядок кількох: думка → розмір → вік → колір: a <b>nice big old red</b> car</li><li>Після to be — окремо: The house is big.</li></ul>`,
ex:[["a small apartment","маленька квартира"],["green apples","зелені яблука"],["The coffee is hot.","Кава гаряча."]],
mistake:["a car red","a red car","Прикметник перед іменником."],
tip:"Ніколи не додавай -s до прикметника: big<b>s</b> houses ✗.",
q:[{q:"Як правильно?",o:["a house beautiful","a beautiful house"],a:1}]},
{lv:"A1",e:"🕐",t:"Котра година",
simple:"Американці найчастіше кажуть час просто цифрами: <b>2:30 = two thirty</b>. Але треба розуміти й «past / to».",
rules:`<ul><li>3:00 — three o'clock</li><li>3:15 — three fifteen / a quarter past three</li><li>3:30 — three thirty / half past three</li><li>3:45 — three forty-five / a quarter to four</li><li>a.m. — до полудня, p.m. — після полудня: 8 a.m., 8 p.m.</li></ul>`,
ex:[["What time is it?","Котра година?"],["It's half past seven.","Пів на восьму (7:30)."],["The meeting is at nine a.m.","Нарада о дев'ятій ранку."]],
mistake:["half three = 2:30","half past three = 3:30","В англійській half past рахується ПІСЛЯ години."],
tip:"У США використовують 12-годинний формат: 15:00 = 3 p.m.",
q:[{q:"half past six = ?",o:["6:30","5:30"],a:0},{q:"a quarter to two = ?",o:["1:45","2:15"],a:0}]},
{lv:"A2",e:"✨",t:"Present Perfect: досвід і результат",
simple:"<b>have / has + третя форма дієслова</b>. Використовують, коли важливий <b>результат зараз</b> або <b>досвід у житті</b>, а не точний час.",
rules:`<ul><li>I <b>have been</b> to London. — Я бував у Лондоні (досвід).</li><li>She <b>has lost</b> her keys. — Вона загубила ключі (і їх досі немає).</li><li>Слова-підказки: ever, never, already, yet, just, since, for.</li><li>Питання: <b>Have</b> you ever been to Paris?</li><li>З точним часом (yesterday, in 2020) — Past Simple, не Present Perfect!</li></ul>`,
ex:[["I have never seen snow.","Я ніколи не бачив снігу."],["Have you finished your homework?","Ти закінчив домашнє завдання?"],["We have lived here for two years.","Ми живемо тут два роки."]],
mistake:["I have seen him yesterday.","I saw him yesterday.","З yesterday — Past Simple."],
tip:"for — тривалість (for 2 years), since — початок (since 2020).",
q:[{q:"She ___ already eaten.",o:["has","have"],a:0},{q:"I ___ to Rome in 2019.",o:["have been","went"],a:1}]},
{lv:"A2",e:"🔮",t:"Майбутнє: will і going to",
simple:"<b>going to</b> — план, який ти вже вирішив. <b>will</b> — рішення зараз, обіцянка або прогноз.",
rules:`<ul><li>I'm <b>going to</b> visit my parents next week. (план)</li><li>The phone is ringing. — I'<b>ll</b> get it! (рішення зараз)</li><li>I <b>will</b> help you. (обіцянка)</li><li>It <b>will</b> rain tomorrow. (прогноз)</li><li>Present Continuous для домовленостей: I'm meeting Tom at six.</li></ul>`,
ex:[["We're going to move next year.","Ми наступного року переїжджаємо."],["I'll call you later.","Я подзвоню тобі пізніше."],["Will you help me?","Ти мені допоможеш?"]],
mistake:["I will to go.","I will go.","Після will — без to."],
tip:"У розмові going to часто звучить як «gonna»: I'm gonna eat.",
q:[{q:"Look at the clouds! It ___ rain.",o:["is going to","going"],a:0},{q:"I ___ help you, I promise.",o:["will","am going"],a:0}]},
{lv:"A2",e:"🔗",t:"Сполучники і складні речення",
simple:"Щоб говорити довшими реченнями, з'єднуй їх словами <b>and, but, because, so, when, if</b>. Порядок слів у кожній частині звичайний.",
rules:`<ul><li><b>and</b> — і; <b>but</b> — але; <b>or</b> — або</li><li><b>because</b> — тому що: I'm staying home because I'm sick.</li><li><b>so</b> — тож: It's raining, so I'll take the bus.</li><li><b>when</b> — коли; <b>if</b> — якщо: If it rains, I'll take a taxi.</li><li>Після if і when про майбутнє — теперішній час: If it <b>rains</b> (не will rain).</li></ul>`,
ex:[["I'm learning English because I want a better job.","Я вчу англійську, бо хочу кращу роботу."],["If you have time, call me.","Якщо будеш мати час, подзвони."],["I was tired, so I went to bed.","Я втомився, тож пішов спати."]],
mistake:["If it will rain, I stay home.","If it rains, I'll stay home.","Після if — теперішній час."],
tip:"because відповідає на «чому?», so — на «що тому сталося?».",
q:[{q:"If he ___, we'll start.",o:["comes","will come"],a:0},{q:"I'm hungry, ___ I'll eat.",o:["so","because"],a:0}]},
{lv:"A2",e:"📊",t:"Порівняння: bigger, the biggest",
simple:"Коротке слово: <b>+er</b> (більший), <b>the + est</b> (найбільший). Довге слово: <b>more</b> / <b>the most</b>. Порівнюємо словом <b>than</b> (ніж).",
rules:`<ul><li>small → small<b>er</b> → the small<b>est</b></li><li>big → bi<b>gg</b>er (подвоєння), happy → happ<b>ier</b></li><li>beautiful → <b>more</b> beautiful → <b>the most</b> beautiful</li><li>Неправильні: good → <b>better</b> → the <b>best</b>; bad → <b>worse</b> → the <b>worst</b>; far → farther</li></ul>`,
ex:[["New York is bigger than Boston.","Нью-Йорк більший за Бостон."],["This is the best restaurant in town.","Це найкращий ресторан у місті."],["English is easier than Chinese.","Англійська легша за китайську."]],
mistake:["more big","bigger","Коротке слово — через -er."],
tip:"as … as — однаково: She is as tall as her mother.",
q:[{q:"good → ?",o:["gooder","better"],a:1},{q:"This book is ___ than that one. (interesting)",o:["interestinger","more interesting"],a:1}]},
{lv:"A2",e:"📢",t:"Наказовий спосіб і ввічливі прохання",
simple:"Наказ — просто дієслово на початку: <b>Sit down!</b> Але в англійській це звучить різко. Ввічливо — через <b>please</b>, <b>Can you…?</b>, <b>Could you…?</b>",
rules:`<ul><li>Наказ: Open the door. Don't touch!</li><li>Ввічливіше: Open the door, <b>please</b>.</li><li>Ще ввічливіше: <b>Can you</b> open the door? / <b>Could you</b> open the door, please?</li><li>Пропозиція: <b>Let's</b> go! — Ходімо!</li></ul>`,
ex:[["Come in!","Заходь!"],["Could you help me, please?","Не могли б ви мені допомогти?"],["Let's take a break.","Давайте зробимо перерву."]],
mistake:["Give me water!","Could I have some water, please?","У кафе наказова форма звучить грубо."],
tip:"Американці кажуть please і thank you набагато частіше, ніж українці.",
q:[{q:"Найввічливіше:",o:["Help me!","Could you help me, please?"],a:1}]}
];
