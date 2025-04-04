import { pgTable, uuid, text, integer, numeric, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

export const apps = pgTable('apps', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  userCount: integer('user_count').default(0),
  revenue: numeric('revenue', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow(),
  userId: uuid('user_id').notNull(),
  actions: jsonb('actions').default([]),
  domain: text('domain'),
  isPublic: boolean('is_public').default(false),
  context: text('context') // Added this field
});

export const actions = pgTable('actions', {
  id: uuid('id').primaryKey().defaultRandom(),
  appId: uuid('app_id').notNull(),
  text: text('text').notNull(),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  completedAt: timestamp('completed_at')
});

export const metricHistory = pgTable('metric_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  appId: uuid('app_id').notNull().references(() => apps.id, { onDelete: 'cascade' }),
  metricType: text('metric_type').notNull(),
  value: numeric('value').notNull(),
  recordedAt: timestamp('recorded_at').defaultNow()
});