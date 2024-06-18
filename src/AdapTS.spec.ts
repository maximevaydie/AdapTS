import AdapTS, {
  getObjectValueFromPath,
  getFirstValueRetrievedFromPathInsideObject,
} from './AdapTS'

describe('getObjectValueFromPath', () => {
  it('should return the value at the given path', () => {
    const data = {
      a: {
        b: {
          c: 'd',
        },
      },
    }
    const path = 'a.b.c'
    const expected = 'd'

    const result = getObjectValueFromPath(data, path)

    expect(result).toBe(expected)
  })

  it('should return undefined if the path does not exist', () => {
    const data = {
      a: {
        b: {
          c: 'd',
        },
      },
    }
    const path = 'a.b.e'

    const result = getObjectValueFromPath(data, path)

    expect(result).toBeUndefined()
  })

  it('should return undefined if the path does not exist', () => {
    const data = {
      a: {
        b: {
          c: 'd',
        },
      },
    }
    const path = 'a.b.e'

    const result = getObjectValueFromPath(data, path)

    expect(result).toBeUndefined()
  })
})

// write the test for getFirstValueRetrievedFromPathInsideObject
describe('getFirstValueRetrievedFromPathInsideObject', () => {
  it('should return the first value found at the given paths', () => {
    const data = {
      a: {
        b: {
          c: 'd',
        },
      },
    }
    const paths = ['a.b.c', 'a.b.e']
    const expected = 'd'

    const result = getFirstValueRetrievedFromPathInsideObject(
      data,
      paths
    )

    expect(result).toBe(expected)
  })

  it('should return null if no value is found at the given paths', () => {
    const data = {
      a: {
        b: {
          c: 'd',
        },
      },
    }
    const paths = ['a.b.e', 'a.b.f']

    const result = getFirstValueRetrievedFromPathInsideObject(
      data,
      paths
    )

    expect(result).toBeNull()
  })

  it('should return null if no value is found at the given paths', () => {
    const data = {
      a: {
        b: {
          c: 'd',
        },
      },
    }
    const paths = ['a.b.e', 'a.b.f']

    const result = getFirstValueRetrievedFromPathInsideObject(
      data,
      paths
    )

    expect(result).toBeNull()
  })
})

describe('AdapTS', () => {
  it('should return an object with the adapted values', () => {
    const data = {
      user: {
        name: 'john',
        lastDisconnectionDate: new Date(),
      },
    }
    const schema = {
      firstname: {
        valuePaths: ['user.name', 'firstName'],
        validate: (value: unknown, global: unknown) => true,
        reShape: (value: unknown, global: unknown) =>
          typeof value === 'string' &&
          value.charAt(0).toUpperCase() + value.slice(1),
        default: null,
      },
      notConnectedSince: {
        valuePaths: ['user.lastDisconnectionDate'],
        validate: (value: unknown, global: unknown) => true,
        reShape: (value: unknown, global: unknown) => value,
        default: null,
      },
    }
    const expected = {
      firstname: 'John',
      notConnectedSince: data.user.lastDisconnectionDate,
    }

    const result = AdapTS(data, schema)

    expect(result).toEqual(expected)
  })

  it('should return an object with the adapted values', () => {
    const data = {
      user: {
        name: 'john',
        lastDisconnectionDate: new Date(),
      },
    }
    const schema = {
      firstname: {
        valuePaths: ['user.name', 'firstName'],
        validate: (value: unknown, global: unknown) =>
          typeof value === 'string' &&
          new RegExp(/[^a-zA-Z0-9]/).test(value),
        reShape: (value: unknown, global: unknown) =>
          typeof value === 'string' &&
          value.charAt(0).toUpperCase() + value.slice(1),
        default: null,
      },
      notConnectedSince: {
        valuePaths: ['user.lastDisconnectionDate'],
        validate: (value: unknown, global: unknown) =>
          value instanceof Date &&
          !isNaN(value.getTime()) &&
          value < new Date(),
        reShape: (value: unknown, global: unknown) => value,
        default: null,
      },
    }
    const expected = {
      firstname: 'John',
      notConnectedSince: data.user.lastDisconnectionDate,
    }

    const result = AdapTS(data, schema)

    expect(result).toEqual(expected)
  })
})
