import AdapTS, { AdaptSchemaType } from './AdapTS'

type User = {
  firstName: string
  lastName: string
  age: number
  gender: string
  isSubscribed: boolean
  lastDisconnectionDate: Date
}

type VisualComponentProps = {
  firstname: User['firstName']
  notConnectedSince: User['lastDisconnectionDate']
}

const fromExternalSourceToMyComponentProps: AdaptSchemaType = {
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
    valuePaths: 'user.lastDisconnectionDate',
    validate: (value: unknown, global: unknown) =>
      value instanceof Date &&
      !isNaN(value.getTime()) &&
      value < new Date(),
    reShape: (value: unknown, global: unknown) => value,
    default: null,
  },
}

async function getUserFromApi<T>(): Promise<T> {
  const reponse = await fetch('http://example.com/user.json')
  const user = await reponse.json()

  return AdapTS<T>(user, fromExternalSourceToMyComponentProps)
}

export default await getUserFromApi<VisualComponentProps>()
