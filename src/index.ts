import neatCsv, { Row } from 'neat-csv' // eslint-disable-line import/default

const freeAgentHeaders = [
  'claimant_name',
  'category',
  'DD/MM/YYYY',
  'currency',
  'type',
  'gross_value',
  'description',
  'receipt_reference',
  'sales_tax_rate',
  'sales_tax_value',
  'ec_status',
  'native_gross_value',
  'native_sales_tax_value',
  'project_client',
  'project_name',
  'rebill_by',
  'rebill_factor_amount',
  'stock_item_name',
  'stock_quantity',
  'asset_life',
]

const tflHeaders = ['Date', 'Daily Charge (GBP)']

const freeAgentToTfl = {
  'DD/MM/YYYY': 'Date',
  gross_value: 'Daily Charge (GBP)', // eslint-disable-line @typescript-eslint/camelcase
}

const isValid = (row: Row): boolean =>
  tflHeaders.every((tflHeader: string): string => row[tflHeader])

const inverseAmount = (str: string) => {
  if (str === '0') return str
  if (str.startsWith('-')) return str.slice(1)
  return '-' + str
}

const transform = (row: Row) => ({
  ...row,
  'Daily Charge (GBP)': inverseAmount(row['Daily Charge (GBP)']),
})

export interface Params {
  claimant_name: string
  category?: string
  currency?: string
  type?: string
  description?: string
  sales_tax_rate?: string
  project_client?: string
  project_name?: string
}

const defaultParams = {
  category: 'Travel',
  currency: 'GBP',
  type: 'Payment',
  description: 'TfL travel',
  sales_tax_rate: 'Auto', // eslint-disable-line @typescript-eslint/camelcase
}

export const convert = async (
  csvLines: string,
  rawParams: Params
): Promise<string> => {
  const params = { ...defaultParams, ...rawParams }

  const rows = await neatCsv(csvLines)
  return rows
    .filter(isValid)
    .map(transform)
    .reduce((acc, parsedRow: Row) => {
      const row = freeAgentHeaders
        .map(header => {
          if (params[header]) {
            return params[header]
          }

          const tflHeader = freeAgentToTfl[header]
          if (tflHeader) {
            return parsedRow[tflHeader]
          }

          return ''
        })
        .join(',')
      return `${acc}${row}\n`
    }, '')
}
