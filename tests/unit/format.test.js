import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatDate, formatMoney, formatAmount, statusLabel } from '../../src/lib/format.js'

// Spec §8 — U7 : formats de la §2 (en-GB)

test('U7 — dates « 19 Aug 2021 », montants « £ 1,800.90 », champs « 1800.90 », statuts « Pending »', () => {
  assert.equal(formatDate('2021-08-19'), '19 Aug 2021')
  assert.equal(formatDate('2021-10-07'), '07 Oct 2021')
  assert.equal(formatDate(''), '')
  assert.equal(formatMoney(1800.9), '£ 1,800.90')
  assert.equal(formatMoney(14002.33), '£ 14,002.33')
  assert.equal(formatMoney(0), '£ 0.00')
  assert.equal(formatAmount(1800.9), '1800.90')
  assert.equal(formatAmount(''), '0.00')
  assert.deepEqual(['draft', 'pending', 'paid'].map(statusLabel), ['Draft', 'Pending', 'Paid'])
})
