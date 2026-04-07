import axios from 'axios'
const baseUrl = '/api/persons'
let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.get(baseUrl, config)
  return response.data
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

  const response = await axios.put(`${baseUrl}/${id}`, updatedPerson, config)
  return response.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default {
  getAll,
  create,
  update,
  remove,
  setToken,
}
