import * as fs from 'fs'
import { z } from 'zod'
import * as path from 'path'
import csv from 'csv-parser'
import { prisma } from '../../src/server/db'

const USEconDataSchema = z.object({
  year: z.number(),
  name: z.string(),
  fibs: z.string(),
  year_name: z.string(),
  real_gdp: z.number().nullable(), // millions of chained 2012 dollars
  real_personal: z.number().nullable(), // millions of constant 2012 dollars
  real_pce: z.number().nullable(), // millions of 2012 dollars
  current_gdp: z.number().nullable(), // millions of dollars
  personal_income: z.number().nullable(), // millions of dollars
  disposable_income: z.number().nullable(), // millions of dollars
  personal_consumption: z.number().nullable(), // millions of dollars
  real_per_capita_personal_income: z.number().nullable(), // constant 2012 dollars
  real_per_capita_pce: z.number().nullable(), // constant 2012 dollars
  current_per_capita_personal_income: z.number().nullable(), // current dollars
  current_per_capita_disposable_income: z.number().nullable(), // current dollars
  rpp: z.number().nullable(), // current dollars
  implicit_regional_price_deflator: z.number().nullable(),
  employment: z.number().nullable(), // number of jobs
})

type USEconData = z.infer<typeof USEconDataSchema>

const createStateData = (
  year: number,
  geo_name: string,
  geo_fips: string
): USEconData => ({
  year,
  fibs: geo_fips,
  name: geo_name,
  year_name: `${year}-${geo_name}`,
  real_gdp: null,
  real_personal: null,
  real_pce: null,
  current_gdp: null,
  personal_income: null,
  disposable_income: null,
  personal_consumption: null,
  real_per_capita_personal_income: null,
  real_per_capita_pce: null,
  current_per_capita_personal_income: null,
  current_per_capita_disposable_income: null,
  rpp: null,
  implicit_regional_price_deflator: null,
  employment: null,
})

export const upsertEconData = async () => {
  const filepath = path.join(__dirname, 'us-econ.csv')
  const rows = await parseCSV(filepath)
  const promiseArray = []
  for (const row of rows) {
    if (row.name !== 'United States') {
      promiseArray.push(
        prisma.uSEcon.upsert({
          where: {
            year_name: row.year_name,
          },
          create: {
            ...row,
            state: {
              connect: {
                name: row.name,
              },
            },
          },
          update: {
            ...row,
            state: {
              connect: {
                name: row.name,
              },
            },
          },
        })
      )
    }
  }
  Promise.all(promiseArray).then((result) => {
    console.log('finished')
  })
}

const processRow = (
  row: any,
  stateDataList: Partial<USEconData>[],
  stateDataMap: Map<string, Partial<USEconData>[]>
) => {
  const code = parseInt(row['LineCode'])
  const geo_name = row['GeoName']
  const geo_fips = row['GeoFips']
  const values = Object.values(row)
  console.log(row)
  for (let year = 1998; year <= 2022; year++) {
    const value = parseFloat(row[year])
    if (isNaN(value)) continue

    let stateData = stateDataList.find((data) => data.year === year)

    if (!stateData) {
      stateData = createStateData(year, geo_name, geo_fips)
      stateDataList.push(stateData)
    }
    if (stateData) {
      switch (code) {
        case 1:
          stateData.real_gdp = value
          break
        case 2:
          stateData.real_personal = value
          break
        case 3:
          stateData.real_pce = value
          break
        case 4:
          stateData.current_gdp = value
          break
        case 5:
          stateData.personal_income = value
          break
        case 6:
          stateData.disposable_income = value
          break
        case 7:
          stateData.personal_consumption = value
          break
        case 8:
          stateData.real_per_capita_personal_income = value
          break
        case 9:
          stateData.real_per_capita_pce = value
          break
        case 10:
          stateData.current_per_capita_personal_income = value
          break
        case 11:
          stateData.current_per_capita_disposable_income = value
          break
        case 13:
          stateData.rpp = value
          break
        case 14:
          stateData.implicit_regional_price_deflator = value
          break
        case 15:
          stateData.employment = value
          break
      }
    }
    const stateAbbreviation = row['GeoFips']
    stateDataMap.set(stateAbbreviation, stateDataList)
  }
}

const parseCSV = async (filePath: string): Promise<USEconData[]> => {
  const data: USEconData[] = []
  const stateDataMap: Map<string, Partial<USEconData>[]> = new Map()
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv({ separator: ',' }))
      .on('data', (row: any) => {
        const stateCode = row['GeoFips']
        const stateName = row['GeoName']
        const lineCode = row['LineCode']

        if (!lineCode || !stateCode || !stateName) return // Skip the row if LineCode is empty

        if (!stateDataMap.has(stateCode)) {
          stateDataMap.set(stateCode, [])
        }
        const stateDataList = stateDataMap.get(stateCode)
        if (stateDataList) {
          processRow(row, stateDataList, stateDataMap)
        }
      })
      .on('end', () => {
        stateDataMap.forEach((stateDataList, stateCode) => {
          stateDataList.forEach((stateYearData) => {
            const validatedYearData = USEconDataSchema.safeParse(stateYearData)
            if (validatedYearData.success) {
              data.push(validatedYearData.data)
            } else {
              console.log('Error parsing row: ', validatedYearData.error)
            }
          })
        })
        resolve(data)
      })
      .on('error', (error: any) => {
        reject(error)
      })
  })
}
