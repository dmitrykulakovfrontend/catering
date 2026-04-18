import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL || 'file:./prisma/dev.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // Clean existing data for idempotent re-seeding
  await prisma.quoteItem.deleteMany()
  await prisma.quoteService.deleteMany()
  await prisma.quoteSection.deleteMany()
  await prisma.quote.deleteMany()
  await prisma.dish.deleteMany()
  await prisma.dishCategory.deleteMany()
  await prisma.serviceTemplate.deleteMany()

  // ─── Phase 1: Seed Catalog ─────────────────────────────────

  // Categories
  const categories = [
    { name: 'Закуски', order: 0 },
    { name: 'Салаты', order: 1 },
    { name: 'Горячие закуски', order: 2 },
    { name: 'Горячее', order: 3 },
    { name: 'Фруктовые тарелки', order: 4 },
    { name: 'Хлебная корзина', order: 5 },
    { name: 'Welcome', order: 6 },
  ]

  const categoryRecords: Record<string, string> = {}
  for (const cat of categories) {
    const record = await prisma.dishCategory.create({ data: cat })
    categoryRecords[cat.name] = record.id
  }

  // Dishes
  const dishes = [
    // Закуски
    { name: 'Плато итальянских колбас', description: 'Ассорти из колбас: пармская ветчина, салями, сальчичон, хамон. Украшается листьями салата, вялеными томатами и маслинами.', weight: 250, weightUnit: 'г', defaultPrice: 835, image: '/images/plato-italyanskih-kolbas.png', category: 'Закуски' },
    { name: 'Мясное ассорти (без свинины)', description: 'Говядина вяленая, язык, рулет куриный, телятина запеченная, томаты Черри, маслины, оливки, хрен, горчица, зелень.', weight: 350, weightUnit: 'г', defaultPrice: 950, image: '/images/myasnoe-assorti.png', category: 'Закуски' },
    { name: 'Рулетики из баклажан', description: 'Баклажан, творожный сыр, российский сыр, зелень.', weight: 40, weightUnit: 'г', defaultPrice: 75, image: '/images/ruletiki-iz-baklazhan.png', category: 'Закуски' },
    { name: 'Рулетики из ветчины', description: 'В порции 5 шт рулетиков.', weight: 250, weightUnit: 'г', defaultPrice: 300, image: '/images/ruletiki-iz-vetchiny.png', category: 'Закуски' },
    // Салаты
    { name: 'Салат «Цезарь» с курицей', description: 'Салат Айсберг, куриное филе, томаты Черри, гренки, сыр Пармезан.', weight: 250, weightUnit: 'г', defaultPrice: 435, image: '/images/salat-cezar.png', category: 'Салаты' },
    { name: 'Теплый салат с ростбифом и молодым картофелем', description: 'Микс салатных листьев, ростбиф, картофельные дольки, соленые огурчики, томаты Черри, горчичный соус, пармезан. С медово-горчичной заправкой.', weight: 270, weightUnit: 'г', defaultPrice: 550, image: '/images/teplyj-salat-s-rostbifom.png', category: 'Салаты' },
    { name: 'Салат «Оливье»', description: 'Картофель, морковь, огурец свежий, колбаса «Любительская», яйцо, домашний майонез, зелень.', weight: 380, weightUnit: 'г', defaultPrice: 485, image: '/images/salat-olivye.png', category: 'Салаты' },
    // Горячие закуски
    { name: 'Жюльен с курицей и грибами', description: 'Тарталетка песочная, шампиньоны, куриное филе, сливки, сыр, зелень.', weight: 60, weightUnit: 'г', defaultPrice: 210, image: '/images/zhulyen.png', category: 'Горячие закуски' },
    // Горячее
    { name: 'Бефстроганов с пюре из картофеля', description: 'Классический бефстроганов из телячьей вырезки в сливочно-сметанном соусе с шампиньонами. Подается с картофельным пюре и маринованным огурцом.', weight: 360, weightUnit: 'г', defaultPrice: 650, image: '/images/befstroganov.png', category: 'Горячее' },
    { name: 'Свиная корейка на кости', description: 'Свиная корейка, маринованная с пряными специями, запеченная до хрустящей корочки.', weight: 280, weightUnit: 'г', defaultPrice: 650, image: '/images/svinaya-korejka.png', category: 'Горячее' },
    { name: 'Овощи на гриле', description: 'Кабачок, баклажан, болгарский перец, шампиньон.', weight: 200, weightUnit: 'г', defaultPrice: 250, image: '/images/ovoshchi-na-grile.png', category: 'Горячее' },
    { name: 'Картофель с розмарином', description: 'Картофель, запеченный с розмарином.', weight: 200, weightUnit: 'г', defaultPrice: 250, image: '/images/kartofel-s-rozmarinom.png', category: 'Горячее' },
    // Фруктовые тарелки
    { name: 'Фруктовое ассорти', description: 'Апельсин, яблоко, ананас, виноград, киви, мята.', weight: 800, weightUnit: 'г', defaultPrice: 1500, image: '/images/fruktovoe-assorti.png', category: 'Фруктовые тарелки' },
    // Хлебная корзина
    { name: 'Хлебная корзина', description: 'Бородинский, французский багет, пшеничный белый.', weight: 450, weightUnit: 'г', defaultPrice: 400, image: '/images/hlebnaya-korzina.png', category: 'Хлебная корзина' },
    // Welcome
    { name: 'Брускета с индейкой су-вид и пряной оливкой', description: 'Французский багет, творожный сыр, руккола, индейка запеченная.', weight: 50, weightUnit: 'г', defaultPrice: 110, image: '/images/brusketa-s-indejkoj.png', category: 'Welcome' },
    { name: 'Брускета «Капрезе»', description: 'Пшеничный багет, соус Песто, томат, сыр Моцарелла, бальзамик, руккола. Можно подать с сыром тофу.', weight: 60, weightUnit: 'г', defaultPrice: 130, image: '/images/brusketa-kapreze.png', category: 'Welcome' },
    { name: 'Канапе «Сыр-виноград»', description: 'Сыр, красный виноград, кунжут.', weight: 35, weightUnit: 'г', defaultPrice: 85, image: '/images/kanape-syr-vinograd.png', category: 'Welcome' },
    { name: 'Тарталетка с уткой и пряным яблоком', description: '', weight: 45, weightUnit: 'г', defaultPrice: 95, image: '/images/tartaletka-s-utkoj.png', category: 'Welcome' },
    { name: 'Канапе с вялеными томатами', description: 'Моцарелла, томаты Черри, вяленые томаты, базилик.', weight: 30, weightUnit: 'г', defaultPrice: 110, image: '/images/kanape-s-vyalenymi-tomatami.png', category: 'Welcome' },
    { name: 'Канапе «Греческое»', description: 'Томаты Черри, сыр Фета, огурец, болгарский перец, маслина.', weight: 45, weightUnit: 'г', defaultPrice: 120, image: '/images/kanape-grecheskoe.png', category: 'Welcome' },
    { name: 'Лимонад «Мохито»', description: '', weight: 1000, weightUnit: 'мл', defaultPrice: 450, image: '/images/limonad-mohito.png', category: 'Welcome' },
    { name: 'Лимонад «Апельсин»', description: '', weight: 1000, weightUnit: 'мл', defaultPrice: 450, image: '/images/limonad-apelsin.png', category: 'Welcome' },
  ]

  const dishRecords: Record<string, string> = {}
  for (const dish of dishes) {
    const record = await prisma.dish.create({
      data: {
        name: dish.name,
        description: dish.description,
        weight: dish.weight,
        weightUnit: dish.weightUnit,
        defaultPrice: dish.defaultPrice,
        image: dish.image,
        categoryId: categoryRecords[dish.category],
      },
    })
    dishRecords[dish.name] = record.id
  }

  // Service Templates
  const services = [
    { name: 'Доставка и вывоз кейтеринга', defaultPrice: 13500, isPerPerson: false, order: 0 },
    { name: 'Официант', defaultPrice: 7000, isPerPerson: false, order: 1 },
    { name: 'Салфетки бумажные', defaultPrice: 25, isPerPerson: false, order: 2 },
    { name: 'Повар', defaultPrice: 7000, isPerPerson: false, order: 3 },
    { name: 'Банкетная посуда для общих блюд', defaultPrice: 20000, isPerPerson: false, order: 4 },
    { name: 'Сервировка классическая на 1 персону', defaultPrice: 650, isPerPerson: true, order: 5 },
    { name: 'Мытье посуды', defaultPrice: 4500, isPerPerson: false, order: 6 },
    { name: 'Графин для напитков', defaultPrice: 100, isPerPerson: false, order: 7 },
  ]

  const serviceRecords: Record<string, string> = {}
  for (const svc of services) {
    const record = await prisma.serviceTemplate.create({ data: svc })
    serviceRecords[svc.name] = record.id
  }

  console.log('Catalog seeded.')

  // ─── Phase 2: Sample Quote ─────────────────────────────────

  await prisma.quote.create({
    data: {
      slug: 'banket-30-deev',
      eventTitle: 'Банкет на 30 персон',
      eventTime: 'c 11:00 до 22:30',
      persons: 30,
      managerName: 'Владимир Деев',
      managerPhone: '+79991111111',
      sections: {
        create: [
          {
            title: 'Закуски', type: 'banquet', order: 0,
            items: {
              create: [
                { dishId: dishRecords['Плато итальянских колбас'], name: 'Плато итальянских колбас', description: 'Ассорти из колбас: пармская ветчина, салями, сальчичон, хамон. Украшается листьями салата, вялеными томатами и маслинами.', weight: 250, weightUnit: 'г', quantity: 1, pricePerUnit: 835, image: '/images/plato-italyanskih-kolbas.png', order: 0 },
                { dishId: dishRecords['Мясное ассорти (без свинины)'], name: 'Мясное ассорти (без свинины)', description: 'Говядина вяленая, язык, рулет куриный, телятина запеченная, томаты Черри, маслины, оливки, хрен, горчица, зелень.', weight: 350, weightUnit: 'г', quantity: 1, pricePerUnit: 950, image: '/images/myasnoe-assorti.png', order: 1 },
                { dishId: dishRecords['Рулетики из баклажан'], name: 'Рулетики из баклажан', description: 'Баклажан, творожный сыр, российский сыр, зелень.', weight: 40, weightUnit: 'г', quantity: 20, pricePerUnit: 75, image: '/images/ruletiki-iz-baklazhan.png', order: 2 },
                { dishId: dishRecords['Рулетики из ветчины'], name: 'Рулетики из ветчины', description: 'В порции 5 шт рулетиков.', weight: 250, weightUnit: 'г', quantity: 5, pricePerUnit: 300, image: '/images/ruletiki-iz-vetchiny.png', order: 3 },
              ],
            },
          },
          {
            title: 'Салаты', type: 'banquet', order: 1,
            items: {
              create: [
                { dishId: dishRecords['Салат «Цезарь» с курицей'], name: 'Салат «Цезарь» с курицей', description: 'Салат Айсберг, куриное филе, томаты Черри, гренки, сыр Пармезан.', weight: 250, weightUnit: 'г', quantity: 9, pricePerUnit: 435, image: '/images/salat-cezar.png', order: 0 },
                { dishId: dishRecords['Теплый салат с ростбифом и молодым картофелем'], name: 'Теплый салат с ростбифом и молодым картофелем', description: 'Микс салатных листьев, ростбиф, картофельные дольки, соленые огурчики, томаты Черри, горчичный соус, пармезан. С медово-горчичной заправкой.', weight: 270, weightUnit: 'г', quantity: 9, pricePerUnit: 550, image: '/images/teplyj-salat-s-rostbifom.png', order: 1 },
                { dishId: dishRecords['Салат «Оливье»'], name: 'Салат «Оливье»', description: 'Картофель, морковь, огурец свежий, колбаса «Любительская», яйцо, домашний майонез, зелень.', weight: 380, weightUnit: 'г', quantity: 8, pricePerUnit: 485, image: '/images/salat-olivye.png', order: 2 },
              ],
            },
          },
          {
            title: 'Горячие закуски', type: 'banquet', order: 2,
            items: {
              create: [
                { dishId: dishRecords['Жюльен с курицей и грибами'], name: 'Жюльен с курицей и грибами', description: 'Тарталетка песочная, шампиньоны, куриное филе, сливки, сыр, зелень.', weight: 60, weightUnit: 'г', quantity: 30, pricePerUnit: 210, image: '/images/zhulyen.png', order: 0 },
              ],
            },
          },
          {
            title: 'Горячее', type: 'banquet', order: 3,
            items: {
              create: [
                { dishId: dishRecords['Бефстроганов с пюре из картофеля'], name: 'Бефстроганов с пюре из картофеля', description: 'Классический бефстроганов из телячьей вырезки в сливочно-сметанном соусе с шампиньонами. Подается с картофельным пюре и маринованным огурцом.', weight: 360, weightUnit: 'г', quantity: 18, pricePerUnit: 650, image: '/images/befstroganov.png', order: 0 },
                { dishId: dishRecords['Свиная корейка на кости'], name: 'Свиная корейка на кости', description: 'Свиная корейка, маринованная с пряными специями, запеченная до хрустящей корочки.', weight: 280, weightUnit: 'г', quantity: 17, pricePerUnit: 650, image: '/images/svinaya-korejka.png', order: 1 },
                { dishId: dishRecords['Овощи на гриле'], name: 'Овощи на гриле', description: 'Кабачок, баклажан, болгарский перец, шампиньон.', weight: 200, weightUnit: 'г', quantity: 15, pricePerUnit: 250, image: '/images/ovoshchi-na-grile.png', order: 2 },
                { dishId: dishRecords['Картофель с розмарином'], name: 'Картофель с розмарином', description: 'Картофель, запеченный с розмарином.', weight: 200, weightUnit: 'г', quantity: 15, pricePerUnit: 250, image: '/images/kartofel-s-rozmarinom.png', order: 3 },
              ],
            },
          },
          {
            title: 'Фруктовые тарелки', type: 'banquet', order: 4,
            items: {
              create: [
                { dishId: dishRecords['Фруктовое ассорти'], name: 'Фруктовое ассорти', description: 'Апельсин, яблоко, ананас, виноград, киви, мята.', weight: 800, weightUnit: 'г', quantity: 5, pricePerUnit: 1500, image: '/images/fruktovoe-assorti.png', order: 0 },
              ],
            },
          },
          {
            title: 'Хлебная корзина', type: 'banquet', order: 5,
            items: {
              create: [
                { dishId: dishRecords['Хлебная корзина'], name: 'Хлебная корзина', description: 'Бородинский, французский багет, пшеничный белый.', weight: 450, weightUnit: 'г', quantity: 4, pricePerUnit: 400, image: '/images/hlebnaya-korzina.png', order: 0 },
              ],
            },
          },
          {
            title: 'Welcome зона', type: 'welcome', order: 6,
            items: {
              create: [
                { dishId: dishRecords['Брускета с индейкой су-вид и пряной оливкой'], name: 'Брускета с индейкой су-вид и пряной оливкой', description: 'Французский багет, творожный сыр, руккола, индейка запеченная.', weight: 50, weightUnit: 'г', quantity: 10, pricePerUnit: 110, image: '/images/brusketa-s-indejkoj.png', order: 0 },
                { dishId: dishRecords['Брускета «Капрезе»'], name: 'Брускета «Капрезе»', description: 'Пшеничный багет, соус Песто, томат, сыр Моцарелла, бальзамик, руккола. Можно подать с сыром тофу.', weight: 60, weightUnit: 'г', quantity: 10, pricePerUnit: 130, image: '/images/brusketa-kapreze.png', order: 1 },
                { dishId: dishRecords['Канапе «Сыр-виноград»'], name: 'Канапе «Сыр-виноград»', description: 'Сыр, красный виноград, кунжут.', weight: 35, weightUnit: 'г', quantity: 10, pricePerUnit: 85, image: '/images/kanape-syr-vinograd.png', order: 2 },
                { dishId: dishRecords['Тарталетка с уткой и пряным яблоком'], name: 'Тарталетка с уткой и пряным яблоком', description: '', weight: 45, weightUnit: 'г', quantity: 10, pricePerUnit: 95, image: '/images/tartaletka-s-utkoj.png', order: 3 },
                { dishId: dishRecords['Канапе с вялеными томатами'], name: 'Канапе с вялеными томатами', description: 'Моцарелла, томаты Черри, вяленые томаты, базилик.', weight: 30, weightUnit: 'г', quantity: 10, pricePerUnit: 110, image: '/images/kanape-s-vyalenymi-tomatami.png', order: 4 },
                { dishId: dishRecords['Канапе «Греческое»'], name: 'Канапе «Греческое»', description: 'Томаты Черри, сыр Фета, огурец, болгарский перец, маслина.', weight: 45, weightUnit: 'г', quantity: 10, pricePerUnit: 120, image: '/images/kanape-grecheskoe.png', order: 5 },
                { dishId: dishRecords['Лимонад «Мохито»'], name: 'Лимонад «Мохито»', description: '', weight: 1000, weightUnit: 'мл', quantity: 5, pricePerUnit: 450, image: '/images/limonad-mohito.png', order: 6 },
                { dishId: dishRecords['Лимонад «Апельсин»'], name: 'Лимонад «Апельсин»', description: '', weight: 1000, weightUnit: 'мл', quantity: 5, pricePerUnit: 450, image: '/images/limonad-apelsin.png', order: 7 },
              ],
            },
          },
        ],
      },
      services: {
        create: [
          { serviceTemplateId: serviceRecords['Доставка и вывоз кейтеринга'], name: 'Доставка и вывоз кейтеринга', price: 13500, quantity: 1, isPerPerson: false, order: 0 },
          { serviceTemplateId: serviceRecords['Официант'], name: 'Официант', price: 7000, quantity: 1, isPerPerson: false, order: 1 },
          { serviceTemplateId: serviceRecords['Салфетки бумажные'], name: 'Салфетки бумажные', price: 25, quantity: 1, isPerPerson: false, order: 2 },
          { serviceTemplateId: serviceRecords['Повар'], name: 'Повар', price: 7000, quantity: 1, isPerPerson: false, order: 3 },
          { serviceTemplateId: serviceRecords['Банкетная посуда для общих блюд'], name: 'Банкетная посуда для общих блюд', price: 20000, quantity: 1, isPerPerson: false, order: 4 },
          { serviceTemplateId: serviceRecords['Сервировка классическая на 1 персону'], name: 'Сервировка классическая на 1 персону', price: 650, quantity: 1, isPerPerson: true, order: 5 },
          { serviceTemplateId: serviceRecords['Мытье посуды'], name: 'Мытье посуды', price: 4500, quantity: 1, isPerPerson: false, order: 6 },
          { serviceTemplateId: serviceRecords['Графин для напитков'], name: 'Графин для напитков', price: 100, quantity: 1, isPerPerson: false, order: 7 },
        ],
      },
    },
  })

  console.log('Sample quote seeded.')
  console.log('Done!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
