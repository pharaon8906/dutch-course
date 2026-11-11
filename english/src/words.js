const RAW = {
"Привітання і фрази": `hello|привіт
hi|привіт (розмовне)
good morning|доброго ранку
good afternoon|добрий день
good evening|добрий вечір
good night|на добраніч
goodbye|до побачення
bye|бувай
see you later|до зустрічі
see you tomorrow|до завтра
please|будь ласка
thank you|дякую
thanks|дякую (розмовне)
you're welcome|нема за що
sorry|вибачте
excuse me|перепрошую|Щоб привернути увагу або пройти
yes|так
no|ні
of course|звичайно
okay|гаразд
how are you?|як справи?
I'm fine|у мене все добре
I don't understand|я не розумію
can you repeat that?|можете повторити?
do you speak Ukrainian?|ви говорите українською?
welcome|ласкаво просимо
good luck!|успіху!
enjoy your meal|смачного
bless you|будь здоров (коли чхнули)
cheers|будьмо! / дякую (брит.)`,
"Числа": `zero|нуль
one|один
two|два
three|три
four|чотири
five|п'ять
six|шість
seven|сім
eight|вісім
nine|дев'ять
ten|десять
eleven|одинадцять
twelve|дванадцять
thirteen|тринадцять|-teen: 13–19. Наголос у кінці: thir-TEEN
twenty|двадцять|-ty: 20, 30… Наголос на початку: TWEN-ty
twenty-one|двадцять один
thirty|тридцять
forty|сорок|Пишеться без u: forty, не fourty
fifty|п'ятдесят
a hundred|сто
a thousand|тисяча
half|половина
first|перший
second|другий
third|третій`,
"Час і дні": `a day|день
a week|тиждень
a month|місяць
a year|рік
an hour|година|h німа, тому an
a minute|хвилина
today|сьогодні
tomorrow|завтра
yesterday|вчора
now|зараз
soon|скоро
later|пізніше
early|рано
late|пізно
always|завжди
often|часто
sometimes|іноді
never|ніколи
Monday|понеділок|Дні тижня завжди з великої літери
Tuesday|вівторок
Wednesday|середа|Читається «венздей», d німа
Thursday|четвер
Friday|п'ятниця
Saturday|субота
Sunday|неділя
the weekend|вихідні
the morning|ранок
the afternoon|день (після обіду)
the evening|вечір
the night|ніч
January|січень
February|лютий
March|березень
April|квітень
May|травень
June|червень
July|липень
August|серпень
September|вересень
October|жовтень
November|листопад
December|грудень
spring|весна
summer|літо
fall|осінь|Американське слово. У Британії — autumn
winter|зима
what time is it?|котра година?
half past two|пів на третю (2:30)|Англійці кажуть «пів після двох»`,
"Сім'я та люди": `a family|родина
parents|батьки
a father|батько
a mother|мати
a child|дитина
children|діти|Неправильна множина: child → children
a son|син
a daughter|донька
a brother|брат
a sister|сестра
a grandfather|дідусь
a grandmother|бабуся
a man|чоловік
a woman|жінка|Множина: women («вімін»)
a husband|чоловік (у шлюбі)
a wife|дружина
a boy|хлопчик
a girl|дівчинка
a baby|немовля
a friend|друг
a neighbor|сусід|Брит.: neighbour
a colleague|колега
people|люди
married|одружений
a name|ім'я
a last name|прізвище
age|вік
a teenager|підліток`,
"Їжа": `food|їжа
breakfast|сніданок
lunch|обід
dinner|вечеря
bread|хліб
butter|масло
cheese|сир
an egg|яйце
milk|молоко
meat|м'ясо
chicken|курка
fish|риба
vegetables|овочі
a potato|картоплина
a tomato|помідор
an onion|цибулина
a carrot|морква
an apple|яблуко
a banana|банан
an orange|апельсин
a strawberry|полуниця
rice|рис
soup|суп
sugar|цукор
salt|сіль
a cake|торт
a cookie|печиво|Брит.: biscuit
a sandwich|сендвіч, бутерброд
pizza|піца
a hamburger|гамбургер
French fries|картопля фрі
pasta|паста, макарони
peanut butter|арахісова паста`,
"Напої": `water|вода
coffee|кава
tea|чай
juice|сік
beer|пиво
wine|вино
soda|газована вода
a glass|склянка
a cup|чашка
a bottle|пляшка
I'm hungry|я голодний
I'm thirsty|я хочу пити`,
"Кафе і магазин": `a restaurant|ресторан
a café|кафе
the menu|меню
the check|рахунок|Брит.: the bill
a waiter|офіціант
to order|замовляти
to pay|платити
by card|карткою
in cash|готівкою
a store|магазин|Брит.: shop
a supermarket|супермаркет
a market|ринок
a bakery|пекарня
a pharmacy|аптека
a price|ціна
expensive|дорогий
cheap|дешевий
a discount|знижка
on sale|зі знижкою, на розпродажі
money|гроші
a receipt|чек|p німа: «ресіт»
a bag|пакет, сумка
to buy|купувати
to sell|продавати
how much is it?|скільки коштує?
I'd like...|я б хотів...|Найввічливіший спосіб замовити
can I have...?|можна мені...?
the checkout|каса
open|відчинено
closed|зачинено`,
"Дім": `a house|будинок
an apartment|квартира|Брит.: flat
a room|кімната
a kitchen|кухня
a bathroom|ванна кімната
a bedroom|спальня
a living room|вітальня
a toilet|туалет
a garden|сад
a balcony|балкон
a door|двері
a window|вікно
a wall|стіна
a floor|підлога; поверх
the stairs|сходи
a table|стіл
a chair|стілець
a sofa|диван
a bed|ліжко
a closet|шафа (вбудована)|Брит.: wardrobe
a lamp|лампа
a mirror|дзеркало
a shower|душ
a fridge|холодильник
an oven|духовка
a plate|тарілка
a knife|ніж|k німа: «найф»
a fork|виделка
a spoon|ложка
a key|ключ
the rent|оренда, квартплата`,
"Місто і транспорт": `a city|місто
a village|село
a street|вулиця
a road|дорога
a square|площа
a bridge|міст
a river|річка
downtown|центр міста|Американське слово
a station|вокзал, станція
a train|потяг
a bus|автобус
the subway|метро|Брит.: the underground / the tube
a bike|велосипед
a car|автомобіль
a taxi|таксі
a plane|літак
an airport|аеропорт
a bus stop|автобусна зупинка
a ticket|квиток
the entrance|вхід
the exit|вихід
left|ліворуч
right|праворуч
straight ahead|прямо
the corner|ріг (вулиці)
near|близько
far|далеко
a hospital|лікарня
a school|школа
a church|церква
a museum|музей
a library|бібліотека
city hall|мерія`,
"Тіло і здоров'я": `the body|тіло
the head|голова
hair|волосся
an eye|око
an ear|вухо
the nose|ніс
the mouth|рот
a tooth|зуб|Множина: teeth
the back|спина
an arm|рука (від плеча)
a hand|кисть руки
a finger|палець
the stomach|живіт, шлунок|ch = «к»: «стамек»
a leg|нога
a foot|стопа|Множина: feet
the heart|серце
a doctor|лікар
medicine|ліки
pain|біль
sick|хворий
healthy|здоровий
tired|втомлений
a fever|температура (жар)
a cold|застуда
a headache|головний біль
an appointment|запис, зустріч
a dentist|стоматолог`,
"Одяг і кольори": `clothes|одяг|Читається майже як «клоуз»
pants|штани|Брит.: trousers
a T-shirt|футболка
a sweater|светр
a jacket|куртка
a dress|сукня
a skirt|спідниця
shoes|взуття, черевики
socks|шкарпетки
a hat|капелюх, шапка
a scarf|шарф
glasses|окуляри
an umbrella|парасолька
a size|розмір
to try on|приміряти
a color|колір|Брит.: colour
red|червоний
orange|помаранчевий
yellow|жовтий
green|зелений
blue|синій
pink|рожевий
brown|коричневий
black|чорний
white|білий
gray|сірий|Брит.: grey`,
"Погода": `the weather|погода
the sun|сонце
rain|дощ
wind|вітер
snow|сніг
a cloud|хмара
it's raining|іде дощ
it's windy|вітряно
warm|теплий
hot|спекотний
cold|холодний
nice weather|гарна погода
wet|мокрий
dry|сухий
a degree|градус`,
"Робота і навчання": `work|робота
to work|працювати
a job|робота, посада
an office|офіс
a boss|начальник
a salary|зарплата
a meeting|нарада
a teacher|вчитель
a student|студент
a lesson|урок
a course|курс
a language|мова
a word|слово
a sentence|речення
a book|книга
a pen|ручка
a computer|комп'ютер
a phone|телефон
to learn|вчити, вчитися
to study|навчатися
to read|читати
to write|писати|w німа: «райт»
homework|домашнє завдання
an exam|іспит
a form|бланк, анкета
a vacation|відпустка|Брит.: holiday
free|вільний; безкоштовний
busy|зайнятий|Читається «бізі»`,
"Хобі і дозвілля": `a hobby|хобі
to play sports|займатися спортом
to swim|плавати
to ride a bike|їздити на велосипеді
to walk|гуляти, ходити
to cook|готувати їжу
to dance|танцювати
to sing|співати
music|музика
a movie|фільм|Брит.: film
a game|гра
free time|вільний час
a party|вечірка
a birthday|день народження
a present|подарунок
to go out|ходити розважатися
to travel|подорожувати`,
"Дієслова": `to be|бути|I am, you are, he is
to have|мати|I have, he has
to go|йти, їхати
to come|приходити
to do|робити
to make|робити, виготовляти|make a cake, make a mistake
to say|казати
to speak|говорити (мовою)
to talk|розмовляти
to ask|питати
to answer|відповідати
to know|знати|k німа
to think|думати
to see|бачити
to look|дивитися
to watch|дивитися (телевізор, фільм)
to hear|чути
to listen|слухати|t німа: «лісн»
to eat|їсти
to drink|пити
to sleep|спати
to live|жити
to wait|чекати
to look for|шукати
to find|знаходити
to give|давати
to take|брати
to bring|приносити
to get|отримувати; ставати; діставатися|Найуніверсальніше дієслово
to start|починати
to stop|зупиняти(ся)
to help|допомагати
to call|дзвонити
to send|надсилати
to stand|стояти
to sit|сидіти
to lie|лежати
to run|бігти
to drive|їхати (за кермом)
to stay|залишатися
to become|ставати
can|могти, вміти
to want|хотіти
must|мусити
to like|подобатися
to love|любити
to wash|мити, прати
to get up|вставати
to clean|прибирати
to forget|забувати
to remember|пам'ятати
to try|пробувати
to use|використовувати
to understand|розуміти
to mean|означати
to open|відкривати
to close|закривати
to need|потребувати
to feel|відчувати
to put|класти`,
"Прикметники": `big|великий
small|маленький
long|довгий
short|короткий; низький (людина)
tall|високий (людина)
new|новий
old|старий
young|молодий
beautiful|гарний
ugly|негарний
good|добрий
bad|поганий
nice|приємний, гарний
boring|нудний
easy|легкий (простий)
difficult|важкий (складний)
fast|швидкий
slow|повільний
happy|щасливий
sad|сумний
angry|злий, сердитий
afraid|наляканий|I'm afraid of dogs = я боюся собак
kind|добрий, привітний
friendly|дружній
cozy|затишний|Брит.: cosy
delicious|смачний
full|повний; ситий
empty|порожній
clean|чистий
dirty|брудний
high|високий (предмет)
heavy|важкий (вагою)
light|легкий; світлий
strong|сильний
weak|слабкий
important|важливий
ready|готовий
quiet|тихий
sure|впевнений
great|чудовий
strange|дивний
smart|розумний
funny|смішний
cute|милий`,
"Питання і зв'язки": `who|хто
what|що
where|де
when|коли
why|чому
how|як
how much / how many|скільки|much — не можна полічити, many — можна
which|який (з)
and|і
or|або
but|але
because|тому що
so|тож, отже; так
if|якщо
then|тоді
also|також
too|теж; занадто
still|ще, досі
already|вже
very|дуже
a lot|багато
little|мало; маленький
more|більше
less|менше
only|лише
alone|сам, один
together|разом
maybe|можливо
not|не
no (no money)|жодного, немає|I have no money = у мене немає грошей`,
"Прийменники": `in|в
on|на
under|під
next to|поруч
behind|позаду
in front of|перед
between|між
at|в, біля (точка)|at home, at work, at the station
with|з
without|без
to|до (напрямок)
from|з, від
out of|з (зсередини)
through|через
about|про
against|проти
after|після
before|перед, до (час)`,
"Займенники": `I|я|Завжди з великої літери!
you|ти; ви
he|він
she|вона
it|воно (про речі, тварин)
we|ми
they|вони
my|мій
your|твій, ваш
his|його
her|її
our|наш
their|їхній
me|мене, мені
him|його, йому
us|нас
them|їх`,
"Подорожі": `a trip|подорож, поїздка
a hotel|готель
a suitcase|валіза
a passport|паспорт
a country|країна
the United States|Сполучені Штати
England|Англія
Ukraine|Україна
English|англійська мова
the sea|море
a beach|пляж
a forest|ліс
a lake|озеро
a mountain|гора
a map|мапа
to book|бронювати`
};
