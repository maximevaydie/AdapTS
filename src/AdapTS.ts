import { StringDecoder } from 'string_decoder'

export type AdaptSchemaType = {
  [key: string]: {
    valuePaths: string[] | string
    validate: (
      value: unknown,
      initialData: Record<any, any>
    ) => boolean
    reShape: (
      value: unknown,
      initialData: Record<any, any>
    ) => unknown
    default: unknown
  }
}

export const getObjectValueFromPath = (data: any, path: string) =>
  path.split('.').reduce((acc, key) => acc && acc[key], data)

export const getFirstValueRetrievedFromPathInsideObject = (
  data: any,
  paths: string[]
) => {
  for (const path of paths) {
    const value = getObjectValueFromPath(data, path)

    if (value) {
      return value
    }
  }

  return null
}

export const getIsDevMode = () =>
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'test'

export const logWillTryAdapt = (
  data: any,
  schema: AdaptSchemaType
) => {
  if (getIsDevMode()) {
    console.info(
      'AdapTS will try to retrieve ',
      Object.keys(schema).join(', '),
      ' with this data object:',
      data
    )
  }
}

export const logFailedReshapedValue = (key: string, error: any) => {
  if (getIsDevMode()) {
    console.error(
      'AdapTS failed to reshape the value for key',
      key,
      'with this error:',
      error
    )
  }
}

export const logNotValidValue = (key: string, value: any) => {
  if (getIsDevMode()) {
    console.error(
      'AdapTS invalidated the value for key',
      key,
      'Value:',
      value
    )
  }
}

export default function AdapTS<T>(
  data: any,
  schema: AdaptSchemaType
): T | Record<any, any> {
  const result: T | Record<any, any> = {}

  logWillTryAdapt(data, schema)

  for (const key in schema) {
    const {
      valuePaths,
      validate,
      reShape,
      default: defaultValue,
    } = schema[key]

    let value

    if (typeof valuePaths === 'string') {
      value = getObjectValueFromPath(data, valuePaths)
    } else if (Array.isArray(valuePaths)) {
      value = getFirstValueRetrievedFromPathInsideObject(
        data,
        valuePaths
      )
    }

    if (validate(value, data)) {
      let reshapedValue

      try {
        reShape(value, data)
      } catch (error: any) {
        logFailedReshapedValue(key, error)
        reshapedValue = defaultValue
      }

      result[key] = reshapedValue
    } else {
      logNotValidValue(key, value)
      result[key] = defaultValue
    }
  }

  return result
}
