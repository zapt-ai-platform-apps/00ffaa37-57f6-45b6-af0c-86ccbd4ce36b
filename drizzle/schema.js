import { pgTable, uuid, text, integer, numeric, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

export const apps = pgTable('apps', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  userCount: integer('user_count').default(0),
  revenue: numeric('revenue', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  userId: uuid('user_id').notNull(),
  strategy: text('strategy'),
  actions: jsonb('actions').default([]),
  domain: text('domain'),
  isPublic: boolean('is_public').default(false)
});

export const actions = pgTable('actions', {
  id: uuid('id').primaryKey().defaultRandom(),
  appId: uuid('app_id').notNull(),
  text: text('text').notNull(),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at')
});