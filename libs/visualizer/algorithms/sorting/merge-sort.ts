import type { SortingAlgorithm, AnimationStep } from '../../types'

export const mergeSort: SortingAlgorithm = function* (array) {
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
      highlightLines: [14, 15] // while loop in merge
    }

    if (auxArray[i] <= auxArray[j]) {
      yield {
        type: 'write',
        indices: [k],
        snapshot: [auxArray[i]],
        description: `Overwriting index ${k} with ${auxArray[i]}`,
        highlightLines: [16, 17] // left element is smaller
      }
      mainArray[k++] = auxArray[i++]
    } else {
      yield {
        type: 'write',
        indices: [k],
        snapshot: [auxArray[j]],
        description: `Overwriting index ${k} with ${auxArray[j]}`,
        highlightLines: [19] // right element is smaller
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
      highlightLines: [23] // remaining left
    }
    mainArray[k++] = auxArray[i++]
  }

  while (j <= endIdx) {
    yield {
      type: 'write',
      indices: [k],
      snapshot: [auxArray[j]],
      description: `Overwriting index ${k} with remaining value ${auxArray[j]}`,
      highlightLines: [23] // remaining right
    }
    mainArray[k++] = auxArray[j++]
  }
}
