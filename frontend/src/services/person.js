import axios from 'axios'
const baseUrl = '/api/persons'
let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  let response
  try {
    response = await axios.get(baseUrl)
    return response.data
  } catch (error) {
    console.error('Failed to fetch persons:', error)
  }
}

const create = async (newPerson) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newPerson, config)
  return response.data
}

const update = async (id, updatedPerson) => {
  const config = {
    headers: { Authorization: token },
  }

  try {
    const response = await axios.put(`${baseUrl}/${id}`, updatedPerson, config)
    return response.data
  } catch (error) {
    console.error('Failed to update person:', error)
  }
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  let response
  try {
    response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
  } catch (error) {
    console.error('Failed to delete person:', error)
  }
}

export default {
  getAll,
  create,
  update,
  remove,
  setToken,
}
