var storage = {}

export const setItem = (key:string, value:any) => {
  storage[key] = value
}

export const getItem = (key:string) => {
  return storage[key] || null
} 

