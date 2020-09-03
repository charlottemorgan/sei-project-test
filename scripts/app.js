const init = () => {
  
  const gameMain = document.querySelector('main')
  
  
  const cells = []
  const width = 10
  const cars = {}
  const logs = {}

  let frogPosition = 94

  const createGrid = frogPosition => {
    for (let i = 0 ; i < width * 10 ; i++){
      const cell = document.createElement('div')
      cell.innerText = i
      cell.classList.add('street')
      gameMain.appendChild(cell)
      cells.push(cell)
    }
    cells[frogPosition].classList.add('frog')
  }


  const moveFrog = (e) => {
    // const frog = document.querySelector('.frog')
    cells[frogPosition].classList.remove('frog','log-and-frog')
    const x = frogPosition % width
    const y = Math.floor(frogPosition / width)

    switch (e.keyCode) { 
      case 39: 
        if (x < width - 1) frogPosition++
        break
      case 37:
        if (x > 0) frogPosition--
        break
      case 38:
        if (y > 0) frogPosition -= width
        break
      case 40:
        if (y < width - 1) frogPosition += width
        break
      default:
        console.log('invalid key do nothing') 
    }
    // Add new frog class

    isFrogOnLog() ? cells[frogPosition].classList.add('log-and-frog') : cells[frogPosition].classList.add('frog')
    
    // Check if frog hit a car
    checkCarCollision()

    // Check if frog is on a log
  }

  const checkCarCollision = () => {
    const carLocations = Object.values(cars).map(({ location }) => location)

    if (carLocations.includes(frogPosition)) playerLost()
  }

  const playerLost = () => {
    window.alert('You died.')
  }

  const startCar = (lane, speed ) => {
    const carId = Math.random() * Math.random() * 100
    const startingPosition = [60,79,80]

    cells[startingPosition[lane]].classList.add('car')

    cars[carId] = {}

    cars[carId].location = startingPosition[lane]

    cars[carId].timer = setInterval(() => moveCar(carId, startingPosition[lane]), speed)
  }

  

  const moveCar = (carId, startingPosition) => {
    const direction = startingPosition === 79 ? 'left' : 'right'

    const currentPosition = cars[carId].location
    cells[currentPosition].classList.remove('car')

    const newPosition = currentPosition + (direction === 'right' ? 1 : -1)
    if (Math.abs(startingPosition - newPosition) === width) {
      clearInterval(cars[carId].timer)
      return delete cars[carId]
    }

    cells[newPosition].classList.add('car')
    cars[carId].location = newPosition
    if (newPosition === frogPosition) playerLost()
  }
  


  const startLogs = (lane, speed) => {
    const logId = Math.random() * Math.random() * 100
    const startingPosition = [10, 29]

    cells[startingPosition[lane]].classList.add('log')

    logs[logId] = {}

    logs[logId].locations = [startingPosition[lane]]

    logs[logId].timer = setInterval(() => moveLog(logId, startingPosition[lane]), speed)

  }
  const isFrogOnLog = () => {
    const logLocations = Object.values(logs).map(location => location.locations).reduce((acc,curr) => [...acc,...curr], []) // spread all location arrays into one
    const frogIsOnLog = logLocations.includes(frogPosition)
    console.log('frog on log ', frogIsOnLog)
    return frogIsOnLog
  }

  const moveLog = (logId, startingPosition) => {
    const direction = startingPosition === 29 ? -1 : 1

    // check how many locations the log has
    const currentPositions = logs[logId].locations
    const newestExistingPosition = currentPositions[currentPositions.length - 1]
    const nextPosition = newestExistingPosition + direction
    const nextFrogPosition = nextPosition === frogPosition ? nextPosition : frogPosition + direction // if the frog is at the front don't move him


    const endReached = Math.abs(nextPosition - startingPosition) >= width ? true : false

    console.log('currentPositions moving',currentPositions)

    const frogIsOnLog = currentPositions.includes(frogPosition)

    if (currentPositions.length === 3) {
      const indexToRemove = logs[logId].locations.shift()
      cells[indexToRemove].classList.remove('log', 'log-and-frog')
      
      currentPositions.forEach(logPositionIndex => cells[logPositionIndex].classList.remove('log-and-frog'))
    
      
      if (endReached){
        return
      } else {
        logs[logId].locations.push(nextPosition)
      
        frogIsOnLog ? cells[nextPosition].classList.add('log','log-and-frog') : cells[nextPosition].classList.add('log') // add different calss if frog is on log
        // if frog is on log
        if (frogIsOnLog){
          cells[frogPosition].classList.remove('frog')
          frogPosition = nextFrogPosition
        }
        // update frogPosition to be nextPosition
        // remove frog class from current frogposition
  
      }
    }
      
     

    if (currentPositions.length < 3) {
      //if end Reached, remove class from oldest location index using shift
      if (endReached) {
        cells[logs[logId].locations.shift()].classList.remove('log', 'log-and-frog')
      } else {
        logs[logId].locations.push(nextPosition)
        if (frogIsOnLog) frogPosition = nextFrogPosition
        frogIsOnLog ? cells[nextPosition].classList.add('log-and-frog','log') : cells[nextPosition].classList.add('log') // add different calss if frog is on log
      }
      //if no locations left then stop interval and delete log from logs
      if (currentPositions.length === 0) {
        clearInterval(logs[logId].timer)
        if (frogIsOnLog) alert('You died')

        return delete logs[logId]
      }
      // rideLog()
    }

  

    // if it has 3 then remove the class from the furthest left/right position and add on the opposite side
    
    // if it has less than 3 it is appearing or disappearing. Add one or remove one

    // cells[currentPosition].classList.remove('log')

  }

  createGrid(frogPosition)
  // // startLogs(1, 2000)
  setInterval(() => startLogs(1, 2000), 10000)
  setInterval(() => startLogs(0, 2000), 10000)
  setInterval(() => startCar(0, 1500), 7000)
  setInterval(() => startCar(1, 1200), 5000)
  setInterval(() => startCar(2, 1000), 4500)
  
  //event listeners
  window.addEventListener('keydown', moveFrog)
}

window.addEventListener('DOMContentLoaded', init)


