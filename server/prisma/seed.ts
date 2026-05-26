import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const guineanAdministrativeDivisions = [
  {
    district: 'Kindia',
    code: 'KD',
    prefectures: [
      { name: 'Kindia', code: 'KD-01', subprefectures: [{ name: 'Kindia', code: 'KD-01-01' }, { name: 'Mamou', code: 'KD-01-02' }] },
      { name: 'Télimélé', code: 'KD-02', subprefectures: [{ name: 'Télimélé', code: 'KD-02-01' }] },
    ],
  },
  {
    district: 'Mamou',
    code: 'MM',
    prefectures: [
      { name: 'Mamou', code: 'MM-01', subprefectures: [{ name: 'Mamou', code: 'MM-01-01' }, { name: 'Tatakuma', code: 'MM-01-02' }] },
      { name: 'Pita', code: 'MM-02', subprefectures: [{ name: 'Pita', code: 'MM-02-01' }] },
      { name: 'Dalaba', code: 'MM-03', subprefectures: [{ name: 'Dalaba', code: 'MM-03-01' }] },
    ],
  },
  {
    district: 'Faranah',
    code: 'FR',
    prefectures: [
      { name: 'Faranah', code: 'FR-01', subprefectures: [{ name: 'Faranah', code: 'FR-01-01' }, { name: 'Kouroussa', code: 'FR-01-02' }] },
      { name: 'Kindia', code: 'FR-02', subprefectures: [{ name: 'Kindia', code: 'FR-02-01' }] },
    ],
  },
  {
    district: 'Kissidougou',
    code: 'KS',
    prefectures: [
      { name: 'Kissidougou', code: 'KS-01', subprefectures: [{ name: 'Kissidougou', code: 'KS-01-01' }, { name: 'Kamara', code: 'KS-01-02' }] },
    ],
  },
  {
    district: 'Guéckédou',
    code: 'GK',
    prefectures: [
      { name: 'Guéckédou', code: 'GK-01', subprefectures: [{ name: 'Guéckédou', code: 'GK-01-01' }, { name: 'Nongoa', code: 'GK-01-02' }] },
    ],
  },
  {
    district: 'Macenta',
    code: 'MC',
    prefectures: [
      { name: 'Macenta', code: 'MC-01', subprefectures: [{ name: 'Macenta', code: 'MC-01-01' }, { name: 'Ganta', code: 'MC-01-02' }] },
    ],
  },
  {
    district: 'N\'Zérékoré',
    code: 'NZ',
    prefectures: [
      { name: 'N\'Zérékoré', code: 'NZ-01', subprefectures: [{ name: 'N\'Zérékoré', code: 'NZ-01-01' }, { name: 'Lola', code: 'NZ-01-02' }] },
      { name: 'Yomou', code: 'NZ-02', subprefectures: [{ name: 'Yomou', code: 'NZ-02-01' }] },
    ],
  },
];

async function main() {
  console.log('Seeding administrative divisions...');

  for (const districtData of guineanAdministrativeDivisions) {
    const district = await prisma.district.upsert({
      where: { code: districtData.code },
      update: {},
      create: {
        name: districtData.district,
        code: districtData.code,
      },
    });

    for (const prefectureData of districtData.prefectures) {
      const prefecture = await prisma.prefecture.upsert({
        where: {
          districtId_code: {
            districtId: district.id,
            code: prefectureData.code,
          },
        },
        update: {},
        create: {
          name: prefectureData.name,
          code: prefectureData.code,
          districtId: district.id,
        },
      });

      for (const subprefectureData of prefectureData.subprefectures) {
        await prisma.subprefecture.upsert({
          where: {
            prefectureId_code: {
              prefectureId: prefecture.id,
              code: subprefectureData.code,
            },
          },
          update: {},
          create: {
            name: subprefectureData.name,
            code: subprefectureData.code,
            prefectureId: prefecture.id,
          },
        });
      }
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

