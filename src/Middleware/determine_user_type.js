export function userType (type) {
  let userType = ''
  if (type === 'admin') {
    userType = 'Admin'
  } else if (type === 'chef') {
    userType = 'Chef'
  }
  return userType
}
