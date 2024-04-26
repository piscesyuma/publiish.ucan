import { Capability } from './types'

export class CapabilityEscalationError<S> extends Error {
  parent: S
  child: S

  constructor(msg: string, parent: S, child: S) {
    super(msg)
    this.parent = parent
    this.child = child
  }

  static CODE: string = 'ERROR_CAPABILITY_ESCALATION'
}

export class CapabilityUnrelatedError<S> extends Error {
  parent: S
  child: S

  constructor(parent: S, child: S) {
    super('Capabilities are unrelated.')
    this.parent = parent
    this.child = child
  }

  static CODE = 'ERROR_CAPABILITY_UNRELEATED'
}

export class CapabilityParseError extends Error {
  cap: Capability
  constructor(msg: string, cap: Capability) {
    super(msg)
    this.cap = cap
  }
  static CODE = 'ERROR_CAPABILITY_PARSE'
}
