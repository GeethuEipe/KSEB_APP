import React from 'react'

function EnergyDetails({
  energyCharge,
  showDetails,
  setShowDetails,
  slabCalculations
}) {
  const borderClass = showDetails
    ? 'border-b border-violet-500 border-opacity-30 px-4 py-2'
    : ''

  return (
    <section className="mb-10">
      <h1>Bill Details</h1>
      <h2 className="md:text-lg">
        Energy Charge (EC)*
        <span
          className="text-blue-700 ml-2 text-sm cursor-pointer"
          onMouseEnter={() => setShowDetails(true)} // Show details on hover
          onMouseLeave={() => setShowDetails(false)} // Hide details on hoverout
        >
          [View Details]
        </span>
        <span className="md:ml-44"> ₹{energyCharge.toFixed(2)}</span>
      </h2>
      {showDetails && (
        <div className="text-sm mt-2 text-blue-700 flex justify-center">
          <table className="bg-violet-200 rounded-md">
            <thead>
              <tr>
                <td colSpan="3" className="p-2">
                  EC Calculation
                </td>
              </tr>
              <tr className={borderClass}>
                <th className="">Units</th>
                <th className="">Rate</th>
                <th className="">Amt</th>
              </tr>
            </thead>
            <tbody>
              {slabCalculations.map(({ slabUnits, slabCharge }, index) => (
                <tr key={index}>
                  <td className={borderClass}>{slabUnits}</td>
                  <td className={borderClass}>
                    {(slabCharge / slabUnits).toFixed(2)}
                  </td>
                  <td className={borderClass}>{slabCharge.toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="p-2">
                  Total <span className="ml-2">{energyCharge.toFixed(2)}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default EnergyDetails
