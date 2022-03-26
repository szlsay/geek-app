const initValue = {
  token: '',
  refresh_token: '',
}
export default function reducer(state = initValue, action) {
  const { type, payload } = action
  if (type === 'login/token') {
    return payload
  }
  if (type === 'login/logout') {
    return {}
  }
  return state
}
