/* eslint-disable unicorn/no-null */
import { test } from 'uvu'
import * as assert from 'uvu/assert'
import { CapabilityParseError } from '../src/modules/errors'
import { storageSemantics } from '../src/modules/semantics'
import { CanType } from '../src/modules/types'

test('should fail with resource as a number', async () => {
  const parsed = storageSemantics.tryParsing({
    with: 1000 as any,
    can: 'upload/*',
  })

  assert.instance(parsed, CapabilityParseError)
  assert.is(parsed.message, '"with" must be a string.')
})

test('should fail with ability as a number', async () => {
  const parsed = storageSemantics.tryParsing({
    with: 'storage://sss',
    can: 122 as any,
  })

  assert.instance(parsed, CapabilityParseError)
  assert.is(parsed.message, '"can" must be a string.')
})

test('should fail with multihash as a number', async () => {
  const parsed = storageSemantics.tryParsing({
    with: 'storage://sss',
    can: 'upload/*',
    mh: 222,
  })

  assert.instance(parsed, CapabilityParseError)
  assert.is(parsed.message, '"mh" must be a string or undefined.')
})

test('should fail with unknown ability', async () => {
  const parsed = storageSemantics.tryParsing({
    with: 'storage://sss',
    can: 'upload/111' as CanType,
    mh: 'sss',
  })

  assert.instance(parsed, CapabilityParseError)
  assert.is(parsed.message, 'Ability upload/111 is not supported.')
})

test('should fail with unknown resource prefix', async () => {
  const parsed = storageSemantics.tryParsing({
    with: 'random://sss',
    can: 'upload/111' as CanType,
  })

  assert.instance(parsed, CapabilityParseError)
  assert.is(parsed.message, 'Ability upload/111 is not supported.')
})

test('should fail with unknown resource prefix', async () => {
  const parsed = storageSemantics.tryParsing({
    with: 'random://sss',
    can: 'upload/111' as CanType,
  })

  assert.instance(parsed, CapabilityParseError)
  assert.is(parsed.message, 'Ability upload/111 is not supported.')
})

test('should parse and return proper representation', async () => {
  const parsed = storageSemantics.tryParsing({
    with: 'storage://sss',
    can: 'upload/IMPORT',
    mh: 'assasd',
  })

  assert.equal(parsed, {
    with: 'storage://sss',
    can: 'upload/IMPORT',
    mh: 'assasd',
  })
})

test.run()