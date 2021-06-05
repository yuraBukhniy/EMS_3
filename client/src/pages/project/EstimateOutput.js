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
  senior: 'Senior:',
  lead: 'Lead:'
}

const getOverallAmount = obj => {
  let sum = 0
  for(let item in obj) {
    sum += obj[item].amount
  }
  return sum
}
const getDevTestSalary = obj => {
  let sum = 0
  for(let item in obj) {
    sum += (obj[item].salary || 0) * (obj[item].amount || 0)
  }
  return sum
}

function getAmount(estimate) {
  let sum = 0;
  if(estimate) {
    for(let item in estimate) {
      if(item === 'devs' || item === 'testers') {
        sum += getOverallAmount(estimate[item])
      }
      else sum += estimate[item].amount;
    }
  }
  return sum
}

function getSalary(estimate) {
  let sum = 0;
  if(estimate) {
    for(let item in estimate) {
      if(item === 'devs' || item === 'testers') {
        //console.log(estimate[item])
        sum += getDevTestSalary(estimate[item])
      }
      else sum += (estimate[item].salary || 0) * estimate[item].amount;
      //console.log(estimate[item].salary, estimate[item].amount)
    }
  }
  return sum
}

function getEstimate(estimate) {
  const positions = Object.keys(estimate); // [managers, leads, devs, testers...]
  
  return (
    <ul>
      {positions.map(pos => (
        (pos === 'devs' || pos === 'testers') && getOverallAmount(estimate[pos]) ?
          <li key={positions.indexOf(pos)}>
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
          </li>
        : estimate[pos].amount ?
          <li>{`${allPositions[pos]} ${estimate[pos].amount} (${estimate[pos].salary} $)`}</li>
        : null
      ))}
    </ul>
  )
}

export {getAmount, getSalary, getEstimate}