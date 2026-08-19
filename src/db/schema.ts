import { pgTable, uuid, text, integer, numeric, jsonb, boolean, timestamp, bigint } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const tracks = pgTable('tracks', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  bpm: numeric('bpm', { precision: 5, scale: 2 }).notNull(),
  musical_key: text('musical_key').notNull(),
  genre: text('genre').notNull(),
  ai_mood_tags: jsonb('ai_mood_tags').default('[]'),
  instrumentation_tags: jsonb('instrumentation_tags').default('[]'),
  headroom_score: numeric('headroom_score', { precision: 3, scale: 2 }),
  isrc_code: text('isrc_code').unique(),
  iswc_code: text('iswc_code').unique(),
  price_base: numeric('price_base', { precision: 10, scale: 2 }).notNull(),
  preview_url: text('preview_url').notNull(),
  master_stems_url: text('master_stems_url').notNull(),
  waveform_json: jsonb('waveform_json').notNull(),
  is_vault_exclusive: boolean('is_vault_exclusive').default(false),
  release_at: timestamp('release_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  buyer_email: text('buyer_email').notNull(),
  track_id: uuid('track_id').references(() => tracks.id),
  license_type: text('license_type').notNull(),
  custom_parameters_json: jsonb('custom_parameters_json').default('{}'),
  gross_amount: numeric('gross_amount', { precision: 10, scale: 2 }).notNull(),
  net_amount: numeric('net_amount', { precision: 10, scale: 2 }).notNull(),
  tax_amount: numeric('tax_amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').default('USD'),
  transaction_hash: text('transaction_hash').unique().notNull(),
  gateway_reference: text('gateway_reference').notNull(),
  payment_status: text('payment_status').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const licenses = pgTable('licenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  transaction_id: uuid('transaction_id').references(() => transactions.id),
  track_id: uuid('track_id').references(() => tracks.id),
  buyer_email: text('buyer_email').notNull(),
  contract_pdf_url: text('contract_pdf_url').notNull(),
  verification_hash: text('verification_hash').unique().notNull(),
  expires_at: timestamp('expires_at', { withTimezone: true }),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  partner_name: text('partner_name').notNull(),
  client_domain: text('client_domain').notNull(),
  api_key_hash: text('api_key_hash').unique().notNull(),
  rate_limit_tier: integer('rate_limit_tier').default(1000),
  is_active: boolean('is_active').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const fingerprints = pgTable('fingerprints', {
  id: uuid('id').primaryKey().defaultRandom(),
  track_id: uuid('track_id').references(() => tracks.id),
  acoustic_hash: text('acoustic_hash').unique().notNull(),
  registered_at: timestamp('registered_at', { withTimezone: true }).defaultNow(),
});

export const usageScans = pgTable('usage_scans', {
  id: uuid('id').primaryKey().defaultRandom(),
  fingerprint_id: uuid('fingerprint_id').references(() => fingerprints.id),
  platform_detected: text('platform_detected').notNull(),
  stream_count_estimate: bigint('stream_count_estimate', { mode: 'number' }).default(0),
  breach_flag: boolean('breach_flag').default(false),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  admin_action: text('admin_action').notNull(),
  target_table: text('target_table').notNull(),
  target_id: uuid('target_id'),
  payload_snapshot: jsonb('payload_snapshot'),
  ip_address: text('ip_address').notNull(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
