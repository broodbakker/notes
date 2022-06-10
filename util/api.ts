//typescript
import { INoteData } from "../typescript"

export const readAll = async () => {
  const results = await fetch("/api/getNotes").then((response) => {
    return response.json()
  })
  return results
}

export const create = (data: INoteData) => {
  return fetch("/api/createNote", {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

export const createAll = (data: INoteData[]) => {
  return fetch("/api/createNotes", {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(response => {
    return response.json()
  })
}

export const deleteAll = () => {
  return fetch("/api/deleteNotes", {
    method: 'DELETE',
  }).then(response => {
    return response.json()
  })
}


