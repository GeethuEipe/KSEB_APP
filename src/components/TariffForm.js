import React, { useEffect, useState } from 'react'

import EnergyDetails from './EnergyDetails'
import { useForm } from 'react-hook-form'

const TariffForm = () => {
  const { register, handleSubmit, watch } = useForm()
  const [tariffData, setTariffData] = useState(null)
  const [energyCharge, setEnergyCharge] = useState(null)
  const [showDetails, setShowDetails] = useState(false)
  const [slabCalculations, setSlabCalculations] = useState(null)

  useEffect(() => {
    // Fetch tariff data from JSON file
    fetch('/tariff.json')
      .then(response => response.json())
      .then(data => setTariffData(data))
      .catch(error => console.error('Error fetching tariff data:', error))
  }, [])

  const calculateEnergyCharge = (units, rates) => {
    let charge = 0
    let remainingUnits = units
    let previousSlabLimit = 0
    const slabCalculations = [] // Define slabCalculations array
    // Iterate through telescopic slabs
    for (const slab of rates.telescopic) {
      const slabUnits = slab.upTo - previousSlabLimit
      const slabCharge =
        remainingUnits > slabUnits
          ? slabUnits * slab.charge
          : remainingUnits * slab.charge
      // Push calculation details to slabCalculations array
      slabCalculations.push({
        slabUnits: slabUnits,
        slabCharge: slabCharge
      })

      if (remainingUnits > slabUnits) {
        charge += slabCharge
        remainingUnits -= slabUnits
      } else {
        charge += slabCharge
        remainingUnits = 0
        break
      }
      previousSlabLimit = slab.upTo
    }
    // Calculate remaining units (if any) with the non-telescopic rate
    if (remainingUnits > 0) {
      const nonTelescopicCharge = remainingUnits * rates.nonTelescopic
      slabCalculations.push({
        slabUnits: remainingUnits,
        slabCharge: nonTelescopicCharge
      })
      charge += nonTelescopicCharge
    }
    // Set slabCalculations state
    setSlabCalculations(slabCalculations)
    // Return energy charge
    return charge
  }
  const onSubmit = data => {
    const consumedUnits = parseInt(data.consumedUnits, 10)
    const rates = tariffData['LT-1A']['Domestic']
    const calculatedEnergyCharge = calculateEnergyCharge(consumedUnits, rates)
    setEnergyCharge(calculatedEnergyCharge)
  }

  if (!tariffData) {
    return <div>Loading...</div>
  }

  return (
    <section className="bill-calculator">
      <div className="content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h1>Electricity Bill Calculator</h1>
          <p className="ml-24 my-3">Generic</p>
          <div>
            <label>
              Tariff
              <select {...register('tariff')}>
                <option value="1">LT-1A</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Purpose
              <select {...register('purpose')}>
                <option value="15">Domestic</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Billing Cycle
              <div className="font-normal">
                <input
                  type="radio"
                  value="2"
                  defaultChecked
                  {...register('billingCycle')}
                  required
                />
                <span className="ml-2">2 months</span>
              </div>
            </label>
          </div>
          <div>
            <label>
              Consumed Units
              <input
                className=""
                type="number"
                {...register('consumedUnits')}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Phase
              <div className="md:pl-10 font-normal">
                <input
                  type="radio"
                  value="1"
                  defaultChecked
                  {...register('phase')}
                  required
                />
                <span className="ml-2">Single phase</span>
              </div>
            </label>
          </div>
          <button className="border-2" type="submit">
            Submit
          </button>
        </form>

        {energyCharge !== null && (
          <div className="bill-details">
            <EnergyDetails
              energyCharge={energyCharge}
              showDetails={showDetails}
              setShowDetails={setShowDetails}
              slabCalculations={slabCalculations}
            />
          </div>
        )}
      </div>
    </section>
  )
}

export default TariffForm
