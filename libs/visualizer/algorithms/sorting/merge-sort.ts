import type { SortingAlgorithm, AnimationStep } from '../../types'

export const mergeSort: SortingAlgorithm = function*(array) {
  yield* mergeSortHelper(array, 0, array.length - 1, [...array])
}

function* mergeSortHelper(
  mainArray: number[],
  startIdx: number,
  endIdx: number,
  auxArray: number[]
): Generator<AnimationStep, void, unknown> {
  if (startIdx === endIdx) return
  
  const middleIdx = Math.floor((startIdx + endIdx) / 2)
  yield* mergeSortHelper(auxArray, startIdx, middleIdx, mainArray)
  yield* mergeSortHelper(auxArray, middleIdx + 1, endIdx, mainArray)
  yield* doMerge(mainArray, startIdx, middleIdx, endIdx, auxArray)
}

function* doMerge(
  mainArray: number[],
  startIdx: number,
  middleIdx: number,
  endIdx: number,
  auxArray: number[]
): Generator<AnimationStep, void, unknown> {
  let k = startIdx
  let i = startIdx
  let j = middleIdx + 1
  
  while (i <= middleIdx && j <= endIdx) {
    // Compare values at i and j
    yield {
      type: 'compare',
      indices: [i, j],
      description: `Comparing ${auxArray[i]} and ${auxArray[j]}`,
      highlightLines: []
    }
    
    if (auxArray[i] <= auxArray[j]) {
      // Overwrite value at k in mainArray with value at i in auxArray
      yield {
        type: 'write',
        indices: [k],
        snapshot: [auxArray[i]],
        description: `Overwriting index ${k} with ${auxArray[i]}`,
        highlightLines: []
      }
      mainArray[k++] = auxArray[i++]
    } else {
      yield {
        type: 'write',
        indices: [k],
        snapshot: [auxArray[j]],
        description: `Overwriting index ${k} with ${auxArray[j]}`,
        highlightLines: []
      }
      mainArray[k++] = auxArray[j++]
    }
  }
  
  while (i <= middleIdx) {
    yield {
      type: 'write',
      indices: [k],
      snapshot: [auxArray[i]],
      description: `Overwriting index ${k} with remaining value ${auxArray[i]}`,
      highlightLines: []
    }
    mainArray[k++] = auxArray[i++]
  }
  
  while (j <= endIdx) {
    yield {
      type: 'write',
      indices: [k],
      snapshot: [auxArray[j]],
      description: `Overwriting index ${k} with remaining value ${auxArray[j]}`,
      highlightLines: []
    }
    mainArray[k++] = auxArray[j++]
  }
}
