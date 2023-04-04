import { prisma } from '../src/server/db'
import { upsertEconData } from './seeding/bls-parser'
import stateJsonData from '~/server/temp_data/us_states_geo.json'
async function main() {
  const id = 'cl9ebqhxk00003b600tymydho'
  await prisma.example.upsert({
    where: {
      id,
    },
    create: {
      id,
    },
    update: {},
  })
}

async function insertStates() {
  try {
    const promiseArray = []
    const data = stateJsonData.features.map((feature) => {
      return {
        name: feature.properties.NAME,
        geometry: JSON.stringify(feature.geometry),
        properties: feature.properties,
      }
    })

    for (const state of data) {
      promiseArray.push(
        prisma.$executeRaw`INSERT INTO "USState" (name, properties, geometry) VALUES (${state.name}, ${state.properties}, ST_GeomFromGeoJSON(${state.geometry})) ON CONFLICT (name) DO UPDATE SET geometry = EXCLUDED.geometry;`
      )
    }

    Promise.all(promiseArray).then((data) => {
      console.log('Finished')
    })

    //return { message: 'Data inserted successfully', results: results }
  } catch (error: any) {
    console.log('error inserting data, details:', error.message)
    //return { error: 'Error inserting data', details: error.message }
  } finally {
    prisma.$disconnect()
  }
}

upsertEconData()
  .then(async () => {
    await prisma.$disconnect()
    console.log('done')
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
