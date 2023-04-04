import * as fs from 'fs'
import { z } from 'zod'
import * as path from 'path'
import csv from 'csv-parser'
import { prisma } from '../../src/server/db'

const USEconDataSchema = z.object({
  year: z.number(),
  geo_name: z.string(),
  geo_fips: z.number(),
  real_gdp: z.number().nullable(),
  real_personal: z.number().nullable(),
  real_pce: z.number().nullable(),
  current_gdp: z.number().nullable(),
  personal_income: z.number().nullable(),
  disposable_income: z.number().nullable(),
  personal_consumption: z.number().nullable(),
  real_per_capita_personal_income: z.number().nullable(),
  real_per_capita_pce: z.number().nullable(),
  current_per_capita_personal_income: z.number().nullable(),
  current_per_capita_disposable_income: z.number().nullable(),
  rpp: z.number().nullable(),
  implicit_regional_price_deflator: z.number().nullable(),
  employment: z.number().nullable(),
  uSStateId: z.number().nullable(),
})

type USEconData = z.infer<typeof USEconDataSchema>

export const upsertEconData = async () => {
  const filepath = path.join(__dirname, 'us-econ.csv')
  const rows = await parseCSV(filepath)
  console.log(rows)
  const promiseArray = []
  //   for (const row of rows) {
  //     promiseArray.push(prisma.uSEcon.upsert({
  //         where: {
  //             name: row.
  //         }

  //     }))
  //   }
}

const processRow = (row: any, stateDataList: Partial<USEconData>[]) => {
  const code = parseInt(row[2])

  for (let i = 4; i < row.length; i++) {
    const year = 1997 + (i - 4)
    const value = parseFloat(row[i])

    if (isNaN(value)) continue

    let stateData = stateDataList.find((data) => data.year === year)

    if (!stateData) {
      stateData = { year }
      stateDataList.push(stateData)
    }
    console.log(stateData)
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
        if (!stateDataMap.has(stateCode)) {
          stateDataMap.set(stateCode, [])
        }
        const stateDataList = stateDataMap.get(stateCode)
        cons
        if (stateDataList) {
          processRow(row, stateDataList)
        }
      })
      .on('end', () => {
        stateDataMap.forEach((stateDataList, stateCode) => {
          stateDataList.forEach((stateData) => {
            const validatedRow = USEconDataSchema.safeParse({
              ...stateData,
              state: stateCode,
            })
            if (validatedRow.success) {
              data.push(validatedRow.data)
            } else {
              console.log('Error parsing row: ', validatedRow.error)
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
