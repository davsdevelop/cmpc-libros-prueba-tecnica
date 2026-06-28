export const prismaMock = {
  book: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn((callback) => callback(prismaMock)),
  author: { upsert: jest.fn() },
  editorial: { upsert: jest.fn() },
  genre: { upsert: jest.fn() },
}