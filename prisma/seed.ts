import { PrismaClient, ProductKind, AttributeType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ── Пользователь (под будущий auth) ──────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@store.local' },
    update: {},
    create: {
      email: 'admin@store.local',
      name: 'Admin',
      password: 'changeme', // TODO: заменить на bcrypt-хеш вместе с задачей auth
    },
  });

  // ── Бренд ────────────────────────────────────────────────
  const remeza = await prisma.brand.upsert({
    where: { slug: 'remeza' },
    update: {},
    create: { name: 'Ремеза', slug: 'remeza' },
  });

  // ── Категории (дерево) ───────────────────────────────────
  const parts = await prisma.category.upsert({
    where: { slug: 'zapchasti' },
    update: {},
    create: { name: 'Запчасти', slug: 'zapchasti', position: 1 },
  });
  const filters = await prisma.category.upsert({
    where: { slug: 'filtry' },
    update: {},
    create: {
      name: 'Фильтры',
      slug: 'filtry',
      parentId: parts.id,
      position: 1,
    },
  });
  const consumables = await prisma.category.upsert({
    where: { slug: 'raskhodniki' },
    update: {},
    create: {
      name: 'Расходники',
      slug: 'raskhodniki',
      parentId: parts.id,
      position: 2,
    },
  });
  const compressorsCat = await prisma.category.upsert({
    where: { slug: 'kompressory' },
    update: {},
    create: { name: 'Компрессоры', slug: 'kompressory', position: 2 },
  });

  // ── Атрибуты (справочник) ────────────────────────────────
  const pressure = await prisma.attribute.upsert({
    where: { code: 'pressure_bar' },
    update: {},
    create: {
      code: 'pressure_bar',
      name: 'Давление',
      type: AttributeType.NUMBER,
      unit: 'бар',
    },
  });
  const power = await prisma.attribute.upsert({
    where: { code: 'power_kw' },
    update: {},
    create: {
      code: 'power_kw',
      name: 'Мощность',
      type: AttributeType.NUMBER,
      unit: 'кВт',
    },
  });
  const thread = await prisma.attribute.upsert({
    where: { code: 'thread' },
    update: {},
    create: { code: 'thread', name: 'Резьба', type: AttributeType.OPTION },
  });
  const threadG12 = await prisma.attributeOption.upsert({
    where: { attributeId_value: { attributeId: thread.id, value: 'G1/2' } },
    update: {},
    create: { attributeId: thread.id, value: 'G1/2', position: 1 },
  });
  await prisma.attributeOption.upsert({
    where: { attributeId_value: { attributeId: thread.id, value: 'G3/4' } },
    update: {},
    create: { attributeId: thread.id, value: 'G3/4', position: 2 },
  });

  // Шаблоны атрибутов на категории (для форм/фасетного фильтра)
  for (const [categoryId, attributeId, required] of [
    [filters.id, thread.id, true],
    [filters.id, pressure.id, false],
    [compressorsCat.id, power.id, true],
    [compressorsCat.id, pressure.id, true],
  ] as const) {
    await prisma.categoryAttribute.upsert({
      where: { categoryId_attributeId: { categoryId, attributeId } },
      update: {},
      create: { categoryId, attributeId, required },
    });
  }

  // ── Модель компрессора (цель совместимости) с атрибутами ─
  const modelVk10 = await prisma.compressorModel.upsert({
    where: { brandId_name: { brandId: remeza.id, name: 'ВК10' } },
    update: {},
    create: { name: 'ВК10', slug: 'remeza-vk10', brandId: remeza.id },
  });
  for (const [attributeId, valueNumber] of [
    [power.id, 7.5],
    [pressure.id, 10],
  ] as const) {
    await prisma.compressorModelAttributeValue.upsert({
      where: {
        compressorModelId_attributeId: {
          compressorModelId: modelVk10.id,
          attributeId,
        },
      },
      update: {},
      create: { compressorModelId: modelVk10.id, attributeId, valueNumber },
    });
  }

  // ── Компрессор-товар, связанный с моделью ───────────────
  const compressorProduct = await prisma.product.upsert({
    where: { slug: 'kompressor-remeza-vk10' },
    update: {},
    create: {
      kind: ProductKind.COMPRESSOR,
      name: 'Винтовой компрессор Ремеза ВК10',
      slug: 'kompressor-remeza-vk10',
      description: 'Винтовой компрессор 7.5 кВт, 10 бар.',
      brandId: remeza.id,
      primaryCategoryId: compressorsCat.id,
      compressorModelId: modelVk10.id,
      published: true,
      categories: { create: [{ categoryId: compressorsCat.id }] },
      variants: {
        create: [
          { sku: 'REMEZA-VK10', price: 350000, stock: 3, isDefault: true },
        ],
      },
      attributeValues: {
        create: [
          { attributeId: power.id, valueNumber: 7.5 },
          { attributeId: pressure.id, valueNumber: 10 },
        ],
      },
    },
  });

  // ── Запчасть: категории, вариант, кросс-номера, атрибуты, совместимость ─
  const filterPart = await prisma.product.upsert({
    where: { slug: 'vozdushnyy-filtr-vf200' },
    update: {},
    create: {
      kind: ProductKind.PART,
      name: 'Воздушный фильтр VF-200',
      slug: 'vozdushnyy-filtr-vf200',
      description: 'Воздушный фильтр для винтовых компрессоров, резьба G1/2.',
      brandId: remeza.id,
      primaryCategoryId: filters.id,
      published: true,
      categories: {
        create: [{ categoryId: filters.id }, { categoryId: consumables.id }],
      },
      variants: {
        create: [
          {
            sku: 'VF-200',
            price: 1290,
            stock: 42,
            isDefault: true,
            crossNumbers: {
              create: [
                { number: '4930153100', source: 'OEM Remeza' },
                { number: 'P-CE03-538', source: 'аналог' },
              ],
            },
          },
        ],
      },
      attributeValues: {
        create: [
          { attributeId: thread.id, optionId: threadG12.id },
          { attributeId: pressure.id, valueNumber: 16 },
        ],
      },
      compatibility: {
        create: [{ compressorModelId: modelVk10.id, note: 'Штатный фильтр' }],
      },
    },
  });

  console.log({
    admin: admin.email,
    brand: remeza.name,
    categories: [
      parts.slug,
      filters.slug,
      consumables.slug,
      compressorsCat.slug,
    ],
    compressorModel: modelVk10.name,
    products: [compressorProduct.slug, filterPart.slug],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
