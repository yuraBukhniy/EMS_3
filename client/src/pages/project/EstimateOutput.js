import React from "react";

const allPositions = {
  managers: 'Менеджерів:',
  leads: 'Керівників команди:',
  devs: 'Розробників:',
  testers: 'Тестувальників:',
  analysts: 'Аналітиків:',
  designers: 'Дизайнерів:'
};
const levels = {
  trainee: 'Trainee:',
  junior: 'Junior:',
  middle: 'Middle:',
  senior: 'Senior:'
}

const getOverallAmount = obj => {
  let sum = 0
  for(let item in obj) {
    sum += obj[item].amount
  }
  return sum
}

export default function getEstimate(estimate) {
  const positions = Object.keys(estimate); // [managers, leads, devs, testers...]
  
  return (
    <ul>
      {positions.map(pos => (
        <li key={positions.indexOf(pos)}>
          {(pos === 'devs' || pos === 'testers') && getOverallAmount(estimate[pos]) ?
            <>
              {`${allPositions[pos]} ${getOverallAmount(estimate[pos])}, в тому числі:`}
              <ul>
                {Object.keys(estimate[pos]).map(level =>
                  estimate[pos][level].amount ?
                    <li key={level}>
                      {`${levels[level]} ${estimate[pos][level].amount} (${estimate[pos][level].salary} $)`}
                    </li>
                    : null
                )}
              </ul>
            </>
            : estimate[pos].amount ?
              `${allPositions[pos]} ${estimate[pos].amount} (${estimate[pos].salary} $)`
              : null
          }
        </li>
      ))}
    </ul>
  )
}